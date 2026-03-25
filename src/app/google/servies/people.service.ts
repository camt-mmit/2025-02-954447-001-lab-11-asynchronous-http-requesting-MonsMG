import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, ResourceRef, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, firstValueFrom, switchMap } from 'rxjs';
import {
  ListConnectionsOptions,
  ListConnectionsResponse,
} from '../types/google/people/connections';
import { Person } from '../types/google/people';
import { OauthClient } from './oauth.client';

/** Request Body สำหรับ people:createContact (เป็น subset ของ Person ไม่ต้องมีครบทุก field) */
export type CreateContactBody = Record<string, unknown>;

/** Base URL ของ Google People API v1 */
const apiUrl = 'https://people.googleapis.com/v1';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private readonly oauthClient = inject(OauthClient);
  private readonly http = inject(HttpClient);

  /**
   * ดึงรายชื่อ Connections ของผู้ใช้แบบ Reactive (rxResource)
   * จะ fetch ใหม่อัตโนมัติเมื่อ options เปลี่ยนค่า
   */
  connectionsResource(
    options: () => ListConnectionsOptions | undefined,
  ): ResourceRef<ListConnectionsResponse | undefined> {
    return rxResource({
      params: options,
      stream: ({ params: options }) =>
        defer(async () => ({
          ...(await this.oauthClient.getAuthorizationHeaders()),
        })).pipe(
          switchMap((headers) => {
            /** แปลง personFields จาก Array เป็น comma-separated string ตามที่ API ต้องการ */
            const queryParams: Record<string, string | number | readonly string[]> = {
              personFields: options.personFields.join(','),
            };

            if (options.pageSize) queryParams['pageSize'] = options.pageSize;
            if (options.pageToken) queryParams['pageToken'] = options.pageToken;
            if (options.sortOrder) queryParams['sortOrder'] = options.sortOrder;
            if (options.sources) queryParams['sources'] = options.sources;

            return this.http.get<ListConnectionsResponse>(`${apiUrl}/people/me/connections`, {
              params: new HttpParams({ fromObject: queryParams }),
              headers,
            });
          }),
        ),
    });
  }

  /**
   * สร้าง Contact ใหม่ผ่าน people.createContact API
   * ส่ง body เป็น Partial<Person> ที่มี names, emailAddresses, phoneNumbers เป็นต้น
   */
  createContact(body: CreateContactBody): Promise<Person> {
    return firstValueFrom(
      defer(async () => ({
        ...(await this.oauthClient.getAuthorizationHeaders()),
      })).pipe(
        switchMap((headers) =>
          this.http.post<Person>(`${apiUrl}/people:createContact`, body, { headers }),
        ),
      ),
    );
  }
}
