import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Planet } from '../../types';

// ===== คอมโพเนนต์แสดงรายชื่อดาวเคราะห์ =====
// รับข้อมูล Planet[] จาก parent แล้วแสดงเป็นรายการ
@Component({
  selector: 'app-planets-list',
  imports: [RouterLink], // ใช้ RouterLink เพื่อทำลิงก์ไปหน้ารายละเอียด
  templateUrl: './planets-list.html',
  styleUrl: './planets-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetsList {
  // รับข้อมูลรายชื่อดาวเคราะห์จาก parent (บังคับต้องส่งมา)
  readonly data = input.required<readonly Planet[]>();
}
