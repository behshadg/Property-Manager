"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "../shared/file-uploaded";

const documentFormSchema = z.object({
  name: z.string().min(2, "Document name is required"),
  type: z.enum(["LEASE", "APPLICATION", "AGREEMENT", "ID", "INSURANCE", "OTHER"]),
  category: z.enum(["TENANT", "PROPERTY", "MAINTENANCE", "FINANCIAL", "OTHER"]),
  url: z.string().min(1, "Document URL is required"),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

interface DocumentUploadFormProps {
  propertyId: string;
  tenantId?: string;
  initialData?: DocumentFormValues;
}

export function DocumentUploadForm({ 
  propertyId, 
  tenantId, 
  initialData 
}: DocumentUploadFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: initialData || {
      name: "",
      type: "OTHER",
      category: "OTHER",
      url: "",
    },
  });

  const onSubmit = async (data: DocumentFormValues) => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          propertyId,
          tenantId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      router.push(`/properties/${propertyId}/dashboard`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter document name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LEASE">Lease Agreement</SelectItem>
                    <SelectItem value="APPLICATION">Rental Application</SelectItem>
                    <SelectItem value="AGREEMENT">Contract/Agreement</SelectItem>
                    <SelectItem value="ID">Identification</SelectItem>
                    <SelectItem value="INSURANCE">Insurance</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TENANT">Tenant</SelectItem>
                    <SelectItem value="PROPERTY">Property</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="FINANCIAL">Financial</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document File</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value ? [field.value] : []}
                  onUploadAction={async (formData) => {
                    try {
                      const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });
                      
                      if (!response.ok) throw new Error("Upload failed");
                      
                      const data = await response.json();
                      field.onChange(data.urls[0]);
                    } catch (error) {
                      console.error("Upload failed:", error);
                      toast({
                        title: "Error",
                        description: "Failed to upload document",
                        variant: "destructive",
                      });
                    }
                  }}
                  onRemoveAction={async () => {
                    field.onChange("");
                  }}
                  accept=".pdf,.doc,.docx,.txt,image/*"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>Loading...</>
            ) : (
              "Upload Document"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
