import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, linkedSignal } from '@angular/core';
import { FormField, form, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { EventsList } from '../../components/events-list/events-list';
import { LoadTrigger } from '../../components/load-trigger/load-trigger';
import { removeEmptyProperties } from '../../helpers';
import { CalendarService } from '../../servies/calendar.service';
import { EventsResource, EventsResourceQueryOptions } from '../../types/google/calendar';

/**
 * หน้าแสดงรายการกิจกรรมทั้งหมด พร้อมค้นหาและโหลดเพิ่มแบบ Infinite Scroll
 */

/** ค่าพารามิเตอร์เริ่มต้นสำหรับการดึงรายการกิจกรรม */
const defaultParams: Partial<EventsResourceQueryOptions['params']> = {
  maxResults: 25,
  eventTypes: ['default'],
  singleEvents: true,
  orderBy: 'startTime',
};

@Component({
  selector: 'app-events-list-page',
  imports: [EventsList, FormField, DatePipe, LoadTrigger, RouterLink],
  templateUrl: './events-list-page.html',
  styleUrl: './events-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsListPage {
  private readonly service = inject(CalendarService);

  /** คำค้นหาจาก Query Parameter */
  readonly q = input<string>();

  /** พารามิเตอร์ที่ส่งไป API (จะอัปเดตเมื่อค้นหาหรือโหลดหน้าถัดไป) */
  protected readonly params = linkedSignal(() => ({
    calendarId: 'primary',
    params: {
      ...defaultParams,
      // timeMin: new Date().toISOString(),
      ...(this.q() ? { q: this.q()! } : {}),
    },
  }));

  /** Resource ที่เชื่อมกับ API (จะ fetch ใหม่เมื่อ params เปลี่ยน) */
  protected readonly resource = this.service.eventsResource(this.params);

  /** รวมผลลัพธ์จากทุกหน้าไว้ด้วยกัน (สะสมเมื่อโหลดเพิ่ม) */
  protected readonly items = linkedSignal({
    source: () => (this.resource.hasValue() ? this.resource.value().items : null),
    computation: (source, previous): EventsResource['items'] | null => {
      if (source === null) {
        return previous?.value ?? null;
      } else {
        return [...(previous?.value ?? []), ...source];
      }
    },
  });

  /** ฟอร์มค้นหา */
  protected readonly form = form(
    linkedSignal(() => ({ q: this.params().params?.q ?? '' }) as const),
  );

  private readonly router = inject(Router);

  /** ส่งคำค้นหาไปอัปเดต Query Parameter และรีเซ็ตผลลัพธ์ */
  protected onSearch(): void {
    submit(this.form, async (form) => {
      this.items.set(null);

      void this.router.navigate([], {
        queryParams: removeEmptyProperties(form().value()),
        replaceUrl: true,
      });
    });
  }

  /** ล้างคำค้นหาและโหลดใหม่ */
  protected clearSearch(): void {
    this.form.q().value.set('');
    this.onSearch();
  }

  /** โหลดกิจกรรมหน้าถัดไป */
  protected getMore(pageToken: string): void {
    this.params.update(({ calendarId, params }) => ({
      calendarId,
      params: {
        ...params,
        pageToken,
      },
    }));
  }
}
