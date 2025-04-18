'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/server/uploadthing';

type Props = {
  onUploadComplete: (url: string) => void;
  label?: string;
};

export function UploadFoto({ onUploadComplete, label }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="text-sm font-medium leading-none text-gray-700">
          {label}
        </span>
      )}

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
            'ut-button bg-blue-600 text-gray-700 hover:bg-blue-700 px-2 py-1 text-sm rounded border border-gray-300',
          container: 'flex flex-col gap-2',
          allowedContent: 'text-xs text-gray-500 mt-1',
        }}
      />
    </div>
  );
}
