import { Escrow } from "@/@types/escrow.entity";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Divider from "@/components/utils/Divider";

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
                      <Badge variant="destructive">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge>{milestone.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* {(() => {
        const completedMilestones =
          escrow.milestones.filter(
            (milestone) =>
              milestone.status === "Completed",
          );
        const progressValue =
          (completedMilestones.length /
            escrow.milestones.length) *
          100;
        return <Progress value={progressValue} />;
      })()} */}

          {/* CAMBIAR */}
          <div className="flex flex-col gap-2 mt-4">
            <h3 className="mb-1 font-bold text-xs">Completed</h3>
            <div className="flex items-center gap-2">
              <Progress value={67} />
              <strong className="text-xs">65%</strong>
            </div>
          </div>
        </div>
      </TableCell>

      <div className="mt-8 ml-10 p-3 border rounded border-primary w-full h-full">
        <p>other data</p>
      </div>
    </>
  );
};

export default ExpandableContent;
