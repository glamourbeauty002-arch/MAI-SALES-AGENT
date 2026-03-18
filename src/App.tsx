import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Users, 
  Settings as SettingsIcon, 
  LogOut,
  Menu,
  X,
  TrendingUp,
  Link2,
  Brain,
  Bot,
  Check
} from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import Connections from './components/Connections';
import Training from './components/Training';
import Settings from './components/Settings';
import Login from './components/Login';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'connections' | 'training' | 'settings'>(() => {
    return (localStorage.getItem('MAI_ACTIVE_TAB') as any) || 'chat';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('MAI_SIDEBAR_OPEN');
    return saved !== null ? saved === 'true' : true;
  });

  // Auto-Save UI State to LocalStorage
  useEffect(() => {
    localStorage.setItem('MAI_ACTIVE_TAB', activeTab);
    localStorage.setItem('MAI_SIDEBAR_OPEN', isSidebarOpen.toString());
  }, [activeTab, isSidebarOpen]);
  
// // Theme and Company State
  const [theme, setTheme] = useState<'light' | 'dark' | 'professional'>(() => {
    const saved = localStorage.getItem('MAI_THEME');
    return (saved as any) || 'professional';
  });

  const [companyName, setCompanyName] = useState(() => {
    const saved = localStorage.getItem('MAI_COMPANY_NAME');
    return saved !== null ? saved : 'MAI SALES AGENT';
  });

  const [industry, setIndustry] = useState(() => {
    const saved = localStorage.getItem('MAI_INDUSTRY');
    return saved !== null ? saved : 'Automotive Spare Parts';
  });

  const [businessType, setBusinessType] = useState(() => {
    const saved = localStorage.getItem('MAI_BUSINESS_TYPE');
    return saved !== null ? saved : 'LLC';
  });

  const [tradeLicense, setTradeLicense] = useState(() => {
    const saved = localStorage.getItem('MAI_TRADE_LICENSE');
    return saved !== null ? saved : '';
  });

  const [phone, setPhone] = useState(() => {
    const saved = localStorage.getItem('MAI_PHONE');
    return saved !== null ? saved : '';
  });

  const [address, setAddress] = useState(() => {
    const saved = localStorage.getItem('MAI_ADDRESS');
    return saved !== null ? saved : '';
  });

  const [city, setCity] = useState(() => {
    const saved = localStorage.getItem('MAI_CITY');
    return saved !== null ? saved : '';
  });

  const [country, setCountry] = useState(() => {
    const saved = localStorage.getItem('MAI_COUNTRY');
    return saved !== null ? saved : '';
  });

  const [taxId, setTaxId] = useState(() => {
    const saved = localStorage.getItem('MAI_TAX_ID');
    return saved !== null ? saved : '';
  });

  const [website, setWebsite] = useState(() => {
    const saved = localStorage.getItem('MAI_WEBSITE');
    return saved !== null ? saved : '';
  });

  const [agentName, setAgentName] = useState(() => {
    const saved = localStorage.getItem('MAI_AGENT_NAME');
    return saved !== null ? saved : 'MAI SALES AGENT';
  });

  const [logo, setLogo] = useState(() => {
    const saved = localStorage.getItem('MAI_LOGO');
    return saved !== null ? saved : '';
  });

  // Auto-Save Effect for Company Profile
  useEffect(() => {
    localStorage.setItem('MAI_THEME', theme);
    localStorage.setItem('MAI_COMPANY_NAME', companyName);
    localStorage.setItem('MAI_INDUSTRY', industry);
    localStorage.setItem('MAI_BUSINESS_TYPE', businessType);
    localStorage.setItem('MAI_TRADE_LICENSE', tradeLicense);
    localStorage.setItem('MAI_PHONE', phone);
    localStorage.setItem('MAI_ADDRESS', address);
    localStorage.setItem('MAI_CITY', city);
    localStorage.setItem('MAI_COUNTRY', country);
    localStorage.setItem('MAI_TAX_ID', taxId);
    localStorage.setItem('MAI_WEBSITE', website);
    localStorage.setItem('MAI_AGENT_NAME', agentName);
    localStorage.setItem('MAI_LOGO', logo);
  }, [theme, companyName, industry, businessType, tradeLicense, phone, address, city, country, taxId, website, agentName, logo]);

