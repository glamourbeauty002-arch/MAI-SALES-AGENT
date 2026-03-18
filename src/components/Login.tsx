import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Bot, AlertCircle, Loader2, Mail, UserCircle, Building2, Phone, MapPin, Globe, Briefcase, FileText, Hash, BadgeCheck, Check } from 'lucide-react';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('LLC');
  const [tradeLicense, setTradeLicense] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [industry, setIndustry] = useState('');
  const [taxId, setTaxId] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Initialize user data in Firestore immediately after registration
        await setDoc(doc(db, 'settings', user.uid), {
          theme: 'professional',
          companyName: companyName || 'My Company',
          businessType,
          tradeLicense,
          phone,
          address,
          city,
          country,
          industry,
          taxId,
          website,
          authorizedPerson: fullName,
          designation,
          agentName: 'MAI Agent',
          userName: fullName || email.split('@')[0],
          userAvatar: `https://picsum.photos/seed/${user.uid}/100/100`,
          whatsapp: { api: '', token: '' },
          erp: { endpoint: '', apiKey: '' },
          gemini: { apiKey: '' },
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin();
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('An error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* High-Tech AI Background */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        {/* Glowing Purple Circular Patterns */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[100px] rounded-full" />
        
        {/* Grid of Purple Plus Icons (Bottom Left) */}
        <div className="absolute bottom-12 left-12 grid grid-cols-4 gap-4 opacity-20">
          {[...Array(16)].map((_, i) => (
            <span key={i} className="text-purple-400 text-xl font-light">+</span>
          ))}
        </div>

        {/* Robot Image (Right Side) */}
        <div className="absolute inset-y-0 right-0 w-1/2 h-full hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=2070&auto=format&fit=crop"
            alt="AI Sales Agent Robot"
            className="w-full h-full object-cover object-center opacity-80"
            referrerPolicy="no-referrer"
          />
          {/* Robot Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/40 to-black" />
        </div>

        {/* Left Side Branding & Text */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 flex flex-col justify-center px-12 lg:px-24 z-10">
          <div className="space-y-6 max-w-xl">
            {/* MAI Logo Placeholder */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter uppercase">MAI</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tighter uppercase">
              AI Sales Agents: <br />
              <span className="text-orange-500">Boost Leads & ROI</span>
            </h1>
            
            <p className="text-zinc-400 text-lg lg:text-xl font-medium max-w-md leading-relaxed">
              See How 2026’s AI-driven Sales Automation Transforms Your Business
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full">
                <BadgeCheck className="w-5 h-5 text-orange-500" />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">2026 Ready</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full">
                <Hash className="w-5 h-5 text-purple-500" />
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">AI-Driven</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Background Fallback */}
        <div className="absolute inset-0 lg:hidden bg-zinc-950">
          <img
            src="https://images.unsplash.com/photo-1546776310-eef45dd6d63c?q=80&w=2070&auto=format&fit=crop"
            alt="AI Robot Background"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className={cn(
          "w-full space-y-8 relative z-20 transition-all duration-500 lg:ml-auto lg:mr-24",
          isRegistering ? "max-w-3xl" : "max-w-md"
        )}
      >
        <div className="bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4 transition-all hover:scale-110">
              <Bot className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">MAI SALES AGENT</h1>
            <p className="text-zinc-500 mt-1 text-sm font-medium">
              {isRegistering ? 'Register your company profile' : 'Access your AI sales pipeline'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[20px]">
            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-center gap-3 text-red-600 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-[20px]">

              {isRegistering ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Company Legal Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter legal company name"
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Business Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      <option value="LLC">LLC</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Corporation">Corporation</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Trade License / Tax ID (Optional)</label>
                    <input
                      type="text"
                      value={tradeLicense}
                      onChange={(e) => setTradeLicense(e.target.value)}
                      placeholder="Enter license or tax ID"
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Business Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="office@company.com"
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Phone Number (with country code)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+971 50 000 0000"
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Industry/Category</label>
                    <select
                      required
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                    >
                      <option value="" disabled>Select Industry</option>
                      <option value="Automotive & Spare Parts">Automotive & Spare Parts</option>
                      <option value="Education & School Management">Education & School Management</option>
                      <option value="Real Estate & Property Management">Real Estate & Property Management</option>
                      <option value="E-commerce & Retail">E-commerce & Retail</option>
                      <option value="Healthcare & Medical Services">Healthcare & Medical Services</option>
                      <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                      <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                      <option value="Finance & Banking">Finance & Banking</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[14px] font-medium text-zinc-700">Full Office Address</label>
                    <textarea
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Al Dammam Road Industrial Area #2"
                      rows={3}
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Authorized Person Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full name of owner/manager"
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Account Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-[20px]">
                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Business Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[14px] font-medium text-zinc-700">Account Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border border-[#E2E8F0] rounded-[6px] p-[12px] text-[16px] text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="peer appearance-none w-4 h-4 border border-[#E2E8F0] rounded bg-white checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                        />
                        <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-[13px] text-zinc-600 group-hover:text-zinc-900 transition-colors">Remember me</span>
                    </label>
                    <button type="button" className="text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-[14px] bg-blue-600 text-white rounded-[6px] font-semibold hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isRegistering ? 'Submitting Application...' : 'Authenticating...'}
                </>
              ) : (
                isRegistering ? 'Register Company' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[14px] font-medium text-blue-600 hover:text-green-500 transition-colors duration-300"
            >
              {isRegistering ? 'Already have an account? Sign In' : "New Business? Register Company"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-xs text-zinc-400 font-medium">
              Securely powered by Google Firebase
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
