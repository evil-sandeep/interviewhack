import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await loginUser(email, password);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Fixed black background matching your explicit aesthetic
    <div className="min-h-screen bg-black flex items-center justify-center p-4">

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Welcome Back</h1>
            <p className="text-slate-400 mt-2 text-sm">Resume conversational sync.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-md mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors"
                placeholder="you@domain.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-widest uppercase py-3 px-4 rounded-md shadow-lg transition-colors mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Syncing...</span>
                </>
              ) : 'Authenticate Payload'}
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Don't have an identity profile? <Link to="/signup" className="text-red-500 hover:text-red-400 font-semibold transition-colors">Create one</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
