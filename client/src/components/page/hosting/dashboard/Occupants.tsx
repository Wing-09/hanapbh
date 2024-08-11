import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Occupants() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupants</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2">
        <p className="text-4xl font-bold">10</p>
        <User className="h-6" />
      </CardContent>
    </Card>
  );
}
