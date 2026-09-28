import { createContext, useState, type Dispatch, type ReactNode } from 'react';

type TUser = {
  userId: number;
  username: string;
  email: string;
};
type TAuthContextType = {
  token: string | null;
  user: TUser | null;
  setToken: Dispatch<React.SetStateAction<string | null>>;
  login: (newToken: string, user: TUser) => void;
  logout: () => void;
};

const AuthContext = createContext<TAuthContextType | null>(null);

const getStoredUser = (): TUser | null => {
    const storedUser = localStorage.getItem('USER');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as TUser;
    } catch {
      localStorage.removeItem('USER');
      return null;
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('TOKEN'),
  );

  const [user, setUser] = useState<TUser | null>(getStoredUser)

  const login = (newToken: string, newUser: TUser) => {
    localStorage.setItem('TOKEN', newToken);
    localStorage.setItem('USER', JSON.stringify(user));

    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
   localStorage.removeItem('TOKEN');
   localStorage.removeItem('USER');

   setToken(null);
   setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
