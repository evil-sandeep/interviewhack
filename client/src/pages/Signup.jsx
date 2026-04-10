import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signupUser } from '../services/api';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth(); // We instantly log them in after sign up
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await signupUser(name, email, password);
      // Drops them right into the main context feed naturally
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Re-themed to match the Black/Red aesthetic pipeline!
    <div className="min-h-screen bg-black flex items-center justify-center p-4">

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Create Profile</h1>
            <p className="text-zinc-500 mt-2 text-sm">Initialize your context footprint.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 rounded-lg p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
             <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Display Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md px-4 py-3 text-white placeholder-zinc-700 outline-none transition-colors"
                placeholder="Agent 47"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md px-4 py-3 text-white placeholder-zinc-700 outline-none transition-colors"
                placeholder="you@domain.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Password Vault</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-md px-4 py-3 text-white placeholder-zinc-700 outline-none transition-colors"
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || password.length < 6}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-widest uppercase py-3 px-4 rounded-md shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-colors mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Deploying...</span>
                </>
              ) : 'Initialize Link'}
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-zinc-500">
            Already registered? <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold transition-colors">Access terminal</Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Signup;
