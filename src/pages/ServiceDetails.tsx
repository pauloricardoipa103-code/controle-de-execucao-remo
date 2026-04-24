import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { Button } from '../components/ui/Button';
import { db } from '../services/db';
import type { ServiceRecord } from '../types';
import { supabaseService } from '../services/supabaseService';
import type { SI } from '../services/supabaseService';
import { MapPin, Zap, Users, Calendar, ClipboardList, ArrowLeft } from 'lucide-react';

export function ServiceDetails() {
  const { si } = useParams<{ si: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SI | null>(null);
  
  useEffect(() => {
    if (si) {
      supabaseService.getSIDetails(si).then(res => {
        if (!res) navigate('/home');
        else setData(res);
      }).catch(err => {
        console.error('Erro ao buscar detalhes no Supabase:', err);
        navigate('/home');
      });
    }
  }, [si, navigate]);

  const handleStart = () => {
    if (!data) return;
    const currentUser = db.getCurrentUser();
    
    const records = db.getRecords();
    const existing = records.find(r => r.si === data.si && r.status !== 'CONCLUIDO');
    
    if (existing) {
       navigate(`/execute/${data.si}`);
       return;
    }

    const newRecord: ServiceRecord = {
      id: crypto.randomUUID(),
      si: data.si,
      os: data.os,
      encarregado: currentUser?.nome || 'Desconhecido',
      equipe: data.equipe_codigo,
      status: 'PENDENTE_FOTO_ANTES',
      poste: data.poste,
      tipo_servico: data.tipo_servico,
      localidade: data.localidade,
      fotos: []
    };
    
    db.saveRecord(newRecord);
    navigate(`/execute/${data.si}`);
  };

  if (!data) return <div className="pt-24 text-center text-slate-500 font-medium">Carregando dados...</div>;

  return (
    <div className="pt-20 px-4 pb-32 min-h-screen bg-slate-50">
      <Header title={`SI: ${data.si}`} />

      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-slate-500 hover:text-[#1e4b7a] transition-colors font-medium text-sm px-1 active:scale-95"
      >
        <ArrowLeft size={18} className="mr-1" /> Voltar
      </button>
      
      {/* Main OS Data */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
          <div>
            <p className="text-sm font-medium text-slate-500">Número da OS</p>
            <p className="text-2xl font-bold text-[#1b365d]">{data.os}</p>
          </div>
          <div className="bg-blue-50 text-[#1b365d] px-3 py-1.5 rounded-lg text-sm font-bold">
            NOVO SERVIÇO
          </div>
        </div>

        <div className="space-y-5 mb-2">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
              <Zap size={24} />
            </div>
            <div className="pt-1">
              <p className="text-sm text-slate-500 font-medium">Serviço a Executar</p>
              <p className="font-bold text-slate-800 text-lg leading-tight">{data.tipo_servico}</p>
              <p className="text-sm text-slate-500 mt-1 bg-slate-100 px-2 py-0.5 rounded inline-block">Ref: {data.poste}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <MapPin size={24} />
            </div>
            <div className="pt-1">
              <p className="text-sm text-slate-500 font-medium">Localidade</p>
              <p className="font-semibold text-slate-800">{data.localidade}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1b365d] shrink-0">
              <Users size={24} />
            </div>
            <div className="pt-1">
              <p className="text-sm text-slate-500 font-medium">Equipe</p>
              <p className="font-semibold text-slate-800">{data.equipe_codigo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dados da PTP Extra - Apenas renderiza se existirem dados */}
      {data.natureza && (
        <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 animate-in fade-in slide-in-from-bottom-5">
           <h3 className="font-bold text-[#1b365d] mb-4 flex items-center gap-2">
              <ClipboardList size={20} className="text-[#1b365d]" />
              Dados da Programação (PTP)
           </h3>
           
           <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Status</p>
                 <p className="font-semibold text-slate-700 text-sm">{data.status_ptp}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Natureza</p>
                 <p className="font-semibold text-slate-700 text-sm">{data.natureza}</p>
              </div>
           </div>

           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Setor Solicitante</p>
              <p className="font-semibold text-slate-700 text-sm">{data.setor_solicitante}</p>
           </div>
           
           <div className="flex bg-orange-50/50 p-3 rounded-xl border border-orange-100">
              <Calendar size={20} className="text-orange-500 mr-3 shrink-0 mt-0.5" />
              <div className="flex-1">
                 <div className="flex justify-between items-center border-b border-orange-100/50 pb-2 mb-2">
                    <p className="text-xs font-semibold text-orange-800">Início Mínimo</p>
                    <p className="font-bold text-orange-900 text-sm">{data.inicio_previsto}</p>
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-orange-800">Término Máximo</p>
                    <p className="font-bold text-orange-900 text-sm">{data.termino_previsto}</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-40 pb-safe">
        <Button fullWidth size="lg" onClick={handleStart} className="h-16 text-lg font-bold shadow-lg shadow-blue-900/20 tracking-wide bg-[#1b365d] hover:bg-blue-800 animate-in fade-in slide-in-from-bottom-2">
          Iniciar e Registrar ANTES
        </Button>
      </div>
      
    </div>
  );
}
