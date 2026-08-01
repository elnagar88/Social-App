import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import z from 'zod'
import { UserData } from '../../context/UserContext'
import useProfile from './../../hooks/useProfile'

export default function Settings() {
  const { Token } = useContext(UserData)
  const { data: user } = useProfile()
  const queryClient = useQueryClient()

  const passwordSchema = z.object({
    password: z.string().min(1, 'Write your current password'),
    newPassword: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        'Ex. Abc@1234'
      ),
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: passwordFormState,
    reset: resetPasswordForm,
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', newPassword: '' },
  })

  const {
    register: registerPhoto,
    handleSubmit: handlePhotoSubmit,
    reset: resetPhotoForm,
  } = useForm({
    defaultValues: { photo: null },
  })

  async function updatePassword(values) {
    return await axios.patch(
      `https://route-posts.routemisr.com/users/change-password`,
      values,
      { headers: { token: Token } }
    )
  }

  const { mutate: updatePasswordMutate } = useMutation({
    mutationKey: ['UpdatePassword'],
    mutationFn: updatePassword,
    onSuccess: () => {
      toast.success('Password Changed Successfully')
      resetPasswordForm()
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    },
  })

  async function uploadPhoto(values) {
    const form = new FormData()
    if (values?.photo?.length > 0) {
      form.append('photo', values.photo[0])
    }
    return await axios.put(
      'https://route-posts.routemisr.com/users/upload-photo',
      form,
      { headers: { token: Token } }
    )
  }

  const { mutate, isPending } = useMutation({
    mutationKey: ['UploadPhoto'],
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Profile'] })
      resetPhotoForm()
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Something went wrong')
    },
  })

  return <>
    <title>Settings | Social App</title>
    <section className="mx-auto mb-5 flex w-full max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <div className="group relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-[0_0_0_12px_rgba(255,255,255,0.9)] sm:h-40 sm:w-40">
            <img
              src={user?.photo}
              alt="Profile preview"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100">
              <span className="text-sm font-medium text-white">Change</span>
            </div>
          </div>
          <p className="text-sm text-slate-500">PNG, JPG, or WEBP up to 5MB</p>
        </div>

        <div className="w-full max-w-md">
          <h3 className="text-2xl font-semibold text-main">Change Profile Photo</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Choose a fresh photo to update your profile image and make your account feel more personal.
          </p>

          <form
            onSubmit={handlePhotoSubmit(mutate)}
            className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              id="file"
              {...registerPhoto('photo')}
              type="file"
              className="w-full cursor-pointer rounded-2xl bg-white px-4 py-3 text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-main file:px-3 file:py-1.5 file:text-white hover:opacity-90 sm:w-auto"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-main py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-main/90 disabled:opacity-60"
            >
              {isPending ? <span className="loader" /> : 'Upload Image'}
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <div className="mb-5">
          <h3 className="text-xl font-semibold text-main">Update Password</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Keep your account secure by changing your password regularly.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handlePasswordSubmit(updatePasswordMutate)}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              {...registerPassword('password')}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-main focus:ring-2 focus:ring-main/20"
            />
            {passwordFormState.errors.password && (
              <p className="text-main mt-2 font-medium">
                {passwordFormState.errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              {...registerPassword('newPassword')}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-main focus:ring-2 focus:ring-main/20"
            />
            {passwordFormState.errors.newPassword && (
              <p className="text-main mt-2 font-medium">
                {passwordFormState.errors.newPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="rounded-full cursor-pointer bg-main px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-main/90"
          >
            Update Password
          </button>
        </form>
      </div>
    </section>
  </>
  
}