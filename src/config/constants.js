export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://route-posts.routemisr.com'

export const TOKEN_STORAGE_KEY = 'userToken'

export const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

export const QUERY_KEYS = {
  posts: 'Posts',
  userPosts: 'UserPosts',
  singlePost: 'SinglePost',
  postComments: 'PostComments',
  profile: 'Profile',
}
