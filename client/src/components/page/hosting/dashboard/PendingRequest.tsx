import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingRequest() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">20</p>
      </CardContent>
    </Card>
  );
}
