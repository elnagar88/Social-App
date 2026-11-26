import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { deletePost } from '../api/posts'
import { QUERY_KEYS } from '../config/constants'
import { UserData } from '../context/UserData'
import { getErrorMessage } from '../utils/helpers'

export default function useDeletePost() {
  const { Token } = useContext(UserData)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['DeletePost'],
    mutationFn: (postId) => deletePost(postId, Token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userPosts] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile] })
      toast.success('Post Deleted!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not delete the post'))
    },
  })
}
