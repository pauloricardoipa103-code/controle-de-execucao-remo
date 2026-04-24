-- 1. Tabelas de Perfis e Equipes
CREATE TABLE IF NOT EXISTS equipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    tipo TEXT,
    base TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    funcao TEXT DEFAULT 'ENCARREGADO',
    equipe_codigo TEXT REFERENCES equipes(codigo),
    matricula TEXT
);

-- 2. Tabela de Ordens de Serviço (Pré-Carga)
CREATE TABLE IF NOT EXISTS ordens_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    si TEXT UNIQUE NOT NULL,
    os TEXT,
    poste TEXT,
    tipo_servico TEXT,
    localidade TEXT,
    equipe_codigo TEXT REFERENCES equipes(codigo),
    setor_solicitante TEXT,
    natureza TEXT,
    inicio_previsto TEXT,
    termino_previsto TEXT,
    tipo_projeto TEXT,
    status_ptp TEXT,
    concluida BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Tabela de Registros de Execução (Fotos)
CREATE TABLE IF NOT EXISTS execucoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    si_id TEXT REFERENCES ordens_servico(si),
    usuario_nome TEXT,
    equipe_codigo TEXT,
    fotos_antes TEXT[] DEFAULT '{}',
    fotos_depois TEXT[] DEFAULT '{}',
    coordenadas JSONB,
    finalizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Inserir Dados Iniciais (Exemplos do App)
INSERT INTO equipes (codigo, base, tipo) VALUES 
('73304', 'IPOV-023M', 'LV PESADA'),
('732003', 'IPOV-025M', 'LV PESADA'),
('OBRAS-01', 'IPOO-OBRAS', 'OBRAS E MELHORIAS');

INSERT INTO usuarios (nome, equipe_codigo, matricula) VALUES 
('LUCAS HENRIQUE SILVA LOPES', '73304', 'ENCARREGADO'),
('RICARDO TOMAS DE AQUINO', '732003', 'ENCARREGADO'),
('CARLOS AFONSO DA SILVA', 'OBRAS-01', 'ENCARREGADO');

INSERT INTO ordens_servico (si, os, poste, tipo_servico, localidade, equipe_codigo, natureza, inicio_previsto, termino_previsto, status_ptp) VALUES 
('1018920', '1400960', '20629522', 'OBRA REDE ZONA LIVRE-IMPLANTAÇÃO POSTE', 'ARENOPOLIS - GO (ZONA RURAL)', 'OBRAS-01', 'PROGRAMADA', '25/04/2026 07:30', '26/04/2026 18:00:00', 'Confirmado'),
('1018843', '1401010', '27749368', 'POSTE - DESLOCAMENTO/SUBSTITUIÇÃO (PTP)', 'ISRAELANDIA - GO (ZONA RURAL)', '732003', 'PROGRAMADA', '25/04/2026 07:30', '26/04/2026 18:00:00', 'Confirmado');

-- Habilitar acesso público para testes (Desativar RLS para o MVP)
ALTER TABLE equipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico DISABLE ROW LEVEL SECURITY;
ALTER TABLE execucoes DISABLE ROW LEVEL SECURITY;
