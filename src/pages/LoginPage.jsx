import React, { useState } from 'react';
import { LayoutGrid, Mail, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Field, FInput } from '../components/crud';
import PasswordInput from '../components/auth/PasswordInput';

function LoginPage({
  onSignIn,
  onResendConfirmation,
  onRequestPasswordReset,
  onGoToSignup,
  isSupabaseConfigured,
}) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const resetMessages = () => {
    setError('');
    setInfo('');
    setNeedsConfirmation(false);
  };

  const switchMode = (nextMode) => {
    resetMessages();
    setMode(nextMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim()) return setError('Informe seu e-mail.');
    if (!password) return setError('Informe sua senha.');

    setSubmitting(true);
    const authError = await onSignIn(email.trim(), password);
    setSubmitting(false);

    if (authError) {
      const msg = authError.message || '';
      if (msg.toLowerCase().includes('email not confirmed')) {
        setNeedsConfirmation(true);
        setError('Seu e-mail ainda não foi confirmado. Verifique a caixa de entrada e o spam, ou reenvie o link abaixo.');
        return;
      }
      setError(msg === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : msg);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!email.trim()) return setError('Informe seu e-mail.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Informe um e-mail válido.');

    setSubmitting(true);
    const authError = await onRequestPasswordReset(email.trim());
    setSubmitting(false);

    if (authError) {
      setError(authError.message || 'Não foi possível enviar o e-mail de recuperação.');
      return;
    }

    setInfo('Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada e a pasta de spam.');
  };

  const handleResend = async () => {
    if (!email.trim()) return setError('Informe seu e-mail para reenviar a confirmação.');
    setResending(true);
    setError('');
    setInfo('');
    const resendError = await onResendConfirmation(email.trim());
    setResending(false);
    if (resendError) {
      setError(resendError.message || 'Não foi possível reenviar o e-mail.');
      return;
    }
    setInfo('E-mail de confirmação reenviado. Verifique também a pasta de spam.');
  };

  const isForgot = mode === 'forgot';

  return (
    <div className="auth-panel">
      <div className="auth-card">
        <div className="auth-brand-panel">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand">
                <LayoutGrid size={16} color="#fff" strokeWidth={2.25} />
              </div>
              <span className="text-sm font-semibold tracking-tight text-ink-primary">Portal Onboarding</span>
            </div>
            <h1 className="text-2xl font-semibold leading-tight mb-3 text-ink-primary">
              {isForgot ? 'Recuperar acesso' : 'Central de onboarding corporativo'}
            </h1>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-sm">
              {isForgot
                ? 'Informe seu e-mail corporativo e enviaremos um link para redefinir sua senha.'
                : 'Trilhas, documentação e informações dos projetos em um único ambiente interno.'}
            </p>
          </div>
          <p className="text-xs text-ink-muted">© Portal de Onboarding · Acesso restrito</p>
        </div>

        <div className="auth-form-panel">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-brand">
              <LayoutGrid size={16} color="#fff" strokeWidth={2.25} />
            </div>
            <span className="text-sm font-semibold text-ink-primary">Portal Onboarding</span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-ink-primary mb-1">
              {isForgot ? 'Esqueci minha senha' : 'Entrar na conta'}
            </h2>
            <p className="text-sm text-ink-secondary">
              {isForgot ? 'Enviaremos instruções por e-mail.' : 'Use suas credenciais corporativas.'}
            </p>
          </div>

          {!isSupabaseConfigured && (
            <p className="alert-error mb-4">
              Serviço temporariamente indisponível. Entre em contato com o administrador.
            </p>
          )}

          {isForgot ? (
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <Field label="E-mail" required>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted"
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

              {error && <p className="alert-error">{error}</p>}
              {info && <p className="alert-info">{info}</p>}

              <button
                type="submit"
                disabled={submitting || !isSupabaseConfigured}
                className="btn-primary w-full py-2.5 mt-1"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>
                    Enviar link de recuperação
                    <ArrowRight size={15} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => switchMode('login')}
                className="btn-secondary w-full"
              >
                <ArrowLeft size={15} />
                Voltar ao login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="E-mail" required>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted"
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

              <div className="flex flex-col gap-1.5">
                <Field label="Senha" required>
                  <PasswordInput value={password} onChange={setPassword} placeholder="••••••••" />
                </Field>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-xs font-semibold text-brand hover:underline text-right"
                >
                  Esqueci minha senha
                </button>
              </div>

              {error && <p className="alert-error">{error}</p>}
              {info && <p className="alert-info">{info}</p>}

              {needsConfirmation && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="btn-secondary w-full disabled:opacity-50"
                >
                  {resending ? 'Reenviando…' : 'Reenviar e-mail de confirmação'}
                </button>
              )}

              <button
                type="submit"
                disabled={submitting || !isSupabaseConfigured}
                className="btn-primary w-full py-2.5 mt-1"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Entrando…
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {!isForgot && (
            <p className="text-sm text-center mt-6 text-ink-secondary">
              Ainda não tem conta?{' '}
              <button type="button" onClick={onGoToSignup} className="font-semibold text-brand hover:underline">
                Criar conta
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
