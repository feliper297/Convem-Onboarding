import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Field, FInput } from '../components/crud';
import PasswordInput from '../components/auth/PasswordInput';
import AvatarUpload from '../components/profile/AvatarUpload';
import {
  fetchUserSettings,
  saveUserSettings,
  fetchUserProfile,
  updateUserProfile,
  changeUserPassword,
} from '../services/userService';

const BRAND = '#0B6B58';
const ROLE_LABELS = {
  admin: 'Administrador',
  gestor: 'Gestor',
  colaborador: 'Colaborador',
};

function SettingsPage({ userId, userEmail, pushToast, onProfileUpdated }) {
  const [notif, setNotif] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [fullName, setFullName] = useState('');
  const [cargo, setCargo] = useState('');
  const [role, setRole] = useState('colaborador');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isNewCollaborator, setIsNewCollaborator] = useState(true);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    Promise.all([fetchUserSettings(userId), fetchUserProfile(userId)])
      .then(([settings, profile]) => {
        setNotif(settings.notificationsEnabled);
        setEmailDigest(settings.emailDigestEnabled);
        setFullName(profile.fullName);
        setCargo(profile.cargo);
        setRole(profile.role);
        setAvatarUrl(profile.avatarUrl);
        setIsNewCollaborator(profile.isNewCollaborator);
      })
      .catch((err) => {
        console.error(err);
        pushToast?.('Erro ao carregar configurações.', 'default');
      })
      .finally(() => setLoading(false));
  }, [userId, pushToast]);

  const persistSettings = async (next) => {
    if (!userId) return;
    try {
      await saveUserSettings(userId, next);
    } catch (err) {
      console.error(err);
      pushToast?.('Erro ao salvar configurações.', 'default');
    }
  };

  const toggleNotif = () => {
    const next = !notif;
    setNotif(next);
    persistSettings({ notificationsEnabled: next, emailDigestEnabled: emailDigest });
  };

  const toggleDigest = () => {
    const next = !emailDigest;
    setEmailDigest(next);
    persistSettings({ notificationsEnabled: notif, emailDigestEnabled: next });
  };

  const toggleNewCollaborator = async () => {
    if (!userId) return;
    const next = !isNewCollaborator;
    setIsNewCollaborator(next);
    try {
      await updateUserProfile(userId, { isNewCollaborator: next });
      onProfileUpdated?.();
      pushToast?.('Status de colaborador atualizado.', 'success');
    } catch (err) {
      console.error(err);
      setIsNewCollaborator(!next);
      pushToast?.('Erro ao atualizar status.', 'default');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!userId) return;

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      pushToast?.('Informe seu nome.', 'default');
      return;
    }

    setSavingProfile(true);
    try {
      await updateUserProfile(userId, {
        fullName: trimmedName,
        cargo: cargo.trim(),
      });
      onProfileUpdated?.();
      pushToast?.('Dados da conta atualizados.', 'success');
    } catch (err) {
      console.error(err);
      pushToast?.('Erro ao salvar dados da conta.', 'default');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) return setPasswordError('Informe a senha atual.');
    if (!newPassword) return setPasswordError('Informe a nova senha.');
    if (newPassword.length < 6) return setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
    if (newPassword !== confirmPassword) return setPasswordError('As senhas não coincidem.');

    setSavingPassword(true);
    try {
      await changeUserPassword({
        email: userEmail,
        currentPassword,
        newPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordOpen(false);
      pushToast?.('Senha alterada com sucesso.', 'success');
    } catch (err) {
      console.error(err);
      setPasswordError(err.message || 'Não foi possível alterar a senha.');
    } finally {
      setSavingPassword(false);
    }
  };

  const Toggle = ({ on, onClick, disabled }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-6 rounded-full relative transition-colors shrink-0 disabled:opacity-50"
      style={{ background: on ? BRAND : '#E5E7EB' }}
      aria-pressed={on}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: on ? 20 : 4 }}
      />
    </button>
  );

  if (loading) return null;

  return (
    <div className="max-w-lg flex flex-col gap-5">
      <div className="page-header">
        <h1 className="page-title">Configurações</h1>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          Conta
        </h2>
        <form
          onSubmit={handleSaveProfile}
          className="card divide-y divide-border"
        >
          <div className="p-4">
            <AvatarUpload
              userId={userId}
              name={fullName}
              avatarUrl={avatarUrl}
              pushToast={pushToast}
              onUpdated={async () => {
                const profile = await fetchUserProfile(userId);
                setAvatarUrl(profile.avatarUrl);
                onProfileUpdated?.();
              }}
            />
          </div>

          <div className="p-4 flex flex-col gap-1.5">
            <p className="text-sm font-medium text-ink-primary">E-mail</p>
            <p className="text-[13px]" style={{ color: '#4B5563' }}>{userEmail || '—'}</p>
            <p className="text-[11px]" style={{ color: '#9CA3AF' }}>O e-mail não pode ser alterado aqui.</p>
          </div>

          <div className="p-4">
            <Field label="Nome completo" required>
              <FInput
                value={fullName}
                onChange={setFullName}
                placeholder="Seu nome"
              />
            </Field>
          </div>

          <div className="p-4">
            <Field label="Cargo">
              <FInput
                value={cargo}
                onChange={setCargo}
                placeholder="Ex: Desenvolvedor, Designer, PM"
              />
            </Field>
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-primary)' }}>Colaborador novo</p>
              <p className="text-[12px]" style={{ color: '#4B5563' }}>
                Indica que você está em processo de onboarding.
              </p>
            </div>
            <Toggle on={isNewCollaborator} onClick={toggleNewCollaborator} />
          </div>

          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-primary)' }}>Permissão no sistema</p>
              <p className="text-[12px]" style={{ color: '#4B5563' }}>
                Nível de acesso definido pelo administrador.
              </p>
            </div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
              style={{ background: '#F3F4F6', color: '#4B5563' }}
            >
              {ROLE_LABELS[role] || role}
            </span>
          </div>

          <div className="p-4 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
              style={{ background: BRAND }}
            >
              {savingProfile && <Loader2 size={14} className="animate-spin" />}
              Salvar dados da conta
            </button>
          </div>
        </form>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
          Segurança
        </h2>
        <div
          className="rounded-lg"
          style={{ background: '#fff', border: '1px solid #E5E7EB' }}
        >
          {!passwordOpen ? (
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-primary)' }}>Senha</p>
                <p className="text-[12px]" style={{ color: '#4B5563' }}>Altere a senha de acesso à sua conta.</p>
              </div>
              <button
                type="button"
                onClick={() => setPasswordOpen(true)}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-lg shrink-0"
                style={{ background: '#F3F4F6', color: BRAND, border: '1px solid #E5E7EB' }}
              >
                Alterar senha
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="p-4 flex flex-col gap-4">
              <Field label="Senha atual" required>
                <PasswordInput
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  placeholder="Digite sua senha atual"
                />
              </Field>
              <Field label="Nova senha" required>
                <PasswordInput
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Mínimo 6 caracteres"
                />
              </Field>
              <Field label="Confirmar nova senha" required>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Repita a nova senha"
                />
              </Field>
              {passwordError && (
                <p
                  className="text-[12px] font-medium px-3 py-2 rounded-lg"
                  style={{ background: '#FEF2F2', color: '#EF4444' }}
                >
                  {passwordError}
                </p>
              )}
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordOpen(false);
                    setPasswordError('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 rounded-lg text-[13px] font-semibold"
                  style={{ background: '#F3F4F6', color: '#4B5563', border: '1px solid #E5E7EB' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
                  style={{ background: BRAND }}
                >
                  {savingPassword && <Loader2 size={14} className="animate-spin" />}
                  Salvar nova senha
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>
          Preferências
        </h2>
        <div
          className="rounded-lg divide-y"
          style={{ background: '#fff', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-primary)' }}>Notificações no produto</p>
              <p className="text-[12px]" style={{ color: '#4B5563' }}>Receba avisos sobre novos conteúdos e prazos.</p>
            </div>
            <Toggle on={notif} onClick={toggleNotif} />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-primary)' }}>Resumo semanal por e-mail</p>
              <p className="text-[12px]" style={{ color: '#4B5563' }}>Receba um resumo do seu progresso toda segunda-feira.</p>
            </div>
            <Toggle on={emailDigest} onClick={toggleDigest} />
          </div>
          <div className="flex items-center justify-between p-4">
            <div>
              <p className="text-[13.5px] font-semibold" style={{ color: 'var(--ink-primary)' }}>Tema</p>
              <p className="text-[12px]" style={{ color: '#4B5563' }}>Modo escuro chegando em breve.</p>
            </div>
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#F3F4F6', color: '#9CA3AF' }}
            >
              Claro
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;
