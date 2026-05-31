import { Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/index.css';
import HeroVideoLoop from '../components/HeroVideoLoop';

export default function Index() {
  const { t } = useTranslation();
  const heroRef = useRef(null);

  // Scroll reveal
  useEffect(() => {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('vis'), i * 80);
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  // KPI counter animation
  useEffect(() => {
    function animCount(el) {
      const target = +el.dataset.count;
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      const dur = 1600;
      const s = performance.now();
      if (isNaN(target)) return;
      function step(n) {
        const p = Math.min((n - s) / dur, 1);
        const e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(target * e).toLocaleString() + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    const ko = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) {
          animCount(e.target);
          const b = e.target.closest('.kpi-item')?.querySelector('.kpi-bfill');
          if (b) setTimeout(() => b.style.width = b.dataset.w + '%', 200);
          ko.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.kpi-val[data-count]').forEach(el => ko.observe(el));
    return () => ko.disconnect();
  }, []);

  // Typewriter hero headline
  useEffect(() => {
    const h1 = heroRef.current;
    if (!h1) return;
    let cancelled = false;

    const prefixDef = [
      ['72小时内', false], ['\n', false], ['精准解锁', true], ['\n', false], ['企业', false]
    ];
    const words = ['真实价值', 'Real Value'];
    const prefix = [];
    prefixDef.forEach(([str, acc]) => [...str].forEach(c => prefix.push({ c, acc })));
    let wordIdx = 0;
    let typed = [];

    function buildHTML() {
      let html = '', inAcc = false;
      typed.forEach(({ c, acc }) => {
        if (c === '\n') { if (inAcc) { html += '</span>'; inAcc = false; } html += '<br>'; return; }
        if (acc && !inAcc) { html += '<span class="accent">'; inAcc = true; }
        if (!acc && inAcc) { html += '</span>'; inAcc = false; }
        html += c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c;
      });
      if (inAcc) html += '</span>';
      html += '<span class="type-cursor">|</span>';
      return html;
    }

    let timer;
    function typePrefix() {
      if (cancelled) return;
      if (typed.length >= prefix.length) { timer = setTimeout(typeWord, 380); return; }
      typed.push(prefix[typed.length]);
      h1.innerHTML = buildHTML();
      timer = setTimeout(typePrefix, typed[typed.length - 1].c === '\n' ? 140 : 65);
    }
    function typeWord() {
      if (cancelled) return;
      document.dispatchEvent(new CustomEvent('rvc:wordstart'));
      const chars = [...words[wordIdx]].map(c => ({ c, acc: true }));
      let ci = 0;
      (function tick() {
        if (cancelled) return;
        if (ci >= chars.length) { timer = setTimeout(deleteWord, 1900); return; }
        typed.push(chars[ci++]);
        h1.innerHTML = buildHTML();
        timer = setTimeout(tick, 85);
      })();
    }
    function deleteWord() {
      if (cancelled) return;
      if (typed.length <= prefix.length) {
        wordIdx = (wordIdx + 1) % words.length;
        timer = setTimeout(typeWord, 340);
        return;
      }
      typed.pop();
      h1.innerHTML = buildHTML();
      timer = setTimeout(deleteWord, 46);
    }

    h1.innerHTML = '<span class="type-cursor">|</span>';
    timer = setTimeout(typePrefix, 320);
    return () => { cancelled = true; clearTimeout(timer); };
  }, []);

  // SVG engine counter
  useEffect(() => {
    function ease(p) { return 1 - Math.pow(1 - p, 4); }
    const counters = [
      { id: 'n1', from: 38, to: 91, dur: 1400, fmt: v => Math.round(v) },
      { id: 'n2', from: 7.2, to: 9.6, dur: 1400, fmt: v => v.toFixed(1) },
      { id: 'n3', from: 0, to: 58, dur: 1400, fmt: v => Math.round(v) },
      { id: 'n4', from: 0, to: 34, dur: 1400, fmt: v => Math.round(v) },
      { id: 'svgScore', from: 0, to: 68, dur: 1600, fmt: v => Math.round(v) },
    ];
    counters.forEach(c => {
      const el = document.getElementById(c.id);
      if (el) el.textContent = c.fmt(c.from);
    });
    function runOne(c) {
      const el = document.getElementById(c.id);
      if (!el) return;
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min((now - t0) / c.dur, 1);
        const v = c.from + (c.to - c.from) * ease(p);
        el.textContent = c.fmt(v);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }
    function runAll() { counters.forEach(runOne); }
    document.addEventListener('rvc:wordstart', runAll);
    return () => document.removeEventListener('rvc:wordstart', runAll);
  }, []);

  return (
    <div className="page">
      <section className="hero">
        <HeroVideoLoop />
        <div className="wrap">
          <div className="hero-grid">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot"></span>{t('index.eyebrow')}</div>
              <h1 className="hero-h" ref={heroRef}></h1>
              <p className="hero-p">{t('index.heroParagraph')}</p>
              <div className="hero-btns">
                <Link to="/intake" className="btn-blue">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                  {t('index.heroBtn')}
                </Link>
                <Link to="/report" className="btn-outline">{t('index.heroBtn2')}</Link>
              </div>
              <div className="hero-trust">
                <div className="trust-item"><span className="trust-dot"></span>{t('index.trust1')}</div>
                <div className="trust-item"><span className="trust-dot"></span>{t('index.trust2')}</div>
                <div className="trust-item"><span className="trust-dot"></span>{t('index.trust3')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="engine-section">
        <div className="wrap">
            <div className="engine-wrap">
              <div className="engine-card">
                <svg viewBox="0 0 670 520" width="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2b62e3" stopOpacity="0.30"/><stop offset="100%" stopColor="#2b62e3" stopOpacity="0"/>
                    </radialGradient>
                    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="2.5" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="gs" x="-5%" y="-5%" width="110%" height="110%">
                      <feGaussianBlur stdDeviation="1.5" result="blur"/>
                      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="cardShadow" x="-5%" y="-5%" width="120%" height="130%">
                      <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="rgba(0,0,0,0.45)"/>
                    </filter>
                    <linearGradient id="lightGlass" x1="0%" y1="0%" x2="60%" y2="100%">
                      <stop offset="0%" stopColor="#151a24"/><stop offset="100%" stopColor="#0f1219"/>
                    </linearGradient>
                    <linearGradient id="glassShimmer" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(43,98,227,0.18)"/>
                      <stop offset="38%" stopColor="rgba(43,98,227,0.06)"/>
                      <stop offset="100%" stopColor="rgba(43,98,227,0.01)"/>
                    </linearGradient>
                  </defs>
                  {/* Background */}
                  <rect width="670" height="520" fill="#0b0d12" rx="18"/>
                  <g stroke="rgba(139,149,171,0.07)" strokeWidth="1">
                    <line x1="140" y1="0" x2="140" y2="520"/><line x1="206" y1="0" x2="206" y2="520"/>
                    <line x1="354" y1="0" x2="354" y2="520"/><line x1="462" y1="0" x2="462" y2="520"/>
                  </g>

                  {/* I1: 战略规划 */}
                  <rect x="14" y="50" width="126" height="64" rx="13" fill="#0f1219" stroke="rgba(43,98,227,0.20)" strokeWidth="1" filter="url(#cardShadow)"/>
                  <rect x="14" y="50" width="3.5" height="64" rx="2" fill="#2b62e3"/>
                  <line x1="17.5" y1="50" x2="140" y2="50" stroke="rgba(43,98,227,0.18)" strokeWidth="1"/>
                  <g transform="translate(24,62)" fill="none" stroke="#2b62e3" strokeWidth="1.35" strokeLinecap="round">
                    <line x1="0" y1="12" x2="0" y2="7"/><line x1="4" y1="12" x2="4" y2="3"/>
                    <line x1="8" y1="12" x2="8" y2="9"/><line x1="12" y1="12" x2="12" y2="1"/>
                  </g>
                  <text x="42" y="73" fill="#e8edf5" fontSize="11.2" fontWeight="800" fontFamily="'IBM Plex Sans',sans-serif" className="svg-title">战略规划</text>
                  <text x="42" y="88" fill="#5b667d" fontSize="8" fontFamily="'IBM Plex Sans',sans-serif" className="svg-subtle">Strategy &amp; Growth</text>
                  <text x="42" y="105" fill="#5b667d" fontSize="7" fontFamily="'IBM Plex Sans',sans-serif">186+ 行业基准对标</text>

                  {/* I2: 财务质量 */}
                  <rect x="14" y="162" width="126" height="64" rx="13" fill="#0f1219" stroke="rgba(91,138,238,0.20)" strokeWidth="1" filter="url(#cardShadow)"/>
                  <rect x="14" y="162" width="3.5" height="64" rx="2" fill="#5b8aee"/>
                  <line x1="17.5" y1="162" x2="140" y2="162" stroke="rgba(43,98,227,0.18)" strokeWidth="1"/>
                  <g transform="translate(24,174)" fill="none" stroke="#5b8aee" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="0,6 3,6 5,1 7,11 9,4 11,6 13,6"/>
                  </g>
                  <text x="42" y="185" fill="#e8edf5" fontSize="11.2" fontWeight="800" fontFamily="'IBM Plex Sans',sans-serif" className="svg-title">财务质量</text>
                  <text x="42" y="200" fill="#5b667d" fontSize="8" fontFamily="'IBM Plex Sans',sans-serif" className="svg-subtle">Financial Health</text>
                  <text x="42" y="217" fill="#5b667d" fontSize="7" fontFamily="'IBM Plex Sans',sans-serif">EBITDA · 盈利能力</text>

                  {/* I3: 运营卓越 */}
                  <rect x="14" y="274" width="126" height="64" rx="13" fill="#0f1219" stroke="rgba(43,98,227,0.20)" strokeWidth="1" filter="url(#cardShadow)"/>
                  <rect x="14" y="274" width="3.5" height="64" rx="2" fill="#2b62e3"/>
                  <line x1="17.5" y1="274" x2="140" y2="274" stroke="rgba(43,98,227,0.18)" strokeWidth="1"/>
                  <g transform="translate(24,286)" fill="none" stroke="#2b62e3" strokeWidth="1.35" strokeLinecap="round">
                    <circle cx="6" cy="6" r="5"/><circle cx="6" cy="6" r="2" fill="#2b62e3" stroke="none"/>
                    <line x1="6" y1="0" x2="6" y2="-1.5"/><line x1="6" y1="12" x2="6" y2="13.5"/>
                    <line x1="12" y1="6" x2="13.5" y2="6"/><line x1="0" y1="6" x2="-1.5" y2="6"/>
                  </g>
                  <text x="42" y="297" fill="#e8edf5" fontSize="11.2" fontWeight="800" fontFamily="'IBM Plex Sans',sans-serif" className="svg-title">运营卓越</text>
                  <text x="42" y="312" fill="#5b667d" fontSize="8" fontFamily="'IBM Plex Sans',sans-serif" className="svg-subtle">Operational Excellence</text>
                  <text x="42" y="329" fill="#5b667d" fontSize="7" fontFamily="'IBM Plex Sans',sans-serif">效率 · 流程 · 人才</text>

                  {/* I4: 公司治理 */}
                  <rect x="14" y="386" width="126" height="64" rx="13" fill="#0f1219" stroke="rgba(91,138,238,0.20)" strokeWidth="1" filter="url(#cardShadow)"/>
                  <rect x="14" y="386" width="3.5" height="64" rx="2" fill="#5b8aee"/>
                  <line x1="17.5" y1="386" x2="140" y2="386" stroke="rgba(43,98,227,0.18)" strokeWidth="1"/>
                  <g transform="translate(24,398)" fill="none" stroke="#5b8aee" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6,0 L12,2.5 L12,6 C12,9.5 9.5,11.5 6,13 C2.5,11.5 0,9.5 0,6 L0,2.5 Z"/>
                    <polyline points="3.5,6.5 5.5,8.5 9,4"/>
                  </g>
                  <text x="42" y="409" fill="#e8edf5" fontSize="11.2" fontWeight="800" fontFamily="'IBM Plex Sans',sans-serif" className="svg-title">公司治理</text>
                  <text x="42" y="424" fill="#5b667d" fontSize="8" fontFamily="'IBM Plex Sans',sans-serif" className="svg-subtle">Governance &amp; Compliance</text>
                  <text x="42" y="441" fill="#5b667d" fontSize="7" fontFamily="'IBM Plex Sans',sans-serif">合规 · 风控 · 信息披露</text>

                  {/* Score glass card */}
                  <rect x="220" y="132" width="120" height="44" rx="11" fill="#0f1219" stroke="rgba(43,98,227,0.20)" strokeWidth="1" filter="url(#gs)"/>
                  <line x1="238" y1="132" x2="322" y2="132" stroke="rgba(43,98,227,0.22)" strokeWidth="1"/>
                  <text x="280" y="149" textAnchor="middle" fill="#5b667d" fontSize="7.2" fontWeight="600" fontFamily="'IBM Plex Sans',sans-serif" letterSpacing=".1em">综合诊断评分</text>
                  <text x="265" y="171" textAnchor="middle" fill="#2b62e3" fontSize="26" fontWeight="800" fontFamily="'IBM Plex Mono',monospace" className="svg-num" id="svgScore">68</text>
                  <text x="290" y="169" fill="#5b667d" fontSize="8" fontFamily="'IBM Plex Mono',monospace" className="svg-unit">/100</text>

                  {/* Light glass orbital card */}
                  <rect x="206" y="182" width="148" height="158" rx="18" fill="url(#lightGlass)" stroke="rgba(43,98,227,0.22)" strokeWidth="1.2"/>
                  <rect x="206" y="182" width="148" height="158" rx="18" fill="url(#glassShimmer)" pointerEvents="none"/>
                  <line x1="226" y1="183.5" x2="334" y2="183.5" stroke="rgba(43,98,227,0.28)" strokeWidth="1.5"/>
                  <circle cx="280" cy="261" r="64" fill="url(#coreGlow)" opacity="0.40"/>
                  <circle cx="280" cy="261" r="56" fill="none" stroke="rgba(43,98,227,0.30)" strokeWidth="1" strokeDasharray="3 5">
                    <animateTransform attributeName="transform" type="rotate" from="360 280 261" to="0 280 261" dur="30s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="280" cy="261" r="40" fill="none" stroke="rgba(43,98,227,0.22)" strokeWidth="1" strokeDasharray="2 4">
                    <animateTransform attributeName="transform" type="rotate" from="0 280 261" to="360 280 261" dur="18s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="280" cy="261" r="24" fill="none" stroke="rgba(43,98,227,0.18)" strokeWidth="1" strokeDasharray="2 3">
                    <animateTransform attributeName="transform" type="rotate" from="0 280 261" to="360 280 261" dur="10s" repeatCount="indefinite"/>
                  </circle>
                  <g><animateTransform attributeName="transform" type="rotate" from="0 280 261" to="360 280 261" dur="14s" repeatCount="indefinite"/>
                    <circle cx="336" cy="261" r="5" fill="#2b62e3" filter="url(#glow)" opacity="0.82"/>
                    <circle cx="224" cy="261" r="3.5" fill="#5b8aee" opacity="0.68"/>
                  </g>
                  <g><animateTransform attributeName="transform" type="rotate" from="110 280 261" to="-250 280 261" dur="10s" repeatCount="indefinite"/>
                    <circle cx="320" cy="261" r="4" fill="#2b62e3" filter="url(#glow)" opacity="0.78"/>
                    <circle cx="240" cy="261" r="3" fill="#5b8aee" opacity="0.72"/>
                  </g>
                  <g><animateTransform attributeName="transform" type="rotate" from="55 280 261" to="415 280 261" dur="6s" repeatCount="indefinite"/>
                    <circle cx="304" cy="261" r="2.5" fill="#5b8aee" filter="url(#glow)" opacity="0.72"/>
                  </g>
                  <g><animateTransform attributeName="transform" type="rotate" from="0 280 261" to="360 280 261" dur="3.5s" repeatCount="indefinite"/>
                    <path d="M280,261 L336,261 A56,56 0 0,1 308,309.5 Z" fill="rgba(43,98,227,0.08)"/>
                    <line x1="280" y1="261" x2="336" y2="261" stroke="rgba(43,98,227,0.55)" strokeWidth="1.4" strokeLinecap="round"/>
                  </g>
                  <circle cx="280" cy="261" r="14" fill="rgba(43,98,227,0.18)" stroke="rgba(43,98,227,0.40)" strokeWidth="1.5"/>
                  <circle cx="280" cy="261" r="8" fill="#2b62e3">
                    <animate attributeName="r" values="8;10;8" dur="2.8s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="1;0.74;1" dur="2.8s" repeatCount="indefinite"/>
                  </circle>
                  <text x="280" y="206" textAnchor="middle" fill="rgba(43,98,227,0.55)" fontSize="6.8" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif" letterSpacing=".13em">AI ENGINE · RVC CORE</text>
                  <rect x="238" y="316" width="84" height="22" rx="7" fill="rgba(74,222,128,0.10)" stroke="rgba(74,222,128,0.25)" strokeWidth="1"/>
                  <circle cx="251" cy="327" r="3" fill="#4ade80"><animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite"/></circle>
                  <text x="259" y="331" fill="#4ade80" fontSize="8.2" fontWeight="700" fontFamily="'IBM Plex Sans',sans-serif">实时分析中</text>

                  {/* R1: IPO就绪度 */}
                  <rect x="462" y="30" width="194" height="98" rx="13" fill="#0f1219" stroke="rgba(43,98,227,0.20)" strokeWidth="1" filter="url(#cardShadow)"/>
                  <rect x="462" y="30" width="194" height="3" rx="1.5" fill="rgba(43,98,227,0.55)"/>
                  <line x1="480" y1="30" x2="638" y2="30" stroke="rgba(43,98,227,0.18)" strokeWidth="1"/>
                  <g transform="translate(468,41)" fill="none" stroke="#2b62e3" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="0,11 4,7 7,9 13,2"/><polyline points="9,2 13,2 13,6"/>
                  </g>
                  <text x="486" y="54" fill="#e8edf5" fontSize="11.5" fontWeight="800" fontFamily="'IBM Plex Sans',sans-serif" className="svg-title">IPO就绪度评分</text>
                  <text x="468" y="67" fill="#5b667d" fontSize="7.2" fontFamily="'IBM Plex Sans',sans-serif">基准 38分 →</text>
                  <text x="468" y="89" fill="#2b62e3" fontSize="28" fontWeight="800" fontFamily="'IBM Plex Mono',monospace" fontVariantNumeric="tabular-nums" className="svg-num" id="n1">91</text>
                  <text x="507" y="87" fill="#5b667d" fontSize="7.2" fontFamily="'IBM Plex Sans',sans-serif" className="svg-unit">分</text>
                  <rect x="504" y="74" width="42" height="14" rx="7" fill="rgba(74,222,128,0.12)"/>
                  <text x="525" y="84" textAnchor="middle" fill="#4ade80" fontSize="7.5" fontWeight="700" fontFamily="'IBM Plex Mono',monospace" className="svg-delta">▲ 53 pts</text>
                  <line x1="468" y1="92" x2="647" y2="92" stroke="rgba(139,149,171,0.10)" strokeWidth="1"/>
                  <text x="468" y="110" fill="#5b667d" fontSize="8.2" fontFamily="'IBM Plex Sans',sans-serif">上市审核周期压缩</text>
                  <text x="652" y="110" textAnchor="end" fill="#2b62e3" fontSize="8.8" fontWeight="700" fontFamily="'IBM Plex Mono',monospace" className="svg-delta">−6.2 月</text>

                  {/* R2: 并购估值倍数 */}
                  <rect x="462" y="144" width="194" height="98" rx="13" fill="#0f1219" stroke="rgba(91,138,238,0.20)" strokeWidth="1" filter="url(#cardShadow)"/>
                  <rect x="462" y="144" width="194" height="3" rx="1.5" fill="rgba(91,138,238,0.55)"/>
                  <line x1="480" y1="144" x2="638" y2="144" stroke="rgba(43,98,227,0.18)" strokeWidth="1"/>
                  <g transform="translate(468,155)" fill="none" stroke="#5b8aee" strokeWidth="1.35" strokeLinecap="round">
                    <path d="M0,4.5 C5,4.5 8,0 13,0"/><path d="M0,7.5 C5,7.5 8,12 13,12"/>
                    <polyline points="10,0 13,0 13,3.5"/><polyline points="10,12 13,12 13,8.5"/>
                  </g>
                  <text x="486" y="168" fill="#e8edf5" fontSize="11.5" fontWeight="800" fontFamily="'IBM Plex Sans',sans-serif" className="svg-title">并购估值倍数</text>
                  <text x="468" y="180" fill="#5b667d" fontSize="7.2" fontFamily="'IBM Plex Sans',sans-serif">7.2× →</text>
                  <text x="468" y="202" fill="#5b8aee" fontSize="28" fontWeight="800" fontFamily="'IBM Plex Mono',monospace" fontVariantNumeric="tabular-nums" className="svg-num" id="n2">9.6</text>
                  <text x="518" y="200" fill="#5b667d" fontSize="7.2" fontFamily="'IBM Plex Sans',sans-serif" className="svg-unit">× EV/EBITDA</text>
                  <line x1="468" y1="207" x2="647" y2="207" stroke="rgba(139,149,171,0.10)" strokeWidth="1"/>
                  <text x="468" y="225" fill="#5b667d" fontSize="8.2" fontFamily="'IBM Plex Sans',sans-serif">尽调周期压缩</text>
                  <text x="652" y="225" textAnchor="end" fill="#5b8aee" fontSize="8.8" fontWeight="700" fontFamily="'IBM Plex Mono',monospace" className="svg-delta">−38天 / −40%</text>

                  {/* R3: 投资人转化率 */}
                  <rect x="462" y="258" width="194" height="98" rx="13" fill="#0f1219" stroke="rgba(43,98,227,0.20)" strokeWidth="1" filter="url(#cardShadow)"/>
                  <rect x="462" y="258" width="194" height="3" rx="1.5" fill="rgba(43,98,227,0.55)"/>
                  <line x1="480" y1="258" x2="638" y2="258" stroke="rgba(43,98,227,0.18)" strokeWidth="1"/>
                  <g transform="translate(468,269)" fill="none" stroke="#2b62e3" strokeWidth="1.35" strokeLinecap="round">
                    <circle cx="4.5" cy="3.5" r="2.5"/><path d="M0,12 C0,9 9,9 9,12"/>
                    <circle cx="10.5" cy="3" r="2" strokeWidth="1.3" opacity="0.65"/>
                    <path d="M8,12 C8.5,10 14,10 14,12" strokeWidth="1.3" opacity="0.65"/>
                  </g>
                  <text x="486" y="282" fill="#e8edf5" fontSize="11.5" fontWeight="800" fontFamily="'IBM Plex Sans',sans-serif" className="svg-title">投资人转化率</text>
                  <text x="468" y="306" fill="#2b62e3" fontSize="29" fontWeight="800" fontFamily="'IBM Plex Mono',monospace" className="svg-num">+<tspan id="n3">58</tspan><tspan dx="1" fontSize="11" className="svg-unit">%</tspan></text>
                  <text x="468" y="320" fill="#5b667d" fontSize="7.8" fontFamily="'IBM Plex Sans',sans-serif">精准触达 → 意向确认</text>
                  <line x1="468" y1="330" x2="647" y2="330" stroke="rgba(139,149,171,0.10)" strokeWidth="1"/>
                  <text x="468" y="346" fill="#5b667d" fontSize="8.2" fontFamily="'IBM Plex Sans',sans-serif">融资效率倍增</text>
                  <text x="652" y="346" textAnchor="end" fill="#2b62e3" fontSize="8.8" fontWeight="700" fontFamily="'IBM Plex Mono',monospace" className="svg-delta">3.2× 提速</text>

                  {/* R4: 企业估值提升 */}
                  <rect x="462" y="372" width="194" height="98" rx="13" fill="#0f1219" stroke="rgba(91,138,238,0.20)" strokeWidth="1" filter="url(#cardShadow)"/>
                  <rect x="462" y="372" width="194" height="3" rx="1.5" fill="rgba(91,138,238,0.55)"/>
                  <line x1="480" y1="372" x2="638" y2="372" stroke="rgba(43,98,227,0.18)" strokeWidth="1"/>
                  <g transform="translate(468,383)" fill="none" stroke="#5b8aee" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="7,0 14,5 7,13 0,5"/><line x1="0" y1="5" x2="14" y2="5"/>
                  </g>
                  <text x="486" y="396" fill="#e8edf5" fontSize="11.5" fontWeight="800" fontFamily="'IBM Plex Sans',sans-serif" className="svg-title">企业估值提升</text>
                  <text x="468" y="420" fill="#5b8aee" fontSize="29" fontWeight="800" fontFamily="'IBM Plex Mono',monospace" className="svg-num">+<tspan id="n4">34</tspan><tspan dx="1" fontSize="11" className="svg-unit">%</tspan></text>
                  <text x="468" y="432" fill="#5b667d" fontSize="7.8" fontFamily="'IBM Plex Mono',monospace" className="svg-delta">$24.2M → $32.4M</text>
                  <line x1="468" y1="440" x2="647" y2="440" stroke="rgba(139,149,171,0.10)" strokeWidth="1"/>
                  <text x="468" y="457" fill="#5b667d" fontSize="8.2" fontFamily="'IBM Plex Sans',sans-serif">EBITDA 增量</text>
                  <text x="652" y="457" textAnchor="end" fill="#5b8aee" fontSize="8.8" fontWeight="700" fontFamily="'IBM Plex Mono',monospace" className="svg-delta">+$8.2M</text>

                  {/* Flow paths */}
                  <path id="p1" d="M 140,82 C 178,82 208,220 216,250" fill="none" stroke="rgba(43,98,227,0.18)" strokeWidth="1.35" strokeDasharray="4 5"/>
                  <path id="p2" d="M 140,194 C 188,194 214,234 218,252" fill="none" stroke="rgba(91,138,238,0.18)" strokeWidth="1.35" strokeDasharray="4 5"/>
                  <path id="p3" d="M 140,306 C 188,306 214,278 218,268" fill="none" stroke="rgba(43,98,227,0.18)" strokeWidth="1.35" strokeDasharray="4 5"/>
                  <path id="p4" d="M 140,418 C 178,418 210,302 218,272" fill="none" stroke="rgba(91,138,238,0.18)" strokeWidth="1.35" strokeDasharray="4 5"/>
                  <path id="p5" d="M 342,250 C 390,202 420,79 462,79" fill="none" stroke="rgba(43,98,227,0.18)" strokeWidth="1.35" strokeDasharray="4 5"/>
                  <path id="p6" d="M 342,252 C 392,240 420,193 462,193" fill="none" stroke="rgba(91,138,238,0.18)" strokeWidth="1.35" strokeDasharray="4 5"/>
                  <path id="p7" d="M 342,268 C 392,298 420,307 462,307" fill="none" stroke="rgba(43,98,227,0.18)" strokeWidth="1.35" strokeDasharray="4 5"/>
                  <path id="p8" d="M 342,272 C 390,372 420,421 462,421" fill="none" stroke="rgba(91,138,238,0.18)" strokeWidth="1.35" strokeDasharray="4 5"/>

                  {/* Animated dots */}
                  <circle r="4" fill="#2b62e3" filter="url(#glow)" opacity=".86"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#p1"/></animateMotion></circle>
                  <circle r="4" fill="#5b8aee" filter="url(#glow)" opacity=".82"><animateMotion dur="3.6s" repeatCount="indefinite" begin="0.8s"><mpath href="#p2"/></animateMotion></circle>
                  <circle r="4" fill="#2b62e3" filter="url(#glow)" opacity=".82"><animateMotion dur="3.2s" repeatCount="indefinite" begin="1.4s"><mpath href="#p3"/></animateMotion></circle>
                  <circle r="4" fill="#5b8aee" filter="url(#glow)" opacity=".80"><animateMotion dur="3.8s" repeatCount="indefinite" begin="0.4s"><mpath href="#p4"/></animateMotion></circle>
                  <circle r="4" fill="#2b62e3" filter="url(#glow)" opacity=".86"><animateMotion dur="3s" repeatCount="indefinite" begin="1.5s"><mpath href="#p5"/></animateMotion></circle>
                  <circle r="4" fill="#5b8aee" filter="url(#glow)" opacity=".82"><animateMotion dur="3.4s" repeatCount="indefinite" begin="0.3s"><mpath href="#p6"/></animateMotion></circle>
                  <circle r="4" fill="#2b62e3" filter="url(#glow)" opacity=".82"><animateMotion dur="3.6s" repeatCount="indefinite" begin="0.9s"><mpath href="#p7"/></animateMotion></circle>
                  <circle r="4" fill="#5b8aee" filter="url(#glow)" opacity=".80"><animateMotion dur="3.2s" repeatCount="indefinite" begin="2s"><mpath href="#p8"/></animateMotion></circle>
                </svg>
              </div>
            </div>
        </div>
      </section>

      <section className="process">
        <div className="wrap">
          <div className="proc-grid">
            <div className="proc-item reveal">
              <div className="proc-num">01 — 数据采集</div>
              <div className="proc-title">企业全维建档</div>
              <div className="proc-desc">结构化七步采集框架，覆盖300+数据节点，精准捕获价值驱动因子。</div>
            </div>
            <div className="proc-item reveal">
              <div className="proc-num">02 — AI 分析</div>
              <div className="proc-title">深度智能诊断</div>
              <div className="proc-desc">多模型AI引擎并行处理财务、运营与战略信号，揭示隐性价值漏洞与机会。</div>
            </div>
            <div className="proc-item reveal">
              <div className="proc-num">03 — 价值标定</div>
              <div className="proc-title">机构级基准对标</div>
              <div className="proc-desc">对标186+行业数据库，量化各维度差距，生成可信度超90%的估值区间。</div>
            </div>
            <div className="proc-item reveal">
              <div className="proc-num">04 — 路径执行</div>
              <div className="proc-title">资本路径落地</div>
              <div className="proc-desc">30/60/90/180天行动路线图，精准匹配320+机构顾问与专项执行模块。</div>
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="sec-ey">核心能力体系</div>
            <h2 className="sec-ttl">企业价值的六大支柱</h2>
            <p className="sec-sub">全方位诊断覆盖，精准识别每一个影响机构级价值实现的关键变量。</p>
          </div>
          <div className="bento">
            <div className="b-card wide accent reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">01</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
              <div className="svc-title">AI价值诊断引擎</div>
              <div className="svc-desc">自主研发的多模型协同系统，系统评估300+企业价值驱动因子，生成机构级诊断评分与深度子维度分析，对标186+行业纵向数据，输出精准估值参考与行动优先级。</div>
              <span className="svc-tag">核心引擎 · 300+ 维度</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">02</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
              <div className="svc-title">IPO就绪控制台</div>
              <div className="svc-desc">端到端IPO筹备管理，从合规差距分析到承销商遴选，系统化追踪每一个上市里程碑。</div>
              <span className="svc-tag">资本市场</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">03</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
              <div className="svc-title">财务健康审计</div>
              <div className="svc-desc">深度财务建模与盈利质量分析，识别EBITDA提升路径，重建投资人信心基础。</div>
              <span className="svc-tag">财务运营</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">04</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
              <div className="svc-title">并购价值优化</div>
              <div className="svc-desc">买方与卖方尽职调查加速，AI辅助生成价值桥接模型，量化协同效应，支撑交易决策。</div>
              <span className="svc-tag">并购交易</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">05</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
              <div className="svc-title">投资人精准匹配</div>
              <div className="svc-desc">基于价值画像的AI智能匹配，对接320+机构顾问、PE基金与战略投资方，缩短融资周期。</div>
              <span className="svc-tag">网络资源 · 320+ 顾问</span>
            </div>
            <div className="b-card reveal">
              <div className="b-card-glow"></div>
              <div className="svc-num">06</div>
              <div className="svc-ico"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
              <div className="svc-title">资本叙事构建</div>
              <div className="svc-desc">以诊断数据为基础，打造高说服力的投资人故事，覆盖商业计划书、CIM与路演材料全链路输出。</div>
              <span className="svc-tag">叙事策略</span>
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-strip">
        <div className="wrap">
          <div className="kpi-grid">
            <div className="kpi-item reveal">
              <div className="kpi-val" data-count="2486" data-suffix="+">0</div>
              <div className="kpi-lbl">服务企业总数</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="88"></div></div>
            </div>
            <div className="kpi-item reveal">
              <div className="kpi-val" data-count="186" data-suffix="+">0</div>
              <div className="kpi-lbl">覆盖行业纵深</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="72"></div></div>
            </div>
            <div className="kpi-item reveal">
              <div className="kpi-val" data-count="320" data-suffix="+">0</div>
              <div className="kpi-lbl">机构顾问网络</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="80"></div></div>
            </div>
            <div className="kpi-item reveal">
              <div className="kpi-val" data-count="68" data-suffix="%">0</div>
              <div className="kpi-lbl">客户成功率</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="68"></div></div>
            </div>
            <div className="kpi-item reveal">
              <div className="kpi-val" data-prefix="$" data-count="42" data-suffix="B+">0</div>
              <div className="kpi-lbl">累计解锁价值</div>
              <div className="kpi-bar"><div className="kpi-bfill" data-w="95"></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Cases / Success Wall */}
      <section className="success-wall">
        <div className="sw-head reveal">
          <div className="sw-title">品牌案例</div>
          <div className="sw-divider"></div>
        </div>

        {/* Row 1: IPO 成功上市 */}
        <div className="sw-row-label">成功上市 &nbsp;·&nbsp; NASDAQ / NYSE / A股</div>
        <div className="marquee-wrap">
          <div className="marquee-track go-left">
            {[0, 1].map(setIdx => (
              <Fragment key={setIdx}>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 108 32" xmlns="http://www.w3.org/2000/svg" height="32">
                      <text x="1" y="26" fontFamily="'Arial Black',Impact,sans-serif" fontSize="26" fontWeight="900" fill="#e8edf5" letterSpacing="-1">ARM</text>
                      <text x="60" y="26" fontFamily="'Arial Black',Impact,sans-serif" fontSize="26" fontWeight="900" fill="#2563EB" letterSpacing="-1">OGI</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">BTOC</span><span className="ipo-card-exch">NASDAQ</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 138 32" xmlns="http://www.w3.org/2000/svg" height="32">
                      <polygon points="16,4 24,4 28,11 24,18 16,18 12,11" fill="#D97706"/>
                      <text x="20" y="15" fontFamily="'Arial Black',sans-serif" fontSize="10" fill="#fff" textAnchor="middle" dominantBaseline="middle" fontWeight="900">M</text>
                      <text x="34" y="24" fontFamily="'Arial Black',Impact,sans-serif" fontSize="18" fontWeight="900" fill="#e8edf5">MASSIMO</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">MAMO</span><span className="ipo-card-exch">NYSE</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 128 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <polygon points="14,32 22,32 18,20" fill="#0284C7"/>
                      <polygon points="10,32 14,32 18,20" fill="#60A5FA" opacity="0.6"/>
                      <text x="28" y="27" fontFamily="'Arial Black',sans-serif" fontSize="22" fontWeight="900" fill="#e8edf5">BAIYA</text>
                      <line x1="28" y1="30" x2="118" y2="30" stroke="#2a3344" strokeWidth="0.8"/>
                      <text x="28" y="36" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#5b667d" letterSpacing="0.04em">Baiya International Group Inc.</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">BIYA</span><span className="ipo-card-exch">NASDAQ</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 148 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <text x="1" y="22" fontFamily="Georgia,'Times New Roman',serif" fontSize="22" fontStyle="italic" fontWeight="700" fill="#0369A1">Autozi.com</text>
                      <text x="2" y="34" fontFamily="'Arial',sans-serif" fontSize="13" fontWeight="700" fill="#F97316" fontStyle="italic">中驰车福</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">AZI</span><span className="ipo-card-exch">NYSE</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 168 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <rect x="0" y="4" width="28" height="28" rx="5" fill="#1E40AF"/>
                      <text x="14" y="22" fontFamily="'Arial Black',sans-serif" fontSize="17" fill="#fff" textAnchor="middle" dominantBaseline="middle" fontWeight="900">M</text>
                      <text x="36" y="18" fontFamily="'Arial Black',sans-serif" fontSize="14" fill="#e8edf5" fontWeight="900">MAISON</text>
                      <text x="36" y="32" fontFamily="Arial,sans-serif" fontSize="10" fill="#8b95ab" fontWeight="600" letterSpacing="0.12em">SOLUTIONS</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">MSS</span><span className="ipo-card-exch">NASDAQ</span></div>
                </div>
                <div className="ipo-card" style={{ minWidth: '200px' }}>
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 170 28" xmlns="http://www.w3.org/2000/svg" height="28">
                      <text x="0" y="22" fontFamily="'Arial Black',Impact,sans-serif" fontSize="20" fontWeight="900" fill="#e8edf5" letterSpacing="0.5">WHITEFIBER</text>
                      <text x="166" y="22" fontFamily="'Arial Black',sans-serif" fontSize="20" fill="#5b667d">_</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">WYFI</span><span className="ipo-card-exch">NYSE</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 172 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <rect x="0" y="8" width="11" height="11" rx="2" fill="#0D9488"/>
                      <rect x="13" y="2" width="11" height="11" rx="2" fill="#0D9488"/>
                      <rect x="13" y="15" width="11" height="11" rx="2" fill="#14B8A6" opacity="0.7"/>
                      <text x="30" y="16" fontFamily="Arial,sans-serif" fontSize="13" fill="#e8edf5" fontWeight="700">大健云仓</text>
                      <text x="30" y="28" fontFamily="Arial,sans-serif" fontSize="8.5" fill="#0D9488" fontWeight="600" letterSpacing="0.06em">GIGACLOUD TECHNOLOGY</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">GCT</span><span className="ipo-card-exch">NASDAQ</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 148 30" xmlns="http://www.w3.org/2000/svg" height="30">
                      <text x="0" y="24" fontFamily="'Arial Black',sans-serif" fontSize="24" fontWeight="900" fill="#DB2777">聚美优品</text>
                      <text x="100" y="22" fontFamily="Arial,sans-serif" fontSize="10" fill="#5b667d" fontWeight="500" letterSpacing="0.03em">JUMEI.COM</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">JMEI</span><span className="ipo-card-exch">NYSE</span></div>
                </div>
                <div className="ipo-card">
                  <div className="ipo-logo-area">
                    <svg viewBox="0 0 156 36" xmlns="http://www.w3.org/2000/svg" height="36">
                      <rect x="0" y="4" width="28" height="28" rx="5" fill="#DC2626"/>
                      <text x="14" y="14" fontFamily="'Arial Black',sans-serif" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="900">步长</text>
                      <text x="14" y="25" fontFamily="'Arial Black',sans-serif" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="900">制药</text>
                      <text x="36" y="20" fontFamily="'Arial Black',sans-serif" fontSize="16" fill="#e8edf5" fontWeight="900">Buchang</text>
                      <text x="36" y="32" fontFamily="Arial,sans-serif" fontSize="9" fill="#5b667d" letterSpacing="0.06em">BUCHANG PHARMA</text>
                    </svg>
                  </div>
                  <div className="ipo-card-meta"><span className="ipo-card-ticker">ZBT</span><span className="ipo-card-exch">A股</span></div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Row 2: 合作伙伴 */}
        <div className="sw-row-label" style={{ marginTop: '28px' }}>服务合作伙伴</div>
        <div className="marquee-wrap">
          <div className="marquee-track go-right">
            {[0, 1].map(setIdx => (
              <Fragment key={setIdx}>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 80 20" height="20" xmlns="http://www.w3.org/2000/svg"><polygon points="10,18 16,18 13,10" fill="#16A34A"/><text x="19" y="16" fontFamily="'Arial Black',sans-serif" fontSize="14" fontWeight="900" fill="#DC2626">新东方</text><text x="60" y="14" fontFamily="Arial,sans-serif" fontSize="8" fill="#5b667d">XDF.CN</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 120 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="'Arial Black',sans-serif" fontSize="13" fontWeight="900" fill="#2563EB">intelliFusion</text><text x="82" y="15" fontFamily="Arial,sans-serif" fontSize="9" fill="#5b667d"> 云天励飞</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 72 20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="8" fill="none" stroke="#2b62e3" strokeWidth="2"/><circle cx="10" cy="10" r="3" fill="#2b62e3"/><text x="22" y="15" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#e8edf5">格灵深瞳</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 100 20" height="20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="5" width="8" height="8" rx="1.5" fill="#0D9488"/><rect x="10" y="1" width="8" height="8" rx="1.5" fill="#0D9488"/><rect x="10" y="11" width="8" height="8" rx="1.5" fill="#14B8A6" opacity="0.7"/><text x="22" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="#e8edf5">拉卡拉</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 88 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" fontFamily="'Arial Black',sans-serif" fontSize="15" fontWeight="900" fill="#F97316">一起作业</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 68 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="'Arial',sans-serif" fontSize="13" fontWeight="700" fill="#1E40AF">BaTeLab</text><text x="60" y="12" fontFamily="serif" fontSize="11" fill="#3B82F6">β</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 96 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" fontFamily="'Arial Black',Impact,sans-serif" fontSize="15" fontWeight="900" fill="#1E3A8A" letterSpacing="0.5">CONTROLSYS</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 44 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="'Arial Black',sans-serif" fontSize="14" fontWeight="900" fill="#0369A1" letterSpacing="1">CFAR</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 68 20" height="20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="3" width="14" height="14" rx="2" fill="#5b667d"/><text x="7" y="13" fontFamily="'Arial Black',sans-serif" fontSize="8" fill="#0f1219" textAnchor="middle" fontWeight="900">M</text><text x="18" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="600" fill="#8b95ab">MICROOS</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 68 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#0F766E">全盛科技</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 42 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" fontFamily="'Arial Black',Impact,sans-serif" fontSize="18" fontWeight="900" fill="#16A34A">Nums</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 82 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="'Arial Black',sans-serif" fontSize="14" fontWeight="900" fill="#e8edf5">Vfine</text><text x="43" y="15" fontFamily="Arial,sans-serif" fontSize="11" fontWeight="600" fill="#8b95ab"> MUSIC</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 72 20" height="20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="#B45309">帕皮科技</text></svg></div>
                </div>
                <div className="partner-pill">
                  <div className="pp-logo"><svg viewBox="0 0 56 20" height="20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="#e8edf5"/><text x="10" y="14" fontFamily="Arial,sans-serif" fontSize="7" fill="#0f1219" textAnchor="middle" fontWeight="700">ETB</text><text x="24" y="15" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="#e8edf5">com</text></svg></div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: 'var(--bg)' }}>
        <div className="wrap">
          <div className="footer">
            <div className="footer-l">© 2026 RVC Capital Partners · 企业价值智能诊断平台</div>
            <div className="footer-r">{t('index.footerTagline')}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
