const mongoose = require('mongoose');
require('dotenv').config();

const Consultant = require('./models/Consultant');

const seedConsultant = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Check if consultant already exists
    const existingConsultant = await Consultant.findOne({ name: 'Dr. Dhivyadharshini' });
    
    if (existingConsultant) {
      console.log('✅ Dr. Dhivyadharshini already exists in the database');
      console.log('Consultant ID:', existingConsultant._id);
    } else {
      // Create the consultant
      const consultant = new Consultant({
        name: 'Dr. Dhivyadharshini',
        specialization: 'BSMS',
        about: 'Siddha Medicine Specialist'
      });

      await consultant.save();
      console.log('✅ Dr. Dhivyadharshini added to the database successfully!');
      console.log('Consultant ID:', consultant._id);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedConsultant();
