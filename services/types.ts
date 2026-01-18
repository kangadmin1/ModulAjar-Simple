
export interface ModuleFormData {
  // Identitas Sekolah & Guru
  schoolName: string;
  teacherName: string;
  teacherIdType: string;
  teacherIdNumber: string;

  // Detail Pembelajaran
  subject: string;
  gradeLevel: string;
  semester: string;
  duration: string;
  meetingCount: string;

  // Materi & Metode
  topic: string;
  method: string;
  materialDetails: string;
  autoGenerateMaterial?: boolean;

  // Pendekatan Karakter (New)
  dpl: string[]; // Changed to array
  kbcTheme: string[]; // Changed to array
  sesPriority: string[]; // Changed to array
  insertionMaterial: string; 
  autoGenerateInsertion?: boolean;

  // Pengesahan
  city: string;
  date: string;
  principalName: string;
  principalIdType: string;
  principalIdNumber: string;
}

export interface GeneratedModule {
  title: string;
  content: string; // Markdown content
}
