const mongoose = require('mongoose');
const Application = require('./Models/applicationModel');
const Register = require('./Models/register');
require('dotenv').config();

/**
 * Script to backfill applications that are missing applicant IDs
 * This happens when users apply before logging in with the updated system
 */

async function backfillApplications() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Find all applications
    const allApps = await Application.find({ email: { $exists: true, $ne: null } });

    console.log(`\n📊 Found ${allApps.length} applications to check`);

    if (allApps.length === 0) {
      console.log('✅ No applications found in database.');
      process.exit(0);
    }

    let fixed = 0;
    let alreadyCorrect = 0;
    let notFound = 0;

    for (const app of allApps) {
      try {
        // Try to find CURRENT user by email
        const user = await Register.findOne({ userEmail: app.email });
        
        if (user) {
          // Check if application is linked to the correct current user
          const isLinkedCorrectly = app.applicant && String(app.applicant) === String(user._id);
          
          if (isLinkedCorrectly) {
            console.log(`✅ Application ${app._id} - already linked correctly to ${user.userEmail}`);
            alreadyCorrect++;
          } else {
            // Update application with CURRENT user ID
            const oldApplicant = app.applicant;
            app.applicant = user._id;
            app.applicantId = String(user._id);
            app.userId = user._id;
            if (!app.userName && user.userFirstName) {
              app.userName = `${user.userFirstName} ${user.userLastName || ''}`.trim();
            }
            await app.save();
            
            console.log(`🔄 Fixed application ${app._id}`);
            console.log(`   Email: ${app.email}`);
            console.log(`   Old applicant: ${oldApplicant || 'null'}`);
            console.log(`   New applicant: ${user._id}`);
            console.log(`   ✅ Now linked to current user!`);
            fixed++;
          }
        } else {
          console.log(`⚠️  No user found for email: ${app.email} (Application ${app._id})`);
          notFound++;
        }
      } catch (err) {
        console.error(`❌ Error fixing application ${app._id}:`, err.message);
      }
    }

    console.log(`\n📈 Summary:`);
    console.log(`   ✅ Fixed: ${fixed} applications`);
    console.log(`   ✓  Already correct: ${alreadyCorrect} applications`);
    console.log(`   ⚠️  Not found: ${notFound} applications (no matching user)`);
    console.log(`   📊 Total processed: ${allApps.length}`);

    if (fixed > 0) {
      console.log('\n✅ Backfill complete! Applications are now linked to CURRENT users.');
      console.log('💡 Users can now see their applications in their profile.');
    } else if (alreadyCorrect > 0) {
      console.log('\n✅ All applications are already linked correctly!');
    }

  } catch (err) {
    console.error('❌ Error during backfill:', err);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
backfillApplications();
