/* ── SimSectorial · app.js ── */

// ── Datos de configuración ─────────────────────────────────────────────────

const SECTORS = ['Manufactura','Comercio','Financiero','Agropecuario','Inmobiliario','Construcción','Transporte','Servicios','Minería'];
const CIIU_CODES = ['C','G','K','A','L','F','H','N','B'];

const CIIU_SECTIONS = [
  { code:'A', name:'Agricultura, ganadería, caza, silvicultura y pesca',
    desc:'Producción agropecuaria, actividades forestales, pesca y acuicultura',
    color:'#1D9E75',
    divisions:[
      {code:'01', name:'Agricultura, ganadería, caza y actividades de servicios conexas'},
      {code:'02', name:'Silvicultura y extracción de madera'},
      {code:'03', name:'Pesca y acuicultura'},
    ]},
  { code:'B', name:'Explotación de minas y canteras',
    desc:'Minería de carbón, petróleo, gas natural, minerales metálicos y no metálicos',
    color:'#BA7517',
    divisions:[
      {code:'05', name:'Extracción de carbón de piedra y lignito'},
      {code:'06', name:'Extracción de petróleo crudo y gas natural'},
      {code:'07', name:'Extracción de minerales metalíferos'},
      {code:'08', name:'Extracción de otras minas y canteras'},
      {code:'09', name:'Servicios de apoyo para la explotación de minas y canteras'},
    ]},
  { code:'C', name:'Industrias manufactureras',
    desc:'Fabricación de alimentos, textiles, químicos, metales, maquinaria y equipo',
    color:'#378ADD',
    divisions:[
      {code:'10', name:'Elaboración de productos alimenticios'},
      {code:'11', name:'Elaboración de bebidas'},
      {code:'12', name:'Elaboración de productos de tabaco'},
      {code:'13', name:'Fabricación de productos textiles'},
      {code:'14', name:'Confección de prendas de vestir'},
      {code:'15', name:'Curtido y recurtido de cueros; fabricación de calzado'},
      {code:'16', name:'Transformación de la madera y productos de madera y corcho'},
      {code:'17', name:'Fabricación de papel, cartón y productos derivados'},
      {code:'18', name:'Actividades de impresión y reproducción de grabaciones'},
      {code:'19', name:'Coquización y fabricación de productos de la refinación del petróleo'},
      {code:'20', name:'Fabricación de sustancias y productos químicos'},
      {code:'21', name:'Fabricación de productos farmacéuticos y sustancias medicinales'},
      {code:'22', name:'Fabricación de productos de caucho y plástico'},
      {code:'23', name:'Fabricación de otros productos minerales no metálicos'},
      {code:'24', name:'Fabricación de productos metalúrgicos básicos'},
      {code:'25', name:'Fabricación de productos elaborados de metal (excl. maquinaria)'},
      {code:'26', name:'Fabricación de productos informáticos, electrónicos y ópticos'},
      {code:'27', name:'Fabricación de aparatos y equipo eléctrico'},
      {code:'28', name:'Fabricación de maquinaria y equipo n.c.p.'},
      {code:'29', name:'Fabricación de vehículos automotores, remolques y semirremolques'},
      {code:'30', name:'Fabricación de otros tipos de equipo de transporte'},
      {code:'31', name:'Fabricación de muebles, colchones y somieres'},
      {code:'32', name:'Otras industrias manufactureras'},
      {code:'33', name:'Mantenimiento y reparación especializada de maquinaria y equipo'},
    ]},
  { code:'D', name:'Suministro de electricidad, gas, vapor y aire acondicionado',
    desc:'Generación, transmisión y distribución de energía eléctrica y gas',
    color:'#EF9F27',
    divisions:[
      {code:'35', name:'Suministro de electricidad, gas, vapor y aire acondicionado'},
    ]},
  { code:'E', name:'Suministro de agua y gestión de desechos',
    desc:'Captación y tratamiento de agua, gestión de residuos y saneamiento ambiental',
    color:'#5B8DEF',
    divisions:[
      {code:'36', name:'Captación, tratamiento y distribución de agua'},
      {code:'37', name:'Evacuación y tratamiento de aguas residuales'},
      {code:'38', name:'Recolección, tratamiento y disposición de desechos'},
      {code:'39', name:'Actividades de saneamiento ambiental y gestión de desechos'},
    ]},
  { code:'F', name:'Construcción',
    desc:'Construcción de edificios, obras de ingeniería civil y actividades especializadas',
    color:'#D85A30',
    divisions:[
      {code:'41', name:'Construcción de edificios residenciales y no residenciales'},
      {code:'42', name:'Obras de ingeniería civil (carreteras, puentes, puertos)'},
      {code:'43', name:'Actividades especializadas para la construcción'},
    ]},
  { code:'G', name:'Comercio al por mayor y al por menor',
    desc:'Comercio de vehículos, distribución mayorista y venta minorista (retail)',
    color:'#7F77DD',
    divisions:[
      {code:'45', name:'Comercio y reparación de vehículos automotores y motocicletas'},
      {code:'46', name:'Comercio al por mayor y en comisión (excl. vehículos)'},
      {code:'47', name:'Comercio al por menor (retail)'},
    ]},
  { code:'H', name:'Transporte y almacenamiento',
    desc:'Transporte terrestre, acuático, aéreo, almacenamiento y mensajería',
    color:'#639922',
    divisions:[
      {code:'49', name:'Transporte terrestre y transporte por tuberías'},
      {code:'50', name:'Transporte acuático'},
      {code:'51', name:'Transporte aéreo'},
      {code:'52', name:'Almacenamiento y actividades complementarias al transporte'},
      {code:'53', name:'Correo y servicios de mensajería'},
    ]},
  { code:'I', name:'Alojamiento y servicios de comida',
    desc:'Hoteles, hostales, restaurantes, cafeterías y servicios de alimentación',
    color:'#D4537E',
    divisions:[
      {code:'55', name:'Alojamiento (hoteles, hostales, apartahoteles)'},
      {code:'56', name:'Actividades de servicios de comidas y bebidas'},
    ]},
  { code:'J', name:'Información y comunicaciones',
    desc:'Edición, telecomunicaciones, software, TI y servicios de información',
    color:'#5B8DEF',
    divisions:[
      {code:'58', name:'Actividades de edición (libros, periódicos, software)'},
      {code:'59', name:'Actividades cinematográficas, de video y televisión'},
      {code:'60', name:'Actividades de radiodifusión y televisión'},
      {code:'61', name:'Telecomunicaciones (telefonía, internet, TV por cable)'},
      {code:'62', name:'Desarrollo de sistemas informáticos y consultoría en TI'},
      {code:'63', name:'Actividades de servicios de información y portales web'},
    ]},
  { code:'K', name:'Actividades financieras y de seguros',
    desc:'Banca, seguros, reaseguros, pensiones y actividades financieras auxiliares',
    color:'#0F6E56',
    divisions:[
      {code:'64', name:'Actividades de servicios financieros (excl. seguros y pensiones)'},
      {code:'65', name:'Seguros, reaseguros y fondos de pensiones'},
      {code:'66', name:'Actividades auxiliares de las actividades financieras'},
    ]},
  { code:'L', name:'Actividades inmobiliarias',
    desc:'Compraventa, arrendamiento, administración y gestión de propiedades',
    color:'#9C6EBB',
    divisions:[
      {code:'68', name:'Actividades inmobiliarias propias o arrendadas'},
    ]},
  { code:'M', name:'Actividades profesionales, científicas y técnicas',
    desc:'Consultoría, arquitectura, ingeniería, I+D, publicidad y veterinaria',
    color:'#378ADD',
    divisions:[
      {code:'69', name:'Actividades jurídicas y de contabilidad'},
      {code:'70', name:'Actividades de administración empresarial y consultoría de gestión'},
      {code:'71', name:'Actividades de arquitectura e ingeniería y pruebas técnicas'},
      {code:'72', name:'Investigación científica y desarrollo (I+D)'},
      {code:'73', name:'Publicidad y estudios de mercado'},
      {code:'74', name:'Otras actividades profesionales, científicas y técnicas'},
      {code:'75', name:'Actividades veterinarias'},
    ]},
  { code:'N', name:'Actividades de servicios administrativos y de apoyo',
    desc:'Arrendamiento, empleo, turismo, seguridad, limpieza y apoyo empresarial',
    color:'#888780',
    divisions:[
      {code:'77', name:'Actividades de alquiler y arrendamiento de bienes'},
      {code:'78', name:'Actividades de empleo y selección de personal'},
      {code:'79', name:'Agencias de viajes, operadores turísticos y reservas'},
      {code:'80', name:'Actividades de seguridad e investigación privada'},
      {code:'81', name:'Servicios a edificios y actividades de paisajismo'},
      {code:'82', name:'Actividades de oficina y apoyo administrativo a empresas'},
    ]},
  { code:'O', name:'Administración pública y defensa',
    desc:'Servicios del Estado, defensa nacional y seguridad social obligatoria',
    color:'#C44B35',
    divisions:[
      {code:'84', name:'Administración pública, defensa y seguridad social de afiliación obligatoria'},
    ]},
  { code:'P', name:'Educación',
    desc:'Educación preescolar, básica, media, superior y formación para el trabajo',
    color:'#5B8DEF',
    divisions:[
      {code:'85', name:'Educación en todos sus niveles y modalidades'},
    ]},
  { code:'Q', name:'Atención de la salud humana y asistencia social',
    desc:'Hospitales, clínicas, atención médica, farmacias y servicios sociales',
    color:'#E24B4A',
    divisions:[
      {code:'86', name:'Actividades de atención de la salud humana'},
      {code:'87', name:'Actividades de atención en instituciones con alojamiento'},
      {code:'88', name:'Actividades de asistencia social sin alojamiento'},
    ]},
  { code:'R', name:'Actividades artísticas, de entretenimiento y recreación',
    desc:'Arte, cultura, deportes, espectáculos, juegos y actividades recreativas',
    color:'#D4537E',
    divisions:[
      {code:'90', name:'Actividades creativas, artísticas y de entretenimiento'},
      {code:'91', name:'Bibliotecas, archivos, museos y actividades culturales'},
      {code:'92', name:'Actividades de juegos de azar y apuestas'},
      {code:'93', name:'Actividades deportivas y actividades recreativas y de esparcimiento'},
    ]},
  { code:'S', name:'Otras actividades de servicios',
    desc:'Asociaciones, reparaciones de equipos personales y servicios personales',
    color:'#888780',
    divisions:[
      {code:'94', name:'Actividades de asociaciones (sindicales, gremiales, políticas, religiosas)'},
      {code:'95', name:'Reparación de computadores, artículos personales y enseres domésticos'},
      {code:'96', name:'Otras actividades de servicios personales (peluquerías, lavanderías, etc.)'},
    ]},
  { code:'T', name:'Actividades de los hogares como empleadores',
    desc:'Hogares que contratan personal doméstico o producen bienes para uso propio',
    color:'#888780',
    divisions:[
      {code:'97', name:'Hogares individuales como empleadores de personal doméstico'},
      {code:'98', name:'Actividades no diferenciadas de los hogares como productores para uso propio'},
    ]},
  { code:'U', name:'Actividades de organizaciones extraterritoriales',
    desc:'Organismos internacionales, embajadas y entidades supranacionales',
    color:'#0F6E56',
    divisions:[
      {code:'99', name:'Actividades de organizaciones y entidades extraterritoriales'},
    ]},
];

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
let excelMeta = { rows:0, sheets:[], ciuuCol:null, saludCol:null, atractivoCol:null, prospectivaCol:null, regionCol:null };
let activeTab = 'salud';
let excelScores = null; // scores reales del Excel por índice de sector
let dupontData = null;
let dupontSheetName = null;
let financialCols = { activos: null, pasivos: null, patrimonio: null, ingresos: null, costos: null, utilidad: null };
let financialWhatIf = { ingresos: 0, costos: 0 };
let empresasCiiuFilter = '';
let empresasRegionFilter = '';
let excelRegions = [];

