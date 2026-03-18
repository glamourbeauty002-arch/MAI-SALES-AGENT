import React, { useState } from 'react';
import { 
  MessageSquare, 
  Database, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConnectionState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

interface ConnectionsProps {
  whatsapp: { api: string; token: string; phoneNumberId: string; verifyToken: string };
  setWhatsapp: (data: { api: string; token: string; phoneNumberId: string; verifyToken: string }) => void;
  erp: { endpoint: string; apiKey: string; provider: string };
  setErp: (data: { endpoint: string; apiKey: string; provider: string }) => void;
  gemini: { apiKey: string; model: string };
  setGemini: (data: { apiKey: string; model: string }) => void;
  googleSheets: { spreadsheetId: string; apiKey: string; sheetName: string };
  setGoogleSheets: (data: { spreadsheetId: string; apiKey: string; sheetName: string }) => void;
  agentEnabled: boolean;
  setAgentEnabled: (enabled: boolean) => void;
}

interface ConnectionCardProps {
  title: string;
  description: string;
  icon: any;
  children: React.ReactNode;
  onVerify: () => void;
  state: ConnectionState;
}

const ConnectionCard = ({
  title,
  description,
  icon: Icon,
  children,
  onVerify,
  state
}: ConnectionCardProps) => (
  <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
            <Icon className="w-6 h-6 text-zinc-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
            <p className="text-sm text-zinc-500">{description}</p>
          </div>
        </div>
        {state.status === 'success' && (
          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3" />
            Connected
          </div>
        )}
      </div>

      <div className="space-y-4">
        {children}
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {state.status === 'loading' && <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />}
          {state.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          {state.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          <span className={cn(
            "text-xs font-medium",
            state.status === 'success' ? "text-emerald-600" : 
            state.status === 'error' ? "text-red-600" : "text-zinc-400"
          )}>
            {state.message || (state.status === 'idle' ? 'Not verified' : '')}
          </span>
        </div>
        <button
          onClick={onVerify}
          disabled={state.status === 'loading'}
          className="px-4 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-all flex items-center gap-2"
        >
          Verify Connection
        </button>
      </div>
    </div>
  </div>
);

export default function Connections({
  whatsapp,
  setWhatsapp,
  erp,
  setErp,
  gemini,
  setGemini,
  googleSheets,
  setGoogleSheets,
  agentEnabled,
  setAgentEnabled
}: ConnectionsProps) {
  const [whatsappStatus, setWhatsappStatus] = useState<ConnectionState>({ status: 'idle', message: '' });
  const [erpStatus, setErpStatus] = useState<ConnectionState>({ status: 'idle', message: '' });
  const [geminiStatus, setGeminiStatus] = useState<ConnectionState>({ status: 'idle', message: '' });
  const [googleSheetsStatus, setGoogleSheetsStatus] = useState<ConnectionState>({ status: 'idle', message: '' });

  const verifyConnection = async (type: 'whatsapp' | 'erp' | 'gemini' | 'googleSheets') => {
    const setStatus = 
      type === 'whatsapp' ? setWhatsappStatus : 
      type === 'erp' ? setErpStatus : 
      type === 'gemini' ? setGeminiStatus : 
      setGoogleSheetsStatus;
    
    setStatus({ status: 'loading', message: 'Verifying connection...' });
    
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock logic: fail if empty, succeed otherwise
    const data = 
      type === 'whatsapp' ? whatsapp : 
      type === 'erp' ? erp : 
      type === 'gemini' ? gemini : 
      googleSheets;
    const isValid = Object.values(data).every(val => val.trim().length > 0);

    if (isValid) {
      setStatus({ status: 'success', message: 'Connection verified successfully!' });
    } else {
      setStatus({ status: 'error', message: 'Verification failed. Please check your credentials.' });
    }
  };

    return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Integrations & Connections</h1>
          <p className="text-zinc-500">Manage your external service connections and API keys.</p>
        </div>
        
        {/* Agent On/Off Toggle */}
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm">
          <span className="text-sm font-semibold text-zinc-700">Agent Status</span>
          <button
            onClick={() => setAgentEnabled(!agentEnabled)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2",
              agentEnabled ? "bg-emerald-500" : "bg-zinc-300"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                agentEnabled ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider",
            agentEnabled ? "text-emerald-600" : "text-zinc-500"
          )}>
            {agentEnabled ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* WhatsApp Connection */}
      <ConnectionCard
        title="WhatsApp Business API"
        description="Connect your business WhatsApp account for automated messaging."
        icon={MessageSquare}
        onVerify={() => verifyConnection('whatsapp')}
        state={whatsappStatus}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">API Endpoint</label>
            <input
              type="text"
              placeholder="https://graph.facebook.com/v17.0/..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={whatsapp.api}
              onChange={(e) => setWhatsapp({ ...whatsapp, api: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Access Token</label>
            <input
              type="password"
              placeholder="EAABw..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={whatsapp.token}
              onChange={(e) => setWhatsapp({ ...whatsapp, token: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Phone Number ID</label>
            <input
              type="text"
              placeholder="1092837465..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={whatsapp.phoneNumberId}
              onChange={(e) => setWhatsapp({ ...whatsapp, phoneNumberId: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Webhook Verify Token</label>
            <input
              type="text"
              placeholder="my_secret_token"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={whatsapp.verifyToken}
              onChange={(e) => setWhatsapp({ ...whatsapp, verifyToken: e.target.value })}
            />
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-zinc-50 rounded-xl border border-zinc-100">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Your Webhook Callback URL</label>
          <code className="text-[11px] text-emerald-600 break-all font-mono">
            {window.location.origin}/api/whatsapp/webhook
          </code>
          <p className="text-[10px] text-zinc-400 mt-2 italic">
            Copy this URL into your Meta Developer Portal under "Webhooks" configuration.
          </p>
        </div>
      </ConnectionCard>

      {/* ERP Connection */}
      <ConnectionCard
        title="ERP System Integration"
        description="Sync your inventory, orders, and customer data with your ERP."
        icon={Database}
        onVerify={() => verifyConnection('erp')}
        state={erpStatus}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">ERP Provider</label>
            <select 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={erp.provider}
              onChange={(e) => setErp({ ...erp, provider: e.target.value })}
            >
              <option value="Custom">Custom API</option>
              <option value="EUMI">EUMI ERP</option>
              <option value="CUBIX">CUBIX ERP</option>
              <option value="REALSOFT">REAL SOFT ERP</option>
              <option value="SAP">SAP</option>
              <option value="Oracle">Oracle</option>
              <option value="Shopify">Shopify</option>
              <option value="Odoo">Odoo</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">ERP API Endpoint</label>
            <input
              type="text"
              placeholder="https://api.your-erp.com/v1"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={erp.endpoint}
              onChange={(e) => setErp({ ...erp, endpoint: e.target.value })}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">ERP API Key / Secret</label>
            <input
              type="password"
              placeholder="erp_key_..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={erp.apiKey}
              onChange={(e) => setErp({ ...erp, apiKey: e.target.value })}
            />
          </div>
        </div>
      </ConnectionCard>

      {/* Gemini API Connection */}
      <ConnectionCard
        title="Gemini AI Engine"
        description="Configure your Google AI Studio API key for the sales agent."
        icon={Key}
        onVerify={() => verifyConnection('gemini')}
        state={geminiStatus}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Gemini API Key</label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
                value={gemini.apiKey}
                onChange={(e) => setGemini({ ...gemini, apiKey: e.target.value })}
              />
              <button
                onClick={async () => {
                  if (window.aistudio) {
                    await window.aistudio.openSelectKey();
                    // Clear the manual key so the environment key takes precedence
                    setGemini({ ...gemini, apiKey: '' });
                  } else {
                    alert('API Key selection is only available in the AI Studio environment.');
                  }
                }}
                className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all whitespace-nowrap"
              >
                Select Key
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">AI Model Selection</label>
            <select 
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={gemini.model}
              onChange={(e) => setGemini({ ...gemini, model: e.target.value })}
            >
              <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast & High Quota)</option>
              <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Advanced Reasoning)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            </select>
          </div>
        </div>
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-[11px] text-amber-800 font-medium">
            Hitting Quota Limits (429 Error)?
          </p>
          <p className="text-[10px] text-amber-700 mt-1">
            The shared API key has limited usage. Click <strong>"Select Key"</strong> to use your own Google Cloud API key with billing enabled for unlimited access.
          </p>
        </div>
      </ConnectionCard>

      {/* Google Sheets Connection */}
      <ConnectionCard
        title="Google Sheets Inventory"
        description="Connect your inventory spreadsheet to give the agent real-time access."
        icon={FileSpreadsheet}
        onVerify={() => verifyConnection('googleSheets')}
        state={googleSheetsStatus}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Spreadsheet ID or Link</label>
            <input
              type="text"
              placeholder="Paste full link or ID..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={googleSheets.spreadsheetId}
              onChange={(e) => {
                let val = e.target.value;
                // Automatically extract the ID if the user pastes a full Google Sheets URL
                const match = val.match(/\/d\/([a-zA-Z0-9-_]+)/);
                if (match && match[1]) {
                  val = match[1];
                }
                setGoogleSheets({ ...googleSheets, spreadsheetId: val });
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Sheet Name (Tab)</label>
            <input
              type="text"
              placeholder="Inventory"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={googleSheets.sheetName}
              onChange={(e) => setGoogleSheets({ ...googleSheets, sheetName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Google API Key</label>
            <input
              type="password"
              placeholder="AIzaSy..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-zinc-500/10 focus:border-zinc-500 outline-none"
              value={googleSheets.apiKey}
              onChange={(e) => setGoogleSheets({ ...googleSheets, apiKey: e.target.value })}
            />
          </div>
        </div>
        <p className="text-[10px] text-zinc-400 mt-1 italic">
          Tip: Ensure your sheet is shared with the service account or public if using an API key.
        </p>
      </ConnectionCard>
    </div>
  );
}
