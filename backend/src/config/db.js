const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS so mongodb+srv lookups work through VPNs / Cloudflare WARP
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connectDB;