// // User Profile State
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem('MAI_USER_NAME');
    return saved !== null ? saved : '';
  });

  const [designation, setDesignation] = useState<string>(() => {
    const saved = localStorage.getItem('MAI_DESIGNATION');
    return saved !== null ? saved : 'Sales Executive';
  });

  const [userAvatar, setUserAvatar] = useState<string>(() => {
    const saved = localStorage.getItem('MAI_USER_AVATAR');
    return saved !== null ? saved : 'https://picsum.photos/seed/user/100/100';
  });

  useEffect(() => {
    localStorage.setItem('MAI_USER_NAME', userName);
    localStorage.setItem('MAI_DESIGNATION', designation);
    localStorage.setItem('MAI_USER_AVATAR', userAvatar);
  }, [userName, designation, userAvatar]);

  // Toast State
  const [showToast, setShowToast] = useState<string | null>(null);

  // Connections State
  const [whatsapp, setWhatsapp] = useState(() => {
    const saved = localStorage.getItem('MAI_WHATSAPP');
    return saved ? JSON.parse(saved) : { api: '', token: '', phoneNumberId: '', verifyToken: '' };
  });
  const [erp, setErp] = useState(() => {
    const saved = localStorage.getItem('MAI_ERP');
    return saved ? JSON.parse(saved) : { endpoint: '', apiKey: '', provider: 'Custom' };
  });
  const [gemini, setGemini] = useState(() => {
    const saved = localStorage.getItem('MAI_GEMINI');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.model?.includes('1.5') || parsed.model === 'gemini-pro') {
        parsed.model = 'gemini-3-flash-preview';
      }
      return parsed;
    }
    return { apiKey: 'AIzaSyB6gDZkHdevJ31BSTAh88eTqtqmiioSV7Y', model: 'gemini-3-flash-preview' };
  });
  const [googleSheets, setGoogleSheets] = useState(() => {
    const saved = localStorage.getItem('MAI_GOOGLE_SHEETS');
    const parsed = saved ? JSON.parse(saved) : { spreadsheetId: '', apiKey: '', sheetName: 'Sheet1' };
    if (!parsed.spreadsheetId) {
      parsed.spreadsheetId = '1CvUbQE-I0GvDNMaEyfNcwFcDcRLTY-9EBGWGJhXJddc';
    }
    return parsed;
  });

  const [agentEnabled, setAgentEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('MAI_AGENT_ENABLED');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Auto-Save Connections to LocalStorage
  useEffect(() => {
    localStorage.setItem('MAI_WHATSAPP', JSON.stringify(whatsapp));
    localStorage.setItem('MAI_ERP', JSON.stringify(erp));
    localStorage.setItem('MAI_GEMINI', JSON.stringify(gemini));
    localStorage.setItem('MAI_GOOGLE_SHEETS', JSON.stringify(googleSheets));
    localStorage.setItem('MAI_AGENT_ENABLED', JSON.stringify(agentEnabled));
  }, [whatsapp, erp, gemini, googleSheets, agentEnabled]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) return;

    // Listen for settings changes
    const settingsRef = doc(db, 'settings', user.uid);
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Only update if different from current state to avoid loops or overwriting optimistic updates
        if (data.theme !== undefined && data.theme !== theme) setTheme(data.theme);
        if (data.companyName !== undefined && data.companyName !== companyName) setCompanyName(data.companyName);
        if (data.industry !== undefined && data.industry !== industry) setIndustry(data.industry);
        if (data.businessType !== undefined && data.businessType !== businessType) setBusinessType(data.businessType);
        if (data.tradeLicense !== undefined && data.tradeLicense !== tradeLicense) setTradeLicense(data.tradeLicense);
        if (data.phone !== undefined && data.phone !== phone) setPhone(data.phone);
        if (data.address !== undefined && data.address !== address) setAddress(data.address);
        if (data.city !== undefined && data.city !== city) setCity(data.city);
        if (data.country !== undefined && data.country !== country) setCountry(data.country);
        if (data.taxId !== undefined && data.taxId !== taxId) setTaxId(data.taxId);
        if (data.website !== undefined && data.website !== website) setWebsite(data.website);
        if (data.agentName !== undefined && data.agentName !== agentName) setAgentName(data.agentName);
        if (data.logo !== undefined && data.logo !== logo) setLogo(data.logo);
        if (data.userName !== undefined && data.userName !== userName) setUserName(data.userName);
        if (data.designation !== undefined && data.designation !== designation) setDesignation(data.designation);
        if (data.userAvatar !== undefined && data.userAvatar !== userAvatar) setUserAvatar(data.userAvatar);
        if (data.whatsapp !== undefined) setWhatsapp(data.whatsapp);
        if (data.erp !== undefined) setErp(data.erp);
        if (data.gemini !== undefined) {
          let upgradedGemini = { ...data.gemini };
          if (upgradedGemini.model?.includes('1.5') || upgradedGemini.model === 'gemini-pro') {
            upgradedGemini.model = 'gemini-3-flash-preview';
          }
          setGemini(upgradedGemini);
        }
        if (data.googleSheets !== undefined) setGoogleSheets(data.googleSheets);
        if (data.agentEnabled !== undefined && data.agentEnabled !== agentEnabled) setAgentEnabled(data.agentEnabled);
      } else {
        // Initialize default settings for new user
        setDoc(settingsRef, {
          theme: 'professional',
          companyName: 'My Company',
          industry: 'Technology & Software',
          agentName: 'MAI Agent',
          agentEnabled: true,
          userName: user.email?.split('@')[0] || 'User',
          userAvatar: 'https://picsum.photos/seed/user/100/100',
          whatsapp: { api: '', token: '', phoneNumberId: '', verifyToken: '' },
          erp: { endpoint: '', apiKey: '', provider: 'Custom' },
          gemini: { apiKey: 'AIzaSyB6gDZkHdevJ31BSTAh88eTqtqmiioSV7Y', model: 'gemini-3-flash-preview' },
          googleSheets: { spreadsheetId: '', apiKey: '', sheetName: 'Sheet1' }
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'professional');
    root.classList.add(theme);
    
    if (theme === 'dark') {
      root.style.colorScheme = 'dark';
    } else {
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Save settings helper
  const saveSettings = async (updates: any) => {
    if (!user) return;
    
    // Optimistic updates for local state
    if (updates.theme !== undefined) setTheme(updates.theme);
    if (updates.companyName !== undefined) setCompanyName(updates.companyName);
    if (updates.industry !== undefined) setIndustry(updates.industry);
    if (updates.businessType !== undefined) setBusinessType(updates.businessType);
    if (updates.tradeLicense !== undefined) setTradeLicense(updates.tradeLicense);
    if (updates.phone !== undefined) setPhone(updates.phone);
    if (updates.address !== undefined) setAddress(updates.address);
    if (updates.city !== undefined) setCity(updates.city);
    if (updates.country !== undefined) setCountry(updates.country);
    if (updates.taxId !== undefined) setTaxId(updates.taxId);
    if (updates.website !== undefined) setWebsite(updates.website);
    if (updates.agentName !== undefined) setAgentName(updates.agentName);
    if (updates.logo !== undefined) setLogo(updates.logo);
    if (updates.userName !== undefined) setUserName(updates.userName);
    if (updates.designation !== undefined) setDesignation(updates.designation);
    if (updates.userAvatar !== undefined) setUserAvatar(updates.userAvatar);
    if (updates.whatsapp !== undefined) setWhatsapp(updates.whatsapp);
    if (updates.erp !== undefined) setErp(updates.erp);
    if (updates.gemini !== undefined) setGemini(updates.gemini);
    if (updates.googleSheets !== undefined) setGoogleSheets(updates.googleSheets);
    if (updates.agentEnabled !== undefined) setAgentEnabled(updates.agentEnabled);

    try {
      const settingsRef = doc(db, 'settings', user.uid);
      await setDoc(settingsRef, updates, { merge: true });
      
      // Show success toast
      if (updates.agentEnabled !== undefined) {
        setShowToast(updates.agentEnabled ? 'Agent is now ON' : 'Agent is now OFF');
      } else {
        setShowToast('Settings saved successfully');
      }
      setTimeout(() => setShowToast(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      // You might want to show an error toast here
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50">
        <Bot className="w-12 h-12 text-emerald-500 animate-bounce" />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={() => {}} />;
  }

  const navItems = [
    { id: 'connections', label: 'Connections', icon: Link2 },
    { id: 'chat', label: 'AI Sales Agent', icon: MessageSquare },
    { id: 'training', label: 'Agent Training', icon: Brain },
    { id: 'leads', label: 'Leads', icon: Users },
  ];

  const bottomNavItems = [
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className={cn(
      "flex h-screen font-sans transition-colors duration-300",
      theme === 'dark' ? "bg-zinc-950 text-zinc-100" : "bg-zinc-50 text-zinc-900"
    )}>
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:relative lg:translate-x-0",
        theme === 'dark' ? "bg-zinc-900 border-r border-zinc-800" : "bg-zinc-900",
        !isSidebarOpen && "-translate-x-full lg:hidden"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-zinc-900" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight truncate">MAI SALES AGENT</span>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-zinc-800 space-y-1">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  activeTab === item.id 
                    ? "bg-emerald-500/10 text-emerald-500" 
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => signOut(auth)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={cn(
          "h-16 border-b flex items-center justify-between px-6 shrink-0",
          theme === 'dark' ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"
        )}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg",
                theme === 'dark' ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
              )}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-semibold capitalize">
              {activeTab === 'chat' ? 'AI Assistant' : 
               activeTab === 'connections' ? 'Integrations' : 
               activeTab === 'training' ? 'Agent Training' : 
               activeTab === 'settings' ? 'Settings' : activeTab}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-zinc-500">{designation}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white shadow-sm overflow-hidden">
              <img 
                src={userAvatar} 
                alt="User" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'chat' ? (
              <div className="h-[calc(100vh-180px)]">
                <ChatInterface agentName={agentName} agentEnabled={agentEnabled} />
              </div>
            ) : activeTab === 'connections' ? (
              <Connections 
                whatsapp={whatsapp}
                setWhatsapp={(data) => saveSettings({ whatsapp: data })}
                erp={erp}
                setErp={(data) => saveSettings({ erp: data })}
                gemini={gemini}
                setGemini={(data) => saveSettings({ gemini: data })}
                googleSheets={googleSheets}
                setGoogleSheets={(data) => saveSettings({ googleSheets: data })}
                agentEnabled={agentEnabled}
                setAgentEnabled={(enabled) => saveSettings({ agentEnabled: enabled })}
              />
            ) : activeTab === 'training' ? (
              <Training agentName={agentName} setAgentName={(name) => saveSettings({ agentName: name })} />
            ) : activeTab === 'settings' ? (
              <Settings 
                theme={theme} 
                setTheme={(t) => saveSettings({ theme: t })} 
                companyName={companyName}
                setCompanyName={(name) => saveSettings({ companyName: name })}
                industry={industry}
                setIndustry={(ind) => saveSettings({ industry: ind })}
                logo={logo}
                setLogo={(l) => saveSettings({ logo: l })}
                userName={userName}
                setUserName={(name) => saveSettings({ userName: name })}
                designation={designation}
                setDesignation={(des) => saveSettings({ designation: des })}
                userAvatar={userAvatar}
                setUserAvatar={(avatar) => saveSettings({ userAvatar: avatar })}
                businessType={businessType}
                setBusinessType={(bt) => saveSettings({ businessType: bt })}
                tradeLicense={tradeLicense}
                setTradeLicense={(tl) => saveSettings({ tradeLicense: tl })}
                phone={phone}
                setPhone={(p) => saveSettings({ phone: p })}
                address={address}
                setAddress={(a) => saveSettings({ address: a })}
                city={city}
                setCity={(c) => saveSettings({ city: c })}
                country={country}
                setCountry={(co) => saveSettings({ country: co })}
                taxId={taxId}
                setTaxId={(ti) => saveSettings({ taxId: ti })}
                website={website}
                setWebsite={(w) => saveSettings({ website: w })}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-4">
                <TrendingUp className="w-12 h-12 opacity-20" />
                <p className="text-sm">This module is coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <div className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform",
        showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}>
        <div className="bg-zinc-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-800">
          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-zinc-900" />
          </div>
          <span className="text-sm font-bold tracking-tight">{showToast || 'Changes saved successfully'}</span>
        </div>
      </div>
    </div>
  );
}
