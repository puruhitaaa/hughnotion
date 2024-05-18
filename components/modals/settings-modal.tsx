"use client";

import { useSettings } from "@/hooks/use-settings";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";

export const SettingsModal = () => {
  const { isOpen, onClose } = useSettings();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb3">
          <h2 className="text-lg font-medium">My Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">
              Customize how Hughnotion looks on your device.
            </span>
          </div>
          <ThemeToggle />
        </div>
      </DialogContent>
    </Dialog>
  );
};
