"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";
import { Button } from "@/components/ui/atomic/button";
import { couponService, type CouponData } from "@/lib/api/coupon-service";

interface ExtendedUser {
  id?: string;
  accessToken?: string;
}

export function CouponsCard() {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      const user = session?.user as ExtendedUser;
      if (!user?.id || !user?.accessToken) return;

      try {
        setLoading(true);
        const data = await couponService.getUserCoupons(
          Number(user.id),
          user.accessToken
        );
        setCoupons(data);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        // Keep default empty array if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [session]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Coupons</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
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
                    className="w-full mt-2 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      toast.success("Coupon code copied!");
                    }}
                  >
                    Copy Code
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No coupons available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Refer friends to get discount coupons!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
