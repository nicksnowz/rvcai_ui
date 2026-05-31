import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/intake.css';

const STEP_META = [
  { label: '第 1 步，共 7 步', title: '公司概况', desc: '企业基础信息与核心业务定位' },
  { label: '第 2 步，共 7 步', title: '财务数据', desc: '核心财务指标，用于AI基准对标与分析建模' },
  { label: '第 3 步，共 7 步', title: '运营状况', desc: '业务运营数据与流程效率评估' },
  { label: '第 4 步，共 7 步', title: '战略分析', desc: '市场定位、竞争优势与增长战略' },
  { label: '第 5 步，共 7 步', title: '治理合规', desc: '公司治理结构与合规体系完备度' },
  { label: '第 6 步，共 7 步', title: '技术能力', desc: '数字化资产与技术创新能力评估' },
  { label: '第 7 步，共 7 步', title: '资本目标', desc: '融资目标、时间规划与投资人偏好' },
];

const STEP_LABELS = ['公司概况', '财务数据', '运营状况', '战略分析', '治理合规', '技术能力', '资本目标'];

const REMAINING = [
  '还差 6 步完成完整报告',
  '还差 5 步完成完整报告',
  '还差 4 步完成完整报告',
  '还差 3 步完成完整报告',
  '还差 2 步完成完整报告',
  '还差 1 步完成完整报告',
  '所有步骤已完成，生成报告',
];

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
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

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
      navigate('/report');
      return;
    }
    setActiveStep(idx);
  }, [navigate]);

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
    <div className="page">
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

              {/* STEP 1: 公司概况 */}
              <div className={activeStep === 0 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">基本信息</div>
                <div className="form-row">
                  <div className="fld"><label>公司全称</label><input type="text" defaultValue="UC Auto（优车汇）" /></div>
                  <div className="fld"><label>成立年份</label><input type="text" defaultValue="2018年" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>主营业务</label><input type="text" defaultValue="二手车交易平台" /></div>
                  <div className="fld"><label>商业模式</label>
                    <select defaultValue="B2B / B2C">
                      <option>B2B</option><option>B2B / B2C</option><option>B2C</option><option>SaaS</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>员工规模</label>
                    <RangeOpts options={['1–20人', '21–50人', '51–200人', '200+人']} value={empRange} onChange={setEmpRange} />
                  </div>
                  <div className="fld"><label>公司注册地</label><input type="text" defaultValue="中国 · 上海" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">发展阶段与市场</div>
                <div className="form-row">
                  <div className="fld"><label>融资阶段</label>
                    <select defaultValue="A轮">
                      <option>天使轮</option><option>Pre-A</option><option>A轮</option><option>B轮</option><option>C轮+</option>
                    </select>
                  </div>
                  <div className="fld"><label>主要市场地区</label>
                    <select defaultValue="全国（线上+线下）">
                      <option>华东</option><option>全国（线上+线下）</option><option>海外为主</option>
                    </select>
                  </div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>核心竞争优势（简述）</label>
                    <textarea defaultValue="专注二手车B端批发与C端零售的数字化撮合平台，依托自主开发的车辆评估AI系统，实现检测报告24小时内交付，交易效率较传统模式提升60%。" />
                  </div>
                </div>
              </div>

              {/* STEP 2: 财务数据 */}
              <div className={activeStep === 1 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">营收与增长</div>
                <div className="form-row">
                  <div className="fld"><label>年营收（美元）</label><input type="text" defaultValue="$50,000,000" /></div>
                  <div className="fld"><label>同比增长率（YoY）</label><input type="text" defaultValue="38%" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>三年复合增长率（CAGR）</label><input type="text" defaultValue="31%" /></div>
                  <div className="fld"><label>未来12个月预测营收</label><input type="text" defaultValue="$68,000,000" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">盈利能力</div>
                <div className="form-row three">
                  <div className="fld"><label>EBITDA利润率</label><input type="text" defaultValue="14%" /></div>
                  <div className="fld"><label>毛利率</label><input type="text" defaultValue="22%" /></div>
                  <div className="fld"><label>净利润率</label><input type="text" defaultValue="7%" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>年EBITDA金额（美元）</label><input type="text" defaultValue="$7,000,000" /></div>
                  <div className="fld"><label>月均现金消耗（如亏损期）</label><input type="text" placeholder="如盈利则填N/A" defaultValue="N/A" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">营收结构</div>
                <div className="fld" style={{ marginBottom: '14px' }}>
                  <label>经常性收入占比</label>
                  <RangeOpts options={['0–20%', '20–40%', '40–60%', '60%+']} value={recRevRange} onChange={setRecRevRange} />
                </div>
                <div className="form-row">
                  <div className="fld"><label>前三大客户营收占比</label><input type="text" defaultValue="约28%" /><span className="hint">客户集中度影响融资估值</span></div>
                  <div className="fld"><label>营收地区分布</label>
                    <select defaultValue="主要境内（90%+）">
                      <option>主要境内（90%+）</option><option>境内为主（70–90%）</option><option>境内外混合</option>
                    </select>
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">资本结构</div>
                <div className="form-row">
                  <div className="fld"><label>负债总额（美元）</label><input type="text" defaultValue="$5,000,000" /></div>
                  <div className="fld"><label>现金及等价物</label><input type="text" defaultValue="$12,000,000" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>上轮估值</label><input type="text" defaultValue="A轮 · 估值 $1.2亿美元" /></div>
                  <div className="fld"><label>累计融资金额</label><input type="text" defaultValue="$1,800万美元" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>主要财务关注点（多选）</label>
                    <TagList
                      options={['现金流管理', '毛利率提升', '营运资本', '规模化边际成本', '客户集中度', '汇率敞口']}
                      value={finTags}
                      onChange={setFinTags}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: 运营状况 */}
              <div className={activeStep === 2 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">核心运营指标</div>
                <div className="form-row">
                  <div className="fld"><label>月活跃交易用户数</label><input type="text" defaultValue="约1,200家B端经销商" /></div>
                  <div className="fld"><label>月均交易量（辆）</label><input type="text" defaultValue="约3,800辆/月" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>平均客单价（美元）</label><input type="text" defaultValue="B端约$13,000 / C端约$9,500" /></div>
                  <div className="fld"><label>客户复购周期</label><input type="text" defaultValue="B端平均18天复购一次" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">流程效率</div>
                <div className="form-row">
                  <div className="fld"><label>车辆检测交付周期</label><input type="text" defaultValue="平均22小时" /></div>
                  <div className="fld"><label>交易平均完成周期</label><input type="text" defaultValue="B端3.2天 / C端5.8天" /></div>
                </div>
                <div className="fld" style={{ marginBottom: '14px' }}>
                  <label>运营数字化程度</label>
                  <Slider label="核心业务数字化覆盖率" value={digSlider} onChange={setDigSlider} />
                </div>
                <div className="form-div" />
                <div className="form-sec">供应链与库存</div>
                <div className="form-row">
                  <div className="fld"><label>合作供货商数量</label><input type="text" defaultValue="约240家认证经销商" /></div>
                  <div className="fld"><label>平均库存周转天数</label><input type="text" defaultValue="28天" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>运营效率短板（多选）</label>
                    <TagList
                      options={['检测标准化程度', '物流协同效率', '售后服务体系', '跨城市扩张复制能力', '数据系统集成']}
                      value={opTags}
                      onChange={setOpTags}
                    />
                  </div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>补充说明</label>
                    <textarea
                      placeholder="描述运营中的关键挑战或近期改进举措..."
                      defaultValue="平台正在推进标准化服务包，计划Q3上线B端SaaS管理模块，进一步提升运营效率与可复制性。"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 4: 战略分析 */}
              <div className={activeStep === 3 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">市场定位</div>
                <div className="form-row">
                  <div className="fld"><label>目标市场规模（TAM，美元）</label><input type="text" defaultValue="中国二手车市场约$1,800亿/年" /></div>
                  <div className="fld"><label>当前市场渗透率</label><input type="text" defaultValue="约0.03%（巨大增长空间）" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>核心竞争壁垒（多选）</label>
                    <TagList
                      options={['AI检测技术专利', 'B端经销商网络积累', '品牌认知度', '数据积累与算法迭代', '价格优势', '政府资质认证']}
                      value={stratTags}
                      onChange={setStratTags}
                    />
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">增长战略</div>
                <div className="form-row">
                  <div className="fld"><label>未来3年核心增长引擎</label>
                    <select defaultValue="产品线延伸（B端SaaS化）">
                      <option>新市场地域扩张</option><option>产品线延伸（B端SaaS化）</option><option>国际化</option><option>并购整合</option>
                    </select>
                  </div>
                  <div className="fld"><label>品类扩张计划</label><input type="text" defaultValue="延伸至车后市场（维保、保险、金融）" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>主要竞争对手及差异化优势</label>
                    <textarea defaultValue="主要竞争对手：优信、瓜子、大搜车。差异化：聚焦B端批发市场，AI辅助定价+24H检测报告，交易撮合效率显著高于行业均值，同时向C端渗透构建双侧网络效应。" />
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">战略成熟度自评</div>
                <div className="chk-list">
                  {['已有清晰的3年战略规划文档', '战略目标与KPI体系已拆解至部门级', '已完成竞品深度分析报告', '国际化可行性研究已立项'].map((txt, i) => (
                    <ChkItem key={i} checked={stratChecks[i]} onToggle={() => toggleStratCheck(i)}>{txt}</ChkItem>
                  ))}
                </div>
              </div>

              {/* STEP 5: 治理合规 */}
              <div className={activeStep === 4 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">董事会结构</div>
                <div className="form-row">
                  <div className="fld"><label>董事会成员人数</label><input type="text" defaultValue="5人" /></div>
                  <div className="fld"><label>独立董事人数</label><input type="text" defaultValue="1人（需补充至3人）" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>审计委员会状态</label>
                    <select defaultValue="尚未组建">
                      <option>尚未组建</option><option>已组建（无独立成员）</option><option>已组建（含独立成员）</option>
                    </select>
                  </div>
                  <div className="fld"><label>CFO/财务负责人</label>
                    <select defaultValue="内部兼职CFO">
                      <option>内部兼职CFO</option><option>全职CFO</option><option>Big4背景CFO</option>
                    </select>
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">审计与合规</div>
                <div className="form-row">
                  <div className="fld"><label>当前审计机构</label>
                    <select defaultValue="国内中小所">
                      <option>国内中小所</option><option>国内大所</option><option>Big4（四大）</option>
                    </select>
                  </div>
                  <div className="fld"><label>已审计年度</label><input type="text" defaultValue="2023、2024年（非Big4）" /></div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>合规完备情况（多选）</label>
                    <TagList
                      options={['工商注册及资质齐全', '劳动合规', '数据安全合规（PIPL）', '税务合规', '反腐反商业贿赂政策', 'ESG信息披露']}
                      value={compTags}
                      onChange={setCompTags}
                    />
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">股权结构</div>
                <div className="form-row">
                  <div className="fld"><label>创始团队持股比例</label><input type="text" defaultValue="创始人合计持股约62%" /></div>
                  <div className="fld"><label>是否存在股权纠纷</label>
                    <select defaultValue="否">
                      <option>否</option><option>是（请说明）</option>
                    </select>
                  </div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>治理改善优先级（多选）</label>
                    <TagList
                      options={['引入独立董事', '组建审计委员会', 'Big4审计切换', '完善内控体系', 'ESG框架建立']}
                      value={govTags}
                      onChange={setGovTags}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 6: 技术能力 */}
              <div className={activeStep === 5 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">技术资产</div>
                <div className="form-row">
                  <div className="fld"><label>自主研发核心系统</label><input type="text" defaultValue="AI检测评估引擎、交易撮合系统、ERP" /></div>
                  <div className="fld"><label>技术团队规模</label><input type="text" defaultValue="约12人（含算法、产品、工程）" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>知识产权（专利/软著）</label><input type="text" defaultValue="3项发明专利 + 8项软件著作权" /></div>
                  <div className="fld"><label>数据资产规模</label><input type="text" defaultValue="累计80万+车辆检测数据、200万+交易记录" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">数字化成熟度</div>
                <div style={{ marginBottom: '14px' }}>
                  <Slider label="AI/ML在核心业务的应用深度" value={aiSlider} onChange={setAiSlider} />
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <Slider label="数据治理与分析能力成熟度" value={dataSlider} onChange={setDataSlider} />
                </div>
                <div className="form-div" />
                <div className="form-sec">技术战略</div>
                <div className="form-row full">
                  <div className="fld"><label>未来12个月技术重点投入（多选）</label>
                    <TagList
                      options={['AI定价模型迭代', 'B端SaaS产品化', '数据中台建设', '移动端体验优化', '国际化技术适配']}
                      value={techTags}
                      onChange={setTechTags}
                    />
                  </div>
                </div>
                <div className="chk-list" style={{ marginTop: '12px' }}>
                  {['核心技术系统已完成灾备与容灾部署', '已通过ISO 27001信息安全认证', '技术路线图已对外披露（投资人可见）'].map((txt, i) => (
                    <ChkItem key={i} checked={techChecks[i]} onToggle={() => toggleTechCheck(i)}>{txt}</ChkItem>
                  ))}
                </div>
              </div>

              {/* STEP 7: 资本目标 */}
              <div className={activeStep === 6 ? 'step-content active' : 'step-content'}>
                <div className="form-sec">资本目标</div>
                <div className="fld" style={{ marginBottom: '14px' }}>
                  <label>首要资本路径（单选）</label>
                  <RangeOpts
                    options={['A股上市', '港股IPO', '美股IPO', '战略并购（卖方）']}
                    value={capitalRoute}
                    onChange={setCapitalRoute}
                  />
                </div>
                <div className="form-row">
                  <div className="fld"><label>目标时间窗口</label>
                    <select defaultValue="24–36个月">
                      <option>12个月内</option><option>12–24个月</option><option>24–36个月</option><option>36个月以上</option>
                    </select>
                  </div>
                  <div className="fld"><label>目标融资规模（美元）</label><input type="text" defaultValue="B轮 · $3,000–5,000万美元" /></div>
                </div>
                <div className="form-row">
                  <div className="fld"><label>期望资金用途</label>
                    <select defaultValue="技术研发 + 市场扩张">
                      <option>市场扩张</option><option>技术研发 + 市场扩张</option><option>并购收购</option><option>运营资本补充</option>
                    </select>
                  </div>
                  <div className="fld"><label>目标估值区间（美元）</label><input type="text" defaultValue="$3亿–5亿美元" /></div>
                </div>
                <div className="form-div" />
                <div className="form-sec">投资人偏好</div>
                <div className="form-row full">
                  <div className="fld"><label>偏好投资人类型（多选）</label>
                    <TagList
                      options={['战略型产业投资人', '专注新经济的PE/VC', '政府引导基金', '跨境资本（美元基金）', '上市公司战投']}
                      value={investorTags}
                      onChange={setInvestorTags}
                    />
                  </div>
                </div>
                <div className="form-row full">
                  <div className="fld"><label>对顾问的具体期望</label>
                    <textarea defaultValue="希望借助RVC顾问网络，重点对接海外机构投资人（美元基金），同时获得IPO前的财务规范化建议，以及车后市场赛道的并购标的资源推荐。" />
                  </div>
                </div>
                <div className="form-div" />
                <div className="form-sec">风险敞口评估</div>
                <div className="chk-list">
                  {['已了解上市合规要求并做好初步准备', '已与法律顾问就VIE架构进行咨询', '管理团队愿意接受IPO锁定期安排'].map((txt, i) => (
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
                  {[
                    { name: '战略与增长', val: 74, grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
                    { name: '财务健康', val: 70, grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
                    { name: '运营效率', val: 63, grad: 'linear-gradient(90deg,#F59E0B,#FBBF24)' },
                    { name: '治理合规', val: 58, grad: 'linear-gradient(90deg,#F59E0B,#FBBF24)' },
                    { name: '组织与人才', val: 65, grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
                    { name: '技术与数据', val: 71, grad: 'linear-gradient(90deg,#0B6FFB,#23B7FF)' },
                  ].map((d, i) => (
                    <div key={i} className="ai-dim">
                      <div className="ai-dim-row"><span className="ai-dim-name">{d.name}</span><span className="ai-dim-val">{d.val}</span></div>
                      <div className="ai-dim-bar"><div className="ai-dim-fill" style={{ width: d.val + '%', background: d.grad }} /></div>
                    </div>
                  ))}
                </div>

                {[
                  { title: '⚡ 公司概况分析', items: ['二手车赛道2024年市场规模超$1,800亿，B2B/B2C双轮驱动具备显著网络效应潜力。', '50人精干团队对应$5,000万营收，人效比处于行业前25%分位。', '建议尽快建立清晰的组织架构图，为后续融资尽调做好准备。'] },
                  { title: '⚡ 财务健康洞察', items: ['38%同比增速超越行业中位数（22%），增长质量评级为优良。', '22%毛利率处于二手车平台中等水平，SaaS化路径可大幅提升毛利至40%+。', '客户集中度28%低于30%警戒线，融资吸引力较强。'] },
                  { title: '⚡ 运营效率洞察', items: ['22小时检测交付已达行业领先水平，是核心差异化壁垒。', '28天库存周转建议优化至20天内，可释放约$200万运营资金。', '标准化程度提升空间大，SaaS化后可拉升估值倍数至8–12×ARR。'] },
                  { title: '⚡ 战略定位洞察', items: ['TAM $1,800亿+，当前渗透率极低，具备10倍增长空间叙事基础。', 'AI定价+B端SaaS双引擎是高溢价路径，建议作为资本叙事核心。', '车后市场延伸预计可将LTV提升3–4倍，是关键价值放大器。'] },
                  { title: '⚡ 治理风险预警', items: ['独立董事不足是IPO最大单项障碍，建议Q3前完成补充。', '切换Big4审计需提前18个月启动，影响IPO时间线。', '数据安全合规（PIPL/GDPR）是海外融资的强制门槛。'] },
                  { title: '⚡ 技术价值评估', items: ['80万+检测数据资产是护城河，建议明确数据货币化路径。', 'B端SaaS化可将估值逻辑从GMV型切换至ARR型，溢价空间达30–50%。', '技术路线图公开可提升机构投资人信任度，建议尽快整理。'] },
                  { title: '⚡ 资本路径建议', items: ['美股IPO目标合理，建议先完成B轮后于2026年启动上市筹备。', '$3–5亿估值目标需在2年内实现收入$1亿+及显著利润改善。', 'RVC顾问网络可为您匹配3–5家专注新经济的一线美元基金。'] },
                ].map((insight, i) => (
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
