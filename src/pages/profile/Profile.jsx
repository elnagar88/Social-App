import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { getUserPosts } from '../../api/posts';
import FeedPost from '../../components/Post/FeedPost';
import { Detail } from '../../components/UI/Detail';
import { IconAt } from '../../components/UI/IconAt';
import { IconCalendar } from '../../components/UI/IconCalendar';
import { IconMail } from '../../components/UI/IconMail';
import PageLoader from '../../components/UI/PageLoader';
import { Stat } from '../../components/UI/Stat';
import { QUERY_KEYS } from '../../config/constants';
import { UserData } from '../../context/UserData';
import useProfile from '../../hooks/useProfile';
import { formatDate } from '../../utils/helpers';

export default function Profile() {
  const { data, isPending, isError, error } = useProfile();
  const { Token } = useContext(UserData)

  const { data: userPost, isPending: isPostsPending } = useQuery({
    queryKey: [QUERY_KEYS.userPosts, data?.id],
    queryFn: () => getUserPosts(data?.id, Token),
    enabled: Boolean(data?.id),
    select: (userPost) => userPost?.data?.data?.posts
  })

  if (isPending) {
    return <PageLoader />
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-sand bg-cream p-6 text-center text-accent">
        {error?.message || 'Something went wrong.'}
      </section>
    );
  }

  return <>
    <title>Profile | Social App</title>
    <section className="mb-8">
      {/* Profile header */}
      <div className="overflow-hidden rounded-2xl border border-sand bg-cream shadow-sm">
        <div className="h-28 bg-linear-to-r from-accent/80 via-[#D9A066] to-olive/70 sm:h-36"></div>
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col items-center gap-4 text-center sm:-mt-14 sm:flex-row sm:items-end sm:gap-6 sm:text-left">
            <img
              src={data?.photo}
              alt={data?.name}
              className="h-24 w-24 flex-none rounded-full border-4 border-cream object-cover shadow-md sm:h-28 sm:w-28"
            />
            <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">{data?.name}</h1>
                <p className="mt-0.5 flex items-center justify-center gap-1 text-sm text-muted sm:justify-start">
                  <IconAt className="h-3.5 w-3.5" />
                  {data?.username}
                </p>
              </div>
              <Link
                to="/settings"
                className="rounded-full border border-sand px-4 py-1.5 text-sm font-medium text-ink transition hover:bg-beige"
              >
                Edit profile
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center justify-center gap-8 border-y border-sand py-4 sm:justify-start sm:gap-12">
            <Stat label="Posts" value={data?.posts?.length ?? userPost?.length ?? 0} />
            <Stat label="Followers" value={data?.followers?.length ?? 0} />
            <Stat label="Following" value={data?.following?.length ?? 0} />
          </div>

          {/* Contact / joined */}
          <div className="mt-5 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            <Detail icon={<IconMail className="h-4 w-4" />} label="Contact" value={data?.email} />
            <Detail
              icon={<IconCalendar className="h-4 w-4" />}
              label="Joined"
              value={data?.createdAt ? formatDate(data.createdAt) : '—'}
            />
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="mt-8 mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
        Posts
      </h2>

      {isPostsPending ? (
        <PageLoader />
      ) : userPost?.length ? (
        userPost.map((post) => (
          <FeedPost key={post._id} post={post} userData={data} isOwner />
        ))
      ) : (
        <p className="rounded-2xl border border-dashed border-sand bg-cream p-8 text-center text-sm text-muted">No posts yet.</p>
      )}
    </section>
  </>
}
