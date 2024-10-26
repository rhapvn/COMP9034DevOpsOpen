"use server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function uploadProfilePic(formData: FormData): Promise<{
  success: boolean;
  path: string;
  msg: string;
}> {
  try {
    const file = formData.get("file") as File;

    if (!file) throw new Error("No file provided.");
    //validate the existence of the file
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image.");
    }

    //generate a unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "profiles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.promises.writeFile(filePath, buffer);
    console.log("Enter File Upload Util Function.");
    return {
      success: true,
      path: filePath,
      msg: "File uploaded successfully.",
    };
  } catch (error) {
    return {
      success: false,
      path: "",
      msg: error as string,
    };
  }
}
