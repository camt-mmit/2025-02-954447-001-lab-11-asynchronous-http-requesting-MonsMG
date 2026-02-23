import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PersonView } from '../../components/person-view/person-view';
import { personResource } from '../../helpers';
import { ModuleActivatedRoute } from '../../tokens';

// ===== หน้ารายละเอียดตัวละคร =====
// ดึงข้อมูลตัวละครจาก API ตาม id แล้วส่งให้ PersonView แสดงผล
@Component({
  selector: 'app-person-view-page',
  imports: [PersonView],
  templateUrl: './person-view-page.html',
  styleUrl: './person-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonViewPage {
  // รับ id ของตัวละครจาก URL (เช่น /people/1 → id = "1")
  readonly id = input.required<string>();

  // route ของ module สำหรับใช้สร้าง relative link ใน child component
  protected moduleRoute = inject(ModuleActivatedRoute);

  // ดึงข้อมูลตัวละครจาก API อัตโนมัติเมื่อ id เปลี่ยน
  protected readonly resource = personResource(this.id).asReadonly();

  private readonly location = inject(Location);

  // กดปุ่มย้อนกลับ → กลับไปหน้าก่อนหน้า
  protected goBack(): void {
    this.location.back();
  }
}
