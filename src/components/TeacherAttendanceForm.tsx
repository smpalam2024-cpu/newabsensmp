import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Save,
  Send,
  Sparkles,
  MessageSquare,
  Search,
  RotateCcw,
  History,
  Check,
  Briefcase,
  ShieldAlert,
} from 'lucide-react';
import {
  AttendanceStatus,
  Teacher,
  TeacherAttendanceEntry,
  TeacherAttendanceRecord,
  User,
} from '../types';
import { STATUS_CONFIG } from '../data/initialData';
import {
  getAllTeachers,
  getAllTeacherAttendanceRecords,
  findExistingTeacherRecord,
  saveTeacherAttendanceRecord,
} from '../services/storageService';

interface TeacherAttendanceFormProps {
  currentUser: User;
  isOnline: boolean;
  onOpenSyncQueue: () => void;
}

export const TeacherAttendanceForm: React.FC<TeacherAttendanceFormProps> = ({
  currentUser,
  isOnline,
  onOpenSyncQueue,
}) => {
  const teachers = useMemo(() => getAllTeachers(), []);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const selectedSessionId = 'sesi-harian-guru';

  // Search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>('all');

  // Check if existing record exists for this date
  const existingRecord = useMemo(() => {
    return findExistingTeacherRecord(selectedDate, selectedSessionId);
  }, [selectedDate, selectedSessionId]);

  // Form entries: teacherId -> TeacherAttendanceEntry
  const [entries, setEntries] = useState<Record<string, TeacherAttendanceEntry>>({});
  const [activeNoteTeacherId, setActiveNoteTeacherId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Save feedback notification
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<{
    text: string;
    wasOffline: boolean;
    syncedAt?: string;
  } | null>(null);

  useEffect(() => {
    if (existingRecord) {
      setEntries(existingRecord.entries);
    } else {
      setEntries({});
    }
    setSaveSuccessMessage(null);
  }, [selectedDate, existingRecord]);

  // Set status for a teacher
  const handleSetStatus = (teacherId: string, status: AttendanceStatus) => {
    setEntries((prev) => {
      const existing = prev[teacherId];
      const defaultTime = status === 'hadir' ? '07:15' : status === 'terlambat' ? '07:45' : undefined;
      return {
        ...prev,
        [teacherId]: {
          teacherId,
          status,
          checkInTime: existing?.checkInTime || defaultTime,
          checkOutTime: existing?.checkOutTime || (status === 'hadir' || status === 'terlambat' ? '15:00' : undefined),
          note: existing?.note || '',
          recordedAt: new Date().toISOString(),
        },
      };
    });
  };

  // Set time
  const handleSetTime = (teacherId: string, field: 'checkInTime' | 'checkOutTime', value: string) => {
    setEntries((prev) => {
      const existing = prev[teacherId] || {
        teacherId,
        status: 'hadir',
        recordedAt: new Date().toISOString(),
      };
      return {
        ...prev,
        [teacherId]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  // Mark all teachers present in 1 tap
  const handleMarkAllHadir = () => {
    const now = new Date().toISOString();
    const updated: Record<string, TeacherAttendanceEntry> = {};
    teachers.forEach((t) => {
      updated[t.id] = {
        teacherId: t.id,
        status: 'hadir',
        checkInTime: entries[t.id]?.checkInTime || '07:15',
        checkOutTime: entries[t.id]?.checkOutTime || '15:00',
        note: entries[t.id]?.note || '',
        recordedAt: now,
      };
    });
    setEntries(updated);
  };

  // Reset
  const handleReset = () => {
    if (window.confirm('Reset isian kehadiran dewan guru pada tanggal ini?')) {
      setEntries({});
    }
  };

  // Note dialog handlers
  const handleOpenNote = (teacherId: string) => {
    setActiveNoteTeacherId(teacherId);
    setTempNoteText(entries[teacherId]?.note || '');
  };

  const handleSaveNote = () => {
    if (activeNoteTeacherId) {
      setEntries((prev) => {
        const curr = prev[activeNoteTeacherId] || {
          teacherId: activeNoteTeacherId,
          status: 'hadir',
          recordedAt: new Date().toISOString(),
        };
        return {
          ...prev,
          [activeNoteTeacherId]: {
            ...curr,
            note: tempNoteText.trim(),
          },
        };
      });
      setActiveNoteTeacherId(null);
    }
  };

  // Live summary
  const summary = useMemo(() => {
    let hadir = 0;
    let terlambat = 0;
    let izin = 0;
    let sakit = 0;
    let alpa = 0;

    teachers.forEach((t) => {
      const e = entries[t.id];
      if (!e) return;
      if (e.status === 'hadir') hadir++;
      else if (e.status === 'terlambat') terlambat++;
      else if (e.status === 'izin') izin++;
      else if (e.status === 'sakit') sakit++;
      else if (e.status === 'alpa') alpa++;
    });

    const total = teachers.length;
    const filledCount = hadir + terlambat + izin + sakit + alpa;
    const percentage = total > 0 ? Math.round(((hadir + terlambat) / total) * 1000) / 10 : 0;

    return {
      total,
      filledCount,
      hadir,
      terlambat,
      izin,
      sakit,
      alpa,
      percentage,
    };
  }, [teachers, entries]);

  // Execute Save
  const executeSave = (isFinalSubmit: boolean) => {
    const recordId = existingRecord?.id || `rec-teacher-${selectedDate}-harian`;
    const now = new Date().toISOString();

    const finalEntries: Record<string, TeacherAttendanceEntry> = { ...entries };
    if (isFinalSubmit) {
      teachers.forEach((t) => {
        if (!finalEntries[t.id]?.status) {
          finalEntries[t.id] = {
            teacherId: t.id,
            status: 'hadir',
            checkInTime: '06:50',
            checkOutTime: '14:30',
            note: '',
            recordedAt: now,
          };
        }
      });
    }

    let h = 0, t = 0, i = 0, s = 0, a = 0;
    Object.values(finalEntries).forEach((e) => {
      if (e.status === 'hadir') h++;
      else if (e.status === 'terlambat') t++;
      else if (e.status === 'izin') i++;
      else if (e.status === 'sakit') s++;
      else if (e.status === 'alpa') a++;
    });
    const tot = teachers.length;
    const pct = tot > 0 ? Math.round(((h + t) / tot) * 1000) / 10 : 0;

    const recordToSave = {
      id: recordId,
      date: selectedDate,
      sessionId: selectedSessionId,
      status: (isFinalSubmit ? 'submitted' : 'draft') as 'draft' | 'submitted',
      entries: finalEntries,
      summary: {
        total: tot,
        hadir: h,
        terlambat: t,
        izin: i,
        sakit: s,
        alpa: a,
        percentage: pct,
      },
      createdByUserId: currentUser.id,
      createdByUserName: currentUser.name,
      createdRole: currentUser.role,
      createdAt: existingRecord?.createdAt || now,
      updatedAt: now,
    };

    const res = saveTeacherAttendanceRecord(recordToSave, isOnline);
    setEntries(finalEntries);
    setSaveSuccessMessage({
      text: res.message,
      wasOffline: res.wasOffline,
      syncedAt: res.record.syncedAt,
    });
  };

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.nip.includes(searchQuery);

      if (!matchSearch) return false;
      if (statusFilter === 'all') return true;
      return entries[t.id]?.status === statusFilter;
    });
  }, [teachers, searchQuery, statusFilter, entries]);

  return (
    <div className="space-y-6 pb-24">
      {/* Save Notification */}
      {saveSuccessMessage && (
        <div className={`p-4 rounded-xl shadow-xs border flex items-start justify-between gap-3 animate-in fade-in ${
          saveSuccessMessage.wasOffline
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 ${saveSuccessMessage.wasOffline ? 'text-amber-600' : 'text-emerald-600'}`} />
            <div>
              <div className="font-bold text-sm">{saveSuccessMessage.text}</div>
              <div className="text-xs opacity-90 mt-0.5">
                {saveSuccessMessage.wasOffline
                  ? 'Catatan tersimpan lokal di perangkat dan siap disinkronkan saat terhubung kembali.'
                  : `Waktu Sinkronisasi: ${new Date(saveSuccessMessage.syncedAt || Date.now()).toLocaleTimeString('id-ID')} WIB`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSaveSuccessMessage(null)}
            className="text-xs font-semibold px-2 py-1 rounded hover:bg-black/5"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Header Selector Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/1713909500616_5b14171f.png"
              alt="Logo SMP Alam Excellentia"
              className="w-12 h-12 object-contain shrink-0 drop-shadow-xs"
            />
            <div>
              <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                SMP ALAM EXCELLENTIA PAMEKASAN
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Absensi Kehadiran Dewan Guru & Tenaga Pendidik
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan presensi harian untuk 5 guru & tenaga pendidik sekolah.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              onClick={() => {
                const y = new Date();
                y.setDate(y.getDate() - 1);
                setSelectedDate(y.toISOString().split('T')[0]);
              }}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              Kemarin
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Tanggal Presensi Guru
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-sm font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Jenis Absensi
            </label>
            <div className="text-sm font-medium px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700">
              Presensi Harian Lengkap (Jam Masuk & Jam Pulang)
            </div>
          </div>
        </div>

        {/* Existing Record Indicator */}
        {existingRecord ? (
          <div className="mt-4 p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <History className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <span>Presensi Guru Tanggal Ini Sudah Pernah Dicatat</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    existingRecord.status === 'submitted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {existingRecord.status === 'submitted' ? 'Final Dikirim' : 'Draf'}
                  </span>
                </div>
                <div className="text-indigo-800 mt-0.5 text-[11px]">
                  Dicatat oleh <strong>{existingRecord.createdByUserName}</strong> • Revisi #{existingRecord.revision}. Perubahan Anda akan memperbarui data ini.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Presensi baru untuk dewan guru pada tanggal ini siap diisi.</span>
          </div>
        )}
      </div>

      {/* Summary Stats Header Bar & Quick Actions */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Statistik Kehadiran Guru: {summary.filledCount}/{summary.total} Terisi ({summary.percentage}% Hadir)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllHadir}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tandai Semua Hadir
            </button>
            <button
              onClick={handleReset}
              title="Reset Pilihan"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <button
            onClick={() => setStatusFilter(statusFilter === 'hadir' ? 'all' : 'hadir')}
            className={`p-2.5 rounded-xl border transition text-left cursor-pointer ${
              statusFilter === 'hadir'
                ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-400'
                : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/60'
            }`}
          >
            <div className="text-[11px] text-emerald-800 font-medium">Hadir (H)</div>
            <div className="text-lg font-bold text-emerald-700">{summary.hadir}</div>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'terlambat' ? 'all' : 'terlambat')}
            className={`p-2.5 rounded-xl border transition text-left cursor-pointer ${
              statusFilter === 'terlambat'
                ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400'
                : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/60'
            }`}
          >
            <div className="text-[11px] text-amber-800 font-medium">Terlambat (T)</div>
            <div className="text-lg font-bold text-amber-700">{summary.terlambat}</div>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'izin' ? 'all' : 'izin')}
            className={`p-2.5 rounded-xl border transition text-left cursor-pointer ${
              statusFilter === 'izin'
                ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-400'
                : 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/60'
            }`}
          >
            <div className="text-[11px] text-blue-800 font-medium">Izin (I)</div>
            <div className="text-lg font-bold text-blue-700">{summary.izin}</div>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'sakit' ? 'all' : 'sakit')}
            className={`p-2.5 rounded-xl border transition text-left cursor-pointer ${
              statusFilter === 'sakit'
                ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-400'
                : 'bg-purple-50/70 border-purple-200 hover:bg-purple-100/60'
            }`}
          >
            <div className="text-[11px] text-purple-800 font-medium">Sakit (S)</div>
            <div className="text-lg font-bold text-purple-700">{summary.sakit}</div>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'alpa' ? 'all' : 'alpa')}
            className={`p-2.5 rounded-xl border transition text-left cursor-pointer ${
              statusFilter === 'alpa'
                ? 'bg-rose-100 border-rose-500 ring-2 ring-rose-400'
                : 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/60'
            }`}
          >
            <div className="text-[11px] text-rose-800 font-medium">Alpa (A)</div>
            <div className="text-lg font-bold text-rose-700">{summary.alpa}</div>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama guru atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
          <span>Daftar Guru & Tenaga Kependidikan ({filteredTeachers.length} Guru)</span>
          <span className="hidden sm:inline">Status & Jam Masuk</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTeachers.map((teacher, idx) => {
            const currentEntry = entries[teacher.id];
            const currentStatus = currentEntry?.status;
            const hasNote = Boolean(currentEntry?.note);

            return (
              <div
                key={teacher.id}
                className={`p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  currentStatus ? 'bg-white' : 'bg-slate-50/50'
                }`}
              >
                {/* Teacher details */}
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-xs font-mono font-semibold text-slate-400 w-6 pt-1 text-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {teacher.name}
                      </span>
                      {teacher.roleTitle.includes('Kepala Sekolah') ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-100 text-indigo-800">
                          Kepala Sekolah
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-700">
                          Guru
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {teacher.roleTitle}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      NIP: {teacher.nip}
                    </div>

                    {hasNote && (
                      <div className="mt-1.5 text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-blue-100">
                        <MessageSquare className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate max-w-xs">{currentEntry?.note}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Time inputs & Status buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-end sm:self-auto shrink-0">
                  {/* Jam Masuk / Jam Pulang */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                      <span className="text-slate-400 text-[10px]">Masuk:</span>
                      <input
                        type="time"
                        value={currentEntry?.checkInTime || '06:50'}
                        onChange={(e) => handleSetTime(teacher.id, 'checkInTime', e.target.value)}
                        className="font-mono text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                      <span className="text-slate-400 text-[10px]">Pulang:</span>
                      <input
                        type="time"
                        value={currentEntry?.checkOutTime || '14:30'}
                        onChange={(e) => handleSetTime(teacher.id, 'checkOutTime', e.target.value)}
                        className="font-mono text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Status buttons */}
                  <div className="flex items-center gap-1.5">
                    {(['hadir', 'terlambat', 'izin', 'sakit', 'alpa'] as AttendanceStatus[]).map((st) => {
                      const cfg = STATUS_CONFIG[st];
                      const isSelected = currentStatus === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleSetStatus(teacher.id, st)}
                          title={`${cfg.label} - ${cfg.desc}`}
                          className={`w-9 h-9 sm:w-10 sm:h-9 rounded-xl font-bold text-xs flex items-center justify-center transition active:scale-90 cursor-pointer ${
                            isSelected
                              ? `${cfg.bg} text-white shadow-sm ring-2 ring-offset-1 ${cfg.border}`
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {cfg.badge}
                        </button>
                      );
                    })}

                    {/* Catatan / Keterangan */}
                    <button
                      onClick={() => handleOpenNote(teacher.id)}
                      title={hasNote ? `Ubah catatan: ${currentEntry?.note}` : 'Tambah catatan dinas / izin'}
                      className={`h-9 px-2.5 rounded-xl border text-xs font-medium flex items-center gap-1 transition cursor-pointer ${
                        hasNote
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">{hasNote ? 'Catatan' : '+Ket'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Note Dialog Modal */}
      {activeNoteTeacherId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 text-slate-800">
            <h3 className="font-bold text-sm text-slate-900 mb-1">
              Tambah Keterangan Presensi Guru
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Guru: <strong>{teachers.find((t) => t.id === activeNoteTeacherId)?.name}</strong>
            </p>

            <textarea
              rows={3}
              value={tempNoteText}
              onChange={(e) => setTempNoteText(e.target.value)}
              placeholder="Contoh: Mengikuti rapat dinas luar di Dinas Pendidikan / Izin keperluan keluarga / Sakit flu..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveNoteTeacherId(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer"
              >
                Simpan Keterangan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 flex items-center gap-3">
            <span className="font-semibold text-slate-800">
              Dewan Guru SMP Alam Excellentia • {selectedDate}
            </span>
            <span className="hidden sm:inline">|</span>
            <span className="text-slate-500">
              Terisi: <strong>{summary.filledCount}</strong> dari {summary.total} guru
            </span>
            <span className="hidden md:inline text-emerald-600 font-semibold">
              ({summary.percentage}% Hadir)
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => executeSave(false)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              Simpan Draf Guru
            </button>

            <button
              onClick={() => executeSave(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Presensi Guru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
