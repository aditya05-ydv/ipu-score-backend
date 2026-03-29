const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected!');
    
    const result = await mongoose.connection.collection('subjects').updateMany(
      {},
      {
        $unset: {
          addedBy:  "",
          votes:    "",
          verified: "",
        }
      }
    );
    
    console.log(`✅ Cleaned ${result.modifiedCount} documents!`);
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ Error:', err));
