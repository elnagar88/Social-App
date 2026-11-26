import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FaCamera, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa'
import z from 'zod'
import { changePassword, uploadPhoto } from '../../api/users'
import FieldError from '../../components/Form/FieldError'
import { PASSWORD_REGEX, QUERY_KEYS } from '../../config/constants'
import { UserData } from '../../context/UserData'
import useProfile from '../../hooks/useProfile'
import { getErrorMessage } from '../../utils/helpers'

const passwordSchema = z.object({
  password: z.string().min(1, 'Write your current password'),
  newPassword: z.string().regex(PASSWORD_REGEX, 'Ex. Abc@1234'),
})

function showError(error) {
  toast.error(getErrorMessage(error, 'Something went wrong'))
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-b-transparent"></span>
}

function SettingsCard({ icon, title, description, children }) {
  return (
    <div className="rounded-2xl border border-sand bg-cream p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-beige text-accent">
          {icon}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-ink">{title}</h3>
          <p className="mt-0.5 text-sm leading-6 text-muted">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function PasswordInput({ label, placeholder, registration, error }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div>
      <label htmlFor={registration.name} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <div className="relative">
        <input
          id={registration.name}
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          {...registration}
          className="w-full rounded-xl border border-sand bg-white px-4 py-2.5 pe-11 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          className="absolute inset-y-0 end-0 flex w-11 items-center justify-center text-muted transition hover:text-accent cursor-pointer"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <FieldError error={error} />
    </div>
  )
}

export default function Settings() {
  const { Token } = useContext(UserData)
  const { data: user } = useProfile()
  const queryClient = useQueryClient()
  const [photoPreview, setPhotoPreview] = useState(null)
  const photoInputRef = useRef(null)

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

  const photoField = registerPhoto('photo')

  function choosePhoto(e) {
    photoField.onChange(e)
    const file = e.target.files[0]
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(file ? URL.createObjectURL(file) : null)
  }

  function clearPhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    resetPhotoForm()
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const { mutate: updatePasswordMutate, isPending: isPasswordPending } = useMutation({
    mutationKey: ['UpdatePassword'],
    mutationFn: (values) => changePassword(values, Token),
    onSuccess: () => {
      toast.success('Password Changed Successfully')
      resetPasswordForm()
    },
    onError: showError,
  })

  const { mutate, isPending } = useMutation({
    mutationKey: ['UploadPhoto'],
    mutationFn: (values) => uploadPhoto(values, Token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile] })
      clearPhoto()
    },
    onError: showError,
  })

  return <>
    <title>Settings | Social App</title>
    <section className="mx-auto mb-8 flex w-full max-w-2xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your profile photo and account security.</p>
      </div>

      <SettingsCard
        icon={<FaCamera />}
        title="Profile Photo"
        description="Click your photo to choose a new one. PNG, JPG, or WEBP up to 5MB."
      >
        <form
          onSubmit={handlePhotoSubmit((values) => mutate(values))}
          className="flex flex-col items-center gap-5 sm:flex-row"
        >
          <label
            htmlFor="photo"
            className="group relative h-28 w-28 shrink-0 cursor-pointer overflow-hidden rounded-full bg-beige ring-4 ring-beige ring-offset-2 ring-offset-cream transition hover:ring-accent/40"
          >
            <img
              src={photoPreview || user?.photo}
              alt="Profile preview"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink/50 text-cream opacity-0 transition duration-300 group-hover:opacity-100">
              <FaCamera />
              <span className="text-xs font-medium">Change</span>
            </span>
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            hidden
            {...photoField}
            onChange={choosePhoto}
            ref={(el) => {
              photoField.ref(el)
              photoInputRef.current = el
            }}
          />

          <div className="flex w-full flex-col items-center gap-3 sm:items-start">
            <div className="text-center sm:text-start">
              <p className="font-semibold text-ink">{user?.name}</p>
              <p className="text-sm text-muted">
                {photoPreview ? 'New photo selected — upload to save it.' : 'No new photo selected.'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!photoPreview || isPending}
                className="flex min-w-32 items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-cream shadow-sm transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 cursor-pointer"
              >
                {isPending ? <Spinner /> : 'Upload Photo'}
              </button>
              {photoPreview && !isPending && (
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="rounded-full border border-sand px-5 py-2 text-sm font-medium text-muted transition hover:bg-beige cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </form>
      </SettingsCard>

      <SettingsCard
        icon={<FaLock />}
        title="Update Password"
        description="Keep your account secure by changing your password regularly."
      >
        <form className="space-y-4" onSubmit={handlePasswordSubmit((values) => updatePasswordMutate(values))}>
          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            registration={registerPassword('password')}
            error={passwordFormState.errors.password}
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            registration={registerPassword('newPassword')}
            error={passwordFormState.errors.newPassword}
          />
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isPasswordPending}
              className="flex min-w-40 items-center justify-center rounded-full bg-olive px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {isPasswordPending ? <Spinner /> : 'Update Password'}
            </button>
          </div>
        </form>
      </SettingsCard>
    </section>
  </>
}
