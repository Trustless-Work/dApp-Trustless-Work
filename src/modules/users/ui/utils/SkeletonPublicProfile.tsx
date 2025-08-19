import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { Skeleton } from "@/ui/skeleton";
import { Mail, User } from "lucide-react";

export const SkeletonPublicProfile = () => {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-auto">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-64" />
            <div className="flex flex-col gap-2 mt-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-border/40">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 pt-5">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>

        <Card className="border border-border/40">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 pt-5">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
