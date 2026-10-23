import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Edit2,
  ShieldCheck,
  Activity,
  Layers,
  RotateCcw,
  CheckCircle,
  X,
  Search,
  Clock,
  Calendar,
  Lock,
  Plus,
  Save,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react';
import { SchoolClass, Student, User, AuditLog, Teacher, Session } from '../types';
import {
  getAllClasses,
  getAllStudents,
  getAllTeachers,
  getAllSessions,
  getSchoolInfo,
  updateSchoolInfo,
  addStudent,
  updateStudent,
  deleteStudent,
  updateSession,
  addSession,
  deleteSession,
  updateClass,
  addClass,
  deleteClass,
  updateTeacher,
  addTeacher,
  deleteTeacher,
  getAuditLogs,
  resetToDemoData,
} from '../services/storageService';
import { DEFAULT_ADMIN_CREDENTIALS, SCHOOL_INFO } from '../data/initialData';
import { LoginModal } from './LoginModal';

interface AdminManagementViewProps {
  currentUser: User;
}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'classes' | 'teachers' | 'students' | 'audit'>('sessions');

  const [schoolInfo, setSchoolInfo] = useState(() => getSchoolInfo());
  const [classes, setClasses] = useState<SchoolClass[]>(() => getAllClasses());
  const [teachers, setTeachers] = useState<Teacher[]>(() => getAllTeachers());
  const [sessions, setSessions] = useState<Session[]>(() => getAllSessions());
  const [students, setStudents] = useState<Student[]>(() => getAllStudents());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => getAuditLogs());

  // Login Modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Search & filter
  const [studentSearch, setStudentSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');

  // Academic Year State
  const [academicYearInput, setAcademicYearInput] = useState(schoolInfo.academicYear || '2026/2027');
  const [academicYearSavedMsg, setAcademicYearSavedMsg] = useState(false);

  // Student Form Modal (Add / Edit)
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    nis: '',
    nisn: '',
    gender: 'L' as 'L' | 'P',
    classId: 'cls-7-alkhawarizmi',
    parentName: '',
    parentPhone: '',
  });

  // Session Form Modal (Add / Edit)
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [sessionFormData, setSessionFormData] = useState({
    name: '',
    code: '',
    timeRange: '',
    startTime: '07:30',
    endTime: '09:45',
  });

  // Teacher Form Modal (Add / Edit)
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherFormData, setTeacherFormData] = useState({
    name: '',
    nip: '',
    roleTitle: '',
    phone: '',
    email: '',
    gender: 'L' as 'L' | 'P',
  });

  // Class Form Modal (Add / Edit)
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [classFormData, setClassFormData] = useState({
    name: '',
    grade: '7' as '7' | '8' | '9',
    homeroomTeacherName: '',
    academicYear: '2026/2027',
  });

  const isAdmin = currentUser.role === 'admin';

  // Academic Year Saver
  const handleSaveAcademicYear = () => {
    updateSchoolInfo({ academicYear: academicYearInput });
    setSchoolInfo(getSchoolInfo());
    setAcademicYearSavedMsg(true);
    setTimeout(() => setAcademicYearSavedMsg(false), 3000);
  };

  // Student Actions
  const handleOpenAddStudent = () => {
    setEditingStudent(null);
    setStudentFormData({
      name: '',
      nis: `${Math.floor(260000 + Math.random() * 9999)}`,
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      gender: 'L',
      classId: classes[0]?.id || 'cls-7-alkhawarizmi',
      parentName: '',
      parentPhone: '0812' + Math.floor(10000000 + Math.random() * 90000000),
    });
    setShowStudentModal(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentFormData({
      name: student.name,
      nis: student.nis,
      nisn: student.nisn,
      gender: student.gender,
      classId: student.classId,
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
    });
    setShowStudentModal(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormData.name.trim() || !studentFormData.nis.trim()) {
      alert('Nama dan NIS wajib diisi.');
      return;
    }

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        ...studentFormData,
      });
    } else {
      addStudent(studentFormData);
    }

    setStudents(getAllStudents());
    setShowStudentModal(false);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Hapus data siswa "${name}"?`)) {
      deleteStudent(id);
      setStudents(getAllStudents());
    }
  };

  // Session Actions
  const handleOpenAddSession = () => {
    setEditingSession(null);
    setSessionFormData({
      name: '',
      code: `SESI-${sessions.length + 1}`,
      timeRange: '13:00 - 14:30 WIB',
      startTime: '13:00',
      endTime: '14:30',
    });
    setShowSessionModal(true);
  };

  const handleOpenEditSession = (ses: Session) => {
    setEditingSession(ses);
    setSessionFormData({
      name: ses.name,
      code: ses.code,
      timeRange: ses.timeRange,
      startTime: ses.startTime || '07:30',
      endTime: ses.endTime || '09:45',
    });
    setShowSessionModal(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionFormData.name.trim() || !sessionFormData.timeRange.trim()) {
      alert('Nama dan Waktu Sesi wajib diisi.');
      return;
    }

    if (editingSession) {
      updateSession({
        ...editingSession,
        ...sessionFormData,
      });
    } else {
      addSession(sessionFormData);
    }

    setSessions(getAllSessions());
    setShowSessionModal(false);
  };

  const handleDeleteSession = (id: string, name: string) => {
    if (window.confirm(`Hapus jadwal sesi "${name}"?`)) {
      deleteSession(id);
      setSessions(getAllSessions());
    }
  };

  // Teacher Actions
  const handleOpenAddTeacher = () => {
    setEditingTeacher(null);
    setTeacherFormData({
      name: '',
      nip: `19${Math.floor(800000 + Math.random() * 190000)} 202001 ${Math.floor(1 + Math.random() * 2)} 00${teachers.length + 1}`,
      roleTitle: 'Guru Pengajar',
      phone: '08123456000' + (teachers.length + 1),
      email: 'guru' + (teachers.length + 1) + '@smpalam-excellentia.sch.id',
      gender: 'L',
    });
    setShowTeacherModal(true);
  };

  const handleOpenEditTeacher = (tch: Teacher) => {
    setEditingTeacher(tch);
    setTeacherFormData({
      name: tch.name,
      nip: tch.nip,
      roleTitle: tch.roleTitle,
      phone: tch.phone,
      email: tch.email,
      gender: tch.gender,
    });
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherFormData.name.trim() || !teacherFormData.nip.trim()) {
      alert('Nama Guru dan NIP wajib diisi.');
      return;
    }

    if (editingTeacher) {
      updateTeacher({
        ...editingTeacher,
        ...teacherFormData,
      });
    } else {
      addTeacher(teacherFormData);
    }

    setTeachers(getAllTeachers());
    setShowTeacherModal(false);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (window.confirm(`Hapus data guru "${name}"?`)) {
      deleteTeacher(id);
      setTeachers(getAllTeachers());
    }
  };

  // Class Actions
  const handleOpenAddClass = () => {
    setEditingClass(null);
    setClassFormData({
      name: 'Kelas VII (Baru)',
      grade: '7',
      homeroomTeacherName: teachers[0]?.name || 'MOH. BADRIT TAMAM, S.Mat',
      academicYear: academicYearInput,
    });
    setShowClassModal(true);
  };

  const handleOpenEditClass = (cls: SchoolClass) => {
    setEditingClass(cls);
    setClassFormData({
      name: cls.name,
      grade: cls.grade,
      homeroomTeacherName: cls.homeroomTeacherName,
      academicYear: cls.academicYear,
    });
    setShowClassModal(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormData.name.trim()) {
      alert('Nama Kelas wajib diisi.');
      return;
    }

    if (editingClass) {
      updateClass({
        ...editingClass,
        ...classFormData,
      });
    } else {
      addClass(classFormData);
    }

    setClasses(getAllClasses());
    setShowClassModal(false);
  };

  const handleDeleteClass = (id: string, name: string) => {
    if (window.confirm(`Hapus data kelas "${name}"?`)) {
      deleteClass(id);
      setClasses(getAllClasses());
    }
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Kembalikan seluruh data sistem ke contoh awal master SMP Alam Excellentia? Seluruh catatan absensi dan konfigurasi baru akan direset.'
      )
    ) {
      resetToDemoData();
      setSchoolInfo(getSchoolInfo());
      setClasses(getAllClasses());
      setTeachers(getAllTeachers());
      setSessions(getAllSessions());
      setStudents(getAllStudents());
      setAuditLogs(getAuditLogs());
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (filterClass !== 'all' && s.classId !== filterClass) return false;
      if (studentSearch) {
        return (
          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.nis.includes(studentSearch)
        );
      }
      return true;
    });
  }, [students, filterClass, studentSearch]);

  return (
    <div className="space-y-6">
      {/* Top Admin Notice / Login Bar */}
      <div
        className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isAdmin
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/90 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isAdmin ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                {isAdmin
                  ? 'Akses Administrator Utama Aktif'
                  : `Anda masuk sebagai: ${currentUser.name}`}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isAdmin ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                }`}
              >
                {isAdmin ? 'Admin Master' : currentUser.roleLabel}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isAdmin
                ? `Akun: ${currentUser.email} • Berwenang penuh mengubah nama, jam sekolah, kelas, dan tahun pelajaran.`
                : 'Masuk dengan kredensial Admin Utama untuk mengubah master data sekolah.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {!isAdmin && (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              Login Akun Admin
            </button>
          )}

          {isAdmin && (
            <span className="text-xs font-semibold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Hak Kelola Penuh</span>
            </span>
          )}
        </div>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={SCHOOL_INFO.logoUrl}
            alt="Logo SMP Alam Excellentia"
            className="w-14 h-14 object-contain shrink-0 drop-shadow-xs"
          />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Panel Kelola Master Data • {SCHOOL_INFO.appName}
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {SCHOOL_INFO.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {SCHOOL_INFO.address} • Tahun Pelajaran {schoolInfo.academicYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'students' && (
            <button
              onClick={handleOpenAddStudent}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Siswa</span>
            </button>
          )}

          {activeTab === 'sessions' && (
            <button
              onClick={handleOpenAddSession}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sesi</span>
            </button>
          )}

          {activeTab === 'teachers' && (
            <button
              onClick={handleOpenAddTeacher}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Guru</span>
            </button>
          )}

          {activeTab === 'classes' && (
            <button
              onClick={handleOpenAddClass}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kelas</span>
            </button>
          )}

          <button
            onClick={handleResetData}
            title="Reset ke data awal"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'sessions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Jam Sekolah & Tahun Pelajaran ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('teachers')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'teachers'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Dewan Guru (5 Guru)</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'classes'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Data Kelas & Wali ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'students'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Data Siswa ({students.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('audit');
            setAuditLogs(getAuditLogs());
          }}
          className={`pb-3 px-3 text-xs font-bold transition flex items-center gap-2 cursor-pointer border-b-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Riwayat & Audit ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab: Jam Sekolah & Tahun Pelajaran (Sessions) */}
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          {/* Card Pengaturan Tahun Pelajaran */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Pengaturan Tahun Pelajaran Berjalan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Admin dapat menyesuaikan periode tahun ajaran baru sekolah setiap kali pergantian semester/tahun.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={academicYearInput}
                  onChange={(e) => setAcademicYearInput(e.target.value)}
                  placeholder="2026/2027"
                  className="text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveAcademicYear}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </div>

            {academicYearSavedMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tahun pelajaran berhasil diperbarui ke: <strong>{academicYearInput}</strong></span>
              </div>
            )}
          </div>

          {/* List of Sessions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Jadwal Jam Absensi & Sesi Pembelajaran SMP Alam Excellentia</span>
              </h3>
              <span className="text-xs text-slate-500">
                Waktu Indonesia Barat (WIB)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.map((ses) => (
                <div
                  key={ses.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between gap-3 hover:border-blue-300 transition"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase font-mono">
                        {ses.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        {ses.timeRange}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-2">
                      {ses.name}
                    </h4>

                    {ses.startTime && ses.endTime && (
                      <p className="text-xs text-slate-500 font-mono">
                        Pukul: {ses.startTime} - {ses.endTime} WIB
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">ID: {ses.id}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditSession(ses)}
                        className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
                        title="Edit jam sesi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Jam</span>
                      </button>
                      {sessions.length > 1 && (
                        <button
                          onClick={() => handleDeleteSession(ses.id, ses.name)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Hapus sesi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Dewan Guru (5 Guru) */}
      {activeTab === 'teachers' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>Aturan Penamaan Dewan Guru:</strong> Huruf kapital semua KECUALI di gelarnya (seperti M.Pd, S.Mat, S.Pd). Pastikan konsistensi nama guru saat mengubah atau menambahkan data pengajar baru.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((t: Teacher) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      t.roleTitle.includes('Kepala Sekolah')
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}
                  >
                    {t.roleTitle.includes('Kepala Sekolah') ? 'Pimpinan Sekolah' : 'Pendidik'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    NIP: {t.nip}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {t.roleTitle}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Kontak WA/HP:</span>
                    <span className="font-mono text-slate-800">{t.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Email:</span>
                    <span className="text-blue-600 truncate max-w-[170px]">{t.email}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEditTeacher(t)}
                    className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Guru</span>
                  </button>
                  {teachers.length > 5 && (
                    <button
                      onClick={() => handleDeleteTeacher(t.id, t.name)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Classes Management */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const classStudents = students.filter((s) => s.classId === cls.id);
            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 space-y-3 hover:border-blue-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    Tingkat {cls.grade}
                  </span>
                  <span className="text-xs text-slate-400">TA {cls.academicYear}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{cls.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Wali Kelas: <strong className="text-slate-800">{cls.homeroomTeacherName}</strong>
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Total Siswa Terdaftar:</span>
                  <span className="font-bold text-slate-900">{classStudents.length} Siswa</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEditClass(cls)}
                    className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Kelas & Wali</span>
                  </button>
                  {classes.length > 3 && (
                    <button
                      onClick={() => handleDeleteClass(cls.id, cls.name)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Students Management */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama atau NIS siswa..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Kelas:</span>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="all">Semua Kelas</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3.5">NIS / NISN</th>
                  <th className="p-3.5">Nama Lengkap</th>
                  <th className="p-3.5">Gender</th>
                  <th className="p-3.5">Kelas</th>
                  <th className="p-3.5">Wali Murid</th>
                  <th className="p-3.5">No. HP Orang Tua</th>
                  <th className="p-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((s) => {
                  const cls = classes.find((c) => c.id === s.classId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3.5 font-mono text-slate-500">
                        <div className="font-semibold text-slate-800">{s.nis}</div>
                        <div className="text-[10px] text-slate-400">{s.nisn}</div>
                      </td>
                      <td className="p-3.5 font-bold text-slate-900">{s.name}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.gender === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'
                          }`}
                        >
                          {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{cls?.name || s.classId}</td>
                      <td className="p-3.5 text-slate-600">{s.parentName || '-'}</td>
                      <td className="p-3.5 text-slate-500 font-mono">{s.parentPhone || '-'}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditStudent(s)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="Edit data siswa"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(s.id, s.name)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Hapus siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Audit Trail Log (PRD 5) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900">Audit Trail Riwayat Aktivitas & Perubahan Data</span>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Mencatat setiap pembuatan draf, pengiriman, perbaikan catatan, login, dan sinkronisasi data PWA.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Belum ada aktivitas tercatat.
              </div>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 hover:bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.action === 'SUBMIT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'CREATE_DRAFT'
                            ? 'bg-amber-100 text-amber-800'
                            : log.action === 'SYNC'
                            ? 'bg-blue-100 text-blue-800'
                            : log.action === 'CONFLICT_RESOLVED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="font-bold text-slate-800">{log.userName}</span>
                      <span className="text-slate-400">({log.userRole})</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <strong>{log.className}</strong> • {log.date}
                  </div>
                  <div className="text-slate-500 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {log.details}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden text-slate-800">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={studentFormData.name}
                  onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS (Nomor Induk)</label>
                  <input
                    type="text"
                    required
                    value={studentFormData.nis}
                    onChange={(e) => setStudentFormData({ ...studentFormData, nis: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN Nasional</label>
                  <input
                    type="text"
                    value={studentFormData.nisn}
                    onChange={(e) => setStudentFormData({ ...studentFormData, nisn: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={studentFormData.gender}
                    onChange={(e) => setStudentFormData({ ...studentFormData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={studentFormData.classId}
                    onChange={(e) => setStudentFormData({ ...studentFormData, classId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                <input
                  type="text"
                  value={studentFormData.parentName}
                  onChange={(e) => setStudentFormData({ ...studentFormData, parentName: e.target.value })}
                  placeholder="Nama orang tua/wali siswa"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp / HP Wali</label>
                <input
                  type="text"
                  value={studentFormData.parentPhone}
                  onChange={(e) => setStudentFormData({ ...studentFormData, parentPhone: e.target.value })}
                  placeholder="0812xxxxxxx"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  {editingStudent ? 'Perbarui Data' : 'Simpan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden text-slate-800">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                {editingSession ? 'Edit Jam Sesi' : 'Tambah Sesi Baru'}
              </h3>
              <button
                onClick={() => setShowSessionModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Sesi</label>
                <input
                  type="text"
                  required
                  value={sessionFormData.name}
                  onChange={(e) => setSessionFormData({ ...sessionFormData, name: e.target.value })}
                  placeholder="Contoh: Sesi Pagi (Jam 1-3)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Sesi</label>
                  <input
                    type="text"
                    required
                    value={sessionFormData.code}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, code: e.target.value })}
                    placeholder="SESI-1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rentang Jam (Label)</label>
                  <input
                    type="text"
                    required
                    value={sessionFormData.timeRange}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, timeRange: e.target.value })}
                    placeholder="07:30 - 09:45 WIB"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={sessionFormData.startTime}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, startTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={sessionFormData.endTime}
                    onChange={(e) => setSessionFormData({ ...sessionFormData, endTime: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Simpan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden text-slate-800">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                {editingTeacher ? 'Edit Data Dewan Guru' : 'Tambah Guru Baru'}
              </h3>
              <button
                onClick={() => setShowTeacherModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Guru (Kapital, Gelar Disesuaikan)
                </label>
                <input
                  type="text"
                  required
                  value={teacherFormData.name}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, name: e.target.value })}
                  placeholder="Contoh: MOH. BADRIT TAMAM, S.Mat"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Format: Huruf kapital semua kecuali di gelar (misal: S.Pd, M.Pd, S.Mat).
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIP Pegawai</label>
                  <input
                    type="text"
                    required
                    value={teacherFormData.nip}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, nip: e.target.value })}
                    placeholder="19820514 200604 1 001"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={teacherFormData.gender}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jabatan & Tugas</label>
                <input
                  type="text"
                  required
                  value={teacherFormData.roleTitle}
                  onChange={(e) => setTeacherFormData({ ...teacherFormData, roleTitle: e.target.value })}
                  placeholder="Contoh: Wali Kelas VII (Al-Khawarizmi) / Guru Matematika"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP / WA</label>
                  <input
                    type="text"
                    value={teacherFormData.phone}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, phone: e.target.value })}
                    placeholder="081234560001"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Sekolah</label>
                  <input
                    type="email"
                    value={teacherFormData.email}
                    onChange={(e) => setTeacherFormData({ ...teacherFormData, email: e.target.value })}
                    placeholder="nama@smpalam-excellentia.sch.id"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden text-slate-800">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                {editingClass ? 'Edit Data Kelas & Wali' : 'Tambah Kelas Baru'}
              </h3>
              <button
                onClick={() => setShowClassModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kelas</label>
                <input
                  type="text"
                  required
                  value={classFormData.name}
                  onChange={(e) => setClassFormData({ ...classFormData, name: e.target.value })}
                  placeholder="Contoh: Kelas VII (Al-Khawarizmi)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat</label>
                  <select
                    value={classFormData.grade}
                    onChange={(e) => setClassFormData({ ...classFormData, grade: e.target.value as '7' | '8' | '9' })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={classFormData.academicYear}
                    onChange={(e) => setClassFormData({ ...classFormData, academicYear: e.target.value })}
                    placeholder="2026/2027"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Wali Kelas</label>
                <select
                  value={classFormData.homeroomTeacherName}
                  onChange={(e) => setClassFormData({ ...classFormData, homeroomTeacherName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.roleTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Simpan Data Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        currentUser={currentUser}
        onLoginSuccess={() => {
          setShowLoginModal(false);
        }}
      />
    </div>
  );
};
