const { Sequelize } = require('sequelize');
const { Note } = require('./models');

async function seed() {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Database connected to:', process.env.DATABASE_URL);

    // Clear existing data to avoid duplicates on re-seed
    await Note.destroy({ where: {} });

    const notesData = [
      {
        title: 'Welcome to Notes App',
        content: 'This is your first note. Feel free to edit or delete it.',
      },
      {
        title: 'Meeting Reminder',
        content: 'Discuss project timeline with team at 3 PM tomorrow.',
      },
      {
        title: 'Shopping List',
        content: 'Buy milk, eggs, bread, and fruits.',
      },
    ];

    const createdNotes = [];
    for (const noteData of notesData) {
      const note = await Note.create(noteData);
      createdNotes.push(note);
    }

    console.log(`Successfully seeded ${createdNotes.length} notes:`);
    createdNotes.forEach((note, index) => {
      console.log(`  ${index + 1}. ID: ${note.id}, Title: "${note.title}"`);
    });
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

seed();