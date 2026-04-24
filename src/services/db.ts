import type { ServiceRecord, SIResponse, Usuario } from '../types';
import { PRELOADED_SIS } from '../data/sis';

const STORAGE_KEY = 'remo_services_db';
const USER_KEY = 'remo_current_user';

export const db = {
  login: (usuario: Omit<Usuario, 'id'>) => {
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: crypto.randomUUID(),
      ...usuario
    }));
  },
  logout: () => {
    localStorage.removeItem(USER_KEY);
  },
  getCurrentUser: (): Usuario | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  buscarSI: async (si: string): Promise<SIResponse | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const found = PRELOADED_SIS.find(s => s.si === si);
    return found || null;
  },

  buscarSIsPorEquipe: (equipe: string): SIResponse[] => {
    return PRELOADED_SIS.filter(s => s.equipe === equipe);
  },

  getRecords: (): ServiceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveRecord: (record: ServiceRecord) => {
    const records = db.getRecords();
    const existingIndex = records.findIndex(r => r.si === record.si); // Usa SI como unicidade caso refaça
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },

  getRecordById: (id: string) => {
    return db.getRecords().find(r => r.id === id) || null;
  },
  
  getRecordBySi: (si: string) => {
    return db.getRecords().find(r => r.si === si) || null;
  }
};
