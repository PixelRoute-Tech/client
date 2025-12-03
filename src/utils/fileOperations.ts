export const filetypes: Record<string, string> = {
  // Common formats
  "image/jpeg": "jpg",
  "image/pjpeg": "jpg",          // progressive jpeg
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/x-tiff": "tiff",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/avif": "avif",

  // Less common formats
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",

  "image/x-ms-bmp": "bmp",
  "image/x-portable-anymap": "pnm",
  "image/x-portable-bitmap": "pbm",
  "image/x-portable-graymap": "pgm",
  "image/x-portable-pixmap": "ppm",
  "image/x-portable-pnm": "pnm",

  "image/x-tga": "tga",
  "image/x-icns": "icns",

  // Raw image formats
  "image/x-adobe-dng": "dng",
  "image/x-canon-cr2": "cr2",
  "image/x-canon-cr3": "cr3",
  "image/x-nikon-nef": "nef",
  "image/x-sony-arw": "arw",
  "image/x-panasonic-rw2": "rw2",
  "image/x-olympus-orf": "orf",
  "image/x-fuji-raf": "raf",
  "image/x-pentax-pef": "pef",
  "image/x-sigma-x3f": "x3f",
};

export function base64ToFile(base64String: string, fileName: string): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const arr = base64String.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);

      if (!mimeMatch) {
        return reject(new Error("Invalid base64 string"));
      }

      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      resolve(new File([u8arr], fileName, { type: mime }));
    } catch (err) {
      reject(new Error("Image can't process"));
    }
  });
}
