import React, { useState } from 'react';
import { 
  Building2, 
  Image as ImageIcon, 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Check,
  Upload,
  Lock,
  Eye,
  EyeOff,
  User,
  Bot
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SettingsProps {
  theme: 'light' | 'dark' | 'professional';
  setTheme: (theme: 'light' | 'dark' | 'professional') => void;
  companyName: string;
  setCompanyName: (name: string) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  logo: string;
  setLogo: (logo: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  designation: string;
  setDesignation: (designation: string) => void;
  userAvatar: string;
  setUserAvatar: (avatar: string) => void;
  businessType: string;
  setBusinessType: (type: string) => void;
  tradeLicense: string;
  setTradeLicense: (license: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  address: string;
  setAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  country: string;
  setCountry: (country: string) => void;
  taxId: string;
  setTaxId: (id: string) => void;
  website: string;
  setWebsite: (url: string) => void;
}

export default function Settings({ 
  theme, 
  setTheme, 
  companyName, 
  setCompanyName, 
  industry,
  setIndustry,
  logo, 
  setLogo,
  userName,
  setUserName,
  designation,
  setDesignation,
  userAvatar,
  setUserAvatar,
  businessType,
  setBusinessType,
  tradeLicense,
  setTradeLicense,
  phone,
  setPhone,
  address,
  setAddress,
  city,
  setCity,
  country,
  setCountry,
  taxId,
  setTaxId,
  website,
  setWebsite
}: SettingsProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('File is too large. Please select an image smaller than 500KB.');
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert('File is too large. Please select an image smaller than 500KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Settings & Profile</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Configure your company identity and application appearance.</p>
      </div>

      {/* User Profile Section */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
          <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            User Profile
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Profile Picture</label>
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                  <Upload className="w-5 h-5 text-white" />
                  <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                </label>
              </div>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Designation / Role</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Sales Manager"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Profile Section */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
          <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Company Profile
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Company Logo</label>
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
                  {logo ? (
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                      <span className="text-[10px] text-zinc-400">No Logo</span>
                    </div>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
                  <Upload className="w-6 h-6 text-white" />
                  <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
                </label>
              </div>
              <p className="text-[10px] text-zinc-400 italic">Recommended: Square PNG or SVG</p>
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name..."
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Industry</label>
                  <select 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
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
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Business Type</label>
                  <select 
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  >
                    <option value="LLC">LLC</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Corporation">Corporation</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Trade License / Tax ID</label>
                  <input
                    type="text"
                    value={tradeLicense}
                    onChange={(e) => setTradeLicense(e.target.value)}
                    placeholder="Enter license or tax ID"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 000 0000"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Website</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Office Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address..."
                    rows={2}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter country"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Selection Section */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
          <h3 className="font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            Appearance & Theme
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean and bright' },
              { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Easy on the eyes' },
              { id: 'professional', label: 'Professional', icon: Monitor, desc: 'Blue & White' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={cn(
                  "p-4 rounded-2xl border-2 text-left transition-all group",
                  theme === t.id 
                    ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10" 
                    : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={cn(
                    "p-2 rounded-xl",
                    theme === t.id ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                  )}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  {theme === t.id && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{t.label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
