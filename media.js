// ============================================================
// media.js — Layer di persistenza immagini via IndexedDB
// Sostituisce il salvataggio base64 inline in localStorage.
// IndexedDB supporta tipicamente 100 MB – 1 GB di storage,
// contro i ~5 MB di localStorage.
// ============================================================

const MediaStore = (() => {
  const DB_NAME    = 'haccp_media';
  const DB_VERSION = 1;
  const STORE_NAME = 'images';
  const PREFIX     = 'idb://'; // Marker nei record per distinguere le chiavi IDB da URL HTTP

  let _db = null;

  // ---- Apertura / Inizializzazione IndexedDB ----
  function open() {
    return new Promise((resolve, reject) => {
      if (_db) { resolve(_db); return; }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME); // chiave esplicita passata con put(value, key)
        }
      };
      req.onsuccess  = (e) => { _db = e.target.result; resolve(_db); };
      req.onerror    = (e) => reject(e.target.error);
    });
  }

  // ---- Salva una immagine (Blob o dataURL) e restituisce la sua chiave IDB ----
  async function save(dataUrlOrBlob, keyHint) {
    const db  = await open();
    const key = keyHint || (PREFIX.replace('://', '') + '_' + Date.now() + '_' + Math.random().toString(36).slice(2));
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).put(dataUrlOrBlob, key);
      req.onsuccess = () => resolve(PREFIX + key);  // restituisce "idb://KEY"
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  // ---- Legge un'immagine per chiave (accetta "idb://KEY" o URL HTTP) ----
  async function get(keyOrUrl) {
    if (!keyOrUrl) return null;
    // Se è un URL HTTP/HTTPS, restituiscilo direttamente (cloud storage futuro)
    if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://') || keyOrUrl.startsWith('data:')) {
      return keyOrUrl;
    }
    if (!keyOrUrl.startsWith(PREFIX)) return keyOrUrl; // fallback passthrough
    const key = keyOrUrl.slice(PREFIX.length);
    const db  = await open();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = (e) => resolve(e.target.result || null);
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  // ---- Elimina un'immagine per chiave ----
  async function remove(keyOrUrl) {
    if (!keyOrUrl || !keyOrUrl.startsWith(PREFIX)) return;
    const key = keyOrUrl.slice(PREFIX.length);
    const db  = await open();
    return new Promise((resolve, reject) => {
      const tx  = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).delete(key);
      req.onsuccess = () => resolve();
      req.onerror   = (e) => reject(e.target.error);
    });
  }

  // ---- Controlla se una stringa è una chiave IDB gestita da questo layer ----
  function isIdbKey(str) {
    return typeof str === 'string' && str.startsWith(PREFIX);
  }

  // ---- Risolve un'immagine e la imposta come src di un elemento <img> ----
  async function resolveImg(imgElement, keyOrUrl) {
    if (!imgElement || !keyOrUrl) return;
    try {
      const data = await get(keyOrUrl);
      if (data) imgElement.src = data;
    } catch (e) {
      console.warn('MediaStore.resolveImg error:', e);
    }
  }

  // ---- Risolve tutte le <img> nel DOM che hanno data-media-key ----
  async function resolveAll(container) {
    const imgs = (container || document).querySelectorAll('img[data-media-key]');
    const promises = [];
    imgs.forEach(img => {
      const key = img.getAttribute('data-media-key');
      if (key) promises.push(resolveImg(img, key));
    });
    await Promise.all(promises);
  }

  // ---- Elimina tutti i media non più referenziati da nessun record in Store ----
  async function garbageCollect() {
    try {
      const db       = await open();
      const allKeys  = await new Promise((res, rej) => {
        const tx  = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAllKeys();
        req.onsuccess = e => res(e.target.result);
        req.onerror   = e => rej(e.target.error);
      });

      // Raccoglie tutte le chiavi referenziate attivamente nei record
      const usedKeys = new Set();
      const data     = Store.data;
      const scan = (val) => {
        if (!val) return;
        if (typeof val === 'string' && val.startsWith(PREFIX)) {
          usedKeys.add(val.slice(PREFIX.length));
        } else if (Array.isArray(val)) {
          val.forEach(scan);
        } else if (typeof val === 'object') {
          Object.values(val).forEach(scan);
        }
      };
      scan(data);

      // Elimina le chiavi non utilizzate
      for (const key of allKeys) {
        if (!usedKeys.has(key)) {
          await remove(PREFIX + key);
        }
      }
      console.log(`MediaStore.garbageCollect: rimossi ${allKeys.length - usedKeys.size} file orfani.`);
    } catch (e) {
      console.warn('MediaStore.garbageCollect error:', e);
    }
  }

  // Espone l'API pubblica
  return { save, get, remove, isIdbKey, resolveImg, resolveAll, garbageCollect, PREFIX, open };
})();

// Inizializza il DB subito al caricamento della pagina
MediaStore.open().catch(e => console.error('MediaStore init error:', e));
