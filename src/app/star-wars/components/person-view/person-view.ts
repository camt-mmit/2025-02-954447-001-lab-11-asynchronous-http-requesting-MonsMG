import { AsyncPipe, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  linkedSignal,
  Resource,
  resource,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Film, Person, Planet } from '../../types';
import { ExtractIdPipe, fetchResource } from '../../helpers';
import { httpResource } from '@angular/common/http';
import {
  applyEach,
  createManagedMetadataKey,
  FieldContext,
  form,
  metadata,
} from '@angular/forms/signals';

// ===== คอมโพเนนต์แสดงรายละเอียดตัวละคร =====
// แสดงข้อมูลตัวละครพร้อมดึงข้อมูลที่เกี่ยวข้อง (ดาวบ้านเกิด, หนัง)
// สาธิต 3 วิธีในการดึงข้อมูลแบบ async:
//   1. async → ใช้ fetchResource + async pipe ใน template
//   2. resource → ใช้ httpResource หรือ resource() ของ Angular
//   3. form → ใช้ form signals กับ managed metadata
@Component({
  selector: 'app-person-view',
  imports: [AsyncPipe, DatePipe, RouterLink, ExtractIdPipe],
  templateUrl: './person-view.html',
  styleUrl: './person-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonView {
  // รับข้อมูลตัวละครจาก parent (บังคับต้องส่งมา)
  readonly data = input.required<Person>();

  // รับ route ของ module เพื่อใช้สร้าง relative link
  readonly moduleRoute = input.required<ActivatedRoute>();

  // ===== วิธีที่ 1: ใช้ fetchResource (Promise) =====
  // สร้าง Promise สำหรับดาวบ้านเกิดและหนัง แล้วใช้ | async ใน template
  protected readonly asyncData = computed(() => {
    const { homeworld, films } = this.data();

    return {
      homeworld$: fetchResource<Planet>(homeworld),
      films: films.map((url) => fetchResource<Film>(url)),
    } as const;
  });

  // ===== วิธีที่ 2: ใช้ httpResource / resource() =====
  // ดึงข้อมูลดาวบ้านเกิดอัตโนมัติเมื่อ URL เปลี่ยน
  protected readonly homeworldResource = httpResource<Planet>(
    () => this.data().homeworld ?? undefined,
  ).asReadonly();

  // ดึงข้อมูลหนังทั้งหมดพร้อมกัน (Promise.all)
  protected readonly filmsResource = resource({
    params: () => this.data().films,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Film>(url, abortSignal))),
  }).asReadonly();

  // ===== วิธีที่ 3: ใช้ form signals กับ managed metadata =====
  // สร้าง metadata key ที่จะสร้าง httpResource อัตโนมัติสำหรับแต่ละ URL
  protected readonly filmResourceKey = createManagedMetadataKey<
    Resource<Film | undefined>,
    FieldContext<string>
  >((ctx) => {
    // สร้าง httpResource สำหรับ URL ของหนังแต่ละเรื่อง
    const resource = httpResource<Film>(() => ctx()!.value());

    // ทำลาย resource เมื่อ field ถูกลบออก
    const guardEffectRef = effect((onCleanup) => {
      ctx()!.fieldTree();

      onCleanup(() => {
        guardEffectRef.destroy();
        resource.destroy();
      });
    });

    return resource.asReadonly();
  });

  // สร้าง form จาก URL ของหนัง แล้วผูก metadata (httpResource) เข้าไป
  protected readonly filmsForm = form(
    linkedSignal(() => this.data().films),
    (path) => {
      applyEach(path, (eachPath) => {
        metadata(eachPath, this.filmResourceKey, (ctx) => ctx);
      });
    },
  );
}
