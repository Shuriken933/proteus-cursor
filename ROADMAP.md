# Roadmap

Questo documento raccoglie le feature candidate per le prossime versioni di **Proteus Cursor**, oltre la 2.0.2 attuale. Ogni voce è tracciata come issue GitHub e collegata alla [Project board "Proteus Cursor"](https://github.com/users/Shuriken933/projects/11).

Le spec complete (API proposta, integrazione architetturale, rischi UX, vincoli di performance/accessibilità) vivono nelle rispettive issue — qui trovi la sintesi e il perché di ogni scelta.

---

## 1. Colmare i gap esistenti

Prima di aggiungere feature nuove, alcune cose promesse (nel marketing o nel codice) non sono ancora implementate.

### Bug: trail effect non funziona in modalità `fluid` — [#19](https://github.com/Shuriken933/proteus-cursor/issues/19)
`_updateTrail()` viene chiamato solo dal RAF loop di `circle`. Un preset con `trail_length > 0` applicato mentre il cursore è in `fluid` non produce alcuna scia, silenziosamente. Fix a basso rischio: agganciare la chiamata anche al loop fluid, usando le coordinate viewport già disponibili (`cursorX`/`cursorY`).

### Comportamento magnetico — [#20](https://github.com/Shuriken933/proteus-cursor/issues/20)
L'opzione `magnetic` esiste nel costruttore da sempre ma non è mai stata implementata — è un flag morto, mentre il sito la elenca come feature attiva. Il cursore, in hover su un elemento target, si attrae verso il suo centro con forza/raggio configurabili. Limitato a `shape: 'circle'` nella prima versione.

### Magnetic parallax — [#21](https://github.com/Shuriken933/proteus-cursor/issues/21)
Dipende dal punto precedente. Non solo il cursore si attrae verso l'elemento: è l'elemento stesso a muoversi leggermente verso il cursore. Richiede attenzione a non rompere `transform`/`transition` CSS già presenti sull'elemento target — va sempre opt-in esplicito, mai implicito in `magnetic`.

---

## 2. Nuove interazioni

### Outline morph — [#23](https://github.com/Shuriken933/proteus-cursor/issues/23)
Il cursore si trasforma in un bordo che ricalca forma, dimensione e `border-radius` dell'elemento in hover, invece di restare un cerchio/blob sopra di esso. Risolve un problema preciso: comunicare "questo è il confine dell'area cliccabile", non solo "il mouse è qui" — pattern ormai standard (Framer, Linear). È un nuovo *shape mode* (`shape: 'outline'`), non un modificatore: sostituisce la geometria, non la decora. Il preset `chrome` (già pensato per l'inversione automatica dei colori) è il candidato naturale per adottarlo per primo.

**Rischio principale**: un outline troppo "pulito" può essere scambiato per un bordo CSS statico invece che per il cursore stesso — serve sempre un segnale di movimento residuo per mantenere la percezione "questo mi segue".

### Idle state — [#24](https://github.com/Shuriken933/proteus-cursor/issues/24)
Il cursore cambia aspetto dopo N secondi di inattività del mouse. **Va giustificato solo se comunica qualcosa** (suggerire un'azione nascosta, segnalare un cambio di modalità della pagina, farsi da parte durante la lettura) — mai come effetto puramente estetico. Non è un nuovo tipo di stato nella state machine (non è legato a un elemento): è un modificatore globale d'istanza che riusa uno stato già definito con `addState`. Entrata graduale, uscita sempre istantanea al primo movimento.

### Drag state — [#25](https://github.com/Shuriken933/proteus-cursor/issues/25)
Una variante del cursore attiva tra `mousedown` e `mouseup` mentre ci si muove su un elemento (gallery "drag to scroll", slider di confronto). Concettualmente è un **sotto-stato di un hover esistente** (`addState('x', { dragging: {...} })`), non uno stato indipendente. Punto critico da non trascurare in implementazione: il `mouseup` può avvenire fuori dall'elemento — senza un listener globale il cursore può restare "incastrato" in stato dragging.

### Ripple di click a intensità variabile — [#17](https://github.com/Shuriken933/proteus-cursor/issues/17) *(issue esistente, arricchita)*
L'intensità del ripple (scala, durata, opacità) scala con la velocità del mouse al momento del click, riusando il calcolo di velocità già presente nel loop fluid invece di introdurne uno nuovo.

---

## 3. Grafica avanzata

### Icona/immagine dentro il cursore — [#26](https://github.com/Shuriken933/proteus-cursor/issues/26)
Estensione del sistema `text`/`text_color`/`text_size` esistente per supportare un'icona SVG monocromatica (`fill: currentColor`) al posto o accanto al testo. Le icone raster sono esplicitamente sconsigliate: non si comportano bene con `blend_mode` diverso da `normal`.

### Effetto goo/blob per `fluid` — [#27](https://github.com/Shuriken933/proteus-cursor/issues/27)
Un vero comportamento liquido (shape e shadow che si fondono con un collo che si assottiglia e si stacca), al posto dell'attuale stretch a matrice CSS lineare. **Scelta tecnica: Canvas 2D con metaballs geometrici, non WebGL** — per fondere solo 2-3 corpi il calcolo diretto delle tangenti tra cerchi è più preciso e leggero di uno shader dedicato, che sarebbe sproporzionato per questo caso d'uso. Vive come modulo opt-in separato (`proteuscursor/fx`), mai importato dal core: chi non lo usa non paga un byte di bundle in più.

### Shape custom via path SVG — [#28](https://github.com/Shuriken933/proteus-cursor/issues/28)
Shape arbitrarie (stelle, poligoni) oltre a circle/fluid. Resta interamente DOM — un `<svg><path>` sostituisce il `<div>` attuale solo quando è specificato un `custom_path`, mantenendo l'id `proteus-cursor-shape` così tutta la pipeline esistente (posizione, transform, click animation) continua a funzionare senza modifiche.

---

## 4. DX e integrazione framework

### Overlay di debug per la state machine — [#22](https://github.com/Shuriken933/proteus-cursor/issues/22)
Un pannello opzionale, sola lettura (`cursor.enableDebugOverlay()`), che mostra stato attivo, preset di default corrente e le ultime transizioni hover/leave — utile per chi integra la libreria in progetti con molti stati. Distinto da `enableTestMode()`, che è interattivo.

### Adapter Angular — [#29](https://github.com/Shuriken933/proteus-cursor/issues/29)
`proteuscursor/angular`, con un'injection function (`injectProteusCursor`, analoga a `useProteusCursor`) più una directive come zucchero sintattico sopra — non un servizio DI puro, per mantenere il lifecycle automatico che hanno già gli adapter React/Vue/Svelte.

### Web Component generico — [#30](https://github.com/Shuriken933/proteus-cursor/issues/30)
`<proteus-cursor shape="circle" shape-color="#fff">` come custom element, per progetti vanilla, WordPress, o framework non ancora supportati. Attributi kebab-case reattivi post-mount, mappati ai setter pubblici già esistenti del core (`setShapeColor`, `setShape`, ...).

---

## 5. Accessibilità

### Fallback grafico statico per `prefers-reduced-motion` — [#31](https://github.com/Shuriken933/proteus-cursor/issues/31)
Oggi `prefers-reduced-motion: reduce` disattiva l'intero cursore custom. Opzione opt-in (`reducedMotionFallback: 'static'`, default resta `'native'` — zero breaking change) per un cursore che segue il mouse senza RAF, smoothing, trail o deformazioni: solo scrittura diretta di stile su `mousemove`. Tutto ciò che richiede un secondo tick (shadow con delay, trail, stretch fluid, click ripple animato) resta sempre disabilitato in questa modalità, per costruzione.

---

## Come contribuire

Ogni voce è una issue GitHub con la spec completa (API proposta, come si integra con l'architettura esistente, rischi e vincoli). La [Project board](https://github.com/users/Shuriken933/projects/11) tiene traccia dello stato di avanzamento (`To do` → `In progress` → `Done`). Ogni spec copre i diversi aspetti del progetto: UX, UI, core JavaScript, animazione, grafica web, accessibilità/performance e adapter framework.
