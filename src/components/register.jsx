import React , { useState} from 'react'
import { instance } from '../config/api'

export default function Register() {
    const [formData, setFormData] = useState({
    "username": "",
    "email": "",
    "password": "",
    "confirmPassword": ""
})
    
    const changeHandler = (e) => {
        setFormData((prev) => {
            prev[e.target.name] = e.target.value;
            return {...prev};
        })
    }
    
    const clickHandler = async () => {
      try{
        const data = await instance.post('/auth/register', formData);
        console.log(data)
      }catch(e){
        console.log(e)
      }
        
    }
    return (
        <div className='flex flex-col'>
            <input className='bg-sky-100 border-2' type="text" value={formData.username} name="username" onChange={changeHandler} />
            <input className='bg-sky-100 border-2' type="email" value={formData.email} name="email" onChange={changeHandler} />
            <input className='bg-sky-100 border-2' type="password" value={formData.password} name="password" onChange={changeHandler} />
            <input className='bg-sky-100 border-2' type="password" value={formData.confirmPassword} name="confirmPassword" onChange={changeHandler} />
            <button className='bg-blue-400 border-2' onClick={clickHandler}>REGISTER</button>
            <a href="/login" className=''> if u have an a count </a>
        </div>
    )
}
