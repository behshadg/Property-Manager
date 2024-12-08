import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Plus, User, Calendar, DollarSign } from "lucide-react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function PropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const property = await db.property.findUnique({
    where: {
      id: params.propertyId,
      userId,
    },
    include: {
      units: {
        include: {
          tenant: true,
        },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const occupiedUnits = property.units.filter(unit => unit.tenant).length;
  const totalUnits = property.units.length;
  const monthlyRevenue = property.units.reduce(
    (acc, unit) => acc + (unit.tenant?.rentAmount || 0),
    0
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/properties">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">{property.name}</h2>
        </div>
        <div className="flex gap-2">
          <Link href={`/properties/${property.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Property
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="units">Units & Tenants</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Status</span>
                  <Badge>{property.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Address</span>
                  <span>{property.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Type</span>
                  <span>{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Price</span>
                  <span>${property.price.toLocaleString()}/month</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Size</span>
                  <span>{property.size} sqft</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Bedrooms</span>
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Bathrooms</span>
                  <span>{property.bathrooms}</span>
                </div>
              </CardContent>
            </Card>

            {property.images && property.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Property ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="units">
          <div className="grid gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Units Overview</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {occupiedUnits}/{totalUnits} Units Occupied
                  </Badge>
                  <Badge variant="secondary">
                    ${monthlyRevenue.toLocaleString()}/month
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {property.units.map((unit) => (
              <Card key={unit.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle>Unit {unit.unitNumber}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {unit.tenant ? "Occupied" : "Vacant"}
                      </p>
                    </div>
                    <Badge variant={unit.tenant ? "default" : "secondary"}>
                      {unit.tenant ? "Occupied" : "Vacant"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {unit.tenant ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {unit.tenant.firstName} {unit.tenant.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {unit.tenant.email}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            Lease ends: {format(new Date(unit.tenant.leaseEnd), "PP")}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <DollarSign className="mr-2 h-4 w-4" />
                            ${unit.tenant.rentAmount}/month
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Link href={`/properties/${params.propertyId}/units/${unit.id}/tenant/${unit.tenant.id}/edit`}>
                            <Button>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Tenant
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Link href={`/properties/${params.propertyId}/units/${unit.id}/tenant/new`}>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Tenant
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}