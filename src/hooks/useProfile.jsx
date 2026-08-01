import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { UserData } from '../context/UserContext'

export default function useProfile() {
    const {Token} = useContext(UserData)

    async function getProfileData(){
        return await axios.get(`https://route-posts.routemisr.com/users/profile-data`,{
            headers:{
                token:Token
            }
        })
    }

    return useQuery({
        queryKey:['Profile',Token],
        queryFn:getProfileData,
        select:(data)=>data.data.data.user
    })
}
