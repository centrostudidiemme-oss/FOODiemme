// App UI & Routing Logic

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
  const errorMsg = `ERRORE GLOBALE: ${message} alla riga ${lineno}:${colno}`;
  console.error(errorMsg, error);
  
  const main = document.getElementById('main-content');
  if (main) {
    main.innerHTML = `<div class="card" style="border-left: 4px solid var(--danger-color); margin: 20px;">
      <h3 style="color: var(--danger-color);">Errore Critico</h3>
      <p>${message}</p>
      <p style="font-size: 11px; margin-top: 10px; color: var(--text-secondary);">File: ${source}:${lineno}</p>
      <button class="btn-primary" onclick="location.reload()" style="margin-top: 15px;">Ricarica App</button>
    </div>`;
  }
  return false;
};

const App = {
  currentView: 'dashboard',
  currentEqId: null,
  currentRecordId: null,
  tempRecipeIngredients: [],
  tempIncomingItems: [],
  tempShipmentPhoto: null,
  incomingItemCounter: 0,
  
  init() {
    try {
      console.log("App init started...");
      this.bindNavigation();
      if (!document.getElementById('main-content')) {
        console.error("ERRORE CRITICO: Elemento 'main-content' non trovato nel DOM.");
        return;
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      const viewParam = urlParams.get('view');
      const idParam = urlParams.get('id');

      if (viewParam && idParam) {
          if(viewParam === 'trace_incoming_detail') {
              this.currentRecordId = idParam;
              this.currentView = viewParam;
          }
      }
      
      console.log("Rendering initial view:", this.currentView);
      document.getElementById('page-title').innerText = 'Dashboard';
      this.renderView(this.currentView);
      
    } catch (err) {
      console.error("ERRORE INIZIALIZZAZIONE APP:", err);
      alert("ERRORE INIZIALIZZAZIONE APP: " + err.message);
    }
  },

  updateNav(view) {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === view) {
        item.classList.add('active');
      }
    });
  },

  bindNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        // Update active class
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Render new view
        const view = item.getAttribute('data-view');
        this.renderView(view);
      });
    });
  },

  renderView(view) {
    this.currentView = view;
    const main = document.getElementById('main-content');
    const title = document.getElementById('page-title');
    
    main.innerHTML = ''; // Clear current
    this.updateNav(view);
    
    try {
      switch(view) {
        case 'dashboard':
          title.innerText = 'Dashboard';
          main.innerHTML = this.views.dashboard();
          break;
      case 'haccp':
        title.innerText = 'HACCP';
        main.innerHTML = this.views.haccp();
        break;
      case 'haccp_temp':
        title.innerText = 'Temperature Frigoriferi';
        main.innerHTML = this.views.haccp_temp();
        break;
      case 'haccp_temp_detail':
        title.innerText = 'Dettaglio Attrezzatura';
        main.innerHTML = this.views.haccp_temp_detail(this.currentEqId);
        break;
      case 'haccp_sanitation':
        title.innerText = 'Sanificazione';
        main.innerHTML = this.views.haccp_sanitation();
        break;
      case 'haccp_hygiene':
        title.innerText = 'Igiene Personale';
        main.innerHTML = this.views.haccp_hygiene();
        break;
      case 'haccp_nc':
        title.innerText = 'Non Conformità';
        main.innerHTML = this.views.haccp_nc();
        break;
      case 'haccp_sanitation_detail':
        title.innerText = 'Dettaglio Sanificazione';
        main.innerHTML = this.views.haccp_sanitation_detail(this.currentRecordId);
        break;
      case 'haccp_hygiene_detail':
        title.innerText = 'Dettaglio Igiene';
        main.innerHTML = this.views.haccp_hygiene_detail(this.currentRecordId);
        break;
      case 'haccp_nc_detail':
        title.innerText = 'Dettaglio Non Conformità';
        main.innerHTML = this.views.haccp_nc_detail(this.currentRecordId);
        break;
      case 'traceability':
        title.innerText = 'Rintracciabilità';
        main.innerHTML = this.views.traceability();
        this.bindTraceabilityEvents();
        break;
      case 'labels':
        title.innerText = 'Etichettatura';
        main.innerHTML = this.views.labels();
        this.bindLabelEvents();
        break;
      case 'reports':
        title.innerText = 'Report & Stampe';
        main.innerHTML = this.views.reports();
        break;
      case 'settings':
        title.innerText = 'Impostazioni';
        main.innerHTML = this.views.settings();
        break;
      case 'settings_models':
        title.innerText = 'Modelli & Frequenze';
        main.innerHTML = this.views.settings_models();
        this.bindSettingsEvents();
        break;
      case 'settings_model_detail':
        title.innerText = 'Configurazione Modello';
        main.innerHTML = this.views.settings_model_detail(this.currentRecordId);
        break;
      case 'dashboard_quick_actions':
        title.innerText = 'Personalizza Azioni Rapide';
        main.innerHTML = this.views.dashboard_quick_actions();
        break;
      case 'haccp_maintenance':
        title.innerText = 'Manutenzione';
        main.innerHTML = this.views.haccp_maintenance();
        break;
      case 'haccp_maintenance_detail':
        title.innerText = 'Dettaglio Manutenzione';
        main.innerHTML = this.views.haccp_maintenance_detail(this.currentRecordId);
        break;
      case 'settings_equipments':
        title.innerText = 'Attrezzature';
        main.innerHTML = this.views.settings_equipments();
        break;
      case 'settings_environments':
        title.innerText = 'Ambienti di Lavoro';
        main.innerHTML = this.views.settings_environments();
        break;
      case 'settings_detergents':
        title.innerText = 'Detergenti';
        main.innerHTML = this.views.settings_detergents();
        break;
      case 'settings_workers':
        title.innerText = 'Lavoratori';
        main.innerHTML = this.views.settings_workers();
        break;
      case 'haccp_structure':
        title.innerText = 'Ambienti e Strutture';
        main.innerHTML = this.views.haccp_structure();
        break;
      case 'trace_recipes':
        title.innerText = 'Ricettario';
        main.innerHTML = this.views.trace_recipes();
        break;
      case 'trace_incoming':
        title.innerText = 'Carico Merci';
        main.innerHTML = this.views.trace_incoming();
        break;
      case 'trace_suppliers':
        title.innerText = 'Elenco Fornitori';
        main.innerHTML = this.views.trace_suppliers();
        break;
      case 'trace_supplier_detail':
        title.innerText = 'Dettaglio Fornitore';
        main.innerHTML = this.views.trace_supplier_detail(this.currentRecordId);
        break;
      case 'trace_incoming_detail':
        title.innerText = 'Dettaglio Carico';
        main.innerHTML = this.views.trace_incoming_detail(this.currentRecordId);
        this.generateIncomingQRCode(this.currentRecordId);
        break;
      case 'trace_ingredients':
        title.innerText = 'Ingredienti';
        main.innerHTML = this.views.trace_ingredients();
        break;
      case 'trace_ingredient_detail':
        title.innerText = 'Dettaglio Ingrediente';
        main.innerHTML = this.views.trace_ingredient_detail(this.currentRecordId);
        break;
      case 'trace_recipe_detail':
        title.innerText = 'Dettaglio Ricetta';
        main.innerHTML = this.views.trace_recipe_detail(this.currentRecordId);
        break;
      case 'trace_production':
        title.innerText = 'Produzione';
        main.innerHTML = this.views.trace_production();
        break;
      case 'trace_production_detail':
        title.innerText = 'Dettaglio Produzione';
        main.innerHTML = this.views.trace_production_detail(this.currentRecordId);
        break;
      case 'trace_archive':
        title.innerText = 'Archivio Documenti';
        main.innerHTML = this.views.trace_archive();
        break;
      case 'haccp_structure_detail':
        title.innerText = 'Dettaglio Controllo';
        main.innerHTML = this.views.haccp_structure_detail(this.currentRecordId);
        break;
      case 'settings_company':
        title.innerText = 'Anagrafica OSA';
        main.innerHTML = this.views.settings_company();
        this.bindCompanyEvents();
        break;
      case 'settings_maintenance':
        title.innerText = 'Manutenzione Sistema';
        main.innerHTML = this.views.settings_maintenance();
        break;
      }
    } catch (e) {
      console.error("Render Error:", e);
      main.innerHTML = `<div class="card" style="border-left: 4px solid var(--danger-color);">
        <h3 style="color: var(--danger-color);">Errore di Caricamento</h3>
        <p>Si è verificato un errore nel caricamento della vista <strong>${view}</strong>.</p>
        <p style="font-size: 11px; margin-top: 10px; color: var(--text-secondary);">${e.message}</p>
        <button class="btn-primary" onclick="location.reload()" style="margin-top: 15px;">Ricarica App</button>
      </div>`;
    }
  },

  goToTempDetail(id) {
    this.currentEqId = id;
    this.renderView('haccp_temp_detail');
  },

  goToSanitationDetail(id) {
    this.currentRecordId = id;
    this.renderView('haccp_sanitation_detail');
  },

  goToHygieneDetail(id) {
    this.currentRecordId = id;
    this.renderView('haccp_hygiene_detail');
  },

  goToNCDetail(id) {
    this.currentRecordId = id;
    this.renderView('haccp_nc_detail');
  },

  goToStructureDetail(id) {
    this.currentRecordId = id;
    this.renderView('haccp_structure_detail');
  },

  goToIngredientDetail(id) {
    this.currentRecordId = id;
    this.renderView('trace_ingredient_detail');
  },

  goToRecipeDetail(id) {
    this.currentRecordId = id;
    this.renderView('trace_recipe_detail');
  },

  goToSupplierDetail(id) {
    this.currentRecordId = id;
    this.renderView('trace_supplier_detail');
  },

  goToIncomingDetail(id) {
    this.currentRecordId = id;
    this.renderView('trace_incoming_detail');
  },

  goToProductionDetail(id) {
    this.currentRecordId = id;
    this.renderView('trace_production_detail');
  },

  goToMaintenanceDetail(id) {
    this.currentRecordId = id;
    this.renderView('haccp_maintenance_detail');
  },

  goToModelDetail(id) {
    this.currentRecordId = id;
    this.renderView('settings_model_detail');
  },

  toggleQuickAction(moduleId) {
    let qa = Store.data.settings.quick_actions || [];
    if (qa.includes(moduleId)) {
      qa = qa.filter(id => id !== moduleId);
    } else {
      qa.push(moduleId);
    }
    Store.data.settings.quick_actions = qa;
    Store.save();
    this.renderView('dashboard_quick_actions');
  },

  bulkRecordTemperatures() {
    const equipments = Store.data.haccp_temp_equipments || [];
    if (equipments.length === 0) {
      alert("Nessuna attrezzatura configurata.");
      return;
    }
    this.openModal('bulk-temp');
  },

  adjustIncomingStock(id) {
     const g = Store.data.incoming_goods.find(x => x.id === id);
     if(!g) return;
     
     const val = prompt('Inserisci la quantità persa o eliminata (es. prodotto scaduto, rovinato, ecc.):');
     if(val) {
         const num = parseFloat(val.replace(',','.'));
         if(isNaN(num) || num <= 0) {
            alert("Inserire un valore numerico valido maggiore di 0.");
            return;
         }
         if(!g.adjustments) g.adjustments = [];
         g.adjustments.push({ date: new Date().toISOString(), quantity: num, reason: 'Rettifica manuale' });
         
         const table = Store.data.incoming_goods;
         const index = table.findIndex(x => x.id === id);
         if(index > -1) {
             table[index] = g;
             Store.save();
         }
         this.renderView('trace_incoming_detail');
     }
  },

  generateIncomingQRCode(id) {
    setTimeout(() => {
        const container = document.getElementById('incoming-qrcode');
        if(container && window.QRCode) {
            container.innerHTML = '';
            const baseUrl = window.location.href.split('?')[0];
            const qrUrl = baseUrl + '?view=trace_incoming_detail&id=' + id;
            new QRCode(container, {
                text: qrUrl,
                width: 100,
                height: 100,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.L
            });
        }
    }, 50);
  },

  printIncomingLabel(id) {
      const g = Store.data.incoming_goods.find(x => x.id === id);
      if(!g) return;

      const printWindow = window.open('', '_blank');
      const baseUrl = window.location.href.split('?')[0];
      const qrUrl = baseUrl + '?view=trace_incoming_detail&id=' + id;
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Stampa Etichetta Lotto</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 20px; text-align: center; }
              .label-card { border: 2px solid #000; padding: 15px; width: 300px; margin: 0 auto; border-radius: 10px; }
              .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
              .info { font-size: 14px; margin-bottom: 5px; text-align: left;}
              .qr-container { margin-top: 15px; display: flex; justify-content: center; }
            </style>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
          </head>
          <body>
            <div class="label-card">
              <div class="title">${g.ingredientName}</div>
              <div class="info"><b>Lotto Interno:</b> ${g.lotInterno || 'N/D'}</div>
              <div class="info"><b>Fornitore:</b> ${g.supplierName}</div>
              <div class="info"><b>Data Carico:</b> ${new Date(g.date).toLocaleDateString()}</div>
              <div class="info"><b>Scadenza:</b> ${new Date(g.expiry).toLocaleDateString()}</div>
              <div class="qr-container" id="qr-print"></div>
            </div>
            <script>
              window.onload = function() {
                  new QRCode(document.getElementById("qr-print"), {
                      text: "${qrUrl}",
                      width: 120,
                      height: 120,
                      colorDark : "#000000",
                      colorLight : "#ffffff",
                      correctLevel : QRCode.CorrectLevel.L
                  });
                  setTimeout(() => {
                      window.print();
                      window.close();
                  }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
  },

  addSettingItem(tableName, inputId, viewName) {
    const input = document.getElementById(inputId);
    if(input && input.value.trim()) {
      Store.addItem(tableName, { name: input.value.trim() });
      input.value = '';
      this.renderView(viewName || 'settings');
    }
  },

  removeSettingItem(tableName, id, viewName) {
    if(confirm("Sei sicuro di voler eliminare questa voce?")) {
      Store.removeItem(tableName, id);
      this.renderView(viewName || this.currentView);
    }
  },

  removeItem(tableName, id, returnView) {
    if(confirm("Sei sicuro di voler eliminare questo record?")) {
      Store.removeItem(tableName, id);
      if (returnView) this.renderView(returnView);
      else this.renderView(this.currentView);
    }
  },

  deleteStructureRecord(id) {
    if(confirm("Sei sicuro di voler eliminare questo controllo?")) {
      Store.removeItem('haccp_structure', id);
      this.renderView('haccp_structure');
    }
  },

  editSettingItem(tableName, id, viewName) {
    const table = Store.getTable(tableName);
    const item = table.find(x => x.id === id);
    if (!item) return;
    
    const newName = prompt(`Modifica nome:`, item.name);
    if (newName && newName.trim()) {
      Store.updateItem(tableName, id, { name: newName.trim() });
      this.renderView(viewName);
    }
  },

  saveModelConfig(moduleId) {
    const model = document.getElementById('config-model-number').value.trim();
    const frequency = document.getElementById('config-frequency').value;
    
    if (!Store.data.settings.model_configs) Store.data.settings.model_configs = {};
    Store.data.settings.model_configs[moduleId] = { model, frequency };
    Store.save();
    
    alert("Configurazione salvata con successo.");
    this.renderView('settings_models');
  },

  setHygValue(idx, val) {
    document.getElementById(`hyg-item-${idx}`).value = val;
    const btnC = document.getElementById(`btn-hyg-${idx}-C`);
    const btnNC = document.getElementById(`btn-hyg-${idx}-NC`);
    const corrContainer = document.getElementById(`hyg-corr-container-${idx}`);
    
    if (val === 'C') {
      btnC.style.background = 'var(--success-color)';
      btnC.style.color = 'white';
      btnNC.style.background = 'white';
      btnNC.style.color = 'var(--text-primary)';
      if (corrContainer) corrContainer.style.display = 'none';
    } else {
      btnNC.style.background = 'var(--danger-color)';
      btnNC.style.color = 'white';
      btnC.style.background = 'white';
      btnC.style.color = 'var(--text-primary)';
      if (corrContainer) corrContainer.style.display = 'block';
    }
  },

  updateProductionIngredients(isEdit = false, savedIngredients = null) {
    const suffix = isEdit ? '-edit' : '';
    const recipeId = document.getElementById(isEdit ? 'edit-prod-recipe-id' : 'prod-recipe-id').value;
    const prodQty = parseFloat(document.getElementById(isEdit ? 'edit-prod-quantity' : 'prod-quantity').value) || 0;
    const section = document.getElementById(isEdit ? 'edit-prod-ingredients-section' : 'prod-ingredients-section');
    const list = document.getElementById(isEdit ? 'edit-prod-ingredients-list' : 'prod-ingredients-list');

    if (!recipeId || prodQty <= 0) {
      if(section) section.style.display = 'none';
      return;
    }

    const recipe = Store.data.recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    if(section) section.style.display = 'block';
    
    const baseWeight = parseFloat(recipe.totalWeight) || 1;
    const factor = prodQty / baseWeight;

    list.innerHTML = recipe.ingredients.map(ri => {
      const ing = Store.data.ingredients.find(i => i.id === ri.ingredientId);
      const needed = (parseFloat(ri.quantity) * factor).toFixed(3);
      
      const availableLots = (Store.data.incoming_goods || [])
        .filter(g => g.ingredientId === ri.ingredientId)
        .map(g => {
            const used = (Store.data.productions || []).reduce((acc, p) => {
                const ingUsed = (p.ingredients || []).find(i => i.incomingId === g.id);
                return acc + (ingUsed ? parseFloat(ingUsed.quantity) : 0);
            }, 0);
            return { ...g, availableQty: parseFloat(g.quantity) - used };
        })
        .filter(g => g.availableQty > 0 || (savedIngredients && savedIngredients.find(si => si.incomingId === g.id)))
        .sort((a,b) => new Date(a.expiry) - new Date(b.expiry));
      
      // FIFO: pre-seleziona la scadenza più ravvicinata se nuovo, o quello salvato se edit
      let selectedLotId = '';
      if (savedIngredients) {
        const saved = savedIngredients.find(si => si.ingredientId === ri.ingredientId);
        selectedLotId = saved ? saved.incomingId : '';
      }
      if (!selectedLotId && availableLots.length > 0) {
        selectedLotId = availableLots[0].id;
      }

      return `
        <div class="prod-ing-block" data-ing-id="${ri.ingredientId}" data-ing-name="${ing ? ing.name : '?'}" data-needed-qty="${needed}" style="background: white; padding: 12px; border-radius: 10px; border: 1px solid var(--border-color);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="cursor: pointer; color: var(--primary-color); font-weight: 600;" onclick="App.goToIncomingDetail('${selectedLotId}')">
              ${ing ? ing.name : 'Ingrediente sconosciuto'}
              ${ing && ing.allergens && ing.allergens.length > 0 ? `<br><span style="font-size: 10px; color: var(--danger-color);">Allergeni: ${ing.allergens.join(', ')}</span>` : ''}
              <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">(Clicca per foto Lotto/DDT)</div>
            </div>
            <div style="font-weight: 700; font-size: 13px;">${needed} ${ing ? ing.unit : ''}</div>
          </div>
          
          <div class="form-group" style="margin-bottom: 0;">
            <label style="font-size: 10px; margin-bottom: 4px;">Lotto Utilizzato (FIFO per scadenza):</label>
            <select class="prod-lot-select" style="font-size: 12px; padding: 5px;" onchange="this.closest('.prod-ing-block').querySelector('[onclick]').onclick = () => App.goToIncomingDetail(this.value)">
              <option value="">-- Scegli Lotto --</option>
              ${availableLots.map(l => `<option value="${l.id}" ${l.id === selectedLotId ? 'selected' : ''}>Lotto Int: ${l.lotInterno || 'N/D'} - Scad: ${App.formatDate(l.expiry)} (Giacenza: ${l.availableQty.toFixed(2)})</option>`).join('')}
            </select>
          </div>
        </div>
      `;
    }).join('');
  },

  setStructureValue(key, val) {
    const btnC = document.getElementById(`str-btn-c-${key}`);
    const btnNC = document.getElementById(`str-btn-nc-${key}`);
    const corrContainer = document.getElementById(`str-corr-container-${key}`);
    const hiddenVal = document.getElementById(`str-val-${key}`);
    
    if (val === 'C') {
      btnC.style.background = 'var(--success-color)';
      btnC.style.color = 'white';
      btnNC.style.background = 'white';
      btnNC.style.color = 'var(--text-primary)';
      if (corrContainer) corrContainer.style.display = 'none';
      if (hiddenVal) hiddenVal.value = 'C';
    } else {
      btnNC.style.background = 'var(--danger-color)';
      btnNC.style.color = 'white';
      btnC.style.background = 'white';
      btnC.style.color = 'var(--text-primary)';
      if (corrContainer) corrContainer.style.display = 'block';
      if (hiddenVal) hiddenVal.value = 'NC';
    }
  },

  addEnvironmentToControl() {
    const envName = document.getElementById('str-env-select').value;
    if(!envName) return;
    
    const container = document.getElementById('str-multi-container');
    const existing = container.querySelectorAll('.env-check-block');
    const envIndex = existing.length;
    
    const checkItems = [
      "Illuminazione", "Aerazione", "Rivestimenti", "Pavimentazione", "Intonaco",
      "Assenza Muffa", "Assenza di sporcizia pareti", "Stato di conservazione struttura",
      "Zanzariere", "Infissi"
    ];

    const block = document.createElement('div');
    block.className = 'env-check-block';
    block.setAttribute('data-env', envName);
    block.innerHTML = `
      <div style="background: white; border: 1px solid var(--border-color); border-radius: 12px; padding: 15px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
          <h4 style="color: var(--primary-color);"><i class="ph ph-house"></i> ${envName}</h4>
          <button type="button" onclick="this.closest('.env-check-block').remove()" style="width: auto; padding: 4px 8px; font-size: 12px; background: none; color: var(--danger-color); box-shadow: none;"><i class="ph ph-trash"></i> Rimuovi</button>
        </div>
        ${checkItems.map((item, i) => `
          <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.03);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 13px; font-weight: 500;">${item}</span>
              <div class="toggle-group" style="display: flex; background: #f4f4f4; border-radius: 8px; overflow: hidden;">
                <button type="button" id="str-btn-c-${envIndex}-${i}" onclick="App.setStructureValue('${envIndex}-${i}', 'C')" style="padding: 6px 12px; border: none; background: var(--success-color); color: white; cursor: pointer; font-weight: bold; font-size: 12px;">C</button>
                <button type="button" id="str-btn-nc-${envIndex}-${i}" onclick="App.setStructureValue('${envIndex}-${i}', 'NC')" style="padding: 6px 12px; border: none; background: white; color: var(--text-primary); cursor: pointer; font-weight: bold; font-size: 12px;">NC</button>
              </div>
            </div>
            <input type="hidden" class="item-status" data-label="${item}" id="str-val-${envIndex}-${i}" value="C" />
            <div id="str-corr-container-${envIndex}-${i}" style="display: none;">
              <input type="text" class="item-corr" id="str-corr-${envIndex}-${i}" placeholder="Azione correttiva..." style="width: 100%; padding: 6px; font-size: 12px; border: 1px solid var(--danger-color); border-radius: 4px;" />
            </div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(block);
    document.getElementById('str-env-select').value = '';
  },

  updateStructureFrequency(val) {
    Store.data.settings.structureFrequency = val;
    Store.save();
  },

  toggleSanChip(btn) {
    const isActive = btn.classList.toggle('active');
    if (isActive) {
      btn.style.background = 'var(--primary-color)';
      btn.style.color = 'white';
    } else {
      btn.style.background = 'white';
      btn.style.color = 'var(--text-primary)';
    }
  },

  clearHaccpData() {
    if (confirm("Vuoi cancellare tutte le registrazioni HACCP (Temperature, Sanificazioni, Igiene, Non Conformità, Strutture)?")) {
      if (confirm("Attenzione: anche i report PDF risulteranno vuoti. Procedere?")) {
        Store.data.haccp_temperature = [];
        Store.data.haccp_sanitation = [];
        Store.data.haccp_hygiene = [];
        Store.data.haccp_noncompliance = [];
        Store.data.haccp_structure = [];
        Store.save();
        alert("Dati HACCP cancellati con successo.");
        this.renderView('settings_maintenance');
      }
    }
  },

  clearTraceData() {
    if (confirm("Vuoi cancellare tutti i dati della TRACCIABILITÀ (Ricette, Carichi Merci, Produzioni, Fornitori, Ingredienti)?")) {
      if (confirm("Attenzione: perderai tutto l'inventario e lo storico lotti. Procedere?")) {
        Store.data.incoming_goods = [];
        Store.data.productions = [];
        Store.data.recipes = [];
        Store.data.ingredients = [];
        Store.data.suppliers = [];
        Store.save();
        alert("Dati Tracciabilità cancellati con successo.");
        this.renderView('settings_maintenance');
      }
    }
  },

  factoryReset() {
    if (confirm("ATTENZIONE! Questa operazione cancellerà ogni dato inserito nell'app, incluse attrezzature, lavoratori e configurazioni. Vuoi procedere?")) {
      if (confirm("ULTIMO AVVISO: L'app verrà riportata allo stato iniziale di fabbrica. Sei veramente sicuro?")) {
        Store.data.workers = [];
        Store.data.equipments = [];
        Store.data.work_environments = [];
        Store.data.detergents = [];
        Store.data.suppliers = [];
        Store.data.ingredients = [];
        Store.data.incoming_goods = [];
        Store.data.recipes = [];
        Store.data.productions = [];
        Store.data.haccp_temp_equipments = [];
        Store.data.haccp_temperature = [];
        Store.data.haccp_sanitation = [];
        Store.data.haccp_hygiene = [];
        Store.data.haccp_noncompliance = [];
        Store.data.haccp_structure = [];
        Store.save();
        alert("Reset effettuato. Ricarica l'applicazione.");
        window.location.reload();
      }
    }
  },
  views: {
    dashboard() {
      let debugInfo = "";
      try {
        debugInfo = "getHaccpStatus";
        const haccpStatus = Store.getHaccpStatus();
        
        debugInfo = "getOpenNonCompliances";
        const openNC = Store.getOpenNonCompliances();
        
        debugInfo = "getExpiring";
        const now = new Date();
        now.setHours(0,0,0,0);
        const nextWeek = new Date(now);
        nextWeek.setDate(now.getDate() + 7);

        // find stock efficiently
        const productions = Store.data.productions || [];
        const usageMap = {};
        
        productions.forEach(p => {
           if(p.ingredients) {
              p.ingredients.forEach(ing => {
                 if(ing.incomingId) {
                    usageMap[ing.incomingId] = (usageMap[ing.incomingId] || 0) + (parseFloat(ing.quantity) || 0);
                 }
              });
           }
        });

        const expiringIncoming = (Store.data.incoming_goods || []).map(g => {
            const totalUsed = usageMap[g.id] || 0;
            const totalLost = (g.adjustments || []).reduce((acc, a) => acc + (parseFloat(a.quantity) || 0), 0);
            let currentStock = parseFloat(g.quantity) - totalUsed - totalLost;
            if (isNaN(currentStock)) currentStock = 0;
            
            // Look up ingredient name
            const ingInfo = (Store.data.ingredients || []).find(i => i.id === g.ingredientId);
            return { ...g, currentStock, ingredientName: ingInfo ? ingInfo.name : 'Ingrediente sconosciuto' };
        }).filter(g => g.currentStock > 0.001);

        const expiringItems = expiringIncoming.filter(g => g.expiry && new Date(g.expiry) <= nextWeek).map(g => {
            const expDate = new Date(g.expiry);
            expDate.setHours(0,0,0,0);
            return {
               id: g.id,
               name: g.ingredientName,
               date: g.expiry,
               type: 'IN',
               isExpired: expDate < now,
               qty: g.currentStock,
               unit: g.unit
            };
        });

        // find productions
        const expiringProds = (Store.data.productions || []).filter(p => p.expiry && new Date(p.expiry) <= nextWeek).map(p => {
            const expDate = new Date(p.expiry);
            expDate.setHours(0,0,0,0);
            return {
               id: p.id,
               name: `Prod: ${p.recipeName}`,
               date: p.expiry,
               type: 'OUT',
               isExpired: expDate < now,
               qty: parseFloat(p.quantityProduced) || 0,
               unit: 'Pz/Kg'
            };
        });

        const allExpiring = [...expiringItems, ...expiringProds].sort((a,b) => new Date(a.date) - new Date(b.date));

        const company = Store.data.company || {};

        return `
          <div style="margin-bottom: 24px; padding: 0 5px;">
            <h1 style="margin-bottom: 5px; color: var(--primary-color); font-size: 32px; letter-spacing: -1px;">${company.nomeInsegna || 'Il Mio OSA'}</h1>
            <p style="font-weight: 600; color: var(--text-secondary); text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">${company.ragioneSociale || 'Configura anagrafica in Impostazioni'}</p>
          </div>

          <div class="dashboard-grid">
            <div class="widget ${haccpStatus.allOk ? 'ok' : 'alert'}" style="border: 2px solid ${haccpStatus.allOk ? 'transparent' : 'var(--danger-color)'};">
              <div class="widget-icon ${haccpStatus.allOk ? 'bg-green' : 'bg-red'}">
                <i class="ph-fill ph-shield-check"></i>
              </div>
              <div>
                <div class="widget-value" style="color: ${haccpStatus.allOk ? 'var(--success-color)' : 'var(--danger-color)'}">
                  ${haccpStatus.allOk ? 'OK' : 'Alert'}
                </div>
                <div class="widget-label">Stato HACCP Odierno</div>
              </div>
            </div>

            <div class="widget ${openNC > 0 ? 'alert' : 'ok'}" onclick="App.renderView('haccp_nc')" style="cursor: pointer; border: 2px solid ${openNC > 0 ? 'var(--danger-color)' : 'transparent'};">
              <div class="widget-icon ${openNC > 0 ? 'bg-red' : 'bg-green'}">
                <i class="ph-fill ph-warning-circle"></i>
              </div>
              <div>
                <div class="widget-value" style="color: ${openNC > 0 ? 'var(--danger-color)' : 'var(--success-color)'};">${openNC}</div>
                <div class="widget-label">NON Conformità Aperte</div>
              </div>
            </div>
          </div>

          ${haccpStatus.missing && haccpStatus.missing.length > 0 ? `
          <div class="card" style="border-left: 4px solid var(--danger-color);">
            <h3 style="color: var(--danger-color);"><i class="ph-fill ph-warning-circle"></i> Registrazioni Mancanti</h3>
            <ul style="padding-left: 20px; margin-top: 10px; color: var(--danger-color); font-weight: 500; font-size: 14px;">
              ${haccpStatus.missing.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="card">
            <h3><i class="ph-fill ph-calendar-blank"></i> Lotti in Scadenza / Scaduti</h3>
            ${allExpiring.length > 0 ? allExpiring.map(item => `
              <div class="list-item" style="cursor: pointer; border-left: 4px solid ${item.isExpired ? 'var(--danger-color)' : 'var(--warning-color)'}; padding-left: 12px;" onclick="App.${item.type === 'IN' ? 'goToIncomingDetail' : 'goToProductionDetail'}('${item.id}')">
                <div style="flex: 1;">
                  <div class="item-title">${item.name}</div>
                  <div class="item-subtitle" style="color: ${item.isExpired ? 'var(--danger-color)' : 'var(--warning-color)'}; font-weight: bold;">
                    ${item.isExpired ? 'SCADUTO' : 'In scadenza'} il ${new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
                <div style="font-weight: 700;">${item.qty.toFixed(2)} ${item.unit} <i class="ph ph-caret-right" style="color: var(--text-secondary); margin-left: 8px;"></i></div>
              </div>
            `).join('') : `
              <div style="text-align: center; padding: 20px 0; color: var(--success-color);">
                <i class="ph-fill ph-check-circle" style="font-size: 32px; margin-bottom: 8px;"></i>
                <p>Nessun lotto in scadenza a breve</p>
              </div>
            `}
          </div>

          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
               <h3>Azioni Rapide</h3>
               <div style="display: flex; gap: 8px;">
                 <button class="btn-icon" onclick="App.renderView('dashboard_quick_actions')" style="background: var(--bg-body); color: var(--primary-color); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-color);">
                   <i class="ph ph-minus" style="font-size: 16px;"></i>
                 </button>
                 <button class="btn-icon" onclick="App.renderView('dashboard_quick_actions')" style="background: var(--primary-color); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none;">
                   <i class="ph ph-plus" style="font-size: 16px;"></i>
                 </button>
               </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
              ${(Store.data.settings.quick_actions || []).map(actionId => {
                const actionMap = {
                  'trace_incoming': { label: 'Carico Merci', icon: 'ph-truck', color: 'var(--primary-color)', onclick: "App.openModal('incoming')" },
                  'trace_production': { label: 'Produzione', icon: 'ph-cooking-pot', color: '#10b981', onclick: "App.openModal('production')" },
                  'labels': { label: 'Etichette Produzioni', icon: 'ph-tag', color: '#6366f1', onclick: "App.renderView('labels')" },
                  'haccp_nc': { label: 'Segnala NC', icon: 'ph-warning', color: '#ef4444', onclick: "App.openModal('noncompliance')" },
                  'haccp_temp': { label: 'Temperature', icon: 'ph-thermometer-cold', color: '#3b82f6', onclick: "App.renderView('haccp_temp')" },
                  'haccp_sanitation': { label: 'Sanificazione', icon: 'ph-sparkle', color: '#10b981', onclick: "App.renderView('haccp_sanitation')" },
                  'haccp_hygiene': { label: 'Igiene', icon: 'ph-users', color: '#f59e0b', onclick: "App.renderView('haccp_hygiene')" },
                  'haccp_structure': { label: 'Strutture', icon: 'ph-house-line', color: '#6366f1', onclick: "App.renderView('haccp_structure')" },
                  'haccp_maintenance': { label: 'Manutenzione', icon: 'ph-wrench', color: '#64748b', onclick: "App.renderView('haccp_maintenance')" },
                  'trace_recipes': { label: 'Ricettario', icon: 'ph-book-bookmark', color: '#3b82f6', onclick: "App.renderView('trace_recipes')" },
                  'trace_suppliers': { label: 'Fornitori', icon: 'ph-address-book', color: '#f59e0b', onclick: "App.renderView('trace_suppliers')" },
                  'trace_ingredients': { label: 'Magazzino', icon: 'ph-warehouse', color: '#3b82f6', onclick: "App.renderView('trace_ingredients')" }
                };
                const action = actionMap[actionId];
                if (!action) return '';
                return `
                  <button class="btn-primary" style="padding: 15px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; font-weight: bold; background-color: ${action.color};" onclick="${action.onclick}">
                    <i class="ph ${action.icon}" style="font-size: 24px;"></i> ${action.label}
                  </button>
                `;
              }).join('')}
              ${(Store.data.settings.quick_actions || []).length === 0 ? '<p style="grid-column: span 2; text-align: center; color: var(--text-secondary); font-size: 13px; padding: 10px;">Nessuna azione rapida configurata. Clicca (+) per aggiungerne.</p>' : ''}
            </div>
          </div>
        `;
      } catch (err) {
        return `<div class="card alert"><h3>Errore Dashboard</h3><p>Fase: ${debugInfo}</p><p>${err.message}</p></div>`;
      }
    },

    haccp() {
      return `
        <div class="dashboard-grid">
          <div class="widget" onclick="App.renderView('haccp_temp')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-blue" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-thermometer-cold"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Temperature</div>
          </div>
          <div class="widget" onclick="App.renderView('haccp_sanitation')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-green" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-sparkle"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Sanificazione</div>
          </div>
          <div class="widget" onclick="App.renderView('haccp_hygiene')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-orange" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-users"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Igiene Personale</div>
          </div>
          <div class="widget" onclick="App.renderView('haccp_nc')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-red" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-warning-circle"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Non Conformità</div>
          </div>
          <div class="widget" onclick="App.renderView('haccp_structure')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon" style="background: #6366f1; width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-house-line"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Ambienti</div>
          </div>
          <div class="widget" onclick="App.renderView('haccp_maintenance')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon" style="background: #64748b; width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-wrench"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Manutenzione</div>
          </div>
        </div>
      `;
    },

    haccp_maintenance() {
      const records = Store.data.haccp_maintenance || [];
      const filtered = records.sort((a,b) => new Date(b.date) - new Date(a.date));
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-wrench"></i> Registro Manutenzione</h3>
          <div style="margin-top: 16px; margin-bottom: 20px;">
            <button class="btn-primary" style="width: 100%;" onclick="App.openModal('maintenance')"><i class="ph ph-plus"></i> Nuova Manutenzione</button>
          </div>
          <div class="list-container">
            ${filtered.length > 0 ? filtered.map(r => `
              <div class="list-item" style="padding: 12px; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="App.goToMaintenanceDetail('${r.id}')">
                <div style="flex: 1;">
                  <div class="item-title">${App.formatDate(r.date)} - ${r.subject}</div>
                  <div class="item-subtitle" style="font-size: 11px;">${r.type === 'Ordinary' ? 'Ordinaria (Interna)' : 'Straordinaria (Esterna: ' + (r.externalCompany || 'N/D') + ')'}</div>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
              </div>
            `).join('') : '<p style="text-align: center; color: var(--text-secondary);">Nessuna manutenzione registrata.</p>'}
          </div>
        </div>
      `;
    },

    haccp_maintenance_detail(id) {
      const r = Store.data.haccp_maintenance.find(x => x.id === id);
      if(!r) return `<div class="card"><p>Manutenzione non trovata.</p></div>`;

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp_maintenance')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <div style="background: var(--bg-body); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color);">
            <h2 style="color: var(--primary-color); margin-bottom: 10px;">Dettaglio Manutenzione</h2>
            <p><strong>Data:</strong> ${App.formatDate(r.date)}</p>
            <p><strong>Soggetto:</strong> ${r.subject}</p>
            <p><strong>Tipo:</strong> ${r.type === 'Ordinary' ? 'Ordinaria (Interna)' : 'Straordinaria (Esterna)'}</p>
            ${r.type === 'Extraordinary' ? `<p><strong>Ditta Esterna:</strong> ${r.externalCompany || 'N/D'}</p>` : ''}
            <p><strong>Responsabile:</strong> ${r.operator}</p>
            <div style="margin-top: 15px; padding: 10px; background: white; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
              <strong>Descrizione:</strong>
              <p style="margin-top: 5px;">${r.description || 'Nessuna descrizione'}</p>
            </div>
          </div>
          <div style="display: flex; gap: 10px; margin-top: 24px;">
            <button class="btn-danger" style="flex: 1;" onclick="App.removeItem('haccp_maintenance', '${r.id}', 'haccp_maintenance')"><i class="ph ph-trash"></i> Elimina</button>
          </div>
        </div>
      `;
    },

    dashboard_quick_actions() {
      const qa = Store.data.settings.quick_actions || [];
      const modules = [
        { id: 'haccp_temp', label: 'Temperature', section: 'HACCP' },
        { id: 'haccp_sanitation', label: 'Sanificazione', section: 'HACCP' },
        { id: 'haccp_hygiene', label: 'Igiene Personale', section: 'HACCP' },
        { id: 'haccp_nc', label: 'Non Conformità', section: 'HACCP' },
        { id: 'haccp_structure', label: 'Ambienti', section: 'HACCP' },
        { id: 'haccp_maintenance', label: 'Manutenzione', section: 'HACCP' },
        { id: 'trace_incoming', label: 'Carico Merci', section: 'Tracciabilità' },
        { id: 'trace_production', label: 'Produzione', section: 'Tracciabilità' },
        { id: 'trace_recipes', label: 'Ricettario', section: 'Tracciabilità' },
        { id: 'trace_suppliers', label: 'Fornitori', section: 'Tracciabilità' },
        { id: 'trace_ingredients', label: 'Magazzino', section: 'Tracciabilità' },
        { id: 'labels', label: 'Etichette Produzioni', section: 'Tracciabilità' }
      ];

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('dashboard')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph ph-list-plus"></i> Personalizza Azioni Rapide</h3>
          <p style="margin-bottom: 20px;">Seleziona i moduli da visualizzare nella sezione Azioni Rapide della Dashboard.</p>
          
          <div class="list-container">
            ${modules.map(m => `
              <div class="list-item" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                <div>
                  <div style="font-weight: 600;">${m.label}</div>
                  <div style="font-size: 11px; color: var(--text-secondary);">${m.section}</div>
                </div>
                <button class="${qa.includes(m.id) ? 'btn-danger' : 'btn-primary'}" style="width: auto; padding: 5px 12px; font-size: 12px;" onclick="App.toggleQuickAction('${m.id}')">
                  <i class="ph ${qa.includes(m.id) ? 'ph-minus' : 'ph-plus'}"></i> ${qa.includes(m.id) ? 'Rimuovi' : 'Aggiungi'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    haccp_temp() {
      const tempEquipments = Store.data.haccp_temp_equipments || [];
      const records = Store.data.haccp_temperature || [];

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-thermometer-cold"></i> Temperature Frigoriferi</h3>
          
          <div style="margin-top: 16px; margin-bottom: 16px; display: flex; gap: 10px;">
             <button class="btn-primary" style="flex: 1;" onclick="App.openModal('new-temp-equipment')"><i class="ph ph-plus"></i> Nuova Attrezzatura</button>
             <button class="btn-secondary" style="flex: 1; background: var(--primary-color); color: white;" onclick="App.bulkRecordTemperatures()"><i class="ph ph-check-square"></i> Registra Tutto</button>
          </div>
          
          ${tempEquipments.length > 0 ? tempEquipments.map(eq => {
            const eqRecords = records.filter(r => r.equipmentId === eq.id).sort((a,b) => new Date(b.date + 'T' + (b.time||'00:00')) - new Date(a.date + 'T' + (a.time||'00:00')));
            const lastRec = eqRecords.length > 0 ? eqRecords[0] : null;
            const lastRecStr = lastRec ? `${App.formatDate(lastRec.date)} ${lastRec.time||''} - ${lastRec.temp !== undefined ? lastRec.temp+'°C' : lastRec.status}` : 'Nessuna registrazione';

            return `
            <div class="list-item" style="cursor: pointer; padding: 0; margin-bottom: 10px; background: white; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; align-items: stretch; overflow: hidden;">
              <div style="flex: 1; padding: 15px;" onclick="App.goToTempDetail('${eq.id}')">
                <div class="item-title" style="font-weight: 600; font-size: 16px;">${eq.name} <span style="font-size: 11px; font-weight: normal; background: var(--bg-body); padding: 2px 6px; border-radius: 4px; color: var(--text-secondary); margin-left: 5px;">${eq.type}</span></div>
                <div class="item-subtitle" style="margin-top: 5px;"><i class="ph ph-map-pin"></i> ${eq.locationName || 'N/D'}</div>
                <div class="item-subtitle" style="margin-top: 4px; color: var(--text-primary);">Ultima: <strong>${lastRecStr}</strong></div>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; padding-right: 15px;">
                <i class="ph ph-caret-right" style="color: var(--text-secondary); font-size: 20px;" onclick="App.goToTempDetail('${eq.id}')"></i>
                <div style="width: 1px; height: 30px; background: var(--border-color); margin: 0 5px;"></div>
                <button class="btn-icon" onclick="event.stopPropagation(); App.removeSettingItem('haccp_temp_equipments', '${eq.id}', 'haccp_temp')" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 5px; display: flex; align-items: center; justify-content: center;">
                  <i class="ph-bold ph-trash" style="font-size: 20px;"></i>
                </button>
              </div>
            </div>
          `}).join('') : '<p style="font-size: 13px; font-style: italic; color: var(--text-secondary);">Nessuna attrezzatura configurata.</p>'}
        </div>
      `;
    },

    haccp_temp_detail(eqId) {
      const eq = Store.data.haccp_temp_equipments.find(e => e.id === eqId);
      if(!eq) return '';
      
      const records = Store.data.haccp_temperature.filter(r => r.equipmentId === eqId);
      
      const now = new Date();
      const currentMonth = now.toISOString().slice(0,7);
      const fromDate = App.tempFilterFrom || currentMonth + '-01';
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const toDate = App.tempFilterTo || endOfMonth.toISOString().split('T')[0];

      const filteredRecords = records.filter(r => r.date >= fromDate && r.date <= toDate).sort((a,b) => new Date(b.date + 'T' + (b.time||'00:00')) - new Date(a.date + 'T' + (a.time||'00:00')));

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp_temp')"><i class="ph ph-arrow-left"></i> Indietro</button>
          
          <div style="background: var(--bg-body); padding: 15px; border-radius: var(--radius-md); margin-bottom: 20px; border: 1px solid var(--border-color);">
            <h2 style="margin-bottom: 10px; color: var(--primary-color);">${eq.name}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
              <div><strong>Tipologia:</strong> ${eq.type}</div>
              <div><strong>Ubicazione:</strong> ${eq.locationName || 'N/D'}</div>
              <div><strong>Range Min:</strong> ${eq.minTemp}°C</div>
              <div><strong>Range Max:</strong> ${eq.maxTemp}°C</div>
            </div>
          </div>
          
          <div style="margin-bottom: 20px; display: flex; gap: 10px;">
             <button class="btn-primary" style="flex: 1;" onclick="App.openModal('check-temperature', '${eq.id}')"><i class="ph ph-thermometer"></i> Registra Controllo</button>
             <button class="btn-secondary" style="flex: 1;" onclick="App.openModal('filter-temp', '${eq.id}')"><i class="ph ph-calendar"></i> Filtra Periodo</button>
          </div>
          
          <h4 style="margin-bottom: 10px;">Rilievi dal ${App.formatDate(fromDate)} al ${App.formatDate(toDate)}</h4>
          <div class="list-container">
            ${filteredRecords.length > 0 ? filteredRecords.map(r => `
              <div class="list-item" style="padding: 12px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: white; margin-bottom: 5px; border-radius: 8px;">
                <div style="flex: 1;">
                  <div class="item-title" style="font-weight: 600;">${App.formatDate(r.date)} <span style="font-weight: normal; color: var(--text-secondary); margin-left: 5px;">${r.time||''}</span></div>
                  <div class="item-subtitle" style="color: ${r.status === 'CONFORME' ? 'var(--success-color)' : (r.status === 'GIUSTIFICATO' ? 'var(--warning-color)' : 'var(--danger-color)')}; font-weight: 500;">${r.status}</div>
                  <div class="item-subtitle" style="font-size: 11px; margin-top: 4px;"><i class="ph ph-user"></i> Operatore: ${r.operator || 'N/D'}</div>
                  ${r.correctiveAction ? `<div class="item-subtitle" style="font-size: 11px; color: var(--danger-color); font-style: italic;">Az. Correttiva: ${r.correctiveAction}</div>` : ''}
                  ${r.justification ? `<div class="item-subtitle" style="font-size: 11px; color: var(--warning-color); font-weight: 500;">Motivo: ${r.justification}</div>` : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 20px;">
                  <div style="font-weight: 800; font-size: 18px; color: var(--text-primary);">
                    ${r.temp !== undefined ? r.temp+'°C' : '-'}
                  </div>
                  <div style="display: flex; gap: 8px;">
                    <button class="btn-icon" onclick="App.openModal('edit-temperature', '${r.id}')" style="background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 5px;">
                      <i class="ph-bold ph-pencil" style="font-size: 20px;"></i>
                    </button>
                    <button class="btn-icon" onclick="App.removeSettingItem('haccp_temperature', '${r.id}', 'haccp_temp_detail')" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 5px;">
                      <i class="ph-bold ph-trash" style="font-size: 20px;"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('') : '<p style="text-align: center; padding: 20px; color: var(--text-secondary);">Nessun rilievo trovato per questo periodo.</p>'}
          </div>
        </div>
      `;
    },

    haccp_sanitation() {
      const records = Store.data.haccp_sanitation || [];
      const now = new Date();
      const currentMonth = now.toISOString().slice(0,7);
      const fromDate = App.sanFilterFrom || currentMonth + '-01';
      const toDate = App.sanFilterTo || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const filtered = records.filter(r => r.date >= fromDate && r.date <= toDate).sort((a,b) => new Date(b.date) - new Date(a.date));

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-sparkle"></i> Registro Sanificazione</h3>
          
          <div style="margin-top: 16px; margin-bottom: 20px; display: flex; gap: 10px;">
             <button class="btn-primary" style="flex: 1;" onclick="App.openModal('sanitation')"><i class="ph ph-plus"></i> Nuova Sanificazione</button>
             <button class="btn-secondary" style="flex: 1;" onclick="App.openModal('filter-san')"><i class="ph ph-calendar"></i> Filtra</button>
          </div>

          <h4 style="margin-bottom: 10px;">Attività dal ${App.formatDate(fromDate)} al ${App.formatDate(toDate)}</h4>
          <div class="list-container">
            ${filtered.length > 0 ? filtered.map(r => `
              <div class="list-item" style="padding: 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: stretch; background: white; margin-bottom: 5px; border-radius: 8px; cursor: pointer; overflow: hidden;">
                <div style="flex: 1; padding: 12px;" onclick="App.goToSanitationDetail('${r.id}')">
                  <div class="item-title" style="font-weight: 600;">${App.formatDate(r.date)}</div>
                  <div class="item-subtitle" style="font-size: 11px;"><i class="ph ph-user"></i> Operatore: ${r.operator}</div>
                  <div class="item-subtitle" style="font-size: 11px; color: var(--text-secondary);">
                    ${r.equipmentCleaned?.length || 0} Attrezzature, ${r.environmentsCleaned?.length || 0} Ambienti
                  </div>
                </div>
                <div style="display: flex; align-items: center; padding-right: 12px; gap: 5px;">
                  <div style="width: 1px; height: 24px; background: var(--border-color); margin: 0 5px;"></div>
                  <button class="btn-icon" onclick="event.stopPropagation(); App.openModal('edit-sanitation', '${r.id}')" style="background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 5px; display: flex; align-items: center;">
                    <i class="ph-bold ph-pencil" style="font-size: 20px;"></i>
                  </button>
                  <button class="btn-icon" onclick="event.stopPropagation(); App.removeSettingItem('haccp_sanitation', '${r.id}', 'haccp_sanitation')" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 5px; display: flex; align-items: center;">
                    <i class="ph-bold ph-trash" style="font-size: 20px;"></i>
                  </button>
                </div>
              </div>
            `).join('') : '<p style="text-align: center; padding: 20px; color: var(--text-secondary);">Nessuna attività registrata.</p>'}
          </div>
        </div>
      `;
    },

    haccp_sanitation_detail(id) {
      const r = Store.data.haccp_sanitation.find(x => x.id === id);
      if(!r) return '';
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp_sanitation')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <div style="background: var(--bg-body); padding: 15px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h2 style="color: var(--primary-color);">Rapporto Sanificazione</h2>
            <p><strong>Data:</strong> ${App.formatDate(r.date)}</p>
            <p><strong>Operatore:</strong> ${r.operator}</p>
          </div>

          <h4 style="margin-top: 20px;">Attrezzature Sanificate</h4>
          <div class="list-container">
            ${r.equipmentCleaned?.map(e => `
              <div class="list-item" style="padding: 8px 0; border-bottom: 1px dashed var(--border-color);">
                <div><strong>${e.name}</strong></div>
                <div style="font-size: 12px; color: var(--text-secondary);">Detergente: ${e.detergentName}</div>
              </div>
            `).join('') || 'Nessuna'}
          </div>

          <h4 style="margin-top: 20px;">Ambienti Sanificati</h4>
          <div class="list-container">
            ${r.environmentsCleaned?.map(e => `
              <div class="list-item" style="padding: 8px 0; border-bottom: 1px dashed var(--border-color);">
                <div><strong>${e.name}</strong></div>
                <div style="font-size: 12px; color: var(--text-secondary);">Detergente: ${e.detergentName}</div>
              </div>
            `).join('') || 'Nessuna'}
          </div>
        </div>
      `;
    },

    haccp_hygiene() {
      const records = Store.data.haccp_hygiene || [];
      const now = new Date();
      const currentMonth = now.toISOString().slice(0,7);
      const fromDate = App.hygFilterFrom || currentMonth + '-01';
      const toDate = App.hygFilterTo || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const filtered = records.filter(r => r.date >= fromDate && r.date <= toDate).sort((a,b) => new Date(b.date) - new Date(a.date));

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-users"></i> Registro Igiene Personale</h3>
          
          <div style="margin-top: 16px; margin-bottom: 20px; display: flex; gap: 10px;">
             <button class="btn-primary" style="flex: 1;" onclick="App.openModal('hygiene')"><i class="ph ph-check-square"></i> Nuova Verifica</button>
             <button class="btn-secondary" style="flex: 1;" onclick="App.openModal('filter-hyg')"><i class="ph ph-calendar"></i> Filtra</button>
          </div>

          <h4 style="margin-bottom: 10px;">Verifiche dal ${App.formatDate(fromDate)} al ${App.formatDate(toDate)}</h4>
          <div class="list-container">
            ${filtered.length > 0 ? filtered.map(r => `
              <div class="list-item" style="padding: 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: stretch; background: white; margin-bottom: 5px; border-radius: 8px; cursor: pointer; overflow: hidden;" onclick="App.goToHygieneDetail('${r.id}')">
                <div style="flex: 1; padding: 12px;">
                  <div class="item-title" style="font-weight: 600;">${App.formatDate(r.date)} <span style="font-size: 11px; font-weight: normal; background: ${r.status === 'CONFORME' ? 'var(--success-color)' : 'var(--danger-color)'}; color: white; padding: 2px 6px; border-radius: 4px; margin-left: 5px;">${r.status}</span></div>
                  <div class="item-subtitle" style="font-size: 12px; margin-top: 4px; color: var(--text-primary);">Lavoratori: <strong>${r.workerNames || 'Tutti'}</strong></div>
                  <div class="item-subtitle" style="font-size: 11px; margin-top: 2px;"><i class="ph ph-user"></i> Verificatore: ${r.operator}</div>
                </div>
                <div style="display: flex; align-items: center; padding-right: 12px; gap: 5px;">
                  <div style="width: 1px; height: 24px; background: var(--border-color); margin: 0 5px;"></div>
                  <button class="btn-icon" onclick="event.stopPropagation(); App.openModal('edit-hygiene', '${r.id}')" style="background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 5px; display: flex; align-items: center;">
                    <i class="ph-bold ph-pencil" style="font-size: 20px;"></i>
                  </button>
                  <button class="btn-icon" onclick="event.stopPropagation(); App.removeSettingItem('haccp_hygiene', '${r.id}', 'haccp_hygiene')" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 5px; display: flex; align-items: center;">
                    <i class="ph-bold ph-trash" style="font-size: 20px;"></i>
                  </button>
                </div>
              </div>
            `).join('') : '<p style="text-align: center; padding: 20px; color: var(--text-secondary);">Nessuna verifica registrata.</p>'}
          </div>
        </div>
      `;
    },

    haccp_hygiene_detail(id) {
      const r = Store.data.haccp_hygiene.find(x => x.id === id);
      if(!r) return '';
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp_hygiene')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <div style="background: var(--bg-body); padding: 15px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h2 style="color: var(--primary-color);">Dettaglio Verifica Igiene</h2>
            <p><strong>Data:</strong> ${App.formatDate(r.date)}</p>
            <p><strong>Verificatore:</strong> ${r.operator}</p>
            <p><strong>Lavoratori Controllati:</strong> ${r.workerNames || 'Tutti'}</p>
            <p><strong>Esito Complessivo:</strong> <span style="color: ${r.status === 'CONFORME' ? 'var(--success-color)' : 'var(--danger-color)'}; font-weight: bold;">${r.status}</span></p>
          </div>

          <h4 style="margin-top: 20px; margin-bottom: 10px;">Esiti Checklist Analitica</h4>
          <div class="list-container" style="background: white; border-radius: 8px; border: 1px solid var(--border-color); overflow: hidden;">
            ${r.checks?.map(c => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 15px; border-bottom: 1px solid var(--border-color);">
                <span style="font-size: 13px; flex: 1; padding-right: 15px;">${c.label}</span>
                <span style="font-weight: 800; color: ${c.status === 'C' ? 'var(--success-color)' : 'var(--danger-color)'};">${c.status === 'C' ? 'CONFORME' : 'NON CONFORME'}</span>
              </div>
            `).join('') || '<p style="padding: 15px;">Dati checklist non disponibili per questo record.</p>'}
          </div>

          ${r.notes ? `
            <div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.02); border-radius: 8px;">
              <strong>Note / Azioni Correttive:</strong>
              <p style="margin-top: 8px;">${r.notes}</p>
            </div>
          ` : ''}
        </div>
      `;
    },

    haccp_nc() {
      const records = Store.data.haccp_noncompliance || [];
      const filtered = records.sort((a,b) => new Date(b.date) - new Date(a.date));

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-warning-circle"></i> Registro Non Conformità</h3>
          
          <div style="margin-top: 16px; margin-bottom: 20px;">
             <button class="btn-danger" style="width: 100%;" onclick="App.openModal('noncompliance')"><i class="ph ph-warning"></i> Nuova Segnalazione NC</button>
          </div>

          <h4 style="margin-bottom: 10px;">Elenco Anomalie</h4>
          <div class="list-container">
            ${filtered.length > 0 ? filtered.map(r => `
              <div class="list-item" style="padding: 0; border-bottom: 1px solid var(--border-color); display: flex; align-items: stretch; background: white; margin-bottom: 5px; border-radius: 8px; cursor: pointer; overflow: hidden;">
                <div style="flex: 1; padding: 12px;" onclick="App.goToNCDetail('${r.id}')">
                  <div class="item-title" style="font-weight: 600;">${App.formatDate(r.date)} <span style="font-size: 11px; font-weight: normal; background: ${r.isClosed ? 'var(--success-color)' : 'var(--danger-color)'}; color: white; padding: 2px 6px; border-radius: 4px; margin-left: 5px;">${r.isClosed ? 'CHIUSA' : 'APERTA'}</span></div>
                  <div class="item-subtitle" style="margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.description}</div>
                  <div class="item-subtitle" style="font-size: 11px; margin-top: 4px;"><i class="ph ph-user"></i> Responsabile: ${r.responsibleWorker || 'N/D'}</div>
                </div>
                <div style="display: flex; align-items: center; padding-right: 12px; gap: 5px;">
                  <div style="width: 1px; height: 24px; background: var(--border-color); margin: 0 5px;"></div>
                  <button class="btn-icon" onclick="event.stopPropagation(); App.openModal('edit-noncompliance', '${r.id}')" style="background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 5px; display: flex; align-items: center;">
                    <i class="ph-bold ph-pencil" style="font-size: 20px;"></i>
                  </button>
                  <button class="btn-icon" onclick="event.stopPropagation(); App.removeSettingItem('haccp_noncompliance', '${r.id}', 'haccp_nc')" style="background: none; border: none; color: var(--danger-color); cursor: pointer; padding: 5px; display: flex; align-items: center;">
                    <i class="ph-bold ph-trash" style="font-size: 20px;"></i>
                  </button>
                </div>
              </div>
            `).join('') : '<p style="text-align: center; padding: 20px; color: var(--text-secondary);">Nessuna non conformità registrata.</p>'}
          </div>
        </div>
      `;
    },

    haccp_nc_detail(id) {
      const r = Store.data.haccp_noncompliance.find(x => x.id === id);
      if(!r) return '';
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp_nc')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <div style="background: var(--bg-body); padding: 20px; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
              <h2 style="color: var(--primary-color); margin: 0;">Dettaglio Non Conformità</h2>
              <span style="background: ${r.isClosed ? 'var(--success-color)' : 'var(--danger-color)'}; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold;">
                ${r.isClosed ? 'CHIUSA' : 'APERTA'}
              </span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px; font-size: 14px;">
              <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
                <strong style="display: block; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">Data Rilevamento</strong>
                ${App.formatDate(r.date)}
              </div>
              <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
                <strong style="display: block; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">Descrizione Anomalia</strong>
                ${r.description}
              </div>
              <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
                <strong style="display: block; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">Azione Correttiva Prevista</strong>
                ${r.correctiveAction}
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
                  <strong style="display: block; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">Responsabile Attuazione</strong>
                  ${r.responsibleWorker || 'N/D'}
                </div>
                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.05);">
                  <strong style="display: block; color: var(--text-secondary); font-size: 11px; text-transform: uppercase;">Scadenza Attuazione</strong>
                  ${App.formatDate(r.dueDate)}
                </div>
              </div>

              ${r.isClosed ? `
                <div style="background: #f0fdf4; padding: 12px; border-radius: 8px; border: 1px solid #bbf7d0; margin-top: 10px;">
                  <strong style="display: block; color: #166534; font-size: 11px; text-transform: uppercase;">Risoluzione</strong>
                  Data Chiusura: <strong>${App.formatDate(r.closedDate)}</strong>
                </div>
              ` : `
                <button class="btn-primary" style="margin-top: 10px;" onclick="App.openModal('edit-noncompliance', '${r.id}')">
                  <i class="ph ph-check-circle"></i> Risolvi / Chiudi Non Conformità
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    },

    haccp_structure() {
      const records = Store.data.haccp_structure || [];
      const filtered = records.sort((a,b) => new Date(b.date) - new Date(a.date));
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-house-line"></i> Ambienti e Strutture</h3>
          <div style="margin-top: 16px; margin-bottom: 20px;">
            <button class="btn-primary" style="width: 100%;" onclick="App.openModal('structure')"><i class="ph ph-plus"></i> Nuovo Controllo</button>
          </div>
          <div class="list-container">
            ${filtered.length > 0 ? filtered.map(r => `
              <div class="list-item" style="padding: 12px; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="App.goToStructureDetail('${r.id}')">
                <div style="flex: 1;">
                  <div class="item-title">${App.formatDate(r.date)} - ${r.environment}</div>
                  <div class="item-subtitle ${r.status === 'CONFORME' ? 'text-conforme' : 'text-non-conforme'}">${r.status}</div>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
              </div>
            `).join('') : '<p style="text-align: center; color: var(--text-secondary);">Nessuna attività registrata.</p>'}
          </div>
        </div>
      `;
    },

    haccp_structure_detail(id) {
      const r = Store.data.haccp_structure.find(x => x.id === id);
      if(!r) return `<div class="card"><p>Controllo non trovato.</p></div>`;

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('haccp_structure')"><i class="ph ph-arrow-left"></i> Indietro</button>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <h2 style="margin-bottom: 4px;">${r.environment}</h2>
              <p style="font-size: 14px; color: var(--text-secondary);">${App.formatDate(r.date)} - Operatore: ${r.operator}</p>
            </div>
            <div class="status-badge ${r.status === 'CONFORME' ? 'status-ok' : 'status-alert'}">
              ${r.status}
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 12px; font-size: 14px; text-transform: uppercase; color: var(--text-secondary);">Checklist</h4>
            ${r.checks.map(c => `
              <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                <div style="flex: 1; padding-right: 10px;">
                  <div style="font-size: 14px; font-weight: 500;">${c.label}</div>
                  ${c.correctiveAction ? `<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">Azione: ${c.correctiveAction}</div>` : ''}
                </div>
                <div class="${c.status === 'C' ? 'text-conforme' : 'text-non-conforme'}" style="font-weight: bold;">${c.status}</div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 10px; margin-top: 24px;">
            <button class="btn-secondary" style="flex: 1;" onclick="App.openModal('edit-structure', '${r.id}')"><i class="ph ph-pencil"></i> Modifica</button>
            <button class="btn-danger" style="flex: 1;" onclick="App.deleteStructureRecord('${r.id}')"><i class="ph ph-trash"></i> Elimina</button>
          </div>
        </div>
      `;
    },

    reports() {
      return `
        <div class="card">
          <h3><i class="ph-fill ph-file-pdf"></i> Esportazione Registri</h3>
          <p>Seleziona il registro da esportare in PDF.</p>
          <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
             <button class="btn-secondary" onclick="App.openPrintModal('haccp_temperature', 'Registro Temperature')"><i class="ph ph-thermometer"></i> Temperature Frigoriferi</button>
             <button class="btn-secondary" onclick="App.openPrintModal('haccp_sanitation', 'Registro Sanificazione')"><i class="ph ph-sparkle"></i> Sanificazione</button>
             <button class="btn-secondary" onclick="App.openPrintModal('haccp_hygiene', 'Registro Igiene Personale')"><i class="ph ph-users"></i> Igiene Personale</button>
             <button class="btn-secondary" onclick="App.openPrintModal('haccp_noncompliance', 'Registro Non Conformità')"><i class="ph ph-warning-circle"></i> Non Conformità</button>
             <button class="btn-secondary" onclick="App.openPrintModal('haccp_structure', 'Registro Ambienti e Strutture')"><i class="ph ph-house-line"></i> Ambienti e Strutture</button>
          </div>
        </div>
      `;
    },

    traceability() {
      return `
        <div class="dashboard-grid">
          <div class="widget" onclick="App.renderView('trace_recipes')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-blue" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-book-bookmark"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Ricettario</div>
          </div>
          <div class="widget" onclick="App.renderView('trace_incoming')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-green" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-truck"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Carico Merci</div>
          </div>
          <div class="widget" onclick="App.renderView('trace_suppliers')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-orange" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-address-book"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Fornitori</div>
          </div>
          <div class="widget" onclick="App.renderView('trace_ingredients')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-blue" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-warehouse"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Magazzino</div>
          </div>
          <div class="widget" onclick="App.renderView('trace_production')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-green" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-cooking-pot"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Produzione</div>
          </div>
          <div class="widget" onclick="App.renderView('trace_archive')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon bg-red" style="width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-folder-open"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Archivio DDT</div>
          </div>
          <div class="widget" onclick="App.renderView('labels')" style="cursor: pointer; padding: 15px;">
            <div class="widget-icon" style="background: #a855f7; width: 40px; height: 40px; font-size: 20px;"><i class="ph-fill ph-tag"></i></div>
            <div class="widget-value" style="font-size: 16px; margin-top: 5px;">Etichette</div>
          </div>
        </div>
      `;
    },

    trace_recipes() {
      const recipes = Store.data.recipes || [];
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('traceability')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-book-bookmark"></i> Ricettario</h3>
          <p>Gestione database ricette.</p>
          <div style="margin-top: 16px; margin-bottom: 20px;">
            <button class="btn-primary" onclick="App.openModal('recipe')"><i class="ph ph-plus"></i> Nuova Ricetta</button>
          </div>
          <div class="list-container">
            ${recipes.length > 0 ? recipes.map(r => `
              <div class="list-item" style="cursor: pointer;" onclick="App.goToRecipeDetail('${r.id}')">
                <div class="item-title">${r.name}</div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
              </div>
            `).join('') : '<p style="text-align: center; color: var(--text-secondary);">Nessuna ricetta presente.</p>'}
          </div>
        </div>
      `;
    },

    trace_recipe_detail(id) {
      const recipes = Store.data.recipes || [];
      const r = recipes.find(x => x.id === id);
      if(!r) return `<div class="card"><p>Ricetta non trovata.</p></div>`;

      // Recupero info ingredienti e allergeni
      const ingredients = (r.ingredients || []).map(ri => {
        const ing = (Store.data.ingredients || []).find(i => i.id === ri.ingredientId);
        return {
          name: ing ? ing.name : 'Sconosciuto',
          quantity: ri.quantity,
          unit: ing ? ing.unit : '?',
          allergens: ing ? ing.allergens : []
        };
      }).sort((a,b) => parseFloat(b.quantity) - parseFloat(a.quantity));

      const allAllergens = [...new Set(ingredients.flatMap(i => i.allergens || []))];

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('trace_recipes')"><i class="ph ph-arrow-left"></i> Indietro</button>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div style="flex: 1;">
              <h2 style="margin-bottom: 4px; font-size: 24px;">${r.name}</h2>
              <p style="font-size: 14px; color: var(--text-secondary);">Resa totale: <strong>${r.totalWeight || '-'} kg</strong></p>
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 12px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary);">Ingredienti (in ordine di quantità)</h4>
            <div class="list-container">
              ${ingredients.map(i => `
                <div class="list-item" style="padding: 10px 0; border-bottom: 1px dashed var(--border-color); background: none; border-radius: 0;">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 14px;">${i.name}</div>
                    ${i.allergens && i.allergens.length > 0 ? `<div style="font-size: 11px; color: var(--danger-color); font-weight: 600;">Contiene: ${i.allergens.join(', ')}</div>` : ''}
                  </div>
                  <div style="font-weight: 700; color: var(--primary-color);">${i.quantity} ${i.unit}</div>
                </div>
              `).join('')}
            </div>
          </div>

          ${allAllergens.length > 0 ? `
            <div style="background: #fff5f5; border: 1px solid #feb2b2; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
              <h4 style="color: #c53030; font-size: 11px; text-transform: uppercase; margin-bottom: 8px;"><i class="ph-fill ph-warning"></i> Allergeni Totali Ricetta</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${allAllergens.map(a => `<span style="background: #c53030; color: white; padding: 3px 10px; border-radius: 15px; font-size: 11px; font-weight: 700;">${a}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px; font-size: 11px; text-transform: uppercase; color: var(--text-secondary);">Procedimento / Note</h4>
            <p style="font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${r.procedure || 'Nessun procedimento inserito.'}</p>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 30px;">
            <button class="btn-secondary" style="flex: 1; height: 50px;" onclick="App.openModal('edit-recipe', '${r.id}')">
              <i class="ph-fill ph-pencil-simple"></i> Modifica
            </button>
            <button class="btn-danger" style="flex: 1; height: 50px;" onclick="App.removeSettingItem('recipes', '${r.id}', 'trace_recipes')">
              <i class="ph-fill ph-trash"></i> Elimina
            </button>
          </div>
        </div>
      `;
    },

    trace_incoming() {
      const goods = Store.data.incoming_goods || [];
      const filtered = goods.sort((a,b) => new Date(b.date) - new Date(a.date));

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('traceability')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-truck"></i> Registro Carichi Merci</h3>
          <div style="margin-top: 16px; margin-bottom: 20px;">
            <button class="btn-primary" onclick="App.openModal('incoming')"><i class="ph ph-plus"></i> Nuovo Carico</button>
          </div>
          <div class="list-container">
            ${filtered.map(g => `
              <div class="list-item" style="cursor: pointer;" onclick="App.goToIncomingDetail('${g.id}')">
                <div style="flex: 1;">
                  <div class="item-title">${g.ingredientName} <span style="font-weight: normal; font-size: 12px; color: var(--primary-color);">(Lotto Int: ${g.lotInterno || 'N/D'})</span></div>
                  <div class="item-subtitle">${g.quantity} ${g.unit} - ${g.supplierName}</div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Data: ${new Date(g.date).toLocaleDateString()} | Scad: ${new Date(g.expiry).toLocaleDateString()}</div>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
              </div>
            `).join('')}
            ${filtered.length === 0 ? '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Nessun carico registrato.</p>' : ''}
          </div>
        </div>
      `;
    },

    trace_incoming_detail(id) {
      const g = (Store.data.incoming_goods || []).find(x => x.id === id);
      if(!g) return `<div class="card"><p>Carico non trovato.</p></div>`;

      const rawUsed = (Store.data.productions || []).filter(p => p.ingredients && p.ingredients.some(i => i.incomingId === id));
      const usedMovements = rawUsed.map(p => {
         const item = p.ingredients.find(i => i.incomingId === id);
         return {
            date: p.date || p.createdAt,
            qty: parseFloat(item.quantity) || 0,
            label: `Produzione: ${p.recipeName || 'N/D'}`,
            sublabel: `Lotto Prod: ${p.lot}`,
            prodId: p.id,
            type: 'OUT'
         };
      });

      const adjustments = g.adjustments || [];
      const adjMovements = adjustments.map(a => ({
         date: a.date,
         qty: parseFloat(a.quantity) || 0,
         label: 'Quantità persa (Rettifica)',
         sublabel: a.reason || 'Manuale',
         type: 'ADJ'
      }));

      const totalUsed = usedMovements.reduce((acc, curr) => acc + curr.qty, 0);
      const totalLost = adjMovements.reduce((acc, curr) => acc + curr.qty, 0);
      const currentStock = parseFloat(g.quantity) - totalUsed - totalLost;

      const allMovements = [...usedMovements, ...adjMovements].sort((a,b) => new Date(b.date) - new Date(a.date));

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.goToIngredientDetail('${g.ingredientId}')"><i class="ph ph-arrow-left"></i> Indietro</button>
          
          <div style="margin-bottom: 24px;">
            <h2 style="margin-bottom: 4px;">${g.ingredientName}</h2>
            <p style="font-size: 14px; color: var(--text-secondary);">Fornitore: <strong>${g.supplierName}</strong></p>
            <p style="font-size: 14px; font-weight: bold; color: var(--primary-color);">Lotto Interno: ${g.lotInterno || 'N/D'}</p>
          </div>

          <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
            <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; text-align: center; border: 2px solid ${currentStock <= 0 ? 'var(--danger-color)' : 'var(--primary-color)'};">
              <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 5px;">Giacenza Attuale</h4>
              <p style="font-size: 18px; font-weight: 800; color: ${currentStock <= 0 ? 'var(--danger-color)' : 'var(--primary-color)'};">${currentStock.toFixed(3)} ${g.unit}</p>
              <p style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Iniziale: ${g.quantity} ${g.unit}</p>
            </div>
            <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; text-align: center;">
              <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 5px;">Scadenza</h4>
              <p style="font-size: 16px; font-weight: 700;">${new Date(g.expiry).toLocaleDateString()}</p>
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-secondary);"><i class="ph-fill ph-clock-counter-clockwise"></i> Utilizzi in Produzione / Perdite</h4>
              <button class="btn-primary" style="padding: 4px 10px; font-size: 12px; width: auto;" onclick="App.adjustIncomingStock('${g.id}')">
                <i class="ph ph-minus"></i> Dichiara Persa
              </button>
            </div>
            <div class="movements-container" style="display: flex; flex-direction: column; gap: 12px;">
              ${allMovements.map(m => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px dashed rgba(0,0,0,0.05); ${m.type === 'OUT' ? 'cursor: pointer;' : ''}" ${m.type === 'OUT' ? `onclick="App.goToProductionDetail('${m.prodId}')"` : ''}>
                  <div>
                    <div style="font-size: 13px; font-weight: 600;">${m.label}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                      Data: ${new Date(m.date).toLocaleDateString()} | ${m.sublabel}
                    </div>
                  </div>
                  <div style="font-weight: 700; color: var(--danger-color)">
                    -${m.qty.toFixed(3)} ${g.unit}
                  </div>
                </div>
              `).join('')}
              ${allMovements.length === 0 ? '<p style="text-align: center; font-style: italic; font-size: 13px; color: var(--text-secondary);">Nessun utilizzo o perdita registrata per questo lotto.</p>' : ''}
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
             <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 10px;">QR Code Tracciabilità</h4>
             <div id="incoming-qrcode" style="display: flex; justify-content: center;"></div>
             <p style="font-size: 11px; color: var(--text-secondary); margin-top: 10px;">Inquadra per aprire la scheda</p>
             <button class="btn-primary" style="margin-top: 15px; width: 100%;" onclick="App.printIncomingLabel('${g.id}')"><i class="ph ph-printer"></i> Stampa Etichetta</button>
          </div>

          <div style="margin-bottom: 24px;">
            <h4 style="font-size: 12px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 12px;"><i class="ph ph-image"></i> Documentazione Fotografica</h4>
            
            <div style="margin-bottom: 15px;">
              <p style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Fattura / DDT:</p>
              ${(g.ddtPhoto || (g.photos && g.photos.ddt)) 
                ? `<img src="${g.ddtPhoto || g.photos.ddt}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; cursor: zoom-in; border: 1px solid var(--border-color);" onclick="App.enlargeImage(this.src)" />`
                : '<p style="font-size: 12px; color: var(--text-secondary); font-style: italic;">Nessuna foto DDT caricata.</p>'}
            </div>

            <div>
              <p style="font-size: 13px; font-weight: 600; margin-bottom: 8px;">Etichetta Lotto / Scadenza:</p>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${g.labelPhoto 
                  ? `<img src="${g.labelPhoto}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px; cursor: zoom-in; border: 1px solid var(--border-color);" onclick="App.enlargeImage(this.src)" />`
                  : (g.photos && g.photos.lot && g.photos.lot.length > 0 
                    ? g.photos.lot.map(src => `<img src="${src}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: zoom-in; border: 1px solid var(--border-color);" onclick="App.enlargeImage(this.src)" />`).join('')
                    : '<p style="font-size: 12px; color: var(--text-secondary); font-style: italic;">Nessuna foto lotto caricata.</p>')}
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn-secondary" style="flex: 1; height: 50px;" onclick="App.openModal('edit-incoming', '${g.id}')">
              <i class="ph-fill ph-pencil-simple"></i> Modifica
            </button>
            <button class="btn-danger" style="flex: 1; height: 50px;" onclick="App.removeSettingItem('incoming_goods', '${g.id}', 'trace_incoming')">
              <i class="ph-fill ph-trash"></i> Elimina
            </button>
          </div>
        </div>
      `;
    },

    trace_suppliers() {
      const suppliers = Store.data.suppliers || [];
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('traceability')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-address-book"></i> Elenco Fornitori</h3>
          <p>Anagrafica completa dei fornitori di materie prime.</p>
          <div style="margin-top: 16px; margin-bottom: 20px;">
            <button class="btn-primary" onclick="App.openModal('supplier')"><i class="ph ph-plus"></i> Nuovo Fornitore</button>
          </div>
          <div class="list-container">
            ${suppliers.map(s => `
              <div class="list-item" style="cursor: pointer; ${s.inactive ? 'opacity: 0.6; background: #f8f9fa;' : ''}" onclick="App.goToSupplierDetail('${s.id}')">
                <div style="flex: 1;">
                  <div class="item-title">${s.name} ${s.inactive ? '<span style="font-size: 10px; color: var(--text-secondary); margin-left: 10px;">(INATTIVO)</span>' : ''}</div>
                  <div class="item-subtitle">${s.vat || 'P.IVA non inserita'}</div>
                </div>
                <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
              </div>
            `).join('')}
            ${suppliers.length === 0 ? '<p style="text-align: center; color: var(--text-secondary); padding: 20px;">Nessun fornitore in elenco.</p>' : ''}
          </div>
        </div>
      `;
    },

    trace_supplier_detail(id) {
      const s = (Store.data.suppliers || []).find(x => x.id === id);
      if(!s) return `<div class="card"><p>Fornitore non trovato.</p></div>`;

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('trace_suppliers')"><i class="ph ph-arrow-left"></i> Indietro</button>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
            <div>
              <h2 style="margin-bottom: 4px;">${s.name}</h2>
              <p style="font-size: 14px; color: var(--text-secondary);">P.IVA: <strong>${s.vat || '-'}</strong></p>
            </div>
            ${s.inactive ? '<span class="status-badge status-alert" style="font-size: 11px;">NON UTILIZZATO</span>' : '<span class="status-badge status-ok" style="font-size: 11px;">ATTIVO</span>'}
          </div>

          <div class="dashboard-grid" style="grid-template-columns: 1fr; gap: 12px; margin-bottom: 24px;">
            <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px;">
              <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 10px;"><i class="ph ph-map-pin"></i> Indirizzi</h4>
              <p style="font-size: 13px; margin-bottom: 8px;"><strong>Sede Legale:</strong><br>${s.legalAddress || '-'}</p>
              <p style="font-size: 13px;"><strong>Sede Operativa:</strong><br>${s.officeAddress || '-'}</p>
            </div>

            <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px;">
              <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 10px;"><i class="ph ph-user"></i> Contatto</h4>
              <p style="font-size: 13px; margin-bottom: 8px;"><strong>Responsabile:</strong> ${s.manager || '-'}</p>
              <p style="font-size: 13px; margin-bottom: 8px;"><strong>Telefono:</strong> ${s.phone || '-'}</p>
              <p style="font-size: 13px; margin-bottom: 8px;"><strong>Email:</strong> ${s.email || '-'}</p>
              <p style="font-size: 13px;"><strong>PEC:</strong> ${s.pec || '-'}</p>
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; margin-bottom: 24px;">
            <h4 style="font-size: 11px; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 12px;"><i class="ph ph-basket"></i> Ingredienti Forniti</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${(s.providedIngredients || []).length > 0 
                ? s.providedIngredients.map(ingId => {
                    const ing = (Store.data.ingredients || []).find(i => i.id === ingId);
                    return ing ? `<span style="background: white; border: 1px solid var(--primary-color); color: var(--primary-color); padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">${ing.name}</span>` : '';
                  }).join('')
                : '<span style="color: var(--text-secondary); font-size: 13px; font-style: italic;">Nessun ingrediente associato</span>'}
            </div>
          </div>

          <div style="display: flex; gap: 12px;">
            <button class="btn-secondary" style="flex: 1; height: 50px;" onclick="App.openModal('edit-supplier', '${s.id}')">
              <i class="ph-fill ph-pencil-simple"></i> Modifica
            </button>
            <button class="btn-danger" style="flex: 1; height: 50px;" onclick="App.removeSettingItem('suppliers', '${s.id}', 'trace_suppliers')">
              <i class="ph-fill ph-trash"></i> Elimina
            </button>
          </div>
        </div>
      `;
    },

    trace_ingredients() {
      const inventory = Store.getInventory();
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('traceability')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-warehouse"></i> Magazzino Ingredienti</h3>
          <p>Monitoraggio scorte in tempo reale e movimentazioni.</p>
          <div style="margin-top: 16px; margin-bottom: 20px;">
            <button class="btn-primary" onclick="App.openModal('ingredient')"><i class="ph ph-plus"></i> Nuovo Ingrediente</button>
          </div>
          <div class="list-container">
            ${inventory.length > 0 ? inventory.map(item => `
              <div class="list-item" style="cursor: pointer;" onclick="App.goToIngredientDetail('${item.ingredientId}')">
                <div style="flex: 1;">
                  <div class="item-title">${item.name}</div>
                  <div class="item-subtitle">Giacenza: ${item.quantity} ${item.unit}</div>
                  ${item.allergens && item.allergens.length > 0 ? `<div style="font-size: 11px; color: var(--danger-color); margin-top: 4px;">Allergeni: ${item.allergens.join(', ')}</div>` : ''}
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                  <div class="${item.isLow ? 'status-alert' : 'status-ok'}" style="white-space: nowrap;">${item.quantity} ${item.unit}</div>
                  <i class="ph ph-caret-right" style="color: var(--text-secondary);"></i>
                </div>
              </div>
            `).join('') : '<p style="text-align: center; color: var(--text-secondary);">Nessun ingrediente in stock.</p>'}
          </div>
        </div>
      `;
    },

    trace_ingredient_detail(id) {
      const ingredients = Store.data.ingredients || [];
      const ing = ingredients.find(x => x.id === id);
      if(!ing) return `<div class="card"><p>Ingrediente non trovato.</p></div>`;
      
      const rawIncoming = (Store.data.incoming_goods || []).filter(g => g.ingredientId === id);
      const incomingQty = rawIncoming.reduce((acc, curr) => acc + (parseFloat(curr.quantity) || 0), 0);
      
      const rawUsed = (Store.data.productions || []).filter(p => p.ingredients && p.ingredients.some(i => i.ingredientId === id));
      const usedQty = rawUsed.reduce((acc, p) => {
        const item = p.ingredients.find(i => i.ingredientId === id);
        return acc + (parseFloat(item.quantity) || 0);
      }, 0);
      
      const currentStock = incomingQty - usedQty;

      // Movimenti uniti
      const movements = [
        ...rawIncoming.map(g => ({ type: 'IN', id: g.id, date: g.date, expiry: g.expiry, lotInterno: g.lotInterno, qty: g.quantity, label: `Carico Lotto Int: ${g.lotInterno || 'N/D'}` })),
        ...rawUsed.map(p => ({ 
          type: 'OUT', 
          id: p.id,
          date: p.date || p.createdAt, 
          qty: p.ingredients.find(i => i.ingredientId === id).quantity, 
          label: `Produzione: ${p.recipeName || 'Lotto ' + p.lot}` 
        }))
      ].sort((a,b) => new Date(b.date) - new Date(a.date));

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('trace_ingredients')"><i class="ph ph-arrow-left"></i> Indietro</button>
          
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div style="flex: 1; padding-right: 15px;">
              <h2 style="margin-bottom: 4px; font-size: 24px;">${ing.name}</h2>
              <p style="font-size: 14px; color: var(--text-secondary);">Unità: ${ing.unit}</p>
            </div>
            <div class="status-badge ${currentStock < (ing.minStock || 5) ? 'status-alert' : 'status-ok'}" style="font-size: 16px; padding: 10px 15px; border-radius: 12px; font-weight: 800;">
              ${currentStock.toFixed(2).replace('.', ',')} ${ing.unit}
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; margin-bottom: 24px;">
            <h4 style="margin-bottom: 15px; font-size: 12px; text-transform: uppercase; color: var(--text-secondary);"><i class="ph-fill ph-clock-counter-clockwise"></i> Storico Movimenti (Entrate/Uscite)</h4>
            <div class="movements-container" style="display: flex; flex-direction: column; gap: 12px;">
              ${movements.map(m => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px dashed rgba(0,0,0,0.05); cursor: pointer;" onclick="App.${m.type === 'IN' ? 'goToIncomingDetail' : 'goToProductionDetail'}('${m.id}')">
                  <div>
                    <div style="font-size: 13px; font-weight: 600;">${m.label}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                      Data Carico/Prod: ${new Date(m.date).toLocaleDateString()}
                      ${m.type === 'IN' && m.expiry ? ` | Scad: ${new Date(m.expiry).toLocaleDateString()}` : ''}
                    </div>
                  </div>
                  <div style="font-weight: 700; color: ${m.type === 'IN' ? 'var(--success-color)' : 'var(--danger-color)'}">
                    ${m.type === 'IN' ? '+' : '-'}${parseFloat(m.qty).toFixed(2)}
                  </div>
                </div>
              `).reverse().join('')}
              ${movements.length === 0 ? '<p style="text-align: center; font-style: italic; font-size: 13px; color: var(--text-secondary);">Nessuna movimentazione registrata.</p>' : ''}
            </div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-secondary);">Allergeni</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${ing.allergens && ing.allergens.length > 0 
                ? ing.allergens.map(a => `<span style="background: white; border: 1.5px solid var(--danger-color); color: var(--danger-color); padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;">${a}</span>`).join('') 
                : '<span style="color: var(--success-color); font-size: 14px; font-weight: 600;"><i class="ph ph-check-circle"></i> Nessun allergene</span>'}
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 30px;">
            <button class="btn-secondary" style="flex: 1; height: 50px;" onclick="App.openModal('edit-ingredient', '${ing.id}')">
              <i class="ph-fill ph-pencil-simple"></i> Modifica
            </button>
            <button class="btn-danger" style="flex: 1; height: 50px;" onclick="App.removeSettingItem('ingredients', '${ing.id}', 'trace_ingredients')">
              <i class="ph-fill ph-trash"></i> Elimina
            </button>
          </div>
        </div>
      `;
    },

    trace_production() {
      const productions = Store.data.productions || [];
      const filtered = productions.sort((a,b) => new Date(b.date) - new Date(a.date));
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('traceability')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-cooking-pot"></i> Registro Produzione</h3>
          <div style="margin-top: 16px; margin-bottom: 20px;">
            <button class="btn-primary" onclick="App.openModal('production')"><i class="ph ph-plus"></i> Nuova Produzione</button>
          </div>
          <div class="list-container">
            ${filtered.length > 0 ? filtered.map(p => `
              <div class="list-item" style="cursor: pointer;" onclick="App.goToProductionDetail('${p.id}')">
                <div style="flex: 1;">
                  <div class="item-title">${p.recipeName}</div>
                  <div class="item-subtitle">Lotto: ${p.lot} | Data: ${App.formatDate(p.date)}</div>
                </div>
                <div style="display: flex; gap: 15px; align-items: center;">
                  <span style="font-size: 12px; font-weight: 600; background: var(--bg-body); padding: 4px 8px; border-radius: 6px;">${p.quantityProduced} kg/pz</span>
                  <div style="display: flex; gap: 8px;">
                    <i class="ph ph-pencil" style="color: var(--primary-color);" onclick="event.stopPropagation(); App.openModal('edit-production', '${p.id}')"></i>
                    <i class="ph ph-trash" style="color: var(--danger-color);" onclick="event.stopPropagation(); App.removeItem('productions', '${p.id}', 'trace_production')"></i>
                  </div>
                </div>
              </div>
            `).join('') : '<p style="text-align: center; color: var(--text-secondary);">Nessuna produzione registrata.</p>'}
          </div>
        </div>
      `;
    },

    trace_production_detail(id) {
      const p = (Store.data.productions || []).find(x => x.id === id);
      if(!p) return `<div class="card"><p>Produzione non trovata.</p></div>`;

      return `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <button class="btn-secondary" style="width: auto; padding: 8px 16px;" onclick="App.renderView('trace_production')"><i class="ph ph-arrow-left"></i> Indietro</button>
            <div style="display: flex; gap: 10px;">
              <button class="btn-secondary" style="width: auto; padding: 8px 16px;" onclick="App.openModal('edit-production', '${p.id}')"><i class="ph ph-pencil"></i> Modifica</button>
              <button class="btn-danger" style="width: auto; padding: 8px 16px;" onclick="App.removeItem('productions', '${p.id}', 'trace_production')"><i class="ph ph-trash"></i> Elimina</button>
            </div>
          </div>
          
          <div style="background: var(--bg-body); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid var(--border-color);">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--primary-color); font-weight: 700; margin-bottom: 5px;">Scheda Produzione</div>
            <h2 style="margin-bottom: 10px;">${p.recipeName}</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 13px;">
              <div><strong>Lotto Interno:</strong><br>${p.lot}</div>
              <div><strong>Data Prod:</strong><br>${App.formatDate(p.date)}</div>
              <div><strong>Quantità:</strong><br>${p.quantityProduced} kg/pz</div>
              <div><strong>Scadenza:</strong><br>${App.formatDate(p.expiry)}</div>
            </div>
          </div>

          <h4 style="margin-bottom: 12px;"><i class="ph ph-list-bullets"></i> Ingredienti e Lotti Utilizzati</h4>
          <p style="font-size: 12px; color: var(--text-secondary); margin-bottom: 15px;">Clicca sull'ingrediente per vedere le foto del lotto e del DDT.</p>
          <div class="list-container">
            ${(p.ingredients || []).map(ing => {
              const ingData = (Store.data.ingredients || []).find(i => i.id === ing.ingredientId);
              const lotData = (Store.data.incoming_goods || []).find(l => l.id === ing.incomingId);
              return `
                <div class="list-item" style="padding: 12px 0; cursor: pointer;" onclick="App.goToIncomingDetail('${ing.incomingId}')">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 14px; color: var(--primary-color);">${ingData ? ingData.name : 'Ingrediente'}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">
                      Lotto Int: ${lotData ? (lotData.lotInterno || 'N/D') : 'N/D'} | 
                      Scad: ${lotData ? App.formatDate(lotData.expiry) : 'N/D'}
                    </div>
                  </div>
                  <div style="font-weight: 700; font-size: 13px;">
                    ${parseFloat(ing.quantity).toFixed(3)} ${ingData ? ingData.unit : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    trace_archive() {
      const shipments = Store.data.trace_shipments || [];
      const sorted = shipments.sort((a,b) => new Date(b.date) - new Date(a.date));
      
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('traceability')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3><i class="ph-fill ph-folder-open"></i> Archivio DDT</h3>
            <button class="btn-primary" style="width: auto; padding: 6px 12px; font-size: 12px;" onclick="App.openModal('incoming')">
              <i class="ph ph-plus"></i> Nuovo Carico
            </button>
          </div>

          <div class="list-container">
            ${sorted.length > 0 ? sorted.map(s => `
              <div class="list-item" style="padding: 12px; display: flex; align-items: center; gap: 15px;">
                <div style="width: 45px; height: 45px; background: var(--bg-body); border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 1px solid var(--border-color); cursor: pointer;" onclick="App.enlargeImage('${s.ddtPhoto}')">
                  <img src="${s.ddtPhoto}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="flex: 1;">
                  <div class="item-title" style="font-weight: 700; font-family: monospace; font-size: 13px; color: var(--primary-color);">${s.fileName || 'Documento_Senza_Nome'}.jpg</div>
                  <div class="item-subtitle">Fornitore: <strong>${s.supplierName}</strong></div>
                  <div class="item-subtitle">Caricato il: ${App.formatDate(s.date)}</div>
                </div>
                <div style="display: flex; gap: 8px;">
                   <i class="ph ph-eye" style="color: var(--primary-color); cursor: pointer; font-size: 20px;" onclick="App.enlargeImage('${s.ddtPhoto}')"></i>
                   <i class="ph ph-trash" style="color: var(--danger-color); cursor: pointer; font-size: 20px;" onclick="App.removeItem('trace_shipments', '${s.id}', 'trace_archive')"></i>
                </div>
              </div>
            `).join('') : '<p style="text-align: center; color: var(--text-secondary); padding: 40px 0;">L\'archivio è vuoto. I documenti caricati appariranno qui.</p>'}
          </div>
        </div>
      `;
    },

    labels() {
      const productions = Store.data.productions || [];
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('traceability')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-tag"></i> Etichette Produzioni</h3>
          <p>Seleziona una produzione per generare l'etichetta a norma <strong>Reg. UE 1169/2011</strong>.</p>
          
          <div class="form-group" style="margin-top: 16px;">
            <label><i class="ph ph-cooking-pot"></i> Seleziona Produzione</label>
            <select id="label-production-select">
              <option value="">-- Seleziona Produzione --</option>
              ${productions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(p => 
                `<option value="${p.id}">${p.recipeName} - Lotto: ${p.lot} (${App.formatDate(p.date)})</option>`
              ).join('')}
            </select>
          </div>
          
          <button class="btn-primary" id="btn-generate-label"><i class="ph ph-magic-wand"></i> Genera Etichetta</button>
        </div>

        <div id="label-result-container" style="display:none;">
           <!-- Label preview injected here -->
        </div>
      `;
    },

    settings() {
      return `
        <div class="card">
          <h3><i class="ph-fill ph-gear"></i> Impostazioni Generali</h3>
          
          <div class="dashboard-grid" style="margin-top: 16px;">
            <div class="widget" onclick="App.renderView('settings_company')" style="cursor: pointer; grid-column: span 2; background: var(--primary-gradient); color: white;">
              <div style="display: flex; align-items: center; gap: 15px;">
                <div class="widget-icon" style="background: rgba(255,255,255,0.2); color: white;"><i class="ph-fill ph-buildings"></i></div>
                <div>
                  <div class="widget-label" style="color: rgba(255,255,255,0.8);">Anagrafica Aziendale</div>
                  <div class="widget-value" style="font-size: 18px;">Dati Operatore (OSA)</div>
                </div>
              </div>
              <i class="ph ph-caret-right" style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); opacity: 0.7;"></i>
            </div>
            
            <div class="widget" onclick="App.renderView('settings_models')" style="cursor: pointer;">
              <div class="widget-icon bg-blue"><i class="ph-fill ph-file-text"></i></div>
              <div>
                <div class="widget-label">Configurazione</div>
                <div class="widget-value" style="font-size: 16px;">Modelli</div>
              </div>
            </div>
            <div class="widget" onclick="App.renderView('settings_equipments')" style="cursor: pointer;">
              <div class="widget-icon bg-green"><i class="ph-fill ph-thermometer-cold"></i></div>
              <div>
                <div class="widget-label">Gestione</div>
                <div class="widget-value" style="font-size: 16px;">Attrezzature</div>
              </div>
            </div>
            <div class="widget" onclick="App.renderView('settings_environments')" style="cursor: pointer;">
              <div class="widget-icon bg-orange"><i class="ph-fill ph-house"></i></div>
              <div>
                <div class="widget-label">Gestione</div>
                <div class="widget-value" style="font-size: 16px;">Ambienti</div>
              </div>
            </div>
            <div class="widget" onclick="App.renderView('settings_detergents')" style="cursor: pointer;">
              <div class="widget-icon bg-red"><i class="ph-fill ph-drop"></i></div>
              <div>
                <div class="widget-label">Gestione</div>
                <div class="widget-value" style="font-size: 16px;">Detergenti</div>
              </div>
            </div>
            <div class="widget" onclick="App.renderView('settings_workers')" style="cursor: pointer;">
              <div class="widget-icon bg-blue"><i class="ph-fill ph-users"></i></div>
              <div>
                <div class="widget-label">Gestione</div>
                <div class="widget-value" style="font-size: 16px;">Lavoratori</div>
              </div>
            </div>
            <div class="widget" onclick="App.renderView('settings_maintenance')" style="cursor: pointer;">
              <div class="widget-icon" style="background: #64748b;"><i class="ph-fill ph-wrench"></i></div>
              <div>
                <div class="widget-label">Sistema</div>
                <div class="widget-value" style="font-size: 16px;">Manutenzione</div>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 10px; color: var(--text-secondary);">
            App Version: 1.0.4 (Cache-Bust-4)
          </div>
        </div>
      `;
    },

    settings_maintenance() {
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('settings')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3 style="color: var(--danger-color); font-size: 22px;"><i class="ph-fill ph-warning-circle"></i> AREA RESET DATI (V4)</h3>
          <p style="margin-bottom: 20px; color: #b91c1c; font-weight: bold;">ATTENZIONE: Queste operazioni sono irreversibili.</p>
          
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div style="background: #fff5f5; padding: 20px; border-radius: 12px; border: 2px solid #feb2b2;">
              <h4 style="margin-bottom: 8px; color: #c53030;">1. Reset Dati HACCP</h4>
              <p style="font-size: 13px; color: #742a2a; margin-bottom: 12px;">Cancella Temperature, Sanificazioni, Igiene, Strutture e Non Conformità.</p>
              <button class="btn-danger" onclick="App.clearHaccpData()" style="width: 100%; font-weight: bold;">
                <i class="ph ph-clock-counter-clockwise"></i> CANCELLA TUTTI I LOG HACCP
              </button>
            </div>

            <div style="background: #fff5f5; padding: 20px; border-radius: 12px; border: 2px solid #feb2b2;">
              <h4 style="margin-bottom: 8px; color: #c53030;">2. Reset Dati Tracciabilità</h4>
              <p style="font-size: 13px; color: #742a2a; margin-bottom: 12px;">Cancella Ricettario, Carichi, Produzioni, Ingredienti e Fornitori.</p>
              <button class="btn-danger" onclick="App.clearTraceData()" style="width: 100%; font-weight: bold;">
                <i class="ph ph-trash"></i> CANCELLA TUTTA LA TRACCIABILITÀ
              </button>
            </div>

            <div style="background: #742a2a; padding: 20px; border-radius: 12px; border: 2px solid #000;">
              <h4 style="margin-bottom: 8px; color: #fff;">3. Reset di Fabbrica</h4>
              <p style="font-size: 13px; color: #feb2b2; margin-bottom: 12px;">RIPRISTINO TOTALE: Cancella ogni dato e impostazione dell'app.</p>
              <button class="btn-primary" onclick="App.factoryReset()" style="background: #fff; color: #742a2a; width: 100%; font-weight: 900;">
                <i class="ph ph-warning-circle"></i> RESET TOTALE DI FABBRICA
              </button>
            </div>
          </div>
        </div>
      `;
    },
    settings_company() {
      const c = Store.data.company || {};
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('settings')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-buildings"></i> Anagrafica Operatore (OSA)</h3>
          <p>Inserisci i dati legali dell'attività per le intestazioni dei documenti.</p>
          
          <div class="form-group" style="margin-top: 20px;">
            <label>Ragione Sociale</label>
            <input type="text" id="company-ragione" value="${c.ragioneSociale || ''}" class="input-lg" placeholder="Es: Rossi Mario S.r.l." />
          </div>
          <div class="form-group">
            <label>Nome Insegna (Visualizzato in Dashboard)</label>
            <input type="text" id="company-insegna" value="${c.nomeInsegna || ''}" class="input-lg" placeholder="Es: Pasticceria del Corso" />
          </div>
          <div class="form-group">
            <label>Sede Legale</label>
            <input type="text" id="company-legale" value="${c.sedeLegale || ''}" class="input-lg" placeholder="Via Roma 1, 00100 Roma" />
          </div>
          <div class="form-group">
            <label>Sede Operativa</label>
            <input type="text" id="company-operativa" value="${c.sedeOperativa || ''}" class="input-lg" placeholder="Via Napoli 10, 00100 Roma" />
          </div>
          <div class="form-group">
            <label>Partita IVA</label>
            <input type="text" id="company-piva" value="${c.pIva || ''}" class="input-lg" placeholder="01234567890" />
          </div>
          <div class="form-group">
            <label>Tipologia Attività</label>
            <input type="text" id="company-attivita" value="${c.tipologiaAttivita || ''}" class="input-lg" placeholder="Ristorazione / Pasticceria / Ecc." />
          </div>

          <button class="btn-primary" id="btn-save-company"><i class="ph ph-floppy-disk"></i> Salva Dati Aziendali</button>
        </div>
      `;
    },
    settings_models() {
      const currentSettings = Store.data.settings || {};
      const modelConfigs = currentSettings.model_configs || {};
      
      const modules = [
        { id: 'haccp_temperature', label: 'Temperature' },
        { id: 'haccp_sanitation', label: 'Sanificazione' },
        { id: 'haccp_hygiene', label: 'Igiene Personale' },
        { id: 'haccp_noncompliance', label: 'Non Conformità' },
        { id: 'haccp_structure', label: 'Ambienti' },
        { id: 'haccp_maintenance', label: 'Manutenzione' },
        { id: 'trace_incoming', label: 'Carico Merci' },
        { id: 'trace_production', label: 'Produzione' },
        { id: 'trace_suppliers', label: 'Fornitori' }
      ];

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('settings')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-file-text"></i> Modelli & Frequenze</h3>
          <p style="margin-bottom: 20px;">Configura il numero di modello e la frequenza di compilazione per ogni registro.</p>
          
          <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
            ${modules.map(m => {
              const config = modelConfigs[m.id] || { model: 'N/D', frequency: "All'occorrenza" };
              return `
                <button class="btn-secondary" style="padding: 15px; text-align: left; display: flex; justify-content: space-between; align-items: center;" onclick="App.goToModelDetail('${m.id}')">
                  <div>
                    <div style="font-weight: 700; font-size: 15px;">${m.label}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">Modello: ${config.model} | Freq: ${config.frequency}</div>
                  </div>
                  <i class="ph ph-caret-right"></i>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    },

    settings_model_detail(moduleId) {
      const currentSettings = Store.data.settings || {};
      const modelConfigs = currentSettings.model_configs || {};
      const config = modelConfigs[moduleId] || { model: '', frequency: "All'occorrenza" };
      
      const moduleLabels = {
        'haccp_temperature': 'Temperature',
        'haccp_sanitation': 'Sanificazione',
        'haccp_hygiene': 'Igiene Personale',
        'haccp_noncompliance': 'Non Conformità',
        'haccp_structure': 'Ambienti',
        'haccp_maintenance': 'Manutenzione',
        'trace_incoming': 'Carico Merci',
        'trace_production': 'Produzione',
        'trace_suppliers': 'Fornitori'
      };

      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('settings_models')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3>Configura: ${moduleLabels[moduleId]}</h3>
          
          <div class="form-group" style="margin-top: 20px;">
             <label><i class="ph ph-hash"></i> Numero Modello (per report di stampa)</label>
             <input type="text" id="config-model-number" value="${config.model}" class="input-lg" placeholder="Es. MOD-TEMP Rev.0" />
          </div>

          <div class="form-group">
            <label><i class="ph ph-calendar"></i> Frequenza di Compilazione</label>
            <select id="config-frequency" class="input-lg">
              <option value="Quotidiana" ${config.frequency === 'Quotidiana' ? 'selected' : ''}>Quotidiana</option>
              <option value="Settimanale" ${config.frequency === 'Settimanale' ? 'selected' : ''}>Settimanale</option>
              <option value="Mensile" ${config.frequency === 'Mensile' ? 'selected' : ''}>Mensile</option>
              <option value="Ogni 2 mesi" ${config.frequency === 'Ogni 2 mesi' ? 'selected' : ''}>Ogni 2 mesi</option>
              <option value="Semestrale" ${config.frequency === 'Semestrale' ? 'selected' : ''}>Semestrale</option>
              <option value="Annuale" ${config.frequency === 'Annuale' ? 'selected' : ''}>Annuale</option>
              <option value="All'occorrenza" ${config.frequency === "All'occorrenza" ? 'selected' : ''}>All'occorrenza</option>
            </select>
            <p style="font-size: 11px; color: var(--text-secondary); margin-top: 5px;">Se impostata una frequenza (tranne all'occorrenza), la dashboard ricorderà se la registrazione manca.</p>
          </div>

          <button class="btn-primary" onclick="App.saveModelConfig('${moduleId}')"><i class="ph ph-floppy-disk"></i> Salva Configurazione</button>
        </div>
      `;
    },

    settings_equipments() {
      const equipments = Store.data.equipments || [];
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('settings')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-thermometer-cold"></i> Impostazioni Attrezzature</h3>
          <p>Gestione attrezzature generali (es. per sanificazione).</p>
          
          <div style="margin-top: 16px;">
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
               <input type="text" id="new-equipment" placeholder="Nuova attrezzatura..." class="input-lg" style="flex:1;">
               <button class="btn-secondary btn-sm-plus" onclick="App.addSettingItem('equipments', 'new-equipment', 'settings_equipments')"><i class="ph ph-plus"></i></button>
            </div>
            <div class="list-container">
              ${equipments.map(e => `
                <div class="list-item" style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                  <div class="item-title">${e.name}</div>
                  <div style="display: flex; gap: 10px;">
                    <i class="ph ph-pencil" style="color: var(--primary-color); cursor: pointer;" onclick="App.editSettingItem('equipments', '${e.id}', 'settings_equipments')"></i>
                    <i class="ph ph-trash" style="color: var(--danger-color); cursor: pointer;" onclick="App.removeSettingItem('equipments', '${e.id}', 'settings_equipments')"></i>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    settings_environments() {
      const environments = Store.data.work_environments || [];
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('settings')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-house"></i> Impostazioni Ambienti</h3>
          
          <div style="margin-top: 16px;">
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
               <input type="text" id="new-environment" placeholder="Nuovo ambiente..." class="input-lg" style="flex:1;">
               <button class="btn-secondary btn-sm-plus" onclick="App.addSettingItem('work_environments', 'new-environment', 'settings_environments')"><i class="ph ph-plus"></i></button>
            </div>
            <div class="list-container">
              ${environments.map(e => `
                <div class="list-item" style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                  <div class="item-title">${e.name}</div>
                  <div style="display: flex; gap: 10px;">
                    <i class="ph ph-pencil" style="color: var(--primary-color); cursor: pointer;" onclick="App.editSettingItem('work_environments', '${e.id}', 'settings_environments')"></i>
                    <i class="ph ph-trash" style="color: var(--danger-color); cursor: pointer;" onclick="App.removeSettingItem('work_environments', '${e.id}', 'settings_environments')"></i>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    settings_detergents() {
      const detergents = Store.data.detergents || [];
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('settings')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-drop"></i> Impostazioni Detergenti</h3>
          
          <div style="margin-top: 16px;">
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
               <input type="text" id="new-detergent" placeholder="Nuovo detergente..." class="input-lg" style="flex:1;">
               <button class="btn-secondary btn-sm-plus" onclick="App.addSettingItem('detergents', 'new-detergent', 'settings_detergents')"><i class="ph ph-plus"></i></button>
            </div>
            <div class="list-container">
              ${detergents.map(d => `
                <div class="list-item" style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                  <div class="item-title">${d.name}</div>
                  <div style="display: flex; gap: 10px;">
                    <i class="ph ph-pencil" style="color: var(--primary-color); cursor: pointer;" onclick="App.editSettingItem('detergents', '${d.id}', 'settings_detergents')"></i>
                    <i class="ph ph-trash" style="color: var(--danger-color); cursor: pointer;" onclick="App.removeSettingItem('detergents', '${d.id}', 'settings_detergents')"></i>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    settings_workers() {
      const workers = Store.data.workers || [];
      return `
        <div class="card">
          <button class="btn-secondary" style="margin-bottom: 16px; width: auto; padding: 8px 16px;" onclick="App.renderView('settings')"><i class="ph ph-arrow-left"></i> Indietro</button>
          <h3><i class="ph-fill ph-users"></i> Impostazioni Lavoratori</h3>
          
          <div style="margin-top: 16px; margin-bottom: 16px;">
             <button class="btn-primary" onclick="App.openModal('worker')"><i class="ph ph-plus"></i> Nuovo Lavoratore</button>
          </div>
          
          <div class="list-container">
            ${workers.length > 0 ? workers.map(w => `
              <div class="list-item" style="padding: 10px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div class="item-title">${w.lastName} ${w.firstName}</div>
                  <div class="item-subtitle">${w.role}</div>
                </div>
                <div style="display: flex; gap: 10px;">
                  <i class="ph ph-pencil" style="color: var(--primary-color); cursor: pointer;" onclick="App.openModal('edit-worker', '${w.id}')"></i>
                  <i class="ph ph-trash" style="color: var(--danger-color); cursor: pointer;" onclick="App.removeSettingItem('workers', '${w.id}', 'settings_workers')"></i>
                </div>
              </div>
            `).join('') : '<p style="font-size: 13px; color: var(--text-secondary);">Nessun lavoratore configurato.</p>'}
          </div>
        </div>
      `;
    }
  },

  getEligibleOperators(procType) {
    const workers = Store.data.workers || [];
    return workers.filter(w => 
      w.isAutocontrolloManager === true || 
      (w.isProcedureManager === true && w.managedProcedures && w.managedProcedures.includes(procType))
    );
  },

  // Modals & Forms handling
  openModal(type, extraArg) {
    const modal = document.getElementById('global-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const saveBtn = document.getElementById('modal-save-btn');
    
    // Clear previous
    if (type === 'worker') {
      title.innerHTML = '<i class="ph-fill ph-user"></i> Nuovo Lavoratore';
      body.innerHTML = `
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="form-worker-firstName" placeholder="Mario" />
        </div>
        <div class="form-group">
          <label>Cognome</label>
          <input type="text" id="form-worker-lastName" placeholder="Rossi" />
        </div>
        <div class="form-group">
          <label>Ruolo</label>
          <input type="text" id="form-worker-role" placeholder="Cuoco" />
        </div>
        
        <div class="checkbox-group" style="margin-top: 15px;">
          <input type="checkbox" id="form-worker-autocontrollo" />
          <label for="form-worker-autocontrollo">Responsabile Autocontrollo</label>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="form-worker-procedura" onchange="document.getElementById('proc-manager-section').style.display = this.checked ? 'block' : 'none'" />
          <label for="form-worker-procedura">Responsabile Procedura</label>
        </div>

        <div id="proc-manager-section" style="display: none; padding-left: 20px; margin-top: 10px; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
          <label style="font-size: 13px; margin-bottom: 8px; display: block; font-weight: 600;">Abilitazioni Procedure:</label>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="temperature" id="p-temp"><label for="p-temp">Temperature</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="sanificazione" id="p-san"><label for="p-san">Sanificazione</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="igiene" id="p-hyg"><label for="p-hyg">Igiene Personale</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="nc" id="p-nc"><label for="p-nc">Non Conformità</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="ambienti" id="p-str"><label for="p-str">Ambienti e Strutture</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="manutenzione" id="p-man"><label for="p-man">Manutenzione</label></div>
        </div>
      `;
      saveBtn.onclick = () => {
        const firstName = document.getElementById('form-worker-firstName').value.trim();
        const lastName = document.getElementById('form-worker-lastName').value.trim();
        const role = document.getElementById('form-worker-role').value.trim();
        const autocontrollo = document.getElementById('form-worker-autocontrollo').checked;
        const procedura = document.getElementById('form-worker-procedura').checked;
        const procedures = procedura ? Array.from(document.querySelectorAll('.proc-check:checked')).map(cb => cb.value) : [];

        if(!firstName || !lastName || !role) { alert('Compila tutti i campi.'); return; }
        Store.addItem('workers', { 
          firstName, 
          lastName, 
          role,
          isAutocontrolloManager: autocontrollo,
          isProcedureManager: procedura,
          managedProcedures: procedures
        });
        this.closeModal();
        this.renderView('settings_workers');
      };
    }

    if (type === 'edit-worker') {
      const workerId = extraArg;
      const w = Store.data.workers.find(x => x.id === workerId);
      if(!w) return;

      title.innerHTML = '<i class="ph-fill ph-user"></i> Modifica Lavoratore';
      const mp = w.managedProcedures || [];
      body.innerHTML = `
        <div class="form-group">
          <label>Nome</label>
          <input type="text" id="form-worker-firstName" value="${w.firstName}" />
        </div>
        <div class="form-group">
          <label>Cognome</label>
          <input type="text" id="form-worker-lastName" value="${w.lastName}" />
        </div>
        <div class="form-group">
          <label>Ruolo</label>
          <input type="text" id="form-worker-role" value="${w.role}" />
        </div>

        <div class="checkbox-group" style="margin-top: 15px;">
          <input type="checkbox" id="form-worker-autocontrollo" ${w.isAutocontrolloManager ? 'checked' : ''} />
          <label for="form-worker-autocontrollo">Responsabile Autocontrollo</label>
        </div>
        
        <div class="checkbox-group">
          <input type="checkbox" id="form-worker-procedura" onchange="document.getElementById('proc-manager-section').style.display = this.checked ? 'block' : 'none'" ${w.isProcedureManager ? 'checked' : ''} />
          <label for="form-worker-procedura">Responsabile Procedura</label>
        </div>

        <div id="proc-manager-section" style="display: ${w.isProcedureManager ? 'block' : 'none'}; padding-left: 20px; margin-top: 10px; background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
          <label style="font-size: 13px; margin-bottom: 8px; display: block; font-weight: 600;">Abilitazioni Procedure:</label>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="temperature" id="p-temp" ${mp.includes('temperature') ? 'checked' : ''}><label for="p-temp">Temperature</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="sanificazione" id="p-san" ${mp.includes('sanificazione') ? 'checked' : ''}><label for="p-san">Sanificazione</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="igiene" id="p-hyg" ${mp.includes('igiene') ? 'checked' : ''}><label for="p-hyg">Igiene Personale</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="nc" id="p-nc" ${mp.includes('nc') ? 'checked' : ''}><label for="p-nc">Non Conformità</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="ambienti" id="p-str" ${mp.includes('ambienti') ? 'checked' : ''}><label for="p-str">Ambienti e Strutture</label></div>
          <div class="checkbox-group"><input type="checkbox" class="proc-check" value="manutenzione" id="p-man" ${mp.includes('manutenzione') ? 'checked' : ''}><label for="p-man">Manutenzione</label></div>
        </div>
      `;
      saveBtn.onclick = () => {
        const firstName = document.getElementById('form-worker-firstName').value.trim();
        const lastName = document.getElementById('form-worker-lastName').value.trim();
        const role = document.getElementById('form-worker-role').value.trim();
        const autocontrollo = document.getElementById('form-worker-autocontrollo').checked;
        const procedura = document.getElementById('form-worker-procedura').checked;
        const procedures = procedura ? Array.from(document.querySelectorAll('.proc-check:checked')).map(cb => cb.value) : [];

        if(!firstName || !lastName || !role) { alert('Compila tutti i campi.'); return; }
        
        Store.updateItem('workers', workerId, { 
          firstName, 
          lastName, 
          role,
          isAutocontrolloManager: autocontrollo,
          isProcedureManager: procedura,
          managedProcedures: procedures
        });
        this.closeModal();
        this.renderView('settings_workers');
      };
    }

    if (type === 'hygiene') {
      title.innerHTML = '<i class="ph-fill ph-users"></i> Verifica Igiene Personale';
      const today = new Date().toISOString().split('T')[0];
      const workers = Store.data.workers || [];
      const eligibleOperators = App.getEligibleOperators('igiene');
      const checklistItems = [
        "Indumenti da lavoro",
        "Calzature",
        "Copricapo idoneo ed indossato correttamente",
        "Assenza di ferite non protette",
        "Unghie lunghe, non pulite e/o con smalto",
        "Comportamenti impropri (es. fumo, cellulare)",
        "Assenza di gioielli (anelli, bracciali, ecc.)",
        "Igiene delle mani corretta",
        "Manipolazione alimenti corretta"
      ];

      body.innerHTML = `
        <div class="form-group">
          <label>Data Controllo</label>
          <input type="date" id="form-hyg-date" value="${today}" />
        </div>
        <div class="form-group">
          <label>Responsabile Controllo (Firma)</label>
          <select id="form-hyg-operator">
            <option value="">-- Seleziona Operatore --</option>
            ${eligibleOperators.map(w => `<option value="${w.firstName} ${w.lastName}">${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Lavoratori Controllati</label>
          <select id="form-hyg-workers" multiple style="height: 100px; padding: 5px;">
            <option value="all" selected>TUTTI I LAVORATORI</option>
            ${workers.map(w => `<option value="${w.id}">${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
          <p style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Ctrl+Click per selezione multipla.</p>
        </div>

        <h4 style="margin-top: 20px; margin-bottom: 10px;">Checklist Analitica</h4>
        <div class="hygiene-checklist" style="background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
          ${checklistItems.map((item, idx) => `
            <div class="checklist-row-container" style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 8px 0;">
              <div class="checklist-row" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; flex: 1; padding-right: 10px;">${item}</span>
                <div class="toggle-group" style="display: flex; gap: 5px;">
                  <button type="button" class="btn-toggle-hyg" id="btn-hyg-${idx}-C" onclick="App.setHygValue(${idx}, 'C')" style="padding: 5px 12px; border-radius: 4px; border: 1px solid var(--border-color); background: var(--success-color); color: white; cursor: pointer; font-weight: bold; transition: 0.2s;">C</button>
                  <button type="button" class="btn-toggle-hyg" id="btn-hyg-${idx}-NC" onclick="App.setHygValue(${idx}, 'NC')" style="padding: 5px 10px; border-radius: 4px; border: 1px solid var(--border-color); background: white; color: var(--text-primary); cursor: pointer; font-weight: bold; transition: 0.2s;">NC</button>
                </div>
                <input type="hidden" id="hyg-item-${idx}" value="C" />
              </div>
              <div id="hyg-corr-container-${idx}" style="display: none; margin-top: 8px; padding-left: 10px;">
                <input type="text" id="hyg-corr-${idx}" placeholder="Azione correttiva per ${item}..." style="width: 100%; font-size: 12px; padding: 6px; border: 1px solid var(--danger-color); border-radius: 4px; background: #fff5f5;" />
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="form-group" style="margin-top: 15px;">
          <label>Note Generali</label>
          <textarea id="form-hyg-notes" rows="2" placeholder="Altre osservazioni..."></textarea>
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('form-hyg-date').value;
        const operator = document.getElementById('form-hyg-operator').value;
        const workerSelect = document.getElementById('form-hyg-workers');
        const selectedWorkerIds = Array.from(workerSelect.selectedOptions).map(opt => opt.value);
        const notes = document.getElementById('form-hyg-notes').value;
        
        if(!operator) { alert("Seleziona il responsabile del controllo."); return; }

        let finalWorkerIds = [];
        let finalWorkerNames = "";

        if (selectedWorkerIds.includes('all')) {
          finalWorkerIds = workers.map(w => w.id);
          finalWorkerNames = "Tutti i lavoratori";
        } else {
          finalWorkerIds = selectedWorkerIds;
          finalWorkerNames = finalWorkerIds.map(id => {
            const w = workers.find(x => x.id === id);
            return w ? `${w.firstName} ${w.lastName}` : 'N/D';
          }).join(', ');
        }

        const checks = checklistItems.map((label, idx) => ({
          label,
          status: document.getElementById(`hyg-item-${idx}`).value,
          correctiveAction: document.getElementById(`hyg-item-${idx}`).value === 'NC' ? document.getElementById(`hyg-corr-${idx}`).value : ''
        }));

        const isNC = checks.some(c => c.status === 'NC');

        Store.addItem('haccp_hygiene', {
          date,
          operator,
          workerIds: finalWorkerIds,
          workerNames: finalWorkerNames,
          checks,
          status: isNC ? 'NON CONFORME' : 'CONFORME',
          notes
        });

        this.closeModal();
        this.renderView(this.currentView);
      };
    }

    if (type === 'maintenance') {
      title.innerHTML = '<i class="ph-fill ph-wrench"></i> Registra Manutenzione';
      const today = new Date().toISOString().split('T')[0];
      const equipments = Store.data.equipments || [];
      const eligibleOperators = App.getEligibleOperators('manutenzione');

      body.innerHTML = `
        <div class="form-group">
          <label>Data Manutenzione</label>
          <input type="date" id="form-main-date" value="${today}" />
        </div>
        <div class="form-group">
          <label>Tipo Intervento</label>
          <select id="form-main-type" onchange="document.getElementById('form-main-eq-group').style.display = (this.value === 'Attrezzature' ? 'block' : 'none')">
            <option value="Struttura e Ambiente">Struttura e Ambiente</option>
            <option value="Attrezzature">Attrezzature</option>
          </select>
        </div>
        <div id="form-main-eq-group" class="form-group" style="display: none;">
          <label>Seleziona Attrezzatura</label>
          <select id="form-main-equipment">
            <option value="">-- Scegli Attrezzatura --</option>
            ${equipments.map(e => `<option value="${e.name}">${e.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Descrizione Manutenzione</label>
          <textarea id="form-main-description" rows="3" placeholder="Descrivi l'intervento effettuato..."></textarea>
        </div>
        <div class="form-group">
          <label>Modalità</label>
          <select id="form-main-category" onchange="document.getElementById('form-main-company-group').style.display = (this.value === 'Extraordinary' ? 'block' : 'none')">
            <option value="Ordinary">Ordinaria (Personale Interno)</option>
            <option value="Extraordinary">Straordinaria (Ditta Esterna)</option>
          </select>
        </div>
        <div id="form-main-company-group" class="form-group" style="display: none;">
          <label>Nome Ditta Esterna</label>
          <input type="text" id="form-main-company" placeholder="Nome ditta..." />
        </div>
        <div class="form-group">
          <label>Responsabile Procedura</label>
          <select id="form-main-operator">
            <option value="">-- Seleziona Responsabile --</option>
            ${eligibleOperators.map(w => `<option value="${w.firstName} ${w.lastName}">${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('form-main-date').value;
        const typeIntervention = document.getElementById('form-main-type').value;
        const equipment = document.getElementById('form-main-equipment').value;
        const description = document.getElementById('form-main-description').value;
        const category = document.getElementById('form-main-category').value;
        const externalCompany = document.getElementById('form-main-company').value;
        const operator = document.getElementById('form-main-operator').value;

        if (!operator) { alert("Seleziona il responsabile."); return; }
        if (typeIntervention === 'Attrezzature' && !equipment) { alert("Seleziona l'attrezzatura."); return; }

        Store.addItem('haccp_maintenance', {
          date,
          subject: typeIntervention === 'Attrezzature' ? equipment : 'Ambienti/Strutture',
          typeIntervention,
          description,
          type: category,
          externalCompany: category === 'Extraordinary' ? externalCompany : '',
          operator
        });

        this.closeModal();
        this.renderView('haccp_maintenance');
      };
    }

    if (type === 'edit-hygiene') {
      const recId = extraArg;
      const r = Store.data.haccp_hygiene.find(x => x.id === recId);
      if(!r) return;

      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Modifica Verifica Igiene';
      const workers = Store.data.workers || [];
      const eligibleOperators = App.getEligibleOperators('igiene');
      const checklistItems = [
        "Indumenti da lavoro",
        "Calzature",
        "Copricapo idoneo ed indossato correttamente",
        "Assenza di ferite non protette",
        "Unghie lunghe, non pulite e/o con smalto",
        "Comportamenti impropri (es. fumo, cellulare)",
        "Assenza di gioielli (anelli, bracciali, ecc.)",
        "Igiene delle mani corretta",
        "Manipolazione alimenti corretta"
      ];

      body.innerHTML = `
        <div class="form-group">
          <label>Data Controllo</label>
          <input type="date" id="form-hyg-date" value="${r.date}" />
        </div>
        <div class="form-group">
          <label>Responsabile Controllo (Firma)</label>
          <select id="form-hyg-operator">
            <option value="">-- Seleziona Operatore --</option>
            ${eligibleOperators.map(w => `<option value="${w.firstName} ${w.lastName}" ${r.operator === (w.firstName + ' ' + w.lastName) ? 'selected' : ''}>${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Lavoratori Controllati</label>
          <select id="form-hyg-workers" multiple style="height: 100px; padding: 5px;">
            <option value="all" ${r.workerNames === 'Tutti i lavoratori' ? 'selected' : ''}>TUTTI I LAVORATORI</option>
            ${workers.map(w => `<option value="${w.id}" ${(r.workerIds || []).includes(w.id) && r.workerNames !== 'Tutti i lavoratori' ? 'selected' : ''}>${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
          <p style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">Ctrl+Click per selezione multipla.</p>
        </div>

        <h4 style="margin-top: 20px; margin-bottom: 10px;">Checklist Analitica</h4>
        <div class="hygiene-checklist" style="background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
          ${checklistItems.map((item, idx) => {
            const savedCheck = r.checks ? r.checks.find(c => c.label === item) : null;
            const status = savedCheck ? savedCheck.status : 'C';
            const corrAction = savedCheck ? (savedCheck.correctiveAction || '') : '';
            return `
              <div class="checklist-row-container" style="border-bottom: 1px solid rgba(0,0,0,0.05); padding: 8px 0;">
                <div class="checklist-row" style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 13px; flex: 1; padding-right: 10px;">${item}</span>
                  <div class="toggle-group" style="display: flex; gap: 5px;">
                    <button type="button" class="btn-toggle-hyg" id="btn-hyg-${idx}-C" onclick="App.setHygValue(${idx}, 'C')" style="padding: 5px 12px; border-radius: 4px; border: 1px solid var(--border-color); background: ${status === 'C' ? 'var(--success-color)' : 'white'}; color: ${status === 'C' ? 'white' : 'var(--text-primary)'}; cursor: pointer; font-weight: bold; transition: 0.2s;">C</button>
                    <button type="button" class="btn-toggle-hyg" id="btn-hyg-${idx}-NC" onclick="App.setHygValue(${idx}, 'NC')" style="padding: 5px 10px; border-radius: 4px; border: 1px solid var(--border-color); background: ${status === 'NC' ? 'var(--danger-color)' : 'white'}; color: ${status === 'NC' ? 'white' : 'var(--text-primary)'}; cursor: pointer; font-weight: bold; transition: 0.2s;">NC</button>
                  </div>
                  <input type="hidden" id="hyg-item-${idx}" value="${status}" />
                </div>
                <div id="hyg-corr-container-${idx}" style="display: ${status === 'NC' ? 'block' : 'none'}; margin-top: 8px; padding-left: 10px;">
                  <input type="text" id="hyg-corr-${idx}" value="${corrAction}" placeholder="Azione correttiva per ${item}..." style="width: 100%; font-size: 12px; padding: 6px; border: 1px solid var(--danger-color); border-radius: 4px; background: #fff5f5;" />
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="form-group" style="margin-top: 15px;">
          <label>Note Generali</label>
          <textarea id="form-hyg-notes" rows="2" placeholder="Note aggiuntive...">${r.notes || ''}</textarea>
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('form-hyg-date').value;
        const operator = document.getElementById('form-hyg-operator').value;
        const workerSelect = document.getElementById('form-hyg-workers');
        const selectedWorkerIds = Array.from(workerSelect.selectedOptions).map(opt => opt.value);
        const notes = document.getElementById('form-hyg-notes').value;
        
        if(!operator) { alert("Seleziona il responsabile del controllo."); return; }

        let finalWorkerIds = [];
        let finalWorkerNames = "";

        if (selectedWorkerIds.includes('all')) {
          finalWorkerIds = workers.map(w => w.id);
          finalWorkerNames = "Tutti i lavoratori";
        } else {
          finalWorkerIds = selectedWorkerIds;
          finalWorkerNames = finalWorkerIds.map(id => {
            const w = workers.find(x => x.id === id);
            return w ? `${w.firstName} ${w.lastName}` : 'N/D';
          }).join(', ');
        }

        const checks = checklistItems.map((label, idx) => ({
          label,
          status: document.getElementById(`hyg-item-${idx}`).value,
          correctiveAction: document.getElementById(`hyg-item-${idx}`).value === 'NC' ? document.getElementById(`hyg-corr-${idx}`).value : ''
        }));

        const isNC = checks.some(c => c.status === 'NC');

        Store.updateItem('haccp_hygiene', recId, {
          date,
          operator,
          workerIds: finalWorkerIds,
          workerNames: finalWorkerNames,
          checks,
          status: isNC ? 'NON CONFORME' : 'CONFORME',
          notes
        });

        this.closeModal();
        this.renderView(this.currentView);
      };
    }

    if (type === 'recipe') {
      title.innerHTML = '<i class="ph-fill ph-book-bookmark"></i> Nuova Ricetta';
      const ingredients = Store.data.ingredients || [];
      App.tempRecipeIngredients = [];
      
      body.innerHTML = `
        <div class="form-group">
          <label>Nome della Ricetta</label>
          <input type="text" id="form-recipe-name" placeholder="Es. Torta di Mele" style="font-size: 16px; font-weight: 600;" />
        </div>
        
        <div style="background: rgba(37, 99, 235, 0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(37, 99, 235, 0.1); margin-bottom: 20px;">
          <h4 style="margin-bottom: 12px; font-size: 13px; color: var(--primary-color); display: flex; align-items: center; gap: 6px;">
            <i class="ph ph-plus-circle"></i> Componi la Ricetta
          </h4>
          <div class="form-group" style="margin-bottom: 10px;">
            <label style="font-size: 11px; text-transform: uppercase;">Seleziona Ingrediente</label>
            <div style="display: flex; gap: 5px;">
              <select id="form-recipe-ing" style="background: white; flex: 1;">
                <option value="">-- Scegli tra i tuoi ingredienti --</option>
                ${ingredients.map(i => `<option value="${i.id}">${i.name} (${i.unit})</option>`).join('')}
              </select>
              <button type="button" class="btn-secondary" onclick="document.getElementById('quick-ing-form').style.display = 'block'; this.style.display='none'" style="width: auto; padding: 0 10px; height: 42px; font-size: 11px;">
                <i class="ph ph-plus"></i> Nuovo
              </button>
            </div>
          </div>

          <!-- Quick Ingredient Form -->
          <div id="quick-ing-form" style="display: none; background: white; padding: 12px; border-radius: 8px; border: 1px dashed var(--primary-color); margin-bottom: 15px;">
            <h5 style="margin-bottom: 10px; font-size: 12px; color: var(--primary-color);">Aggiunta Rapida Ingrediente</h5>
            <div class="form-group" style="margin-bottom: 8px;">
              <input type="text" id="quick-ing-name" placeholder="Nome ingrediente..." style="font-size: 13px; padding: 8px;" />
            </div>
            <div style="display: flex; gap: 8px;">
              <select id="quick-ing-unit" style="font-size: 13px; padding: 8px; flex: 1;">
                <option value="kg">kg</option>
                <option value="lt">lt</option>
                <option value="pz">pz</option>
                <option value="gr">gr</option>
              </select>
              <button type="button" class="btn-primary" onclick="App.saveQuickIngredient()" style="width: auto; padding: 0 15px; height: 35px; font-size: 12px;">Salva</button>
              <button type="button" class="btn-secondary" onclick="document.getElementById('quick-ing-form').style.display = 'none'; document.querySelector('[onclick*=\'quick-ing-form\']').style.display='block'" style="width: auto; padding: 0 10px; height: 35px; font-size: 12px;">X</button>
            </div>
          </div>
          <div style="display: flex; gap: 10px; align-items: flex-end;">
            <div style="flex: 1;">
              <label style="font-size: 11px; text-transform: uppercase;">Quantità</label>
              <input type="number" id="form-recipe-qty" step="0.01" placeholder="0,00" style="background: white;" />
            </div>
            <button type="button" class="btn-primary" onclick="App.addIngredientToRecipe()" style="width: auto; padding: 0 20px; height: 42px;">
              <i class="ph ph-plus"></i> Aggiungi
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Peso Totale Ricetta (kg)</label>
          <input type="number" id="form-recipe-weight" step="0.001" placeholder="0,000" />
        </div>

        <div class="form-group">
          <label>Procedimento / Istruzioni</label>
          <textarea id="form-recipe-procedure" rows="4" placeholder="Descrivi qui come preparare la ricetta..."></textarea>
        </div>

        <h4 style="margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Ingredienti in Ricetta:</h4>
        <div id="recipe-ingredients-list" style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 5px;">
           <p style="text-align: center; padding: 20px; color: var(--text-secondary); font-style: italic; font-size: 13px;">Nessun ingrediente ancora aggiunto.</p>
        </div>
      `;

      saveBtn.onclick = () => {
        const name = document.getElementById('form-recipe-name').value.trim();
        const totalWeight = document.getElementById('form-recipe-weight').value;
        const procedure = document.getElementById('form-recipe-procedure').value.trim();

        if(!name) { alert("Inserisci il nome della ricetta."); return; }
        if(App.tempRecipeIngredients.length === 0) { alert("Aggiungi almeno un ingrediente alla ricetta."); return; }
        
        Store.addItem('recipes', {
          name,
          totalWeight,
          procedure,
          ingredients: App.tempRecipeIngredients.map(item => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity
          }))
        });
        this.closeModal();
        this.renderView('trace_recipes');
      };
    }

    if (type === 'supplier') {
      title.innerHTML = '<i class="ph-fill ph-truck"></i> Nuovo Fornitore';
      body.innerHTML = `
        <div class="form-group"><label>Ragione Sociale</label><input type="text" id="sup-name" placeholder="Nome Azienda" /></div>
        <div class="form-group"><label>Partita IVA</label><input type="text" id="sup-vat" placeholder="01234567890" /></div>
        <div class="form-group"><label>Sede Legale</label><input type="text" id="sup-legal" placeholder="Via..." /></div>
        <div class="form-group"><label>Sede Operativa</label><input type="text" id="sup-office" placeholder="Via..." /></div>
        <div class="form-group"><label>PEC</label><input type="email" id="sup-pec" placeholder="azienda@pec.it" /></div>
        <div class="form-group"><label>Responsabile Azienda</label><input type="text" id="sup-manager" placeholder="Nome e Cognome" /></div>
        <div class="form-group"><label>Numero di Telefono</label><input type="tel" id="sup-phone" placeholder="012345678" /></div>
        <div class="form-group"><label>Email</label><input type="email" id="sup-email" placeholder="info@azienda.it" /></div>
        <div class="checkbox-group" style="margin-top: 15px;">
          <input type="checkbox" id="sup-inactive" />
          <label for="sup-inactive">Fornitore non più utilizzato</label>
        </div>

        <h4 style="margin-top: 20px; margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Ingredienti Forniti</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
          ${(Store.data.ingredients || []).map(i => `
            <div class="checkbox-group" style="margin-bottom: 5px;">
              <input type="checkbox" class="sup-ing-check" value="${i.id}" id="sup-ing-${i.id}" />
              <label for="sup-ing-${i.id}" style="font-size: 12px; text-transform: none;">${i.name}</label>
            </div>
          `).join('')}
        </div>
      `;
      saveBtn.onclick = () => {
        const name = document.getElementById('sup-name').value.trim();
        if(!name) { alert("Inserisci la Ragione Sociale."); return; }
        const providedIngredients = Array.from(document.querySelectorAll('.sup-ing-check:checked')).map(cb => cb.value);

        Store.addItem('suppliers', {
          name,
          vat: document.getElementById('sup-vat').value.trim(),
          legalAddress: document.getElementById('sup-legal').value.trim(),
          officeAddress: document.getElementById('sup-office').value.trim(),
          pec: document.getElementById('sup-pec').value.trim(),
          manager: document.getElementById('sup-manager').value.trim(),
          phone: document.getElementById('sup-phone').value.trim(),
          email: document.getElementById('sup-email').value.trim(),
          inactive: document.getElementById('sup-inactive').checked,
          providedIngredients
        });
        this.closeModal();
        this.renderView('trace_suppliers');
      };
    }

    if (type === 'edit-supplier') {
      const supId = extraArg;
      const s = Store.data.suppliers.find(x => x.id === supId);
      if(!s) return;
      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Modifica Fornitore';
      body.innerHTML = `
        <div class="form-group"><label>Ragione Sociale</label><input type="text" id="edit-sup-name" value="${s.name || ''}" /></div>
        <div class="form-group"><label>Partita IVA</label><input type="text" id="edit-sup-vat" value="${s.vat || ''}" /></div>
        <div class="form-group"><label>Sede Legale</label><input type="text" id="edit-sup-legal" value="${s.legalAddress || ''}" /></div>
        <div class="form-group"><label>Sede Operativa</label><input type="text" id="edit-sup-office" value="${s.officeAddress || ''}" /></div>
        <div class="form-group"><label>PEC</label><input type="email" id="edit-sup-pec" value="${s.pec || ''}" /></div>
        <div class="form-group"><label>Responsabile Azienda</label><input type="text" id="edit-sup-manager" value="${s.manager || ''}" /></div>
        <div class="form-group"><label>Numero di Telefono</label><input type="tel" id="edit-sup-phone" value="${s.phone || ''}" /></div>
        <div class="form-group"><label>Email</label><input type="email" id="edit-sup-email" value="${s.email || ''}" /></div>
        <div class="checkbox-group" style="margin-top: 15px;">
          <input type="checkbox" id="edit-sup-inactive" ${s.inactive ? 'checked' : ''} />
          <label for="edit-sup-inactive">Fornitore non più utilizzato</label>
        </div>

        <h4 style="margin-top: 20px; margin-bottom: 10px; font-size: 13px; color: var(--text-secondary);">Ingredienti Forniti</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
          ${(Store.data.ingredients || []).map(i => `
            <div class="checkbox-group" style="margin-bottom: 5px;">
              <input type="checkbox" class="edit-sup-ing-check" value="${i.id}" id="edit-sup-ing-${i.id}" ${(s.providedIngredients || []).includes(i.id) ? 'checked' : ''} />
              <label for="edit-sup-ing-${i.id}" style="font-size: 12px; text-transform: none;">${i.name}</label>
            </div>
          `).join('')}
        </div>
      `;
      saveBtn.onclick = () => {
        const name = document.getElementById('edit-sup-name').value.trim();
        if(!name) { alert("Inserisci la Ragione Sociale."); return; }
        const providedIngredients = Array.from(document.querySelectorAll('.edit-sup-ing-check:checked')).map(cb => cb.value);

        Store.updateItem('suppliers', supId, {
          name,
          vat: document.getElementById('edit-sup-vat').value.trim(),
          legalAddress: document.getElementById('edit-sup-legal').value.trim(),
          officeAddress: document.getElementById('edit-sup-office').value.trim(),
          pec: document.getElementById('edit-sup-pec').value.trim(),
          manager: document.getElementById('edit-sup-manager').value.trim(),
          phone: document.getElementById('edit-sup-phone').value.trim(),
          email: document.getElementById('edit-sup-email').value.trim(),
          inactive: document.getElementById('edit-sup-inactive').checked,
          providedIngredients
        });
        this.closeModal();
        this.renderView('trace_supplier_detail');
      };
    }

    if (type === 'edit-recipe') {
      const recId = extraArg;
      const r = Store.data.recipes.find(x => x.id === recId);
      if(!r) return;

      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Modifica Ricetta';
      const ingredients = Store.data.ingredients || [];
      App.tempRecipeIngredients = r.ingredients.map(ri => {
        const ing = ingredients.find(i => i.id === ri.ingredientId);
        return {
          ingredientId: ri.ingredientId,
          name: ing ? ing.name : 'Sconosciuto',
          unit: ing ? ing.unit : '?',
          quantity: ri.quantity
        };
      });
      
      body.innerHTML = `
        <div class="form-group">
          <label>Nome della Ricetta</label>
          <input type="text" id="edit-recipe-name" value="${r.name}" style="font-size: 16px; font-weight: 600;" />
        </div>
        
        <div style="background: rgba(37, 99, 235, 0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(37, 99, 235, 0.1); margin-bottom: 20px;">
          <h4 style="margin-bottom: 12px; font-size: 13px; color: var(--primary-color);">Aggiungi/Modifica Ingredienti</h4>
          <div class="form-group" style="margin-bottom: 10px;">
            <div style="display: flex; gap: 5px;">
              <select id="form-recipe-ing" style="flex: 1;">
                <option value="">-- Scegli Ingrediente --</option>
                ${ingredients.map(i => `<option value="${i.id}">${i.name} (${i.unit})</option>`).join('')}
              </select>
              <button type="button" class="btn-secondary" onclick="document.getElementById('quick-ing-form-edit').style.display = 'block'; this.style.display='none'" style="width: auto; padding: 0 10px; height: 42px; font-size: 11px;">
                <i class="ph ph-plus"></i> Nuovo
              </button>
            </div>
          </div>

          <!-- Quick Ingredient Form -->
          <div id="quick-ing-form-edit" style="display: none; background: white; padding: 12px; border-radius: 8px; border: 1px dashed var(--primary-color); margin-bottom: 15px;">
            <h5 style="margin-bottom: 10px; font-size: 12px; color: var(--primary-color);">Aggiunta Rapida Ingrediente</h5>
            <div class="form-group" style="margin-bottom: 8px;">
              <input type="text" id="quick-ing-name-edit" placeholder="Nome ingrediente..." style="font-size: 13px; padding: 8px;" />
            </div>
            <div style="display: flex; gap: 8px;">
              <select id="quick-ing-unit-edit" style="font-size: 13px; padding: 8px; flex: 1;">
                <option value="kg">kg</option>
                <option value="lt">lt</option>
                <option value="pz">pz</option>
                <option value="gr">gr</option>
              </select>
              <button type="button" class="btn-primary" onclick="App.saveQuickIngredient(true)" style="width: auto; padding: 0 15px; height: 35px; font-size: 12px;">Salva</button>
              <button type="button" class="btn-secondary" onclick="document.getElementById('quick-ing-form-edit').style.display = 'none'; document.querySelector('[onclick*=\'quick-ing-form-edit\']').style.display='block'" style="width: auto; padding: 0 10px; height: 35px; font-size: 12px;">X</button>
            </div>
          </div>

          <div style="display: flex; gap: 10px; align-items: flex-end;">
            <div style="flex: 1;">
              <input type="number" id="form-recipe-qty" step="0.01" placeholder="Quantità" />
            </div>
            <button type="button" class="btn-primary" onclick="App.addIngredientToRecipe()" style="width: auto; padding: 0 20px; height: 42px;">Aggiungi</button>
          </div>
        </div>

        <div id="recipe-ingredients-list" style="background: white; border: 1px solid var(--border-color); border-radius: 8px; padding: 5px; margin-bottom: 20px;"></div>

        <div class="form-group">
          <label>Peso Totale Ricetta (kg)</label>
          <input type="number" id="edit-recipe-weight" step="0.001" value="${r.totalWeight || ''}" />
        </div>

        <div class="form-group">
          <label>Procedimento / Istruzioni</label>
          <textarea id="edit-recipe-procedure" rows="4">${r.procedure || ''}</textarea>
        </div>
      `;

      this.renderTempIngredients();

      saveBtn.onclick = () => {
        const name = document.getElementById('edit-recipe-name').value.trim();
        const totalWeight = document.getElementById('edit-recipe-weight').value;
        const procedure = document.getElementById('edit-recipe-procedure').value.trim();

        if(!name) { alert("Inserisci il nome."); return; }
        
        Store.updateItem('recipes', recId, {
          name,
          totalWeight,
          procedure,
          ingredients: App.tempRecipeIngredients.map(item => ({
            ingredientId: item.ingredientId,
            quantity: item.quantity
          }))
        });
        this.closeModal();
        this.renderView('trace_recipe_detail');
      };
    }

    if (type === 'ingredient') {
      title.innerHTML = '<i class="ph-fill ph-package"></i> Nuovo Ingrediente';
      const allergenList = [
        "Cereali (Glutine)", "Crostacei", "Uova", "Pesce", "Arachidi", "Soia", "Latte",
        "Frutta a guscio", "Sedano", "Senape", "Sesamo", "Solfiti", "Lupini", "Molluschi"
      ];

      body.innerHTML = `
        <div class="form-group">
          <label>Nome Ingrediente</label>
          <input type="text" id="ing-name" placeholder="Es. Farina 00" />
        </div>
        <div class="form-group">
          <label>Unità di Misura</label>
          <select id="ing-unit">
            <option value="kg">kg</option>
            <option value="lt">lt</option>
            <option value="pz">pz</option>
            <option value="gr">gr</option>
          </select>
        </div>
        <div class="form-group">
          <label>Scorta Minima</label>
          <input type="number" id="ing-min" value="5" step="0.1" />
        </div>
        
        <h4 style="margin-bottom: 10px;">Allergeni Presenti</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
          ${allergenList.map(a => `
            <div class="checkbox-group" style="margin-bottom: 5px;">
              <input type="checkbox" class="allergen-check" value="${a}" id="all-${a}" />
              <label for="all-${a}" style="font-size: 12px; text-transform: none;">${a}</label>
            </div>
          `).join('')}
        </div>
      `;

      saveBtn.onclick = () => {
        const name = document.getElementById('ing-name').value.trim();
        const unit = document.getElementById('ing-unit').value;
        const min = parseFloat(document.getElementById('ing-min').value) || 0;
        const allergens = Array.from(document.querySelectorAll('.allergen-check:checked')).map(cb => cb.value);

        if(!name) { alert("Inserisci il nome."); return; }

        Store.addItem('ingredients', {
          name, unit, minStock: min, allergens, stock: 0
        });

        this.closeModal();
        this.renderView('trace_ingredients');
      };
    }

    if (type === 'edit-ingredient') {
      const ingId = extraArg;
      const ing = Store.data.ingredients.find(x => x.id === ingId);
      if(!ing) return;

      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Modifica Ingrediente';
      const allergenList = [
        "Cereali (Glutine)", "Crostacei", "Uova", "Pesce", "Arachidi", "Soia", "Latte",
        "Frutta a guscio", "Sedano", "Senape", "Sesamo", "Solfiti", "Lupini", "Molluschi"
      ];

      body.innerHTML = `
        <div class="form-group">
          <label>Nome Ingrediente</label>
          <input type="text" id="edit-ing-name" value="${ing.name}" />
        </div>
        <div class="form-group">
          <label>Unità di Misura</label>
          <select id="edit-ing-unit">
            <option value="kg" ${ing.unit === 'kg' ? 'selected' : ''}>kg</option>
            <option value="lt" ${ing.unit === 'lt' ? 'selected' : ''}>lt</option>
            <option value="pz" ${ing.unit === 'pz' ? 'selected' : ''}>pz</option>
            <option value="gr" ${ing.unit === 'gr' ? 'selected' : ''}>gr</option>
          </select>
        </div>
        <div class="form-group">
          <label>Scorta Minima</label>
          <input type="number" id="edit-ing-min" value="${ing.minStock || 5}" step="0.1" />
        </div>
        
        <h4 style="margin-bottom: 10px;">Allergeni Presenti</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
          ${allergenList.map(a => `
            <div class="checkbox-group" style="margin-bottom: 5px;">
              <input type="checkbox" class="edit-allergen-check" value="${a}" id="edit-all-${a}" ${(ing.allergens || []).includes(a) ? 'checked' : ''} />
              <label for="edit-all-${a}" style="font-size: 12px; text-transform: none;">${a}</label>
            </div>
          `).join('')}
        </div>
      `;

      saveBtn.onclick = () => {
        const name = document.getElementById('edit-ing-name').value.trim();
        const unit = document.getElementById('edit-ing-unit').value;
        const min = parseFloat(document.getElementById('edit-ing-min').value) || 0;
        const allergens = Array.from(document.querySelectorAll('.edit-allergen-check:checked')).map(cb => cb.value);

        if(!name) { alert("Inserisci il nome."); return; }

        Store.updateItem('ingredients', ingId, {
          name, unit, minStock: min, allergens
        });

        this.closeModal();
        this.renderView('trace_ingredient_detail');
      };
    }

    if (type === 'new-temp-equipment') {
      title.innerHTML = '<i class="ph-fill ph-thermometer-cold"></i> Nuova Attrezzatura';
      const environments = Store.data.work_environments || [];
      body.innerHTML = `
        <div class="form-group">
          <label>Nome Attrezzatura</label>
          <input type="text" id="form-eq-name" placeholder="Es. Frigo 1" />
        </div>
        <div class="form-group">
          <label>Tipologia Attrezzatura</label>
          <select id="form-eq-type">
            <option value="Frigorifero">Frigorifero</option>
            <option value="Congelatore">Congelatore</option>
            <option value="Abbattitore">Abbattitore</option>
            <option value="Cella Frigo">Cella Frigo</option>
            <option value="Banco Refrigerato">Banco Refrigerato</option>
            <option value="Freezer a pozzetto">Freezer a pozzetto</option>
            <option value="Frigo Espositore">Frigo Espositore</option>
          </select>
        </div>
        <div class="form-group">
          <label>Ubicazione</label>
          <select id="form-eq-location">
            ${environments.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
          </select>
        </div>
        <div style="display: flex; gap: 10px;">
          <div class="form-group" style="flex: 1;">
            <label>Temp. Min Critica (°C)</label>
            <input type="number" step="0.1" id="form-eq-min" value="0" />
          </div>
          <div class="form-group" style="flex: 1;">
            <label>Temp. Max Critica (°C)</label>
            <input type="number" step="0.1" id="form-eq-max" value="4" />
          </div>
        </div>
        </div>
      `;
      saveBtn.onclick = () => {
        const envId = document.getElementById('form-eq-location').value;
        const envName = environments.find(e => e.id === envId)?.name || '';
        Store.addItem('haccp_temp_equipments', {
          name: document.getElementById('form-eq-name').value,
          type: document.getElementById('form-eq-type').value,
          locationId: envId,
          locationName: envName,
          minTemp: parseFloat(document.getElementById('form-eq-min').value),
          maxTemp: parseFloat(document.getElementById('form-eq-max').value)
        });
        this.closeModal();
        this.renderView(this.currentView);
      };
    }
    
    if (type === 'filter-san') {
      title.innerHTML = '<i class="ph-fill ph-calendar"></i> Filtra Sanificazione';
      body.innerHTML = `
        <div class="form-group">
          <label>Da Data</label>
          <input type="date" id="filter-san-from" value="${App.sanFilterFrom || ''}" />
        </div>
        <div class="form-group">
          <label>A Data</label>
          <input type="date" id="filter-san-to" value="${App.sanFilterTo || ''}" />
        </div>
      `;
      saveBtn.onclick = () => {
        App.sanFilterFrom = document.getElementById('filter-san-from').value;
        App.sanFilterTo = document.getElementById('filter-san-to').value;
        this.closeModal();
        this.renderView('haccp_sanitation');
      };
    }

    if (type === 'filter-hyg') {
      title.innerHTML = '<i class="ph-fill ph-calendar"></i> Filtra Igiene';
      body.innerHTML = `
        <div class="form-group">
          <label>Da Data</label>
          <input type="date" id="filter-hyg-from" value="${App.hygFilterFrom || ''}" />
        </div>
        <div class="form-group">
          <label>A Data</label>
          <input type="date" id="filter-hyg-to" value="${App.hygFilterTo || ''}" />
        </div>
      `;
      saveBtn.onclick = () => {
        App.hygFilterFrom = document.getElementById('filter-hyg-from').value;
        App.hygFilterTo = document.getElementById('filter-hyg-to').value;
        this.closeModal();
        this.renderView('haccp_hygiene');
      };
    }

    if (type === 'filter-temp') {
      title.innerHTML = '<i class="ph-fill ph-calendar"></i> Filtra Periodo';
      const now = new Date();
      const currentMonth = now.toISOString().slice(0,7);
      
      body.innerHTML = `
        <div class="form-group">
          <label>Da Data</label>
          <input type="date" id="filter-temp-from" value="${App.tempFilterFrom || currentMonth + '-01'}" />
        </div>
        <div class="form-group">
          <label>A Data</label>
          <input type="date" id="filter-temp-to" value="${App.tempFilterTo || new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]}" />
        </div>
      `;
      saveBtn.onclick = () => {
        App.tempFilterFrom = document.getElementById('filter-temp-from').value;
        App.tempFilterTo = document.getElementById('filter-temp-to').value;
        this.closeModal();
        this.renderView('haccp_temp_detail');
      };
    }

    if (type === 'edit-temperature') {
      const recId = extraArg;
      const rec = Store.data.haccp_temperature.find(r => r.id === recId);
      if(!rec) return;
      const eq = Store.data.haccp_temp_equipments.find(e => e.id === rec.equipmentId);
      
      title.innerHTML = `<i class="ph-fill ph-pencil"></i> Modifica Controllo: ${eq.name}`;
      const workers = Store.data.workers || [];

      body.innerHTML = `
        <div class="form-group">
          <label>Data Controllo</label>
          <input type="date" id="form-chk-date" value="${rec.date}" />
        </div>
        <div class="form-group">
          <label>Ora Controllo</label>
          <input type="time" id="form-chk-time" value="${rec.time || ''}" />
        </div>
        <div class="form-group">
          <label>Operatore Controllo</label>
          <select id="form-chk-operator">
            <option value="">-- Seleziona Operatore --</option>
            ${App.getEligibleOperators('temperature').map(w => `<option value="${w.firstName} ${w.lastName}" ${rec.operator === (w.firstName + ' ' + w.lastName) ? 'selected' : ''}>${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Azione</label>
          <select id="form-chk-action" onchange="App.toggleTempCheckForm(this.value)">
            <option value="rilevamento" ${rec.type === 'rilevamento' ? 'selected' : ''}>Rilevamento Temperatura</option>
            <option value="giustifica" ${rec.type === 'giustifica' ? 'selected' : ''}>Giustifica Mancato Controllo</option>
          </select>
        </div>
        
        <div id="chk-rilevamento-section" style="display: ${rec.type === 'rilevamento' ? 'block' : 'none'};">
          <div class="form-group">
            <label>Temperatura Rilevata (°C) (Range: ${eq.minTemp}°C - ${eq.maxTemp}°C)</label>
            <input type="number" step="0.1" id="form-chk-temp" value="${rec.temp || ''}" oninput="App.evaluateTempCheck('${eq.minTemp}', '${eq.maxTemp}')" />
          </div>
          <div id="chk-feedback" style="margin-bottom: 15px; font-size: 16px;"></div>
          
          <div id="chk-corrective-section" style="display: ${rec.status === 'NON CONFORME' ? 'block' : 'none'};" class="form-group">
            <label>Azione Correttiva</label>
            <select id="form-chk-corrective">
              <option value="Porta richiusa" ${rec.correctiveAction === 'Porta richiusa' ? 'selected' : ''}>Porta richiusa</option>
              <option value="Merce sostata in altra attrezzatura idonea" ${rec.correctiveAction === 'Merce sostata in altra attrezzatura idonea' ? 'selected' : ''}>Merce sostata in altra attrezzatura idonea</option>
              <option value="Sbrinamento avviato" ${rec.correctiveAction === 'Sbrinamento avviato' ? 'selected' : ''}>Sbrinamento avviato</option>
              <option value="Chiamato tecnico" ${rec.correctiveAction === 'Chiamato tecnico' ? 'selected' : ''}>Chiamato tecnico</option>
              <option value="Monitoraggio ogni 2 ore" ${rec.correctiveAction === 'Monitoraggio ogni 2 ore' ? 'selected' : ''}>Monitoraggio ogni 2 ore</option>
            </select>
          </div>
        </div>

        <div id="chk-giustifica-section" style="display: ${rec.type === 'giustifica' ? 'block' : 'none'};">
          <div class="form-group">
            <label>Descrizione / Motivazione</label>
            <textarea id="form-chk-justification" rows="3">${rec.justification || ''}</textarea>
          </div>
        </div>
      `;

      saveBtn.onclick = () => {
        const action = document.getElementById('form-chk-action').value;
        const date = document.getElementById('form-chk-date').value;
        const time = document.getElementById('form-chk-time').value;
        const operator = document.getElementById('form-chk-operator').value;

        if (!operator) { alert("Seleziona l'operatore"); return; }

        if (action === 'rilevamento') {
          const temp = parseFloat(document.getElementById('form-chk-temp').value);
          if (isNaN(temp)) { alert("Inserire temperatura"); return; }
          
          const isConform = temp >= eq.minTemp && temp <= eq.maxTemp;
          const corrective = isConform ? '' : document.getElementById('form-chk-corrective').value;
          
          Store.updateItem('haccp_temperature', recId, {
            date, time, temp, operator,
            status: isConform ? 'CONFORME' : 'NON CONFORME',
            correctiveAction: corrective,
            justification: '',
            type: 'rilevamento'
          });
        } else {
          const justification = document.getElementById('form-chk-justification').value;
          Store.updateItem('haccp_temperature', recId, {
            date, time, operator,
            status: 'GIUSTIFICATO',
            justification,
            temp: undefined,
            correctiveAction: '',
            type: 'giustifica'
          });
        }
        
        this.closeModal();
        this.renderView(this.currentView);
      };

      // Trigger initial evaluation if it's a measurement
      if (rec.type === 'rilevamento' && rec.temp !== undefined) {
         setTimeout(() => App.evaluateTempCheck(eq.minTemp, eq.maxTemp), 100);
      }
    }

    if (type === 'check-temperature') {
      const eqId = extraArg;
      const eq = Store.data.haccp_temp_equipments.find(e => e.id === eqId);
      title.innerHTML = `<i class="ph-fill ph-thermometer"></i> Controllo: ${eq.name}`;
      
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toTimeString().slice(0,5);
      const workers = Store.data.workers || [];

      body.innerHTML = `
        <div class="form-group">
          <label>Data Controllo</label>
          <input type="date" id="form-chk-date" value="${today}" />
        </div>
        <div class="form-group">
          <label>Ora Controllo</label>
          <input type="time" id="form-chk-time" value="${nowTime}" />
        </div>
        <div class="form-group">
          <label>Operatore Controllo</label>
          <select id="form-chk-operator">
            <option value="">-- Seleziona Operatore --</option>
            ${App.getEligibleOperators('temperature').map(w => `<option value="${w.firstName} ${w.lastName}">${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Azione</label>
          <select id="form-chk-action" onchange="App.toggleTempCheckForm(this.value)">
            <option value="rilevamento">Rilevamento Temperatura</option>
            <option value="giustifica">Giustifica Mancato Controllo</option>
          </select>
        </div>
        
        <div id="chk-rilevamento-section">
          <div class="form-group">
            <label>Temperatura Rilevata (°C) (Range: ${eq.minTemp}°C - ${eq.maxTemp}°C)</label>
            <input type="number" step="0.1" id="form-chk-temp" oninput="App.evaluateTempCheck('${eq.minTemp}', '${eq.maxTemp}')" />
          </div>
          <div id="chk-feedback" style="margin-bottom: 15px; font-size: 16px;"></div>
          
          <div id="chk-corrective-section" style="display:none;" class="form-group">
            <label>Azione Correttiva</label>
            <select id="form-chk-corrective">
              <option value="Porta richiusa">Porta richiusa</option>
              <option value="Merce sostata in altra attrezzatura idonea">Merce sostata in altra attrezzatura idonea</option>
              <option value="Sbrinamento avviato">Sbrinamento avviato</option>
              <option value="Chiamato tecnico">Chiamato tecnico</option>
              <option value="Monitoraggio ogni 2 ore">Monitoraggio ogni 2 ore</option>
            </select>
          </div>
        </div>

        <div id="chk-giustifica-section" style="display:none;">
          <div class="form-group">
            <label>Descrizione / Motivazione</label>
            <textarea id="form-chk-justification" rows="3"></textarea>
          </div>
        </div>
      `;

      saveBtn.onclick = () => {
        const action = document.getElementById('form-chk-action').value;
        const date = document.getElementById('form-chk-date').value;
        
        if (action === 'rilevamento') {
          const temp = parseFloat(document.getElementById('form-chk-temp').value);
          const time = document.getElementById('form-chk-time').value;
          const operator = document.getElementById('form-chk-operator').value;
          
          if (isNaN(temp)) { alert("Inserire temperatura"); return; }
          if (!operator) { alert("Seleziona l'operatore"); return; }
          
          const isConform = temp >= eq.minTemp && temp <= eq.maxTemp;
          const corrective = isConform ? '' : document.getElementById('form-chk-corrective').value;
          
          Store.addItem('haccp_temperature', {
            equipmentId: eq.id,
            equipmentName: eq.name,
            equipmentLocation: eq.locationName,
            equipmentRange: `${eq.minTemp}°C / ${eq.maxTemp}°C`,
            date: date,
            time: time,
            temp: temp,
            operator: operator,
            status: isConform ? 'CONFORME' : 'NON CONFORME',
            correctiveAction: corrective,
            type: 'rilevamento'
          });
          
          if (!isConform) {
            Store.addItem('haccp_noncompliance', {
              date: date,
              description: `Temperatura fuori range in ${eq.name} (${temp}°C). Ubicazione: ${eq.locationName}. Range: ${eq.minTemp}/${eq.maxTemp}.`,
              correctiveAction: corrective,
              operator: operator,
              closedAt: date
            });
          }
        } else {
          const justification = document.getElementById('form-chk-justification').value;
          const operator = document.getElementById('form-chk-operator').value;
          if (!operator) { alert("Seleziona l'operatore"); return; }

          Store.addItem('haccp_temperature', {
            equipmentId: eq.id,
            equipmentName: eq.name,
            equipmentLocation: eq.locationName,
            date: date,
            time: document.getElementById('form-chk-time').value,
            operator: operator,
            status: 'GIUSTIFICATO',
            justification: justification,
            type: 'giustifica'
          });
        }
        
        this.closeModal();
        this.renderView(this.currentView);
      };
    }
    
    if (type === 'bulk-temp') {
      title.innerHTML = '<i class="ph-fill ph-check-square"></i> Registra Tutte le Temperature';
      const equipments = Store.data.haccp_temp_equipments || [];
      const eligibleOperators = App.getEligibleOperators('temperature');
      const today = new Date().toISOString().split('T')[0];
      const time = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

      body.innerHTML = `
        <div class="form-group">
          <label>Data Registrazione</label>
          <input type="date" id="bulk-date" value="${today}" />
        </div>
        <div class="form-group">
          <label>Responsabile (Firma)</label>
          <select id="bulk-operator">
            <option value="">-- Seleziona Operatore --</option>
            ${eligibleOperators.map(w => `<option value="${w.firstName} ${w.lastName}">${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        
        <h4 style="margin-top: 20px; margin-bottom: 10px; font-size: 14px;">Attrezzature (${equipments.length})</h4>
        <div class="bulk-temp-list" style="max-height: 400px; overflow-y: auto; padding-right: 5px;">
          ${equipments.map((eq, idx) => `
            <div class="card" style="margin-bottom: 10px; padding: 12px; border: 1px solid var(--border-color); background: var(--bg-body);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-weight: 700; font-size: 14px;">${eq.name}</div>
                <div style="font-size: 11px; color: var(--text-secondary);">${eq.minTemp}°C / ${eq.maxTemp}°C</div>
              </div>
              <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" step="0.1" class="bulk-temp-input" data-eq-id="${eq.id}" placeholder="Temp." style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid var(--border-color); font-size: 16px; font-weight: bold; text-align: center;" />
                <span style="font-weight: bold; color: var(--text-secondary);">°C</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('bulk-date').value;
        const operator = document.getElementById('bulk-operator').value;
        if (!operator) { alert("Seleziona l'operatore."); return; }

        const inputs = document.querySelectorAll('.bulk-temp-input');
        let savedCount = 0;

        inputs.forEach(input => {
          const val = input.value.trim();
          if (val !== "") {
            const temp = parseFloat(val.replace(',', '.'));
            if (!isNaN(temp)) {
              const eqId = input.dataset.eqId;
              const eq = equipments.find(e => e.id === eqId);
              const isConform = temp >= eq.minTemp && temp <= eq.maxTemp;
              
              Store.addItem('haccp_temperature', {
                equipmentId: eq.id,
                equipmentName: eq.name,
                equipmentLocation: eq.locationName,
                equipmentRange: `${eq.minTemp}°C / ${eq.maxTemp}°C`,
                date: date,
                time: time,
                temp: temp,
                operator: operator,
                status: isConform ? 'CONFORME' : 'NON CONFORME',
                correctiveAction: isConform ? '' : 'Registrazione massiva fuori range',
                type: 'rilevamento'
              });

              if (!isConform) {
                Store.addItem('haccp_noncompliance', {
                  date: date,
                  description: `Temperatura fuori range in ${eq.name} (${temp}°C) durante registrazione rapida.`,
                  correctiveAction: 'Verifica immediata attrezzatura',
                  operator: operator,
                  closedAt: date
                });
              }
              savedCount++;
            }
          }
        });

        if (savedCount === 0) {
          alert("Inserisci almeno una temperatura.");
          return;
        }

        this.closeModal();
        this.renderView('haccp_temp');
      };
    }
    
    if (type === 'edit-sanitation') {
      const recId = extraArg;
      const rec = Store.data.haccp_sanitation.find(r => r.id === recId);
      if(!rec) return;

      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Modifica Sanificazione';
      
      const equipments = Store.data.equipments || [];
      const environments = Store.data.work_environments || [];
      const detergents = Store.data.detergents || [];

      body.innerHTML = `
        <div class="form-group">
          <label>Data Registrazione</label>
          <input type="date" id="form-san-date" value="${rec.date}" />
        </div>
        
        <div class="form-group">
          <label>Operatore (Firma)</label>
          <select id="form-san-operator">
            <option value="">-- Seleziona Operatore --</option>
            ${App.getEligibleOperators('sanificazione').map(w => `<option value="${w.firstName} ${w.lastName}" ${rec.operator === (w.firstName + ' ' + w.lastName) ? 'selected' : ''}>${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>

        <h4 style="margin-top: 16px; margin-bottom: 8px;">Attrezzature</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 8px;">
          ${equipments.length === 0 ? '<p style="font-size:13px;">Nessuna attrezzatura.</p>' : equipments.map(e => {
            const found = rec.equipmentCleaned?.find(x => x.id === e.id);
            const currentDets = found ? (Array.isArray(found.detergentId) ? found.detergentId : [found.detergentId]) : [];
            return `
              <div style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; font-weight: 500; flex: 1;">${e.name}</span>
                <select class="san-eq-det" data-id="${e.id}" multiple style="width: 55%; height: 50px; font-size: 12px; padding: 2px;">
                  ${detergents.map(d => `<option value="${d.id}" ${currentDets.includes(d.id) ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
              </div>
            `;
          }).join('')}
          <p style="font-size: 10px; color: var(--text-secondary); margin-top: 5px;">Ctrl+Click per multi-selezione.</p>
        </div>

        <h4 style="margin-top: 16px; margin-bottom: 8px;">Ambienti di Lavoro</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 8px;">
          ${environments.length === 0 ? '<p style="font-size:13px;">Nessun ambiente.</p>' : environments.map(e => {
            const found = rec.environmentsCleaned?.find(x => x.id === e.id);
            const currentDets = found ? (Array.isArray(found.detergentId) ? found.detergentId : [found.detergentId]) : [];
            return `
              <div style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; font-weight: 500; flex: 1;">${e.name}</span>
                <select class="san-env-det" data-id="${e.id}" multiple style="width: 55%; height: 50px; font-size: 12px; padding: 2px;">
                  ${detergents.map(d => `<option value="${d.id}" ${currentDets.includes(d.id) ? 'selected' : ''}>${d.name}</option>`).join('')}
                </select>
              </div>
            `;
          }).join('')}
          <p style="font-size: 10px; color: var(--text-secondary); margin-top: 5px;">Ctrl+Click per multi-selezione.</p>
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('form-san-date').value;
        const operator = document.getElementById('form-san-operator').value;
        if(!date || !operator) { alert("Inserisci data e operatore."); return; }

        const eqCleaned = [];
        equipments.forEach(e => {
          const activeChips = document.querySelectorAll(`.eq-chip-${e.id}.active`);
          if (activeChips.length > 0) {
            const selectedDets = Array.from(activeChips).map(c => c.dataset.detId);
            const detNames = selectedDets.map(id => detergents.find(x => x.id === id)?.name).join(', ');
            eqCleaned.push({ id: e.id, name: e.name, detergentId: selectedDets, detergentName: detNames });
          }
        });

        const envCleaned = [];
        environments.forEach(e => {
          const activeChips = document.querySelectorAll(`.env-chip-${e.id}.active`);
          if (activeChips.length > 0) {
            const selectedDets = Array.from(activeChips).map(c => c.dataset.detId);
            const detNames = selectedDets.map(id => detergents.find(x => x.id === id)?.name).join(', ');
            envCleaned.push({ id: e.id, name: e.name, detergentId: selectedDets, detergentName: detNames });
          }
        });

        Store.updateItem('haccp_sanitation', recId, {
          date, operator, equipmentCleaned, environmentsCleaned
        });
        
        this.closeModal();
        this.renderView(this.currentView);
      };
    }

    if (type === 'sanitation') {
      title.innerHTML = '<i class="ph-fill ph-sparkle"></i> Registra Sanificazione';
      
      const equipments = Store.data.equipments || [];
      const environments = Store.data.work_environments || [];
      const detergents = Store.data.detergents || [];
      const records = Store.data.haccp_sanitation || [];
      const lastRecord = records.length > 0 ? records[records.length - 1] : null;

      const today = new Date().toISOString().split('T')[0];
      const defaultDate = today;
      const defaultOperator = lastRecord ? lastRecord.operator : '';

      body.innerHTML = `
        <div class="form-group">
          <label>Data Registrazione</label>
          <input type="date" id="form-san-date" value="${defaultDate}" />
        </div>
        
        <div class="form-group">
          <label>Operatore (Firma)</label>
          <select id="form-san-operator">
            <option value="">-- Seleziona Operatore --</option>
            ${App.getEligibleOperators('sanificazione').map(w => `<option value="${w.firstName} ${w.lastName}" ${defaultOperator === (w.firstName + ' ' + w.lastName) ? 'selected' : ''}>${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>

        <h4 style="margin-top: 16px; margin-bottom: 8px;">Attrezzature</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 8px;">
          ${equipments.length === 0 ? '<p style="font-size:13px;">Nessuna attrezzatura in impostazioni.</p>' : equipments.map(e => {
            let lastDet = '';
            if (lastRecord && lastRecord.equipmentCleaned) {
               const found = lastRecord.equipmentCleaned.find(x => x.id === e.id);
               if (found) lastDet = found.detergentId;
            }
            return `
              <div style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; font-weight: 600; flex: 1;">${e.name}</span>
              </div>
              <div class="detergent-chips-container" style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
                ${detergents.map(d => {
                  const isSelected = lastRecord && lastRecord.equipmentCleaned && lastRecord.equipmentCleaned.find(x => x.id === e.id && (Array.isArray(x.detergentId) ? x.detergentId.includes(d.id) : x.detergentId === d.id));
                  return `<button type="button" class="san-chip eq-chip-${e.id} ${isSelected ? 'active' : ''}" data-item-id="${e.id}" data-det-id="${d.id}" onclick="App.toggleSanChip(this)" style="font-size: 11px; padding: 4px 8px; border-radius: 20px; border: 1px solid var(--border-color); background: ${isSelected ? 'var(--primary-color)' : 'white'}; color: ${isSelected ? 'white' : 'var(--text-primary)'}; cursor: pointer; transition: 0.2s;">${d.name}</button>`;
                }).join('')}
              </div>
            `;
          }).join('')}
        </div>

        <h4 style="margin-top: 16px; margin-bottom: 8px;">Ambienti di Lavoro</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 8px; border-radius: 8px;">
          ${environments.length === 0 ? '<p style="font-size:13px;">Nessun ambiente in impostazioni.</p>' : environments.map(e => {
            let lastDet = '';
            if (lastRecord && lastRecord.environmentsCleaned) {
               const found = lastRecord.environmentsCleaned.find(x => x.id === e.id);
               if (found) lastDet = found.detergentId;
            }
            return `
              <div style="margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 13px; font-weight: 600; flex: 1;">${e.name}</span>
              </div>
              <div class="detergent-chips-container" style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
                ${detergents.map(d => {
                  const isSelected = lastRecord && lastRecord.environmentsCleaned && lastRecord.environmentsCleaned.find(x => x.id === e.id && (Array.isArray(x.detergentId) ? x.detergentId.includes(d.id) : x.detergentId === d.id));
                  return `<button type="button" class="san-chip env-chip-${e.id} ${isSelected ? 'active' : ''}" data-item-id="${e.id}" data-det-id="${d.id}" onclick="App.toggleSanChip(this)" style="font-size: 11px; padding: 4px 8px; border-radius: 20px; border: 1px solid var(--border-color); background: ${isSelected ? 'var(--primary-color)' : 'white'}; color: ${isSelected ? 'white' : 'var(--text-primary)'}; cursor: pointer; transition: 0.2s;">${d.name}</button>`;
                }).join('')}
              </div>
            `;
          }).join('')}
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('form-san-date').value;
        const operator = document.getElementById('form-san-operator').value;

        if(!date || !operator) {
          alert("Inserisci data e operatore.");
          return;
        }

        const equipmentCleaned = [];
        equipments.forEach(e => {
          const activeChips = document.querySelectorAll(`.eq-chip-${e.id}.active`);
          if (activeChips.length > 0) {
            const selectedDets = Array.from(activeChips).map(c => c.dataset.detId);
            const detNames = selectedDets.map(id => detergents.find(x => x.id === id)?.name).join(', ');
            equipmentCleaned.push({ id: e.id, name: e.name, detergentId: selectedDets, detergentName: detNames });
          }
        });

        const environmentsCleaned = [];
        environments.forEach(e => {
          const activeChips = document.querySelectorAll(`.env-chip-${e.id}.active`);
          if (activeChips.length > 0) {
            const selectedDets = Array.from(activeChips).map(c => c.dataset.detId);
            const detNames = selectedDets.map(id => detergents.find(x => x.id === id)?.name).join(', ');
            environmentsCleaned.push({ id: e.id, name: e.name, detergentId: selectedDets, detergentName: detNames });
          }
        });

        Store.addItem('haccp_sanitation', {
          date: date,
          operator: operator,
          equipmentCleaned,
          environmentsCleaned
        });
        
        this.closeModal();
        this.renderView(this.currentView);
      };
    }
    
    if (type === 'incoming') {
      title.innerHTML = '<i class="ph-fill ph-truck"></i> Nuovo Carico Merci';
      const ingredients = Store.data.ingredients || [];
      const suppliers = Store.data.suppliers || [];
      const today = new Date().toISOString().split('T')[0];
      
      this.tempIncomingItems = [];
      this.tempShipmentPhoto = null;

      body.innerHTML = `
        <div style="background: var(--bg-body); padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-color);">
          <h4 style="margin-bottom: 12px; font-size: 14px; color: var(--primary-color);"><i class="ph-fill ph-file-text"></i> Dati Generali (Fattura/DDT)</h4>
          <div class="form-group">
            <label>Data di Carico</label>
            <input type="date" id="inc-date" value="${today}" />
          </div>

          <div class="form-group">
            <label>Fornitore</label>
            <select id="inc-supplier">
              <option value="">-- Seleziona Fornitore --</option>
              ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label>Foto Fattura / DDT</label>
            <input type="file" id="capture-ddt" accept="image/*" capture="environment" style="display: none;" onchange="App.handleShipmentPhoto(this)" />
            <button class="btn-secondary" onclick="document.getElementById('capture-ddt').click()" style="width: 100%;"><i class="ph ph-camera"></i> Scatta Foto Documento</button>
            <div id="preview-ddt" style="margin-top: 10px; display: none; text-align: center;">
              <img id="img-preview-ddt" src="" style="max-height: 100px; border-radius: 8px; border: 1px solid var(--border-color); cursor: pointer;" onclick="App.enlargeImage(this.src)" />
              <p style="font-size: 10px; color: var(--success-color); margin-top: 4px;"><i class="ph ph-check"></i> Documento Acquisito</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
          <h4 style="font-size: 14px; color: var(--text-primary);"><i class="ph-fill ph-package"></i> Prodotti nel Carico</h4>
          <button class="btn-primary" style="width: auto; padding: 6px 12px; font-size: 12px;" onclick="App.addIncomingItemRow()">
            <i class="ph ph-plus"></i> Aggiungi Prodotto
          </button>
        </div>

        <div id="incoming-items-container">
          <!-- Item rows will be injected here -->
        </div>
      `;

      this.incomingItemCounter = 0;
      // Add first row by default
      setTimeout(() => this.addIncomingItemRow(), 50);

      saveBtn.onclick = () => {
        const date = document.getElementById('inc-date').value || today;
        const supplierId = document.getElementById('inc-supplier').value;
        const ddtPhoto = this.tempShipmentPhoto;

        if(!supplierId) { alert("Seleziona il fornitore."); return; }
        if(!ddtPhoto) { alert("Scatta la foto della fattura o del DDT."); return; }
        
        const itemRows = document.querySelectorAll('.incoming-item-row');
        if(itemRows.length === 0) { alert("Aggiungi almeno un prodotto."); return; }

        const shipmentId = 'SH-' + Date.now();
        const sup = suppliers.find(s => s.id === supplierId);

        const fileName = `${sup.name.replace(/\s+/g, '_')}_${date.split('-').reverse().join('_')}`;

        // Save Shipment (Parent)
        Store.addItem('trace_shipments', {
          id: shipmentId,
          date,
          supplierId,
          supplierName: sup.name,
          fileName: fileName,
          ddtPhoto,
          createdAt: new Date().toISOString()
        });

        // Save Items (Children)
        let savedCount = 0;
        itemRows.forEach((row) => {
          const ingSelect = row.querySelector('.item-ing');
          const idx = ingSelect.dataset.idx;
          const ingId = ingSelect.value;
          const qty = parseFloat(row.querySelector('.item-qty').value);
          const expiry = row.querySelector('.item-expiry').value;
          const labelPhoto = this.tempIncomingItems[idx] ? this.tempIncomingItems[idx].photo : null;

          if(ingId && !isNaN(qty) && expiry) {
            const ing = ingredients.find(i => i.id === ingId);
            
            // Generate Internal Lot
            const goods = Store.data.incoming_goods || [];
            const maxLot = goods.reduce((max, g) => {
                const num = parseInt(g.lotInterno);
                return (!isNaN(num) && num > max) ? num : max;
            }, 0);
            const lotInterno = (maxLot + 1).toString();

            Store.addItem('incoming_goods', {
              shipmentId,
              date,
              lotInterno,
              ingredientId: ingId,
              ingredientName: ing.name,
              supplierId,
              supplierName: sup.name,
              quantity: qty,
              unit: ing.unit,
              expiry,
              labelPhoto, // Specific for this item
              ddtPhoto // Also keep a copy for legacy views or ease of access
            });
            savedCount++;
          }
        });

        if(savedCount === 0) {
          alert("Inserisci i dati dei prodotti (ingrediente, quantità e scadenza).");
          return;
        }

        this.closeModal();
        this.renderView('trace_archive');
      };
    }

    if (type === 'edit-incoming') {
      const recId = extraArg;
      const g = Store.data.incoming_goods.find(x => x.id === recId);
      if(!g) return;

      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Modifica Carico';
      const ingredients = Store.data.ingredients || [];
      App.tempIncomingPhotos = JSON.parse(JSON.stringify(g.photos || { ddt: null, lot: [] }));

      body.innerHTML = `
        <div class="form-group">
          <label>Data di Carico</label>
          <input type="date" id="edit-inc-date" value="${g.date}" />
        </div>

        <div class="form-group">
          <label>Ingrediente</label>
          <select id="edit-inc-ingredient" onchange="App.updateSupplierFilter()">
            ${ingredients.map(i => `<option value="${i.id}" ${i.id === g.ingredientId ? 'selected' : ''}>${i.name}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>Fornitore</label>
          <select id="edit-inc-supplier">
            <option value="${g.supplierId}">${g.supplierName}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Quantità</label>
          <input type="number" id="edit-inc-qty" step="0.01" value="${g.quantity}" />
        </div>

        <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
          <div style="background: rgba(0,0,0,0.02); padding: 12px; border-radius: 12px; text-align: center;">
            <label style="font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 8px;">DDT / Fattura</label>
            <input type="file" id="edit-capture-ddt" accept="image/*" capture="environment" style="display: none;" onchange="App.handlePhoto(this, 'ddt')" />
            <button class="btn-secondary" onclick="document.getElementById('edit-capture-ddt').click()" style="width: 100%;">Cambia</button>
            <div id="preview-ddt" style="margin-top: 8px; font-size: 10px; color: var(--success-color); ${g.photos?.ddt ? 'display: block;' : 'display: none;'}">Acquisita</div>
          </div>

          <div style="background: rgba(0,0,0,0.02); padding: 12px; border-radius: 12px; text-align: center;">
            <label style="font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 8px;">Lotto</label>
            <input type="file" id="edit-capture-lot" accept="image/*" capture="environment" style="display: none;" onchange="App.handlePhoto(this, 'lot')" multiple />
            <button class="btn-secondary" onclick="document.getElementById('edit-capture-lot').click()" style="width: 100%;">Aggiungi</button>
            <div id="preview-lot-count" style="margin-top: 8px; font-size: 10px; color: var(--success-color); ${g.photos?.lot?.length > 0 ? 'display: block;' : 'display: none;'}"><span id="lot-count-val">${g.photos?.lot?.length || 0}</span> Foto</div>
          </div>
        </div>

        <div class="form-group" style="margin-top: 20px;">
          <label>Data di Scadenza</label>
          <input type="date" id="edit-inc-expiry" value="${g.expiry}" />
        </div>
      `;

      // Update supplier list on load
      setTimeout(() => {
        const ingId = document.getElementById('edit-inc-ingredient').value;
        const supSelect = document.getElementById('edit-inc-supplier');
        const suppliers = (Store.data.suppliers || []).filter(s => !s.inactive && (s.providedIngredients || []).includes(ingId));
        supSelect.innerHTML = suppliers.map(s => `<option value="${s.id}" ${s.id === g.supplierId ? 'selected' : ''}>${s.name}</option>`).join('');
      }, 0);

      saveBtn.onclick = () => {
        const date = document.getElementById('edit-inc-date').value;
        const ingredientId = document.getElementById('edit-inc-ingredient').value;
        const supplierId = document.getElementById('edit-inc-supplier').value;
        const quantity = parseFloat(document.getElementById('edit-inc-qty').value);
        const expiry = document.getElementById('edit-inc-expiry').value;

        const ing = ingredients.find(i => i.id === ingredientId);
        const sup = (Store.data.suppliers || []).find(s => s.id === supplierId);

        Store.updateItem('incoming_goods', recId, {
          date,
          ingredientId,
          ingredientName: ing.name,
          supplierId,
          supplierName: sup.name,
          quantity,
          unit: ing.unit,
          expiry,
          photos: App.tempIncomingPhotos
        });

        this.closeModal();
        this.renderView('trace_incoming_detail');
      };
    }


    if (type === 'production') {
      title.innerHTML = '<i class="ph-fill ph-cooking-pot"></i> Nuova Produzione';
      const recipes = Store.data.recipes || [];
      const today = new Date().toISOString().split('T')[0];
      
      // Auto-generazione Lotto Interno: L + ddmmyy
      const d = new Date();
      const lotInterno = 'L' + 
        d.getDate().toString().padStart(2, '0') + 
        (d.getMonth() + 1).toString().padStart(2, '0') + 
        d.getFullYear().toString().slice(-2);

      body.innerHTML = `
        <div class="form-group">
          <label>Data di Produzione</label>
          <input type="date" id="prod-date" value="${today}" />
        </div>
        <div class="form-group">
          <label>Ricetta da Produrre</label>
          <select id="prod-recipe-id" onchange="App.updateProductionIngredients()">
            <option value="">-- Seleziona Ricetta --</option>
            ${recipes.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Quantità da Produrre (Kg/Pezzi)</label>
          <input type="number" id="prod-quantity" value="1" step="0.1" oninput="App.updateProductionIngredients()" />
        </div>
        
        <div id="prod-ingredients-section" style="margin-top: 20px; display: none;">
          <h4 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">
            <i class="ph ph-list-checks"></i> Ingredienti e Lotti Materie Prime
          </h4>
          <div id="prod-ingredients-list" style="display: flex; flex-direction: column; gap: 10px;">
            <!-- Riempito dinamicamente -->
          </div>
        </div>

        <div class="form-group" style="margin-top: 20px;">
          <label>Lotto Interno (Auto)</label>
          <input type="text" id="prod-lot" value="${lotInterno}" />
        </div>
        <div class="form-group">
          <label>Data di Scadenza / TMC</label>
          <input type="date" id="prod-expiry" value="${today}" />
        </div>
      `;

      saveBtn.onclick = () => {
        const recipeId = document.getElementById('prod-recipe-id').value;
        const date = document.getElementById('prod-date').value;
        const quantityProduced = document.getElementById('prod-quantity').value;
        const lot = document.getElementById('prod-lot').value.trim();
        const expiry = document.getElementById('prod-expiry').value;

        if (!recipeId || !quantityProduced || !lot) { alert("Completa tutti i campi."); return; }

        const recipe = recipes.find(r => r.id === recipeId);
        const ingredientBlocks = document.querySelectorAll('.prod-ing-block');
        const ingredientsUsed = [];

        for (let block of ingredientBlocks) {
          const ingId = block.dataset.ingId;
          const lotId = block.querySelector('.prod-lot-select').value;
          const qty = block.dataset.neededQty;
          
          if (!lotId) {
            alert(`Seleziona il lotto per l'ingrediente: ${block.dataset.ingName}`);
            return;
          }
          
          ingredientsUsed.push({
            ingredientId: ingId,
            incomingId: lotId, // Riferimento al carico specifico
            quantity: qty
          });
        }

        Store.addItem('productions', {
          date,
          recipeId,
          recipeName: recipe.name,
          quantityProduced,
          lot,
          expiry,
          ingredients: ingredientsUsed
        });

        this.closeModal();
        this.renderView('trace_production');
      };
    }

    if (type === 'edit-production') {
      const recId = extraArg;
      const p = (Store.data.productions || []).find(x => x.id === recId);
      if(!p) return;
      
      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Modifica Produzione';
      const recipes = Store.data.recipes || [];
      
      body.innerHTML = `
        <div class="form-group">
          <label>Data di Produzione</label>
          <input type="date" id="edit-prod-date" value="${p.date}" />
        </div>
        <div class="form-group">
          <label>Ricetta</label>
          <select id="edit-prod-recipe-id" onchange="App.updateProductionIngredients(true)">
            ${recipes.map(r => `<option value="${r.id}" ${r.id === p.recipeId ? 'selected' : ''}>${r.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Quantità Prodotta</label>
          <input type="number" id="edit-prod-quantity" value="${p.quantityProduced}" step="0.1" oninput="App.updateProductionIngredients(true)" />
        </div>
        
        <div id="edit-prod-ingredients-section" style="margin-top: 20px;">
          <h4 style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px; border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">
            <i class="ph ph-list-checks"></i> Ingredienti e Lotti
          </h4>
          <div id="edit-prod-ingredients-list" style="display: flex; flex-direction: column; gap: 10px;">
            <!-- Riempito dinamicamente -->
          </div>
        </div>

        <div class="form-group" style="margin-top: 20px;">
          <label>Lotto Interno</label>
          <input type="text" id="edit-prod-lot" value="${p.lot}" />
        </div>
        <div class="form-group">
          <label>Data di Scadenza / TMC</label>
          <input type="date" id="edit-prod-expiry" value="${p.expiry}" />
        </div>
      `;

      // Inizializza lista ingredienti con i dati salvati
      setTimeout(() => App.updateProductionIngredients(true, p.ingredients), 50);

      saveBtn.onclick = () => {
        const recipeId = document.getElementById('edit-prod-recipe-id').value;
        const date = document.getElementById('edit-prod-date').value;
        const quantityProduced = document.getElementById('edit-prod-quantity').value;
        const lot = document.getElementById('edit-prod-lot').value.trim();
        const expiry = document.getElementById('edit-prod-expiry').value;

        const recipe = recipes.find(r => r.id === recipeId);
        const ingredientBlocks = document.querySelectorAll('.prod-ing-block');
        const ingredientsUsed = [];

        for (let block of ingredientBlocks) {
          const ingId = block.dataset.ingId;
          const lotId = block.querySelector('.prod-lot-select').value;
          const qty = block.dataset.neededQty;
          
          if (!lotId) { alert("Seleziona tutti i lotti."); return; }
          
          ingredientsUsed.push({
            ingredientId: ingId,
            incomingId: lotId,
            quantity: qty
          });
        }

        Store.updateItem('productions', recId, {
          date,
          recipeId,
          recipeName: recipe.name,
          quantityProduced,
          lot,
          expiry,
          ingredients: ingredientsUsed
        });

        this.closeModal();
        this.renderView('trace_production');
      };
    }

    if (type === 'noncompliance') {
      title.innerHTML = '<i class="ph-fill ph-warning"></i> Nuova Non Conformità';
      const eligible = App.getEligibleOperators('nonconformita');
      const today = new Date().toISOString().split('T')[0];

      body.innerHTML = `
        <div class="form-group">
          <label>Data Rilevamento</label>
          <input type="date" id="nc-date" value="${today}" />
        </div>
        <div class="form-group">
          <label>Descrizione NON Conformità</label>
          <textarea id="nc-description" rows="3" placeholder="Descrivi l'anomalia riscontrata..."></textarea>
        </div>
        <div class="form-group">
          <label>Azione Correttiva da Intraprendere</label>
          <textarea id="nc-corrective" rows="3" placeholder="Descrivi l'azione per risolvere il problema..."></textarea>
        </div>
        <div class="form-group">
          <label>Responsabile Attuazione</label>
          <select id="nc-responsible">
            <option value="">-- Seleziona Responsabile --</option>
            ${eligible.map(w => `<option value="${w.firstName} ${w.lastName}">${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Data Scadenza Attuazione</label>
          <input type="date" id="nc-due-date" value="${today}" />
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('nc-date').value;
        const description = document.getElementById('nc-description').value;
        const corrective = document.getElementById('nc-corrective').value;
        const responsible = document.getElementById('nc-responsible').value;
        const dueDate = document.getElementById('nc-due-date').value;

        if(!description || !responsible) { alert("Descrizione e Responsabile sono obbligatori."); return; }

        Store.addItem('haccp_noncompliance', {
          date,
          description,
          correctiveAction: corrective,
          responsibleWorker: responsible,
          dueDate,
          isClosed: false,
          closedDate: null
        });

        this.closeModal();
        this.renderView('haccp_nc');
      };
    }

    if (type === 'edit-noncompliance') {
      const recId = extraArg;
      const r = Store.data.haccp_noncompliance.find(x => x.id === recId);
      if(!r) return;

      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Gestione Non Conformità';
      const eligible = App.getEligibleOperators('nonconformita');
      const today = new Date().toISOString().split('T')[0];

      body.innerHTML = `
        <div class="form-group">
          <label>Data Rilevamento</label>
          <input type="date" id="edit-nc-date" value="${r.date}" />
        </div>
        <div class="form-group">
          <label>Descrizione</label>
          <textarea id="edit-nc-description" rows="2">${r.description}</textarea>
        </div>
        <div class="form-group">
          <label>Azione Correttiva</label>
          <textarea id="edit-nc-corrective" rows="2">${r.correctiveAction}</textarea>
        </div>
        <div class="form-group">
          <label>Responsabile Attuazione</label>
          <select id="edit-nc-responsible">
            ${eligible.map(w => `<option value="${w.firstName} ${w.lastName}" ${r.responsibleWorker === (w.firstName+' '+w.lastName) ? 'selected' : ''}>${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Data Scadenza</label>
          <input type="date" id="edit-nc-due-date" value="${r.dueDate}" />
        </div>
        
        <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">
        
        <div class="form-group">
          <div class="checkbox-group" style="background: rgba(0,0,0,0.02); padding: 10px; border-radius: 8px;">
            <input type="checkbox" id="nc-is-closed" ${r.isClosed ? 'checked' : ''} onchange="document.getElementById('nc-close-date-group').style.display = this.checked ? 'block' : 'none'" />
            <label for="nc-is-closed" style="margin-bottom:0; font-weight: bold; color: var(--success-color);">NON CONFORMITÀ RISOLTA / CHIUSA</label>
          </div>
        </div>
        
        <div class="form-group" id="nc-close-date-group" style="display: ${r.isClosed ? 'block' : 'none'}; margin-top: 10px;">
          <label>Data di Chiusura Effettiva</label>
          <input type="date" id="nc-closed-date" value="${r.closedDate || today}" />
        </div>
      `;

      saveBtn.onclick = () => {
        const isClosed = document.getElementById('nc-is-closed').checked;
        const closedDate = isClosed ? document.getElementById('nc-closed-date').value : null;

        Store.updateItem('haccp_noncompliance', recId, {
          date: document.getElementById('edit-nc-date').value,
          description: document.getElementById('edit-nc-description').value,
          correctiveAction: document.getElementById('edit-nc-corrective').value,
          responsibleWorker: document.getElementById('edit-nc-responsible').value,
          dueDate: document.getElementById('edit-nc-due-date').value,
          isClosed,
          closedDate
        });

        this.closeModal();
        this.renderView('haccp_nc');
      };
    }
    if (type === 'structure') {
      title.innerHTML = '<i class="ph-fill ph-house-line"></i> Nuovo Controllo Ambienti';
      const eligible = App.getEligibleOperators('ambienti');
      const environments = Store.data.work_environments || [];
      const today = new Date().toISOString().split('T')[0];
      
      body.innerHTML = `
        <div class="form-group">
          <label>Data</label>
          <input type="date" id="str-date" value="${today}" />
        </div>
        <div class="form-group">
          <label>Operatore Responsabile</label>
          <select id="str-operator">
            <option value="">-- Seleziona --</option>
            ${eligible.map(w => `<option value="${w.firstName} ${w.lastName}">${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        
        <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
          <label>Aggiungi Ambiente da Controllare</label>
          <div style="display: flex; gap: 8px;">
            <select id="str-env-select" style="flex: 1;">
              <option value="">-- Scegli Ambiente --</option>
              ${environments.map(e => `<option value="${e.name}">${e.name}</option>`).join('')}
            </select>
            <button type="button" class="btn-primary" onclick="App.addEnvironmentToControl()" style="width: auto; padding: 0 15px;"><i class="ph ph-plus"></i> Aggiungi</button>
          </div>
        </div>

        <div id="str-multi-container">
          <!-- Qui verranno aggiunti i blocchi degli ambienti -->
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('str-date').value;
        const operator = document.getElementById('str-operator').value;
        const blocks = document.querySelectorAll('.env-check-block');

        if(!operator) { alert("Seleziona l'operatore."); return; }
        if(blocks.length === 0) { alert("Aggiungi almeno un ambiente."); return; }

        blocks.forEach(block => {
           const envName = block.getAttribute('data-env');
           const statusInputs = block.querySelectorAll('.item-status');
           const corrInputs = block.querySelectorAll('.item-corr');
           
           const checks = Array.from(statusInputs).map((input, i) => {
             return {
               label: input.getAttribute('data-label'),
               status: input.value,
               correctiveAction: input.value === 'NC' ? corrInputs[i].value : ''
             };
           });

           const overallStatus = checks.some(c => c.status === 'NC') ? 'NON CONFORME' : 'CONFORME';

           Store.addItem('haccp_structure', {
             date, 
             operator, 
             environment: envName, 
             checks, 
             status: overallStatus,
             frequency: Store.data.settings.structureFrequency
           });
        });

        this.closeModal();
        this.renderView('haccp_structure');
      };
    }

    if (type === 'edit-structure') {
      const recId = extraArg;
      const r = Store.data.haccp_structure.find(x => x.id === recId);
      if(!r) return;

      title.innerHTML = '<i class="ph-fill ph-pencil"></i> Modifica Controllo';
      const eligible = App.getEligibleOperators('ambienti');
      
      body.innerHTML = `
        <div class="form-group">
          <label>Data</label>
          <input type="date" id="edit-str-date" value="${r.date}" />
        </div>
        <div class="form-group">
          <label>Ambiente</label>
          <input type="text" id="edit-str-env" value="${r.environment}" readonly style="background: #f4f4f4;" />
        </div>
        <div class="form-group">
          <label>Operatore</label>
          <select id="edit-str-operator">
            ${eligible.map(w => `<option value="${w.firstName} ${w.lastName}" ${r.operator === (w.firstName+' '+w.lastName) ? 'selected' : ''}>${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
        
        <h4 style="margin-bottom: 15px;">Checklist</h4>
        <div style="background: rgba(0,0,0,0.02); padding: 15px; border-radius: 12px;">
          ${r.checks.map((c, i) => `
            <div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.05);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 13px; font-weight: 500;">${c.label}</span>
                <div class="toggle-group" style="display: flex; background: white; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color);">
                  <button type="button" id="str-btn-c-edit-${i}" onclick="App.setStructureValue('edit-${i}', 'C')" style="padding: 6px 12px; border: none; background: ${c.status === 'C' ? 'var(--success-color)' : 'white'}; color: ${c.status === 'C' ? 'white' : 'var(--text-primary)'}; cursor: pointer; font-weight: bold; font-size: 12px;">C</button>
                  <button type="button" id="str-btn-nc-edit-${i}" onclick="App.setStructureValue('edit-${i}', 'NC')" style="padding: 6px 12px; border: none; background: ${c.status === 'NC' ? 'var(--danger-color)' : 'white'}; color: ${c.status === 'NC' ? 'white' : 'var(--text-primary)'}; cursor: pointer; font-weight: bold; font-size: 12px;">NC</button>
                </div>
              </div>
              <input type="hidden" class="edit-item-status" data-label="${c.label}" id="str-val-edit-${i}" value="${c.status}" />
              <div id="str-corr-container-edit-${i}" style="display: ${c.status === 'NC' ? 'block' : 'none'};">
                <input type="text" class="edit-item-corr" id="str-corr-edit-${i}" value="${c.correctiveAction || ''}" placeholder="Azione correttiva..." style="width: 100%; padding: 6px; font-size: 12px; border: 1px solid var(--danger-color); border-radius: 4px;" />
              </div>
            </div>
          `).join('')}
        </div>
      `;

      saveBtn.onclick = () => {
        const date = document.getElementById('edit-str-date').value;
        const operator = document.getElementById('edit-str-operator').value;
        const statusInputs = document.querySelectorAll('.edit-item-status');
        const corrInputs = document.querySelectorAll('.edit-item-corr');

        const checks = Array.from(statusInputs).map((input, i) => {
          return {
            label: input.getAttribute('data-label'),
            status: input.value,
            correctiveAction: input.value === 'NC' ? corrInputs[i].value : ''
          };
        });

        const overallStatus = checks.some(c => c.status === 'NC') ? 'NON CONFORME' : 'CONFORME';

        Store.updateItem('haccp_structure', recId, {
          date, operator, checks, status: overallStatus
        });

        this.closeModal();
        this.renderView('haccp_structure_detail');
      };
    }

    if (type === 'label-pre-print') {
      const prodId = extraArg;
      title.innerHTML = '<i class="ph ph-printer"></i> Configurazione Etichetta';
      
      body.innerHTML = `
        <div class="form-group">
          <label>Peso Netto (g) *</label>
          <input type="number" id="label-weight" placeholder="es. 250" />
        </div>
        <div class="form-group">
          <label>Modalità di Conservazione</label>
          <select id="label-storage">
            <option value="Conservare in luogo fresco e asciutto.">Conservare in luogo fresco e asciutto.</option>
            <option value="Conservare in frigorifero da 0°C a +4°C.">Conservare in frigorifero da 0°C a +4°C.</option>
            <option value="Conservare in congelatore a -18°C. Una volta scongelato, il prodotto non deve essere ricongelato.">Conservare in congelatore a -18°C. Una volta scongelato, il prodotto non deve essere ricongelato.</option>
            <option value="Dopo l'apertura conservare in frigorifero e consumare entro 2-3 giorni.">Dopo l'apertura conservare in frigorifero e consumare entro 2-3 giorni.</option>
            <option value="Conservare al riparo dalla luce diretta e da fonti di calore.">Conservare al riparo dalla luce diretta e da fonti di calore.</option>
          </select>
        </div>
        <div class="form-group">
          <label>Note / Istruzioni aggiuntive (Libero)</label>
          <input type="text" id="label-storage-notes" placeholder="es. Consumare previa cottura" />
        </div>
      `;
      
      saveBtn.innerHTML = '<i class="ph ph-check"></i> Conferma e Anteprima';
      saveBtn.onclick = () => {
        const weight = document.getElementById('label-weight').value;
        const storage = document.getElementById('label-storage').value;
        const notes = document.getElementById('label-storage-notes').value;
        
        if(!weight) { alert("Inserisci il peso in grammi."); return; }
        
        this.closeModal();
        this.generateLabelPreview(prodId, { weight, storage, notes });
      };
    }

    modal.classList.add('active');
  },

  closeModal() {
    document.getElementById('global-modal').classList.remove('active');
  },

  updateSupplierFilter() {
    const ingId = document.getElementById('inc-ingredient').value;
    const supSelect = document.getElementById('inc-supplier');
    const msg = document.getElementById('sup-filter-msg');
    const unitSpan = document.getElementById('inc-unit');

    if (!ingId) {
      supSelect.innerHTML = '<option value="">-- Seleziona prima l\'ingrediente --</option>';
      unitSpan.innerText = '-';
      return;
    }

    const ing = Store.data.ingredients.find(i => i.id === ingId);
    unitSpan.innerText = ing ? ing.unit : '-';

    const suppliers = (Store.data.suppliers || []).filter(s => !s.inactive && (s.providedIngredients || []).includes(ingId));

    if (suppliers.length === 0) {
      supSelect.innerHTML = '<option value="">Nessun fornitore attivo</option>';
      msg.style.display = 'block';
    } else {
      supSelect.innerHTML = suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
      msg.style.display = 'none';
    }
  },

  saveQuickIngredient(isEdit = false) {
    const suffix = isEdit ? '-edit' : '';
    const nameInput = document.getElementById(`quick-ing-name${suffix}`);
    const unitInput = document.getElementById(`quick-ing-unit${suffix}`);
    const name = nameInput.value.trim();
    const unit = unitInput.value;

    if (!name) { alert("Inserisci il nome dell'ingrediente."); return; }

    const newIng = Store.addItem('ingredients', {
      name, unit, minStock: 5, allergens: [], stock: 0
    });

    // Update the select in the current modal
    const select = document.getElementById('form-recipe-ing');
    const option = document.createElement('option');
    option.value = newIng.id;
    option.text = `${newIng.name} (${newIng.unit})`;
    select.add(option);
    select.value = newIng.id;

    // Hide form and clear inputs
    document.getElementById(`quick-ing-form${suffix}`).style.display = 'none';
    const toggleBtn = document.querySelector(`[onclick*='quick-ing-form${suffix}']`);
    if(toggleBtn) toggleBtn.style.display='block';
    nameInput.value = '';
  },

  handlePhoto(input, type) {
    const files = input.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        if (type === 'ddt') {
          App.tempIncomingPhotos.ddt = base64;
          document.getElementById('preview-ddt').style.display = 'block';
        } else {
          if (!App.tempIncomingPhotos.lot) App.tempIncomingPhotos.lot = [];
          App.tempIncomingPhotos.lot.push(base64);
          const preview = document.getElementById('preview-lot-count');
          if(preview) {
             preview.style.display = 'block';
             document.getElementById('lot-count-val').innerText = App.tempIncomingPhotos.lot.length;
          }
        }
      };
      reader.readAsDataURL(files[i]);
    }
  },

  handleShipmentPhoto(input) {
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.tempShipmentPhoto = e.target.result;
      document.getElementById('img-preview-ddt').src = e.target.result;
      document.getElementById('preview-ddt').style.display = 'block';
    };
    reader.readAsDataURL(file);
  },

  handleItemPhoto(input, index) {
    const file = input.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if(!this.tempIncomingItems[index]) this.tempIncomingItems[index] = {};
      this.tempIncomingItems[index].photo = e.target.result;
      const preview = document.getElementById(`preview-item-photo-${index}`);
      preview.src = e.target.result;
      preview.style.display = 'block';
      document.getElementById(`btn-label-photo-${index}`).innerHTML = '<i class="ph ph-check"></i> Foto OK';
      document.getElementById(`btn-label-photo-${index}`).classList.replace('btn-secondary', 'btn-success');
    };
    reader.readAsDataURL(file);
  },

  addIncomingItemRow() {
    const container = document.getElementById('incoming-items-container');
    const index = this.incomingItemCounter++;
    const ingredients = Store.data.ingredients || [];
    
    const row = document.createElement('div');
    row.className = 'incoming-item-row card';
    row.style.padding = '15px';
    row.style.marginBottom = '15px';
    row.style.border = '1px solid var(--border-color)';
    row.style.position = 'relative';
    row.style.background = 'white';

    row.innerHTML = `
      <div style="position: absolute; top: 5px; right: 5px; z-index: 10;">
        <button class="btn-icon" onclick="this.closest('.incoming-item-row').remove()" style="color: var(--danger-color); padding: 4px;">
          <i class="ph ph-x-circle" style="font-size: 18px;"></i>
        </button>
      </div>

      <div class="form-group">
        <label style="font-size: 11px;">Dettaglio Prodotto</label>
        <select class="item-ing" data-idx="${index}" onchange="App.updateItemUnit(this, ${index})">
          <option value="">-- Seleziona Prodotto --</option>
          ${ingredients.map(i => `<option value="${i.id}">${i.name}</option>`).join('')}
        </select>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="form-group">
          <label style="font-size: 11px;">Quantità (<span class="item-unit-label">-</span>)</label>
          <input type="number" class="item-qty" step="0.01" placeholder="0,00" />
        </div>
        <div class="form-group">
          <label style="font-size: 11px;">Scadenza / TMC</label>
          <input type="date" class="item-expiry" />
        </div>
      </div>

      <div class="form-group" style="margin-bottom: 0;">
        <input type="file" id="capture-label-${index}" accept="image/*" capture="environment" style="display: none;" onchange="App.handleItemPhoto(this, ${index})" />
        <div style="display: flex; gap: 10px; align-items: center;">
          <button id="btn-label-photo-${index}" class="btn-secondary" onclick="document.getElementById('capture-label-${index}').click()" style="flex: 1; font-size: 12px; height: 36px; padding: 0;">
            <i class="ph ph-camera"></i> Foto Etichetta/Lotto
          </button>
          <img id="preview-item-photo-${index}" src="" style="display: none; height: 36px; width: 36px; border-radius: 4px; object-fit: cover; border: 1px solid var(--border-color); cursor: pointer;" onclick="App.enlargeImage(this.src)" />
        </div>
      </div>
    `;
    container.appendChild(row);
  },

  updateItemUnit(select, index) {
    const ingId = select.value;
    const ing = Store.data.ingredients.find(i => i.id === ingId);
    const label = select.closest('.incoming-item-row').querySelector('.item-unit-label');
    if(ing) label.innerText = ing.unit;
    else label.innerText = '-';
  },

  enlargeImage(src) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.9)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10000';
    overlay.style.cursor = 'zoom-out';
    overlay.onclick = () => document.body.removeChild(overlay);

    const img = document.createElement('img');
    img.src = src;
    img.style.maxWidth = '95%';
    img.style.maxHeight = '95%';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';

    overlay.appendChild(img);
    document.body.appendChild(overlay);
  },

  renderTempIngredients() {
    const listContainer = document.getElementById('recipe-ingredients-list');
    if(!listContainer) return;
    
    if(App.tempRecipeIngredients.length === 0) {
      listContainer.innerHTML = '<p style="font-size: 13px; color: var(--text-secondary);">Nessun ingrediente inserito.</p>';
      return;
    }

    listContainer.innerHTML = App.tempRecipeIngredients.map((item, index) => `
      <div class="list-item" style="padding: 8px 0; border-bottom: 1px dashed var(--border-color);">
        <div class="item-title" style="font-size: 14px;">${item.name}</div>
        <div class="item-subtitle">${item.quantity} ${item.unit} <i class="ph ph-trash" style="font-size: 18px; color: var(--danger-color); cursor: pointer; margin-left: 12px;" onclick="App.removeTempIngredient(${index})"></i></div>
      </div>
    `).join('');
  },

  addIngredientToRecipe() {
    const ingId = document.getElementById('form-recipe-ing').value;
    const qty = parseFloat(document.getElementById('form-recipe-qty').value);
    
    if(!ingId || !qty || qty <= 0) return;

    const ingDetails = Store.data.ingredients.find(i => i.id === ingId);
    
    App.tempRecipeIngredients.push({
      ingredientId: ingId,
      name: ingDetails.name,
      unit: ingDetails.unit,
      quantity: qty
    });

    document.getElementById('form-recipe-qty').value = '';
    this.renderTempIngredients();
  },

  removeTempIngredient(index) {
    App.tempRecipeIngredients.splice(index, 1);
    this.renderTempIngredients();
  },

  bindTraceabilityEvents() {
    // Event bindings per la vista tracciabilità
  },

  bindSettingsEvents() {
    const btn = document.getElementById('btn-save-settings');
    if(!btn) return;

    btn.addEventListener('click', () => {
      const applyModelNumber = document.getElementById('setting-apply-model').checked;
      const modelTemperature = document.getElementById('setting-model-temp').value;
      const modelSanitation = document.getElementById('setting-model-san').value;
      const modelHygiene = document.getElementById('setting-model-hyg').value;
      const modelNonCompliance = document.getElementById('setting-model-nc').value;
      const modelGeneric = document.getElementById('setting-model-gen').value;

      Store.updateSettings({ 
        applyModelNumber, 
        modelTemperature, 
        modelSanitation, 
        modelHygiene, 
        modelNonCompliance, 
        modelGeneric 
      });
      alert("Impostazioni salvate con successo.");
    });
  },

  bindCompanyEvents() {
    const btn = document.getElementById('btn-save-company');
    if(!btn) return;

    btn.addEventListener('click', () => {
      const data = {
        ragioneSociale: document.getElementById('company-ragione').value,
        nomeInsegna: document.getElementById('company-insegna').value,
        sedeLegale: document.getElementById('company-legale').value,
        sedeOperativa: document.getElementById('company-operativa').value,
        pIva: document.getElementById('company-piva').value,
        tipologiaAttivita: document.getElementById('company-attivita').value
      };

      Store.data.company = data;
      Store.save();
      alert("Dati aziendali salvati.");
      this.renderView('dashboard');
    });
  },



  bindLabelEvents() {
    const btn = document.getElementById('btn-generate-label');
    if(!btn) return;
    
    btn.addEventListener('click', () => {
      const prodId = document.getElementById('label-production-select').value;
      
      if(!prodId) {
        alert("Seleziona una produzione");
        return;
      }

      this.openModal('label-pre-print', prodId);
    });
  },

  generateLabelPreview(prodId, extraData) {
    const prod = (Store.data.productions || []).find(p => p.id === prodId);
    if(!prod) return;

    const recipe = Store.data.recipes.find(r => r.id === prod.recipeId || r.name === prod.recipeName);
    if(!recipe) {
      alert("Impossibile trovare la ricetta originale per questa produzione.");
      return;
    }

    const company = Store.data.company || {};
    const osaText = `${company.ragioneSociale || ''} - ${company.sedeOperativa || company.sedeLegale || ''}`;

    const expiryFormatted = App.formatDate(prod.expiry);
    const lotto = prod.lot;
    const isExpiry = (prod.expiryType === 'Scadenza' || prod.labelType === 'Scadenza'); // Simplified logic
    const expiryWording = isExpiry ? "Da consumarsi entro il" : "Da consumarsi preferibilmente entro il";

    // Elabora ingredienti: ordine decrescente, formatta allergeni
    const ingredients = recipe.ingredients.map(ing => {
      const details = Store.data.ingredients.find(i => i.id === ing.ingredientId);
      if(!details) return null;
      return {
        name: details.name,
        quantity: ing.quantity,
        isAllergen: details.allergen,
        allergenName: details.allergenName
      };
    }).filter(i => i !== null).sort((a, b) => b.quantity - a.quantity);

    const ingString = ingredients.map(ing => {
      let text = ing.name;
      if(ing.isAllergen) {
        text = `<b>${text.toUpperCase()}</b>`; // Grassetto Maiuscolo per allergeni
      }
      return text;
    }).join(', ');

    const storageText = extraData.notes ? `${extraData.storage} ${extraData.notes}` : extraData.storage;

    const container = document.getElementById('label-result-container');
    container.style.display = 'block';
    container.innerHTML = `
      <div class="card" style="margin-top: 20px; border: 2px solid var(--primary-color);">
        <div class="label-preview" id="label-html" style="padding: 20px; background: white; border-radius: 8px;">
          <div class="label-title" style="text-align: center; font-size: 20px; font-weight: 800; margin-bottom: 15px; text-transform: uppercase;">${prod.recipeName}</div>
          
          <div class="label-ingredients" style="font-size: 13px; line-height: 1.4; margin-bottom: 15px;">
            <strong>Ingredienti:</strong> ${ingString}.
          </div>
          
          <div style="font-size: 13px; margin-bottom: 15px;">
             <strong>Peso Netto:</strong> ${extraData.weight} g<br>
             <strong>Modalità di conservazione:</strong> ${storageText}<br>
             <strong>Lotto:</strong> ${lotto}<br>
             <strong>${expiryWording}:</strong> ${expiryFormatted}
          </div>

          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 10px; color: var(--text-secondary); max-width: 60%;">
              Prodotto da:<br>${osaText}
            </div>
            <div class="label-qr" id="qr-code-container"></div>
          </div>
        </div>
        
        <button class="btn-primary" style="margin-top: 20px; width: 100%;" onclick="App.exportLabelPDF('${prod.recipeName.replace(/'/g, "\\'")}', '${ingString.replace(/<[^>]*>?/gm, '').replace(/'/g, "\\'")}', '${lotto}', '${expiryFormatted}', '${extraData.weight}', '${storageText.replace(/'/g, "\\'")}', '${expiryWording}', '${osaText.replace(/'/g, "\\'")}')">
          <i class="ph ph-printer"></i> Stampa Etichetta Reg. 1169/2011 (PDF)
        </button>
      </div>
    `;

    // Generate QR Code
    const qrText = window.location.origin + window.location.pathname + '#/production/' + lotto;
    new QRCode(document.getElementById("qr-code-container"), {
      text: qrText,
      width: 120,
      height: 120,
      colorDark : "#111827",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });
  },

  toggleTempCheckForm(val) {
    if (val === 'rilevamento') {
      document.getElementById('chk-rilevamento-section').style.display = 'block';
      document.getElementById('chk-giustifica-section').style.display = 'none';
    } else {
      document.getElementById('chk-rilevamento-section').style.display = 'none';
      document.getElementById('chk-giustifica-section').style.display = 'block';
    }
  },

  evaluateTempCheck(min, max) {
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    const temp = parseFloat(document.getElementById('form-chk-temp').value);
    const feedback = document.getElementById('chk-feedback');
    const corr = document.getElementById('chk-corrective-section');
    
    if (isNaN(temp)) {
      feedback.innerHTML = '';
      corr.style.display = 'none';
      return;
    }
    
    if (temp >= minVal && temp <= maxVal) {
      feedback.innerHTML = '<span class="text-conforme">CONFORME</span>';
      corr.style.display = 'none';
    } else {
      feedback.innerHTML = '<span class="text-non-conforme">NON CONFORME</span>';
      corr.style.display = 'block';
    }
  },

  formatDate(isoString) {
    if (!isoString) return '';
    if (isoString.includes('/')) return isoString;
    const parts = isoString.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoString;
  },

  openPrintModal(tableName, title) {
    const modal = document.getElementById('global-modal');
    const modalTitle = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    const saveBtn = document.getElementById('modal-save-btn');
    
    modalTitle.innerHTML = `<i class="ph-fill ph-printer"></i> Stampa: ${title}`;
    
    let filterSelectHTML = '';
    if (tableName === 'haccp_temperature') {
      const eqs = Store.data.haccp_temp_equipments || [];
      filterSelectHTML = `
        <div class="form-group">
          <label>Filtra per Attrezzatura (Opzionale)</label>
          <select id="print-filter-id">
            <option value="">Tutte le attrezzature</option>
            ${eqs.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (tableName === 'haccp_hygiene') {
      const workers = Store.data.workers || [];
      filterSelectHTML = `
        <div class="form-group">
          <label>Filtra per Lavoratore (Opzionale)</label>
          <select id="print-filter-id">
            <option value="">Tutti i lavoratori</option>
            ${workers.map(w => `<option value="${w.id}">${w.firstName} ${w.lastName}</option>`).join('')}
          </select>
        </div>
      `;
    }
    
    body.innerHTML = `
      <div style="display: flex; gap: 10px;">
        <div class="form-group" style="flex:1;">
          <label>Da Data</label>
          <input type="date" id="print-date-from" />
        </div>
        <div class="form-group" style="flex:1;">
          <label>A Data</label>
          <input type="date" id="print-date-to" />
        </div>
      </div>
      ${filterSelectHTML}
    `;
    
    saveBtn.innerText = "Genera PDF";
    saveBtn.onclick = () => {
      const from = document.getElementById('print-date-from').value;
      const to = document.getElementById('print-date-to').value;
      const filterId = document.getElementById('print-filter-id')?.value || '';
      
      if (tableName === 'haccp_sanitation') {
        this.exportSanitationPDF(title, from, to);
      } else if (tableName === 'haccp_temperature') {
        this.exportTemperaturePDF(title, from, to, filterId);
      } else if (tableName === 'haccp_hygiene') {
        this.exportHygienePDF(title, from, to, filterId);
      } else if (tableName === 'haccp_noncompliance') {
        this.exportNonCompliancePDF(title, from, to);
      } else if (tableName === 'haccp_structure') {
        this.exportStructurePDF(title, from, to);
      } else {
        this.exportPDF(tableName, title, from, to, filterId);
      }
      this.closeModal();
      saveBtn.innerText = "Salva"; // Reset
    };
    
    modal.classList.add('active');
  },

  // Funzioni PDF con JsPDF
  exportPDF(tableName, title, fromDate, toDate, eqFilter) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Intestazione con logo simulato
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Primary color
    doc.text("HACCP & TRACCIABILITÀ", 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    let titleText = title;
    if (fromDate && toDate) titleText += ` (Dal ${this.formatDate(fromDate)} al ${this.formatDate(toDate)})`;
    doc.text(titleText, 14, 30);
    
    const settings = Store.data.settings || {};
    const applyModel = settings.applyModelNumber !== undefined ? settings.applyModelNumber : true;
    
    const modelConfigs = settings.model_configs || {};
    let modelText = "";
    
    if (tableName === 'haccp_temperature') modelText = modelConfigs['haccp_temperature']?.model || settings.modelTemperature || 'MOD-TEMP Rev.0';
    else if (tableName === 'haccp_sanitation') modelText = modelConfigs['haccp_sanitation']?.model || settings.modelSanitation || 'MOD-SAN Rev.0';
    else if (tableName === 'haccp_hygiene') modelText = modelConfigs['haccp_hygiene']?.model || settings.modelHygiene || 'MOD-HYG Rev.0';
    else if (tableName === 'haccp_noncompliance') modelText = modelConfigs['haccp_noncompliance']?.model || settings.modelNonCompliance || 'MOD-NC Rev.0';
    else if (tableName === 'haccp_structure') modelText = modelConfigs['haccp_structure']?.model || settings.modelStructure || 'MOD-STR Rev.0';
    else if (tableName === 'trace_incoming') modelText = modelConfigs['trace_incoming']?.model || 'MOD-CAR Rev.0';
    else if (tableName === 'trace_production') modelText = modelConfigs['trace_production']?.model || 'MOD-PROD Rev.0';
    else modelText = modelConfigs[tableName]?.model || settings.modelGeneric || 'MOD-GEN Rev.0';
    
    if (!applyModel) modelText = "";

    let data = Store.getTable(tableName);
    
    // Filtering
    if (fromDate || toDate || eqFilter) {
      data = data.filter(item => {
        let dateToCompare = item.date || (item.createdAt ? item.createdAt.split('T')[0] : '');
        let pass = true;
        if (fromDate && dateToCompare < fromDate) pass = false;
        if (toDate && dateToCompare > toDate) pass = false;
        if (eqFilter && item.equipmentId !== eqFilter) pass = false;
        return pass;
      });
    }

    if(data.length === 0) {
      doc.setFontSize(10);
      doc.text("Nessun dato presente nel registro per i filtri selezionati.", 14, 45);
    } else {
      const keys = Object.keys(data[0]).filter(k => k !== 'id');
      const tableData = data.map(item => keys.map(k => {
        let val = item[k];
        if (k === 'date' || k === 'createdAt') val = this.formatDate(val);
        if(typeof val === 'object') return JSON.stringify(val);
        return val;
      }));
      
      doc.autoTable({
        startY: 38,
        head: [keys.map(k => k.toUpperCase().replace('ID', ''))],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 }
      });
    }

    if(applyModel && modelText) {
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
         doc.setPage(i);
         doc.setFontSize(8);
         doc.text(modelText, 14, doc.internal.pageSize.height - 10);
         doc.text(`Pagina ${i} di ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    }

    doc.save(`${tableName}_export.pdf`);
  },

  exportSanitationPDF(title, fromDate, toDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Intestazione
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("HACCP & TRACCIABILITÀ", 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    let titleText = title;
    if (fromDate && toDate) titleText += ` (Dal ${this.formatDate(fromDate)} al ${this.formatDate(toDate)})`;
    doc.text(titleText, 14, 30);

    const settings = Store.data.settings || {};
    const modelConfigs = settings.model_configs || {};
    let modelText = modelConfigs['haccp_sanitation']?.model || settings.modelSanitation || "MOD-SAN Rev.0";
    if (!applyModel) modelText = "";

    let records = Store.data.haccp_sanitation || [];
    
    if (fromDate || toDate) {
      records = records.filter(item => {
        let dateToCompare = item.date || '';
        let pass = true;
        if (fromDate && dateToCompare < fromDate) pass = false;
        if (toDate && dateToCompare > toDate) pass = false;
        return pass;
      });
    }
    
    if(records.length === 0) {
      doc.setFontSize(10);
      doc.text("Nessun dato presente nel registro.", 14, 45);
    } else {
      // Tabella Attrezzature
      const eqData = [];
      records.forEach(rec => {
        if(rec.equipmentCleaned && rec.equipmentCleaned.length > 0) {
          rec.equipmentCleaned.forEach(eq => {
            eqData.push([this.formatDate(rec.date), eq.name, eq.detergentName, rec.operator]);
          });
        }
      });

      doc.setFontSize(12);
      doc.text("Sezione: Attrezzature", 14, 42);
      
      doc.autoTable({
        startY: 46,
        head: [['DATA', 'ATTREZZATURA', 'DETERGENTE', 'OPERATORE']],
        body: eqData.length > 0 ? eqData : [['-', '-', '-', '-']],
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 },
        margin: { bottom: 20 }
      });

      // Tabella Ambienti
      const envData = [];
      records.forEach(rec => {
        if(rec.environmentsCleaned && rec.environmentsCleaned.length > 0) {
          rec.environmentsCleaned.forEach(env => {
            envData.push([this.formatDate(rec.date), env.name, env.detergentName, rec.operator]);
          });
        }
      });

      let finalY = doc.lastAutoTable.finalY || 50;
      
      // Controllo se c'è spazio sufficiente
      if(finalY > doc.internal.pageSize.height - 40) {
        doc.addPage();
        finalY = 20;
      } else {
        finalY += 15;
      }

      doc.setFontSize(12);
      doc.text("Sezione: Ambienti di Lavoro", 14, finalY - 4);
      
      doc.autoTable({
        startY: finalY,
        head: [['DATA', 'AMBIENTE DI LAVORO', 'DETERGENTE', 'OPERATORE']],
        body: envData.length > 0 ? envData : [['-', '-', '-', '-']],
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 },
        margin: { bottom: 20 }
      });
    }

    if(applyModel && modelText) {
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
         doc.setPage(i);
         doc.setFontSize(8);
         doc.text(modelText, 14, doc.internal.pageSize.height - 10);
         doc.text(`Pagina ${i} di ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    }

    doc.save(`sanificazione_export.pdf`);
  },

  exportTemperaturePDF(title, fromDate, toDate, eqFilter) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape'); // Orizzontale per far stare tutte le colonne
    
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text("HACCP & TRACCIABILITÀ", 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    let titleText = title;
    if (fromDate && toDate) titleText += ` (Dal ${this.formatDate(fromDate)} al ${this.formatDate(toDate)})`;
    doc.text(titleText, 14, 30);

    const settings = Store.data.settings || {};
    const modelConfigs = settings.model_configs || {};
    let modelText = modelConfigs['haccp_temperature']?.model || settings.modelTemperature || "MOD-TEMP Rev.0";
    if (!applyModel) modelText = "";

    let records = Store.data.haccp_temperature || [];
    
    // Filtro per data e attrezzatura
    records = records.filter(item => {
      let dateToCompare = item.date || '';
      let pass = true;
      if (fromDate && dateToCompare < fromDate) pass = false;
      if (toDate && dateToCompare > toDate) pass = false;
      if (eqFilter && item.equipmentId !== eqFilter) pass = false;
      return pass;
    }).sort((a,b) => new Date(a.date + 'T' + (a.time||'00:00')) - new Date(b.date + 'T' + (b.time||'00:00')));
    
    if(records.length === 0) {
      doc.setFontSize(10);
      doc.text("Nessun dato presente nel registro per i filtri selezionati.", 14, 45);
    } else {
      const tableData = records.map(r => [
        this.formatDate(r.date),
        r.time || '-',
        r.equipmentName || 'N/D',
        r.equipmentLocation || 'N/D',
        r.temp !== undefined ? r.temp + '°C' : (r.status === 'GIUSTIFICATO' ? 'GIUSTIF.' : '-'),
        r.equipmentRange || '-',
        r.status,
        r.status === 'NON CONFORME' ? (r.correctiveAction || '-') : (r.justification || ''),
        r.operator || '-'
      ]);

      doc.autoTable({
        startY: 38,
        head: [['DATA', 'ORA', 'ATTREZZATURA', 'UBICAZIONE', 'TEMP.', 'RANGE', 'CONF.', 'NOTE / AZ. CORRETTIVA', 'FIRMA']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          7: { cellWidth: 40 } // Più spazio per le note
        }
      });
    }

    if(applyModel && modelText) {
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
         doc.setPage(i);
         doc.setFontSize(8);
         doc.text(modelText, 14, doc.internal.pageSize.height - 10);
         doc.text(`Pagina ${i} di ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    }

    doc.save(`temperature_export.pdf`);
  },

  exportHygienePDF(title, fromDate, toDate, workerId) {
    const { jsPDF } = window.jspdf;
    
    const settings = Store.data.settings || {};
    const modelConfigs = settings.model_configs || {};
    let modelText = modelConfigs['haccp_hygiene']?.model || settings.modelHygiene || "MOD-HYG Rev.0";
    if (!applyModel) modelText = "";

    let rawRecords = Store.data.haccp_hygiene || [];
    let filteredRecords = rawRecords.filter(item => {
      let dateToCompare = item.date || '';
      let pass = true;
      if (fromDate && dateToCompare < fromDate) pass = false;
      if (toDate && dateToCompare > toDate) pass = false;
      return pass;
    }).sort((a,b) => new Date(a.date) - new Date(b.date));

    // Espansione dati
    let expandedData = [];
    filteredRecords.forEach(r => {
      const ids = r.workerIds || [];
      ids.forEach(wid => {
        if (!workerId || wid === workerId) {
          const wInfo = (Store.data.workers || []).find(w => w.id === wid);
          expandedData.push({
            ...r,
            workerName: wInfo ? `${wInfo.firstName} ${wInfo.lastName}` : 'N/D'
          });
        }
      });
    });

    if (expandedData.length === 0) {
      const doc = new jsPDF();
      doc.setFontSize(10);
      doc.text("Nessun dato presente nel registro per i filtri selezionati.", 14, 20);
      doc.save(`igiene_personale_export.pdf`);
      return;
    }

    const checklistFullLabels = [
      "Indumenti da lavoro",
      "Calzature",
      "Copricapo idoneo ed indossato correttamente",
      "Assenza di ferite non protette",
      "Unghie lunghe, non pulite e/o con smalto",
      "Comportamenti impropri (es. fumo, cellulare)",
      "Assenza di gioielli (anelli, bracciali, ecc.)",
      "Igiene delle mani corretta",
      "Manipolazione alimenti corretta"
    ];

    if (!workerId) {
      // MODALITÀ COMPATTA (LANDSCAPE) - TUTTI I LAVORATORI
      const doc = new jsPDF('landscape');
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text("HACCP & TRACCIABILITÀ", 14, 15);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`REGISTRO IGIENE PERSONALE - TUTTI I LAVORATORI`, 14, 25);
      if (fromDate && toDate) doc.setFontSize(10), doc.text(`Periodo: dal ${this.formatDate(fromDate)} al ${this.formatDate(toDate)}`, 14, 32);

      const tableData = expandedData.map(r => {
        const row = [this.formatDate(r.date), r.workerName];
        let specificActions = [];
        checklistFullLabels.forEach(label => {
          const check = (r.checks || []).find(c => c.label === label) || {};
          row.push(check.status || '-');
          if (check.status === 'NC' && check.correctiveAction) {
            specificActions.push(`${label}: ${check.correctiveAction}`);
          }
        });
        const allNotes = [r.notes, ...specificActions].filter(n => n && n !== '-').join('; ');
        row.push(allNotes || '-');
        row.push(r.operator);
        return row;
      });

      doc.autoTable({
        startY: 38,
        head: [['DATA', 'LAVORATORE', ...checklistFullLabels, 'NOTE / AZIONI', 'FIRMA']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [37, 99, 235], 
          fontSize: 6, 
          halign: 'center', 
          valign: 'middle',
          minCellHeight: 15 
        },
        styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
        columnStyles: {
          0: { cellWidth: 18 }, // Data
          1: { cellWidth: 25 }, // Lavoratore
          11: { cellWidth: 45 }, // Note (un po' più larga)
          12: { cellWidth: 22 }  // Firma
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index >= 2 && data.column.index <= 10) {
            data.cell.styles.halign = 'center';
            if (data.cell.raw === 'NC') doc.setTextColor(200, 0, 0);
            else if (data.cell.raw === 'C') doc.setTextColor(0, 150, 0);
          }
        }
      });

      if(applyModel && modelText) {
        const pageCount = doc.internal.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
           doc.setPage(i);
           doc.setFontSize(8);
           doc.text(modelText, 14, doc.internal.pageSize.height - 10);
           doc.text(`Pagina ${i} di ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        }
      }
      doc.save(`igiene_personale_collettivo.pdf`);

    } else {
      // MODALITÀ DETTAGLIATA (PORTRAIT) - SINGOLO LAVORATORE
      const doc = new jsPDF();
      expandedData.forEach((r, idx) => {
        if (idx > 0) doc.addPage();
        
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235);
        doc.text("HACCP & TRACCIABILITÀ", 14, 20);
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text("SCHEDA VERIFICA IGIENE PERSONALE", 14, 30);

        let y = 45;
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`DATA: ${this.formatDate(r.date)}`, 14, y);
        y += 7;
        doc.text(`LAVORATORE: ${r.workerName.toUpperCase()}`, 14, y);
        y += 7;
        doc.setFont("helvetica", "normal");
        doc.text(`Responsabile Controllo: ${r.operator}`, 14, y);
        y += 10;

        const detailedChecks = (r.checks || []).map(c => [
          c.label,
          c.status === 'C' ? 'C (Conforme)' : 'NC (Non Conforme)',
          c.status === 'NC' ? (c.correctiveAction || 'Nessuna specifica') : '-'
        ]);

        doc.autoTable({
          startY: y,
          head: [['VOCE DI CONTROLLO', 'ESITO', 'AZIONI CORRETTIVE']],
          body: detailedChecks,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] },
          styles: { fontSize: 9 },
          columnStyles: {
            1: { cellWidth: 35 },
            2: { cellWidth: 60 }
          },
          didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 1) {
              if (data.cell.raw.includes('NC')) doc.setTextColor(200, 0, 0);
              else doc.setTextColor(0, 150, 0);
            }
          }
        });

        if (r.notes) {
           let ny = doc.lastAutoTable.finalY + 10;
           doc.setFontSize(9);
           doc.setFont("helvetica", "bold");
           doc.text("Note Generali:", 14, ny);
           doc.setFont("helvetica", "normal");
           doc.text(r.notes, 14, ny + 5);
        }

        let finalY = doc.lastAutoTable.finalY + (r.notes ? 20 : 15);
        doc.setFontSize(10);
        doc.text("Firma del Responsabile:", 14, finalY);
        doc.setFont("helvetica", "italic");
        doc.text(r.operator, 60, finalY);

        if(applyModel && modelText) {
          doc.setFontSize(8);
          doc.text(modelText, 14, doc.internal.pageSize.height - 10);
        }
      });
      doc.save(`igiene_personale_${expandedData[0].workerName.replace(' ', '_')}.pdf`);
    }
  },

  exportNonCompliancePDF(title, fromDate, toDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    
    const settings = Store.data.settings || {};
    const modelConfigs = settings.model_configs || {};
    let modelText = modelConfigs['haccp_noncompliance']?.model || settings.modelNonCompliance || "MOD-NC Rev.0";
    if (!applyModel) modelText = "";

    let rawRecords = Store.data.haccp_noncompliance || [];
    let filteredRecords = rawRecords.filter(item => {
      let dateToCompare = item.date || '';
      let pass = true;
      if (fromDate && dateToCompare < fromDate) pass = false;
      if (toDate && dateToCompare > toDate) pass = false;
      return pass;
    }).sort((a,b) => new Date(a.date) - new Date(b.date));

    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("HACCP & TRACCIABILITÀ", 14, 20);
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`REGISTRO NON CONFORMITÀ ED AZIONI CORRETTIVE`, 14, 30);
    if (fromDate && toDate) doc.setFontSize(10), doc.text(`Periodo: dal ${this.formatDate(fromDate)} al ${this.formatDate(toDate)}`, 14, 37);

    const tableData = filteredRecords.map(r => [
      this.formatDate(r.date),
      r.description,
      r.correctiveAction,
      r.responsibleWorker,
      this.formatDate(r.dueDate),
      r.isClosed ? 'CHIUSA' : 'APERTA',
      r.closedDate ? this.formatDate(r.closedDate) : '-'
    ]);

    doc.autoTable({
      startY: 45,
      head: [['DATA RIL.', 'DESCRIZIONE NC', 'AZIONE CORRETTIVA', 'RESPONSABILE', 'SCADENZA', 'STATO', 'CHIUSURA']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        1: { cellWidth: 50 },
        2: { cellWidth: 50 },
        5: { fontStyle: 'bold', halign: 'center' }
      },
      didDrawCell: (data) => {
        if (data.section === 'body' && data.column.index === 5) {
          if (data.cell.raw === 'APERTA') doc.setTextColor(200, 0, 0);
          else doc.setTextColor(0, 150, 0);
        }
      }
    });

    if(applyModel && modelText) {
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
         doc.setPage(i);
         doc.setFontSize(8);
         doc.text(modelText, 14, doc.internal.pageSize.height - 10);
         doc.text(`Pagina ${i} di ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
      }
    }

    doc.save(`registro_non_conformita.pdf`);
  },

  exportStructurePDF(title, fromDate, toDate) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('portrait');
    
    const settings = Store.data.settings || {};
    const modelConfigs = settings.model_configs || {};
    let modelText = modelConfigs['haccp_structure']?.model || settings.modelStructure || "MOD-STR Rev.0";
    if (!applyModel) modelText = "";

    let rawRecords = Store.data.haccp_structure || [];
    let filteredRecords = rawRecords.filter(item => {
      let d = item.date || '';
      return (!fromDate || d >= fromDate) && (!toDate || d <= toDate);
    }).sort((a,b) => new Date(a.date) - new Date(b.date));

    filteredRecords.forEach((r, idx) => {
      if (idx > 0) doc.addPage();
      
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.text("HACCP & TRACCIABILITÀ", 14, 20);
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("SCHEDA CONTROLLO AMBIENTI E STRUTTURE", 14, 30);
      
      doc.setFontSize(10);
      doc.text(`Data: ${this.formatDate(r.date)}`, 14, 40);
      doc.text(`Frequenza: ${r.frequency}`, 70, 40);
      doc.text(`Ambiente: ${r.environment}`, 14, 47);
      doc.text(`Operatore: ${r.operator}`, 70, 47);

      const tableData = r.checks.map(c => [
        c.label,
        c.status,
        c.correctiveAction || '-'
      ]);

      doc.autoTable({
        startY: 55,
        head: [['PUNTO DI CONTROLLO', 'ESITO', 'AZIONE CORRETTIVA']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        columnStyles: {
          1: { halign: 'center', cellWidth: 20 },
          2: { cellWidth: 80 }
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 1) {
            if (data.cell.raw === 'NC') doc.setTextColor(200, 0, 0);
            else doc.setTextColor(0, 150, 0);
          }
        }
      });

      doc.setFontSize(10);
      doc.setTextColor(0,0,0);
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.text("Firma del Responsabile: __________________________", 14, finalY);
      doc.setFontSize(8);
      doc.text(`(${r.operator})`, 55, finalY + 5);

      if(applyModel && modelText) {
        doc.setFontSize(8);
        doc.text(modelText, 14, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`registro_ambienti_strutture.pdf`);
  },

  exportLabelPDF(name, ingredientsText, lot, expiry, weight, storage, expiryWording, osa) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [100, 100] // Etichetta 10x10 cm
    });

    const settings = Store.data.settings || {};
    const applyModel = settings.applyModelNumber !== undefined ? settings.applyModelNumber : true;
    const modelText = settings.modelNumber || "MOD-ETI Rev.0";

    // Header - Nome Prodotto
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(name.toUpperCase(), 50, 12, { align: "center" });
    
    // Body - Ingredienti
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const splitIngredients = doc.splitTextToSize(`Ingredienti: ${ingredientsText}`, 90);
    doc.text(splitIngredients, 5, 22);

    // Dati Variabili
    let currentY = 22 + (splitIngredients.length * 4) + 5;
    doc.setFontSize(10);
    doc.text(`Peso Netto: ${weight} g`, 5, currentY);
    currentY += 5;
    
    doc.setFontSize(9);
    const splitStorage = doc.splitTextToSize(`Conservazione: ${storage}`, 90);
    doc.text(splitStorage, 5, currentY);
    currentY += (splitStorage.length * 4) + 2;

    doc.setFont("helvetica", "bold");
    doc.text(`Lotto: ${lot}`, 5, currentY);
    currentY += 5;
    doc.text(`${expiryWording}: ${expiry}`, 5, currentY);

    // QR Code
    const canvas = document.querySelector("#qr-code-container canvas");
    if(canvas) {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, 'PNG', 65, currentY - 5, 25, 25);
    }

    // Footer - OSA
    doc.setFontSize(7);
    doc.setFont("helvetica", "italic");
    doc.text(`Prodotto da: ${osa}`, 5, 92);

    if(applyModel && modelText) {
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text(modelText, 5, 97);
    }

    doc.save(`etichetta_${lot}.pdf`);
  }
};

window.closeModal = () => App.closeModal();

// Init app
document.addEventListener('DOMContentLoaded', () => {
  try {
    App.init();
  } catch (e) {
    console.error("Fatal initialization error:", e);
    document.body.innerHTML += `<div style="position:fixed; bottom:20px; left:20px; right:20px; background:white; padding:20px; border:2px solid red; z-index:10000; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
      <h3 style="color:red; margin-bottom:10px;">Errore Fatale Avvio</h3>
      <p style="font-size:13px;">${e.message}</p>
      <button onclick="location.reload()" style="margin-top:10px; padding:8px 16px; background:red; color:white; border:none; border-radius:6px;">Ricarica</button>
    </div>`;
  }
});
