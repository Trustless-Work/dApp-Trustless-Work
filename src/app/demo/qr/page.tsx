"use client";

import { useState } from "react";
import { QREscrowDeposit } from "@/shared/qr/QREscrowDeposit";
import { EncodingStrategy } from "@/lib/qr/qr";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import { Switch } from "@/ui/switch";
import { Alert, AlertDescription } from "@/ui/alert";

// Test contract address
const testContractAddress =
  "CCTKDUS5GEXMOAWTVIEHSQHESYGHVAVPSEACUO5EM2RUGI7OC2EHY63V";

export default function QRDemoPage() {
  // Interactive test state
  const [customAddress, setCustomAddress] = useState(testContractAddress);
  const [customNetwork, setCustomNetwork] = useState<"testnet" | "mainnet">(
    "testnet",
  );
  const [customAsset, setCustomAsset] = useState("USDC"); // should have undefined
  const [customAmount, setCustomAmount] = useState("100");
  const [customEncoding, setCustomEncoding] =
    useState<EncodingStrategy>("auto");
  const [customSize, setCustomSize] = useState("220");
  const [showCaption, setShowCaption] = useState(true);

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          QR Escrow Deposit - Interactive Test
        </h1>
        <Alert>
          <AlertDescription>
            <strong>⚠️ Wallet Support Notes:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                • <strong>Freighter:</strong> May not recognize contract
                addresses or amounts in QR codes yet
              </li>
              <li>
                • <strong>Lobstr:</strong> Best support for SEP-7, but contract
                addresses may not work
              </li>
              <li>
                • <strong>Plain mode:</strong> Always works for copying address
                to clipboard
              </li>
              <li>
                • <strong>Amounts:</strong> Only included in SEP-7 mode, wallet
                support varies
              </li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              {/* Required Fields */}
              <div className="space-y-4 pb-4 border-b">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Required Fields
                </h3>

                <div>
                  <Label htmlFor="address">Contract Address (Escrow ID)</Label>
                  <Input
                    id="address"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="C..."
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Soroban contract address starting with 'C'
                  </p>
                </div>

                <div>
                  <Label htmlFor="network">Network</Label>
                  <Select
                    value={customNetwork}
                    onValueChange={(v) =>
                      setCustomNetwork(v as "testnet" | "mainnet")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testnet">Testnet</SelectItem>
                      <SelectItem value="mainnet">Mainnet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optional Fields */}
              <div className="space-y-4 pb-4 border-b">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Optional Fields
                </h3>

                <div>
                  <Label htmlFor="asset">Asset Code</Label>
                  <Select value={customAsset} onValueChange={setCustomAsset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="EURC">EURC</SelectItem>
                      <SelectItem value="XLM">XLM</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Asset to transfer
                  </p>
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="100"
                    type="text"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Amount in human units (e.g., "100", "50.25")
                  </p>
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Display Options
                </h3>

                <div>
                  <Label htmlFor="encoding">Encoding Mode</Label>
                  <Select
                    value={customEncoding}
                    onValueChange={(value) =>
                      setCustomEncoding(value as EncodingStrategy)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        Auto (Smart Selection)
                      </SelectItem>
                      <SelectItem value="plain">
                        Plain (Address Only)
                      </SelectItem>
                      <SelectItem value="sep7-suggest">
                        SEP-7 (Standard URI)
                      </SelectItem>
                      <SelectItem value="freighter-intent">
                        Freighter Intent (Experimental)
                      </SelectItem>
                      <SelectItem value="lobstr-hint">
                        Lobstr Hint (Experimental)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size">QR Code Size (pixels)</Label>
                  <Input
                    id="size"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="220"
                    type="number"
                    min="100"
                    max="400"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Between 100-400 pixels
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="caption">Show Caption</Label>
                    <p className="text-xs text-muted-foreground">
                      Display address, asset, and amount info below QR
                    </p>
                  </div>
                  <Switch
                    id="caption"
                    checked={showCaption}
                    onCheckedChange={setShowCaption}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4">
              <QREscrowDeposit
                escrowAddress={customAddress}
                network={customNetwork}
                assetCode={customAsset || undefined}
                amount={customAmount || undefined}
                encoding={customEncoding}
                size={parseInt(customSize) || 220}
                caption={showCaption}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>📱 Mobile Wallet Testing Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>Freighter Mobile:</strong>
            <ol className="mt-1 ml-4 list-decimal space-y-1">
              <li>Open Freighter on your phone</li>
              <li>Tap the scan icon</li>
              <li>Scan the QR code</li>
              <li>
                Note: Contract addresses and amounts may not be recognized yet
              </li>
            </ol>
          </div>

          <div>
            <strong>Lobstr:</strong>
            <ol className="mt-1 ml-4 list-decimal space-y-1">
              <li>Open Lobstr wallet</li>
              <li>Tap "Send" → "Scan QR"</li>
              <li>Scan the SEP-7 encoded QR</li>
              <li>
                Note: May show address but not process contract destinations
              </li>
            </ol>
          </div>

          <Alert className="mt-4">
            <AlertDescription>
              <strong>Known Limitation:</strong> Most Stellar wallets don't
              fully support Soroban contract addresses yet. The QR component
              correctly encodes the data, but wallet support for depositing to
              contracts is still evolving.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
