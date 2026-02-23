import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PlanetView } from '../../components/planet-view/planet-view';
import { planetResource } from '../../helpers';
import { ModuleActivatedRoute } from '../../tokens';

// ===== หน้ารายละเอียดดาวเคราะห์ =====
// ดึงข้อมูลดาวจาก API ตาม id แล้วส่งให้ PlanetView แสดงผล
@Component({
  selector: 'app-planet-view-page',
  imports: [PlanetView],
  templateUrl: './planet-view-page.html',
  styleUrl: './planet-view-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetViewPage {
  // รับ id ของดาวเคราะห์จาก URL (เช่น /planets/1 → id = "1")
  readonly id = input.required<string>();

  // route ของ module สำหรับใช้สร้าง relative link ใน child component
  protected moduleRoute = inject(ModuleActivatedRoute);

  // ดึงข้อมูลดาวเคราะห์จาก API อัตโนมัติเมื่อ id เปลี่ยน
  protected readonly resource = planetResource(this.id).asReadonly();

  private readonly location = inject(Location);

  // กดปุ่มย้อนกลับ → กลับไปหน้าก่อนหน้า
  protected goBack(): void {
    this.location.back();
  }
}
