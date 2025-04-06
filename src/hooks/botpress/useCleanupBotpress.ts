
/**
 * Utility hook to safely remove Botpress elements from the DOM
 */
export const useCleanupBotpress = () => {
  const cleanupBotpress = () => {
    // First remove any existing Botpress elements from the DOM
    const widgetContainer = document.getElementById('bp-web-widget-container');
    if (widgetContainer) {
      try {
        // Safely check if the element is in the document before removing
        if (document.body.contains(widgetContainer)) {
          document.body.removeChild(widgetContainer);
        } else {
          console.log('Widget container not in document, no need to remove');
        }
      } catch (e) {
        console.log('Error removing widget container:', e);
      }
    }
    
    // Clear any custom styles related to Botpress
    const customStyles = document.querySelectorAll('style');
    customStyles.forEach(style => {
      if (style.innerHTML.includes('bp-web-widget-container') || 
          style.innerHTML.includes('bp-widget-web')) {
        try {
          if (style.parentNode && document.contains(style)) {
            style.parentNode.removeChild(style);
          }
        } catch (e) {
          console.log('Error removing style:', e);
        }
      }
    });
    
    // Remove script if it exists in document
    const botpressScripts = document.querySelectorAll('script[src*="botpress.cloud/webchat"]');
    botpressScripts.forEach(script => {
      try {
        if (script.parentNode && document.contains(script)) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        console.log('Error removing script:', e);
      }
    });
    
    // Clean up any global Botpress instances
    if (window.botpressWebChat) {
      try {
        // Attempt to use any available cleanup method
        if (typeof window.botpressWebChat.close === 'function') {
          window.botpressWebChat.close();
        }
      } catch (e) {
        console.log('Error closing Botpress webchat:', e);
      }
    }
  };

  return cleanupBotpress;
};
