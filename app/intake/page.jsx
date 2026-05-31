'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// Static gradient and value arrays (no translation needed)
const AI_DIM_GRADS = [
  'linear-gradient(90deg,#0B6FFB,#23B7FF)',
  'linear-gradient(90deg,#0B6FFB,#23B7FF)',
  'linear-gradient(90deg,#F59E0B,#FBBF24)',
  'linear-gradient(90deg,#F59E0B,#FBBF24)',
  'linear-gradient(90deg,#0B6FFB,#23B7FF)',
  'linear-gradient(90deg,#0B6FFB,#23B7FF)',
];
const AI_DIM_VALS = [74, 70, 63, 58, 65, 71];

// Interactive tag list managed via React state.
function TagList({ options, value, onChange }) {
  return (
    <div className="tag-opts">
      {options.map(opt => (
        <div
          key={opt}
          className={value.includes(opt) ? 'tag-opt sel' : 'tag-opt'}
          onClick={() => onChange(
            value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]
          )}
        >{opt}</div>
      ))}
    </div>
  );
}

function RangeOpts({ options, value, onChange }) {
  return (
    <div className="range-opts">
      {options.map(opt => (
        <div
          key={opt}
          className={value === opt ? 'range-opt sel' : 'range-opt'}
          onClick={() => onChange(opt)}
        >{opt}</div>
      ))}
    </div>
  );
}

function ChkItem({ checked, onToggle, children }) {
  return (
    <div
      className={checked ? 'chk-item checked' : 'chk-item'}
      onClick={onToggle}
    >
      <div className="chk-box">
        <svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg>
      </div>
      <div className="chk-text">{children}</div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div className="slider-wrap">
      <div className="slider-label-row">
        <span className="slider-lbl">{label}</span>
        <span className="slider-val">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ '--pct': value + '%' }}
      />
    </div>
  );
}

