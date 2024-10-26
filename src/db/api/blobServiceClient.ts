"use client";

import { type PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { DTOResponse } from "src/types";

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const FOLDER_NAME = "iconImages";

type BlobResponse = {
  filename: string;
  url: string;
  pathname: string;
  size: number;
  type: string;
};

type UploadFile = (file: File) => Promise<DTOResponse<BlobResponse | null>>;

export const uploadFile: UploadFile = async (file) => {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 1MB limit");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("File is not a supported image type");
    }

    const fileName = `${FOLDER_NAME}/${file.name}`;
    const blob: PutBlobResult = await upload(fileName, file, {
      access: "public",
      handleUploadUrl: "/api/blob/upload",
    });

    return {
      success: true,
      data: {
        filename: file.name,
        url: blob.url,
        pathname: blob.pathname,
        size: file.size,
        type: file.type,
      },
      message: "File uploaded successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
