import { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { MdModeEditOutline } from 'react-icons/md'
import useDeletePost from '../../hooks/useDeletePost'
import ConfirmDialog from '../UI/ConfirmDialog'

export default function PostOwnerActions({ postId, onEdit, onDeleted }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { mutate: deletePost, isPending } = useDeletePost()

  function confirmDelete() {
    deletePost(postId, {
      onSuccess: () => {
        setIsConfirmOpen(false)
        onDeleted?.()
      },
    })
  }

  return (
    <>
      <span className='flex items-center gap-1 text-muted'>
        <button type="button" onClick={onEdit} aria-label="Edit post" className='flex h-9 w-9 items-center justify-center rounded-full text-lg transition hover:bg-beige hover:text-olive cursor-pointer'>
          <MdModeEditOutline />
        </button>
        <button type="button" onClick={() => setIsConfirmOpen(true)} aria-label="Delete post" className='flex h-9 w-9 items-center justify-center rounded-full text-2xl transition hover:bg-beige hover:text-accent cursor-pointer'>
          <IoClose />
        </button>
      </span>
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete this post?"
        message="This post will be removed permanently and can't be restored."
        isPending={isPending}
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  )
}
