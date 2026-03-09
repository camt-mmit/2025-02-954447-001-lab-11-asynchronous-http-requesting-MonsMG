import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * ลบ Properties ที่มีค่าเป็น null | undefined | '' (ค่าว่าง) ออกจาก Object
 */
export function removeEmptyProperties<T extends object>(
  data: T,
): {
  [K in keyof T]?: NonNullable<T[K]>;
} {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => !!value)) as {
    [K in keyof T]?: NonNullable<T[K]>;
  };
}

/**
 * แสดง Popup ยืนยันเมื่อผู้ใช้พยายามจะออกจากฟอร์มที่เพิ่งแก้ไขไปแล้วแต่ยังไม่ได้บันทึก
 */
export function formDirtyConfirmation(): boolean {
  return confirm(
    `Do you really want to leave?
Your changes will be discarded.`,
  );
}

declare const navigation:
  | {
      readonly canGoBack: boolean;
      readonly canGoForward: boolean;
      back(): Promise<unknown>;
      forward(): Promise<unknown>;
    }
  | undefined;

/**
 * สร้างฟังก์ชันสำหรับปุ่ม "ย้อนกลับ" ที่ฉลาดขึ้น
 * ถ้าระบบจำ History ได้ ก็จะถอยกลับเหมือนกดปุ่ม Back บนเบราว์เซอร์
 * ถ้าจำไม่ได้ ก็จะ Navigate กลับไปยัง defaultPaths ที่กำหนดไว้
 */
export function createNavigateBack(defaultPaths?: readonly unknown[]): () => Promise<void> {
  const router = inject(Router);
  const route = inject(ActivatedRoute);

  if (typeof navigation !== 'undefined') {
    return async () => {
      if (navigation.canGoBack) {
        return void (await navigation.back());
      } else {
        return void (await router.navigate(defaultPaths ?? ['..'], {
          replaceUrl: true,
          relativeTo: route,
        }));
      }
    };
  } else {
    return async () => {
      return void history.back();
    };
  }
}
