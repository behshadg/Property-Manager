import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { TenantDetails } from "@/components/tenants/tenant-details";

interface TenantsPageProps {
  params: {
    propertyId: string;
  };
}

export default async function TenantsPage({ params }: TenantsPageProps) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const property = await db.property.findFirst({
    where: {
      id: params.propertyId,
      userId,
    },
    include: {
      units: {
        include: {
          tenant: {
            include: {
              payments: true,
              documents: true,
            },
          },
        },
      },
    },
  });

  if (!property) {
    redirect("/properties");
  }

  // Get all tenants from units
  const tenants = property.units
    .map(unit => unit.tenant)
    .filter((tenant): tenant is NonNullable<typeof tenant> => tenant !== null);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/properties/${property.id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Tenant Management</h2>
            <p className="text-muted-foreground">{property.name}</p>
          </div>
        </div>
        {property.units.some(unit => !unit.tenant) && (
          <Link href={`/properties/${property.id}/units/${property.units.find(u => !u.tenant)?.id}/tenant/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tenant
            </Button>
          </Link>
        )}
      </div>

      {tenants.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <p className="text-muted-foreground">No tenants found</p>
            {property.units.length > 0 ? (
              <Link href={`/properties/${property.id}/units/${property.units[0].id}/tenant/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Tenant
                </Button>
              </Link>
            ) : (
              <Link href={`/properties/${property.id}/units/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Unit First
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {property.units.map((unit) => (
            unit.tenant && (
              <Card key={unit.id}>
                <CardHeader>
                  <CardTitle>Unit {unit.unitNumber}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <TenantDetails tenant={unit.tenant} />
                    <div className="space-x-2">
                      <Link href={`/properties/${property.id}/units/${unit.id}/tenant/${unit.tenant.id}/edit`}>
                        <Button variant="outline">Edit Tenant</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  );
}