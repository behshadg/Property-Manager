import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  DollarSign,
  Wrench,
  FileText,
  Edit,
} from "lucide-react";
import Link from "next/link";

interface PropertyDetailsProps {
  property: any; // Replace with proper type
}

export function PropertyDetails({ property }: PropertyDetailsProps) {
  const occupiedUnits = property.units.filter((unit: any) => unit.status === "OCCUPIED").length;
  const totalUnits = property.units.length;
  const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{property.name}</h2>
          <p className="text-muted-foreground">{property.address}</p>
        </div>
        <Link href={`/properties/${property.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Property
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {occupiedUnits} of {totalUnits} units occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${property.units.reduce((acc: number, unit: any) => 
                acc + (unit.tenant?.rentAmount || 0), 0
              ).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {property.maintenanceReqs.filter((req: any) => 
                req.status !== "COMPLETED"
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="units" className="space-y-4">
        <TabsList>
          <TabsTrigger value="units">Units</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="units" className="space-y-4">
          {/* Units list component */}
        </TabsContent>
        <TabsContent value="tenants" className="space-y-4">
          {/* Tenants list component */}
        </TabsContent>
        <TabsContent value="maintenance" className="space-y-4">
          {/* Maintenance list component */}
        </TabsContent>
        <TabsContent value="documents" className="space-y-4">
          {/* Documents list component */}
        </TabsContent>
      </Tabs>
    </div>
  );
}