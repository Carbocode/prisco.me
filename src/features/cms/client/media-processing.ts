import type { FFmpeg } from "@ffmpeg/ffmpeg";

import { MAX_MEDIA_BYTES } from "../domain/media";

export const MAX_SOURCE_MEDIA_BYTES = 100 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2560;
const TARGET_OUTPUT_BYTES = Math.floor(MAX_MEDIA_BYTES * 0.9);

export type MediaProcessingUpdate = {
  phase: "preparing" | "converting" | "uploading";
  progress: number;
};
export type ProcessedMedia = { file: File; width?: number; height?: number };

let ffmpegPromise: Promise<FFmpeg> | undefined;

export async function processMediaForUpload(
  source: File,
  onUpdate: (update: MediaProcessingUpdate) => void,
): Promise<ProcessedMedia> {
  if (source.size > MAX_SOURCE_MEDIA_BYTES) {
    throw new Error("Il file originale supera il limite di 100 MiB");
  }
  if (source.type.startsWith("image/")) return processImage(source, onUpdate);
  if (source.type.startsWith("video/") || source.type.startsWith("audio/")) {
    return processAudioVideo(source, onUpdate);
  }
  throw new Error("Formato non supportato: seleziona immagine, video o audio");
}

async function processImage(
  source: File,
  onUpdate: (update: MediaProcessingUpdate) => void,
): Promise<ProcessedMedia> {
  onUpdate({ phase: "preparing", progress: 5 });
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(source, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Il browser non riesce a decodificare questa immagine");
  }
  try {
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Conversione immagini non disponibile");
    context.drawImage(bitmap, 0, 0, width, height);
    onUpdate({ phase: "converting", progress: 55 });
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.82),
    );
    if (!blob || blob.type !== "image/webp") {
      throw new Error("Questo browser non supporta la conversione WebP");
    }
    const file = new File([blob], replaceExtension(source.name, "webp"), {
      type: "image/webp",
      lastModified: Date.now(),
    });
    assertOutputSize(file);
    onUpdate({ phase: "converting", progress: 100 });
    return { file, width, height };
  } finally {
    bitmap.close();
  }
}

async function processAudioVideo(
  source: File,
  onUpdate: (update: MediaProcessingUpdate) => void,
): Promise<ProcessedMedia> {
  const isVideo = source.type.startsWith("video/");
  const metadata = await readMediaMetadata(source, isVideo);
  onUpdate({ phase: "preparing", progress: 10 });
  const ffmpeg = await getFFmpeg();
  const id = crypto.randomUUID();
  const inputName = `input-${id}.${fileExtension(source.name) || "media"}`;
  const outputName = `output-${id}.webm`;
  const listener = ({ progress }: { progress: number }) => {
    if (Number.isFinite(progress)) {
      onUpdate({ phase: "converting", progress: Math.round(Math.min(1, progress) * 100) });
    }
  };
  ffmpeg.on("progress", listener);
  try {
    const { fetchFile } = await import("@ffmpeg/util");
    await ffmpeg.writeFile(inputName, await fetchFile(source));
    const args = isVideo
      ? videoArguments(inputName, outputName, metadata.duration)
      : audioArguments(inputName, outputName, metadata.duration);
    if ((await ffmpeg.exec(args)) !== 0) throw new Error("FFmpeg conversion failed");
    const output = await ffmpeg.readFile(outputName);
    if (!(output instanceof Uint8Array)) throw new Error("Output multimediale non valido");
    const file = new File([Uint8Array.from(output)], replaceExtension(source.name, "webm"), {
      type: isVideo ? "video/webm" : "audio/webm",
      lastModified: Date.now(),
    });
    assertOutputSize(file);
    onUpdate({ phase: "converting", progress: 100 });
    return { file, width: metadata.width, height: metadata.height };
  } catch (error) {
    if (error instanceof Error && error.message.includes("5 MiB")) throw error;
    throw new Error("Conversione WebM non riuscita. Verifica formato e memoria del browser.", {
      cause: error,
    });
  } finally {
    ffmpeg.off("progress", listener);
    await Promise.allSettled([ffmpeg.deleteFile(inputName), ffmpeg.deleteFile(outputName)]);
  }
}

// Il core di ffmpeg (~30 MiB di wasm) viene caricato da CDN a runtime invece di
// essere incluso nel bundle: un asset > 25 MiB viene rifiutato da Cloudflare Workers.
const FFMPEG_CORE_BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";

async function getFFmpeg() {
  ffmpegPromise ??= (async () => {
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ]);
    const [coreURL, wasmURL] = await Promise.all([
      toBlobURL(`${FFMPEG_CORE_BASE_URL}/ffmpeg-core.js`, "text/javascript"),
      toBlobURL(`${FFMPEG_CORE_BASE_URL}/ffmpeg-core.wasm`, "application/wasm"),
    ]);
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({ coreURL, wasmURL });
    return ffmpeg;
  })().catch((error: unknown) => {
    ffmpegPromise = undefined;
    throw error;
  });
  return ffmpegPromise;
}

function videoArguments(input: string, output: string, duration: number) {
  const audioBitrate = 80_000;
  const availableBitrate = Math.floor((TARGET_OUTPUT_BYTES * 8) / duration) - audioBitrate;
  const videoBitrate = clamp(Math.floor(availableBitrate * 0.92), 150_000, 2_500_000);
  return [
    "-i",
    input,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-vf",
    `scale='min(1280,iw)':-2,scale=-2:'min(720,ih)'`,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    String(videoBitrate),
    "-crf",
    "36",
    "-deadline",
    "good",
    "-cpu-used",
    "5",
    "-row-mt",
    "1",
    "-c:a",
    "libopus",
    "-b:a",
    String(audioBitrate),
    "-vbr",
    "on",
    output,
  ];
}

function audioArguments(input: string, output: string, duration: number) {
  const targetBitrate = Math.floor(((TARGET_OUTPUT_BYTES * 8) / duration) * 0.92);
  return [
    "-i",
    input,
    "-vn",
    "-c:a",
    "libopus",
    "-b:a",
    String(clamp(targetBitrate, 32_000, 128_000)),
    "-vbr",
    "on",
    "-compression_level",
    "10",
    output,
  ];
}

function readMediaMetadata(source: File, isVideo: boolean) {
  return new Promise<{ duration: number; width?: number; height?: number }>((resolve, reject) => {
    const element = document.createElement(isVideo ? "video" : "audio");
    const url = URL.createObjectURL(source);
    element.preload = "metadata";
    element.onloadedmetadata = () => {
      const duration = element.duration;
      const video = element instanceof HTMLVideoElement ? element : undefined;
      URL.revokeObjectURL(url);
      if (!Number.isFinite(duration) || duration <= 0) {
        reject(new Error("Durata del file multimediale non valida"));
        return;
      }
      resolve({
        duration,
        width: video?.videoWidth || undefined,
        height: video?.videoHeight || undefined,
      });
    };
    element.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Il browser non riesce a leggere i metadati del file"));
    };
    element.src = url;
  });
}

function assertOutputSize(file: File) {
  if (file.size > MAX_MEDIA_BYTES) {
    throw new Error("Anche dopo la compressione il file supera il limite di 5 MiB");
  }
  if (file.size === 0) throw new Error("La conversione ha prodotto un file vuoto");
}

function replaceExtension(filename: string, extension: string) {
  const stem = filename.replace(/\.[^.]+$/, "") || "media";
  return `${stem}.${extension}`;
}

function fileExtension(filename: string) {
  return (
    filename
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") ?? ""
  );
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}
