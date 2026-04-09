import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-10 rounded-[40px] text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-deep-violet flex items-center justify-center font-bold text-white text-2xl mx-auto mb-8">
          L
        </div>
        <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
        <p className="text-white/50 mb-8">Access the lemedo.it dashboard</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-neon-blue hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <LogIn className="w-5 h-5" />
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </motion.div>
    </div>
  );
};

export default Login;
