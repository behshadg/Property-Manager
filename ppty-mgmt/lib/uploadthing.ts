import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      // Add authentication here if needed
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),

  documentUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 10 },
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;