export default function Intake() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(1);

  const STEP_META = t('intake.stepMeta', { returnObjects: true });
  const STEP_LABELS = t('intake.stepLabels', { returnObjects: true });
  const REMAINING = t('intake.remaining', { returnObjects: true });

  // Form state for the interactive pieces
  const [empRange, setEmpRange] = useState('21–50人');
  const [recRevRange, setRecRevRange] = useState('20–40%');
  const [finTags, setFinTags] = useState(['毛利率提升', '规模化边际成本']);
  const [opTags, setOpTags] = useState(['检测标准化程度', '售后服务体系']);
  const [stratTags, setStratTags] = useState(['AI检测技术专利', 'B端经销商网络积累', '数据积累与算法迭代']);
  const [stratChecks, setStratChecks] = useState([true, true, false, false]);
  const [compTags, setCompTags] = useState(['工商注册及资质齐全', '劳动合规', '税务合规']);
  const [govTags, setGovTags] = useState(['引入独立董事', '组建审计委员会', '完善内控体系']);
  const [techTags, setTechTags] = useState(['AI定价模型迭代', 'B端SaaS产品化', '移动端体验优化']);
  const [techChecks, setTechChecks] = useState([true, true, false]);
  const [capitalRoute, setCapitalRoute] = useState('美股IPO');
  const [investorTags, setInvestorTags] = useState(['战略型产业投资人', '专注新经济的PE/VC', '跨境资本（美元基金）']);
  const [riskChecks, setRiskChecks] = useState([true, false, true]);

  const [digSlider, setDigSlider] = useState(72);
  const [aiSlider, setAiSlider] = useState(68);
  const [dataSlider, setDataSlider] = useState(55);

  // Scroll reveal
  useEffect(() => {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('vis'), i * 80);
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    return () => ro.disconnect();
  }, []);

  const toggleStratCheck = (i) => setStratChecks(s => s.map((v, idx) => idx === i ? !v : v));
  const toggleTechCheck = (i) => setTechChecks(s => s.map((v, idx) => idx === i ? !v : v));
  const toggleRiskCheck = (i) => setRiskChecks(s => s.map((v, idx) => idx === i ? !v : v));

  const pct = Math.round(((activeStep + 1) / 7) * 100);

  const goToStep = useCallback((idx) => {
    if (idx < 0) return;
    if (idx > 6) {
      router.push('/report');
      return;
    }
    setActiveStep(idx);
  }, [router]);

  const stepNumLabel = (i) => {
    if (i < activeStep) return '✓';
    return String(i + 1);
  };
  const stepItemClass = (i) => {
    if (i < activeStep) return 'step-item done';
    if (i === activeStep) return 'step-item active';
    return 'step-item';
  };

  return (
    <div className="page light-theme">
      <div className="intake-page">
        <div className="intake-wrap">
          <div className="intake-top">
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--blue)', marginBottom: '5px' }}>
              {t('intake.eyebrow')}
            </div>
            <h1>{t('intake.title')}</h1>
            <p>{t('intake.subtitle')}</p>
          </div>

          <div className="intake-cols">
            {/* Step Nav */}
            <div className="step-nav">
              <div className="snav-title">{t('intake.stepNavTitle')}</div>
              {STEP_LABELS.map((lbl, i) => (
                <div
                  key={i}
                  className={stepItemClass(i)}
                  data-step={i}
                  onClick={() => goToStep(i)}
                >
                  <div className="step-num">{stepNumLabel(i)}</div>
                  <div className="step-lbl">{lbl}</div>
                </div>
              ))}
              <div className="sn-prog">
                <div className="sn-prog-row"><span>{t('intake.progress')}</span><span>{pct}%</span></div>
                <div className="pbar"><div className="pfill" style={{ width: pct + '%' }} /></div>
              </div>
            </div>

            {/* Form Panel */}
            <div className="form-panel">
              <div className="form-head">
                <div>
                  <div className="fh-step">{STEP_META[activeStep].label}</div>
                  <div className="fh-title">{STEP_META[activeStep].title}</div>
                  <div className="fh-desc">{STEP_META[activeStep].desc}</div>
                </div>
                <div className="fh-save">{t('intake.autosave')}</div>
              </div>

              {/* STEP 1: Company Overview */}
              <div className={activeStep === 0 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">{t('intake.secBasicInfo')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldName')}</label><input type="text" defaultValue="UC Auto（优车汇）" /></div>
                  <div className="fld"><label>{t('intake.fldFoundedYear')}</label><input type="text" defaultValue="2018年" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldBusiness')}</label><input type="text" defaultValue="二手车交易平台" /></div>
                  <div className="fld"><label>{t('intake.fldBizModel')}</label>
                    <select defaultValue="B2B / B2C">
                      <option>{t('intake.optB2B')}</option><option>{t('intake.optB2BB2C')}</option><option>{t('intake.optB2C')}</option><option>{t('intake.optSaaS')}</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldHeadcount')}</label>
                    <RangeOpts options={t('intake.headOpts', { returnObjects: true })} value={empRange} onChange={setEmpRange} />
                  </div>
                  <div className="fld"><label>{t('intake.fldRegistration')}</label><input type="text" defaultValue="中国 · 上海" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secGrowthStage')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldFundingRound')}</label>
                    <select defaultValue="A轮">
                      {(t('intake.fundingOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fld"><label>{t('intake.fldMarketRegion')}</label>
                    <select defaultValue="全国（线上+线下）">
                      {(t('intake.regionOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldCompetitiveEdge')}</label>
                    <textarea defaultValue="专注二手车B端批发与C端零售的数字化撮合平台，依托自主开发的车辆评估AI系统，实现检测报告24小时内交付，交易效率较传统模式提升60%。" />
                  </div>
                </div>
              </div>

              {/* STEP 2: Financial Data */}
              <div className={activeStep === 1 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">{t('intake.secRevGrowth')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldRevenue')}</label><input type="text" defaultValue="$50,000,000" /></div>
                  <div className="fld"><label>{t('intake.fldYoY')}</label><input type="text" defaultValue="38%" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldCAGR')}</label><input type="text" defaultValue="31%" /></div>
                  <div className="fld"><label>{t('intake.fldForecastRev')}</label><input type="text" defaultValue="$68,000,000" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secProfitability')}</div>
                <div className="form-row three">
                  <div className="fld"><label>{t('intake.fldEbitdaMargin')}</label><input type="text" defaultValue="14%" /></div>
                  <div className="fld"><label>{t('intake.fldGrossMargin')}</label><input type="text" defaultValue="22%" /></div>
                  <div className="fld"><label>{t('intake.fldNetMargin')}</label><input type="text" defaultValue="7%" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldEbitdaAmount')}</label><input type="text" defaultValue="$7,000,000" /></div>
                  <div className="fld"><label>{t('intake.fldCashBurn')}</label><input type="text" placeholder={t('intake.phCashBurn')} defaultValue="N/A" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secRevStructure')}</div>
                <div className="fld" style={{ marginBottom: '14px' }}>
                  <label>{t('intake.fldRecRev')}</label>
                  <RangeOpts options={['0–20%', '20–40%', '40–60%', '60%+']} value={recRevRange} onChange={setRecRevRange} />
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldTopCustomer')}</label><input type="text" defaultValue="约28%" /><span className="hint">{t('intake.hintCustomerConc')}</span></div>
                  <div className="fld"><label>{t('intake.fldRevDistribution')}</label>
                    <select defaultValue="主要境内（90%+）">
                      {(t('intake.revDistOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secCapStructure')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldDebt')}</label><input type="text" defaultValue="$5,000,000" /></div>
                  <div className="fld"><label>{t('intake.fldCash')}</label><input type="text" defaultValue="$12,000,000" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldLastValuation')}</label><input type="text" defaultValue="A轮 · 估值 $1.2亿美元" /></div>
                  <div className="fld"><label>{t('intake.fldTotalRaised')}</label><input type="text" defaultValue="$1,800万美元" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldFinTags')}</label>
                    <TagList
                      options={t('intake.finTagOpts', { returnObjects: true })}
                      value={finTags}
                      onChange={setFinTags}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: Operations */}
              <div className={activeStep === 2 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">{t('intake.secCoreOps')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldMonthlyActiveUsers')}</label><input type="text" defaultValue="约1,200家B端经销商" /></div>
                  <div className="fld"><label>{t('intake.fldMonthlyVolume')}</label><input type="text" defaultValue="约3,800辆/月" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldAvgOrderValue')}</label><input type="text" defaultValue="B端约$13,000 / C端约$9,500" /></div>
                  <div className="fld"><label>{t('intake.fldRepurchaseCycle')}</label><input type="text" defaultValue="B端平均18天复购一次" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secFlowEff')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldDetectionCycle')}</label><input type="text" defaultValue="平均22小时" /></div>
                  <div className="fld"><label>{t('intake.fldTxnCycle')}</label><input type="text" defaultValue="B端3.2天 / C端5.8天" /></div>
                </div>
                <div className="fld" style={{ marginBottom: '14px' }}>
                  <label>{t('intake.fldDigitization')}</label>
                  <Slider label={t('intake.sliderDigitLabel')} value={digSlider} onChange={setDigSlider} />
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secSupplyChain')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldSupplierCount')}</label><input type="text" defaultValue="约240家认证经销商" /></div>
                  <div className="fld"><label>{t('intake.fldInventoryTurnover')}</label><input type="text" defaultValue="28天" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldOpTags')}</label>
                    <TagList
                      options={t('intake.opTagOpts', { returnObjects: true })}
                      value={opTags}
                      onChange={setOpTags}
                    />
                  </div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldOpNotes')}</label>
                    <textarea
                      placeholder={t('intake.phOpNotes')}
                      defaultValue="平台正在推进标准化服务包，计划Q3上线B端SaaS管理模块，进一步提升运营效率与可复制性。"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 4: Strategic Analysis */}
              <div className={activeStep === 3 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">{t('intake.secMarketPos')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldTAM')}</label><input type="text" defaultValue="中国二手车市场约$1,800亿/年" /></div>
                  <div className="fld"><label>{t('intake.fldMarketPenetration')}</label><input type="text" defaultValue="约0.03%（巨大增长空间）" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldStratTags')}</label>
                    <TagList
                      options={t('intake.stratTagOpts', { returnObjects: true })}
                      value={stratTags}
                      onChange={setStratTags}
                    />
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secGrowthStrat')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldGrowthEngine')}</label>
                    <select defaultValue="产品线延伸（B端SaaS化）">
                      {(t('intake.growthEngOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fld"><label>{t('intake.fldCategoryExpansion')}</label><input type="text" defaultValue="延伸至车后市场（维保、保险、金融）" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldCompetitors')}</label>
                    <textarea defaultValue="主要竞争对手：优信、瓜子、大搜车。差异化：聚焦B端批发市场，AI辅助定价+24H检测报告，交易撮合效率显著高于行业均值，同时向C端渗透构建双侧网络效应。" />
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secStratMaturity')}</div>
                <div className="chk-list">
                  {(t('intake.stratChecks', { returnObjects: true })).map((txt, i) => (
                    <ChkItem key={i} checked={stratChecks[i]} onToggle={() => toggleStratCheck(i)}>{txt}</ChkItem>
                  ))}
                </div>
              </div>

              {/* STEP 5: Governance & Compliance */}
              <div className={activeStep === 4 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">{t('intake.secBoardStruct')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldBoardSize')}</label><input type="text" defaultValue="5人" /></div>
                  <div className="fld"><label>{t('intake.fldIndepDirectors')}</label><input type="text" defaultValue="1人（需补充至3人）" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldAuditCommStatus')}</label>
                    <select defaultValue="尚未组建">
                      {(t('intake.auditCommOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fld"><label>{t('intake.fldCFO')}</label>
                    <select defaultValue="内部兼职CFO">
                      {(t('intake.cfoOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secAuditComp')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldCurrentAuditor')}</label>
                    <select defaultValue="国内中小所">
                      {(t('intake.auditorOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fld"><label>{t('intake.fldAuditedYears')}</label><input type="text" defaultValue="2023、2024年（非Big4）" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldCompTags')}</label>
                    <TagList
                      options={t('intake.compTagOpts', { returnObjects: true })}
                      value={compTags}
                      onChange={setCompTags}
                    />
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secEquityStruct')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldFounderStake')}</label><input type="text" defaultValue="创始人合计持股约62%" /></div>
                  <div className="fld"><label>{t('intake.fldEquityDispute')}</label>
                    <select defaultValue="否">
                      {(t('intake.equityDisputeOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldGovTags')}</label>
                    <TagList
                      options={t('intake.govTagOpts', { returnObjects: true })}
                      value={govTags}
                      onChange={setGovTags}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 6: Technology Capabilities */}
              <div className={activeStep === 5 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">{t('intake.secTechAssets')}</div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldCoreSystems')}</label><input type="text" defaultValue="AI检测评估引擎、交易撮合系统、ERP" /></div>
                  <div className="fld"><label>{t('intake.fldTechTeamSize')}</label><input type="text" defaultValue="约12人（含算法、产品、工程）" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldIP')}</label><input type="text" defaultValue="3项发明专利 + 8项软件著作权" /></div>
                  <div className="fld"><label>{t('intake.fldDataAssets')}</label><input type="text" defaultValue="累计80万+车辆检测数据、200万+交易记录" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secDigitMaturity')}</div>
                <div style={{ marginBottom: '14px' }}>
                  <Slider label={t('intake.sliderAimlLabel')} value={aiSlider} onChange={setAiSlider} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <Slider label={t('intake.sliderDataGovLabel')} value={dataSlider} onChange={setDataSlider} />
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secTechStrat')}</div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldTechTags')}</label>
                    <TagList
                      options={t('intake.techTagOpts', { returnObjects: true })}
                      value={techTags}
                      onChange={setTechTags}
                    />
                  </div>
                </div>
                <div className="chk-list" style={{ marginTop: '12px' }}>
                  {(t('intake.techChecks', { returnObjects: true })).map((txt, i) => (
                    <ChkItem key={i} checked={techChecks[i]} onToggle={() => toggleTechCheck(i)}>{txt}</ChkItem>
                  ))}
                </div>
              </div>

              {/* STEP 7: Capital Goals */}
              <div className={activeStep === 6 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">{t('intake.secCapGoal')}</div>
                <div className="fld" style={{ marginBottom: '14px' }}>
                  <label>{t('intake.fldCapitalRoute')}</label>
                  <RangeOpts
                    options={t('intake.capRouteOpts', { returnObjects: true })}
                    value={capitalRoute}
                    onChange={setCapitalRoute}
                  />
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldTimeWindow')}</label>
                    <select defaultValue="24–36个月">
                      {(t('intake.timeWindowOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fld"><label>{t('intake.fldTargetRaising')}</label><input type="text" defaultValue="B轮 · $3,000–5,000万美元" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>{t('intake.fldFundUse')}</label>
                    <select defaultValue="技术研发 + 市场扩张">
                      {(t('intake.fundUseOpts', { returnObjects: true })).map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="fld"><label>{t('intake.fldTargetValuation')}</label><input type="text" defaultValue="$3亿–5亿美元" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secInvestorPref')}</div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldInvestorTags')}</label>
                    <TagList
                      options={t('intake.investorTagOpts', { returnObjects: true })}
                      value={investorTags}
                      onChange={setInvestorTags}
                    />
                  </div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>{t('intake.fldAdvisorExpectations')}</label>
                    <textarea defaultValue="希望借助RVC顾问网络，重点对接海外机构投资人（美元基金），同时获得IPO前的财务规范化建议，以及车后市场赛道的并购标的资源推荐。" />
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">{t('intake.secRiskExposure')}</div>
                <div className="chk-list">
                  {(t('intake.riskChecks', { returnObjects: true })).map((txt, i) => (
                    <ChkItem key={i} checked={riskChecks[i]} onToggle={() => toggleRiskCheck(i)}>{txt}</ChkItem>
                  ))}
                </div>
              </div>

              <div className="form-foot">
                <span className="form-foot-hint">{STEP_META[activeStep].label} · {t('intake.encrypted')}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {activeStep > 0 && (
                    <button className="btn-sm" onClick={() => goToStep(activeStep - 1)}>← {t('intake.prev')}</button>
                  )}
                  <button
                    className="btn-blue"
                    style={{ padding: '9px 22px', fontSize: '13px' }}
                    onClick={() => goToStep(activeStep + 1)}
                  >
                    {activeStep === 6 ? t('intake.submit') : t('intake.saveContinue')}
                  </button>
                </div>
              </div>
            </div>

            {/* AI Panel */}
            <div className="ai-panel">
              <div className="ai-head">
                <div className="ai-head-row">
                  <div className="ai-head-t">{t('intake.aiTitle')}</div>
                  <div className="ai-live"><span className="ai-live-dot" />{t('intake.aiLive')}</div>
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>{t('intake.aiSub')}</div>
              </div>
              <div className="ai-body">
                <div className="ai-score-ring">
                  <svg viewBox="0 0 110 110" width="110" height="110" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="55" cy="55" r="44" fill="none" stroke="rgba(11,111,251,0.10)" strokeWidth="8" />
                    <circle cx="55" cy="55" r="44" fill="none" stroke="url(#sg)" strokeWidth="8"
                      strokeLinecap="round" strokeDasharray="276.5" strokeDashoffset="84"
                      transform="rotate(-90 55 55)">
                      <animate attributeName="stroke-dashoffset" from="276.5" to="84" dur="1.5s" fill="freeze" />
                    </circle>
                    <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0B6FFB" /><stop offset="100%" stopColor="#23B7FF" />
                    </linearGradient></defs>
                    <text x="55" y="50" textAnchor="middle" fill="#07132B" fontSize="22" fontWeight="800" fontFamily="Inter,sans-serif">68</text>
                    <text x="55" y="64" textAnchor="middle" fill="#6B7890" fontSize="9.5" fontFamily="Inter,sans-serif">{t('intake.aiScoreLabel')}</text>
                    <text x="55" y="76" textAnchor="middle" fill="#0B6FFB" fontSize="8.5" fontWeight="700" fontFamily="Inter,sans-serif">{t('intake.aiScoreGrade')}</text>
                  </svg>
                </div>
                <div className="ai-dims">
                  {(t('intake.aiDims', { returnObjects: true })).map((name, i) => (
                    <div key={i} className="ai-dim">
                      <div className="ai-dim-row"><span className="ai-dim-name">{name}</span><span className="ai-dim-val">{AI_DIM_VALS[i]}</span></div>
                      <div className="ai-dim-bar"><div className="ai-dim-fill" style={{ width: AI_DIM_VALS[i] + '%', background: AI_DIM_GRADS[i] }} /></div>
                    </div>
                  ))}
                </div>

                {(t('intake.aiInsights', { returnObjects: true })).map((insight, i) => (
                  <div key={i} className={activeStep === i ? 'ai-step-content active' : 'ai-step-content'}>
                    <div className="ai-insight">
                      <div className="ai-insight-t">{insight.title}</div>
                      {insight.items.map((item, j) => (
                        <div key={j} className="ai-insight-item">{item}</div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="ai-status" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--t3)', padding: '10px', border: '1px solid var(--bl)', borderRadius: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--blue-s)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--t2)' }}>{REMAINING[activeStep]}</div>
                    <div style={{ fontSize: '10px', color: 'var(--t4)', marginTop: '1px' }}>{t('intake.aiCompleteHint')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
