const Lead = require('../models/Lead');
const Task = require('../models/Task');
const User = require('../models/User');

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const getDashboardData = async (req, res) => {
  try {
    const leadsRaw = await Lead.find().sort({ createdAt: -1 });
    const tasksRaw = await Task.find()
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    const usersRaw = await User.find().sort({ createdAt: -1 });

    const leads = leadsRaw.map((l) => ({
      id: l._id.toString(),
      name: l.name,
      email: l.email,
      company: l.company,
      status: l.status,
      value: l.value || '—',
      source: l.source || '—',
      date: formatDate(l.createdAt),
    }));

    const tasks = tasksRaw.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      assignee: t.assignedTo?.name || 'Unassigned',
      category: t.category || 'General',
      priority: t.priority,
      status: t.status,
      due: t.dueDate ? formatDate(t.dueDate) : 'No deadline',
    }));

    const users = usersRaw.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: capitalize(u.role),
      department: u.department || 'General',
      status: u.isActive !== false ? 'Active' : 'Inactive',
      joined: formatDate(u.createdAt),
    }));

    const stats = {
      totalLeads: leads.length,
      qualifiedLeads: leads.filter((l) => l.status === 'Qualified' || l.status === 'Negotiation').length,
      completedTasks: tasks.filter((t) => t.status === 'Done').length,
      pendingTasks: tasks.filter((t) => t.status === 'Pending').length,
      activeUsers: users.filter((u) => u.status === 'Active').length,
      totalRevenuePipeline: `${leads.length} leads tracked`,
    };

    res.json({ data: { stats, leads, tasks, users } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardData,
};
