import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, submit } from '@angular/forms/signals';
import { EventsFieldTree } from '../../components/events-field-tree/events-field-tree';
import { createNavigateBack } from '../../helpers';
import {
  eventResourceInsertSchema,
  extractCalendarErrorObjects,
  toEventResourceInsertBody,
  toEventResourceInsertModel,
} from '../../helpers/google/calendar';
import { CalendarService } from '../../servies/calendar.service';
import { FormPage } from '../types';

/**
 * หน้าฟอร์มสำหรับเพิ่มกิจกรรมใหม่เข้า Google Calendar
 * มี Guard canDeactivate ป้องกันการออกจากหน้าโดยไม่บันทึก
 */
@Component({
  selector: 'app-event-insert-page',
  imports: [EventsFieldTree],
  templateUrl: './event-insert-page.html',
  styleUrl: './event-insert-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventInsertPage implements FormPage {
  /** ฟอร์มกรอกข้อมูลกิจกรรม พร้อม Schema Validation */
  protected readonly fieldTree = form(
    signal(toEventResourceInsertModel()),
    eventResourceInsertSchema,
  );

  private readonly service = inject(CalendarService);

  /** ตรวจสอบว่าฟอร์มมีการแก้ไขหรือยัง (ใช้กับ canDeactivate Guard) */
  dirty(): boolean {
    return this.fieldTree().dirty();
  }

  /** ฟังก์ชันย้อนกลับไปหน้าก่อน */
  protected readonly navigateBack = createNavigateBack();

  /** บันทึกกิจกรรมไปยัง Google Calendar แล้วกลับหน้าเดิมถ้าสำเร็จ */
  protected async save(): Promise<void> {
    await submit(this.fieldTree, async (fieldTree) => {
      const body = toEventResourceInsertBody(fieldTree().value());

      try {
        await this.service.insertEvent({
          calendarId: 'primary',
          body,
        });

        return;
      } catch (error) {
        if (error instanceof HttpErrorResponse && error.status === 0) {
          throw error;
        }

        console.error(error);

        return extractCalendarErrorObjects(error).map((error) => ({
          kind: 'server-error',
          message: error.message,
        }));
      }
    });

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
