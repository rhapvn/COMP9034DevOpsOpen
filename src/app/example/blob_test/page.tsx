"use client";

import React, { useState } from "react";
import { uploadFile } from "src/db/api/blobServiceClient";
import { removeFile, listFiles } from "src/db/api/blobServiceServer";

export default function BlobTestPage() {
  const [uploadResult, setUploadResult] = useState<string>("");
  const [removeResult, setRemoveResult] = useState<string>("");
  const [listResult, setListResult] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [fileIdentifier, setFileIdentifier] = useState<string>("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const result = await uploadFile(selectedFile);
      setUploadResult(result?.data?.url || "");
    }
  };

  const handleRemove = async () => {
    if (fileIdentifier) {
      const result = await removeFile(fileIdentifier);
      setRemoveResult(JSON.stringify(result, null, 2));
    }
  };

  const handleList = async () => {
    const result = await listFiles();
    setListResult(JSON.stringify(result, null, 2));
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Blob Service Test</h1>

      <div className="mb-4">
        <h2 className="mb-2 text-xl font-semibold">Upload File</h2>
        <input type="file" onChange={handleFileSelect} />
        {previewUrl && (
          <div className="mt-2">
            <h3 className="mb-1 text-lg font-semibold">Preview:</h3>
            {selectedFile?.type.startsWith("image/") ? (
              <img src={previewUrl} alt="File preview" className="max-w-xs" />
            ) : (
              <p>{selectedFile?.name}</p>
            )}
          </div>
        )}
        <button
          onClick={handleUpload}
          className="mt-2 rounded bg-green-500 px-4 py-2 text-white"
          disabled={!selectedFile}
        >
          Upload File
        </button>
        <pre className="mt-2 rounded bg-gray-100 p-2">{uploadResult}</pre>
      </div>

      <div className="mb-4">
        <h2 className="mb-2 text-xl font-semibold">Remove File</h2>
        <input
          type="text"
          value={fileIdentifier}
          onChange={(e) => setFileIdentifier(e.target.value)}
          placeholder="Enter file identifier (URL or pathname)"
          className="mr-2 rounded border p-2"
        />
        <button onClick={handleRemove} className="rounded bg-red-500 px-4 py-2 text-white" disabled={!fileIdentifier}>
          Remove File
        </button>
        <pre className="mt-2 rounded bg-gray-100 p-2">{removeResult}</pre>
      </div>

      <div className="mb-4">
        <h2 className="mb-2 text-xl font-semibold">List Files</h2>
        <button onClick={handleList} className="rounded bg-blue-500 px-4 py-2 text-white">
          List Files
        </button>
        <pre className="mt-2 rounded bg-gray-100 p-2">{listResult}</pre>
      </div>
    </div>
  );
}
