import { OurFileRouter } from '@/server/uploadthing';
import { UploadButton } from '@uploadthing/react';

type UploadImagemProps = {
  endpoint: keyof OurFileRouter;
  onUploadComplete: (url: string) => void;
};

export function UploadImagem({
  endpoint,
  onUploadComplete,
}: UploadImagemProps) {
  return (
    <UploadButton<OurFileRouter, typeof endpoint>
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (res && res[0]?.url) onUploadComplete(res[0].url);
      }}
      onUploadError={(err) => console.error(err)}
    />
  );
}
