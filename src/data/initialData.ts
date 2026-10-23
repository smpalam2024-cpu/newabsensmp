import { SchoolClass, Student, User, Session, AttendanceRecord, Teacher, TeacherAttendanceRecord } from '../types';

export const SCHOOL_INFO = {
  name: 'SMP ALAM EXCELLENTIA PAMEKASAN',
  appName: 'ABDI SMP SAE',
  shortName: 'ABDI SMP SAE',
  tagline: 'Sekolah Menengah Pertama Alam Berkarakter & Unggul',
  address: 'Jl. Lawangan Daya No 114 Pademawu, Pamekasan',
  logoUrl: '/assets/aistudio/1713909500616_5b14171f.png',
  academicYear: '2026/2027',
  npsn: '699xxxxx',
};

// Kredensial Akun Login Admin Utama SMP Alam Excellentia
export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@smpsae.sch.id',
  alternateEmail: 'smpalam2024@gmail.com',
  username: 'admin',
  password: 'admin123',
};

// Daftar 5 Guru & Tenaga Pendidik SMP Alam Excellentia Pamekasan
// Sesuai aturan: Huruf kapital semua KECUALI di gelarnya (seperti M.Pd / S.Mat / S.Pd)
export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 'tch-01',
    name: 'SHOHIBUL KAHFI, M.Pd',
    nip: '19820514 200604 1 001',
    roleTitle: 'Kepala Sekolah',
    phone: '081234560001',
    email: 'shohibul.kahfi@smpalam-excellentia.sch.id',
    gender: 'L',
  },
  {
    id: 'tch-02',
    name: 'MOH. BADRIT TAMAM, S.Mat',
    nip: '19920410 201801 1 003',
    roleTitle: 'Wali Kelas VII (Al-Khawarizmi) / Guru Matematika & Sains',
    phone: '081234560002',
    email: 'badrit.tamam@smpalam-excellentia.sch.id',
    gender: 'L',
  },
  {
    id: 'tch-03',
    name: 'MAGHFIROH AGUSTINASARI S, M.Pd',
    nip: '19910818 201602 2 005',
    roleTitle: 'Wali Kelas VIII (Albatenius) / Guru Bahasa & Sosial',
    phone: '081234560003',
    email: 'maghfiroh.agustinasari@smpalam-excellentia.sch.id',
    gender: 'P',
  },
  {
    id: 'tch-04',
    name: 'SITTI NOERJANNAH, S.Pd.',
    nip: '19881125 201403 2 007',
    roleTitle: 'Wali Kelas IX (Avicena) / Guru Bahasa Inggris & PAI',
    phone: '081234560004',
    email: 'sitti.noerjannah@smpalam-excellentia.sch.id',
    gender: 'P',
  },
  {
    id: 'tch-05',
    name: 'ZAHRA NAJMA ATIKA',
    nip: '19960312 202102 2 010',
    roleTitle: 'Guru Pembina Alam & Ekstrakurikuler',
    phone: '081234560005',
    email: 'zahra.najma@smpalam-excellentia.sch.id',
    gender: 'P',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-guru-badrit',
    name: 'MOH. BADRIT TAMAM, S.Mat',
    nip: '19920410 201801 1 003',
    role: 'guru',
    roleLabel: 'Guru / Wali Kelas VII (Al-Khawarizmi)',
    assignedClassIds: ['cls-7-alkhawarizmi', 'cls-8-albatenius', 'cls-9-avicena'],
    email: 'badrit.tamam@smpalam-excellentia.sch.id',
  },
  {
    id: 'user-guru-maghfiroh',
    name: 'MAGHFIROH AGUSTINASARI S, M.Pd',
    nip: '19910818 201602 2 005',
    role: 'guru',
    roleLabel: 'Guru / Wali Kelas VIII (Albatenius)',
    assignedClassIds: ['cls-7-alkhawarizmi', 'cls-8-albatenius', 'cls-9-avicena'],
    email: 'maghfiroh.agustinasari@smpalam-excellentia.sch.id',
  },
  {
    id: 'user-guru-sitti',
    name: 'SITTI NOERJANNAH, S.Pd.',
    nip: '19881125 201403 2 007',
    role: 'guru',
    roleLabel: 'Guru / Wali Kelas IX (Avicena)',
    assignedClassIds: ['cls-7-alkhawarizmi', 'cls-8-albatenius', 'cls-9-avicena'],
    email: 'sitti.noerjannah@smpalam-excellentia.sch.id',
  },
  {
    id: 'user-guru-zahra',
    name: 'ZAHRA NAJMA ATIKA',
    nip: '19960312 202102 2 010',
    role: 'guru',
    roleLabel: 'Guru Pembina Alam & Ekstrakurikuler',
    assignedClassIds: ['cls-7-alkhawarizmi', 'cls-8-albatenius', 'cls-9-avicena'],
    email: 'zahra.najma@smpalam-excellentia.sch.id',
  },
  {
    id: 'user-kepsek-shohibul',
    name: 'SHOHIBUL KAHFI, M.Pd',
    nip: '19820514 200604 1 001',
    role: 'kepala_sekolah',
    roleLabel: 'Kepala Sekolah',
    assignedClassIds: ['cls-7-alkhawarizmi', 'cls-8-albatenius', 'cls-9-avicena'],
    email: 'shohibul.kahfi@smpalam-excellentia.sch.id',
  },
  {
    id: 'user-admin',
    name: 'ADMINISTRATOR UTAMA',
    nip: '19940715 202001 1 009',
    role: 'admin',
    roleLabel: 'Petugas Tata Usaha & Administrator Utama',
    assignedClassIds: ['cls-7-alkhawarizmi', 'cls-8-albatenius', 'cls-9-avicena'],
    email: 'admin@smpsae.sch.id',
  },
];

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls-7-alkhawarizmi',
    name: 'Kelas VII (Al-Khawarizmi)',
    grade: '7',
    homeroomTeacherName: 'MOH. BADRIT TAMAM, S.Mat',
    academicYear: '2026/2027',
    studentCount: 1,
  },
  {
    id: 'cls-8-albatenius',
    name: 'Kelas VIII (Albatenius)',
    grade: '8',
    homeroomTeacherName: 'MAGHFIROH AGUSTINASARI S, M.Pd',
    academicYear: '2026/2027',
    studentCount: 5,
  },
  {
    id: 'cls-9-avicena',
    name: 'Kelas IX (Avicena)',
    grade: '9',
    homeroomTeacherName: 'SITTI NOERJANNAH, S.Pd.',
    academicYear: '2026/2027',
    studentCount: 6,
  },
];

