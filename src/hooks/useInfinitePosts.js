import { useInfiniteQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { getPosts } from '../api/posts'
import { QUERY_KEYS } from '../config/constants'
import { UserData } from '../context/UserData'

const PAGE_SIZE = 10

function getPagePosts(page) {
  return page?.data?.data?.posts ?? []
}

function getNextPage(lastPage, allPages, lastPageParam) {
  const posts = getPagePosts(lastPage)
  if (posts.length < PAGE_SIZE) return undefined

  const firstPostId = getPagePosts(allPages[0])[0]?._id
  const isRepeatedPage = allPages.length > 1 && posts[0]?._id === firstPostId
  if (isRepeatedPage) return undefined

  const nextPage = lastPage?.data?.meta?.pagination?.nextPage
  return nextPage ?? lastPageParam + 1
}

function flattenPosts(data) {
  const seen = new Set()
  return data.pages.flatMap(getPagePosts).filter((post) => {
    if (seen.has(post._id)) return false
    seen.add(post._id)
    return true
  })
}

export default function useInfinitePosts() {
  const { Token } = useContext(UserData)

  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.posts, Token],
    queryFn: ({ pageParam }) => getPosts(Token, pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: getNextPage,
    select: flattenPosts,
  })
}
