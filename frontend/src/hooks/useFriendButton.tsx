import { create } from "zustand";

interface FriendButtonStore {
    friendButton: string;
    setFriendButton: (name: string) => void;
}

export const useFriendButton = create<FriendButtonStore>((set) => ({
    friendButton: "",
    setFriendButton: (name: string) => set((state) => ({friendButton: name})),
}));