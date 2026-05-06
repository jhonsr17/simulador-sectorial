# SimSectorial Colombia 🇨🇴

Simulador macroeconómico sectorial con datos del Banco de la República, variables CIIU y estados financieros por empresa.

---

## 📁 Estructura del proyecto

```
simulador-sectorial/
├── index.html        ← Página principal
├── style.css         ← Estilos
├── app.js            ← Lógica del simulador
├── netlify.toml      ← Configuración de Netlify
├── data/             ← Pon aquí tu Excel (opcional)
│   └── datos.xlsx
└── README.md
```

---

## 🚀 Opción 1 — Netlify (recomendada, gratis)

### Pasos:

1. **Crea una cuenta** en https://app.netlify.com (gratis)

2. **Opción A — Arrastrar y soltar (más fácil):**
   - Ve a https://app.netlify.com/drop
   - Arrastra toda la carpeta `simulador-sectorial/` al navegador
   - ¡Listo! Netlify te da una URL pública en segundos

3. **Opción B — Con GitHub (recomendada para actualizaciones):**
   ```bash
   # En tu terminal, desde la carpeta del proyecto:
   git init
   git add .
   git commit -m "primer deploy"
   # Sube a GitHub, luego conecta el repo en Netlify
   ```

### Para subir tu Excel al servidor:
- Coloca tu archivo `.xlsx` dentro de la carpeta `data/`
- Al hacer deploy, el archivo queda en `https://tu-sitio.netlify.app/data/datos.xlsx`
- El simulador lo carga automáticamente si lo nombras `datos.xlsx`

---

## 🚀 Opción 2 — Vercel (también gratis)

1. Instala Vercel CLI: `npm i -g vercel`
2. Desde la carpeta del proyecto: `vercel`
3. Sigue las instrucciones en pantalla

---

## 🚀 Opción 3 — GitHub Pages

1. Sube el proyecto a un repositorio GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` como fuente
4. Tu sitio queda en `https://tuusuario.github.io/simulador-sectorial`

---

## 📊 Cómo conectar tu Excel

### Opción A — Carga manual (ya funciona):
- Abre el simulador
- Haz clic en **"Cargar Excel"** (botón verde arriba)
- Selecciona tu `.xlsx`

### Opción B — Excel pre-cargado desde el servidor:
1. Renombra tu archivo a `datos.xlsx`
2. Colócalo en la carpeta `data/`
3. Abre `app.js` y descomenta estas líneas al final de `DOMContentLoaded`:
   ```js
   // Auto-carga desde servidor:
   // fetch('./data/datos.xlsx')
   //   .then(r => r.arrayBuffer())
   //   .then(buf => {
   //     const wb = XLSX.read(buf, {type:'array'});
   //     // ... procesar igual que loadExcel()
   //   });
   ```

---

## 🗂 Nombres de columnas que detecta automáticamente

El simulador busca estas palabras en los encabezados de tu Excel:

| Columna | Palabras clave detectadas |
|---------|--------------------------|
| CIIU / Sector | `ciiu`, `actividad economica`, `cod actividad`, `sector` |
| Salud sectorial | `salud` |
| Atractivo sectorial | `atractiv` |
| Prospectiva | `prospect` |

Si tus columnas tienen otros nombres, edita la función `find()` en `app.js`.

---

## 🔧 Variables macroeconómicas incluidas

| Variable | Fuente | Rango |
|----------|--------|-------|
| Tasa de interés BanRep | Banco de la República | 3% – 20% |
| Inflación IPC | DANE | 1% – 20% |
| TRM USD/COP | Banco de la República | 3.000 – 6.000 |
| Crecimiento PIB | DANE | -4% – +8% |
| Desempleo | DANE | 4% – 25% |
| Precio petróleo | Brent/WTI | USD 20 – 130 |
| IED neta | Banco de la República | USD 5B – 40B |
| Confianza del consumidor | Fedesarrollo | -30 – +30 |

---

## 📞 Soporte

Si el Excel no se detecta correctamente, verifica que:
- Los encabezados estén en la fila 1
- El archivo no tenga hojas con contraseña
- Las columnas de indicadores contengan valores numéricos
