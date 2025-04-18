import {
  createUploadthing,
  type FileRouter,
} from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  equipeLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("✅ Logo da equipe enviada:", file.url);
      // você pode salvar no banco, analytics, etc.
    }),

  jogadorFoto: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ Foto de jogador enviada:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
