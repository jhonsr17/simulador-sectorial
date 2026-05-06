/* ── SimSectorial · app.js ── */

// ── Datos de configuración ─────────────────────────────────────────────────

const SECTORS = ['Manufactura','Comercio','Financiero','Agropecuario','Inmobiliario','Construcción','Transporte','Servicios','Minería'];
const CIIU_CODES = ['C','G','K','A','L','F','H','N','B'];

const CITY_LABELS = {
  bogota:'Bogotá D.C.', medellin:'Medellín', cali:'Cali',
  barranquilla:'Barranquilla', bucaramanga:'Bucaramanga',
  cartagena:'Cartagena', manizales:'Manizales', pereira:'Pereira',
};

const CITY_PIB = {
  bogota:      [12,22,28, 3,15, 8, 6, 5, 1],
  medellin:    [20,18,15, 5,12,12, 8, 6, 4],
  cali:        [18,20,10,10,10,10,10, 7, 5],
  barranquilla:[15,22, 8, 8,10,12,12, 8, 5],
  bucaramanga: [14,25, 8,12,10,10, 8, 7, 6],
  cartagena:   [10,18, 6,12, 8,10,14, 8,14],
  manizales:   [16,20,10,18, 8,10, 8, 6, 4],
  pereira:     [14,22,10,16,10,10, 8, 6, 4],
};

const SCENARIOS = {
  base:     {tasa:9.75, ipc:5.4,  trm:4180, pib:1.6,  desemp:10.3, oil:72,  ied:16.8, conf:-8},
  boom:     {tasa:6.5,  ipc:3.5,  trm:3900, pib:5.2,  desemp:7.5,  oil:95,  ied:28.0, conf:15},
  recesion: {tasa:12.0, ipc:8.2,  trm:4600, pib:-1.5, desemp:16.0, oil:55,  ied:9.0,  conf:-25},
  inflacion:{tasa:14.5, ipc:16.0, trm:4300, pib:0.8,  desemp:12.0, oil:80,  ied:11.0, conf:-20},
  dolar:    {tasa:10.5, ipc:7.0,  trm:5500, pib:1.2,  desemp:11.5, oil:68,  ied:14.0, conf:-12},
};

const SLIDER_CONFIG = {
  banrep: [
    {id:'tasa',  label:'Tasa de interés BanRep', min:3,    max:20,   step:0.25, fmt: v => v.toFixed(2)+'%'},
    {id:'ipc',   label:'Inflación (IPC)',         min:1,    max:20,   step:0.1,  fmt: v => v.toFixed(1)+'%'},
    {id:'trm',   label:'TRM (USD/COP)',            min:3000, max:6000, step:10,   fmt: v => v.toLocaleString('es-CO')},
    {id:'pib',   label:'Crecimiento PIB',          min:-4,   max:8,    step:0.1,  fmt: v => (v>=0?'+':'')+v.toFixed(1)+'%'},
  ],
  sector: [
    {id:'desemp',label:'Desempleo nacional',       min:4,    max:25,   step:0.1,  fmt: v => v.toFixed(1)+'%'},
    {id:'oil',   label:'Precio petróleo (USD/bl)', min:20,   max:130,  step:1,    fmt: v => 'USD '+v.toFixed(0)},
    {id:'ied',   label:'IED (USD miles de millones)', min:5, max:40,   step:0.1,  fmt: v => 'USD '+v.toFixed(1)+'B'},
    {id:'conf',  label:'Confianza del consumidor', min:-30,  max:30,   step:1,    fmt: v => (v>=0?'+':'')+v.toFixed(0)},
  ],
};

// ── Pesos econométricos por sector ────────────────────────────────────────
const SECTOR_WEIGHTS = {
  Manufactura:  [0.25,0.15,0.20,0.10,0.05,0.10,0.10,0.05],
  Comercio:     [0.20,0.20,0.25,0.05,0.00,0.10,0.10,0.10],
  Financiero:   [0.30,0.25,0.05,0.05,0.05,0.05,0.10,0.15],
  Agropecuario: [0.15,0.10,0.20,0.05,0.15,0.05,0.05,0.25],
  Inmobiliario: [0.30,0.15,0.05,0.10,0.10,0.05,0.10,0.15],
  Construcción: [0.25,0.10,0.05,0.10,0.15,0.10,0.05,0.20],
  Transporte:   [0.15,0.10,0.25,0.05,0.00,0.10,0.20,0.15],
  Servicios:    [0.15,0.15,0.10,0.00,0.05,0.10,0.20,0.25],
  Minería:      [0.10,0.10,0.10,0.05,0.20,0.05,0.10,0.30],
};

