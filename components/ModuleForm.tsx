
import React, { useState } from 'react';
import { ModuleFormData } from '../types';
import { Send, Book, Building2, Target, FileSignature, HeartHandshake, Sparkles, CheckSquare } from 'lucide-react';

interface ModuleFormProps {
  onSubmit: (data: ModuleFormData) => void;
}

const DPL_OPTIONS = [
  "Beriman & Bertakwa",
  "Berakhlak Mulia",
  "Bernalar Kritis",
  "Kreatif",
  "Mandiri",
  "Bergotong Royong",
  "Berkebinekaan Global",
  "Berkeadaban (Ta'addub)"
];

const KBC_OPTIONS = [
  "Cinta Allah",
  "Cinta Ilmu",
  "Cinta Sesama",
  "Cinta Alam",
  "Cinta Bangsa"
];

const SES_OPTIONS = [
  "Kontrol Diri",
  "Tanggung Jawab",
  "Gigih",
  "Optimisme",
  "Empati",
  "Toleransi",
  "Mudah Bergaul"
];

export const ModuleForm: React.FC<ModuleFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ModuleFormData>({
    schoolName: '',
    teacherName: '',
    teacherIdType: 'NIP',
    teacherIdNumber: '',
    subject: '',
    gradeLevel: '',
    semester: '1 (Ganjil)',
    topic: '',
    duration: '',
    meetingCount: '',
    method: 'Problem Based Learning (PBL)',
    materialDetails: '',
    autoGenerateMaterial: false,
    dpl: [], // Initialize as array
    kbcTheme: [], // Initialize as array
    sesPriority: [], // Initialize as array
    insertionMaterial: '',
    autoGenerateInsertion: false,
    city: '',
    date: new Date().toISOString().split('T')[0],
    principalName: '',
    principalIdType: 'NIP',
    principalIdNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' && name !== 'autoGenerateMaterial' && name !== 'autoGenerateInsertion' 
        ? checked 
        : (type === 'checkbox' ? checked : value)
    }));
  };

  // Handler khusus untuk Checkbox Group (Array)
  const handleArrayChange = (name: keyof ModuleFormData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[name] as string[];
      if (checked) {
        return { ...prev, [name]: [...currentArray, value] };
      } else {
        return { ...prev, [name]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana untuk memastikan ada pilihan
    if (formData.dpl.length === 0) {
        alert("Mohon pilih minimal 1 Dimensi Profil Lulusan (DPL).");
        return;
    }
    if (formData.kbcTheme.length === 0) {
        alert("Mohon pilih minimal 1 Tema KBC.");
        return;
    }
    if (formData.sesPriority.length === 0) {
        alert("Mohon pilih minimal 1 SES Prioritas.");
        return;
    }

    onSubmit(formData);
  };

  // Helper class for Inputs
  const inputClass = "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-base bg-white appearance-none";
  const labelClass = "text-sm font-semibold text-slate-700 block";

  // Helper Component untuk Checkbox Group
  const CheckboxGroup = ({ title, options, selected, onChangeName }: { title: string, options: string[], selected: string[], onChangeName: keyof ModuleFormData }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
       <label className={`${labelClass} mb-3 flex items-center gap-2`}>
          <CheckSquare size={16} className="text-brand-600"/>
          {title} <span className="text-xs font-normal text-slate-500">(Boleh pilih lebih dari 1)</span>
       </label>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {options.map((opt) => (
             <label key={opt} className="flex items-center gap-2 p-2 rounded hover:bg-white border border-transparent hover:border-slate-200 transition-all cursor-pointer">
                <input 
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={(e) => handleArrayChange(onChangeName, opt, e.target.checked)}
                  className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                />
                <span className="text-sm text-slate-700">{opt}</span>
             </label>
          ))}
       </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* SECTION 1: IDENTITAS SEKOLAH & GURU */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <Building2 size={20} />
          <h3 className="font-bold text-lg">Identitas Sekolah & Guru</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={`${labelClass} mb-1`}>Nama Sekolah</label>
            <input
              type="text"
              name="schoolName"
              placeholder="Contoh: MTs NU TBS"
              value={formData.schoolName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className={`${labelClass} mb-1`}>Nama Guru Penyusun</label>
            <input
              type="text"
              name="teacherName"
              placeholder="Contoh: Faisal Rohman, S.Pd."
              value={formData.teacherName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Jenis ID Guru</label>
            <div className="relative">
              <select
                name="teacherIdType"
                value={formData.teacherIdType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="NIP">NIP</option>
                <option value="NIPPPK">NIPPPK</option>
                <option value="NIY">NIY</option>
                <option value="NUPTK">NUPTK</option>
                <option value="">- (Tidak Ada)</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Nomor Identitas</label>
            <input
              type="tel"
              inputMode="numeric"
              name="teacherIdNumber"
              placeholder="Contoh: 19800101 200501 1 001"
              value={formData.teacherIdNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: INFORMASI PEMBELAJARAN */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <Book size={20} />
          <h3 className="font-bold text-lg">Detail Pembelajaran</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`${labelClass} mb-1`}>Mata Pelajaran</label>
            <input
              type="text"
              name="subject"
              placeholder="Contoh: IPAS"
              value={formData.subject}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Fase / Kelas</label>
            <select
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Pilih Kelas</option>
              <option value="Fase A (Kelas 1 SD)">Fase A (Kelas 1 SD)</option>
              <option value="Fase A (Kelas 2 SD)">Fase A (Kelas 2 SD)</option>
              <option value="Fase B (Kelas 3 SD)">Fase B (Kelas 3 SD)</option>
              <option value="Fase B (Kelas 4 SD)">Fase B (Kelas 4 SD)</option>
              <option value="Fase C (Kelas 5 SD)">Fase C (Kelas 5 SD)</option>
              <option value="Fase C (Kelas 6 SD)">Fase C (Kelas 6 SD)</option>
              <option value="Fase D (Kelas 7 SMP)">Fase D (Kelas 7 SMP)</option>
              <option value="Fase D (Kelas 8 SMP)">Fase D (Kelas 8 SMP)</option>
              <option value="Fase D (Kelas 9 SMP)">Fase D (Kelas 9 SMP)</option>
              <option value="Fase E (Kelas 10 SMA)">Fase E (Kelas 10 SMA)</option>
              <option value="Fase F (Kelas 11 SMA)">Fase F (Kelas 11 SMA)</option>
              <option value="Fase F (Kelas 12 SMA)">Fase F (Kelas 12 SMA)</option>
            </select>
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Alokasi Waktu</label>
            <input
              type="text"
              name="duration"
              placeholder="Contoh: 2 x 35 Menit"
              value={formData.duration}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Jumlah Pertemuan</label>
            <input
              type="number"
              inputMode="numeric"
              name="meetingCount"
              placeholder="Contoh: 1"
              value={formData.meetingCount}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="1 (Ganjil)">1 (Ganjil)</option>
              <option value="2 (Genap)">2 (Genap)</option>
            </select>
          </div>

           <div>
            <label className={`${labelClass} mb-1`}>Model Pembelajaran</label>
            <select
              name="method"
              value={formData.method}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
              <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
              <option value="Discovery Learning">Discovery Learning</option>
              <option value="Inquiry Learning">Inquiry Learning</option>
              <option value="Pembelajaran Berdiferensiasi">Pembelajaran Berdiferensiasi</option>
              <option value="Flipped Classroom">Flipped Classroom</option>
              <option value="Gamifikasi (Game Based Learning)">Gamifikasi (Game Based Learning)</option>
              <option value="Blended Learning">Blended Learning</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: PENDEKATAN KBC & SES (NEW - CHECKLIST) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <HeartHandshake size={20} />
          <h3 className="font-bold text-lg">Karakter & Nilai (KBC & SES)</h3>
        </div>

        <div className="space-y-4">
          
          <CheckboxGroup 
             title="Dimensi Profil Lulusan (DPL)" 
             options={DPL_OPTIONS} 
             selected={formData.dpl} 
             onChangeName="dpl" 
          />

          <CheckboxGroup 
             title="Tema KBC (Panca Cinta)" 
             options={KBC_OPTIONS} 
             selected={formData.kbcTheme} 
             onChangeName="kbcTheme" 
          />

          <CheckboxGroup 
             title="SES Prioritas (Social Emotional Skills)" 
             options={SES_OPTIONS} 
             selected={formData.sesPriority} 
             onChangeName="sesPriority" 
          />

          <div>
            <div className="flex justify-between items-center mb-1">
               <label className={labelClass}>Materi Insersi / Narasi Nilai</label>
               <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-600 font-bold bg-brand-50 px-2 py-1 rounded hover:bg-brand-100 transition-colors">
                  <input
                    type="checkbox"
                    name="autoGenerateInsertion"
                    checked={formData.autoGenerateInsertion || false}
                    onChange={handleChange}
                    className="accent-brand-600 w-3.5 h-3.5"
                  />
                  <Sparkles size={14} />
                  Biarkan AI Membuatnya
               </label>
            </div>
            <input
              type="text"
              name="insertionMaterial"
              placeholder={formData.autoGenerateInsertion ? "AI akan membuat narasi insersi otomatis..." : "Contoh: Belajar sel = mengagumi kerumitan ciptaan Allah."}
              value={formData.autoGenerateInsertion ? '' : formData.insertionMaterial}
              onChange={handleChange}
              disabled={formData.autoGenerateInsertion}
              className={`${inputClass} ${formData.autoGenerateInsertion ? 'bg-slate-100 text-slate-500 italic' : ''}`}
              required={!formData.autoGenerateInsertion}
            />
            <p className="text-xs text-slate-500 mt-1">Kalimat penghubung yang menyatukan konsep akademis dengan nilai spiritual (KBC).</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: MATERI & TOPIK */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <Target size={20} />
          <h3 className="font-bold text-lg">Materi & Topik</h3>
        </div>

        <div className="space-y-4">
           <div>
            <label className={`${labelClass} mb-1`}>Topik Utama</label>
            <input
              type="text"
              name="topic"
              placeholder="Contoh: Bagian Tubuh Tumbuhan"
              value={formData.topic}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
             <div className="flex justify-between items-center mb-1">
               <label className={labelClass}>Detail Materi</label>
               <label className="flex items-center gap-2 cursor-pointer text-xs text-brand-600 font-bold bg-brand-50 px-2 py-1 rounded hover:bg-brand-100 transition-colors">
                  <input
                    type="checkbox"
                    name="autoGenerateMaterial"
                    checked={formData.autoGenerateMaterial || false}
                    onChange={handleChange}
                    className="accent-brand-600 w-3.5 h-3.5"
                  />
                  <Sparkles size={14} />
                  Biarkan AI Menyusun Materi
               </label>
            </div>
            <textarea
              name="materialDetails"
              rows={4}
              placeholder={formData.autoGenerateMaterial ? "AI akan menyusun poin-poin materi secara lengkap dan mendalam..." : "Masukkan poin-poin materi, tujuan khusus, atau karakteristik siswa..."}
              value={formData.autoGenerateMaterial ? '' : formData.materialDetails}
              onChange={handleChange}
              disabled={formData.autoGenerateMaterial}
              className={`${inputClass} resize-none ${formData.autoGenerateMaterial ? 'bg-slate-100 text-slate-500 italic' : ''}`}
              required={!formData.autoGenerateMaterial}
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: PENGESAHAN */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-brand-700 border-b border-brand-100 pb-2">
          <FileSignature size={20} />
          <h3 className="font-bold text-lg">Pengesahan</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <label className={`${labelClass} mb-1`}>Kota Pengesahan</label>
            <input
              type="text"
              name="city"
              placeholder="Contoh: Kudus"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Tanggal</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className={`${labelClass} mb-1`}>Nama Kepala Sekolah</label>
            <input
              type="text"
              name="principalName"
              placeholder="Contoh: Faisal, S.Pd.I"
              value={formData.principalName}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Jenis ID Kepsek</label>
            <select
              name="principalIdType"
              value={formData.principalIdType}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="NIP">NIP</option>
              <option value="NIPPPK">NIPPPK</option>
              <option value="NIY">NIY</option>
              <option value="NUPTK">NUPTK</option>
              <option value="">- (Tidak Ada)</option>
            </select>
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>Nomor Identitas</label>
            <input
              type="tel"
              inputMode="numeric"
              name="principalIdNumber"
              placeholder="Contoh: 19800101 200501 1 002"
              value={formData.principalIdNumber}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 pb-8">
        <button
          type="submit"
          className="w-full bg-brand-600 active:bg-brand-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-brand-200 transition-transform active:scale-95 flex items-center justify-center gap-3 text-lg"
        >
          <Send className="w-6 h-6" />
          Generate Modul Ajar
        </button>
        <p className="text-center text-xs text-slate-400 mt-4 px-4">
          Modul akan digenerate 100% dari teks ini. Pastikan data sudah benar.
        </p>
      </div>
    </form>
  );
};
