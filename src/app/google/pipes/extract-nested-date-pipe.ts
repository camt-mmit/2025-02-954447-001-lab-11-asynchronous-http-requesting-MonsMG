import { Pipe, PipeTransform } from '@angular/core';
import { extractNestedDate } from '../helpers/google/calendar';
import { NestedDate } from '../types/google/calendar';

@Pipe({
  name: 'extractNestedDate',
})
export class ExtractNestedDatePipe implements PipeTransform {
  /**
   * แปลงข้อมูลแบบ NestedDate จาก Google API ให้กลายเป็นข้อความวันที่แบบ String ธรรมดา
   * เพื่อนำไปแสดงผลบนหน้าจอ HTML ได้ง่ายๆ ผ่าน Pipe (เช่น {{ event.start | extractNestedDate }})
   */
  transform(value: NestedDate): string {
    return extractNestedDate(value);
  }
}
