
import { BotpressConfig } from './types';

/**
 * Applies custom styling to the Botpress widget
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
      `;
      document.head.appendChild(styles);
    }
  };

  return applyCustomStyles;
};
