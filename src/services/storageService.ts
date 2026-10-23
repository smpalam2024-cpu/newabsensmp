import {
  AttendanceRecord,
  AuditLog,
  SchoolClass,
  Student,
  User,
  Session,
  ConflictItem,
  SyncStatus,
  Teacher,
  TeacherAttendanceRecord,
} from '../types';
import {
  INITIAL_CLASSES,
  INITIAL_STUDENTS,
  INITIAL_USERS,
  INITIAL_SESSIONS,
  INITIAL_TEACHERS,
  SCHOOL_INFO,
  DEFAULT_ADMIN_CREDENTIALS,
  getInitialAttendanceRecords,
  getInitialTeacherAttendanceRecords,
} from '../data/initialData';

const STORAGE_KEYS = {
  SCHOOL_INFO: 'absensi_sae_pamekasan_school_info_v4',
  USERS: 'absensi_sae_pamekasan_users_v4',
  CURRENT_USER: 'absensi_sae_pamekasan_current_user_v4',
  CLASSES: 'absensi_sae_pamekasan_classes_v4',
  STUDENTS: 'absensi_sae_pamekasan_students_v4',
  TEACHERS: 'absensi_sae_pamekasan_teachers_v4',
  SESSIONS: 'absensi_sae_pamekasan_sessions_v4',
  ATTENDANCE: 'absensi_sae_pamekasan_attendance_records_v4',
  SERVER_ATTENDANCE: 'absensi_sae_pamekasan_server_attendance_records_v4',
  TEACHER_ATTENDANCE: 'absensi_sae_pamekasan_teacher_attendance_v4',
  SERVER_TEACHER_ATTENDANCE: 'absensi_sae_pamekasan_server_teacher_attendance_v4',
  AUDIT_LOGS: 'absensi_sae_pamekasan_audit_logs_v4',
  FORCE_OFFLINE: 'absensi_sae_pamekasan_force_offline_sim_v4',
};

// Event emitter helper for cross-component reactivity
const EVENT_DATA_UPDATED = 'absensi_pwa_data_updated';

export function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_DATA_UPDATED));
  }
}

export function subscribeToDataChanges(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(EVENT_DATA_UPDATED, callback);
  return () => window.removeEventListener(EVENT_DATA_UPDATED, callback);
}

