'use client';

import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';

type Photo = { id: string; url: string; caption: string | null; createdAt: string; uploader: { name: string } };
type Album = { id: string; title: string; description: string | null; scopeType: 'global' | 'classroom'; classroomId: string | null };
type Props = { albumId: string };

export function PhotoAlbumDetail({ albumId }: Props) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/albums/${albumId}/photos`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message ?? 'Não foi possível abrir o álbum.');
      setAlbum(result.data.album); setPhotos(result.data.photos);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível abrir o álbum.'); }
    finally { setLoading(false); }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void load(); }, [albumId]);

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage('');
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setMessage('Escolha uma imagem JPEG, PNG ou WebP.'); event.target.value = ''; return; }
    if (file.size > 10 * 1024 * 1024) { setMessage('A imagem deve ter no máximo 10 MB.'); event.target.value = ''; return; }
    if (photos.length >= 50) { setMessage('Este álbum já atingiu o limite de 50 fotos.'); event.target.value = ''; return; }
    setUploading(true);
    try {
      const intentResponse = await fetch('/api/v1/photos/upload-url', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumId, fileName: file.name, contentType: file.type, sizeBytes: file.size, caption: caption || undefined }),
      });
      const intent = await intentResponse.json();
      if (!intentResponse.ok) throw new Error(intent.error?.message ?? 'Não foi possível preparar o envio.');
      const uploadResponse = await fetch(intent.data.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
      if (!uploadResponse.ok) throw new Error('O armazenamento recusou o arquivo. Tente novamente.');
      const confirmResponse = await fetch(`/api/v1/albums/${albumId}/photos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objectKey: intent.data.objectKey, contentType: file.type, sizeBytes: file.size, caption: caption || undefined }),
      });
      const confirmation = await confirmResponse.json();
      if (!confirmResponse.ok) throw new Error(confirmation.error?.message ?? 'Não foi possível registrar a foto.');
      setCaption(''); setMessage('Foto enviada.'); await load();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível enviar a foto.'); }
    finally { setUploading(false); event.target.value = ''; }
  }

  return <div>
    <Link href="/fotos" className="mb-5 inline-flex text-sm font-medium text-accent hover:underline">← Voltar aos álbuns</Link>
    {album && <div className="mb-6"><p className="text-xs uppercase tracking-[0.2em] text-accent">Galeria</p><h2 className="mt-1 text-3xl font-semibold text-primary">{album.title}</h2>{album.description && <p className="mt-2 text-sm text-text-muted">{album.description}</p>}</div>}
    {album && <div className="mb-6 rounded-2xl border border-border bg-surface p-5"><h3 className="mb-3 font-semibold text-primary">Enviar uma foto</h3><div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><div><label htmlFor="photo-caption" className="mb-1 block text-sm font-medium text-ink">Legenda (opcional)</label><input id="photo-caption" maxLength={200} value={caption} onChange={(event) => setCaption(event.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5" placeholder="Escreva uma legenda" /></div><label className={`inline-flex cursor-pointer justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white ${uploading ? 'opacity-60' : ''}`}>{uploading ? 'Enviando…' : 'Escolher imagem'}<input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || photos.length >= 50} onChange={(event) => void upload(event)} /></label></div><p className="mt-2 text-xs text-text-muted">JPEG, PNG ou WebP · até 10 MB · máximo de 50 fotos.</p></div>}
    <p role="status" aria-live="polite" className="mb-4 min-h-5 text-sm text-slate-600">{message}</p>
    {photos.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">{photos.map((photo) => <figure key={photo.id} className="overflow-hidden rounded-xl border border-border bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- URLs assinadas do storage são temporárias. */}
      <img src={photo.url} alt={photo.caption ?? `Foto enviada por ${photo.uploader.name}`} className="aspect-square w-full object-cover" /><figcaption className="p-3"><p className="line-clamp-2 text-sm text-ink">{photo.caption || 'Sem legenda'}</p><p className="mt-1 text-xs text-text-muted">{photo.uploader.name} · {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(photo.createdAt))}</p></figcaption></figure>)}</div> : !loading ? <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center"><h3 className="font-semibold text-primary">Este álbum ainda está vazio</h3><p className="mt-1 text-sm text-text-muted">Envie a primeira foto para guardar esse momento.</p></div> : <p className="py-8 text-center text-sm text-text-muted">Carregando fotos…</p>}
  </div>;
}
