export function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

export function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || fallback
}
