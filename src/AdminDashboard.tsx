import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Users, 
  LayoutDashboard, 
  LogOut, 
  CheckCircle, 
  Trash2, 
  UserPlus,
  Mail,
  Clock,
  User as UserIcon
} from 'lucide-react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages');
  const [messages, setMessages] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) return;

    const messagesQuery = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'messages'));

    const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
      setAdmins(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));

    return () => {
      unsubscribeMessages();
      unsubscribeUsers();
    };
  }, [isAdmin]);

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'messages', id), { status: 'read' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `messages/${id}`);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
    }
  };

  const addAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    setLoading(true);
    try {
      // Note: In a real app, you'd probably use a Cloud Function to set custom claims
      // or just add to the users collection and check role in rules.
      // Since we can't create Auth users directly, we just add to the DB.
      // The user will need to log in with this email to get access.
      
      // Check if already exists
      const q = query(collection(db, 'users'));
      const snapshot = await getDocs(q);
      const exists = snapshot.docs.some(doc => doc.data().email === newAdminEmail);
      
      if (exists) {
        alert('User already has admin access.');
        return;
      }

      await addDoc(collection(db, 'users'), {
        email: newAdminEmail,
        role: 'admin',
        createdAt: serverTimestamp()
      });
      setNewAdminEmail('');
      alert('Admin access granted. They can now log in with this email.');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'users');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/50 mb-8">You do not have permission to view this page.</p>
          <button onClick={handleLogout} className="px-6 py-2 rounded-xl bg-white text-black font-bold">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r-0 m-4 rounded-[32px] flex flex-col p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-deep-violet flex items-center justify-center font-bold text-white">
            L
          </div>
          <span className="font-display font-bold tracking-tighter text-xl">Admin</span>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'messages' ? 'bg-neon-blue text-white' : 'hover:bg-white/5 text-white/60'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Messages
            {messages.filter(m => m.status === 'new').length > 0 && (
              <span className="ml-auto bg-white text-neon-blue text-[10px] font-bold px-2 py-0.5 rounded-full">
                {messages.filter(m => m.status === 'new').length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-neon-blue text-white' : 'hover:bg-white/5 text-white/60'}`}
          >
            <Users className="w-5 h-5" />
            User Manager
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {activeTab === 'messages' ? 'Inbound Messages' : 'Admin Management'}
            </h1>
            <p className="text-white/50">
              {activeTab === 'messages' 
                ? `You have ${messages.length} total messages.` 
                : `Managing ${admins.length} administrators.`}
            </p>
          </div>
          <div className="flex items-center gap-4 glass px-6 py-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <p className="text-sm font-bold">{user?.displayName || 'Admin'}</p>
              <p className="text-[10px] text-white/40">{user?.email}</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'messages' ? (
            <motion.div 
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-4"
            >
              {messages.length === 0 ? (
                <div className="glass p-12 rounded-3xl text-center">
                  <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40">No messages yet.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`glass p-6 rounded-3xl border-l-4 transition-all ${msg.status === 'new' ? 'border-l-neon-blue' : 'border-l-transparent opacity-70'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-neon-blue">
                          <Mail className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{msg.name}</h3>
                          <p className="text-sm text-white/40">{msg.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {msg.status === 'new' && (
                          <button 
                            onClick={() => markAsRead(msg.id)}
                            className="p-2 rounded-xl hover:bg-green-500/10 text-green-500 transition-all"
                            title="Mark as Read"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteMessage(msg.id)}
                          className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"
                          title="Delete Message"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm font-bold text-neon-blue mb-1">{msg.subject || 'No Subject'}</p>
                      <p className="text-white/80 leading-relaxed">{msg.message}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-bold">
                      <Clock className="w-3 h-3" />
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Just now'}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="glass p-8 rounded-[32px] mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-neon-blue" />
                  Grant Admin Access
                </h2>
                <form onSubmit={addAdmin} className="flex gap-4">
                  <input 
                    type="email" 
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-neon-blue outline-none transition-all"
                    required
                  />
                  <button 
                    disabled={loading}
                    className="px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-neon-blue hover:text-white transition-all disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Add Admin'}
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                  <div key={admin.id} className="glass p-6 rounded-3xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue/20 to-deep-violet/20 flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{admin.displayName || 'Pending Login'}</p>
                      <p className="text-xs text-white/40 truncate">{admin.email}</p>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-neon-blue/10 text-neon-blue text-[8px] font-bold uppercase tracking-widest">
                      {admin.role}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
