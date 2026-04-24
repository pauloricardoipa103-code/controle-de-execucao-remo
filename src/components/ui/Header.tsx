import { LogOut, Bell } from 'lucide-react';
import { db } from '../../services/db';
import { useNavigate } from 'react-router-dom';
import { RemoLogo } from './RemoLogo';

export function Header({ title = "REMO Engenharia" }: { title?: string }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    db.logout();
    navigate('/login');
  };

  const handleBellClick = () => {
    alert("NOTIFICAÇÕES:\n\n[SISTEMA] O encarregado CARLOS enviou 1 lote de imagens com sucesso!");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-50 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3 w-full">
        <RemoLogo className="h-7" fallbackSize="sm" />
        <h1 className="font-semibold text-slate-800 text-lg truncate flex-1 ml-1 pt-1">{title}</h1>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={handleBellClick}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-900 hover:bg-slate-100 hover:text-blue-600 active:scale-95 transition-all relative"
          aria-label="Notificações"
        >
          <Bell size={20} />
          {/* Bolinha vermelha de alerta */}
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-white"></span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-red-500 active:scale-95 transition-all"
          aria-label="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
