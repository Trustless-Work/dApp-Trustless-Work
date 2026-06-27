import { Book, Globe, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const IntegrationAuthenticationCard = () => (
  <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
        <Key className="w-5 h-5 text-primary flex-shrink-0" />
        Authentication
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        All API requests require authentication using your API key as a Bearer
        token.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Globe className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-2 min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">Base URL</p>
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Badge variant="outline" className="text-xs w-fit">
                  Mainnet
                </Badge>
                <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                  https://api.trustlesswork.com
                </code>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Badge variant="outline" className="text-xs w-fit">
                  Testnet
                </Badge>
                <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                  https://api.dev.trustlesswork.com
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Key className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-2 min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">Header</p>
            <code className="text-xs bg-muted px-2 py-1 rounded break-all">
              &quot;x-api-key&quot;: your_api_key,
            </code>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Book className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="space-y-2 min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">React Library</p>
            <code className="text-xs bg-muted px-2 py-1 rounded break-all">
              npm i @trustless-work/escrow
            </code>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);
