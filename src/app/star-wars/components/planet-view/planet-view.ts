import { ChangeDetectionStrategy, Component, input, resource } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Film, Person, Planet } from '../../types';
import { ExtractIdPipe, fetchResource } from '../../helpers';

// ===== คอมโพเนนต์แสดงรายละเอียดดาวเคราะห์ =====
// แสดงข้อมูลดาวพร้อมดึงข้อมูลผู้อาศัยและหนังที่เกี่ยวข้อง
@Component({
  selector: 'app-planet-view',
  imports: [RouterLink, ExtractIdPipe], // ใช้ลิงก์ไปหน้ารายละเอียด + ดึง ID จาก URL
  templateUrl: './planet-view.html',
  styleUrl: './planet-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetView {
  // รับข้อมูลดาวเคราะห์จาก parent (บังคับต้องส่งมา)
  readonly data = input.required<Planet>();

  // รับ route ของ module เพื่อใช้สร้าง relative link
  readonly moduleRoute = input.required<ActivatedRoute>();

  // ดึงข้อมูลผู้อาศัยทั้งหมดจาก URL พร้อมกัน
  // เช็คสถานะ hasValue / error / isLoading ก่อนแสดงผลใน template
  protected readonly residentsResource = resource({
    params: () => this.data().residents,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Person>(url, abortSignal))),
  }).asReadonly();

  // ดึงข้อมูลหนังทั้งหมดจาก URL พร้อมกัน
  // เช็คสถานะ hasValue / error / isLoading ก่อนแสดงผลใน template
  protected readonly filmsResource = resource({
    params: () => this.data().films,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Film>(url, abortSignal))),
  }).asReadonly();
}
