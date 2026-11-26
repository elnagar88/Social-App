import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createComment } from '../../api/posts'
import { QUERY_KEYS } from '../../config/constants'
import { UserData } from '../../context/UserData'
import { getErrorMessage } from '../../utils/helpers'

export function CreateComment({ postId, userData, inputRef }) {
  const { Token } = useContext(UserData)
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      content: '',
    },
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['CreateComment', postId],
    mutationFn: (content) => createComment(postId, content, Token),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userPosts] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.singlePost, postId] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.postComments, postId] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Comment failed, try again'))
    },
  })

  const contentField = register('content')
  const content = useWatch({ control, name: 'content' })
  const isEmpty = !content?.trim()

  function submitComment(values) {
    const trimmed = values.content.trim()
    if (!trimmed || isPending) return
    mutate(trimmed)
  }

  return (
    <div className="mx-2 xs:mx-3 sm:mx-6 mt-3 mb-5 flex items-center gap-1.5 sm:gap-2.5">
      <img src={userData?.photo} className="w-7 h-7 xs:w-8 xs:h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" alt="You" />
      <form onSubmit={handleSubmit(submitComment)} className="flex-1 min-w-0 flex items-center bg-beige rounded-full pl-2.5 xs:pl-3 sm:pl-4 pr-1 xs:pr-1.5 py-1 sm:py-1.5">
        <input type="text" {...contentField} ref={(el) => { contentField.ref(el); if (inputRef) inputRef.current = el }} readOnly={isPending} placeholder="Create Comment" className="flex-1 min-w-0 border-0 bg-transparent outline-none text-xs sm:text-sm text-ink focus:ring-0 placeholder:text-muted truncate read-only:opacity-60" />
        <button type="submit" disabled={isEmpty || isPending} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-accent text-cream hover:opacity-90 active:scale-95 transition shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100">
          {isPending ? (
            <span className="h-3 w-3 xs:h-3.5 xs:w-3.5 animate-spin rounded-full border-2 border-cream border-b-transparent"></span>
          ) : (
            <svg width="11" height="11" className="xs:w-[13px] xs:h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  )
}
