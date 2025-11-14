const mongoose = require('mongoose');
const Application = require('./Models/applicationModel');
const Register = require('./Models/register');
require('dotenv').config();

/**
 * Debug script to check applications and user IDs
 */

async function debugApplications() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB\n');

    // Get all applications
    const allApps = await Application.find({}).limit(10);
    console.log(`📊 Total applications in database: ${await Application.countDocuments()}`);
    console.log(`📋 Showing first ${allApps.length} applications:\n`);

    for (const app of allApps) {
      console.log(`Application ID: ${app._id}`);
      console.log(`  Email: ${app.email}`);
      console.log(`  Name: ${app.name}`);
      console.log(`  Applicant (ObjectId): ${app.applicant || 'null'}`);
      console.log(`  ApplicantId (String): ${app.applicantId || 'null'}`);
      console.log(`  UserId: ${app.userId || 'null'}`);
      console.log(`  Status: ${app.status}`);
      console.log(`  Job ID: ${app.jobId}`);
      console.log(`  JobTitle (cached): ${app.jobTitle || 'not set'}`);
      console.log(`  CompanyName (cached): ${app.companyName || 'not set'}`);
      console.log(`---`);
    }

    // Get all users
    console.log(`\n👥 Users in database:\n`);
    const users = await Register.find({}).select('_id userEmail userFirstName userLastName').limit(10);
    for (const user of users) {
      console.log(`User ID: ${user._id}`);
      console.log(`  Email: ${user.userEmail}`);
      console.log(`  Name: ${user.userFirstName} ${user.userLastName}`);
      console.log(`---`);
    }

    // Try to match applications to users by email
    console.log(`\n🔗 Matching applications to users:\n`);
    for (const app of allApps) {
      const user = await Register.findOne({ userEmail: app.email });
      if (user) {
        const match = String(app.applicant) === String(user._id);
        console.log(`✅ Application ${app._id.toString().substring(0, 8)}... → User ${user._id.toString().substring(0, 8)}... (${user.userEmail})`);
        console.log(`   Linked correctly: ${match ? '✅ YES' : '❌ NO'}`);
        if (!match) {
          console.log(`   Current applicant: ${app.applicant}`);
          console.log(`   Should be: ${user._id}`);
        }
      } else {
        console.log(`❌ Application ${app._id.toString().substring(0, 8)}... → No user found for ${app.email}`);
      }
    }

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
debugApplications();
