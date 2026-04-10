# 🎙️ AI Voice Assistant (MERN + AI)

A full-stack, production-ready AI Voice Assistant built with the MERN stack. This application allows users to interact with an AI naturally through real-time voice-to-text recognition and text-to-speech synthesis, all backed by a persistent MongoDB conversational memory.

## 🌟 Key Features

* **Real-time Voice Input**: Seamlessly converts spoken words into text using the browser's native Web Speech API.
* **Context-Aware AI Responses**: Securely retains conversational history across sessions allowing the AI to "remember" past interactions. 
* **Dynamic Text-to-Speech (TTS)**: Automatically reads out AI responses with adjustable playback speeds.
* **Secure Authentication**: Full JWT-based login and signup system with encrypted Bcrypt passwords and protected API routes.
* **Optimized UI/UX**: Features a fully responsive, visually stunning Tailwind CSS interface with Dark/Light mode, animated typing indicators, and clipboard integrations.

## 🛠️ Tech Stack

* **Frontend**: React.js, Vite, Tailwind CSS, Web Speech API
* **Backend**: Node.js, Express.js, JWT, Bcrypt, Helmet, Compression
* **Database**: MongoDB, Mongoose
* **AI Integration**: OpenRouter / OpenAI SDK

## 📸 Demo Screenshots

*(Add screenshots of your Login page, Main Chat UI, and Mobile View here)*
- `[Screenshot 1]` - *Dark Mode UI showing Chat Interface*
- `[Screenshot 2]` - *Authentication & Signup Gateway*

## 🚀 Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-voice-assistant.git
cd ai-voice-assistant
```

### 2. Set Up Environment Variables
Create a `.env` file in the `/server` directory using the provided `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
OPENROUTER_API_KEY=your_open_router_or_openai_api_key
CLIENT_URL=http://localhost:5173 
```
Create a `.env` file in the `/client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies
```bash
# Install Backend Dependencies
cd server
npm install

# Install Frontend Dependencies
cd ../client
npm install
```

### 4. Run the Application
```bash
# Start Backend
cd server
npm start

# Start Frontend (In a separate terminal)
cd client
npm run dev
```

## 📁 Folder Structure

```
├── client/
│   ├── src/
│   │   ├── components/  # Chat Bubbles, Header, Input, Layouts
│   │   ├── hooks/       # Web Speech API hooks
│   │   ├── context/     # React Context for Global State
│   │   ├── services/    # Axios HTTP interactions
│   │   └── pages/       # Login, Signup
│
├── server/
│   ├── config/          # MongoDB Connection
│   ├── controllers/     # Authentication & Chat Logging logic
│   ├── middleware/      # JWT Protection, Rate Limiting, Helmet
│   ├── models/          # Mongoose Schemas (User, Chat)
│   ├── routes/          # RESTful endpoints
│   └── services/        # OpenAI routing and Context caching
```

## 🔮 Future Enhancements
* OAuth Integration (Google/GitHub Login)
* Advanced Speech Synthesis (ElevenLabs API)
* File Upload / Image Analysis (Vision API)
