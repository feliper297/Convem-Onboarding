import React, { useState } from 'react';
import { LayoutGrid, Loader2, ArrowRight } from 'lucide-react';
import { Field } from '../components/crud';
import PasswordInput from '../components/auth/PasswordInput';

function ResetPasswordPage({ onComplete, isSupabaseConfigured }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) return setError('Informe a nova senha.');
    if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');
    if (password !== confirmPassword) return setError('As senhas não coincidem.');

    setSubmitting(true);
    const authError = await onComplete(password);
    setSubmitting(false);

    if (authError) {
      setError(authError.message || 'Não foi possível redefinir a senha.');
    }
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
            <h1 className="text-2xl font-semibold leading-tight mb-3 text-ink-primary">
              Redefinir senha
            </h1>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-sm">
              Escolha uma nova senha segura para acessar o portal.
            </p>
          </div>
        </div>

        <div className="auth-form-panel">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-ink-primary mb-1">Nova senha</h2>
            <p className="text-sm text-ink-secondary">Mínimo de 6 caracteres.</p>
          </div>

          {!isSupabaseConfigured && (
            <p className="alert-error mb-4">
              Supabase não configurado. Verifique o arquivo <code>.env</code>.
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Nova senha" required>
              <PasswordInput value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" />
            </Field>

            <Field label="Confirmar nova senha" required>
              <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="Repita a nova senha" />
            </Field>

            {error && <p className="alert-error">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="btn-primary w-full py-2.5 mt-1"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Salvando…
                </>
              ) : (
                <>
                  Redefinir senha
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
