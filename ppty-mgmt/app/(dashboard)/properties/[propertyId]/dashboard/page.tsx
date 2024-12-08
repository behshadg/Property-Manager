import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  Plus, 
  Upload,
  Building2,
  DollarSign 
} from "lucide-react";
import { format } from "date-fns";

export default async function PropertyDashboard({ 
  params 
}: { 
  params: { propertyId: string } 
}) {
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
              documents: true,
              payments: {
                orderBy: {
                  createdAt: 'desc'
                }
              }
            }
          }
        }
      },
      documents: true,
    }
  });

  if (!property) {
    redirect("/properties");
  }

  const tenants = property.units
    .map(unit => unit.tenant)
    .filter((tenant): tenant is NonNullable<typeof tenant> => tenant !== null);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/properties">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{property.name}</h2>
            <p className="text-muted-foreground">{property.address}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.units.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Units</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.documents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${tenants.reduce((sum, tenant) => sum + tenant.rentAmount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/properties/${property.id}/tenants/new`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Button>
            </Link>
          </div>

          {tenants.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40 space-y-4">
                <Users className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No tenants found</p>
                <Link href={`/properties/${property.id}/tenants/new`}>
                  <Button>Add Your First Tenant</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {property.units.map((unit) => (
                unit.tenant && (
                  <Card key={unit.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Unit {unit.unitNumber}</CardTitle>
                        <Link href={`/properties/${property.id}/tenants/${unit.tenant.id}/edit`}>
                          <Button variant="outline" size="sm">Edit Tenant</Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm font-medium">Tenant Name</p>
                          <p className="text-sm text-muted-foreground">
                            {unit.tenant.firstName} {unit.tenant.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Contact</p>
                          <p className="text-sm text-muted-foreground">{unit.tenant.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Lease Period</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(unit.tenant.leaseStart), 'PP')} - 
                            {format(new Date(unit.tenant.leaseEnd), 'PP')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Rent Amount</p>
                          <p className="text-sm text-muted-foreground">
                            ${unit.tenant.rentAmount.toLocaleString()}/month
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/properties/${property.id}/documents/upload`}>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </Link>
          </div>

          {property.documents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-40 space-y-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">No documents uploaded</p>
                <Link href={`/properties/${property.id}/documents/upload`}>
                  <Button>Upload Your First Document</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {property.documents.map((document) => (
                <Card key={document.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(document.createdAt), 'PP')}
                        </p>
                      </div>
                    </div>
                    <Link href={document.url} target="_blank">
                      <Button variant="outline" size="sm">View</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}