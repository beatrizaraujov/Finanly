import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão inicial para saber se o usuário já estava logado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuta mudanças (Login/Logout) e troca a tela automaticamente
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Tela de transição elegante enquanto verifica a sessão
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent mb-4"></div>
        <p className="text-[10px] font-bold tracking-[0.3em] text-orange-500 uppercase animate-pulse">
          Verificando acesso...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 w-full">
      {/* Lógica de Roteamento: Se tiver sessão, Dashboard. Se não, Auth. */}
      {session ? <Dashboard /> : <Auth />}
    </div>
  );
}

export default App;