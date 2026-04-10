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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-10 dark:opacity-30 pointer-events-none blur-[100px]">
         <div className="w-[400px] h-[400px] bg-fuchsia-600 rounded-full mix-blend-multiply dark:mix-blend-screen"></div>
         <div className="w-[400px] h-[400px] bg-violet-600 rounded-full mix-blend-multiply dark:mix-blend-screen -ml-32"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-violet-300">Create Profile</h1>
            <p className="text-slate-400 mt-2 text-sm">Initialize your context footprint.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
             <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Display Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 outline-none transition-all"
                placeholder="Agent 47"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 outline-none transition-all"
                placeholder="you@domain.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Password Vault</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 outline-none transition-all"
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || password.length < 6}
              className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium tracking-wide py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Deploying...</span>
                </>
              ) : 'Initialize Link'}
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-400">
            Already registered? <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Access terminal</Link>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Signup;
