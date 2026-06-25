"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Key, Globe, ArrowRight, Copy, Book } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { codeExamples } from "./ApiExampleCode";
import { useCopy } from "@/hooks/useCopy";
import Link from "next/link";

export const IntegrationSetupSection = () => {
  const { copiedKeyId, copyToClipboard } = useCopy();

  return (
    <section className="py-20 relative w-full">
      <div className="absolute inset-0 z-0"></div>

      <div className="w-full mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
              Quick Integration Setup
            </h2>
          </div>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
            Get started with Trustless Work API in minutes. Learn how to
            authenticate and make your first API call.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
          {/* Authentication Info */}
          <div className="space-y-6">
            {/* Authentication Card */}
            <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Key className="w-5 h-5 text-primary flex-shrink-0" />
                  Authentication
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  All API requests require authentication using your API key as
                  a Bearer token.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <Globe className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        Base URL
                      </p>
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
                      <p className="text-sm font-medium text-foreground">
                        Header
                      </p>
                      <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                        "x-api-key": your_api_key,
                      </code>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <Book className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-2 min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        React Library
                      </p>
                      <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                        npm i @trustless-work/escrow
                      </code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Example Endpoint Card */}
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
                    <p className="text-sm font-medium text-foreground">
                      Params
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                        <span className="text-muted-foreground">
                          contractId:
                        </span>
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
          </div>

          {/* Code Examples */}
          <div className="space-y-6">
            <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Code className="w-5 h-5 text-primary flex-shrink-0" />
                  Code Examples
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Choose between REST API or React Library to see implementation
                  examples.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="rest" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="rest" className="text-xs sm:text-sm">
                      API REST
                    </TabsTrigger>
                    <TabsTrigger
                      value="react-library"
                      className="text-xs sm:text-sm"
                    >
                      React Library
                    </TabsTrigger>
                  </TabsList>

                  {/* API REST Tab */}
                  <TabsContent value="rest" className="mt-4">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
                        onClick={() =>
                          copyToClipboard(
                            `rest-${codeExamples.rest.slice(0, 20)}`,
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <div className="overflow-x-auto">
                        <SyntaxHighlighter
                          language="javascript"
                          style={oneDark}
                          customStyle={{
                            margin: 0,
                            borderRadius: "0.5rem",
                            fontSize: "0.75rem",
                            minWidth: "100%",
                          }}
                        >
                          {codeExamples.rest}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  </TabsContent>

                  {/* React Library Tab with nested tabs */}
                  <TabsContent value="react-library" className="mt-4">
                    <Tabs defaultValue="provider" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="provider"
                          className="text-xs sm:text-sm"
                        >
                          Provider
                        </TabsTrigger>
                        <TabsTrigger
                          value="react-hooks"
                          className="text-xs sm:text-sm"
                        >
                          React Hooks
                        </TabsTrigger>
                      </TabsList>

                      {/* Provider Tab */}
                      <TabsContent value="provider" className="mt-4">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
                            onClick={() =>
                              copyToClipboard(
                                `provider-${codeExamples.provider.slice(0, 20)}`,
                              )
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <div className="overflow-x-auto">
                            <SyntaxHighlighter
                              language="javascript"
                              style={oneDark}
                              customStyle={{
                                margin: 0,
                                borderRadius: "0.5rem",
                                fontSize: "0.75rem",
                                minWidth: "100%",
                              }}
                            >
                              {codeExamples.provider}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      </TabsContent>

                      {/* React Hooks Tab */}
                      <TabsContent value="react-hooks" className="mt-4">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 z-10 h-8 w-8 p-0"
                            onClick={() =>
                              copyToClipboard(
                                `react-${codeExamples.react.slice(0, 20)}`,
                              )
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <div className="overflow-x-auto">
                            <SyntaxHighlighter
                              language="javascript"
                              style={oneDark}
                              customStyle={{
                                margin: 0,
                                borderRadius: "0.5rem",
                                fontSize: "0.75rem",
                                minWidth: "100%",
                              }}
                            >
                              {codeExamples.react}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="border-2 border-border/50 bg-background/10 backdrop-blur-md shadow-sm">
                <CardContent className="px-4 py-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <ArrowRight className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold">
                        API Reference
                      </h3>
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
                      <h3 className="text-lg sm:text-xl font-semibold">
                        React Library
                      </h3>
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
          </div>
        </div>
      </div>
    </section>
  );
};
