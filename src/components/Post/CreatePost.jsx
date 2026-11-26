import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaImage } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { createPost } from '../../api/posts'
import { QUERY_KEYS } from '../../config/constants'
import { UserData } from '../../context/UserData'
import useProfile from '../../hooks/useProfile'
import { getErrorMessage } from '../../utils/helpers'

export default function CreatePost() {
  const { Token } = useContext(UserData)
  const { data: userData } = useProfile()
  const queryClient = useQueryClient()
  const fileInput = useRef()
  const [img, setImg] = useState(null)

  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      body: '',
      image: null,
    },
  })

  function openFileInput() {
    fileInput.current.click()
  }

  function chooseFile(e) {
    const file = e.target.files[0]
    if (file) {
      if (img) URL.revokeObjectURL(img)
      setImg(URL.createObjectURL(file))
      setValue('image', e.target.files)
    }
  }

  function removeImage() {
    if (img) URL.revokeObjectURL(img)
    setImg(null)
    setValue('image', null)
    fileInput.current.value = ''
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ['CreatePosts'],
    mutationFn: (values) => createPost(values, Token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.posts] })
      toast.success('Post Uploaded!')
      reset()
      setImg(null)
      fileInput.current.value = ''
    },
    onError: (err) => {
      toast.error(getErrorMessage(err))
    },
  })

  return (
    <form onSubmit={handleSubmit(mutate)} className='bg-cream border border-sand rounded-2xl mb-8 shadow-sm transition focus-within:shadow-md focus-within:border-accent/40'>
      <div className='flex items-start gap-3 p-5 pb-3'>
        <img
          src={userData?.photo}
          alt={userData?.name}
          className='w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-beige'
        />
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold text-ink'>{userData?.name}</p>
          <textarea
            {...register('body')}
            rows={2}
            placeholder='What is on your mind?'
            className='mt-1 w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed text-ink placeholder:text-muted/70 focus:ring-0'
          />
        </div>
      </div>

      {img && (
        <div className='px-5 pb-3'>
          <div className='relative overflow-hidden rounded-xl border border-sand bg-beige'>
            <img
              src={img}
              alt="preview"
              className='w-full max-h-72 object-contain'
            />
            <button
              type="button"
              onClick={removeImage}
              className='absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white text-lg backdrop-blur-sm transition hover:bg-ink'
            >
              <IoClose />
            </button>
          </div>
        </div>
      )}

      <div className='mx-5 flex items-center justify-between border-t border-sand py-3'>
        <button
          type="button"
          onClick={openFileInput}
          className='flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-olive transition hover:bg-beige cursor-pointer'
        >
          <FaImage className='text-lg' />
          Photo
        </button>
        <input ref={fileInput} onChange={chooseFile} type="file" accept="image/*" hidden />

        <button
          type="submit"
          disabled={isPending}
          className='flex min-w-24 items-center justify-center rounded-full bg-accent px-6 py-2 text-sm font-semibold text-cream shadow-sm transition hover:opacity-90 active:scale-95 disabled:opacity-60 cursor-pointer'
        >
          {isPending ? (
            <span className='h-5 w-5 animate-spin rounded-full border-2 border-cream border-b-transparent'></span>
          ) : 'Post'}
        </button>
      </div>
    </form>
  )
}
