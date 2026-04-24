import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { Button } from '../components/ui/Button';
import { RemoLogo } from '../components/ui/RemoLogo';
import { supabaseService } from '../services/supabaseService';
import type { User } from '../services/supabaseService';

export function Login() {
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabaseService.getEncarregados()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar usuários:', err);
        setLoading(false);
      });
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userId) {
      const user = users.find(u => u.id === userId);
      if (user) {
        db.login({
          nome: user.nome,
          matricula: user.funcao,
          equipe: user.equipes?.base || 'N/A'
        });
        navigate('/home');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-slate-100">
      <div className="w-full max-w-sm flex flex-col items-center space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="w-full flex justify-center mb-0 mt-4">
            <RemoLogo className="h-[100px]" fallbackSize="lg" />
        </div>

        <div className="text-center w-full mb-2">
          <h1 className="text-[20px] font-bold text-[#1b365d] mb-1">Controle de execução</h1>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-6 bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 ml-1">Selecione seu Nome na Equipe</label>
            <div className="relative">
               <select 
                 className="w-full h-14 rounded-2xl bg-slate-50 border border-slate-200 px-4 text-slate-700 font-semibold appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e4b7a]"
                 value={userId}
                 onChange={e => setUserId(e.target.value)}
                 required
               >
                 <option value="" disabled>{loading ? 'Carregando líderes...' : 'Toque para selecionar...'}</option>
                 {Array.from(new Set(users.map(u => u.equipes?.base))).map(base => {
                   const teamUsers = users.filter(u => u.equipes?.base === base);
                   const teamType = teamUsers[0]?.equipes?.tipo;
                   return (
                     <optgroup key={base} label={`Equipe ${base} (${teamType})`}>
                       {teamUsers.map(u => (
                         <option key={u.id} value={u.id}>
                           {u.nome} ({u.funcao})
                         </option>
                       ))}
                     </optgroup>
                   );
                 })}
               </select>
               {/* Custom caret */}
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                 <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
               </div>
            </div>
          </div>
          
          <Button fullWidth size="lg" type="submit" className="text-md tracking-wide h-14">
            Acessar Sistema
          </Button>
        </form>

      </div>
    </div>
  );
}
