import { disabled, required, schema } from '@angular/forms/signals';
import {
  EventResourceInsertBody,
  NestedDate,
  NestedDateOnly,
  NestedDateTime,
} from '../../types/google/calendar';
import { DeepPartial } from '../../types/utils';

/**
 * ดึงค่าวันที่ (String) ออกมาจาก Object NestedDate ไม่ว่าจะเป็นแบบ dateTime หรือ date ธรรมดา
 */
export function extractNestedDate(dateOrDatetime: DeepPartial<NestedDate>): string {
  if (typeof (dateOrDatetime as NestedDateTime).dateTime !== 'undefined') {
    return (dateOrDatetime as NestedDateTime).dateTime;
  } else if (typeof (dateOrDatetime as NestedDateOnly).date !== 'undefined') {
    return (dateOrDatetime as NestedDateOnly).date;
  }

  return '';
}

export interface CalendarErrorObject {
  readonly domain: string;
  readonly message: string;
  readonly reason: string;
}

function createCalendarErrorObject(error: Partial<CalendarErrorObject> = {}): CalendarErrorObject {
  return {
    ...{
      domain: 'unknown',
      message: 'Unknown',
      reason: 'unknown',
    },
    ...error,
  };
}

/**
 * แกะโครงสร้างข้อผิดพลาด (Error) ที่ได้จาก Google API ให้เป็นรูปแบบ CalendarErrorObject
 */
export function extractCalendarErrorObjects(error: unknown): readonly CalendarErrorObject[] {
  const typedError = error as
    | {
        name?: string;
        message?: string;
        error?:
          | {
              error?: {
                code?: string;
                message?: string;
                errors?: Partial<CalendarErrorObject>[];
              };
            }
          | { message?: string }
          | string
          | null;
      }
    | null
    | undefined;

  if (typeof typedError?.error !== 'undefined' && typedError.error !== null) {
    if (typeof typedError.error === 'object') {
      const calendarError = typedError.error as Extract<
        typeof typedError.error,
        { error?: unknown }
      >;

      if (Array.isArray(calendarError.error?.errors) && calendarError.error.errors.length > 0) {
        return calendarError.error.errors.map(createCalendarErrorObject);
      }

      if (typeof calendarError.error?.message === 'string') {
        return [createCalendarErrorObject({ message: calendarError.error.message })];
      }

      const messageError = typedError.error as Extract<
        typeof typedError.error,
        { message?: unknown }
      >;

      if (typeof messageError.message === 'string') {
        return [createCalendarErrorObject({ message: messageError.message })];
      }

      return [createCalendarErrorObject({ message: JSON.stringify(typedError.error) })];
    }

    return [createCalendarErrorObject({ message: `${typedError.error}` })];
  }

  if (typeof typedError?.message === 'string') {
    return [
      createCalendarErrorObject({
        message: typedError.message,
        ...(typeof typedError.name === 'string' ? { reason: typedError.name } : {}),
      }),
    ];
  }

  return [createCalendarErrorObject({ message: `${error}` })];
}

export interface EventResourceInsertModel extends Omit<EventResourceInsertBody, 'start' | 'end'> {
  /** หัวเรื่องของกิจกรรม */
  readonly summary: string;
  /** รายละเอียดของกิจกรรม */
  readonly description: string;
  /** เป็นกิจกรรมเต็มวันหรือไม่ */
  readonly allDay: boolean;
  /** เวลาเริ่ม */
  readonly startDateTime: string;
  /** เวลาสิ้นสุด */
  readonly endDateTime: string;
}

/**
 * แปลงข้อมูลจาก EventResourceInsertBody (Payload ของ Google api) กลับมาเป็น Model ของ Form ในฝั่ง UI
 */
export function toEventResourceInsertModel(
  data?: EventResourceInsertBody,
): EventResourceInsertModel {
  const allDay =
    typeof (data?.start as DeepPartial<NestedDateOnly> | undefined)?.date !== 'undefined';

  return {
    summary: data?.summary ?? '',
    description: data?.description ?? '',
    allDay,
    startDateTime: data?.start ? extractNestedDate(data.start) : '',
    endDateTime: data?.end ? extractNestedDate(data.end) : '',
  };
}

/**
 * แปลงข้อมูลจาก Model ของ Form ในฝั่ง UI (EventResourceInsertModel) ไปเป็น Payload ของ Google api (EventResourceInsertBody)
 */
export function toEventResourceInsertBody(
  model: EventResourceInsertModel,
): EventResourceInsertBody {
  const { allDay, startDateTime, endDateTime, ...rest } = model;

  return {
    ...rest,
    start: allDay ? { date: startDateTime } : { dateTime: new Date(startDateTime).toISOString() },
    end: allDay ? { date: endDateTime } : { dateTime: new Date(endDateTime).toISOString() },
  };
}

/**
 * Schema Validation สำหรับการเพิ่ม Event (ต้องมี หัวข้อ, รายละเอียด, เวลาเริ่มและจบ)
 */
export const eventResourceInsertSchema = schema<EventResourceInsertModel>((path) => {
  disabled(path, ({ state }) => state.submitting());

  required(path.summary);
  required(path.description);
  required(path.startDateTime);
  required(path.endDateTime);
});
