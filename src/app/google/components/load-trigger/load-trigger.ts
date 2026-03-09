import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';

/**
 * Component ตัวกระตุ้นโหลดเพิ่ม (Infinite Scroll Trigger)
 * เมื่อ Component นี้ถูกสร้างขึ้นมา จะปล่อย Event "visible" ออกไปทันที
 * มักใช้คู่กับ @defer (on viewport) เพื่อโหลดข้อมูลหน้าถัดไปเมื่อ scroll มาถึง
 */
@Component({
  selector: 'app-load-trigger',
  imports: [],
  templateUrl: './load-trigger.html',
  styleUrl: './load-trigger.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadTrigger implements OnInit {
  /** Event ที่ปล่อยออกไปเมื่อ Component ปรากฏบนหน้าจอ */
  readonly visible = output<void>();

  /** เรียก emit ทันทีที่ Component ถูก Initialize */
  ngOnInit(): void {
    this.visible.emit();
  }
}
