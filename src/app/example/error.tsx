"use client";
export default function Error() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="font-bold text-red-500">Error in Example</div>;
      <div>It is displayed when page.tsx throw Error.</div>
    </div>
  );
}
