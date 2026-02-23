// ===== ประเภทข้อมูลพื้นฐานที่ใช้ร่วมกันทุก resource =====

// ข้อมูลพื้นฐานที่ทุก resource มีเหมือนกัน (ชื่อ, วันสร้าง, วันแก้ไข, URL)
export interface ResourceItem {
  readonly name: string;
  readonly created: number;
  readonly edited: number;
  readonly url: string;
}

// โครงสร้างของรายการที่ได้จาก API (มีจำนวนทั้งหมด, ลิงก์หน้าถัดไป/ก่อนหน้า, ผลลัพธ์)
export interface ResourceList<T> {
  readonly count: number;
  readonly next: string;
  readonly previous: string | null;
  readonly results: readonly T[];
}

// พารามิเตอร์สำหรับค้นหาและแบ่งหน้า
export interface ResultsListParams {
  readonly page?: number | string;
  readonly search?: string;
}

// ===== ข้อมูลตัวละคร (People) =====
export interface Person extends ResourceItem {
  readonly name: string; // ชื่อตัวละคร
  readonly birth_year: string; // ปีเกิด (เช่น 19BBY)
  readonly eye_color: string; // สีตา
  readonly gender: string; // เพศ
  readonly hair_color: string; // สีผม
  readonly height: string; // ส่วนสูง (ซม.)
  readonly mass: string; // น้ำหนัก (กก.)
  readonly skin_color: string; // สีผิว
  readonly homeworld: string | null; // URL ของดาวบ้านเกิด
  readonly films: readonly string[]; // URL ของหนังที่ปรากฏตัว
  readonly species: readonly string[]; // URL ของสายพันธุ์
  readonly starships: readonly string[]; // URL ของยานอวกาศที่ขับ
  readonly vehicles: readonly string[]; // URL ของยานพาหนะที่ขับ
}

// ===== ข้อมูลภาพยนตร์ (Films) =====
export interface Film extends ResourceItem {
  readonly title: string; // ชื่อเรื่อง
  readonly episode_id: number; // ลำดับ Episode
  readonly opening_crawl: string; // ข้อความเปิดเรื่อง
  readonly director: string; // ผู้กำกับ
  readonly producer: string; // ผู้อำนวยการสร้าง
  readonly release_date: string; // วันที่ฉาย
  readonly species: readonly string[]; // URL ของสายพันธุ์ในเรื่อง
  readonly starships: readonly string[]; // URL ของยานอวกาศในเรื่อง
  readonly vehicles: readonly string[]; // URL ของยานพาหนะในเรื่อง
  readonly characters: readonly string[]; // URL ของตัวละครในเรื่อง
  readonly planets: readonly string[]; // URL ของดาวเคราะห์ในเรื่อง
}

// ===== ข้อมูลดาวเคราะห์ (Planets) =====
export interface Planet extends ResourceItem {
  readonly name: string; // ชื่อดาว
  readonly diameter: string; // เส้นผ่านศูนย์กลาง (กม.)
  readonly rotation_period: string; // ระยะเวลาหมุนรอบตัวเอง (ชม.)
  readonly orbital_period: string; // ระยะเวลาโคจรรอบดาวฤกษ์ (วัน)
  readonly gravity: string; // แรงโน้มถ่วง (1 = ปกติ)
  readonly population: string; // จำนวนประชากร
  readonly climate: string; // สภาพอากาศ
  readonly terrain: string; // ภูมิประเทศ
  readonly surface_water: string; // เปอร์เซ็นต์พื้นผิวน้ำ
  readonly residents: readonly string[]; // URL ของผู้อาศัยบนดาว
  readonly films: readonly string[]; // URL ของหนังที่ดาวปรากฏ
}
