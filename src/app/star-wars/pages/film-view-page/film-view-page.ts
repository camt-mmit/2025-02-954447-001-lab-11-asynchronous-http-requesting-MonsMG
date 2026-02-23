import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FilmView } from '../../components/film-view/film-view';
import { filmResource } from '../../helpers';
import { ModuleActivatedRoute } from '../../tokens';

// ===== หน้ารายละเอียดภาพยนตร์ =====
// ดึงข้อมูลหนังจาก API ตาม id แล้วส่งให้ FilmView แสดงผล
@Component({
  selector: 'app-film-view-page',
  imports: [FilmView],
  templateUrl: './film-view-page.html',
  styleUrl: './film-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmViewPage {
  // รับ id ของหนังจาก URL (เช่น /films/1 → id = "1")
  readonly id = input.required<string>();

  // route ของ module สำหรับใช้สร้าง relative link ใน child component
  protected moduleRoute = inject(ModuleActivatedRoute);

  // ดึงข้อมูลหนังจาก API อัตโนมัติเมื่อ id เปลี่ยน
  protected readonly resource = filmResource(this.id).asReadonly();

  private readonly location = inject(Location);

  // กดปุ่มย้อนกลับ → กลับไปหน้าก่อนหน้า
  protected goBack(): void {
    this.location.back();
  }
}
