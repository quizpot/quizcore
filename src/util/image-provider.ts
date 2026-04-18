export interface ImageProvider {
  upload: (hash: string, base64OrBlob: string) => Promise<string>;
  downloadAsBase64: (url: string) => Promise<string>;
}