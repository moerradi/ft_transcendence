import { create } from "zustand";

interface ActiveTabStore {
    activeTab: number;
    setActiveTab: (name: number) => void;
}

export const useActiveTab = create<ActiveTabStore>((set) => ({
    activeTab: 0,
    setActiveTab: (name: number) => set((state) => ({activeTab: name})),
}));