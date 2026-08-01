import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { FaArrowLeft, FaComment, FaHeart, FaShare } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { CreateComment } from '../../api/posts/CreatePosts/CreateComment'
import LikePosts from '../../api/posts/CreatePosts/LikePosts'
import { UserData } from '../../context/UserContext'
import useProfile from '../../hooks/useProfile'

export default function SinglePost() {
let {id} = useParams()
const {Token} = useContext(UserData)   
const navigate = useNavigate() 
const {data:userData} = useProfile()
const {mutate:Likepost} = LikePosts('SinglePost')


// PostComments Function
async function getPostComments() {
    return await axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`,{
        headers:{
            token:Token
        }
    })
}

//PostComments Query 
const {data:Comments} = useQuery({
    queryKey:['PostComments'],
    queryFn:getPostComments,
    select:(data)=>data.data.data.comments
})
  

// SinglePost Function
async function getSinglePost() {
    return await axios.get(`https://route-posts.routemisr.com/posts/${id}`,{
        headers:{
            token:Token
        }
    })
}

// SinglePost Query
const {data , isPending} = useQuery({
    queryKey:['SinglePost'],
    queryFn:getSinglePost,
    select:(data)=>{return data?.data?.data?.post}

})

  return <>
    <title>Post | Social App</title>
    <div className="min-h-screen bg-[#f0f2f5] px-4 py-6 text-slate-800 sm:px-6 lg:px-8 rounded-2xl mb-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <button onClick={()=>{navigate(-1)}} className="flex cursor-pointer w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-100 duration-200">
          <FaArrowLeft /> Back
        </button>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={data?.user?.photo}
                  alt={data?.user?.username}
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-slate-900">{data?.user?.name}</h2>
                  <p className="text-sm text-slate-500">{new Date(data?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <h1 className="mt-4 text-xl font-semibold text-slate-900 sm:text-2xl">
              {data?.body}
            </h1>

            <div className="mt-5 overflow-hidden rounded-[20px] from-slate-900 via-slate-700 to-main">
            {data?.image ?
                <img
                src={data?.image}
                alt="post"
                className="w-full h-72 object-contain"
              />:""}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-slate-100 py-3 text-xs text-slate-600 sm:gap-4 sm:text-sm">
    {data?.likes?.includes(userData._id) ?         
        <button onClick={()=>{Likepost(data.id)}} className="flex items-center justify-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-slate-100 sm:gap-2">
                <FaHeart className="text-main" /> Like
              </button>:      
    <button onClick={() => Likepost(data._id)} className="group flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium hover:bg-[#EFE7D6] transition">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C4562A"
          strokeWidth="2"
          className="transition-all duration-150 group-hover:fill-[#C4562A]"
        >
          <path d="M20.8 4.6c-1.8-1.8-4.7-1.8-6.5 0L12 6.9l-2.3-2.3c-1.8-1.8-4.7-1.8-6.5 0-1.8 1.8-1.8 4.7 0 6.5L12 20.4l8.8-9.3c1.8-1.8 1.8-4.7 0-6.5z" />
        </svg>
        Like
      </button>}
              <button className="flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-slate-100 sm:gap-2">
                <FaComment /> {data?.commentsCount ?? 0} Comments
              </button>
              <button className="flex items-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-slate-100 sm:gap-2">
                <FaShare /> {data?.sharesCount ?? 0} Shares
              </button>
            </div>
          </div>
{/* Create comment */}
  <CreateComment
    postId={id}
    Token={Token}
    userData={userData}

  />
        </div>
        

{Comments?.map((comment) => {
    return (
        <div
            key={comment?._id}
            className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5"
        >
            <h3 className="mb-3 text-base font-semibold text-slate-900 sm:text-lg">
                Comment
            </h3>
            <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <img
                                src={comment?.commentCreator?.photo}
                                alt={comment?.commentCreator?.name}
                                className="h-8 w-8 shrink-0 rounded-full object-cover xs:h-9 xs:w-9 sm:h-10 sm:w-10"
                            />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                                    {comment?.commentCreator?.name}
                                </p>
                                <p className="text-2xs text-slate-500 xs:text-xs">
                                    {new Date(comment?.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 wrap-break-word text-xs text-slate-600 sm:text-sm">
                        {comment?.content}
                    </p>
                </div>
            </div>
        </div>
    );
})}  
                
      </div>
    </div>
  </>
  
}
