import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UTApi } from 'uploadthing/server'

const f = createUploadthing()

export const uploadRouter = {
  fotoJogador: f({ image: { maxFileSize: '2MB' } })
    .onUploadComplete(async ({ file }) => {
      console.log('Upload completo:', file.url)
    }),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter
export const utapi = new UTApi()
