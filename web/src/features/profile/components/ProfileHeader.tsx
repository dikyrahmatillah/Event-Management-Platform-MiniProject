import type { ProfileHeaderProps } from "@/features/profile/schema/profile.interface";
import { Badge } from "@/components/ui/atomic/badge";

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  firstName,
  lastName,
  role,
  email,
}) => (
  <div className="space-y-1">
    <h2 className="text-2xl font-semibold">
      {firstName} {lastName}
    </h2>
    <div className="flex gap-2 items-center">
      <Badge variant="outline">{role}</Badge>
      <span className="text-sm text-muted-foreground">{email}</span>
    </div>
  </div>
);
