import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { updatePost } from '../api/posts'
import { QUERY_KEYS } from '../config/constants'
import { UserData } from '../context/UserData'
import { getErrorMessage } from '../utils/helpers'

export default function useUpdatePost() {
  const { Token } = useContext(UserData)
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['UpdatePost'],
    mutationFn: ({ postId, body }) => updatePost(postId, body, Token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userPosts] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.singlePost] })
      toast.success('Post Updated!')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Could not update the post'))
    },
  })
}
