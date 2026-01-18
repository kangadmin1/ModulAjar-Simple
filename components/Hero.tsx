import React from 'react';
import { Brain, Clock, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="text-center space-y-4 md:space-y-6 py-4 md:py-8">
      
      <h1 className="text-3xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
        Buat Modul Ajar <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
          Dalam Hitungan Detik
        </span>
      </h1>
      
      <p className="text-sm md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed px-4">
        Hemat waktu administrasi Anda. Biarkan AI Hanyauntukmu membantu menyusun modul ajar yang lengkap.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-3xl mx-auto mt-6 md:mt-8 pt-6 md:pt-8 border-t border-slate-200 px-4 md:px-0">
        <FeatureItem 
          icon={<Brain className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />}
          title="Cerdas & Kontekstual"
          desc="Menyesuaikan dengan karakteristik siswa."
        />
        <FeatureItem 
          icon={<Clock className="w-5 h-5 md:w-6 md:h-6 text-brand-500" />}
          title="Efisien Waktu"
          desc="Selesai dalam kurang dari 1 menit."
        />
        <FeatureItem 
          icon={<Award className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />}
          title="Standar Kurikulum"
          desc="Sesuai format Kurikulum Merdeka."
        />
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex flex-row md:flex-col items-center gap-3 md:gap-0 p-3 md:p-4 bg-white rounded-xl shadow-sm border border-slate-100 text-left md:text-center">
    <div className="p-2 md:p-3 bg-slate-50 rounded-full shrink-0">
      {icon}
    </div>
    <div>
        <h3 className="font-bold text-slate-800 text-sm md:text-base mb-0 md:mb-1">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 leading-tight">{desc}</p>
    </div>
  </div>
);