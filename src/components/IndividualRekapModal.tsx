import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Phone,
  Mail,
  ShieldCheck,
  Award,
} from 'lucide-react';
import {
  Student,
  Teacher,
  AttendanceRecord,
  TeacherAttendanceRecord,
  SchoolClass,
  Session,
} from '../types';
import { STATUS_CONFIG, SCHOOL_INFO } from '../data/initialData';

interface IndividualRekapModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'student' | 'teacher';
  student?: Student;
  teacher?: Teacher;
  studentClass?: SchoolClass;
  allSessions: Session[];
  allStudentRecords: AttendanceRecord[];
  allTeacherRecords: TeacherAttendanceRecord[];
}

export const IndividualRekapModal: React.FC<IndividualRekapModalProps> = ({
  isOpen,
  onClose,
  type,
  student,
  teacher,
  studentClass,
  allSessions,
  allStudentRecords,
  allTeacherRecords,
}) => {
  const [filterMonth, setFilterMonth] = useState<string>('all');

  if (!isOpen) return null;
  if (type === 'student' && !student) return null;
  if (type === 'teacher' && !teacher) return null;

  // Student Attendance History
  const studentHistory = useMemo(() => {
    if (type !== 'student' || !student) return [];
    return allStudentRecords
      .filter((rec) => {
        const entry = rec.entries[student.id];
        if (!entry) return false;
        if (filterMonth !== 'all') {
          return rec.date.startsWith(filterMonth);
        }
        return true;
      })
      .map((rec) => {
        const entry = rec.entries[student.id];
        const session = allSessions.find((s) => s.id === rec.sessionId);
        return {
          id: rec.id,
          date: rec.date,
          sessionId: rec.sessionId,
          sessionName: session?.name || rec.sessionId,
          timeRange: session?.timeRange || '',
          status: entry.status,
          note: entry.note,
          recordedAt: entry.recordedAt,
          recordedBy: rec.createdByUserName,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [type, student, allStudentRecords, filterMonth, allSessions]);

  // Teacher Attendance History
  const teacherHistory = useMemo(() => {
    if (type !== 'teacher' || !teacher) return [];
    return allTeacherRecords
      .filter((rec) => {
        const entry = rec.entries[teacher.id];
        if (!entry) return false;
        if (filterMonth !== 'all') {
          return rec.date.startsWith(filterMonth);
        }
        return true;
      })
      .map((rec) => {
        const entry = rec.entries[teacher.id];
        const session = allSessions.find((s) => s.id === rec.sessionId);
        return {
          id: rec.id,
          date: rec.date,
          sessionId: rec.sessionId,
          sessionName: session?.name || 'Presensi Harian',
          status: entry.status,
          checkInTime: entry.checkInTime,
          checkOutTime: entry.checkOutTime,
          note: entry.note,
          recordedAt: entry.recordedAt,
          recordedBy: rec.createdByUserName,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [type, teacher, allTeacherRecords, filterMonth, allSessions]);

  // Calculate Metrics
  const historyList = type === 'student' ? studentHistory : teacherHistory;
  const total = historyList.length;
  const hadir = historyList.filter((h) => h.status === 'hadir').length;
  const terlambat = historyList.filter((h) => h.status === 'terlambat').length;
  const izin = historyList.filter((h) => h.status === 'izin').length;
  const sakit = historyList.filter((h) => h.status === 'sakit').length;
  const alpa = historyList.filter((h) => h.status === 'alpa').length;

  const attendanceRate =
    total > 0 ? Math.round(((hadir + terlambat) / total) * 1000) / 10 : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with School Branding */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <img
              src={SCHOOL_INFO.logoUrl}
              alt="Logo Sekolah"
              className="w-12 h-12 object-contain bg-white rounded-xl p-1 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase tracking-wider">
                  {type === 'student' ? 'Rekapitulasi Siswa' : 'Rekapitulasi Dewan Guru'}
                </span>
                <span className="text-xs text-blue-200">
                  {SCHOOL_INFO.appName}
                </span>
              </div>
              <h2 className="text-xl font-black tracking-tight mt-1">
                {type === 'student' ? student?.name : teacher?.name}
              </h2>
              <p className="text-xs text-blue-200/80">
                {type === 'student'
                  ? `${studentClass?.name || 'Siswa'} • NIS: ${student?.nis}`
                  : `${teacher?.roleTitle} • NIP: ${teacher?.nip}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 cursor-pointer"
              title="Cetak Rekapitulasi Ini"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Identity & Metadata Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {type === 'student' && student && (
              <>
                <div>
                  <span className="text-slate-400 font-medium block">Nomor Induk Siswa</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">{student.nis}</span>
                  <span className="text-[11px] text-slate-500 block">NISN: {student.nisn}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Kelas Terdaftar</span>
                  <span className="font-bold text-blue-700 text-sm">{studentClass?.name || '-'}</span>
                  <span className="text-[11px] text-slate-500 block">Wali: {studentClass?.homeroomTeacherName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Jenis Kelamin</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {student.gender === 'L' ? 'Laki-laki (Ikhwan)' : 'Perempuan (Akhwat)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Kontak Orang Tua / Wali</span>
                  <span className="font-bold text-slate-800 text-sm">{student.parentName || '-'}</span>
                  <span className="text-[11px] text-slate-500 block">{student.parentPhone || '-'}</span>
                </div>
              </>
            )}

            {type === 'teacher' && teacher && (
              <>
                <div>
                  <span className="text-slate-400 font-medium block">Nomor Induk Pegawai</span>
                  <span className="font-bold text-slate-800 font-mono text-sm">{teacher.nip}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Tugas & Jabatan</span>
                  <span className="font-bold text-blue-700 text-sm">{teacher.roleTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Jenis Kelamin</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {teacher.gender === 'L' ? 'Laki-laki (Ustadz)' : 'Perempuan (Ustadzah)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Kontak / Email</span>
                  <span className="font-bold text-slate-800 text-sm">{teacher.phone}</span>
                  <span className="text-[10px] text-slate-500 block truncate">{teacher.email}</span>
                </div>
              </>
            )}
          </div>

          {/* Metric Summary KPI Row */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Statistik Kehadiran Kumulatif</span>
              </h4>
              <div className="text-xs font-bold text-slate-600">
                Total Tercatat: <span className="text-blue-700">{total} Hari/Sesi</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-semibold text-blue-800 block">Tingkat Hadir</span>
                <span className="text-2xl font-black text-blue-700">{attendanceRate}%</span>
                <span className="text-[10px] text-blue-600 block">
                  {attendanceRate >= 85 ? 'Sangat Baik' : 'Perlu Perhatian'}
                </span>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-semibold text-emerald-800 block">Hadir (H)</span>
                <span className="text-2xl font-black text-emerald-600">{hadir}</span>
                <span className="text-[10px] text-emerald-700 block">Tepat waktu</span>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-semibold text-amber-800 block">Terlambat (T)</span>
                <span className="text-2xl font-black text-amber-600">{terlambat}</span>
                <span className="text-[10px] text-amber-700 block">Masuk terlambat</span>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-semibold text-blue-800 block">Izin (I)</span>
                <span className="text-2xl font-black text-blue-600">{izin}</span>
                <span className="text-[10px] text-blue-700 block">Dengan surat</span>
              </div>

              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-semibold text-purple-800 block">Sakit (S)</span>
                <span className="text-2xl font-black text-purple-600">{sakit}</span>
                <span className="text-[10px] text-purple-700 block">Keterangan sakit</span>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3 text-center">
                <span className="text-[11px] font-semibold text-rose-800 block">Alpa (A)</span>
                <span className="text-2xl font-black text-rose-600">{alpa}</span>
                <span className="text-[10px] text-rose-700 block">Tanpa keterangan</span>
              </div>
            </div>
          </div>

          {/* Detailed Chronological History Table */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Riwayat Detail Presensi Harian / Sesi</span>
              </h4>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 font-medium">Bulan:</label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Waktu</option>
                  <option value="2026-10">Oktober 2026</option>
                  <option value="2026-09">September 2026</option>
                  <option value="2026-08">Agustus 2026</option>
                  <option value="2026-07">Juli 2026</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Tanggal</th>
                    <th className="p-3.5">Sesi / Jam</th>
                    <th className="p-3.5 text-center">Status</th>
                    {type === 'teacher' && <th className="p-3.5 text-center">Jam Masuk - Pulang</th>}
                    <th className="p-3.5">Catatan / Alasan</th>
                    <th className="p-3.5">Dicatat Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {historyList.length === 0 ? (
                    <tr>
                      <td colSpan={type === 'teacher' ? 6 : 5} className="p-8 text-center text-slate-400">
                        Belum ada rekaman absensi untuk periode yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    historyList.map((item, idx) => {
                      const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.hadir;
                      return (
                        <tr key={idx} className="hover:bg-slate-50/80 transition">
                          <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="p-3.5 text-slate-600">
                            <div>{item.sessionName}</div>
                            {'timeRange' in item && item.timeRange && (
                              <div className="text-[10px] text-slate-400">{item.timeRange}</div>
                            )}
                          </td>
                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.bg} text-white shadow-2xs`}
                            >
                              <span>{cfg.badge}</span>
                              <span className="hidden sm:inline font-semibold text-[11px]">{cfg.label}</span>
                            </span>
                          </td>
                          {type === 'teacher' && (
                            <td className="p-3.5 text-center font-mono text-slate-700 whitespace-nowrap">
                              {'checkInTime' in item && item.checkInTime ? (
                                <span className="bg-slate-100 px-2 py-0.5 rounded">
                                  {item.checkInTime} - {item.checkOutTime || '15:00'}
                                </span>
                              ) : (
                                '-'
                              )}
                            </td>
                          )}
                          <td className="p-3.5 text-slate-600 max-w-xs">
                            {item.note ? (
                              <span className="italic text-slate-700">"{item.note}"</span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="p-3.5 text-slate-500 whitespace-nowrap">
                            {item.recordedBy}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {SCHOOL_INFO.name} ({SCHOOL_INFO.address})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
