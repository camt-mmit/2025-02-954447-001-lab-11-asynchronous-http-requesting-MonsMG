import { ChangeDetectionStrategy, Component, input, resource } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Film, Person, Planet } from '../../types';
import { ExtractIdPipe, fetchResource } from '../../helpers';

// ===== คอมโพเนนต์แสดงรายละเอียดภาพยนตร์ =====
// แสดงข้อมูลหนังพร้อมดึงข้อมูลตัวละครและดาวเคราะห์ที่เกี่ยวข้อง
@Component({
  selector: 'app-film-view',
  imports: [RouterLink, ExtractIdPipe], // ใช้ลิงก์ไปหน้ารายละเอียด + ดึง ID จาก URL
  templateUrl: './film-view.html',
  styleUrl: './film-view.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmView {
  // รับข้อมูลภาพยนตร์จาก parent (บังคับต้องส่งมา)
  readonly data = input.required<Film>();

  // รับ route ของ module เพื่อใช้สร้าง relative link
  readonly moduleRoute = input.required<ActivatedRoute>();

  // ดึงข้อมูลตัวละครทั้งหมดจาก URL พร้อมกัน
  // เช็คสถานะ hasValue / error / isLoading ก่อนแสดงผลใน template
  protected readonly charactersResource = resource({
    params: () => this.data().characters,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Person>(url, abortSignal))),
  }).asReadonly();

  // ดึงข้อมูลดาวเคราะห์ทั้งหมดจาก URL พร้อมกัน
  // เช็คสถานะ hasValue / error / isLoading ก่อนแสดงผลใน template
  protected readonly planetsResource = resource({
    params: () => this.data().planets,
    loader: async ({ params, abortSignal }) =>
      await Promise.all(params.map(async (url) => await fetchResource<Planet>(url, abortSignal))),
  }).asReadonly();
}
