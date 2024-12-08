import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DocumentUploadForm } from "@/components/forms/document-upload-form";

export default async function UploadDocumentPage({ 
  params 
}: { 
  params: { propertyId: string } 
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Upload Document</h2>
      <DocumentUploadForm propertyId={params.propertyId} />
    </div>
  );
}
