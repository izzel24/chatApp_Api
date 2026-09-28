import React, { useState } from 'react';
import { axiosInstance } from '../libs/axios';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { io, type Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3002');

export default function Login() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate()

  
    

  const {login} = useAuth()

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   try {   
       const response = await axiosInstance.post('auth/login', {
        username,
        password
       })
       if(response.status === 200){
        login(response.data.data.access_token, {userId: response.data.data.userId, username: response.data.data.username ,email: response.data.data.email })
       }
       navigate('/')
       console.log(response)
   } catch (error) {
    console.log(error)
   }

 };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="shadow-[0_0_4px_0_rgba(0,0,0,0.25)] h-100 w-100 p-2 rounded-xl">
        <form onSubmit={handleSubmit} className='w-full h-full flex flex-col'>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded focus:outline-0"
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded focus:outline-0"
              placeholder="Password"
            />
          </div>
          <button type='submit' className='p-2 bg-black text-white w-full mt-auto rounded hover:cursor-pointer'>Login</button>
        </form>
      </div>
    </div>
  );
}
