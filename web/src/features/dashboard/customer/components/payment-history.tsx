"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";
import { Button } from "@/components/ui/atomic/button";

export function PaymentHistory() {
  // This would typically fetch payment data from your API
  const payments = [
    {
      id: "PAY-001",
      eventTitle: "Tech Conference 2025",
      amount: 150000,
      status: "completed",
      date: "2025-07-25",
      paymentMethod: "Bank Transfer",
      proofUploaded: true,
    },
    {
      id: "PAY-002",
      eventTitle: "Digital Marketing Workshop",
      amount: 75000,
      status: "pending",
      date: "2025-07-30",
      paymentMethod: "Credit Card",
      proofUploaded: false,
    },
    {
      id: "PAY-003",
      eventTitle: "UI/UX Design Bootcamp",
      amount: 200000,
      status: "failed",
      date: "2025-07-20",
      paymentMethod: "Bank Transfer",
      proofUploaded: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>
          Track your event payments and upload payment proofs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-medium">{payment.eventTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {payment.id} • {payment.date}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {payment.paymentMethod}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-semibold">
                    {formatCurrency(payment.amount)}
                  </p>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </Badge>
                </div>
              </div>

              {payment.status === "pending" && !payment.proofUploaded && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-amber-600 mb-2">
                    Please upload your payment proof
                  </p>
                  <Button size="sm" variant="outline">
                    Upload Proof
                  </Button>
                </div>
              )}

              {payment.proofUploaded && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-green-600">
                    ✓ Payment proof uploaded
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
