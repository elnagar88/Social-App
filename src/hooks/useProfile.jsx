import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { getProfile } from '../api/users'
import { QUERY_KEYS } from '../config/constants'
import { UserData } from '../context/UserData'

export default function useProfile() {
  const { Token } = useContext(UserData)

  return useQuery({
    queryKey: [QUERY_KEYS.profile, Token],
    queryFn: () => getProfile(Token),
    select: (data) => data.data.data.user,
    enabled: Boolean(Token),
  })
}
