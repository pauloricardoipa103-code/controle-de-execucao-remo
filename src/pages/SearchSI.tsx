import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/ui/Header';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { db } from '../services/db';
import { Search, AlertCircle } from 'lucide-react';

export function SearchSI() {
  const navigate = useNavigate();
  const [si, setSi] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentUser = db.getCurrentUser();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!si.trim()) return;

    setLoading(true);
    setError('');

    try {
      const result = await db.buscarSI(si.trim());
      if (result) {
        navigate(`/service/${result.si}`);
      } else {
        setError('Serviço não encontrado. Verifique o número da SI. (Dica: teste "12345")');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4 min-h-screen bg-slate-50">
      <Header title="Buscar Serviço" />
      
      <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 animate-in fade-in slide-in-from-bottom-4">
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-500 mb-1.5 ml-1">Encarregado da Execução</label>
          <div className="w-full h-14 rounded-xl bg-slate-50 px-4 flex items-center text-[#1e3a8a] font-bold border border-slate-200 opacity-90">
            {currentUser?.nome}
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <Input 
            label="Número da SI" 
            placeholder="Ex: 12345" 
            value={si}
            onChange={(e) => setSi(e.target.value)}
            type="number"
            autoFocus
            required
            error={error}
          />
          
          {error && (
            <div className="flex items-start gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in zoom-in-95">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <Button fullWidth size="lg" type="submit" disabled={loading} className="mt-4 h-14 text-lg">
            <Search size={24} className="mr-2" />
            {loading ? 'Buscando dados...' : 'Buscar Serviço'}
          </Button>
          
          <Button 
            fullWidth 
            size="lg" 
            variant="outline" 
            type="button" 
            onClick={() => navigate('/home')}
            className="mt-2"
          >
            Voltar para Início
          </Button>
        </form>
      </div>
    </div>
  );
}
