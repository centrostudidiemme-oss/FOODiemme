// ============================================================
// sync.js — Configurazione endpoint remoto e coda offline-first
//
// CONFIGURAZIONE RAPIDA:
//   1. Imposta REMOTE_ENABLED = true
//   2. Inserisci l'URL del tuo backend in REMOTE_BASE_URL
//   3. (Opzionale) Imposta UPLOAD_ENDPOINT per il cloud storage foto
//
// Finché REMOTE_ENABLED = false, l'app funziona al 100% offline
// con IndexedDB come storage primario. Quando la rete è disponibile
// e REMOTE_ENABLED = true, i dati vengono sincronizzati automaticamente.
// ============================================================

const SyncConfig = {

  // ── ① ABILITA / DISABILITA SYNC REMOTO ───────────────────────────
  REMOTE_ENABLED: false,   // <- Metti true quando hai un backend pronto

  // ── ② ENDPOINT DATABASE REMOTO ───────────────────────────────────
  // Esempi:
  //   Supabase  : 'https://<project>.supabase.co/rest/v1'
  //   Custom API: 'https://api.tuodominio.it/v1'
  REMOTE_BASE_URL: '',

  // Chiave di autenticazione (API Key, JWT Bearer, ecc.)
  AUTH_HEADER: 'Authorization',
  AUTH_VALUE:  '',   // es. 'Bearer eyJhbGc...'

  // ── ③ ENDPOINT CLOUD STORAGE FOTO ────────────────────────────────
  // Se vuoi upload diretto verso un bucket S3/Supabase Storage:
  UPLOAD_ENDPOINT: '',    // es. 'https://<project>.supabase.co/storage/v1/object/haccp-media'
  UPLOAD_BUCKET:   'haccp-media',

  // ── ④ TABELLE DA SINCRONIZZARE ────────────────────────────────────
  SYNC_TABLES: [
    'haccp_temperature', 'haccp_sanitation', 'haccp_hygiene',
    'haccp_noncompliance', 'haccp_structure', 'haccp_maintenance',
    'trace_shipments', 'incoming_goods', 'productions',
    'suppliers', 'ingredients', 'recipes', 'workers', 'equipments',
    'work_environments', 'detergents'
  ]
};

