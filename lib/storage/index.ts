import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type StoredFile = {
  key: string;
  url: string;
  size: number;
  mimeType: string;
};

export interface StorageDriver {
  put(file: File, folder: string): Promise<StoredFile>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  url(key: string): string;
}

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
}

class LocalStorage implements StorageDriver {
  private root() {
    return path.join(process.cwd(), "uploads");
  }

  async put(file: File, folder: string): Promise<StoredFile> {
    const key = `${folder}/${randomUUID()}-${sanitizeName(file.name)}`;
    const fullPath = path.join(this.root(), key);
    await mkdir(path.dirname(fullPath), { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(fullPath, buffer);

    return {
      key,
      url: this.url(key),
      size: buffer.byteLength,
      mimeType: file.type || "application/octet-stream",
    };
  }

  async get(key: string): Promise<Buffer> {
    return readFile(path.join(this.root(), key));
  }

  async delete(key: string): Promise<void> {
    await unlink(path.join(this.root(), key)).catch(() => undefined);
  }

  url(key: string) {
    return `/api/files/${key}`;
  }
}

class S3Storage implements StorageDriver {
  async put(): Promise<StoredFile> {
    throw new Error(
      "Le stockage S3 / MinIO n'est pas encore configuré. Utilisez STORAGE_DRIVER=local en développement.",
    );
  }

  async get(): Promise<Buffer> {
    throw new Error("Le stockage S3 / MinIO n'est pas encore configuré.");
  }

  async delete(): Promise<void> {
    throw new Error("Le stockage S3 / MinIO n'est pas encore configuré.");
  }

  url(key: string) {
    return key;
  }
}

export function getStorage(): StorageDriver {
  return process.env.STORAGE_DRIVER === "s3" ? new S3Storage() : new LocalStorage();
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export function assertValidUpload(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Le fichier dépasse la taille maximale de 8 Mo.");
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Ce type de fichier n'est pas autorisé.");
  }
}
