import React, { useState } from "react";

// ============================================================
// STYLES — injectes une seule fois dans le document
// ============================================================
const styleId = "quiz-engine-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .lq-wrap { padding-bottom: 40px; position: relative; }
    .lq-sticky {
      position: sticky; top: 60px; z-index: 50;
      background: var(--ifm-background-color);
      border-bottom: 2px solid var(--lq-accent, #1a3c8f);
      padding: 10px 20px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      margin-bottom: 24px; transition: border-color 0.4s;
    }
    .lq-sticky-title { font-weight: 700; font-size: 14px; color: var(--ifm-font-color-base); }
    .lq-badge {
      border-radius: 20px; padding: 2px 10px; font-size: 12px; font-weight: 600;
      background: color-mix(in srgb, var(--lq-accent, #1a3c8f) 12%, transparent);
      color: var(--lq-accent, #1a3c8f);
      border: 1px solid color-mix(in srgb, var(--lq-accent, #1a3c8f) 30%, transparent);
    }
    .lq-progress-track { width: 100px; height: 6px; background: var(--ifm-color-emphasis-200); border-radius: 99px; overflow: hidden; }
    .lq-progress-bar { height: 100%; border-radius: 99px; background: var(--lq-accent, #1a3c8f); transition: width 0.4s ease, background 0.4s; }
    .lq-score-num { font-weight: 800; font-size: 18px; color: var(--lq-accent, #1a3c8f); min-width: 48px; text-align: right; transition: color 0.4s; }
    .lq-btn-validate { border: none; border-radius: 6px; padding: 4px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .lq-btn-validate:disabled { background: var(--ifm-color-emphasis-200) !important; color: var(--ifm-color-emphasis-500) !important; cursor: not-allowed; }
    .lq-btn-outline { background: transparent; border: 1px solid var(--ifm-color-primary); color: var(--ifm-color-primary); border-radius: 6px; padding: 4px 14px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .lq-card { border: 1px solid var(--ifm-color-emphasis-300); border-radius: 10px; padding: 18px 20px 14px; margin-bottom: 14px; background: var(--ifm-background-surface-color); transition: border-color 0.3s, background 0.3s; }
    .lq-card.correct { border-color: #16a34a55; background: color-mix(in srgb, #16a34a 6%, var(--ifm-background-surface-color)); }
    .lq-card.wrong   { border-color: #dc262655; background: color-mix(in srgb, #dc2626 6%, var(--ifm-background-surface-color)); }
    .lq-qnum { border-radius: 6px; padding: 1px 8px; font-size: 12px; font-weight: 700; flex-shrink: 0; line-height: 22px; background: color-mix(in srgb, #1a3c8f 15%, transparent); color: var(--ifm-color-primary); }
    .lq-qnum.correct { background: color-mix(in srgb, #16a34a 15%, transparent); color: #16a34a; }
    .lq-qnum.wrong   { background: color-mix(in srgb, #dc2626 15%, transparent); color: #dc2626; }
    .lq-qtext { font-weight: 600; font-size: 14px; line-height: 1.6; color: var(--ifm-font-color-base); }
    .lq-option { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 6px; cursor: pointer; transition: background 0.15s; background: transparent; }
    .lq-option:hover { background: var(--ifm-color-emphasis-100); }
    .lq-option.selected    { background: color-mix(in srgb, var(--ifm-color-primary) 10%, transparent); }
    .lq-option.opt-correct { background: color-mix(in srgb, #16a34a 10%, transparent); cursor: default; }
    .lq-option.opt-wrong   { background: color-mix(in srgb, #dc2626 10%, transparent); cursor: default; }
    .lq-option.submitted   { cursor: default; }
    .lq-option.submitted:hover { background: transparent; }
    .lq-option.opt-correct:hover { background: color-mix(in srgb, #16a34a 10%, transparent); }
    .lq-option.opt-wrong:hover   { background: color-mix(in srgb, #dc2626 10%, transparent); }
    .lq-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--ifm-color-emphasis-400); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s; }
    .lq-radio-dot { width: 10px; height: 10px; border-radius: 50%; background: transparent; transition: background 0.2s; }
    .lq-option.selected    .lq-radio     { border-color: var(--ifm-color-primary); }
    .lq-option.selected    .lq-radio-dot { background: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-radio     { border-color: #16a34a; }
    .lq-option.opt-correct .lq-radio-dot { background: #16a34a; }
    .lq-option.opt-wrong   .lq-radio     { border-color: #dc2626; }
    .lq-option.opt-wrong   .lq-radio-dot { background: #dc2626; }
    .lq-letter { font-size: 12px; font-weight: 700; min-width: 16px; color: var(--ifm-color-emphasis-500); transition: color 0.2s; }
    .lq-option.selected    .lq-letter { color: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-letter { color: #16a34a; }
    .lq-option.opt-wrong   .lq-letter { color: #dc2626; }
    .lq-opttext { font-size: 14px; flex: 1; color: var(--ifm-font-color-base); transition: color 0.2s; }
    .lq-option.opt-correct .lq-opttext { color: #16a34a; }
    .lq-option.opt-wrong   .lq-opttext { color: #dc2626; }
    .lq-btn-hint { background: transparent; border: 1px solid var(--ifm-color-emphasis-300); color: var(--ifm-color-emphasis-600); border-radius: 6px; padding: 3px 12px; cursor: pointer; font-size: 12px; margin-top: 10px; }
    .lq-explain { margin-top: 8px; background: var(--ifm-color-emphasis-100); border: 1px solid var(--ifm-color-emphasis-300); border-left: 3px solid var(--ifm-color-primary); border-radius: 6px; padding: 10px 14px; font-size: 13px; color: var(--ifm-font-color-base); line-height: 1.7; }
    .lq-explain-label { color: var(--ifm-color-primary); font-weight: 700; }
    .lq-explain-ans   { color: #16a34a; font-weight: 700; }
    .lq-btn-submit { border: none; border-radius: 8px; padding: 11px 36px; font-size: 14px; font-weight: 700; transition: all 0.3s; cursor: pointer; display: block; margin: 8px auto 16px; }
    .lq-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ifm-color-emphasis-500); margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid var(--ifm-color-emphasis-200); }
    .lq-final { text-align: center; padding: 28px 20px; background: var(--ifm-color-emphasis-100); border-radius: 12px; margin-top: 8px; border: 1px solid var(--ifm-color-emphasis-300); }
    .lq-final-score { font-size: 44px; font-weight: 800; margin-bottom: 6px; }
    .lq-final-label { font-size: 16px; font-weight: 600; color: var(--ifm-font-color-base); margin-bottom: 4px; }
    .lq-final-msg   { font-size: 13px; color: var(--ifm-color-emphasis-600); margin-bottom: 20px; }
    .lq-btn-reset { background: var(--ifm-color-primary); border: none; color: #fff; border-radius: 8px; padding: 10px 32px; cursor: pointer; font-size: 14px; font-weight: 600; }
    .lq-score-grid { display: flex; gap: 16px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap; }
    .lq-score-item { background: var(--ifm-background-surface-color); border: 1px solid var(--ifm-color-emphasis-300); border-radius: 8px; padding: 10px 20px; font-size: 13px; }
    .lq-score-item span { font-weight: 800; font-size: 20px; display: block; }
  `;
  document.head.appendChild(style);
}

// ============================================================
// CONSTANTES
// ============================================================
const LETTERS = ["A", "B", "C", "D"];

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ============================================================
// COMPOSANT PRINCIPAL
// Props :
//   questions  : array  — liste des questions (obligatoire)
//   title      : string — titre affiche dans la barre sticky
//   courseLink : string — lien vers le cours (ex: "/idosr/linux/lesson-01")
// ============================================================
export default function QuizEngine({ questions, title = "Quiz", courseLink }) {

  const [answers, setAnswers]     = useState({});
  const [revealed, setRevealed]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState(() => shuffle([...questions]));

  const vfQuestions  = shuffledQuestions.filter((q) => q.type === "vf");
  const qcmQuestions = shuffledQuestions.filter((q) => q.type === "qcm");

  const total    = shuffledQuestions.length;
  const answered = Object.keys(answers).length;

  const score = Object.entries(answers).filter(
    ([id, ans]) => shuffledQuestions.find((q) => q.id === parseInt(id))?.correct === ans
  ).length;

  const scoreVf = submitted
    ? Object.entries(answers).filter(([id, ans]) => {
        const q = shuffledQuestions.find((q) => q.id === parseInt(id));
        return q?.type === "vf" && q.correct === ans;
      }).length
    : 0;

  const scoreQcm = submitted
    ? Object.entries(answers).filter(([id, ans]) => {
        const q = shuffledQuestions.find((q) => q.id === parseInt(id));
        return q?.type === "qcm" && q.correct === ans;
      }).length
    : 0;

  const pct = submitted
    ? Math.round((score / total) * 100)
    : Math.round((answered / total) * 100);

  const accentColor = !submitted
    ? "#1a3c8f"
    : score / total >= 0.8
    ? "#16a34a"
    : score / total >= 0.5
    ? "#d97706"
    : "#dc2626";

  const scoreLabel = !submitted
    ? answered + "/" + total + " repondues"
    : score / total >= 0.8
    ? "Excellent !"
    : score / total >= 0.5
    ? "Bien !"
    : "A reviser";

  const handleSelect = (qId, idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleReveal = (qId) =>
    setRevealed((prev) => ({ ...prev, [qId]: !prev[qId] }));

  const handleSubmit = () => {
    if (answered < total) return;
    setSubmitted(true);
    const all = {};
    shuffledQuestions.forEach((q) => { all[q.id] = true; });
    setRevealed(all);
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
    setShuffledQuestions(shuffle([...questions]));
  };

  const renderQuestion = (q, qi) => {
    const userAnswer = answers[q.id];
    const isCorrect  = userAnswer === q.correct;
    const isRevealed = revealed[q.id];
    const cardClass  = "lq-card" + (submitted ? (isCorrect ? " correct" : " wrong") : "");
    const qnumClass  = "lq-qnum"  + (submitted ? (isCorrect ? " correct" : " wrong") : "");

    return (
      <div key={q.id} className={cardClass}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "flex-start" }}>
          <span className={qnumClass}>Q{qi + 1}</span>
          <span className="lq-qtext">{q.question}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 4 }}>
          {q.options.map((opt, idx) => {
            const isSelected = userAnswer === idx;
            const isRight    = idx === q.correct;
            let optClass = "lq-option";
            if (submitted) {
              optClass += " submitted";
              if (isRight) optClass += " opt-correct";
              else if (isSelected) optClass += " opt-wrong";
            } else if (isSelected) {
              optClass += " selected";
            }
            return (
              <div key={idx} className={optClass} onClick={() => handleSelect(q.id, idx)}>
                <div className="lq-radio"><div className="lq-radio-dot" /></div>
                <span className="lq-letter">{LETTERS[idx]}.</span>
                <span className="lq-opttext">{opt}</span>
                {submitted && isRight     && <span style={{ marginLeft: "auto", color: "#16a34a", fontWeight: 700 }}>✓</span>}
                {submitted && isSelected && !isRight && <span style={{ marginLeft: "auto", color: "#dc2626", fontWeight: 700 }}>✗</span>}
              </div>
            );
          })}
        </div>

        <div>
          {!submitted && (
            <button className="lq-btn-hint" onClick={() => handleReveal(q.id)}>
              {isRevealed ? "Masquer" : "Voir l'explication"}
            </button>
          )}
          {isRevealed && (
            <div className="lq-explain">
              <span className="lq-explain-label">Reponse : </span>
              <span className="lq-explain-ans">{LETTERS[q.correct]}</span>
              <br />
              <span>{q.explanation}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="lq-wrap" style={{ "--lq-accent": accentColor }}>

      {/* BARRE STICKY */}
      <div className="lq-sticky">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="lq-sticky-title">{title}</span>
          <span className="lq-badge">{scoreLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="lq-progress-track">
            <div className="lq-progress-bar" style={{ width: pct + "%" }} />
          </div>
          <span className="lq-score-num">
            {submitted ? score + "/" + total : answered + "/" + total}
          </span>
          {submitted ? (
            <button className="lq-btn-outline" onClick={handleReset}>Recommencer</button>
          ) : (
            <button
              className="lq-btn-validate"
              onClick={handleSubmit}
              disabled={answered < total}
              style={{
                background: answered === total ? accentColor : undefined,
                color:      answered === total ? "#fff"        : undefined,
              }}
            >
              Valider
            </button>
          )}
        </div>
      </div>

      {/* SECTION VRAI / FAUX */}
      {vfQuestions.length > 0 && (
        <>
          <div className="lq-section-title">Section 1 — Vrai / Faux</div>
          {vfQuestions.map((q, i) => renderQuestion(q, i))}
        </>
      )}

      {/* SECTION QCM */}
      {qcmQuestions.length > 0 && (
        <>
          <div className="lq-section-title">
            {vfQuestions.length > 0 ? "Section 2 — QCM" : "Section 1 — QCM"} (Questions a Choix Multiple)
          </div>
          {qcmQuestions.map((q, i) => renderQuestion(q, vfQuestions.length + i))}
        </>
      )}

      {/* BOUTON VALIDER */}
      {!submitted && (
        <button
          className="lq-btn-submit"
          onClick={handleSubmit}
          disabled={answered < total}
          style={{
            background: answered === total ? accentColor : undefined,
            color:      answered === total ? "#fff"        : undefined,
          }}
        >
          {answered < total
            ? "Repondre a toutes les questions (" + answered + "/" + total + ")"
            : "Valider le quiz"}
        </button>
      )}

      {/* ECRAN FINAL */}
      {submitted && (
        <div className="lq-final">
          <div className="lq-final-score" style={{ color: accentColor }}>{score}/{total}</div>
          <div className="lq-final-label">{scoreLabel}</div>
          <div className="lq-score-grid">
            {vfQuestions.length > 0 && (
              <div className="lq-score-item">
                <span style={{ color: "#d97706" }}>{scoreVf}/{vfQuestions.length}</span>
                Vrai / Faux
              </div>
            )}
            {qcmQuestions.length > 0 && (
              <div className="lq-score-item">
                <span style={{ color: "#1a3c8f" }}>{scoreQcm}/{qcmQuestions.length}</span>
                QCM
              </div>
            )}
          </div>
          <div className="lq-final-msg">
            {score / total >= 0.8
              ? "Excellent ! Vous maitrisez ce sujet."
              : score / total >= 0.5
              ? "Bien ! Relisez les sections ou vous avez fait des erreurs."
              : "Recommencez apres avoir relu le cours."}
          </div>
          {courseLink && (
            <a href={courseLink} style={{ display: "inline-block", marginBottom: 16, fontSize: 13, color: "#1a3c8f" }}>
              Retourner au cours →
            </a>
          )}
          <br />
          <button className="lq-btn-reset" onClick={handleReset}>Recommencer</button>
        </div>
      )}
    </div>
  );
}