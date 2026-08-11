import { useEffect, useState } from "react";

import { getReviews } from "../data/reviewsApi";
import type { Review } from "../profile";

import { ReviewCard } from "../components/ReviewCard";

export const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-[40px] text-center text-[18px]">
        Завантаження...
      </div>
    );
  }

  return (
    <section
      className="
        w-full
        max-w-[1440px]
        mx-auto
        px-4
        sm:px-6
        lg:px-0
        mt-[40px]
        sm:mt-[50px]
        lg:mt-[60px]
        mb-[40px]
        sm:mb-[50px]
        lg:mb-[60px]
      "
    >
      <h2
        className="
          text-[30px]
          sm:text-[36px]
          lg:text-[42px]
          font-bold
          mb-[25px]
          sm:mb-[30px]
          lg:mb-[35px]
        "
      >
        Мої відгуки
      </h2>

      <div className="flex flex-col gap-[20px]">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
          />
        ))}
      </div>
    </section>
  );
};