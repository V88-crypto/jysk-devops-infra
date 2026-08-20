import type { Review } from "../../../types/profile";
import { mockFetch } from "../../../../shared/api/mockDelay";

const chair = "https://placehold.co/390x502?text=BISTRUP";

const reviews: Review[] = [
  {
    id: 1,
    author: "Ім'я",
    brand: "BISTRUP",
    product: "Стілець обідній BISTRUP оливковий/дуб",
    image: chair,
    rating: 2,
    review:
      "Придбали кілька стільців BISTRUP для нашої їдальні...",
  },
  {
    id: 2,
    author: "Ім'я",
    brand: "BISTRUP",
    product: "Стілець обідній BISTRUP оливковий/дуб",
    image: chair,
    rating: 3,
    review:
      "Придбали кілька стільців BISTRUP для нашої їдальні...",
  },
  {
    id: 3,
    author: "Ім'я",
    brand: "BISTRUP",
    product: "Стілець обідній BISTRUP оливковий/дуб",
    image: chair,
    rating: 2,
    review:
      "Придбали кілька стільців BISTRUP для нашої їдальні...",
  },
];

export const getReviews = async (): Promise<Review[]> => {
  return mockFetch(reviews, 300);
};
