import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Appends message to DB, gets context-aware AI response back
export const sendChatMessage = async (message) => {
  try {
    const response = await api.post('/chat/message', { message });
    return response.data;
  } catch (error) {
    if (error.response) throw new Error(error.response.data.error || 'Server error occurred');
    else if (error.request) throw new Error('No response from the server. Check your connection.');
    else throw new Error(error.message);
  }
};

// Mounts initial session with existing history
export const getChatHistory = async () => {
  try {
    const response = await api.get('/chat/history');
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return { messages: [] };
  }
};

// Hard wipes the user's conversational memory footprint
export const clearChatHistory = async () => {
  try {
    const response = await api.delete('/chat/clear');
    return response.data;
  } catch (error) {
    console.error("Failed to clear history:", error);
    throw error;
  }
};

export default api;
