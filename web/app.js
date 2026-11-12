(function () {
  const DATA = window.LEARNING_DATA;
  const DISH_SIZE = 20;

  // ==========================================
  // 1. TOKENIZER / SYNTAX HIGHLIGHTER
  // ==========================================
  const TOKEN_REGEX =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(`(?:\\[\s\S]|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(@[A-Za-z_]\w*)|\b(package|import|from|export|default|public|private|protected|final|static|readonly|override|class|interface|extends|implements|type|struct|func|return|if|else|for|range|const|let|var|new|throw|throws|void|async|await|true|false|null|nil|undefined|this|super)\b|\b(boolean|int|Integer|Boolean|String|Object|number|string|unknown|Promise|ReactNode|Map|TreeMap|List|Cell|NullCell|CellBlock|SquaredPetriDish|PetriDish|NextGenerationCalculator|OccupiedBlockGenerationCalculator|EmptyBlockGenerationCalculator|EmptyBlockRetriever|NeighbourLivingCellsCounter|LivingCellGameRules|EmptyBlockGameRules|GameDependencies|error|bool)\b|\b(\d+)\b/g;

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function highlightCode(source) {
    let result = '';
    let lastIndex = 0;
    TOKEN_REGEX.lastIndex = 0;

    let match;
    while ((match = TOKEN_REGEX.exec(source)) !== null) {
      result += escapeHtml(source.slice(lastIndex, match.index));
      const [full, comment, str, ann, kw, typ, num] = match;
      const safe = escapeHtml(full);
      if (comment) result += `<span class="tok-com">${safe}</span>`;
      else if (str) result += `<span class="tok-str">${safe}</span>`;
      else if (ann) result += `<span class="tok-ann">${safe}</span>`;
      else if (kw) result += `<span class="tok-kw">${safe}</span>`;
      else if (typ) result += `<span class="tok-type">${safe}</span>`;
      else if (num) result += `<span class="tok-num">${safe}</span>`;
      else result += safe;
      lastIndex = TOKEN_REGEX.lastIndex;
    }

    result += escapeHtml(source.slice(lastIndex));
    return result;
  }

  // ==========================================
  // 2. NAVIGATION TABS
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const viewSections = document.querySelectorAll('.view-section');

  function switchTab(targetId) {
    tabButtons.forEach((b) => b.classList.toggle('active', b.dataset.tab === targetId));
    viewSections.forEach((s) => s.classList.toggle('active', s.id === `view-${targetId}`));

    if (targetId === 'guide' || targetId === 'dojo') {
      const isFileProto = window.location.protocol === 'file:';
      const warnEl = document.getElementById(`file-protocol-warning-${targetId}`);
      const frameEl = document.getElementById(`iframe-${targetId}`);
      if (isFileProto) {
        if (warnEl) warnEl.hidden = false;
        if (frameEl) frameEl.style.display = 'none';
      } else if (frameEl && !frameEl.getAttribute('src')) {
        frameEl.setAttribute('src', `/academy/index.html?view=${targetId}&embed=1`);
      }
    }
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // ==========================================
  // 3. 4-VARIANT CODE COMPARATOR
  // ==========================================
  let currentModuleId = DATA.modules[0].id;
  const activeLangs = new Set(['java', 'ts', 'react', 'go']);

  const LANG_META = {
    java: { label: 'Java 11 (Original)', cls: 'lang-java' },
    ts: { label: 'TypeScript (Node OOP)', cls: 'lang-ts' },
    react: { label: 'TypeScript + React', cls: 'lang-react' },
    go: { label: 'Golang (Stdlib)', cls: 'lang-go' },
  };

  const moduleListEl = document.getElementById('module-list');
  const moduleTitleEl = document.getElementById('module-title');
  const moduleSummaryEl = document.getElementById('module-summary');
  const insightsGridEl = document.getElementById('insights-grid');
  const codeColumnsEl = document.getElementById('code-columns');
  const langToggleButtons = document.querySelectorAll('.lang-toggle');

  function renderSidebar() {
    moduleListEl.innerHTML = '';
    DATA.modules.forEach((mod) => {
      const btn = document.createElement('button');
      btn.className = `module-item ${mod.id === currentModuleId ? 'active' : ''}`;
      btn.innerHTML = `
        <span class="module-item-step">${escapeHtml(mod.step)}</span>
        <span class="module-item-name">${escapeHtml(mod.name)}</span>
        <span class="module-item-tag">${escapeHtml(mod.tag)}</span>
      `;
      btn.addEventListener('click', () => {
        currentModuleId = mod.id;
        renderSidebar();
        renderModuleContent();
      });
      moduleListEl.appendChild(btn);
    });
  }

  function renderModuleContent() {
    const mod = DATA.modules.find((m) => m.id === currentModuleId) || DATA.modules[0];
    moduleTitleEl.textContent = mod.title;
    moduleSummaryEl.textContent = mod.summary;

    insightsGridEl.innerHTML = mod.insights
      .map((ins) => {
        let variantClass = '';
        if (ins.type === 'go') variantClass = 'go-insight';
        else if (ins.type === 'react') variantClass = 'react-insight';
        else if (ins.type === 'pattern') variantClass = 'pattern-insight';
        return `
          <div class="insight-card ${variantClass}">
            <h4>${escapeHtml(ins.title)}</h4>
            <p>${ins.body}</p>
          </div>
        `;
      })
      .join('');

    const orderedLangs = ['java', 'ts', 'react', 'go'].filter((l) => activeLangs.has(l));
    const cols = orderedLangs.length >= 3 ? 2 : Math.max(1, orderedLangs.length);
    codeColumnsEl.style.setProperty('--cols', String(cols));

    codeColumnsEl.innerHTML = orderedLangs
      .map((lang) => {
        const entry = mod.code[lang];
        const meta = LANG_META[lang];
        return `
          <article class="code-panel ${meta.cls}">
            <div class="code-panel-header">
              <div>
                <strong style="font-size:0.78rem; display:block;">${escapeHtml(meta.label)}</strong>
                <span class="code-filepath">${escapeHtml(entry.path)}</span>
              </div>
              <button class="copy-btn" data-lang="${lang}">Copiar</button>
            </div>
            <pre class="code-pre"><code>${highlightCode(entry.source)}</code></pre>
          </article>
        `;
      })
      .join('');

    codeColumnsEl.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        navigator.clipboard?.writeText(mod.code[lang].source);
        const prev = btn.textContent;
        btn.textContent = '¡Copiado!';
        setTimeout(() => {
          btn.textContent = prev;
        }, 1200);
      });
    });
  }

  langToggleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (activeLangs.has(lang) && activeLangs.size > 1) {
        activeLangs.delete(lang);
      } else {
        activeLangs.add(lang);
      }
      btn.classList.toggle('active', activeLangs.has(lang));
      renderModuleContent();
    });
  });

  // ==========================================
  // 4. X-RAY 3-PHASE SIMULATOR ENGINE
  // ==========================================
  // Mirrors SquaredPetriDish: Map<row, Map<col, { alive: boolean, bornThisGen?: boolean }>>
  let cellStorage = new Map();
  let candidateOverlay = new Map(); // key "r,c" -> neighbourCount
  let occupiedCounts = new Map(); // key "r,c" -> neighbourCount
  let generation = 0;
  let xrayPhase = 0; // 0 = clean/ready, 1 = after OccupiedCalc, 2 = after EmptyCalc
  let autoPlayTimer = null;

  function setLivingCell(r, c) {
    if (r < 0 || r >= DISH_SIZE || c < 0 || c >= DISH_SIZE) return;
    if (!cellStorage.has(r)) cellStorage.set(r, new Map());
    cellStorage.get(r).set(c, { alive: true, bornThisGen: false });
  }

  function hasStoredBlock(r, c) {
    return cellStorage.get(r)?.has(c) ?? false;
  }

  function isLivingCell(r, c) {
    return cellStorage.get(r)?.get(c)?.alive ?? false;
  }

  function getOccupiedCoords(excludeNewlyBorn = false) {
    const rows = [...cellStorage.keys()].sort((a, b) => a - b);
    const coords = [];
    for (const r of rows) {
      const cols = [...cellStorage.get(r).keys()].sort((a, b) => a - b);
      for (const c of cols) {
        const cell = cellStorage.get(r).get(c);
        if (excludeNewlyBorn && cell.bornThisGen) continue;
        coords.push([r, c, cell]);
      }
    }
    return coords;
  }

  function getNeighbourCoords(r, c) {
    const res = [];
    const rStart = Math.max(0, r - 1);
    const rEnd = Math.min(DISH_SIZE - 1, r + 1);
    const cStart = Math.max(0, c - 1);
    const cEnd = Math.min(DISH_SIZE - 1, c + 1);
    for (let nr = rStart; nr <= rEnd; nr++) {
      for (let nc = cStart; nc <= cEnd; nc++) {
        if (nr !== r || nc !== c) res.push([nr, nc]);
      }
    }
    return res;
  }

  // Exact replica of NeighbourLivingCellsCounter: counts blocks with containsCell() prior to new births
  function countOriginalOccupiedNeighbours(r, c) {
    let count = 0;
    for (const [nr, nc] of getNeighbourCoords(r, c)) {
      const entry = cellStorage.get(nr)?.get(nc);
      if (entry && !entry.bornThisGen) count++;
    }
    return count;
  }

  function runPhase1Occupied() {
    occupiedCounts.clear();
    candidateOverlay.clear();
    for (const [r, c, cell] of getOccupiedCoords(true)) {
      const n = countOriginalOccupiedNeighbours(r, c);
      occupiedCounts.set(`${r},${c}`, n);
      if (n < 2 || n > 3) {
        cell.alive = false; // Killed in-place, but remains in cellStorage!
      }
    }
    xrayPhase = 1;
  }

  function runPhase2Empty() {
    const generated = [];
    for (const [r, c] of getOccupiedCoords(true)) {
      for (const [nr, nc] of getNeighbourCoords(r, c)) {
        if (!hasStoredBlock(nr, nc)) {
          const around = countOriginalOccupiedNeighbours(nr, nc);
          candidateOverlay.set(`${nr},${nc}`, around);
          if (around === 3) {
            generated.push([nr, nc]);
          }
        }
      }
    }
    for (const [nr, nc] of generated) {
      if (!cellStorage.has(nr)) cellStorage.set(nr, new Map());
      cellStorage.get(nr).set(nc, { alive: true, bornThisGen: true });
    }
    xrayPhase = 2;
  }

  function runPhase3CleanDead() {
    for (const [r, c, cell] of getOccupiedCoords(false)) {
      if (!cell.alive) {
        cellStorage.get(r).delete(c);
        if (cellStorage.get(r).size === 0) cellStorage.delete(r);
      } else {
        cell.bornThisGen = false;
      }
    }
    occupiedCounts.clear();
    candidateOverlay.clear();
    xrayPhase = 0;
    generation++;
  }

  function stepFullGeneration() {
    if (xrayPhase === 1) {
      runPhase2Empty();
      runPhase3CleanDead();
    } else if (xrayPhase === 2) {
      runPhase3CleanDead();
    } else {
      runPhase1Occupied();
      runPhase2Empty();
      runPhase3CleanDead();
    }
    renderSimulator();
  }

  function stepXRaySubPhase() {
    stopAutoPlay();
    if (xrayPhase === 0) runPhase1Occupied();
    else if (xrayPhase === 1) runPhase2Empty();
    else runPhase3CleanDead();
    renderSimulator();
  }

  function loadPreset(presetName) {
    stopAutoPlay();
    cellStorage.clear();
    occupiedCounts.clear();
    candidateOverlay.clear();
    generation = 0;
    xrayPhase = 0;

    const presets = {
      smallExploder: [
        [8, 10],
        [9, 9],
        [9, 10],
        [9, 11],
        [10, 9],
        [10, 11],
        [11, 10],
      ],
      glider: [
        [2, 3],
        [3, 4],
        [4, 2],
        [4, 3],
        [4, 4],
      ],
      blinker: [
        [9, 9],
        [9, 10],
        [9, 11],
      ],
      beacon: [
        [8, 8],
        [8, 9],
        [9, 8],
        [10, 11],
        [11, 10],
        [11, 11],
      ],
      empty: [],
    };

    (presets[presetName] || presets.smallExploder).forEach(([r, c]) => setLivingCell(r, c));
    renderSimulator();
  }

  const petriGridEl = document.getElementById('petri-grid');
  const storageDumpEl = document.getElementById('storage-dump');
  const statGenEl = document.getElementById('stat-gen');
  const statLivingEl = document.getElementById('stat-living');
  const statDeadPendingEl = document.getElementById('stat-dead');
  const statPhaseEl = document.getElementById('stat-phase');
  const playBtnEl = document.getElementById('btn-play');

  function buildGridDOM() {
    petriGridEl.innerHTML = '';
    for (let r = 0; r < DISH_SIZE; r++) {
      for (let c = 0; c < DISH_SIZE; c++) {
        const div = document.createElement('div');
        div.className = 'grid-cell';
        div.dataset.r = String(r);
        div.dataset.c = String(c);
        div.title = `CellBlock(${r}, ${c})`;
        div.addEventListener('click', () => {
          if (xrayPhase !== 0) return; // avoid editing mid-subphase
          if (isLivingCell(r, c)) {
            cellStorage.get(r).delete(c);
            if (cellStorage.get(r).size === 0) cellStorage.delete(r);
          } else {
            setLivingCell(r, c);
          }
          renderSimulator();
        });
        petriGridEl.appendChild(div);
      }
    }
  }

  function renderSimulator() {
    const cells = petriGridEl.children;
    let livingCount = 0;
    let deadPendingCount = 0;

    for (let r = 0; r < DISH_SIZE; r++) {
      for (let c = 0; c < DISH_SIZE; c++) {
        const idx = r * DISH_SIZE + c;
        const el = cells[idx];
        const entry = cellStorage.get(r)?.get(c);
        const key = `${r},${c}`;

        el.className = 'grid-cell';
        el.textContent = '';

        if (entry) {
          if (entry.bornThisGen) {
            el.classList.add('born');
            el.textContent = '+';
            livingCount++;
          } else if (entry.alive) {
            el.classList.add('alive');
            if (occupiedCounts.has(key)) el.textContent = String(occupiedCounts.get(key));
            livingCount++;
          } else {
            el.classList.add('dying');
            if (occupiedCounts.has(key)) el.textContent = String(occupiedCounts.get(key));
            deadPendingCount++;
          }
        } else if (candidateOverlay.has(key)) {
          el.classList.add('candidate');
          el.textContent = String(candidateOverlay.get(key));
        }
      }
    }

    statGenEl.textContent = String(generation);
    statLivingEl.textContent = String(livingCount);
    statDeadPendingEl.textContent = String(deadPendingCount);
    const phaseLabels = ['Listo', '1/3 Ocupadas', '2/3 Vacías', '3/3 Limpieza'];
    statPhaseEl.textContent = phaseLabels[xrayPhase];

    document.querySelectorAll('.pipeline-step').forEach((stepEl) => {
      const p = Number(stepEl.dataset.phase);
      stepEl.classList.toggle('active-phase', p === xrayPhase);
    });

    // Sparse map dump
    const lines = [];
    const sortedRows = [...cellStorage.keys()].sort((a, b) => a - b);
    if (sortedRows.length === 0) {
      lines.push('// cellStorage vacío (0 filas almacenadas en memoria)');
    } else {
      for (const r of sortedRows) {
        const cols = [...cellStorage.get(r).keys()].sort((a, b) => a - b);
        const formattedCols = cols
          .map((c) => {
            const cell = cellStorage.get(r).get(c);
            if (cell.bornThisGen) return `${c}: Cell(BORN)`;
            return cell.alive ? `${c}: Cell(alive)` : `${c}: Cell(DEAD*)`;
          })
          .join(', ');
        lines.push(`row[${String(r).padStart(2, ' ')}] -> { ${formattedCols} }`);
      }
    }
    storageDumpEl.textContent = lines.join('\n');
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
      playBtnEl.textContent = '▶ Auto-Play';
    }
  }

  playBtnEl.addEventListener('click', () => {
    if (autoPlayTimer) {
      stopAutoPlay();
    } else {
      playBtnEl.textContent = '⏸ Pausar';
      autoPlayTimer = setInterval(stepFullGeneration, 450);
    }
  });

  document.getElementById('btn-next-gen').addEventListener('click', () => {
    stopAutoPlay();
    stepFullGeneration();
  });

  document.getElementById('btn-xray').addEventListener('click', stepXRaySubPhase);

  document.getElementById('preset-select').addEventListener('change', (e) => {
    loadPreset(e.target.value);
  });

  document.getElementById('btn-reset-preset').addEventListener('click', () => {
    loadPreset(document.getElementById('preset-select').value);
  });

  document.querySelectorAll('.pipeline-step').forEach((stepEl) => {
    stepEl.addEventListener('click', () => {
      currentModuleId = stepEl.dataset.jump || 'calculators';
      renderSidebar();
      renderModuleContent();
      switchTab('comparator');
    });
  });

  // ==========================================
  // 5. CHEAT SHEET & QUIZ
  // ==========================================
  const cheatBodyEl = document.getElementById('cheat-tbody');
  const cheatSearchEl = document.getElementById('cheat-search');

  function renderCheatSheet(filterText = '') {
    const q = filterText.trim().toLowerCase();
    const rows = DATA.cheatSheet.filter(
      (row) =>
        !q ||
        row.concept.toLowerCase().includes(q) ||
        row.java.toLowerCase().includes(q) ||
        row.ts.toLowerCase().includes(q) ||
        row.react.toLowerCase().includes(q) ||
        row.go.toLowerCase().includes(q),
    );

    cheatBodyEl.innerHTML = rows
      .map(
        (r) => `
        <tr>
          <td><strong>${escapeHtml(r.concept)}</strong></td>
          <td>${r.java}</td>
          <td>${r.ts}</td>
          <td>${r.react}</td>
          <td>${r.go}</td>
        </tr>
      `,
      )
      .join('');
  }

  cheatSearchEl.addEventListener('input', (e) => renderCheatSheet(e.target.value));

  // Quiz state
  let quizIndex = 0;
  let score = 0;
  let answeredCurrent = false;

  const quizProgressEl = document.getElementById('quiz-progress');
  const quizQuestionEl = document.getElementById('quiz-question');
  const quizCodeEl = document.getElementById('quiz-code');
  const quizOptionsEl = document.getElementById('quiz-options');
  const quizFeedbackEl = document.getElementById('quiz-feedback');
  const quizScoreEl = document.getElementById('quiz-score');
  const quizNextBtn = document.getElementById('quiz-next');

  function renderQuiz() {
    const item = DATA.quiz[quizIndex];
    answeredCurrent = false;
    quizProgressEl.textContent = `Pregunta ${quizIndex + 1} de ${DATA.quiz.length}`;
    quizQuestionEl.textContent = item.question;
    quizCodeEl.innerHTML = `<code>${highlightCode(item.snippet)}</code>`;
    quizFeedbackEl.className = 'quiz-feedback';
    quizFeedbackEl.textContent = '';
    quizScoreEl.textContent = `Aciertos: ${score} / ${DATA.quiz.length}`;
    quizNextBtn.textContent =
      quizIndex === DATA.quiz.length - 1 ? 'Reiniciar Reto' : 'Siguiente pregunta →';

    quizOptionsEl.innerHTML = '';
    item.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = optText;
      btn.addEventListener('click', () => {
        if (answeredCurrent) return;
        answeredCurrent = true;
        const allBtns = quizOptionsEl.querySelectorAll('.quiz-option');
        allBtns.forEach((b, i) => {
          b.disabled = true;
          if (i === item.correctIndex) b.classList.add('correct');
          else if (i === idx) b.classList.add('wrong');
        });
        if (idx === item.correctIndex) score++;
        quizScoreEl.textContent = `Aciertos: ${score} / ${DATA.quiz.length}`;
        quizFeedbackEl.textContent = item.explanation;
        quizFeedbackEl.classList.add('visible');
      });
      quizOptionsEl.appendChild(btn);
    });
  }

  quizNextBtn.addEventListener('click', () => {
    if (quizIndex === DATA.quiz.length - 1) {
      quizIndex = 0;
      score = 0;
    } else {
      quizIndex++;
    }
    renderQuiz();
  });

  // ==========================================
  // INIT
  // ==========================================
  renderSidebar();
  renderModuleContent();
  buildGridDOM();
  loadPreset('smallExploder');
  renderCheatSheet();
  renderQuiz();

  const initialTab = new URLSearchParams(window.location.search).get('tab');
  if (initialTab && ['comparator', 'simulator', 'cheatsheet', 'quiz', 'guide', 'dojo'].includes(initialTab)) {
    switchTab(initialTab);
  }
})();