// ── Persistencia de datos Excel ────────────────────────────────────────────
function saveExcelToStorage(filename) {
  try {
    const payload = JSON.stringify({
      filename, excelData, excelMeta, dupontData,
      financialCols, excelRegions, excelScores,
    });
    if (payload.length < 5_000_000) {
      localStorage.setItem('simsect_excel', payload);
    }
  } catch(e) { /* cuota excedida – ignorar */ }
}

function restoreExcelFromStorage() {
  try {
    const raw = localStorage.getItem('simsect_excel');
    if (!raw) return;
    const p = JSON.parse(raw);
    if (!p.excelData || p.excelData.length === 0) return;
    excelData      = p.excelData;
    excelMeta      = p.excelMeta;
    dupontData     = p.dupontData;
    financialCols  = p.financialCols;
    excelRegions   = p.excelRegions || [];
    excelScores    = p.excelScores;
    updateExcelPanel(p.filename);
    showStatus('info', `<i class="ti ti-history"></i> Datos restaurados: ${p.filename} · ${excelData.length.toLocaleString('es-CO')} empresas`);
    update();
  } catch(e) {
    localStorage.removeItem('simsect_excel');
  }
}

// ── Inicialización ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildSliders();
  bindEvents();
  loadScenario('base');
  restoreExcelFromStorage();
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

  if (tab === 'ciiu') {
    if (!document.getElementById('ciiu-search')) renderCIIU();
    return;
  }

  if (tab === 'empresas') {
    if (!excelData || excelData.length === 0) {
      wrap.innerHTML = `<div class="empty-state"><i class="ti ti-table-off" style="font-size:32px;display:block;margin-bottom:8px"></i>Sube tu archivo Excel para ver las empresas reales con indicadores por CIIU.</div>`;
      return;
    }
    // Construir opciones CIIU: 2 dígitos para códigos numéricos, letra para alfabéticos
    let ciiuOptions = [];
    if (excelMeta.ciuuCol) {
      const optSet = new Set();
      excelData.forEach(r => {
        const v = (r[excelMeta.ciuuCol]||'').toString().trim();
        if (!v) return;
        if (/^\d/.test(v)) {
          optSet.add(v.substring(0, 2)); // ej: "46" para 4620
        } else {
          const letter = v.charAt(0).toUpperCase();
          if (letter >= 'A' && letter <= 'Z') optSet.add(letter);
        }
      });
      ciiuOptions = [...optSet].sort((a,b) => a.localeCompare(b, undefined, {numeric:true}));
    }

    // Filtrar por CIIU y por región
    let filteredData = excelData;
    if (empresasCiiuFilter && excelMeta.ciuuCol) {
      filteredData = filteredData.filter(r =>
        (r[excelMeta.ciuuCol]||'').toString().trim().startsWith(empresasCiiuFilter)
      );
    }
    if (empresasRegionFilter && excelMeta.regionCol) {
      filteredData = filteredData.filter(r =>
        (r[excelMeta.regionCol]||'').toString().trim() === empresasRegionFilter
      );
    }

    const cols = Object.keys(excelData[0]).slice(0, 12);
    const rows = filteredData.slice(0, 200);

    const ciiuFilterBar = excelMeta.ciuuCol ? `
      <div class="empresas-filter-bar">
        <span class="filter-label-text">CIIU:</span>
        <div class="empresas-ciiu-pills">
          <button class="pill ${!empresasCiiuFilter?'active':''}" data-ciiu-filter="">Todos</button>
          ${ciiuOptions.map(opt => {
            const sec = CIIU_SECTIONS.find(s => s.code === opt);
            const tip = sec ? sec.name : opt;
            return `<button class="pill ${empresasCiiuFilter===opt?'active':''}" data-ciiu-filter="${opt}" title="${escHtml(tip)}">${opt}</button>`;
          }).join('')}
        </div>
      </div>` : '';

    const regionFilterBar = (excelMeta.regionCol && excelRegions.length > 0) ? `
      <div class="empresas-filter-bar">
        <span class="filter-label-text">Región:</span>
        <select class="region-select" id="empresas-region-select">
          <option value="">Todas</option>
          ${excelRegions.map(r => `<option value="${escHtml(r)}" ${empresasRegionFilter===r?'selected':''}>${escHtml(r)}</option>`).join('')}
        </select>
      </div>` : '';

    wrap.innerHTML = `
      ${ciiuFilterBar}
      ${regionFilterBar}
      <div class="table-scroll">
        <table>
          <thead><tr>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${rows.map(r => `<tr>${cols.map(c => `<td>${r[c] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      <p style="font-size:11px;color:#9b9a95;margin-top:8px;padding:0 4px">
        Mostrando ${rows.length} de ${filteredData.length.toLocaleString('es-CO')} registros
        ${empresasCiiuFilter ? ' · CIIU '+empresasCiiuFilter : ''}
        ${empresasRegionFilter ? ' · '+escHtml(empresasRegionFilter) : ''}
        · ${excelData.length.toLocaleString('es-CO')} total · ${excelMeta.sheets.length} hojas
      </p>`;

    wrap.querySelectorAll('[data-ciiu-filter]').forEach(btn => {
      btn.addEventListener('click', () => { empresasCiiuFilter = btn.dataset.ciiuFilter; renderTable('empresas', null); });
    });
    const regionSel = wrap.querySelector('#empresas-region-select');
    if (regionSel) regionSel.addEventListener('change', e => { empresasRegionFilter = e.target.value; renderTable('empresas', null); });
    return;
  }

  if (tab === 'dupont') { renderDupont(); return; }
  if (tab === 'financiero') { renderFinanciero(); return; }

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
  if (tab === 'ciiu') {
    renderCIIU();
  } else if (tab === 'dupont') {
    renderDupont();
  } else if (tab === 'financiero') {
    renderFinanciero();
  } else {
    renderTable(tab, computeScores(getVals()));
  }
}

// ── Explorador CIIU ────────────────────────────────────────────────────────
function renderCIIU(filter) {
  const wrap = document.getElementById('tabContent');
  const q = (filter || '').toLowerCase().trim();

  const filtered = q
    ? CIIU_SECTIONS.filter(s =>
        s.code.toLowerCase() === q ||
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.divisions.some(d => d.name.toLowerCase().includes(q) || d.code.startsWith(q))
      )
    : CIIU_SECTIONS;

  wrap.innerHTML = `
    <div class="ciiu-browser">
      <div class="ciiu-search-wrap">
        <i class="ti ti-search ciiu-search-icon"></i>
        <input type="text" id="ciiu-search" class="ciiu-search-input"
          placeholder="Buscar por actividad, sector o código (ej: ganadería, 46, K)…"
          value="${escHtml(filter || '')}">
      </div>
      <div class="ciiu-count">${filtered.length} sección${filtered.length !== 1 ? 'es' : ''} · ${filtered.reduce((a,s)=>a+s.divisions.length,0)} divisiones</div>
      <div class="ciiu-grid">
        ${filtered.length === 0
          ? `<div class="empty-state">No se encontraron secciones para "<strong>${escHtml(q)}</strong>"</div>`
          : filtered.map(s => renderCIIUCard(s, q)).join('')}
      </div>
    </div>`;

  document.getElementById('ciiu-search').addEventListener('input', e => renderCIIU(e.target.value));

  if (q && filtered.length <= 4) {
    filtered.forEach(s => expandCIIU(s.code, true));
  }
}

function renderCIIUCard(s, q) {
  const hl = (text) => {
    if (!q) return text;
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${safe})`, 'gi'), '<mark class="ciiu-hl">$1</mark>');
  };
  return `
    <div class="ciiu-card" id="ciiu-card-${s.code}">
      <div class="ciiu-card-header" onclick="toggleCIIU('${s.code}')">
        <span class="ciiu-letter" style="background:${s.color}">${s.code}</span>
        <div class="ciiu-card-info">
          <div class="ciiu-card-name">${hl(s.name)}</div>
          <div class="ciiu-card-desc">${hl(s.desc)}</div>
        </div>
        <span class="ciiu-div-count">${s.divisions.length} div.</span>
        <i class="ti ti-chevron-down ciiu-chevron" id="ciiu-chev-${s.code}"></i>
      </div>
      <div class="ciiu-card-body" id="ciiu-body-${s.code}">
        ${s.divisions.map(d => `
          <div class="ciiu-division">
            <span class="ciiu-div-code">${d.code}</span>
            <span class="ciiu-div-name">${hl(d.name)}</span>
          </div>`).join('')}
      </div>
    </div>`;
}

function toggleCIIU(code) {
  const body = document.getElementById(`ciiu-body-${code}`);
  const chev = document.getElementById(`ciiu-chev-${code}`);
  if (!body) return;
  const open = body.classList.toggle('open');
  if (chev) chev.style.transform = open ? 'rotate(180deg)' : '';
}

function expandCIIU(code, forceOpen) {
  const body = document.getElementById(`ciiu-body-${code}`);
  const chev = document.getElementById(`ciiu-chev-${code}`);
  if (!body) return;
  if (forceOpen) { body.classList.add('open'); if (chev) chev.style.transform = 'rotate(180deg)'; }
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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

      // Lee la hoja con más filas — usa solo el rango (rápido, no parsea todo)
      let bestSheet = wb.SheetNames[0];
      let bestLen   = 0;
      wb.SheetNames.forEach(name => {
        const ws = wb.Sheets[name];
        if (!ws || !ws['!ref']) return;
        const range = XLSX.utils.decode_range(ws['!ref']);
        const rowCount = range.e.r - range.s.r;
        if (rowCount > bestLen) { bestLen = rowCount; bestSheet = name; }
      });

      excelData = XLSX.utils.sheet_to_json(wb.Sheets[bestSheet], { defval:'' });

      if (excelData.length === 0) {
        showStatus('error', 'El archivo no tiene filas de datos válidas.');
        return;
      }

      const keys = Object.keys(excelData[0]);
      const find  = (terms) => keys.find(k => terms.some(t => k.toLowerCase().includes(t)));

      excelMeta.ciuuCol        = find(['ciiu','actividad economica','cod actividad','codigo actividad','cod_actividad']);
      excelMeta.saludCol       = find(['salud']);
      excelMeta.atractivoCol   = find(['atractiv']);
      excelMeta.prospectivaCol = find(['prospect']);
      // Buscar columna de región: por nombre primero, luego detectando valores colombianos
      excelMeta.regionCol = find(['regi','zona','macro','territorio'])
                         || find(['departamento','dpto'])
                         || find(['ciudad','municipio','localidad']);
      if (!excelMeta.regionCol) {
        const regVals = ['caribe','andina','pacif','orinoq','amazon','insular','central'];
        excelMeta.regionCol = keys.find(k => {
          const sample = excelData.slice(0, Math.min(50, excelData.length));
          return sample.some(r => regVals.some(rv => (r[k]||'').toString().toLowerCase().includes(rv)));
        }) || null;
      }

      // Detectar hoja DuPont
      dupontSheetName = wb.SheetNames.find(n =>
        n.toLowerCase().replace(/[\s\-_]/g,'').includes('dupont')
      ) || null;
      dupontData = dupontSheetName
        ? XLSX.utils.sheet_to_json(wb.Sheets[dupontSheetName], { defval:'', header:1 })
        : null;

      // Detectar columnas financieras
      const findFin = (terms) => { for (const t of terms) { const c = keys.find(k => k.toLowerCase().includes(t)); if (c) return c; } return null; };
      financialCols.activos    = findFin(['activo total','activos total','total activo','activo']);
      financialCols.pasivos    = findFin(['pasivo total','pasivos total','total pasivo','pasivo']);
      financialCols.patrimonio = findFin(['patrimonio','equity']);
      financialCols.ingresos   = findFin(['ingreso operacional','ingresos operacional','ventas neta','ingreso','ventas']);
      financialCols.costos     = findFin(['costo de venta','costo venta','costos','costo']);
      financialCols.utilidad   = findFin(['utilidad neta','utilidad operacional','resultado neto','utilidad','ganancia','resultado del ejercicio']);

      // Extraer regiones únicas del Excel
      if (excelMeta.regionCol) {
        const rSet = new Set();
        excelData.forEach(r => {
          const v = (r[excelMeta.regionCol]||'').toString().trim();
          if (v) rSet.add(v);
        });
        excelRegions = [...rSet].sort();
      } else {
        excelRegions = [];
      }
      empresasRegionFilter = '';

      buildExcelScores();
      updateExcelPanel(file.name);
      saveExcelToStorage(file.name);
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
    DuPont: ${dupontSheetName ? `<span style="color:#1D9E75">✓</span> hoja "${dupontSheetName}"` : '<span style="color:#9b9a95">—</span>'}<br>
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

// ── DuPont ─────────────────────────────────────────────────────────────────
function renderDupont() {
  const wrap = document.getElementById('tabContent');
  if (!excelData) {
    wrap.innerHTML = `<div class="empty-state"><i class="ti ti-chart-pie-2" style="font-size:32px;display:block;margin-bottom:8px"></i>Sube tu archivo Excel para ver el análisis DuPont.</div>`;
    return;
  }
  if (!dupontData) {
    wrap.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-table-off" style="font-size:32px;display:block;margin-bottom:8px"></i>
        No se encontró una hoja "dupont" en el archivo.<br>
        <span style="font-size:11px;color:#9b9a95;margin-top:4px;display:block">Hojas disponibles: ${excelMeta.sheets.join(', ')}</span>
      </div>`;
    return;
  }

  const sections = [];
  let current = [];
  dupontData.forEach(row => {
    const isEmpty = !row || row.length === 0 || row.every(c => c === '' || c === null || c === undefined);
    if (isEmpty) {
      if (current.length > 0) { sections.push([...current]); current = []; }
    } else {
      current.push(row);
    }
  });
  if (current.length > 0) sections.push(current);

  if (sections.length === 0) {
    wrap.innerHTML = `<div class="empty-state">La hoja DuPont está vacía o no contiene datos reconocibles.</div>`;
    return;
  }

  const keyRatios = extractDupontRatios();
  const ratiosCardHtml = keyRatios.length > 0 ? `
    <div class="fin-section-title" style="margin-bottom:10px">Índices detectados</div>
    <div class="dupont-ratios-grid">
      ${keyRatios.map(r => {
        const isSmall = Math.abs(r.value) <= 1.5 && r.label.toLowerCase().replace(/[áéíóú]/g, c=>({á:'a',é:'e',í:'i',ó:'o',ú:'u'}[c]||c)).match(/roe|roa|margen|rentab/);
        const display = isSmall
          ? (r.value * 100).toFixed(2) + '%'
          : r.value.toLocaleString('es-CO', {maximumFractionDigits:4});
        return `<div class="dupont-ratio-card">
          <div class="dupont-ratio-label">${escHtml(r.label)}</div>
          <div class="dupont-ratio-value">${display}</div>
        </div>`;
      }).join('')}
    </div>` : '';

  wrap.innerHTML = `
    <div class="dupont-info">
      <i class="ti ti-chart-pie-2"></i>
      ${escHtml(dupontSheetName)} · ${sections.length} tabla${sections.length !== 1 ? 's' : ''} detectada${sections.length !== 1 ? 's' : ''}
    </div>
    ${ratiosCardHtml}
    ${keyRatios.length > 0 ? `<div class="fin-section-title" style="margin:14px 0 10px">Tablas completas</div>` : ''}
    <div class="dupont-sections">
      ${sections.map((rows, i) => renderDupontSection(rows, i)).join('')}
    </div>`;
}

