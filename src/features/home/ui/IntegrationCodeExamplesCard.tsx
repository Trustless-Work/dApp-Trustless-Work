"use client";

import { Code } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { codeExamples } from "@/features/home/ui/ApiExampleCode";
import { CopyableSyntaxBlock } from "@/features/home/ui/CopyableSyntaxBlock";

export const IntegrationCodeExamplesCard = () => (
  <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
        <Code className="w-5 h-5 text-primary flex-shrink-0" />
        Code Examples
      </CardTitle>
      <CardDescription className="text-sm sm:text-base">
        Choose between REST API or React Library to see implementation examples.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="rest" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rest" className="text-xs sm:text-sm">
            API REST
          </TabsTrigger>
          <TabsTrigger value="react-library" className="text-xs sm:text-sm">
            React Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rest" className="mt-4">
          <CopyableSyntaxBlock code={codeExamples.rest} />
        </TabsContent>

        <TabsContent value="react-library" className="mt-4">
          <Tabs defaultValue="provider" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="provider" className="text-xs sm:text-sm">
                Provider
              </TabsTrigger>
              <TabsTrigger value="react-hooks" className="text-xs sm:text-sm">
                React Hooks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="provider" className="mt-4">
              <CopyableSyntaxBlock code={codeExamples.provider} />
            </TabsContent>

            <TabsContent value="react-hooks" className="mt-4">
              <CopyableSyntaxBlock code={codeExamples.react} />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);