// ──────────────────────────────────────────────────────────────────
// SyncEngine — Gestione coda offline e sincronizzazione remota
// ──────────────────────────────────────────────────────────────────
const SyncEngine = (() => {

  const QUEUE_KEY = 'haccp_sync_queue'; // chiave localStorage per la coda pendente

  // ---------- Coda offline ----------

  function getQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); }
    catch { return []; }
  }

  function saveQueue(q) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  }

  function enqueue(operation) {
    // operation: { table, method: 'POST'|'PUT'|'DELETE', data, id, timestamp }
    const q = getQueue();
    q.push({ ...operation, timestamp: new Date().toISOString(), synced: false });
    saveQueue(q);
    console.log(`SyncEngine: operazione accodata [${operation.method} ${operation.table}]`);
  }

  // ---------- Upload immagine su cloud storage ----------

  async function uploadMedia(idbKey) {
    if (!SyncConfig.REMOTE_ENABLED || !SyncConfig.UPLOAD_ENDPOINT) return idbKey;
    try {
      const base64 = await MediaStore.get(idbKey);
      if (!base64 || !base64.startsWith('data:')) return idbKey;

      // Converte base64 → Blob
      const [header, data] = base64.split(',');
      const mime  = header.match(/:(.*?);/)[1];
      const bytes = atob(data);
      const arr   = new Uint8Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
      const blob  = new Blob([arr], { type: mime });
      const ext   = mime.split('/')[1] || 'jpg';
      const fname = idbKey.replace('idb://', '').replace(/[^a-z0-9_-]/gi, '_') + '.' + ext;

      const headers = {};
      if (SyncConfig.AUTH_VALUE) headers[SyncConfig.AUTH_HEADER] = SyncConfig.AUTH_VALUE;
      headers['Content-Type'] = mime;
      headers['x-upsert']     = 'true'; // Supabase Storage upsert

      const res = await fetch(`${SyncConfig.UPLOAD_ENDPOINT}/${fname}`, {
        method: 'POST', headers, body: blob
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        // Restituisce l'URL pubblico se disponibile, altrimenti costruisce un URL base
        const publicUrl = json.Key
          ? `${SyncConfig.REMOTE_BASE_URL.replace('/rest/v1', '')}/storage/v1/object/public/${SyncConfig.UPLOAD_BUCKET}/${fname}`
          : `${SyncConfig.UPLOAD_ENDPOINT}/${fname}`;
        console.log(`SyncEngine: immagine caricata → ${publicUrl}`);
        return publicUrl;
      }
    } catch (e) {
      console.warn('SyncEngine.uploadMedia error:', e);
    }
    return idbKey; // fallback: mantieni la chiave IDB locale
  }

  // ---------- Sincronizza un singolo record ----------

  async function pushRecord(operation) {
    const { table, method, data, id } = operation;
    const url = `${SyncConfig.REMOTE_BASE_URL}/${table}${method !== 'POST' ? `?id=eq.${id}` : ''}`;
    const headers = { 'Content-Type': 'application/json', 'Prefer': 'return=minimal' };
    if (SyncConfig.AUTH_VALUE) headers[SyncConfig.AUTH_HEADER] = SyncConfig.AUTH_VALUE;

    const res = await fetch(url, { method, headers, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(`HTTP ${res.status} per ${method} ${url}`);
  }

  // ---------- Processa tutta la coda pendente ----------

  async function flushQueue() {
    if (!SyncConfig.REMOTE_ENABLED || !SyncConfig.REMOTE_BASE_URL) return;
    if (!navigator.onLine) { console.log('SyncEngine: offline, coda in attesa.'); return; }

    const q = getQueue();
    const pending = q.filter(op => !op.synced);
    if (pending.length === 0) return;

    console.log(`SyncEngine: sincronizzazione di ${pending.length} operazioni pendenti...`);
    let successCount = 0;

    for (const op of pending) {
      try {
        // Prima carica eventuali media su cloud storage
        const dataToSync = { ...op.data };
        for (const [field, val] of Object.entries(dataToSync)) {
          if (MediaStore.isIdbKey(val)) {
            dataToSync[field] = await uploadMedia(val);
          } else if (Array.isArray(val)) {
            dataToSync[field] = await Promise.all(val.map(v => MediaStore.isIdbKey(v) ? uploadMedia(v) : v));
          }
        }
        await pushRecord({ ...op, data: dataToSync });
        op.synced = true;
        successCount++;
      } catch (e) {
        console.warn(`SyncEngine: errore sync [${op.method} ${op.table}]:`, e.message);
      }
    }

    saveQueue(q.filter(op => !op.synced)); // Rimuove le operazioni sincronizzate
    console.log(`SyncEngine: ${successCount}/${pending.length} operazioni sincronizzate.`);
  }

  // ---------- API pubblica per Store ----------

  function recordAdd(table, item) {
    if (!SyncConfig.REMOTE_ENABLED) return;
    enqueue({ table, method: 'POST', data: item, id: item.id });
  }

  function recordUpdate(table, id, data) {
    if (!SyncConfig.REMOTE_ENABLED) return;
    enqueue({ table, method: 'PATCH', data, id });
  }

  function recordDelete(table, id) {
    if (!SyncConfig.REMOTE_ENABLED) return;
    enqueue({ table, method: 'DELETE', data: {}, id });
  }

  // ---------- Avvio ----------

  function start() {
    // Sincronizza quando torna la connessione
    window.addEventListener('online', () => {
      console.log('SyncEngine: connessione ripristinata, avvio flush...');
      flushQueue();
    });
    // Sincronizza all'avvio se online
    if (navigator.onLine) setTimeout(flushQueue, 3000);

    // Icona stato connessione nell'header (opzionale UI feedback)
    _updateOnlineIndicator();
    window.addEventListener('online',  _updateOnlineIndicator);
    window.addEventListener('offline', _updateOnlineIndicator);
  }

  function _updateOnlineIndicator() {
    const indicator = document.getElementById('sync-status-indicator');
    if (!indicator) return;
    if (navigator.onLine) {
      indicator.title   = SyncConfig.REMOTE_ENABLED ? 'Online — Sync attivo' : 'Online — Modalità locale';
      indicator.style.color = SyncConfig.REMOTE_ENABLED ? 'var(--success-color)' : 'var(--text-secondary)';
    } else {
      indicator.title   = 'Offline — Dati salvati in locale';
      indicator.style.color = 'var(--warning-color, #f59e0b)';
    }
  }

  function getPendingCount() {
    return getQueue().filter(op => !op.synced).length;
  }

  return { start, recordAdd, recordUpdate, recordDelete, flushQueue, getPendingCount, uploadMedia };
})();
