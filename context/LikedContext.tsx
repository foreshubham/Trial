import React, { createContext, ReactNode, useContext, useState } from "react";

export interface LikedItem {
  id: string;
  name: string;
  image?: string;
  type: "ride" | "food" | "shopping";
}

interface LikedContextProps {
  liked: LikedItem[];
  toggleLike: (item: LikedItem) => void;
  isLiked: (id: string) => boolean;
}

const LikedContext = createContext<LikedContextProps | undefined>(undefined);

export const LikedProvider = ({ children }: { children: ReactNode }) => {
  const [liked, setLiked] = useState<LikedItem[]>([]);

  const toggleLike = (item: LikedItem) => {
    setLiked((prev) => {
      if (prev.find((i) => i.id === item.id && i.type === item.type)) {
        return prev.filter((i) => !(i.id === item.id && i.type === item.type));
      }
      return [...prev, item];
    });
  };

  const isLiked = (id: string) => liked.some((i) => i.id === id);

  return (
    <LikedContext.Provider value={{ liked, toggleLike, isLiked }}>
      {children}
    </LikedContext.Provider>
  );
};

export const useLiked = () => {
  const context = useContext(LikedContext);
  if (!context) throw new Error("useLiked must be used within LikedProvider");
  return context;
};
