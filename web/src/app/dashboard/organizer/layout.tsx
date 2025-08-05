import RoleGuard from "../RoleGuard";

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRoles={["ORGANIZER"]}>{children}</RoleGuard>;
}
