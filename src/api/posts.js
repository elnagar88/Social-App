import { apiClient, authConfig } from './client'

export function getPosts(token, page = 1, limit = 10) {
  return apiClient.get(`/posts?limit=${limit}&page=${page}&sort=-createdAt`, authConfig(token))
}

export function getPost(postId, token) {
  return apiClient.get(`/posts/${postId}`, authConfig(token))
}

export function getPostComments(postId, token) {
  return apiClient.get(`/posts/${postId}/comments`, authConfig(token))
}

export function getUserPosts(userId, token) {
  return apiClient.get(`/users/${userId}/posts?limit=50`, authConfig(token))
}

export function createPost(values, token) {
  const form = new FormData()
  if (values?.body?.trim()) {
    form.append('body', values.body)
  }
  if (values?.image?.length > 0) {
    form.append('image', values.image[0])
  }
  return apiClient.post('/posts', form, authConfig(token))
}

export function deletePost(postId, token) {
  return apiClient.delete(`/posts/${postId}`, authConfig(token))
}

export function likePost(postId, token) {
  return apiClient.put(`/posts/${postId}/like`, {}, authConfig(token))
}

export function createComment(postId, content, token) {
  return apiClient.post(`/posts/${postId}/comments`, { content }, authConfig(token))
}

export function updatePost(postId, body, token) {
  const form = new FormData()
  form.append('body', body)
  return apiClient.put(`/posts/${postId}`, form, authConfig(token))
}
