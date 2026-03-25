import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Person } from '../../types/google/people';

/**
 * Component แสดงรายชื่อ Contacts (People) เป็นลิสต์
 * แต่ละรายการกดเปิดดูรายละเอียดเพิ่มเติมได้ผ่าน <details>
 */
@Component({
  selector: 'app-people-list',
  imports: [],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleList {
  /** รายชื่อ Contact ที่จะแสดง (รับจาก Parent) */
  readonly data = input.required<readonly Person[]>();
}
