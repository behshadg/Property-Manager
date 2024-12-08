"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Trash, Users, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    address: string;
    price: number;
    status: string;
    images: string[];
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/properties/${property.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete property");
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group w-full h-full bg-card transition-all duration-300 hover:shadow-lg">
      <CardHeader className="relative p-0 space-y-0">
        <div className="absolute left-4 top-4 z-10">
          <Badge 
            variant={property.status === "AVAILABLE" ? "default" : "secondary"}
            className="bg-white/95 backdrop-blur-sm shadow-sm"
          >
            {property.status}
          </Badge>
        </div>
        
        <div className="absolute right-4 top-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-sm"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => router.push(`/properties/${property.id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this property?")) {
                    handleDelete();
                  }
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative w-full overflow-hidden rounded-t-lg">
          {property.images?.[0] ? (
            <div className="relative w-full pt-[56.25%]">
              <img
                src={property.images[0]}
                alt={property.name}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="w-full pt-[56.25%] bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <CardTitle className="line-clamp-1 text-xl mb-1">
              {property.name}
            </CardTitle>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1 shrink-0" />
              <p className="text-sm line-clamp-1">{property.address}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">
              ${property.price.toLocaleString()}
              <span className="text-muted-foreground text-sm font-normal">/mo</span>
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
  <Link 
    href={`/properties/${property.id}`}
    className="w-full sm:w-auto"
  >
    <Button 
      variant="outline" 
      className="w-full sm:w-auto"
    >
      View Details
    </Button>
  </Link>
  <Link 
    href={`/properties/${property.id}/dashboard`}
    className="w-full sm:w-auto"
  >
    <Button className="w-full sm:w-auto">
      <Users className="mr-2 h-4 w-4" />
      Manage Tenant Info
    </Button>
  </Link>
</div>
        </div>
      </CardContent>
    </Card>
  );
}