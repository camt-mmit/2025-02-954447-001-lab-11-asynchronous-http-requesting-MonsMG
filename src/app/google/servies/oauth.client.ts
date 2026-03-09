import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  APP_ID,
  Injectable,
  Resource,
  computed,
  inject,
  resource,
  signal,
  untracked,
} from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { arrayBufferToBase64, extractJwtClaims, randomString, sha256 } from '../helpers';
import {
  AccessTokenData,
  AuthorizationHeaders,
  IdTokenClaims,
  OAUTH_CLIENT_CONFIGURATION,
} from '../types/services';

export interface OauthErrorDetails {
  readonly error: string;
  readonly error_description: string;
}

export interface OauthErrorCause {
  readonly details: OauthErrorDetails;
  readonly source?: unknown;
}

export class OauthError extends Error {
  override readonly cause!: OauthErrorCause;

  constructor(details: OauthErrorDetails, source?: Error) {
    super(details.error_description, {
      cause: {
        details,
        ...(source ? { source } : {}),
      } satisfies OauthErrorCause,
    });

    this.name = details.error;

    if ('captureStackTrace' in Error) {
      (Error.captureStackTrace as (...args: unknown[]) => unknown)(this, this.constructor);
    }
  }
}

export class StateNotFoundError extends OauthError {
  constructor(stateCode: string) {
    super({
      error: 'state_not_found',
      error_description: `state '${stateCode}' not found`,
    });
  }
}

export class AccessTokenNotFoundError extends OauthError {
  constructor(message?: string) {
    super({
      error: 'access_token_not_found',
      error_description: message ?? 'access token not found',
    });
  }
}

export class IdTokenNotFoundError extends OauthError {
  constructor(message?: string) {
    super({
      error: 'id_token_not_found',
      error_description: message ?? 'ID token not found',
    });
  }
}

const keyPrefix = 'oauth';

const defaultCodeVerifierLength = 64;
const stateCodeLength = 32;
const stateTtl = 10 * 60 * 1_000;
const networkLatency = 10 * 1_000;

interface AccessTokenResponse {
  readonly access_token: string;
  readonly expires_in: number;
  readonly token_type: string;
  readonly scope: string;
  readonly refresh_token?: string;
  readonly id_token?: string;
}

interface StoredState {
  readonly expiresAt: number;
  readonly data: {
    readonly codeVerifier: string;
    readonly intendedUrl: string;
  };
}

interface StoredAccessTokenData {
  readonly expiresAt: number;
  readonly data: AccessTokenData;
}

@Injectable({
  providedIn: 'root',
})
export class OauthClient {
  private readonly config = inject(OAUTH_CLIENT_CONFIGURATION);

  private readonly http = inject(HttpClient);

  private readonly keyPrefix =
    `${inject(APP_ID)}-${keyPrefix}-${this.config.name}-${this.config.id}` as const;

  // -------------- START: Storage --------------
  // State Storage
  private readonly stateKeyPrefix = `${this.keyPrefix}-state` as const;

  private stateKeyName<const C extends string>(code: C) {
    return `${this.stateKeyPrefix}-${code}` as const;
  }

  private setState(code: string, data: StoredState['data']): void {
    localStorage.setItem(
      this.stateKeyName(code),
      JSON.stringify({
        expiresAt: new Date().getTime() + stateTtl,
        data,
      } satisfies StoredState),
    );
  }

