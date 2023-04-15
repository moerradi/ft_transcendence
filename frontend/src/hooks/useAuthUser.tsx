import { create } from "zustand";
import User from "../modules/user";

interface AuthUserStore {
	currentUser: User | null;
}

export const useAuthUser = create<AuthUserStore>((set) => ({
	currentUser: null,
}));
