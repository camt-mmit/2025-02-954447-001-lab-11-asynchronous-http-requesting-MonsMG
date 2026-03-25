import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, submit } from '@angular/forms/signals';
import { PeopleFieldTree } from '../../components/people-field-tree/people-field-tree';
import { createNavigateBack } from '../../helpers';
import {
  contactInsertSchema,
  extractPeopleErrorObjects,
  toContactInsertBody,
  toContactInsertModel,
} from '../../helpers/google/people';
import { PeopleService } from '../../servies/people.service';
import { FormPage } from '../types';

/**
 * หน้าฟอร์มสำหรับเพิ่ม Contact ใหม่เข้า Google Contacts
 * มี Guard canDeactivate ป้องกันการออกจากหน้าโดยไม่บันทึก
 */
@Component({
  selector: 'app-people-insert-page',
  imports: [PeopleFieldTree],
  templateUrl: './people-insert-page.html',
  styleUrl: './people-insert-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleInsertPage implements FormPage {
  /** ฟอร์มกรอกข้อมูล Contact พร้อม Schema Validation */
  protected readonly fieldTree = form(signal(toContactInsertModel()), contactInsertSchema);

  private readonly service = inject(PeopleService);

  /** ตรวจสอบว่าฟอร์มมีการแก้ไขหรือยัง (ใช้กับ canDeactivate Guard) */
  dirty(): boolean {
    return this.fieldTree().dirty();
  }

  /** ฟังก์ชันย้อนกลับไปหน้าก่อน */
  protected readonly navigateBack = createNavigateBack();

  /** บันทึก Contact ใหม่ไปยัง Google People API แล้วกลับหน้าเดิมถ้าสำเร็จ */
  protected async save(): Promise<void> {
    await submit(this.fieldTree, async (fieldTree) => {
      const body = toContactInsertBody(fieldTree().value());

      try {
        await this.service.createContact(body);
        return;
      } catch (error) {
        /** ถ้า Network ล่ม (status 0) ให้โยน Error ขึ้นไป */
        if (error instanceof HttpErrorResponse && error.status === 0) {
          throw error;
        }

        console.error(error);

        /** แปลง Error จาก API เป็นรูปแบบที่แสดงบน UI ได้ */
        return extractPeopleErrorObjects(error).map((error) => ({
          kind: 'server-error',
          message: error.message,
        }));
      }
    });

    /** ถ้าฟอร์ม valid (บันทึกสำเร็จ) ให้ Reset แล้วกลับหน้าเดิม */
    if (this.fieldTree().valid()) {
      this.fieldTree().reset();
      this.navigateBack();
    }
  }

  /** ยกเลิกแล้วกลับหน้าเดิม */
  protected cancel(): void {
    this.navigateBack();
  }
}
