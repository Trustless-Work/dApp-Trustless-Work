"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isMemberLinkedToUser } from "@/features/organizations/helpers/member-from-user.helper";
import type { MemberResponse } from "@/features/organizations/types/organization.types";
import { getMemberWallet } from "@/features/organizations/helpers/member-display.helper";
import { useAuth } from "@/providers/AuthProvider";
import { useWalletContext } from "@/providers/WalletProvider";

type MembersTableProps = {
  members: MemberResponse[];
};

const MemberField = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const MemberName = ({ member }: { member: MemberResponse }) => {
  const { user } = useAuth();
  const { walletAddress } = useWalletContext();
  const name = member.label?.trim() || "-";
  const isMe = user
    ? isMemberLinkedToUser(member, user, walletAddress)
    : false;

  return (
    <span className="flex flex-wrap items-center gap-2">
      <span>{name}</span>
      {isMe ? (
        <Badge variant="secondary" className="h-5 px-1.5 text-xs font-normal">
          Me
        </Badge>
      ) : null}
    </span>
  );
};

const MemberCard = ({ member }: { member: MemberResponse }) => {
  const wallet = getMemberWallet(member);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          <MemberName member={member} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <MemberField label="Wallet" value={wallet} />
      </CardContent>
    </Card>
  );
};

export const MembersTableSkeleton = () => (
  <>
    <div className="flex flex-col gap-3 md:hidden">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Wallet</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </>
);

export const MembersTable = ({ members }: MembersTableProps) => {
  return (
    <>
      <div className="flex flex-col gap-3 md:hidden">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Wallet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <MemberName member={member} />
                </TableCell>
                <TableCell>{getMemberWallet(member)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
