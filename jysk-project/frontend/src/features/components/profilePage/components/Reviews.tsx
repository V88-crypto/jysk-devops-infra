import { getReviews } from "../data/reviewsApi";

import { ReviewCard } from "../components/ReviewCard";
import { useAsyncData } from "../../../../shared/hooks/useAsyncData";

export const Reviews = () => {
  const { data: reviews, isLoading } = useAsyncData(getReviews);

  if (isLoading) {
    return (
      <div className="w-full py-[40px] text-center text-[18px]">
        Завантаження...
      </div>
    );
  }

  return (
    <section
      id="profile-reviews"
      className="
        scroll-mt-4
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
        {(reviews ?? []).map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
          />
        ))}
      </div>
    </section>
  );
};
