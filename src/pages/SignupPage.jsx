import React, { useState } from 'react';
import { LayoutGrid, Mail, Loader2, ArrowRight, User } from 'lucide-react';
import { Field, FInput } from '../components/crud';
import PasswordInput from '../components/auth/PasswordInput';

function SignupPage({ onSignUp, onResendConfirmation, onGoToLogin, isSupabaseConfigured }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) return setError('Informe seu nome completo.');
    if (!email.trim()) return setError('Informe seu e-mail.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Informe um e-mail válido.');
    if (!password) return setError('Informe uma senha.');
    if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');
    if (password !== confirmPassword) return setError('As senhas não coincidem.');

    setSubmitting(true);
    const { data, error: authError } = await onSignUp({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
    });
    setSubmitting(false);

    if (authError) {
      const msg = authError.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setError('Este e-mail já está cadastrado. Faça login ou use outro e-mail.');
      } else if (msg.includes('Password')) {
        setError('A senha não atende aos requisitos mínimos de segurança.');
      } else {
        setError(msg || 'Não foi possível criar a conta. Tente novamente.');
      }
      return;
    }

    if (data?.session) {
      setSuccess('Conta criada com sucesso! Redirecionando…');
      return;
    }

    setAwaitingConfirmation(true);
    setSuccess(
      'Conta criada! Enviamos um link de confirmação. Verifique sua caixa de entrada e a pasta de spam.',
    );
  };

  const handleResend = async () => {
    if (!email.trim()) return setError('Informe seu e-mail para reenviar a confirmação.');
    setResending(true);
    setError('');
    const resendError = await onResendConfirmation(email.trim());
    setResending(false);
    if (resendError) {
      setError(resendError.message || 'Não foi possível reenviar o e-mail.');
      return;
    }
    setSuccess('E-mail de confirmação reenviado. Verifique também a pasta de spam.');
  };

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
            <h1 className="text-2xl font-semibold leading-tight mb-3 text-ink-primary">Cadastro de colaborador</h1>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-sm">
              Crie sua conta para acessar trilhas, documentação e informações dos projetos.
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
            <h2 className="text-lg font-semibold text-ink-primary mb-1">Criar conta</h2>
            <p className="text-sm text-ink-secondary">Preencha seus dados para se cadastrar.</p>
          </div>

          {!isSupabaseConfigured && (
            <p className="alert-error mb-4">
              Serviço temporariamente indisponível. Entre em contato com o administrador.
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nome completo" required>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted"
                />
                <FInput value={fullName} onChange={setFullName} placeholder="Ex: Ana Silva" className="pl-9" />
              </div>
            </Field>

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

            <Field label="Senha" required>
              <PasswordInput value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" />
            </Field>

            <Field label="Confirmar senha" required>
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Repita a senha" />
            </Field>

            {error && <p className="alert-error">{error}</p>}
            {success && <p className="alert-info">{success}</p>}

            {awaitingConfirmation && (
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
                  Criando conta…
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-ink-secondary">
            Já tem uma conta?{' '}
            <button type="button" onClick={onGoToLogin} className="font-semibold text-brand hover:underline">
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
