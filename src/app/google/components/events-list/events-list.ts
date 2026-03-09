import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ExtractNestedDatePipe } from '../../pipes/extract-nested-date-pipe';
import { EventResource } from '../../types/google/calendar';

/**
 * Component แสดงรายการกิจกรรม (Events) เป็นลิสต์
 * แต่ละรายการกดเปิดดูรายละเอียดได้ผ่าน <details>
 */
@Component({
  selector: 'app-events-list',
  imports: [ExtractNestedDatePipe, DatePipe],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsList {
  /** รายการกิจกรรมที่จะแสดง (รับจาก Parent) */
  readonly data = input.required<readonly EventResource[]>();
}
