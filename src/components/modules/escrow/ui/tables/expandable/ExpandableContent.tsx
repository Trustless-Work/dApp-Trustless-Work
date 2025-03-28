import { Escrow } from "@/@types/escrow.entity";
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
                {/* <TableHead>Amount</TableHead> */}
                <TableHead>In Dispute</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {escrow.milestones.map((milestone, index) => (
                <TableRow key={index}>
                  <TableCell>{milestone.description}</TableCell>
                  {/* <TableCell>amount</TableCell> */}
                  <TableCell>
                    {milestone.flag ? (
                      <Badge variant="destructive" className="uppercase">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="uppercase">
                        No
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge className="uppercase">{milestone.status}</Badge>
                  </TableCell>
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
              <EntityCard type="Approver" entity={escrow.approver} />
              <EntityCard
                type="Service Provider"
                entity={escrow.serviceProvider}
              />
            </div>
            <div className="flex gap-3 flex-col md:flex-row">
              <EntityCard
                type="Dispute Resolver"
                entity={escrow.disputeResolver}
              />
              <EntityCard
                type="Platform"
                entity={escrow.platformAddress}
                hasPercentage
                percentage={escrow.platformFee}
              />
            </div>
            <div className="flex gap-3 flex-col md:flex-row">
              <EntityCard type="Release Signer" entity={escrow.releaseSigner} />
            </div>
          </div>
        </div>
      </TableCell>
    </>
  );
};

export default ExpandableContent;
