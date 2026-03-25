import { disabled, required, schema } from '@angular/forms/signals';

/**
 * โมเดลข้อมูลสำหรับฟอร์มสร้าง Contact ใหม่ (ฝั่ง UI)
 * เก็บข้อมูลแบบ Flat เพื่อให้ง่ายต่อการ bind กับ input fields
 */
export interface ContactInsertModel {
  /** ชื่อจริง */
  readonly givenName: string;
  /** นามสกุล */
  readonly familyName: string;
  /** อีเมล */
  readonly email: string;
  /** ประเภทอีเมล เช่น home, work, other */
  readonly emailType: string;
  /** เบอร์โทรศัพท์ */
  readonly phoneNumber: string;
  /** ประเภทเบอร์โทร เช่น mobile, home, work */
  readonly phoneType: string;
}

/**
 * สร้างค่า Default ของ Form Model สำหรับสร้าง Contact ใหม่
 */
export function toContactInsertModel(): ContactInsertModel {
  return {
    givenName: '',
    familyName: '',
    email: '',
    emailType: 'home',
    phoneNumber: '',
    phoneType: 'mobile',
  };
}

/**
 * แปลง Form Model (ContactInsertModel) → Request Body สำหรับ Google People API
 * สร้างโครงสร้าง names, emailAddresses, phoneNumbers ตาม API spec
 */
export function toContactInsertBody(model: ContactInsertModel) {
  return {
    names: [
      {
        givenName: model.givenName,
        familyName: model.familyName,
      },
    ],
    /** เพิ่ม emailAddresses เฉพาะเมื่อมีค่า */
    ...(model.email
      ? {
          emailAddresses: [
            {
              value: model.email,
              type: model.emailType,
            },
          ],
        }
      : {}),
    /** เพิ่ม phoneNumbers เฉพาะเมื่อมีค่า */
    ...(model.phoneNumber
      ? {
          phoneNumbers: [
            {
              value: model.phoneNumber,
              type: model.phoneType,
            },
          ],
        }
      : {}),
  };
}

/**
 * Schema Validation สำหรับฟอร์มสร้าง Contact
 * บังคับกรอก givenName และ email เป็นอย่างน้อย
 */
export const contactInsertSchema = schema<ContactInsertModel>((path) => {
  disabled(path, ({ state }) => state.submitting());

  required(path.givenName);
  required(path.email);
});

// ---------- Error Handling ----------

export interface PeopleErrorObject {
  readonly domain: string;
  readonly message: string;
  readonly reason: string;
}

function createPeopleErrorObject(error: Partial<PeopleErrorObject> = {}): PeopleErrorObject {
  return {
    domain: 'unknown',
    message: 'Unknown',
    reason: 'unknown',
    ...error,
  };
}

/**
 * แกะโครงสร้างข้อผิดพลาด (Error) จาก Google People API ให้เป็น PeopleErrorObject[]
 * รองรับหลายรูปแบบ Error ที่ API อาจส่งกลับมา
 */
export function extractPeopleErrorObjects(error: unknown): readonly PeopleErrorObject[] {
  const typedError = error as
    | {
        name?: string;
        message?: string;
        error?:
          | {
              error?: {
                code?: number;
                message?: string;
                errors?: Partial<PeopleErrorObject>[];
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
      const peopleError = typedError.error as Extract<typeof typedError.error, { error?: unknown }>;

      if (Array.isArray(peopleError.error?.errors) && peopleError.error.errors.length > 0) {
        return peopleError.error.errors.map(createPeopleErrorObject);
      }

      if (typeof peopleError.error?.message === 'string') {
        return [createPeopleErrorObject({ message: peopleError.error.message })];
      }

      const messageError = typedError.error as Extract<
        typeof typedError.error,
        { message?: unknown }
      >;

      if (typeof messageError.message === 'string') {
        return [createPeopleErrorObject({ message: messageError.message })];
      }

      return [createPeopleErrorObject({ message: JSON.stringify(typedError.error) })];
    }

    return [createPeopleErrorObject({ message: `${typedError.error}` })];
  }

  if (typeof typedError?.message === 'string') {
    return [
      createPeopleErrorObject({
        message: typedError.message,
        ...(typeof typedError.name === 'string' ? { reason: typedError.name } : {}),
      }),
    ];
  }

  return [createPeopleErrorObject({ message: `${error}` })];
}
