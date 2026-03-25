import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { FormField, form, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { PeopleList } from '../../components/people-list/people-list';
import { LoadTrigger } from '../../components/load-trigger/load-trigger';
import { removeEmptyProperties } from '../../helpers';
import { PeopleService } from '../../servies/people.service';
import { Person } from '../../types/google/people';
import { ListConnectionsOptions } from '../../types/google/people/connections';

/**
 * หน้าแสดงรายชื่อ Contacts ทั้งหมดจาก Google People API
 * รองรับ Client-side Search (Array.filter) เพราะ connections.list ไม่มี server-side search
 * รองรับ Infinite Scroll ด้วย nextPageToken + LoadTrigger
 */

/** ค่าเริ่มต้นสำหรับ personFields ที่ต้องการดึงมา */
const defaultPersonFields: ListConnectionsOptions['personFields'] = [
  'names',
  'emailAddresses',
  'phoneNumbers',
  'photos',
  'organizations',
  'birthdays',
  'addresses',
  'biographies',
  'urls',
];

/** จำนวน Contact ที่ดึงมาต่อครั้ง */
const defaultPageSize = 100;

@Component({
  selector: 'app-people-list-page',
  imports: [PeopleList, FormField, LoadTrigger, RouterLink],
  templateUrl: './people-list-page.html',
  styleUrl: './people-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleListPage {
  private readonly service = inject(PeopleService);

  /** คำค้นหาจาก Query Parameter */
  readonly q = input<string>();

  /** พารามิเตอร์ที่ส่งไป API (จะอัปเดตเมื่อโหลดหน้าถัดไป) */
  protected readonly params = linkedSignal(() => ({
    personFields: defaultPersonFields,
    pageSize: defaultPageSize,
    sortOrder: 'FIRST_NAME_ASCENDING' as const,
    // ดึงข้อมูลจริงๆ รวมถึงรูปจาก Profile แบบเจาะจง
    sources: ['READ_SOURCE_TYPE_PROFILE', 'READ_SOURCE_TYPE_CONTACT'] as ('READ_SOURCE_TYPE_PROFILE' | 'READ_SOURCE_TYPE_CONTACT')[],
  }));

  /** Resource ที่เชื่อมกับ API (จะ fetch ใหม่เมื่อ params เปลี่ยน) */
  protected readonly resource = this.service.connectionsResource(this.params);

  /** รวมผลลัพธ์จากทุกหน้าไว้ด้วยกัน (สะสมเมื่อโหลดเพิ่ม) */
  protected readonly allItems = linkedSignal({
    source: () => (this.resource.hasValue() ? this.resource.value()?.connections : null),
    computation: (source, previous): readonly Person[] | null => {
      if (source === null || source === undefined) {
        return previous?.value ?? null;
      } else {
        return [...(previous?.value ?? []), ...source];
      }
    },
  });

  /**
   * รายการที่ผ่านการกรองด้วยคำค้นหา (Client-side filter)
   * เนื่องจาก people.connections.list ไม่รองรับการค้นหา จึงต้อง filter เอง
   * ค้นหาจาก displayName, email, phoneNumber
   */
  protected readonly filteredItems = computed(() => {
    const items = this.allItems();
    const query = this.searchQuery()?.toLowerCase()?.trim();

    if (!items) return null;

    // กรองเอาเฉพาะรายชื่อที่มีเบอร์โทรจริงๆ (Requirements: ให้แสดงเฉพาะเบอร์โทรที่มีอยู่จริงๆ)
    const withPhoneItems = items.filter((person) => person.phoneNumbers && person.phoneNumbers.length > 0);

    if (!query) return withPhoneItems;

    return withPhoneItems.filter((person) => {
      /** ค้นจากชื่อ */
      const nameMatch = person.names?.some((n) => n.displayName?.toLowerCase().includes(query));
      /** ค้นจากอีเมล */
      const emailMatch = person.emailAddresses?.some((e) => e.value?.toLowerCase().includes(query));
      /** ค้นจากเบอร์โทร */
      const phoneMatch = person.phoneNumbers?.some((p) => p.value?.toLowerCase().includes(query));

      return nameMatch || emailMatch || phoneMatch;
    });
  });

  /** เก็บคำค้นหาปัจจุบัน (สำหรับ client-side filter — ไม่ส่งไป API) */
  protected readonly searchQuery = linkedSignal(() => this.q() ?? '');

  /** ฟอร์มค้นหา */
  protected readonly searchForm = form(
    linkedSignal(() => ({ q: this.searchQuery() }) as const),
    {
      submission: {
        action: async (formFn) => {
          const value = formFn().value();
          this.searchQuery.set(value.q);

          void this.router.navigate([], {
            queryParams: removeEmptyProperties(value),
            replaceUrl: true,
          });
        },
      },
    },
  );

  private readonly router = inject(Router);

  /** ส่งคำค้นหา */
  protected onSearch(): void {
    submit(this.searchForm);
  }

  /** ล้างคำค้นหาแล้วค้นใหม่ */
  protected clearSearch(): void {
    this.searchForm.q().value.set('');
    submit(this.searchForm);
  }

  /** โหลด Contact หน้าถัดไปผ่าน pageToken */
  protected getMore(pageToken: string): void {
    this.params.update((prev) => ({
      ...prev,
      pageToken,
    }));
  }
}
