import type { BlogPost } from '../types'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="flex h-full flex-col">
      <div className="group relative aspect-[523/307] overflow-hidden bg-neutral-100">
        <img
          src={post.imageUrl}
          alt={post.imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none"
        />
        <h3 className="blog-card-title absolute left-[18px] top-[15px] max-w-[88%] text-[16px] font-bold leading-[1.12] text-neutral-900 md:max-w-[425px] md:text-[17px]">
          {post.title}
        </h3>
      </div>

      <div className="mt-[25px] flex h-[87px] items-center bg-[#dedede] px-[16px] py-3">
        <p className="blog-card-description text-left text-[13px] leading-[15px] text-neutral-700">
          {post.description}
        </p>
      </div>

      <button
        type="button"
        className="blog-card-button mx-auto mt-[31px] h-[50px] w-[253px] rounded-sm bg-[#10B8C5] text-[22px] font-bold text-white transition-colors duration-300 hover:bg-[#0ea3ae] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10B8C5] md:mx-0"
      >
        Детальніше
      </button>
    </article>
  )
}