// Jam sekolah sesuai instruksi:
// Sesi pagi jam ke 1-3 (07:30-09:45 wib)
// Sesi siang jam ke 4-5 (10:15-12:00 wib)
// Sesi sore jam ke 6-7 dan ekstrakurikuler (12:30-15:00 wib)
// dan absensi harian terpadu
export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'sesi-pagi',
    name: 'Sesi Pagi (Jam 1-3)',
    code: 'SESI-1',
    timeRange: '07:30 - 09:45 WIB',
    startTime: '07:30',
    endTime: '09:45',
  },
  {
    id: 'sesi-siang',
    name: 'Sesi Siang (Jam 4-5)',
    code: 'SESI-2',
    timeRange: '10:15 - 12:00 WIB',
    startTime: '10:15',
    endTime: '12:00',
  },
  {
    id: 'sesi-sore',
    name: 'Sesi Sore & Ekstrakurikuler (Jam 6-7)',
    code: 'SESI-3',
    timeRange: '12:30 - 15:00 WIB',
    startTime: '12:30',
    endTime: '15:00',
  },
  {
    id: 'sesi-harian',
    name: 'Absensi Harian Terpadu',
    code: 'HARIAN',
    timeRange: 'Sepanjang Hari Sekolah (07:30 - 15:00 WIB)',
    startTime: '07:30',
    endTime: '15:00',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  // Kelas VII (Al-Khawarizmi) - 1 Siswa
  {
    id: 'std-7-01',
    nis: '260701',
    nisn: '0098710101',
    name: 'Yusuf Alauddin',
    gender: 'L',
    classId: 'cls-7-alkhawarizmi',
    parentName: 'Wali Yusuf Alauddin',
    parentPhone: '081234567101',
  },

  // Kelas VIII (Albatenius) - 5 Siswa
  {
    id: 'std-8-01',
    nis: '250801',
    nisn: '0087710201',
    name: 'Aklul Firdaus Thoif',
    gender: 'L',
    classId: 'cls-8-albatenius',
    parentName: 'Wali Aklul Firdaus',
    parentPhone: '081234567201',
  },
  {
    id: 'std-8-02',
    nis: '250802',
    nisn: '0087710202',
    name: 'Zidane Raditya Haris',
    gender: 'L',
    classId: 'cls-8-albatenius',
    parentName: 'Wali Zidane Raditya',
    parentPhone: '081234567202',
  },
  {
    id: 'std-8-03',
    nis: '250803',
    nisn: '0087710203',
    name: 'Jameikha Neladani Muhammad',
    gender: 'L',
    classId: 'cls-8-albatenius',
    parentName: 'Wali Jameikha Neladani',
    parentPhone: '081234567203',
  },
  {
    id: 'std-8-04',
    nis: '250804',
    nisn: '0087710204',
    name: 'Ibrahim Teguh Prasetyo',
    gender: 'L',
    classId: 'cls-8-albatenius',
    parentName: 'Wali Ibrahim Teguh',
    parentPhone: '081234567204',
  },
  {
    id: 'std-8-05',
    nis: '250805',
    nisn: '0087710205',
    name: 'Mery Hardian Syafarina',
    gender: 'P',
    classId: 'cls-8-albatenius',
    parentName: 'Wali Mery Hardian',
    parentPhone: '081234567205',
  },

  // Kelas IX (Avicena) - 6 Siswa
  {
    id: 'std-9-01',
    nis: '240901',
    nisn: '0076610301',
    name: 'Alif Chandra Alfatih',
    gender: 'L',
    classId: 'cls-9-avicena',
    parentName: 'Wali Alif Chandra',
    parentPhone: '081234567301',
  },
  {
    id: 'std-9-02',
    nis: '240902',
    nisn: '0076610302',
    name: 'Nadhif Irsyad Rabbani',
    gender: 'L',
    classId: 'cls-9-avicena',
    parentName: 'Wali Nadhif Irsyad',
    parentPhone: '081234567302',
  },
  {
    id: 'std-9-03',
    nis: '240903',
    nisn: '0076610303',
    name: 'Belva Renny Fhayona',
    gender: 'P',
    classId: 'cls-9-avicena',
    parentName: 'Wali Belva Renny',
    parentPhone: '081234567303',
  },
  {
    id: 'std-9-04',
    nis: '240904',
    nisn: '0076610304',
    name: 'Varo Ramdhan Gunawan',
    gender: 'L',
    classId: 'cls-9-avicena',
    parentName: 'Wali Varo Ramdhan',
    parentPhone: '081234567304',
  },
  {
    id: 'std-9-05',
    nis: '240905',
    nisn: '0076610305',
    name: 'Moh. Shidqi Alfaruq',
    gender: 'L',
    classId: 'cls-9-avicena',
    parentName: 'Wali Moh. Shidqi',
    parentPhone: '081234567305',
  },
  {
    id: 'std-9-06',
    nis: '240906',
    nisn: '0076610306',
    name: 'Fawaizal Akbar Rahman',
    gender: 'L',
    classId: 'cls-9-avicena',
    parentName: 'Wali Fawaizal Akbar',
    parentPhone: '081234567306',
  },
];

