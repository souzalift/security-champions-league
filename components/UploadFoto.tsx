'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/lib/uploadthing';

type Props = {
  onUpload: (url: string) => void;
};

export function UploadFoto({ onUpload }: Props) {
  return (
    <UploadButton<OurFileRouter>
      endpoint="fotoJogador"
      onClientUploadComplete={(res) => {
        if (res && res[0]) {
          onUpload(res[0].url);
        }
      }}
      onUploadError={(e) => alert(`Erro ao enviar: ${e.message}`)}
      appearance={{
        button:
          'bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm',
      }}
    />
  );
}
