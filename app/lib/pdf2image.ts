export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  isLoading = true;
  
  // Use dynamic import for the library
  // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
  loadPromise = import('pdfjs-dist/build/pdf.mjs').then((lib) => {
    // Set the worker source to use a CDN for robustness
    lib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.min.mjs`;
    pdfjsLib = lib;
    isLoading = false;
    return lib;
  }).catch((err) => {
    console.error("Error loading pdfjs-dist:", err);
    isLoading = false;
    loadPromise = null;
    throw err;
  });

  return loadPromise;
}

export async function convertPdfToImage(
  file: File,
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);

    const viewport = page.getViewport({ scale: 2 }); // Reduced scale for better performance
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
    }

    await page.render({ canvasContext: context!, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, '');
            const imageFile = new File([blob], `${originalName}.png`, {
              type: 'image/png',
            });

            resolve({
              imageUrl: URL.createObjectURL(blob),
              file: imageFile,
            });
          } else {
            resolve({
              imageUrl: '',
              file: null,
              error: 'Failed to create image blob',
            });
          }
        },
        'image/png',
        0.8, // Slightly reduced quality for speed
      );
    });
  } catch (err) {
    console.error("Error during PDF to image conversion:", err);
    return {
      imageUrl: '',
      file: null,
      error: `Failed to convert PDF: ${err}`,
    };
  }
}
