export interface ProfileAvatarProps {
  imagePreview: string | null;
  firstName?: string;
  lastName?: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
