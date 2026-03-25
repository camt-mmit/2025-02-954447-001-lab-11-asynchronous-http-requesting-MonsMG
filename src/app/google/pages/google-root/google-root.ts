import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OauthClient } from '../../servies/oauth.client';

/**
 * Component หลัก (Wrapper) สำหรับใช้ครอบหน้าจอส่วนอื่นๆ ใน Module ของ Google ทั้งหมด
 */
@Component({
  selector: 'app-google-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './google-root.html',
  styleUrl: './google-root.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleRoot {
  private readonly oauthClient = inject(OauthClient);

  /** Resource ของ Access Token (ใช้ตรวจสถานะการล็อกอิน) */
  protected readonly accessTokenResource = this.oauthClient.accessTokenDataResource();

  /** Resource ของ ID Token Claims (ข้อมูลโปรไฟล์ผู้ใช้ เช่น ชื่อ, รูป) */
  protected readonly idTokenClaimsResource = this.oauthClient.idTokenClaimsResource();

  /** เปิดหน้า Google OAuth สำหรับล็อกอิน */
  protected async login(): Promise<void> {
    const url = await this.oauthClient.getAuthorizationCodeUrl(
      [
        'openid',
        'profile',
        'email',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/contacts',
      ],
      {
        prompt: 'consent',
        access_type: 'offline',
      },
    );
    location.href = `${url}`;
  }

  /** ล้าง Token ทั้งหมดเพื่อล็อกเอาท์ */
  protected async logout(): Promise<void> {
    await this.oauthClient.clearTokens();
  }
}
