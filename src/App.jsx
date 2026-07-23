import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Columns3,
  ExternalLink,
  Filter,
  Github,
  Layers3,
  Menu,
  Moon,
  Search,
  SlidersHorizontal,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { designSystems, libraries, principles, selectionQuestions, sourceGroups } from './data.js';

const navItems = [
  ['catalog', '组件图鉴'],
  ['systems', '设计体系'],
  ['selector', '选型工作台'],
  ['method', '设计方法'],
  ['sources', '资料索引'],
];

const categoryOptions = ['全部', ...new Set(libraries.map((item) => item.category))];

function ScoreDots({ value, compact = false }) {
  return (
    <span className={`score-dots ${compact ? 'compact' : ''}`} aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((dot) => <i key={dot} className={dot <= value ? 'active' : ''} />)}
    </span>
  );
}

function LogoMark({ item, large = false }) {
  return <span className={`logo-mark accent-${item.accent} ${large ? 'large' : ''}`}>{item.short || item.name.slice(0, 2)}</span>;
}

function Metric({ label, value }) {
  return (
    <div className="metric-row">
      <span>{label}</span>
      <ScoreDots value={value} compact />
    </div>
  );
}

function LibraryCard({ item, selected, onToggle, onOpen }) {
  return (
    <article className="library-card">
      <div className="card-topline">
        <LogoMark item={item} />
        <button
          type="button"
          className={`compare-toggle ${selected ? 'selected' : ''}`}
          onClick={() => onToggle(item.id)}
          aria-pressed={selected}
        >
          {selected ? <Check size={14} /> : <Columns3 size={14} />}
          {selected ? '已加入' : '对比'}
        </button>
      </div>
      <div className="library-heading">
        <div>
          <h3>{item.name}</h3>
          <p>{item.org}</p>
        </div>
        <span className="category-pill">{item.category}</span>
      </div>
      <p className="library-summary">{item.summary}</p>
      <div className="trait-list">
        {item.traits.map((trait) => <span key={trait}>{trait}</span>)}
      </div>
      <div className="mini-metrics">
        <Metric label="覆盖" value={item.scores.completeness} />
        <Metric label="控制" value={item.scores.control} />
        <Metric label="交付" value={item.scores.speed} />
      </div>
      <div className="card-footer">
        <span>{item.styling}</span>
        <button type="button" className="text-button" onClick={() => onOpen(item)}>查看分析 <ArrowUpRight size={15} /></button>
      </div>
    </article>
  );
}

function LibraryDrawer({ item, onClose, onCompare, selected }) {
  if (!item) return null;
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="detail-drawer" onMouseDown={(event) => event.stopPropagation()} aria-label={`${item.name} 详情`}>
        <button type="button" className="icon-button drawer-close" onClick={onClose} aria-label="关闭"><X size={19} /></button>
        <div className="drawer-hero">
          <LogoMark item={item} large />
          <div>
            <span className="eyebrow">{item.category}</span>
            <h2>{item.name}</h2>
            <p>{item.org}</p>
          </div>
        </div>
        <p className="drawer-summary">{item.summary}</p>

        <section className="drawer-section">
          <h3>适合什么项目</h3>
          <div className="fit-grid">{item.fit.map((fit) => <span key={fit}><Check size={14} />{fit}</span>)}</div>
        </section>

        <section className="drawer-section">
          <h3>选型指标</h3>
          <div className="drawer-metrics">
            <Metric label="组件覆盖" value={item.scores.completeness} />
            <Metric label="视觉控制" value={item.scores.control} />
            <Metric label="可访问基础" value={item.scores.accessibility} />
            <Metric label="交付速度" value={item.scores.speed} />
            <Metric label="学习友好" value={item.scores.learning} />
          </div>
          <p className="score-note">评分为本站用于横向比较的编辑性判断，并非官方指标。</p>
        </section>

        <section className="drawer-section two-column-facts">
          <div><span>样式路线</span><strong>{item.styling}</strong></div>
          <div><span>分发方式</span><strong>{item.sourceMode}</strong></div>
          <div><span>许可证</span><strong>{item.license}</strong></div>
          <div><span>Tailwind</span><strong>{item.tailwind ? '主要工作流相关' : '非必需'}</strong></div>
        </section>

        <section className="drawer-section caveat-box">
          <CircleHelp size={18} />
          <div><h3>需要注意</h3><p>{item.caveat}</p></div>
        </section>

        <div className="drawer-actions">
          <a href={item.links.docs} target="_blank" rel="noreferrer" className="primary-button">官方文档 <ExternalLink size={16} /></a>
          <a href={item.links.github} target="_blank" rel="noreferrer" className="secondary-button"><Github size={16} /> GitHub</a>
          <button type="button" className={`secondary-button ${selected ? 'active' : ''}`} onClick={() => onCompare(item.id)}>
            {selected ? <Check size={16} /> : <Columns3 size={16} />}{selected ? '已加入对比' : '加入对比'}
          </button>
        </div>
      </aside>
    </div>
  );
}

