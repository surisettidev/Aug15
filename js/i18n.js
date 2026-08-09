/* ============================================================
   AzadiWish — Internationalization (i18n) Helper
   Applies translations to HTML elements with data-i18n attributes
============================================================ */

(function() {
  // Wait for DOM and language config to be ready
  function initI18n() {
    if (typeof t === 'undefined') {
      // t() function not loaded yet, retry
      setTimeout(initI18n, 100);
      return;
    }
    
    // Find all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var text = t(key);
      
      // Set text or HTML based on element type
      if (el.tagName === 'BUTTON' || el.tagName === 'LABEL' || el.tagName === 'P') {
        // For buttons/labels, only update text content, not inner HTML
        var span = el.querySelector('span');
        if (span) {
          // Button with icon - replace only the text part
          el.textContent = text;
          el.prepend(span); // Put icon back
        } else {
          el.textContent = text;
        }
      } else {
        // For other elements, set text
        el.textContent = text;
      }
    });
    
    console.info('[i18n] Translations applied for language:', getLanguage());
  }
  
  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
  } else {
    initI18n();
  }
})();
