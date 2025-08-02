import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";
import { FaCalendarDays } from "react-icons/fa6";

const recentTransactions = [
  {
    id: "TRX-001",
    eventTitle: "Tech Conference 2024",
    customerName: "John Doe",
    amount: "Rp 500,000",
    status: "awaiting_confirmation",
    date: "2024-07-29",
    ticketType: "VIP",
  },
  {
    id: "TRX-002",
    eventTitle: "Music Festival",
    customerName: "Jane Smith",
    amount: "Rp 350,000",
    status: "done",
    date: "2024-07-28",
    ticketType: "Regular",
  },
  {
    id: "TRX-003",
    eventTitle: "Art Exhibition",
    customerName: "Mike Johnson",
    amount: "Rp 150,000",
    status: "waiting_payment",
    date: "2024-07-27",
    ticketType: "Premium",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "done":
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <FaCheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      );
    case "awaiting_confirmation":
      return (
        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
          <FaClock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    case "waiting_payment":
      return (
        <Badge variant="outline">
          <FaExclamationTriangle className="mr-1 h-3 w-3" />
          Waiting Payment
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="destructive">
          <FaTimesCircle className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Latest ticket purchases and payment confirmations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between space-x-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium leading-none">
                  {transaction.eventTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.customerName} • {transaction.ticketType}
                </p>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <FaCalendarDays className="h-3 w-3" />
                  <p className="text-xs">
                    {new Date(transaction.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <p className="text-sm font-medium">{transaction.amount}</p>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
