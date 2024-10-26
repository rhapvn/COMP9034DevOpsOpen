import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSignedUser } from "@/lib/userUtils";
import { LoginUser } from "src/types";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const user = (await getSignedUser()) as LoginUser | null;
    if (!user) throw new Error("Please login again to upload files.");
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
          maximumSizeInBytes: 1024 * 1024, // 1MB
          validUntil: Date.now() + 10 * 60 * 1000, // 10 min
          tokenPayload: JSON.stringify({
            userId: user.id,
            userRole: user.role,
            pathname: pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("blob upload completed", blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
