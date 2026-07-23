import React, { useRef, useState } from 'react';
import { Camera, Loader2, Trash2 } from 'lucide-react';
import UserAvatar from '../ui/UserAvatar';
import { uploadAvatar, removeAvatar } from '../../services/storageService';
import { updateUserProfile } from '../../services/userService';

function AvatarUpload({ userId, name, avatarUrl, onUpdated, pushToast }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [preview, setPreview] = useState(null);

  const displayUrl = preview || avatarUrl;
  const busy = uploading || removing;

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !userId) return;

    setUploading(true);
    try {
      const url = await uploadAvatar(userId, file);
      await updateUserProfile(userId, { avatarUrl: url });
      setPreview(url);
      onUpdated?.();
      pushToast?.('Foto de perfil atualizada.', 'success');
    } catch (err) {
      console.error(err);
      pushToast?.(err.message || 'Erro ao enviar foto.', 'default');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!userId || !avatarUrl) return;
    setRemoving(true);
    try {
      await removeAvatar(userId);
      await updateUserProfile(userId, { avatarUrl: null });
      setPreview(null);
      onUpdated?.();
      pushToast?.('Foto de perfil removida.', 'success');
    } catch (err) {
      console.error(err);
      pushToast?.('Erro ao remover foto.', 'default');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative shrink-0">
        <UserAvatar name={name} avatarUrl={displayUrl} size="xl" />
        {busy && (
          <div className="absolute inset-0 rounded-full bg-ink-primary/40 flex items-center justify-center">
            <Loader2 size={22} className="animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 min-w-0">
        <p className="text-sm font-medium text-ink-primary">Foto de perfil</p>
        <p className="text-xs text-ink-secondary">JPG ou PNG · máx. 5 MB</p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="btn-secondary text-xs py-1.5"
          >
            <Camera size={14} />
            {avatarUrl || preview ? 'Alterar foto' : 'Enviar foto'}
          </button>
          {(avatarUrl || preview) && (
            <button
              type="button"
              disabled={busy}
              onClick={handleRemove}
              className="btn-ghost text-xs py-1.5 text-danger hover:bg-danger-soft"
            >
              <Trash2 size={14} />
              Remover
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          className="hidden"
          onChange={handleSelect}
        />
      </div>
    </div>
  );
}

export default AvatarUpload;
