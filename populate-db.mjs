import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttfbtxupkwnxgehxuxgh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZmJ0eHVwa3dueGdlaHh1eGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2MjksImV4cCI6MjA5MjYxMzYyOX0.LVkc1iYVVKF-l5TbZNQp-1OIIU0ljUHGHV-QSMF8EZQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function populateDatabase() {
  console.log('🔄 Iniciando população do banco de dados...\n');

  try {
    // 1. Inserir equipes com upsert
    console.log('📚 Inserindo equipes...');
    const equipesData = [
      { codigo: '73304', tipo: 'LV PESADA', base: 'IPOV-023M' },
      { codigo: '732003', tipo: 'LV PESADA', base: 'IPOV-025M' },
      { codigo: '73304-022', tipo: 'LV PESADA', base: 'IPOV-022M' },
      { codigo: '873004', tipo: 'APOIO - LINHA ML', base: 'IPOO-022M' },
      { codigo: '873008', tipo: 'APOIO - LM', base: 'IPOO-024M' },
      { codigo: 'OBRAS-01', tipo: 'OBRAS E MELHORIAS', base: 'IPOO-OBRAS' }
    ];

    const { data: equipes, error: equipesError } = await supabase
      .from('equipes')
      .upsert(equipesData, { onConflict: 'codigo' });

    if (equipesError) {
      console.log('⚠️  Aviso ao inserir equipes:', equipesError.message);
    } else {
      console.log('✅ Equipes inseridas/atualizadas\n');
    }

    // 2. Inserir usuários
    console.log('👥 Inserindo usuários...');
    const usuariosData = [
      { nome: 'LUCAS HENRIQUE SILVA LOPES', funcao: 'ENCARREGADO', equipe_codigo: '73304', matricula: '73304' },
      { nome: 'RICARDO TOMAS DE AQUINO', funcao: 'ENCARREGADO', equipe_codigo: '732003', matricula: '732003' },
      { nome: 'RAFAEL SANTOS PEREIRA', funcao: 'ENCARREGADO', equipe_codigo: '73304-022', matricula: '73304-022' },
      { nome: 'BRUNO BARBOSA DOS REIS', funcao: 'RESPONSÁVEL', equipe_codigo: '873004', matricula: '873004' },
      { nome: 'VINICIUS CAITANO DE OLIVEIRA', funcao: 'RESPONSÁVEL', equipe_codigo: '873008', matricula: '873008' },
      { nome: 'CARLOS AFONSO DA SILVA', funcao: 'ENCARREGADO', equipe_codigo: 'OBRAS-01', matricula: 'OBRAS-01' }
    ];

    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .upsert(usuariosData, { onConflict: 'matricula' });

    if (usuariosError) {
      console.log('❌ Erro ao inserir usuários:', usuariosError.message);
      throw usuariosError;
    }

    console.log('✅ Usuários inseridos\n');

    // 3. Verificar dados
    console.log('🔍 Verificando dados inseridos...');
    const { data: usuariosVerify, error: verifyError } = await supabase
      .from('usuarios')
      .select('*, equipes(base, tipo)');
    
    if (verifyError) {
      console.log('❌ Erro ao verificar dados:', verifyError.message);
    } else {
      console.log('👥 Total de usuários:', usuariosVerify?.length || 0);
      console.log('📋 Usuários encontrados:');
      usuariosVerify?.forEach(u => {
        console.log(`  - ${u.nome} (${u.funcao}) - Equipe: ${u.equipes?.base}`);
      });
    }

    console.log('\n✅ ✅ ✅ Banco de dados populado com sucesso! ✅ ✅ ✅\n');
  } catch (error) {
    console.error('❌ Erro ao popular o banco:', error.message);
    process.exit(1);
  }
}

populateDatabase();
