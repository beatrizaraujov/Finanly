import { createClient } from '@supabase/supabase-js'



// O Vite expõe as variáveis de ambiente prefixadas com VITE_

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY



// Em ambiente de produção, é bom ter essa verificação

if (!supabaseUrl || !supabaseAnonKey) {

  console.error('ERRO: As variáveis de ambiente do Supabase não estão configuradas no arquivo .env')

  // É crucial que as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY

  // estejam definidas e corretas.

}



export const supabase = createClient(supabaseUrl, supabaseAnonKey)