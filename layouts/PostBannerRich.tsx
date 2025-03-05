'use client'

import { ReactNode, useEffect, useState } from 'react'
import Image from '@/components/Image'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { formatDate } from 'pliny/utils/formatDate'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  similar?: { path: string; title: string; date: string }[]
}

interface TOCItem {
  text: string
  level: number
  id: string
}

export default function PostMinimal({ content, next, prev, children, similar }: LayoutProps) {
  const { slug, title, images, imageCover } = content
  const displayImage =
    imageCover ||
    (images && images.length > 0 ? images[0] : 'https://picsum.photos/seed/picsum/800/400')
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // 生成目录
  useEffect(() => {
    const headings = document.querySelectorAll(
      '.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6'
    )
    const tocItems: TOCItem[] = []
    let firstLevel = NaN
    headings.forEach((heading) => {
      const _level = parseInt(heading.tagName[1])
      if (isNaN(firstLevel)) firstLevel = _level
      const levelOffset = _level - firstLevel
      const level = levelOffset + 1 // 确保最小级别为1
      console.log('level', level)
      const text = heading.textContent || ''
      const id = heading.id
      tocItems.push({ text, level, id })
    })
    setToc(tocItems)

    // 创建 Intersection Observer
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '-20% 0% -35% 0%',
      threshold: 1.0,
    })

    // 观察所有标题元素
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex justify-between space-x-8">
      {/* 左侧栏 - 文章目录 */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-900/70">
          <h3 className="mb-4 text-lg font-bold">目录</h3>
          <nav>
            {toc.map((item, index) => (
              <a
                key={index}
                href={`#${item.id}`}
                className={`block py-1 pl-${(item.level - 1) * 4} text-sm transition-colors duration-200 ${
                  activeId === item.id
                    ? 'text-primary-500 font-medium'
                    : 'hover:text-primary-500 text-gray-600 dark:text-gray-300'
                }`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* 主要内容区 */}
      {/* <article className="min-w-0 flex-1"> */}
      <article className="flex-1">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-1 pb-10 text-center dark:border-gray-700">
            <div className="flex w-full justify-center">
              <div className="relative aspect-2/1 w-full">
                <Image
                  src={displayImage.trimEnd()}
                  alt={title}
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            </div>
            <div className="relative pt-10">
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none py-4">{children}</div>
          {siteMetadata.comments && (
            <div className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300" id="comment">
              <Comments slug={slug} />
            </div>
          )}
          <footer>
            <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
              {prev && prev.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${prev.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              )}
              {next && next.path && (
                <div className="pt-4 xl:pt-8">
                  <Link
                    href={`/${next.path}`}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </div>
          </footer>
        </div>
      </article>

      {/* 右侧栏 - 相关文章 */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24 rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-900/70">
          <h3 className="mb-4 text-lg font-bold">相关算法</h3>
          <div className="space-y-4">
            {/* {[prev, next].filter(Boolean).map((post) => ( */}
            {similar?.map(
              (post) =>
                post && (
                  <Link
                    href={`/${post.path}`}
                    key={post.path}
                    className="hover:text-primary-500 block"
                  >
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.date, siteMetadata.locale)}
                    </time>
                    <div className="mt-1">
                      <div
                        className={`text-sm ${post.title === title ? 'text-primary-500 font-bold uppercase' : ''}`}
                      >
                        {post.title}
                      </div>
                    </div>
                  </Link>
                )
            )}
          </div>
        </div>
      </div>

      <ScrollTopAndComment />
    </div>
  )
}
