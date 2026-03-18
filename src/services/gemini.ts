import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { Message } from "../types";

const createERPQutationDeclaration: FunctionDeclaration = {
  name: "createERPQutation",
  parameters: {
    type: Type.OBJECT,
    description: "Create a formal quotation in the connected ERP system based on identified parts.",
    properties: {
      customerName: {
        type: Type.STRING,
        description: "The name of the customer requesting the quote."
      },
      parts: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            partNumber: { type: Type.STRING },
            quantity: { type: Type.NUMBER },
            description: { type: Type.STRING }
          },
          required: ["partNumber", "quantity"]
        },
        description: "List of parts to include in the quotation."
      }
    },
    required: ["customerName", "parts"]
  }
};

const updateAgentMemoryDeclaration: FunctionDeclaration = {
  name: "updateAgentMemory",
  parameters: {
    type: Type.OBJECT,
    description: "Update the agent's memory with a new behavioral rule or instruction based on user feedback.",
    properties: {
      instruction: {
        type: Type.STRING,
        description: "The specific instruction or rule to remember (e.g., 'Always offer a 10% discount to new customers')."
      },
      reason: {
        type: Type.STRING,
        description: "The context or reason for this instruction."
      }
    },
    required: ["instruction", "reason"]
  }
};

const fetchWithRetry = async (fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && error.message?.includes('429')) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

export const getGeminiResponse = async (messages: Message[], agentName: string = "MAI Agent", trainingCommands: string[] = []) => {
  const savedGemini = localStorage.getItem('MAI_GEMINI');
  const customConfig = savedGemini ? JSON.parse(savedGemini) : null;
  
  // Use custom key from Connections tab, fallback to environment key (which updates when using Select Key)
  const activeApiKey = customConfig?.apiKey || process.env.GEMINI_API_KEY;
  
  let activeModel = customConfig?.model || "gemini-3-flash-preview";
  // Upgrade deprecated models automatically for existing users
  if (activeModel.includes('1.5') || activeModel === 'gemini-pro') {
    activeModel = 'gemini-3-flash-preview';
  }

  if (!activeApiKey) {
    throw new Error("Gemini API Key is missing. Please set it in the Connections tab.");
  }

  const ai = new GoogleGenAI({ apiKey: activeApiKey });

  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  const trainingContext = trainingCommands.length > 0 
    ? `\n\nFollow these specific behavioral instructions (Training Set):\n${trainingCommands.map((cmd, i) => `${i+1}. ${cmd}`).join('\n')}`
    : '';

  const callApi = () => ai.models.generateContent({
    model: activeModel,
    contents,
    config: {
      systemInstruction: `You are ${agentName}, a world-class AI sales agent. 
      Your primary channel is WhatsApp. When customers message you with requirements:
      1. Identify the specific parts or items they need.
      2. Use the 'createERPQutation' tool to generate a quote in the ERP system.
      3. Confirm to the customer that the quote has been generated and sent to their WhatsApp/Email.
      
      You have access to the ERP API (configured in Connections). 
      Be professional, efficient, and proactive in identifying upsell opportunities.
      
      Current Product Context:
      - CloudScale Enterprise: $5,000/mo
      - DataGuard Pro: $1,200/mo
      - AI Insights Dashboard: $800/mo
      - Hardware Parts: [P-100: Processor, P-200: Memory, P-300: Storage]${trainingContext}
      
      If the user gives you direct feedback on how to behave or what to remember, use the 'updateAgentMemory' tool to save that instruction.`,
      tools: [{ functionDeclarations: [createERPQutationDeclaration, updateAgentMemoryDeclaration] }]
    }
  });

  return await fetchWithRetry(callApi);
};
