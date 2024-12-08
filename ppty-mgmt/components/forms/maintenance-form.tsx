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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "../shared/file-uploaded";

const maintenanceFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Please provide more details"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  category: z.enum([
    "PLUMBING",
    "ELECTRICAL",
    "HVAC",
    "APPLIANCE",
    "STRUCTURAL",
    "OTHER"
  ]),
  status: z.enum(["OPEN", "IN_PROGRESS", "COMPLETED"]),
  assignedTo: z.string().optional(),
  cost: z.number().min(0).optional(),
  images: z.array(z.string()).default([]),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

interface MaintenanceFormProps {
  propertyId: string;
  tenantId: string;
  initialData?: MaintenanceFormValues;
}

export function MaintenanceForm({ propertyId, tenantId, initialData }: MaintenanceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      priority: "MEDIUM",
      category: "OTHER",
      status: "OPEN",
      assignedTo: "",
      cost: 0,
      images: [],
    },
  });

  const onSubmit = async (data: MaintenanceFormValues) => {
    try {
      setLoading(true);
      
      const response = await fetch("/api/maintenance", {
        method: initialData ? "PATCH" : "POST",
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
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create maintenance request");
      }

      toast({
        title: "Success",
        description: initialData 
          ? "Maintenance request updated successfully" 
          : "Maintenance request created successfully",
      });

      router.push(`/properties/${propertyId}/maintenance`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      console.error("[MAINTENANCE_FORM_ERROR]:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Brief description of the issue" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Provide detailed information about the maintenance issue"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
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
                    <SelectItem value="PLUMBING">Plumbing</SelectItem>
                    <SelectItem value="ELECTRICAL">Electrical</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="APPLIANCE">Appliance</SelectItem>
                    <SelectItem value="STRUCTURAL">Structural</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned To (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Name of maintenance person or contractor"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Cost (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                    placeholder="0.00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photos of the Issue</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value}
                  onUploadAction={async (formData) => {
                    try {
                      const response = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });
                      
                      if (!response.ok) throw new Error("Upload failed");
                      
                      const data = await response.json();
                      field.onChange([...field.value, ...data.urls]);
                    } catch (error) {
                      console.error("Upload failed:", error);
                      toast({
                        title: "Error",
                        description: "Failed to upload images",
                        variant: "destructive",
                      });
                    }
                  }}
                  onRemoveAction={async (url) => {
                    field.onChange(field.value.filter((current) => current !== url));
                  }}
                  accept="image/*"
                  multiple={true}
                />
              </FormControl>
              <FormDescription>
                Upload photos of the maintenance issue. This will help assess the problem.
              </FormDescription>
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
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              initialData ? "Update Request" : "Submit Request"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
