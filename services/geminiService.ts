
import { GoogleGenAI } from "@google/genai";
import { ModuleFormData, GeneratedModule } from "../types";

// Helper untuk mendapatkan Client AI dengan Key yang dinamis
const getAIClient = () => {
  // 1. Cek apakah user menyimpan Custom Key di LocalStorage (dari menu Bantuan)
  const customKey = typeof window !== 'undefined' ? localStorage.getItem('CUSTOM_GEMINI_API_KEY') : null;

  // 2. Jika ada Custom Key, gunakan itu. Jika tidak, gunakan Env Variable.
  const apiKey = customKey || process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key tidak ditemukan. Silakan atur API Key Anda di menu API Key / Bantuan.");
  }

  return new GoogleGenAI({ apiKey });
};

// Format date helper
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export const generateModule = async (data: ModuleFormData): Promise<GeneratedModule> => {
  const formattedDate = formatDate(data.date);

  // Convert Arrays to Strings for Prompt
  const dplString = data.dpl.join(', ');
  const kbcString = data.kbcTheme.join(', ');
  const sesString = data.sesPriority.join(', ');

  // Logic to handle AI generated content vs Manual Input
  const materialContext = data.autoGenerateMaterial 
    ? `**INSTRUKSI KHUSUS:** Anda WAJIB menyusun Detail Materi secara lengkap, mendalam, dan sesuai fase kurikulum untuk topik "${data.topic}".` 
    : `Materi/Konteks: ${data.materialDetails}`;

  const insertionContext = data.autoGenerateInsertion
    ? `**INSTRUKSI KHUSUS:** Anda WAJIB menciptakan Narasi Materi Insersi yang menyentuh hati, menghubungkan topik "${data.topic}" dengan nilai "${kbcString}" dan "${sesString}".`
    : `Materi Insersi (Nilai Spiritual/Moral): ${data.insertionMaterial}`;

  // Meeting Logic: Jika lebih dari 1 pertemuan, instruksikan untuk membreakdown secara lengkap
  const meetingInstruction = parseInt(data.meetingCount) > 1 
    ? `**INSTRUKSI KRUSIAL (PERTEMUAN > 1):** Karena jumlah pertemuan adalah **${data.meetingCount}**, Anda **WAJIB MENULISKAN TABEL KEGIATAN PEMBELAJARAN (Pendahuluan, Inti, Penutup) UNTUK SETIAP PERTEMUAN (Pertemuan 1 s.d. Pertemuan ${data.meetingCount}) SECARA LENGKAP DAN TERPISAH**. 
       DILARANG KERAS menyingkat pertemuan 2 dst dengan kalimat seperti "Kegiatan sama dengan pertemuan 1". Anda harus menguraikan aktivitas spesifik yang merupakan kelanjutan materi/proyek di setiap pertemuannya.`
    : `Buat satu rangkaian kegiatan pembelajaran yang padat dan bermakna sesuai struktur yang diminta.`;

  // ID Formatting Logic
  const teacherIdString = data.teacherIdType ? `${data.teacherIdType}. ${data.teacherIdNumber}` : (data.teacherIdNumber || '-');
  const principalIdString = data.principalIdType ? `${data.principalIdType}. ${data.principalIdNumber}` : (data.principalIdNumber || '-');

  const prompt = `
    Bertindaklah sebagai Konsultan Pendidikan Ahli Kurikulum Merdeka Indonesia yang menguasai pendekatan **Kurikulum Berbasis Cinta (KBC)** dan **Social Emotional Skills (SES)**.
    Tugas Anda adalah membuat "Modul Ajar" yang SANGAT LENGKAP, PROFESIONAL, PANJANG, dan SIAP CETAK.
    
    Data Input:
    - Sekolah: ${data.schoolName}
    - Penyusun: ${data.teacherName}
    - Mapel/Fase: ${data.subject} / ${data.gradeLevel}
    - Topik: ${data.topic}
    - Model: ${data.method}
    - Alokasi: ${data.duration} (${data.meetingCount} Pertemuan)
    - ${materialContext}
    
    **DATA PENTING (KBC & SES):**
    - Dimensi Profil Lulusan (DPL): ${dplString}
    - Tema KBC: ${kbcString}
    - SES Prioritas: ${sesString}
    - ${insertionContext}

    INSTRUKSI UTAMA:
    1. **Format Markdown**: Gunakan Heading (#) dengan benar. JANGAN berikan kata pengantar.
    2. **Bahasa**: Indonesia baku, pedagogis, menyentuh hati (karena berbasis cinta).
    3. **Simbol**: Gunakan Unicode (misal: 90°), JANGAN LaTeX.
    4. **Integrasi Mutlak**: Nilai DPL, KBC, dan SES harus TERLIHAT NYATA dalam Tujuan Pembelajaran, Kegiatan Pembelajaran, dan Asesmen.
    5. ${meetingInstruction}

    ---
    
    # MODUL AJAR: ${data.topic.toUpperCase()}

    ## A. INFORMASI UMUM
    ### 1. Identitas Modul
    | Komponen | Keterangan |
    | :--- | :--- |
    | **Nama Penyusun** | ${data.teacherName} |
    | **Nama Sekolah/Madrasah** | ${data.schoolName} |
    | **Tahun Penyusunan** | ${new Date().getFullYear()} |
    | **Jenjang / Kelas** | ${data.gradeLevel} |
    | **Mata Pelajaran** | ${data.subject} |
    | **Model Pembelajaran** | ${data.method} |
    | **Dimensi Profil Lulusan** | ${dplString} |
    | **Tema KBC** | ${kbcString} |
    | **SES Prioritas** | ${sesString} |
    | **Materi Insersi** | ${data.autoGenerateInsertion ? '(Disusun oleh AI)' : data.insertionMaterial} |
    | **Alokasi Waktu** | ${data.duration} (${data.meetingCount} Pertemuan) |

    ### 2. Kompetensi Awal
    (Tuliskan pengetahuan prasyarat siswa)

    ### 3. Dimensi Profil Lulusan
    *(Jelaskan implementasi dimensi berikut terkait materi)*
    - **${dplString}**

    ### 4. Sarana dan Prasarana
    (Alat, bahan, media, dan sumber belajar)

    ### 5. Target Peserta Didik
    - Peserta didik reguler/tipikal.
    - Peserta didik dengan pencapaian tinggi.

    ## B. KOMPONEN INTI
    ### 1. Tujuan Pembelajaran
    (Rumuskan tujuan yang menggabungkan kompetensi akademis dengan nilai ${kbcString} dan ${sesString}.)
    1. ...
    2. ...

    ### 2. Indikator Ketercapaian Tujuan Pembelajaran (IKTP)
    | Ranah | Indikator (KKO Spesifik) |
    | :--- | :--- |
    | **Pengetahuan (Kognitif)** | (Gunakan KKO C3-C6: Menganalisis, Membuktikan, Memecahkan, Menyimpulkan, dll) |
    | **Keterampilan (Psikomotor)** | (Gunakan KKO: Mendemonstrasikan, Membuat, Mempraktikkan, Menyajikan, dll) |
    | **Sikap (Afektif/KBC/SES)** | (Gunakan KKO: Menunjukkan empati, Mengapresiasi, Menjaga, Membiasakan, Menunjukkan ${sesString}, dll) |

    ### 3. Pemahaman Bermakna
    (Manfaat kontekstual + Nilai Insersi)

    ### 4. Pertanyaan Pemantik
    (3 pertanyaan memicu rasa ingin tahu)

    ### 5. Kegiatan Pembelajaran
    (Rincikan langkah pembelajaran. **WAJIB:** Masukkan "Materi Insersi" di bagian Inti atau Penutup).
    
    #### Pertemuan 1
    | Tahapan | Deskripsi Kegiatan (Integrasi KBC & SES) | Alokasi Waktu |
    | :--- | :--- | :--- |
    | **Pendahuluan** | 1. **Orientasi**: Guru membuka pembelajaran dengan salam, berdoa bersama, dan mengecek kehadiran peserta didik.<br/>2. **Apersepsi**: Guru mengaitkan materi pembelajaran yang akan dilakukan dengan pengalaman peserta didik atau materi sebelumnya (Uraikan pertanyaan pemantik yang diajukan).<br/>3. **Motivasi**: Memberikan gambaran tentang manfaat mempelajari pelajaran yang akan dipelajari dalam kehidupan sehari-hari.<br/>4. **Pemberian Acuan**: Menyampaikan tujuan pembelajaran dan mekanisme pelaksanaan pembelajaran sesuai model ${data.method}. | 15 Menit |
    | **Inti** | (Uraikan sintaks model ${data.method} secara lengkap di sini. Jelaskan bagaimana siswa mengamati, menanya, mengumpulkan informasi, mengasosiasi, dan mengkomunikasikan. Tuliskan secara rinci bagaimana guru memfasilitasi diskusi atau proyek. **Minimal 400 kata** untuk bagian ini. **WAJIB Integrasikan:** Nilai ${kbcString} dan ${sesString} dalam proses ini). | ... Menit |
    | **Penutup** | 1. **Kesimpulan**: Peserta didik bersama guru menyimpulkan poin-poin penting materi.<br/>2. **Refleksi**: Guru menanyakan perasaan siswa dan pemahaman mereka terhadap materi.<br/>3. **Umpan Balik**: Guru memberikan apresiasi terhadap kinerja siswa.<br/>4. **Tindak Lanjut**: Memberikan tugas rumah atau informasi materi pertemuan berikutnya.<br/>5. **Penutup**: Doa dan salam penutup. | 15 Menit |

    ${parseInt(data.meetingCount) > 1 ? `
    #### Pertemuan 2
    | Tahapan | Deskripsi Kegiatan (Lanjutan / Pendalaman) | Alokasi Waktu |
    | :--- | :--- | :--- |
    | **Pendahuluan** | 1. **Orientasi**: Guru membuka pembelajaran dengan salam, berdoa, cek kehadiran.<br/>2. **Apersepsi**: Mengaitkan dengan materi pertemuan 1.<br/>3. **Motivasi**: Menjelaskan tujuan pertemuan ini.<br/>4. **Pemberian Acuan**: Mekanisme kegiatan lanjutan. | ... Menit |
    | **Inti** | (Uraikan kegiatan inti pertemuan 2 secara detil (min 300 kata). Lanjutkan bahasan materi atau presentasi proyek. Jelaskan aktivitas siswa dan guru. Integrasikan KBC/SES) | ... Menit |
    | **Penutup** | 1. **Kesimpulan**: Menyimpulkan hasil pertemuan ini.<br/>2. **Refleksi**: ...<br/>3. **Umpan Balik**: ...<br/>4. **Tindak Lanjut**: ...<br/>5. **Penutup**: Doa dan salam. | ... Menit |
    
    *(Lanjutkan tabel yang sama persis untuk Pertemuan 3, dst hingga Pertemuan ke-${data.meetingCount}. Pastikan SEMUA pertemuan ditulis LENGKAP)*` : ''}

    ### 6. Asesmen
    - **Diagnostik**: (Kesiapan Kognitif & Emosi)
    - **Formatif**: (Observasi Sikap ${dplString} & ${sesString}, LKPD)
    - **Sumatif**: (Tes Tertulis/Proyek)

    ### 7. Refleksi
    - **Refleksi Guru**: ...
    - **Refleksi Siswa**: ...

    ## C. LAMPIRAN
    ### 1. Lembar Kerja Peserta Didik (LKPD)
    (Buatkan LKPD lengkap dengan judul, instruksi, dan soal)

    ### 2. Bahan Bacaan (Materi Ajar)
    (Ringkasan materi esensial 3-5 paragraf yang memuat nilai Insersi)

    ### 3. Instrumen Asesmen dan Rubrik
    
    **a. Asesmen Sikap (SES)**
    *(Buatkan rubrik observasi dengan 4 indikator perilaku spesifik untuk: ${sesString})*
    | Indikator | Belum Terlihat | Mulai Terlihat | Membudaya |
    | :--- | :--- | :--- | :--- |
    | ... | ... | ... | ... |

    **b. Asesmen Keterampilan (Psikomotorik)**
    *(Buatkan rubrik penilaian kinerja/produk)*
    | Kriteria | Skor 4 (Sangat Baik) | Skor 3 (Baik) | Skor 2 (Cukup) | Skor 1 (Perlu Bimbingan) |
    | :--- | :--- | :--- | :--- | :--- |
    | ... | ... | ... | ... | ... |

    **c. Asesmen Sumatif (Tes Tertulis)**
    **INSTRUKSI SOAL:** Buat soal yang relevan dengan topik "${data.topic}" dan IKTP.
    
    **I. Pilihan Ganda (10 Soal)**
    1. ...
    2. ...
    (Lanjutkan sampai nomor 10)

    **II. Pilihan Ganda Kompleks (5 Soal)**
    *(Siswa memilih lebih dari satu jawaban benar atau pernyataan Benar/Salah)*
    11. ...
    12. ...
    (Lanjutkan sampai nomor 15)

    **III. Benar / Salah (5 Soal)**
    16. ...
    17. ...
    (Lanjutkan sampai nomor 20)

    **IV. Uraian HOTS (3 Soal)**
    21. ...
    22. ...
    23. ...

    > **Kunci Jawaban & Pedoman Penskoran:**
    > **I. Pilihan Ganda:**
    > 1-10...
    >
    > **II. PG Kompleks:**
    > 11-15...
    >
    > **III. Benar/Salah:**
    > 16-20...
    >
    > **IV. Uraian:**
    > 21-23...

    ---
    
    <br/><br/>
    
    <!--ALIGN_RIGHT-->**${data.city}, ${formattedDate}**
    
    Mengetahui,
    
    | Kepala Sekolah/Madrasah | Guru Mata Pelajaran |
    | :---: | :---: |
    | <br/><br/><br/><br/> | <br/><br/><br/><br/> |
    | **${data.principalName}** | **${data.teacherName}** |
    | ${principalIdString} | ${teacherIdString} |
  `;

  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        temperature: 0.75,
        topK: 40, 
        topP: 0.95 
      }
    });

    const text = response.text;
    if (!text) throw new Error("Tidak ada respon dari AI.");

    return { title: `Modul Ajar ${data.subject} - ${data.topic}`, content: text };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message && (error.message.includes("403") || error.message.includes("API key"))) {
      throw new Error("API Key tidak valid atau kuota habis. Silakan periksa kunci Anda di menu Bantuan.");
    }
    throw new Error(`Gagal menghubungi layanan AI: ${error.message}`);
  }
};

export const reviseModule = async (currentContent: string, instruction: string): Promise<GeneratedModule> => {
    const prompt = `
    Saya memiliki Modul Ajar berikut dalam format Markdown:
    
    ${currentContent}

    ---
    INSTRUKSI REVISI:
    Tolong tulis ulang bagian tertentu dari modul di atas dengan menerapkan perubahan berikut: "${instruction}".
    
    KETENTUAN:
    1. Pertahankan struktur utama (A. Informasi Umum, B. Komponen Inti, C. Lampiran) JANGAN MERUBAH FORMAT UTAMA.
    2. Outputkan kembali SELURUH modul dalam format Markdown yang rapi.
    3. JANGAN GUNAKAN FORMAT LATEX ($...$). Gunakan simbol biasa.
    4. Pastikan revisi tetap memperhatikan prinsip KBC dan SES.
    `;

    try {
        const ai = getAIClient();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { temperature: 0.7 }
        });
        
        return {
            title: "Modul Ajar (Revisi)",
            content: response.text || currentContent
        };
    } catch (error) {
         throw new Error("Gagal merevisi modul. Pastikan API Key valid.");
    }
}
