// Gestione dello stato e persistenza in LocalStorage

const Store = {
  data: {
    // HACCP
    haccp_sanitation: [],
    haccp_temperature: [],
    haccp_chiller: [],
    haccp_hygiene: [],
    haccp_noncompliance: [],
    
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
      { id: 'ING-1', name: 'Farina 00', supplier: 'SUP-1', allergen: true, allergenName: 'Glutine', unit: 'kg' },
      { id: 'ING-2', name: 'Latte Intero', supplier: 'SUP-2', allergen: true, allergenName: 'Latte', unit: 'L' },
      { id: 'ING-3', name: 'Zucchero', supplier: 'SUP-1', allergen: false, unit: 'kg' }
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
    ]
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
        const parsed = JSON.parse(saved);
        this.data = { ...this.data, ...parsed };
        
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
          'haccp_maintenance',
          'haccp_temp_equipments', 'workers', 'equipments', 
          'work_environments', 'detergents', 'suppliers', 
          'ingredients', 'incoming_goods', 'recipes', 'productions'
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
            'haccp_maintenance': { model: 'MOD-MAN Rev.0', frequency: "All'occorrenza" }
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
    item.id = item.id || Date.now().toString() + Math.random().toString().slice(2,5); // Più sicuro se ci sono più inserimenti ravvicinati
    item.createdAt = new Date().toISOString();
    this.data[tableName].push(item);
    this.save();
    return item;
  },

  removeItem(tableName, id) {
    if (this.data[tableName]) {
      this.data[tableName] = this.data[tableName].filter(item => item.id !== id);
      this.save();
    }
  },

  updateItem(tableName, id, updatedData) {
    if (this.data[tableName]) {
      const index = this.data[tableName].findIndex(item => item.id === id);
      if (index !== -1) {
        this.data[tableName][index] = { ...this.data[tableName][index], ...updatedData };
        this.save();
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
        allergens: ing.allergens || [],
        isLow: q < (ing.minStock || 5)
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

    const checkFrequency = (table, freq, label) => {
      if (!freq || freq === "All'occorrenza") return true;
      
      const records = data[table] || [];
      const now = new Date();
      let isDone = false;

      if (freq === 'Quotidiana') {
        isDone = records.some(r => {
          const rDate = r.date || (r.createdAt && r.createdAt.split('T')[0]);
          return rDate === today;
        });
      } else if (freq === 'Settimanale') {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        isDone = records.some(r => {
          const rDate = r.date || (r.createdAt && r.createdAt.split('T')[0]);
          return new Date(rDate) >= lastWeek;
        });
      } else if (freq === 'Mensile') {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        isDone = records.some(r => {
          const rDate = r.date || (r.createdAt && r.createdAt.split('T')[0]);
          return new Date(rDate) >= lastMonth;
        });
      } else if (freq === 'Ogni 2 mesi') {
        const last2Months = new Date();
        last2Months.setMonth(last2Months.getMonth() - 2);
        isDone = records.some(r => {
          const rDate = r.date || (r.createdAt && r.createdAt.split('T')[0]);
          return new Date(rDate) >= last2Months;
        });
      } else if (freq === 'Semestrale') {
        const last6Months = new Date();
        last6Months.setMonth(last6Months.getMonth() - 6);
        isDone = records.some(r => {
          const rDate = r.date || (r.createdAt && r.createdAt.split('T')[0]);
          return new Date(rDate) >= last6Months;
        });
      } else if (freq === 'Annual' || freq === 'Annuale') {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        isDone = records.some(r => {
          const rDate = r.date || (r.createdAt && r.createdAt.split('T')[0]);
          return new Date(rDate) >= lastYear;
        });
      }

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
