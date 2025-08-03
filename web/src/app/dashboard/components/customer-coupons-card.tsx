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
import { useState } from "react";

export function CustomerCouponsCard() {
  // This would typically fetch coupons data from your API
  const coupons = [
    {
      id: 1,
      code: "SUMMER25",
      discount: "25%",
      validUntil: "August 15, 2025",
      isUsed: false,
    },
    {
      id: 2,
      code: "WELCOME10",
      discount: "10%",
      validUntil: "December 31, 2025",
      isUsed: false,
    },
    {
      id: 3,
      code: "BDAY2025",
      discount: "50%",
      validUntil: "August 30, 2025",
      isUsed: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Coupons</CardTitle>
        <CardDescription>
          Available discounts for your next event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`border rounded-lg p-4 ${
                coupon.isUsed ? "opacity-50" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-sm font-bold">{coupon.code}</p>
                  <p className="text-2xl font-bold">{coupon.discount} OFF</p>
                </div>
                <Badge variant={coupon.isUsed ? "outline" : "default"}>
                  {coupon.isUsed ? "Used" : "Active"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Valid until {coupon.validUntil}
              </p>
              {!coupon.isUsed && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(coupon.code);
                    // You could add toast notification here using a toast library
                  }}
                >
                  Copy Code
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
