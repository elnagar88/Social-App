import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { CreateComment } from '../../api/posts/CreatePosts/CreateComment';
import DeletePost from '../../api/posts/CreatePosts/DeletePost';
import LikePosts from '../../api/posts/CreatePosts/LikePosts';
import { Stat } from '../../components/UI/Stat';
import useProfile from '../../hooks/useProfile';
import { Detail } from './../../components/UI/Detail';
import { IconAt } from './../../components/UI/IconAt';
import { IconCalendar } from './../../components/UI/IconCalendar';
import { IconMail } from './../../components/UI/IconMail';
import { UserData } from './../../context/UserContext';

export default function Profile() {
  const { data, isPending, isError, error } = useProfile();
  const { Token } = useContext(UserData)
  const { mutate: deletePostMutate } = DeletePost('UserPosts')
  const { mutate: Likepost } = LikePosts('UserPosts')


  // UserPosts Function 
  async function userPosts() {
    return await axios.get(`https://route-posts.routemisr.com/users/${data?.id}/posts?limit=2`, {
      headers: {
        token: Token
      }
    })
  }

  // UserPosts Query
  const { data: userPost } = useQuery({
    queryKey: ['UserPosts'],
    queryFn: userPosts,
    select: (userPost) => userPost?.data?.data?.posts
  })


  if (isPending) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center text-slate-500">
        Loading profile…
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center text-red-500">
        {error?.message || 'Something went wrong.'}
      </section>
    );
  }

  return <>
    <title>Profile | Social App</title>
    <section className="min-h-screen bg-white px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Profile header */}
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
          <div className="h-24 w-24 flex-none overflow-hidden rounded-full ring-2 ring-teal-100 sm:h-28 sm:w-28">
            <img
              src={data?.photo}
              alt={data?.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex w-full flex-col items-center gap-4 sm:items-start">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {data?.name}
              </h1>
              <p className="mt-0.5 flex items-center justify-center gap-1 text-sm text-slate-400 sm:justify-start">
                <IconAt className="h-3.5 w-3.5" />
                {data?.username}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 sm:justify-start sm:gap-10">
              <Stat label="Posts" value={data?.posts?.length ?? 0} />
              <Stat label="Followers" value={data?.followers?.length ?? 0} />
              <Stat label="Following" value={data?.following?.length ?? 0} />
            </div>

            {/* Contact / joined */}
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <Detail icon={<IconMail className="h-4 w-4" />} label="Contact" value={data?.email} />
              <Detail
                icon={<IconCalendar className="h-4 w-4" />}
                label="Joined"
                value={data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : '—'}
              />
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-10 border-t border-slate-100 pt-6">
          <h2 className="text-sm mb-5 font-semibold uppercase tracking-wider text-slate-500">
            Posts
          </h2>

          {userPost?.length ? (
            <div className="">
              {userPost?.map((post) => (
                <article key={post._id} className="bg-[#FBF8F1] border border-[#DED4BE] rounded-2xl overflow-hidden mb-4">
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
                    <span className='flex items-center gap-3 text-2xl pt-2.5 cursor-pointer'>
                      <IoClose onClick={() => { deletePostMutate(post._id) }} />
                    </span>
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
                    {post?.likes?.includes(data._id) ?
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


                  {/* Create comment */}
                  <CreateComment
                    postId={post._id}
                    Token={Token}
                    userData={data}

                  />

                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">No posts yet.</p>
          )}
        </div>
      </div>
    </section>
  </>

} 