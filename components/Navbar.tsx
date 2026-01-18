import React from 'react';
import { BookOpen, HelpCircle, Settings, History, Key, Home, User } from 'lucide-react';

interface NavbarProps {
  onReset: () => void;
  onNavigate: (view: 'home' | 'about' | 'help' | 'admin' | 'history') => void;
  currentView: 'home' | 'about' | 'help' | 'admin' | 'history';
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, onNavigate, currentView }) => {
  
  const navItems = [
    { id: 'home', label: 'Beranda', icon: <Home size={20} />, action: () => { onNavigate('home'); onReset(); } },
    { id: 'history', label: 'Riwayat', icon: <History size={20} />, action: () => onNavigate('history') },
    { id: 'help', label: 'API Key', icon: <Key size={20} />, action: () => onNavigate('help') },
    { id: 'about', label: 'Developer', icon: <User size={20} />, action: () => onNavigate('about') },
    { id: 'admin', label: 'Admin', icon: <Settings size={20} />, action: () => onNavigate('admin') },
  ];

  return (
    <>
      {/* DESKTOP TOP NAVBAR */}
      <nav className="hidden md:block bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              onNavigate('home');
              onReset();
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform duration-200">
              <BookOpen size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-none text-slate-800 tracking-tight">
                AI Hanyauntukmu
              </span>
              <span className="text-[10px] font-medium text-brand-600 tracking-wider uppercase">
                Teaching Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
            >
              Beranda
            </button>
            
            <button 
               onClick={() => onNavigate('history')}
               className={`text-sm font-medium transition-colors flex items-center gap-1 ${currentView === 'history' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
            >
              <History size={16} />
              Riwayat
            </button>

            <button 
              onClick={() => onNavigate('about')}
              className={`text-sm font-medium transition-colors ${currentView === 'about' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
            >
              Developer
            </button>
            <button 
               onClick={() => onNavigate('help')}
               className={`text-sm font-medium transition-colors flex items-center gap-1 ${currentView === 'help' ? 'text-brand-600 font-bold' : 'text-slate-600 hover:text-brand-600'}`}
            >
              <Key size={16} />
              API Key
            </button>
            
            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <button
               onClick={() => onNavigate('admin')}
               className={`p-2 rounded-full transition-all duration-200 ${currentView === 'admin' ? 'bg-slate-100 text-slate-800 shadow-inner' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
               title="Dashboard Admin"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE TOP HEADER (Logo Only) */}
      <div className="md:hidden bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 px-4 h-14 flex items-center justify-center">
         <div 
            className="flex items-center gap-2"
            onClick={() => {
              onNavigate('home');
              onReset();
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow shadow-brand-200">
              <BookOpen size={18} />
            </div>
            <span className="font-serif font-bold text-lg text-slate-800 tracking-tight">
              AI Hanyauntukmu
            </span>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  );
};