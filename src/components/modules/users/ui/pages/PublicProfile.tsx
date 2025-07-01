"use client";

import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, MapPin, Phone, User, Wallet } from "lucide-react";
import { usePublicProfile } from "../../hooks/public-profile.hook";
import type React from "react";
import { InfoItem } from "../cards/InfoItemCards";
import { useFormatUtils } from "@/utils/hook/format.hook";
import { SkeletonPublicProfile } from "../utils/SkeletonPublicProfile";

export default function PublicProfile() {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const {
    user,
    loading: isLoading,
    error,
    fullName,
    initials,
  } = usePublicProfile(walletAddress);
  const { formatDateFromFirebase } = useFormatUtils();

  if (isLoading) {
    return <SkeletonPublicProfile />;
  }

  return (
    <>
      {!user || error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <User className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
            <p className="text-muted-foreground text-center">
              The profile you're looking for doesn't exist or you don't have
              permission to view it.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-auto">
              <Avatar className="h-32 w-32 border-2 border-primary/20 shadow-lg">
                <AvatarImage
                  src={user.profileImage || "/placeholder.svg"}
                  alt={fullName}
                />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-primary/80 to-primary/40">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 w-full">
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  {fullName}
                </h1>

                <div className="flex flex-col gap-2 mt-1">
                  {user?.createdAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Member since{" "}
                        {formatDateFromFirebase(
                          user?.createdAt?._seconds ?? 0,
                          user?.createdAt?._nanoseconds ?? 0,
                        )}
                      </span>
                    </div>
                  )}
                  {user.country && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{user.country}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 pt-5">
                {user.email && (
                  <InfoItem
                    icon={<Mail className="h-5 w-5 text-primary/70" />}
                    label="Email"
                    value={user.email}
                  />
                )}
                {user.phone && (
                  <InfoItem
                    icon={<Phone className="h-5 w-5 text-primary/70" />}
                    label="Phone"
                    value={user.phone}
                  />
                )}
                {user.address && (
                  <InfoItem
                    icon={<Wallet className="h-5 w-5 text-primary/70" />}
                    label="Wallet"
                    value={user.address}
                  />
                )}
                {!user.email && !user.phone && !user.address && (
                  <p className="text-muted-foreground text-center py-4">
                    No contact information available
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-border/40 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 pt-5">
                {user.identification && (
                  <InfoItem
                    icon={<User className="h-5 w-5 text-primary/70" />}
                    label="Identification"
                    value={user.identification}
                  />
                )}
                {user.useCase && (
                  <InfoItem
                    icon={<Wallet className="h-5 w-5 text-primary/70" />}
                    label="Use Case"
                    value={user.useCase}
                  />
                )}
                {!user.identification && !user.useCase && (
                  <p className="text-muted-foreground text-center py-4">
                    No additional details available
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
