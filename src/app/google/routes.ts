import { Routes } from '@angular/router';
import { googleOauthConfig } from './config';
import { formDirtyConfirmation } from './helpers';
import { AuthorizationPage } from './pages/authorization-page/authorization-page';
import { EventInsertPage } from './pages/event-insert-page/event-insert-page';
import { EventsListPage } from './pages/events-list-page/events-list-page';
import { GoogleRoot } from './pages/google-root/google-root';
import { FormPage } from './pages/types';
import { CalendarService } from './servies/calendar.service';
import { OauthClient } from './servies/oauth.client';
import { OAUTH_CLIENT_CONFIGURATION } from './types/services';

export default [
  {
    path: '',
    /**
     * ลงทะเบียน (Provide) Service หลักไว้ที่ระดับนี้ เพื่อให้ Component ย่อยใช้งานได้
     * ได้แก่ OauthClient สำหรับจัดการ Token และ CalendarService สำหรับจัดการปฏิทิน
     */
    providers: [
      { provide: OAUTH_CLIENT_CONFIGURATION, useValue: googleOauthConfig },
      OauthClient,
      CalendarService,
    ],
    children: [
      /**
       * หน้าจอนี้มีไว้ดักรอตอนที่ Google Redirect กลับมา
       * หลังจากผู้ใช้ล็อกอินและกดอนุญาตสิทธิ์เรียบร้อย
       */
      { path: 'authorization', data: { fullPage: true }, component: AuthorizationPage },

      /**
       * กลุ่ม Layout การแสดงผลหน้าจอการทำงานหลัก (GoogleRoot)
       */
      {
        path: '',
        component: GoogleRoot,
        children: [
          { path: '', redirectTo: 'events', pathMatch: 'full' },

          {
            path: 'events',
            children: [
              /**
               * หน้าแสดงรายการกิจกรรมทั้งหมด (Default เมื่อเข้า /google/events)
               */
              { path: '', component: EventsListPage },
              /**
               * หน้าฟอร์มสำหรับเพิ่มกิจกรรม
               */
              {
                path: 'insert',
                canDeactivate: [
                  (component: Partial<FormPage>) => {
                    if (component.dirty?.() ?? true) {
                      return formDirtyConfirmation();
                    } else {
                      return true;
                    }
                  },
                ],
                component: EventInsertPage,
              },
            ],
          },
        ],
      },
    ],
  },
] as Routes;
