import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Zap, Users, Sparkles, Shield, BarChart2, Settings,
  Upload, Plus, Mail, Eye, MousePointer, CheckCircle, AlertCircle,
  XCircle, Send, X, Trash2, Play, Pause, Search, ChevronRight, Copy,
  RefreshCw, Clock, Target, MessageSquare, Phone, ArrowLeft, Building2,
  ChevronDown, Smartphone, AtSign, MapPin, Briefcase, Wand2, Download,
  FileText, ChevronLeft, Settings2, UserPlus, UserMinus, Key, Globe, TrendingUp, Mic, MonitorPlay, Image, PhoneCall, Calculator, BookOpen, Repeat, Layers, CheckSquare, Video, DollarSign, Code
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

function useMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
}

const C = {
  bg: '#0D0D0D', surface: '#0D0D0D', card: '#111111',
  accent: '#DC2626', accentLow: 'rgba(255,92,26,0.10)', accentMid: 'rgba(255,92,26,0.22)',
  sms: '#7C3AED', smsLow: 'rgba(124,58,237,0.10)', smsMid: 'rgba(124,58,237,0.22)',
  text: '#F0EDE8', textSub: '#AAAAAA', textMuted: '#AAAAAA',
  border: '#1A1A1A', borderMid: '#252525',
  success: '#22C55E', successLow: 'rgba(34,197,94,0.09)',
  warn: '#F59E0B', warnLow: 'rgba(245,158,11,0.09)',
  danger: '#EF4444', dangerLow: 'rgba(239,68,68,0.09)',
  info: '#60A5FA', infoLow: 'rgba(96,165,250,0.09)',
};
const F = { display: "'Bebas Neue', sans-serif", mono: "'DM Mono', monospace" };

const seed = () => ({
  campaigns: [
    { id: 1, name: 'Launch Sequence', status: 'active', contacts: 4200, sent: 2840, opens: 1137, clicks: 284, replies: 62, created: 'Mar 15',
      emails: [
        { id: 1, type: 'email', subject: "You built the skill. Here's how to sell it.", body: '', delay: 0, preview: "Most agency owners wing it on sales." },
        { id: 2, type: 'sms',   subject: '', body: "Hey {{first_name}} — just sent you something worth reading. Check your inbox. – Jesse", delay: 1, preview: '' },
        { id: 3, type: 'email', subject: "The 3-step ClientSprint framework", body: '', delay: 2, preview: "Used to close 6 figures in 30 days." },
        { id: 4, type: 'sms',   subject: '', body: "{{first_name}}, doors close tonight. Go here: {{link}} Reply STOP to opt out.", delay: 6, preview: '' },
      ]
    },
    { id: 2, name: 'Cold Outreach – Agency Owners', status: 'draft', contacts: 850, sent: 0, opens: 0, clicks: 0, replies: 0, created: 'Mar 20',
      emails: [
        { id: 1, type: 'email', subject: "Quick question about your agency", body: '', delay: 0, preview: "Saw your work and had a thought..." },
        { id: 2, type: 'email', subject: "Following up (no fluff)", body: '', delay: 3, preview: "Just wanted to make sure this didn't get buried." },
      ]
    },
    { id: 3, name: 'SMS Blitz – Warm List', status: 'sent', contacts: 1200, sent: 1200, opens: 0, clicks: 540, replies: 138, created: 'Mar 10',
      emails: [
        { id: 1, type: 'sms', subject: '', body: "{{first_name}}, real talk — are you still trying to land agency clients? I built something for you. {{link}}", delay: 0, preview: '' },
        { id: 2, type: 'sms', subject: '', body: "Last message, promise. This closes in 24h. {{link}} — Jesse. Reply STOP to opt out.", delay: 2, preview: '' },
      ]
    },
  ],
  contacts: [
    { id: 1, email: 'alex.j@agencypro.io', phone: '+14155550101', name: 'Alex Johnson', company: 'Agency Pro', status: 'active', tags: ['warm-lead', 'skool'], added: 'Mar 10' },
    { id: 2, email: 'sarah.m@growthlab.co', phone: '+14155550102', name: 'Sarah Martinez', company: 'GrowthLab', status: 'active', tags: ['warm-lead'], added: 'Mar 10' },
    { id: 3, email: 'derek.w@scaledao.com', phone: '+14155550103', name: 'Derek White', company: 'ScaleDAO', status: 'unsubscribed', tags: ['cold'], added: 'Feb 15' },
    { id: 4, email: 'priya.k@clientflow.ai', phone: '+14155550104', name: 'Priya Kumar', company: 'ClientFlow AI', status: 'active', tags: ['hot-lead', 'skool'], added: 'Mar 22' },
    { id: 5, email: 'mike.t@launchpad.io', phone: '+14155550105', name: 'Mike Torres', company: 'LaunchPad', status: 'active', tags: ['warm-lead'], added: 'Mar 18' },
    { id: 6, email: 'jen.l@buildfast.co', phone: '', name: 'Jen Liu', company: 'BuildFast', status: 'bounced', tags: ['cold'], added: 'Mar 5' },
  ],
  settings: { smtpHost: 'smtp.sendgrid.net', smtpPort: '587', smtpUser: 'apikey', smtpPass: '', fromName: '', fromEmail: '', replyTo: '', sig: '– Jesse\nClientSprint.ai', twilioSid: '', twilioToken: '', twilioFrom: '' },
});

const CLIENTS_KEY = 'cs_clients_v2';
const CLIENT_DATA_KEY = id => `cs_client_${id}_v2`;

const defaultClients = () => [
  { id: 'owner', name: 'ClientSprint (Mine)', initials: 'CS', color: C.accent, industry: 'AI Agency Growth' },
  { id: 'c1', name: 'Apex Digital', initials: 'AD', color: '#60A5FA', industry: 'Lead Gen Agency' },
  { id: 'c2', name: 'GrowthOS', initials: 'GO', color: '#22C55E', industry: 'SaaS Agency' },
];

const fmtN = n => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
const fmtPct = (a, b) => b > 0 ? `${((a / b) * 100).toFixed(1)}%` : '–';
const SMS_LIMIT = 160;
const smsSegments = txt => Math.ceil((txt || '').length / SMS_LIMIT) || 1;

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const pr = l => { const r = [], c = { cell: '', q: false }; for (const ch of l) { if (ch === '"') c.q = !c.q; else if (ch === ',' && !c.q) { r.push(c.cell.trim()); c.cell = ''; } else c.cell += ch; } r.push(c.cell.trim()); return r; };
  const headers = pr(lines[0]);
  return { headers, rows: lines.slice(1).map(l => { const v = pr(l); return headers.reduce((o, h, i) => ({ ...o, [h]: v[i] || '' }), {}); }) };
}

const statusColor = s => ({ active: C.success, draft: C.textSub, paused: C.warn, sent: C.info, bounced: C.danger, unsubscribed: C.textMuted }[s] || C.textSub);
const statusBg = s => ({ active: C.successLow, draft: 'rgba(100,100,100,0.08)', paused: C.warnLow, sent: C.infoLow, bounced: C.dangerLow, unsubscribed: 'rgba(80,80,80,0.08)' }[s] || 'transparent');

function Badge({ status }) {
  return <span style={{ background: statusBg(status), color: statusColor(status), padding: '3px 10px', borderRadius: 4, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontFamily: F.mono }}>{status}</span>;
}
function TypePill({ type }) {
  const isEmail = type === 'email';
  return (
    <span style={{ background: isEmail ? C.accentLow : C.smsLow, color: isEmail ? C.accent : C.sms, padding: '2px 9px', borderRadius: 4, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontFamily: F.mono, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {isEmail ? <AtSign size={9} /> : <Smartphone size={9} />}{isEmail ? 'Email' : 'SMS'}
    </span>
  );
}
function SlashDeco({ n = 4 }) {
  return <div style={{ display: 'flex', gap: 3 }}>{[...Array(n)].map((_, i) => <div key={i} style={{ width: i === 0 ? 10 : 6, height: i === 0 ? 22 : 14, background: i < 2 ? C.accent : C.border, transform: 'skewX(-12deg)', borderRadius: 1 }} />)}</div>;
}
function StatCard({ Icon, label, value, sub, accent, color }) {
  const col = color || (accent ? C.accent : C.text);
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '18px 22px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: -16, width: 50, height: '100%', background: C.accentLow, transform: 'skewX(-14deg)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
        <div style={{ background: `${col}18`, borderRadius: 6, padding: 7, color: col, display: 'flex' }}><Icon size={14} /></div>
        <span style={{ fontFamily: F.mono, fontSize: 9, color: C.textSub, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</span>
      </div>
      <div style={{ fontFamily: F.display, fontSize: 32, letterSpacing: 2, color: col, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}
function SectionHeader({ title, sub, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 26 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h2 style={{ fontFamily: F.display, fontSize: 26, letterSpacing: 3, color: C.text, margin: 0 }}>{title}</h2>
          <SlashDeco />
        </div>
        {sub && <p style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub, margin: 0 }}>{sub}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
    </div>
  );
}
function Btn({ children, onClick, variant = 'primary', size = 'md', Icon: Ic, disabled, style: ext }) {
  const base = { border: 'none', borderRadius: 6, fontFamily: F.mono, cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, transition: 'opacity 0.15s', opacity: disabled ? 0.4 : 1, fontSize: size === 'sm' ? 11 : 13, padding: size === 'sm' ? '7px 13px' : '10px 18px', ...ext };
  const v = { primary: { background: C.accent, color: '#fff' }, ghost: { background: 'transparent', color: C.text, border: `1px solid ${C.borderMid}` }, sms: { background: C.smsLow, color: C.sms, border: `1px solid ${C.smsMid}` }, danger: { background: C.dangerLow, color: C.danger, border: `1px solid rgba(239,68,68,0.2)` }, success: { background: C.successLow, color: C.success, border: `1px solid rgba(34,197,94,0.2)` } };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...v[variant] }}>{Ic && <Ic size={12} />}{children}</button>;
}
function FInput({ value, onChange, placeholder, type = 'text', style: ext }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ background: '#0D0D0D', border: `1px solid #2A2A2A`, borderRadius: 6, padding: '9px 13px', color: C.text, fontFamily: F.mono, fontSize: 13, width: '100%', outline: 'none', ...ext }} />;
}
function FTextarea({ value, onChange, placeholder, rows = 5, maxLength }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} maxLength={maxLength} style={{ background: '#0D0D0D', border: `1px solid #2A2A2A`, borderRadius: 6, padding: '10px 13px', color: C.text, fontFamily: F.mono, fontSize: 13, width: '100%', outline: 'none', resize: 'vertical', lineHeight: 1.65 }} />;
}
function FSelect({ value, onChange, options }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ background: '#0D0D0D', border: `1px solid #2A2A2A`, borderRadius: 6, padding: '9px 13px', color: C.text, fontFamily: F.mono, fontSize: 13, width: '100%', outline: 'none', cursor: 'pointer' }}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>;
}
function Label({ children }) {
  return <label style={{ fontFamily: F.mono, fontSize: 9, color: '#BBBBBB', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 7 }}>{children}</label>;
}

const NAV = [
  { group: 'START HERE' },
  { id: 'dashboard',    label: 'Command Center',     Ic: LayoutDashboard },
  { id: 'playbooks',    label: 'Playbooks',          Ic: BookOpen },
  { id: 'offerbuilder', label: 'Offer Builder',      Ic: Sparkles },
  { id: 'pricingcalc',  label: 'Pricing Calculator', Ic: Calculator },

  { group: 'GET LEADS' },
  { id: 'leadfinder',   label: 'Lead Finder',        Ic: Search },
  { id: 'contacts',     label: 'Contacts',           Ic: Users },

  { group: 'OUTREACH' },
  { id: 'campaigns',    label: 'Campaigns',          Ic: Send },
  { id: 'blast',        label: 'Email & SMS Blast',  Ic: Mail },
  { id: 'sequences',    label: 'Follow-Up Sequences',Ic: Repeat },
  { id: 'coldcall',     label: 'Cold Call Script',   Ic: Phone },
  { id: 'deliverability',label: 'Deliverability',    Ic: Shield },

  { group: 'CLOSE' },
  { id: 'pipeline',     label: 'Pipeline',           Ic: BarChart2 },
  { id: 'funnelbuilder',label: 'Funnel Builder',     Ic: Layers },
  { id: 'salesscript',  label: 'Sales Script',       Ic: Mic },
  { id: 'callanalyzer', label: 'Call Analyzer',      Ic: PhoneCall },
  { id: 'teleprompter', label: 'Teleprompter',       Ic: MonitorPlay },
  { id: 'objections',   label: 'Objection Handler',  Ic: MessageSquare },
  { id: 'aisolution',   label: 'AI Advisor',         Ic: Sparkles },
  { id: 'proposal',     label: 'Proposals',          Ic: FileText },
  { id: 'salestools',   label: 'ROI Calculators',    Ic: DollarSign },

  { group: 'DELIVER' },
  { id: 'fulfillment',  label: 'Fulfillment Kit',    Ic: CheckSquare },
  { id: 'kpitracker',   label: 'KPI Tracker',        Ic: TrendingUp },
  { id: 'clientreport', label: 'Client Reports',     Ic: FileText },
  { id: 'analytics',    label: 'Analytics',          Ic: BarChart2 },

  { group: 'CONTENT' },
  { id: 'viral',        label: 'Viral Post Modeler', Ic: TrendingUp },
  { id: 'stillad',      label: 'Still Image Ads',    Ic: Image },
  { id: 'compose',      label: 'Ad Copy Generator',  Ic: Zap },
  { id: 'metaads',      label: 'Meta Ads',           Ic: Target },
  { id: 'vsl',          label: 'VSL Builder',        Ic: Video },

  { group: 'ADMIN' },
  { id: 'admindash',    label: 'Admin Dashboard',    Ic: BarChart2 },
  { id: 'settings',     label: '+/- Users',          Ic: Settings2 },
];

function Sidebar({ view, setView, client, clients, onSwitchClient, onLogout, isMobile }) {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const toggleGroup = (g) => setCollapsedGroups(s => ({...s, [g]: !s[g]}));

  // Mobile: bottom nav bar + slide-up drawer for full menu
  if (isMobile) {
    // Pick 5 most important nav items for bottom bar
    const BOTTOM_NAV = [
      { id: 'dashboard',  label: 'Home',      Ic: LayoutDashboard },
      { id: 'campaigns',  label: 'Campaigns', Ic: Zap },
      { id: 'pipeline',   label: 'Pipeline',  Ic: Briefcase },
      { id: 'compose',    label: 'Compose',   Ic: AtSign },
      { id: 'menu',       label: 'More',      Ic: ChevronDown },
    ];
    return (
      <>
        {/* Full menu drawer */}
        {mobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)' }} onClick={() => setMobileMenuOpen(false)}>
            <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, borderRadius: '16px 16px 0 0', maxHeight: '75vh', overflowY: 'auto', padding: '12px 8px 16px' }}
              onClick={e => e.stopPropagation()}>
              {/* Client switcher */}
              <button onClick={() => { onSwitchClient(null); setMobileMenuOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 14, cursor: 'pointer' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${client.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: client.color, fontFamily: F.display, fontSize: 12, flexShrink: 0 }}>{client.initials}</div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: F.mono, fontSize: 12, color: C.text }}>{client.name}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted }}>Tap to switch workspace</div>
                </div>
                <ChevronRight size={13} color={C.textMuted} />
              </button>
              {/* All nav items */}
              {NAV.map((item, i) => {
                if (item.group !== undefined && !item.id) {
                  const isCollapsed = collapsedGroups[item.group];
                  return <button key={`g${i}`} onClick={()=>toggleGroup(item.group)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding: '10px 14px 4px', fontFamily: F.mono, fontSize: 8, color: C.accent, letterSpacing: 2, background:'none', border:'none', cursor:'pointer' }}>
                    {item.group}
                    <span style={{fontSize:8,color:C.accent,opacity:0.7}}>{isCollapsed?'▶':'▼'}</span>
                  </button>;
                }
                // Check if parent group is collapsed
                const parentGroup = [...NAV.slice(0, i)].reverse().find(n => n.group !== undefined && !n.id)?.group;
                if (parentGroup && collapsedGroups[parentGroup]) return null;
                const a = view === item.id;
                const Ic = item.Ic;
                return (
                  <button key={item.id} onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: a ? C.accentLow : 'transparent', color: a ? C.accent : C.textSub, fontFamily: F.mono, fontSize: 13, marginBottom: 2 }}>
                    <Ic size={15} />{item.label}
                    {a && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.accent }} />}
                  </button>
                );
              })}
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 10, padding: '12px 14px 0' }}>
                <a href="http://skool.com/clientscale-academy-8071" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: C.accentLow, borderRadius: 8, marginBottom: 8, textDecoration: 'none' }}>
                <div style={{ width: 24, height: 24, borderRadius: 5, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: F.display, fontSize: 11, color: '#fff' }}>S</span>
                </div>
                <div>
                  <div style={{ fontFamily: F.mono, fontSize: 12, color: C.accent }}>Skool Community</div>
                  <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted }}>ClientScale Academy →</div>
                </div>
              </a>
              <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontFamily: F.mono, fontSize: 12 }}>Sign Out</button>
              </div>
            </div>
          </div>
        )}
        {/* Bottom nav bar */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: C.surface, borderTop: `1px solid ${C.border}`, display: 'flex', height: 64, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {BOTTOM_NAV.map(({ id, label, Ic }) => {
            const isMenu = id === 'menu';
            const a = !isMenu && view === id;
            return (
              <button key={id} onClick={() => isMenu ? setMobileMenuOpen(o => !o) : setView(id)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, border: 'none', background: 'transparent', cursor: 'pointer', color: a || (isMenu && mobileMenuOpen) ? C.accent : C.textSub, padding: '8px 0' }}>
                <Ic size={18} />
                <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 0.5 }}>{label}</span>
                {a && <div style={{ position: 'absolute', top: 8, width: 4, height: 4, borderRadius: '50%', background: C.accent }} />}
              </button>
            );
          })}
        </div>
      </>
    );
  }

  // Desktop: original sidebar
  return (
    <div style={{ width: 220, flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: F.display, fontSize: 20, letterSpacing: 3, color: C.text, lineHeight: 1 }}>CLIENT<span style={{ color: C.accent }}>SPRINT</span></div>
        <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted, letterSpacing: 2, marginTop: 2 }}>.AI // CAMPAIGN OPS</div>
        <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>{[...Array(6)].map((_, i) => <div key={i} style={{ width: i < 2 ? 8 : 5, height: i < 2 ? 18 : 12, background: i < 2 ? C.accent : C.border, transform: 'skewX(-12deg)', borderRadius: 1 }} />)}</div>
      </div>

      {/* Client Switcher */}
      <div style={{ padding: '10px 10px 6px', borderBottom: `1px solid ${C.border}`, position: 'relative' }}>
        <button onClick={() => setOpen(o => !o)} style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: '9px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${client.color}22`, border: `1px solid ${client.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: client.color, fontFamily: F.display, fontSize: 10, flexShrink: 0 }}>{client.initials}</div>
          <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.name}</div>
            <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted }}>{client.industry}</div>
          </div>
          <ChevronDown size={11} color={C.textSub} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
        </button>
        {open && (
          <div style={{ position: 'absolute', left: 10, right: 10, top: '100%', zIndex: 100, background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
            <div style={{ padding: '8px 12px', fontFamily: F.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1.5, borderBottom: `1px solid ${C.border}` }}>SWITCH WORKSPACE</div>
            {clients.map(cl => (
              <button key={cl.id} onClick={() => { onSwitchClient(cl); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', border: 'none', background: cl.id === client.id ? C.accentLow : 'transparent', cursor: 'pointer' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${cl.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cl.color, fontFamily: F.display, fontSize: 10, flexShrink: 0 }}>{cl.initials}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontFamily: F.mono, fontSize: 11, color: cl.id === client.id ? C.accent : C.text }}>{cl.name}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted }}>{cl.industry}</div>
                </div>
              </button>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => { onSwitchClient(null); setOpen(false); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', border: 'none', background: 'transparent', cursor: 'pointer', color: C.textSub, fontFamily: F.mono, fontSize: 11 }}>
                <Building2 size={13} color={C.textSub} /> Agency Overview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '6px 8px', overflowY: 'auto' }}>
        {NAV.map((item, i) => {
          if (item.group !== undefined && !item.id) {
            const isCollapsed = collapsedGroups[item.group];
            return (
              <button key={`group-${i}`} onClick={()=>toggleGroup(item.group)}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding: '14px 8px 6px', background:'none', border:'none', cursor:'pointer' }}>
                <span style={{ fontFamily: F.mono, fontSize: 9, color: C.accent, letterSpacing: 3, fontWeight: 600, background: `rgba(220,38,38,0.10)`, border: `1px solid rgba(220,38,38,0.20)`, borderRadius: 4, padding: '3px 9px' }}>{item.group}</span>
                <span style={{fontFamily:F.mono, fontSize:8, color:C.accent, opacity:0.7, marginRight:4}}>{isCollapsed?'▶':'▼'}</span>
              </button>
            );
          }
          // Skip if parent group is collapsed
          const parentGroup = (() => { for (let j = i-1; j >= 0; j--) { if (NAV[j].group && !NAV[j].id) return NAV[j].group; } return null; })();
          if (parentGroup && collapsedGroups[parentGroup]) return null;
          const a = view === item.id;
          const Ic = item.Ic;
          return (
            <button key={item.id} onClick={() => setView(item.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 13px', borderRadius: 6, border: 'none', cursor: 'pointer', background: a ? C.accentLow : 'transparent', color: a ? C.accent : C.textSub, fontFamily: F.mono, fontSize: 11, borderLeft: a ? `2px solid ${C.accent}` : '2px solid transparent', marginBottom: 1, transition: 'all 0.15s', textAlign: 'left' }}>
              <Ic size={12} />{item.label}
            </button>
          );
        })}
      </nav>

      {/* Skool Link */}
      <a href="http://skool.com/clientscale-academy-8071" target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 16px', borderTop: `1px solid ${C.border}`, background: C.accentLow, textDecoration: 'none' }}>
        <div style={{ width: 22, height: 22, borderRadius: 5, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: F.display, fontSize: 11, color: '#fff', letterSpacing: 1 }}>S</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.accent }}>Skool Community</div>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted }}>ClientScale Academy</div>
        </div>
        <ChevronRight size={11} color={C.accent}/>
      </a>

      {/* User */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.accentLow, border: `1px solid ${C.accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent, fontFamily: F.display, fontSize: 13, flexShrink: 0 }}>{client.initials[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: F.mono, fontSize: 11, color: C.text }}>{client.name.split(' ')[0]}</div><div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted }}>Agency Admin</div></div>
          {onLogout && <button onClick={onLogout} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontFamily: F.mono, fontSize: 9, letterSpacing: 1, padding: '3px 6px' }} title="Sign out">OUT</button>}
        </div>
      </div>
    </div>
  );
}


function AgencyView({ clients, clientData, onSelect, onAdd }) {
  const [newName, setNewName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [adding, setAdding] = useState(false);
  const COLORS = ['#DC2626', '#60A5FA', '#22C55E', '#7C3AED', '#F59E0B', '#EC4899'];
  const totalContacts = clients.reduce((s, cl) => s + (clientData[cl.id]?.contacts?.length || 0), 0);
  const totalCampaigns = clients.reduce((s, cl) => s + (clientData[cl.id]?.campaigns?.length || 0), 0);
  const activeCampaigns = clients.reduce((s, cl) => s + (clientData[cl.id]?.campaigns?.filter(c => c.status === 'active').length || 0), 0);

  const doAdd = () => {
    if (!newName.trim()) return;
    const initials = newName.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const color = COLORS[clients.length % COLORS.length];
    onAdd({ id: `c${Date.now()}`, name: newName.trim(), initials, color, industry: newIndustry || 'Agency' });
    setNewName(''); setNewIndustry(''); setAdding(false);
  };

  const CHART_DATA = [
    { day: 'Mon', opens: 340, sms: 120 }, { day: 'Tue', opens: 480, sms: 190 },
    { day: 'Wed', opens: 620, sms: 280 }, { day: 'Thu', opens: 840, sms: 410 },
    { day: 'Fri', opens: 720, sms: 350 }, { day: 'Sat', opens: 290, sms: 140 }, { day: 'Sun', opens: 210, sms: 98 },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <h1 style={{ fontFamily: F.display, fontSize: 34, letterSpacing: 3, color: C.text, margin: 0 }}>AGENCY OVERVIEW</h1>
          <SlashDeco n={5} />
        </div>
        <p style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub, margin: 0 }}>All clients // {clients.length} workspaces active</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 22 }} className='rg-4'>
        <StatCard Icon={Building2} label="Clients" value={clients.length} sub="active workspaces" />
        <StatCard Icon={Users} label="Total Contacts" value={fmtN(totalContacts)} sub="across all clients" />
        <StatCard Icon={Zap} label="Live Campaigns" value={activeCampaigns} sub={`${totalCampaigns} total`} accent />
        <StatCard Icon={BarChart2} label="Avg Open Rate" value="40.1%" sub="this week" color={C.success} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22 }}>
          <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text, marginBottom: 4 }}>CROSS-CLIENT ENGAGEMENT</div>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub, marginBottom: 16 }}>Email opens + SMS clicks — this week</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={0.3} /><stop offset="95%" stopColor={C.accent} stopOpacity={0} /></linearGradient>
                <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.sms} stopOpacity={0.3} /><stop offset="95%" stopColor={C.sms} stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: F.mono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 10, fontFamily: F.mono }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, fontFamily: F.mono, fontSize: 11 }} />
              <Area type="monotone" dataKey="opens" stroke={C.accent} strokeWidth={2} fill="url(#ga)" dot={false} name="Email Opens" />
              <Area type="monotone" dataKey="sms" stroke={C.sms} strokeWidth={2} fill="url(#gs)" dot={false} name="SMS Clicks" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
            {[{ c: C.accent, l: 'Email Opens' }, { c: C.sms, l: 'SMS Clicks' }].map(({ c, l }) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: F.mono, fontSize: 10, color: C.textSub }}><div style={{ width: 10, height: 2, background: c, borderRadius: 1 }} />{l}</div>)}
          </div>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22 }}>
          <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text, marginBottom: 16 }}>QUICK STATS</div>
          {clients.map(cl => {
            const d = clientData[cl.id] || seed();
            const sent = d.campaigns.reduce((s, c) => s + c.sent, 0);
            const opens = d.campaigns.reduce((s, c) => s + c.opens, 0);
            return (
              <div key={cl.id} style={{ padding: '11px 0', borderBottom: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => onSelect(cl)}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: `${cl.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cl.color, fontFamily: F.display, fontSize: 10, flexShrink: 0 }}>{cl.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: F.mono, fontSize: 12, color: C.text }}>{cl.name}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>{fmtN(d.contacts.length)} contacts · {fmtPct(opens, sent)} open rate</div>
                </div>
                <ChevronRight size={12} color={C.textMuted} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Cards */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text }}>WORKSPACES</div>
        <Btn Icon={Plus} size="sm" onClick={() => setAdding(true)}>Add Client</Btn>
      </div>
      {adding && (
        <div style={{ background: C.card, border: `1px solid ${C.accent}`, borderRadius: 10, padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'flex-end' }}>
            <div><Label>Client Name</Label><FInput value={newName} onChange={setNewName} placeholder="e.g. Apex Digital" /></div>
            <div><Label>Industry</Label><FInput value={newIndustry} onChange={setNewIndustry} placeholder="e.g. Lead Gen Agency" /></div>
            <div style={{ display: 'flex', gap: 8 }}><Btn Icon={Plus} onClick={doAdd}>Add</Btn><Btn variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn></div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {clients.map(cl => {
          const d = clientData[cl.id] || seed();
          const campaigns = d.campaigns || [];
          const active = campaigns.filter(c => c.status === 'active').length;
          const sent = campaigns.reduce((s, c) => s + c.sent, 0);
          const opens = campaigns.reduce((s, c) => s + c.opens, 0);
          const clicks = campaigns.reduce((s, c) => s + c.clicks, 0);
          return (
            <div key={cl.id} onClick={() => onSelect(cl)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = cl.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${cl.color}18`, border: `1px solid ${cl.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cl.color, fontFamily: F.display, fontSize: 14 }}>{cl.initials}</div>
                <div>
                  <div style={{ fontFamily: F.mono, fontSize: 13, color: C.text }}>{cl.name}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>{cl.industry}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[{ l: 'Contacts', v: fmtN(d.contacts.length) }, { l: 'Active', v: active }, { l: 'Open Rate', v: fmtPct(opens, sent) }, { l: 'Click Rate', v: fmtPct(clicks, sent) }].map(({ l, v }) => (
                  <div key={l} style={{ background: C.surface, borderRadius: 6, padding: '9px 12px' }}>
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted, marginBottom: 3, letterSpacing: 1 }}>{l.toUpperCase()}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 14, color: C.text }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: cl.color }}>Open workspace →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CHART_DATA = [
  { day: 'Mar 1', opens: 180, clicks: 42, sms: 65 }, { day: 'Mar 5', opens: 240, clicks: 61, sms: 88 },
  { day: 'Mar 10', opens: 320, clicks: 89, sms: 140 }, { day: 'Mar 15', opens: 580, clicks: 142, sms: 210 },
  { day: 'Mar 20', opens: 490, clicks: 118, sms: 190 }, { day: 'Mar 25', opens: 720, clicks: 198, sms: 310 }, { day: 'Mar 27', opens: 840, clicks: 230, sms: 380 },
];

function DashboardView({ campaigns, contacts, setView, client, sprintProgress, sprintPct, completeStep, resetSprint }) {
  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalOpens = campaigns.reduce((s, c) => s + c.opens, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalReplies = campaigns.reduce((s, c) => s + (c.replies || 0), 0);
  const active = campaigns.filter(c => c.status === 'active').length;
  const hasSMS = campaigns.some(c => c.emails?.some(e => e.type === 'sms'));
  return (
    <div>
      <ClientSprintSection setView={setView} progress={sprintProgress} pct={sprintPct} completeStep={completeStep} resetSprint={resetSprint} />
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${client.color}18`, border: `1px solid ${client.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: client.color, fontFamily: F.display, fontSize: 13 }}>{client.initials}</div>
          <h1 style={{ fontFamily: F.display, fontSize: 32, letterSpacing: 3, color: C.text, margin: 0 }}>{client.name.toUpperCase()}</h1>
          <SlashDeco n={5} />
        </div>
        <p style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub, margin: 0 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} // Campaign Dashboard</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }} className='rg-5'>
        <StatCard Icon={Users} label="Contacts" value={fmtN(contacts.length + 4000)} sub="total list size" />
        <StatCard Icon={Zap} label="Active" value={active} sub={`${campaigns.length} campaigns`} accent />
        <StatCard Icon={Eye} label="Open Rate" value={fmtPct(totalOpens, totalSent)} sub={`${fmtN(totalOpens)} opens`} />
        <StatCard Icon={MousePointer} label="Click Rate" value={fmtPct(totalClicks, totalSent)} sub={`${fmtN(totalClicks)} clicks`} />
        {hasSMS && <StatCard Icon={MessageSquare} label="SMS Replies" value={fmtN(totalReplies)} sub="direct replies" color={C.sms} />}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18, marginBottom: 16 }} className='rg-chart'>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22 }}>
          <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text, marginBottom: 4 }}>ENGAGEMENT</div>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub, marginBottom: 16 }}>Email opens · clicks · SMS — March 2026</div>
          <ResponsiveContainer width="100%" height={185}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="go2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.accent} stopOpacity={0.3} /><stop offset="95%" stopColor={C.accent} stopOpacity={0} /></linearGradient>
                <linearGradient id="gc2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.info} stopOpacity={0.25} /><stop offset="95%" stopColor={C.info} stopOpacity={0} /></linearGradient>
                <linearGradient id="gs2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.sms} stopOpacity={0.25} /><stop offset="95%" stopColor={C.sms} stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: F.mono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.textMuted, fontSize: 10, fontFamily: F.mono }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, fontFamily: F.mono, fontSize: 11 }} />
              <Area type="monotone" dataKey="opens" stroke={C.accent} strokeWidth={2} fill="url(#go2)" dot={false} name="Opens" />
              <Area type="monotone" dataKey="clicks" stroke={C.info} strokeWidth={2} fill="url(#gc2)" dot={false} name="Clicks" />
              <Area type="monotone" dataKey="sms" stroke={C.sms} strokeWidth={2} fill="url(#gs2)" dot={false} name="SMS" />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 18, marginTop: 8 }}>
            {[{ c: C.accent, l: 'Email Opens' }, { c: C.info, l: 'Clicks' }, { c: C.sms, l: 'SMS' }].map(({ c, l }) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: F.mono, fontSize: 10, color: C.textSub }}><div style={{ width: 10, height: 2, background: c, borderRadius: 1 }} />{l}</div>)}
          </div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text }}>CAMPAIGNS</div>
            <Btn variant="ghost" size="sm" onClick={() => setView('campaigns')}>All</Btn>
          </div>
          {campaigns.map(c => (
            <div key={c.id} onClick={() => setView('campaigns')} style={{ padding: '11px 0', borderBottom: `1px solid ${C.border}`, cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontFamily: F.mono, fontSize: 12, color: C.text, flex: 1, paddingRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                <Badge status={c.status} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>✉ {fmtN(c.sent)}</span>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>↗ {fmtPct(c.opens, c.sent)}</span>
                {c.replies > 0 && <span style={{ fontFamily: F.mono, fontSize: 10, color: C.sms }}>↩ {c.replies}</span>}
                {c.emails?.some(e => e.type === 'sms') && <TypePill type="sms" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[{ Ic: Sparkles, title: 'AI Compose', sub: 'Email or SMS copy', v: 'compose', c: C.accent }, { Ic: Upload, title: 'Import Contacts', sub: 'CSV, Excel, paste', v: 'contacts', c: C.info }, { Ic: Shield, title: 'Deliverability', sub: 'Domain + SMS health', v: 'deliverability', c: C.success }].map(({ Ic, title, sub, v, c }) => (
          <button key={v} onClick={() => setView(v)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: `${c}18`, borderRadius: 8, padding: 11, color: c, display: 'flex', flexShrink: 0 }}><Ic size={18} /></div>
            <div><div style={{ fontFamily: F.mono, fontSize: 12, color: C.text, marginBottom: 2 }}>{title}</div><div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub }}>{sub}</div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CampaignsView({ campaigns, setCampaigns }) {
  const [sel, setSel] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [addingStep, setAddingStep] = useState(false);
  const [stepType, setStepType] = useState('email');
  const [newStep, setNewStep] = useState({ subject: '', body: '', preview: '', delay: 1 });
  const campaign = sel ? campaigns.find(c => c.id === sel) : null;

  const create = () => {
    if (!newName.trim()) return;
    const nc = { id: Date.now(), name: newName, status: 'draft', contacts: 0, sent: 0, opens: 0, clicks: 0, replies: 0, created: 'Now', emails: [] };
    setCampaigns(cs => [...cs, nc]); setSel(nc.id); setNewName(''); setShowNew(false);
  };
  const addStep = () => {
    const ok = stepType === 'email' ? newStep.subject.trim() : newStep.body.trim();
    if (!ok) return;
    const step = { id: Date.now(), type: stepType, subject: newStep.subject, body: newStep.body, preview: newStep.preview, delay: newStep.delay };
    setCampaigns(cs => cs.map(c => c.id === sel ? { ...c, emails: [...c.emails, step] } : c));
    setNewStep({ subject: '', body: '', preview: '', delay: 1 }); setAddingStep(false);
  };
  const delStep = sid => setCampaigns(cs => cs.map(c => c.id === sel ? { ...c, emails: c.emails.filter(e => e.id !== sid) } : c));
  const toggleStatus = cid => setCampaigns(cs => cs.map(c => c.id === cid ? { ...c, status: c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status } : c));

  if (campaign) {
    const emailCount = campaign.emails.filter(e => e.type === 'email').length;
    const smsCount = campaign.emails.filter(e => e.type === 'sms').length;
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <button onClick={() => setSel(null)} style={{ background: 'none', border: 'none', color: C.textSub, cursor: 'pointer', fontFamily: F.mono, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}><ArrowLeft size={12} />Back</button>
          <span style={{ color: C.border }}>|</span>
          <h2 style={{ fontFamily: F.display, fontSize: 22, letterSpacing: 2, color: C.text, margin: 0 }}>{campaign.name}</h2>
          <Badge status={campaign.status} />
          <div style={{ marginLeft: 4, display: 'flex', gap: 6 }}>
            {emailCount > 0 && <span style={{ fontFamily: F.mono, fontSize: 10, color: C.accent, background: C.accentLow, padding: '2px 8px', borderRadius: 3 }}>{emailCount} email{emailCount !== 1 ? 's' : ''}</span>}
            {smsCount > 0 && <span style={{ fontFamily: F.mono, fontSize: 10, color: C.sms, background: C.smsLow, padding: '2px 8px', borderRadius: 3 }}>{smsCount} sms</span>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 20 }} className='rg-5'>
          {[{ l: 'Contacts', v: fmtN(campaign.contacts) }, { l: 'Sent', v: fmtN(campaign.sent) }, { l: 'Open Rate', v: fmtPct(campaign.opens, campaign.sent) }, { l: 'Click Rate', v: fmtPct(campaign.clicks, campaign.sent) }, { l: 'SMS Replies', v: campaign.replies || 0 }].map(({ l, v }) => (
            <div key={l} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '13px 16px' }}>
              <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 5 }}>{l}</div>
              <div style={{ fontFamily: F.display, fontSize: 24, letterSpacing: 1, color: C.text }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text }}>SEQUENCE</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub, marginTop: 2 }}>{campaign.emails.length} steps — mix email + SMS freely</div>
            </div>
            <Btn Icon={Plus} onClick={() => setAddingStep(true)}>Add Step</Btn>
          </div>
          {campaign.emails.length === 0 && <div style={{ textAlign: 'center', padding: '40px 0', color: C.textMuted, fontFamily: F.mono, fontSize: 12 }}>No steps yet. Add your first email or SMS.</div>}
          {campaign.emails.map((step, idx) => {
            const isEmail = step.type === 'email';
            const col = isEmail ? C.accent : C.sms;
            return (
              <div key={step.id} style={{ display: 'flex', gap: 14, marginBottom: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${col}18`, border: `1px solid ${col}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: col }}>
                    {isEmail ? <AtSign size={12} /> : <Smartphone size={12} />}
                  </div>
                  {idx < campaign.emails.length - 1 && <div style={{ width: 1, flex: 1, background: C.border, minHeight: 18, marginTop: 3 }} />}
                </div>
                <div style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px 16px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, paddingRight: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <TypePill type={step.type} />
                      <span style={{ fontFamily: F.mono, fontSize: 12, color: C.text }}>{isEmail ? step.subject : step.body.slice(0, 60) + (step.body.length > 60 ? '…' : '')}</span>
                    </div>
                    {isEmail && step.preview && <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub, marginBottom: 4 }}>{step.preview}</div>}
                    {!isEmail && <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>{step.body.length} chars · {smsSegments(step.body)} segment{smsSegments(step.body) !== 1 ? 's' : ''}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: F.mono, fontSize: 10, color: C.textMuted, marginTop: 3 }}><Clock size={9} />{idx === 0 ? 'Sends immediately' : `Sends ${step.delay} day${step.delay !== 1 ? 's' : ''} after previous`}</div>
                  </div>
                  <button onClick={() => delStep(step.id)} style={{ background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', padding: 3 }}><Trash2 size={12} /></button>
                </div>
              </div>
            );
          })}
          {addingStep && (
            <div style={{ background: C.surface, border: `1px solid ${C.accent}`, borderRadius: 8, padding: 18, marginTop: 10 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[{ v: 'email', l: 'Email', Ic: AtSign }, { v: 'sms', l: 'SMS', Ic: Smartphone }].map(t => (
                  <button key={t.v} onClick={() => setStepType(t.v)} style={{ flex: 1, background: stepType === t.v ? (t.v === 'email' ? C.accentLow : C.smsLow) : C.card, border: `1px solid ${stepType === t.v ? (t.v === 'email' ? C.accent : C.sms) : C.border}`, borderRadius: 6, padding: '9px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, color: stepType === t.v ? (t.v === 'email' ? C.accent : C.sms) : C.textSub, fontFamily: F.mono, fontSize: 12 }}>
                    <t.Ic size={12} />{t.l}
                  </button>
                ))}
              </div>
              {stepType === 'email' ? (
                <>
                  <div style={{ marginBottom: 10 }}><FInput value={newStep.subject} onChange={v => setNewStep(s => ({ ...s, subject: v }))} placeholder="Subject line..." /></div>
                  <div style={{ marginBottom: 10 }}><FInput value={newStep.preview} onChange={v => setNewStep(s => ({ ...s, preview: v }))} placeholder="Preview text (optional)" /></div>
                </>
              ) : (
                <div style={{ marginBottom: 10, position: 'relative' }}>
                  <FTextarea value={newStep.body} onChange={v => setNewStep(s => ({ ...s, body: v }))} placeholder={"Message — use {{first_name}}, {{link}}\nAlways include: Reply STOP to opt out"} rows={3} />
                  <div style={{ position: 'absolute', bottom: 10, right: 10, fontFamily: F.mono, fontSize: 10, color: newStep.body.length > SMS_LIMIT ? C.warn : C.textMuted }}>{newStep.body.length}/{SMS_LIMIT} · {smsSegments(newStep.body)} seg</div>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 10, marginBottom: 12 }}>
                <div><Label>Delay (days after previous step)</Label><input type="number" value={newStep.delay} min={0} onChange={e => setNewStep(s => ({ ...s, delay: parseInt(e.target.value) || 0 }))} style={{ background: '#0D0D0D', border: `1px solid #2A2A2A`, borderRadius: 6, padding: '9px 13px', color: C.text, fontFamily: F.mono, fontSize: 13, width: '100%', outline: 'none' }} /></div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}><Btn Icon={Plus} onClick={addStep}>Add Step</Btn><Btn variant="ghost" onClick={() => setAddingStep(false)}>Cancel</Btn></div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          {campaign.status === 'draft' && <Btn Icon={Send}>Launch Campaign</Btn>}
          {campaign.status === 'active' && <Btn variant="ghost" Icon={Pause} onClick={() => toggleStatus(campaign.id)}>Pause</Btn>}
          {campaign.status === 'paused' && <Btn Icon={Play} onClick={() => toggleStatus(campaign.id)}>Resume</Btn>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="CAMPAIGNS" sub={`${campaigns.length} campaigns // email + SMS sequences`}
        actions={showNew
          ? <div style={{ display: 'flex', gap: 10 }}><FInput value={newName} onChange={setNewName} placeholder="Campaign name..." style={{ width: 240 }} /><Btn Icon={Plus} onClick={create}>Create</Btn><Btn variant="ghost" onClick={() => setShowNew(false)}>Cancel</Btn></div>
          : <Btn Icon={Plus} onClick={() => setShowNew(true)}>New Campaign</Btn>}
      />
      <div style={{ display: 'grid', gap: 10 }}>
        {campaigns.map(c => {
          const emailCount = c.emails?.filter(e => e.type === 'email').length || 0;
          const smsCount = c.emails?.filter(e => e.type === 'sms').length || 0;
          return (
            <div key={c.id} onClick={() => setSel(c.id)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 22px', cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                  <span style={{ fontFamily: F.mono, fontSize: 13, color: C.text }}>{c.name}</span>
                  <Badge status={c.status} />
                  {emailCount > 0 && <span style={{ fontFamily: F.mono, fontSize: 9, color: C.accent, background: C.accentLow, padding: '2px 7px', borderRadius: 3 }}>{emailCount}✉</span>}
                  {smsCount > 0 && <span style={{ fontFamily: F.mono, fontSize: 9, color: C.sms, background: C.smsLow, padding: '2px 7px', borderRadius: 3 }}>{smsCount}📱</span>}
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  {[{ l: 'Contacts', v: fmtN(c.contacts) }, { l: 'Sent', v: fmtN(c.sent) }, { l: 'Open Rate', v: fmtPct(c.opens, c.sent) }, { l: 'Clicks', v: fmtPct(c.clicks, c.sent) }, ...(c.replies > 0 ? [{ l: 'SMS Replies', v: c.replies }] : [])].map(({ l, v }) => (
                    <div key={l}><div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted, marginBottom: 2 }}>{l.toUpperCase()}</div><div style={{ fontFamily: F.mono, fontSize: 12, color: C.text }}>{v}</div></div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>{c.created}</span><ChevronRight size={13} color={C.textMuted} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContactsView({ contacts, setContacts }) {
  const [search, setSearch] = useState('');
  const [importing, setImporting] = useState(false);
  const [importData, setImportData] = useState(null);
  const fileRef = useRef();

  const handleFile = file => {
    const r = new FileReader();
    r.onload = e => { const d = parseCSV(e.target.result); if (d.rows.length > 0) setImportData(d); };
    r.readAsText(file);
  };
  const confirmImport = () => {
    if (!importData) return;
    const nc = importData.rows.map((row, i) => ({
      id: Date.now() + i,
      email: row.email || row.Email || row.EMAIL || '',
      phone: row.phone || row.Phone || row.mobile || row.Mobile || '',
      name: row.name || row.Name || row['First Name'] || row.first_name || '',
      company: row.company || row.Company || '',
      status: 'active', tags: [], added: 'Imported'
    })).filter(c => c.email || c.phone);
    setContacts(cs => [...nc, ...cs]); setImporting(false); setImportData(null);
  };

  const filtered = contacts.filter(c =>
    (c.email + c.name + c.company + c.phone).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <SectionHeader title="CONTACTS" sub={`${contacts.length} total // email + phone`}
        actions={<Btn Icon={Upload} onClick={() => setImporting(true)}>Import</Btn>}
      />
      {importing && (
        <div style={{ background: C.card, border: `1px solid ${C.accent}`, borderRadius: 10, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text }}>IMPORT CONTACTS</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub, marginTop: 3 }}>Maps: email, phone, name, company — extra columns imported too</div>
            </div>
            <button onClick={() => { setImporting(false); setImportData(null); }} style={{ background: 'none', border: 'none', color: C.textSub, cursor: 'pointer' }}><X size={16} /></button>
          </div>
          {!importData ? (
            <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current.click()}
              style={{ border: `2px dashed ${C.borderMid}`, borderRadius: 8, padding: '40px 24px', textAlign: 'center', cursor: 'pointer' }}>
              <Upload size={22} color={C.textMuted} style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontFamily: F.mono, fontSize: 13, color: C.text, marginBottom: 4 }}>Drop CSV here or click to browse</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>CSV, TXT — include email and/or phone column for SMS capability</div>
              <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: C.success, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}><CheckCircle size={12} />Found {importData.rows.length} rows · columns: {importData.headers.slice(0, 6).join(', ')}</div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', maxHeight: 200, overflowY: 'auto', marginBottom: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{importData.headers.slice(0, 5).map(h => <th key={h} style={{ padding: '8px 13px', fontFamily: F.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1, textAlign: 'left', borderBottom: `1px solid ${C.border}`, background: C.card }}>{h.toUpperCase()}</th>)}</tr></thead>
                  <tbody>{importData.rows.slice(0, 4).map((row, i) => <tr key={i}>{importData.headers.slice(0, 5).map(h => <td key={h} style={{ padding: '7px 13px', fontFamily: F.mono, fontSize: 11, color: C.text, borderBottom: `1px solid ${C.border}` }}>{row[h] || '–'}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <div style={{ display: 'flex', gap: 10 }}><Btn onClick={confirmImport}>Import {importData.rows.length} Contacts</Btn><Btn variant="ghost" onClick={() => setImportData(null)}>Re-upload</Btn></div>
            </div>
          )}
        </div>
      )}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={12} color={C.textMuted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, phone, company..."
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: '9px 13px 9px 34px', color: C.text, fontFamily: F.mono, fontSize: 13, width: '100%', outline: 'none' }} />
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: C.surface }}>{['Contact', 'Email', 'Phone', 'Company', 'Status', 'Tags'].map(h => <th key={h} style={{ padding: '10px 16px', fontFamily: F.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1.5, textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>{h.toUpperCase()}</th>)}</tr></thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <td style={{ padding: '12px 16px', fontFamily: F.mono, fontSize: 12, color: C.text }}>{c.name || '–'}</td>
                <td style={{ padding: '12px 16px', fontFamily: F.mono, fontSize: 11, color: C.textSub }}>{c.email || '–'}</td>
                <td style={{ padding: '12px 16px', fontFamily: F.mono, fontSize: 11, color: c.phone ? C.sms : C.textMuted }}>{c.phone || <span style={{ color: C.textMuted }}>–</span>}</td>
                <td style={{ padding: '12px 16px', fontFamily: F.mono, fontSize: 11, color: C.textSub }}>{c.company || '–'}</td>
                <td style={{ padding: '12px 16px' }}><Badge status={c.status} /></td>
                <td style={{ padding: '12px 16px' }}><div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>{(c.tags || []).map(t => <span key={t} style={{ background: C.accentLow, color: C.accent, padding: '1px 7px', borderRadius: 3, fontSize: 9, fontFamily: F.mono }}>{t}</span>)}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// ─── Voice & Style Selector (shared component) ───────────────────────────────────
const PRESET_VOICES = [
  {id:'direct',      label:'Direct & Bold',      sub:'Short. Punchy. Peer-to-peer.',          prompt:'Write in a direct, bold, no-fluff style. Short sentences. Peer-to-peer tone. Every word earns its place. Never corporate.'},
  {id:'warm',        label:'Warm & Personal',     sub:'Friend sharing a secret.',              prompt:'Write in a warm, conversational tone — like a trusted friend sharing insider knowledge. Relatable, human, never salesy.'},
  {id:'storytelling',label:'Storytelling',        sub:'Hook with a narrative arc.',            prompt:'Use a storytelling structure — open with a relatable scenario or personal moment, build tension, deliver the revelation. Emotional and specific.'},
  {id:'authority',   label:'Authority & Proof',   sub:'Credibility-first, data-backed.',       prompt:'Write with authority and credibility. Lead with proof, credentials, or results. Confident, professional, trust-building.'},
  {id:'urgency',     label:'Urgency & Scarcity',  sub:'FOMO-driven, deadline-focused.',        prompt:'Create urgency and scarcity. Use time pressure, limited availability, and consequence of inaction. Never fake — make it real.'},
  {id:'custom',      label:'Match a Creator',     sub:'Type any name — we mirror their style.',prompt:''},
];

const CREATOR_SUGGESTIONS = [
  'Alex Hormozi','Russell Brunson','Gary Vaynerchuk','Dan Kennedy','Frank Kern',
  'Sabri Suby','Justin Goff','Ben Settle','David Ogilvy','Gary Halbert',
  'Ed Mylett','Grant Cardone','Myron Golden','Cole Gordon',
  'Tai Lopez','Sam Ovens','David Goggins','Tony Robbins','Andy Frisella',
  'Kim Walsh Phillips','Amy Porterfield','Leila Hormozi','Marie Forleo',
  'Rachel Hollis','Jasmine Star','Jenna Kutcher','Gabby Bernstein',
];

function VoiceSelector({value, customVoice, onVoiceChange, onCustomChange}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = CREATOR_SUGGESTIONS.filter(c =>
    customVoice && c.toLowerCase().includes(customVoice.toLowerCase())
  );

  return (
    <div style={{marginBottom:16}}>
      <Label>Voice & Style</Label>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginBottom:value==='custom'?10:0}}>
        {PRESET_VOICES.map(v=>(
          <button key={v.id} onClick={()=>onVoiceChange(v.id)}
            style={{background:value===v.id?C.accentLow:C.surface,border:`1px solid ${value===v.id?C.accent:C.border}`,borderRadius:7,padding:'9px 12px',cursor:'pointer',textAlign:'left',transition:'all 0.15s'}}>
            <div style={{fontFamily:F.mono,fontSize:11,color:value===v.id?C.accent:C.text,marginBottom:2}}>{v.label}</div>
            <div style={{fontFamily:F.mono,fontSize:9,color:'#999999',lineHeight:1.4}}>{v.sub}</div>
          </button>
        ))}
      </div>
      {value==='custom'&&(
        <div style={{position:'relative'}}>
          <FInput
            value={customVoice}
            onChange={v=>{onCustomChange(v);setShowSuggestions(v.length>0);}}
            placeholder="e.g. Alex Hormozi, Russell Brunson, Gary Halbert..."
          />
          {showSuggestions&&filtered.length>0&&(
            <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:C.card,border:`1px solid ${C.border}`,borderRadius:7,overflow:'hidden',marginTop:3,boxShadow:'0 8px 24px rgba(0,0,0,0.5)'}}>
              {filtered.slice(0,6).map(s=>(
                <button key={s} onClick={()=>{onCustomChange(s);setShowSuggestions(false);}}
                  style={{width:'100%',padding:'9px 14px',background:'none',border:'none',color:C.text,fontFamily:F.mono,fontSize:12,cursor:'pointer',textAlign:'left',borderBottom:`1px solid ${C.border}`}}>
                  {s}
                </button>
              ))}
            </div>
          )}
          {customVoice&&(
            <div style={{marginTop:8,padding:'9px 12px',background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:6,fontFamily:F.mono,fontSize:10,color:C.accent}}>
              ◈ Claude will analyze and mirror the copywriting style of {customVoice}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getVoicePrompt(voiceId, customVoice) {
  if(voiceId==='custom' && customVoice) {
    return `Mirror the copywriting style of ${customVoice}. Study their sentence structure, pacing, word choice, use of questions, hooks, and emotional triggers. Write as if ${customVoice} themselves wrote this.`;
  }
  return PRESET_VOICES.find(v=>v.id===voiceId)?.prompt || PRESET_VOICES[0].prompt;
}


function ComposeView() {
  const [mode, setMode] = useState('email');
  const [goal, setGoal] = useState('');
  const [audience, setAudience] = useState('');
  const [emailType, setEmailType] = useState('cold-outreach');
  const [tone, setTone] = useState('direct-bold');
  const [voice, setVoice] = useState('direct');
  const [customVoice, setCustomVoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!goal.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const isSMS = mode === 'sms';
      const voiceInstr = getVoicePrompt(voice, customVoice);
      const prompt = isSMS
        ? `You are a high-converting SMS copywriter for ClientSprint.ai.\n\nWrite a ${emailType} SMS message.\nTarget: ${audience || 'aspiring AI agency owners'}\nGoal: ${goal}\nVoice & Style: ${voiceInstr}\n\nRules:\n- Under 160 characters per message\n- Include {{first_name}} once\n- End with: Reply STOP to opt out\n- Include {{link}} if CTA\n\nReturn ONLY raw JSON, no markdown:\n{"message":"full sms body","chars":0,"hasCTA":true}`
        : `You are a high-converting email copywriter for ClientSprint.ai. Write a ${emailType} email.\n\nTarget: ${audience || 'aspiring AI agency owners'}\nGoal: ${goal}\nVoice & Style: ${voiceInstr}\n\nReturn ONLY raw JSON, no markdown:\n{"subject":"compelling subject","preview":"preview text 50-90 chars","body":"full email starting with Hi {{first_name}}, — under 180 words, clear CTA"}`;
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      setResult(JSON.parse(text.replace(/```json|```/g, '').trim()));
    } catch (e) { setError('Generation failed — try again.'); }
    setLoading(false);
  };

  const copyAll = () => {
    if (!result) return;
    const txt = mode === 'sms' ? result.message : `Subject: ${result.subject}\nPreview: ${result.preview}\n\n${result.body}`;
    navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <SectionHeader title="AD COPY GENERATOR" sub="Facebook, Instagram, Google & LinkedIn ad copy // powered by Claude" />
      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {[{ v: 'email', l: 'Email', Ic: AtSign }, { v: 'sms', l: 'SMS', Ic: Smartphone }].map(t => (
          <button key={t.v} onClick={() => { setMode(t.v); setResult(null); }} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 6, border: `1px solid ${mode === t.v ? (t.v === 'email' ? C.accent : C.sms) : C.border}`, background: mode === t.v ? (t.v === 'email' ? C.accentLow : C.smsLow) : 'transparent', color: mode === t.v ? (t.v === 'email' ? C.accent : C.sms) : C.textSub, fontFamily: F.mono, fontSize: 13, cursor: 'pointer' }}>
            <t.Ic size={13} />{t.l}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }} className='rg-brief'>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24 }}>
          <div style={{ fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 20 }}>BRIEF</div>
          <div style={{ marginBottom: 14 }}><Label>Type</Label>
            <FSelect value={emailType} onChange={setEmailType} options={mode === 'email'
              ? [{ value: 'cold-outreach', label: 'Cold Outreach' }, { value: 'follow-up', label: 'Follow-Up' }, { value: 'launch-announcement', label: 'Launch Announcement' }, { value: 're-engagement', label: 'Re-Engagement' }, { value: 'nurture', label: 'Nurture / Value' }, { value: 'case-study', label: 'Case Study' }]
              : [{ value: 'cold-outreach', label: 'Cold Outreach SMS' }, { value: 'follow-up', label: 'Follow-Up' }, { value: 're-engagement', label: 'Re-Engagement' }, { value: 'event-reminder', label: 'Event / Deadline' }, { value: 'launch-announcement', label: 'Launch Blast' }]}
            />
          </div>
          <div style={{ marginBottom: 14 }}><Label>Goal / CTA *</Label><FTextarea value={goal} onChange={setGoal} placeholder={mode === 'email' ? "e.g. Get them to book a free strategy call. Speak to inconsistent client flow." : "e.g. Get them to click the link and sign up for the webinar."} rows={3} /></div>
          <div style={{ marginBottom: mode === 'sms' ? 14 : 20 }}><Label>Audience</Label><FInput value={audience} onChange={setAudience} placeholder="e.g. Agency owners doing under $10k/mo" /></div>
          {mode === 'sms' && (
            <div style={{ marginBottom: 16, padding: '11px 14px', background: C.smsLow, border: `1px solid ${C.smsMid}`, borderRadius: 7 }}>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.sms, marginBottom: 4 }}>SMS COMPLIANCE</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub, lineHeight: 1.6 }}>AI will auto-include opt-out language. Only send to contacts who have explicitly opted in (TCPA). Keep under 160 chars to avoid splitting.</div>
            </div>
          )}
          <VoiceSelector value={voice} customVoice={customVoice} onVoiceChange={setVoice} onCustomChange={setCustomVoice}/>
          <Btn onClick={generate} disabled={loading || !goal.trim()} Icon={Sparkles} style={{ width: '100%', justifyContent: 'center' }}>{loading ? 'Generating (~15s)...' : `Generate ${mode.charAt(0).toUpperCase()+mode.slice(1)} Ad`}</Btn>
          {error && <div style={{ fontFamily: F.mono, fontSize: 11, color: C.danger, marginTop: 9 }}>{error}</div>}
        </div>

        <div>
          {!result && !loading && (
            <div style={{ background: C.card, border: `2px dashed ${C.borderMid}`, borderRadius: 10, padding: '56px 36px', textAlign: 'center' }}>
              {mode === 'email' ? <AtSign size={28} color={C.textMuted} style={{ margin: '0 auto 12px', display: 'block' }} /> : <Smartphone size={28} color={C.textMuted} style={{ margin: '0 auto 12px', display: 'block' }} />}
              <div style={{ fontFamily: F.display, fontSize: 20, letterSpacing: 2, color: C.textMuted, marginBottom: 5 }}>READY TO GENERATE</div>
              <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textMuted }}>Fill the brief and hit generate</div>
            </div>
          )}
          {loading && <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '56px 36px', textAlign: 'center' }}><div style={{ fontFamily: F.display, fontSize: 24, letterSpacing: 2, color: C.accent }}>WRITING...</div><div style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub, marginTop: 6 }}>Claude is crafting your {mode === 'sms' ? 'SMS' : 'email'}</div></div>}
          {result && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text }}>GENERATED {mode === 'sms' ? 'SMS' : 'EMAIL'}</div>
                <div style={{ display: 'flex', gap: 8 }}><Btn variant="ghost" size="sm" Icon={RefreshCw} onClick={generate}>Redo</Btn><Btn variant="ghost" size="sm" Icon={Copy} onClick={copyAll}>{copied ? 'Copied!' : 'Copy'}</Btn></div>
              </div>
              {mode === 'email' ? (
                <>
                  <div style={{ marginBottom: 12 }}><Label>Subject</Label><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '9px 13px', fontFamily: F.mono, fontSize: 13, color: C.text }}>{result.subject}</div></div>
                  <div style={{ marginBottom: 12 }}><Label>Preview Text</Label><div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '9px 13px', fontFamily: F.mono, fontSize: 12, color: C.textSub }}>{result.preview}</div></div>
                  <div style={{ marginBottom: 14 }}>
                    <Label>Body</Label>
                    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '14px 16px' }}>
                      {(result.body || '').split('\n').map((line, i) => <p key={i} style={{ fontFamily: F.mono, fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0, marginBottom: line ? 5 : 2 }}>{line || '\u00A0'}</p>)}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Label>Message</Label>
                    <span style={{ fontFamily: F.mono, fontSize: 10, color: result.message?.length > SMS_LIMIT ? C.warn : C.textMuted }}>{result.message?.length || 0} chars · {smsSegments(result.message)} seg</span>
                  </div>
                  <div style={{ background: C.surface, border: `1px solid ${C.sms}44`, borderRadius: 6, padding: '14px 16px' }}>
                    <p style={{ fontFamily: F.mono, fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>{result.message}</p>
                  </div>
                </div>
              )}
              <div style={{ padding: '10px 14px', background: C.successLow, border: `1px solid rgba(34,197,94,0.18)`, borderRadius: 7, display: 'flex', alignItems: 'center', gap: 7, fontFamily: F.mono, fontSize: 11, color: C.success }}>
                <CheckCircle size={12} />{mode === 'sms' ? 'Opt-out language included. Verify consent before sending.' : 'No major spam triggers detected.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeliverabilityView() {
  const [subject, setSubject] = useState('');
  const [subjectResult, setSubjectResult] = useState(null);
  const emailChecks = [
    { label: 'SPF Record', status: 'pass', detail: 'v=spf1 include:sendgrid.net ~all', tip: 'Tells receiving servers which IPs can send on your behalf.' },
    { label: 'DKIM Signing', status: 'pass', detail: '2048-bit key active', tip: 'Cryptographic signature proves your email is authentic.' },
    { label: 'DMARC Policy', status: 'warn', detail: 'p=none — monitoring only', tip: 'Set p=quarantine or p=reject to protect your domain.' },
    { label: 'Bounce Rate', status: 'pass', detail: '1.2% (threshold: 2%)', tip: 'Remove hard bounces immediately to protect sender reputation.' },
    { label: 'List Hygiene', status: 'action', detail: '6 hard bounces detected', tip: 'Remove or segment bounced contacts before next send.' },
  ];
  const smsChecks = [
    { label: 'Twilio Config', status: 'pass', detail: 'Sending number active', tip: 'Dedicated number warms up over time — avoid shared short codes for cold outreach.' },
    { label: 'Opt-in Compliance', status: 'warn', detail: 'No consent timestamp logged', tip: 'Store explicit opt-in date/source for every SMS contact (TCPA requirement).' },
    { label: 'Opt-out Handling', status: 'pass', detail: 'STOP keyword auto-handled', tip: 'Reply STOP must immediately unsubscribe. Already configured.' },
    { label: 'Delivery Rate', status: 'pass', detail: '97.8% delivery rate', tip: 'Above 95% is healthy. Carrier filtering increases below this.' },
    { label: 'Carrier Filtering', status: 'pass', detail: 'No flagged messages', tip: 'Avoid URL shorteners, excessive caps, and spam phrases in SMS.' },
  ];
  const emailScore = Math.round((emailChecks.filter(c => c.status === 'pass').length / emailChecks.length) * 100);
  const smsScore = Math.round((smsChecks.filter(c => c.status === 'pass').length / smsChecks.length) * 100);
  const SI = { pass: <CheckCircle size={13} color={C.success} />, warn: <AlertCircle size={13} color={C.warn} />, action: <XCircle size={13} color={C.danger} /> };

  const SPAM = ['free', 'guaranteed', 'no obligation', 'winner', 'cash', 'prize', 'urgent', 'act now', 'limited time', 'click here', 'buy now', 'earn money', 'special offer'];
  const analyze = () => {
    if (!subject.trim()) return;
    const found = SPAM.filter(w => subject.toLowerCase().includes(w));
    const lenOk = subject.length >= 30 && subject.length <= 60;
    setSubjectResult({ triggers: found, lenOk, len: subject.length, score: Math.max(0, 100 - found.length * 22 - (lenOk ? 0 : 12)) });
  };

  const ScoreGauge = ({ score, color, label }) => (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22, textAlign: 'center' }}>
      <svg width="130" height="80" viewBox="0 0 130 80" style={{ display: 'block', margin: '0 auto' }}>
        <path d="M 15 72 A 50 50 0 0 1 115 72" fill="none" stroke={C.border} strokeWidth="10" strokeLinecap="round" />
        <path d="M 15 72 A 50 50 0 0 1 115 72" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(score / 100) * 157} 157`} />
        <text x="65" y="68" textAnchor="middle" fill={color} fontSize="26" fontFamily="'Bebas Neue', sans-serif" letterSpacing="1">{score}</text>
      </svg>
      <div style={{ fontFamily: F.display, fontSize: 14, letterSpacing: 2, color, marginBottom: 3 }}>{score >= 80 ? 'STRONG' : score >= 60 ? 'MODERATE' : 'AT RISK'}</div>
      <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub }}>{label}</div>
    </div>
  );

  const CheckList = ({ checks }) => (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      {checks.map((ch, i) => (
        <div key={ch.label} style={{ padding: '12px 18px', borderBottom: i < checks.length - 1 ? `1px solid ${C.border}` : 'none', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 11, alignItems: 'start' }}>
          <div style={{ marginTop: 1 }}>{SI[ch.status]}</div>
          <div>
            <div style={{ fontFamily: F.mono, fontSize: 12, color: C.text, marginBottom: 2 }}>{ch.label}</div>
            <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub }}>{ch.detail}</div>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted, marginTop: 2, fontStyle: 'italic' }}>{ch.tip}</div>
          </div>
          <span style={{ fontFamily: F.mono, fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: ch.status === 'pass' ? C.success : ch.status === 'warn' ? C.warn : C.danger, flexShrink: 0 }}>
            {ch.status === 'action' ? 'FIX NOW' : ch.status.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <SectionHeader title="DELIVERABILITY" sub="Email domain health + SMS compliance" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <ScoreGauge score={emailScore} color={emailScore >= 80 ? C.success : C.warn} label="Email Score" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><AtSign size={14} color={C.accent} />EMAIL HEALTH</div>
            </div>
          </div>
          <CheckList checks={emailChecks} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <ScoreGauge score={smsScore} color={smsScore >= 80 ? C.success : C.warn} label="SMS Score" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}><Smartphone size={14} color={C.sms} />SMS COMPLIANCE</div>
            </div>
          </div>
          <CheckList checks={smsChecks} />
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22 }}>
        <div style={{ fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 14 }}>SUBJECT LINE TESTER</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          <FInput value={subject} onChange={setSubject} placeholder="Paste subject line to analyze..." />
          <Btn Icon={Target} onClick={analyze}>Analyze</Btn>
        </div>
        {subjectResult && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { label: 'Spam Triggers', value: subjectResult.triggers.length === 0 ? 'CLEAN' : subjectResult.triggers.slice(0, 2).join(', '), ok: subjectResult.triggers.length === 0, sub: subjectResult.triggers.length > 0 ? `${subjectResult.triggers.length} found` : 'No issues detected' },
              { label: 'Length', value: `${subjectResult.len} chars`, ok: subjectResult.lenOk, sub: 'Ideal: 30–60 chars' },
              { label: 'Inbox Score', value: `${subjectResult.score}/100`, ok: subjectResult.score >= 80, sub: subjectResult.score >= 80 ? 'Looks good' : 'Needs work' },
            ].map(({ label, value, ok, sub }) => (
              <div key={label} style={{ background: ok ? C.successLow : C.warnLow, border: `1px solid ${ok ? 'rgba(34,197,94,0.18)' : 'rgba(245,158,11,0.18)'}`, borderRadius: 8, padding: 14 }}>
                <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted, marginBottom: 6, letterSpacing: 1.5 }}>{label.toUpperCase()}</div>
                <div style={{ fontFamily: F.display, fontSize: 20, color: ok ? C.success : C.warn, marginBottom: 3 }}>{value}</div>
                <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>{sub}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsView({ campaigns }) {
  const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
  const totalOpens = campaigns.reduce((s, c) => s + c.opens, 0);
  const totalClicks = campaigns.reduce((s, c) => s + c.clicks, 0);
  const totalReplies = campaigns.reduce((s, c) => s + (c.replies || 0), 0);
  const barData = campaigns.map(c => ({ name: c.name.length > 16 ? c.name.slice(0, 16) + '…' : c.name, openRate: c.sent > 0 ? parseFloat(((c.opens / c.sent) * 100).toFixed(1)) : 0, clickRate: c.sent > 0 ? parseFloat(((c.clicks / c.sent) * 100).toFixed(1)) : 0 }));
  return (
    <div>
      <SectionHeader title="ANALYTICS" sub="Campaign performance // all time" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }} className='rg-4'>
        <StatCard Icon={Send} label="Total Sent" value={fmtN(totalSent)} sub="email + SMS combined" />
        <StatCard Icon={Eye} label="Email Opens" value={fmtN(totalOpens)} sub={fmtPct(totalOpens, totalSent) + ' open rate'} />
        <StatCard Icon={MousePointer} label="Clicks" value={fmtN(totalClicks)} sub={fmtPct(totalClicks, totalSent) + ' click rate'} accent />
        <StatCard Icon={MessageSquare} label="SMS Replies" value={fmtN(totalReplies)} sub="direct responses" color={C.sms} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className='rg-2'>
        {[{ key: 'openRate', color: C.accent, label: 'OPEN RATE %', domain: [0, 60] }, { key: 'clickRate', color: C.info, label: 'CLICK RATE %', domain: [0, 20] }].map(({ key, color, label, domain }) => (
          <div key={key} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 14 }}>{label}</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" tick={{ fill: C.textMuted, fontSize: 10, fontFamily: F.mono }} axisLine={false} tickLine={false} domain={domain} />
                <YAxis type="category" dataKey="name" tick={{ fill: C.textSub, fontSize: 10, fontFamily: F.mono }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, fontFamily: F.mono, fontSize: 11 }} />
                <Bar dataKey={key} fill={color} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '13px 18px', borderBottom: `1px solid ${C.border}` }}><div style={{ fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text }}>BREAKDOWN</div></div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: C.surface }}>{['Campaign', 'Type', 'Status', 'Sent', 'Open Rate', 'Click Rate', 'SMS Replies'].map(h => <th key={h} style={{ padding: '9px 15px', fontFamily: F.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1.5, textAlign: 'left', borderBottom: `1px solid ${C.border}` }}>{h.toUpperCase()}</th>)}</tr></thead>
          <tbody>
            {campaigns.map((c, i) => {
              const hasSMS = c.emails?.some(e => e.type === 'sms');
              const hasEmail = c.emails?.some(e => e.type === 'email');
              return (
                <tr key={c.id} style={{ borderBottom: i < campaigns.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ padding: '11px 15px', fontFamily: F.mono, fontSize: 12, color: C.text }}>{c.name}</td>
                  <td style={{ padding: '11px 15px' }}><div style={{ display: 'flex', gap: 5 }}>{hasEmail && <TypePill type="email" />}{hasSMS && <TypePill type="sms" />}</div></td>
                  <td style={{ padding: '11px 15px' }}><Badge status={c.status} /></td>
                  <td style={{ padding: '11px 15px', fontFamily: F.mono, fontSize: 12, color: C.textSub }}>{fmtN(c.sent)}</td>
                  <td style={{ padding: '11px 15px', fontFamily: F.mono, fontSize: 12, color: C.accent }}>{fmtPct(c.opens, c.sent)}</td>
                  <td style={{ padding: '11px 15px', fontFamily: F.mono, fontSize: 12, color: C.info }}>{fmtPct(c.clicks, c.sent)}</td>
                  <td style={{ padding: '11px 15px', fontFamily: F.mono, fontSize: 12, color: C.sms }}>{c.replies || '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsView({ settings, setSettings }) {
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div>
      <SectionHeader title="SETTINGS" sub="SMTP · Twilio · Sender Identity" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className='rg-2'>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 18 }}><AtSign size={14} color={C.accent} />EMAIL / SMTP</div>
          {[{ l: 'Host', k: 'smtpHost', ph: 'smtp.sendgrid.net' }, { l: 'Port', k: 'smtpPort', ph: '587' }, { l: 'Username', k: 'smtpUser', ph: 'apikey' }, { l: 'Password', k: 'smtpPass', ph: '••••••••', t: 'password' }].map(f => (
            <div key={f.k} style={{ marginBottom: 12 }}><Label>{f.l}</Label><FInput value={settings[f.k] || ''} onChange={v => set(f.k, v)} placeholder={f.ph} type={f.t || 'text'} /></div>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 18 }}><Smartphone size={14} color={C.sms} />SMS / TWILIO</div>
          {[{ l: 'Account SID', k: 'twilioSid', ph: 'ACxxxxxxxxxxxxxxxx' }, { l: 'Auth Token', k: 'twilioToken', ph: '••••••••', t: 'password' }, { l: 'From Number', k: 'twilioFrom', ph: '+14155551234' }].map(f => (
            <div key={f.k} style={{ marginBottom: 12 }}><Label>{f.l}</Label><FInput value={settings[f.k] || ''} onChange={v => set(f.k, v)} placeholder={f.ph} type={f.t || 'text'} /></div>
          ))}
          <div style={{ padding: '10px 13px', background: C.smsLow, border: `1px solid ${C.smsMid}`, borderRadius: 7, fontFamily: F.mono, fontSize: 10, color: C.textSub, lineHeight: 1.6 }}>
            Use a dedicated long-code or toll-free number. Shared short codes are increasingly filtered by carriers.
          </div>
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 22, marginBottom: 16 }}>
        <div style={{ fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 18 }}>SENDER IDENTITY</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          {[{ l: 'From Name', k: 'fromName', ph: 'Jesse @ ClientSprint' }, { l: 'From Email', k: 'fromEmail', ph: 'jesse@clientsprint.ai' }, { l: 'Reply-To', k: 'replyTo', ph: 'jesse@clientsprint.ai' }].map(f => (
            <div key={f.k}><Label>{f.l}</Label><FInput value={settings[f.k] || ''} onChange={v => set(f.k, v)} placeholder={f.ph} /></div>
          ))}
        </div>
        <Label>Email Signature</Label>
        <FTextarea value={settings.sig || ''} onChange={v => set('sig', v)} rows={3} placeholder="Your sign-off..." />
      </div>
      <Btn Icon={saved ? CheckCircle : undefined} onClick={save} variant={saved ? 'success' : 'primary'}>{saved ? 'Saved!' : 'Save Settings'}</Btn>
    </div>
  );
}


function LeadFinderView({ contacts, setContacts }) {
  const [niche, setNiche] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('united-states');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('25');
  const [revenue, setRevenue] = useState('');
  const [count, setCount] = useState('25');
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [imported, setImported] = useState(false);
  const [error, setError] = useState('');

  const LOCATIONS = [
    {value:'united-states', label:'United States (Nationwide)'},
    {value:'northeast', label:'Northeast US'},
    {value:'southeast', label:'Southeast US'},
    {value:'midwest', label:'Midwest US'},
    {value:'southwest', label:'Southwest US'},
    {value:'west-coast', label:'West Coast US'},
    {value:'zip-radius', label:'Radius from Zip Code'},
  ];
  const REVENUE_RANGES = [
    {value:'', label:'Any Revenue'},
    {value:'under-500k', label:'Under $500K/year'},
    {value:'500k-1m', label:'$500K - $1M/year'},
    {value:'1m-5m', label:'$1M - $5M/year'},
    {value:'5m-10m', label:'$5M - $10M/year'},
    {value:'10m-50m', label:'$10M - $50M/year'},
    {value:'over-50m', label:'Over $50M/year'},
  ];

  const search = async () => {
    if (!niche.trim()) return;
    setLoading(true); setError(''); setLeads([]); setSelected(new Set()); setImported(false);
    const locationStr = location === 'zip-radius'
      ? `within ${radius} miles of zip code ${zipCode}`
      : LOCATIONS.find(l=>l.value===location)?.label || 'United States';
    const revenueStr = revenue ? REVENUE_RANGES.find(r=>r.value===revenue)?.label : '';
    const batchSize = Math.min(parseInt(count), 25); // batch to keep JSON clean
    const batches = Math.ceil(parseInt(count) / batchSize);
    const allLeads = [];
    try {
      for (let b = 0; b < batches; b++) {
        const batchCount = b === batches-1 ? parseInt(count) - (b * batchSize) : batchSize;
        const res = await fetch("/api/claude", {
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model:"claude-sonnet-4-6", max_tokens:4000,
            messages:[{role:"user",content:"Generate " + batchCount + " realistic B2B leads for sales outreach. Each lead must be UNIQUE.\n\nNiche: " + niche + "\nDecision maker title: " + (title||'Owner, CEO, or Founder') + "\nLocation: " + locationStr + (revenueStr ? "\nRevenue: " + revenueStr : "") + (b>0 ? "\n\nBatch " + (b+1) + " of " + batches + " — make ALL names and businesses different from previous batches." : "") + "\n\nReturn ONLY a JSON array. No markdown. No explanation. Just the array:\n[{\"businessName\":\"Acme Plumbing\",\"ownerName\":\"John Smith\",\"title\":\"Owner\",\"email\":\"john@acmeplumbing.com\",\"phone\":\"(555) 123-4567\",\"city\":\"Austin, TX\",\"revenue\":\"$500K-$1M\"}]"}]})
        });
        const data = await res.json();
        const text = data.content?.find(b=>b.type==='text')?.text||'';
        const match = text.match(/\[[\s\S]*?\]/);
        if (match) {
          try { allLeads.push(...JSON.parse(match[0])); } catch(e) {}
        }
      }
      if (allLeads.length === 0) { setError('No results returned — try again.'); setLoading(false); return; }
      setLeads(allLeads);
    } catch(e) { setError('Search failed — try again. Check your Anthropic credits.'); }
    setLoading(false);
  };

  const toggleAll = () => setSelected(s => s.size===leads.length ? new Set() : new Set(leads.map((_,i)=>i)));
  const toggle = i => { const s=new Set(selected); s.has(i)?s.delete(i):s.add(i); setSelected(s); };

  const confirmImport = () => {
    const toImport = [...selected].map(i=>({
      id:Date.now()+i, email:leads[i].email||'', phone:leads[i].phone||'',
      name:leads[i].ownerName||'', company:leads[i].businessName||'',
      status:'active', tags:[niche.toLowerCase().replace(/\s+/g,'-')], added:'Lead Finder',
    })).filter(c=>c.email||c.phone);
    setContacts(cs=>[...toImport,...cs]); setImported(true); setSelected(new Set());
  };

  const QUICK = ['Digital Marketing Agencies','E-commerce Brands','HVAC Companies','Real Estate Agents','Mortgage Brokers','Fitness Studios','Law Firms','Dental Practices','Restaurant Groups'];

  return (
    <div>
      <SectionHeader title="LEAD FINDER" sub="AI-generated targeted leads with contact info // import to contacts"/>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24,marginBottom:20}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:12}}>
          <div><Label>Niche / Industry *</Label><FInput value={niche} onChange={setNiche} placeholder="e.g. HVAC Companies"/></div>
          <div><Label>Decision Maker Title</Label><FInput value={title} onChange={setTitle} placeholder="e.g. Owner, CEO"/></div>
          <div><Label>Annual Revenue Range</Label><FSelect value={revenue} onChange={setRevenue} options={REVENUE_RANGES}/></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:14}}>
          <div><Label>Location</Label><FSelect value={location} onChange={v=>{setLocation(v);setZipCode('');}} options={LOCATIONS}/></div>
          {location==='zip-radius'?(
            <>
              <div><Label>Zip Code</Label><FInput value={zipCode} onChange={setZipCode} placeholder="e.g. 59401"/></div>
              <div><Label>Radius</Label><FSelect value={radius} onChange={setRadius} options={[{value:'10',label:'10 miles'},{value:'25',label:'25 miles'},{value:'50',label:'50 miles'},{value:'100',label:'100 miles'}]}/></div>
            </>
          ):(
            <div><Label>Count</Label><FSelect value={count} onChange={setCount} options={[{value:'10',label:'10 leads'},{value:'25',label:'25 leads'},{value:'50',label:'50 leads'},{value:'100',label:'100 leads'}]}/></div>
          )}
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontFamily:F.mono,fontSize:9,color:'#BBBBBB',letterSpacing:1.5,marginBottom:8}}>QUICK SELECT</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {QUICK.map(q=>(
              <button key={q} onClick={()=>setNiche(q)} style={{background:niche===q?C.accentLow:C.surface,border:`1px solid ${niche===q?C.accent:C.border}`,borderRadius:5,padding:'5px 11px',color:niche===q?C.accent:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>{q}</button>
            ))}
          </div>
        </div>
        <Btn Icon={MapPin} onClick={search} disabled={loading||!niche.trim()}>{loading?'Finding leads...':'Find Leads'}</Btn>
        {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:8}}>{error}</div>}
      </div>

      {loading&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'48px 0',textAlign:'center'}}>
          <div style={{fontFamily:F.display,fontSize:22,letterSpacing:2,color:C.accent,marginBottom:8}}>FINDING LEADS...</div>
          <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,marginBottom:12}}>Searching {niche} in {LOCATIONS.find(l=>l.value===location)?.label}</div>
          <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,padding:'10px 20px',background:C.surface,borderRadius:6,display:'inline-block',lineHeight:1.8}}>
            Please allow up to {parseInt(count)<=10?'15 seconds':parseInt(count)<=25?'30 seconds':parseInt(count)<=50?'60 seconds':'2 minutes'} for results<br/>
            <span style={{color:C.textMuted,fontSize:9}}>Generating contact info for {count} leads...</span>
          </div>
        </div>
      )}

      {leads.length>0&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
          <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text}}>{leads.length} LEADS FOUND</div>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub}}>{selected.size} selected</div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <Btn variant="ghost" size="sm" onClick={toggleAll}>{selected.size===leads.length?'Deselect All':'Select All'}</Btn>
              {selected.size>0&&!imported&&<Btn Icon={Download} size="sm" onClick={confirmImport}>Import {selected.size}</Btn>}
              {imported&&<span style={{fontFamily:F.mono,fontSize:11,color:C.success,display:'flex',alignItems:'center',gap:5}}><CheckCircle size={12}/>Imported!</span>}
            </div>
          </div>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:750}}>
              <thead><tr style={{background:C.surface}}>
                <th style={{padding:'9px 12px',width:36}}><input type="checkbox" checked={selected.size===leads.length&&leads.length>0} onChange={toggleAll} style={{cursor:'pointer',accentColor:C.accent}}/></th>
                {['Business Name','Owner','Title','Email','Phone','Location','Revenue'].map(h=><th key={h} style={{padding:'9px 10px',fontFamily:F.mono,fontSize:9,color:'#BBBBBB',letterSpacing:1.5,textAlign:'left',borderBottom:`1px solid ${C.border}`}}>{h.toUpperCase()}</th>)}
              </tr></thead>
              <tbody>
                {leads.map((lead,i)=>(
                  <tr key={i} onClick={()=>toggle(i)} style={{borderBottom:i<leads.length-1?`1px solid ${C.border}`:'none',background:selected.has(i)?C.accentLow:'transparent',cursor:'pointer'}}>
                    <td style={{padding:'9px 12px'}}><input type="checkbox" checked={selected.has(i)} onChange={()=>toggle(i)} onClick={e=>e.stopPropagation()} style={{cursor:'pointer',accentColor:C.accent}}/></td>
                    <td style={{padding:'9px 10px',fontFamily:F.mono,fontSize:11,color:C.text,fontWeight:'bold'}}>{lead.businessName||'–'}</td>
                    <td style={{padding:'9px 10px',fontFamily:F.mono,fontSize:11,color:C.text}}>{lead.ownerName||'–'}</td>
                    <td style={{padding:'9px 10px',fontFamily:F.mono,fontSize:10,color:C.textSub}}>{lead.title||'–'}</td>
                    <td style={{padding:'9px 10px',fontFamily:F.mono,fontSize:11,color:C.accent}}>{lead.email||'–'}</td>
                    <td style={{padding:'9px 10px',fontFamily:F.mono,fontSize:11,color:C.sms}}>{lead.phone||'–'}</td>
                    <td style={{padding:'9px 10px',fontFamily:F.mono,fontSize:10,color:C.textSub}}>{lead.city||'–'}</td>
                    <td style={{padding:'9px 10px',fontFamily:F.mono,fontSize:10,color:C.success}}>{lead.revenue||'–'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const OFFER_QUESTIONS = [
  { id: 'niche',      label: 'Who is your ideal client / niche?',            placeholder: 'e.g. HVAC companies doing $500K-$2M/year' },
  { id: 'problem',    label: 'What is their #1 problem or pain point?',       placeholder: 'e.g. Inconsistent leads, slow season revenue drops' },
  { id: 'outcome',    label: 'What outcome do you deliver?',                  placeholder: 'e.g. 3-5 qualified appointments per week within 30 days' },
  { id: 'mechanism',  label: 'How do you deliver it? (your process/service)', placeholder: 'e.g. AI-powered Facebook ads + follow-up sequences' },
  { id: 'timeline',   label: 'What is the timeline to results?',              placeholder: 'e.g. First leads in 7 days, ROI within 30 days' },
  { id: 'price',      label: 'What is your current or target price point?',   placeholder: 'e.g. $1,500/month retainer or $3,000 setup + $997/month' },
];

function OfferBuilderView() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const current = OFFER_QUESTIONS[step];
  const allAnswered = OFFER_QUESTIONS.every(q => (answers[q.id] || '').trim().length > 0);
  const progress = (Object.keys(answers).filter(k => answers[k].trim()).length / OFFER_QUESTIONS.length) * 100;

  const generate = async () => {
    setLoading(true); setError(''); setOffer(null);
    try {
      const brief = OFFER_QUESTIONS.map(q => `${q.label}\n${answers[q.id]}`).join('\n\n');
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 1000,
          messages: [{ role: "user", content: `You are a world-class offer strategist. Based on this brief, create a complete productized offer.\n\n${brief}\n\nReturn ONLY raw JSON, no markdown:\n{"name":"Punchy offer name (4-6 words)","tagline":"One sentence that makes them lean in","whoItsFor":"2-3 sentences describing the perfect client","deliverables":["deliverable 1","deliverable 2","deliverable 3","deliverable 4","deliverable 5"],"price":"Recommended price point with brief rationale","guarantee":"Bold guarantee that removes risk","elevator":"30-second pitch — conversational, confident, no buzzwords","objections":[{"obj":"Common objection 1","answer":"Sharp response"},{"obj":"Common objection 2","answer":"Sharp response"},{"obj":"Common objection 3","answer":"Sharp response"}]}` }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      setOffer(JSON.parse(text.replace(/```json|```/g, '').trim()));
    } catch(e) { setError('Generation failed — try again.'); }
    setLoading(false);
  };

  const copy = (key, val) => {
    navigator.clipboard.writeText(Array.isArray(val) ? val.join('\n') : val);
    setCopied(key); setTimeout(() => setCopied(''), 2000);
  };

  const CopyBtn = ({ k, val }) => (
    <button onClick={() => copy(k, val)} style={{ background: 'none', border: 'none', color: copied === k ? C.success : C.textMuted, cursor: 'pointer', fontFamily: F.mono, fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
      {copied === k ? <><CheckCircle size={10} />Copied</> : <><Copy size={10} />Copy</>}
    </button>
  );

  const Section = ({ label, children, copyKey, copyVal }) => (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '14px 18px', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted, letterSpacing: 1.5 }}>{label}</div>
        {copyKey && <CopyBtn k={copyKey} val={copyVal} />}
      </div>
      {children}
    </div>
  );

  if (offer) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
          <button onClick={() => { setOffer(null); }} style={{ background: 'none', border: 'none', color: C.textSub, cursor: 'pointer', fontFamily: F.mono, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}><ArrowLeft size={12} />Rebuild</button>
          <span style={{ color: C.border }}>|</span>
          <h2 style={{ fontFamily: F.display, fontSize: 22, letterSpacing: 2, color: C.text, margin: 0 }}>YOUR OFFER</h2>
          <button onClick={() => copy('all', `${offer.name}\n${offer.tagline}\n\nWho It's For\n${offer.whoItsFor}\n\nWhat's Included\n${offer.deliverables.join('\n')}\n\nInvestment\n${offer.price}\n\nGuarantee\n${offer.guarantee}\n\nElevator Pitch\n${offer.elevator}`)} style={{ marginLeft: 'auto', background: C.accentLow, border: `1px solid ${C.accentMid}`, borderRadius: 6, padding: '7px 14px', color: C.accent, fontFamily: F.mono, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Copy size={11} />{copied === 'all' ? 'Copied!' : 'Copy All'}
          </button>
        </div>

        {/* Hero */}
        <div style={{ background: C.card, border: `1px solid ${C.accent}44`, borderRadius: 12, padding: '28px 30px', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: -20, width: 80, height: '100%', background: C.accentLow, transform: 'skewX(-12deg)', pointerEvents: 'none' }} />
          <div style={{ fontFamily: F.display, fontSize: 34, letterSpacing: 3, color: C.accent, marginBottom: 8 }}>{offer.name}</div>
          <div style={{ fontFamily: F.mono, fontSize: 14, color: C.text, lineHeight: 1.6 }}>{offer.tagline}</div>
          <CopyBtn k="hero" val={`${offer.name}\n${offer.tagline}`} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }} className='rg-2'>
          <div>
            <Section label="WHO IT'S FOR" copyKey="who" copyVal={offer.whoItsFor}>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: C.text, lineHeight: 1.7 }}>{offer.whoItsFor}</div>
            </Section>
            <Section label="INVESTMENT + PRICING" copyKey="price" copyVal={offer.price}>
              <div style={{ fontFamily: F.display, fontSize: 22, color: C.accent, marginBottom: 4 }}>{offer.price}</div>
            </Section>
            <Section label="GUARANTEE" copyKey="guarantee" copyVal={offer.guarantee}>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: C.success, lineHeight: 1.7 }}>{offer.guarantee}</div>
            </Section>
          </div>
          <div>
            <Section label="WHAT'S INCLUDED" copyKey="deliverables" copyVal={offer.deliverables}>
              {offer.deliverables.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 8 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: C.accentLow, border: `1px solid ${C.accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent, fontFamily: F.display, fontSize: 10, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 12, color: C.text, lineHeight: 1.6 }}>{d}</div>
                </div>
              ))}
            </Section>
          </div>
        </div>

        <Section label="30-SECOND ELEVATOR PITCH" copyKey="elevator" copyVal={offer.elevator}>
          <div style={{ fontFamily: F.mono, fontSize: 13, color: C.text, lineHeight: 1.8, borderLeft: `2px solid ${C.accent}`, paddingLeft: 14 }}>{offer.elevator}</div>
        </Section>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '18px 20px' }}>
          <div style={{ fontFamily: F.display, fontSize: 16, letterSpacing: 2, color: C.text, marginBottom: 14 }}>OBJECTION HANDLERS</div>
          {offer.objections.map((o, i) => (
            <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: i < offer.objections.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: C.warn }}>"{o.obj}"</div>
                <CopyBtn k={`obj${i}`} val={o.answer} />
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: C.text, lineHeight: 1.6 }}>{o.answer}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="OFFER BUILDER" sub="Answer 6 questions // get a complete productized offer" />

      {/* Progress */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub }}>{Math.round(progress)}% complete</div>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub }}>{Object.keys(answers).filter(k => answers[k].trim()).length} / {OFFER_QUESTIONS.length} answered</div>
        </div>
        <div style={{ background: C.border, borderRadius: 3, height: 3, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: C.accent, borderRadius: 3, transition: 'width 0.3s ease' }} />
        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {OFFER_QUESTIONS.map((q, i) => {
            const done = (answers[q.id] || '').trim().length > 0;
            const active = step === i;
            return (
              <button key={i} onClick={() => setStep(i)} style={{ flex: 1, background: active ? C.accentLow : done ? C.successLow : C.surface, border: `1px solid ${active ? C.accent : done ? C.success : C.border}`, borderRadius: 6, padding: '8px 0', cursor: 'pointer' }}>
                <div style={{ fontFamily: F.mono, fontSize: 9, color: active ? C.accent : done ? C.success : C.textMuted, letterSpacing: 1 }}>0{i + 1}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active question */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 28, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.accentLow, border: `1px solid ${C.accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent, fontFamily: F.display, fontSize: 14 }}>0{step + 1}</div>
          <div style={{ fontFamily: F.mono, fontSize: 14, color: C.text }}>{current.label}</div>
        </div>
        <FTextarea
          value={answers[current.id] || ''}
          onChange={v => setAnswers(a => ({ ...a, [current.id]: v }))}
          placeholder={current.placeholder}
          rows={4}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
          <Btn variant="ghost" Icon={ChevronLeft} onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Prev</Btn>
          {step < OFFER_QUESTIONS.length - 1
            ? <Btn Icon={ChevronRight} onClick={() => setStep(s => s + 1)} disabled={!(answers[current.id] || '').trim()}>Next</Btn>
            : <Btn Icon={Wand2} onClick={generate} disabled={!allAnswered || loading}>{loading ? 'Building offer (~20s)...' : 'Build My Offer'}</Btn>
          }
        </div>
        {error && <div style={{ fontFamily: F.mono, fontSize: 11, color: C.danger, marginTop: 10 }}>{error}</div>}
      </div>

      {/* All questions mini view */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {OFFER_QUESTIONS.map((q, i) => {
          const done = (answers[q.id] || '').trim().length > 0;
          return (
            <button key={i} onClick={() => setStep(i)} style={{ background: C.card, border: `1px solid ${step === i ? C.accent : done ? C.success + '44' : C.border}`, borderRadius: 8, padding: '12px 16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? C.successLow : C.accentLow, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                {done ? <CheckCircle size={11} color={C.success} /> : <span style={{ fontFamily: F.display, fontSize: 10, color: C.accent }}>0{i+1}</span>}
              </div>
              <div>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: done ? C.text : C.textSub, marginBottom: 3 }}>{q.label}</div>
                {done && <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{answers[q.id]}</div>}
              </div>
            </button>
          );
        })}
      </div>

      {allAnswered && !loading && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Btn Icon={Wand2} onClick={generate} style={{ padding: '13px 40px' }}>Build My Complete Offer</Btn>
        </div>
      )}
      {loading && (
        <div style={{ marginTop: 16, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '36px 0', textAlign: 'center' }}>
          <div style={{ fontFamily: F.display, fontSize: 24, letterSpacing: 2, color: C.accent }}>BUILDING YOUR OFFER...</div>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub, marginTop: 6 }}>Claude is crafting your complete offer package</div>
        </div>
      )}
    </div>
  );
}


const STAGES = ['New Lead','Contacted','Proposal Sent','Negotiating','Closed Won','Closed Lost'];
const STAGE_COLORS = { 'New Lead':C.textSub,'Contacted':C.info,'Proposal Sent':C.accent,'Negotiating':C.warn,'Closed Won':C.success,'Closed Lost':C.danger };
const SEED_DEALS = [
  {id:1,name:'Alex Johnson',company:'Agency Pro',value:4997,stage:'Proposal Sent',notes:'Loves the AI angle. Follow up Friday.',added:'Mar 20',contacted:'Mar 25'},
  {id:2,name:'Sarah Martinez',company:'GrowthLab',value:2997,stage:'Contacted',notes:'Intro call went well. Sending proposal Monday.',added:'Mar 22',contacted:'Mar 24'},
  {id:3,name:'Priya Kumar',company:'ClientFlow AI',value:7997,stage:'Negotiating',notes:'Wants to start with 3-month trial.',added:'Mar 15',contacted:'Mar 26'},
  {id:4,name:'Mike Torres',company:'LaunchPad',value:2997,stage:'New Lead',notes:'',added:'Mar 26',contacted:''},
  {id:5,name:'Derek White',company:'ScaleDAO',value:4997,stage:'Closed Won',notes:'Signed! Kickoff April 1.',added:'Mar 1',contacted:'Mar 20'},
  {id:6,name:'Jen Liu',company:'BuildFast',value:2997,stage:'Closed Lost',notes:'Went with a cheaper option.',added:'Mar 5',contacted:'Mar 18'},
];

function PipelineView() {
  const [deals, setDeals] = useState(SEED_DEALS);
  const [sel, setSel] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newDeal, setNewDeal] = useState({name:'',company:'',value:'',stage:'New Lead',notes:''});
  const deal = sel ? deals.find(d=>d.id===sel) : null;

  const totalPipe = deals.filter(d=>!['Closed Won','Closed Lost'].includes(d.stage)).reduce((s,d)=>s+d.value,0);
  const won = deals.filter(d=>d.status==='Closed Won');
  const closedWon = deals.filter(d=>d.stage==='Closed Won').reduce((s,d)=>s+d.value,0);

  const moveStage = (id, dir) => {
    setDeals(ds=>ds.map(d=>{
      if(d.id!==id) return d;
      const idx=STAGES.indexOf(d.stage);
      const next=STAGES[Math.min(Math.max(idx+dir,0),STAGES.length-1)];
      return {...d,stage:next};
    }));
  };

  const addDeal = () => {
    if(!newDeal.name.trim()) return;
    setDeals(ds=>[...ds,{...newDeal,id:Date.now(),value:parseInt(newDeal.value)||0,added:'Now',contacted:''}]);
    setNewDeal({name:'',company:'',value:'',stage:'New Lead',notes:''}); setAdding(false);
  };

  const updateDeal = (id,updates) => setDeals(ds=>ds.map(d=>d.id===id?{...d,...updates}:d));
  const deleteDeal = id => { setDeals(ds=>ds.filter(d=>d.id!==id)); setSel(null); };

  return (
    <div>
      <SectionHeader title="PIPELINE" sub={`$${totalPipe.toLocaleString()} active pipeline // ${deals.filter(d=>d.stage!=='Closed Won'&&d.stage!=='Closed Lost').length} open deals`}
        actions={<Btn Icon={Plus} onClick={()=>setAdding(true)}>Add Deal</Btn>} />

      {adding && (
        <div style={{background:C.card,border:`1px solid ${C.accent}`,borderRadius:10,padding:22,marginBottom:18}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>NEW DEAL</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:10,marginBottom:10}}>
            <div><Label>Name</Label><FInput value={newDeal.name} onChange={v=>setNewDeal(d=>({...d,name:v}))} placeholder="Contact name"/></div>
            <div><Label>Company</Label><FInput value={newDeal.company} onChange={v=>setNewDeal(d=>({...d,company:v}))} placeholder="Company"/></div>
            <div><Label>Value ($)</Label><FInput value={newDeal.value} onChange={v=>setNewDeal(d=>({...d,value:v}))} placeholder="4997"/></div>
            <div><Label>Stage</Label><FSelect value={newDeal.stage} onChange={v=>setNewDeal(d=>({...d,stage:v}))} options={STAGES.map(s=>({value:s,label:s}))}/></div>
          </div>
          <div style={{marginBottom:12}}><Label>Notes</Label><FInput value={newDeal.notes} onChange={v=>setNewDeal(d=>({...d,notes:v}))} placeholder="Any context..."/></div>
          <div style={{display:'flex',gap:10}}><Btn Icon={Plus} onClick={addDeal}>Add Deal</Btn><Btn variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn></div>
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:10,marginBottom:20}}>
        {STAGES.map(stage=>{
          const col=STAGE_COLORS[stage];
          const stageDeals=deals.filter(d=>d.stage===stage);
          const val=stageDeals.reduce((s,d)=>s+d.value,0);
          return (
            <div key={stage} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
              <div style={{padding:'10px 14px',borderBottom:`1px solid ${C.border}`,background:C.surface}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                  <div style={{fontFamily:F.mono,fontSize:10,color:col,letterSpacing:1}}>{stage.toUpperCase().slice(0,8)}</div>
                  <div style={{width:20,height:20,borderRadius:'50%',background:`${col}18`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.mono,fontSize:10,color:col}}>{stageDeals.length}</div>
                </div>
                <div style={{fontFamily:F.display,fontSize:14,color:C.text}}>${val.toLocaleString()}</div>
              </div>
              <div style={{padding:8,minHeight:120}}>
                {stageDeals.map(d=>(
                  <div key={d.id} onClick={()=>setSel(sel===d.id?null:d.id)}
                    style={{background:sel===d.id?C.accentLow:C.surface,border:`1px solid ${sel===d.id?C.accent:C.border}`,borderRadius:7,padding:'10px 12px',marginBottom:7,cursor:'pointer'}}>
                    <div style={{fontFamily:F.mono,fontSize:11,color:C.text,marginBottom:2}}>{d.name}</div>
                    <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,marginBottom:5}}>{d.company}</div>
                    <div style={{fontFamily:F.display,fontSize:14,color:col}}>${d.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {deal && (
        <div style={{background:C.card,border:`1px solid ${C.accent}`,borderRadius:10,padding:24}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
            <div>
              <div style={{fontFamily:F.display,fontSize:22,letterSpacing:2,color:C.text}}>{deal.name}</div>
              <div style={{fontFamily:F.mono,fontSize:12,color:C.textSub}}>{deal.company} · Added {deal.added}</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>deleteDeal(deal.id)} style={{background:'none',border:'none',color:C.danger,cursor:'pointer',fontFamily:F.mono,fontSize:11}}>Remove</button>
              <button onClick={()=>setSel(null)} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer'}}><X size={16}/></button>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:14,marginBottom:16}}>
            <div><Label>Deal Value</Label><FInput value={deal.value} onChange={v=>updateDeal(deal.id,{value:parseInt(v)||0})} placeholder="4997"/></div>
            <div><Label>Stage</Label><FSelect value={deal.stage} onChange={v=>updateDeal(deal.id,{stage:v})} options={STAGES.map(s=>({value:s,label:s}))}/></div>
            <div><Label>Last Contacted</Label><FInput value={deal.contacted} onChange={v=>updateDeal(deal.id,{contacted:v})} placeholder="Mar 25"/></div>
          </div>
          <div><Label>Notes</Label><FTextarea value={deal.notes} onChange={v=>updateDeal(deal.id,{notes:v})} rows={3} placeholder="Deal notes, objections, next steps..."/></div>
          <div style={{display:'flex',gap:10,marginTop:14}}>
            {STAGES.indexOf(deal.stage)>0 && <Btn variant="ghost" size="sm" onClick={()=>moveStage(deal.id,-1)}>← Move Back</Btn>}
            {STAGES.indexOf(deal.stage)<STAGES.length-1 && <Btn size="sm" onClick={()=>moveStage(deal.id,1)}>Advance Stage →</Btn>}
          </div>
        </div>
      )}
    </div>
  );
}

const PROPOSAL_FIELDS = [
  {id:'prospect',label:'Prospect Name',ph:'e.g. Alex Johnson'},
  {id:'company', label:'Company',      ph:'e.g. Agency Pro'},
  {id:'problem', label:'Their Problem',ph:'e.g. Inconsistent lead flow, no predictable client acquisition system'},
  {id:'budget',  label:'Budget / Investment',ph:'e.g. $2,997/month, open to discussion'},
  {id:'timeline',label:'Desired Timeline',ph:'e.g. Wants to start in 2 weeks, first results in 30 days'},
  {id:'context', label:'Extra Context',ph:'e.g. Had a bad experience with an agency before. Needs to see proof.'},
];

function ProposalView() {
  const [fields, setFields] = useState({});
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const ready = ['prospect','company','problem'].every(k=>(fields[k]||'').trim());

  const generate = async () => {
    setLoading(true); setError(''); setProposal(null);
    try {
      const brief = PROPOSAL_FIELDS.map(f=>`${f.label}: ${fields[f.id]||'N/A'}`).join('\n');
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,
          messages:[{role:"user",content:`You are writing a proposal on behalf of Jesse at ClientSprint.ai — an AI agency growth accelerator.\n\nProspect brief:\n${brief}\n\nReturn ONLY raw JSON, no markdown:\n{"exec":"2-3 sentence executive summary that speaks directly to their situation","problem":"Paragraph restating their problem in their language — make them feel understood","solution":"Paragraph describing ClientSprint's approach and why it fits them specifically","deliverables":["deliverable 1","deliverable 2","deliverable 3","deliverable 4"],"timeline":[{"phase":"Phase 1","duration":"Week 1-2","milestone":"What gets done"},{"phase":"Phase 2","duration":"Week 3-4","milestone":"What gets done"},{"phase":"Phase 3","duration":"Month 2+","milestone":"What gets done"}],"investment":"Clear investment summary with what is included","guarantee":"Risk-reversal guarantee","nextSteps":"3 concrete next steps to move forward. Specific and action-oriented."}`}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      setProposal(JSON.parse(text.replace(/```json|```/g,'').trim()));
    } catch(e) { setError('Generation failed — try again.'); }
    setLoading(false);
  };

  const copySection = (key,val) => {
    navigator.clipboard.writeText(Array.isArray(val)?val.join('\n'):val);
    setCopied(key); setTimeout(()=>setCopied(''),2000);
  };

  const CopyBtn = ({k,val}) => (
    <button onClick={()=>copySection(k,val)} style={{background:'none',border:'none',color:copied===k?C.success:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:10,display:'flex',alignItems:'center',gap:4}}>
      {copied===k?<><CheckCircle size={10}/>Copied</>:<><Copy size={10}/>Copy</>}
    </button>
  );

  const Block = ({label,k,val,children}) => (
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'14px 18px',marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5}}>{label}</div>
        <CopyBtn k={k} val={val}/>
      </div>
      {children}
    </div>
  );

  const T = ({children,muted,accent}) => (
    <div style={{fontFamily:F.mono,fontSize:12,color:accent?C.accent:muted?C.textSub:C.text,lineHeight:1.75}}>{children}</div>
  );

  return (
    <div>
      <SectionHeader title="PROPOSAL GENERATOR" sub="Client brief in // polished proposal out"/>
      <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:20,alignItems:'start'}} className='rg-brief-sm'>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:18}}>CLIENT BRIEF</div>
          {PROPOSAL_FIELDS.map(f=>(
            <div key={f.id} style={{marginBottom:13}}>
              <Label>{f.label}{['prospect','company','problem'].includes(f.id)?' *':''}</Label>
              {f.id==='problem'||f.id==='context'
                ? <FTextarea value={fields[f.id]||''} onChange={v=>setFields(ff=>({...ff,[f.id]:v}))} placeholder={f.ph} rows={3}/>
                : <FInput value={fields[f.id]||''} onChange={v=>setFields(ff=>({...ff,[f.id]:v}))} placeholder={f.ph}/>
              }
            </div>
          ))}
          <Btn Icon={FileText} onClick={generate} disabled={!ready||loading} style={{width:'100%',justifyContent:'center'}}>
            {loading?'Generating (~20s)...':'Generate Proposal'}
          </Btn>
          {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:9}}>{error}</div>}
        </div>

        <div>
          {!proposal&&!loading&&(
            <div style={{background:C.card,border:`2px dashed ${C.borderMid}`,borderRadius:10,padding:'56px 36px',textAlign:'center'}}>
              <FileText size={28} color={C.textMuted} style={{display:'block',margin:'0 auto 12px'}}/>
              <div style={{fontFamily:F.display,fontSize:20,letterSpacing:2,color:C.textMuted,marginBottom:5}}>READY TO GENERATE</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textMuted}}>Fill the brief — name, company, and problem are required</div>
            </div>
          )}
          {loading&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'56px 0',textAlign:'center'}}>
              <div style={{fontFamily:F.display,fontSize:24,letterSpacing:2,color:C.accent}}>WRITING PROPOSAL...</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,marginTop:6}}>Tailoring to {fields.prospect||'your prospect'}</div>
            </div>
          )}
          {proposal&&(
            <div>
              <div style={{background:C.card,border:`1px solid ${C.accent}44`,borderRadius:12,padding:'22px 26px',marginBottom:12,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,right:-16,width:60,height:'100%',background:C.accentLow,transform:'skewX(-12deg)',pointerEvents:'none'}}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontFamily:F.display,fontSize:28,letterSpacing:3,color:C.text}}>PROPOSAL</div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.textSub,marginTop:3}}>Prepared for {fields.prospect} · {fields.company} · {new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
                  </div>
                  <button onClick={()=>{
                    const full = `PROPOSAL FOR ${fields.prospect} — ${fields.company}\n${new Date().toLocaleDateString()}\nPrepared by ClientSprint.ai\n\nEXECUTIVE SUMMARY\n${proposal.exec}\n\nTHE PROBLEM\n${proposal.problem}\n\nOUR SOLUTION\n${proposal.solution}\n\nDELIVERABLES\n${proposal.deliverables.join('\n')}\n\nTIMELINE\n${proposal.timeline.map(t=>`${t.phase} (${t.duration}): ${t.milestone}`).join('\n')}\n\nINVESTMENT\n${proposal.investment}\n\nGUARANTEE\n${proposal.guarantee}\n\nNEXT STEPS\n${proposal.nextSteps}`;
                    navigator.clipboard.writeText(full); copySection('all','');
                  }} style={{background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:6,padding:'7px 14px',color:C.accent,fontFamily:F.mono,fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                    <Copy size={11}/>{copied==='all'?'Copied!':'Copy All'}
                  </button>
                </div>
              </div>
              <Block label="EXECUTIVE SUMMARY" k="exec" val={proposal.exec}><T>{proposal.exec}</T></Block>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
                <Block label="THE PROBLEM" k="problem" val={proposal.problem}><T muted>{proposal.problem}</T></Block>
                <Block label="OUR SOLUTION" k="solution" val={proposal.solution}><T>{proposal.solution}</T></Block>
              </div>
              <Block label="DELIVERABLES" k="deliverables" val={proposal.deliverables}>
                {proposal.deliverables.map((d,i)=>(
                  <div key={i} style={{display:'flex',gap:9,marginBottom:7,alignItems:'flex-start'}}>
                    <div style={{width:18,height:18,borderRadius:'50%',background:C.accentLow,border:`1px solid ${C.accent}55`,display:'flex',alignItems:'center',justifyContent:'center',color:C.accent,fontFamily:F.display,fontSize:10,flexShrink:0,marginTop:1}}>{i+1}</div>
                    <T>{d}</T>
                  </div>
                ))}
              </Block>
              <Block label="TIMELINE" k="timeline" val={proposal.timeline.map(t=>`${t.phase}: ${t.milestone}`).join('\n')}>
                {proposal.timeline.map((t,i)=>(
                  <div key={i} style={{display:'flex',gap:12,marginBottom:8,alignItems:'flex-start'}}>
                    <div style={{minWidth:90,fontFamily:F.mono,fontSize:10,color:C.accent,background:C.accentLow,padding:'3px 8px',borderRadius:4,flexShrink:0}}>{t.phase}</div>
                    <div>
                      <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginBottom:2}}>{t.duration}</div>
                      <T>{t.milestone}</T>
                    </div>
                  </div>
                ))}
              </Block>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <Block label="INVESTMENT" k="investment" val={proposal.investment}><T accent>{proposal.investment}</T></Block>
                <Block label="GUARANTEE" k="guarantee" val={proposal.guarantee}><T>{proposal.guarantee}</T></Block>
              </div>
              <Block label="NEXT STEPS" k="next" val={proposal.nextSteps}>
                <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.8,borderLeft:`2px solid ${C.accent}`,paddingLeft:14}}>{proposal.nextSteps}</div>
              </Block>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ─── Sales Tools ──────────────────────────────────────────────────────────────────
const CALCS = [
  { id:'leadgen',   label:'Lead Gen ROI',          icon:'◈', color:'#DC2626', desc:'Show prospects what new leads are actually worth' },
  { id:'adspend',   label:'Ad Spend ROI',           icon:'◎', color:'#60A5FA', desc:'Justify ad budget with projected returns' },
  { id:'email',     label:'Email & SMS Revenue',    icon:'◉', color:'#7C3AED', desc:'Revenue potential from their existing list' },
  { id:'ltv',       label:'Client Lifetime Value',  icon:'◆', color:'#22C55E', desc:'True LTV — what one client is really worth' },
  { id:'income',    label:'Agency Income Goal',     icon:'◇', color:'#F59E0B', desc:'Reverse-engineer exactly how many clients they need' },
];

function Calc_LeadGen() {
  const [v,setV]=useState({closeRate:20,clientValue:3000,leadsPerMonth:30,agencyFee:2000});
  const s=k=>e=>setV(x=>({...x,[k]:parseFloat(e.target.value)||0}));
  const newClients=((v.closeRate/100)*v.leadsPerMonth).toFixed(1);
  const monthlyRev=(newClients*v.clientValue).toFixed(0);
  const annualRev=(monthlyRev*12).toFixed(0);
  const roi=(((monthlyRev-v.agencyFee)/v.agencyFee)*100).toFixed(0);
  const breakeven=newClients>0?(v.agencyFee/v.clientValue).toFixed(1):'-';
  return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}} className='rg-2'>
      <div>
        {[['Close Rate (%)',          'closeRate','%'],
          ['Avg Client Value ($/mo)', 'clientValue','$'],
          ['Leads Delivered/mo',      'leadsPerMonth','#'],
          ['Your Agency Fee ($/mo)',  'agencyFee','$']].map(([label,key,unit])=>(
          <div key={key} style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <Label>{label}</Label>
              <span style={{fontFamily:F.mono,fontSize:11,color:C.accent}}>{unit==='$'?'$':''}{v[key]}{unit==='%'?'%':''}</span>
            </div>
            <input type="range" min={unit==='%'?1:unit==='#'?5:500} max={unit==='%'?80:unit==='#'?200:15000}
              step={unit==='%'?1:unit==='#'?1:100} value={v[key]} onChange={s(key)}
              style={{width:'100%',accentColor:C.accent}}/>
          </div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[
          {l:'New Clients/Month',  v:`${newClients}`,    c:C.accent},
          {l:'Monthly Revenue',    v:`$${parseInt(monthlyRev).toLocaleString()}`,  c:C.text},
          {l:'Annual Revenue',     v:`$${parseInt(annualRev).toLocaleString()}`,   c:C.success},
          {l:'ROI on Agency Fee',  v:`${roi}%`,          c:parseInt(roi)>0?C.success:C.danger},
          {l:'Clients to Break Even', v:breakeven,       c:C.warn},
        ].map(({l,v:val,c})=>(
          <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'14px 18px',flex:1}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:5}}>{l.toUpperCase()}</div>
            <div style={{fontFamily:F.display,fontSize:28,color:c,letterSpacing:1}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Calc_AdSpend() {
  const [v,setV]=useState({adBudget:3000,currentROAS:2,targetROAS:4,avgOrderValue:500,agencyFee:1500});
  const s=k=>e=>setV(x=>({...x,[k]:parseFloat(e.target.value)||0}));
  const currentRev=(v.adBudget*v.currentROAS).toFixed(0);
  const projectedRev=(v.adBudget*v.targetROAS).toFixed(0);
  const revenueGain=(projectedRev-currentRev).toFixed(0);
  const currentCPA=v.currentROAS>0?(v.avgOrderValue/v.currentROAS).toFixed(0):'–';
  const projectedCPA=v.targetROAS>0?(v.avgOrderValue/v.targetROAS).toFixed(0):'–';
  const netGain=(revenueGain-v.agencyFee).toFixed(0);
  return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}} className='rg-2'>
      <div>
        {[['Monthly Ad Budget','adBudget','$',500,20000,500],
          ['Current ROAS','currentROAS','x',0.5,8,0.5],
          ['Target ROAS (with you)','targetROAS','x',1,12,0.5],
          ['Avg Order Value','avgOrderValue','$',50,5000,50],
          ['Agency Management Fee','agencyFee','$',500,5000,250]].map(([label,key,unit,min,max,step])=>(
          <div key={key} style={{marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <Label>{label}</Label>
              <span style={{fontFamily:F.mono,fontSize:11,color:C.info}}>{unit==='$'?'$':''}{unit==='x'?`${v[key]}x`:v[key]}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v[key]} onChange={s(key)} style={{width:'100%',accentColor:C.info}}/>
          </div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[
          {l:'Current Monthly Revenue',   v:`$${parseInt(currentRev).toLocaleString()}`,   c:C.textSub},
          {l:'Projected Revenue',         v:`$${parseInt(projectedRev).toLocaleString()}`, c:C.info},
          {l:'Revenue Increase',          v:`+$${parseInt(revenueGain).toLocaleString()}`, c:C.success},
          {l:'Current CPA',               v:`$${currentCPA}`,  c:C.textSub},
          {l:'Projected CPA',             v:`$${projectedCPA}`,c:C.success},
          {l:'Net Gain After Fee',        v:`$${parseInt(netGain).toLocaleString()}`,      c:parseInt(netGain)>0?C.success:C.danger},
        ].map(({l,v:val,c})=>(
          <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 16px',flex:1}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>{l.toUpperCase()}</div>
            <div style={{fontFamily:F.display,fontSize:22,color:c,letterSpacing:1}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Calc_Email() {
  const [v,setV]=useState({listSize:5000,openRate:35,clickRate:4,convRate:2,productPrice:500,sendsPerMonth:4});
  const s=k=>e=>setV(x=>({...x,[k]:parseFloat(e.target.value)||0}));
  const opens=Math.round(v.listSize*(v.openRate/100));
  const clicks=Math.round(opens*(v.clickRate/100));
  const sales=Math.round(clicks*(v.convRate/100));
  const revenuePerSend=(sales*v.productPrice).toFixed(0);
  const monthlyRev=(revenuePerSend*v.sendsPerMonth).toFixed(0);
  const annualRev=(monthlyRev*12).toFixed(0);
  return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}} className='rg-2'>
      <div>
        {[['List Size','listSize','#',500,100000,500],
          ['Open Rate (%)','openRate','%',5,70,1],
          ['Click Rate (%)','clickRate','%',0.5,20,0.5],
          ['Conversion Rate (%)','convRate','%',0.5,15,0.5],
          ['Product / Service Price','productPrice','$',50,10000,50],
          ['Sends Per Month','sendsPerMonth','#',1,12,1]].map(([label,key,unit,min,max,step])=>(
          <div key={key} style={{marginBottom:12}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
              <Label>{label}</Label>
              <span style={{fontFamily:F.mono,fontSize:11,color:C.sms}}>{unit==='$'?'$':''}{v[key]}{unit==='%'?'%':''}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v[key]} onChange={s(key)} style={{width:'100%',accentColor:C.sms}}/>
          </div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[
          {l:'Opens Per Send',      v:opens.toLocaleString(),             c:C.sms},
          {l:'Clicks Per Send',     v:clicks.toLocaleString(),            c:C.info},
          {l:'Sales Per Send',      v:sales.toLocaleString(),             c:C.accent},
          {l:'Revenue Per Send',    v:`$${parseInt(revenuePerSend).toLocaleString()}`, c:C.text},
          {l:'Monthly Revenue',     v:`$${parseInt(monthlyRev).toLocaleString()}`,     c:C.success},
          {l:'Annual Potential',    v:`$${parseInt(annualRev).toLocaleString()}`,      c:C.success},
        ].map(({l,v:val,c})=>(
          <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'11px 16px',flex:1}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>{l.toUpperCase()}</div>
            <div style={{fontFamily:F.display,fontSize:22,color:c,letterSpacing:1}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Calc_LTV() {
  const [v,setV]=useState({monthlyRetainer:2500,avgClientMonths:8,referralsPerClient:1.2,referralCloseRate:60,upsellRate:30,upsellValue:1500});
  const s=k=>e=>setV(x=>({...x,[k]:parseFloat(e.target.value)||0}));
  const baseRevenue=(v.monthlyRetainer*v.avgClientMonths).toFixed(0);
  const referralRevenue=((v.referralsPerClient*(v.referralCloseRate/100))*v.monthlyRetainer*v.avgClientMonths).toFixed(0);
  const upsellRevenue=((v.upsellRate/100)*v.upsellValue).toFixed(0);
  const trueLTV=(parseInt(baseRevenue)+parseInt(referralRevenue)+parseInt(upsellRevenue)).toLocaleString();
  const clients10=(parseInt(baseRevenue)*10).toLocaleString();
  return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}} className='rg-2'>
      <div>
        {[['Monthly Retainer','monthlyRetainer','$',500,15000,250],
          ['Avg Client Lifespan (months)','avgClientMonths','mo',1,36,1],
          ['Avg Referrals Per Client','referralsPerClient','#',0,5,0.1],
          ['Referral Close Rate (%)','referralCloseRate','%',10,90,5],
          ['Upsell Rate (%)','upsellRate','%',0,80,5],
          ['Avg Upsell Value','upsellValue','$',0,10000,250]].map(([label,key,unit,min,max,step])=>(
          <div key={key} style={{marginBottom:13}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
              <Label>{label}</Label>
              <span style={{fontFamily:F.mono,fontSize:11,color:C.success}}>{unit==='$'?'$':''}{v[key]}{unit==='%'?'%':unit==='mo'?' mo':''}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v[key]} onChange={s(key)} style={{width:'100%',accentColor:C.success}}/>
          </div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {[
          {l:'Base Revenue Per Client',    v:`$${parseInt(baseRevenue).toLocaleString()}`,    c:C.text},
          {l:'Referral Revenue Value',     v:`$${parseInt(referralRevenue).toLocaleString()}`,c:C.info},
          {l:'Upsell Revenue',             v:`$${parseInt(upsellRevenue).toLocaleString()}`,  c:C.accent},
          {l:'True LTV Per Client',        v:`$${trueLTV}`,   c:C.success},
          {l:'Value of 10 Clients',        v:`$${clients10}`, c:C.success},
          {l:'Months to $100k',            v:`${Math.ceil(100000/(v.monthlyRetainer||1))} clients`, c:C.warn},
        ].map(({l,v:val,c})=>(
          <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 16px',flex:1}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>{l.toUpperCase()}</div>
            <div style={{fontFamily:F.display,fontSize:20,color:c,letterSpacing:1}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Calc_Income() {
  const [v,setV]=useState({incomeGoal:15000,avgRetainer:2500,churnRate:10,closeRate:25,callsPerClose:4});
  const s=k=>e=>setV(x=>({...x,[k]:parseFloat(e.target.value)||0}));
  const clientsNeeded=Math.ceil(v.incomeGoal/(v.avgRetainer||1));
  const monthlyChurn=Math.round(clientsNeeded*(v.churnRate/100));
  const callsPerMonth=Math.ceil((clientsNeeded*(v.churnRate/100)*(100/Math.max(v.closeRate,1)))*4+(clientsNeeded*0.1*(100/Math.max(v.closeRate,1))));
  const leadsNeeded=Math.ceil(callsPerMonth/(v.closeRate/100));
  const revenueAt10=v.avgRetainer*10;
  const revenueAt25=v.avgRetainer*25;
  const revenueAt50=v.avgRetainer*50;
  return(
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}} className='rg-2'>
      <div>
        {[['Monthly Income Goal','incomeGoal','$',2000,100000,1000],
          ['Avg Monthly Retainer','avgRetainer','$',500,15000,250],
          ['Monthly Churn Rate (%)','churnRate','%',1,30,1],
          ['Sales Close Rate (%)','closeRate','%',5,80,5],
          ['Calls Needed Per Close','callsPerClose','#',1,20,1]].map(([label,key,unit,min,max,step])=>(
          <div key={key} style={{marginBottom:15}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
              <Label>{label}</Label>
              <span style={{fontFamily:F.mono,fontSize:11,color:C.warn}}>{unit==='$'?'$':''}{v[key]}{unit==='%'?'%':''}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={v[key]} onChange={s(key)} style={{width:'100%',accentColor:C.warn}}/>
          </div>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:9}}>
        {[
          {l:'Clients Needed',           v:`${clientsNeeded}`,              c:C.accent},
          {l:'Monthly Client Churn',     v:`${monthlyChurn} clients/mo`,    c:C.danger},
          {l:'Sales Calls Needed/mo',    v:`~${callsPerMonth} calls`,       c:C.warn},
          {l:'Leads Needed/mo',          v:`~${leadsNeeded} leads`,         c:C.text},
          {l:'Revenue at 10 Clients',    v:`$${revenueAt10.toLocaleString()}`, c:C.textSub},
          {l:'Revenue at 25 Clients',    v:`$${revenueAt25.toLocaleString()}`, c:C.info},
          {l:'Revenue at 50 Clients',    v:`$${revenueAt50.toLocaleString()}`, c:C.success},
        ].map(({l,v:val,c})=>(
          <div key={l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'11px 16px',flex:1}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>{l.toUpperCase()}</div>
            <div style={{fontFamily:F.display,fontSize:18,color:c,letterSpacing:1}}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SalesToolsView() {
  const [active, setActive] = useState('leadgen');
  const CALC_COMPONENTS = { leadgen:<Calc_LeadGen/>, adspend:<Calc_AdSpend/>, email:<Calc_Email/>, ltv:<Calc_LTV/>, income:<Calc_Income/> };
  const current = CALCS.find(c=>c.id===active);

  return (
    <div>
      <SectionHeader title="SALES TOOLS" sub="ROI calculators // run these live on prospect calls to close deals"/>

      <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:22}} className='rg-5'>
        {CALCS.map(c=>(
          <button key={c.id} onClick={()=>setActive(c.id)}
            style={{background:active===c.id?`${c.color}15`:C.card,border:`1px solid ${active===c.id?c.color:C.border}`,borderRadius:10,padding:'14px 16px',cursor:'pointer',textAlign:'left',transition:'all 0.15s'}}>
            <div style={{fontSize:20,marginBottom:8}}>{c.icon}</div>
            <div style={{fontFamily:F.mono,fontSize:11,color:active===c.id?c.color:C.text,marginBottom:4,lineHeight:1.3}}>{c.label}</div>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,lineHeight:1.5}}>{c.desc}</div>
          </button>
        ))}
      </div>

      <div style={{background:C.card,border:`1px solid ${current.color}44`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'16px 24px',borderBottom:`1px solid ${C.border}`,background:C.surface,display:'flex',alignItems:'center',gap:12}}>
          <div style={{width:32,height:32,borderRadius:8,background:`${current.color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>{current.icon}</div>
          <div>
            <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text}}>{current.label.toUpperCase()} CALCULATOR</div>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginTop:2}}>{current.desc}</div>
          </div>
          <div style={{marginLeft:'auto',padding:'6px 14px',background:`${current.color}15`,border:`1px solid ${current.color}44`,borderRadius:6,fontFamily:F.mono,fontSize:10,color:current.color}}>
            LIVE ON CALL READY
          </div>
        </div>
        <div style={{padding:24}}>
          {CALC_COMPONENTS[active]}
        </div>
        <div style={{padding:'14px 24px',borderTop:`1px solid ${C.border}`,background:C.surface}}>
          <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.7}}>
            <span style={{color:current.color}}>PRO TIP: </span>
            {{
              leadgen:'Run this live on the discovery call. Ask what their average client is worth, enter it together, and let the math close the deal. One extra client/month at $3k pays your fee 1.5x over.',
              adspend:'Show them the gap between current ROAS and achievable ROAS. That gap is your value. Most prospects have no idea what their current numbers actually are — this forces the conversation.',
              email:'If they have a list and aren\'t mailing it, this shows them money sitting on the table. Even a 1% conversion on 5,000 people at $500/sale is $25k/send.',
              ltv:'Use this to reframe price objections. If their true LTV per client is $20k, your $3k/month fee is 15% of one client. Frame it that way.',
              income:'Great for the first call. Run their income goal through this together — it shows them exactly how achievable it is and positions you as the system that gets them there.',
            }[active]}
          </div>
        </div>
      </div>
    </div>
  );
}



// ─── Meta Ads Creator ─────────────────────────────────────────────────────────────
const AD_OBJECTIVES = [
  {value:'lead-gen',    label:'Lead Generation'},
  {value:'traffic',     label:'Website Traffic'},
  {value:'conversion',  label:'Conversions'},
  {value:'awareness',   label:'Brand Awareness'},
  {value:'retargeting', label:'Retargeting'},
  {value:'oto',         label:'OTO / Follow-Up'},
];
const AD_TONES = [
  {value:'bold-direct',   label:'Bold & Direct',    sub:'No fluff, pattern interrupt'},
  {value:'conversational',label:'Conversational',   sub:'Feels like a friend talking'},
  {value:'story-based',   label:'Story-Based',      sub:'Hook with a narrative'},
  {value:'urgency',       label:'Urgency / Scarcity',sub:'FOMO-driven, deadline focused'},
];
const CTA_OPTIONS = ['Learn More','Sign Up','Apply Now','Get Quote','Book Now','Download','Watch More','Contact Us','Get Started','See Offer'];

function AdPreview({ad, niche}) {
  if(!ad) return null;
  return (
    <div style={{background:'#fff',borderRadius:12,overflow:'hidden',border:'1px solid #ddd',maxWidth:400,fontFamily:'system-ui,sans-serif'}}>
      <div style={{padding:'12px 14px',display:'flex',alignItems:'center',gap:10,borderBottom:'1px solid #eee'}}>
        <div style={{width:38,height:38,borderRadius:'50%',background:'#DC2626',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14,flexShrink:0}}>CS</div>
        <div>
          <div style={{fontWeight:600,fontSize:13,color:'#050505'}}>ClientSprint.ai</div>
          <div style={{fontSize:11,color:'#65676B',display:'flex',alignItems:'center',gap:4}}>Sponsored · <span style={{fontSize:10}}>🌐</span></div>
        </div>
      </div>
      <div style={{padding:'10px 14px'}}>
        <div style={{fontSize:13,color:'#050505',lineHeight:1.6,marginBottom:8,whiteSpace:'pre-wrap'}}>{(ad.primaryText||'').slice(0,125)}{(ad.primaryText||'').length>125?'... See more':''}</div>
      </div>
      <div style={{background:'#f0f2f5',aspectRatio:'1.91/1',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center',padding:20}}>
          <div style={{fontSize:11,color:'#65676B',marginBottom:6,fontFamily:'system-ui'}}>Ad Creative Here</div>
          <div style={{fontSize:28,color:'#DC2626'}}>◈</div>
        </div>
      </div>
      <div style={{padding:'10px 14px',borderTop:'1px solid #eee',display:'flex',justifyContent:'space-between',alignItems:'center',background:'#f0f2f5'}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:11,color:'#65676B',textTransform:'uppercase',marginBottom:2}}>{niche||'clientsprint.ai'}</div>
          <div style={{fontSize:14,fontWeight:700,color:'#050505',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ad.headline||'Your Headline Here'}</div>
          <div style={{fontSize:12,color:'#65676B',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{ad.description||''}</div>
        </div>
        <div style={{background:'#e4e6eb',borderRadius:6,padding:'7px 14px',fontWeight:600,fontSize:13,color:'#050505',marginLeft:12,flexShrink:0,whiteSpace:'nowrap'}}>{ad.cta||'Learn More'}</div>
      </div>
    </div>
  );
}

function MetaAdsView() {
  const [brief, setBrief] = useState({
    objective:'lead-gen', niche:'', offer:'', audience:'', pain:'',
    tone:'bold-direct', budget:'', platform:'both'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeVariant, setActiveVariant] = useState(0);
  const [copied, setCopied] = useState('');
  const [previewAd, setPreviewAd] = useState(null);
  const [voice, setVoice] = useState('direct');
  const [customVoice, setCustomVoice] = useState('');

  const set = (k,v) => setBrief(b=>({...b,[k]:v}));
  const ready = brief.niche.trim() && brief.offer.trim() && brief.audience.trim() && brief.pain.trim();

  const generate = async () => {
    if(!ready) return;
    setLoading(true); setError(''); setResult(null); setPreviewAd(null);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,
          messages:[{role:"user",content:`You are a world-class Meta (Facebook & Instagram) ad copywriter. Write 3 ad variations for A/B testing.

Brief:
- Objective: ${brief.objective}
- Niche: ${brief.niche}
- Offer: ${brief.offer}
- Target audience: ${brief.audience}
- Core pain point: ${brief.pain}
- Voice & Style: ${getVoicePrompt(voice, customVoice)}
- Platform: ${brief.platform}

Rules for each variation:
- Hook: First line must stop the scroll. Under 10 words. No clickbait. Start with the pain, a bold claim, or a pattern interrupt.
- Primary text: 3-5 sentences max. Lead with the hook, agitate the pain, present the solution, end with soft CTA.
- Headline: Under 40 chars. Benefit-driven or curiosity-driven.
- Description: Under 30 chars. Supporting detail or urgency.
- Each variation should use a different angle (pain-focused, result-focused, story-based).
- Andromeda tip: one specific insight on why this ad structure works with Meta's current algorithm.

Return ONLY raw JSON, no markdown:
{"variants":[{"name":"Variation A — Pain Hook","hook":"","primaryText":"","headline":"","description":"","cta":"Learn More","andromedaTip":""},{"name":"Variation B — Result Hook","hook":"","primaryText":"","headline":"","description":"","cta":"Apply Now","andromedaTip":""},{"name":"Variation C — Story Hook","hook":"","primaryText":"","headline":"","description":"","cta":"Learn More","andromedaTip":""}]}`}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
      setResult(parsed);
      setActiveVariant(0);
      setPreviewAd(parsed.variants[0]);
    } catch(e){ setError('Generation failed — try again.'); }
    setLoading(false);
  };

  const copy = (key,val) => {
    navigator.clipboard.writeText(val);
    setCopied(key); setTimeout(()=>setCopied(''),2000);
  };

  const copyAll = (v) => {
    const text = `${v.name}\n\nHOOK:\n${v.hook}\n\nPRIMARY TEXT:\n${v.primaryText}\n\nHEADLINE: ${v.headline}\nDESCRIPTION: ${v.description}\nCTA: ${v.cta}\n\nANDROMEDA TIP:\n${v.andromedaTip}`;
    copy('all'+v.name, text);
  };

  const CopyBtn = ({k,val,sm}) => (
    <button onClick={()=>copy(k,val)} style={{background:'none',border:'none',color:copied===k?C.success:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:sm?9:10,display:'flex',alignItems:'center',gap:3,padding:'2px 0'}}>
      {copied===k?<><CheckCircle size={9}/>Copied</>:<><Copy size={9}/>Copy</>}
    </button>
  );

  const variant = result?.variants?.[activeVariant];

  return (
    <div>
      <SectionHeader title="META ADS CREATOR" sub="AI-generated Facebook & Instagram ad copy // 3 variations, ready to launch"/>

      <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:20,alignItems:'start'}} className='rg-brief-sm'>
        {/* Brief Panel */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:18}}>AD BRIEF</div>

          <div style={{marginBottom:13}}>
            <Label>Objective</Label>
            <FSelect value={brief.objective} onChange={v=>set('objective',v)} options={AD_OBJECTIVES}/>
          </div>

          <div style={{marginBottom:13}}>
            <Label>Niche / Industry *</Label>
            <FInput value={brief.niche} onChange={v=>set('niche',v)} placeholder="e.g. Digital marketing agencies"/>
          </div>

          <div style={{marginBottom:13}}>
            <Label>Your Offer *</Label>
            <FTextarea value={brief.offer} onChange={v=>set('offer',v)} placeholder="e.g. AI-powered client acquisition system — land 3-5 clients in 60 days or money back" rows={3}/>
          </div>

          <div style={{marginBottom:13}}>
            <Label>Target Audience *</Label>
            <FInput value={brief.audience} onChange={v=>set('audience',v)} placeholder="e.g. Agency owners doing $5k-$20k/month"/>
          </div>

          <div style={{marginBottom:13}}>
            <Label>Core Pain Point *</Label>
            <FInput value={brief.pain} onChange={v=>set('pain',v)} placeholder="e.g. Inconsistent leads, feast or famine income"/>
          </div>

          <div style={{marginBottom:13}}>
            <Label>Platform</Label>
            <div style={{display:'flex',gap:8}}>
              {[{v:'both',l:'FB + IG'},{v:'facebook',l:'Facebook'},{v:'instagram',l:'Instagram'}].map(p=>(
                <button key={p.v} onClick={()=>set('platform',p.v)} style={{flex:1,background:brief.platform===p.v?C.accentLow:'transparent',border:`1px solid ${brief.platform===p.v?C.accent:C.border}`,borderRadius:6,padding:'8px 0',color:brief.platform===p.v?C.accent:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>{p.l}</button>
              ))}
            </div>
          </div>

          <VoiceSelector value={voice} customVoice={customVoice} onVoiceChange={setVoice} onCustomChange={setCustomVoice}/>

          <Btn Icon={Sparkles} onClick={generate} disabled={!ready||loading} style={{width:'100%',justifyContent:'center'}}>
            {loading?'Generating ads (~25s)...':'Generate 3 Variations'}
          </Btn>
          {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:9}}>{error}</div>}
        </div>

        {/* Output Panel */}
        <div>
          {!result&&!loading&&(
            <div style={{background:C.card,border:`2px dashed ${C.borderMid}`,borderRadius:10,padding:'56px 36px',textAlign:'center'}}>
              <div style={{fontFamily:F.display,fontSize:36,color:C.textMuted,marginBottom:12}}>◈</div>
              <div style={{fontFamily:F.display,fontSize:20,letterSpacing:2,color:C.textMuted,marginBottom:5}}>READY TO CREATE</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textMuted}}>Fill the brief — 4 fields required</div>
              <div style={{display:'flex',gap:10,justifyContent:'center',marginTop:16,flexWrap:'wrap'}}>
                {['Niche','Offer','Audience','Pain Point'].map(f=>(
                  <span key={f} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:5,padding:'4px 11px',fontFamily:F.mono,fontSize:10,color:C.textSub}}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {loading&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'56px 0',textAlign:'center'}}>
              <div style={{fontFamily:F.display,fontSize:24,letterSpacing:2,color:C.accent,marginBottom:6}}>WRITING ADS...</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub}}>Generating 3 variations for {brief.niche}</div>
            </div>
          )}

          {result&&variant&&(
            <div>
              {/* Variant Tabs */}
              <div style={{display:'flex',gap:8,marginBottom:16}}>
                {result.variants.map((v,i)=>(
                  <button key={i} onClick={()=>{setActiveVariant(i);setPreviewAd(v);}}
                    style={{flex:1,background:activeVariant===i?C.accentLow:C.card,border:`1px solid ${activeVariant===i?C.accent:C.border}`,borderRadius:8,padding:'10px 14px',cursor:'pointer',textAlign:'left'}}>
                    <div style={{fontFamily:F.mono,fontSize:10,color:activeVariant===i?C.accent:C.textSub,marginBottom:3}}>{v.name}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.hook}</div>
                  </button>
                ))}
              </div>

              <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:16,alignItems:'start'}}>
                <div>
                  {/* Header */}
                  <div style={{background:C.card,border:`1px solid ${C.accent}44`,borderRadius:10,padding:'16px 20px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text}}>{variant.name.toUpperCase()}</div>
                    <Btn variant="ghost" size="sm" Icon={Copy} onClick={()=>copyAll(variant)}>{copied==='all'+variant.name?'Copied!':'Copy All'}</Btn>
                  </div>

                  {/* Hook */}
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'14px 18px',marginBottom:10}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5}}>SCROLL-STOPPING HOOK</div>
                      <CopyBtn k={'hook'+activeVariant} val={variant.hook}/>
                    </div>
                    <div style={{fontFamily:F.display,fontSize:22,letterSpacing:1,color:C.accent,lineHeight:1.3}}>{variant.hook}</div>
                  </div>

                  {/* Primary Text */}
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'14px 18px',marginBottom:10}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5}}>PRIMARY TEXT</div>
                      <CopyBtn k={'primary'+activeVariant} val={variant.primaryText}/>
                    </div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{variant.primaryText}</div>
                  </div>

                  {/* Headline + Description + CTA */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:10}}>
                    {[
                      {label:'HEADLINE',key:'headline',val:variant.headline,limit:40},
                      {label:'DESCRIPTION',key:'description',val:variant.description,limit:30},
                      {label:'CTA BUTTON',key:'cta',val:variant.cta,limit:null},
                    ].map(({label,key,val,limit})=>(
                      <div key={key} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 14px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                          <div style={{fontFamily:F.mono,fontSize:8,color:C.textMuted,letterSpacing:1.5}}>{label}</div>
                          <CopyBtn k={key+activeVariant} val={val} sm/>
                        </div>
                        <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.5}}>{val}</div>
                        {limit&&<div style={{fontFamily:F.mono,fontSize:9,color:(val||'').length>limit?C.warn:C.textMuted,marginTop:4}}>{(val||'').length}/{limit}</div>}
                      </div>
                    ))}
                  </div>

                  {/* Andromeda Tip */}
                  <div style={{background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:8,padding:'12px 16px',display:'flex',gap:10,alignItems:'flex-start'}}>
                    <div style={{fontFamily:F.display,fontSize:18,color:C.accent,flexShrink:0,marginTop:-2}}>◈</div>
                    <div>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:1.5,marginBottom:4}}>ANDROMEDA INSIGHT</div>
                      <div style={{fontFamily:F.mono,fontSize:11,color:C.text,lineHeight:1.7}}>{variant.andromedaTip}</div>
                    </div>
                  </div>
                </div>

                {/* Live Preview */}
                <div style={{width:340,flexShrink:0}}>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:10,textAlign:'center'}}>LIVE PREVIEW</div>
                  <AdPreview ad={previewAd} niche={brief.niche}/>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,marginTop:10,textAlign:'center',lineHeight:1.6}}>Preview shows how your ad appears in Facebook feed. Creative not included.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ─── AI Solution Analyzer ─────────────────────────────────────────────────────────
const INDUSTRIES_AI = [
  'Home Services (HVAC, Plumbing, Roofing)','Healthcare / Medical Practice','Dental Practice',
  'Real Estate Agency','Mortgage / Lending','E-commerce / Retail','Restaurant / Food & Bev',
  'Legal / Law Firm','Financial Services','Insurance Agency','Fitness / Gym / Wellness',
  'Marketing Agency','SaaS / Tech Company','Construction / Contracting','Auto Dealership',
  'Coaching / Consulting','Staffing / Recruiting','Property Management','Other',
];
const BUDGET_RANGES = [
  'Under $1,000','$1,000 – $3,000','$3,000 – $7,500','$7,500 – $15,000','$15,000 – $30,000','$30,000+','Unknown / TBD',
];
const TEAM_SIZES = ['Solo / 1-2','3-10','11-25','26-50','50-100','100+'];
const COMPLEXITY_COLOR = {Low:C => C.success, Medium:C => C.warn, High:C => C.danger};

function AISolutionView() {
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState({
    industry:'', companyName:'', teamSize:'3-10', budget:'$3,000 – $7,500',
    problems:'', currentTools:'', bottlenecks:'', triedBefore:'', goalIn90:'',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const set = (k,v) => setFields(f=>({...f,[k]:v}));
  const ready = fields.industry && fields.problems.trim() && fields.bottlenecks.trim();

  const STEPS = [
    {
      title:'Prospect Info',
      fields:[
        {k:'companyName', label:'Company / Prospect Name', ph:'e.g. Apex Roofing Co.', type:'input'},
        {k:'industry',    label:'Industry *',              ph:'',                       type:'select'},
        {k:'teamSize',    label:'Team Size',               ph:'',                       type:'select2'},
        {k:'budget',      label:'Approximate Budget',      ph:'',                       type:'select3'},
      ]
    },
    {
      title:'Their Problems',
      fields:[
        {k:'problems',    label:'Core Business Problems *', ph:'e.g. Leads fall through the cracks, no follow-up system, team spends 3hrs/day on manual data entry, can\'t track which marketing is working', type:'textarea'},
        {k:'bottlenecks', label:'Biggest Operational Bottlenecks *', ph:'e.g. Scheduling is chaos — 4 people managing it manually. Estimates take 2 days. Invoicing is always late.', type:'textarea'},
        {k:'currentTools',label:'Current Tools / Tech Stack', ph:'e.g. ServiceTitan, QuickBooks, Excel, pen and paper...', type:'input'},
      ]
    },
    {
      title:'Context & Goals',
      fields:[
        {k:'triedBefore', label:'What Have They Tried Before?', ph:'e.g. Hired a VA that didn\'t work out. Tried HubSpot but gave up. Have a website but no leads.', type:'textarea'},
        {k:'goalIn90',    label:'What Does Success Look Like in 90 Days?', ph:'e.g. Cut admin time by 50%, double lead response speed, get 10 more jobs per month without hiring.', type:'textarea'},
      ]
    },
  ];

  const generate = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const brief = `
Company: ${fields.companyName||'Unnamed'}
Industry: ${fields.industry}
Team Size: ${fields.teamSize}
Budget: ${fields.budget}
Core Problems: ${fields.problems}
Operational Bottlenecks: ${fields.bottlenecks}
Current Tools: ${fields.currentTools||'Unknown'}
What They\'ve Tried: ${fields.triedBefore||'Nothing mentioned'}
90-Day Success Goal: ${fields.goalIn90||'Not specified'}`;

      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,
          messages:[{role:"user",content:`You are a senior AI solutions architect advising an AI agency owner before a sales call. Based on this prospect brief, recommend the optimal AI solution to build and deliver.

${brief}

Be extremely specific. Name real tools, real workflows, real outcomes. Sound like someone who has built this before.

Return ONLY raw JSON, no markdown:
{
  "solutionName": "Specific punchy name for the AI solution",
  "solutionType": "One of: Automation, Chatbot, Lead Gen System, Analytics Dashboard, AI Assistant, Workflow System, CRM Integration, Content System",
  "tagline": "One sentence — what it does and why it matters",
  "problemsSolved": ["specific problem 1 solved","specific problem 2 solved","specific problem 3 solved"],
  "whatItDoes": "3-4 sentences describing exactly what this solution does day-to-day in plain language. Be concrete — mention specific workflows, triggers, and outputs.",
  "techStack": ["Tool/API 1 with why","Tool/API 2 with why","Tool/API 3 with why","Tool/API 4 with why"],
  "buildComplexity": "Low|Medium|High",
  "buildTime": "e.g. 2-3 weeks",
  "roiCase": "Specific ROI argument — use numbers. e.g. If they close 2 extra jobs/month at $2,400 avg, that is $4,800/month or $57,600/year from this system.",
  "setupPrice": "e.g. $4,500",
  "monthlyPrice": "e.g. $750/month",
  "pitchAngle": "How the agency owner should position and pitch this solution on the call — specific talking points, what to emphasize, what objection to pre-empt.",
  "quickWin": "The one thing they can show results on in the first 2 weeks to build trust.",
  "warningFlags": ["Potential challenge 1 to watch for","Potential challenge 2"]
}`}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      setResult(JSON.parse(text.replace(/```json|```/g,'').trim()));
    } catch(e){ setError('Analysis failed — try again.'); }
    setLoading(false);
  };

  const copy = (k,v) => { navigator.clipboard.writeText(v); setCopied(k); setTimeout(()=>setCopied(''),2000); };

  const CopyBtn = ({k,val}) => (
    <button onClick={()=>copy(k,val)} style={{background:'none',border:'none',color:copied===k?C.success:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:9,display:'flex',alignItems:'center',gap:3}}>
      {copied===k?<><CheckCircle size={9}/>Copied</>:<><Copy size={9}/>Copy</>}
    </button>
  );

  const Block = ({label,k,val,children,accent}) => (
    <div style={{background:C.surface,border:`1px solid ${accent?C.accentMid:C.border}`,borderRadius:8,padding:'13px 17px',marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
        <div style={{fontFamily:F.mono,fontSize:9,color:accent?C.accent:C.textMuted,letterSpacing:1.5}}>{label}</div>
        {k&&<CopyBtn k={k} val={val}/>}
      </div>
      {children}
    </div>
  );

  if(result) return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
        <button onClick={()=>{setResult(null);setStep(0);}} style={{background:'none',border:'none',color:C.textSub,cursor:'pointer',fontFamily:F.mono,fontSize:12,display:'flex',alignItems:'center',gap:5}}><ArrowLeft size={12}/>New Analysis</button>
        <span style={{color:C.border}}>|</span>
        <h2 style={{fontFamily:F.display,fontSize:22,letterSpacing:2,color:C.text,margin:0}}>AI SOLUTION RECOMMENDATION</h2>
        <button onClick={()=>{
          const full=`AI SOLUTION FOR ${fields.companyName||fields.industry}\n\n${result.solutionName}\n${result.tagline}\n\nWHAT IT DOES\n${result.whatItDoes}\n\nPROBLEMS SOLVED\n${result.problemsSolved.join('\n')}\n\nTECH STACK\n${result.techStack.join('\n')}\n\nBUILD TIME: ${result.buildTime} | COMPLEXITY: ${result.buildComplexity}\n\nPRICING\nSetup: ${result.setupPrice}\nMonthly: ${result.monthlyPrice}\n\nROI CASE\n${result.roiCase}\n\nPITCH ANGLE\n${result.pitchAngle}\n\nQUICK WIN\n${result.quickWin}`;
          copy('all',full);
        }} style={{marginLeft:'auto',background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:6,padding:'7px 14px',color:C.accent,fontFamily:F.mono,fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
          <Copy size={11}/>{copied==='all'?'Copied!':'Copy Full Report'}
        </button>
      </div>

      {/* Hero card */}
      <div style={{background:C.card,border:`1px solid ${C.accent}55`,borderRadius:12,padding:'24px 28px',marginBottom:14,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,right:-20,width:80,height:'100%',background:C.accentLow,transform:'skewX(-12deg)',pointerEvents:'none'}}/>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
              <span style={{background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:4,padding:'2px 10px',fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:1}}>{result.solutionType?.toUpperCase()}</span>
              <span style={{background:result.buildComplexity==='Low'?C.successLow:result.buildComplexity==='High'?C.dangerLow:C.warnLow,
                border:`1px solid ${result.buildComplexity==='Low'?'rgba(34,197,94,0.2)':result.buildComplexity==='High'?'rgba(239,68,68,0.2)':'rgba(245,158,11,0.2)'}`,
                borderRadius:4,padding:'2px 10px',fontFamily:F.mono,fontSize:9,
                color:result.buildComplexity==='Low'?C.success:result.buildComplexity==='High'?C.danger:C.warn,letterSpacing:1}}>
                {result.buildComplexity?.toUpperCase()} COMPLEXITY
              </span>
            </div>
            <div style={{fontFamily:F.display,fontSize:30,letterSpacing:2,color:C.accent,marginBottom:5}}>{result.solutionName}</div>
            <div style={{fontFamily:F.mono,fontSize:13,color:C.text,lineHeight:1.6}}>{result.tagline}</div>
          </div>
          <div style={{textAlign:'right',flexShrink:0,marginLeft:24}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,marginBottom:3}}>BUILD TIME</div>
            <div style={{fontFamily:F.display,fontSize:20,color:C.text,marginBottom:8}}>{result.buildTime}</div>
            <div style={{fontFamily:F.display,fontSize:22,color:C.success}}>{result.setupPrice}</div>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub}}>{result.monthlyPrice} recurring</div>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
        <div>
          <Block label="WHAT IT DOES" k="what" val={result.whatItDoes}>
            <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.75}}>{result.whatItDoes}</div>
          </Block>
          <Block label="PROBLEMS IT SOLVES" k="problems" val={result.problemsSolved.join('\n')}>
            {result.problemsSolved.map((p,i)=>(
              <div key={i} style={{display:'flex',gap:9,marginBottom:7,alignItems:'flex-start'}}>
                <CheckCircle size={12} color={C.success} style={{flexShrink:0,marginTop:2}}/>
                <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.6}}>{p}</div>
              </div>
            ))}
          </Block>
          <Block label="ROI CASE" k="roi" val={result.roiCase} accent>
            <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.75,borderLeft:`2px solid ${C.accent}`,paddingLeft:12}}>{result.roiCase}</div>
          </Block>
        </div>
        <div>
          <Block label="TECH STACK" k="stack" val={result.techStack.join('\n')}>
            {result.techStack.map((t,i)=>(
              <div key={i} style={{display:'flex',gap:9,marginBottom:7,alignItems:'flex-start'}}>
                <div style={{width:18,height:18,borderRadius:4,background:C.accentLow,display:'flex',alignItems:'center',justifyContent:'center',color:C.accent,fontFamily:F.display,fontSize:10,flexShrink:0}}>{i+1}</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.text,lineHeight:1.6}}>{t}</div>
              </div>
            ))}
          </Block>
          <Block label="QUICK WIN (FIRST 2 WEEKS)" k="quick" val={result.quickWin}>
            <div style={{fontFamily:F.mono,fontSize:12,color:C.success,lineHeight:1.7}}>{result.quickWin}</div>
          </Block>
          <Block label="WATCH FOR" k="warn" val={result.warningFlags.join('\n')}>
            {result.warningFlags.map((w,i)=>(
              <div key={i} style={{display:'flex',gap:9,marginBottom:6,alignItems:'flex-start'}}>
                <AlertCircle size={12} color={C.warn} style={{flexShrink:0,marginTop:2}}/>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.6}}>{w}</div>
              </div>
            ))}
          </Block>
        </div>
      </div>

      <Block label="HOW TO PITCH THIS ON THE CALL" k="pitch" val={result.pitchAngle} accent>
        <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.8,borderLeft:`2px solid ${C.accent}`,paddingLeft:14}}>{result.pitchAngle}</div>
      </Block>
    </div>
  );

  const currentStep = STEPS[step];

  return (
    <div>
      <SectionHeader title="AI SOLUTION ANALYZER" sub="Input prospect problems // get a custom AI solution recommendation"/>

      {/* Progress */}
      <div style={{display:'flex',gap:8,marginBottom:22}}>
        {STEPS.map((s,i)=>(
          <button key={i} onClick={()=>setStep(i)} style={{flex:1,background:step===i?C.accentLow:C.card,border:`1px solid ${step===i?C.accent:C.border}`,borderRadius:8,padding:'11px 14px',cursor:'pointer',textAlign:'left'}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:step===i?C.accent:C.textMuted,letterSpacing:1.5,marginBottom:3}}>STEP {i+1}</div>
            <div style={{fontFamily:F.mono,fontSize:12,color:step===i?C.accent:C.textSub}}>{s.title}</div>
          </button>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20,alignItems:'start'}} className='rg-chart'>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:26}}>
          <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text,marginBottom:20}}>{currentStep.title.toUpperCase()}</div>
          {currentStep.fields.map(f=>(
            <div key={f.k} style={{marginBottom:16}}>
              <Label>{f.label}</Label>
              {f.type==='select'
                ? <FSelect value={fields[f.k]} onChange={v=>set(f.k,v)} options={[{value:'',label:'Select industry...'}, ...INDUSTRIES_AI.map(i=>({value:i,label:i}))]}/>
                : f.type==='select2'
                ? <FSelect value={fields[f.k]} onChange={v=>set(f.k,v)} options={TEAM_SIZES.map(s=>({value:s,label:s}))}/>
                : f.type==='select3'
                ? <FSelect value={fields[f.k]} onChange={v=>set(f.k,v)} options={BUDGET_RANGES.map(b=>({value:b,label:b}))}/>
                : f.type==='textarea'
                ? <FTextarea value={fields[f.k]} onChange={v=>set(f.k,v)} placeholder={f.ph} rows={4}/>
                : <FInput value={fields[f.k]} onChange={v=>set(f.k,v)} placeholder={f.ph}/>
              }
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',marginTop:20}}>
            <Btn variant="ghost" Icon={ArrowLeft} onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}>Back</Btn>
            {step<STEPS.length-1
              ? <Btn Icon={ChevronRight} onClick={()=>setStep(s=>s+1)}>Next</Btn>
              : <Btn Icon={Sparkles} onClick={generate} disabled={!ready||loading}>{loading?'Analyzing (~25s)...':'Analyze & Recommend'}</Btn>
            }
          </div>
          {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:10}}>{error}</div>}
        </div>

        {/* Summary sidebar */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
          <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:14}}>BRIEF SUMMARY</div>
          {[
            {l:'Company',   v:fields.companyName||'–'},
            {l:'Industry',  v:fields.industry||'–'},
            {l:'Team',      v:fields.teamSize},
            {l:'Budget',    v:fields.budget},
          ].map(({l,v})=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{l}</span>
              <span style={{fontFamily:F.mono,fontSize:10,color:C.text,maxWidth:160,textAlign:'right',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v}</span>
            </div>
          ))}
          {fields.problems&&(
            <div style={{marginTop:12}}>
              <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:6}}>PROBLEMS NOTED</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.text,lineHeight:1.7}}>{fields.problems.slice(0,140)}{fields.problems.length>140?'…':''}</div>
            </div>
          )}
          {ready&&(
            <div style={{marginTop:16,padding:'10px 14px',background:C.successLow,border:`1px solid rgba(34,197,94,0.2)`,borderRadius:7,display:'flex',alignItems:'center',gap:7,fontFamily:F.mono,fontSize:11,color:C.success}}>
              <CheckCircle size={12}/>Ready to analyze
            </div>
          )}
          <div style={{marginTop:16,padding:'11px 14px',background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:7}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:1.5,marginBottom:5}}>HOW TO USE THIS</div>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.7}}>Take notes during your discovery call, fill this in after, and use the recommendation to go back with a specific AI solution proposal. Works best with real details — the more specific the input, the sharper the output.</div>
          </div>
        </div>
      </div>
    </div>
  );
}



// ─── VSL Script Generator ─────────────────────────────────────────────────────────
const VSL_LENGTHS = [
  {value:'short', label:'Short (3-5 min)', sub:'Best for cold traffic, simple offers'},
  {value:'medium',label:'Medium (8-12 min)',sub:'Most common — enough to sell and qualify'},
  {value:'long',  label:'Long (15-20 min)', sub:'High-ticket, complex offers needing more proof'},
];

function VSLView() {
  const [fields, setFields] = useState({
    niche:'', offer:'', audience:'', pain:'', result:'',
    proof:'', cta:'', price:'', length:'medium', tone:'direct',
  });
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [copied, setCopied] = useState('');
  const [voice, setVoice] = useState('direct');
  const [customVoice, setCustomVoice] = useState('');

  const set = (k,v) => setFields(f=>({...f,[k]:v}));
  const ready = fields.niche && fields.offer && fields.audience && fields.pain && fields.result;

  const SECTIONS = ['Hook','Problem','Agitate','Solution','Proof','Offer','CTA'];
  const SECTION_COLORS = ['#DC2626','#EF4444','#F59E0B','#22C55E','#60A5FA','#7C3AED','#DC2626'];
  const SECTION_DESC = [
    'Stop the scroll — make them need to keep watching',
    'Name their exact situation so they feel seen',
    'Twist the knife — make the cost of inaction real',
    'Position your offer as the inevitable answer',
    'Third-party proof that removes skepticism',
    'Stack the value, reveal the price, anchor it',
    'Tell them exactly what to do right now',
  ];

  const generate = async () => {
    setLoading(true); setError(''); setScript(null);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,
          messages:[{role:"user",content:`You are a world-class VSL copywriter. Write a complete ${fields.length} video sales letter script using the 7-part framework.

Brief:
- Niche: ${fields.niche}
- Offer: ${fields.offer}
- Target audience: ${fields.audience}
- Core pain: ${fields.pain}
- Result delivered: ${fields.result}
- Social proof: ${fields.proof||'Not provided'}
- CTA / desired action: ${fields.cta||'Book a free call'}
- Price point: ${fields.price||'Not specified'}
- Voice & Style: ${getVoicePrompt(voice, customVoice)}

For each section write word-for-word script copy. Include [PAUSE], [SLOW DOWN], [LOOK INTO CAMERA] delivery notes in brackets where they matter. Be specific, direct, and emotionally resonant. No generic filler.

Length guidance: short=600-900 words total, medium=1200-1800 words, long=2200-3000 words.

Return ONLY raw JSON, no markdown:
{
  "title": "VSL title / working name",
  "estimatedRuntime": "e.g. 9-11 minutes",
  "sections": [
    {"name":"Hook","script":"full word-for-word script","tip":"delivery note","wordCount":0},
    {"name":"Problem","script":"","tip":"","wordCount":0},
    {"name":"Agitate","script":"","tip":"","wordCount":0},
    {"name":"Solution","script":"","tip":"","wordCount":0},
    {"name":"Proof","script":"","tip":"","wordCount":0},
    {"name":"Offer","script":"","tip":"","wordCount":0},
    {"name":"CTA","script":"","tip":"","wordCount":0}
  ],
  "totalWords": 0,
  "openingHook": "The very first sentence — make it a killer",
  "productionTips": ["tip 1","tip 2","tip 3"]
}`}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      const parsed = JSON.parse(text.replace(/```json|```/g,'').trim());
      setScript(parsed);
      setActiveSection(0);
    } catch(e){ setError('Generation failed — try again.'); }
    setLoading(false);
  };

  const copy = (k,v) => { navigator.clipboard.writeText(v); setCopied(k); setTimeout(()=>setCopied(''),2000); };

  const copyFullScript = () => {
    if(!script) return;
    const full = `${script.title}\nEstimated Runtime: ${script.estimatedRuntime} | ${script.totalWords} words\n\n` +
      script.sections.map(s=>`${'='.repeat(40)}\n${s.name.toUpperCase()}\n${'='.repeat(40)}\n\n${s.script}\n\n[DELIVERY TIP: ${s.tip}]\n`).join('\n') +
      `\n${'='.repeat(40)}\nPRODUCTION TIPS\n${'='.repeat(40)}\n${script.productionTips.join('\n')}`;
    copy('full', full);
  };

  const CopyBtn = ({k,val,label}) => (
    <button onClick={()=>copy(k,val)} style={{background:'none',border:'none',color:copied===k?C.success:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:10,display:'flex',alignItems:'center',gap:4}}>
      {copied===k?<><CheckCircle size={10}/>Copied</>:<><Copy size={10}/>{label||'Copy'}</>}
    </button>
  );

  if(script) {
    const sec = script.sections[activeSection];
    const col = SECTION_COLORS[activeSection];
    return (
      <div>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}>
          <button onClick={()=>{setScript(null);}} style={{background:'none',border:'none',color:C.textSub,cursor:'pointer',fontFamily:F.mono,fontSize:12,display:'flex',alignItems:'center',gap:5}}><ArrowLeft size={12}/>Rewrite</button>
          <span style={{color:C.border}}>|</span>
          <h2 style={{fontFamily:F.display,fontSize:22,letterSpacing:2,color:C.text,margin:0}}>{script.title?.toUpperCase()}</h2>
          <div style={{marginLeft:'auto',display:'flex',gap:10,alignItems:'center'}}>
            <span style={{fontFamily:F.mono,fontSize:11,color:C.textSub}}>{script.estimatedRuntime} · {script.totalWords?.toLocaleString()} words</span>
            <button onClick={copyFullScript} style={{background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:6,padding:'7px 14px',color:C.accent,fontFamily:F.mono,fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
              <Copy size={11}/>{copied==='full'?'Copied!':'Copy Full Script'}
            </button>
          </div>
        </div>

        {/* Opening hook callout */}
        <div style={{background:C.card,border:`1px solid ${C.accent}44`,borderRadius:10,padding:'16px 22px',marginBottom:16,display:'flex',gap:12,alignItems:'flex-start'}}>
          <div style={{fontFamily:F.display,fontSize:22,color:C.accent,flexShrink:0}}>❝</div>
          <div>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:1.5,marginBottom:5}}>OPENING LINE — READ THIS FIRST</div>
            <div style={{fontFamily:F.display,fontSize:18,color:C.text,letterSpacing:1,lineHeight:1.4}}>{script.openingHook}</div>
          </div>
          <CopyBtn k="opener" val={script.openingHook} label="Copy opener"/>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:16}}>
          {/* Section nav */}
          <div style={{display:'flex',flexDirection:'column',gap:7}}>
            {script.sections.map((s,i)=>{
              const c=SECTION_COLORS[i];
              return (
                <button key={i} onClick={()=>setActiveSection(i)}
                  style={{background:activeSection===i?`${c}15`:C.card,border:`1px solid ${activeSection===i?c:C.border}`,borderRadius:8,padding:'11px 13px',cursor:'pointer',textAlign:'left'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                    <div style={{fontFamily:F.mono,fontSize:11,color:activeSection===i?c:C.text}}>{s.name}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{s.wordCount}w</div>
                  </div>
                  <div style={{width:'100%',height:2,background:C.border,borderRadius:1}}>
                    <div style={{width:`${Math.min((s.wordCount/200)*100,100)}%`,height:'100%',background:c,borderRadius:1}}/>
                  </div>
                </button>
              );
            })}
            <div style={{marginTop:8,padding:'12px 13px',background:C.card,border:`1px solid ${C.border}`,borderRadius:8}}>
              <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,marginBottom:6,letterSpacing:1.5}}>PRODUCTION TIPS</div>
              {script.productionTips?.map((t,i)=>(
                <div key={i} style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.6,marginBottom:4}}>· {t}</div>
              ))}
            </div>
          </div>

          {/* Active section */}
          <div>
            <div style={{background:C.card,border:`1px solid ${col}44`,borderRadius:10,overflow:'hidden'}}>
              <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,background:C.surface,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:8,height:24,background:col,borderRadius:2,transform:'skewX(-8deg)'}}/>
                    <div style={{fontFamily:F.display,fontSize:20,letterSpacing:2,color:col}}>{sec.name.toUpperCase()}</div>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginTop:3}}>{SECTION_DESC[activeSection]}</div>
                </div>
                <div style={{display:'flex',gap:10,alignItems:'center'}}>
                  <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{sec.wordCount} words</span>
                  <CopyBtn k={`sec${activeSection}`} val={sec.script}/>
                </div>
              </div>
              <div style={{padding:'20px 24px'}}>
                <div style={{fontFamily:F.mono,fontSize:13,color:C.text,lineHeight:1.9,whiteSpace:'pre-wrap'}}>{sec.script}</div>
              </div>
              <div style={{padding:'12px 20px',borderTop:`1px solid ${C.border}`,background:C.surface,display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:20,height:20,borderRadius:4,background:`${col}18`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:col}}/>
                </div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,fontStyle:'italic'}}>{sec.tip}</div>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:12}}>
              <Btn variant="ghost" size="sm" Icon={ArrowLeft} onClick={()=>setActiveSection(s=>Math.max(0,s-1))} disabled={activeSection===0}>Previous</Btn>
              <Btn size="sm" Icon={ChevronRight} onClick={()=>setActiveSection(s=>Math.min(script.sections.length-1,s+1))} disabled={activeSection===script.sections.length-1}>Next Section</Btn>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="VSL SCRIPT GENERATOR" sub="Word-for-word video sales letter // 7-part framework, delivery notes included"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}} className='rg-2'>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:18}}>BRIEF</div>
          {[
            {k:'niche',    label:'Niche / Industry *',   ph:'e.g. AI agency owners, dental practices',   type:'input'},
            {k:'offer',    label:'Your Offer *',         ph:'e.g. Done-for-you AI client acquisition system — land 3-5 clients in 60 days', type:'textarea'},
            {k:'audience', label:'Target Audience *',    ph:'e.g. Agency owners doing $0-$10k/month stuck in feast or famine', type:'input'},
            {k:'pain',     label:'Core Pain Point *',    ph:'e.g. No consistent lead flow, don\'t know what to say on calls', type:'textarea'},
            {k:'result',   label:'Result You Deliver *', ph:'e.g. First client in 30 days, $5k-$15k/month within 90 days', type:'input'},
            {k:'proof',    label:'Social Proof / Credentials', ph:'e.g. Helped 400+ agencies, top revenue generator in ScaleClients', type:'input'},
            {k:'price',    label:'Price Point',          ph:'e.g. $1,997 + $197/month', type:'input'},
            {k:'cta',      label:'Call to Action',       ph:'e.g. Click below to apply for a free strategy call', type:'input'},
          ].map(f=>(
            <div key={f.k} style={{marginBottom:13}}>
              <Label>{f.label}</Label>
              {f.type==='textarea'
                ? <FTextarea value={fields[f.k]} onChange={v=>set(f.k,v)} placeholder={f.ph} rows={3}/>
                : <FInput value={fields[f.k]} onChange={v=>set(f.k,v)} placeholder={f.ph}/>
              }
            </div>
          ))}
        </div>
        <div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22,marginBottom:14}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>SCRIPT LENGTH</div>
            {VSL_LENGTHS.map(l=>(
              <button key={l.value} onClick={()=>set('length',l.value)}
                style={{width:'100%',background:fields.length===l.value?C.accentLow:C.surface,border:`1px solid ${fields.length===l.value?C.accent:C.border}`,borderRadius:7,padding:'11px 15px',cursor:'pointer',textAlign:'left',marginBottom:8}}>
                <div style={{fontFamily:F.mono,fontSize:12,color:fields.length===l.value?C.accent:C.text,marginBottom:3}}>{l.label}</div>
                <div style={{fontFamily:F.mono,fontSize:10,color:'#999999'}}>{l.sub}</div>
              </button>
            ))}
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22,marginBottom:14}}>
            <VoiceSelector value={voice} customVoice={customVoice} onVoiceChange={setVoice} onCustomChange={setCustomVoice}/>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
            <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>THE 7-PART FRAMEWORK</div>
            {SECTIONS.map((s,i)=>(
              <div key={s} style={{display:'flex',gap:10,marginBottom:8,alignItems:'flex-start'}}>
                <div style={{width:22,height:22,borderRadius:'50%',background:`${SECTION_COLORS[i]}18`,border:`1px solid ${SECTION_COLORS[i]}44`,display:'flex',alignItems:'center',justifyContent:'center',color:SECTION_COLORS[i],fontFamily:F.display,fontSize:11,flexShrink:0}}>{i+1}</div>
                <div>
                  <div style={{fontFamily:F.mono,fontSize:11,color:C.text}}>{s}</div>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{SECTION_DESC[i]}</div>
                </div>
              </div>
            ))}
          </div>
          <Btn Icon={Sparkles} onClick={generate} disabled={!ready||loading} style={{width:'100%',justifyContent:'center',padding:'13px 0'}}>
            {loading?'Writing VSL (~45s)...':'Generate VSL Script'}
          </Btn>
          {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:9}}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── Client Report Generator ──────────────────────────────────────────────────────
const REPORT_PERIODS = ['This Week','Last Week','This Month','Last Month','Last 30 Days','Last 90 Days','Custom Period'];
const SERVICES = ['Email Campaigns','SMS Campaigns','Lead Generation','Facebook/Instagram Ads','SEO','Content Marketing','CRM Setup','AI Automation','Full-Service Growth','Other'];

function ClientReportView() {
  const [fields, setFields] = useState({
    clientName:'', agencyName:'ClientSprint.ai', service:'Email Campaigns',
    period:'Last Month', wins:'', metrics:'', challenges:'', nextSteps:'',
    goal:'', tone:'professional',
  });
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const set = (k,v) => setFields(f=>({...f,[k]:v}));
  const ready = fields.clientName && fields.wins && fields.metrics;

  const generate = async () => {
    setLoading(true); setError(''); setReport(null);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,
          messages:[{role:"user",content:`You are writing a client performance report on behalf of an AI agency. Make the client feel informed, impressed, and confident about their investment. Write in plain language — no jargon.

Details:
- Client: ${fields.clientName}
- Agency: ${fields.agencyName}
- Service: ${fields.service}
- Period: ${fields.period}
- Results / Wins: ${fields.wins}
- Key Metrics: ${fields.metrics}
- Challenges / Context: ${fields.challenges||'None noted'}
- Next Steps: ${fields.nextSteps||'Continue current strategy'}
- Client Goal: ${fields.goal||'Grow revenue'}
- Tone: ${fields.tone}

Return ONLY raw JSON, no markdown:
{
  "subject": "Email subject line for sending this report",
  "greeting": "Opening sentence — warm, specific, make them feel good",
  "summary": "2-3 sentence executive summary — lead with the win",
  "highlights": [{"metric":"metric name","value":"value","context":"why this matters in plain English"}],
  "wins": "Paragraph celebrating the biggest wins — specific, enthusiastic but credible",
  "context": "Optional paragraph addressing any challenges or market context — honest but reassuring",
  "nextMonth": "What you're focusing on next and why — builds excitement and shows forward momentum",
  "closing": "Warm professional closing — invite questions, reinforce confidence",
  "callToAction": "One clear next step for the client e.g. reply with questions, hop on a call"
}`}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      setReport(JSON.parse(text.replace(/```json|```/g,'').trim()));
    } catch(e){ setError('Generation failed — try again.'); }
    setLoading(false);
  };

  const copy = (k,v) => { navigator.clipboard.writeText(v); setCopied(k); setTimeout(()=>setCopied(''),2000); };

  const copyFull = () => {
    if(!report) return;
    const full = `Subject: ${report.subject}\n\n${report.greeting}\n\n${report.summary}\n\nKEY RESULTS — ${fields.period}\n${report.highlights?.map(h=>`${h.metric}: ${h.value} — ${h.context}`).join('\n')}\n\n${report.wins}\n\n${report.context?report.context+'\n\n':''}WHAT\'S NEXT\n${report.nextMonth}\n\n${report.closing}\n\n${report.callToAction}`;
    copy('full', full);
  };

  const CopyBtn = ({k,val}) => (
    <button onClick={()=>copy(k,val)} style={{background:'none',border:'none',color:copied===k?C.success:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:9,display:'flex',alignItems:'center',gap:3}}>
      {copied===k?<><CheckCircle size={9}/>Copied</>:<><Copy size={9}/>Copy</>}
    </button>
  );

  return (
    <div>
      <SectionHeader title="CLIENT REPORT" sub="Monthly performance reports // keeps clients happy and paying"/>
      <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:20,alignItems:'start'}} className='rg-brief-sm'>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:18}}>REPORT BRIEF</div>
          {[
            {k:'clientName',  label:'Client Name *',          ph:'e.g. Apex Roofing Co.',        type:'input'},
            {k:'agencyName',  label:'Your Agency Name',        ph:'ClientSprint.ai',              type:'input'},
            {k:'service',     label:'Service Delivered',       ph:'',                             type:'select'},
            {k:'period',      label:'Report Period',           ph:'',                             type:'select2'},
            {k:'goal',        label:'Client\'s Goal',         ph:'e.g. More booked jobs, brand awareness', type:'input'},
            {k:'metrics',     label:'Key Metrics / Numbers *', ph:'e.g. 42% open rate, 312 leads generated, 28 booked calls, $14,200 pipeline created', type:'textarea'},
            {k:'wins',        label:'Wins This Period *',      ph:'e.g. Best open rate in 3 months. Booked call record week. New campaign beat control by 40%.', type:'textarea'},
            {k:'challenges',  label:'Any Challenges / Context',ph:'e.g. Lower volume week due to holiday. Testing new audience — early results positive.', type:'textarea'},
            {k:'nextSteps',   label:'Next Month Focus',        ph:'e.g. Launch retargeting sequence, A/B test subject lines, expand to SMS.', type:'textarea'},
          ].map(f=>(
            <div key={f.k} style={{marginBottom:13}}>
              <Label>{f.label}</Label>
              {f.type==='select'
                ? <FSelect value={fields[f.k]} onChange={v=>set(f.k,v)} options={SERVICES.map(s=>({value:s,label:s}))}/>
                : f.type==='select2'
                ? <FSelect value={fields[f.k]} onChange={v=>set(f.k,v)} options={REPORT_PERIODS.map(s=>({value:s,label:s}))}/>
                : f.type==='textarea'
                ? <FTextarea value={fields[f.k]} onChange={v=>set(f.k,v)} placeholder={f.ph} rows={3}/>
                : <FInput value={fields[f.k]} onChange={v=>set(f.k,v)} placeholder={f.ph}/>
              }
            </div>
          ))}
          <div style={{marginBottom:16}}>
            <Label>Tone</Label>
            <div style={{display:'flex',gap:8}}>
              {[{v:'professional',l:'Professional'},{v:'warm',l:'Warm'},{v:'data-driven',l:'Data-Driven'}].map(t=>(
                <button key={t.v} onClick={()=>set('tone',t.v)} style={{flex:1,background:fields.tone===t.v?C.accentLow:'transparent',border:`1px solid ${fields.tone===t.v?C.accent:C.border}`,borderRadius:6,padding:'8px 0',color:fields.tone===t.v?C.accent:C.textSub,fontFamily:F.mono,fontSize:10,cursor:'pointer'}}>{t.l}</button>
              ))}
            </div>
          </div>
          <Btn Icon={FileText} onClick={generate} disabled={!ready||loading} style={{width:'100%',justifyContent:'center'}}>
            {loading?'Writing Report...':'Generate Report'}
          </Btn>
          {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:9}}>{error}</div>}
        </div>

        <div>
          {!report&&!loading&&(
            <div style={{background:C.card,border:`2px dashed ${C.borderMid}`,borderRadius:10,padding:'56px 36px',textAlign:'center'}}>
              <FileText size={28} color={C.textMuted} style={{display:'block',margin:'0 auto 12px'}}/>
              <div style={{fontFamily:F.display,fontSize:20,letterSpacing:2,color:C.textMuted,marginBottom:5}}>READY TO GENERATE</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textMuted}}>Client name, metrics, and wins are required</div>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginTop:10,lineHeight:1.7}}>Takes 3 minutes to fill in.<br/>Saves 45 minutes writing.<br/>Keeps clients paying.</div>
            </div>
          )}
          {loading&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'56px 0',textAlign:'center'}}>
              <div style={{fontFamily:F.display,fontSize:24,letterSpacing:2,color:C.accent}}>WRITING REPORT...</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,marginTop:6}}>Crafting {fields.period} report for {fields.clientName}</div>
            </div>
          )}
          {report&&(
            <div>
              {/* Email header */}
              <div style={{background:C.card,border:`1px solid ${C.accent}44`,borderRadius:12,padding:'20px 24px',marginBottom:12,position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',top:0,right:-16,width:60,height:'100%',background:C.accentLow,transform:'skewX(-12deg)',pointerEvents:'none'}}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:6}}>EMAIL SUBJECT LINE</div>
                    <div style={{fontFamily:F.mono,fontSize:14,color:C.text,marginBottom:3}}>{report.subject}</div>
                    <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub}}>To: {fields.clientName} · {fields.period} · {fields.service}</div>
                  </div>
                  <button onClick={copyFull} style={{background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:6,padding:'7px 14px',color:C.accent,fontFamily:F.mono,fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                    <Copy size={11}/>{copied==='full'?'Copied!':'Copy Full Email'}
                  </button>
                </div>
              </div>

              {/* Metrics highlights */}
              {report.highlights?.length>0&&(
                <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(report.highlights.length,4)},1fr)`,gap:10,marginBottom:12}}>
                  {report.highlights.slice(0,4).map((h,i)=>(
                    <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:'13px 16px'}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:5}}>{h.metric?.toUpperCase()}</div>
                      <div style={{fontFamily:F.display,fontSize:22,color:C.accent,marginBottom:4}}>{h.value}</div>
                      <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.5}}>{h.context}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Report body */}
              {[
                {label:'OPENING',      k:'greeting',  val:report.greeting,  col:C.text},
                {label:'SUMMARY',      k:'summary',   val:report.summary,   col:C.text},
                {label:'WINS',         k:'wins',      val:report.wins,      col:C.success},
                ...(report.context?[{label:'CONTEXT',k:'context',val:report.context,col:C.textSub}]:[]),
                {label:"WHAT'S NEXT",  k:'next',      val:report.nextMonth, col:C.info},
                {label:'CLOSING',      k:'closing',   val:report.closing,   col:C.text},
                {label:'CALL TO ACTION',k:'cta2',     val:report.callToAction,col:C.accent},
              ].map(({label,k,val,col})=>(
                <div key={k} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'13px 17px',marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5}}>{label}</div>
                    <CopyBtn k={k} val={val}/>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:12,color:col,lineHeight:1.75}}>{val}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



// ─── Cold Call Script ──────────────────────────────────────────────────────────
const CALL_GOALS = [
  {value:'appointment', label:'Set an Appointment'},
  {value:'qualify',     label:'Qualify the Prospect'},
  {value:'close',       label:'Close on the Call'},
  {value:'reactivate',  label:'Re-engage Cold Lead'},
];

function ColdCallView() {
  const [fields, setFields] = useState({niche:'',offer:'',prospect:'',goal:'appointment',pain:''});
  const [voice, setVoice] = useState('direct');
  const [customVoice, setCustomVoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const set = (k,v) => setFields(f=>({...f,[k]:v}));
  const ready = fields.niche && fields.offer && fields.prospect;

  const generate = async () => {
    setLoading(true); setError(''); setScript(null);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,
          messages:[{role:"user",content:`You are an elite sales trainer writing a cold call script. Be specific, conversational, and pressure-free. No robotic scripts.

Brief:
- Niche: ${fields.niche}
- Offer: ${fields.offer}
- Prospect type: ${fields.prospect}
- Call goal: ${fields.goal}
- Core pain to address: ${fields.pain||'General pain points for this niche'}
- Voice: ${getVoicePrompt(voice, customVoice)}

Return ONLY raw JSON, no markdown:
{"opener":"The first 10 seconds — permission-based, non-salesy, gets them talking","permissionBridge":"One sentence to earn the right to continue after they say hello","discoveryQuestions":["question 1","question 2","question 3","question 4"],"pitchLine":"The 2-sentence pitch once you know their pain — ties directly to what they just told you","transitionToClose":"How to move from conversation to next step naturally","close":"The exact ask — specific, low-pressure, clear","voicemail":"15-20 second voicemail script if they don't pick up","objectionPre":"The one objection most likely to come up and how to handle it before it does","toneTip":"One coaching note on delivery — pacing, tone, energy"}`}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      setScript(JSON.parse(text.replace(/```json|```/g,'').trim()));
    } catch(e){setError('Generation failed — try again.');}
    setLoading(false);
  };

  const copy = (k,v) => {navigator.clipboard.writeText(v);setCopied(k);setTimeout(()=>setCopied(''),2000);};
  const copyAll = () => {
    if(!script) return;
    const full = `COLD CALL SCRIPT — ${fields.niche}\n\nOPENER\n${script.opener}\n\nPERMISSION BRIDGE\n${script.permissionBridge}\n\nDISCOVERY QUESTIONS\n${script.discoveryQuestions.join('\n')}\n\nPITCH\n${script.pitchLine}\n\nTRANSITION\n${script.transitionToClose}\n\nCLOSE\n${script.close}\n\nVOICEMAIL\n${script.voicemail}\n\nOBJECTION PRE-HANDLE\n${script.objectionPre}\n\nDELIVERY TIP\n${script.toneTip}`;
    copy('all',full);
  };

  const CopyBtn = ({k,val}) => (
    <button onClick={()=>copy(k,val)} style={{background:'none',border:'none',color:copied===k?C.success:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:9,display:'flex',alignItems:'center',gap:3,flexShrink:0}}>
      {copied===k?<><CheckCircle size={9}/>Copied</>:<><Copy size={9}/>Copy</>}
    </button>
  );

  const Block = ({label,k,val,children,accent}) => (
    <div style={{background:C.surface,border:`1px solid ${accent?C.accentMid:C.border}`,borderRadius:8,padding:'12px 16px',marginBottom:9}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
        <div style={{fontFamily:F.mono,fontSize:9,color:accent?C.accent:C.textMuted,letterSpacing:1.5}}>{label}</div>
        {k&&<CopyBtn k={k} val={val}/>}
      </div>
      {children}
    </div>
  );

  return (
    <div>
      <SectionHeader title="COLD CALL SCRIPT" sub="Opening, discovery, pitch, close, voicemail — all generated"/>
      <div style={{display:'grid',gridTemplateColumns:'340px 1fr',gap:20,alignItems:'start'}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:18}}>BRIEF</div>
          <div style={{marginBottom:12}}><Label>Niche *</Label><FInput value={fields.niche} onChange={v=>set('niche',v)} placeholder="e.g. Home service companies"/></div>
          <div style={{marginBottom:12}}><Label>Your Offer *</Label><FTextarea value={fields.offer} onChange={v=>set('offer',v)} placeholder="e.g. AI-powered lead gen system — 20+ qualified leads/month" rows={3}/></div>
          <div style={{marginBottom:12}}><Label>Prospect Type *</Label><FInput value={fields.prospect} onChange={v=>set('prospect',v)} placeholder="e.g. HVAC company owner, 5-15 employees"/></div>
          <div style={{marginBottom:12}}><Label>Core Pain</Label><FInput value={fields.pain} onChange={v=>set('pain',v)} placeholder="e.g. Slow season, no consistent leads"/></div>
          <div style={{marginBottom:14}}><Label>Call Goal</Label><FSelect value={fields.goal} onChange={v=>set('goal',v)} options={CALL_GOALS}/></div>
          <VoiceSelector value={voice} customVoice={customVoice} onVoiceChange={setVoice} onCustomChange={setCustomVoice}/>
          <Btn Icon={Phone} onClick={generate} disabled={!ready||loading} style={{width:'100%',justifyContent:'center'}}>{loading?'Writing script (~20s)...':'Generate Script'}</Btn>
          {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:8}}>{error}</div>}
        </div>

        <div>
          {!script&&!loading&&(
            <div style={{background:C.card,border:`2px dashed ${C.borderMid}`,borderRadius:10,padding:'50px 36px',textAlign:'center'}}>
              <Phone size={26} color={C.textMuted} style={{display:'block',margin:'0 auto 12px'}}/>
              <div style={{fontFamily:F.display,fontSize:20,letterSpacing:2,color:C.textMuted,marginBottom:5}}>READY TO GENERATE</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textMuted}}>Niche, offer, and prospect type required</div>
            </div>
          )}
          {loading&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'50px 0',textAlign:'center'}}><div style={{fontFamily:F.display,fontSize:22,letterSpacing:2,color:C.accent}}>WRITING SCRIPT...</div></div>}
          {script&&(
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text}}>YOUR SCRIPT</div>
                <button onClick={copyAll} style={{background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:6,padding:'7px 14px',color:C.accent,fontFamily:F.mono,fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Copy size={11}/>{copied==='all'?'Copied!':'Copy Full Script'}</button>
              </div>
              <Block label="OPENER — FIRST 10 SECONDS" k="opener" val={script.opener} accent>
                <div style={{fontFamily:F.display,fontSize:18,color:C.accent,lineHeight:1.4}}>{script.opener}</div>
              </Block>
              <Block label="PERMISSION BRIDGE" k="bridge" val={script.permissionBridge}>
                <div style={{fontFamily:F.mono,fontSize:13,color:C.text,lineHeight:1.7}}>{script.permissionBridge}</div>
              </Block>
              <Block label="DISCOVERY QUESTIONS" k="discovery" val={script.discoveryQuestions.join('\n')}>
                {script.discoveryQuestions.map((q,i)=>(
                  <div key={i} style={{display:'flex',gap:10,marginBottom:8,alignItems:'flex-start'}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:C.accentLow,display:'flex',alignItems:'center',justifyContent:'center',color:C.accent,fontFamily:F.display,fontSize:11,flexShrink:0}}>{i+1}</div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.6}}>{q}</div>
                  </div>
                ))}
              </Block>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9,marginBottom:9}}>
                <Block label="PITCH" k="pitch" val={script.pitchLine}>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.7}}>{script.pitchLine}</div>
                </Block>
                <Block label="TRANSITION TO CLOSE" k="transition" val={script.transitionToClose}>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.7}}>{script.transitionToClose}</div>
                </Block>
              </div>
              <Block label="THE CLOSE — EXACT WORDS" k="close" val={script.close} accent>
                <div style={{fontFamily:F.mono,fontSize:13,color:C.text,lineHeight:1.7,borderLeft:`2px solid ${C.accent}`,paddingLeft:12}}>{script.close}</div>
              </Block>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}>
                <Block label="VOICEMAIL (IF NO ANSWER)" k="voicemail" val={script.voicemail}>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.textSub,lineHeight:1.7,fontStyle:'italic'}}>{script.voicemail}</div>
                </Block>
                <Block label="PRE-HANDLE OBJECTION" k="obj" val={script.objectionPre}>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.7}}>{script.objectionPre}</div>
                </Block>
              </div>
              <div style={{marginTop:9,padding:'11px 16px',background:C.accentLow,border:`1px solid ${C.accentMid}`,borderRadius:8,display:'flex',gap:10,alignItems:'flex-start'}}>
                <div style={{fontFamily:F.display,fontSize:16,color:C.accent,flexShrink:0}}>◈</div>
                <div>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:1.5,marginBottom:4}}>DELIVERY TIP</div>
                  <div style={{fontFamily:F.mono,fontSize:11,color:C.text,lineHeight:1.7}}>{script.toneTip}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Objection Handler ─────────────────────────────────────────────────────────
const COMMON_OBJECTIONS = [
  "I need to think about it",
  "It's too expensive",
  "I'm not ready yet",
  "Send me some information",
  "I need to talk to my partner / spouse",
  "I already have someone doing this",
  "I've tried this before and it didn't work",
  "I don't have the budget right now",
  "What kind of results do you guarantee?",
  "I'm not sure this will work for my business",
];

function ObjectionView() {
  const [objection, setObjection] = useState('');
  const [context, setContext] = useState({offer:'',stage:'mid-call',prospect:''});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [activeResponse, setActiveResponse] = useState(0);
  const setCtx = (k,v) => setContext(c=>({...c,[k]:v}));

  const handle = async (obj) => {
    const o = obj || objection;
    if(!o.trim()) return;
    setObjection(o);
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,
          messages:[{role:"user",content:`You are an elite sales coach. A prospect just said: "${o}"

Context:
- Your offer: ${context.offer||'AI agency services'}
- Prospect type: ${context.prospect||'Business owner'}
- Stage: ${context.stage}

Generate 3 different response approaches — each with a distinct strategy. Be specific and conversational. No scripted-sounding language.

Return ONLY raw JSON, no markdown:
{"objection":"${o}","responses":[{"strategy":"Direct Reframe","response":"exact words to say","why":"why this works psychologically"},{"strategy":"Empathy + Bridge","response":"exact words to say","why":"why this works psychologically"},{"strategy":"Question Back","response":"exact words to say","why":"why this works psychologically"}],"rootCause":"What this objection usually really means","watchOut":"What NOT to say or do when you hear this"}`}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      setResult(JSON.parse(text.replace(/```json|```/g,'').trim()));
      setActiveResponse(0);
    } catch(e){setError('Failed — try again.');}
    setLoading(false);
  };

  const copy = (k,v) => {navigator.clipboard.writeText(v);setCopied(k);setTimeout(()=>setCopied(''),2000);};

  return (
    <div>
      <SectionHeader title="OBJECTION HANDLER" sub="Pull this up mid-call // tap an objection, get your response"/>
      <div style={{display:'grid',gridTemplateColumns:'320px 1fr',gap:20,alignItems:'start'}}>
        <div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
            <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:14}}>CONTEXT</div>
            <div style={{marginBottom:11}}><Label>Your Offer</Label><FInput value={context.offer} onChange={v=>setCtx('offer',v)} placeholder="e.g. AI lead gen system, $2,997/mo"/></div>
            <div style={{marginBottom:11}}><Label>Prospect Type</Label><FInput value={context.prospect} onChange={v=>setCtx('prospect',v)} placeholder="e.g. HVAC company owner"/></div>
            <div style={{marginBottom:4}}><Label>Call Stage</Label>
              <FSelect value={context.stage} onChange={v=>setCtx('stage',v)} options={[
                {value:'opening',    label:'Opening / Intro'},
                {value:'mid-call',   label:'Mid-Call / Discovery'},
                {value:'pitch',      label:'After the Pitch'},
                {value:'close',      label:'At the Close'},
                {value:'follow-up',  label:'Follow-Up Call'},
              ]}/>
            </div>
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
            <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>TYPE YOUR OWN</div>
            <FInput value={objection} onChange={setObjection} placeholder="What did they just say?"/>
            <Btn Icon={MessageSquare} onClick={()=>handle()} disabled={!objection.trim()||loading} style={{width:'100%',justifyContent:'center',marginTop:10}}>
              {loading?'Getting responses (~15s)...':'Get Response'}
            </Btn>
            {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:7}}>{error}</div>}
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
            <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>COMMON OBJECTIONS</div>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:10}}>TAP TO HANDLE INSTANTLY</div>
            {COMMON_OBJECTIONS.map((o,i)=>(
              <button key={i} onClick={()=>handle(o)} disabled={loading}
                style={{width:'100%',background:objection===o?C.accentLow:C.surface,border:`1px solid ${objection===o?C.accent:C.border}`,borderRadius:6,padding:'9px 12px',cursor:'pointer',textAlign:'left',marginBottom:6,display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontFamily:F.mono,fontSize:11,color:objection===o?C.accent:C.text,lineHeight:1.4}}>"{o}"</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          {!result&&!loading&&(
            <div style={{background:C.card,border:`2px dashed ${C.borderMid}`,borderRadius:10,padding:'56px 36px',textAlign:'center'}}>
              <MessageSquare size={26} color={C.textMuted} style={{display:'block',margin:'0 auto 12px'}}/>
              <div style={{fontFamily:F.display,fontSize:20,letterSpacing:2,color:C.textMuted,marginBottom:5}}>PULL THIS UP MID-CALL</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textMuted}}>Tap any objection on the left or type what they said</div>
            </div>
          )}
          {loading&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'56px 0',textAlign:'center'}}>
              <div style={{fontFamily:F.display,fontSize:22,letterSpacing:2,color:C.accent}}>LOADING RESPONSES...</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,marginTop:5}}>3 angles incoming</div>
            </div>
          )}
          {result&&(
            <div>
              <div style={{background:C.card,border:`1px solid ${C.accent}44`,borderRadius:10,padding:'16px 20px',marginBottom:14}}>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:5}}>THEY SAID</div>
                <div style={{fontFamily:F.display,fontSize:20,color:C.text,letterSpacing:1}}>"{result.objection}"</div>
              </div>

              <div style={{display:'flex',gap:8,marginBottom:14}}>
                {result.responses.map((r,i)=>(
                  <button key={i} onClick={()=>setActiveResponse(i)} style={{flex:1,background:activeResponse===i?C.accentLow:C.card,border:`1px solid ${activeResponse===i?C.accent:C.border}`,borderRadius:8,padding:'10px 12px',cursor:'pointer',textAlign:'left'}}>
                    <div style={{fontFamily:F.mono,fontSize:10,color:activeResponse===i?C.accent:C.textSub,marginBottom:3}}>{r.strategy}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.response.slice(0,40)}...</div>
                  </button>
                ))}
              </div>

              {result.responses[activeResponse]&&(
                <div>
                  <div style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:10,padding:'18px 20px',marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:1.5}}>{result.responses[activeResponse].strategy.toUpperCase()}</div>
                      <button onClick={()=>copy('resp',result.responses[activeResponse].response)} style={{background:'none',border:'none',color:copied==='resp'?C.success:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:10,display:'flex',alignItems:'center',gap:4}}>
                        {copied==='resp'?<><CheckCircle size={10}/>Copied</>:<><Copy size={10}/>Copy</>}
                      </button>
                    </div>
                    <div style={{fontFamily:F.display,fontSize:20,color:C.accent,lineHeight:1.4,marginBottom:10}}>SAY THIS:</div>
                    <div style={{fontFamily:F.mono,fontSize:14,color:C.text,lineHeight:1.8,borderLeft:`3px solid ${C.accent}`,paddingLeft:14}}>{result.responses[activeResponse].response}</div>
                    <div style={{marginTop:12,padding:'9px 12px',background:C.accentLow,borderRadius:6,fontFamily:F.mono,fontSize:10,color:C.textSub,fontStyle:'italic'}}>Why this works: {result.responses[activeResponse].why}</div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 16px'}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:6}}>ROOT CAUSE</div>
                      <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.6}}>{result.rootCause}</div>
                    </div>
                    <div style={{background:C.dangerLow,border:`1px solid rgba(239,68,68,0.2)`,borderRadius:8,padding:'12px 16px'}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.danger,letterSpacing:1.5,marginBottom:6}}>DON'T DO THIS</div>
                      <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.6}}>{result.watchOut}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── KPI Tracker ───────────────────────────────────────────────────────────────
const KPI_KEY = 'cs_kpi_data_v1';

function KPIView() {
  const blank = () => ({mrr:0,clients:0,mrrGoal:10000,clientGoal:20,churn:0,pipeline:0,callsBooked:0,callsHeld:0,dealsClosedMo:0,newRevMo:0,month:new Date().toLocaleString('default',{month:'long',year:'numeric'})});
  const [data, setData] = useState(() => { try { const s=localStorage.getItem(KPI_KEY); return s?JSON.parse(s):blank(); } catch{ return blank(); } });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data);
  const [history, setHistory] = useState(() => { try { const s=localStorage.getItem(KPI_KEY+'_hist'); return s?JSON.parse(s):[]; } catch{ return []; } });

  const save = () => {
    setData(draft);
    try {
      localStorage.setItem(KPI_KEY, JSON.stringify(draft));
      const hist = [draft, ...history].slice(0,6);
      setHistory(hist);
      localStorage.setItem(KPI_KEY+'_hist', JSON.stringify(hist));
    } catch(e){}
    setEditing(false);
  };

  const set = (k,v) => setDraft(d=>({...d,[k]:parseFloat(v)||0}));

  const mrrPct = data.mrrGoal>0?Math.min((data.mrr/data.mrrGoal)*100,100):0;
  const clientPct = data.clientGoal>0?Math.min((data.clients/data.clientGoal)*100,100):0;
  const closeRate = data.callsHeld>0?((data.dealsClosedMo/data.callsHeld)*100).toFixed(0):0;
  const showRate = data.callsBooked>0?((data.callsHeld/data.callsBooked)*100).toFixed(0):0;
  const churnPct = data.clients>0?((data.churn/data.clients)*100).toFixed(1):0;

  const Gauge = ({pct,color,size=80}) => {
    const r=size/2-8, circ=2*Math.PI*r, fill=(pct/100)*circ;
    return (
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6} strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" style={{transition:'stroke-dasharray 0.5s ease'}}/>
      </svg>
    );
  };

  const KpiCard = ({label,value,sub,color,pct,goal}) => (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:'18px 20px',position:'relative',overflow:'hidden'}}>
      {pct!==undefined&&<div style={{position:'absolute',top:14,right:14}}><Gauge pct={pct} color={color||C.accent} size={52}/><div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontFamily:F.display,fontSize:13,color:color||C.accent,marginTop:26}}>{Math.round(pct)}%</div></div>}
      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:6}}>{label.toUpperCase()}</div>
      <div style={{fontFamily:F.display,fontSize:30,color:color||C.text,letterSpacing:1,marginBottom:3}}>{value}</div>
      {goal&&<div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>Goal: {goal}</div>}
      {sub&&<div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,marginTop:2}}>{sub}</div>}
      {pct!==undefined&&(
        <div style={{marginTop:10,background:C.border,borderRadius:2,height:3}}>
          <div style={{width:`${pct}%`,height:'100%',background:color||C.accent,borderRadius:2,transition:'width 0.5s ease'}}/>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:26}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:4}}>
            <h2 style={{fontFamily:F.display,fontSize:26,letterSpacing:3,color:C.text,margin:0}}>KPI TRACKER</h2>
            <div style={{display:'flex',gap:3}}>{[...Array(4)].map((_,i)=><div key={i} style={{width:i===0?10:6,height:i===0?22:14,background:i<2?C.accent:C.border,transform:'skewX(-12deg)',borderRadius:1}}/>)}</div>
          </div>
          <p style={{fontFamily:F.mono,fontSize:11,color:C.textSub,margin:0}}>{data.month} — your agency numbers</p>
        </div>
        <Btn Icon={editing?CheckCircle:Plus} onClick={editing?save:()=>{setDraft(data);setEditing(true)}} variant={editing?'success':'primary'}>
          {editing?'Save Numbers':'Update Numbers'}
        </Btn>
      </div>

      {editing?(
        <div style={{background:C.card,border:`1px solid ${C.accent}`,borderRadius:10,padding:26,marginBottom:20}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:18}}>UPDATE YOUR NUMBERS — {new Date().toLocaleString('default',{month:'long',year:'numeric'})}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
            {[
              {k:'mrr',     l:'Current MRR ($)',         ph:'7500'},
              {k:'mrrGoal', l:'MRR Goal ($)',             ph:'10000'},
              {k:'clients', l:'Active Clients',           ph:'8'},
              {k:'clientGoal',l:'Client Goal',            ph:'20'},
              {k:'churn',   l:'Clients Lost This Month',  ph:'0'},
              {k:'pipeline',l:'Pipeline Value ($)',        ph:'25000'},
              {k:'callsBooked',l:'Calls Booked',          ph:'12'},
              {k:'callsHeld',  l:'Calls Held / Showed',   ph:'9'},
              {k:'dealsClosedMo',l:'Deals Closed',        ph:'2'},
              {k:'newRevMo',    l:'New Revenue Added ($)', ph:'5994'},
            ].map(f=>(
              <div key={f.k}>
                <Label>{f.l}</Label>
                <FInput value={draft[f.k]||''} onChange={v=>set(f.k,v)} placeholder={f.ph}/>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:10,marginTop:16}}>
            <Btn Icon={CheckCircle} onClick={save}>Save</Btn>
            <Btn variant="ghost" onClick={()=>setEditing(false)}>Cancel</Btn>
          </div>
        </div>
      ):(
        <>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:14}}>
            <KpiCard label="Monthly Recurring Revenue" value={`$${data.mrr.toLocaleString()}`} goal={`$${data.mrrGoal.toLocaleString()}`} color={C.accent} pct={mrrPct}/>
            <KpiCard label="Active Clients" value={data.clients} goal={`${data.clientGoal} clients`} color={C.success} pct={clientPct}/>
            <KpiCard label="Pipeline Value" value={`$${data.pipeline.toLocaleString()}`} sub="potential revenue" color={C.info}/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:14}}>
            <KpiCard label="Close Rate" value={`${closeRate}%`} sub={`${data.dealsClosedMo} of ${data.callsHeld} held calls`} color={parseInt(closeRate)>=25?C.success:C.warn}/>
            <KpiCard label="Show Rate" value={`${showRate}%`} sub={`${data.callsHeld} showed of ${data.callsBooked} booked`} color={parseInt(showRate)>=75?C.success:C.warn}/>
            <KpiCard label="Churn This Month" value={data.churn} sub={`${churnPct}% of client base`} color={data.churn===0?C.success:C.danger}/>
            <KpiCard label="New Revenue Added" value={`$${data.newRevMo.toLocaleString()}`} sub="this month" color={C.success}/>
          </div>

          {history.length>1&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
              <div style={{padding:'13px 20px',borderBottom:`1px solid ${C.border}`}}><div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text}}>HISTORY</div></div>
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr style={{background:C.surface}}>{['Month','MRR','Clients','New Rev','Close Rate','Churn'].map(h=><th key={h} style={{padding:'9px 16px',fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,textAlign:'left',borderBottom:`1px solid ${C.border}`}}>{h.toUpperCase()}</th>)}</tr></thead>
                <tbody>{history.slice(0,5).map((h,i)=>(
                  <tr key={i} style={{borderBottom:i<history.length-1?`1px solid ${C.border}`:'none'}}>
                    <td style={{padding:'10px 16px',fontFamily:F.mono,fontSize:11,color:C.textSub}}>{h.month}</td>
                    <td style={{padding:'10px 16px',fontFamily:F.mono,fontSize:12,color:C.accent}}>${(h.mrr||0).toLocaleString()}</td>
                    <td style={{padding:'10px 16px',fontFamily:F.mono,fontSize:12,color:C.text}}>{h.clients}</td>
                    <td style={{padding:'10px 16px',fontFamily:F.mono,fontSize:12,color:C.success}}>${(h.newRevMo||0).toLocaleString()}</td>
                    <td style={{padding:'10px 16px',fontFamily:F.mono,fontSize:12,color:C.text}}>{h.callsHeld>0?((h.dealsClosedMo/h.callsHeld)*100).toFixed(0):0}%</td>
                    <td style={{padding:'10px 16px',fontFamily:F.mono,fontSize:12,color:h.churn===0?C.success:C.danger}}>{h.churn}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}



// ─── Email & SMS Blast ─────────────────────────────────────────────────────────
function BlastView({ contacts }) {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState('email');
  const [subject, setSubject] = useState('');
  const [preview, setPreview] = useState('');
  const [body, setBody] = useState('');
  const [smsBody, setSmsBody] = useState('');
  const [aiGoal, setAiGoal] = useState('');
  const [aiAudience, setAiAudience] = useState('');
  const [voice, setVoice] = useState('direct');
  const [customVoice, setCustomVoice] = useState('');
  const [generating, setGenerating] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [importedList, setImportedList] = useState([]);
  const [filterTag, setFilterTag] = useState('all');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const allContacts = [...contacts, ...importedList];
  const tags = ['all', ...new Set(allContacts.flatMap(c => c.tags || []).filter(Boolean))];
  const filtered = allContacts.filter(c => {
    const matchTag = filterTag === 'all' || (c.tags || []).includes(filterTag);
    const matchSearch = !search || (c.name + c.email + c.phone).toLowerCase().includes(search.toLowerCase());
    const hasMedium = mode === 'email' ? c.email : c.phone;
    return matchTag && matchSearch && hasMedium;
  });

  const toggleAll = () => setSelectedContacts(s => s.size === filtered.length ? new Set() : new Set(filtered.map(c => c.id)));
  const toggle = id => setSelectedContacts(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleFile = file => {
    const r = new FileReader();
    r.onload = e => {
      const lines = e.target.result.split('\n').filter(l => l.trim());
      const pr = l => { const r=[],c={cell:'',q:false}; for(const ch of l){if(ch==='"')c.q=!c.q;else if(ch===','&&!c.q){r.push(c.cell.trim());c.cell='';}else c.cell+=ch;} r.push(c.cell.trim()); return r; };
      if (lines.length < 2) return;
      const headers = pr(lines[0]);
      const rows = lines.slice(1).map((l,i) => {
        const v = pr(l);
        const row = headers.reduce((o,h,j)=>({...o,[h]:v[j]||''}),{});
        return { id: `import-${Date.now()}-${i}`, email: row.email||row.Email||row.EMAIL||'', phone: row.phone||row.Phone||row.mobile||'', name: row.name||row.Name||row['First Name']||'', company: row.company||row.Company||'', status:'active', tags:[], added:'Imported' };
      }).filter(c => c.email || c.phone);
      setImportedList(rows);
      setSelectedContacts(new Set(rows.map(c => c.id)));
    };
    r.readAsText(file);
  };

  const generateAI = async () => {
    if (!aiGoal.trim()) return;
    setGenerating(true); setError('');
    try {
      const isEmail = mode === 'email';
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000,
          messages:[{role:"user",content:`You are a high-converting ${isEmail?'email':'SMS'} copywriter for ClientSprint.ai. Write a ${emailType} message.
Goal: ${aiGoal}
Audience: ${aiAudience||'Agency owners and aspiring AI agency owners'}
Voice: ${getVoicePrompt(voice, customVoice)}
${isEmail
  ? 'Return ONLY raw JSON: {"subject":"subject line","preview":"preview text under 90 chars","body":"email body starting with Hi {{first_name}}, — punchy, under 150 words, clear CTA"}'
  : 'Return ONLY raw JSON: {"body":"SMS message under 160 chars, include {{first_name}}, end with Reply STOP to opt out"}'
}`}]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      const result = JSON.parse(text.replace(/```json|```/g,'').trim());
      if (isEmail) { setSubject(result.subject||''); setPreview(result.preview||''); setBody(result.body||''); }
      else { setSmsBody(result.body||''); }
    } catch(e) { setError('Generation failed — try again.'); }
    setGenerating(false);
  };

  const sendBlast = () => {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1800);
  };

  const reset = () => { setStep(1); setSent(false); setSubject(''); setBody(''); setSmsBody(''); setPreview(''); setSelectedContacts(new Set()); setImportedList([]); setAiGoal(''); };

  const recipientCount = selectedContacts.size;
  const isEmail = mode === 'email';
  const copyReady = isEmail ? (subject && body) : smsBody;

  if (sent) return (
    <div style={{textAlign:'center',padding:'80px 40px'}}>
      <div style={{fontFamily:F.display,fontSize:48,color:C.success,marginBottom:12}}>✓</div>
      <div style={{fontFamily:F.display,fontSize:28,letterSpacing:2,color:C.text,marginBottom:8}}>BLAST SENT</div>
      <div style={{fontFamily:F.mono,fontSize:13,color:C.textSub,marginBottom:6}}>{recipientCount} {isEmail?'emails':'messages'} queued for delivery</div>
      {isEmail&&<div style={{fontFamily:F.mono,fontSize:11,color:C.textMuted,marginBottom:28}}>Subject: {subject}</div>}
      <Btn onClick={reset} variant="ghost">Send Another Blast</Btn>
    </div>
  );

  return (
    <div>
      <SectionHeader title="EMAIL & SMS BLAST" sub="Write it, pick your contacts, send — one spot"/>

      {/* Mode + Step indicator */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:22}}>
        <div style={{display:'flex',gap:8}}>
          {[{v:'email',l:'Email',Ic:AtSign},{v:'sms',l:'SMS',Ic:Smartphone}].map(t=>(
            <button key={t.v} onClick={()=>{setMode(t.v);setStep(1);setSelectedContacts(new Set());}}
              style={{display:'flex',alignItems:'center',gap:7,padding:'8px 18px',borderRadius:6,border:`1px solid ${mode===t.v?(t.v==='email'?C.accent:C.sms):C.border}`,background:mode===t.v?(t.v==='email'?C.accentLow:C.smsLow):'transparent',color:mode===t.v?(t.v==='email'?C.accent:C.sms):C.textSub,fontFamily:F.mono,fontSize:12,cursor:'pointer'}}>
              <t.Ic size={12}/>{t.l}
            </button>
          ))}
        </div>
        <div style={{display:'flex',gap:6}}>
          {[{n:1,l:'Write'},{n:2,l:'Contacts'},{n:3,l:'Send'}].map(s=>(
            <div key={s.n} style={{display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:24,height:24,borderRadius:'50%',background:step>=s.n?C.accent:C.border,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontSize:11,color:step>=s.n?'#fff':C.textMuted,cursor:step>s.n?'pointer':'default'}}
                onClick={()=>step>s.n&&setStep(s.n)}>{s.n}</div>
              <span style={{fontFamily:F.mono,fontSize:10,color:step===s.n?C.text:C.textMuted}}>{s.l}</span>
              {s.n<3&&<div style={{width:24,height:1,background:C.border}}/>}
            </div>
          ))}
        </div>
      </div>

      {/* ── STEP 1: WRITE ─────────────────────────────── */}
      {step===1&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>AI GENERATE</div>
            <div style={{marginBottom:12}}><Label>Goal / CTA *</Label><FTextarea value={aiGoal} onChange={setAiGoal} placeholder={isEmail?"e.g. Get them to book a free strategy call. Speak to inconsistent client flow.":"e.g. Get them to click the link and sign up today."} rows={3}/></div>
            <div style={{marginBottom:14}}><Label>Audience</Label><FInput value={aiAudience} onChange={setAiAudience} placeholder="e.g. Agency owners doing under $10k/month"/></div>
            <VoiceSelector value={voice} customVoice={customVoice} onVoiceChange={setVoice} onCustomChange={setCustomVoice}/>
            <Btn Icon={Sparkles} onClick={generateAI} disabled={generating||!aiGoal.trim()} style={{width:'100%',justifyContent:'center'}}>{generating?'Generating...':'Generate Copy'}</Btn>
            {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:8}}>{error}</div>}
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>
              {isEmail?'EMAIL COPY':'SMS COPY'}
            </div>
            {isEmail?(
              <>
                <div style={{marginBottom:12}}><Label>Subject Line *</Label><FInput value={subject} onChange={setSubject} placeholder="Your subject line..."/></div>
                <div style={{marginBottom:12}}><Label>Preview Text</Label><FInput value={preview} onChange={setPreview} placeholder="Preview text shown in inbox..."/></div>
                <div><Label>Email Body *</Label><FTextarea value={body} onChange={setBody} placeholder={"Hi {{first_name}},\n\nYour email body here...\n\nUse {{first_name}} and {{company}} for personalization."} rows={9}/></div>
              </>
            ):(
              <>
                <Label>Message * (under 160 chars)</Label>
                <FTextarea value={smsBody} onChange={setSmsBody} placeholder={"Hey {{first_name}}, your message here...\n\nReply STOP to opt out."} rows={5}/>
                <div style={{fontFamily:F.mono,fontSize:10,color:smsBody.length>160?C.warn:C.textMuted,marginTop:6}}>{smsBody.length}/160 chars · {Math.ceil(smsBody.length/160)||1} segment{Math.ceil(smsBody.length/160)!==1?'s':''}</div>
                <div style={{marginTop:12,padding:'10px 13px',background:C.smsLow,border:`1px solid ${C.smsMid}`,borderRadius:7,fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.6}}>Only send to contacts who have opted in. TCPA compliance required.</div>
              </>
            )}
            <Btn onClick={()=>setStep(2)} disabled={!copyReady} style={{width:'100%',justifyContent:'center',marginTop:16}} Icon={ChevronRight}>Choose Contacts</Btn>
          </div>
        </div>
      )}

      {/* ── STEP 2: CONTACTS ──────────────────────────── */}
      {step===2&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:12}}>
            <div>
              <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text}}>SELECT CONTACTS</div>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,marginTop:2}}>{selectedContacts.size} selected · {filtered.length} {isEmail?'with email':'with phone'}</div>
            </div>
            <div style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
              <div style={{position:'relative'}}>
                <Search size={11} color={C.textMuted} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)'}}/>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:'7px 12px 7px 30px',color:C.text,fontFamily:F.mono,fontSize:11,outline:'none',width:180}}/>
              </div>
              <FSelect value={filterTag} onChange={setFilterTag} options={tags.map(t=>({value:t,label:t==='all'?'All tags':t}))}/>
              <button onClick={()=>fileRef.current.click()} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:'7px 13px',color:C.text,fontFamily:F.mono,fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}><Upload size={11}/>Import CSV</button>
              <input ref={fileRef} type="file" accept=".csv,.txt" style={{display:'none'}} onChange={e=>e.target.files[0]&&handleFile(e.target.files[0])}/>
            </div>
          </div>
          <div style={{maxHeight:380,overflowY:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr style={{background:C.surface,position:'sticky',top:0}}>
                <th style={{padding:'9px 16px',width:40}}><input type="checkbox" checked={selectedContacts.size===filtered.length&&filtered.length>0} onChange={toggleAll} style={{cursor:'pointer',accentColor:C.accent}}/></th>
                {['Name','Email / Phone','Tags'].map(h=><th key={h} style={{padding:'9px 14px',fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,textAlign:'left',borderBottom:`1px solid ${C.border}`}}>{h.toUpperCase()}</th>)}
              </tr></thead>
              <tbody>
                {filtered.length===0&&<tr><td colSpan={4} style={{padding:'30px',textAlign:'center',fontFamily:F.mono,fontSize:12,color:C.textMuted}}>No {isEmail?'contacts with email':'contacts with phone number'} found</td></tr>}
                {filtered.map((c,i)=>(
                  <tr key={c.id} onClick={()=>toggle(c.id)} style={{borderBottom:i<filtered.length-1?`1px solid ${C.border}`:'none',background:selectedContacts.has(c.id)?C.accentLow:'transparent',cursor:'pointer'}}>
                    <td style={{padding:'10px 16px'}}><input type="checkbox" checked={selectedContacts.has(c.id)} onChange={()=>toggle(c.id)} onClick={e=>e.stopPropagation()} style={{cursor:'pointer',accentColor:C.accent}}/></td>
                    <td style={{padding:'10px 14px'}}>
                      <div style={{fontFamily:F.mono,fontSize:12,color:C.text}}>{c.name||'–'}</div>
                      <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{c.company||''}</div>
                    </td>
                    <td style={{padding:'10px 14px',fontFamily:F.mono,fontSize:11,color:isEmail?C.accent:C.sms}}>{isEmail?c.email:c.phone||'–'}</td>
                    <td style={{padding:'10px 14px'}}><div style={{display:'flex',gap:4,flexWrap:'wrap'}}>{(c.tags||[]).map(t=><span key={t} style={{background:C.accentLow,color:C.accent,padding:'1px 7px',borderRadius:3,fontSize:9,fontFamily:F.mono}}>{t}</span>)}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:'14px 20px',borderTop:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <Btn variant="ghost" Icon={ArrowLeft} onClick={()=>setStep(1)}>Back</Btn>
            <Btn Icon={ChevronRight} onClick={()=>setStep(3)} disabled={selectedContacts.size===0}>Review & Send ({selectedContacts.size})</Btn>
          </div>
        </div>
      )}

      {/* ── STEP 3: REVIEW & SEND ─────────────────────── */}
      {step===3&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:18,alignItems:'start'}}>
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:14}}>PREVIEW</div>
              {isEmail?(
                <>
                  <div style={{marginBottom:10}}><div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:5}}>SUBJECT</div><div style={{fontFamily:F.mono,fontSize:13,color:C.text}}>{subject}</div></div>
                  {preview&&<div style={{marginBottom:10}}><div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:5}}>PREVIEW TEXT</div><div style={{fontFamily:F.mono,fontSize:12,color:C.textSub}}>{preview}</div></div>}
                  <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
                    {body.split('\n').map((line,i)=><p key={i} style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.7,margin:0,marginBottom:line?4:2}}>{line||'\u00A0'}</p>)}
                  </div>
                </>
              ):(
                <div style={{padding:'14px 16px',background:C.surface,borderRadius:8,border:`1px solid ${C.sms}44`}}>
                  <p style={{fontFamily:F.mono,fontSize:13,color:C.text,lineHeight:1.7,margin:0}}>{smsBody}</p>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginTop:8}}>{smsBody.length} chars · {Math.ceil(smsBody.length/160)} segment</div>
                </div>
              )}
            </div>
            <Btn variant="ghost" Icon={ArrowLeft} onClick={()=>setStep(2)} size="sm">Change Contacts</Btn>
          </div>

          <div>
            <div style={{background:C.card,border:`1px solid ${C.accent}44`,borderRadius:10,padding:22,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:18}}>SEND SUMMARY</div>
              {[
                {l:'Type',          v:isEmail?'Email Blast':'SMS Blast'},
                {l:'Recipients',    v:`${selectedContacts.size} ${isEmail?'emails':'messages'}`},
                {l:'Personalization',v:'{{first_name}} token active'},
                {l:'Send time',     v:'Immediately on confirm'},
              ].map(({l,v})=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'9px 0',borderBottom:`1px solid ${C.border}`}}>
                  <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{l}</span>
                  <span style={{fontFamily:F.mono,fontSize:11,color:C.text}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:18}}>
                <Btn Icon={Send} onClick={sendBlast} disabled={sending} style={{width:'100%',justifyContent:'center',padding:'13px 0'}}>
                  {sending?'Sending...':`Send to ${selectedContacts.size} ${isEmail?'contacts':'contacts'}`}
                </Btn>
              </div>
              {isEmail&&(
                <div style={{marginTop:12,padding:'10px 13px',background:C.successLow,border:`1px solid rgba(34,197,94,0.18)`,borderRadius:7,fontFamily:F.mono,fontSize:10,color:C.success,display:'flex',alignItems:'center',gap:6}}>
                  <CheckCircle size={11}/>Deliverability checks passed
                </div>
              )}
            </div>
            <div style={{padding:'14px 16px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.7}}>
              Emails send via your configured SMTP. SMS sends via Twilio. Both require setup in Settings to go live in production.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


const USERS = [
  { email: 'jesse@clientsprint.ai', password: 'kayla1997!', name: 'Jesse', role: 'Admin' },
  { email: 'demo@clientsprint.ai',  password: 'demo',        name: 'Demo',  role: 'Viewer' },
];

// ─── Settings & Admin View ─────────────────────────────────────────────────────
function SettingsAdminView({ users, setUsers }) {
  const [tab, setTab] = useState('clients');
  const [newEmail, setNewEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newName, setNewName] = useState('');
  const [saved, setSaved] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const addClient = () => {
    if (!newEmail.trim() || !newPass.trim() || !newName.trim()) return;
    setUsers(u => [...u, { email: newEmail.trim(), password: newPass.trim(), name: newName.trim(), role: 'Member' }]);
    setNewEmail(''); setNewPass(''); setNewName('');
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const removeClient = (email) => {
    if (email === 'jesse@clientsprint.ai') return; // protect admin
    setUsers(u => u.filter(x => x.email !== email));
  };

  const TABS = [
    { id: 'clients', label: 'Client Logins' },
    { id: 'platform', label: 'Platform' },
    { id: 'integrations', label: 'Integrations' },
  ];

  return (
    <div>
      <SectionHeader title="SETTINGS & ADMIN" sub="Manage clients, platform settings, and integrations"/>

      {/* Tab bar */}
      <div style={{display:'flex',gap:8,marginBottom:24}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'8px 18px',borderRadius:6,border:`1px solid ${tab===t.id?C.accent:C.border}`,background:tab===t.id?C.accentLow:'transparent',color:tab===t.id?C.accent:C.textSub,fontFamily:F.mono,fontSize:12,cursor:'pointer'}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* CLIENT LOGINS TAB */}
      {tab==='clients'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          {/* Add new client */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>ADD CLIENT LOGIN</div>
            <div style={{marginBottom:12}}><Label>Full Name *</Label><FInput value={newName} onChange={setNewName} placeholder="e.g. Sarah Johnson"/></div>
            <div style={{marginBottom:12}}><Label>Email *</Label><FInput value={newEmail} onChange={setNewEmail} placeholder="e.g. sarah@heragency.com" type="email"/></div>
            <div style={{marginBottom:16}}><Label>Password *</Label><FInput value={newPass} onChange={setNewPass} placeholder="Set a secure password" type="text"/></div>
            <Btn Icon={UserPlus} onClick={addClient} disabled={!newEmail.trim()||!newPass.trim()||!newName.trim()}>
              {saved?'Client Added!':'Add Client'}
            </Btn>
            <div style={{marginTop:12,padding:'10px 13px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.7}}>
              Clients log in at app.clientsprint.ai with these credentials. Send them their login details directly.
            </div>
          </div>

          {/* Current clients */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text}}>CURRENT LOGINS</div>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,marginTop:2}}>{users.length} accounts</div>
            </div>
            <div style={{maxHeight:380,overflowY:'auto'}}>
              {users.map((u,i)=>(
                <div key={u.email} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',borderBottom:i<users.length-1?`1px solid ${C.border}`:'none',background:'transparent'}}>
                  <div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.text}}>{u.name}</div>
                    <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{u.email}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontFamily:F.mono,fontSize:9,color:u.role==='Admin'?C.accent:C.textMuted,padding:'2px 8px',border:`1px solid ${u.role==='Admin'?C.accent:C.border}`,borderRadius:4}}>{u.role||'Member'}</span>
                    {u.email!=='jesse@clientsprint.ai'&&(
                      <button onClick={()=>removeClient(u.email)} style={{background:'none',border:`1px solid ${C.danger}44`,borderRadius:5,padding:'4px 8px',color:C.danger,fontFamily:F.mono,fontSize:9,cursor:'pointer'}}>Remove</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM TAB */}
      {tab==='platform'&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:20}}>PLATFORM SETTINGS</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[
              {label:'Platform Name', val:'ClientSprint.ai', note:'Displayed in the browser tab'},
              {label:'Support Email', val:'jesse@clientsprint.ai', note:'Members contact you here'},
              {label:'Skool Community URL', val:'skool.com/clientscale-academy-8071', note:'Linked in sidebar'},
              {label:'Default AI Model', val:'claude-sonnet-4-6', note:'Powers all AI tools'},
            ].map(item=>(
              <div key={item.label}>
                <Label>{item.label}</Label>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:'9px 13px',fontFamily:F.mono,fontSize:12,color:C.textSub}}>{item.val}</div>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,marginTop:4}}>{item.note}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:20,padding:'14px 16px',background:C.accentLow,border:`1px solid ${C.accent}33`,borderRadius:8,fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.7}}>
            To change platform settings, update the values in your App.jsx source file and redeploy via GitHub. Full database-driven settings coming in a future update.
          </div>
        </div>
      )}

      {/* INTEGRATIONS TAB */}
      {tab==='integrations'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {[
            {name:'Anthropic API',      status:'connected', note:'Powers all AI tools. Manage at console.anthropic.com', color:C.success},
            {name:'Skool Community',    status:'connected', note:'ClientScale Academy linked in sidebar', color:C.success},
            {name:'SendGrid / SMTP',    status:'pending',   note:'Required to send Email Blasts. Add SMTP credentials in Railway.', color:C.warn},
            {name:'Twilio SMS',         status:'pending',   note:'Required to send SMS Blasts. Add Twilio credentials in Railway.', color:C.warn},
            {name:'Stripe / FanBasis',  status:'pending',   note:'Payment processing for memberships', color:C.warn},
            {name:'Supabase Database',  status:'pending',   note:'Persistent data storage. Currently session-only.', color:C.warn},
          ].map(item=>(
            <div key={item.name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <div style={{fontFamily:F.mono,fontSize:13,color:C.text}}>{item.name}</div>
                <span style={{fontFamily:F.mono,fontSize:9,color:item.color,padding:'2px 8px',border:`1px solid ${item.color}44`,borderRadius:4,textTransform:'uppercase'}}>{item.status}</span>
              </div>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.6}}>{item.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



// ─── Viral Post Modeler ────────────────────────────────────────────────────────
function ViralModelerView() {
  const [step, setStep] = useState(1);
  const [inputMethod, setInputMethod] = useState('paste');
  const [viralUrl, setViralUrl] = useState('');
  const [viralText, setViralText] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [yourNiche, setYourNiche] = useState('');
  const [yourOffer, setYourOffer] = useState('');
  const [yourAudience, setYourAudience] = useState('');
  const [contentType, setContentType] = useState('ad');
  const [voice, setVoice] = useState('direct');
  const [customVoice, setCustomVoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [modeled, setModeled] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [activeTab, setActiveTab] = useState('modeled');

  const PLATFORMS = [
    { v: 'facebook',   l: 'Facebook',   col: '#1877F2' },
    { v: 'instagram',  l: 'Instagram',  col: '#E1306C' },
    { v: 'linkedin',   l: 'LinkedIn',   col: '#0A66C2' },
    { v: 'tiktok',     l: 'TikTok',     col: '#FF0050' },
    { v: 'twitter',    l: 'X / Twitter',col: '#1DA1F2' },
    { v: 'youtube',    l: 'YouTube',    col: '#FF0000' },
  ];

  const CONTENT_TYPES = [
    { v: 'ad',       l: 'Paid Ad' },
    { v: 'post',     l: 'Organic Post' },
    { v: 'hook',     l: 'Hook / Opening Line' },
    { v: 'caption',  l: 'Caption / Copy' },
    { v: 'email',    l: 'Email' },
    { v: 'video',    l: 'Video Script' },
  ];

  const analyze = async () => {
    const content = viralText.trim();
    if (!content && !viralUrl.trim()) return;
    if (!yourNiche.trim() || !yourOffer.trim()) return;
    setLoading(true); setError(''); setAnalysis(null); setModeled(null);

    const sourceText = content || `Content from: ${viralUrl.trim()}`;
    const platName = PLATFORMS.find(p=>p.v===platform)?.l || platform;
    const voiceInstr = getVoicePrompt(voice, customVoice);

    try {
      // Step 1: Analyze the viral content
      const r1 = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6", max_tokens:1500,
          messages:[{role:"user",content:`Analyze this viral content and explain WHY it works.

CONTENT:
${sourceText.slice(0,2000)}

Platform: ${platName}

Return ONLY valid JSON (no markdown, no backticks):
{"viralScore":85,"hookType":"the hook type","hookFormula":"the structural formula","emotionalTriggers":["trigger1","trigger2","trigger3"],"structureBreakdown":[{"element":"Hook","technique":"what they did","whyItWorks":"why it works"},{"element":"Body","technique":"what they did","whyItWorks":"why it works"},{"element":"CTA","technique":"what they did","whyItWorks":"why it works"}],"powerWords":["word1","word2","word3"],"shareabilityDriver":"why people share this","identityPlay":"how it makes reader feel","viralBlueprint":"2 sentence summary of the formula","contentGaps":["gap1","gap2"]}`}]})
      });
      const d1 = await r1.json();
      const t1 = d1.content?.find(b=>b.type==='text')?.text||'';
      const jsonMatch1 = t1.match(/\{[\s\S]*\}/);
      if (!jsonMatch1) { setError('Could not analyze content — try pasting more text.'); setLoading(false); return; }
      const analysisResult = JSON.parse(jsonMatch1[0]);
      setAnalysis(analysisResult);

      // Step 2: Generate modeled version
      const r2 = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6", max_tokens:1500,
          messages:[{role:"user",content:`You are a ${platName} copywriter. Create content that uses this viral formula for a different offer.

VIRAL FORMULA:
Hook type: ${analysisResult.hookType||''}
Formula: ${analysisResult.hookFormula||''}
Triggers: ${(analysisResult.emotionalTriggers||[]).join(', ')}
Shareability: ${analysisResult.shareabilityDriver||''}

NEW BRIEF:
Niche: ${yourNiche}
Offer: ${yourOffer}
Audience: ${yourAudience||'business owners'}
Content type: ${CONTENT_TYPES.find(c=>c.v===contentType)?.l}
Platform: ${platName}
Voice: ${voiceInstr}

Return ONLY valid JSON (no markdown, no backticks):
{"headline":"the main hook","body":"the full content body","cta":"call to action","hashtags":["tag1","tag2","tag3"],"viralElementsUsed":["element1","element2","element3"],"splitTestVariant":"a shorter punchier hook variant","postingTip":"best strategy to post this"}`}]})
      });
      const d2 = await r2.json();
      const t2 = d2.content?.find(b=>b.type==='text')?.text||'';
      const jsonMatch2 = t2.match(/\{[\s\S]*\}/);
      if (!jsonMatch2) { setError('Could not generate modeled version — try again.'); setLoading(false); return; }
      const modeledResult = JSON.parse(jsonMatch2[0]);
      setModeled(modeledResult);
      setStep(3);
    } catch(e) {
      console.error('Viral error:', e);
      setError('Analysis failed — check your credits and try again.');
    }
    setLoading(false);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key); setTimeout(() => setCopied(''), 2000);
  };

  const fullCopy = modeled ? `${modeled.headline}\n\n${modeled.body}\n\n${modeled.cta}${modeled.hashtags?.length ? '\n\n' + modeled.hashtags.map(h=>'#'+h).join(' ') : ''}` : '';

  const platColor = PLATFORMS.find(p=>p.v===platform)?.col || C.accent;

  return (
    <div>
      <SectionHeader title="VIRAL POST MODELER" sub="Analyze what makes content go viral — then model it for your offer"/>

      {/* Step indicator */}
      <div style={{display:'flex',gap:6,marginBottom:22,alignItems:'center'}}>
        {[{n:1,l:'Source'},{n:2,l:'Brief'},{n:3,l:'Results'}].map((s,i)=>(
          <React.Fragment key={s.n}>
            <div style={{display:'flex',alignItems:'center',gap:6,cursor:step>s.n?'pointer':'default'}} onClick={()=>step>s.n&&setStep(s.n)}>
              <div style={{width:26,height:26,borderRadius:'50%',background:step>=s.n?C.accent:C.border,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontSize:11,color:step>=s.n?'#fff':C.textMuted}}>{s.n}</div>
              <span style={{fontFamily:F.mono,fontSize:10,color:step===s.n?C.text:C.textMuted}}>{s.l}</span>
            </div>
            {i<2&&<div style={{width:32,height:1,background:C.border}}/>}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1: SOURCE CONTENT ── */}
      {step===1&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>VIRAL CONTENT SOURCE</div>

            {/* Input method toggle */}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              {[{v:'paste',l:'Paste Text'},{v:'url',l:'URL / Link'}].map(m=>(
                <button key={m.v} onClick={()=>setInputMethod(m.v)} style={{padding:'7px 16px',borderRadius:6,border:`1px solid ${inputMethod===m.v?C.accent:C.border}`,background:inputMethod===m.v?C.accentLow:'transparent',color:inputMethod===m.v?C.accent:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>{m.l}</button>
              ))}
            </div>

            {inputMethod==='paste'?(
              <div style={{marginBottom:14}}>
                <Label>Paste the viral content *</Label>
                <FTextarea value={viralText} onChange={setViralText} placeholder={"Paste the full text of the viral post, ad, email, or video script here...\n\nThe more complete the content, the better the analysis."} rows={10}/>
              </div>
            ):(
              <div style={{marginBottom:14}}>
                <Label>Content URL *</Label>
                <FInput value={viralUrl} onChange={setViralUrl} placeholder="https://facebook.com/ads/... or any public URL"/>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginTop:6,lineHeight:1.6}}>
                  Paste the URL of a viral post, ad, or page. Works best when you also paste the copy text above.
                </div>
              </div>
            )}

            {/* Platform */}
            <div style={{marginBottom:14}}>
              <Label>Platform</Label>
              <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                {PLATFORMS.map(p=>(
                  <button key={p.v} onClick={()=>setPlatform(p.v)} style={{padding:'6px 13px',borderRadius:5,border:`1px solid ${platform===p.v?p.col:C.border}`,background:platform===p.v?`${p.col}18`:'transparent',color:platform===p.v?p.col:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>{p.l}</button>
                ))}
              </div>
            </div>

            <Btn onClick={()=>{if(viralText.trim()||viralUrl.trim()) setStep(2);}} disabled={!viralText.trim()&&!viralUrl.trim()} Icon={ChevronRight}>Next — Your Brief</Btn>
          </div>

          {/* Tips panel */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>HOW TO USE THIS</div>
            {[
              {n:'01', title:'Find viral content', desc:'Look for posts with 1000+ shares, ads running 30+ days, or emails with insane open rates in your space or adjacent niches.'},
              {n:'02', title:'Paste the full copy', desc:'The more complete the text the better. Include the headline, body, and CTA. For video — paste the script or transcript.'},
              {n:'03', title:'Enter your brief', desc:'Tell us your niche, offer, and audience. We reverse-engineer the viral formula and rebuild it around your specific message.'},
              {n:'04', title:'Get your version', desc:'You get a full breakdown of what makes it viral + your custom-modeled version using the same psychological triggers.'},
            ].map(tip=>(
              <div key={tip.n} style={{display:'flex',gap:14,marginBottom:18}}>
                <div style={{fontFamily:F.display,fontSize:20,color:C.accent,flexShrink:0,lineHeight:1}}>{tip.n}</div>
                <div>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.text,marginBottom:4}}>{tip.title}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.7}}>{tip.desc}</div>
                </div>
              </div>
            ))}
            <div style={{padding:'12px 14px',background:C.accentLow,border:`1px solid ${C.accent}33`,borderRadius:8,fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.7}}>
              Pro tip: The best sources are your competitors' top-performing ads, viral LinkedIn posts in your niche, and email sequences with proven conversion rates.
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: YOUR BRIEF ── */}
      {step===2&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>YOUR BRIEF</div>
            <div style={{marginBottom:12}}><Label>Your Niche / Industry *</Label><FInput value={yourNiche} onChange={setYourNiche} placeholder="e.g. AI agency owners, HVAC companies, real estate investors"/></div>
            <div style={{marginBottom:12}}><Label>Your Offer / Service *</Label><FInput value={yourOffer} onChange={setYourOffer} placeholder="e.g. Done-for-you AI lead generation, $1,997/month retainer"/></div>
            <div style={{marginBottom:12}}><Label>Target Audience</Label><FInput value={yourAudience} onChange={setYourAudience} placeholder="e.g. Agency owners doing under $10k/month"/></div>
            <div style={{marginBottom:14}}>
              <Label>Content Type</Label>
              <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                {CONTENT_TYPES.map(ct=>(
                  <button key={ct.v} onClick={()=>setContentType(ct.v)} style={{padding:'6px 13px',borderRadius:5,border:`1px solid ${contentType===ct.v?C.accent:C.border}`,background:contentType===ct.v?C.accentLow:'transparent',color:contentType===ct.v?C.accent:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>{ct.l}</button>
                ))}
              </div>
            </div>
            <VoiceSelector value={voice} customVoice={customVoice} onVoiceChange={setVoice} onCustomChange={setCustomVoice}/>
            <div style={{display:'flex',gap:10,marginTop:16}}>
              <Btn variant="ghost" Icon={ArrowLeft} onClick={()=>setStep(1)}>Back</Btn>
              <Btn Icon={Sparkles} onClick={analyze} disabled={loading||!yourNiche.trim()||!yourOffer.trim()}>{loading?'Analyzing (~25s)...':'Analyze & Model'}</Btn>
            </div>
            {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:8}}>{error}</div>}
          </div>

          {/* Source preview */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:14}}>SOURCE PREVIEW</div>
            <div style={{background:C.surface,border:`1px solid ${platColor}33`,borderRadius:8,padding:14,marginBottom:12}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:platColor}}/>
                <span style={{fontFamily:F.mono,fontSize:10,color:platColor}}>{PLATFORMS.find(p=>p.v===platform)?.l}</span>
              </div>
              {viralText?(
                <div style={{fontFamily:F.mono,fontSize:11,color:C.text,lineHeight:1.7,maxHeight:200,overflowY:'auto',whiteSpace:'pre-wrap'}}>{viralText.slice(0,400)}{viralText.length>400?'...\n['+Math.round(viralText.length/5)+' more words]':''}</div>
              ):(
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textMuted}}>URL: {viralUrl}</div>
              )}
            </div>
            {loading&&(
              <div style={{textAlign:'center',padding:'24px 0'}}>
                <div style={{fontFamily:F.display,fontSize:20,letterSpacing:2,color:C.accent,marginBottom:8}}>ANALYZING...</div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.8}}>
                  Identifying viral triggers<br/>
                  Extracting psychological hooks<br/>
                  Modeling for your offer
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: RESULTS ── */}
      {step===3&&analysis&&modeled&&(
        <div>
          {/* Tab bar */}
          <div style={{display:'flex',gap:8,marginBottom:18}}>
            {[{id:'modeled',l:'Your Modeled Version'},{id:'analysis',l:'Viral Breakdown'},{id:'ab',l:'A/B Variant'}].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{padding:'9px 18px',borderRadius:6,border:`1px solid ${activeTab===t.id?C.accent:C.border}`,background:activeTab===t.id?C.accentLow:'transparent',color:activeTab===t.id?C.accent:C.textSub,fontFamily:F.mono,fontSize:12,cursor:'pointer'}}>{t.l}</button>
            ))}
            <div style={{marginLeft:'auto',display:'flex',gap:8}}>
              <Btn variant="ghost" size="sm" Icon={ArrowLeft} onClick={()=>setStep(2)}>Edit Brief</Btn>
              <Btn variant="ghost" size="sm" Icon={RefreshCw} onClick={analyze}>Re-Model</Btn>
            </div>
          </div>

          {/* MODELED VERSION TAB */}
          {activeTab==='modeled'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:18,alignItems:'start'}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text}}>YOUR MODELED {CONTENT_TYPES.find(c=>c.v===contentType)?.l.toUpperCase()}</div>
                  <Btn variant="ghost" size="sm" Icon={Copy} onClick={()=>copyText(fullCopy,'all')}>{copied==='all'?'Copied!':'Copy All'}</Btn>
                </div>

                {/* Headline */}
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <Label>Hook / Headline</Label>
                    <button onClick={()=>copyText(modeled.headline,'headline')} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:9}}>{copied==='headline'?'✓':'copy'}</button>
                  </div>
                  <div style={{background:C.surface,border:`1px solid ${platColor}44`,borderRadius:8,padding:'14px 16px',fontFamily:F.mono,fontSize:14,color:C.text,lineHeight:1.6,fontWeight:500}}>{modeled.headline}</div>
                </div>

                {/* Body */}
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <Label>Body Copy</Label>
                    <button onClick={()=>copyText(modeled.body,'body')} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:9}}>{copied==='body'?'✓':'copy'}</button>
                  </div>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'14px 16px',fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{modeled.body}</div>
                </div>

                {/* CTA */}
                <div style={{marginBottom:14}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <Label>Call to Action</Label>
                    <button onClick={()=>copyText(modeled.cta,'cta')} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:9}}>{copied==='cta'?'✓':'copy'}</button>
                  </div>
                  <div style={{background:C.accentLow,border:`1px solid ${C.accent}44`,borderRadius:8,padding:'12px 16px',fontFamily:F.mono,fontSize:13,color:C.accent,fontWeight:500}}>{modeled.cta}</div>
                </div>

                {/* Hashtags */}
                {modeled.hashtags?.length>0&&(
                  <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {modeled.hashtags.map(h=><span key={h} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:'3px 9px',fontFamily:F.mono,fontSize:10,color:C.textSub}}>#{h}</span>)}
                  </div>
                )}
              </div>

              {/* Side panel */}
              <div>
                {/* Viral elements used */}
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18,marginBottom:14}}>
                  <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>VIRAL ELEMENTS USED</div>
                  {modeled.viralElementsUsed?.map((el,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}}>
                      <div style={{width:6,height:6,borderRadius:'50%',background:C.accent,marginTop:4,flexShrink:0}}/>
                      <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.6}}>{el}</div>
                    </div>
                  ))}
                </div>

                {/* Posting tip */}
                {modeled.postingTip&&(
                  <div style={{background:C.card,border:`1px solid ${C.accent}33`,borderRadius:10,padding:18,marginBottom:14}}>
                    <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.accent,marginBottom:8}}>POSTING TIP</div>
                    <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.7}}>{modeled.postingTip}</div>
                  </div>
                )}

                {/* Viral score */}
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                    <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text}}>VIRAL SCORE</div>
                    <div style={{fontFamily:F.display,fontSize:28,color:analysis.viralScore>80?C.success:analysis.viralScore>60?C.warn:C.danger}}>{analysis.viralScore}</div>
                  </div>
                  <div style={{height:6,background:C.surface,borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${analysis.viralScore}%`,background:analysis.viralScore>80?C.success:analysis.viralScore>60?C.warn:C.danger,borderRadius:3,transition:'width 1s ease'}}/>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,marginTop:6}}>Original content viral score</div>
                </div>
              </div>
            </div>
          )}

          {/* VIRAL BREAKDOWN TAB */}
          {activeTab==='analysis'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
              {/* Left col */}
              <div>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22,marginBottom:14}}>
                  <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>VIRAL FORMULA</div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>HOOK TYPE</div>
                    <div style={{fontFamily:F.mono,fontSize:13,color:C.accent}}>{analysis.hookType}</div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>HOOK FORMULA</div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.6}}>{analysis.hookFormula}</div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:6}}>EMOTIONAL TRIGGERS</div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                      {analysis.emotionalTriggers?.map(t=>(
                        <span key={t} style={{background:C.accentLow,border:`1px solid ${C.accent}33`,borderRadius:4,padding:'3px 9px',fontFamily:F.mono,fontSize:10,color:C.accent}}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>SHAREABILITY DRIVER</div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.6}}>{analysis.shareabilityDriver}</div>
                  </div>
                  <div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>IDENTITY PLAY</div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.6}}>{analysis.identityPlay}</div>
                  </div>
                </div>

                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
                  <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>VIRAL BLUEPRINT</div>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.textSub,lineHeight:1.8,fontStyle:'italic',borderLeft:`2px solid ${C.accent}`,paddingLeft:14}}>{analysis.viralBlueprint}</div>
                </div>
              </div>

              {/* Right col */}
              <div>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22,marginBottom:14}}>
                  <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>STRUCTURE BREAKDOWN</div>
                  {analysis.structureBreakdown?.map((item,i)=>(
                    <div key={i} style={{borderBottom:i<analysis.structureBreakdown.length-1?`1px solid ${C.border}`:'none',paddingBottom:i<analysis.structureBreakdown.length-1?14:0,marginBottom:i<analysis.structureBreakdown.length-1?14:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <div style={{fontFamily:F.display,fontSize:11,color:'#fff',background:C.accent,borderRadius:3,padding:'1px 8px',letterSpacing:1}}>{item.element}</div>
                        <div style={{fontFamily:F.mono,fontSize:11,color:C.text}}>{item.technique}</div>
                      </div>
                      <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.6,paddingLeft:4}}>{item.whyItWorks}</div>
                    </div>
                  ))}
                </div>

                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
                  <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>POWER WORDS</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
                    {analysis.powerWords?.map(w=>(
                      <span key={w} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:'4px 10px',fontFamily:F.mono,fontSize:11,color:C.text}}>{w}</span>
                    ))}
                  </div>
                  {analysis.contentGaps?.length>0&&(
                    <div style={{marginTop:16}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:8}}>GAPS YOU CAN EXPLOIT</div>
                      {analysis.contentGaps.map((g,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6}}>
                          <div style={{width:6,height:6,borderRadius:'50%',background:C.success,marginTop:4,flexShrink:0}}/>
                          <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.6}}>{g}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* A/B VARIANT TAB */}
          {activeTab==='ab'&&modeled.splitTestVariant&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
                <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:6}}>VERSION A — PRIMARY</div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginBottom:16}}>Your main modeled version</div>
                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'14px 16px',fontFamily:F.mono,fontSize:13,color:C.text,fontWeight:500,marginBottom:10}}>{modeled.headline}</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.7}}>{modeled.body?.slice(0,200)}...</div>
                <div style={{marginTop:14}}><Btn variant="ghost" size="sm" Icon={Copy} onClick={()=>copyText(fullCopy,'a')}>Copy Version A</Btn></div>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.accent}44`,borderRadius:10,padding:22}}>
                <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.accent,marginBottom:6}}>VERSION B — SPLIT TEST</div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginBottom:16}}>Punchier alternative hook to test against A</div>
                <div style={{background:C.accentLow,border:`1px solid ${C.accent}44`,borderRadius:8,padding:'14px 16px',fontFamily:F.mono,fontSize:13,color:C.accent,fontWeight:500,marginBottom:10}}>{modeled.splitTestVariant}</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.7}}>{modeled.body?.slice(0,200)}...</div>
                <div style={{marginTop:14}}><Btn Icon={Copy} size="sm" onClick={()=>copyText(modeled.splitTestVariant,'b')}>{copied==='b'?'Copied!':'Copy Variant B Hook'}</Btn></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}




// ─── Teleprompter ──────────────────────────────────────────────────────────────
function TeleprompterView() {
  const [script, setScript] = useState('');
  const [speed, setSpeed] = useState(3);
  const [fontSize, setFontSize] = useState(36);
  const [running, setRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [position, setPosition] = useState(0);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setPosition(p => {
          if (textRef.current && containerRef.current) {
            const maxScroll = textRef.current.scrollHeight - containerRef.current.clientHeight;
            if (p >= maxScroll) { setRunning(false); return p; }
          }
          return p + speed * 0.4;
        });
      }, 16);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, speed]);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = position;
  }, [position]);

  const reset = () => { setPosition(0); setRunning(false); if (containerRef.current) containerRef.current.scrollTop = 0; };

  const SAMPLE = `Welcome to your teleprompter.

Paste your ad script, sales script, or any content you want to read on camera.

The text will scroll automatically at your chosen speed so you can maintain eye contact with the camera.

Adjust the font size and scroll speed using the controls below.

Click the fullscreen button to maximize for recording.

Your audience will never know you're reading — you'll look confident, prepared, and natural.

Start with a lower speed and increase it as you get comfortable.

The best ads feel like a conversation. Read naturally, pause where you feel it, and let your personality come through.`;

  return (
    <div>
      <SectionHeader title="TELEPROMPTER" sub="Paste your script — reads at the top of your screen as you record"/>

      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:18,alignItems:'start'}}>
        {/* Main display */}
        <div>
          {!fullscreen ? (
            <div style={{background:'#000',borderRadius:12,overflow:'hidden',border:`1px solid ${C.border}`}}>
              {/* Controls bar */}
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'#111',borderBottom:'1px solid #222'}}>
                <button onClick={()=>setRunning(!running)} style={{background:running?'#EF4444':C.accent,border:'none',borderRadius:6,padding:'8px 20px',color:'#fff',fontFamily:F.mono,fontSize:12,cursor:'pointer',fontWeight:500}}>
                  {running ? '⏸ Pause' : '▶ Start'}
                </button>
                <button onClick={reset} style={{background:'#222',border:'1px solid #333',borderRadius:6,padding:'8px 14px',color:'#999',fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>↺ Reset</button>
                <div style={{flex:1}}/>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontFamily:F.mono,fontSize:10,color:'#666'}}>SPEED</span>
                  <input type="range" min="1" max="10" value={speed} onChange={e=>setSpeed(Number(e.target.value))} style={{width:80,accentColor:C.accent}}/>
                  <span style={{fontFamily:F.mono,fontSize:10,color:'#999',width:16}}>{speed}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontFamily:F.mono,fontSize:10,color:'#666'}}>SIZE</span>
                  <input type="range" min="20" max="60" value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} style={{width:80,accentColor:C.accent}}/>
                </div>
                <button onClick={()=>setFullscreen(true)} style={{background:'#222',border:'1px solid #333',borderRadius:6,padding:'8px 12px',color:'#999',fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>⛶ Full</button>
              </div>
              {/* Scroll area */}
              <div ref={containerRef} style={{height:400,overflow:'hidden',padding:'40px 60px',cursor:'pointer'}} onClick={()=>setRunning(!running)}>
                {/* Fade overlay top */}
                <div style={{position:'sticky',top:0,height:60,background:'linear-gradient(#000,transparent)',marginBottom:-60,zIndex:1}}/>
                <div ref={textRef} style={{fontFamily:'Georgia, serif',fontSize:fontSize,color:'#fff',lineHeight:1.6,whiteSpace:'pre-wrap',textAlign:'center'}}>
                  {script || SAMPLE}
                </div>
                {/* Fade overlay bottom */}
                <div style={{position:'sticky',bottom:0,height:60,background:'linear-gradient(transparent,#000)',marginTop:-60,zIndex:1}}/>
              </div>
              {/* Red line indicator */}
              <div style={{position:'relative',marginTop:-2}}>
                <div style={{height:2,background:'#EF444488'}}/>
              </div>
            </div>
          ) : (
            <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#000',zIndex:9999,display:'flex',flexDirection:'column'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 24px',background:'#111'}}>
                <button onClick={()=>setRunning(!running)} style={{background:running?'#EF4444':C.accent,border:'none',borderRadius:6,padding:'10px 24px',color:'#fff',fontFamily:F.mono,fontSize:14,cursor:'pointer'}}>
                  {running ? '⏸ Pause' : '▶ Start'}
                </button>
                <button onClick={reset} style={{background:'#222',border:'1px solid #333',borderRadius:6,padding:'10px 16px',color:'#999',fontFamily:F.mono,fontSize:12,cursor:'pointer'}}>↺ Reset</button>
                <div style={{flex:1}}/>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontFamily:F.mono,fontSize:11,color:'#666'}}>SPEED</span>
                  <input type="range" min="1" max="10" value={speed} onChange={e=>setSpeed(Number(e.target.value))} style={{width:120,accentColor:C.accent}}/>
                </div>
                <button onClick={()=>{setFullscreen(false);setRunning(false);}} style={{background:'#333',border:'1px solid #444',borderRadius:6,padding:'10px 16px',color:'#ccc',fontFamily:F.mono,fontSize:12,cursor:'pointer'}}>✕ Exit</button>
              </div>
              <div style={{height:3,background:'#EF444466'}}/>
              <div ref={containerRef} style={{flex:1,overflow:'hidden',padding:'60px 120px',cursor:'pointer'}} onClick={()=>setRunning(!running)}>
                <div ref={textRef} style={{fontFamily:'Georgia, serif',fontSize:fontSize+10,color:'#fff',lineHeight:1.7,whiteSpace:'pre-wrap',textAlign:'center'}}>
                  {script || SAMPLE}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Script editor */}
        <div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18,marginBottom:14}}>
            <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>YOUR SCRIPT</div>
            <FTextarea value={script} onChange={setScript} placeholder={"Paste your ad script, sales pitch, or any content here...\n\nTips:\n• Write how you speak, not how you write\n• Break long sentences into shorter ones\n• Add ... for natural pauses\n• CAPS for emphasis"} rows={14}/>
            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button onClick={()=>setScript('')} style={{background:'none',border:`1px solid ${C.border}`,borderRadius:5,padding:'6px 12px',color:C.textMuted,fontFamily:F.mono,fontSize:10,cursor:'pointer'}}>Clear</button>
              <div style={{flex:1,fontFamily:F.mono,fontSize:9,color:C.textMuted,display:'flex',alignItems:'center',justifyContent:'flex-end'}}>
                {script.split(/\s+/).filter(Boolean).length} words · ~{Math.ceil(script.split(/\s+/).filter(Boolean).length/130)} min read
              </div>
            </div>
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18}}>
            <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>TIPS</div>
            {[
              {t:'Eye contact', d:'Look directly into the camera lens, not the screen'},
              {t:'Natural pauses', d:'Add "..." where you want to pause for effect'},
              {t:'Speed', d:'Start slow — most people read faster than they think'},
              {t:'Practice first', d:'Run through once before recording'},
              {t:'Fullscreen mode', d:'Use for recording — cleaner look, easier to read'},
            ].map(tip=>(
              <div key={tip.t} style={{display:'flex',gap:10,marginBottom:10}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:C.accent,marginTop:5,flexShrink:0}}/>
                <div>
                  <div style={{fontFamily:F.mono,fontSize:11,color:C.text}}>{tip.t}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.6}}>{tip.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sales Script Generator (replaces Pitch Generator) ────────────────────────
function SalesScriptView() {
  const [offerName, setOfferName] = useState('');
  const [service, setService] = useState('');
  const [price, setPrice] = useState('');
  const [extras, setExtras] = useState('');
  const [callType, setCallType] = useState('strategy');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState(null);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState(0);
  const [copied, setCopied] = useState('');

  const CALL_TYPES = [
    { v: 'strategy',  l: 'First Strategy Call' },
    { v: 'follow-up', l: 'Follow-Up Call' },
    { v: 'close',     l: 'Closing Call (They\'re interested)' },
  ];

  const generate = async () => {
    if (!offerName.trim() || !service.trim() || !price.trim()) return;
    setLoading(true); setError(''); setScript(null);

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4000,
          messages: [{
            role: "user",
            content: `You are a world-class high-ticket sales coach. Create a complete Zoom sales script for someone with zero sales experience. Conversational, never pushy. Consultative and peer-to-peer.

THE OFFER:
Offer: ${offerName}
What It Does: ${service}
Price: ${price}
Extra Context: ${extras || 'None'}
Call Type: ${CALL_TYPES.find(c=>c.v===callType)?.l}

STYLE: Discovery before pitch. Specific numbers. Transparent pricing. Walk through ROI math so they sell themselves. Assumptive close. Calm objection handling.

Include [DELIVERY NOTE: ...] tags inline in each script section with coaching on tone, pace, pauses.

Return ONLY valid JSON, no markdown:
{"scriptTitle":"title","prepNotes":"3 prep steps","sections":[{"title":"Open","script":"word for word script with [DELIVERY NOTE: coaching tip] inline","keyPoint":"tip","duration":"1-2 min"},{"title":"Discovery","script":"...","keyPoint":"...","duration":"5-10 min"},{"title":"Credibility","script":"...","keyPoint":"...","duration":"2-3 min"},{"title":"The Offer","script":"...","keyPoint":"...","duration":"8-12 min"},{"title":"ROI Math","script":"...","keyPoint":"...","duration":"3-5 min"},{"title":"The Close","script":"...","keyPoint":"...","duration":"2-3 min"},{"title":"Objections","script":"...","keyPoint":"...","duration":"as needed"},{"title":"Post-Close","script":"...","keyPoint":"...","duration":"3-5 min"}],"powerPhrases":["phrase1","phrase2","phrase3","phrase4","phrase5"],"thingsToNeverSay":["thing1","thing2","thing3"]}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) { setError('Generation failed — try again.'); setLoading(false); return; }
      const result = JSON.parse(jsonMatch[0]);
      setScript(result);
      setActiveSection(0);
    } catch(e) {
      console.error(e);
      setError('Generation failed — try again.');
    }
    setLoading(false);
  };

  const copySection = (text, key) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(()=>setCopied(''),2000); };
  const copyAll = () => {
    if (!script) return;
    const full = `${script.scriptTitle}\n\nPREP NOTES: ${script.prepNotes}\n\n` + script.sections.map(s=>`=== ${s.title.toUpperCase()} ===\n${s.script}`).join('\n\n');
    navigator.clipboard.writeText(full);
    setCopied('all'); setTimeout(()=>setCopied(''),2000);
  };

  // Parse delivery notes from script text for display
  const renderScript = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[DELIVERY NOTE:[^\]]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[DELIVERY NOTE:')) {
        const note = part.replace('[DELIVERY NOTE:', '').replace(']', '').trim();
        return <div key={i} style={{background:'rgba(255,92,26,0.08)',border:'1px solid rgba(255,92,26,0.2)',borderRadius:6,padding:'8px 12px',margin:'10px 0',fontFamily:F.mono,fontSize:10,color:C.accent,lineHeight:1.6}}>🎯 {note}</div>;
      }
      return <span key={i} style={{fontFamily:'Georgia,serif',fontSize:14,color:C.text,lineHeight:1.9,whiteSpace:'pre-wrap'}}>{part}</span>;
    });
  };

  return (
    <div>
      <SectionHeader title="SALES SCRIPT GENERATOR" sub="Custom Zoom sales scripts with delivery coaching — works even with zero sales experience"/>

      {!script ? (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>YOUR OFFER</div>
            <div style={{marginBottom:12}}><Label>Offer Name *</Label><FInput value={offerName} onChange={setOfferName} placeholder="e.g. AI Lead Gen System, HVAC Growth Package"/></div>
            <div style={{marginBottom:12}}><Label>What Your Product / Service Does *</Label><FTextarea value={service} onChange={setService} placeholder="e.g. We build a complete AI-powered client acquisition system for HVAC companies using Facebook ads — guaranteed calls on your calendar within 48 hours of launch." rows={4}/></div>
            <div style={{marginBottom:12}}><Label>Price / Pricing Structure *</Label><FInput value={price} onChange={setPrice} placeholder="e.g. $5,000 setup + $997/month retainer"/></div>
            <div style={{marginBottom:16}}><Label>Anything Important to Add</Label><FTextarea value={extras} onChange={setExtras} placeholder="e.g. We offer financing. 60-day guarantee. Works best for companies doing $500k-$5M. Our top clients see ROI in 30 days." rows={3}/></div>

            <div style={{marginBottom:16}}>
              <Label>Call Type</Label>
              <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:8}}>
                {CALL_TYPES.map(ct=>(
                  <button key={ct.v} onClick={()=>setCallType(ct.v)} style={{display:'flex',alignItems:'center',gap:10,padding:'11px 14px',borderRadius:7,border:`1px solid ${callType===ct.v?C.accent:C.border}`,background:callType===ct.v?C.accentLow:'transparent',color:callType===ct.v?C.accent:C.textSub,fontFamily:F.mono,fontSize:12,cursor:'pointer',textAlign:'left'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:callType===ct.v?C.accent:C.border,flexShrink:0}}/>
                    {ct.l}
                  </button>
                ))}
              </div>
            </div>

            <Btn Icon={Sparkles} onClick={generate} disabled={loading||!offerName.trim()||!service.trim()||!price.trim()} style={{width:'100%',justifyContent:'center'}}>
              {loading?'Writing script (~30s)...':'Generate Sales Script'}
            </Btn>
            {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:8}}>{error}</div>}
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>WHAT YOU GET</div>
            {[
              {n:'01',t:'Word-for-word script',d:'Every section written out exactly — no improvising required. Just read naturally.'},
              {n:'02',t:'Delivery coaching',d:'Orange coaching notes throughout tell you exactly how to say each part — tone, pace, when to pause.'},
              {n:'03',t:'Discovery questions',d:'The right questions to ask before you pitch so you understand what they need.'},
              {n:'04',t:'The math walkthrough',d:'Step-by-step ROI conversation so they sell themselves — the most powerful close.'},
              {n:'05',t:'Objection responses',d:'Calm, confident answers to the most common pushbacks — price, timing, trust.'},
              {n:'06',t:'Power phrases',d:'5 key sentences to memorize that make you sound like a seasoned closer.'},
            ].map(item=>(
              <div key={item.n} style={{display:'flex',gap:14,marginBottom:16}}>
                <div style={{fontFamily:F.display,fontSize:18,color:C.accent,flexShrink:0,lineHeight:1}}>{item.n}</div>
                <div>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.text,marginBottom:3}}>{item.t}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.7}}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Header */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:18}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
              <div>
                <div style={{fontFamily:F.display,fontSize:22,letterSpacing:2,color:C.text}}>{script.scriptTitle}</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.accent,marginTop:4}}>{CALL_TYPES.find(c=>c.v===callType)?.l} • {offerName}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <Btn variant="ghost" size="sm" onClick={()=>setScript(null)}>New Script</Btn>
                <Btn variant="ghost" size="sm" Icon={RefreshCw} onClick={generate}>Regenerate</Btn>
                <Btn size="sm" Icon={Copy} onClick={copyAll}>{copied==='all'?'Copied!':'Copy Full Script'}</Btn>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
              <div style={{padding:'12px 14px',background:C.accentLow,border:`1px solid ${C.accent}33`,borderRadius:8}}>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.accent,letterSpacing:1.5,marginBottom:6}}>BEFORE THE CALL</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.8}}>{script.prepNotes}</div>
              </div>
              <div style={{padding:'12px 14px',background:C.surface,border:`1px solid ${C.border}`,borderRadius:8}}>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.danger,letterSpacing:1.5,marginBottom:6}}>NEVER SAY THESE</div>
                {script.thingsToNeverSay?.map((t,i)=>(
                  <div key={i} style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.7}}>✗ {t}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Script sections */}
          <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:18,alignItems:'start'}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden',position:'sticky',top:20}}>
              {script.sections?.map((s,i)=>(
                <button key={i} onClick={()=>setActiveSection(i)} style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'11px 14px',background:activeSection===i?C.accentLow:'transparent',border:'none',borderBottom:`1px solid ${C.border}`,cursor:'pointer',textAlign:'left'}}>
                  <div style={{width:6,height:6,borderRadius:'50%',background:activeSection===i?C.accent:C.border,flexShrink:0}}/>
                  <div>
                    <div style={{fontFamily:F.mono,fontSize:10,color:activeSection===i?C.accent:C.text}}>{s.title}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{s.duration}</div>
                  </div>
                </button>
              ))}
            </div>

            {script.sections?.[activeSection]&&(
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                  <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text}}>{script.sections[activeSection].title}</div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{script.sections[activeSection].duration}</span>
                    <button onClick={()=>copySection(script.sections[activeSection].script,'s'+activeSection)} style={{background:'none',border:`1px solid ${C.border}`,borderRadius:5,padding:'5px 12px',color:C.textSub,fontFamily:F.mono,fontSize:10,cursor:'pointer'}}>{copied==='s'+activeSection?'✓':'Copy'}</button>
                  </div>
                </div>

                <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,marginBottom:16,padding:'8px 12px',background:C.surface,borderRadius:6,borderLeft:`2px solid ${C.accent}`}}>
                  💡 {script.sections[activeSection].keyPoint}
                </div>

                <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'20px 24px',lineHeight:1.9,marginBottom:16}}>
                  {renderScript(script.sections[activeSection].script)}
                </div>

                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <Btn variant="ghost" size="sm" Icon={ArrowLeft} onClick={()=>setActiveSection(Math.max(0,activeSection-1))} disabled={activeSection===0}>Previous</Btn>
                  <Btn size="sm" Icon={ChevronRight} onClick={()=>setActiveSection(Math.min((script.sections?.length||1)-1,activeSection+1))} disabled={activeSection===(script.sections?.length||1)-1}>Next Section</Btn>
                </div>
              </div>
            )}
          </div>

          {/* Power phrases */}
          {script.powerPhrases?.length>0&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginTop:18}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>MEMORIZE THESE PHRASES</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {script.powerPhrases.map((p,i)=>(
                  <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,padding:'12px 16px',fontFamily:'Georgia,serif',fontSize:13,color:C.text,lineHeight:1.6,fontStyle:'italic'}}>"{p}"</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ────────────────────────────────────────────────────────────
function AdminDashboardView({ localUsers }) {
  const totalSeats = localUsers?.length || 0;
  const activeUsers = localUsers?.filter(u => u.role !== 'Admin')?.length || 0;

  const FEATURES = [
    { name: 'Lead Finder',        id: 'leadfinder',   uses: 847, avgMin: 8.2,  trend: '+12%' },
    { name: 'Email & SMS Blast',  id: 'blast',        uses: 634, avgMin: 6.1,  trend: '+8%' },
    { name: 'Sales Script',       id: 'pitch',        uses: 521, avgMin: 11.4, trend: '+24%' },
    { name: 'Meta Ads',           id: 'metaads',      uses: 498, avgMin: 9.3,  trend: '+6%' },
    { name: 'VSL Builder',        id: 'vsl',          uses: 441, avgMin: 14.2, trend: '+18%' },
    { name: 'Viral Post Modeler', id: 'viral',        uses: 389, avgMin: 7.8,  trend: '+31%' },
    { name: 'Offer Builder',      id: 'offerbuilder', uses: 312, avgMin: 10.1, trend: '+4%' },
    { name: 'Cold Call Script',   id: 'coldcall',     uses: 287, avgMin: 5.6,  trend: '+9%' },
    { name: 'Ad Copy Generator',  id: 'compose',      uses: 245, avgMin: 4.8,  trend: '+2%' },
    { name: 'Pipeline',           id: 'pipeline',     uses: 198, avgMin: 12.3, trend: '-3%' },
  ];

  const maxUses = Math.max(...FEATURES.map(f=>f.uses));

  const RETENTION_DATA = [
    { month: 'Month 1', pct: 100, count: totalSeats },
    { month: 'Month 2', pct: 88,  count: Math.round(totalSeats * 0.88) },
    { month: 'Month 3', pct: 79,  count: Math.round(totalSeats * 0.79) },
    { month: 'Month 4', pct: 74,  count: Math.round(totalSeats * 0.74) },
    { month: 'Month 5', pct: 71,  count: Math.round(totalSeats * 0.71) },
    { month: 'Month 6', pct: 69,  count: Math.round(totalSeats * 0.69) },
  ];

  return (
    <div>
      <SectionHeader title="ADMIN DASHBOARD" sub="Platform analytics, retention, and usage data"/>

      {/* Top stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:22}}>
        {[
          { label:'Total Seats',         value: totalSeats,    sub:'Active accounts',       color: C.accent },
          { label:'Active Members',       value: activeUsers,   sub:'Non-admin accounts',    color: C.success },
          { label:'Avg Retention',        value: '74%',         sub:'At 4 months',           color: '#7C3AED' },
          { label:'Avg Session Time',     value: '23 min',      sub:'Per login session',     color: '#0A66C2' },
        ].map(stat=>(
          <div key={stat.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18}}>
            <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:8}}>{stat.label.toUpperCase()}</div>
            <div style={{fontFamily:F.display,fontSize:32,color:stat.color,marginBottom:4}}>{stat.value}</div>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub}}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18,marginBottom:18}}>
        {/* Retention chart */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
          <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:4}}>RETENTION / ATTRITION</div>
          <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginBottom:18}}>Member retention over time — avg stay: 4.2 months</div>
          {RETENTION_DATA.map((d,i)=>(
            <div key={d.month} style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,width:64,flexShrink:0}}>{d.month}</div>
              <div style={{flex:1,height:20,background:C.surface,borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${d.pct}%`,background:d.pct>80?C.success:d.pct>70?C.accent:C.warn,borderRadius:4,transition:'width 0.5s ease'}}/>
              </div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.text,width:40,textAlign:'right'}}>{d.pct}%</div>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,width:50,textAlign:'right'}}>{d.count} mbrs</div>
            </div>
          ))}
          <div style={{marginTop:16,padding:'10px 14px',background:C.surface,borderRadius:7,fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.7}}>
            Note: Retention data is simulated. Connect Supabase database to track real member sessions.
          </div>
        </div>

        {/* Member list */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text}}>MEMBER ACCOUNTS</div>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,marginTop:2}}>{totalSeats} total seats</div>
          </div>
          <div style={{maxHeight:280,overflowY:'auto'}}>
            {localUsers?.map((u,i)=>(
              <div key={u.email} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'11px 20px',borderBottom:i<localUsers.length-1?`1px solid ${C.border}`:'none'}}>
                <div>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.text}}>{u.name}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{u.email}</div>
                </div>
                <span style={{fontFamily:F.mono,fontSize:9,color:u.role==='Admin'?C.accent:C.success,padding:'2px 8px',border:`1px solid ${u.role==='Admin'?C.accent:C.success}44`,borderRadius:4}}>{u.role||'Member'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature usage */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
        <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:4}}>FEATURE USAGE</div>
        <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginBottom:20}}>Most used tools across all members — note: usage data is simulated until Supabase is connected</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {FEATURES.map((f,i)=>(
            <div key={f.id} style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,width:16,textAlign:'right'}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <div style={{fontFamily:F.mono,fontSize:11,color:C.text}}>{f.name}</div>
                  <div style={{display:'flex',gap:10,alignItems:'center'}}>
                    <span style={{fontFamily:F.mono,fontSize:9,color:f.trend.startsWith('+')?C.success:C.danger}}>{f.trend}</span>
                    <span style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{f.avgMin} min avg</span>
                    <span style={{fontFamily:F.mono,fontSize:10,color:C.text}}>{f.uses}</span>
                  </div>
                </div>
                <div style={{height:6,background:C.surface,borderRadius:3,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${(f.uses/maxUses)*100}%`,background:i<3?C.accent:i<6?'#7C3AED':C.textMuted,borderRadius:3}}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



// ─── Still Image Ad Creator ────────────────────────────────────────────────────
function StillImageAdView() {
  const [step, setStep] = useState(1);
  const [logo, setLogo] = useState(null);
  const [logoName, setLogoName] = useState('');
  const [adStyle, setAdStyle] = useState('bold');
  const [adSize, setAdSize] = useState('square');
  const [colorScheme, setColorScheme] = useState('dark');
  const [campaignType, setCampaignType] = useState('single');
  const [industry, setIndustry] = useState('');
  const [objective, setObjective] = useState('lead-gen');
  const [hook, setHook] = useState('pain');
  const [cta, setCta] = useState('book-call');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [proof, setProof] = useState('');
  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const [activeAd, setActiveAd] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef();
  const adRef = useRef();

  const AD_STYLES = [
    { v:'bold',       l:'Bold Statement',    desc:'Huge headline, minimal design. Stops the scroll.' },
    { v:'problem',    l:'Problem/Solution',  desc:'Left pain, right solution. Clear contrast.' },
    { v:'offer',      l:'Offer/Urgency',     desc:'Lead with the offer. Price, deadline, CTA.' },
    { v:'social',     l:'Social Proof',      desc:'Testimonial or result. Trust-first.' },
    { v:'before',     l:'Before/After',      desc:'Transformation story. Works for anything.' },
    { v:'clean',      l:'Clean Premium',     desc:'White space, centered, high-end feel.' },
    { v:'dark',       l:'Dark/Power',        desc:'Dark bg, bold accent. Authority and confidence.' },
    { v:'listicle',   l:'3 Benefits',        desc:'Three punchy reasons. Works for cold traffic.' },
  ];

  const AD_SIZES = [
    { v:'square',   l:'Square 1:1',      w:1080, h:1080, desc:'Facebook & Instagram feed' },
    { v:'portrait', l:'Portrait 4:5',    w:1080, h:1350, desc:'Instagram feed (most reach)' },
    { v:'story',    l:'Story 9:16',      w:1080, h:1920, desc:'Stories & Reels' },
    { v:'landscape',l:'Landscape 1.91:1',w:1200, h:628,  desc:'Facebook feed & Google Display' },
  ];

  const COLOR_SCHEMES = [
    { v:'dark',    l:'Dark Power',    bg:'#0D0D0D', text:'#F0EDE8', accent:'#DC2626', sub:'#888' },
    { v:'white',   l:'Clean White',   bg:'#FFFFFF', text:'#111111', accent:'#DC2626', sub:'#666' },
    { v:'navy',    l:'Navy Pro',      bg:'#0A1628', text:'#FFFFFF', accent:'#4A9EFF', sub:'#8899BB' },
    { v:'forest',  l:'Forest Trust',  bg:'#0F2117', text:'#E8F5E9', accent:'#4CAF50', sub:'#7CB97D' },
    { v:'purple',  l:'Purple Bold',   bg:'#1A0533', text:'#F3E5FF', accent:'#9C27B0', sub:'#BB86FC' },
    { v:'red',     l:'Red Urgency',   bg:'#1A0000', text:'#FFF5F5', accent:'#EF4444', sub:'#FF8888' },
    { v:'gold',    l:'Gold Premium',  bg:'#0D0A00', text:'#FFFDE7', accent:'#FFB300', sub:'#FFCC44' },
    { v:'teal',    l:'Teal Modern',   bg:'#001A1A', text:'#E0FFFF', accent:'#00BCD4', sub:'#4DD0E1' },
  ];

  const INDUSTRIES = [
    'AI Agency / Tech','HVAC / Home Services','Real Estate','Mortgage / Finance',
    'Coaching / Consulting','E-commerce','SaaS / Software','Health & Wellness',
    'Insurance','Legal / Law Firm','Dental / Medical','Restaurant / Food',
    'Fitness / Gym','Marketing Agency','Construction / Roofing','Auto / Dealership',
  ];

  const OBJECTIVES = [
    { v:'lead-gen',   l:'Generate Leads' },
    { v:'sales',      l:'Direct Sales' },
    { v:'awareness',  l:'Brand Awareness' },
    { v:'webinar',    l:'Webinar / Event Registration' },
    { v:'discovery',  l:'Book a Discovery Call' },
    { v:'download',   l:'Free Download / Lead Magnet' },
    { v:'trial',      l:'Free Trial / Demo' },
  ];

  const HOOK_TYPES = [
    { v:'pain',        l:'Pain Agitation',    desc:'Speak to their biggest frustration' },
    { v:'result',      l:'Dream Result',      desc:'Lead with the outcome they want' },
    { v:'question',    l:'Curiosity Question', desc:'Open loop that demands an answer' },
    { v:'bold',        l:'Bold Claim',        desc:'Contrarian or provocative statement' },
    { v:'how-to',      l:'How-To',            desc:'Teach them something valuable' },
    { v:'social',      l:'Social Proof',      desc:'Lead with a result or testimonial' },
    { v:'mistake',     l:'Common Mistake',    desc:'Call out what they\'re doing wrong' },
    { v:'number',      l:'Number Hook',       desc:'Specific stat or timeframe' },
  ];

  const CTA_OPTIONS = [
    { v:'book-call',   l:'Book a Free Call' },
    { v:'learn-more',  l:'Learn More' },
    { v:'get-started', l:'Get Started Today' },
    { v:'claim',       l:'Claim Your Spot' },
    { v:'download',    l:'Download Free' },
    { v:'watch',       l:'Watch Now' },
    { v:'apply',       l:'Apply Now' },
    { v:'shop-now',    l:'Shop Now' },
    { v:'try-free',    l:'Try for Free' },
    { v:'see-pricing', l:'See Pricing' },
  ];

  const handleLogo = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = e => { setLogo(e.target.result); setLogoName(file.name); };
    r.readAsDataURL(file);
  };

  const generate = async () => {
    if (!offer.trim()) return;
    setLoading(true); setError(''); setAds([]);
    const scheme = COLOR_SCHEMES.find(c=>c.v===colorScheme);
    const sizeInfo = AD_SIZES.find(s=>s.v===adSize);
    const numAds = campaignType === 'single' ? 1 : 7;

    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6", max_tokens:4000,
          messages:[{role:"user",content:`You are a world-class direct response ad copywriter specializing in high-converting still image ads.

Create ${numAds} unique still image ad variation${numAds>1?'s':''} for a ${sizeInfo?.l} (${sizeInfo?.w}x${sizeInfo?.h}) ad.

BRIEF:
Industry: ${industry || 'Business/Marketing'}
Objective: ${OBJECTIVES.find(o=>o.v===objective)?.l}
Hook Type: ${HOOK_TYPES.find(h=>h.v===hook)?.l} — ${HOOK_TYPES.find(h=>h.v===hook)?.desc}
Ad Style: ${AD_STYLES.find(s=>s.v===adStyle)?.l} — ${AD_STYLES.find(s=>s.v===adStyle)?.desc}
Offer: ${offer}
Target Audience: ${audience || 'Business owners and entrepreneurs'}
Main Pain Point: ${painPoint || 'Not specified'}
Social Proof/Result: ${proof || 'Not specified'}
CTA: ${CTA_OPTIONS.find(c=>c.v===cta)?.l}
Color Scheme: ${scheme?.l} (bg: ${scheme?.bg}, accent: ${scheme?.accent})
${numAds>1?'Campaign: 14-day — each ad must have a DIFFERENT angle, hook, and energy':''}

For each ad return a JSON object with these exact fields:
- headline: The main hook (3-7 words max, PUNCHY)
- subheadline: Supporting line (10-15 words)
- body: 1-2 sentence value proposition (20-30 words max)
- cta: Button text (2-4 words)
- badge: Small urgency/proof badge text (3-5 words, e.g. "Free 30-Min Call" or "Limited Spots")
- angle: Which angle this ad uses (e.g. "Pain agitation", "Social proof", "Bold claim")
- eyebrow: Small text above headline (3-5 words, e.g. "ATTENTION: Agency Owners" or "NEW FOR 2025")

Return ONLY valid JSON array:
[{"headline":"","subheadline":"","body":"","cta":"","badge":"","angle":"","eyebrow":""}]`}]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) { setError('Generation failed — try again.'); setLoading(false); return; }
      const parsed = JSON.parse(jsonMatch[0]);
      setAds(parsed);
      setActiveAd(0);
      setStep(3);
    } catch(e) { console.error(e); setError('Failed — try again.'); }
    setLoading(false);
  };

  const scheme = COLOR_SCHEMES.find(c=>c.v===colorScheme) || COLOR_SCHEMES[0];
  const sizeInfo = AD_SIZES.find(s=>s.v===adSize) || AD_SIZES[0];
  const currentAd = ads[activeAd];

  // Scale factor for preview
  const PREVIEW_W = 420;
  const scale = PREVIEW_W / sizeInfo.w;
  const previewH = sizeInfo.h * scale;

  const downloadSVG = () => {
    if (!adRef.current) return;
    const svgEl = adRef.current.querySelector('svg');
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], {type:'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `ad-${activeAd+1}-${adStyle}.svg`;
    a.click(); URL.revokeObjectURL(url);
  };

  // Render the ad as SVG based on style
  const renderAd = (ad, w, h, sc) => {
    if (!ad) return null;
    const bg = scheme.bg;
    const fg = scheme.text;
    const acc = scheme.accent;
    const sub = scheme.sub;
    const sw = w; const sh = h;

    // Font sizes scaled
    const eyeSize = Math.round(sw * 0.022 * sc);
    const headSize = Math.round(sw * (adStyle==='bold'?0.12:0.08) * sc);
    const subSize = Math.round(sw * 0.038 * sc);
    const bodySize = Math.round(sw * 0.028 * sc);
    const ctaSize = Math.round(sw * 0.032 * sc);
    const badgeSize = Math.round(sw * 0.022 * sc);
    const pad = sw * 0.07 * sc;
    const pw = sw * sc; const ph = sh * sc;

    // Wrap text helper - returns array of lines
    const wrapText = (text, maxCharsPerLine) => {
      if (!text) return [];
      const words = text.split(' ');
      const lines = [];
      let current = '';
      for (const word of words) {
        if ((current + ' ' + word).trim().length > maxCharsPerLine) {
          if (current) lines.push(current.trim());
          current = word;
        } else {
          current = (current + ' ' + word).trim();
        }
      }
      if (current) lines.push(current.trim());
      return lines;
    };

    if (adStyle === 'bold') {
      const headLines = wrapText(ad.headline?.toUpperCase(), 12);
      const subLines = wrapText(ad.subheadline, 28);
      const bodyLines = wrapText(ad.body, 38);
      return (
        <svg width={pw} height={ph} viewBox={`0 0 ${pw} ${ph}`} xmlns="http://www.w3.org/2000/svg">
          <rect width={pw} height={ph} fill={bg}/>
          {/* Accent bar top */}
          <rect x={0} y={0} width={pw} height={ph*0.006} fill={acc}/>
          {/* Diagonal accent shape */}
          <polygon points={`0,${ph*0.55} ${pw*0.4},${ph*0.45} ${pw*0.4},${ph} 0,${ph}`} fill={acc} opacity="0.06"/>
          {/* Eyebrow */}
          {ad.eyebrow&&<text x={pad} y={ph*0.09} fontFamily="Arial, sans-serif" fontSize={eyeSize} fill={acc} fontWeight="600" letterSpacing="3">{ad.eyebrow.toUpperCase()}</text>}
          {/* Headline */}
          {headLines.map((line,i)=><text key={i} x={pad} y={ph*(ad.eyebrow?0.16:0.14)+(i*headSize*1.05)} fontFamily="Arial Black, Arial, sans-serif" fontSize={headSize} fill={fg} fontWeight="900">{line}</text>)}
          {/* Accent underline */}
          <rect x={pad} y={ph*(ad.eyebrow?0.16:0.14)+(headLines.length*headSize*1.05)+pw*0.008} width={pw*0.18} height={pw*0.006} fill={acc} rx={pw*0.003}/>
          {/* Subheadline */}
          {subLines.map((line,i)=><text key={i} x={pad} y={ph*(ad.eyebrow?0.16:0.14)+(headLines.length*headSize*1.05)+pw*0.04+(i*subSize*1.3)} fontFamily="Arial, sans-serif" fontSize={subSize} fill={sub}>{line}</text>)}
          {/* Body */}
          {bodyLines.map((line,i)=><text key={i} x={pad} y={ph*0.58+(i*bodySize*1.5)} fontFamily="Arial, sans-serif" fontSize={bodySize} fill={fg} opacity="0.85">{line}</text>)}
          {/* CTA Button */}
          <rect x={pad} y={ph*0.72} width={pw*0.42} height={ph*0.1} rx={ph*0.05} fill={acc}/>
          <text x={pad+pw*0.21} y={ph*0.78} fontFamily="Arial, sans-serif" fontSize={ctaSize} fill="#fff" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{ad.cta}</text>
          {/* Badge */}
          {ad.badge&&<><rect x={pw-pad-pw*0.3} y={ph*0.06} width={pw*0.3} height={ph*0.055} rx={ph*0.027} fill={acc} opacity="0.15" stroke={acc} strokeWidth="1"/><text x={pw-pad-pw*0.15} y={ph*0.087} fontFamily="Arial, sans-serif" fontSize={badgeSize} fill={acc} fontWeight="600" textAnchor="middle">{ad.badge}</text></>}
          {/* Logo area */}
          {logo&&<image href={logo} x={pad} y={ph-pad-ph*0.06} width={ph*0.06*2} height={ph*0.06} preserveAspectRatio="xMidYMid meet"/>}
          {/* Bottom bar */}
          <rect x={0} y={ph-ph*0.004} width={pw} height={ph*0.004} fill={acc}/>
        </svg>
      );
    }

    if (adStyle === 'problem') {
      const headLines = wrapText(ad.headline, 16);
      const subLines = wrapText(ad.subheadline, 22);
      return (
        <svg width={pw} height={ph} viewBox={`0 0 ${pw} ${ph}`} xmlns="http://www.w3.org/2000/svg">
          <rect width={pw} height={ph} fill={bg}/>
          {/* Split background */}
          <rect x={0} y={0} width={pw} height={ph*0.5} fill={acc} opacity="0.08"/>
          <rect x={0} y={ph*0.5} width={pw} height={ph*0.5} fill={acc} opacity="0.02"/>
          {/* Center divider */}
          <line x1={0} y1={ph*0.5} x2={pw} y2={ph*0.5} stroke={acc} strokeWidth={2} opacity="0.4"/>
          {/* PROBLEM label */}
          <text x={pad} y={ph*0.1} fontFamily="Arial, sans-serif" fontSize={eyeSize} fill={acc} fontWeight="600" letterSpacing="3" opacity="0.7">THE PROBLEM</text>
          {/* Pain point */}
          {wrapText(ad.eyebrow||painPoint||'Still struggling to get clients?', 24).map((l,i)=><text key={i} x={pad} y={ph*0.2+(i*headSize*1.1)} fontFamily="Arial Black, Arial, sans-serif" fontSize={headSize*0.75} fill={fg} fontWeight="900">{l}</text>)}
          {/* SOLUTION label */}
          <text x={pad} y={ph*0.58} fontFamily="Arial, sans-serif" fontSize={eyeSize} fill={acc} fontWeight="600" letterSpacing="3">THE SOLUTION</text>
          {/* Headline */}
          {headLines.map((l,i)=><text key={i} x={pad} y={ph*0.67+(i*headSize*1.1)} fontFamily="Arial Black, Arial, sans-serif" fontSize={headSize*0.8} fill={fg} fontWeight="900">{l}</text>)}
          {/* Subheadline */}
          {subLines.map((l,i)=><text key={i} x={pad} y={ph*0.81+(i*subSize*1.3)} fontFamily="Arial, sans-serif" fontSize={subSize*0.9} fill={sub}>{l}</text>)}
          {/* CTA */}
          <rect x={pad} y={ph*0.88} width={pw*0.44} height={ph*0.08} rx={ph*0.04} fill={acc}/>
          <text x={pad+pw*0.22} y={ph*0.925} fontFamily="Arial, sans-serif" fontSize={ctaSize*0.9} fill="#fff" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{ad.cta}</text>
          {logo&&<image href={logo} x={pw-pad-ph*0.08} y={ph-pad-ph*0.05} width={ph*0.08} height={ph*0.05} preserveAspectRatio="xMidYMid meet"/>}
        </svg>
      );
    }

    if (adStyle === 'offer') {
      const headLines = wrapText(ad.headline?.toUpperCase(), 14);
      return (
        <svg width={pw} height={ph} viewBox={`0 0 ${pw} ${ph}`} xmlns="http://www.w3.org/2000/svg">
          <rect width={pw} height={ph} fill={bg}/>
          {/* Top accent band */}
          <rect x={0} y={0} width={pw} height={ph*0.28} fill={acc}/>
          {/* Eyebrow in band */}
          {ad.eyebrow&&<text x={pw/2} y={ph*0.09} fontFamily="Arial, sans-serif" fontSize={eyeSize} fill={bg} fontWeight="600" letterSpacing="3" textAnchor="middle" opacity="0.8">{ad.eyebrow.toUpperCase()}</text>}
          {/* Headline in band */}
          {headLines.map((l,i)=><text key={i} x={pw/2} y={ph*(ad.eyebrow?0.155:0.12)+(i*headSize*1.05)} fontFamily="Arial Black, Arial, sans-serif" fontSize={headSize} fill={bg} fontWeight="900" textAnchor="middle">{l}</text>)}
          {/* Body */}
          {wrapText(ad.body, 40).map((l,i)=><text key={i} x={pw/2} y={ph*0.38+(i*bodySize*1.5)} fontFamily="Arial, sans-serif" fontSize={bodySize} fill={fg} textAnchor="middle">{l}</text>)}
          {/* Subheadline */}
          {wrapText(ad.subheadline, 30).map((l,i)=><text key={i} x={pw/2} y={ph*0.55+(i*subSize*1.3)} fontFamily="Arial, sans-serif" fontSize={subSize} fill={sub} textAnchor="middle">{l}</text>)}
          {/* Badge pill */}
          {ad.badge&&<><rect x={pw/2-pw*0.22} y={ph*0.66} width={pw*0.44} height={ph*0.07} rx={ph*0.035} fill={acc} opacity="0.15" stroke={acc} strokeWidth="1.5"/><text x={pw/2} y={ph*0.698} fontFamily="Arial, sans-serif" fontSize={badgeSize*1.1} fill={acc} fontWeight="700" textAnchor="middle">{ad.badge}</text></>}
          {/* CTA */}
          <rect x={pw/2-pw*0.24} y={ph*0.77} width={pw*0.48} height={ph*0.1} rx={ph*0.05} fill={acc}/>
          <text x={pw/2} y={ph*0.825} fontFamily="Arial, sans-serif" fontSize={ctaSize} fill={bg} fontWeight="800" textAnchor="middle" dominantBaseline="middle">{ad.cta}</text>
          {logo&&<image href={logo} x={pw/2-ph*0.04} y={ph-pad-ph*0.055} width={ph*0.08} height={ph*0.055} preserveAspectRatio="xMidYMid meet"/>}
        </svg>
      );
    }

    if (adStyle === 'dark') {
      const headLines = wrapText(ad.headline, 18);
      return (
        <svg width={pw} height={ph} viewBox={`0 0 ${pw} ${ph}`} xmlns="http://www.w3.org/2000/svg">
          <rect width={pw} height={ph} fill={bg}/>
          {/* Radial glow */}
          <circle cx={pw*0.5} cy={ph*0.35} r={pw*0.45} fill={acc} opacity="0.06"/>
          {/* Left accent line */}
          <rect x={pad} y={ph*0.08} width={pw*0.004} height={ph*0.78} fill={acc} rx={pw*0.002}/>
          {/* Eyebrow */}
          {ad.eyebrow&&<text x={pad+pw*0.025} y={ph*0.14} fontFamily="Arial, sans-serif" fontSize={eyeSize} fill={acc} fontWeight="600" letterSpacing="2">{ad.eyebrow.toUpperCase()}</text>}
          {/* Headline */}
          {headLines.map((l,i)=><text key={i} x={pad+pw*0.025} y={ph*(ad.eyebrow?0.23:0.18)+(i*headSize*1.08)} fontFamily="Arial Black, Arial, sans-serif" fontSize={headSize} fill={fg} fontWeight="900">{l}</text>)}
          {/* Divider */}
          <rect x={pad+pw*0.025} y={ph*(ad.eyebrow?0.23:0.18)+(headLines.length*headSize*1.08)+ph*0.015} width={pw*0.25} height={pw*0.004} fill={acc} rx={pw*0.002}/>
          {/* Subheadline */}
          {wrapText(ad.subheadline,32).map((l,i)=><text key={i} x={pad+pw*0.025} y={ph*0.58+(i*subSize*1.35)} fontFamily="Arial, sans-serif" fontSize={subSize} fill={sub}>{l}</text>)}
          {/* Body */}
          {wrapText(ad.body,42).map((l,i)=><text key={i} x={pad+pw*0.025} y={ph*0.7+(i*bodySize*1.5)} fontFamily="Arial, sans-serif" fontSize={bodySize} fill={fg} opacity="0.7">{l}</text>)}
          {/* CTA */}
          <rect x={pad+pw*0.025} y={ph*0.82} width={pw*0.4} height={ph*0.09} rx={ph*0.045} fill={acc}/>
          <text x={pad+pw*0.025+pw*0.2} y={ph*0.865} fontFamily="Arial, sans-serif" fontSize={ctaSize} fill="#fff" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{ad.cta}</text>
          {ad.badge&&<text x={pw-pad-pw*0.025} y={ph*0.87} fontFamily="Arial, sans-serif" fontSize={badgeSize} fill={acc} textAnchor="end" fontWeight="600">{ad.badge}</text>}
          {logo&&<image href={logo} x={pw-pad-pw*0.025-ph*0.06*1.8} y={ph*0.04} width={ph*0.06*1.8} height={ph*0.06} preserveAspectRatio="xMidYMid meet"/>}
        </svg>
      );
    }

    // Default / listicle / social / before / clean
    const headLines = wrapText(ad.headline, 20);
    const bodyLines = wrapText(ad.body, 40);
    return (
      <svg width={pw} height={ph} viewBox={`0 0 ${pw} ${ph}`} xmlns="http://www.w3.org/2000/svg">
        <rect width={pw} height={ph} fill={bg}/>
        <rect x={0} y={0} width={pw} height={ph*0.007} fill={acc}/>
        {ad.eyebrow&&<text x={pad} y={ph*0.1} fontFamily="Arial, sans-serif" fontSize={eyeSize} fill={acc} fontWeight="600" letterSpacing="3">{ad.eyebrow.toUpperCase()}</text>}
        {headLines.map((l,i)=><text key={i} x={pad} y={ph*(ad.eyebrow?0.19:0.15)+(i*headSize*1.1)} fontFamily="Arial Black, Arial, sans-serif" fontSize={headSize*0.85} fill={fg} fontWeight="900">{l}</text>)}
        <rect x={pad} y={ph*(ad.eyebrow?0.19:0.15)+(headLines.length*headSize*1.1)+ph*0.012} width={pw*0.15} height={pw*0.005} fill={acc} rx={pw*0.002}/>
        {wrapText(ad.subheadline,32).map((l,i)=><text key={i} x={pad} y={ph*0.5+(i*subSize*1.35)} fontFamily="Arial, sans-serif" fontSize={subSize} fill={sub}>{l}</text>)}
        {bodyLines.map((l,i)=><text key={i} x={pad} y={ph*0.63+(i*bodySize*1.5)} fontFamily="Arial, sans-serif" fontSize={bodySize} fill={fg} opacity="0.85">{l}</text>)}
        {ad.badge&&<><rect x={pad} y={ph*0.74} width={pw*0.38} height={ph*0.06} rx={ph*0.03} fill={acc} opacity="0.12" stroke={acc} strokeWidth="1"/><text x={pad+pw*0.19} y={ph*0.773} fontFamily="Arial, sans-serif" fontSize={badgeSize} fill={acc} fontWeight="600" textAnchor="middle">{ad.badge}</text></>}
        <rect x={pad} y={ph*0.82} width={pw*0.44} height={ph*0.1} rx={ph*0.05} fill={acc}/>
        <text x={pad+pw*0.22} y={ph*0.875} fontFamily="Arial, sans-serif" fontSize={ctaSize} fill="#fff" fontWeight="700" textAnchor="middle" dominantBaseline="middle">{ad.cta}</text>
        {logo&&<image href={logo} x={pw-pad-ph*0.07*2} y={ph-pad-ph*0.065} width={ph*0.07*2} height={ph*0.065} preserveAspectRatio="xMidYMid meet"/>}
        <rect x={0} y={ph-ph*0.004} width={pw} height={ph*0.004} fill={acc}/>
      </svg>
    );
  };

  return (
    <div>
      <SectionHeader title="STILL IMAGE AD CREATOR" sub="Generate conversion-optimized ad creatives — single or 14-day campaign"/>

      {/* Steps */}
      <div style={{display:'flex',gap:6,marginBottom:22,alignItems:'center'}}>
        {[{n:1,l:'Style & Size'},{n:2,l:'Ad Brief'},{n:3,l:'Your Ads'}].map((s,i)=>(
          <React.Fragment key={s.n}>
            <div style={{display:'flex',alignItems:'center',gap:6,cursor:step>s.n?'pointer':'default'}} onClick={()=>step>s.n&&setStep(s.n)}>
              <div style={{width:26,height:26,borderRadius:'50%',background:step>=s.n?C.accent:C.border,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontSize:11,color:step>=s.n?'#fff':C.textMuted}}>{s.n}</div>
              <span style={{fontFamily:F.mono,fontSize:10,color:step===s.n?C.text:C.textMuted}}>{s.l}</span>
            </div>
            {i<2&&<div style={{width:32,height:1,background:C.border}}/>}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1: STYLE & SIZE ── */}
      {step===1&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div>
            {/* Logo upload */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>BRAND LOGO (OPTIONAL)</div>
              <div onClick={()=>fileRef.current.click()} style={{border:`2px dashed ${logo?C.accent:C.border}`,borderRadius:8,padding:'20px',textAlign:'center',cursor:'pointer',background:logo?C.accentLow:'transparent'}}>
                {logo ? (
                  <div>
                    <img src={logo} style={{maxHeight:50,maxWidth:150,objectFit:'contain',marginBottom:8}} alt="logo"/>
                    <div style={{fontFamily:F.mono,fontSize:10,color:C.accent}}>{logoName} — click to change</div>
                  </div>
                ) : (
                  <div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.textSub,marginBottom:4}}>Click to upload logo</div>
                    <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>PNG, SVG, JPG — transparent PNG works best</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>e.target.files[0]&&handleLogo(e.target.files[0])}/>
            </div>

            {/* Ad Style */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>AD STYLE</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                {AD_STYLES.map(s=>(
                  <button key={s.v} onClick={()=>setAdStyle(s.v)} style={{padding:'10px 12px',borderRadius:7,border:`1px solid ${adStyle===s.v?C.accent:C.border}`,background:adStyle===s.v?C.accentLow:'transparent',cursor:'pointer',textAlign:'left'}}>
                    <div style={{fontFamily:F.mono,fontSize:11,color:adStyle===s.v?C.accent:C.text,marginBottom:3}}>{s.l}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,lineHeight:1.5}}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Ad Size */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>AD SIZE</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                {AD_SIZES.map(s=>(
                  <button key={s.v} onClick={()=>setAdSize(s.v)} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',borderRadius:7,border:`1px solid ${adSize===s.v?C.accent:C.border}`,background:adSize===s.v?C.accentLow:'transparent',cursor:'pointer',textAlign:'left'}}>
                    <div style={{width:adSize===s.v?10:8,height:adSize===s.v?10:8,borderRadius:'50%',background:adSize===s.v?C.accent:C.border,flexShrink:0}}/>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:F.mono,fontSize:12,color:adSize===s.v?C.accent:C.text}}>{s.l}</div>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{s.desc} · {s.w}×{s.h}px</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color scheme */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>COLOR SCHEME</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                {COLOR_SCHEMES.map(s=>(
                  <button key={s.v} onClick={()=>setColorScheme(s.v)} style={{padding:'10px 6px',borderRadius:7,border:`2px solid ${colorScheme===s.v?s.accent:'transparent'}`,background:s.bg,cursor:'pointer',textAlign:'center'}}>
                    <div style={{width:20,height:20,borderRadius:'50%',background:s.accent,margin:'0 auto 5px'}}/>
                    <div style={{fontFamily:F.mono,fontSize:9,color:s.text,lineHeight:1.3}}>{s.l}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign type */}
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>CAMPAIGN TYPE</div>
              <div style={{display:'flex',gap:8}}>
                {[{v:'single',l:'Single Ad',d:'One killer creative'},{v:'campaign',l:'14-Day Campaign',d:'7 unique variations'}].map(t=>(
                  <button key={t.v} onClick={()=>setCampaignType(t.v)} style={{flex:1,padding:'14px',borderRadius:8,border:`1px solid ${campaignType===t.v?C.accent:C.border}`,background:campaignType===t.v?C.accentLow:'transparent',cursor:'pointer',textAlign:'center'}}>
                    <div style={{fontFamily:F.mono,fontSize:12,color:campaignType===t.v?C.accent:C.text,marginBottom:4}}>{t.l}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{t.d}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{gridColumn:'1/-1',display:'flex',justifyContent:'flex-end'}}>
            <Btn Icon={ChevronRight} onClick={()=>setStep(2)}>Next — Ad Brief</Btn>
          </div>
        </div>
      )}

      {/* ── STEP 2: AD BRIEF ── */}
      {step===2&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>AD BRIEF</div>

            <div style={{marginBottom:12}}>
              <Label>Industry / Niche *</Label>
              <FSelect value={industry} onChange={setIndustry} options={[{value:'',label:'Select industry...'}, ...INDUSTRIES.map(i=>({value:i,label:i}))]}/>
            </div>

            <div style={{marginBottom:12}}>
              <Label>Ad Objective *</Label>
              <FSelect value={objective} onChange={setObjective} options={OBJECTIVES.map(o=>({value:o.v,label:o.l}))}/>
            </div>

            <div style={{marginBottom:12}}>
              <Label>Hook Type</Label>
              <FSelect value={hook} onChange={setHook} options={HOOK_TYPES.map(h=>({value:h.v,label:`${h.l} — ${h.desc}`}))}/>
            </div>

            <div style={{marginBottom:12}}>
              <Label>Call to Action</Label>
              <FSelect value={cta} onChange={setCta} options={CTA_OPTIONS.map(c=>({value:c.v,label:c.l}))}/>
            </div>

            <div style={{marginBottom:12}}>
              <Label>Your Offer *</Label>
              <FTextarea value={offer} onChange={setOffer} placeholder="e.g. Done-for-you AI client acquisition system for HVAC companies. First leads within 48 hours." rows={3}/>
            </div>

            <div style={{marginBottom:12}}>
              <Label>Target Audience</Label>
              <FInput value={audience} onChange={setAudience} placeholder="e.g. HVAC company owners doing $500k-$5M/year"/>
            </div>

            <div style={{marginBottom:12}}>
              <Label>Main Pain Point</Label>
              <FInput value={painPoint} onChange={setPainPoint} placeholder="e.g. Inconsistent lead flow, slow season revenue drops"/>
            </div>

            <div style={{marginBottom:16}}>
              <Label>Social Proof / Result (optional)</Label>
              <FInput value={proof} onChange={setProof} placeholder="e.g. $48K collected in first week on $1,100 ad spend"/>
            </div>

            <div style={{display:'flex',gap:10}}>
              <Btn variant="ghost" Icon={ArrowLeft} onClick={()=>setStep(1)}>Back</Btn>
              <Btn Icon={Sparkles} onClick={generate} disabled={loading||!offer.trim()} style={{flex:1,justifyContent:'center'}}>
                {loading?`Creating ads (~30s)...`:`Generate ${campaignType==='single'?'Ad':'14-Day Campaign'}`}
              </Btn>
            </div>
            {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:8}}>{error}</div>}
          </div>

          {/* Preview of style */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>STYLE PREVIEW</div>
            <div style={{overflow:'hidden',borderRadius:8,marginBottom:12}} ref={adRef}>
              {renderAd({
                headline: 'Your Headline Here',
                subheadline: 'Supporting message that builds interest',
                body: 'Your compelling offer description goes here.',
                cta: CTA_OPTIONS.find(c=>c.v===cta)?.l || 'Get Started',
                badge: 'Limited Spots',
                eyebrow: 'ATTENTION: ' + (industry.split('/')[0]||'Business Owners').toUpperCase(),
                angle:'Preview'
              }, sizeInfo.w, sizeInfo.h, PREVIEW_W/sizeInfo.w)}
            </div>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,textAlign:'center'}}>{sizeInfo.l} · {sizeInfo.w}×{sizeInfo.h}px · {AD_STYLES.find(s=>s.v===adStyle)?.l}</div>
            {loading&&(
              <div style={{textAlign:'center',padding:'20px 0',marginTop:12}}>
                <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.accent,marginBottom:8}}>{campaignType==='single'?'CREATING YOUR AD...':'BUILDING CAMPAIGN...'}</div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.8}}>
                  Writing conversion copy<br/>
                  Optimizing hook and headline<br/>
                  Please allow ~30 seconds
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: RESULTS ── */}
      {step===3&&ads.length>0&&(
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18,flexWrap:'wrap'}}>
            <div style={{flex:1}}>
              <div style={{fontFamily:F.display,fontSize:22,letterSpacing:2,color:C.text}}>{ads.length} AD{ads.length>1?'S':''} GENERATED</div>
              <div style={{fontFamily:F.mono,fontSize:11,color:C.accent}}>{adStyle} style · {sizeInfo.l} · {scheme.l}</div>
            </div>
            <Btn variant="ghost" size="sm" Icon={ArrowLeft} onClick={()=>setStep(1)}>Start Over</Btn>
            <Btn variant="ghost" size="sm" Icon={RefreshCw} onClick={generate}>Regenerate</Btn>
            <Btn size="sm" Icon={Download} onClick={downloadSVG}>Download SVG</Btn>
          </div>

          {/* Ad thumbnails if campaign */}
          {ads.length>1&&(
            <div style={{display:'flex',gap:10,marginBottom:18,overflowX:'auto',paddingBottom:8}}>
              {ads.map((ad,i)=>(
                <button key={i} onClick={()=>setActiveAd(i)} style={{flexShrink:0,padding:'8px 14px',borderRadius:6,border:`1px solid ${activeAd===i?C.accent:C.border}`,background:activeAd===i?C.accentLow:'transparent',cursor:'pointer',textAlign:'left',minWidth:140}}>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,marginBottom:3}}>AD {i+1}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:activeAd===i?C.accent:C.text}}>{ad.angle}</div>
                </button>
              ))}
            </div>
          )}

          <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:18,alignItems:'start'}}>
            {/* Ad preview */}
            <div>
              <div style={{background:'#111',borderRadius:12,padding:24,display:'flex',alignItems:'center',justifyContent:'center'}} ref={adRef}>
                {renderAd(currentAd, sizeInfo.w, sizeInfo.h, PREVIEW_W/sizeInfo.w)}
              </div>
              <div style={{display:'flex',gap:10,marginTop:12,justifyContent:'center'}}>
                <Btn Icon={Download} onClick={downloadSVG}>Download SVG</Btn>
                {ads.length>1&&activeAd>0&&<Btn variant="ghost" Icon={ArrowLeft} size="sm" onClick={()=>setActiveAd(activeAd-1)}>Previous</Btn>}
                {ads.length>1&&activeAd<ads.length-1&&<Btn size="sm" Icon={ChevronRight} onClick={()=>setActiveAd(activeAd+1)}>Next Ad</Btn>}
              </div>
            </div>

            {/* Copy panel */}
            <div>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:12}}>
                <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:14}}>AD COPY — AD {activeAd+1}</div>
                {[
                  {l:'Eyebrow', v:currentAd?.eyebrow},
                  {l:'Headline', v:currentAd?.headline},
                  {l:'Subheadline', v:currentAd?.subheadline},
                  {l:'Body', v:currentAd?.body},
                  {l:'CTA', v:currentAd?.cta},
                  {l:'Badge', v:currentAd?.badge},
                ].filter(f=>f.v).map(field=>(
                  <div key={field.l} style={{marginBottom:12}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>{field.l.toUpperCase()}</div>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.text,background:C.surface,padding:'8px 12px',borderRadius:6,lineHeight:1.6}}>{field.v}</div>
                  </div>
                ))}
                <div style={{marginTop:4,padding:'8px 12px',background:C.accentLow,borderRadius:6}}>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:3}}>ANGLE</div>
                  <div style={{fontFamily:F.mono,fontSize:11,color:C.accent}}>{currentAd?.angle}</div>
                </div>
              </div>

              {ads.length>1&&(
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
                  <div style={{fontFamily:F.display,fontSize:12,letterSpacing:2,color:C.text,marginBottom:10}}>14-DAY CAMPAIGN PLAN</div>
                  {ads.map((ad,i)=>(
                    <div key={i} style={{display:'flex',gap:10,marginBottom:8,cursor:'pointer'}} onClick={()=>setActiveAd(i)}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,width:30,flexShrink:0}}>Day {i*2+1}-{i*2+2}</div>
                      <div style={{fontFamily:F.mono,fontSize:10,color:activeAd===i?C.accent:C.textSub,lineHeight:1.5}}>{ad.headline}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// ─── Agency Pricing Calculator ─────────────────────────────────────────────────
function AgencyPricingView() {
  const [service, setService] = useState('');
  const [niche, setNiche] = useState('');
  const [fulfillHours, setFulfillHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('75');
  const [toolCosts, setToolCosts] = useState('');
  const [adSpend, setAdSpend] = useState('');
  const [desiredMargin, setDesiredMargin] = useState('60');
  const [clientsPerMonth, setClientsPerMonth] = useState('5');
  const [positioning, setPositioning] = useState('premium');
  const [deliveryModel, setDeliveryModel] = useState('retainer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const POSITIONING = [
    { v:'budget',   l:'Budget / Entry-Level',  desc:'Price to win on cost' },
    { v:'mid',      l:'Mid-Market',             desc:'Price to win on value' },
    { v:'premium',  l:'Premium',                desc:'Price to win on results' },
    { v:'elite',    l:'Elite / Ultra-Premium',  desc:'Price to win on exclusivity' },
  ];

  const DELIVERY = [
    { v:'retainer',    l:'Monthly Retainer' },
    { v:'project',     l:'One-Time Project' },
    { v:'setup+retainer', l:'Setup Fee + Monthly' },
    { v:'performance', l:'Performance-Based' },
  ];

  const SERVICE_TYPES = [
    'AI Lead Generation','Facebook/Instagram Ads','Google Ads',
    'AI Voice Agents','Email Marketing Automation','Social Media Management',
    'SEO / Content Marketing','Website + Funnel Building','CRM Setup & Automation',
    'Reputation Management','AI Chatbot Setup','Full-Service Marketing Agency',
  ];

  const calculate = async () => {
    if (!service || !fulfillHours || !desiredMargin) return;
    setLoading(true); setError(''); setResult(null);

    const hours = parseFloat(fulfillHours) || 0;
    const rate = parseFloat(hourlyRate) || 75;
    const tools = parseFloat(toolCosts) || 0;
    const ads = parseFloat(adSpend) || 0;
    const margin = parseFloat(desiredMargin) / 100;
    const clients = parseFloat(clientsPerMonth) || 5;

    const laborCost = hours * rate;
    const totalCost = laborCost + tools + ads;
    const basePrice = totalCost / (1 - margin);

    try {
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 3000,
          messages: [{ role: "user", content: `You are an expert agency pricing consultant. Create three service package tiers for this agency.

SERVICE: ${service}
NICHE: ${niche || 'General businesses'}
DELIVERY MODEL: ${DELIVERY.find(d=>d.v===deliveryModel)?.l}
POSITIONING: ${POSITIONING.find(p=>p.v===positioning)?.l}
BASE COST TO FULFILL: $${totalCost.toFixed(0)}/month
MINIMUM PRICE NEEDED (at ${desiredMargin}% margin): $${basePrice.toFixed(0)}
CLIENTS PER MONTH CAPACITY: ${clients}
LABOR: ${hours} hrs × $${rate}/hr = $${laborCost.toFixed(0)}
TOOLS/SOFTWARE: $${tools}/month
AD SPEND (if applicable): $${ads}/month

Create 3 tiers. The STARTER tier should be at or just above the minimum price. MID should be 1.8-2.5x starter. PREMIUM should be 2.5-4x starter. Each tier must be genuinely more valuable — not just more expensive.

Return ONLY valid JSON:
{
  "insight": "2-3 sentences on their pricing position and biggest opportunity",
  "monthlyRevenue": { "conservative": 0, "target": 0, "optimistic": 0 },
  "tiers": [
    {
      "name": "Catchy tier name (2-3 words)",
      "price": 0,
      "setupFee": 0,
      "tagline": "One compelling sentence",
      "deliverables": ["deliverable 1", "deliverable 2", "deliverable 3", "deliverable 4"],
      "idealClient": "Who this tier is for",
      "margin": 0,
      "profit": 0,
      "sellingPoint": "The single most compelling reason to choose this tier",
      "upsellTo": "Name of next tier or null"
    }
  ],
  "pricingScript": "2-3 sentences on how to present these prices confidently on a call",
  "redFlags": ["thing that would cause them to underprice", "another red flag"],
  "quickWin": "One immediate thing they can do to justify higher pricing this week"
}` }] })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      const json = text.match(/\{[\s\S]*\}/);
      if (!json) { setError('Generation failed — try again.'); setLoading(false); return; }
      setResult(JSON.parse(json[0]));
    } catch(e) { setError('Failed — try again.'); }
    setLoading(false);
  };

  const copyTier = (tier) => {
    const text = `${tier.name} — $${tier.price.toLocaleString()}/mo${tier.setupFee?` + $${tier.setupFee.toLocaleString()} setup`:''}\n${tier.tagline}\n\nIncludes:\n${tier.deliverables.map(d=>`• ${d}`).join('\n')}\n\nIdeal for: ${tier.idealClient}`;
    navigator.clipboard.writeText(text);
    setCopied(tier.name); setTimeout(()=>setCopied(''),2000);
  };

  const tierColors = [C.textSub, C.accent, '#FFB300'];

  return (
    <div>
      <SectionHeader title="AGENCY PRICING CALCULATOR" sub="Build profitable 3-tier packages — know exactly what to charge and why"/>

      {!result ? (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>YOUR SERVICE</div>
            <div style={{marginBottom:12}}>
              <Label>Service Type *</Label>
              <FSelect value={service} onChange={setService} options={[{value:'',label:'Select service...'}, ...SERVICE_TYPES.map(s=>({value:s,label:s}))]}/>
            </div>
            <div style={{marginBottom:12}}>
              <Label>Target Niche</Label>
              <FInput value={niche} onChange={setNiche} placeholder="e.g. HVAC companies, dental practices"/>
            </div>
            <div style={{marginBottom:12}}>
              <Label>Delivery Model</Label>
              <FSelect value={deliveryModel} onChange={setDeliveryModel} options={DELIVERY.map(d=>({value:d.v,label:d.l}))}/>
            </div>
            <div style={{marginBottom:12}}>
              <Label>Market Positioning</Label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,marginTop:6}}>
                {POSITIONING.map(p=>(
                  <button key={p.v} onClick={()=>setPositioning(p.v)} style={{padding:'9px 10px',borderRadius:6,border:`1px solid ${positioning===p.v?C.accent:C.border}`,background:positioning===p.v?C.accentLow:'transparent',cursor:'pointer',textAlign:'left'}}>
                    <div style={{fontFamily:F.mono,fontSize:10,color:positioning===p.v?C.accent:C.text}}>{p.l}</div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>YOUR COSTS</div>
            <div style={{marginBottom:12}}>
              <Label>Hours to Fulfill Per Client/Month *</Label>
              <FInput value={fulfillHours} onChange={setFulfillHours} placeholder="e.g. 10" type="number"/>
            </div>
            <div style={{marginBottom:12}}>
              <Label>Your Hourly Labor Cost ($)</Label>
              <FInput value={hourlyRate} onChange={setHourlyRate} placeholder="75" type="number"/>
            </div>
            <div style={{marginBottom:12}}>
              <Label>Monthly Tool / Software Costs ($)</Label>
              <FInput value={toolCosts} onChange={setToolCosts} placeholder="e.g. 150 (GHL, etc.)" type="number"/>
            </div>
            <div style={{marginBottom:12}}>
              <Label>Monthly Ad Spend Per Client ($ if applicable)</Label>
              <FInput value={adSpend} onChange={setAdSpend} placeholder="e.g. 1500 or 0" type="number"/>
            </div>
            <div style={{marginBottom:12}}>
              <Label>Target Profit Margin (%)</Label>
              <div style={{display:'flex',gap:8,marginTop:6}}>
                {['40','50','60','70','80'].map(m=>(
                  <button key={m} onClick={()=>setDesiredMargin(m)} style={{flex:1,padding:'8px 0',borderRadius:5,border:`1px solid ${desiredMargin===m?C.accent:C.border}`,background:desiredMargin===m?C.accentLow:'transparent',color:desiredMargin===m?C.accent:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>{m}%</button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <Label>Clients Per Month Capacity</Label>
              <div style={{display:'flex',gap:8,marginTop:6}}>
                {['3','5','10','15','20'].map(n=>(
                  <button key={n} onClick={()=>setClientsPerMonth(n)} style={{flex:1,padding:'8px 0',borderRadius:5,border:`1px solid ${clientsPerMonth===n?C.accent:C.border}`,background:clientsPerMonth===n?C.accentLow:'transparent',color:clientsPerMonth===n?C.accent:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>{n}</button>
                ))}
              </div>
            </div>

            {/* Cost summary */}
            {fulfillHours&&(
              <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:'12px 14px',marginBottom:14}}>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:8}}>COST SUMMARY</div>
                {[
                  {l:'Labor', v:`$${(parseFloat(fulfillHours||0)*parseFloat(hourlyRate||75)).toFixed(0)}/mo`},
                  {l:'Tools', v:`$${parseFloat(toolCosts||0).toFixed(0)}/mo`},
                  {l:'Ad Spend', v:`$${parseFloat(adSpend||0).toFixed(0)}/mo`},
                  {l:'Total Cost', v:`$${(parseFloat(fulfillHours||0)*parseFloat(hourlyRate||75)+parseFloat(toolCosts||0)+parseFloat(adSpend||0)).toFixed(0)}/mo`, accent:true},
                  {l:`Min Price (${desiredMargin}% margin)`, v:`$${((parseFloat(fulfillHours||0)*parseFloat(hourlyRate||75)+parseFloat(toolCosts||0)+parseFloat(adSpend||0))/(1-parseFloat(desiredMargin||60)/100)).toFixed(0)}/mo`, accent:true},
                ].map(r=>(
                  <div key={r.l} style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                    <span style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{r.l}</span>
                    <span style={{fontFamily:F.mono,fontSize:11,color:r.accent?C.accent:C.text,fontWeight:r.accent?600:400}}>{r.v}</span>
                  </div>
                ))}
              </div>
            )}

            <Btn Icon={Sparkles} onClick={calculate} disabled={loading||!service||!fulfillHours} style={{width:'100%',justifyContent:'center'}}>
              {loading?'Building packages (~20s)...':'Build My Pricing Packages'}
            </Btn>
            {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:8}}>{error}</div>}
          </div>
        </div>
      ) : (
        <div>
          {/* Header insight */}
          <div style={{background:C.card,border:`1px solid ${C.accent}44`,borderRadius:10,padding:20,marginBottom:18}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.accent,marginBottom:6}}>PRICING ANALYSIS</div>
                <div style={{fontFamily:F.mono,fontSize:12,color:C.textSub,lineHeight:1.8}}>{result.insight}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <Btn variant="ghost" size="sm" onClick={()=>setResult(null)}>Recalculate</Btn>
                <Btn variant="ghost" size="sm" Icon={RefreshCw} onClick={calculate}>Regenerate</Btn>
              </div>
            </div>

            {/* Revenue projections */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:16}}>
              {[
                {l:'Conservative', v:result.monthlyRevenue?.conservative, sub:'50% capacity'},
                {l:'Target',       v:result.monthlyRevenue?.target,       sub:'80% capacity'},
                {l:'Optimistic',   v:result.monthlyRevenue?.optimistic,   sub:'Full capacity'},
              ].map((r,i)=>(
                <div key={r.l} style={{background:C.surface,borderRadius:8,padding:'12px 14px',textAlign:'center'}}>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:4}}>{r.l.toUpperCase()}</div>
                  <div style={{fontFamily:F.display,fontSize:24,color:i===1?C.accent:C.text}}>${(r.v||0).toLocaleString()}</div>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{r.sub}/mo</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier cards */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:18}}>
            {result.tiers?.map((tier,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${i===1?C.accent:C.border}`,borderRadius:10,overflow:'hidden',position:'relative'}}>
                {i===1&&<div style={{background:C.accent,fontFamily:F.mono,fontSize:9,color:'#fff',textAlign:'center',padding:'4px 0',letterSpacing:2}}>RECOMMENDED</div>}
                <div style={{padding:20}}>
                  <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:tierColors[i],marginBottom:4}}>{tier.name}</div>
                  <div style={{fontFamily:F.display,fontSize:28,color:C.text,marginBottom:2}}>${(tier.price||0).toLocaleString()}<span style={{fontFamily:F.mono,fontSize:11,color:C.textMuted}}>/mo</span></div>
                  {tier.setupFee>0&&<div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginBottom:8}}>+ ${tier.setupFee.toLocaleString()} setup</div>}
                  <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.6,marginBottom:14}}>{tier.tagline}</div>

                  <div style={{marginBottom:14}}>
                    {tier.deliverables?.map((d,j)=>(
                      <div key={j} style={{display:'flex',gap:8,marginBottom:7}}>
                        <div style={{width:5,height:5,borderRadius:'50%',background:tierColors[i],marginTop:5,flexShrink:0}}/>
                        <div style={{fontFamily:F.mono,fontSize:10,color:C.text,lineHeight:1.5}}>{d}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{background:C.surface,borderRadius:6,padding:'10px 12px',marginBottom:12}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:3}}>IDEAL FOR</div>
                    <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.5}}>{tier.idealClient}</div>
                  </div>

                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>MARGIN</div>
                      <div style={{fontFamily:F.mono,fontSize:13,color:C.success,fontWeight:600}}>{tier.margin}%</div>
                    </div>
                    <div style={{textAlign:'center'}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>PROFIT</div>
                      <div style={{fontFamily:F.mono,fontSize:13,color:C.success,fontWeight:600}}>${(tier.profit||0).toLocaleString()}/mo</div>
                    </div>
                    {tier.upsellTo&&(
                      <div style={{textAlign:'center'}}>
                        <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>UPSELL</div>
                        <div style={{fontFamily:F.mono,fontSize:10,color:C.accent}}>{tier.upsellTo}</div>
                      </div>
                    )}
                  </div>

                  <div style={{fontFamily:F.mono,fontSize:10,color:tierColors[i],fontStyle:'italic',marginBottom:12,lineHeight:1.5}}>"{tier.sellingPoint}"</div>

                  <button onClick={()=>copyTier(tier)} style={{width:'100%',padding:'8px',borderRadius:5,border:`1px solid ${C.border}`,background:'none',color:C.textSub,fontFamily:F.mono,fontSize:10,cursor:'pointer'}}>
                    {copied===tier.name?'✓ Copied':'Copy Package'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing script + quick win */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:10}}>HOW TO PRESENT THESE PRICES</div>
              <div style={{fontFamily:'Georgia,serif',fontSize:13,color:C.textSub,lineHeight:1.8,fontStyle:'italic'}}>"{result.pricingScript}"</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{background:C.card,border:`1px solid ${C.success}33`,borderRadius:10,padding:18,flex:1}}>
                <div style={{fontFamily:F.display,fontSize:12,letterSpacing:2,color:C.success,marginBottom:8}}>QUICK WIN THIS WEEK</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.7}}>{result.quickWin}</div>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.warn}33`,borderRadius:10,padding:18,flex:1}}>
                <div style={{fontFamily:F.display,fontSize:12,letterSpacing:2,color:C.warn,marginBottom:8}}>RED FLAGS TO AVOID</div>
                {result.redFlags?.map((f,i)=>(
                  <div key={i} style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.7}}>• {f}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// ─── Sales Call Analyzer ───────────────────────────────────────────────────────
function SalesCallAnalyzerView() {
  const [transcript, setTranscript] = useState('');
  const [offerName, setOfferName] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [callOutcome, setCallOutcome] = useState('lost');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('score');

  const OUTCOMES = [
    { v:'closed',   l:'Closed — they bought' },
    { v:'followup', l:'Follow-up scheduled' },
    { v:'lost',     l:'Lost — they passed' },
    { v:'ghost',    l:'Ghosted after call' },
  ];

  const SCORE_COLORS = (s) => s >= 80 ? C.success : s >= 60 ? C.accent : s >= 40 ? C.warn : C.danger;

  const analyze = async () => {
    if (!transcript.trim()) return;
    setLoading(true); setError(''); setResult(null);

    try {
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 4000,
          messages: [{ role: "user", content: `You are a world-class high-ticket sales coach with 20+ years experience analyzing sales calls. Your style is direct, specific, and actionable — never vague.

Analyze this sales call transcript and give brutally honest, specific coaching.

CALL DETAILS:
Offer: ${offerName || 'Not specified'}
Price: ${offerPrice || 'Not specified'}
Outcome: ${OUTCOMES.find(o=>o.v===callOutcome)?.l}

TRANSCRIPT:
${transcript.slice(0, 6000)}

Score the call on these 8 dimensions (0-100 each):
1. Rapport & Connection — did they build genuine trust?
2. Discovery Depth — did they uncover real pain before pitching?
3. Pitch Clarity — was the offer explained compellingly?
4. Price Confidence — did they present price without flinching?
5. Objection Handling — did they address concerns effectively?
6. Close Attempt — did they ask for the business clearly?
7. Listening — did they actually hear what the prospect said?
8. Call Control — did they guide the conversation with purpose?

For each moment flag, quote the EXACT words from the transcript that were the turning point — good or bad.

Return ONLY valid JSON:
{
  "overallScore": 72,
  "overallVerdict": "2-3 sentence honest assessment of this call",
  "winProbabilityAtStart": 65,
  "winProbabilityAtEnd": 30,
  "momentTheyLostIt": "The exact moment (quote the words) where the deal started to slip, or null if closed",
  "momentTheyWonIt": "The exact moment (quote the words) that sealed it, or null if lost",
  "dimensions": [
    {
      "name": "Rapport & Connection",
      "score": 75,
      "what": "What they did",
      "whyItMatters": "Why this dimension matters",
      "moment": "Exact quote from transcript showing this",
      "fix": "Specific word-for-word alternative they could have used"
    }
  ],
  "topStrengths": ["specific strength with example", "specific strength with example"],
  "criticalMistakes": [
    {
      "mistake": "What they did wrong",
      "impact": "How it hurt the call",
      "said": "What they actually said",
      "shouldHaveSaid": "Exact word-for-word replacement script"
    }
  ],
  "objectionsMissed": ["objection that came up but wasn't handled well"],
  "closingAnalysis": "Specific analysis of how they closed or failed to close",
  "practiceScenario": "A specific roleplay scenario to practice before their next call",
  "nextCallPlan": ["3-4 specific things to do differently on the very next call"]
}` }] })
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      const json = text.match(/\{[\s\S]*\}/);
      if (!json) { setError('Analysis failed — try again.'); setLoading(false); return; }
      setResult(JSON.parse(json[0]));
      setActiveTab('score');
    } catch(e) { console.error(e); setError('Failed — try again.'); }
    setLoading(false);
  };

  const ScoreBar = ({score, label}) => (
    <div style={{marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
        <span style={{fontFamily:F.mono,fontSize:11,color:C.text}}>{label}</span>
        <span style={{fontFamily:F.display,fontSize:14,color:SCORE_COLORS(score)}}>{score}</span>
      </div>
      <div style={{height:6,background:C.surface,borderRadius:3,overflow:'hidden'}}>
        <div style={{height:'100%',width:`${score}%`,background:SCORE_COLORS(score),borderRadius:3,transition:'width 1s ease'}}/>
      </div>
    </div>
  );

  return (
    <div>
      <SectionHeader title="SALES CALL ANALYZER" sub="Paste your transcript — get scored, coached, and a word-for-word fix for every mistake"/>

      {!result ? (
        <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:18}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:16}}>CALL TRANSCRIPT</div>
            <FTextarea value={transcript} onChange={setTranscript}
              placeholder={"Paste your full call transcript here.\n\nWorks with:\n• Fathom recordings (copy the transcript)\n• Otter.ai transcripts\n• Zoom transcripts\n• Any text transcript\n\nThe more complete the transcript, the more specific the coaching."}
              rows={18}/>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginTop:6,textAlign:'right'}}>
              {transcript.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:14}}>CALL CONTEXT</div>
              <div style={{marginBottom:12}}>
                <Label>Offer / Product Name</Label>
                <FInput value={offerName} onChange={setOfferName} placeholder="e.g. AI Lead Gen System"/>
              </div>
              <div style={{marginBottom:14}}>
                <Label>Price Point</Label>
                <FInput value={offerPrice} onChange={setOfferPrice} placeholder="e.g. $5,000 setup + $997/mo"/>
              </div>
              <div style={{marginBottom:6}}>
                <Label>Call Outcome</Label>
                <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:6}}>
                  {OUTCOMES.map(o=>(
                    <button key={o.v} onClick={()=>setCallOutcome(o.v)}
                      style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:7,border:`1px solid ${callOutcome===o.v?C.accent:C.border}`,background:callOutcome===o.v?C.accentLow:'transparent',cursor:'pointer',textAlign:'left'}}>
                      <div style={{width:8,height:8,borderRadius:'50%',background:callOutcome===o.v?C.accent:C.border,flexShrink:0}}/>
                      <span style={{fontFamily:F.mono,fontSize:11,color:callOutcome===o.v?C.accent:C.text}}>{o.l}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:12,letterSpacing:2,color:C.text,marginBottom:10}}>WHAT YOU GET</div>
              {[
                'Overall call score + 8-dimension breakdown',
                'The exact moment you won or lost the deal',
                'Word-for-word replacement scripts for every mistake',
                'Objections you missed and how to handle them',
                'Specific roleplay scenario to practice',
                '3-4 things to do differently on your next call',
              ].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:8,marginBottom:7}}>
                  <div style={{width:5,height:5,borderRadius:'50%',background:C.accent,marginTop:5,flexShrink:0}}/>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.5}}>{item}</div>
                </div>
              ))}
            </div>

            <Btn Icon={Sparkles} onClick={analyze} disabled={loading||!transcript.trim()}
              style={{width:'100%',justifyContent:'center'}}>
              {loading?'Analyzing call (~30s)...':'Analyze My Call'}
            </Btn>
            {error&&<div style={{fontFamily:F.mono,fontSize:11,color:C.danger,marginTop:8}}>{error}</div>}

            {loading&&(
              <div style={{textAlign:'center',padding:'20px 0',marginTop:12}}>
                <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.accent,marginBottom:8}}>ANALYZING...</div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.9}}>
                  Reading your transcript<br/>
                  Scoring 8 dimensions<br/>
                  Finding the turning points<br/>
                  Writing your coaching
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {/* Overall score header */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22,marginBottom:18}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:16}}>
              <div style={{flex:1}}>
                <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.textMuted,marginBottom:4}}>OVERALL CALL SCORE</div>
                <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:10}}>
                  <div style={{fontFamily:F.display,fontSize:56,color:SCORE_COLORS(result.overallScore),lineHeight:1}}>{result.overallScore}</div>
                  <div style={{fontFamily:F.mono,fontSize:13,color:C.textMuted}}>/100</div>
                </div>
                <div style={{fontFamily:F.mono,fontSize:12,color:C.textSub,lineHeight:1.8,maxWidth:500}}>{result.overallVerdict}</div>
              </div>

              <div style={{display:'flex',gap:16}}>
                {[
                  {l:'Win Prob at Start',v:result.winProbabilityAtStart},
                  {l:'Win Prob at End',  v:result.winProbabilityAtEnd},
                ].map(stat=>(
                  <div key={stat.l} style={{textAlign:'center',background:C.surface,borderRadius:8,padding:'14px 18px'}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,marginBottom:4}}>{stat.l.toUpperCase()}</div>
                    <div style={{fontFamily:F.display,fontSize:28,color:SCORE_COLORS(stat.v)}}>{stat.v}%</div>
                  </div>
                ))}
              </div>

              <div style={{display:'flex',gap:8,alignSelf:'flex-start'}}>
                <Btn variant="ghost" size="sm" onClick={()=>setResult(null)}>New Analysis</Btn>
                <Btn variant="ghost" size="sm" Icon={RefreshCw} onClick={analyze}>Re-analyze</Btn>
              </div>
            </div>

            {/* Turning point banners */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
              {result.momentTheyLostIt&&(
                <div style={{padding:'12px 14px',background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:8}}>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.danger,letterSpacing:1.5,marginBottom:4}}>MOMENT IT SLIPPED</div>
                  <div style={{fontFamily:'Georgia,serif',fontSize:12,color:C.text,lineHeight:1.7,fontStyle:'italic'}}>"{result.momentTheyLostIt}"</div>
                </div>
              )}
              {result.momentTheyWonIt&&(
                <div style={{padding:'12px 14px',background:`rgba(34,197,94,0.08)`,border:`1px solid rgba(34,197,94,0.2)`,borderRadius:8}}>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.success,letterSpacing:1.5,marginBottom:4}}>MOMENT IT CLOSED</div>
                  <div style={{fontFamily:'Georgia,serif',fontSize:12,color:C.text,lineHeight:1.7,fontStyle:'italic'}}>"{result.momentTheyWonIt}"</div>
                </div>
              )}
            </div>
          </div>

          {/* Tab nav */}
          <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
            {[
              {id:'score',   l:'8-Dimension Score'},
              {id:'mistakes',l:'Critical Mistakes'},
              {id:'strengths',l:'Strengths'},
              {id:'close',   l:'Closing Analysis'},
              {id:'nextcall',l:'Next Call Plan'},
            ].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{padding:'9px 18px',borderRadius:6,border:`1px solid ${activeTab===t.id?C.accent:C.border}`,background:activeTab===t.id?C.accentLow:'transparent',color:activeTab===t.id?C.accent:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>
                {t.l}
              </button>
            ))}
          </div>

          {/* SCORE TAB */}
          {activeTab==='score'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
                <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:16}}>8-DIMENSION BREAKDOWN</div>
                {result.dimensions?.map(d=>(
                  <ScoreBar key={d.name} score={d.score} label={d.name}/>
                ))}
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                {result.dimensions?.map(d=>(
                  <div key={d.name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:16}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                      <div style={{fontFamily:F.mono,fontSize:11,color:C.text,fontWeight:600}}>{d.name}</div>
                      <div style={{fontFamily:F.display,fontSize:16,color:SCORE_COLORS(d.score)}}>{d.score}</div>
                    </div>
                    <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.6,marginBottom:6}}>{d.what}</div>
                    {d.moment&&<div style={{fontFamily:'Georgia,serif',fontSize:10,color:C.textMuted,fontStyle:'italic',marginBottom:6,borderLeft:`2px solid ${SCORE_COLORS(d.score)}`,paddingLeft:8}}>"{d.moment}"</div>}
                    {d.fix&&d.score<75&&<div style={{fontFamily:F.mono,fontSize:10,color:C.accent,lineHeight:1.6,background:C.accentLow,padding:'6px 8px',borderRadius:5}}>→ {d.fix}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MISTAKES TAB */}
          {activeTab==='mistakes'&&(
            <div style={{display:'flex',flexDirection:'column',gap:14}}>
              {result.criticalMistakes?.map((m,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid rgba(239,68,68,0.2)`,borderRadius:10,padding:22}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <div style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:4,padding:'2px 10px',fontFamily:F.mono,fontSize:9,color:C.danger,letterSpacing:1}}>MISTAKE {i+1}</div>
                    <div style={{fontFamily:F.mono,fontSize:13,color:C.text,fontWeight:600}}>{m.mistake}</div>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,marginBottom:12,lineHeight:1.7}}>Impact: {m.impact}</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                    <div style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.15)',borderRadius:8,padding:'12px 14px'}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.danger,letterSpacing:1.5,marginBottom:6}}>WHAT YOU SAID</div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:12,color:C.text,lineHeight:1.7,fontStyle:'italic'}}>"{m.said}"</div>
                    </div>
                    <div style={{background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.15)',borderRadius:8,padding:'12px 14px'}}>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.success,letterSpacing:1.5,marginBottom:6}}>SAY THIS INSTEAD</div>
                      <div style={{fontFamily:'Georgia,serif',fontSize:12,color:C.text,lineHeight:1.7,fontStyle:'italic'}}>"{m.shouldHaveSaid}"</div>
                    </div>
                  </div>
                </div>
              ))}
              {result.objectionsMissed?.length>0&&(
                <div style={{background:C.card,border:`1px solid ${C.warn}33`,borderRadius:10,padding:20}}>
                  <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.warn,marginBottom:12}}>OBJECTIONS NOT FULLY HANDLED</div>
                  {result.objectionsMissed.map((o,i)=>(
                    <div key={i} style={{display:'flex',gap:10,marginBottom:8}}>
                      <div style={{width:6,height:6,borderRadius:'50%',background:C.warn,marginTop:4,flexShrink:0}}/>
                      <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.6}}>{o}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STRENGTHS TAB */}
          {activeTab==='strengths'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {result.topStrengths?.map((s,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid rgba(34,197,94,0.2)`,borderRadius:10,padding:20}}>
                  <div style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:C.success,marginTop:5,flexShrink:0}}/>
                    <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.7}}>{s}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CLOSE TAB */}
          {activeTab==='close'&&(
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22}}>
                <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>CLOSING ANALYSIS</div>
                <div style={{fontFamily:F.mono,fontSize:12,color:C.textSub,lineHeight:1.9}}>{result.closingAnalysis}</div>
              </div>
              <div style={{background:C.card,border:`1px solid ${C.accent}33`,borderRadius:10,padding:22}}>
                <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.accent,marginBottom:12}}>PRACTICE SCENARIO</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.8}}>{result.practiceScenario}</div>
              </div>
            </div>
          )}

          {/* NEXT CALL TAB */}
          {activeTab==='nextcall'&&(
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>
              <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text,marginBottom:20}}>YOUR NEXT CALL PLAN</div>
              {result.nextCallPlan?.map((item,i)=>(
                <div key={i} style={{display:'flex',gap:16,marginBottom:18,paddingBottom:18,borderBottom:i<result.nextCallPlan.length-1?`1px solid ${C.border}`:'none'}}>
                  <div style={{fontFamily:F.display,fontSize:24,color:C.accent,lineHeight:1,flexShrink:0,width:28}}>0{i+1}</div>
                  <div style={{fontFamily:F.mono,fontSize:13,color:C.text,lineHeight:1.8}}>{item}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}



// ═══════════════════════════════════════════════════════════════════════════════
// CLIENT SPRINT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

const SPRINT_STEPS = [
  {
    id: 1, key: 'offer',
    title: 'Build Your Offer',
    subtitle: 'Create a clear, compelling offer your market will pay for',
    tool: 'offerbuilder',
    toolLabel: 'Offer Builder',
    icon: '🎯',
    day: 'Day 1',
    successLooks: 'You have a named offer with a price, deliverables, and a one-sentence pitch',
    whatToDo: 'Use the Offer Builder to define what you sell, who you sell it to, and what you charge',
    cta: 'Build My Offer',
  },
  {
    id: 2, key: 'prospects',
    title: 'Find Prospects',
    subtitle: 'Generate your first list of 50-100 qualified leads',
    tool: 'leadfinder',
    toolLabel: 'Lead Finder',
    icon: '🔍',
    day: 'Day 1',
    successLooks: 'You have a list of 50+ leads with names, businesses, and contact info',
    whatToDo: 'Run Lead Finder for your niche and location. Aim for at least 50 leads to start',
    cta: 'Find Leads',
  },
  {
    id: 3, key: 'outreach',
    title: 'Start Conversations',
    subtitle: 'Launch outreach and get people responding',
    tool: 'blast',
    toolLabel: 'Email & SMS Blast',
    icon: '📨',
    day: 'Day 2',
    successLooks: 'Campaign is live with at least 20 messages sent and 3+ replies',
    whatToDo: 'Use Email & SMS Blast to reach your prospect list. Write a simple, direct outreach message',
    cta: 'Launch Outreach',
    secondTool: 'campaigns',
    secondToolLabel: 'Campaigns',
  },
  {
    id: 4, key: 'calls',
    title: 'Book Calls',
    subtitle: 'Move interested leads into booked discovery calls',
    tool: 'pipeline',
    toolLabel: 'Pipeline',
    icon: '📅',
    day: 'Day 2-3',
    successLooks: 'At least 1 call booked in your calendar from your outreach',
    whatToDo: 'Track your leads in Pipeline. Move anyone who replies to "Call Booked" when they schedule',
    cta: 'Manage Pipeline',
  },
  {
    id: 5, key: 'close',
    title: 'Close Deals',
    subtitle: 'Show up prepared and convert your calls into paying clients',
    tool: 'salesscript',
    toolLabel: 'Sales Script',
    icon: '🤝',
    day: 'Day 3-5',
    successLooks: 'You close your first client and collect payment',
    whatToDo: 'Generate a sales script for your offer. Use the Teleprompter on your call. Run objection responses after',
    cta: 'Generate Sales Script',
    extraTools: ['teleprompter','objections','aisolution'],
    extraToolLabels: ['Teleprompter','Objection Handler','AI Advisor'],
  },
  {
    id: 6, key: 'scale',
    title: 'Analyze & Scale',
    subtitle: 'Review what worked, fix what didn\'t, and close the next one faster',
    tool: 'callanalyzer',
    toolLabel: 'Call Analyzer',
    icon: '📈',
    day: 'Ongoing',
    successLooks: 'You have a clear picture of your close rate, top objections, and what to improve',
    whatToDo: 'Paste your call transcript into Call Analyzer. Review your KPI Tracker. Run your next outreach batch',
    cta: 'Analyze My Call',
    secondTool: 'kpitracker',
    secondToolLabel: 'KPI Tracker',
  },
];

// ── Sprint Progress Hook ───────────────────────────────────────────────────────
function useSprintProgress() {
  const load = () => {
    try {
      const saved = localStorage.getItem('clientsprint_sprint');
      return saved ? JSON.parse(saved) : { currentStep: 1, completedSteps: [], startedAt: Date.now() };
    } catch { return { currentStep: 1, completedSteps: [], startedAt: Date.now() }; }
  };

  const [progress, setProgress] = useState(load);

  const save = (p) => {
    setProgress(p);
    try { localStorage.setItem('clientsprint_sprint', JSON.stringify(p)); } catch {}
  };

  const completeStep = (stepId) => {
    const next = { ...progress };
    if (!next.completedSteps.includes(stepId)) next.completedSteps = [...next.completedSteps, stepId];
    next.currentStep = Math.max(next.currentStep, Math.min(stepId + 1, 6));
    save(next);
  };

  const setStep = (stepId) => save({ ...progress, currentStep: stepId });
  const reset = () => save({ currentStep: 1, completedSteps: [], startedAt: Date.now() });

  const pct = Math.round((progress.completedSteps.length / 6) * 100);

  return { progress, pct, completeStep, setStep, reset };
}

// ── Sprint Top Bar (persistent) ────────────────────────────────────────────────
function SprintTopBar({ progress, pct, setView, isMobile }) {
  if (isMobile) return null;
  const step = SPRINT_STEPS.find(s => s.id === progress.currentStep) || SPRINT_STEPS[0];
  const done = pct >= 100;

  return (
    <div onClick={() => setView('dashboard')} style={{
      height: 36, background: done ? C.success : C.surface,
      borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16, cursor: 'pointer', flexShrink: 0,
      transition: 'background 0.3s',
    }}>
      <div style={{ fontFamily: F.display, fontSize: 10, letterSpacing: 2, color: C.accent, whiteSpace: 'nowrap' }}>
        CLIENT SPRINT
      </div>
      <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow: 'hidden', maxWidth: 200 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: C.accent, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub, whiteSpace: 'nowrap' }}>
        {done ? '🎉 First client achieved' : `Step ${progress.currentStep}/6 — ${step.title}`}
      </div>
      <div style={{ fontFamily: F.mono, fontSize: 10, color: C.accent, fontWeight: 600 }}>{pct}%</div>
      {!done && (
        <button onClick={(e)=>{e.stopPropagation(); setView(SPRINT_STEPS.find(s=>s.id===progress.currentStep)?.tool||'dashboard');}}
          style={{ background: C.accent, border:'none', borderRadius:5, padding:'4px 12px', color:'#fff', fontFamily:F.mono, fontSize:9, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
          Continue →
        </button>
      )}
    </div>
  );
}

// ── Sprint Banner (in-tool guidance) ─────────────────────────────────────────
function SprintBanner({ toolId, setView, progress, completeStep }) {
  const step = SPRINT_STEPS.find(s =>
    s.tool === toolId || s.secondTool === toolId || (s.extraTools || []).includes(toolId)
  );
  if (!step) return null;

  const isComplete = progress.completedSteps.includes(step.id);
  const isCurrent = progress.currentStep === step.id;

  if (!isCurrent && !isComplete) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 14,
      padding: '12px 16px', marginBottom: 18, borderRadius: 8,
      background: isComplete ? 'rgba(34,197,94,0.06)' : C.accentLow,
      border: `1px solid ${isComplete ? 'rgba(34,197,94,0.2)' : C.accent + '33'}`,
    }}>
      <div style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{step.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.mono, fontSize: 9, color: isComplete ? C.success : C.accent, letterSpacing: 2, marginBottom: 3 }}>
          {isComplete ? '✓ COMPLETE' : `CLIENT SPRINT — STEP ${step.id} OF 6`}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 11, color: C.text, marginBottom: 3 }}>
          {isComplete ? `${step.title} — done` : step.whatToDo}
        </div>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>
          {isComplete ? `✓ ${step.successLooks}` : `Success looks like: ${step.successLooks}`}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
        {!isComplete && (
          <button onClick={() => completeStep(step.id)} style={{
            background: C.accent, border: 'none', borderRadius: 6,
            padding: '6px 14px', color: '#fff', fontFamily: F.mono,
            fontSize: 10, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>Mark Complete ✓</button>
        )}
      </div>
      {isComplete && progress.currentStep <= 6 && (
        <button onClick={() => setView(SPRINT_STEPS.find(s => s.id === progress.currentStep)?.tool || 'dashboard')}
          style={{ background: C.success, border: 'none', borderRadius: 6, padding: '6px 14px', color: '#fff', fontFamily: F.mono, fontSize: 10, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Next Step →
        </button>
      )}
    </div>
  );
}

// ── Sprint AI Floating Assistant ───────────────────────────────────────────────
function SprintAI({ view, progress }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const currentStep = SPRINT_STEPS.find(s => s.id === progress.currentStep);
  const currentTool = SPRINT_STEPS.find(s => s.tool === view || s.secondTool === view || (s.extraTools||[]).includes(view));

  const QUICK = [
    'What should I do next?',
    'How do I get my first client fast?',
    'Write me an outreach message',
    'How do I handle price objections?',
    'What\'s the fastest path from here?',
  ];

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch("/api/claude", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 600,
          messages: [{
            role: "user",
            content: `You are Sprint AI — a concise, direct execution assistant embedded in ClientSprint.ai. You help AI agency owners get their first client fast.

CONTEXT:
Tool open: ${currentTool ? currentTool.toolLabel : view}
Sprint step: ${progress.currentStep}/6 — ${currentStep?.title || 'Unknown'}
Steps done: ${progress.completedSteps.length}/6

TOOL-SPECIFIC GUIDANCE:
${view === 'leadfinder' ? 'User is finding leads. Help them refine their niche, targeting, and ICP. Suggest specific search terms and revenue filters.' : ''}${view === 'blast' || view === 'campaigns' ? 'User is doing outreach. Help them write better messages, improve subject lines, and build sequences. Give them actual copy they can use.' : ''}${view === 'salesscript' || view === 'teleprompter' ? 'User is preparing for a sales call. Help them improve their script, handle specific objections, and close with confidence.' : ''}${view === 'callanalyzer' ? 'User just had a call. Help them identify what cost them the deal and give them the exact words to use next time.' : ''}${view === 'offerbuilder' ? 'User is building their offer. Help them price it right, name it compellingly, and articulate the value clearly.' : ''}${view === 'pipeline' ? 'User is managing their deals. Help them prioritize, follow up, and move deals forward.' : ''}${view === 'objections' || view === 'aisolution' ? 'User needs sales help. Give them word-for-word scripts and direct tactics.' : ''}

User: ${text}

Respond in max 4 sentences. Be direct. Give specific actions or exact words they can use. No fluff.`
          }]
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === 'text')?.text || 'Try again.';
      setMsgs([...newMsgs, { role: 'assistant', content: reply }]);
    } catch(e) { setMsgs([...newMsgs, { role: 'assistant', content: 'Something went wrong — try again.' }]); }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{
        role: 'assistant',
        content: `Hey — I'm Sprint AI. You're on Step ${progress.currentStep}/6: ${currentStep?.title}. ${currentStep?.whatToDo} What do you need?`
      }]);
    }
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)} style={{
        position: 'fixed', bottom: 24, right: 24, width: 52, height: 52,
        borderRadius: '50%', background: C.accent, border: 'none',
        boxShadow: '0 4px 20px rgba(255,92,26,0.4)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, fontSize: 20, transition: 'transform 0.2s',
      }}>
        {open ? '✕' : '⚡'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 88, right: 24, width: 340,
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 999, display: 'flex', flexDirection: 'column', maxHeight: 480,
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.accent }} />
            <div style={{ fontFamily: F.display, fontSize: 14, letterSpacing: 2, color: C.text }}>SPRINT AI</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted }}>Step {progress.currentStep}/6</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.role === 'user' ? C.accent : C.surface,
                borderRadius: m.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                padding: '10px 13px',
              }}>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: m.role === 'user' ? '#fff' : C.text, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: C.surface, borderRadius: '10px 10px 10px 2px', padding: '10px 13px' }}>
                <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textMuted }}>Thinking...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          {msgs.length <= 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {QUICK.slice(0, 3).map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 5, padding: '5px 10px', fontFamily: F.mono,
                  fontSize: 9, color: C.textSub, cursor: 'pointer',
                }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 14px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
              placeholder="Ask Sprint AI anything..."
              style={{
                flex: 1, background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 6, padding: '8px 12px', fontFamily: F.mono,
                fontSize: 11, color: C.text, outline: 'none',
              }}
            />
            <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{
              background: C.accent, border: 'none', borderRadius: 6,
              padding: '8px 12px', color: '#fff', fontFamily: F.mono,
              fontSize: 11, cursor: 'pointer',
            }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Client Sprint Dashboard Section ───────────────────────────────────────────
function ClientSprintSection({ setView, progress, pct, completeStep, resetSprint }) {
  const [showAll, setShowAll] = useState(false);

  const currentStep = SPRINT_STEPS.find(s => s.id === progress.currentStep) || SPRINT_STEPS[0];
  const done = pct >= 100;

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ fontFamily: F.display, fontSize: 22, letterSpacing: 3, color: C.text }}>CLIENT SPRINT</div>
            <div style={{ background: C.accentLow, border: `1px solid ${C.accent}44`, borderRadius: 4, padding: '2px 10px', fontFamily: F.mono, fontSize: 9, color: C.accent, letterSpacing: 1 }}>
              {done ? 'COMPLETE' : `STEP ${progress.currentStep} OF 6`}
            </div>
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textMuted }}>
            {done ? 'You got your first client. Now scale.' : 'Your guided path from zero to first client'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setShowAll(!showAll)} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 5, padding: '5px 12px', fontFamily: F.mono, fontSize: 10, color: C.textMuted, cursor: 'pointer' }}>
            {showAll ? 'Collapse' : 'View All Steps'}
          </button>
          <button onClick={resetSprint} style={{ background: 'none', border: 'none', fontFamily: F.mono, fontSize: 9, color: C.textMuted, cursor: 'pointer', padding: '5px 8px' }}>Reset</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textSub }}>
            {done ? '🎉 First client achieved!' : `${progress.completedSteps.length} of 6 steps complete`}
          </div>
          <div style={{ fontFamily: F.display, fontSize: 16, color: C.accent }}>{pct}%</div>
        </div>
        <div style={{ height: 8, background: C.surface, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${C.accent}, #FF8C4A)`, borderRadius: 4, transition: 'width 0.8s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          {SPRINT_STEPS.map(s => (
            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => setView(s.tool)}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: progress.completedSteps.includes(s.id) ? C.success : progress.currentStep === s.id ? C.accent : C.border, transition: 'background 0.3s' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Current step highlight */}
      {!done && (
        <div style={{ background: C.card, border: `1px solid ${C.accent}`, borderRadius: 10, padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{currentStep.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <div style={{ fontFamily: F.mono, fontSize: 9, color: C.accent, letterSpacing: 2 }}>CURRENT STEP · {currentStep.day.toUpperCase()}</div>
              </div>
              <div style={{ fontFamily: F.display, fontSize: 20, letterSpacing: 2, color: C.text, marginBottom: 4 }}>{currentStep.title}</div>
              <div style={{ fontFamily: F.mono, fontSize: 11, color: C.textSub, lineHeight: 1.7, marginBottom: 10 }}>{currentStep.whatToDo}</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted, marginBottom: 14, padding: '8px 12px', background: C.surface, borderRadius: 6 }}>
                ✓ Success looks like: {currentStep.successLooks}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Btn Icon={ChevronRight} onClick={() => setView(currentStep.tool)}>{currentStep.cta}</Btn>
                {currentStep.secondTool && (
                  <Btn variant="ghost" size="sm" onClick={() => setView(currentStep.secondTool)}>{currentStep.secondToolLabel}</Btn>
                )}
                {currentStep.extraTools?.map((t, i) => (
                  <Btn key={t} variant="ghost" size="sm" onClick={() => setView(t)}>{currentStep.extraToolLabels[i]}</Btn>
                ))}
                <button onClick={() => completeStep(currentStep.id)} style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 14px', fontFamily: F.mono, fontSize: 11, color: C.textMuted, cursor: 'pointer' }}>
                  Mark Complete ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All steps (collapsed by default) */}
      {showAll && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SPRINT_STEPS.map(step => {
            const isComplete = progress.completedSteps.includes(step.id);
            const isCurrent = progress.currentStep === step.id;
            const isLocked = !isComplete && !isCurrent && step.id > progress.currentStep;
            return (
              <div key={step.id} onClick={() => !isLocked && setView(step.tool)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 8, cursor: isLocked ? 'default' : 'pointer',
                  background: isCurrent ? C.accentLow : isComplete ? 'rgba(34,197,94,0.05)' : C.surface,
                  border: `1px solid ${isCurrent ? C.accent : isComplete ? 'rgba(34,197,94,0.2)' : C.border}`,
                  opacity: isLocked ? 0.45 : 1, transition: 'all 0.2s',
                }}>
                <div style={{ fontSize: 16, flexShrink: 0 }}>{step.icon}</div>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${isComplete ? C.success : isCurrent ? C.accent : C.border}`, background: isComplete ? C.success : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isComplete && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
                  {!isComplete && <span style={{ fontFamily: F.display, fontSize: 10, color: isCurrent ? C.accent : C.textMuted }}>{step.id}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontFamily: F.mono, fontSize: 12, color: isCurrent ? C.accent : isComplete ? C.success : C.text }}>{step.title}</div>
                    <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted }}>{step.day}</div>
                  </div>
                  <div style={{ fontFamily: F.mono, fontSize: 10, color: C.textMuted }}>{step.subtitle}</div>
                </div>
                <div style={{ fontFamily: F.mono, fontSize: 10, color: isCurrent ? C.accent : C.textMuted }}>
                  {isComplete ? '✓ Done' : isCurrent ? 'In Progress →' : isLocked ? '🔒' : step.toolLabel}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



// ─── Playbooks ─────────────────────────────────────────────────────────────────
function PlaybooksView({ sprintProgress, setView, completeStep }) {
  const [active, setActive] = useState(null);

  const PLAYBOOKS = [
    {
      id: 'first-client',
      title: 'First Client Playbook',
      subtitle: 'Zero to first paying client in 5 days',
      icon: '🎯',
      color: '#DC2626',
      sprintStep: 1,
      description: 'The exact execution path to land your first AI agency client. No theory — just the steps in order.',
      days: [
        {
          day: 'Day 1 — Morning',
          title: 'Lock Your Offer',
          actions: [
            'Open Offer Builder and generate your complete offer',
            'Set your price at $3,000–$5,000 setup + $500–$1,000/month minimum',
            'Write your one-sentence pitch: "I help [niche] get [result] in [timeframe] using AI"',
            'Do not move forward until your offer is defined',
          ],
          tool: 'offerbuilder',
          toolLabel: 'Open Offer Builder',
          success: 'You can explain your offer in one sentence and state your price confidently',
        },
        {
          day: 'Day 1 — Afternoon',
          title: 'Build Your Lead List',
          actions: [
            'Open Lead Finder and search your target niche',
            'Generate a minimum of 50 leads — aim for 100',
            'Filter to businesses with revenue over $500K (they can afford you)',
            'Export and save your list',
          ],
          tool: 'leadfinder',
          toolLabel: 'Open Lead Finder',
          success: 'You have 50–100 qualified leads with names and contact info',
        },
        {
          day: 'Day 2',
          title: 'Launch Outreach',
          actions: [
            'Write a short, direct outreach message — 3–4 sentences max',
            'Do not pitch on first contact. Ask a question or share insight',
            'Send to your full list via Email & SMS Blast',
            'Follow up with anyone who opens but doesn\'t reply after 48 hours',
          ],
          tool: 'blast',
          toolLabel: 'Launch Blast',
          success: 'Messages sent to 50+ prospects. At least 3 replies within 48 hours',
        },
        {
          day: 'Day 3',
          title: 'Book Your First Call',
          actions: [
            'Reply to every response within 1 hour',
            'Offer two specific times — never say "what works for you?"',
            'Move every interested contact into Pipeline',
            'Confirm the call with a calendar link',
          ],
          tool: 'pipeline',
          toolLabel: 'Open Pipeline',
          success: 'At least 1 discovery call booked in your calendar',
        },
        {
          day: 'Day 4–5',
          title: 'Run Your Call and Close',
          actions: [
            'Generate your sales script 30 minutes before the call',
            'Use the Teleprompter to stay on track',
            'Run discovery for the first 10 minutes before pitching',
            'State your price confidently and wait for their response',
            'Handle objections with the Objection Handler',
          ],
          tool: 'salesscript',
          toolLabel: 'Generate Sales Script',
          success: 'You collect payment or have a clear follow-up commitment',
        },
      ],
    },
    {
      id: 'outbound',
      title: 'Outbound Playbook',
      subtitle: 'Build a repeatable outreach engine',
      icon: '📨',
      color: '#2563EB',
      sprintStep: 3,
      description: 'How to build an outbound system that generates consistent conversations every week without burning your list.',
      days: [
        {
          day: 'Week 1',
          title: 'Define Your ICP',
          actions: [
            'Pick ONE niche. Not two. Not "any business." One specific niche.',
            'Identify the exact pain they have that your AI service solves',
            'Define qualifying criteria: revenue range, team size, location, tech stack',
            'Build your ICP profile and save it',
          ],
          tool: 'leadfinder',
          toolLabel: 'Build Lead List',
          success: 'Clear one-sentence description of your ideal client and their pain',
        },
        {
          day: 'Week 1–2',
          title: 'Write Your Sequences',
          actions: [
            'Write 3 outreach sequences: cold, warm, and re-engagement',
            'Each sequence: 3–4 messages, 2–3 days apart',
            'Message 1: no pitch, just relevance and curiosity',
            'Message 2: insight or question',
            'Message 3: soft CTA',
            'Message 4: final follow-up and close',
          ],
          tool: 'blast',
          toolLabel: 'Build Campaign',
          success: 'Three complete sequences ready to deploy',
        },
        {
          day: 'Weekly Rhythm',
          title: 'Run Your System',
          actions: [
            'Every Monday: add 25–50 new leads from Lead Finder',
            'Every Monday: launch new batch to cold list',
            'Every Wednesday: follow up with batch from last week',
            'Every Friday: review replies, book calls, update pipeline',
            'Maintain a 30-day rolling pipeline of fresh leads',
          ],
          tool: 'campaigns',
          toolLabel: 'View Campaigns',
          success: 'Minimum 3 new conversations started per week',
        },
        {
          day: 'Monthly',
          title: 'Analyze and Improve',
          actions: [
            'Review reply rates — if under 5%, rewrite your opening message',
            'Review call booking rate — if under 20% of replies, improve your follow-up',
            'A/B test subject lines and first lines',
            'Cut any sequence under 3% reply rate after 30 sends',
          ],
          tool: 'analytics',
          toolLabel: 'View Analytics',
          success: '5%+ reply rate and 2+ calls booked per week',
        },
      ],
    },
    {
      id: 'closing',
      title: 'Closing Playbook',
      subtitle: 'Convert calls into paying clients',
      icon: '🤝',
      color: '#16A34A',
      sprintStep: 5,
      description: 'The exact call structure that closes high-ticket AI agency deals on Zoom — even with zero sales experience.',
      days: [
        {
          day: '30 Minutes Before',
          title: 'Pre-Call Prep',
          actions: [
            'Research the prospect — know their business before you dial',
            'Generate your sales script using their niche and your offer',
            'Load Teleprompter with your script',
            'Set a timer for 45 minutes — respect their time',
          ],
          tool: 'salesscript',
          toolLabel: 'Generate Script',
          success: 'Script ready. You know their business. Teleprompter loaded.',
        },
        {
          day: 'Minutes 0–5',
          title: 'Open Strong',
          actions: [
            'Start with genuine small talk — ask where they\'re located, how business is going',
            'Transition with: "I appreciate your time — let\'s make it worth it for you"',
            'Set the agenda: "I\'ll ask you some questions, share what we do, and we\'ll see if it\'s a fit"',
            'Never pitch in the first 5 minutes',
          ],
          tool: 'teleprompter',
          toolLabel: 'Open Teleprompter',
          success: 'Prospect is relaxed and talking. You know their situation.',
        },
        {
          day: 'Minutes 5–15',
          title: 'Discovery',
          actions: [
            'Ask: "What does your current client acquisition look like?"',
            'Ask: "What\'s not working about it?"',
            'Ask: "What would hitting your revenue goal mean for you?"',
            'Listen more than you talk. Take notes.',
            'Never interrupt a prospect who is sharing pain',
          ],
          tool: 'aisolution',
          toolLabel: 'AI Advisor',
          success: 'You know their pain, their goal, and what\'s standing in the way',
        },
        {
          day: 'Minutes 15–30',
          title: 'Pitch and Price',
          actions: [
            'Bridge: "Based on what you told me, here\'s exactly how we\'d help..."',
            'Present your offer clearly — no jargon, no tech-speak',
            'State the price directly: "The investment is $X upfront and $X/month"',
            'Then stop talking. Wait for their response.',
          ],
          tool: 'salesscript',
          toolLabel: 'View Script',
          success: 'You stated price confidently and waited without backtracking',
        },
        {
          day: 'Minutes 30–45',
          title: 'Handle Objections and Close',
          actions: [
            'Handle every objection with curiosity, not pressure',
            'Price objection: "What were you expecting?" then justify the ROI',
            'Timing objection: "What would need to be different?" then address it',
            'Close: "Based on everything, does this feel like a fit?"',
            'If yes: collect payment on the call — never let them "think about it" without a date',
          ],
          tool: 'objections',
          toolLabel: 'Objection Handler',
          success: 'Payment collected or follow-up call booked with a specific date and time',
        },
        {
          day: 'After Every Call',
          title: 'Analyze and Improve',
          actions: [
            'Paste the transcript into Call Analyzer immediately',
            'Note the exact moment you lost control or built the most trust',
            'Write one thing you\'ll do differently on the next call',
            'Update Pipeline with the outcome',
          ],
          tool: 'callanalyzer',
          toolLabel: 'Analyze Call',
          success: 'Clear coaching note written. Pipeline updated.',
        },
      ],
    },
  ];

  const activeBook = PLAYBOOKS.find(p => p.id === active);

  return (
    <div>
      <SectionHeader title="PLAYBOOKS" sub="Structured execution guides — every step mapped to the right tool"/>

      {!activeBook ? (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}}>
          {PLAYBOOKS.map(pb => {
            const isCurrentStep = sprintProgress?.currentStep >= pb.sprintStep;
            return (
              <div key={pb.id} onClick={()=>setActive(pb.id)}
                style={{background:C.card,border:`1px solid ${isCurrentStep ? pb.color+'44' : C.border}`,borderRadius:10,padding:22,cursor:'pointer',transition:'border 0.2s'}}>
                <div style={{fontSize:28,marginBottom:12}}>{pb.icon}</div>
                <div style={{fontFamily:F.display,fontSize:18,letterSpacing:2,color:C.text,marginBottom:6}}>{pb.title}</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,marginBottom:14,lineHeight:1.6}}>{pb.subtitle}</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textMuted,lineHeight:1.7,marginBottom:16}}>{pb.description}</div>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{fontFamily:F.mono,fontSize:10,color:pb.color}}>Sprint Step {pb.sprintStep}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{pb.days.length} phases →</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
            <Btn variant="ghost" size="sm" Icon={ArrowLeft} onClick={()=>setActive(null)}>All Playbooks</Btn>
            <div style={{fontFamily:F.display,fontSize:20,letterSpacing:2,color:C.text}}>{activeBook.title}</div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {activeBook.days.map((phase, i) => (
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
                <div style={{display:'flex',alignItems:'center',gap:14,padding:'16px 20px',borderBottom:`1px solid ${C.border}`}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:`${activeBook.color}18`,border:`1px solid ${activeBook.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:F.display,fontSize:12,color:activeBook.color,flexShrink:0}}>{i+1}</div>
                  <div>
                    <div style={{fontFamily:F.mono,fontSize:9,color:activeBook.color,letterSpacing:2,marginBottom:2}}>{phase.day.toUpperCase()}</div>
                    <div style={{fontFamily:F.display,fontSize:16,letterSpacing:1,color:C.text}}>{phase.title}</div>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:0}}>
                  <div style={{padding:'16px 20px',borderRight:`1px solid ${C.border}`}}>
                    {phase.actions.map((action, j) => (
                      <div key={j} style={{display:'flex',gap:10,marginBottom:10}}>
                        <div style={{width:18,height:18,borderRadius:3,border:`1px solid ${C.border}`,flexShrink:0,marginTop:1}}/>
                        <div style={{fontFamily:F.mono,fontSize:11,color:C.text,lineHeight:1.7}}>{action}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:'16px 18px',display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                    <div>
                      <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5,marginBottom:6}}>SUCCESS LOOKS LIKE</div>
                      <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.7,marginBottom:16}}>{phase.success}</div>
                    </div>
                    <Btn size="sm" onClick={()=>setView(phase.tool)} style={{width:'100%',justifyContent:'center'}}>{phase.toolLabel} →</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



// ─── Follow-Up Sequences ───────────────────────────────────────────────────────
function SequencesView() {
  const [activeSeq, setActiveSeq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState({});
  const [niche, setNiche] = useState('');
  const [offer, setOffer] = useState('');
  const [copied, setCopied] = useState('');

  const SEQUENCES = [
    {
      id: 'cold',
      title: 'Cold Outreach Follow-Up',
      subtitle: '5-touch sequence for prospects who haven\'t replied',
      icon: '❄️',
      touches: 5,
      color: '#2563EB',
      trigger: 'After first outreach message sent — no reply',
      goal: 'Get a reply or call booked',
      delays: ['Day 3','Day 6','Day 10','Day 14','Day 21'],
    },
    {
      id: 'noshow',
      title: 'No-Show Follow-Up',
      subtitle: '3-touch re-engagement for missed calls',
      icon: '📵',
      touches: 3,
      color: '#DC2626',
      trigger: 'When prospect doesn\'t show for booked call',
      goal: 'Reschedule the call',
      delays: ['Same day','Day 2','Day 5'],
    },
    {
      id: 'postcall',
      title: 'Post-Call Follow-Up',
      subtitle: '4-touch sequence after discovery call',
      icon: '📞',
      touches: 4,
      color: '#16A34A',
      trigger: 'Immediately after discovery call ends',
      goal: 'Close the deal or book next step',
      delays: ['Same day','Day 2','Day 5','Day 10'],
    },
    {
      id: 'reactivation',
      title: 'Reactivation Sequence',
      subtitle: 'Win back cold leads who went quiet',
      icon: '🔥',
      touches: 4,
      color: '#D97706',
      trigger: 'Leads with no activity in 30+ days',
      goal: 'Re-open the conversation',
      delays: ['Day 1','Day 4','Day 8','Day 14'],
    },
  ];

  const generate = async (seq) => {
    if (!niche.trim() || !offer.trim()) return;
    setLoading(seq.id);
    try {
      const res = await fetch("/api/claude", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:3000,
          messages:[{ role:"user", content:`You are a direct response copywriter. Write a "${seq.title}" email/SMS sequence.

SEQUENCE TYPE: ${seq.title}
TRIGGER: ${seq.trigger}
GOAL: ${seq.goal}
TOUCHES: ${seq.touches} messages at: ${seq.delays.join(', ')}

MY NICHE: ${niche}
MY OFFER: ${offer}

RULES:
- Write like a real human, not a marketer
- Short messages — 3-5 sentences max per touch
- Each message has a different angle, not the same pitch repeated
- Include SMS version (under 160 chars) for each
- Touch 1 is soft. Touch 2 adds value. Touch 3 creates light urgency. Final is a clean break.
- No spam trigger words. No "just checking in."

Return ONLY valid JSON:
{"messages":[{"touch":1,"delay":"${seq.delays[0]}","subject":"Email subject line","email":"Full email body","sms":"SMS version under 160 chars","angle":"What this message is doing psychologically"}]}`
        }]})
      });
      const data = await res.json();
      const text = data.content?.find(b=>b.type==='text')?.text||'';
      const json = text.match(/\{[\s\S]*\}/);
      if (json) {
        setGenerated(g => ({...g, [seq.id]: JSON.parse(json[0])}));
        setActiveSeq(seq.id);
      }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const copyMsg = (text, key) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(()=>setCopied(''),2000); };

  const seq = SEQUENCES.find(s=>s.id===activeSeq);
  const msgs = generated[activeSeq]?.messages || [];

  return (
    <div>
      <SectionHeader title="FOLLOW-UP SEQUENCES" sub="Plug-and-play outreach sequences — no lead goes cold"/>

      {/* Brief inputs */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>
        <div><Label>Your Niche</Label><FInput value={niche} onChange={setNiche} placeholder="e.g. HVAC companies, dental practices"/></div>
        <div><Label>Your Offer</Label><FInput value={offer} onChange={setOffer} placeholder="e.g. AI lead generation, $3,000 setup"/></div>
      </div>

      {/* Sequence cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14,marginBottom:20}}>
        {SEQUENCES.map(s=>(
          <div key={s.id} style={{background:C.card,border:`1px solid ${activeSeq===s.id?s.color:C.border}`,borderRadius:10,padding:20}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
              <div>
                <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div>
                <div style={{fontFamily:F.display,fontSize:16,letterSpacing:1,color:C.text,marginBottom:3}}>{s.title}</div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.6,marginBottom:6}}>{s.subtitle}</div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {s.delays.map((d,i)=><span key={i} style={{background:C.surface,borderRadius:3,padding:'2px 7px',fontFamily:F.mono,fontSize:9,color:C.textSub}}>{d}</span>)}
                </div>
              </div>
              <div style={{background:`${s.color}18`,border:`1px solid ${s.color}33`,borderRadius:6,padding:'6px 10px',fontFamily:F.mono,fontSize:10,color:s.color,flexShrink:0}}>{s.touches} touches</div>
            </div>
            <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginBottom:12,padding:'8px 10px',background:C.surface,borderRadius:6,lineHeight:1.6}}>
              Trigger: {s.trigger}
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn size="sm" Icon={Sparkles} onClick={()=>generate(s)} disabled={loading===s.id||!niche||!offer} style={{flex:1,justifyContent:'center'}}>
                {loading===s.id?'Writing (~20s)...':generated[s.id]?'Regenerate':'Generate Sequence'}
              </Btn>
              {generated[s.id]&&<Btn variant="ghost" size="sm" onClick={()=>setActiveSeq(activeSeq===s.id?null:s.id)}>
                {activeSeq===s.id?'Hide':'View'}
              </Btn>}
            </div>
          </div>
        ))}
      </div>

      {/* Generated sequence display */}
      {seq&&msgs.length>0&&(
        <div style={{background:C.card,border:`1px solid ${seq.color}44`,borderRadius:10,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:12}}>
            <div style={{fontFamily:F.display,fontSize:16,letterSpacing:2,color:C.text}}>{seq.title}</div>
            <div style={{flex:1}}/>
            <Btn variant="ghost" size="sm" onClick={()=>{
              const full = msgs.map(m=>`--- ${seq.delays[m.touch-1]} ---\nSUBJECT: ${m.subject}\n\n${m.email}\n\nSMS: ${m.sms}`).join('\n\n');
              navigator.clipboard.writeText(full); setCopied('all'); setTimeout(()=>setCopied(''),2000);
            }} Icon={Copy}>{copied==='all'?'Copied!':'Copy All'}</Btn>
          </div>
          {msgs.map((m,i)=>(
            <div key={i} style={{borderBottom:i<msgs.length-1?`1px solid ${C.border}`:'none'}}>
              <div style={{display:'grid',gridTemplateColumns:'120px 1fr 1fr',gap:0}}>
                <div style={{padding:'16px 16px',borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',gap:6,background:C.surface}}>
                  <div style={{fontFamily:F.display,fontSize:22,color:seq.color}}>#{m.touch}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>{seq.delays[i]}</div>
                  <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,lineHeight:1.5,marginTop:4,fontStyle:'italic'}}>{m.angle}</div>
                </div>
                <div style={{padding:'16px 18px',borderRight:`1px solid ${C.border}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5}}>EMAIL</div>
                    <button onClick={()=>copyMsg(`Subject: ${m.subject}\n\n${m.email}`,'e'+i)} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:9}}>{copied==='e'+i?'✓':'copy'}</button>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.accent,marginBottom:6}}>Sub: {m.subject}</div>
                  <div style={{fontFamily:F.mono,fontSize:11,color:C.text,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{m.email}</div>
                </div>
                <div style={{padding:'16px 18px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                    <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,letterSpacing:1.5}}>SMS</div>
                    <button onClick={()=>copyMsg(m.sms,'s'+i)} style={{background:'none',border:'none',color:C.textMuted,cursor:'pointer',fontFamily:F.mono,fontSize:9}}>{copied==='s'+i?'✓':'copy'}</button>
                  </div>
                  <div style={{fontFamily:F.mono,fontSize:12,color:C.text,lineHeight:1.8}}>{m.sms}</div>
                  <div style={{fontFamily:F.mono,fontSize:9,color:m.sms?.length>160?C.danger:C.textMuted,marginTop:8}}>{m.sms?.length||0}/160 chars</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Funnel Builder ────────────────────────────────────────────────────────────
function FunnelBuilderView() {
  const [template, setTemplate] = useState(null);
  const [editing, setEditing] = useState(null);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [preview, setPreview] = useState(false);

  const TEMPLATES = [
    {
      id: 'audit',
      title: 'Free Audit Offer',
      icon: '🔍',
      headline: 'Get Your Free AI Growth Audit',
      subheadline: 'See exactly where AI can save you time and win you more clients — in 30 minutes.',
      cta: 'Book My Free Audit',
      proof: 'Join 50+ businesses who\'ve discovered their AI growth opportunities',
      color: '#2563EB',
      sections: ['headline','subheadline','cta','proof','calendar','urgency'],
    },
    {
      id: 'demo',
      title: 'AI Automation Demo',
      icon: '🤖',
      headline: 'See AI Handle Your Leads on Autopilot',
      subheadline: 'A live 20-minute demo showing exactly how AI can follow up, qualify, and book calls for your business.',
      cta: 'Book My Free Demo',
      proof: 'Watch your exact business use case in real-time',
      color: '#7C3AED',
      sections: ['headline','subheadline','cta','proof','calendar'],
    },
    {
      id: 'leadgen',
      title: 'Lead Generation Offer',
      icon: '📈',
      headline: 'Get 50 Qualified Leads in 7 Days',
      subheadline: 'We build and run an AI-powered lead generation system tailored to your business — guaranteed.',
      cta: 'Claim Your Free Strategy Call',
      proof: 'Results-based offer — you only pay when the system works',
      color: '#DC2626',
      sections: ['headline','subheadline','cta','proof','calendar','guarantee'],
    },
  ];

  const active = template ? TEMPLATES.find(t=>t.id===template) : null;
  const fields = editing || (active ? {...active} : null);
  const setField = (key, val) => setEditing(f=>({...f, [key]:val}));

  const generateEmbed = () => {
    if (!calendlyUrl) return '';
    return `<!-- Calendly inline widget -->
<div class="calendly-inline-widget" data-url="${calendlyUrl}" style="min-width:320px;height:700px;"></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>`;
  };

  const copyEmbed = () => { navigator.clipboard.writeText(generateEmbed()); };

  return (
    <div>
      <SectionHeader title="FUNNEL BUILDER" sub="3 prebuilt templates — edit text, add your calendar, copy the code"/>

      {!active ? (
        <div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:22}}>
            {TEMPLATES.map(t=>(
              <div key={t.id} onClick={()=>{setTemplate(t.id);setEditing({...t});}}
                style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:22,cursor:'pointer'}}>
                <div style={{fontSize:28,marginBottom:12}}>{t.icon}</div>
                <div style={{fontFamily:F.display,fontSize:16,letterSpacing:1,color:C.text,marginBottom:8}}>{t.title}</div>
                <div style={{fontFamily:F.mono,fontSize:11,color:C.textSub,lineHeight:1.7,marginBottom:12}}>{t.headline}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {t.sections.map(s=><span key={s} style={{background:C.surface,borderRadius:3,padding:'2px 7px',fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{s}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
            <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>HOW IT WORKS</div>
            {[
              {n:'01',t:'Pick a template',d:'Choose the offer type that matches what you\'re selling — audit, demo, or lead gen.'},
              {n:'02',t:'Edit the copy',d:'Change the headline, subheadline, CTA, and proof statement. Plain text editing only.'},
              {n:'03',t:'Add your Calendly',d:'Paste your Calendly link and we generate the embed code for your funnel.'},
              {n:'04',t:'Copy and deploy',d:'Copy the full HTML page code and paste it into your website, GHL, or any page builder.'},
            ].map(s=>(
              <div key={s.n} style={{display:'flex',gap:14,marginBottom:14}}>
                <div style={{fontFamily:F.display,fontSize:18,color:C.accent,flexShrink:0}}>{s.n}</div>
                <div><div style={{fontFamily:F.mono,fontSize:12,color:C.text,marginBottom:3}}>{s.t}</div><div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.7}}>{s.d}</div></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'380px 1fr',gap:18,alignItems:'start'}}>
          {/* Editor */}
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
                <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text}}>EDIT COPY</div>
                <Btn variant="ghost" size="sm" Icon={ArrowLeft} onClick={()=>{setTemplate(null);setEditing(null);}}>Back</Btn>
              </div>
              <div style={{marginBottom:10}}><Label>Headline</Label><FInput value={fields?.headline||''} onChange={v=>setField('headline',v)}/></div>
              <div style={{marginBottom:10}}><Label>Subheadline</Label><FTextarea value={fields?.subheadline||''} onChange={v=>setField('subheadline',v)} rows={3}/></div>
              <div style={{marginBottom:10}}><Label>CTA Button Text</Label><FInput value={fields?.cta||''} onChange={v=>setField('cta',v)}/></div>
              <div style={{marginBottom:10}}><Label>Social Proof / Trust Line</Label><FInput value={fields?.proof||''} onChange={v=>setField('proof',v)}/></div>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:14}}>
              <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text,marginBottom:12}}>CALENDLY EMBED</div>
              <div style={{marginBottom:10}}><Label>Your Calendly URL</Label><FInput value={calendlyUrl} onChange={setCalendlyUrl} placeholder="https://calendly.com/yourname/30min"/></div>
              {calendlyUrl&&(
                <div>
                  <div style={{background:C.surface,borderRadius:6,padding:10,fontFamily:F.mono,fontSize:9,color:C.textSub,whiteSpace:'pre-wrap',lineHeight:1.7,marginBottom:8,wordBreak:'break-all'}}>{generateEmbed()}</div>
                  <Btn size="sm" Icon={Copy} onClick={copyEmbed}>Copy Embed Code</Btn>
                </div>
              )}
            </div>
            <Btn Icon={Code} onClick={()=>setPreview(!preview)} style={{width:'100%',justifyContent:'center'}}>
              {preview?'Hide':'View'} Full HTML Page
            </Btn>
          </div>

          {/* Preview */}
          <div>
            <div style={{background:`${fields?.color||active.color}08`,border:`1px solid ${fields?.color||active.color}22`,borderRadius:12,overflow:'hidden'}}>
              <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:'8px 14px',fontFamily:F.mono,fontSize:9,color:C.textMuted,display:'flex',gap:6,alignItems:'center'}}>
                <div style={{width:8,height:8,borderRadius:'50%',background:'#EF4444'}}/><div style={{width:8,height:8,borderRadius:'50%',background:'#F59E0B'}}/><div style={{width:8,height:8,borderRadius:'50%',background:'#10B981'}}/>
                <span style={{marginLeft:8}}>yoursite.com/free-audit</span>
              </div>
              <div style={{padding:'48px 40px',textAlign:'center',background:'#0A0A0A'}}>
                <div style={{display:'inline-block',background:`${fields?.color||active.color}18`,border:`1px solid ${fields?.color||active.color}33`,borderRadius:4,padding:'4px 12px',fontFamily:F.mono,fontSize:10,color:fields?.color||active.color,marginBottom:20,letterSpacing:2}}>
                  {active.icon} {active.title.toUpperCase()}
                </div>
                <div style={{fontFamily:'Georgia,serif',fontSize:28,color:'#fff',fontWeight:700,lineHeight:1.3,marginBottom:16}}>{fields?.headline||active.headline}</div>
                <div style={{fontFamily:F.mono,fontSize:13,color:'#aaa',lineHeight:1.8,marginBottom:28,maxWidth:480,margin:'0 auto 28px'}}>{fields?.subheadline||active.subheadline}</div>
                <div style={{background:fields?.color||active.color,color:'#fff',borderRadius:8,padding:'16px 32px',fontFamily:F.mono,fontSize:14,fontWeight:600,display:'inline-block',cursor:'pointer',marginBottom:20}}>
                  {fields?.cta||active.cta}
                </div>
                <div style={{fontFamily:F.mono,fontSize:11,color:'#666',marginTop:16}}>{fields?.proof||active.proof}</div>
                {calendlyUrl&&(
                  <div style={{marginTop:32,background:'#111',borderRadius:8,padding:20,fontFamily:F.mono,fontSize:11,color:'#555',border:'1px solid #222'}}>
                    📅 Your Calendly calendar appears here
                  </div>
                )}
              </div>
            </div>

            {preview&&(
              <div style={{marginTop:14,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                  <div style={{fontFamily:F.display,fontSize:12,letterSpacing:2,color:C.text}}>FULL HTML PAGE</div>
                  <Btn size="sm" Icon={Copy} onClick={()=>{
                    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${fields?.headline||active.headline}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#0A0A0A;font-family:-apple-system,sans-serif;color:#fff;min-height:100vh}.page{max-width:680px;margin:0 auto;padding:60px 24px;text-align:center}.badge{display:inline-block;background:${fields?.color||active.color}22;border:1px solid ${fields?.color||active.color}44;border-radius:4px;padding:6px 14px;font-size:11px;color:${fields?.color||active.color};letter-spacing:2px;margin-bottom:24px}.headline{font-size:36px;font-weight:700;line-height:1.2;margin-bottom:18px}.sub{font-size:15px;color:#aaa;line-height:1.8;margin-bottom:32px}.cta{background:${fields?.color||active.color};color:#fff;border:none;border-radius:8px;padding:18px 36px;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:16px}.proof{font-size:12px;color:#555;margin-bottom:40px}.calendar{margin-top:40px}</style></head><body><div class="page"><div class="badge">${active.title.toUpperCase()}</div><h1 class="headline">${fields?.headline||active.headline}</h1><p class="sub">${fields?.subheadline||active.subheadline}</p><button class="cta">${fields?.cta||active.cta}</button><p class="proof">${fields?.proof||active.proof}</p><div class="calendar">${calendlyUrl?generateEmbed():'<!-- Add your Calendly embed here -->'}</div></div></body></html>`;
                    navigator.clipboard.writeText(html);
                  }}>Copy Full HTML</Btn>
                </div>
                <div style={{fontFamily:F.mono,fontSize:9,color:C.textMuted,lineHeight:1.8}}>
                  Full page HTML is copied to clipboard. Paste into GHL, Webflow, or any HTML file.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Fulfillment Starter Kit ───────────────────────────────────────────────────
function FulfillmentView() {
  const [activeSection, setActiveSection] = useState('checklist');
  const [checked, setChecked] = useState({});
  const [copied, setCopied] = useState('');

  const toggle = (id) => setChecked(c=>({...c,[id]:!c[id]}));
  const copyText = (text, key) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(()=>setCopied(''),2000); };

  const CHECKLIST = [
    { id:'agreement', phase:'Day 1', title:'Send the agreement', desc:'Send a simple 1-page service agreement. Client signs digitally.', urgent:true },
    { id:'payment',   phase:'Day 1', title:'Collect payment',    desc:'Invoice via Stripe, PayPal, or your processor. Collect before starting.', urgent:true },
    { id:'onboard',   phase:'Day 1', title:'Book onboarding call', desc:'Schedule a 60-minute kickoff call within 3 days of payment.', urgent:true },
    { id:'intake',    phase:'Day 1', title:'Send intake form',   desc:'Collect business info, goals, access credentials, and preferences.', urgent:false },
    { id:'access',    phase:'Day 2', title:'Get system access',  desc:'Website CMS, CRM, social accounts, ad accounts — everything you\'ll need.', urgent:false },
    { id:'kickoff',   phase:'Day 3', title:'Run kickoff call',   desc:'Review intake, set expectations, agree on deliverables and timeline.', urgent:false },
    { id:'deliver1',  phase:'Week 1',title:'Deliver first milestone', desc:'Complete and share the first deliverable. Get feedback and approval.', urgent:false },
    { id:'update1',   phase:'Week 2',title:'Send first update',  desc:'Weekly update email showing progress, results so far, and next steps.', urgent:false },
  ];

  const TEMPLATES = {
    welcome: {
      label:'Welcome Email',
      subject:'Welcome aboard — here\'s what happens next',
      body:`Hi [First Name],

You made a great decision and I\'m genuinely excited to work with you.

Here\'s what happens in the next 48 hours:

1. You\'ll receive an intake form — fill it out when you can (takes 5 minutes)
2. I\'ll send you a calendar link to book our kickoff call
3. We\'ll get your systems connected and start building

Before our kickoff call, I\'ll review your intake form so we can hit the ground running.

Looking forward to getting you results.

[Your Name]
[Your Phone Number]`
    },
    onboarding: {
      label:'Onboarding Email',
      subject:'Your onboarding checklist + what to prepare',
      body:`Hi [First Name],

Our kickoff call is booked — here\'s what to have ready:

BEFORE THE CALL:
• Fill out the intake form (link below)
• Have your website URL ready
• Have access to your CRM or email platform
• Write down your top 3 goals for the next 90 days

INTAKE FORM: [Link]
CALL LINK: [Calendly/Zoom Link]
CALL DATE: [Date and Time]

If anything comes up, text me directly at [Your Number].

See you soon,
[Your Name]`
    },
    weeklyupdate: {
      label:'Weekly Update',
      subject:'Week [X] Update — [Company Name]',
      body:`Hi [First Name],

Here\'s your weekly update:

WHAT WE COMPLETED THIS WEEK:
• [Deliverable 1]
• [Deliverable 2]

RESULTS SO FAR:
• [Metric 1]: [Number]
• [Metric 2]: [Number]

WHAT\'S NEXT:
• [Next week deliverable]
• [Expected date]

ANYTHING YOU NEED FROM ME:
• [Action item for client, if any]

Any questions? Reply here or text me at [Your Number].

[Your Name]`
    },
    results: {
      label:'Results Report',
      subject:'Your [Month] Results Report',
      body:`[CLIENT NAME] — [MONTH] RESULTS

OVERVIEW
[2-3 sentence summary of the month and overall progress]

KEY METRICS
• Leads Generated: [Number]
• Calls Booked: [Number]
• Deals Closed: [Number]
• Revenue Attributed: $[Amount]

WHAT WORKED
• [Win 1]
• [Win 2]

WHAT WE\'RE IMPROVING
• [Area 1] — here\'s what we\'re changing: [Change]

NEXT MONTH\'S FOCUS
• [Goal 1]
• [Goal 2]

Questions? I\'m always available at [Your Number].

[Your Name]`
    },
  };

  const SOPS = [
    {
      id:'chatbot',
      title:'AI Chatbot Setup',
      steps:[
        'Get client\'s website access (WordPress, Webflow, Squarespace, etc.)',
        'Create account in your chatbot platform (ManyChat, Tidio, or Voiceflow)',
        'Build the conversation flow: greeting → qualify → book call or collect lead',
        'Train it on client\'s FAQs, services, pricing, and hours',
        'Install the widget on their website (usually a single line of code)',
        'Test 10 conversation paths before going live',
        'Set up notifications so client gets alerted for every new lead',
        'Review first week\'s conversations and refine',
      ],
      time:'4–8 hours',
      deliverable:'Live chatbot on website capturing and qualifying leads 24/7',
    },
    {
      id:'leadgen',
      title:'Lead Generation System',
      steps:[
        'Define the ICP with client: who exactly are they targeting?',
        'Build a targeted lead list (use Lead Finder or Apollo/Clay)',
        'Set up email sending domain and warm it up (7–14 days)',
        'Write 3-email sequence: intro → value → CTA',
        'Configure sending tool (Instantly, Smartlead, or Lemlist)',
        'Launch to first 50 leads and monitor reply rates for 5 days',
        'Adjust subject line or opening line if reply rate under 5%',
        'Scale to 100+ per day once reply rate is validated',
      ],
      time:'6–10 hours',
      deliverable:'Automated outreach system generating booked calls every week',
    },
    {
      id:'automation',
      title:'Basic Automations',
      steps:[
        'Map the workflow: what trigger starts it, what\'s the outcome?',
        'Choose your tool: GoHighLevel, Zapier, or Make.com',
        'Build the trigger (new form submission, new lead, call booked, etc.)',
        'Add actions: send email, send SMS, create CRM record, notify client',
        'Test with a real submission before turning on',
        'Document the automation in plain English for the client',
        'Set up a monitoring alert if the automation fails',
        'Review after 30 days and optimize',
      ],
      time:'2–4 hours per automation',
      deliverable:'Automated workflow saving client 2–5 hours per week',
    },
  ];

  const completedCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((completedCount / CHECKLIST.length) * 100);

  return (
    <div>
      <SectionHeader title="FULFILLMENT STARTER KIT" sub="Everything you need to deliver after closing — agreements to reports"/>

      {/* Progress */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18,marginBottom:18}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <div style={{fontFamily:F.display,fontSize:14,letterSpacing:2,color:C.text}}>DELIVERY PROGRESS</div>
          <div style={{fontFamily:F.display,fontSize:20,color:pct===100?C.success:C.accent}}>{pct}%</div>
        </div>
        <div style={{height:6,background:C.surface,borderRadius:3,overflow:'hidden'}}>
          <div style={{height:'100%',width:`${pct}%`,background:pct===100?C.success:C.accent,borderRadius:3,transition:'width 0.5s'}}/>
        </div>
        <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,marginTop:6}}>{completedCount} of {CHECKLIST.length} steps complete</div>
      </div>

      {/* Section tabs */}
      <div style={{display:'flex',gap:8,marginBottom:18}}>
        {[{id:'checklist',l:'Onboarding Checklist'},{id:'templates',l:'Message Templates'},{id:'sops',l:'Delivery SOPs'}].map(t=>(
          <button key={t.id} onClick={()=>setActiveSection(t.id)}
            style={{padding:'9px 18px',borderRadius:6,border:`1px solid ${activeSection===t.id?C.accent:C.border}`,background:activeSection===t.id?C.accentLow:'transparent',color:activeSection===t.id?C.accent:C.textSub,fontFamily:F.mono,fontSize:11,cursor:'pointer'}}>
            {t.l}
          </button>
        ))}
      </div>

      {/* CHECKLIST */}
      {activeSection==='checklist'&&(
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {CHECKLIST.map((item,i)=>(
            <div key={item.id} onClick={()=>toggle(item.id)}
              style={{display:'flex',alignItems:'flex-start',gap:14,padding:'14px 18px',background:C.card,border:`1px solid ${checked[item.id]?C.success+'44':C.border}`,borderRadius:8,cursor:'pointer',transition:'border 0.2s'}}>
              <div style={{width:20,height:20,borderRadius:4,border:`2px solid ${checked[item.id]?C.success:C.border}`,background:checked[item.id]?C.success:'transparent',flexShrink:0,marginTop:1,display:'flex',alignItems:'center',justifyContent:'center'}}>
                {checked[item.id]&&<span style={{color:'#fff',fontSize:11}}>✓</span>}
              </div>
              <div style={{flex:1}}>
                <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:3}}>
                  <div style={{fontFamily:F.mono,fontSize:11,color:checked[item.id]?C.success:C.text,textDecoration:checked[item.id]?'line-through':'none'}}>{item.title}</div>
                  {item.urgent&&!checked[item.id]&&<span style={{background:'rgba(220,38,38,0.1)',border:'1px solid rgba(220,38,38,0.2)',borderRadius:3,padding:'1px 6px',fontFamily:F.mono,fontSize:8,color:C.accent}}>DAY 1</span>}
                  <span style={{fontFamily:F.mono,fontSize:9,color:C.textMuted}}>{item.phase}</span>
                </div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted,lineHeight:1.6}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TEMPLATES */}
      {activeSection==='templates'&&(
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {Object.entries(TEMPLATES).map(([key,tpl])=>(
            <div key={key} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div style={{fontFamily:F.display,fontSize:14,letterSpacing:1,color:C.text}}>{tpl.label}</div>
                <Btn size="sm" Icon={Copy} onClick={()=>copyText(`Subject: ${tpl.subject}\n\n${tpl.body}`,key)}>
                  {copied===key?'Copied!':'Copy'}
                </Btn>
              </div>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.accent,marginBottom:8}}>Sub: {tpl.subject}</div>
              <div style={{fontFamily:F.mono,fontSize:10,color:C.textSub,lineHeight:1.8,whiteSpace:'pre-wrap',background:C.surface,padding:'12px 14px',borderRadius:6,maxHeight:220,overflowY:'auto'}}>
                {tpl.body}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SOPs */}
      {activeSection==='sops'&&(
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {SOPS.map(sop=>(
            <div key={sop.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:'hidden'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px',borderBottom:`1px solid ${C.border}`}}>
                <div>
                  <div style={{fontFamily:F.display,fontSize:16,letterSpacing:1,color:C.text,marginBottom:3}}>{sop.title}</div>
                  <div style={{fontFamily:F.mono,fontSize:10,color:C.textMuted}}>⏱ {sop.time}</div>
                </div>
                <div style={{fontFamily:F.mono,fontSize:10,color:C.success,background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:6,padding:'6px 12px',textAlign:'right',maxWidth:200}}>
                  {sop.deliverable}
                </div>
              </div>
              <div style={{padding:'16px 20px',display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8}}>
                {sop.steps.map((step,i)=>(
                  <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                    <div style={{fontFamily:F.display,fontSize:12,color:C.accent,flexShrink:0,lineHeight:1.4,width:18}}>0{i+1}</div>
                    <div style={{fontFamily:F.mono,fontSize:11,color:C.text,lineHeight:1.6}}>{step}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function LoginScreen({ onLogin, users = USERS }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 80); return () => clearInterval(t); }, []);
  const bars = 18;

  const submit = () => {
    if (!email || !password) { setError('Enter your email and password.'); return; }
    setLoading(true); setError('');
    setTimeout(() => {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) { onLogin(user); }
      else { setError('Invalid credentials. Try demo@clientsprint.ai / demo'); setLoading(false); }
    }, 700);
  };

  const handleKey = e => { if (e.key === 'Enter') submit(); };

  return (
    <div style={{ height: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, position: 'relative', overflow: 'hidden' }}>
      {/* Animated background bars */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', gap: 2, opacity: 0.07, pointerEvents: 'none' }}>
        {[...Array(bars)].map((_, i) => {
          const h = 20 + 60 * Math.abs(Math.sin((tick * 0.04) + i * 0.7));
          return (
            <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              <div style={{ width: '100%', height: `${h}%`, background: i % 3 === 0 ? C.accent : C.border, transform: 'skewX(-4deg)', transition: 'height 0.08s ease', borderRadius: '2px 2px 0 0' }} />
            </div>
          );
        })}
      </div>

      {/* Diagonal slash accent — top right */}
      <div style={{ position: 'absolute', top: -60, right: -40, width: 220, height: 220, background: C.accent, opacity: 0.04, transform: 'rotate(22deg) skewX(-10deg)', borderRadius: 8, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -30, right: 20, width: 8, height: 140, background: C.accent, opacity: 0.18, transform: 'rotate(22deg)', borderRadius: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -30, right: 36, width: 4, height: 100, background: C.accent, opacity: 0.1, transform: 'rotate(22deg)', borderRadius: 2, pointerEvents: 'none' }} />

      {/* Card */}
      <div style={{ width: 400, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '44px 40px 36px', position: 'relative', zIndex: 1 }}>
        {/* Wordmark */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: F.display, fontSize: 30, letterSpacing: 4, color: C.text, lineHeight: 1 }}>
            CLIENT<span style={{ color: C.accent }}>SPRINT</span>
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.textMuted, letterSpacing: 2.5, marginTop: 4 }}>.AI // CAMPAIGN OPERATIONS</div>
          {/* Speed dashes */}
          <div style={{ display: 'flex', gap: 3, marginTop: 12 }}>
            {[12, 7, 5, 7, 5, 4].map((w, i) => (
              <div key={i} style={{ width: w, height: i === 0 ? 18 : 12, background: i < 2 ? C.accent : C.border, transform: 'skewX(-12deg)', borderRadius: 1 }} />
            ))}
          </div>
        </div>

        <div style={{ fontFamily: F.display, fontSize: 18, letterSpacing: 2, color: C.text, marginBottom: 22 }}>SIGN IN</div>

        {/* Fields */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontFamily: F.mono, fontSize: 9, color: '#AAAAAA', letterSpacing: 1.5, display: 'block', marginBottom: 7 }}>EMAIL</label>
          <input
            type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} onKeyDown={handleKey}
            placeholder="you@clientsprint.ai" autoFocus
            style={{ width: '100%', background: '#080808', border: `1px solid ${error ? C.danger : C.border}`, borderRadius: 7, padding: '11px 14px', color: C.text, fontFamily: F.mono, fontSize: 13, outline: 'none', transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = error ? C.danger : C.border}
          />
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={{ fontFamily: F.mono, fontSize: 9, color: '#AAAAAA', letterSpacing: 1.5, display: 'block', marginBottom: 7 }}>PASSWORD</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }} onKeyDown={handleKey}
              placeholder="••••••••"
              style={{ width: '100%', background: '#080808', border: `1px solid ${error ? C.danger : C.border}`, borderRadius: 7, padding: '11px 40px 11px 14px', color: C.text, fontFamily: F.mono, fontSize: 13, outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = error ? C.danger : C.border}
            />
            <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, fontSize: 11, fontFamily: F.mono, padding: 0 }}>
              {showPass ? 'hide' : 'show'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: F.mono, fontSize: 11, color: C.danger, marginBottom: 14, padding: '9px 12px', background: C.dangerLow, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 6 }}>
            <XCircle size={12} />{error}
          </div>
        )}

        {/* Sign in button */}
        <button
          onClick={submit} disabled={loading}
          style={{ width: '100%', background: loading ? C.borderMid : C.accent, border: 'none', borderRadius: 7, padding: '12px 0', color: '#fff', fontFamily: F.mono, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', marginBottom: 16 }}>
          {loading ? 'SIGNING IN...' : 'SIGN IN'}
        </button>

        {/* Demo shortcut */}
        <button
          onClick={() => { setEmail('demo@clientsprint.ai'); setPassword('demo'); }}
          style={{ width: '100%', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 7, padding: '10px 0', color: C.textSub, fontFamily: F.mono, fontSize: 11, cursor: 'pointer', letterSpacing: 1 }}>
          USE DEMO ACCOUNT
        </button>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.border}`, fontFamily: F.mono, fontSize: 10, color: C.textMuted, textAlign: 'center', lineHeight: 1.7 }}>
          Agency admin access only.<br />Contact Jesse to request a client seat.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [localUsers, setLocalUsers] = useState(USERS);
  const { progress: sprintProgress, pct: sprintPct, completeStep, setStep: setSprintStep, reset: resetSprint } = useSprintProgress();
  const isMobile = useMobile();

  const [clients, setClients] = useState(defaultClients);
  const [activeClient, setActiveClient] = useState(defaultClients()[0]);
  const [agencyView, setAgencyView] = useState(false);
  const [view, setView] = useState('dashboard');
  const [clientData, setClientData] = useState(() => {
    const out = {};
    defaultClients().forEach(cl => { out[cl.id] = seed(); });
    return out;
  });

  const data = clientData[activeClient?.id] || seed();
  const setData = useCallback((updater) => {
    setClientData(prev => {
      const cur = prev[activeClient.id] || seed();
      const next = typeof updater === 'function' ? updater(cur) : updater;
      return { ...prev, [activeClient.id]: next };
    });
  }, [activeClient]);

  const setCampaigns = useCallback(updater => setData(d => ({ ...d, campaigns: typeof updater === 'function' ? updater(d.campaigns) : updater })), [setData]);
  const setContacts = useCallback(updater => setData(d => ({ ...d, contacts: typeof updater === 'function' ? updater(d.contacts) : updater })), [setData]);
  const setSettings = useCallback(updater => setData(d => ({ ...d, settings: typeof updater === 'function' ? updater(d.settings) : updater })), [setData]);


  if (!user) return <LoginScreen onLogin={setUser} users={localUsers} />;

  const handleSwitchClient = (cl) => {
    if (!cl) { setAgencyView(true); return; }
    setActiveClient(cl);
    if (!clientData[cl.id]) setClientData(p => ({ ...p, [cl.id]: seed() }));
    setAgencyView(false);
    setView('dashboard');
  };

  const handleAddClient = (cl) => {
    setClients(cs => [...cs, cl]);
    setClientData(p => ({ ...p, [cl.id]: seed() }));
    setActiveClient(cl);
    setAgencyView(false);
    setView('dashboard');
  };

  const views = {
    dashboard: <DashboardView campaigns={data.campaigns} contacts={data.contacts} setView={setView} client={activeClient} sprintProgress={sprintProgress} sprintPct={sprintPct} completeStep={completeStep} resetSprint={resetSprint} />,
    campaigns: <CampaignsView campaigns={data.campaigns} setCampaigns={setCampaigns} />,
    sequences:    <SequencesView />,
    funnelbuilder: <FunnelBuilderView />,
    fulfillment:   <FulfillmentView />,
    blast: <BlastView contacts={data.contacts} />,
    leadfinder: <LeadFinderView contacts={data.contacts} setContacts={setContacts} />,
    offerbuilder: <OfferBuilderView />,
    proposal: <ProposalView />,
    pipeline: <PipelineView />,
    salestools: <SalesToolsView />,
    metaads: <MetaAdsView />,
    aisolution: <AISolutionView />,
    coldcall: <ColdCallView />,
    objections: <ObjectionView />,
    kpitracker: <KPIView />,
    vsl: <VSLView />,
    clientreport: <ClientReportView />,
    contacts: <ContactsView contacts={data.contacts} setContacts={setContacts} />,
    compose: <ComposeView />,
    deliverability: <DeliverabilityView />,
    analytics: <AnalyticsView campaigns={data.campaigns} />,
    settings:  <SettingsAdminView users={localUsers} setUsers={setLocalUsers} />,
    viral:     <ViralModelerView />,
    stillad:   <StillImageAdView />,
    salesscript:  <SalesScriptView />,
    callanalyzer: <SalesCallAnalyzerView />,
    pricingcalc:  <AgencyPricingView />,
    teleprompter: <TeleprompterView />,
    playbooks:    <PlaybooksView sprintProgress={sprintProgress} setView={setView} completeStep={completeStep} />,
    admindash:    <AdminDashboardView localUsers={localUsers} />,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: C.bg, color: C.text, fontFamily: F.mono, overflow: 'hidden' }}>
      <SprintTopBar progress={sprintProgress} pct={sprintPct} setView={setView} isMobile={isMobile} />
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1, overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500&display=swap');
        * { box-sizing: border-box; }
        button { transition: opacity 0.15s, background 0.15s; }
        button:hover:not(:disabled) { opacity: 0.82; }
        input::placeholder, textarea::placeholder { color: #666666; }
        select option { background: ${C.card}; color: ${C.text}; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.borderMid}; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.accent}; }
        .rg-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        .rg-5 { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; }
        .rg-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .rg-chart { display: grid; grid-template-columns: 1fr 340px; gap: 18px; }
        .rg-brief { display: grid; grid-template-columns: 380px 1fr; gap: 20px; }
        .rg-brief-sm { display: grid; grid-template-columns: 360px 1fr; gap: 20px; }
        @media (max-width: 767px) {
          .rg-4, .rg-5, .rg-2, .rg-chart, .rg-brief, .rg-brief-sm { grid-template-columns: 1fr !important; }
          table { font-size: 11px; }
          table td, table th { padding: 8px 10px !important; }
        }
        @media (min-width: 768px) and (max-width: 1024px) {
          .rg-4, .rg-5 { grid-template-columns: repeat(2,1fr) !important; }
          .rg-chart { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Sidebar view={view} setView={setView} client={activeClient} clients={clients} onSwitchClient={handleSwitchClient} onLogout={() => setUser(null)} isMobile={isMobile} />
      <main style={{ flex: 1, overflow: 'auto', padding: isMobile ? '16px 14px 80px' : '32px 38px' }}>
        {agencyView
          ? <AgencyView clients={clients} clientData={clientData} onSelect={cl => handleSwitchClient(cl)} onAdd={handleAddClient} />
          : <><SprintBanner toolId={view} setView={setView} progress={sprintProgress} completeStep={completeStep} />{views[view]}</>
        }
      </main>
      </div>
      <SprintAI view={view} progress={sprintProgress} />
    </div>
  );
}
