import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Field, FInput } from '../components/crud';

const BRAND = { color: '#0E7C66', soft: '#E6F4F1' };

function LoginPage({ onSignIn, isSupabaseConfigured }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Informe seu e-mail.');
    if (!password) return setError('Informe sua senha.');

    setSubmitting(true);
    const authError = await onSignIn(email.trim(), password);
    setSubmitting(false);

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : authError.message,
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{ background: '#F7F8FA', fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-[920px] grid lg:grid-cols-2 rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid #E4E7EC' }}>
        <div
          className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #EAF6F2 0%, #FFFFFF 70%)' }}
        >
          <div
            className="absolute -right-16 -top-16 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(14,124,102,0.18), transparent 70%)' }}
          />
          <div className="relative">
            <div className="flex items-center gap-2.5 mb-10">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: BRAND.color }}
              >
                <Sparkles size={18} color="#fff" />
              </div>
              <span
                className="text-[15px] font-semibold tracking-tight"
                style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Portal Onboarding
              </span>
            </div>
            <span
              className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full mb-4"
              style={{ background: BRAND.soft, color: BRAND.color }}
            >
              <Sparkles size={12} /> Bem-vindo de volta
            </span>
            <h1
              className="text-[28px] font-bold mb-3 leading-tight"
              style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Sua jornada de onboarding começa aqui.
            </h1>
            <p className="text-[14px] leading-relaxed max-w-sm" style={{ color: '#5B6472' }}>
              Acesse trilhas, documentação e times dos projetos em um só lugar.
            </p>
          </div>
          <p className="relative text-[12px]" style={{ color: '#9AA2B1' }}>
            © Portal de Onboarding · Acesso restrito a colaboradores
          </p>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10" style={{ background: '#fff' }}>
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: BRAND.color }}
            >
              <Sparkles size={16} color="#fff" />
            </div>
            <span
              className="text-[14px] font-semibold"
              style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Portal Onboarding
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="text-[22px] font-bold mb-1.5"
              style={{ color: '#14171F', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Entrar na conta
            </h2>
            <p className="text-[13px]" style={{ color: '#5B6472' }}>
              Use suas credenciais corporativas para acessar o portal.
            </p>
          </div>

          {!isSupabaseConfigured && (
            <p
              className="text-[12px] font-medium px-3 py-2.5 rounded-lg mb-4"
              style={{ background: '#FEF2F2', color: '#EF4444' }}
            >
              Supabase não configurado. Verifique o arquivo <code>.env</code>.
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="E-mail" required>
              <div className="relative">
                <Mail
                  size={15}
                  color="#9AA2B1"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <FInput
                  value={email}
                  onChange={setEmail}
                  placeholder="seu.email@empresa.com"
                  type="email"
                  className="pl-9"
                />
              </div>
            </Field>

            <Field label="Senha" required>
              <div className="relative">
                <Lock
                  size={15}
                  color="#9AA2B1"
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                />
                <FInput
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  type="password"
                  className="pl-9"
                />
              </div>
            </Field>

            {error && (
              <p
                className="text-[12px] font-medium px-3 py-2 rounded-lg"
                style={{ background: '#FEF2F2', color: '#EF4444' }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-opacity mt-1 disabled:opacity-50"
              style={{ background: BRAND.color }}
              onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.opacity = 0.88; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = submitting ? 0.5 : 1; }}
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Entrando…</>
              ) : (
                <>Entrar <ArrowRight size={15} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
