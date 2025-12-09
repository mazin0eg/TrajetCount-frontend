import React, { useState } from 'react'
import { instance } from '../config/api'


export default function Login() {

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
  try{
    const data = await instance.post('/auth/login', formData);
    console.log(data)
  }catch(e){
    console.log(e)
  }
    
}
  return (
    <div className='flex flex-col'>
    <input className='bg-sky-100 border-2' type="email" value={formData.email} name="email" onChange={changeHandler} />
    <input className='bg-sky-100 border-2' type="password" value={formData.password} name="password" onChange={changeHandler} />
    <button className='bg-blue-400 border-2' onClick={clickHandler}>LOGIN</button>
    <a href="/register" className=''> if u dont have an a count </a>
    </div>
  )
}
