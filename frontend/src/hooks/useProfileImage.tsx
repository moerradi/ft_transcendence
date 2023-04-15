import { create } from "zustand";

interface ProfileImageStore {
    image: string;
    setImage: (image: string) => void;
}

export const useProfileImage = create<ProfileImageStore>((set) => ({
    image: "",
    setImage: (image: string) => set((state) => ({image: image})),
}));