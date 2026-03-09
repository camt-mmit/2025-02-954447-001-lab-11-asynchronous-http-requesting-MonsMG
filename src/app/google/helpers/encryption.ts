/**
 * แปลง ArrayBuffer เป็น Base64 String
 * @param buffer ArrayBuffer ที่ต้องการแปลง
 * @param safeUrl ถ้าเป็น true จะเข้ารหัสแบบ URL-safe (แทนที่ + ด้วย - และ / ด้วย _)
 */
export function arrayBufferToBase64(buffer: ArrayBuffer, safeUrl = false): string {
  const bytes = new Uint8Array(buffer);
  const binary = bytes.reduce((binary, byte) => `${binary}${String.fromCharCode(byte)}`, '');
  const base64 = btoa(binary);

  return safeUrl ? safeURLencode(base64) : base64;
}

/**
 * เข้ารหัสข้อความ Base64 ให้เป็น URL-safe (นำไปแปะใน URL ได้โดยไม่พัง)
 */
export function safeURLencode(str: string): string {
  return str.replaceAll(/\+/g, '-').replaceAll(/\//g, '_').replace(/=/g, '');
}

/**
 * ถอดรหัสข้อความ URL-safe กลับไปเป็น Base64 ปกติ
 */
export function safeURLdecode(str: string): string {
  return str.replaceAll(/_/g, '/').replaceAll(/-/g, '+');
}

/**
 * สุ่มสตริงขึ้นมาตามความยาวที่กำหนด (เช่น ไว้สร้าง state หรือ code verifier)
 */
export function randomString(length: number): string {
  // NOTE: The number of characters *must* be 64 for preventing _Modulo Bias_.
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/**
 * สร้างแฮช SHA-256 จากข้อความธรรมดา (เอาไว้แฮช code_verifier)
 */
export async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
}

/**
 * ดึงข้อมูล Payload Claims ออกมาจากรหัส JWT (JSON Web Token)
 */
export function extractJwtClaims<T>(jwt: string): T {
  const [, body] = jwt.split('.');

  return JSON.parse(atob(safeURLdecode(body)));
}
