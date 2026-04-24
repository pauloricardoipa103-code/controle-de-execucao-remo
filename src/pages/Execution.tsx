import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { CameraButton } from '../components/ui/CameraCapture';
import { Button } from '../components/ui/Button';
import { db } from '../services/db';
import { supabaseService } from '../services/supabaseService';
import type { ServiceRecord, PhotoRecord } from '../types';
import { ArrowLeft, CheckCircle2, ImageIcon } from 'lucide-react';

export function Execution() {
  const { si } = useParams<{ si: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<ServiceRecord | null>(null);

  useEffect(() => {
    if (si) {
      const records = db.getRecords();
      const existing = records.find(r => r.si === si && r.status !== 'CONCLUIDO');
      if (existing) {
        setRecord(existing);
      } else {
        navigate('/home');
      }
    }
  }, [si, navigate]);

  const fotosAntes = record?.fotos.filter(f => f.tipo === 'ANTES') || [];
  const fotosDepois = record?.fotos.filter(f => f.tipo === 'DEPOIS') || [];

  const handleCapture = (tipo: 'ANTES' | 'DEPOIS') => (data: { url: string; lat: number | null; lng: number | null; timestamp: string }) => {
    if (!record) return;

    const newPhoto: PhotoRecord = {
      tipo,
      url: data.url,
      lat: data.lat,
      lng: data.lng,
      data_hora: data.timestamp
    };

    const updatedRecord = { ...record };
    updatedRecord.fotos.push(newPhoto);

    const newAntes = updatedRecord.fotos.filter(f => f.tipo === 'ANTES');
    const newDepois = updatedRecord.fotos.filter(f => f.tipo === 'DEPOIS');

    if (newAntes.length > 0 && newDepois.length === 0) {
      updatedRecord.status = 'EM_EXECUCAO';
    } else if (newAntes.length > 0 && newDepois.length > 0) {
      updatedRecord.status = 'CONCLUIDO';
    }

    db.saveRecord(updatedRecord);
    setRecord(updatedRecord);
  };

  const [isSaving, setIsSaving] = useState(false);

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleFinish = async () => {
    if (!record) return;
    setIsSaving(true);
    
    try {
      const uploadPromises = record.fotos.map(async (f, idx) => {
        const blob = dataURLtoBlob(f.url);
        const fileName = `${record.si}_${f.tipo}_${idx}_${Date.now()}.jpg`;
        const path = await supabaseService.uploadPhoto(blob, fileName);
        return { ...f, url: path }; // Armazenamos o path do storage
      });

      const uploadedPhotos = await Promise.all(uploadPromises);
      
      const executionData = {
        si_id: record.si,
        usuario_nome: record.encarregado,
        equipe_codigo: null, // Pode ser preenchido se necessário
        fotos_antes: uploadedPhotos.filter(f => f.tipo === 'ANTES').map(p => p.url),
        fotos_depois: uploadedPhotos.filter(f => f.tipo === 'DEPOIS').map(p => p.url),
        coordenadas: {
          lat: uploadedPhotos[0]?.lat,
          lng: uploadedPhotos[0]?.lng
        }
      };

      await supabaseService.saveExecution(executionData);
      
      const updatedRecord = { ...record, status: 'CONCLUIDO' as const };
      db.saveRecord(updatedRecord);
      
      alert('SUCESSO! Fotos enviadas e registro salvo no banco de dados.');
      navigate('/home');
    } catch (err) {
      console.error('Erro ao finalizar e enviar:', err);
      alert('Erro ao enviar fotos. Verifique sua conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!record) return null;

  const renderGallery = (fotos: PhotoRecord[], tipo: 'ANTES' | 'DEPOIS') => {
    return (
      <div className={`grid gap-3 ${fotos.length > 0 ? "grid-cols-2" : "grid-cols-1"}`}>
         {fotos.map((f, i) => (
           <div key={i} className="relative aspect-[3/4] bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200">
             <img src={f.url} alt={`Evidência ${tipo} ${i + 1}`} className="w-full h-full object-cover" />
             <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md">
               <CheckCircle2 size={16} />
             </div>
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
               <p className="text-[10px] text-white font-medium truncate flex items-center gap-1">
                  <ImageIcon size={10}/> Evidência {i + 1}
               </p>
             </div>
           </div>
         ))}
         <CameraButton 
            onCapture={handleCapture(tipo)} 
            label={fotos.length > 0 ? "Nova Foto" : `Capturar ${tipo}`} 
            isSecondary={fotos.length > 0} 
         />
      </div>
    );
  };

  return (
    <div className="pt-20 px-4 pb-32 min-h-screen bg-slate-50">
      <Header title={`Execução: SI ${record.si}`} />

      <button 
        onClick={() => navigate('/home')}
        className="mb-4 flex items-center text-slate-500 hover:text-[#1e4b7a] transition-colors font-medium text-sm px-1"
      >
        <ArrowLeft size={18} className="mr-1" /> Dashboard
      </button>
      
      <div className="bg-white p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mb-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Antes Section */}
        <section>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-[#1e4b7a] text-lg flex items-center gap-2">
               <span className="w-7 h-7 rounded-full bg-blue-50 text-[#1e4b7a] flex items-center justify-center text-xs">1</span>
               Galeria do ANTES
            </h3>
            <span className="text-slate-400 font-bold text-xs">{fotosAntes.length} Fotos</span>
          </div>
          {renderGallery(fotosAntes, 'ANTES')}
        </section>

        {/* Separator */}
        <div className="h-1.5 w-full bg-slate-50 rounded-full" />

        {/* Depois Section */}
        <section className={fotosAntes.length === 0 ? 'opacity-40 pointer-events-none grayscale-[0.5]' : 'transition-all duration-500'}>
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-[#1e4b7a] text-lg flex items-center gap-2">
               <span className="w-7 h-7 rounded-full bg-blue-50 text-[#1e4b7a] flex items-center justify-center text-xs">2</span>
               Galeria do DEPOIS
            </h3>
            <span className="text-slate-400 font-bold text-xs">{fotosDepois.length} Fotos</span>
          </div>
          {renderGallery(fotosDepois, 'DEPOIS')}
        </section>

      </div>

      {fotosAntes.length > 0 && fotosDepois.length > 0 && record.status === 'CONCLUIDO' && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-40 pb-safe animate-in fade-in slide-in-from-bottom-2">
          <Button 
            fullWidth 
            size="lg" 
            onClick={handleFinish} 
            disabled={isSaving}
            className={`h-16 text-lg shadow-lg shadow-emerald-500/20 !bg-emerald-500 hover:!bg-emerald-600 focus-visible:ring-emerald-500 border-none transition-all font-bold ${isSaving ? 'opacity-70 animate-pulse' : ''}`}
          >
            {isSaving ? (
              <>Subindo fotos para o servidor...</>
            ) : (
              <><CheckCircle2 size={24} className="mr-2"/> Concluir e Enviar Lote</>
            )}
          </Button>
        </div>
      )}
      
    </div>
  );
}
