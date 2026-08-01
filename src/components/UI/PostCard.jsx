export function PostCard({ post }) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-100 bg-white">
      {post?.image && (
        <div className="aspect-square w-full overflow-hidden bg-slate-100">
          <img
            src={post.image}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="space-y-2 p-3">
        {post?.content && (
          <p className="line-clamp-3 text-sm text-slate-700">{post.content}</p>
        )}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <IconHeart className="h-3.5 w-3.5" />
              {post?.likes?.length ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <IconComment className="h-3.5 w-3.5" />
              {post?.comments?.length ?? 0}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}