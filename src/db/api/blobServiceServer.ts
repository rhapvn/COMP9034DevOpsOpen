"use server";
import { put, del, list } from "@vercel/blob";
import { DTOResponse } from "src/types";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 4MB in bytes
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
  console.log("uploadFile", file);
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds the 1MB limit");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("File is not a supported image type");
    }

    const fileName = `${FOLDER_NAME}/${file.name}`;
    const { url, pathname } = await put(fileName, file, { access: "public" });

    return {
      success: true,
      data: {
        filename: file.name,
        url,
        pathname,
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

type RemoveFile = (fileIdentifier: string) => Promise<DTOResponse<{ pathname: string } | null>>;

export const removeFile: RemoveFile = async (fileIdentifier) => {
  try {
    let pathname: string;

    // Check if the fileIdentifier is a full URL
    if (fileIdentifier.startsWith("http")) {
      const url = new URL(fileIdentifier);
      pathname = url.pathname.slice(1);
    } else if (fileIdentifier.startsWith(FOLDER_NAME)) {
      pathname = fileIdentifier;
    } else {
      pathname = `${FOLDER_NAME}/${fileIdentifier}`;
    }

    await del(pathname);

    return {
      success: true,
      data: { pathname: pathname },
      message: "File successfully deleted",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

type ListFilesResponse = {
  blobs: {
    url: string;
    pathname: string;
    size: number;
    uploadedAt: Date;
  }[];
  cursor: string | undefined;
};

type ListFiles = (limit?: number, cursor?: string) => Promise<DTOResponse<ListFilesResponse | null>>;

export const listFiles: ListFiles = async (limit = 100, cursor) => {
  try {
    const { blobs, cursor: nextCursor } = await list({
      prefix: FOLDER_NAME,
      limit,
      cursor,
    });

    return {
      success: true,
      data: {
        blobs: blobs.map(({ url, pathname, size, uploadedAt }) => ({
          url,
          pathname,
          size,
          uploadedAt,
        })),
        cursor: nextCursor,
      },
      message: "Files listed successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
