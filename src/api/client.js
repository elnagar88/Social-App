import axios from 'axios'
import { API_BASE_URL } from '../config/constants'

const PATHS_WITHOUT_LOGOUT = ['/users/change-password']

let handleUnauthorized = null

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

export function authConfig(token) {
  return { headers: { token } }
}

export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error
    const sentToken = Boolean(config?.headers?.token)
    const isExcluded = PATHS_WITHOUT_LOGOUT.some((path) => config?.url?.startsWith(path))

    if (response?.status === 401 && sentToken && !isExcluded) {
      handleUnauthorized?.()
    }
    return Promise.reject(error)
  }
)
