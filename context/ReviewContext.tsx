import React, { createContext, ReactNode, useContext, useState } from "react";

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  image?: string; // optional user-uploaded image
}

interface ReviewContextProps {
  reviews: Review[];
  addReview: (
    userName: string,
    rating: number,
    comment: string,
    image?: string
  ) => void;
}

const ReviewContext = createContext<ReviewContextProps | undefined>(undefined);

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      userName: "Aarav Mehta",
      rating: 5,
      comment:
        "Absolutely stunning! The quality feels premium and the design is modern.",
      date: new Date().toLocaleDateString(),
      image: "https://i.imgur.com/Yk6vZ7T.png",
    },
  ]);

  const addReview = (
    userName: string,
    rating: number,
    comment: string,
    image?: string
  ) => {
    const newReview: Review = {
      id: Math.random().toString(),
      userName,
      rating,
      comment,
      image,
      date: new Date().toLocaleDateString(),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <ReviewContext.Provider value={{ reviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReview = () => {
  const ctx = useContext(ReviewContext);
  if (!ctx) throw new Error("useReview must be used within ReviewProvider");
  return ctx;
};
