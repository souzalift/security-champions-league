'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/server/uploadthing';

export function UploadLogo({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void;
}) {
  return (
    <UploadButton<OurFileRouter, 'equipeLogo'> // <--- Corrigido para 'equipeLogo'
      endpoint="equipeLogo"
      onClientUploadComplete={(res) => {
        if (res && res[0]?.url) {
          onUploadComplete(res[0].url);
        }
      }}
      onUploadError={(err) => {
        console.error('Erro de upload:', err);
      }}
    />
  );
}
