'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/server/uploadthing';

export function UploadLogo({
  onUploadComplete,
}: {
  onUploadComplete: (url: string) => void;
}) {
  return (
    <UploadButton<OurFileRouter, 'equipeLogo'>
      endpoint="equipeLogo"
      onClientUploadComplete={(res) => {
        if (res && res[0]?.ufsUrl) {
          onUploadComplete(res[0].ufsUrl);
        }
      }}
      appearance={{
        button:
          'ut-button bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm px-4 py-2',
        container: 'flex flex-col items-start',
        allowedContent: 'text-xs text-gray-500',
      }}
      onUploadError={(err) => {
        console.error('Erro de upload:', err);
      }}
    />
  );
}
