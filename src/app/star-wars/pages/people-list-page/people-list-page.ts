import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { FormField, disabled, form, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { peopleListResource, purnEmptyProperties } from '../../helpers';
import { PeopleList } from '../../components/people-list/people-list';

// ===== หน้ารายชื่อตัวละคร =====
// แสดงรายการตัวละครพร้อมระบบค้นหาและเปลี่ยนหน้า
@Component({
  selector: 'app-people-list-page',
  imports: [PeopleList, FormField, RouterLink, DecimalPipe],
  templateUrl: './people-list-page.html',
  styleUrl: './people-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeopleListPage {
  // รับค่า search และ page จาก query params ใน URL
  readonly search = input<string>();
  readonly page = input<string>();

  // รวม params เป็น object เดียว (ถ้าไม่มีค่าให้เป็น string ว่าง)
  protected readonly params = computed(
    () =>
      ({
        search: this.search() ?? '',
        page: this.page() ?? '',
      }) as const,
  );

  // ดึงข้อมูลรายชื่อตัวละครจาก API ตาม params
  protected readonly resource = peopleListResource(() =>
    purnEmptyProperties(this.params()),
  ).asReadonly();

  // คำนวณหน้าปัจจุบัน (ถ้าไม่ระบุ = หน้า 1)
  protected readonly currentPage = computed(() => +(this.params().page ? this.params().page : '1'));

  // คำนวณหน้าก่อนหน้า (ดึงจาก URL ของ previous)
  protected readonly previousPage = computed(() =>
    this.resource.hasValue() && this.resource.value().previous
      ? new URL(this.resource.value().previous!).searchParams.get('page')
      : null,
  );

  // คำนวณหน้าถัดไป (ดึงจาก URL ของ next)
  protected readonly nextPage = computed(() =>
    this.resource.hasValue() && this.resource.value().next
      ? new URL(this.resource.value().next!).searchParams.get('page')
      : null,
  );

  // สร้าง form สำหรับช่องค้นหา (ปิดการใช้งานตอนกำลังโหลด)
  protected readonly form = form(
    linkedSignal(() => ({ search: this.params().search }) as const),
    (path) => {
      disabled(path, () => this.resource.isLoading());
    },
  );

  private readonly router = inject(Router);

  // เมื่อกด search → อัปเดต query params ใน URL
  protected onSearch(): void {
    submit(
      this.form,
      async (form) =>
        void this.router.navigate([], {
          queryParams: purnEmptyProperties(form().value()),
          replaceUrl: true,
        }),
    );
  }

  // เมื่อกดล้าง → ลบข้อความค้นหาแล้ว search ใหม่
  protected clearSearch(): void {
    this.form.search().value.set('');
    this.onSearch();
  }
}
