import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { ContactInsertModel } from '../../helpers/google/people';

/**
 * Component ฟอร์มสำหรับกรอกข้อมูล Contact ใหม่
 * รับ FieldTree เข้ามาเพื่อควบคุม Field ต่างๆ เช่น ชื่อ, อีเมล, เบอร์โทร
 */
@Component({
  selector: 'app-people-field-tree',
  imports: [FormField],
  templateUrl: './people-field-tree.html',
  styleUrl: './people-field-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleFieldTree {
  /** โครงสร้าง Field ทั้งหมดของฟอร์ม Contact ที่รับมาจาก Parent */
  readonly fieldTree = input.required<FieldTree<ContactInsertModel>>();
}
