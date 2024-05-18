import { create } from "zustand";

type Data = {
  url: string;
};

type CoverImageStore = {
  data?: Data;
  isOpen: boolean;
  onOpen: (data?: Data) => void;
  onClose: () => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
  isOpen: false,
  onOpen: (data) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: undefined }),
}));