function ComparePanel({ ids, onRemove, onClear }) {
  const selected = libraries.filter((item) => ids.includes(item.id));
  const [open, setOpen] = useState(true);
  if (!selected.length) return null;

  return (
    <div className={`compare-panel ${open ? 'open' : 'collapsed'}`}>
      <button className="compare-handle" type="button" onClick={() => setOpen((value) => !value)}>
        <span><Columns3 size={17} /> 组件对比 · {selected.length}/4</span><ChevronDown size={17} />
      </button>
      {open && (
        <div className="compare-content">
          <div className="compare-head">
            <p>同一指标只适合辅助判断，最终应使用真实业务页面进行验证。</p>
            <button type="button" className="text-button" onClick={onClear}>清空</button>
          </div>
          <div className="compare-scroll">
            <table>
              <thead>
                <tr>
                  <th>指标</th>
                  {selected.map((item) => (
                    <th key={item.id}><span><LogoMark item={item} />{item.name}<button type="button" onClick={() => onRemove(item.id)} aria-label={`移除 ${item.name}`}><X size={14} /></button></span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr><td>类型</td>{selected.map((item) => <td key={item.id}>{item.category}</td>)}</tr>
                <tr><td>组件覆盖</td>{selected.map((item) => <td key={item.id}><ScoreDots value={item.scores.completeness} /></td>)}</tr>
                <tr><td>视觉控制</td>{selected.map((item) => <td key={item.id}><ScoreDots value={item.scores.control} /></td>)}</tr>
                <tr><td>可访问基础</td>{selected.map((item) => <td key={item.id}><ScoreDots value={item.scores.accessibility} /></td>)}</tr>
                <tr><td>交付速度</td>{selected.map((item) => <td key={item.id}><ScoreDots value={item.scores.speed} /></td>)}</tr>
                <tr><td>样式路线</td>{selected.map((item) => <td key={item.id}>{item.styling}</td>)}</tr>
                <tr><td>主要提醒</td>{selected.map((item) => <td key={item.id}>{item.caveat}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SelectorWorkbench({ onOpen }) {
  const [product, setProduct] = useState('admin');
  const [control, setControl] = useState('balanced');
  const [styling, setStyling] = useState('no-tailwind');

  const recommendations = useMemo(() => {
    const scored = libraries.map((item) => {
      let score = 0;
      const reasons = [];
      if (product === 'admin') {
        if (['antd', 'mui', 'primereact', 'carbon'].includes(item.id)) { score += 5; reasons.push('企业组件覆盖较强'); }
        if (item.scores.completeness >= 5) score += 2;
      }
      if (product === 'saas') {
        if (['mantine', 'chakra', 'mui', 'shadcn', 'heroui'].includes(item.id)) { score += 5; reasons.push('适合产品化与快速迭代'); }
        score += item.scores.control;
      }
      if (product === 'design-system') {
        if (['radix', 'react-aria', 'base-ui', 'ark-ui', 'shadcn'].includes(item.id)) { score += 6; reasons.push('提供较高的设计控制权'); }
        score += item.scores.control;
      }
      if (product === 'professional') {
        if (['blueprint', 'carbon', 'fluent', 'spectrum', 'primereact'].includes(item.id)) { score += 6; reasons.push('适合高密度或专业工作流'); }
        score += item.scores.completeness;
      }
      if (control === 'fast') score += item.scores.speed * 1.5;
      if (control === 'balanced') score += item.scores.speed + item.scores.control;
      if (control === 'full') score += item.scores.control * 2;
      if (styling === 'no-tailwind' && item.tailwind) score -= 6;
      if (styling === 'no-tailwind' && !item.tailwind) reasons.push('不依赖 Tailwind');
      if (styling === 'tailwind-ok' && item.tailwind) { score += 3; reasons.push('可利用 Tailwind 工作流'); }
      return { item, score, reasons };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [product, control, styling]);

  return (
    <div className="selector-layout">
      <div className="selector-form">
        <ChoiceGroup title="1. 你的产品更接近哪类？" items={selectionQuestions.product} value={product} onChange={setProduct} />
        <ChoiceGroup title="2. 你更重视什么？" items={selectionQuestions.control} value={control} onChange={setControl} />
        <ChoiceGroup title="3. 样式技术约束" items={selectionQuestions.styling} value={styling} onChange={setStyling} />
      </div>
      <div className="recommendation-box">
        <div className="recommendation-title"><Sparkles size={18} /><span>当前建议</span></div>
        <p>结果根据本站编辑性模型生成，只用于缩小候选范围。</p>
        <div className="recommendation-list">
          {recommendations.map(({ item, reasons }, index) => (
            <button type="button" key={item.id} onClick={() => onOpen(item)}>
              <span className="rank">0{index + 1}</span>
              <LogoMark item={item} />
              <span className="recommendation-copy"><strong>{item.name}</strong><small>{reasons.slice(0, 2).join(' · ') || item.fit[0]}</small></span>
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
        <div className="recommendation-rule">
          <strong>建议验证方式</strong>
          <span>用前三名分别实现一个真实业务页，记录代码量、改样式时间、键盘操作和构建体积。</span>
        </div>
      </div>
    </div>
  );
}

function ChoiceGroup({ title, items, value, onChange }) {
  return (
    <fieldset className="choice-group">
      <legend>{title}</legend>
      <div className="choice-grid">
        {items.map((item) => (
          <button type="button" key={item.value} className={value === item.value ? 'active' : ''} onClick={() => onChange(item.value)}>
            <span>{item.label}</span>{item.hint && <small>{item.hint}</small>}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function App() {
  const [theme, setTheme] = useState('dark');
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const [tailwindMode, setTailwindMode] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [detail, setDetail] = useState(null);
  const [compareIds, setCompareIds] = useState([]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    const result = libraries.filter((item) => {
      const haystack = [item.name, item.short, item.org, item.category, item.summary, ...item.fit, ...item.traits, item.styling].join(' ').toLowerCase();
      const matchesQuery = !text || haystack.includes(text);
      const matchesCategory = category === '全部' || item.category === category;
      const matchesTailwind = tailwindMode === 'all' || (tailwindMode === 'avoid' ? !item.tailwind : item.tailwind);
      return matchesQuery && matchesCategory && matchesTailwind;
    });
    if (sort === 'complete') return [...result].sort((a, b) => b.scores.completeness - a.scores.completeness);
    if (sort === 'control') return [...result].sort((a, b) => b.scores.control - a.scores.control);
    if (sort === 'speed') return [...result].sort((a, b) => b.scores.speed - a.scores.speed);
    return result;
  }, [query, category, tailwindMode, sort]);

  const toggleCompare = (id) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      if (current.length >= 4) return [...current.slice(1), id];
      return [...current, id];
    });
  };

  const jumpTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileNav(false);
  };

  return (
    <div className="app" data-theme={theme}>
      <header className="topbar">
        <button type="button" className="brand" onClick={() => jumpTo('top')}>
          <span className="brand-mark"><Layers3 size={20} /></span>
          <span><strong>React UI Atlas</strong><small>组件库与设计系统图鉴</small></span>
        </button>
        <nav className={mobileNav ? 'open' : ''}>
          {navItems.map(([id, label]) => <button type="button" key={id} onClick={() => jumpTo(id)}>{label}</button>)}
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label="切换主题">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button type="button" className="icon-button mobile-menu" onClick={() => setMobileNav((value) => !value)} aria-label="菜单"><Menu size={19} /></button>
        </div>
      </header>

      <main id="top">
        <section className="hero section-shell">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={14} /> React 组件选型，不再只看截图</span>
            <h1>从组件库，到设计语言，<br /><em>建立可解释的 UI 选型。</em></h1>
            <p>整理主流 React 组件库、Headless 原语与企业设计系统。通过检索、横向对比和场景化建议，理解每种方案真正解决的问题。</p>
            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={() => jumpTo('catalog')}>开始浏览 <ArrowUpRight size={17} /></button>
              <button type="button" className="secondary-button" onClick={() => jumpTo('selector')}><SlidersHorizontal size={17} /> 打开选型工作台</button>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="orbit orbit-a"><span>MUI</span><span>ARIA</span><span>Ant</span></div>
            <div className="orbit orbit-b"><span>Radix</span><span>Fluent</span><span>Carbon</span></div>
            <div className="visual-core"><Layers3 size={32} /><strong>UI</strong><small>library × system</small></div>
          </div>
          <div className="hero-stats">
            <div><strong>{libraries.length}</strong><span>React 方案</span></div>
            <div><strong>{designSystems.length}</strong><span>设计体系</span></div>
            <div><strong>5</strong><span>选型维度</span></div>
            <div><strong>2026.07</strong><span>资料基线</span></div>
          </div>
        </section>

        <section id="catalog" className="content-section section-shell">
          <div className="section-heading split-heading">
            <div><span className="section-index">01</span><h2>React 组件库图鉴</h2><p>先按抽象层分类，再比较组件覆盖、控制权、可访问性和交付速度。</p></div>
            <div className="result-count"><strong>{filtered.length}</strong><span>个匹配方案</span></div>
          </div>

          <div className="filter-bar">
            <label className="search-box"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索组件库、场景或特征…" />{query && <button type="button" onClick={() => setQuery('')}><X size={15} /></button>}</label>
            <label className="select-box"><Filter size={16} /><select value={category} onChange={(event) => setCategory(event.target.value)}>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="select-box"><Layers3 size={16} /><select value={tailwindMode} onChange={(event) => setTailwindMode(event.target.value)}><option value="all">样式方案不限</option><option value="avoid">排除 Tailwind 主导</option><option value="only">Tailwind 相关</option></select></label>
            <label className="select-box"><SlidersHorizontal size={16} /><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">默认排序</option><option value="complete">组件覆盖优先</option><option value="control">控制权优先</option><option value="speed">交付速度优先</option></select></label>
          </div>

          <div className="library-grid">
            {filtered.map((item) => <LibraryCard key={item.id} item={item} selected={compareIds.includes(item.id)} onToggle={toggleCompare} onOpen={setDetail} />)}
          </div>
          {!filtered.length && <div className="empty-state"><Search size={30} /><h3>没有匹配结果</h3><p>尝试清除关键词或放宽筛选条件。</p></div>}
        </section>

        <section id="systems" className="content-section section-shell">
          <div className="section-heading"><span className="section-index">02</span><h2>设计体系地图</h2><p>组件库是代码资产，设计系统还包含基础规则、内容语言、模式、治理与组织协作。</p></div>
          <div className="system-grid">
            {designSystems.map((system, index) => (
              <a key={system.name} href={system.link} target="_blank" rel="noreferrer" className={`system-card accent-border-${system.accent}`}>
                <div className="system-number">0{index + 1}</div>
                <div><span>{system.owner}</span><h3>{system.name}</h3><p>{system.idea}</p></div>
                <dl><div><dt>视觉语气</dt><dd>{system.tone}</dd></div><div><dt>适用场景</dt><dd>{system.use}</dd></div></dl>
                <span className="system-link">查看官方体系 <ExternalLink size={15} /></span>
              </a>
            ))}
          </div>
        </section>

        <section id="selector" className="content-section section-shell">
          <div className="section-heading"><span className="section-index">03</span><h2>选型工作台</h2><p>用项目类型、控制权和样式约束快速缩小候选范围。默认考虑“不使用 Tailwind”的工程约束。</p></div>
          <SelectorWorkbench onOpen={setDetail} />
        </section>

        <section id="method" className="content-section section-shell">
          <div className="section-heading"><span className="section-index">04</span><h2>从选库到设计治理</h2><p>真正稳定的 UI 体系不是“装一个包”，而是持续管理令牌、组件、模式与质量门禁。</p></div>
          <div className="principle-layout">
            <div className="principle-rail">
              {principles.map((principle) => (
                <article key={principle.step}><span>{principle.step}</span><div><h3>{principle.title}</h3><p>{principle.text}</p></div></article>
              ))}
            </div>
            <aside className="architecture-card">
              <span className="eyebrow">Design system stack</span>
              <h3>一个完整 UI 体系的五层结构</h3>
              <div className="stack-diagram">
                <div><strong>治理</strong><span>版本、贡献、决策、弃用</span></div>
                <div><strong>模式</strong><span>页面、流程、数据与反馈</span></div>
                <div><strong>组件</strong><span>API、状态、组合、可访问性</span></div>
                <div><strong>令牌</strong><span>颜色、间距、字体、圆角、动效</span></div>
                <div><strong>原则</strong><span>品牌、用户、内容与交互价值</span></div>
              </div>
              <p>当团队只维护“组件”一层时，设计分歧通常会转移到页面代码里继续累积。</p>
            </aside>
          </div>
        </section>

        <section id="sources" className="content-section section-shell sources-section">
          <div className="section-heading"><span className="section-index">05</span><h2>资料索引与更新说明</h2><p>条目优先链接官方文档与官方仓库。组件状态会变化，落地前仍需核对发行说明、浏览器支持和许可证。</p></div>
          <div className="source-layout">
            {sourceGroups.map((group) => (
              <div className="source-group" key={group.title}><BookOpen size={18} /><h3>{group.title}</h3><p>{group.items.join(' · ')}</p></div>
            ))}
          </div>
          <div className="method-note">
            <strong>本站如何使用评分</strong>
            <p>“覆盖、控制、可访问、交付、学习”是相对化编辑指标，用于发现差异，不代表权威排名。没有任何组件库能在所有项目中同时达到最优。</p>
          </div>
        </section>
      </main>

      <footer className="footer section-shell"><div><strong>React UI Atlas</strong><span>把组件选型变成可复查的工程决策。</span></div><span>Research baseline · 2026-07-23</span></footer>

      <LibraryDrawer item={detail} onClose={() => setDetail(null)} onCompare={toggleCompare} selected={detail ? compareIds.includes(detail.id) : false} />
      <ComparePanel ids={compareIds} onRemove={toggleCompare} onClear={() => setCompareIds([])} />
    </div>
  );
}

export default App;
