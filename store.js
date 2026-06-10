// Gestione dello stato e persistenza in LocalStorage + IndexedDB (media) + SyncEngine (remoto)

function sanitizeText(str) {
  if (typeof str !== 'string') return str;
  var cleaned = str;
  
  // Triple encoding
  cleaned = cleaned.replace(/ÃƒÂ /g, 'à');
  cleaned = cleaned.replace(/ÃƒÂ¨/g, 'è');
  cleaned = cleaned.replace(/ÃƒÂ©/g, 'é');
  cleaned = cleaned.replace(/ÃƒÂ¬/g, 'ì');
  cleaned = cleaned.replace(/ÃƒÂ²/g, 'ò');
  cleaned = cleaned.replace(/ÃƒÂ¹/g, 'ù');
  cleaned = cleaned.replace(/Ãƒâ‚¬/g, 'À');
  
  // Double encoding
  cleaned = cleaned.replace(/Ã /g, 'à');
  cleaned = cleaned.replace(/Ã¨/g, 'è');
  cleaned = cleaned.replace(/Ã©/g, 'é');
  cleaned = cleaned.replace(/Ã¬/g, 'ì');
  cleaned = cleaned.replace(/Ã²/g, 'ò');
  cleaned = cleaned.replace(/Ã¹/g, 'ù');
  cleaned = cleaned.replace(/Ã€/g, 'À');
  cleaned = cleaned.replace(/Ãˆ/g, 'È');
  cleaned = cleaned.replace(/Ã‰/g, 'É');
  cleaned = cleaned.replace(/ÃŒ/g, 'Ì');
  cleaned = cleaned.replace(/Ã’/g, 'Ò');
  cleaned = cleaned.replace(/Ã™/g, 'Ù');
  
  // Simboli e caratteri speciali
  cleaned = cleaned.replace(/Ã‚Â°/g, '°');
  cleaned = cleaned.replace(/Ã‚Â/g, ' ');
  cleaned = cleaned.replace(/Ã‚/g, '');
  cleaned = cleaned.replace(/Ã¢â‚¬â€/g, '—');
  cleaned = cleaned.replace(/Ã¢â€ â€™/g, '→');
  cleaned = cleaned.replace(/Ã¢Å“â€¦/g, '✅');
  cleaned = cleaned.replace(/Ã¢Å“â€/g, '✔');
  cleaned = cleaned.replace(/Ã¢Å“/g, '✔');
  cleaned = cleaned.replace(/Ã‚Â·/g, '·');
  
  return cleaned;
}

function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(function(item) { return sanitizeObject(item); });
  }
  if (typeof obj === 'object') {
    var sanitized = {};
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
}

