import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Prefooter } from '@/shared/ui/Prefooter/Prefooter'
import { useAsyncData } from '@/shared/hooks/useAsyncData'
import { blogPageService } from './api/blogPageService'

export function BlogPostDetailPage() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()

  const fetchPost = useCallback(
    () => blogPageService.getPostById(Number(postId)),
    [postId],
  )
  const { data: post, isLoading } = useAsyncData(fetchPost)

  if (isLoading) {
    return (
      <>
        <p className="py-24 text-center text-neutral-500">Завантаження...</p>
        <Prefooter />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <div className="py-24 text-center text-neutral-500">
          <p>Статтю не знайдено.</p>
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="mt-4 text-primary underline hover:text-primary-dark"
          >
            Повернутися до блогу
          </button>
        </div>
        <Prefooter />
      </>
    )
  }

  return (
    <>
    <article className="mx-auto max-w-[900px] px-6 py-12">
      <button
        type="button"
        onClick={() => navigate('/blog')}
        className="mb-6 flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <span className="text-base">‹</span> Назад до блогу
      </button>

      <h1 className="mb-10 text-center text-3xl font-bold sm:text-4xl">
        {post.title}
      </h1>

      <div className="flex flex-col gap-10">
        {(post.contentBlocks ?? []).map((block) =>
          block.type === 'gallery' ? (
            <div
              key={block.id}
              className={`grid gap-4 ${
                block.images.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'
              } ${block.images.length > 2 ? 'md:grid-cols-3' : ''}`}
            >
              {block.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-100"
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div key={block.id}>
              {block.title && (
                <h2 className="mb-3 text-xl font-bold">{block.title}</h2>
              )}

              <p className="leading-relaxed whitespace-pre-line text-neutral-700">
                {block.body}
              </p>
            </div>
          ),
        )}
      </div>
    </article>

    <Prefooter />
    </>
  )
}
