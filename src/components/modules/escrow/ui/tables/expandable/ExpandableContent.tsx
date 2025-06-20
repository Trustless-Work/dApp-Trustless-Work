import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Divider from "@/components/utils/ui/Divider";
import EntityCard from "../../dialogs/cards/EntityCard";
import ProgressEscrow from "../../dialogs/utils/ProgressEscrow";
import { Escrow } from "@/@types/escrow.entity";
import { MultiReleaseMilestone } from "@trustless-work/escrow";

interface ExpandableContentProps {
  escrow: Escrow;
}

const ExpandableContent = ({ escrow }: ExpandableContentProps) => {
  return (
    <>
      <TableCell colSpan={5} className="p-4">
        <h3 className="mb-1 font-bold text-xs">Milestones</h3>
        <Divider type="horizontal" />
        <div className="flex flex-col">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>

                {escrow.type === "multi-release" && (
                  <>
                    <TableHead>Disputed</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Released</TableHead>
                    <TableHead>Resolved</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrow.milestones.map((milestone, index) => (
                <TableRow key={index}>
                  <TableCell>{milestone.description}</TableCell>
                  <TableCell>
                    <Badge className="uppercase">{milestone.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {(escrow.type === "multi-release" &&
                      (milestone as MultiReleaseMilestone).amount) ||
                      "N/A"}
                  </TableCell>
                  {escrow.type === "multi-release" && (
                    <>
                      <TableCell>
                        {(milestone as MultiReleaseMilestone).flags
                          ?.disputed && (
                          <Badge className="uppercase">Disputed</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {(milestone as MultiReleaseMilestone).flags
                          ?.approved && (
                          <Badge className="uppercase">Approved</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {(milestone as MultiReleaseMilestone).flags
                          ?.released && (
                          <Badge className="uppercase">Released</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {(milestone as MultiReleaseMilestone).flags
                          ?.resolved && (
                          <Badge className="uppercase">Resolved</Badge>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <ProgressEscrow escrow={escrow} />
        </div>
      </TableCell>

      <TableCell colSpan={4} className="p-4">
        <div className="flex mt-8  p-5 border rounded border-primary w-full h-full gap-5">
          <div className="flex flex-col w-full gap-5">
            <div className="flex gap-3 flex-col md:flex-row">
              <EntityCard type="Approver" entity={escrow.roles.approver} />
              <EntityCard
                type="Service Provider"
                entity={escrow.roles.serviceProvider}
              />
            </div>
            <div className="flex gap-3 flex-col md:flex-row">
              <EntityCard
                type="Dispute Resolver"
                entity={escrow.roles.disputeResolver}
              />
              <EntityCard
                type="Platform"
                entity={escrow.roles.platformAddress}
                hasPercentage
                percentage={escrow.platformFee}
              />
            </div>
            <div className="flex gap-3 flex-col md:flex-row">
              <EntityCard
                type="Release Signer"
                entity={escrow.roles.releaseSigner}
              />
              <EntityCard type="Receiver" entity={escrow.roles.receiver} />
            </div>
          </div>
        </div>
      </TableCell>
    </>
  );
};

export default ExpandableContent;
