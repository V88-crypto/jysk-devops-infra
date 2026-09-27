import type { MyReviewList } from "../../../types/profile";
import { useAuth } from "../../../../shared/auth/useAuth";
import type { SectionState } from "../data/useProfileData";
import { ReviewCard } from "./ReviewCard";
import { SectionStatus } from "./SectionStatus";

type Props = {
  state: SectionState<MyReviewList>;
};

export const Reviews = ({ state }: Props) => {
  const { user } = useAuth();
  const author = user ? `${user.first_name} ${user.last_name}` : "";

  const renderContent = () => {
    if (state.status === "loading") {
      return <SectionStatus>Завантаження...</SectionStatus>;
    }

    if (state.status === "error") {
      return <SectionStatus>Не вдалося завантажити відгуки</SectionStatus>;
    }

    if (state.data.items.length === 0) {
      return <SectionStatus>Ви ще не залишили жодного відгуку</SectionStatus>;
    }

    return (
      <div className="flex flex-col gap-[20px]">
        {state.data.items.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            author={author}
          />
        ))}
      </div>
    );
  };

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

      {renderContent()}
    </section>
  );
};
