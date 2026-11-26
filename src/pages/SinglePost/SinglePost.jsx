import { useQuery } from '@tanstack/react-query'
import { useContext, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaComment, FaShare } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { getPost, getPostComments } from '../../api/posts'
import { CreateComment } from '../../components/Post/CreateComment'
import EditPostForm from '../../components/Post/EditPostForm'
import LikeButton from '../../components/Post/LikeButton'
import PostOwnerActions from '../../components/Post/PostOwnerActions'
import PageLoader from '../../components/UI/PageLoader'
import { QUERY_KEYS } from '../../config/constants'
import { UserData } from '../../context/UserData'
import useLikePost from '../../hooks/useLikePost'
import useProfile from '../../hooks/useProfile'
import { formatDate } from '../../utils/helpers'

const actionButtonClass = "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-beige active:scale-95 cursor-pointer"

async function sharePost(url) {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Social App', url })
    } catch {
      return
    }
    return
  }
  await navigator.clipboard.writeText(url)
  toast.success('Link copied!')
}

export default function SinglePost() {
  const { id } = useParams()
  const { Token } = useContext(UserData)
  const navigate = useNavigate()
  const commentInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const { data: userData } = useProfile()
  const { mutate: likePost } = useLikePost()

  const { data: Comments } = useQuery({
    queryKey: [QUERY_KEYS.postComments, id],
    queryFn: () => getPostComments(id, Token),
    select: (data) => data.data.data.comments
  })

  const { data, isPending, isError, error } = useQuery({
    queryKey: [QUERY_KEYS.singlePost, id],
    queryFn: () => getPost(id, Token),
    select: (data) => data?.data?.data?.post
  })

  if (isPending) return <PageLoader />
  if (isError) {
    return <p className="rounded-2xl border border-sand bg-cream p-6 text-center text-accent">{error?.message}</p>
  }

  const isLiked = data?.likes?.includes(userData?._id)
  const isOwner = data?.user?._id === userData?._id

  return <>
    <title>Post | Social App</title>
    <div className="mb-8 flex flex-col gap-4">
      <button onClick={() => navigate(-1)} className="flex w-fit items-center gap-2 rounded-full border border-sand bg-cream px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-beige cursor-pointer">
        <FaArrowLeft /> Back
      </button>

      <article className="overflow-hidden rounded-2xl border border-sand bg-cream shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={data?.user?.photo}
                alt={data?.user?.username}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-beige"
              />
              <div>
                <h2 className="font-semibold text-ink">{data?.user?.name}</h2>
                <p className="text-xs text-muted">{formatDate(data?.createdAt)}</p>
              </div>
            </div>
            {isOwner && !isEditing ? (
              <PostOwnerActions postId={data._id} onEdit={() => setIsEditing(true)} onDeleted={() => navigate('/')} />
            ) : ''}
          </div>

          {isEditing ? (
            <EditPostForm postId={data._id} initialBody={data?.body} onDone={() => setIsEditing(false)} className="mt-4" />
          ) : (
            <p className="mt-4 text-lg leading-relaxed text-ink sm:text-xl">
              {data?.body}
            </p>
          )}
        </div>

        {data?.image ?
          <img
            src={data?.image}
            alt="post"
            className="w-full max-h-[28rem] object-contain bg-beige/50"
          /> : ""}

        <div className="mx-5 mt-2 grid grid-cols-3 border-t border-sand py-2 sm:mx-6">
          <LikeButton isLiked={isLiked} onLike={() => likePost(data._id)} />
          <button type="button" onClick={() => commentInputRef.current?.focus()} className={actionButtonClass}>
            <FaComment className="text-olive" /> {data?.commentsCount ?? 0}
            <span className="hidden sm:inline">Comments</span>
          </button>
          <button type="button" onClick={() => sharePost(window.location.href)} className={actionButtonClass}>
            <FaShare className="text-olive" /> Share
          </button>
        </div>

        <CreateComment postId={id} userData={userData} inputRef={commentInputRef} />
      </article>

      {Comments?.length ? (
        <section className="rounded-2xl border border-sand bg-cream p-4 shadow-sm sm:p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
            Comments ({Comments.length})
          </h3>
          <div className="space-y-3">
            {Comments.map((comment) => (
              <div key={comment?._id} className="flex items-start gap-2.5">
                <img
                  src={comment?.commentCreator?.photo}
                  alt={comment?.commentCreator?.name}
                  className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
                />
                <div className="min-w-0 flex-1">
                  <div className="rounded-2xl bg-beige px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-ink">
                      {comment?.commentCreator?.name}
                    </p>
                    <p className="wrap-break-word text-sm text-ink">
                      {comment?.content}
                    </p>
                  </div>
                  <p className="mt-1 px-2 text-xs text-muted">
                    {formatDate(comment?.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : ''}
    </div>
  </>
}
