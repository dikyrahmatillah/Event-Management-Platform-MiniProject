import { FaStar, FaUser, FaCalendarDays } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";

const organizerRating = {
  averageRating: 4.6,
  totalReviews: 142,
  ratingDistribution: {
    5: 89,
    4: 32,
    3: 15,
    2: 4,
    1: 2,
  },
};

const recentReviews = [
  {
    id: "1",
    customerName: "Sarah Johnson",
    customerAvatar: "",
    eventTitle: "Tech Conference 2024",
    rating: 5,
    comment:
      "Amazing event! The speakers were top-notch and the organization was flawless. Would definitely attend again.",
    date: "2024-07-28",
    verified: true,
  },
  {
    id: "2",
    customerName: "Michael Chen",
    customerAvatar: "",
    eventTitle: "Digital Marketing Workshop",
    rating: 4,
    comment:
      "Great content and networking opportunities. The venue could have been better but overall a good experience.",
    date: "2024-07-25",
    verified: true,
  },
  {
    id: "3",
    customerName: "Emily Davis",
    customerAvatar: "",
    eventTitle: "Startup Pitch Competition",
    rating: 5,
    comment:
      "Excellent event! Well organized, inspiring speakers, and great networking. Learned a lot about the startup ecosystem.",
    date: "2024-07-22",
    verified: true,
  },
];

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <FaStar
      key={i}
      className={`h-4 w-4 ${
        i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
      }`}
    />
  ));
};

export function EventReviews() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Reviews & Ratings</CardTitle>
            <CardDescription>
              Customer feedback from your events
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {renderStars(Math.round(organizerRating.averageRating))}
              </div>
              <span className="text-2xl font-bold">
                {organizerRating.averageRating}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on {organizerRating.totalReviews} reviews
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="text-sm font-medium mb-3">Rating Distribution</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center space-x-2">
                  <span className="w-3 text-xs">{stars}</span>
                  <FaStar className="h-3 w-3 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${
                          (organizerRating.ratingDistribution[
                            stars as keyof typeof organizerRating.ratingDistribution
                          ] /
                            organizerRating.totalReviews) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">
                    {
                      organizerRating.ratingDistribution[
                        stars as keyof typeof organizerRating.ratingDistribution
                      ]
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Recent Reviews</h4>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="flex space-x-3 rounded-lg border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <FaUser className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                          {review.customerName}
                        </p>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="text-sm text-muted-foreground">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {review.eventTitle}
                    </p>
                    <p className="text-sm">{review.comment}</p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <FaCalendarDays className="h-3 w-3" />
                      <span>
                        {new Date(review.date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
