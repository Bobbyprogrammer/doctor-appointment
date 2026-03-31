"use client";

import { Camera } from "lucide-react";

interface Props {
  image?: string;
  onChange: (file: File) => void;
}

export default function ProfileAvatarUpload({ image, onChange }: Props) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-white/5">
        {image ? (
          <img src={image} alt="profile" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white">
            No Image
          </div>
        )}
      </div>

      <label className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          Upload
        </div>

        <input
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
          }}
        />
      </label>
    </div>
  );
}