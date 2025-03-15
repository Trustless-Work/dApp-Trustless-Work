"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Contact } from "@/@types/contact.entity";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User, Mail, MapPin, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCreateContact } from "../../hooks/actions-contact.hook";

interface ContactDetailDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  contact: Contact | null;
}

const ContactDetailDialog = ({
  isDialogOpen,
  setIsDialogOpen,
  contact,
}: ContactDetailDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { handleToggleStatus } = useCreateContact();

  if (!contact) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-11/12 md:w-2/3 max-h-screen overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <DialogTitle className="text-xl font-semibold">
                {contact.name} {contact.lastName}
              </DialogTitle>
              <span className="text-sm text-muted-foreground">
                Contact Details
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Badge variant="outline" className="uppercase">
                Active
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ContactInfoCard
              title="Personal Information"
              icon={<User className="h-5 w-5 text-black" />}
              data={[
                {
                  label: "Full Name:",
                  value: `${contact.name} ${contact.lastName}`,
                },
              ]}
            />
            <ContactInfoCard
              title="Contact Details"
              icon={<Mail className="h-5 w-5 text-black" />}
              data={[
                { label: "Email:", value: contact.email },
                { label: "Type:", value: "Personal" },
              ]}
            />
          </div>

          <Card className="overflow-hidden col-span-1 md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-black" />
                  <h3 className="font-semibold">Wallet</h3>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(contact.address)}
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Address:
                  </span>
                  <span className="text-sm text-right max-w-[400px] truncate">
                    {contact.address}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex w-full justify-between">
            <p className="italic text-sm">
              <span className="font-bold mr-1">Created:</span>
              {new Date().toLocaleDateString()}
            </p>

            <div className="flex gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  // dialogStates.editMilestone.setIsOpen(true);
                }}
                variant="outline"
              >
                Edit
              </Button>

              <Button
                onClick={() => handleToggleStatus(contact.contactId)}
                type="button"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ContactInfoCardProps {
  title: string;
  icon: React.ReactNode;
  data: { label: string; value: string }[];
}

const ContactInfoCard = ({ title, icon, data }: ContactInfoCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className="space-y-4">
          {data.map(({ label, value }, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm text-right max-w-[400px] truncate">
                {value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDetailDialog;
