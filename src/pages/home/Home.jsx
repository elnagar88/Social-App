import { useEffect } from 'react';
import CreatePost from '../../components/Post/CreatePost';
import FeedPost from '../../components/Post/FeedPost';
import PageLoader from '../../components/UI/PageLoader';
import useInView from '../../hooks/useInView';
import useInfinitePosts from '../../hooks/useInfinitePosts';
import useProfile from '../../hooks/useProfile';

const OBSERVER_OPTIONS = { rootMargin: '400px' }

export default function Home() {
  const { data: userData } = useProfile()
  const { data, isError, error, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfinitePosts()
  const [loadMoreRef, isLoadMoreInView] = useInView(OBSERVER_OPTIONS)

  useEffect(() => {
    if (isLoadMoreInView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [isLoadMoreInView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isPending) {
    return <PageLoader />
  }
  if (isError) {
    return <p className="rounded-2xl border border-sand bg-cream p-6 text-center text-accent">{error.message}</p>;
  }

  return <>
    <title>Home | Social App</title>
    <CreatePost />
    {data?.map((post) => (
      <FeedPost
        key={post._id}
        post={post}
        userData={userData}
        isOwner={post?.user?._id == userData?._id}
        showTopComment
      />
    ))}

    <div ref={loadMoreRef} className="flex justify-center py-6 text-sm text-muted">
      {isFetchingNextPage ? (
        <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-accent border-b-transparent"></span>
      ) : hasNextPage ? '' : data?.length ? "You're all caught up ✨" : 'No posts yet.'}
    </div>
  </>
}
