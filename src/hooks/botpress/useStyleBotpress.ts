
import { BotpressConfig } from './types';

/**
 * Applies custom styling to the Botpress widget with improved accessibility
 */
export const useStyleBotpress = () => {
  const applyCustomStyles = (config: BotpressConfig) => {
    if (!document.getElementById('bp-custom-styles')) {
      const styles = document.createElement('style');
      styles.id = 'bp-custom-styles';
      styles.innerHTML = `
        #bp-web-widget-container {
          position: static !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          max-width: 100% !important;
          z-index: 999 !important;
        }
        .bp-widget-web {
          border-radius: 0.5rem !important;
          position: static !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          max-width: 100% !important;
        }
        .bp-widget-widget {
          position: static !important;
          width: 100% !important;
          height: 100% !important;
          max-height: 100% !important;
          max-width: 100% !important;
          border-radius: 0.5rem !important;
          box-shadow: none !important;
        }
        .bpw-layout {
          border-radius: 0.5rem !important;
          width: 100% !important;
          height: 100% !important;
        }
        .bpw-chat-container {
          height: calc(100% - 50px) !important;
        }
        .bpw-header-container {
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }
        .bpw-keyboard-single-choice {
          display: flex !important;
          flex-wrap: wrap !important;
        }
        .bpw-send-button, .bpw-button, .bpw-header {
          background-color: ${config.themeColor || "#3B82F6"} !important;
        }
        .bpw-composer {
          padding: 5px !important;
          border-top: thin solid #e4e4e4 !important;
        }
        .bpw-composer textarea {
          width: 100% !important;
          resize: none !important;
        }
        
        /* Accessibility improvements */
        .bpw-button {
          cursor: pointer !important;
          min-height: 36px !important; /* Larger click target */
          font-weight: 500 !important;
        }
        .bpw-button:focus-visible {
          outline: 2px solid #3B82F6 !important;
          outline-offset: 2px !important;
        }
        .bpw-button:hover {
          opacity: 0.9 !important;
          transition: opacity 0.2s ease !important;
        }
        .bpw-composer textarea {
          line-height: 1.5 !important;
          font-size: 16px !important; /* Prevent zooming on mobile */
        }
        .bpw-from-bot .bpw-chat-bubble {
          color: rgba(0, 0, 0, 0.85) !important; /* Ensure adequate color contrast */
        }
        .bpw-from-user .bpw-chat-bubble {
          color: white !important;
          font-weight: 500 !important;
        }
        /* Fix any focus visibility issues */
        .bpw-composer textarea:focus {
          outline: 2px solid #3B82F6 !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(styles);
    }
  };

  return applyCustomStyles;
};
