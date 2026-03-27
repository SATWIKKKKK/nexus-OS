require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Task = require('./models/Task');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Lead.deleteMany();
    await Task.deleteMany();

    const users = await User.create([
      {
        name: 'Satwik Chandra',
        email: 'satwik@nexusos.com',
        password: 'satwik123',
        role: 'user',
        department: 'Engineering',
        isActive: true,
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@nexusos.com',
        password: 'rahul123',
        role: 'user',
        department: 'Sales',
        isActive: true,
      },
      {
        name: 'Priya Singh',
        email: 'priya@nexusos.com',
        password: 'priya123',
        role: 'user',
        department: 'Marketing',
        isActive: true,
      },
    ]);

    const leads = await Lead.create([
      { name: 'John Doe',      email: 'john@acmecorp.com',       company: 'Acme Corp',       status: 'Qualified',    value: '₹2,40,000', source: 'Referral'     },
      { name: 'Jane Smith',    email: 'jane@globaltech.io',      company: 'Global Tech',     status: 'Contacted',    value: '₹1,20,000', source: 'LinkedIn'     },
      { name: 'Bob Wilson',    email: 'bob@startupinc.com',      company: 'StartUp Inc',     status: 'Negotiation',  value: '₹3,60,000', source: 'Cold Outreach'},
      { name: 'Alice Brown',   email: 'alice@enterprise.in',     company: 'Enterprise Ltd',  status: 'Closed Won',   value: '₹5,00,000', source: 'Website'      },
      { name: 'Carlos Mendez', email: 'carlos@nexuspartners.com', company: 'Nexus Partners', status: 'Closed Lost',  value: '₹80,000',   source: 'Conference'   },
      { name: 'Priya Sharma',  email: 'priya@brightwave.in',     company: 'BrightWave',      status: 'New',          value: '₹4,20,000', source: 'Referral'     },
    ]);



    const [user1, user2, user3] = users;
    const now = new Date();
    const days = (n) => new Date(now.getTime() + n * 86400000);

    const tasks = await Task.create([
      {
        title: 'Update Dashboard UI',
        description: 'Redesign the main dashboard with premium dark theme components.',
        assignedTo: user1._id,
        status: 'In Progress',
        priority: 'High',
        category: 'Frontend',
        dueDate: days(3),
      },
      {
        title: 'Lead Pipeline API',
        description: 'Connect lead capture forms to the backend REST API.',
        assignedTo: user2._id,
        status: 'Pending',
        priority: 'Critical',
        category: 'Backend',
        dueDate: days(5),
      },
      {
        title: 'User Acceptance Testing',
        description: 'Conduct UAT with beta testers and collect feedback.',
        assignedTo: user3._id,
        status: 'Done',
        priority: 'Medium',
        category: 'QA',
        dueDate: days(-2),
      },
      {
        title: 'Deploy to Vercel',
        description: 'Set up production deployment pipeline on Vercel.',
        assignedTo: user1._id,
        status: 'Pending',
        priority: 'High',
        category: 'DevOps',
        dueDate: days(7),
      },
      {
        title: 'Write API Documentation',
        description: 'Document all REST endpoints using OpenAPI spec.',
        assignedTo: user2._id,
        status: 'In Progress',
        priority: 'Low',
        category: 'Documentation',
        dueDate: days(10),
      },
    ]);

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

seedData();
