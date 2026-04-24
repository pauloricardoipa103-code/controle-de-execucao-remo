import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { db } from '../services/db';
import type { ServiceRecord, Usuario } from '../types';
import { supabaseService } from '../services/supabaseService';
import type { SI } from '../services/supabaseService';
import { Plus, CheckCircle2, MapPin, Download, Clock } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [sisPendentes, setSisPendentes] = useState<SI[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pendente' | 'concluido'>('pendente');

  useEffect(() => {
    const user = db.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const loadData = async () => {
      try {
        setLoading(true);
        // Buscar SIs reais do banco
        const sis = await supabaseService.getSIsByEquipe(user.equipe || '');
        setSisPendentes(sis);
        
        if (sis.length > 0) {
          console.log('Dados carregados:', sis.length);
        } else {
          // Alert discreto para debug
          console.warn('Banco de dados conectado, mas nenhuma SI encontrada para:', user.equipe);
        }
    };

    loadData();
  }, [navigate]);

  const handleSimularPDF = (si: string, tipo: 'projeto' | 'ptp') => {
    alert(`[MVP Simulação] O arquivo PDF do ${tipo === 'projeto' ? 'PROJETO' : 'PTP/SI'} (${si}) foi cacheado para leitura offline no campo!`);
  };

  const concluidos = records.filter(r => r.status === 'CONCLUIDO');

  return (
    <div className="pt-20 px-4 pb-24 min-h-screen bg-slate-50">
      <Header />
      
      {/* Welcome Block */}
      <div className="mb-6 animate-in fade-in slide-in-from-top-2">
        <p className="text-sm font-medium text-slate-500 mb-1">Colaborador Ativo</p>
        <h2 className="text-2xl font-black tracking-tight text-[#1e4b7a]">{currentUser?.nome}</h2>
        <div className="inline-block mt-1 px-3 py-1.5 bg-blue-50 text-[#1e4b7a] rounded-lg text-xs font-bold tracking-widest uppercase border border-blue-100 shadow-sm">
           {currentUser?.equipe} • {currentUser?.matricula}
        </div>
      </div>

      <Button
        fullWidth
        size="lg"
        onClick={() => navigate('/search')}
        className="mb-8 shadow-lg shadow-[#1e4b7a]/20 bg-[#1e4b7a] hover:bg-blue-900 h-16 text-sm tracking-wider font-bold"
      >
        <Plus size={22} className="mr-2" /> NOVO REGISTRO OU BUSCA DA SI
      </Button>

      {/* Tabs */}
      <div className="flex bg-slate-200 p-1.5 rounded-2xl mb-6">
        <button
          onClick={() => setTab('pendente')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
            tab === 'pendente' ? 'bg-white text-[#1e4b7a]' : 'text-slate-500 shadow-none hover:text-slate-700'
          }`}
        >
          SIs em Carga ({sisPendentes.length})
        </button>
        <button
          onClick={() => setTab('concluido')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
            tab === 'concluido' ? 'bg-white text-emerald-600' : 'text-slate-500 shadow-none hover:text-slate-700'
          }`}
        >
          Concluídos ({concluidos.length})
        </button>
      </div>

      {tab === 'pendente' && (
        <div className="space-y-5 animate-in fade-in">
          {loading ? (
            <div className="text-center py-10 flex flex-col items-center text-slate-400 bg-white rounded-3xl border border-slate-200">
               <Clock size={40} className="mb-3 animate-spin opacity-20" />
               <p className="text-sm font-medium">Carregando ordens de serviço do banco...</p>
            </div>
          ) : sisPendentes.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed">
               <CheckCircle2 size={40} className="mb-3 opacity-20" />
               <p className="text-sm font-medium">Nenhuma SI nova na carga da equipe.</p>
            </div>
          ) : (
            sisPendentes.map(si => {
              // Verifica se já existe um record em andamento para exibir visual
              const inProgress = records.find(r => r.si === si.si && r.status !== 'CONCLUIDO');
              
              return (
              <div key={si.si} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1.5 h-full ${inProgress ? 'bg-blue-500' : 'bg-orange-400'}`}></div>
                
                <div className="flex justify-between items-start mb-3">
                   <div>
                      <p className="text-[10px] font-bold text-slate-400 tracking-[0.15em] mb-1">
                        {inProgress ? 'EM ANDAMENTO (FOTOS PENDENTES)' : 'NA LISTA PARA EXECUTAR'}
                      </p>
                      <h4 className="font-bold text-[#1e4b7a] text-xl mb-1">{si.si}</h4>
                   </div>
                   <button 
                      onClick={() => navigate(`/service/${si.si}`)} 
                      className={`font-bold text-sm px-4 py-2 rounded-xl active:scale-95 transition-all ${inProgress ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-[#1e4b7a]'}`}
                   >
                      {inProgress ? 'Continuar' : 'Detalhes'}
                   </button>
                </div>
                
                <p className="text-sm font-semibold text-slate-700 leading-snug mb-2">{si.tipo_servico}</p>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 bg-slate-50 inline-flex px-3 py-1.5 rounded-lg mb-5 border border-slate-100">
                  <span className="flex items-center gap-1"><MapPin size={12}/> Poste {si.poste}</span>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleSimularPDF(si.si, 'projeto')}
                    className="flex-1 py-2.5 rounded-xl border-2 border-slate-100 text-slate-500 font-bold text-[11px] flex justify-center items-center gap-1.5 hover:bg-slate-50 transition-colors active:scale-[0.98]"
                  >
                     <Download size={14} />
                     PROJETO (.PDF)
                  </button>
                  <button 
                    onClick={() => handleSimularPDF(si.si, 'ptp')}
                    className="flex-1 py-2.5 rounded-xl border-2 border-slate-100 text-slate-500 font-bold text-[11px] flex justify-center items-center gap-1.5 hover:bg-slate-50 transition-colors active:scale-[0.98]"
                  >
                     <Download size={14} />
                     PTP / SI (.PDF)
                  </button>
                </div>
              </div>
            )})
          )}
        </div>
      )}

      {tab === 'concluido' && (
        <div className="space-y-4 animate-in fade-in">
          {concluidos.length === 0 ? (
            <div className="text-center py-10 flex flex-col items-center text-slate-400 bg-white rounded-3xl border border-slate-200 border-dashed">
               <Clock size={40} className="mb-3 opacity-20" />
               <p className="text-sm font-medium">Nenhum serviço finalizado ainda.</p>
            </div>
          ) : (
            concluidos.map(record => (
              <div key={record.id} className="bg-white p-5 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden flex items-center justify-between opacity-80 cursor-default">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-400"></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{record.si}</h4>
                  <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-flex mt-1">
                     Enviado ✓
                  </p>
                </div>
                <div className="text-right text-xs font-medium text-slate-400">
                  <p>{record.fotos.length} fotos</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
