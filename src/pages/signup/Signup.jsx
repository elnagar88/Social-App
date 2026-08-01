import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'


export default function Signup() {
  const navigate = useNavigate()

  // Zod Validation
  const schema = z.object({
    name: z.string().min(4,'At least 4 char').max(20,'20 Char is the max'),
    email: z.email('Invalid Email'),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'"Ex.Abc@1234"'),
    rePassword: z.string(),
    dateOfBirth: z.string().refine((date)=>{
      const userDate = new Date(date)
      const todayDate = new Date()
      todayDate.setHours(0,0,0,0)
      return todayDate > userDate
    },'Invalid Date'),
    gender: z.enum(['male','female'],{error:'Gender Is Required'}),
    
  }).refine((object)=>{
    return object.password === object.rePassword
  },{
    path:['rePassword'],
    message:'Password & Repassword not match '
  })

  // Hook Form
  const {register , handleSubmit , formState} = useForm({
    defaultValues:{
      name : "",
      email : "",
      password : "",
      rePassword : "",
      dateOfBirth : "",
      gender : "",
    },
    resolver: zodResolver(schema),
    // mode:'onChange'
  })

  // signUp Function
    async function signUp (values){
      return await axios.post(`https://route-posts.routemisr.com/users/signup`,values)
    }

  // Tanstack Query
  const {mutate:signUpMutate , data , isError , isPending , error} = useMutation({
    mutationKey:['signUp'],
    mutationFn : signUp,
    onSuccess : (data)=>{
      if(data?.data?.message === 'account created'){
        navigate('/login')
      }
    }
  })  

  return <>
    <title>Sign Up | Social App</title>
  <form onSubmit={handleSubmit((values)=>signUpMutate(values))} className='p-6 mt-3 mb-6 rounded-2xl shadow-2xl bg-white'>
  <h2 className='text-center text-4xl font-medium text-main'>Sign Up</h2>
      {/* Name */}
  <div className=''>
    <label
      htmlFor="name"
      className="text-[#3c7a6f] block mb-2.5 text-sm font-medium"
    >
      Name
    </label>
    <input
      type="text"
      id="name"
      name='name'
      {...register('name')}
      className="bg-neutral-secondary-medium border border-default-medium text-[#541A1A] text-sm rounded-base focus:ring-[#408175] focus:border-[#408175] block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
    />
    {formState.errors.name? <p className='text-main mt-2 font-medium'>{formState.errors.name.message}</p>:''}
  </div>
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
      id="email"
      name='email'
      {...register('email')}
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
      id="password"
      name='password'
      {...register('password')}
      className="bg-neutral-secondary-medium border border-default-medium text-[#541A1A] text-sm rounded-base focus:ring-[#408175] focus:border-[#408175] block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
      placeholder=""
    />
    {formState.errors.password?<p className='text-main mt-2 font-medium'>{formState.errors.password.message}</p>:''}
  </div>
    {/* RePassword */}
  <div className='mt-3'>
    <label
      htmlFor="rePassword"
      className="text-[#408175] block mb-2.5 text-sm font-medium "
    >
      RePassword
    </label>
    <input
      type="password"
      id="rePassword"
      name='rePassword'
      {...register('rePassword')}
      className="bg-neutral-secondary-medium border border-default-medium text-[#541A1A] text-sm rounded-base focus:ring-[#408175] focus:border-[#408175] block w-full px-2.5 py-2 shadow-xs placeholder:text-body"
      placeholder=""
    />
    {formState.errors.rePassword?<p className='text-main mt-2 font-medium'>{formState.errors.rePassword.message}</p>:''}
  </div>
  {/* Date */}
    <label
      htmlFor="datepicker-autohide"
      className="text-[#408175] block mb-2.5 text-sm font-medium mt-3"
    >
      Date Of Birth
    </label>
<input
  type="date"
  name='dateOfBirth'
  {...register('dateOfBirth')}
  className="w-full rounded-base border border-default-medium px-3 py-2.5 focus:ring-[#408175] focus:border-[#408175]"
/>
{formState.errors.dateOfBirth?<p className='text-main mt-2 font-medium'>{formState.errors.dateOfBirth.message}</p>:''}
  {/* Gender */}
      <p
        className="text-[#408175] block mb-2.5 text-sm font-medium mt-3 cursor-default"
      >
        Gender
      </p>
  <div className='mt-3'>
    {/* Male */}
    <label htmlFor="male" className='pe-5'>
      Male
    </label>
    <input type="radio" value='male' id='male' name='gender' {...register('gender')} className=' border-blue-900'/>
    {/* Female */}
    <label htmlFor="female" className='px-5'>
      Female
    </label>
    <input type="radio" value='female' id='female'name='gender' {...register('gender')} className=' border-blue-900'/>
    {formState.errors.gender?<p className='text-main mt-2 font-medium'> {formState.errors.gender.message}</p>:''}
  </div>
  {/* Button */}
  <div className='flex justify-center'>
    <button disabled={isPending} className='py-2 px-4 mt-3 rounded-xl text-white bg-main hover:bg-[#408175] duration-200 cursor-pointer'>{isPending? <div role="status">
      <svg xmlns="http://www.w3.org/2000/svg"
         className="size-9 animate-[spin_0.8s_linear_infinite] fill-slate-900 dark:fill-neutral-50" viewBox="0 0 24 24"
         aria-hidden="true">
         <path
            d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
            data-original="#000000" />
      </svg>
      <span className="sr-only">Loading…</span>
   </div> : <span className='font-medium'>Submit</span>}</button>
  </div>
  {isError? <p className='text-center mt-3 text-red-600'>{error?.response?.data?.message}</p>:''}
  
  {/* Have Account */}
  <p className='text-center mt-3'>
    Have an account ? <Link to={'/login'} className='text-main hover:text-[#408175] duration-200'>Login</Link>
  </p>
  </form>

</>

}