// ── Estado global ──────────────────────────────────────────────────────────
let charts = {};
let excelData = null;
let excelMeta = { rows:0, sheets:[], ciuuCol:null, saludCol:null, atractivoCol:null, prospectivaCol:null };
let activeTab = 'salud';
let excelScores = null; // scores reales del Excel por índice de sector

// ── Inicialización ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildSliders();
  bindEvents();
  loadScenario('base');
});

function buildSliders() {
  ['banrep','sector'].forEach(group => {
    const container = document.getElementById(`sliders-${group}`);
    SLIDER_CONFIG[group].forEach(cfg => {
      const defVal = SCENARIOS.base[cfg.id];
      container.insertAdjacentHTML('beforeend', `
        <div class="slider-row">
          <div class="slider-header">
            <span class="slider-name">${cfg.label}</span>
            <span class="slider-val" id="val-${cfg.id}">${cfg.fmt(defVal)}</span>
          </div>
          <input type="range" id="s-${cfg.id}" min="${cfg.min}" max="${cfg.max}" step="${cfg.step}" value="${defVal}">
        </div>`);
      document.getElementById(`s-${cfg.id}`).addEventListener('input', onSliderChange);
    });
  });
}

function bindEvents() {
  document.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => loadScenario(btn.dataset.scenario));
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab, btn));
  });
  document.getElementById('citySelect').addEventListener('change', () => update());
  document.getElementById('xlsxFile').addEventListener('change', e => loadExcel(e.target.files[0]));
}

// ── Lectura de valores ─────────────────────────────────────────────────────
function getVals() {
  const all = [...SLIDER_CONFIG.banrep, ...SLIDER_CONFIG.sector];
  const vals = {};
  all.forEach(cfg => {
    vals[cfg.id] = parseFloat(document.getElementById(`s-${cfg.id}`).value);
  });
  return vals;
}

function updateLabels(v) {
  const all = [...SLIDER_CONFIG.banrep, ...SLIDER_CONFIG.sector];
  all.forEach(cfg => {
    document.getElementById(`val-${cfg.id}`).textContent = cfg.fmt(v[cfg.id]);
  });
}

// ── Escenarios ─────────────────────────────────────────────────────────────
function loadScenario(name) {
  const s = SCENARIOS[name];
  const all = [...SLIDER_CONFIG.banrep, ...SLIDER_CONFIG.sector];
  all.forEach(cfg => {
    const el = document.getElementById(`s-${cfg.id}`);
    if (el && s[cfg.id] !== undefined) el.value = s[cfg.id];
  });
  document.querySelectorAll('.pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scenario === name);
  });
  update();
}

function onSliderChange() {
  document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
  update();
}

// ── Cálculo de scores ──────────────────────────────────────────────────────
function computeFactors(v) {
  return [
    Math.max(0, 1 - (v.tasa - 3) / 20),        // tasaFactor
    Math.max(0, 1 - (v.ipc - 1) / 20),          // ipcFactor
    1 - Math.abs(v.trm - 4000) / 3000,           // trmFactor
    Math.max(0, (v.pib + 4) / 12),               // pibFactor
    Math.max(0, 1 - (v.desemp - 4) / 22),        // desempFactor
    (v.oil - 20) / 110,                           // oilFactor
    v.ied / 40,                                   // iedFactor
    (v.conf + 30) / 60,                           // confFactor
  ];
}

