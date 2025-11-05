import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ChartSkeleton = () => {
  return (
    <Card className="border-gray-300">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
};