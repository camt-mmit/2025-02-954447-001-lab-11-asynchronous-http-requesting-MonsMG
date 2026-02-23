import { httpResource } from '@angular/common/http';
import { Person, Film, Planet, ResourceList, ResultsListParams } from '../types';

// ===== ฟังก์ชันดึงข้อมูลจาก URL (ใช้ fetch ธรรมดา) =====
// รองรับทั้ง URL ปกติ และ null (จะคืน null กลับมา)
export async function fetchResource<T>(url: string, abortSignal?: AbortSignal | null): Promise<T>;
export async function fetchResource<T>(
  url: string | null,
  abortSignal?: AbortSignal | null,
): Promise<T | null>;
export async function fetchResource<T>(
  url: string | null,
  abortSignal: AbortSignal | null = null,
): Promise<T | null> {
  if (url === null) {
    return null;
  }
  const res = await fetch(url, { signal: abortSignal, cache: 'force-cache' });
  return await res.json();
}

// URL หลักของ Star Wars API
const entryPointURL = 'https://swapi.dev/api';

// ===== Resource สำหรับดึงรายชื่อตัวละคร =====
// รับ params (search, page) แล้วดึงข้อมูลจาก API
export function peopleListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResourceList<Person>>(() =>
    params()
      ? {
          url: `${entryPointURL}/people`,
          params: { ...params()! },
        }
      : undefined,
  );
}

// ===== Resource สำหรับดึงข้อมูลตัวละครคนเดียว (ตาม id) =====
export function personResource(id: () => string | undefined) {
  return httpResource<Person>(() => (id() ? `${entryPointURL}/people/${id()!}` : undefined));
}

// ===== Resource สำหรับดึงรายชื่อภาพยนตร์ =====
export function filmsListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResourceList<Film>>(() =>
    params()
      ? {
          url: `${entryPointURL}/films`,
          params: { ...params()! },
        }
      : undefined,
  );
}

// ===== Resource สำหรับดึงข้อมูลภาพยนตร์เรื่องเดียว (ตาม id) =====
export function filmResource(id: () => string | undefined) {
  return httpResource<Film>(() => (id() ? `${entryPointURL}/films/${id()!}` : undefined));
}

// ===== Resource สำหรับดึงรายชื่อดาวเคราะห์ =====
export function planetsListResource(params: () => ResultsListParams | undefined) {
  return httpResource<ResourceList<Planet>>(() =>
    params()
      ? {
          url: `${entryPointURL}/planets`,
          params: { ...params()! },
        }
      : undefined,
  );
}

// ===== Resource สำหรับดึงข้อมูลดาวเคราะห์ดวงเดียว (ตาม id) =====
export function planetResource(id: () => string | undefined) {
  return httpResource<Planet>(() => (id() ? `${entryPointURL}/planets/${id()!}` : undefined));
}
