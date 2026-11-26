import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { likePost } from '../api/posts'
import { QUERY_KEYS } from '../config/constants'
import { UserData } from '../context/UserData'
import useProfile from './useProfile'

const LIKE_MUTATION_KEY = ['LikePost']
const POST_QUERY_KEYS = [QUERY_KEYS.posts, QUERY_KEYS.userPosts, QUERY_KEYS.singlePost]

function toggleLike(post, postId, userId) {
  if (post?._id !== postId) return post

  const likes = post.likes ?? []
  const isLiked = likes.includes(userId)
  const likesCount = typeof post.likesCount === 'number'
    ? post.likesCount + (isLiked ? -1 : 1)
    : post.likesCount

  return {
    ...post,
    likes: isLiked ? likes.filter((id) => id !== userId) : [...likes, userId],
    likesCount,
  }
}

function toggleLikeInResponse(response, postId, userId) {
  const payload = response?.data?.data
  if (!payload) return response

  const nextPayload = { ...payload }
  if (Array.isArray(payload.posts)) {
    nextPayload.posts = payload.posts.map((post) => toggleLike(post, postId, userId))
  }
  if (payload.post) {
    nextPayload.post = toggleLike(payload.post, postId, userId)
  }

  return { ...response, data: { ...response.data, data: nextPayload } }
}

function toggleLikeInCache(cached, postId, userId) {
  if (Array.isArray(cached?.pages)) {
    return { ...cached, pages: cached.pages.map((page) => toggleLikeInResponse(page, postId, userId)) }
  }
  return toggleLikeInResponse(cached, postId, userId)
}

export default function useLikePost() {
  const { Token } = useContext(UserData)
  const { data: userData } = useProfile()
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationKey: LIKE_MUTATION_KEY,
    mutationFn: (postId) => likePost(postId, Token),
    onMutate: async (postId) => {
      await Promise.all(POST_QUERY_KEYS.map((key) => queryClient.cancelQueries({ queryKey: [key] })))

      const snapshots = POST_QUERY_KEYS.flatMap((key) => queryClient.getQueriesData({ queryKey: [key] }))

      POST_QUERY_KEYS.forEach((key) => {
        queryClient.setQueriesData({ queryKey: [key] }, (cached) =>
          toggleLikeInCache(cached, postId, userData?._id)
        )
      })

      return { snapshots }
    },
    onError: (_error, _postId, context) => {
      context?.snapshots.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data))
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: LIKE_MUTATION_KEY }) > 1) return
      POST_QUERY_KEYS.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
    },
  })

  return { mutate }
}
