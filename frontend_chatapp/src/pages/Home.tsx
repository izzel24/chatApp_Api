import { useEffect, useState } from 'react';
import { axiosInstance } from '../libs/axios';
import { useAuth } from '../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { socket } from '../libs/socket';

type TUsers = {
  id: number;
  username: string;
  email: string;
};

export default function Home() {
  const [users, setUsers] = useState<TUsers[]>();
  const {user} = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    const getUsers = async () => {
      const response = await axiosInstance.get('users');
      if (response.status === 200) {
        setUsers(response.data);
      }
    };

    getUsers()

    socket.emit('join', { userId: user?.userId});
  }, []);
  return (
  <div>
    <div className='flex flex-col'>

    {users?.map((item) => (
        item.id !== user?.userId &&
        <button className='' onClick={() => navigate(`/chat?userId=${item.id}`)}>{item.username}</button>
    ))}
    </div>
  </div>
);
}
