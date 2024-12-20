import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import SalesItem from "./SalesItem";

export interface SaleItem {
  name: string;
  email: string;
  amount: number;
  avatarSrc?: string;
}

const RecentSales = () => {
  const sales: SaleItem[] = [
    {
      name: "Olivia Martin",
      email: "olivia.martin@email.com",
      amount: 1999.0,
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: 39.0,
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: 39.0,
    },
    {
      name: "Jackson Lee",
      email: "jackson.lee@email.com",
      amount: 39.0,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">
          You made 265 sales this month.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sales.map((sale, i) => (
            <SalesItem sale={sale} i={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSales;
