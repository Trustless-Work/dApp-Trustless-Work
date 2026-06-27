import { Code } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const IntegrationExampleEndpointCard = () => (
  <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
        <Code className="w-5 h-5 text-primary flex-shrink-0" />
        ExampleEndpoint
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        Here's an example of how to fund an escrow using our API.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Badge variant="secondary" className="text-xs w-fit">
            POST
          </Badge>
          <code className="text-sm bg-muted px-2 py-1 rounded break-all">
            /escrow/single-release/fund-escrow
          </code>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Params</p>
          <div className="space-y-1 text-xs">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-muted-foreground">contractId:</span>
              <span>string (required)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-muted-foreground">signer:</span>
              <span>string (required)</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
              <span className="text-muted-foreground">amount:</span>
              <span>string (required)</span>
            </div>
          </div>
          <div className="pt-2">
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs text-primary hover:text-primary/80"
              asChild
            >
              <Link
                href="https://docs.trustlesswork.com/trustless-work/developer-resources/types/payloads"
                target="_blank"
                rel="noopener noreferrer"
              >
                Payloads →
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