function renderDupontSection(rows, index) {
  if (!rows || rows.length === 0) return '';
  const maxCols = Math.max(...rows.map(r => (r||[]).length));
  if (maxCols === 0) return '';
  const firstRow = rows[0] || [];
  const nonEmpty = firstRow.filter(c => c !== '' && c !== null && c !== undefined);
  const textCount = nonEmpty.filter(c => typeof c === 'string').length;
  const isHeaderRow = nonEmpty.length > 0 && textCount / nonEmpty.length >= 0.5;
  const bodyRows = rows.slice(isHeaderRow ? 1 : 0);

  return `
    <div class="dupont-section">
      <div class="table-scroll">
        <table class="dupont-table">
          ${isHeaderRow ? `<thead><tr>${
            Array.from({length: maxCols}, (_, ci) => {
              const cell = firstRow[ci] !== undefined ? firstRow[ci] : '';
              return `<th>${escHtml(String(cell))}</th>`;
            }).join('')
          }</tr></thead>` : ''}
          <tbody>
            ${bodyRows.map(row => {
              const r = row || [];
              return `<tr>${Array.from({length: maxCols}, (_, ci) => {
                const cell = r[ci] !== undefined ? r[ci] : '';
                const isNum = typeof cell === 'number';
                const formatted = isNum
                  ? cell.toLocaleString('es-CO', {maximumFractionDigits: 4})
                  : escHtml(String(cell));
                return `<td class="${isNum ? 'dupont-num' : ''}">${formatted}</td>`;
              }).join('')}</tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

// ── Extractor de índices DuPont ────────────────────────────────────────────
function extractDupontRatios() {
  if (!dupontData) return [];
  const terms = ['roe','roa','margen','rentab','liquid','rotac','apalac','solven','endeud','ebitda','utilid','dupont'];
  const ratios = [];
  const seen = new Set();
  dupontData.forEach(row => {
    if (!row || row.length < 2) return;
    const label = String(row[0]||'').trim();
    if (!label || label.length > 80 || seen.has(label.toLowerCase())) return;
    const norm = label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    if (!terms.some(t => norm.includes(t))) return;
    for (let i = 1; i < row.length; i++) {
      if (typeof row[i] === 'number' && isFinite(row[i]) && row[i] !== 0) {
        ratios.push({ label, value: row[i] });
        seen.add(label.toLowerCase());
        break;
      }
    }
  });
  return ratios.slice(0, 14);
}

// ── Helper tarjeta KPI financiera ─────────────────────────────────────────
function renderFinKpi(k) {
  const simHtml = k.sim != null ? `
    <div class="fin-kpi-sim">
      → ${k.sim}
      ${k.delta ? `<span class="${k.deltaPos ? 'fin-delta-pos' : 'fin-delta-neg'}">${k.delta}</span>` : ''}
    </div>` : '';
  return `
    <div class="fin-kpi-card">
      <div class="fin-kpi-icon" style="color:${k.color}"><i class="ti ${k.icon}" style="font-size:20px"></i></div>
      <div class="fin-kpi-body">
        <div class="fin-kpi-label">${k.label}</div>
        <div class="fin-kpi-value" style="color:${k.color}">${k.value}</div>
        ${simHtml}
      </div>
    </div>`;
}

// ── Estados Financieros ────────────────────────────────────────────────────
function renderFinanciero() {
  const wrap = document.getElementById('tabContent');

  if (!excelData || excelData.length === 0) {
    wrap.innerHTML = `<div class="empty-state"><i class="ti ti-report-money" style="font-size:32px;display:block;margin-bottom:8px"></i>Sube tu archivo Excel para ver los estados financieros.</div>`;
    return;
  }

  const { activos, pasivos, patrimonio, ingresos, costos, utilidad } = financialCols;
  const hasAny = activos || pasivos || patrimonio || ingresos || costos;

  if (!hasAny) {
    const allCols = Object.keys(excelData[0]).slice(0, 12);
    wrap.innerHTML = `
      <div class="fin-notice">
        <i class="ti ti-info-circle"></i>
        <span>No se detectaron columnas financieras. Se esperan: <em>activo total, pasivo total, patrimonio, ingresos operacionales, costo de ventas</em>.</span>
      </div>
      <div class="table-scroll">
        <table>
          <thead><tr>${allCols.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${excelData.slice(0,100).map(r=>`<tr>${allCols.map(c=>`<td>${r[c]??''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>`;
    return;
  }

  const parseNum = v => {
    if (typeof v === 'number') return v;
    if (!v && v !== 0) return 0;
    return parseFloat(String(v).replace(/[^0-9.\-]/g,'')) || 0;
  };

  const fmt = n => {
    const abs = Math.abs(n);
    if (abs >= 1e12) return (n/1e12).toFixed(1)+'T';
    if (abs >= 1e9)  return (n/1e9).toFixed(1)+'B';
    if (abs >= 1e6)  return (n/1e6).toFixed(1)+'M';
    if (abs >= 1e3)  return (n/1e3).toFixed(0)+'K';
    return n.toFixed(0);
  };

  const sign = n => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

  const sumCol = col => col ? excelData.reduce((a, r) => a + parseNum(r[col]), 0) : null;
  const base = {
    activos:    sumCol(activos),
    pasivos:    sumCol(pasivos),
    patrimonio: sumCol(patrimonio),
    ingresos:   sumCol(ingresos),
    costos:     sumCol(costos),
    utilidad:   sumCol(utilidad),
  };

  // Aplicar simulación what-if
  const wi = financialWhatIf;
  const hasWI = wi.ingresos !== 0 || wi.costos !== 0;
  const simIng = base.ingresos !== null ? base.ingresos * (1 + wi.ingresos/100) : null;
  const simCos = base.costos   !== null ? base.costos   * (1 + wi.costos/100)   : null;

  const calcRatios = (ing, cos, act, pas, pat, util) => ({
    utilidadBruta: ing !== null && cos !== null ? ing - cos : null,
    margenBruto:   ing ? ((ing - (cos||0)) / ing * 100) : null,
    cargaCostos:   ing && cos !== null ? (cos / ing * 100) : null,
    endeudamiento: act && pas ? (pas / act * 100) : null,
    apalancamiento: pat && act ? (act / pat) : null,
    roe: util !== null && pat ? (util / pat * 100) : null,
    roa: util !== null && act ? (util / act * 100) : null,
  });

  const r0 = calcRatios(base.ingresos, base.costos, base.activos, base.pasivos, base.patrimonio, base.utilidad);
  const r1 = hasWI ? calcRatios(simIng, simCos, base.activos, base.pasivos, base.patrimonio, base.utilidad) : r0;

  // Sección simulador
  const whatIfHtml = (ingresos || costos) ? `
    <div class="whatif-section">
      <div class="whatif-title"><i class="ti ti-adjustments-horizontal"></i> Simulador ¿Qué pasa si…?</div>
      <div class="whatif-sliders">
        ${ingresos ? `<div class="slider-row">
          <div class="slider-header">
            <span class="slider-name">Variación en Ingresos</span>
            <span class="slider-val" id="fin-lbl-ing">${sign(wi.ingresos)}</span>
          </div>
          <input type="range" id="fin-s-ing" min="-50" max="100" step="1" value="${wi.ingresos}">
        </div>` : ''}
        ${costos ? `<div class="slider-row">
          <div class="slider-header">
            <span class="slider-name">Variación en Costos</span>
            <span class="slider-val" id="fin-lbl-cos">${sign(wi.costos)}</span>
          </div>
          <input type="range" id="fin-s-cos" min="-50" max="100" step="1" value="${wi.costos}">
        </div>` : ''}
      </div>
      ${hasWI ? `<div class="whatif-reset"><button onclick="financialWhatIf={ingresos:0,costos:0};renderFinanciero()"><i class="ti ti-refresh"></i> Resetear</button></div>` : ''}
    </div>` : '';

  // Tarjetas principales
  const mainKpis = [
    activos    && { label:'Activos Totales', value:fmt(base.activos),    color:'#378ADD', icon:'ti-building-bank' },
    pasivos    && { label:'Pasivos Totales', value:fmt(base.pasivos),    color:'#E24B4A', icon:'ti-arrow-up' },
    patrimonio && { label:'Patrimonio',      value:fmt(base.patrimonio), color:'#1D9E75', icon:'ti-rosette' },
    ingresos   && { label:'Ingresos',        value:fmt(base.ingresos),   color:'#EF9F27', icon:'ti-trending-up',
      ...(hasWI && simIng !== null && { sim:fmt(simIng), delta:sign(wi.ingresos), deltaPos:wi.ingresos>=0 }) },
    costos     && { label:'Costos',          value:fmt(base.costos),     color:'#D85A30', icon:'ti-shopping-cart',
      ...(hasWI && simCos !== null && { sim:fmt(simCos), delta:sign(wi.costos), deltaPos:wi.costos<=0 }) },
    base.utilidad !== null && { label:'Utilidad', value:fmt(base.utilidad), color:base.utilidad>=0?'#1D9E75':'#E24B4A', icon:'ti-cash' },
    r0.utilidadBruta !== null && !utilidad && { label:'Utilidad Bruta',  value:fmt(r0.utilidadBruta),
      color:r0.utilidadBruta>=0?'#1D9E75':'#E24B4A', icon:'ti-cash',
      ...(hasWI && r1.utilidadBruta !== null && { sim:fmt(r1.utilidadBruta),
        delta: sign(((r1.utilidadBruta - r0.utilidadBruta) / Math.abs(r0.utilidadBruta||1)) * 100),
        deltaPos: r1.utilidadBruta >= r0.utilidadBruta }) },
  ].filter(Boolean);

  // Tarjetas de ratios
  const ratioKpis = [
    r0.margenBruto !== null && { label:'Margen Bruto', value:r0.margenBruto.toFixed(1)+'%',
      color:r0.margenBruto>=30?'#1D9E75':r0.margenBruto>=10?'#EF9F27':'#E24B4A', icon:'ti-chart-bar',
      ...(hasWI && r1.margenBruto !== null && { sim:r1.margenBruto.toFixed(1)+'%',
        delta:sign(r1.margenBruto - r0.margenBruto), deltaPos:r1.margenBruto >= r0.margenBruto }) },
    r0.cargaCostos !== null && { label:'Carga de Costos', value:r0.cargaCostos.toFixed(1)+'%',
      color:r0.cargaCostos<=60?'#1D9E75':'#EF9F27', icon:'ti-receipt',
      ...(hasWI && r1.cargaCostos !== null && { sim:r1.cargaCostos.toFixed(1)+'%',
        delta:sign(r1.cargaCostos - r0.cargaCostos), deltaPos:r1.cargaCostos <= r0.cargaCostos }) },
    r0.endeudamiento !== null && { label:'Endeudamiento', value:r0.endeudamiento.toFixed(1)+'%',
      color:r0.endeudamiento<=50?'#1D9E75':r0.endeudamiento<=70?'#EF9F27':'#E24B4A', icon:'ti-percentage' },
    r0.apalancamiento !== null && { label:'Apalancamiento', value:r0.apalancamiento.toFixed(2)+'x', color:'#7F77DD', icon:'ti-layers' },
    r0.roe !== null && { label:'ROE', value:r0.roe.toFixed(2)+'%',
      color:r0.roe>=10?'#1D9E75':r0.roe>=0?'#EF9F27':'#E24B4A', icon:'ti-star' },
    r0.roa !== null && { label:'ROA', value:r0.roa.toFixed(2)+'%',
      color:r0.roa>=5?'#1D9E75':r0.roa>=0?'#EF9F27':'#E24B4A', icon:'ti-target' },
  ].filter(Boolean);

  // Tabla por CIIU (2 dígitos para numérico)
  let ciiuSummary = [];
  if (excelMeta.ciuuCol) {
    const groups = {};
    excelData.forEach(r => {
      const v = (r[excelMeta.ciuuCol]||'').toString().trim();
      const key = /^\d/.test(v) ? v.substring(0,2) : v.charAt(0).toUpperCase();
      if (!key || key === ' ') return;
      if (!groups[key]) groups[key] = { n:0, activos:0, pasivos:0, patrimonio:0, ingresos:0, costos:0, utilidad:0 };
      groups[key].n++;
      if (activos)    groups[key].activos    += parseNum(r[activos]);
      if (pasivos)    groups[key].pasivos    += parseNum(r[pasivos]);
      if (patrimonio) groups[key].patrimonio += parseNum(r[patrimonio]);
      if (ingresos)   groups[key].ingresos   += parseNum(r[ingresos]);
      if (costos)     groups[key].costos     += parseNum(r[costos]);
      if (utilidad)   groups[key].utilidad   += parseNum(r[utilidad]);
    });
    ciiuSummary = Object.entries(groups)
      .sort((a,b) => a[0].localeCompare(b[0], undefined, {numeric:true}))
      .map(([code, g]) => {
        const sec = CIIU_SECTIONS.find(s => s.code === code);
        const div = !sec ? CIIU_SECTIONS.flatMap(s => s.divisions).find(d => d.code === code) : null;
        return { code, name:(sec||div||{}).name||code, ...g,
          margen: g.ingresos ? ((g.ingresos - g.costos) / g.ingresos * 100).toFixed(1)+'%' : '—' };
      });
  }

  const activeCols = [
    activos    && { key:'activos',    label:'Activos' },
    pasivos    && { key:'pasivos',    label:'Pasivos' },
    patrimonio && { key:'patrimonio', label:'Patrimonio' },
    ingresos   && { key:'ingresos',   label:'Ingresos' },
    costos     && { key:'costos',     label:'Costos' },
    utilidad   && { key:'utilidad',   label:'Utilidad' },
    (ingresos && costos) && { key:'margen', label:'Margen %' },
  ].filter(Boolean);

  wrap.innerHTML = `
    ${whatIfHtml}
    <div class="fin-section-title">Estado Financiero</div>
    <div class="fin-kpi-grid">${mainKpis.map(k => renderFinKpi(k)).join('')}</div>
    ${ratioKpis.length > 0 ? `
      <div class="fin-section-title" style="margin-top:16px">Indicadores de Rentabilidad y Estructura</div>
      <div class="fin-kpi-grid">${ratioKpis.map(k => renderFinKpi(k)).join('')}</div>` : ''}
    ${ciiuSummary.length > 0 ? `
      <div class="fin-section-title" style="margin-top:16px">Desglose por CIIU</div>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Cód.</th><th>Actividad</th><th>#</th>${activeCols.map(c=>`<th>${c.label}</th>`).join('')}</tr></thead>
          <tbody>
            ${ciiuSummary.map(row => `
              <tr>
                <td class="mono">${row.code}</td>
                <td style="font-size:11px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escHtml(row.name)}">${escHtml(row.name)}</td>
                <td class="mono">${row.n}</td>
                ${activeCols.map(c=>`<td class="mono">${c.key==='margen'?row.margen:fmt(row[c.key])}</td>`).join('')}
              </tr>`).join('')}
          </tbody>
        </table>
      </div>` : ''}`;

  const sIng = wrap.querySelector('#fin-s-ing');
  const sCos = wrap.querySelector('#fin-s-cos');
  if (sIng) sIng.addEventListener('input', e => { financialWhatIf.ingresos = +e.target.value; renderFinanciero(); });
  if (sCos) sCos.addEventListener('input', e => { financialWhatIf.costos   = +e.target.value; renderFinanciero(); });
}
