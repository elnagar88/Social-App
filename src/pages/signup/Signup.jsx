import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { signUp } from '../../api/users'
import AuthCard from '../../components/Form/AuthCard'
import FieldError from '../../components/Form/FieldError'
import FormField from '../../components/Form/FormField'
import SubmitButton from '../../components/Form/SubmitButton'
import { PASSWORD_REGEX } from '../../config/constants'

const GENDERS = ['male', 'female']

const schema = z.object({
  name: z.string().min(4, 'At least 4 char').max(20, '20 Char is the max'),
  email: z.email('Invalid Email'),
  password: z.string().regex(PASSWORD_REGEX, '"Ex.Abc@1234"'),
  rePassword: z.string(),
  dateOfBirth: z.string().refine((date) => {
    const userDate = new Date(date)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    return todayDate > userDate
  }, 'Invalid Date'),
  gender: z.enum(GENDERS, { error: 'Gender Is Required' }),
}).refine((object) => {
  return object.password === object.rePassword
}, {
  path: ['rePassword'],
  message: 'Password & Repassword not match '
})

export default function Signup() {
  const navigate = useNavigate()

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
  })

  const { mutate: signUpMutate, isError, isPending, error } = useMutation({
    mutationKey: ['signUp'],
    mutationFn: signUp,
    onSuccess: (data) => {
      if (data?.data?.message === 'account created') {
        navigate('/login')
      }
    }
  })

  return <>
    <title>Sign Up | Social App</title>
    <AuthCard
      title="Create your account"
      subtitle="Join Social App and start sharing."
      footerText="Have an account?"
      footerLinkText="Log In"
      footerLinkTo="/login"
    >
      <form onSubmit={handleSubmit((values) => signUpMutate(values))} className="space-y-4">
        <FormField id="name" label="Name" type="text" placeholder="Your name" registration={register('name')} error={formState.errors.name} />
        <FormField id="email" label="Email" type="email" placeholder="you@example.com" registration={register('email')} error={formState.errors.email} />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="password" label="Password" type="password" placeholder="Ex. Abc@1234" registration={register('password')} error={formState.errors.password} />
          <FormField id="rePassword" label="Confirm Password" type="password" placeholder="Repeat password" registration={register('rePassword')} error={formState.errors.rePassword} />
        </div>
        <FormField id="dateOfBirth" label="Date Of Birth" type="date" registration={register('dateOfBirth')} error={formState.errors.dateOfBirth} />

        <div>
          <p className="mb-1.5 text-sm font-medium text-ink">Gender</p>
          <div className="grid grid-cols-2 gap-3">
            {GENDERS.map((gender) => (
              <label key={gender} className="cursor-pointer">
                <input type="radio" value={gender} {...register('gender')} className="peer sr-only" />
                <span className="block rounded-xl border border-sand bg-white py-2.5 text-center text-sm font-medium capitalize text-muted transition peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 hover:bg-beige">
                  {gender}
                </span>
              </label>
            ))}
          </div>
          <FieldError error={formState.errors.gender} />
        </div>

        {isError ? <p className='rounded-xl bg-accent/10 px-4 py-2.5 text-center text-sm font-medium text-accent'>{error?.response?.data?.message}</p> : ''}

        <div className="pt-2">
          <SubmitButton isPending={isPending}>Create Account</SubmitButton>
        </div>
      </form>
    </AuthCard>
  </>
}