function computeScores(v) {
  const factors = computeFactors(v);
  const pibFactor = factors[3];

  return SECTORS.map((s, i) => {
    const w = SECTOR_WEIGHTS[s];
    const base = w.reduce((acc, wi, j) => acc + wi * factors[j], 0);

    // Si hay datos reales del Excel para este sector, mezcla 70% Excel + 30% macro
    let salud, atractivo, prospectiva;
    if (excelScores && excelScores[i]) {
      const macro = Math.min(100, Math.max(0, base * 115));
      const mix = (excel, macro) => Math.round(excel * 0.70 + macro * 0.30);
      salud       = mix(excelScores[i].salud,       macro);
      atractivo   = mix(excelScores[i].atractivo,   macro);
      prospectiva = mix(excelScores[i].prospectiva, macro);
    } else {
      salud       = Math.round(Math.min(100, Math.max(0, base * 120)));
      atractivo   = Math.round(Math.min(100, Math.max(0, base * 110 + 5)));
      prospectiva = Math.round(Math.min(100, Math.max(0, base * 115 + pibFactor * 8)));
    }
    return { sector: s, ciiu: CIIU_CODES[i], salud, atractivo, prospectiva };
  });
}

function computeKPIs(v) {
  const tasaDelta    = v.tasa - 9.75;
  const creditoGrowth = Math.max(0, +(10 - tasaDelta * 1.2).toFixed(1));
  const iaeIndex      = +((100 + v.pib * 8 - (v.ipc - 3) * 2 + v.conf * 0.5)).toFixed(1);
  const cartera       = Math.max(0, +((3.5 + tasaDelta * 0.4 + Math.max(0, v.desemp - 9) * 0.3)).toFixed(1));
  const empFormal     = Math.max(0, +((56 - (v.desemp - 10) * 0.8)).toFixed(1));

  return [
    {label:'Índice actividad económica', value: iaeIndex,         unit:'IAE',      pos: v.pib >= 1.6,        delta: v.pib >= 1.6 ? '▲ en expansión' : '▼ en contracción'},
    {label:'Crédito empresarial',        value: creditoGrowth,    unit:'% crecim.',pos: creditoGrowth >= 10, delta: creditoGrowth >= 10 ? '▲ dinámico' : '▼ desacelerado'},
    {label:'Cartera vencida',            value: cartera,          unit:'%',        pos: cartera <= 3.5,      delta: cartera <= 3.5 ? '▼ controlada' : '▲ en alerta'},
    {label:'Empleo formal',              value: empFormal,        unit:'%',        pos: empFormal >= 56,     delta: empFormal >= 56 ? '▲ robusto' : '▼ bajo presión'},
    {label:'IED neta',                   value: v.ied.toFixed(1), unit:'USD B',    pos: v.ied >= 16.8,       delta: v.ied >= 16.8 ? '▲ dinámico' : '▼ moderado'},
    {label:'Confianza consumidor',       value: (v.conf >= 0 ? '+':'')+v.conf, unit:'pts', pos: v.conf >= 0, delta: v.conf >= 0 ? '▲ positiva' : '▼ pesimista'},
  ];
}

// ── Render principal ───────────────────────────────────────────────────────
function update() {
  const v = getVals();
  updateLabels(v);
  const scores = computeScores(v);
  const kpis   = computeKPIs(v);
  const city   = document.getElementById('citySelect').value;

  renderKPIs(kpis);
  renderImpactoChart(scores);
  renderPIBChart(city);
  renderTrendChart(v);
  renderEmpleoChart(v);
  renderCreditoChart(v);
  renderTable(activeTab, scores);
}

// ── KPIs ───────────────────────────────────────────────────────────────────
function renderKPIs(kpis) {
  document.getElementById('kpiRow').innerHTML = kpis.map(k => `
    <div class="kpi-card">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value">${k.value}<span class="kpi-unit">${k.unit}</span></div>
      <div class="kpi-delta ${k.pos ? 'pos' : 'neg'}">${k.delta}</div>
    </div>`).join('');
}

