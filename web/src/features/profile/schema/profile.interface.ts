export interface ProfileHeaderProps {
  firstName?: string;
  lastName?: string;
  role?: string;
  email?: string;
}

export interface ProfileAvatarProps {
  imagePreview: string | null;
  firstName?: string;
  lastName?: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
