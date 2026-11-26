import { useRef, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import useLikePost from '../../hooks/useLikePost'
import { formatDate } from '../../utils/helpers'
import { CreateComment } from './CreateComment'
import EditPostForm from './EditPostForm'
import LikeButton from './LikeButton'
import PostOwnerActions from './PostOwnerActions'

function CommentButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="group flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium text-ink hover:bg-beige transition active:scale-95 cursor-pointer">
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        className="stroke-olive transition-all duration-150 group-hover:fill-olive"
      >
        <path d="M21 11.5a8.5 8.5 0 0 1-11.8 7.8L4 21l1.7-5.2A8.5 8.5 0 1 1 21 11.5z" />
      </svg>
      Comment
    </button>
  )
}

function TopComment({ comment, onReply }) {
  return (
    <div className="mx-2 xs:mx-3 sm:mx-6 mb-4 flex items-start gap-1.5 sm:gap-2.5">
      <img
        src={comment?.commentCreator?.photo}
        className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
        alt={comment?.commentCreator?.name}
      />

      <div className="flex-1 min-w-0">
        <div className="bg-beige rounded-2xl px-3 xs:px-4 py-2 xs:py-2.5">
          <p className="text-xs xs:text-sm font-semibold text-ink">
            {comment?.commentCreator?.name}
          </p>
          <p className="text-xs sm:text-sm text-ink wrap-break-word">
            {comment?.content}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1 px-2 text-2xs xs:text-xs text-muted">
          <span>{formatDate(comment?.createdAt)}</span>
          <button type="button" onClick={onReply} className="font-medium hover:text-accent transition cursor-pointer">
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FeedPost({ post, userData, isOwner, showTopComment }) {
  const commentInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const { mutate: likePost } = useLikePost()

  function focusCommentInput() {
    commentInputRef.current?.focus()
  }

  return (
    <article className="bg-cream border border-sand rounded-2xl overflow-hidden mb-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={post?.user?.photo}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-beige"
            alt={post?.user?.username}
          />
          <div>
            <p className="font-semibold leading-tight text-ink">{post?.user?.name}</p>
            <p className="text-xs text-muted">{formatDate(post?.createdAt)}</p>
          </div>
        </div>
        {isOwner && !isEditing ? (
          <PostOwnerActions postId={post._id} onEdit={() => setIsEditing(true)} />
        ) : ''}
      </div>

      {isEditing ? (
        <EditPostForm
          postId={post._id}
          initialBody={post.body}
          onDone={() => setIsEditing(false)}
          className="px-6 pb-3"
        />
      ) : (
        <Link to={`/singlepost/${post._id}`}>
          {/* Text */}
          <p className="px-6 pb-2 text-[15px] leading-relaxed text-ink">
            {post.body}
          </p>

          {/* Image */}
          {post?.image ?
            <img
              src={post?.image}
              className="w-full h-72 object-contain bg-beige/50"
              alt={post?.body}
            /> : ""}

          {/* Reactions summary */}
          <div className="flex items-center justify-between px-6 pt-4 text-xs text-muted">
            <div className='flex items-center gap-1'>
              <FaHeart className="text-accent" />
              <span>{post.likesCount}</span>
            </div>
            <span>{post.commentsCount} comments</span>
          </div>
        </Link>
      )}

      {/* Action buttons */}
      <div className="mx-6 mt-3 pt-3 pb-2 border-t border-sand grid grid-cols-2">
        <LikeButton isLiked={post?.likes?.includes(userData?._id)} onLike={() => likePost(post._id)} />
        <CommentButton onClick={focusCommentInput} />
      </div>

      {showTopComment && post?.topComment ? <TopComment comment={post.topComment} onReply={focusCommentInput} /> : ''}

      {/* Create comment */}
      <CreateComment postId={post._id} userData={userData} inputRef={commentInputRef} />
    </article>
  )
}
