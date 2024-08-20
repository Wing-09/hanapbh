import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OccupancyRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end space-x-2">
        <p className="text-4xl font-bold">52</p>
        <p>%</p>
      </CardContent>
    </Card>
  );
}
