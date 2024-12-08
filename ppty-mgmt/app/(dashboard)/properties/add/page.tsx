import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PropertyForm } from "@/components/forms/property-form";

export default async function AddPropertyPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Add New Property</h2>
      <PropertyForm />
    </div>
  );
}