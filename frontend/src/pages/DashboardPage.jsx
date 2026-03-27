import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TABS = ['Overview', 'Leads', 'Tasks', 'Users'];

const statusColors = {
  New: { bg: 'rgba(37,99,235,0.15)', color: '#93b4ff' },
  Contacted: { bg: 'rgba(234,179,8,0.12)', color: '#eab308' },
  Qualified: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Negotiation: { bg: 'rgba(249,115,22,0.15)', color: '#fb923c' },
  'Closed Won': { bg: '#2563eb', color: '#fff' },
  'Closed Lost': { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  High: { bg: 'rgba(249,115,22,0.15)', color: '#fb923c' },
  Critical: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  Medium: { bg: 'rgba(234,179,8,0.12)', color: '#eab308' },
  Low: { bg: 'rgba(34,197,94,0.12)', color: '#22c55e' },
  'In Progress': { bg: 'rgba(37,99,235,0.15)', color: '#b4c5ff' },
  Pending: { bg: 'rgba(234,179,8,0.12)', color: '#eab308' },
  Done: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Active: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
  Inactive: { bg: 'rgba(255,255,255,0.06)', color: '#8d90a0' },
};

const Badge = ({ label }) => {
  const c = statusColors[label] || { bg: 'rgba(255,255,255,0.06)', color: '#8d90a0' };
  return (
    <span style={{
      display: 'inline-block',
      background: c.bg, color: c.color,
      fontSize: 10, fontWeight: 700,
      padding: '3px 10px',
      fontFamily: 'var(--font-label)',
      letterSpacing: '0.08em',
      border: c.bg === '#2563eb' ? 'none' : '1px solid var(--border)',
      whiteSpace: 'nowrap',
    }}>
      {label.toUpperCase()}
    </span>
  );
};

const StatCard = ({ label, value, sub, isBlue, delay, onClick }) => (
  <div
    onClick={onClick}
    className="stat-card"
    style={{
      background: isBlue ? '#2563eb' : '#1b1b1b',
      padding: '24px',
      animation: `fadeInUp 0.4s ease ${delay}s both`,
      border: isBlue ? 'none' : '1px solid var(--border)',
      borderLeft: isBlue ? 'none' : '4px solid #2563eb',
      position: 'relative',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { if (onClick) e.currentTarget.style.transform = 'translateY(0)'; }}
  >
    <div style={{
      fontSize: 36, fontWeight: 900, fontFamily: 'var(--font-headline)',
      color: '#fff', letterSpacing: '-0.04em', lineHeight: 1,
    }}>
      {value}
    </div>
    <div style={{
      fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-label)',
      color: isBlue ? 'rgba(255,255,255,0.6)' : 'var(--text-3)',
      letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 10,
    }}>
      {label}
    </div>
    {sub && <div style={{
      fontSize: 11, color: isBlue ? 'rgba(255,255,255,0.7)' : 'var(--accent)',
      marginTop: 8, fontWeight: 500, fontFamily: 'var(--font-label)',
    }}>{sub}</div>}
  </div>
);

const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>{title}</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 20 }}>✕</button>
      </div>
      {children}
    </div>
  </div>
);

const FormField = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontFamily: 'var(--font-label)', fontSize: 10, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.15em' }}>{label}</label>
    {children}
  </div>
);

const formInput = {
  width: '100%', background: '#0e0e0e', border: 'none',
  borderBottom: '2px solid #353535', padding: '10px 12px',
  color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-label)',
  outline: 'none',
};

const formSelect = {
  ...formInput, cursor: 'pointer',
};

