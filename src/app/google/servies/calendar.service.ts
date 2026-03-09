import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, ResourceRef, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { defer, firstValueFrom, switchMap } from 'rxjs';
import {
  EventResource,
  EventResourceInsertOptions,
  EventsResource,
  EventsResourceQueryOptions,
} from '../types/google/calendar';
import { OauthClient } from './oauth.client';

const apiUrl = 'https://www.googleapis.com/calendar/v3';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly oauthClient = inject(OauthClient);

  private readonly http = inject(HttpClient);

  /**
   * ดึงข้อมูลกิจกรรมทั้งหมดแบบ Reactive (rxResource)
   * โดยจะทำงานอีกครั้งเมื่อ options ถูกเปลี่ยนค่า
   */
  eventsResource(
    options: () => EventsResourceQueryOptions | undefined,
  ): ResourceRef<EventsResource | undefined> {
    return rxResource({
      params: options,
      stream: ({ params: options }) =>
        defer(async () => ({
          ...(await this.oauthClient.getAuthorizationHeaders()),
        })).pipe(
          switchMap((headers) =>
            this.http.get<EventsResource>(`${apiUrl}/calendars/${options.calendarId}/events`, {
              params: new HttpParams({ fromObject: options.params ?? {} }),
              headers,
            }),
          ),
        ),
    });
  }

  /**
   * สร้างกิจกรรมใหม่ (Insert) ในปฏิทินที่เลือก
   */
  insertEvent(options: EventResourceInsertOptions): Promise<EventResource> {
    return firstValueFrom(
      defer(async () => ({
        ...(await this.oauthClient.getAuthorizationHeaders()),
      })).pipe(
        switchMap((headers) =>
          this.http.post<EventResource>(
            `${apiUrl}/calendars/${options.calendarId}/events`,
            options.body,
            {
              params: new HttpParams({ fromObject: options.params ?? {} }),
              headers,
            },
          ),
        ),
      ),
    );
  }
}
