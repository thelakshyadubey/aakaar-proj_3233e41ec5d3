import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Note {
  id: number;
  title: string;
  content: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
}

export const getNotes = () => api.get<Note[]>('/api/notes');
export const createNote = (data: Omit<Note, 'id'>) => api.post<Note>('/api/notes', data);
export const deleteNote = (id: number) => api.delete<void>(`/api/notes/${id}`);
export const login = (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data);
export const register = (data: RegisterRequest) => api.post<RegisterResponse>('/api/auth/register', data);