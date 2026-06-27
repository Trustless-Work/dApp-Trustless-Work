import { ArrowRight, Book } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const IntegrationDocsCtaCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
      <CardContent className="px-4 py-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">API Reference</h3>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Complete REST API documentation
          </p>
          <Button
            variant="outline"
            className="border-primary/20 hover:bg-primary/5 w-full sm:w-auto"
            asChild
          >
            <Link
              href="https://docs.trustlesswork.com/trustless-work/api-reference"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              View Docs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
      <CardContent className="px-4 py-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Book className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">React Library</h3>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            React hooks and components
          </p>
          <Button
            variant="outline"
            className="border-primary/20 hover:bg-primary/5 w-full sm:w-auto"
            asChild
          >
            <Link
              href="https://docs.trustlesswork.com/trustless-work/react-library"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              View Docs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
