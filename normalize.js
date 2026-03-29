const mongoose = require('mongoose');
require('dotenv').config();

const normalizeCode = (code) => code?.trim().toUpperCase().replace(/[-\s]/g, '');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected!');

    const subjects = await mongoose.connection.collection('subjects').find({
      codeNormalized: { $exists: false }
    }).toArray();

    console.log(`📦 Found ${subjects.length} new subjects to normalize...`);

    if (subjects.length === 0) {
      console.log('✅ Nothing to do! All subjects already normalized!');
      mongoose.disconnect();
      return;
    }

    let updated = 0;
    for (const subject of subjects) {
      const codeNormalized = normalizeCode(subject.code);
      await mongoose.connection.collection('subjects').updateOne(
        { _id: subject._id },
        { $set: { codeNormalized } }
      );
      updated++;
    }

    console.log(`✅ Done! ${updated} new subjects normalized!`);
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Error:', err));