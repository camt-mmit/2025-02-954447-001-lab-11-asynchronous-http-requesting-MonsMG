import { Pipe, PipeTransform } from '@angular/core';

// ===== Pipe สำหรับดึง ID ออกจาก URL =====
// ตัวอย่าง: "https://swapi.dev/api/people/1/" → "1"
// ใช้ใน template เช่น: person.url | extractId
@Pipe({
  name: 'extractId',
  standalone: true,
})
export class ExtractIdPipe implements PipeTransform {
  transform(url: string): string {
    // แยก URL ด้วย "/" แล้วเอาส่วนสุดท้ายที่ไม่ใช่ค่าว่าง
    return url.split('/').filter(Boolean).at(-1) ?? '';
  }
}