  private getState(code: string): StoredState['data'] | null {
    const now = new Date().getTime();

    const removedKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null && key.startsWith(this.stateKeyName(''))) {
        const storedData: StoredState | null = JSON.parse(localStorage.getItem(key) ?? 'null');
        if (storedData !== null && storedData.expiresAt < now) {
          removedKeys.push(key);
        }
      }
    }

    removedKeys.forEach((key) => localStorage.removeItem(key));

    console.debug('state', this.stateKeyName(code), localStorage.getItem(this.stateKeyName(code)));

    return (
      (JSON.parse(localStorage.getItem(this.stateKeyName(code)) ?? 'null') as StoredState | null)
        ?.data ?? null
    );
  }

  private removeState(code: string): void {
    localStorage.removeItem(this.stateKeyName(code));
  }

  // AccessToken Storage
  private readonly accessTokenKeyName = `${this.keyPrefix}-access_token` as const;

  private setAccessTokenData(data: AccessTokenData): void {
    localStorage.setItem(
      this.accessTokenKeyName,
      JSON.stringify({
        expiresAt: new Date().getTime() + data.expiresIn * 1_000 - networkLatency,
        data,
      }),
    );
  }

  private getAccessTokenData(): AccessTokenData | null {
    const now = new Date().getTime();

    const storedAccessTokenData: StoredAccessTokenData | null = JSON.parse(
      localStorage.getItem(this.accessTokenKeyName) ?? 'null',
    );

    if (storedAccessTokenData === null) {
      return null;
    }

    if (storedAccessTokenData.expiresAt < now) {
      localStorage.removeItem(this.accessTokenKeyName);

      return null;
    }

    return storedAccessTokenData.data;
  }

  private removeAccessToken(): void {
    localStorage.removeItem(this.accessTokenKeyName);
  }

  // RefreshToken Storage
  private readonly refreshTokenKeyName = `${this.keyPrefix}-refresh_token` as const;

  private setRefreshToken(data: string): void {
    localStorage.setItem(this.refreshTokenKeyName, data);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKeyName);
  }

  private removeRefreshToken(): void {
    localStorage.removeItem(this.refreshTokenKeyName);
  }

  // IdToken Storage
  private readonly idTokenKeyName = `${this.keyPrefix}-id_token` as const;
  private readonly idTokenClaimsKeyName = `${this.keyPrefix}-id_token-claims` as const;

  private setIdToken(data: string): void {
    localStorage.setItem(this.idTokenKeyName, data);

    const claims: IdTokenClaims = {
      ...JSON.parse(localStorage.getItem(this.idTokenClaimsKeyName) ?? '{}'),
      ...extractJwtClaims<IdTokenClaims>(data),
    };
    localStorage.setItem(this.idTokenClaimsKeyName, JSON.stringify(claims));
  }

  private getIdToken(): string | null {
    return localStorage.getItem(this.idTokenKeyName);
  }

  private getIdTokenClaims(): IdTokenClaims | null {
    return JSON.parse(localStorage.getItem(this.idTokenClaimsKeyName) ?? 'null');
  }

  private removeIdToken(): void {
    localStorage.removeItem(this.idTokenKeyName);
    localStorage.removeItem(this.idTokenClaimsKeyName);
  }

  // -------------- END: Storage --------------

  private readonly router = inject(Router);

  /**
   * สร้าง URL ของหน้า Login/Consent (หน้าขอยืนยันสิทธิ์จากผู้ใช้)
   * ซึ่งจะมีการตั้งค่า PKCE (Proof Key for Code Exchange) สำหรับความปลอดภัยเพิ่มด้วย
   */
  async getAuthorizationCodeUrl(
    scopes: readonly string[],
    params: Readonly<Record<string, string>> = {},
  ): Promise<URL> {
    const url = new URL(this.config.authorizationUrl);

    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    url.searchParams.set('client_id', this.config.id);
    url.searchParams.set('redirect_uri', this.config.redirectUrl);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', scopes.join(' '));

    const codeVerifier = randomString(this.config.codeVerifierLength ?? defaultCodeVerifierLength);

    url.searchParams.set('code_challenge', arrayBufferToBase64(await sha256(codeVerifier), true));
    url.searchParams.set('code_challenge_method', 'S256');

    const stateCode = randomString(stateCodeLength);
    this.setState(stateCode, {
      codeVerifier,
      intendedUrl: this.router.url,
    });

    url.searchParams.set('state', stateCode);

    return url;
  }

  /**
   * ส่งฟอร์มข้อมูล (formData) เพื่อแลกรับ Token (Access/Refresh/ID Token) จาก API
   */
  async requestToken(formData: FormData): Promise<AccessTokenData> {
    const accessTokenResponse = await firstValueFrom(
      this.http.post<AccessTokenResponse>(this.config.tokenUrl, formData).pipe(
        catchError((error) => {
          const details: OauthErrorDetails =
            typeof error === 'undefined' || error === null || typeof error !== 'object'
              ? {
                  error: 'unknown',
                  error_description: `${error}`,
                }
              : error instanceof Error || error instanceof HttpErrorResponse
                ? ((errorResponse: Partial<OauthErrorDetails>) => ({
                    error: errorResponse?.error ?? error.name,
                    error_description: errorResponse?.error_description ?? error.message,
                  }))((error as Partial<HttpErrorResponse>).error)
                : ((error: Partial<OauthErrorDetails>) => ({
                    error: error.error ?? 'unknown',
                    error_description: error.error_description ?? JSON.stringify(error),
                  }))(error);

          return throwError(() => new OauthError(details, error));
        }),
      ),
    );

    const accessTokenData: AccessTokenData = {
      accessToken: accessTokenResponse.access_token,
      tokenType: accessTokenResponse.token_type,
      expiresIn: accessTokenResponse.expires_in,
      scope: accessTokenResponse.scope,
    };

    this.setAccessTokenData(accessTokenData);

    if (accessTokenResponse.refresh_token) {
      this.setRefreshToken(accessTokenResponse.refresh_token);
    }

    if (accessTokenResponse.id_token) {
      this.setIdToken(accessTokenResponse.id_token);
    }

    return accessTokenData;
  }

  /**
   * นำ Authorization Code ที่ได้จาก Google หลังจาก Login สำเร็จ
   * มาแลกเปลี่ยน (Exchange) เป็น Access Token
   */
  async exchangeAuthorizationCode(stateCode: string, code: string): Promise<void> {
    const state = this.getState(stateCode);

    if (state === null) {
      throw new StateNotFoundError(stateCode);
    }

    this.removeState(stateCode);

    const formData = new FormData();

    formData.set('client_id', this.config.id);
    if (this.config.secret) {
      formData.set('client_secret', this.config.secret);
    }
    formData.set('code', code);
    formData.set('code_verifier', state.codeVerifier);
    formData.set('grant_type', 'authorization_code');
    formData.set('redirect_uri', this.config.redirectUrl);

    await this.requestToken(formData);

    this.router.navigateByUrl(state.intendedUrl, { replaceUrl: true });
  }

  readonly #accessToken = signal<AccessTokenData | null>(null, {
    equal: (oldValue, newValue) => oldValue?.accessToken === newValue?.accessToken,
  });

  private updateAccessToken(data: AccessTokenData | null): AccessTokenData | null {
    return untracked(() => {
      this.#accessToken.set(data);

      return this.#accessToken();
    });
  }

  private readonly accessTokenLockName = `${this.keyPrefix}-lock-access_token` as const;

  /**
   * ดึง Access Token ที่แคช (Cache) ไว้ใน Local Storage กลับมาใช้
   * ถ้าหมดอายุ จะพยายามใช้ Refresh Token ขออันใหม่ให้โดยอัตโนมัติ
   */
  async getAccessToken(): Promise<AccessTokenData | null> {
    return await navigator.locks.request(this.accessTokenLockName, async () => {
      const accessTokenData = this.getAccessTokenData();

      if (accessTokenData !== null) {
        return this.updateAccessToken(accessTokenData);
      }

      const refreshToken = this.getRefreshToken();

      if (refreshToken !== null) {
        const formData = new FormData();

        formData.set('client_id', this.config.id);
        if (this.config.secret) {
          formData.set('client_secret', this.config.secret);
        }
        formData.set('grant_type', 'refresh_token');
        formData.set('refresh_token', refreshToken);

        try {
          return this.updateAccessToken(await this.requestToken(formData));
        } catch (error) {
          console.error(error);
        }
      }

      return this.updateAccessToken(null);
    });
  }

  /**
   * สร้างค่า Header เพื่อเอาไว้แนบในการเรียกใช้ API ต่างๆ ของ Google (เป็น Token Type + Access Token)
   */
  async getAuthorizationHeaders(): Promise<AuthorizationHeaders> {
    const accessTokenData = await this.getAccessToken();

    if (accessTokenData === null) {
      throw new AccessTokenNotFoundError();
    }

    return {
      Authorization: `${accessTokenData.tokenType} ${accessTokenData.accessToken}`,
    };
  }

  /**
   * ล้างข้อมูล Token ทิ้งเปรียบเสมือนการ Logout ออกจากระบบ
   */
  async clearTokens(): Promise<void> {
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeIdToken();

    await this.getAccessToken();
  }

  accessTokenDataResource(): Resource<AccessTokenData | undefined> {
    return resource({
      stream: async () => {
        await this.getAccessToken();

        return computed(() => {
          const accessTokenData = this.#accessToken();

          if (accessTokenData !== null) {
            return { value: accessTokenData };
          } else {
            return { error: new AccessTokenNotFoundError() };
          }
        });
      },
    }).asReadonly();
  }

  idTokenClaimsResource(): Resource<IdTokenClaims | undefined> {
    const idTokenSignal = computed(() => {
      this.#accessToken();
      return this.getIdToken();
    });

    return resource({
      stream: async () => {
        await this.getAccessToken();

        return computed(() => {
          idTokenSignal();

          const claims = this.getIdTokenClaims();

          if (claims !== null) {
            return { value: claims };
          } else {
            return { error: new IdTokenNotFoundError() };
          }
        });
      },
    }).asReadonly();
  }
}
