import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  fields?: number;
}

export const FormSkeleton = ({ fields = 4 }: FormSkeletonProps) => {
  return (
    <Card className="border-gray-300">
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};