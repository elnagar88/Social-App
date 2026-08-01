import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaImage } from "react-icons/fa6"
import { UserData } from '../../../context/UserContext'


export default function CreatePosts() {
    let { Token } = useContext(UserData)
    const queryClient = useQueryClient()
    const fileInput = useRef();
    const [img, setImg] = useState(null)

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

    let { register, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            body: '',
            image: null,
        }
    })

    // createPost Function
    async function createPosts(values) {
        const form = new FormData()
        if (values?.body?.trim()) {
            form.append('body', values.body)
        }
        if (values?.image?.length > 0) {
            form.append('image', values.image[0])
        }
        return await axios.post('https://route-posts.routemisr.com/posts',
            form,
            {
                headers: {
                    token: Token
                }
            })
    }

    let { mutate, data, isPending, isError, error } = useMutation({
        mutationKey: ['CreatePosts'],
        mutationFn: createPosts,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['Posts'] })
            toast.success('Post Uploaded!')
            reset()
            setImg(null)
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message)
        }
    })

    return (
        <form onSubmit={handleSubmit(mutate)} className='bg-[#dcd3c0] p-5 mb-8 rounded-2xl shadow-2xl flex flex-col'>
            <h3 className='text-4xl text-center text-white font-medium mb-2'>Create Post</h3>
            <div className='flex flex-col gap-5 mb-3'>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        {...register('body')}
                        className='rounded-2xl border-0 w-11/12 placeholder-amber-900 focus:ring-0'
                        placeholder='What is on your mind?'
                    />
                    <FaImage onClick={openFileInput} className='text-xl cursor-pointer' />
                    <input ref={fileInput} onChange={chooseFile} type="file" accept="image/*" hidden />
                </div>

                {img && (
                    <img
                        src={img}
                        alt="preview"
                        className='w-20 h-20 rounded-lg object-cover'
                    />
                )}
            </div>

            <button
                type="submit"
                disabled={isPending}
                className='py-2 px-3 mt-4 rounded bg-white text-amber-900 font-medium cursor-pointer hover:bg-gray-100 duration-150'
            >
                {isPending ? (
                    <div className='flex items-center justify-center'>
                        <span className="loader"></span>
                    </div>
                ) : 'Post'}
            </button>
        </form>
    )
}