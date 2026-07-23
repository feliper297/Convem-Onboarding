import { supabase } from '../lib/supabase';

export const BUCKETS = {
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
};

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;

const AVATAR_TYPES = ['image/jpeg', 'image/png'];

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const DOCUMENT_TYPES = [
  ...IMAGE_TYPES,
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/markdown',
];

function extensionFromMime(mime) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'text/markdown': 'md',
  };
  return map[mime] || 'bin';
}

function validateFile(file, { maxBytes, allowedTypes, label, typeErrorMessage }) {
  if (!file) return `${label}: nenhum arquivo selecionado.`;
  if (!allowedTypes.includes(file.type)) {
    return typeErrorMessage || `${label}: tipo de arquivo não permitido.`;
  }
  if (file.size > maxBytes) {
    const mb = Math.round(maxBytes / (1024 * 1024));
    return `${label}: arquivo deve ter no máximo ${mb} MB.`;
  }
  return null;
}

export function validateAvatarFile(file) {
  return validateFile(file, {
    maxBytes: AVATAR_MAX_BYTES,
    allowedTypes: AVATAR_TYPES,
    label: 'Foto de perfil',
    typeErrorMessage: 'Foto de perfil: use apenas JPG ou PNG.',
  });
}

export function validateDocumentFile(file) {
  return validateFile(file, {
    maxBytes: DOCUMENT_MAX_BYTES,
    allowedTypes: DOCUMENT_TYPES,
    label: 'Documento',
  });
}

function publicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadAvatar(userId, file) {
  const validationError = validateAvatarFile(file);
  if (validationError) throw new Error(validationError);

  const ext = extensionFromMime(file.type);
  const path = `${userId}/avatar.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKETS.AVATARS)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const url = `${publicUrl(BUCKETS.AVATARS, path)}?t=${Date.now()}`;
  return url;
}

export async function removeAvatar(userId) {
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKETS.AVATARS)
    .list(userId);

  if (listError) throw listError;

  if (files?.length) {
    const paths = files.map((f) => `${userId}/${f.name}`);
    const { error: removeError } = await supabase.storage
      .from(BUCKETS.AVATARS)
      .remove(paths);
    if (removeError) throw removeError;
  }
}

export async function uploadProjectDocument(projectId, file) {
  const validationError = validateDocumentFile(file);
  if (validationError) throw new Error(validationError);

  const ext = extensionFromMime(file.type);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const path = `${projectId}/${Date.now()}-${safeName || `arquivo.${ext}`}`;

  const { error } = await supabase.storage
    .from(BUCKETS.DOCUMENTS)
    .upload(path, file, { upsert: false, contentType: file.type });

  if (error) throw error;

  return publicUrl(BUCKETS.DOCUMENTS, path);
}

export async function deleteProjectDocumentFromUrl(url) {
  if (!url) return;

  const marker = `/storage/v1/object/public/${BUCKETS.DOCUMENTS}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;

  const path = decodeURIComponent(url.slice(idx + marker.length).split('?')[0]);
  const { error } = await supabase.storage.from(BUCKETS.DOCUMENTS).remove([path]);
  if (error) throw error;
}
