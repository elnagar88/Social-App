import { apiClient, authConfig } from './client'

export function signIn(values) {
  return apiClient.post('/users/signin', values)
}

export function signUp(values) {
  return apiClient.post('/users/signup', values)
}

export function getProfile(token) {
  return apiClient.get('/users/profile-data', authConfig(token))
}

export function changePassword(values, token) {
  return apiClient.patch('/users/change-password', values, authConfig(token))
}

export function uploadPhoto(values, token) {
  const form = new FormData()
  if (values?.photo?.length > 0) {
    form.append('photo', values.photo[0])
  }
  return apiClient.put('/users/upload-photo', form, authConfig(token))
}
