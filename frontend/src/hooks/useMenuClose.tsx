import { create } from "zustand";

interface MenuCloseStore {
    menuClose: boolean;
    menuName: string;
    setMenuClose: (check: boolean) => void;
    setMenuName: (name: string) => void;
}

export const useMenuClose = create<MenuCloseStore>((set) => ({
    menuClose: true,
    menuName: "Menu",
    setMenuClose: (check: boolean) => set((state) => ({menuClose: check})),
    setMenuName: (name: string) => set((state) => ({menuName: name})),
}));