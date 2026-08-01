import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { MdModeEditOutline } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { CreateComment } from '../../api/posts/CreatePosts/CreateComment';
import CreatePosts from '../../api/posts/CreatePosts/CreatePosts';
import DeletePost from '../../api/posts/CreatePosts/DeletePost';
import LikePosts from '../../api/posts/CreatePosts/LikePosts';
import useProfile from '../../hooks/useProfile';
import { UserData } from './../../context/UserContext';

export default function Home() {
  const { Token } = useContext(UserData)
  const { mutate: deletePostMutate } = DeletePost('Posts')
  const { data: userData } = useProfile()
  const { mutate: Likepost } = LikePosts('Posts')

  // getPosts Function
  async function getPosts() {
    return await axios.get('https://route-posts.routemisr.com/posts?limit=50&sort=-createdAt', {
      headers: {
        token: Token
      }
    })
  }
  // Use Query for posts
  const { data, isError, error, isPending } = useQuery({
    queryKey: ['Posts', Token],
    queryFn: getPosts,
    select: (data) => data.data.data.posts
  })
  if (isPending) {
    return <div className='flex items-center justify-center h-96'>
      <span className="loader "></span>
    </div>
  }
  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return <>
    <title>Home | Social App</title>
    <CreatePosts />
    {data?.map((post) => {
      return <article key={post._id} className="bg-[#FBF8F1] border border-[#DED4BE] rounded-2xl overflow-hidden mb-4">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-full p-0.5 ">
              <img
                src={post?.user?.photo}
                className="w-12 h-12 rounded-full object-cover"
                alt={post?.user?.username}
              />
            </div>
            <div>
              <p className="font-semibold leading-tight text-[#24211B]">{post.user.name}</p>
              <p className="text-xs text-[#6B6456]">{new Date(post?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          {post?.user?._id == userData?._id ?
            <span className='flex items-center gap-3 text-2xl pt-2.5 cursor-pointer'>
              <MdModeEditOutline className='text-xl' />
              <IoClose onClick={() => { deletePostMutate(post._id) }} />
            </span> : ''}
        </div>

        <Link to={`/singlepost/${post._id}`}>
          {/* Text */}
          <p className="px-6 pb-2 text-[15px] leading-relaxed text-[#24211B]">
            {post.body}
          </p>

          {/* Image */}
          <div className="cursor-pointer">
            {post?.image ?
              <img
                src={post?.image}
                className="w-full h-72 object-contain"
                alt={post?.body}
              /> : ""}
          </div>

          {/* Reactions summary */}
          <div className="flex items-center justify-between px-6 pt-4 text-xs text-[#6B6456]">
            <div className='flex items-center gap-1'>
              <span><FaHeart /></span>
              <span>{post.likesCount}</span>
            </div>
            <span>{post.commentsCount} comments</span>
          </div>

        </Link>
        {/* Action buttons */}
        <div className="mx-6 mt-3 pt-3 pb-2 border-t border-[#DED4BE] grid grid-cols-2">
          {post?.likes?.includes(userData._id) ?
            <button onClick={() => { Likepost(post._id) }} className="flex items-center justify-center gap-1.5 rounded-full px-2 py-1 transition hover:bg-slate-100 sm:gap-2">
              <FaHeart className="text-main" /> Like
            </button> :
            <button onClick={() => Likepost(post._id)} className="group flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium hover:bg-[#EFE7D6] transition">
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

          <button className="group flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium hover:bg-[#EFE7D6] transition">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#586049"
              strokeWidth="2"
              className="transition-all duration-150 group-hover:fill-[#586049]"
            >
              <path d="M21 11.5a8.5 8.5 0 0 1-11.8 7.8L4 21l1.7-5.2A8.5 8.5 0 1 1 21 11.5z" />
            </svg>
            Comment
          </button>
        </div>
        {/* Static Comment */}
        {post?.topComment ? (
          <div className="mx-2 xs:mx-3 sm:mx-6 mb-4 flex items-start gap-1.5 sm:gap-2.5">
            <img
              src={post?.topComment?.commentCreator?.photo}
              className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
              alt={post?.topComment?.commentCreator?.name}
            />

            <div className="flex-1 min-w-0">
              <div className="bg-[#EFE7D6] rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs xs:text-sm font-semibold text-[#24211B]">
                    {post?.topComment?.commentCreator?.name}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#24211B] wrap-break-word">
                  {post?.topComment?.content}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-1 px-2 text-2xs xs:text-xs text-[#6B6456]">
                <span>{new Date(post?.topComment?.createdAt).toLocaleDateString()}</span>
                <button className="font-medium hover:text-[#C4562A] transition">
                  Like
                </button>
                <button className="font-medium hover:text-[#C4562A] transition">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}


        {/* Create comment */}
        <CreateComment
          postId={post._id}
          Token={Token}
          userData={userData}

        />

      </article>
    })}
  </>
}
