import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  nome: string;
  equipe_codigo: string;
  funcao: string;
  equipes?: {
    base: string;
    tipo: string;
  };
}

export interface SI {
  si: string;
  os: string;
  poste: string;
  tipo_servico: string;
  localidade: string;
  equipe_codigo: string;
  natureza: string;
  inicio_previsto: string;
  termino_previsto: string;
  status_ptp: string;
  setor_solicitante: string;
}

export const supabaseService = {
  async getEncarregados() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*, equipes(base, tipo)')
      .order('nome');
    
    if (error) throw error;
    return data as User[];
  },

  async getSIsByEquipe(equipeCodigo: string) {
    const { data, error } = await supabase
      .from('ordens_servico')
      .select('*')
      .eq('equipe_codigo', equipeCodigo)
      .eq('concluida', false);
    
    if (error) throw error;
    return data as SI[];
  },

  async getSIDetails(siNumber: string) {
    const { data, error } = await supabase
      .from('ordens_servico')
      .select('*')
      .eq('si', siNumber)
      .single();
    
    if (error) throw error;
    return data as SI;
  },

  async uploadPhoto(file: Blob, path: string) {
    const { data, error } = await supabase.storage
      .from('fotos-remo')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    return data.path;
  },

  async saveExecution(executionData: any) {
    const { data, error } = await supabase
      .from('execucoes')
      .insert([executionData]);
    
    if (error) throw error;
    return data;
  }
};
