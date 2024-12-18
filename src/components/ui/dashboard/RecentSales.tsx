import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { formatCurrency } from "@/lib/utils";

interface SaleItem {
    name: string;
    email: string;
    amount: number;
    avatarSrc?: string;
}

export function RecentSales() {
    const sales: SaleItem[] = [
        {
            name: "Olivia Martin",
            email: "olivia.martin@email.com",
            amount: 1999.00,
        },
        {
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
            amount: 39.00,
        },
        {
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
            amount: 39.00,
        },
        {
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
            amount: 39.00,
        }
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
}

function SalesItem({ sale, i }: { sale: SaleItem, i: number }) {
    return (
        <div key={i} className="flex items-center">
            <Avatar className="h-9 w-9">
                <AvatarImage src={sale.avatarSrc} alt={sale.name} />
                <AvatarFallback>
                    {sale.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">{sale.name}</p>
                <p className="text-sm text-muted-foreground">{sale.email}</p>
            </div>
            <div className="ml-auto font-medium">
                {formatCurrency(sale.amount)}
            </div>
        </div>
    );
}