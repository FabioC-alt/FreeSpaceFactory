# Configurazione DNS, Dominio e Hosting - FreeSpaceFactory

Questo documento riassume l'architettura di hosting, dominio e DNS del sito **FreeSpaceFactory**, per rapido riferimento da parte degli sviluppatori e degli agenti AI.

---

## 🏗️ Architettura

| Componente | Provider / Destinazione | Note |
|---|---|---|
| **Registrar Dominio** | **Serverplan** (in transizione da Aruba) | Gestione del dominio `freespacefactory.it` |
| **Gestione DNS & CDN** | **Cloudflare** | Gestisce la risoluzione DNS, CDN e certificati SSL |
| **Hosting Statico** | **GitHub Pages** | Repository: `FabioC-alt/FreeSpaceFactory` (branch `gh-pages` / artifact deploy) |
| **Custom Domain** | `www.freespacefactory.it` / `freespacefactory.it` | Configurato in `public/CNAME` e `astro.config.mjs` |

---

## 🔑 Nameserver Cloudflare (Assegnati)

I due nameserver autoritativi assegnati su Cloudflare per `freespacefactory.it`:
- **`jacob.ns.cloudflare.com`**
- **`vita.ns.cloudflare.com`**

### Azione sul Registrar (Serverplan / Aruba):
Per attivare la gestione DNS di Cloudflare, i vecchi nameserver di Aruba:
- ❌ `dns.technorail.com`
- ❌ `dns2.technorail.com`
- ❌ `dns3.arubadns.net`
- ❌ `dns4.arubadns.cz`

devono essere **sostituiti** con i due nameserver Cloudflare (`jacob` e `vita`).

---

## 📋 Record DNS configurati in Cloudflare

All'interno della dashboard di Cloudflare (sezione **DNS -> Records**):

### 1. Record per il sito Web (GitHub Pages)
| Tipo | Nome (Host) | Contenuto / Valore | Proxy Status | Note |
|---|---|---|---|---|
| **CNAME** | `www` | `fabioc-alt.github.io` | Proxied / DNS Only | Indirizza il www a GitHub Pages |
| **A** | `@` | `185.199.108.153` | Proxied / DNS Only | IP 1 GitHub Pages |
| **A** | `@` | `185.199.109.153` | Proxied / DNS Only | IP 2 GitHub Pages |
| **A** | `@` | `185.199.110.153` | Proxied / DNS Only | IP 3 GitHub Pages |
| **A** | `@` | `185.199.111.153` | Proxied / DNS Only | IP 4 GitHub Pages |

*(Opzionali per IPv6)*:
- `AAAA` `@` -> `2606:50c0:8000::153`
- `AAAA` `@` -> `2606:50c0:8001::153`
- `AAAA` `@` -> `2606:50c0:8002::153`
- `AAAA` `@` -> `2606:50c0:8003::153`

### 2. Record Email (se la posta è gestita da Aruba / Serverplan)
Mantenere o importare i record MX e SPF per preservare le caselle email (es. `info@freespacefactory.it`):
- **MX**: `mx.freespacefactory.it` (o server mail Serverplan/Aruba)
- **TXT (SPF)**: `v=spf1 include:_spf.aruba.it ~all` (o parametri specifici del provider email)

---

## 🔒 Impostazioni SSL/TLS su Cloudflare

- **Modalità di crittografia**: Impostare su **Full** o **Full (Strict)**.
- *Attenzione*: non usare la modalità *Flexible*, altrimenti si possono verificare loop di reindirizzamento infiniti (HTTP <-> HTTPS) con GitHub Pages.

---

## 📦 Configurazione nel Repository

1. **[`public/CNAME`](file:///c:/Users/FabioC/ProjectsAntigravity/FreeSpaceFactory/public/CNAME)**:
   ```
   www.freespacefactory.it
   ```
2. **[`astro.config.mjs`](file:///c:/Users/FabioC/ProjectsAntigravity/FreeSpaceFactory/astro.config.mjs)**:
   ```js
   site: 'https://www.freespacefactory.it',
   ```
3. **[`.github/workflows/deploy.yml`](file:///c:/Users/FabioC/ProjectsAntigravity/FreeSpaceFactory/.github/workflows/deploy.yml)**:
   Build step: `npm run build`
4. **GitHub Settings (Repository -> Settings -> Pages)**:
   - Custom domain: `www.freespacefactory.it`
   - Enforce HTTPS: Attivo (non appena il DNS è propagato e il certificato è verificato).

---

## 🩺 Comandi di Diagnostica Rapida

```powershell
# Verifica Nameserver autoritativi attivi
Resolve-DnsName -Name freespacefactory.it -Type NS

# Verifica risoluzione A record
Resolve-DnsName -Name freespacefactory.it -Type A

# Verifica CNAME per www
Resolve-DnsName -Name www.freespacefactory.it -Type CNAME
```
