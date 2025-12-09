import React, { useEffect, useState } from 'react'
import { instance, userLogin } from '../config/api'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/authSlicer';


export default function Login() {

const { user } = useSelector((state) => state.auth);
const dispatch = useDispatch()


  const [formData, setFormData] = useState({
    "email" : '',
    "password": ''
})
const changeHandler = (e) => {
    setFormData((prev) => {
        prev[e.target.name] = e.target.value;
        return {...prev};
    })
}

const clickHandler = async () => {
  userLogin(formData).then((data) => {
      dispatch(login(data))
  }).catch(() => {
    alert('You cant login to this account')
  })
  
    
}

if(user) return <h1>{user.email} :  It's already connected</h1>

  return (
    <div className='flex flex-col'>
    <input className='bg-sky-100 border-2' type="email" value={formData.email} name="email" onChange={changeHandler} />
    <input className='bg-sky-100 border-2' type="password" value={formData.password} name="password" onChange={changeHandler} />
    <button className='bg-blue-400 border-2' onClick={clickHandler}>LOGIN</button>
    <a href="/register" className=''> if u dont have an a count </a>
    </div>
  )
}
