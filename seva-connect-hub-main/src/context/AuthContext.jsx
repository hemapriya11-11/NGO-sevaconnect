import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ngoData, setNgoData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchNgoData = async (token) => {
    try {
      const response = await fetch('/api/ngos/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNgoData(data);
      } else {
        // If not found or error, set to empty object or default
        setNgoData({ registrationCompleted: false });
      }
    } catch (error) {
      console.error("Error fetching NGO data:", error);
      setNgoData({ registrationCompleted: false });
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        if (userData.role === 'ngo' && storedToken) {
          await fetchNgoData(storedToken);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
    if (userData.role === 'ngo') {
      fetchNgoData(token);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setNgoData(null);
  };

  const refreshNgoData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await fetchNgoData(token);
    }
  };

  const refreshUserData = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/api/users/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const updatedUser = await response.json();
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } catch (error) {
        console.error("Error refreshing user data:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, ngoData, login, logout, loading, refreshNgoData, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
