"use client";

import { Volume2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMounted } from "@/hooks/useMounted";
import {
  getStoredSoundEffectsEnabled,
  setStoredSoundEffectsEnabled,
} from "@/lib/client-storage";

export const PreferencesSection = () => {
  const mounted = useMounted();
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    setSoundEffectsEnabled(getStoredSoundEffectsEnabled());
  }, [mounted]);

  const handleSoundEffectsChange = (enabled: boolean) => {
    setStoredSoundEffectsEnabled(enabled);
    setSoundEffectsEnabled(enabled);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Personal options that apply across the app on this device.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-4 py-3">
          <div className="flex min-w-0 items-start gap-3">
            <Volume2Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 space-y-1">
              <Label htmlFor="sound-effects" className="text-sm font-medium">
                Sound effects
              </Label>
              <p className="text-sm text-muted-foreground">
                Play short sounds for success, errors, and other actions.
              </p>
            </div>
          </div>
          <Switch
            id="sound-effects"
            checked={soundEffectsEnabled}
            onCheckedChange={handleSoundEffectsChange}
            disabled={!mounted}
          />
        </div>
      </CardContent>
    </Card>
  );
};
