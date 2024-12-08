import { PropertyCard } from "./property-card";

export function PropertyList({ properties }: { properties: any[] }) {
  if (properties.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No properties found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}