const Store = {
  data: {
    // HACCP
    haccp_sanitation: [],
    haccp_temperature: [],
    haccp_chiller: [],
    haccp_hygiene: [],
    haccp_noncompliance: [],
    haccp_pest: [],
    worker_training: [],
    
    // Lavoratori
    workers: [
      { id: 'W-1', lastName: 'Rossi', firstName: 'Mario', role: 'Cuoco' }
    ],
    
    // Impostazioni
    settings: {
      applyModelNumber: true,
      modelTemperature: 'MOD-TEMP Rev.0',
      modelSanitation: 'MOD-SAN Rev.0',
      modelHygiene: 'MOD-HYG Rev.0',
      modelNonCompliance: 'MOD-NC Rev.0',
      modelStructure: 'MOD-STR Rev.0',
      modelGeneric: 'MOD-GEN Rev.0',
      structureFrequency: 'Settimanale',
      quick_actions: ['trace_incoming', 'trace_production', 'labels', 'haccp_nc'],
      model_configs: {
        'haccp_temperature': { model: 'MOD-TEMP Rev.0', frequency: 'Quotidiana' },
        'haccp_sanitation': { model: 'MOD-SAN Rev.0', frequency: 'Quotidiana' },
        'haccp_hygiene': { model: 'MOD-HYG Rev.0', frequency: 'Quotidiana' },
        'haccp_noncompliance': { model: 'MOD-NC Rev.0', frequency: "All'occorrenza" },
        'haccp_structure': { model: 'MOD-STR Rev.0', frequency: 'Settimanale' },
        'trace_incoming': { model: 'MOD-CAR Rev.0', frequency: "All'occorrenza" },
        'trace_production': { model: 'MOD-PROD Rev.0', frequency: "All'occorrenza" },
        'trace_suppliers': { model: 'MOD-FOR Rev.0', frequency: "All'occorrenza" },
        'haccp_maintenance': { model: 'MOD-MAN Rev.0', frequency: "All'occorrenza" }
      }
    },
    company: {
      ragioneSociale: '',
      nomeInsegna: '',
      sedeLegale: '',
      sedeOperativa: '',
      pIva: '',
      tipologiaAttivita: ''
    },
    haccp_structure: [],
    haccp_maintenance: [],
    haccp_temp_equipments: [],
    equipments: [
      { id: 'EQ-1', name: 'Affettatrice' },
      { id: 'EQ-2', name: 'Forno' }
    ],
    work_environments: [
      { id: 'ENV-1', name: 'Cucina' },
      { id: 'ENV-2', name: 'Magazzino' }
    ],
    detergents: [
      { id: 'DET-1', name: 'Sgrassatore Universale' },
      { id: 'DET-2', name: 'Disinfettante HACCP' }
    ],
    
    // Traceability
    suppliers: [
      { id: 'SUP-1', name: 'Mulino Rossi', contact: 'rossi@mulino.it' },
      { id: 'SUP-2', name: 'Latticini Verdi', contact: 'info@latticiniverdi.it' }
    ],
    ingredients: [
      { id: 'ING-1', name: 'Farina 00', unit: 'kg', allergenPresent: true, allergens: ['Cereali (Glutine)'] },
      { id: 'ING-2', name: 'Latte Intero', unit: 'L', allergenPresent: true, allergens: ['Latte'] },
      { id: 'ING-3', name: 'Zucchero', unit: 'kg', allergenPresent: false, allergens: [] }
    ],
    incoming_goods: [
      // Carichi
      { id: 'IN-1', date: new Date().toISOString(), ingredientId: 'ING-1', lotInterno: '1', lot: 'L-F-001', expiry: '2026-12-31', quantity: 50 },
      { id: 'IN-2', date: new Date().toISOString(), ingredientId: 'ING-2', lotInterno: '2', lot: 'L-L-002', expiry: '2026-05-15', quantity: 20 },
    ],
    recipes: [
      { 
        id: 'REC-1', 
        name: 'Crema Pasticcera', 
        ingredients: [
          { ingredientId: 'ING-2', quantity: 1 }, // 1L latte
          { ingredientId: 'ING-3', quantity: 0.3 } // 0.3kg zucchero
        ] 
      }
    ],
    productions: [
      // Produzioni completate
    ],
    clients: [],
    sales: [],
    light_ddt_history: []
  },

  init() {
    console.log("Store: Inizializzazione in corso...");
    try {
      if (typeof(Storage) === "undefined") {
        console.warn("Store: LocalStorage non supportato. I dati non verranno salvati.");
        return;
      }
      
      const saved = localStorage.getItem('haccp_app_data');
      if (saved) {
        console.log("Store: Dati trovati in localStorage.");
        let parsed = JSON.parse(saved);
        parsed = sanitizeObject(parsed);
        this.data = { ...this.data, ...parsed };
        
        if (this.data.ingredients && Array.isArray(this.data.ingredients)) {
          this.data.ingredients = this.data.ingredients.map(ing => {
            if (!ing.allergens || !Array.isArray(ing.allergens)) {
              if (ing.allergen === true) {
                ing.allergens = ing.allergenName ? [ing.allergenName] : ['Allergene'];
              } else {
                ing.allergens = [];
              }
            }
            ing.allergenPresent = ing.allergens.length > 0;
            delete ing.minStock;
            delete ing.supplier;
            delete ing.allergenName;
            delete ing.allergen;
            return ing;
          });
        }
        
        if (!this.data.settings) {
          this.data.settings = {
            applyModelNumber: true,
            modelTemperature: 'MOD-TEMP Rev.0',
            modelSanitation: 'MOD-SAN Rev.0',
            modelHygiene: 'MOD-HYG Rev.0',
            modelNonCompliance: 'MOD-NC Rev.0',
            modelStructure: 'MOD-STR Rev.0',
            modelGeneric: 'MOD-GEN Rev.0',
            structureFrequency: 'Settimanale'
          };
        }

        const tables = [
          'haccp_sanitation', 'haccp_temperature', 'haccp_chiller', 
          'haccp_hygiene', 'haccp_noncompliance', 'haccp_structure',
          'haccp_maintenance', 'haccp_pest', 'worker_training',
          'haccp_temp_equipments', 'workers', 'equipments', 
          'work_environments', 'detergents', 'suppliers', 
          'ingredients', 'incoming_goods', 'trace_shipments', 'recipes', 'productions',
          'clients', 'sales', 'light_ddt_history'
        ];
        
        tables.forEach(table => {
          if (!this.data[table]) this.data[table] = [];
        });

        if (!this.data.settings.modelStructure) this.data.settings.modelStructure = 'MOD-STR Rev.0';
        if (!this.data.settings.structureFrequency) this.data.settings.structureFrequency = 'Settimanale';
        if (!this.data.settings.quick_actions) {
          this.data.settings.quick_actions = ['trace_incoming', 'trace_production', 'labels', 'haccp_nc'];
        }
        if (!this.data.settings.model_configs) {
          this.data.settings.model_configs = {
            'haccp_temperature': { model: 'MOD-TEMP Rev.0', frequency: 'Quotidiana' },
            'haccp_sanitation': { model: 'MOD-SAN Rev.0', frequency: 'Quotidiana' },
            'haccp_hygiene': { model: 'MOD-HYG Rev.0', frequency: 'Quotidiana' },
            'haccp_noncompliance': { model: 'MOD-NC Rev.0', frequency: "All'occorrenza" },
            'haccp_structure': { model: 'MOD-STR Rev.0', frequency: 'Settimanale' },
            'trace_incoming': { model: 'MOD-CAR Rev.0', frequency: "All'occorrenza" },
            'trace_production': { model: 'MOD-PROD Rev.0', frequency: "All'occorrenza" },
            'trace_suppliers': { model: 'MOD-FOR Rev.0', frequency: "All'occorrenza" },
            'haccp_maintenance': { model: 'MOD-MAN Rev.0', frequency: "All'occorrenza" },
            'haccp_pest': { model: 'MOD-INF Rev.0', frequency: 'Mensile' },
            'worker_training': { model: 'MOD-FOR Rev.0', frequency: 'Annuale' }
          };
        }
        
        if (!this.data.company) {
          this.data.company = {
            ragioneSociale: '',
            nomeInsegna: '',
            sedeLegale: '',
            sedeOperativa: '',
            pIva: '',
            tipologiaAttivita: ''
          };
        }
        
      } else {
        console.log("Store: Nessun dato salvato, uso i default.");
        this.save();
      }
      console.log("Store: Inizializzazione completata con successo.");
    } catch (e) {
      console.error("Store: Errore inizializzazione:", e);
      alert("ERRORE CRITICO DATI: " + e.message);
    }
  },

  save() {
    try {
      if (typeof(Storage) !== "undefined") {
        this.data = sanitizeObject(this.data);
        localStorage.setItem('haccp_app_data', JSON.stringify(this.data));
      }
    } catch (e) {
      console.error("Store: Errore durante il salvataggio:", e);
    }
  },

  // Getters
  getTable(tableName) {
    return this.data[tableName] || [];
  },

  // Setters
  addItem(tableName, item) {
    if (!this.data[tableName]) this.data[tableName] = [];
    item.id = item.id || Date.now().toString() + Math.random().toString().slice(2,5);
    item.createdAt = new Date().toISOString();
    const sanitizedItem = sanitizeObject(item);
    this.data[tableName].push(sanitizedItem);
    this.save();
    // Notifica SyncEngine per eventuale sync remoto
    if (typeof SyncEngine !== 'undefined') SyncEngine.recordAdd(tableName, sanitizedItem);
    return sanitizedItem;
  },

  removeItem(tableName, id) {
    if (this.data[tableName]) {
      this.data[tableName] = this.data[tableName].filter(item => item.id !== id);
      this.save();
      // Notifica SyncEngine
      if (typeof SyncEngine !== 'undefined') SyncEngine.recordDelete(tableName, id);
    }
  },

  updateItem(tableName, id, updatedData) {
    if (this.data[tableName]) {
      const index = this.data[tableName].findIndex(item => item.id === id);
      if (index !== -1) {
        const sanitizedData = sanitizeObject(updatedData);
        this.data[tableName][index] = { ...this.data[tableName][index], ...sanitizedData };
        this.save();
        // Notifica SyncEngine
        if (typeof SyncEngine !== 'undefined') SyncEngine.recordUpdate(tableName, id, sanitizedData);
        return true;
      }
    }
    return false;
  },

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
  },

  // Computeds
  getInventory() {
    // Calculates current stock: Incoming Goods - Used in Productions
    const stock = {};
    
    // Sum incoming
    if (this.data.incoming_goods) {
      this.data.incoming_goods.forEach(inc => {
        if (!stock[inc.ingredientId]) stock[inc.ingredientId] = 0;
        stock[inc.ingredientId] += parseFloat(inc.quantity);
      });
    }

    // Subtract productions
    if (this.data.productions) {
      this.data.productions.forEach(prod => {
        if (prod.ingredients) {
          prod.ingredients.forEach(used => {
            if (!stock[used.ingredientId]) stock[used.ingredientId] = 0;
            stock[used.ingredientId] -= parseFloat(used.quantity);
          });
        }
      });
    }

    const ingredients = this.data.ingredients || [];
    return ingredients.map(ing => {
      const q = stock[ing.id] || 0;
      return {
        ingredientId: ing.id,
        name: ing.name,
        unit: ing.unit,
        quantity: q,
        allergenPresent: ing.allergenPresent || false
      };
    });
  },

  getHaccpStatus() {
    const today = new Date().toISOString().split('T')[0];
    const data = this.data || {};
    const settings = data.settings || {};
    const modelConfigs = settings.model_configs || {};
    
    const status = {
      allOk: true,
      missing: []
    };

    const getRecordsInPeriod = (records, freq) => {
      const now = new Date();
      now.setHours(0,0,0,0);
      return (records || []).filter(r => {
        const rDateStr = r.date || (r.createdAt && r.createdAt.split('T')[0]);
        if (!rDateStr) return false;
        const rDate = new Date(rDateStr);
        rDate.setHours(0,0,0,0);
        
        if (freq === 'Quotidiana') {
          return rDateStr === today;
        } else if (freq === 'Settimanale') {
          const lastWeek = new Date(now);
          lastWeek.setDate(now.getDate() - 7);
          return rDate >= lastWeek;
        } else if (freq === 'Mensile') {
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          return rDate >= lastMonth;
        } else if (freq === 'Ogni 2 mesi') {
          const last2Months = new Date(now);
          last2Months.setMonth(now.getMonth() - 2);
          return rDate >= last2Months;
        } else if (freq === 'Semestrale') {
          const last6Months = new Date(now);
          last6Months.setMonth(now.getMonth() - 6);
          return rDate >= last6Months;
        } else if (freq === 'Annual' || freq === 'Annuale') {
          const lastYear = new Date(now);
          lastYear.setFullYear(now.getFullYear() - 1);
          return rDate >= lastYear;
        }
        return false;
      });
    };

    const checkFrequency = (table, freq, label) => {
      if (!freq || freq === "All'occorrenza") return true;
      
      const records = data[table] || [];

      // 1. Registro Temperature
      if (table === 'haccp_temperature') {
        const equipments = data.haccp_temp_equipments || [];
        if (equipments.length === 0) return true;
        
        const periodRecords = getRecordsInPeriod(records, freq);
        const recordedEqIds = {};
        periodRecords.forEach(r => {
          if (r.equipmentId) recordedEqIds[r.equipmentId] = true;
        });
        
        const missingEquipments = equipments.filter(eq => !recordedEqIds[eq.id]);
        if (missingEquipments.length > 0) {
          status.missing.push(`Registro Temperature (Mancano ${missingEquipments.length} frigoriferi da registrare)`);
          status.allOk = false;
          return false;
        }
        return true;
      }

      // 2. Registro Sanificazione
      if (table === 'haccp_sanitation') {
        const environments = data.work_environments || [];
        const equipments = data.equipments || [];
        if (environments.length === 0 && equipments.length === 0) return true;
        
        const periodRecords = getRecordsInPeriod(records, freq);
        
        const cleanedEnvIds = {};
        const cleanedEqIds = {};
        
        periodRecords.forEach(r => {
          if (r.environmentsCleaned) {
            r.environmentsCleaned.forEach(e => { if (e.id) cleanedEnvIds[e.id] = true; });
          }
          if (r.equipmentCleaned) {
            r.equipmentCleaned.forEach(eq => { if (eq.id) cleanedEqIds[eq.id] = true; });
          }
        });
        
        const missingEnvs = environments.filter(env => !cleanedEnvIds[env.id]);
        const missingEqs = equipments.filter(eq => !cleanedEqIds[eq.id]);
        
        if (missingEnvs.length > 0 || missingEqs.length > 0) {
          let msg = 'Registro Sanificazione';
          if (missingEnvs.length > 0 && missingEqs.length > 0) {
            msg += ` (Mancano ${missingEnvs.length} aree e ${missingEqs.length} attrezzature)`;
          } else if (missingEnvs.length > 0) {
            msg += ` (Mancano ${missingEnvs.length} aree)`;
          } else {
            msg += ` (Mancano ${missingEqs.length} attrezzature)`;
          }
          status.missing.push(msg);
          status.allOk = false;
          return false;
        }
        return true;
      }

      // 3. Registro Igiene Personale
      if (table === 'haccp_hygiene') {
        const workers = data.workers || [];
        if (workers.length === 0) return true;
        
        const periodRecords = getRecordsInPeriod(records, freq);
        const recordedWorkerIds = {};
        
        periodRecords.forEach(r => {
          if (r.workerIds && Array.isArray(r.workerIds)) {
            r.workerIds.forEach(id => { recordedWorkerIds[id] = true; });
          }
        });
        
        const missingWorkers = workers.filter(w => !recordedWorkerIds[w.id]);
        if (missingWorkers.length > 0) {
          status.missing.push(`Registro Igiene Personale (Mancano ${missingWorkers.length} lavoratori da controllare)`);
          status.allOk = false;
          return false;
        }
        return true;
      }

      // 4. Ambienti e Strutture
      if (table === 'haccp_structure') {
        const environments = data.work_environments || [];
        if (environments.length === 0) return true;
        
        const periodRecords = getRecordsInPeriod(records, freq);
        const recordedEnvNames = {};
        
        periodRecords.forEach(r => {
          if (r.environment) recordedEnvNames[r.environment.toLowerCase().trim()] = true;
        });
        
        const missingEnvs = environments.filter(env => !recordedEnvNames[env.name.toLowerCase().trim()]);
        if (missingEnvs.length > 0) {
          status.missing.push(`Ambienti e Strutture (Mancano ${missingEnvs.length} ambienti da controllare)`);
          status.allOk = false;
          return false;
        }
        return true;
      }

      // 5. Altri moduli (non relazionali)
      const periodRecords = getRecordsInPeriod(records, freq);
      const isDone = periodRecords.length > 0;
      if (!isDone) {
        status.missing.push(`${label} (${freq})`);
        status.allOk = false;
      }
      return isDone;
    };

    // Check modules based on config
    const moduleLabels = {
      'haccp_temperature': 'Registro Temperature',
      'haccp_sanitation': 'Registro Sanificazione',
      'haccp_hygiene': 'Registro Igiene Personale',
      'haccp_structure': 'Ambienti e Strutture',
      'haccp_maintenance': 'Registro Manutenzione',
      'trace_incoming': 'Carico Merci',
      'trace_production': 'Produzione',
      'trace_suppliers': 'Elenco Fornitori'
    };

    for (const [table, config] of Object.entries(modelConfigs)) {
      if (moduleLabels[table]) {
        checkFrequency(table, config.frequency, moduleLabels[table]);
      }
    }

    return status;
  },

  getOpenNonCompliances() {
    if (!this.data || !this.data.haccp_noncompliance) return 0;
    return this.data.haccp_noncompliance.filter(nc => !nc.isClosed).length;
  }
};

Store.init();
