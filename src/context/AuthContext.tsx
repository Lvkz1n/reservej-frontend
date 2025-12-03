import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  apiClient,
  AuthTokens,
  setAuthHandlers,
  setAuthTokens,
  setCompanyContext,
} from "@/services/api-client";

type GlobalRole = "super_admin";
type CompanyRole = "admin" | "atendente" | "profissional" | "leitura";

export type CompanyMembership = {
  id: string;
  name: string;
  role: CompanyRole;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role_global?: GlobalRole | null;
  companies?: CompanyMembership[];
};

type StoredSession = {
  user: AuthUser;
  tokens: AuthTokens;
  activeCompanyId?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  companies: CompanyMembership[];
  roleGlobal: GlobalRole | null;
  companyId: string | null;
  companyRole: CompanyRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  setCompany: (companyId: string | null) => void;
};

const AUTH_STORAGE_KEY = "reserveja.auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredSession = (): StoredSession | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch (error) {
    console.warn("Não foi possível ler a sessão armazenada", error);
    return null;
  }
};

const persistSession = (session: StoredSession) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const normalizeCompanyRole = (role: string | null | undefined): CompanyRole => {
  const value = role?.toString().toLowerCase() ?? "";
  if (value.includes("admin")) return "admin";
  if (value.includes("atend") || value.includes("attendant")) return "atendente";
  if (value.includes("prof")) return "profissional";
  if (value.includes("read") || value.includes("leitura") || value.includes("viewer")) return "leitura";
  return "leitura";
};

const normalizeUser = (payload: any): AuthUser => ({
  id: payload?.id,
  name: payload?.name ?? payload?.fullName ?? payload?.email ?? "Usuário",
  email: payload?.email ?? "",
  role_global: payload?.role_global ?? payload?.roleGlobal ?? null,
  companies: (payload?.companies ?? []).map((company: any) => ({
    id: company?.id ?? company?._id ?? company?.companyId ?? company?.company_id ?? "",
    name: company?.name ?? company?.company_name ?? "Empresa",
    role: normalizeCompanyRole(company?.role ?? company?.role_company ?? company?.roleCompany),
  })),
});

const normalizeTokens = (payload: any): AuthTokens => ({
  accessToken: payload?.access_token ?? payload?.accessToken,
  refreshToken: payload?.refresh_token ?? payload?.refreshToken,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokensState] = useState<AuthTokens | null>(null);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const companyIdRef = useRef<string | null>(null);

  const clearSession = (skipTokenReset = false) => {
    if (!skipTokenReset) {
      setAuthTokens(null);
    }
    setCompanyContext(null);
    setUser(null);
    setTokensState(null);
    setActiveCompanyId(null);
    setIsLoading(false);
    clearStoredSession();
  };

  useEffect(() => {
    companyIdRef.current = activeCompanyId;
  }, [activeCompanyId]);

  useEffect(() => {
    const stored = readStoredSession();

    if (stored?.tokens && stored.user) {
      const fallbackCompany =
        stored.activeCompanyId ?? stored.user.companies?.[0]?.id ?? null;
      setUser(stored.user);
      setTokensState(stored.tokens);
      setActiveCompanyId(fallbackCompany);
      setAuthTokens(stored.tokens);
      setCompanyContext(fallbackCompany);
    }

    setIsLoading(false);

    setAuthHandlers({
      onUnauthorized: () => clearSession(true),
      onTokenChange: (nextTokens) => {
        if (!nextTokens) {
          clearSession(true);
          return;
        }

        setTokensState(nextTokens);
        setUser((currentUser) => {
          if (currentUser) {
            persistSession({
              user: currentUser,
              tokens: nextTokens,
              activeCompanyId: companyIdRef.current,
            });
          }
          return currentUser;
        });
      },
    });
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
        user: AuthUser;
      }>("/auth/login", credentials, { auth: false });

      const nextTokens = normalizeTokens(response);
      if (!nextTokens.accessToken || !nextTokens.refreshToken) {
        throw new Error("Resposta de login não contém tokens");
      }

      const nextUser = normalizeUser(response.user);
      const companyId = nextUser.companies?.[0]?.id ?? null;

      setAuthTokens(nextTokens);
      setCompanyContext(companyId);
      setUser(nextUser);
      setTokensState(nextTokens);
      setActiveCompanyId(companyId);

      persistSession({
        user: nextUser,
        tokens: nextTokens,
        activeCompanyId: companyId,
      });

      return nextUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (tokens?.refreshToken) {
        await apiClient.post(
          "/auth/logout",
          { refreshToken: tokens.refreshToken },
          { auth: false },
        );
      }
    } catch (error) {
      console.warn("Falha ao notificar logout no back", error);
    } finally {
      clearSession();
    }
  };

  const setCompany = (companyId: string | null) => {
    setCompanyContext(companyId);
    setActiveCompanyId(companyId);
    setUser((currentUser) => {
      if (currentUser && tokens) {
        persistSession({
          user: currentUser,
          tokens,
          activeCompanyId: companyId,
        });
      }
      return currentUser;
    });
  };

  const roleGlobal = user?.role_global ?? null;
  const companyRole = useMemo(() => {
    if (!user?.companies?.length || !activeCompanyId) return null;
    return user.companies.find((c) => c.id === activeCompanyId)?.role ?? null;
  }, [activeCompanyId, user?.companies]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      companies: user?.companies ?? [],
      roleGlobal,
      companyId: activeCompanyId,
      companyRole,
      isAuthenticated: !!user && !!tokens?.accessToken,
      isLoading,
      login,
      logout,
      setCompany,
    }),
    [user, roleGlobal, activeCompanyId, companyRole, tokens?.accessToken, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
