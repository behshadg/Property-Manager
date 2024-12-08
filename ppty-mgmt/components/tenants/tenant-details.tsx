import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { User, Mail, Phone, Home, Calendar, DollarSign, FileText, Wrench } from "lucide-react";

interface TenantDetailsProps {
  tenant: any; // Replace with your tenant type
}

export function TenantDetails({ tenant }: TenantDetailsProps) {
  const isLeaseEnding = new Date(tenant.leaseEnd) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {tenant.firstName} {tenant.lastName}
          </h2>
          <p className="text-muted-foreground">
            {tenant.unit.property.name} - Unit {tenant.unit.unitNumber}
          </p>
        </div>
        <Badge variant={tenant.status === "ACTIVE" ? "default" : "secondary"}>
          {tenant.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{tenant.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{tenant.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Lease Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Start: {format(new Date(tenant.leaseStart), 'PP')}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className={isLeaseEnding ? "text-red-500" : ""}>
                End: {format(new Date(tenant.leaseEnd), 'PP')}
              </span>
            </div>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Rent: ${tenant.rentAmount}/month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              View Documents
            </Button>
            <Button className="w-full" variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance Requests</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-4">
          {tenant.payments?.map((payment: any) => (
            <Card key={payment.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">${payment.amount}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(payment.createdAt), 'PP')}
                  </p>
                </div>
                <Badge variant={payment.status === "PAID" ? "default" : "secondary"}>
                  {payment.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          {tenant.maintenanceReqs?.map((request: any) => (
            <Card key={request.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">{request.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(request.createdAt), 'PP')}
                  </p>
                </div>
                <Badge variant={request.status === "COMPLETED" ? "default" : "secondary"}>
                  {request.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {tenant.documents?.map((document: any) => (
            <Card key={document.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{document.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(document.createdAt), 'PP')}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}