import type { ProfileAvatarProps } from "@/features/profile/schema/profile.interface";
import Image from "next/image";
import { Button } from "@/components/ui/atomic/button";
import { useRef } from "react";

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imagePreview,
  firstName,
  onImageChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        <div className="w-40 h-40 rounded-full overflow-hidden border border-gray-200">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt={`${firstName || "User"}'s profile picture`}
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100 text-4xl font-bold text-gray-400">
              {firstName ? firstName.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        type="button"
        className="cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        Change Picture
      </Button>
      <input
        ref={inputRef}
        id="profilePicture"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="hidden"
      />
    </div>
  );
};