export const STATUS_CONFIG: Record<string, { label: string; badge: string; color: string; bg: string; border: string; desc: string }> = {
  hadir: {
    label: 'Hadir',
    badge: 'H',
    color: 'text-emerald-700',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    desc: 'Hadir tepat waktu',
  },
  terlambat: {
    label: 'Terlambat',
    badge: 'T',
    color: 'text-amber-700',
    bg: 'bg-amber-500',
    border: 'border-amber-500',
    desc: 'Hadir setelah jam masuk',
  },
  izin: {
    label: 'Izin',
    badge: 'I',
    color: 'text-blue-700',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    desc: 'Izin resmi dengan pemberitahuan',
  },
  sakit: {
    label: 'Sakit',
    badge: 'S',
    color: 'text-purple-700',
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    desc: 'Sakit disertai surat / keterangan',
  },
  alpa: {
    label: 'Alpa',
    badge: 'A',
    color: 'text-rose-700',
    bg: 'bg-rose-500',
    border: 'border-rose-500',
    desc: 'Tidak hadir tanpa keterangan',
  },
};

// Seed sample student attendance records
export function getInitialAttendanceRecords(): AttendanceRecord[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const record7: AttendanceRecord = {
    id: `rec-cls-7-alkhawarizmi-${yesterdayStr}-sesi-pagi`,
    classId: 'cls-7-alkhawarizmi',
    date: yesterdayStr,
    sessionId: 'sesi-pagi',
    status: 'submitted',
    entries: {
      'std-7-01': { studentId: 'std-7-01', status: 'hadir', recordedAt: `${yesterdayStr}T07:15:00Z` },
    },
    summary: {
      total: 1,
      hadir: 1,
      terlambat: 0,
      izin: 0,
      sakit: 0,
      alpa: 0,
      percentage: 100.0,
    },
    createdByUserId: 'user-guru-badrit',
    createdByUserName: 'MOH. BADRIT TAMAM, S.Mat',
    createdRole: 'guru',
    createdAt: `${yesterdayStr}T07:20:00Z`,
    updatedAt: `${yesterdayStr}T07:20:00Z`,
    syncedAt: `${yesterdayStr}T07:20:05Z`,
    syncStatus: 'synced',
    revision: 1,
  };

  const record8: AttendanceRecord = {
    id: `rec-cls-8-albatenius-${yesterdayStr}-sesi-pagi`,
    classId: 'cls-8-albatenius',
    date: yesterdayStr,
    sessionId: 'sesi-pagi',
    status: 'submitted',
    entries: {
      'std-8-01': { studentId: 'std-8-01', status: 'hadir', recordedAt: `${yesterdayStr}T07:15:00Z` },
      'std-8-02': { studentId: 'std-8-02', status: 'hadir', recordedAt: `${yesterdayStr}T07:15:00Z` },
      'std-8-03': { studentId: 'std-8-03', status: 'terlambat', note: 'Terlambat 10 menit karena ban bocor', recordedAt: `${yesterdayStr}T07:25:00Z` },
      'std-8-04': { studentId: 'std-8-04', status: 'hadir', recordedAt: `${yesterdayStr}T07:15:00Z` },
      'std-8-05': { studentId: 'std-8-05', status: 'hadir', recordedAt: `${yesterdayStr}T07:15:00Z` },
    },
    summary: {
      total: 5,
      hadir: 4,
      terlambat: 1,
      izin: 0,
      sakit: 0,
      alpa: 0,
      percentage: 100.0,
    },
    createdByUserId: 'user-guru-maghfiroh',
    createdByUserName: 'MAGHFIROH AGUSTINASARI S, M.Pd',
    createdRole: 'guru',
    createdAt: `${yesterdayStr}T07:28:00Z`,
    updatedAt: `${yesterdayStr}T07:28:00Z`,
    syncedAt: `${yesterdayStr}T07:28:06Z`,
    syncStatus: 'synced',
    revision: 1,
  };

  const record9: AttendanceRecord = {
    id: `rec-cls-9-avicena-${yesterdayStr}-sesi-pagi`,
    classId: 'cls-9-avicena',
    date: yesterdayStr,
    sessionId: 'sesi-pagi',
    status: 'submitted',
    entries: {
      'std-9-01': { studentId: 'std-9-01', status: 'hadir', recordedAt: `${yesterdayStr}T07:12:00Z` },
      'std-9-02': { studentId: 'std-9-02', status: 'hadir', recordedAt: `${yesterdayStr}T07:12:00Z` },
      'std-9-03': { studentId: 'std-9-03', status: 'izin', note: 'Mengikuti lomba tahfidz', recordedAt: `${yesterdayStr}T07:12:00Z` },
      'std-9-04': { studentId: 'std-9-04', status: 'hadir', recordedAt: `${yesterdayStr}T07:12:00Z` },
      'std-9-05': { studentId: 'std-9-05', status: 'sakit', note: 'Demam, istirahat di rumah', recordedAt: `${yesterdayStr}T07:12:00Z` },
      'std-9-06': { studentId: 'std-9-06', status: 'hadir', recordedAt: `${yesterdayStr}T07:12:00Z` },
    },
    summary: {
      total: 6,
      hadir: 4,
      terlambat: 0,
      izin: 1,
      sakit: 1,
      alpa: 0,
      percentage: 66.7,
    },
    createdByUserId: 'user-guru-sitti',
    createdByUserName: 'SITTI NOERJANNAH, S.Pd.',
    createdRole: 'guru',
    createdAt: `${yesterdayStr}T07:30:00Z`,
    updatedAt: `${yesterdayStr}T07:30:00Z`,
    syncedAt: `${yesterdayStr}T07:30:10Z`,
    syncStatus: 'synced',
    revision: 1,
  };

  return [record7, record8, record9];
}

