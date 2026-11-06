// PDF Worker entry (Web Worker) – forwards messages to the implementation

import { processPdf, PdfCommand } from "./pdfWorkerImpl";

// Types for messages
interface WorkerRequest {
  cmd: PdfCommand;
  files: File[];
}

interface WorkerResponseSuccess {
  done: true;
  blob: Blob;
  blobs?: { blob: Blob; filename: string }[];
  warnings?: string[];
}

interface WorkerResponseError {
  error: string;
}

type WorkerResponse = WorkerResponseSuccess | WorkerResponseError;

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  try {
    const { cmd, files } = e.data;
    const result = await processPdf(cmd, files);
    const response: WorkerResponseSuccess = { done: true, blob: result.blob };
    if (result.blobs) response.blobs = result.blobs;
    if (result.warnings) response.warnings = result.warnings;
    ((self as unknown as {postMessage: (msg: WorkerResponse) => void})).postMessage(response);
  } catch (err) {
    const response: WorkerResponseError = { error: (err as Error).message };
    ((self as unknown as {postMessage: (msg: WorkerResponse) => void})).postMessage(response);
  }
};

export {};

