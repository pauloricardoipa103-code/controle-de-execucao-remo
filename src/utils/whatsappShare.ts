import { offlineStorage } from '../services/offlineStorage';
import type { ExecutionRecord } from '../services/supabaseService';
import type { PhotoRecord, ServiceRecord } from '../types';
import { getResultLabel } from './resultLabels';
import { resolvePhotoUrl } from './photoUrl';

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const imageUrlToBlob = async (url: string) => {
  const resolvedUrl = resolvePhotoUrl(url);

  if (resolvedUrl.startsWith('data:')) {
    const response = await fetch(resolvedUrl);
    return response.blob();
  }

  if (resolvedUrl.startsWith('idb-photo:')) {
    return offlineStorage.getPhotoBlob(resolvedUrl);
  }

  const response = await fetch(resolvedUrl);
  if (!response.ok) {
    throw new Error('Nao foi possivel ler a foto para envio.');
  }

  return response.blob();
};

const openWhatsAppText = (text: string) => {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
};

const shareTextAndFiles = async (title: string, text: string, urls: string[]) => {
  if (urls.length === 0) {
    openWhatsAppText(text);
    return;
  }

  let files: File[] = [];
  try {
    files = await Promise.all(urls.map(async (url, index) => {
      const blob = await imageUrlToBlob(url);
      return new File([blob], `${title.replace(/\s+/g, '_')}_${index + 1}.jpg`, {
        type: blob.type || 'image/jpeg'
      });
    }));
  } catch (error) {
    console.warn('Falha ao baixar fotos para compartilhar, enviando so os links:', error);
    openWhatsAppText(text);
    return;
  }

  try {
    const shareData = { title, text, files };

    if (navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
      return;
    }
  } catch (error) {
    console.warn('Compartilhamento nativo de fotos falhou, enviando texto com links das fotos:', error);
  }

  openWhatsAppText(text);
};

const photoSummary = (label: string, photos: PhotoRecord[]) => {
  if (photos.length === 0) {
    return [`\n${label}`, 'Quantidade: 0 fotos'];
  }

  const gps = (photo: PhotoRecord) => (
    photo.lat != null && photo.lng != null
      ? `${photo.lat.toFixed(6)}, ${photo.lng.toFixed(6)}`
      : 'GPS nao capturado'
  );

  return [
    `\n${label}`,
    `Quantidade: ${photos.length} foto${photos.length > 1 ? 's' : ''}`,
    `Primeiro registro: ${formatDateTime(photos[0].data_hora)}`,
    `Ultimo registro: ${formatDateTime(photos[photos.length - 1].data_hora)}`,
    ...photos.map((photo, index) => {
      const linha = `Foto ${index + 1}: ${formatDateTime(photo.data_hora)} - GPS ${gps(photo)}`;
      const url = resolvePhotoUrl(photo.url);
      return url ? `${linha}\n${url}` : linha;
    })
  ];
};

export const resendServiceRecordToWhatsApp = async (record: ServiceRecord) => {
  const beforePhotos = record.fotos.filter(photo => photo.tipo === 'ANTES');
  const afterPhotos = record.fotos.filter(photo => photo.tipo === 'DEPOIS');
  const text = [
    `Status do projeto: ${getResultLabel(record.resultado)}`,
    `SI: ${record.si}`,
    record.ptp && !record.ptp.includes('???') ? `PTP: ${record.ptp}` : '',
    `Poste: ${record.poste}`,
    `Servico: ${record.tipo_servico}`,
    `Equipe: ${record.equipe}`,
    `Local: ${record.localidade}`,
    `Total de fotos: ${beforePhotos.length} antes / ${afterPhotos.length} depois`,
    record.observacao?.trim() ? `Resumo: ${record.observacao.trim()}` : '',
    ...photoSummary('DADOS DAS FOTOS ANTES', beforePhotos),
    ...photoSummary('DADOS DAS FOTOS DEPOIS', afterPhotos)
  ].filter(Boolean).join('\n');

  await shareTextAndFiles(`SI ${record.si}`, text, record.fotos.map(photo => photo.url));
};

export const resendExecutionRecordToWhatsApp = async (record: ExecutionRecord) => {
  const beforeUrls = record.fotos_antes || [];
  const afterUrls = record.fotos_depois || [];
  const photoLinks = [...beforeUrls, ...afterUrls].map((url, index) => `Foto ${index + 1}: ${url}`);
  const text = [
    `Status do projeto: ${getResultLabel(record.resultado)}`,
    `SI: ${record.si_id}`,
    `Equipe: ${record.equipe_codigo || '-'}`,
    record.ordens_servico?.poste ? `Poste: ${record.ordens_servico.poste}` : '',
    record.ordens_servico?.tipo_servico ? `Servico: ${record.ordens_servico.tipo_servico}` : '',
    record.ordens_servico?.localidade ? `Local: ${record.ordens_servico.localidade}` : '',
    `Finalizado em: ${formatDateTime(record.finalizado_em)}`,
    `Total de fotos: ${beforeUrls.length} antes / ${afterUrls.length} depois`,
    record.observacao?.trim() ? `Resumo: ${record.observacao.trim()}` : '',
    photoLinks.length ? '\nLINKS DAS FOTOS' : '',
    ...photoLinks
  ].filter(Boolean).join('\n');

  await shareTextAndFiles(`SI ${record.si_id}`, text, [...beforeUrls, ...afterUrls]);
};
