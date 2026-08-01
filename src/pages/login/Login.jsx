import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { UserData } from '../../context/UserContext'


export default function Login() {
  const {Token,setToken} = useContext(UserData)
  const navigate = useNavigate()
  // Zod Validation
  const schema = z.object({
    email : z.email('Invalid Email'),
    password:z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'Invalid Password')
  })
  
  // Hook Form
  const {register,handleSubmit,formState} = useForm({
    defaultValues:{
      email:'',
      password:''
    },
    resolver:zodResolver(schema)
  })
   
  // Login Function
  async function login (values){
    return await axios.post(`https://route-posts.routemisr.com/users/signin`,values)
  }
  
  // Use Mutation
  const {mutate:loginMutate , data, isError, isPending} = useMutation({
    mutationKey:['Login'],
    mutationFn:login,
    onSuccess:(data)=>{
     if(data.data.message=='signed in successfully'){
      localStorage.setItem('userToken',data.data.data.token)
      setToken(data.data.data.token)
       navigate('/')
     }
    },
    onError: (error) => {
    toast.error(error?.response?.data?.message || 'Login failed')
}
  })



  return <>
    <title>Login | Social App</title>

      <form onSubmit={handleSubmit((values)=>loginMutate(values))} className='p-6 mt-3 mb-6 rounded-2xl shadow-2xl bg-white'>
  <h2 className='text-center text-4xl font-medium text-main'>Login</h2>

    {/* Email */}
  <div className='mt-3'>
    <label
      htmlFor="email"
      className="text-[#408175] block mb-2.5 text-sm font-medium "
    >
      Email
    </label>
    <input
      type="email"
      {...register('email')}
      id="email"
      className="bg-neutral-secondary-medium border border-default-medium text-[#541A1A] text-sm rounded-base focus:ring-[#408175] focus:border-[#408175] block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
    />
      {formState.errors.email? <p className='text-main mt-2 font-medium'>{formState.errors.email.message}</p> : ''}
  </div> 
    {/* Password */}
  <div className='mt-3'>
    <label
      htmlFor="password"
      className="text-[#408175] block mb-2.5 text-sm font-medium "
    >
      Password
    </label>
    <input
      type="password"
      {...register('password')}
      id="password"
      className="bg-neutral-secondary-medium border border-default-medium text-[#541A1A] text-sm rounded-base focus:ring-[#408175] focus:border-[#408175] block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
      placeholder=""
      required=""
    />
    {formState.errors.password? <p className='text-main mt-2 font-medium'>{formState.errors.password.message}</p> : ''}
  </div>

{/* Button */}
<div className='flex justify-center'>
  <button className='py-2 px-4 mt-5 rounded-xl text-white bg-main hover:bg-[#408175] duration-200 cursor-pointer'>Submit</button>
</div>
{/* Have Account */}
<p className='text-center mt-3'>
  Dont't have an account ? <Link to={'/signup'} className='text-main hover:text-[#408175] duration-200'>Sign Up</Link>
</p>
  </form>
  </>
}
