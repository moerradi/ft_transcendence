import { create } from "zustand";

interface LoggedStateStore {
    loggedState: string;
    setLoggedState: (name: string) => void;
}

export const useLoggedState = create<LoggedStateStore>((set) => ({
    loggedState: "tab-box-avatar-none",
    setLoggedState: (name: string) => set((state) => ({loggedState: name})),
}));