import { create } from "zustand";

interface Enable2faStore {
	enable2fa: boolean;
	setEnable2fa: (check: boolean) => void;
}

export const useEnable2fa = create<Enable2faStore>((set) => ({
	enable2fa: false,
	setEnable2fa: (check: boolean) => set((state) => ({enable2fa: check})),
}));