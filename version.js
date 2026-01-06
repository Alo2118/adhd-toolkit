// Versione app - ATTENZIONE: Deve corrispondere a manifest.json
// Questo file può essere usato sia come script (importScripts) che caricato normalmente

const APP_VERSION = '1.0.3';

// Per service worker con importScripts
if (typeof self !== 'undefined' && typeof importScripts === 'function') {
  self.APP_VERSION = APP_VERSION;
}
