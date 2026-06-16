import { create } from 'zustand';

export interface WsMessage {
  type: string;
  data: unknown;
}

interface WsStore {
  connected: boolean;
  lastMessage: WsMessage | null;
  messages: WsMessage[];
  setConnected: (connected: boolean) => void;
  pushMessage: (msg: WsMessage) => void;
  clearMessages: () => void;
}

export const useWsStore = create<WsStore>((set) => ({
  connected: false,
  lastMessage: null,
  messages: [],

  setConnected: (connected) => set({ connected }),

  pushMessage: (msg) =>
    set((state) => ({
      lastMessage: msg,
      messages: [...state.messages.slice(-49), msg],
    })),

  clearMessages: () => set({ messages: [], lastMessage: null }),
}));