// Seed sample teacher attendance records for yesterday
export function getInitialTeacherAttendanceRecords(): TeacherAttendanceRecord[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const teacherRecord: TeacherAttendanceRecord = {
    id: `rec-teacher-${yesterdayStr}-harian`,
    date: yesterdayStr,
    sessionId: 'sesi-harian',
    status: 'submitted',
    entries: {
      'tch-01': {
        teacherId: 'tch-01',
        status: 'hadir',
        checkInTime: '06:45',
        checkOutTime: '15:00',
        note: 'Memimpin apel pagi',
        recordedAt: `${yesterdayStr}T06:50:00Z`,
      },
      'tch-02': {
        teacherId: 'tch-02',
        status: 'hadir',
        checkInTime: '06:50',
        checkOutTime: '14:30',
        recordedAt: `${yesterdayStr}T06:55:00Z`,
      },
      'tch-03': {
        teacherId: 'tch-03',
        status: 'hadir',
        checkInTime: '06:52',
        checkOutTime: '14:30',
        recordedAt: `${yesterdayStr}T06:55:00Z`,
      },
      'tch-04': {
        teacherId: 'tch-04',
        status: 'hadir',
        checkInTime: '06:55',
        checkOutTime: '14:30',
        recordedAt: `${yesterdayStr}T06:58:00Z`,
      },
      'tch-05': {
        teacherId: 'tch-05',
        status: 'hadir',
        checkInTime: '06:58',
        checkOutTime: '14:30',
        recordedAt: `${yesterdayStr}T07:00:00Z`,
      },
    },
    summary: {
      total: 5,
      hadir: 5,
      terlambat: 0,
      izin: 0,
      sakit: 0,
      alpa: 0,
      percentage: 100.0,
    },
    createdByUserId: 'user-kepsek-shohibul',
    createdByUserName: 'SHOHIBUL KAHFI, M.Pd',
    createdRole: 'kepala_sekolah',
    createdAt: `${yesterdayStr}T07:05:00Z`,
    updatedAt: `${yesterdayStr}T07:05:00Z`,
    syncedAt: `${yesterdayStr}T07:05:10Z`,
    syncStatus: 'synced',
    revision: 1,
  };

  return [teacherRecord];
}