// Storage helpers
function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Initialize seed data if not present
export function initializeStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.SCHOOL_INFO)) {
    setItem(STORAGE_KEYS.SCHOOL_INFO, SCHOOL_INFO);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // MOH. BADRIT TAMAM, S.Mat
  }
  if (!localStorage.getItem(STORAGE_KEYS.CLASSES)) {
    setItem(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEACHERS)) {
    setItem(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
    setItem(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    const initialRecs = getInitialAttendanceRecords();
    setItem(STORAGE_KEYS.ATTENDANCE, initialRecs);
    setItem(STORAGE_KEYS.SERVER_ATTENDANCE, initialRecs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TEACHER_ATTENDANCE)) {
    const initialTeacherRecs = getInitialTeacherAttendanceRecords();
    setItem(STORAGE_KEYS.TEACHER_ATTENDANCE, initialTeacherRecs);
    setItem(STORAGE_KEYS.SERVER_TEACHER_ATTENDANCE, initialTeacherRecs);
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    const sampleLogs: AuditLog[] = [
      {
        id: 'log-001',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        userId: 'user-guru-badrit',
        userName: 'MOH. BADRIT TAMAM, S.Mat',
        userRole: 'guru',
        action: 'SUBMIT',
        className: 'Kelas VII (Al-Khawarizmi)',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        sessionName: 'Sesi Pagi / Apel & Jam 1-2',
        details: 'Absensi SMP Alam Excellentia Pamekasan diserahkan: 1 Hadir.',
      },
    ];
    setItem(STORAGE_KEYS.AUDIT_LOGS, sampleLogs);
  }
}

// User & Role APIs
export function getCurrentUser(): User {
  return getItem<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
}

export function setCurrentUser(user: User): void {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
  notifyDataChanged();
}

export function getAllUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

// Teachers APIs
export function getAllTeachers(): Teacher[] {
  return getItem<Teacher[]>(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
}

// Class & Student APIs
export function getAllClasses(): SchoolClass[] {
  return getItem<SchoolClass[]>(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
}

// User requested: "di fitur pilih kelas, berikan opsi kepada semua kelas untuk bisa dipilih"
// All teachers and users can choose and record for ANY class!
export function getClassesForUser(_user: User): SchoolClass[] {
  return getAllClasses();
}

export function getAllStudents(): Student[] {
  return getItem<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
}

export function getStudentsByClass(classId: string): Student[] {
  const students = getAllStudents();
  return students.filter((s) => s.classId === classId);
}

export function getAllSessions(): Session[] {
  return getItem<Session[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
}

// Simulated Network state
export function getSimulatedOffline(): boolean {
  return getItem<boolean>(STORAGE_KEYS.FORCE_OFFLINE, false);
}

export function setSimulatedOffline(isForced: boolean): void {
  setItem(STORAGE_KEYS.FORCE_OFFLINE, isForced);
  notifyDataChanged();
}

// Student Attendance Records APIs
export function getAllAttendanceRecords(): AttendanceRecord[] {
  return getItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
}

export function getServerAttendanceRecords(): AttendanceRecord[] {
  return getItem<AttendanceRecord[]>(STORAGE_KEYS.SERVER_ATTENDANCE, []);
}

export function findExistingRecord(classId: string, date: string, sessionId: string): AttendanceRecord | undefined {
  const records = getAllAttendanceRecords();
  return records.find((r) => r.classId === classId && r.date === date && r.sessionId === sessionId);
}

// Teacher Attendance Records APIs
export function getAllTeacherAttendanceRecords(): TeacherAttendanceRecord[] {
  return getItem<TeacherAttendanceRecord[]>(STORAGE_KEYS.TEACHER_ATTENDANCE, []);
}

export function getServerTeacherAttendanceRecords(): TeacherAttendanceRecord[] {
  return getItem<TeacherAttendanceRecord[]>(STORAGE_KEYS.SERVER_TEACHER_ATTENDANCE, []);
}

export function findExistingTeacherRecord(date: string, sessionId: string): TeacherAttendanceRecord | undefined {
  const records = getAllTeacherAttendanceRecords();
  return records.find((r) => r.date === date && r.sessionId === sessionId);
}

// Save or Update Student Attendance Record
export function saveAttendanceRecord(
  record: Omit<AttendanceRecord, 'syncStatus' | 'syncedAt' | 'revision'> & { revision?: number },
  isOnlineEffective: boolean
): { success: boolean; record: AttendanceRecord; message: string; wasOffline: boolean } {
  const allRecords = getAllAttendanceRecords();
  const existingIndex = allRecords.findIndex((r) => r.id === record.id);
  const now = new Date().toISOString();

  let targetSyncStatus: SyncStatus = isOnlineEffective ? 'synced' : 'pending_sync';
  let syncedAt = isOnlineEffective ? now : undefined;
  const currentRevision = (existingIndex >= 0 ? allRecords[existingIndex].revision : 0) + 1;

  const finalRecord: AttendanceRecord = {
    ...record,
    revision: currentRevision,
    syncStatus: targetSyncStatus,
    syncedAt,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    allRecords[existingIndex] = finalRecord;
  } else {
    allRecords.unshift(finalRecord);
  }
  setItem(STORAGE_KEYS.ATTENDANCE, allRecords);

  // If online, mirror to server master copy
  if (isOnlineEffective) {
    const serverRecords = getServerAttendanceRecords();
    const sIndex = serverRecords.findIndex((r) => r.id === record.id);
    if (sIndex >= 0) {
      serverRecords[sIndex] = { ...finalRecord };
    } else {
      serverRecords.unshift({ ...finalRecord });
    }
    setItem(STORAGE_KEYS.SERVER_ATTENDANCE, serverRecords);
  }

  // Audit log
  addAuditLog({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    userId: record.createdByUserId,
    userName: record.createdByUserName,
    userRole: record.createdRole,
    action: record.status === 'draft' ? 'CREATE_DRAFT' : existingIndex >= 0 ? 'UPDATE' : 'SUBMIT',
    className: getAllClasses().find((c) => c.id === record.classId)?.name || record.classId,
    date: record.date,
    sessionName: getAllSessions().find((s) => s.id === record.sessionId)?.name || record.sessionId,
    details: `${record.status === 'draft' ? 'Disimpan Draf Siswa' : 'Absensi Siswa Dikirim'}: ${record.summary.hadir} Hadir, ${record.summary.terlambat} Terlambat, ${record.summary.izin} Izin, ${record.summary.sakit} Sakit, ${record.summary.alpa} Alpa. (${isOnlineEffective ? 'Tersinkron' : 'Tersimpan Lokal'})`,
  });

  notifyDataChanged();

  return {
    success: true,
    record: finalRecord,
    message: isOnlineEffective
      ? 'Absensi siswa berhasil disimpan dan disinkronkan ke server sekolah.'
      : 'Absensi siswa disimpan di perangkat (Offline). Akan disinkronkan otomatis saat online.',
    wasOffline: !isOnlineEffective,
  };
}

// Save or Update Teacher Attendance Record
export function saveTeacherAttendanceRecord(
  record: Omit<TeacherAttendanceRecord, 'syncStatus' | 'syncedAt' | 'revision'> & { revision?: number },
  isOnlineEffective: boolean
): { success: boolean; record: TeacherAttendanceRecord; message: string; wasOffline: boolean } {
  const allRecords = getAllTeacherAttendanceRecords();
  const existingIndex = allRecords.findIndex((r) => r.id === record.id);
  const now = new Date().toISOString();

  let targetSyncStatus: SyncStatus = isOnlineEffective ? 'synced' : 'pending_sync';
  let syncedAt = isOnlineEffective ? now : undefined;
  const currentRevision = (existingIndex >= 0 ? allRecords[existingIndex].revision : 0) + 1;

  const finalRecord: TeacherAttendanceRecord = {
    ...record,
    revision: currentRevision,
    syncStatus: targetSyncStatus,
    syncedAt,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    allRecords[existingIndex] = finalRecord;
  } else {
    allRecords.unshift(finalRecord);
  }
  setItem(STORAGE_KEYS.TEACHER_ATTENDANCE, allRecords);

  if (isOnlineEffective) {
    const serverRecords = getServerTeacherAttendanceRecords();
    const sIndex = serverRecords.findIndex((r) => r.id === record.id);
    if (sIndex >= 0) {
      serverRecords[sIndex] = { ...finalRecord };
    } else {
      serverRecords.unshift({ ...finalRecord });
    }
    setItem(STORAGE_KEYS.SERVER_TEACHER_ATTENDANCE, serverRecords);
  }

  // Audit log
  addAuditLog({
    id: `log-tch-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    userId: record.createdByUserId,
    userName: record.createdByUserName,
    userRole: record.createdRole,
    action: record.status === 'draft' ? 'CREATE_DRAFT' : existingIndex >= 0 ? 'UPDATE' : 'SUBMIT',
    className: 'Dewan Guru & Tenaga Pendidik',
    date: record.date,
    sessionName: 'Absensi Kehadiran Guru',
    details: `${record.status === 'draft' ? 'Disimpan Draf Kehadiran Guru' : 'Kehadiran Guru Dikirim'}: ${record.summary.hadir} Hadir, ${record.summary.terlambat} Terlambat, ${record.summary.izin} Izin, ${record.summary.sakit} Sakit, ${record.summary.alpa} Alpa. (${isOnlineEffective ? 'Tersinkron' : 'Tersimpan Lokal'})`,
  });

  notifyDataChanged();

  return {
    success: true,
    record: finalRecord,
    message: isOnlineEffective
      ? 'Presensi guru berhasil disimpan dan disinkronkan ke server sekolah.'
      : 'Presensi guru disimpan di perangkat (Offline). Akan disinkronkan saat online.',
    wasOffline: !isOnlineEffective,
  };
}

// Background sync processing (for both students and teachers)
export function syncPendingRecords(): { syncedCount: number; conflicts: ConflictItem[] } {
  const localRecords = getAllAttendanceRecords();
  const serverRecords = getServerAttendanceRecords();
  const conflicts: ConflictItem[] = [];
  let syncedCount = 0;
  const now = new Date().toISOString();

  // 1. Sync student attendance
  const updatedLocal = localRecords.map((local) => {
    if (local.syncStatus !== 'pending_sync' && local.syncStatus !== 'local_saved' && local.syncStatus !== 'conflict') {
      return local;
    }

    const serverMatch = serverRecords.find((s) => s.id === local.id);

    if (serverMatch && serverMatch.updatedAt > local.createdAt && serverMatch.revision >= local.revision && serverMatch.createdByUserId !== local.createdByUserId) {
      const className = getAllClasses().find((c) => c.id === local.classId)?.name || local.classId;
      const sessionName = getAllSessions().find((s) => s.id === local.sessionId)?.name || local.sessionId;
      conflicts.push({
        recordId: local.id,
        classId: local.classId,
        className,
        date: local.date,
        sessionName,
        localRecord: local,
        serverRecord: serverMatch,
      });
      return {
        ...local,
        syncStatus: 'conflict' as SyncStatus,
      };
    }

    syncedCount++;
    const syncedRec: AttendanceRecord = {
      ...local,
      syncStatus: 'synced',
      syncedAt: now,
    };

    const sIndex = serverRecords.findIndex((s) => s.id === local.id);
    if (sIndex >= 0) {
      serverRecords[sIndex] = syncedRec;
    } else {
      serverRecords.unshift(syncedRec);
    }

    return syncedRec;
  });

  setItem(STORAGE_KEYS.ATTENDANCE, updatedLocal);
  setItem(STORAGE_KEYS.SERVER_ATTENDANCE, serverRecords);

  // 2. Sync teacher attendance
  const localTeacherRecords = getAllTeacherAttendanceRecords();
  const serverTeacherRecords = getServerTeacherAttendanceRecords();
  const updatedTeacherLocal = localTeacherRecords.map((local) => {
    if (local.syncStatus !== 'pending_sync' && local.syncStatus !== 'local_saved') {
      return local;
    }
    syncedCount++;
    const syncedRec: TeacherAttendanceRecord = {
      ...local,
      syncStatus: 'synced',
      syncedAt: now,
    };

    const sIndex = serverTeacherRecords.findIndex((s) => s.id === local.id);
    if (sIndex >= 0) {
      serverTeacherRecords[sIndex] = syncedRec;
    } else {
      serverTeacherRecords.unshift(syncedRec);
    }
    return syncedRec;
  });

  setItem(STORAGE_KEYS.TEACHER_ATTENDANCE, updatedTeacherLocal);
  setItem(STORAGE_KEYS.SERVER_TEACHER_ATTENDANCE, serverTeacherRecords);

  if (syncedCount > 0) {
    addAuditLog({
      id: `log-sync-${Date.now()}`,
      timestamp: now,
      userId: getCurrentUser().id,
      userName: getCurrentUser().name,
      userRole: getCurrentUser().role,
      action: 'SYNC',
      className: 'Sistem Terpadu',
      date: new Date().toISOString().split('T')[0],
      sessionName: 'Sinkronisasi Otomatis',
      details: `Berhasil menyinkronkan ${syncedCount} catatan absensi dari antrean lokal ke server sekolah.`,
    });
  }

  notifyDataChanged();
  return { syncedCount, conflicts };
}

// Resolve Conflict
export function resolveConflict(recordId: string, choice: 'local' | 'server' | 'merge'): void {
  const localRecords = getAllAttendanceRecords();
  const serverRecords = getServerAttendanceRecords();
  const now = new Date().toISOString();

  const localIdx = localRecords.findIndex((r) => r.id === recordId);
  const serverIdx = serverRecords.findIndex((r) => r.id === recordId);

  if (localIdx === -1) return;

  let resolvedRecord: AttendanceRecord;

  if (choice === 'server' && serverIdx !== -1) {
    resolvedRecord = {
      ...serverRecords[serverIdx],
      syncStatus: 'synced',
      syncedAt: now,
    };
  } else if (choice === 'merge' && serverIdx !== -1) {
    const mergedEntries = {
      ...serverRecords[serverIdx].entries,
      ...localRecords[localIdx].entries,
    };
    let hadir = 0, terlambat = 0, izin = 0, sakit = 0, alpa = 0;
    Object.values(mergedEntries).forEach((e) => {
      if (e.status === 'hadir') hadir++;
      else if (e.status === 'terlambat') terlambat++;
      else if (e.status === 'izin') izin++;
      else if (e.status === 'sakit') sakit++;
      else if (e.status === 'alpa') alpa++;
    });
    const total = Object.keys(mergedEntries).length;
    resolvedRecord = {
      ...localRecords[localIdx],
      entries: mergedEntries,
      summary: {
        total,
        hadir,
        terlambat,
        izin,
        sakit,
        alpa,
        percentage: total > 0 ? Math.round(((hadir + terlambat) / total) * 1000) / 10 : 0,
      },
      revision: Math.max(localRecords[localIdx].revision, serverRecords[serverIdx].revision) + 1,
      syncStatus: 'synced',
      syncedAt: now,
      updatedAt: now,
    };
  } else {
    resolvedRecord = {
      ...localRecords[localIdx],
      revision: (serverIdx !== -1 ? serverRecords[serverIdx].revision : localRecords[localIdx].revision) + 1,
      syncStatus: 'synced',
      syncedAt: now,
      updatedAt: now,
    };
  }

  localRecords[localIdx] = resolvedRecord;
  setItem(STORAGE_KEYS.ATTENDANCE, localRecords);

  if (serverIdx !== -1) {
    serverRecords[serverIdx] = resolvedRecord;
  } else {
    serverRecords.unshift(resolvedRecord);
  }
  setItem(STORAGE_KEYS.SERVER_ATTENDANCE, serverRecords);

  addAuditLog({
    id: `log-conflict-${Date.now()}`,
    timestamp: now,
    userId: getCurrentUser().id,
    userName: getCurrentUser().name,
    userRole: getCurrentUser().role,
    action: 'CONFLICT_RESOLVED',
    className: getAllClasses().find((c) => c.id === resolvedRecord.classId)?.name || resolvedRecord.classId,
    date: resolvedRecord.date,
    sessionName: getAllSessions().find((s) => s.id === resolvedRecord.sessionId)?.name || resolvedRecord.sessionId,
    details: `Konflik absensi diselesaikan dengan pilihan: "${choice.toUpperCase()}". Data diperbarui ke revisi ${resolvedRecord.revision}.`,
  });

  notifyDataChanged();
}

// Simulates a conflict for demo and verification
export function simulateConflict(recordId: string): void {
  const serverRecords = getServerAttendanceRecords();
  const sIdx = serverRecords.findIndex((r) => r.id === recordId);
  if (sIdx >= 0) {
    const updatedServer = {
      ...serverRecords[sIdx],
      revision: serverRecords[sIdx].revision + 2,
      updatedAt: new Date(Date.now() + 60000).toISOString(),
      createdByUserName: 'Shohibul Kahfi, M.Pd (Kepsek)',
      createdByUserId: 'user-kepsek-shohibul',
    };
    serverRecords[sIdx] = updatedServer;
    setItem(STORAGE_KEYS.SERVER_ATTENDANCE, serverRecords);

    const localRecords = getAllAttendanceRecords();
    const lIdx = localRecords.findIndex((r) => r.id === recordId);
    if (lIdx >= 0) {
      localRecords[lIdx] = {
        ...localRecords[lIdx],
        syncStatus: 'pending_sync',
      };
      setItem(STORAGE_KEYS.ATTENDANCE, localRecords);
    }

    notifyDataChanged();
  }
}

// Audit Logs
export function getAuditLogs(): AuditLog[] {
  return getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
}

export function addAuditLog(log: AuditLog): void {
  const logs = getAuditLogs();
  logs.unshift(log);
  if (logs.length > 200) logs.pop();
  setItem(STORAGE_KEYS.AUDIT_LOGS, logs);
}

// Student Management (Admin)
export function addStudent(student: Omit<Student, 'id'>): Student {
  const students = getAllStudents();
  const newStudent: Student = {
    ...student,
    id: `std-${Date.now()}`,
  };
  students.push(newStudent);
  setItem(STORAGE_KEYS.STUDENTS, students);
  notifyDataChanged();
  return newStudent;
}

export function updateStudent(student: Student): void {
  const students = getAllStudents();
  const idx = students.findIndex((s) => s.id === student.id);
  if (idx >= 0) {
    students[idx] = student;
    setItem(STORAGE_KEYS.STUDENTS, students);
    notifyDataChanged();
  }
}

export function deleteStudent(studentId: string): void {
  const students = getAllStudents().filter((s) => s.id !== studentId);
  setItem(STORAGE_KEYS.STUDENTS, students);
  notifyDataChanged();
}

// School Info & Academic Year
export function getSchoolInfo(): typeof SCHOOL_INFO {
  return getItem<typeof SCHOOL_INFO>(STORAGE_KEYS.SCHOOL_INFO, SCHOOL_INFO);
}

export function updateSchoolInfo(patch: Partial<typeof SCHOOL_INFO>): void {
  const current = getSchoolInfo();
  const updated = { ...current, ...patch };
  setItem(STORAGE_KEYS.SCHOOL_INFO, updated);
  notifyDataChanged();
}

// Admin Authentication & Login
export function loginAdmin(
  identifier: string,
  pass: string
): { success: boolean; user?: User; message?: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  const isMatch =
    (cleanId === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase() ||
      cleanId === DEFAULT_ADMIN_CREDENTIALS.alternateEmail.toLowerCase() ||
      cleanId === DEFAULT_ADMIN_CREDENTIALS.username.toLowerCase()) &&
    cleanPass === DEFAULT_ADMIN_CREDENTIALS.password;

  if (isMatch) {
    const allUsers = getAllUsers();
    let adminUser = allUsers.find((u) => u.role === 'admin');
    if (!adminUser) {
      adminUser = INITIAL_USERS.find((u) => u.role === 'admin') || INITIAL_USERS[5];
    }
    setCurrentUser(adminUser);
    addAuditLog({
      id: `log-login-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: adminUser.id,
      userName: adminUser.name,
      userRole: 'admin',
      action: 'UPDATE',
      className: 'Semua Kelas',
      date: new Date().toISOString().split('T')[0],
      sessionName: 'Sistem',
      details: 'Administrator Utama berhasil login ke sistem ABDI SMP SAE.',
    });
    return { success: true, user: adminUser };
  }

  // Teacher fallback login with NIP/email
  const allUsers = getAllUsers();
  const teacherUser = allUsers.find(
    (u) =>
      u.email.toLowerCase() === cleanId ||
      u.nip.replace(/\s+/g, '') === cleanId.replace(/\s+/g, '')
  );
  if (teacherUser && (cleanPass === 'guru123' || cleanPass === 'admin123')) {
    setCurrentUser(teacherUser);
    return { success: true, user: teacherUser };
  }

  return {
    success: false,
    message: 'Username/Email atau Password tidak cocok. Silakan gunakan kredensial admin yang tertera.',
  };
}

export function logoutCurrentUser(): void {
  setCurrentUser(INITIAL_USERS[0]);
}

// Session (Jam Sekolah) Management
export function updateSession(session: Session): void {
  const sessions = getAllSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;
    setItem(STORAGE_KEYS.SESSIONS, sessions);
    notifyDataChanged();
  }
}

export function addSession(session: Omit<Session, 'id'>): Session {
  const sessions = getAllSessions();
  const newSession: Session = {
    ...session,
    id: `sesi-${Date.now()}`,
  };
  sessions.push(newSession);
  setItem(STORAGE_KEYS.SESSIONS, sessions);
  notifyDataChanged();
  return newSession;
}

export function deleteSession(sessionId: string): void {
  const sessions = getAllSessions().filter((s) => s.id !== sessionId);
  setItem(STORAGE_KEYS.SESSIONS, sessions);
  notifyDataChanged();
}

// Teacher Management
export function updateTeacher(teacher: Teacher): void {
  const teachers = getAllTeachers();
  const idx = teachers.findIndex((t) => t.id === teacher.id);
  if (idx >= 0) {
    teachers[idx] = teacher;
    setItem(STORAGE_KEYS.TEACHERS, teachers);
    // Also sync in users list if teacher has a user account
    const users = getAllUsers();
    const uIdx = users.findIndex((u) => u.nip.replace(/\s+/g, '') === teacher.nip.replace(/\s+/g, ''));
    if (uIdx >= 0) {
      users[uIdx].name = teacher.name;
      users[uIdx].email = teacher.email;
      setItem(STORAGE_KEYS.USERS, users);
    }
    notifyDataChanged();
  }
}

export function addTeacher(teacher: Omit<Teacher, 'id'>): Teacher {
  const teachers = getAllTeachers();
  const newTeacher: Teacher = {
    ...teacher,
    id: `tch-${Date.now()}`,
  };
  teachers.push(newTeacher);
  setItem(STORAGE_KEYS.TEACHERS, teachers);
  notifyDataChanged();
  return newTeacher;
}

export function deleteTeacher(teacherId: string): void {
  const teachers = getAllTeachers().filter((t) => t.id !== teacherId);
  setItem(STORAGE_KEYS.TEACHERS, teachers);
  notifyDataChanged();
}

// Class Management
export function updateClass(cls: SchoolClass): void {
  const classes = getAllClasses();
  const idx = classes.findIndex((c) => c.id === cls.id);
  if (idx >= 0) {
    classes[idx] = cls;
    setItem(STORAGE_KEYS.CLASSES, classes);
    notifyDataChanged();
  }
}

export function addClass(cls: Omit<SchoolClass, 'id'>): SchoolClass {
  const classes = getAllClasses();
  const newClass: SchoolClass = {
    ...cls,
    id: `cls-${Date.now()}`,
  };
  classes.push(newClass);
  setItem(STORAGE_KEYS.CLASSES, classes);
  notifyDataChanged();
  return newClass;
}

export function deleteClass(classId: string): void {
  const classes = getAllClasses().filter((c) => c.id !== classId);
  setItem(STORAGE_KEYS.CLASSES, classes);
  notifyDataChanged();
}

// Reset data to initial state for easy testing
export function resetToDemoData(): void {
  setItem(STORAGE_KEYS.SCHOOL_INFO, SCHOOL_INFO);
  setItem(STORAGE_KEYS.USERS, INITIAL_USERS);
  setItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  setItem(STORAGE_KEYS.CLASSES, INITIAL_CLASSES);
  setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  setItem(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS);
  setItem(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
  const initialRecs = getInitialAttendanceRecords();
  setItem(STORAGE_KEYS.ATTENDANCE, initialRecs);
  setItem(STORAGE_KEYS.SERVER_ATTENDANCE, initialRecs);
  const initialTeacherRecs = getInitialTeacherAttendanceRecords();
  setItem(STORAGE_KEYS.TEACHER_ATTENDANCE, initialTeacherRecs);
  setItem(STORAGE_KEYS.SERVER_TEACHER_ATTENDANCE, initialTeacherRecs);
  setItem(STORAGE_KEYS.FORCE_OFFLINE, false);
  notifyDataChanged();
}
