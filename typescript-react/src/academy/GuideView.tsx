import { useEffect, useMemo, useState } from 'react';
import { GUIDE_PHASES } from './guideData.ts';

const STORAGE_KEY = 'gol_ts_react_guide_done_v1';

function loadDonePhases(): Set<number> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is number => typeof x === 'number'));
  } catch {
    return new Set();
  }
}

interface GuideViewProps {
  initialPhase?: number;
  onOpenKata: (kataId: string) => void;
}

export function GuideView({ initialPhase = 1, onOpenKata }: GuideViewProps) {
  const [selectedPhaseNum, setSelectedPhaseNum] = useState<number>(initialPhase);
  const [searchTerm, setSearchTerm] = useState('');
  const [donePhases, setDonePhases] = useState<Set<number>>(loadDonePhases);

  useEffect(() => {
    setSelectedPhaseNum(initialPhase);
  }, [initialPhase]);

  const filteredPhases = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return GUIDE_PHASES;
    return GUIDE_PHASES.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.javaMentalTrap.toLowerCase().includes(q) ||
        p.reactMentalShift.toLowerCase().includes(q) ||
        p.deepDivePoints.some(
          (d) => d.heading.toLowerCase().includes(q) || d.body.toLowerCase().includes(q),
        ),
    );
  }, [searchTerm]);

  const activePhase =
    filteredPhases.find((p) => p.phase === selectedPhaseNum) ??
    filteredPhases[0] ??
    GUIDE_PHASES[0];

  const toggleDone = (phaseNum: number) => {
    setDonePhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseNum)) next.delete(phaseNum);
      else next.add(phaseNum);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore storage quota errors
      }
      return next;
    });
  };

  const progressPct = Math.round((donePhases.size / GUIDE_PHASES.length) * 100);

  return (
    <div className="academy-layout">
      <aside className="academy-sidebar">
        <div className="academy-progress-box">
          <div className="academy-progress-header">
            <span>Progreso Senior Java → React</span>
            <strong>
              {donePhases.size}/{GUIDE_PHASES.length} ({progressPct}%)
            </strong>
          </div>
          <div className="academy-progress-track">
            <div className="academy-progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        <input
          type="search"
          className="academy-search"
          placeholder="Filtrar tema (Fiber, never, Context, Zod...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <nav className="academy-phase-list" aria-label="Fases de aprendizaje">
          {filteredPhases.map((item) => {
            const isActive = item.phase === activePhase.phase;
            const isDone = donePhases.has(item.phase);
            return (
              <button
                key={item.phase}
                type="button"
                className={`academy-phase-item ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedPhaseNum(item.phase)}
              >
                <span className={`phase-badge ${isDone ? 'done' : ''}`}>
                  {isDone ? '✓' : item.phase}
                </span>
                <span className="phase-item-meta">
                  <strong>{item.title}</strong>
                  <small>{item.readingMinutes} min lectura</small>
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <article className="academy-article">
        <header className="academy-article-header">
          <div>
            <span className="eyebrow">
              FASE {activePhase.phase} DE {GUIDE_PHASES.length} · ~{activePhase.readingMinutes} MIN
            </span>
            <h2>{activePhase.title}</h2>
            <p className="academy-tagline">{activePhase.tagline}</p>
          </div>

          <div className="academy-header-actions">
            <button
              type="button"
              className={`btn-action ${donePhases.has(activePhase.phase) ? 'btn-done' : ''}`}
              onClick={() => toggleDone(activePhase.phase)}
            >
              {donePhases.has(activePhase.phase) ? '✓ Fase asimilada' : 'Marcar como leída'}
            </button>
            {activePhase.relatedKataId && (
              <button
                type="button"
                className="btn-action btn-kata-jump"
                onClick={() => onOpenKata(activePhase.relatedKataId!)}
              >
                🥋 Practicar Kata de esta fase →
              </button>
            )}
          </div>
        </header>

        <div className="mental-shift-grid">
          <div className="mental-card trap">
            <h3>☕ Tu intuición viniendo de Java / Spring</h3>
            <p>{activePhase.javaMentalTrap}</p>
          </div>
          <div className="mental-card shift">
            <h3>⚛️ El modelo mental real en TypeScript + React</h3>
            <p>{activePhase.reactMentalShift}</p>
          </div>
        </div>

        <section className="deep-dive-section">
          <h3>Claves de Ingeniería a Nivel Senior</h3>
          <div className="deep-dive-list">
            {activePhase.deepDivePoints.map((pt) => (
              <div key={pt.heading} className="deep-dive-card">
                <h4>{pt.heading}</h4>
                <p>{pt.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="code-compare-section">
          <h3>Contraste Directo de Código</h3>
          <div className="code-compare-grid">
            <div className="code-box bad">
              <div className="code-box-title">{activePhase.codeComparison.badLabel}</div>
              <pre>
                <code>{activePhase.codeComparison.badCode}</code>
              </pre>
            </div>
            <div className="code-box good">
              <div className="code-box-title">{activePhase.codeComparison.goodLabel}</div>
              <pre>
                <code>{activePhase.codeComparison.goodCode}</code>
              </pre>
            </div>
          </div>
        </section>

        <footer className="academy-footer-grid">
          <div className="checklist-box">
            <h4>Autochequeo antes de avanzar</h4>
            <ul>
              {activePhase.seniorChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="repo-files-box">
            <h4>Dónde verlo aplicado en este repositorio</h4>
            <div className="file-chip-list">
              {activePhase.repoFiles.map((f) => (
                <code key={f} className="file-chip">
                  typescript-react/{f}
                </code>
              ))}
            </div>
            <div className="phase-nav-buttons">
              <button
                type="button"
                disabled={activePhase.phase <= 1}
                onClick={() => setSelectedPhaseNum(Math.max(1, activePhase.phase - 1))}
              >
                ← Fase anterior
              </button>
              <button
                type="button"
                disabled={activePhase.phase >= GUIDE_PHASES.length}
                onClick={() =>
                  setSelectedPhaseNum(Math.min(GUIDE_PHASES.length, activePhase.phase + 1))
                }
              >
                Siguiente fase →
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
