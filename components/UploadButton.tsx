'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/server/uploadthing';

type Props = {
  onUploadComplete: (url: string) => void;
};

export function UploadFoto({ onUploadComplete }: Props) {
  return (
    <div className="flex">
      {<span className="text-sm font-medium leading-none text-gray-700"></span>}

      <UploadButton<OurFileRouter, 'jogadorFoto'>
        endpoint="jogadorFoto"
        onClientUploadComplete={(res) => {
          if (res && res[0]?.ufsUrl) {
            onUploadComplete(res[0].ufsUrl);
          }
        }}
        onUploadError={(err) => {
          console.error('Erro no upload:', err);
        }}
        appearance={{
          button:
            'bg-blue-600 text-gray-700 hover:bg-blue-700 px-2 py-1 text-sm rounded border border-gray-300',
          container:
            'ut-container flex flex-col gap-2 [&_[data-ut-element=allowed-content]]:hidden',
        }}
        content={{
          button({ ready }) {
            return ready ? 'Enviar foto' : 'Carregando...';
          },
        }}
      />
    </div>
  );
}
