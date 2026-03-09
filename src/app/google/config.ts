import { isDevMode } from '@angular/core';
import { OauthClientConfiguration } from './types/services';

export const googleOauthConfig: OauthClientConfiguration = {
  /** ชื่ออ้างอิงของ Provider นี้ */
  name: 'google',
  /** Client ID ที่ได้จาก Google Cloud Console */
  id: '',
  /** Client Secret (ไม่จำเป็นต้องใช้ในแอพหน้าบ้านด้วย PKCE แต่ใส่ไว้ให้ครบ) */
  secret: '',
  /** URL สำหรับนำ Authorization Code หรือ Refresh Token ไปแลก Access Token */
  tokenUrl: 'https://oauth2.googleapis.com/token',
  /** URL หน้าเว็บที่ผู้ใช้จะต้องล็อกอินเพื่อให้สิทธิ์ */
  authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  /** ทางกลับหลังจากผู้ใช้ล็อกอิน (ปรับตามสภาพแวดล้อมว่ารันบน Dev หรือ Prod) */
  redirectUrl: isDevMode()
    ? 'http://localhost:4200/google/authorization'
    : 'https://camt-mmit.github.io/2025-02-954447-001-lab-11-asynchronous-http-requesting-mrpachara/google/authorization',
};
