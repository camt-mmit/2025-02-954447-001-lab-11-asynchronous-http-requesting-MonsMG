import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Film } from '../../types';

// ===== คอมโพเนนต์แสดงรายชื่อภาพยนตร์ =====
// รับข้อมูล Film[] จาก parent แล้วแสดงเป็นรายการ
@Component({
  selector: 'app-films-list',
  imports: [RouterLink], // ใช้ RouterLink เพื่อทำลิงก์ไปหน้ารายละเอียด
  templateUrl: './films-list.html',
  styleUrl: './films-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmsList {
  // รับข้อมูลรายชื่อภาพยนตร์จาก parent (บังคับต้องส่งมา)
  readonly data = input.required<readonly Film[]>();
}
