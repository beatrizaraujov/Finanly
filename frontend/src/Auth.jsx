import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      alert("Erro ao enviar e-mail: " + error.message);
      setLoading(false);
    } else {
      setShowModal(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-200">
      
      {/* --- LADO ESQUERDO: Branding (Desktop) --- */}
      <section className="hidden lg:flex flex-1 flex-col justify-center p-20 relative border-r border-white/5">
        <div className="pointer-events-none absolute -top-24 -left-24 h-[600px] w-[600px] rounded-full bg-orange-600/10 blur-[140px]" />
        
        <div className="relative z-10">
          <h1 className="text-8xl font-bold leading-[0.85] tracking-tighter text-white">
            Gestão<br />financeira<br />
            <span className="text-slate-700">inteligente.</span>
          </h1>
          <p className="mt-8 text-xl text-slate-400 max-w-sm leading-relaxed font-light">
            Controle seus gastos e organize encomendas em um único lugar.
          </p>
        </div>

        <div className="absolute bottom-20 left-20 z-10 text-[10px] tracking-[0.3em] text-slate-600 font-bold uppercase">
          SEGURANÇA DO APLICATIVO FINANCEIRO
        </div>
      </section>

      {/* --- LADO DIREITO --- */}
      <main className="flex flex-1 relative px-8 items-center justify-center">
        <div className="pointer-events-none absolute -top-1/4 -right-1/3 h-[520px] w-[520px] rounded-full bg-orange-500/10 blur-[140px]" />

        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center gap-50 h-full lg:h-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
              <p className="text-sm font-medium tracking-widest text-orange-500 uppercase">carregando....</p>
            </div>
          ) : (
            <>
              {/* HEADER MOBILE */}
              <header className="lg:hidden animate-in fade-in duration-700">
                <h1 className="text-6xl font-semibold leading-[0.9] tracking-tight text-white">
                  Gestão financeira{" "}
                  <span className="block font-medium text-slate-500">
                    inteligente.
                  </span>
                </h1>
                <div className="mt-8 flex max-w-[300px] gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-1 h-5 w-5 shrink-0 text-orange-500">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                  <p className="text-base leading-relaxed text-slate-400">
                    Controle seus gastos e organize encomendas em um único lugar.
                  </p>
                </div>
              </header>

              {/* FORMULÁRIO */}
              <section className="space-y-10">
                <div className="hidden lg:block">
                  <h2 className="text-3xl font-semibold text-white tracking-tight">Entrar agora</h2>
                  <p className="text-slate-500 text-sm mt-2">Acesse sua conta para continuar.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                  <div className="group relative">
                    <input
                      type="email"
                      required
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer w-full border-b border-slate-800 bg-transparent py-4 text-white placeholder-transparent transition-colors focus:border-orange-500 focus:outline-none"
                    />
                    <label className="pointer-events-none absolute left-0 top-4 text-sm text-slate-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-orange-500 peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:text-xs">
                      Seu e-mail
                    </label>
                  </div>
                  <button type="submit" className="w-full rounded-2xl bg-white py-4 text-sm font-bold text-black transition hover:bg-slate-200 active:scale-[0.98] shadow-xl">
                    Entrar agora
                  </button>
                </form>

                <p className="text-center lg:text-left text-[10px] tracking-[0.3em] text-slate-700 font-bold uppercase">
                  SEGURANÇA DO APLICATIVO FINANCEIRO
                </p>
              </section>
            </>
          )}
        </div>
      </main>

      {/* --- MODAL COM COR DE VIDRO FUMÊ (DARK BLUE GLASS) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          {/* bg-slate-900/40 traz o tom azulado/cinza pro vidro sem perder a transparência */}
          <div className="bg-slate-900/40 border border-white/10 backdrop-blur-2xl p-10 rounded-[40px] max-w-sm w-full text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
            
            <div className="w-20 h-20 bg-orange-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3">
              <svg className="w-10 h-10 text-orange-500 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">E-mail enviado</h3>
            
            <div className="space-y-6 mb-10 text-slate-400 text-sm leading-relaxed">
              <p>
                Link mágico enviado para:<br/>
                <span className="text-white font-medium">{email}</span>
              </p>
              
              <p className="text-[12px] opacity-50 italic px-4">
                Verifique sua caixa de entrada ou spam por "Supabase Auth".
              </p>
            </div>

            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-4 bg-white text-black font-extrabold rounded-2xl transition hover:bg-slate-100 active:scale-95 shadow-lg"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Auth;