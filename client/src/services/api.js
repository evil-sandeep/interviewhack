import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for generic error handling could be added here

export const sendChatMessage = async (message) => {
  try {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside of 2xx
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from the server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      throw new Error(error.message);
    }
  }
};

export default api;
