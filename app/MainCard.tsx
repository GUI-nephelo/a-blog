'use client'

import './masonry.css'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Image from '@/components/Image'
import Masonry from 'react-masonry-css'

const MAX_DISPLAY = 25

export default function Home({ posts }) {
  const breakpointColumnsObj = {
    default: 3,
    1100: 3,
    700: 3,
  }

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            算法中台
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <Masonry breakpointCols={3} className="masonry-grid" columnClassName="masonry-grid_column">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, imageCover } = post
            return (
              <div
                key={slug}
                className="m-1 transform rounded-lg bg-white shadow-md transition-transform hover:scale-105 dark:bg-gray-800"
              >
                <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                  <article>
                    {imageCover && (
                      <div className="h-48 w-full overflow-hidden rounded-t-lg">
                        <Image
                          src={imageCover.trimEnd()}
                          alt={title}
                          width={720}
                          height={480}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2 p-6">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">{title}</h2>
                          {/* <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div> */}
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            )
          })}
        </Masonry>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base leading-6 font-medium">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            所有算法 &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