const formBtn = {
  background: 'var(--accent)', border: 'none', color: '#fff',
  fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: 13,
  padding: '12px 24px', cursor: 'pointer', width: '100%', marginTop: 8,
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/dashboard');
      setData(res.data.data);
    } catch {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const openAddModal = (type) => {
    setFormError('');
    if (type === 'lead') {
      setFormData({ name: '', email: '', company: '', status: 'New', value: '', source: '' });
    } else if (type === 'task') {
      setFormData({ title: '', description: '', assignedTo: '', status: 'Pending', priority: 'Medium', category: 'General', dueDate: '' });
    }
    setModal({ type, mode: 'add' });
  };

  const openEditModal = (type, item) => {
    setFormError('');
    if (type === 'lead') {
      setFormData({ name: item.name, email: item.email, company: item.company, status: item.status, value: item.value, source: item.source });
    } else if (type === 'task') {
      setFormData({
        title: item.title, description: item.description || '',
        assignedTo: item.assignedToId || '', status: item.status, priority: item.priority,
        category: item.category, dueDate: item.dueRaw || '',
      });
    }
    setModal({ type, mode: 'edit', item });
  };

  const handleFormChange = (e) => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (modal.type === 'lead') {
        if (!formData.name || !formData.email || !formData.company) {
          setFormError('Name, email, and company are required');
          setFormLoading(false);
          return;
        }
        if (modal.mode === 'add') await api.post('/leads', formData);
        else await api.put(`/leads/${modal.item.id}`, formData);
      } else if (modal.type === 'task') {
        if (!formData.title || !formData.description) {
          setFormError('Title and description are required');
          setFormLoading(false);
          return;
        }
        const body = { ...formData };
        if (!body.assignedTo) delete body.assignedTo;
        if (!body.dueDate) delete body.dueDate;
        if (modal.mode === 'add') await api.post('/tasks', body);
        else await api.put(`/tasks/${modal.item.id}`, body);
      }
      setModal(null);
      await fetchData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'lead') await api.delete(`/leads/${deleteConfirm.id}`);
      else if (deleteConfirm.type === 'task') await api.delete(`/tasks/${deleteConfirm.id}`);
      else if (deleteConfirm.type === 'user') await api.delete(`/users/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
      setDeleteConfirm(null);
    }
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div className="grain-overlay" />
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px', width: 28, height: 28 }} />
        <p style={{ color: 'var(--text-3)', fontFamily: 'var(--font-label)', fontSize: 10, letterSpacing: '0.2em', fontWeight: 700 }}>LOADING DASHBOARD</p>
      </div>
    </div>
  );

  const sidebarW = sidebarCollapsed ? 64 : 220;

  return (
    <div className="dashboard-shell">
      <div className="grain-overlay" />

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}
        style={{ '--sidebar-w': sidebarW + 'px' }}>
        <div className="sidebar-header">
          <div
            className="logo-wrap"
            onClick={() => { setActiveTab('Overview'); setSidebarOpen(false); }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <div style={{
              width: 32, height: 32, background: '#2563eb',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {!sidebarCollapsed && (
              <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.02em' }}>NEXUSOS</span>
            )}
          </div>
          <button className="collapse-btn" onClick={() => setSidebarCollapsed(p => !p)}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              {sidebarCollapsed
                ? <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              }
            </svg>
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {!sidebarCollapsed && (
            <div style={{ fontSize: 9, fontFamily: 'var(--font-label)', fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-3)', padding: '4px 10px 12px' }}>WORKSPACE</div>
          )}
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
              title={sidebarCollapsed ? tab : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: sidebarCollapsed ? '10px 0' : '10px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                border: 'none', background: activeTab === tab ? 'rgba(37,99,235,0.1)' : 'transparent',
                color: activeTab === tab ? 'var(--text)' : 'var(--text-3)',
                fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)',
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%',
                borderLeft: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
              }}
            >
              <NavIcon tab={tab} active={activeTab === tab} />
              {!sidebarCollapsed && tab}
            </button>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', overflow: 'hidden' }}>
              <div className="user-avatar">{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{user?.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-label)', fontWeight: 600 }}>User</div>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
        {sidebarCollapsed && (
          <div style={{ padding: '0 12px 16px', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(p => !p)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            <div>
              <h1 className="page-title">{activeTab.toUpperCase()}</h1>
              <p className="page-subtitle">
                {activeTab === 'Overview' && `Welcome back, ${user?.name?.split(' ')[0]}`}
                {activeTab === 'Leads' && `${data?.leads?.length || 0} total leads`}
                {activeTab === 'Tasks' && `${data?.tasks?.filter(t => t.status !== 'Done').length || 0} active tasks`}
                {activeTab === 'Users' && `${data?.users?.length || 0} team members`}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="user-avatar">{initials}</div>
          </div>
        </header>

        <div className="dashboard-content">
          {error && <div className="error-banner">{error}</div>}

          {activeTab === 'Overview' && data && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="stats-grid">
                <StatCard delay={0} label="Total Leads" value={data.stats.totalLeads} sub={`${data.stats.qualifiedLeads} qualified`} isBlue={false} onClick={() => setActiveTab('Leads')} />
                <StatCard delay={0.05} label="Completed Tasks" value={data.stats.completedTasks} sub={`${data.stats.pendingTasks} pending`} isBlue={true} onClick={() => setActiveTab('Tasks')} />
                <StatCard delay={0.1} label="Active Users" value={data.stats.activeUsers} sub="team members" isBlue={false} onClick={() => setActiveTab('Users')} />
                <StatCard delay={0.15} label="Revenue Pipeline" value="₹19.4L" sub={data.stats.totalRevenuePipeline} isBlue={true} onClick={() => setActiveTab('Leads')} />
              </div>

              <div className="two-col">
                <section className="card-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 className="section-title">RECENT LEADS</h2>
                    <span className="section-count">{data.leads.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {data.leads.slice(0, 4).map((lead, i) => (
                      <div key={lead.id} className="list-row" style={{ animationDelay: `${i * 0.06}s` }}>
                        <div className="list-avatar">{lead.name[0]}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="list-name">{lead.name}</div>
                          <div className="list-sub">{lead.company}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Badge label={lead.status} />
                          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-label)' }}>{lead.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="card-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 className="section-title">ACTIVE TASKS</h2>
                    <span className="section-count">{data.tasks.filter(t => t.status !== 'Done').length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {data.tasks.filter(t => t.status !== 'Done').slice(0, 4).map((task, i) => (
                      <div key={task.id} className="list-row" style={{ animationDelay: `${i * 0.06}s` }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="list-name">{task.title}</div>
                          <div className="list-sub">{task.assignee} · Due {task.due}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <Badge label={task.priority} />
                          <Badge label={task.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'Leads' && data && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button onClick={() => openAddModal('lead')} className="add-btn">+ Add Lead</button>
              </div>
              <div className="table-card">
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {['Name', 'Company', 'Email', 'Status', 'Value', 'Source', 'Date', 'Actions'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.leads.map((lead, i) => (
                        <tr key={lead.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.04}s both` }}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="list-avatar">{lead.name[0]}</div>
                              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{lead.name}</span>
                            </div>
                          </td>
                          <td>{lead.company}</td>
                          <td style={{ color: 'var(--text-3)' }}>{lead.email}</td>
                          <td><Badge label={lead.status} /></td>
                          <td style={{ fontWeight: 600, color: '#22c55e' }}>{lead.value}</td>
                          <td>{lead.source}</td>
                          <td style={{ color: 'var(--text-3)' }}>{lead.date}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="action-btn" onClick={() => openEditModal('lead', lead)} title="Edit">✏️</button>
                              <button className="action-btn delete" onClick={() => setDeleteConfirm({ type: 'lead', id: lead.id, name: lead.name })} title="Delete">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Tasks' && data && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <button onClick={() => openAddModal('task')} className="add-btn">+ Add Task</button>
              </div>
              <div className="table-card">
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {['Task', 'Assignee', 'Category', 'Priority', 'Status', 'Due Date', 'Actions'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.tasks.map((task, i) => (
                        <tr key={task.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.04}s both` }}>
                          <td><span style={{ fontWeight: 600, color: 'var(--text)' }}>{task.title}</span></td>
                          <td>{task.assignee}</td>
                          <td>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-2)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', border: '1px solid var(--border)', fontFamily: 'var(--font-label)', letterSpacing: '0.08em' }}>
                              {task.category}
                            </span>
                          </td>
                          <td><Badge label={task.priority} /></td>
                          <td><Badge label={task.status} /></td>
                          <td style={{ color: 'var(--text-3)' }}>{task.due}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="action-btn" onClick={() => openEditModal('task', task)} title="Edit">✏️</button>
                              <button className="action-btn delete" onClick={() => setDeleteConfirm({ type: 'task', id: task.id, name: task.title })} title="Delete">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Users' && data && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div className="table-card">
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {['Member', 'Email', 'Department', 'Status', 'Joined', 'Actions'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.users.map((u, i) => (
                        <tr key={u.id} style={{ animation: `fadeInUp 0.4s ease ${i * 0.04}s both` }}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div className="list-avatar">{u.name[0]}</div>
                              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-3)' }}>{u.email}</td>
                          <td>{u.department}</td>
                          <td><Badge label={u.status} /></td>
                          <td style={{ color: 'var(--text-3)' }}>{u.joined}</td>
                          <td>
                            <button className="action-btn delete" onClick={() => setDeleteConfirm({ type: 'user', id: u.id, name: u.name })} title="Delete">🗑️</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {modal && modal.type === 'lead' && (
        <Modal title={modal.mode === 'add' ? 'Add New Lead' : 'Edit Lead'} onClose={() => setModal(null)}>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {formError && <div style={{ color: '#f87171', fontSize: 12, fontFamily: 'var(--font-label)' }}>{formError}</div>}
            <FormField label="NAME"><input name="name" value={formData.name} onChange={handleFormChange} style={formInput} placeholder="Lead name" required /></FormField>
            <FormField label="EMAIL"><input name="email" type="email" value={formData.email} onChange={handleFormChange} style={formInput} placeholder="lead@example.com" required /></FormField>
            <FormField label="COMPANY"><input name="company" value={formData.company} onChange={handleFormChange} style={formInput} placeholder="Company name" required /></FormField>
            <FormField label="STATUS">
              <select name="status" value={formData.status} onChange={handleFormChange} style={formSelect}>
                {['New', 'Contacted', 'Qualified', 'Negotiation', 'Closed Won', 'Closed Lost'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="VALUE"><input name="value" value={formData.value} onChange={handleFormChange} style={formInput} placeholder="₹0" /></FormField>
            <FormField label="SOURCE"><input name="source" value={formData.source} onChange={handleFormChange} style={formInput} placeholder="Referral, LinkedIn, etc." /></FormField>
            <button type="submit" disabled={formLoading} style={{ ...formBtn, opacity: formLoading ? 0.6 : 1 }}>
              {formLoading ? 'Saving...' : (modal.mode === 'add' ? 'Add Lead' : 'Update Lead')}
            </button>
          </form>
        </Modal>
      )}

      {modal && modal.type === 'task' && (
        <Modal title={modal.mode === 'add' ? 'Add New Task' : 'Edit Task'} onClose={() => setModal(null)}>
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {formError && <div style={{ color: '#f87171', fontSize: 12, fontFamily: 'var(--font-label)' }}>{formError}</div>}
            <FormField label="TITLE"><input name="title" value={formData.title} onChange={handleFormChange} style={formInput} placeholder="Task title" required /></FormField>
            <FormField label="DESCRIPTION"><input name="description" value={formData.description} onChange={handleFormChange} style={formInput} placeholder="Task description" required /></FormField>
            <FormField label="CATEGORY"><input name="category" value={formData.category} onChange={handleFormChange} style={formInput} placeholder="General" /></FormField>
            <FormField label="STATUS">
              <select name="status" value={formData.status} onChange={handleFormChange} style={formSelect}>
                {['Pending', 'In Progress', 'Done'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="PRIORITY">
              <select name="priority" value={formData.priority} onChange={handleFormChange} style={formSelect}>
                {['Low', 'Medium', 'High', 'Critical'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="DUE DATE"><input name="dueDate" type="date" value={formData.dueDate} onChange={handleFormChange} style={formInput} /></FormField>
            <button type="submit" disabled={formLoading} style={{ ...formBtn, opacity: formLoading ? 0.6 : 1 }}>
              {formLoading ? 'Saving...' : (modal.mode === 'add' ? 'Add Task' : 'Update Task')}
            </button>
          </form>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setDeleteConfirm(null)}>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 24 }}>
            Are you sure you want to delete <strong style={{ color: 'var(--text)' }}>{deleteConfirm.name}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => setDeleteConfirm(null)} style={{ ...formBtn, background: '#353535', flex: 1 }}>Cancel</button>
            <button onClick={handleDelete} style={{ ...formBtn, background: '#ef4444', flex: 1 }}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function NavIcon({ tab, active }) {
  const color = active ? '#2563eb' : '#8d90a0';
  const icons = {
    Overview: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="0" stroke={color} strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="0" stroke={color} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="0" stroke={color} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="0" stroke={color} strokeWidth="1.8"/></svg>,
    Leads: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={color} strokeWidth="1.8"/><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></svg>,
    Tasks: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    Users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke={color} strokeWidth="1.8"/><circle cx="9" cy="7" r="4" stroke={color} strokeWidth="1.8"/></svg>,
  };
  return icons[tab] || null;
}
