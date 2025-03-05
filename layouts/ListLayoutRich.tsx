'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent, sortPosts, allCoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import { useState } from 'react'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+$/, '') // Remove any trailing /page
  console.log(pathname)
  console.log(basePath)
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="mt-10 flex items-center justify-center space-x-2">
      <nav className="flex items-center space-x-4">
        {!prevPage && (
          <button
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500"
            disabled={!prevPage}
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            上一页
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            上一页
          </Link>
        )}
        <span className="bg-primary-500 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium text-white">
          {currentPage}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">of {totalPages}</span>
        {!nextPage && (
          <button
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-500"
            disabled={!nextPage}
          >
            下一页
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {nextPage && (
          <Link
            href={`/${basePath}/page/${currentPage + 1}`}
            rel="next"
            className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
          >
            下一页
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const years = Array.from(new Set(posts.map((post) => new Date(post.date).getFullYear()))).sort(
    (a, b) => b - a
  )

  const filteredPosts = selectedYear
    ? posts.filter((post) => new Date(post.date).getFullYear().toString() === selectedYear)
    : posts

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : filteredPosts

  return (
    <div className="flex justify-between space-x-8">
      {/* 左侧栏 - 标签目录 */}
      <div className="hidden shrink-0 lg:block lg:w-64">
        <div className="sticky top-24 overflow-y-auto rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-900/70">
          <h3 className="mb-4 text-lg font-bold">标签</h3>
          <nav className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {pathname.startsWith('/blog') ? (
              <h3 className="text-primary-500 mb-2 font-bold uppercase">所有算法</h3>
            ) : (
              <Link
                href={`/blog`}
                className="hover:text-primary-500 dark:hover:text-primary-500 font-bold text-gray-700 uppercase dark:text-gray-300"
              >
                所有算法
              </Link>
            )}
            <ul>
              {sortedTags.map((t) => (
                <li key={t} className="my-3">
                  {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                    <h3 className="text-primary-500 inline px-3 py-2 text-sm font-bold uppercase">
                      {`${t} (${tagCounts[t]})`}
                    </h3>
                  ) : (
                    <Link
                      href={`/tags/${slug(t)}`}
                      className="hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 uppercase dark:text-gray-300"
                      aria-label={`View posts tagged ${t}`}
                    >
                      {`${t} (${tagCounts[t]})`}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* 主要内容区 */}
      <article className="flex-1">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <ul>
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags } = post
            return (
              <li key={path} className="py-5">
                <article className="flex flex-col space-y-2 xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                      <time dateTime={date} suppressHydrationWarning>
                        {formatDate(date, siteMetadata.locale)}
                      </time>
                    </dd>
                  </dl>
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-2xl leading-8 font-bold tracking-tight">
                        <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                          {title}
                        </Link>
                      </h2>
                      <div className="flex flex-wrap">
                        {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                      </div>
                    </div>
                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                      {summary}
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}
      </article>

      {/* 右侧栏 - 归档 */}
      <div className="hidden shrink-0 lg:block lg:w-64">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-900/70">
            <h3 className="mb-4 text-lg font-bold">最近算法</h3>
            <div className="max-h-[calc(100vh-300px)] space-y-4 overflow-y-auto">
              {posts.slice(0, 5).map((post) => (
                <div key={post.path} className="space-y-1">
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.date, siteMetadata.locale)}
                  </time>
                  <Link
                    href={`/${post.path}`}
                    className="hover:text-primary-500 dark:hover:text-primary-400 block text-sm"
                  >
                    {post.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 shadow-md dark:bg-gray-900/70">
            <h3 className="mb-4 text-lg font-bold">年份归档</h3>
            <nav className="max-h-[calc(100vh-300px)] overflow-y-auto">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() =>
                    setSelectedYear(selectedYear === year.toString() ? null : year.toString())
                  }
                  className={`block w-full px-2 py-1.5 text-left text-sm ${
                    selectedYear === year.toString()
                      ? 'text-primary-500 font-medium'
                      : 'hover:text-primary-500 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {year}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
