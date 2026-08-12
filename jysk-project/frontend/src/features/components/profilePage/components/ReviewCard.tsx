import type { Review } from "../../../types/profile";

type Props = {
  review: Review;
};

export const ReviewCard = ({ review }: Props) => {
  return (
    <article className="bg-white border border-[#dedede] shadow-[0_1px_4px_rgba(0,0,0,0.15)] p-5">
      <div className="flex flex-col lg:flex-row gap-8">

        <div className="lg:w-[140px] shrink-0">
          <h3 className="text-[20px] font-semibold">
            {review.author}
          </h3>

          <div className="mt-3 flex text-[26px]">
            {[...Array(5)].map((_, index) => (
              <span key={index}>
                {index < review.rating ? "★" : "☆"}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 lg:w-[300px] shrink-0">
          <img
            src={review.image}
            alt={review.product}
            className="w-[65px] h-[90px] object-contain"
          />

          <div>
            <h4 className="text-[22px] font-bold uppercase">
              {review.brand}
            </h4>

            <p className="text-[17px] text-[#555]">
              {review.product}
            </p>
          </div>
        </div>

        <p className="flex-1 text-[17px] leading-[24px] text-[#444]">
          {review.review}
        </p>

      </div>
    </article>
  );
};
