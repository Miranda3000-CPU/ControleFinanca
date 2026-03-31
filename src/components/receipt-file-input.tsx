"use client";

import { useId, useState } from "react";

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = ["application/pdf"];

function isAllowedType(file: File) {
  return file.type.startsWith("image/") || ACCEPTED_MIME_TYPES.includes(file.type);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

type ReceiptFileInputProps = {
  base64FieldName?: string;
  mimeTypeFieldName?: string;
  fileNameFieldName?: string;
  fileSizeFieldName?: string;
  removeFieldName?: string;
  existingFileName?: string | null;
  existingMimeType?: string | null;
};

export function ReceiptFileInput({
  base64FieldName = "receiptBase64",
  mimeTypeFieldName = "receiptMimeType",
  fileNameFieldName = "receiptFileName",
  fileSizeFieldName = "receiptSize",
  removeFieldName = "removeReceipt",
  existingFileName,
  existingMimeType,
}: ReceiptFileInputProps) {
  const inputId = useId();
  const [base64, setBase64] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [error, setError] = useState("");
  const [removeExisting, setRemoveExisting] = useState(false);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setBase64("");
      setMimeType("");
      setFileName("");
      setFileSize("");
      setError("");
      return;
    }

    if (!isAllowedType(file)) {
      setError("Apenas imagem ou PDF são permitidos.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Arquivo maior que 2MB. Escolha um arquivo menor.");
      event.target.value = "";
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("Falha ao ler arquivo."));
      reader.readAsDataURL(file);
    });

    const [, payload = ""] = dataUrl.split(",");

    setBase64(payload);
    setMimeType(file.type);
    setFileName(file.name);
    setFileSize(String(file.size));
    setError("");
    setRemoveExisting(false);
  }

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-emerald-950">
        Comprovante (imagem ou PDF, até 2MB)
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="w-full cursor-pointer rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs text-emerald-900 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-100 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-900"
      />

      {fileName ? (
        <p className="text-xs text-emerald-700">
          Novo arquivo: <strong>{fileName}</strong> ({formatFileSize(Number(fileSize))})
        </p>
      ) : null}

      {!fileName && existingFileName ? (
        <p className="text-xs text-emerald-700">
          Atual: <strong>{existingFileName}</strong>
          {existingMimeType ? ` (${existingMimeType})` : ""}
        </p>
      ) : null}

      {existingFileName ? (
        <label className="inline-flex items-center gap-2 text-xs text-emerald-800">
          <input
            type="checkbox"
            name={removeFieldName}
            value="true"
            checked={removeExisting}
            onChange={(event) => setRemoveExisting(event.target.checked)}
          />
          Remover comprovante atual
        </label>
      ) : null}

      {error ? <p className="text-xs text-rose-700">{error}</p> : null}

      <input type="hidden" name={base64FieldName} value={base64} />
      <input type="hidden" name={mimeTypeFieldName} value={mimeType} />
      <input type="hidden" name={fileNameFieldName} value={fileName} />
      <input type="hidden" name={fileSizeFieldName} value={fileSize} />
    </div>
  );
}
