import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { OauthClient } from '../../servies/oauth.client';

/**
 * หน้าจอรับ Redirect กลับมาจาก Google OAuth
 * จะอ่านค่า state, code, error จาก Query Parameter
 * แล้วนำ Authorization Code ไปแลกเป็น Access Token
 */
@Component({
  selector: 'app-authorization-page',
  imports: [],
  templateUrl: './authorization-page.html',
  styleUrl: './authorization-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationPage implements OnInit {
  /** ค่า state ที่ Google ส่งกลับมา (ใช้ตรวจสอบ CSRF) */
  readonly state = input<string>();
  /** Authorization Code ที่ได้รับจาก Google */
  readonly code = input<string>();
  /** ข้อผิดพลาดที่ Google ส่งกลับมา (ถ้ามี) */
  readonly error = input<string>();
  /** รายละเอียดข้อผิดพลาด (ถ้ามี) */
  readonly error_description = input<string>();

  /** ข้อความ Error ที่จะแสดงบนหน้าจอ */
  protected errorMessage = signal<string | null>(null);

  private readonly oauthClient = inject(OauthClient);

  async ngOnInit(): Promise<void> {
    if (typeof this.error() !== 'undefined') {
      this.errorMessage.set(
        `${this.error()!}${this.error_description() ? `: ${this.error_description()!}` : ''}`,
      );
      return;
    }

    const stateCode = this.state();
    const code = this.code();

    if (stateCode && code) {
      try {
        await this.oauthClient.exchangeAuthorizationCode(this.state()!, this.code()!);
      } catch (error) {
        console.error(error);
        this.errorMessage.set(`${error}`);
      }
    } else {
      this.errorMessage.set(`invalid_response: no state or code in query parameters`);
    }
  }
}
