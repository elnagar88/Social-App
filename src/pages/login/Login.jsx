import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { signIn } from '../../api/users'
import AuthCard from '../../components/Form/AuthCard'
import FormField from '../../components/Form/FormField'
import SubmitButton from '../../components/Form/SubmitButton'
import { PASSWORD_REGEX } from '../../config/constants'
import { UserData } from '../../context/UserData'
import { getErrorMessage } from '../../utils/helpers'

const schema = z.object({
  email: z.email('Invalid Email'),
  password: z.string().regex(PASSWORD_REGEX, 'Invalid Password')
})

export default function Login() {
  const { login } = useContext(UserData)
  const navigate = useNavigate()

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(schema)
  })

  const { mutate: loginMutate, isPending } = useMutation({
    mutationKey: ['Login'],
    mutationFn: signIn,
    onSuccess: (data) => {
      if (data.data.message == 'signed in successfully') {
        login(data.data.data.token)
        navigate('/')
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Login failed'))
    }
  })

  return <>
    <title>Login | Social App</title>
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see what your friends are sharing."
      footerText="Don't have an account?"
      footerLinkText="Sign Up"
      footerLinkTo="/signup"
    >
      <form onSubmit={handleSubmit((values) => loginMutate(values))} className="space-y-4">
        <FormField id="email" label="Email" type="email" placeholder="you@example.com" registration={register('email')} error={formState.errors.email} />
        <FormField id="password" label="Password" type="password" placeholder="Your password" registration={register('password')} error={formState.errors.password} />
        <div className="pt-2">
          <SubmitButton isPending={isPending}>Log In</SubmitButton>
        </div>
      </form>
    </AuthCard>
  </>
}
