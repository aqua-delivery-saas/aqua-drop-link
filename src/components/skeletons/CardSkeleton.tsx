import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = () => {
  return (
    <Card className="border-gray-300">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
};

export const MetricCardSkeleton = () => {
  return (
    <Card className="border-gray-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-20 mb-1" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="w-12 h-12 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
};