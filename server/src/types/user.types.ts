export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: "CUSTOMER" | "ORGANIZER";
  referredByCode?: string;
  profilePictureUrl?: string;
}
