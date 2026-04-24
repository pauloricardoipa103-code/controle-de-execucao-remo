export interface Usuario {
  id: string;
  nome: string;
  matricula: string;
  equipe?: string;
}

export interface PhotoRecord {
  tipo: "ANTES" | "DEPOIS";
  url: string;
  data_hora: string;
  lat: number | null;
  lng: number | null;
}

export type StatusExecucao = "PENDENTE_FOTO_ANTES" | "EM_EXECUCAO" | "CONCLUIDO";

export interface ServiceRecord {
  id: string;
  si: string;
  ptp: string;
  encarregado: string;
  equipe: string;
  status: StatusExecucao;
  poste: string;
  tipo_servico: string;
  localidade: string;
  fotos: PhotoRecord[];
}

export interface SIResponse {
  si: string;
  ptp: string;
  poste: string;
  tipo_servico: string;
  localidade: string;
  equipe: string;
  setor_solicitante?: string;
  natureza?: string;
  inicio_previsto?: string;
  termino_previsto?: string;
  tipo_projeto?: string;
  status_ptp?: string;
}