// ── Gráfico impacto sectorial ──────────────────────────────────────────────
function renderImpactoChart(scores) {
  const ctx = document.getElementById('c-impacto');
  if (charts.impacto) charts.impacto.destroy();
  charts.impacto = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: scores.map(s => s.sector),
      datasets: [
        {label:'Salud sectorial', data: scores.map(s => s.salud),       backgroundColor:'#1D9E75'},
        {label:'Atractivo',       data: scores.map(s => s.atractivo),   backgroundColor:'#378ADD'},
        {label:'Prospectiva',     data: scores.map(s => s.prospectiva), backgroundColor:'#EF9F27'},
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{ display:false } },
      scales: {
        x: { ticks:{ font:{size:11, family:'DM Sans'}, color:'#9b9a95', autoSkip:false } },
        y: { min:0, max:100, ticks:{ font:{size:11}, color:'#9b9a95' }, grid:{ color:'rgba(0,0,0,0.05)' } }
      }
    }
  });
}

// ── Gráfico PIB regional ───────────────────────────────────────────────────
function renderPIBChart(city) {
  document.getElementById('pib-city-label').textContent = CITY_LABELS[city] || city;
  const data   = CITY_PIB[city] || CITY_PIB.bogota;
  const colors = ['#1D9E75','#378ADD','#EF9F27','#D85A30','#7F77DD','#D4537E','#639922','#888780','#BA7517'];
  const ctx = document.getElementById('c-pib');
  if (charts.pib) charts.pib.destroy();
  charts.pib = new Chart(ctx, {
    type: 'doughnut',
    data: { labels: SECTORS, datasets:[{ data, backgroundColor:colors, borderWidth:0 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position:'right', labels:{ font:{size:10, family:'DM Sans'}, color:'#6b6a65', boxWidth:10, padding:8 } }
      }
    }
  });
}

// ── Gráfico tendencia ──────────────────────────────────────────────────────
function renderTrendChart(v) {
  const months = ['Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May'];
  const base   = 100 + v.pib * 4 - (v.ipc - 3) * 1.5 + v.conf * 0.3;
  const trend  = v.pib >= 0 ? 0.22 : -0.28;
  // Serie determinística (sin random, para que no cambie al redrawear)
  const data = months.map((_, i) => +( base + trend * i ).toFixed(1));
  const ctx = document.getElementById('c-trend');
  if (charts.trend) charts.trend.destroy();
  charts.trend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: [{
        label:'IAE', data,
        borderColor:'#378ADD', backgroundColor:'rgba(55,138,221,0.07)',
        borderWidth:2, pointRadius:3, pointBackgroundColor:'#378ADD',
        fill:true, tension:0.4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{ display:false } },
      scales: {
        x: { ticks:{ font:{size:11}, color:'#9b9a95' }, grid:{ color:'rgba(0,0,0,0.04)' } },
        y: { ticks:{ font:{size:11}, color:'#9b9a95' }, grid:{ color:'rgba(0,0,0,0.04)' } }
      }
    }
  });
}

// ── Gráfico empleo ─────────────────────────────────────────────────────────
function renderEmpleoChart(v) {
  const formal   = SECTORS.map((_,i) => Math.round(55 + (i%3)*3 - v.desemp * 0.8 + Math.abs(v.conf) * 0.1));
  const informal = formal.map(f => 100 - Math.max(0, Math.min(100, f)));
  const ctx = document.getElementById('c-empleo');
  if (charts.empleo) charts.empleo.destroy();
  charts.empleo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: SECTORS,
      datasets: [
        {label:'Formal',   data: formal.map(f => Math.max(0,Math.min(100,f))),   backgroundColor:'#1D9E75', stack:'e'},
        {label:'Informal', data: informal.map(f => Math.max(0,Math.min(100,f))), backgroundColor:'#F0997B', stack:'e'},
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{ position:'bottom', labels:{ font:{size:10}, color:'#6b6a65', boxWidth:10 } } },
      scales: {
        x: { stacked:true, ticks:{ font:{size:9}, color:'#9b9a95', maxRotation:45 } },
        y: { stacked:true, max:100, ticks:{ font:{size:11}, color:'#9b9a95' }, grid:{ color:'rgba(0,0,0,0.04)' } }
      }
    }
  });
}

