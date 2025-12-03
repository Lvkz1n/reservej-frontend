import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole, mockUsers, mockEmpresas } from '@/mock/data';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  empresaId?: string;
  empresaNome?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (role: UserRole) => void;
  logout: () => void;
  enterAsEmpresa: (empresaId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (role: UserRole) => {
    const mockUser = mockUsers.find(u => u.role === role);
    if (mockUser) {
      const empresa = mockUser.empresaId 
        ? mockEmpresas.find(e => e.id === mockUser.empresaId) 
        : null;
      
      setUser({
        ...mockUser,
        empresaNome: empresa?.nome,
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const enterAsEmpresa = (empresaId: string) => {
    const empresa = mockEmpresas.find(e => e.id === empresaId);
    if (empresa) {
      setUser({
        id: 'temp-admin',
        name: `Admin - ${empresa.nome}`,
        email: 'admin@temp.com',
        role: 'empresa-admin',
        empresaId: empresa.id,
        empresaNome: empresa.nome,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      enterAsEmpresa,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
