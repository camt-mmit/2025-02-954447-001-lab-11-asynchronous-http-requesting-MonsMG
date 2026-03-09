import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { EventResourceInsertModel } from '../../helpers/google/calendar';

/**
 * Component ฟอร์มสำหรับกรอกข้อมูลกิจกรรม (Event)
 * รับ FieldTree เข้ามาเพื่อควบคุม Field ต่างๆ เช่น summary, description, วัน-เวลา
 */

@Component({
  selector: 'app-event-field-tree',
  imports: [FormField],
  templateUrl: './events-field-tree.html',
  styleUrl: './events-field-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsFieldTree {
  /** โครงสร้าง Field ทั้งหมดของฟอร์ม Event ที่รับมาจาก Parent */
  readonly fieldTree = input.required<FieldTree<EventResourceInsertModel>>();
}