// ── Gráfico crédito ────────────────────────────────────────────────────────
function renderCreditoChart(v) {
  const tasaDelta = v.tasa - 9.75;
  const meses     = ['Jun','Jul','Ago','Sep','Oct','Nov','Dic','Ene','Feb','Mar','Abr','May'];
  const credito   = meses.map((_,i) => +( Math.max(0, 10 - tasaDelta * 1.1 + i * 0.08) ).toFixed(1));
  const cartera   = meses.map((_,i) => +( Math.max(0, 3.5 + tasaDelta * 0.35 + i * 0.04) ).toFixed(1));
  const ctx = document.getElementById('c-credito');
  if (charts.credito) charts.credito.destroy();
  charts.credito = new Chart(ctx, {
    type: 'line',
    data: {
      labels: meses,
      datasets: [
        {label:'Crédito %', data:credito, borderColor:'#378ADD', borderWidth:2, pointRadius:2, tension:0.4, fill:false},
        {label:'Cartera vencida %', data:cartera, borderColor:'#E24B4A', borderWidth:2, borderDash:[4,4], pointRadius:2, tension:0.4, fill:false},
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend:{ position:'bottom', labels:{ font:{size:10}, color:'#6b6a65', boxWidth:10 } } },
      scales: {
        x: { ticks:{ font:{size:11}, color:'#9b9a95' }, grid:{ color:'rgba(0,0,0,0.04)' } },
        y: { ticks:{ font:{size:11}, color:'#9b9a95' }, grid:{ color:'rgba(0,0,0,0.04)' } }
      }
    }
  });
}

// ── Tabla de indicadores ───────────────────────────────────────────────────
function badgeFor(val) {
  const cls = val >= 65 ? 'badge-green' : val >= 40 ? 'badge-amber' : 'badge-red';
  const label = val >= 65 ? 'Alto' : val >= 40 ? 'Medio' : 'Bajo';
  return `<span class="badge ${cls}">${val} · ${label}</span>`;
}

function renderTable(tab, scores) {
  const wrap = document.getElementById('tabContent');

  if (tab === 'empresas') {
    if (!excelData || excelData.length === 0) {
      wrap.innerHTML = `<div class="empty-state"><i class="ti ti-table-off" style="font-size:32px;display:block;margin-bottom:8px"></i>Sube tu archivo Excel para ver las empresas reales con indicadores por CIIU.</div>`;
      return;
    }
    const cols = Object.keys(excelData[0]).slice(0, 12); // máx 12 columnas
    const rows = excelData.slice(0, 100);
    wrap.innerHTML = `
      <div class="table-scroll">
        <table>
          <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${r[c] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      <p style="font-size:11px;color:#9b9a95;margin-top:8px;padding:0 4px">Mostrando ${rows.length} de ${excelData.length.toLocaleString('es-CO')} registros · ${excelMeta.sheets.length} hojas detectadas</p>`;
    return;
  }

  wrap.innerHTML = `
    <div class="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Sector</th>
            <th>CIIU</th>
            <th>Puntaje</th>
            <th>Fuente</th>
            <th>Impacto macro</th>
          </tr>
        </thead>
        <tbody>
          ${scores.map((s, i) => {
            const val = s[tab];
            const fuente = (excelScores && excelScores[i]) ? 'Excel + macro' : 'Modelo';
            const macroAdj = val >= 65 ? 'Positivo' : val >= 40 ? 'Neutro' : 'Negativo';
            return `<tr>
              <td><strong>${s.sector}</strong></td>
              <td class="mono">${s.ciiu}</td>
              <td>${badgeFor(val)}</td>
              <td style="font-size:11px;color:#9b9a95">${fuente}</td>
              <td style="font-size:11px;color:${val>=65?'#1D9E75':val>=40?'#BA7517':'#A32D2D'}">${macroAdj}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

function switchTab(tab, btn) {
  activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  const v = getVals();
  renderTable(tab, computeScores(v));
}

// ── Carga Excel ────────────────────────────────────────────────────────────
function loadExcel(file) {
  if (!file) return;
  showStatus('info', `<i class="ti ti-loader"></i> Leyendo ${file.name}…`);

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const wb = XLSX.read(e.target.result, { type:'array' });
      excelMeta.sheets = wb.SheetNames;

      // Lee la primera hoja con datos de empresas (busca la que tenga más filas)
      let bestSheet = wb.SheetNames[0];
      let bestLen   = 0;
      wb.SheetNames.forEach(name => {
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[name], { defval:'' });
        if (rows.length > bestLen) { bestLen = rows.length; bestSheet = name; }
      });

      excelData = XLSX.utils.sheet_to_json(wb.Sheets[bestSheet], { defval:'' });

      if (excelData.length === 0) {
        showStatus('error', 'El archivo no tiene filas de datos válidas.');
        return;
      }

      const keys = Object.keys(excelData[0]);
      const find  = (terms) => keys.find(k => terms.some(t => k.toLowerCase().includes(t)));

      excelMeta.ciuuCol        = find(['ciiu','actividad economica','cod actividad','sector']);
      excelMeta.saludCol       = find(['salud']);
      excelMeta.atractivoCol   = find(['atractiv']);
      excelMeta.prospectivaCol = find(['prospect']);

      buildExcelScores();
      updateExcelPanel(file.name);
      showStatus('success', `<i class="ti ti-check"></i> ${file.name} cargado · ${excelData.length.toLocaleString('es-CO')} empresas · ${excelMeta.sheets.length} hojas`);
      update();

    } catch(err) {
      showStatus('error', `Error al leer el archivo: ${err.message}`);
    }
  };
  reader.readAsArrayBuffer(file);
}

