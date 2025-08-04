import type { ProfileAvatarProps } from "@/features/profile/schema/profile.interface";
import Image from "next/image";
import { Button } from "@/components/ui/atomic/button";

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imagePreview,
  firstName,
  lastName,
  onImageChange,
}) => (
  <div className="flex flex-col items-center gap-4">
    <div className="relative w-40 h-40">
      <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-200">
        {imagePreview ? (
          <Image
            src={imagePreview}
            alt={`${firstName}'s profile picture`}
            width={160}
            height={160}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl text-gray-500">
              {firstName?.charAt(0).toUpperCase()}
              {lastName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
    <label htmlFor="profilePicture">
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="cursor-pointer"
      >
        Change Picture
      </Button>
      <input
        id="profilePicture"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="hidden"
      />
    </label>
  </div>
);
