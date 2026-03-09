import { InjectionToken } from '@angular/core';

export interface OauthClientConfiguration {
  /** ชื่อของ Client เพื่อใช้เป็น Prefix หรือระบุตัวตน (เช่น 'google') */
  readonly name: string;
  /** ไอดี Client ที่ได้มาจากผู้ให้บริการ OAuth (Google Cloud Console) */
  readonly id: string;
  /** รหัสลับ (Client Secret) มักไม่จำเป็นต้องใส่ในแอปหน้าบ้าน (Optional) */
  readonly secret?: string; // It's Optional.
  /** URL สำหรับนำ Authorization Code ไปแลกเป็น Access Token API */
  readonly tokenUrl: string;
  /** URL หน้าเว็บที่ผู้ใช้จะต้องไปกดยืนยันสิทธิ์ */
  readonly authorizationUrl: string;
  /** URL ที่ผูกไว้สำหรับเด้งกลับหลังจากผู้ใช้อนุญาต (ต้องตรงกับที่ตั้งค่าบน Console) */
  readonly redirectUrl: string;
  /** ความยาวของ Code Verifier ในกระบวนการ PKCE (ค่าปริยายคือ 64) Optional */
  readonly codeVerifierLength?: number; // default is 64 and It's Optional.
}

export const OAUTH_CLIENT_CONFIGURATION = new InjectionToken<OauthClientConfiguration>(
  'oauth-configuration',
);

export interface AccessTokenData {
  /** ข้อมูล Access Token (นำไปแนบ Header เมื่อ Call API) */
  readonly accessToken: string;
  /** เวลาที่ Token นี้จะหมดอายุ (หน่วยเป็นวินาที) */
  readonly expiresIn: number;
  /** ชนิดของ Token (มักเป็น 'Bearer') */
  readonly tokenType: string;
  /** สิทธิ์การเข้าถึงที่ได้รับมา (Scopes) คั่นด้วยช่องว่าง */
  readonly scope: string;
}

export interface AuthorizationHeaders {
  readonly Authorization: string;
}

export interface IdTokenClaims {
  // Standard OIDC Claims (ช้อมูลมาตรฐานของ OpenID Connect)
  /** (Issuer Identifier) ระบบที่ออก Token ให้ เช่น Google */
  readonly iss: string;
  /** (Subject Identifier) ID ผู้ใช้งาน (Unique userID) */
  readonly sub: string;
  /** (Audience) กลุ่มเป้าหมายที่ใช้ Token ตัวนี้ */
  readonly aud: string | readonly string[];
  /** (Expiration Time) เวลาที่ Token หมดอายุ เป็นแบบ Unix timestamp */
  readonly exp: number;
  /** (Issued At) เวลาเริ่มต้นที่ Token ถูกสร้างมา */
  readonly iat: number;
  /** (Authentication Time) เวลาที่ทำการยืนยันตัวตนสำเร็จ */
  readonly auth_time?: number;

  // Profile Claims (ข้อมูลส่วนตัวผู้ใช้)
  /** อีเมลของผู้ใช้ */
  readonly email?: string;
  /** สถานะการยืนยันอีเมลแล้วหรือยัง */
  readonly email_verified?: boolean;
  /** ชื่อเต็มของผู้ใช้ */
  readonly name?: string;
  /** ชื่อจริงของผู้ใช้ */
  readonly given_name?: string;
  /** นามสกุลของผู้ใช้ */
  readonly family_name?: string;
  /** ที่อยู่รููปภาพโปรไฟล์ผู้ใช้ */
  readonly picture?: string;
}
