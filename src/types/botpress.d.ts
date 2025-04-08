
// Type definitions for Botpress WebChat
declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void;
      onEvent?: (callback: (event: any) => void, events: string[]) => void;
      sendEvent?: (event: any) => void;
      toggle?: () => void;
      open?: () => void;
      close?: () => void;
      isOpened?: () => boolean;
    }
  }
}

export {};
