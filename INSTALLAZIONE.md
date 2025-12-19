# 📱 Come Installare l'App su Smartphone

L'app **Come Stai?** è una Progressive Web App (PWA) che può essere installata su qualsiasi smartphone come se fosse un'app nativa.

## 📲 Android (Chrome/Edge/Samsung Internet)

### Metodo 1: Banner Automatico
1. Apri l'app nel browser
2. Dopo alcuni secondi apparirà un banner "Aggiungi a schermata Home"
3. Tocca **"Installa"** o **"Aggiungi"**
4. L'app verrà installata e apparirà un'icona sulla home screen

### Metodo 2: Menu Browser
1. Apri l'app nel browser Chrome
2. Tocca il menu (⋮) in alto a destra
3. Seleziona **"Aggiungi a schermata Home"** o **"Installa app"**
4. Conferma l'installazione
5. L'icona apparirà sulla home screen

### Verifica Installazione Android
- L'icona dell'app appare nella home screen
- Puoi aprire l'app senza barra del browser
- L'app appare nel drawer delle app
- Funziona offline dopo la prima apertura

---

## 🍎 iOS (Safari)

### Procedura iOS
1. Apri l'app in **Safari** (non Chrome!)
2. Tocca il pulsante **Condividi** (□ con freccia verso l'alto)
3. Scorri verso il basso e tocca **"Aggiungi a Home"**
4. Personalizza il nome se vuoi
5. Tocca **"Aggiungi"** in alto a destra
6. L'icona apparirà sulla home screen

### Verifica Installazione iOS
- L'icona dell'app appare nella home screen
- L'app si apre a schermo intero (senza barra Safari)
- Funziona offline dopo la prima apertura

**⚠️ Importante iOS:** Safari è l'unico browser che supporta l'installazione PWA su iOS. Chrome e altri browser iOS non funzioneranno.

---

## 🌐 Desktop (Chrome/Edge)

### Installazione Desktop
1. Apri l'app nel browser
2. Guarda la barra degli indirizzi:
   - Chrome: icona ⊕ o 🖥️ a destra
   - Edge: icona 📥 a destra
3. Clicca l'icona e seleziona **"Installa"**
4. L'app verrà aggiunta alle applicazioni

### Verifica Installazione Desktop
- L'app appare nel menu Start/Applicazioni
- Si apre in finestra separata senza barra del browser
- Funziona offline

---

## ✨ Funzionalità PWA

Dopo l'installazione, l'app:

✅ **Funziona offline** - Grazie al service worker
✅ **Schermo intero** - Si apre come app nativa
✅ **Icona personalizzata** - Sulla home screen
✅ **Notifiche push** - (se implementate)
✅ **Dati locali** - Salvati sul dispositivo
✅ **Aggiornamenti automatici** - Senza reinstallare

---

## 🔧 Requisiti Tecnici

### Android
- Chrome 40+, Edge 79+, Samsung Internet 4+
- Android 5.0+

### iOS
- Safari su iOS 11.3+
- iPadOS 13+

### Desktop
- Chrome 73+, Edge 79+, Opera 60+
- Windows 10+, macOS 10.12+, Linux

---

## 🚀 Hosting e Deploy

Per rendere l'app installabile online, devi:

### 1. Hosting HTTPS
Le PWA richiedono HTTPS (eccetto localhost). Opzioni gratuite:
- **GitHub Pages** - Gratis con HTTPS automatico
- **Netlify** - Deploy automatico da Git
- **Vercel** - Deploy con CI/CD
- **Cloudflare Pages** - CDN globale gratis

### 2. Deploy su GitHub Pages

```bash
# Assicurati che il branch main sia aggiornato
git push origin main

# Vai su GitHub → Settings → Pages
# Source: Deploy from a branch
# Branch: main / (root)
# Salva e attendi 2-3 minuti
```

URL finale: `https://[username].github.io/[repo-name]/`

### 3. Deploy su Netlify

```bash
# Installa Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=.
```

Oppure connetti il repo GitHub su netlify.com per deploy automatici.

### 4. Verifica PWA

Dopo il deploy, verifica su:
- **Lighthouse** (DevTools → Lighthouse → PWA)
- **web.dev/measure** - Test online
- **PWABuilder** - Test e generazione package

---

## 📊 Checklist Installabilità

✅ Manifest.json presente e valido
✅ Service worker registrato
✅ HTTPS (o localhost)
✅ Icons 192x192 e 512x512
✅ display: standalone nel manifest
✅ start_url configurato
✅ theme_color e background_color
✅ Meta tags per iOS
✅ App funziona offline

---

## 🐛 Problemi Comuni

### "Aggiungi a Home" non appare
- Verifica che sei su HTTPS
- Controlla che manifest.json sia valido
- Assicurati che il service worker sia registrato
- Prova a chiudere e riaprire il browser

### iOS: App non si installa
- Usa Safari, non Chrome
- Verifica di aver toccato il pulsante Condividi corretto
- Assicurati che JavaScript sia abilitato

### App non funziona offline
- Apri l'app almeno una volta online
- Verifica che il service worker sia attivo (DevTools → Application → Service Workers)
- Controlla la console per errori

### Icona non appare
- Pulisci cache del browser
- Verifica che icon-192.png e icon-512.png esistano
- Controlla percorsi nel manifest.json

---

## 📞 Supporto

Per problemi o domande:
1. Controlla la console browser (F12 → Console)
2. Verifica Lighthouse PWA score
3. Testa su https://web.dev/measure

---

## 🎉 Fatto!

Ora la tua app è installabile su tutti i dispositivi. Buon utilizzo! 💚
