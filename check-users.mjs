import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttfbtxupkwnxgehxuxgh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0ZmJ0eHVwa3dueGdlaHh1eGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzc2MjksImV4cCI6MjA5MjYxMzYyOX0.LVkc1iYVVKF-l5TbZNQp-1OIIU0ljUHGHV-QSMF8EZQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Verificando dados do banco...\n');

  try {
    console.log('📚 Buscando equipes...');
    const { data: equipes, error: equipesError } = await supabase
      .from('equipes')
      .select('*');
    
    if (equipesError) {
      console.log('❌ Erro ao ler equipes:', equipesError.message);
    } else {
      console.log(`✅ Equipes encontradas: ${equipes?.length || 0}`);
      equipes?.forEach(e => {
        console.log(`  - ${e.codigo}: ${e.base} (${e.tipo})`);
      });
    }

    console.log('\n👥 Buscando usuários...');
    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('*, equipes(base, tipo)');
    
    if (usuariosError) {
      console.log('❌ Erro ao ler usuários:', usuariosError.message);
    } else {
      console.log(`✅ Usuários encontrados: ${usuarios?.length || 0}`);
      usuarios?.forEach(u => {
        console.log(`  - ${u.nome} (${u.funcao})`);
      });
    }

    if (!usuarios || usuarios.length === 0) {
      console.log('\n⚠️  Nenhum usuário encontrado! O banco está vazio.');
      console.log('Acessar: https://supabase.com/dashboard/projects');
    }

  } catch (error) {
    console.error('❌ Erro ao verificar banco:', error.message);
  }
}

checkDatabase();
