import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { UserData } from '../../../context/UserContext'

export default function LikePosts(queryKeyToInvalidate) {
    const {Token} = useContext(UserData)
    const queryClient = useQueryClient()
    // Like Function
    async function Like(id) {
        return await axios.put(
            `https://route-posts.routemisr.com/posts/${id}/like`,{},
            {
                headers: {
                    token: Token,
                },
            }
        )
    }
    // Mutation
    const {mutate} = useMutation({
        mutationKey:['LikePost'],
        mutationFn:Like,
        onSuccess:()=>{            
            queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] })
        }
    })
  return {mutate}
}
