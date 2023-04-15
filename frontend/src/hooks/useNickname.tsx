import { create } from "zustand";

interface NicknameStore {
    nickname: string;
    setNickname: (name: string) => void;
}

export const useNickname = create<NicknameStore>((set) => ({
    nickname: "",
    setNickname: (name: string) => set((state) => ({nickname: name})),
}));