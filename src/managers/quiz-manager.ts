import { Quiz, QuizFile, QuizFileSchema, QuizSchema } from "../types/quiz/quiz";
import { ImageProvider } from "../util/image-provider";

export const QuizManager = {
  /**
   * Converts a QuizFile into a usable Quiz object.
   * Uploads any base64 images to the provided storage provider.
   * @param file - The input QuizFile.
   * @param storage - The ImageProvider to use for uploads.
   * @returns A Promise resolving to a Quiz object.
   */
  toObject: async (file: QuizFile, storage: ImageProvider): Promise<Quiz> => {
    const entries = Object.entries(file.images);
    
    const uploadedEntries = await Promise.all(
      entries.map(async ([hash, data]) => {
        const url = data.startsWith("http") 
          ? data 
          : await storage.upload(hash, data);
        return [hash, url];
      })
    );

    return QuizSchema.parse({
      ...file,
      images: Object.fromEntries(uploadedEntries),
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Converts a Quiz object back into a QuizFile, downloading images as base64.
   * @param quiz - The input Quiz object.
   * @param storage - The ImageProvider to use for downloads.
   * @returns A Promise resolving to a QuizFile.
   */
  toFile: async (quiz: Quiz, storage: ImageProvider): Promise<QuizFile> => {
    const entries = Object.entries(quiz.images);

    const base64Entries = await Promise.all(
      entries.map(async ([hash, url]) => {
        const base64 = await storage.downloadAsBase64(url);
        return [hash, base64];
      })
    );

    return QuizFileSchema.parse({
      ...quiz,
      images: Object.fromEntries(base64Entries),
    });
  }
};