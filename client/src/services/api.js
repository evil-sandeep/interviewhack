import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach authorization headers
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsedInfo = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${parsedInfo.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Standard wrapper blocks
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.error || 'Server error occurred');
    else if (error.request) throw new Error('No response from the server. Check your connection.');
    else throw new Error(error.message);
  }
};

export const sendChatMessage = (message) => handleRequest(api.post('/chat/message', { message }));
export const getChatHistory = () => handleRequest(api.get('/chat/history'));
export const clearChatHistory = () => handleRequest(api.delete('/chat/clear'));
export const loginUser = (email, password) => handleRequest(api.post('/auth/login', { email, password }));
export const signupUser = (name, email, password) => handleRequest(api.post('/auth/signup', { name, email, password }));

export default api;