function buildExcelScores() {
  const { ciuuCol, saludCol, atractivoCol, prospectivaCol } = excelMeta;
  if (!ciuuCol || !saludCol || !atractivoCol || !prospectivaCol) {
    excelScores = null;
    return;
  }

  const grouped = {};
  excelData.forEach(row => {
    const raw  = (row[ciuuCol] || '').toString().trim();
    const letra = raw.charAt(0).toUpperCase();
    if (!letra || letra === ' ') return;
    if (!grouped[letra]) grouped[letra] = { salud:[], atractivo:[], prospectiva:[] };
    const s = parseFloat(row[saludCol]);
    const a = parseFloat(row[atractivoCol]);
    const p = parseFloat(row[prospectivaCol]);
    if (!isNaN(s)) grouped[letra].salud.push(s);
    if (!isNaN(a)) grouped[letra].atractivo.push(a);
    if (!isNaN(p)) grouped[letra].prospectiva.push(p);
  });

  const avg = arr => arr.length ? Math.round(arr.reduce((a,b) => a+b,0) / arr.length) : null;

  excelScores = CIIU_CODES.map(code => {
    const g = grouped[code];
    if (!g || g.salud.length === 0) return null;
    return {
      salud:       avg(g.salud),
      atractivo:   avg(g.atractivo),
      prospectiva: avg(g.prospectiva),
    };
  });
}

function updateExcelPanel(filename) {
  const { sheets, ciuuCol, saludCol, atractivoCol, prospectivaCol } = excelMeta;
  const rows = excelData.length;
  const check = (col) => col
    ? `<span style="color:#1D9E75">✓</span> ${col}`
    : `<span style="color:#E24B4A">✗ no encontrado</span>`;

  document.getElementById('excel-info-body').innerHTML = `
    <strong style="font-size:12px;color:#1a1a18">${filename}</strong><br>
    Registros: <strong>${rows.toLocaleString('es-CO')}</strong><br>
    Hojas: ${sheets.join(', ')}<br>
    <br>
    CIIU: ${check(ciuuCol)}<br>
    Salud: ${check(saludCol)}<br>
    Atractivo: ${check(atractivoCol)}<br>
    Prospectiva: ${check(prospectivaCol)}<br>
    ${excelScores ? '<br><span style="color:#1D9E75;font-size:11px">✓ Indicadores reales activos · mezcla 70% Excel + 30% macro</span>' : '<br><span style="color:#BA7517;font-size:11px">⚠ Columnas no detectadas · revisa nombres</span>'}`;
}

function showStatus(type, msg) {
  const el = document.getElementById('uploadStatus');
  el.className = `upload-status ${type}`;
  el.innerHTML = msg;
  el.style.display = 'flex';
  if (type === 'success') setTimeout(() => el.style.display = 'none', 5000);
}

// ── Exportar ───────────────────────────────────────────────────────────────
function exportPDF() {
  window.print();
}
