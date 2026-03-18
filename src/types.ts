export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Closed';
  value: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
