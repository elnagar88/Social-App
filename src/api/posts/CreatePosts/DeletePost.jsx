import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { UserData } from '../../../context/UserContext'

export default function DeletePost(invalidateKey) {
  const { Token } = useContext(UserData)
  const queryClient = useQueryClient()

  async function deletePost(id) {
    return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: Token,
      },
    })
  }

  const { mutate, data, error, isError, isPending } = useMutation({
    mutationKey: ['DeletePost'],
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [invalidateKey] }),
      toast.success('Post Deleted!')
    },
  })

  return { mutate }
}
