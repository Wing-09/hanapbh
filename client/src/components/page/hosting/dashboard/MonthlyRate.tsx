import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MonthlyRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end">
        <p className="text-4xl font-bold">&#8369; 100</p>
        <p>/ month</p>
      </CardContent>
    </Card>
  );
}
