import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Person } from '../../types';

// ===== คอมโพเนนต์แสดงรายชื่อตัวละคร =====
// รับข้อมูล Person[] จาก parent แล้วแสดงเป็นรายการ
@Component({
  selector: 'app-people-list',
  imports: [RouterLink], // ใช้ RouterLink เพื่อทำลิงก์ไปหน้ารายละเอียด
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleList {
  // รับข้อมูลรายชื่อตัวละครจาก parent (บังคับต้องส่งมา)
  readonly data = input.required<readonly Person[]>();
}
