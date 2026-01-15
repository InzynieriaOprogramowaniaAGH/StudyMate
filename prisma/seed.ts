import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // ----- USERS -----
  const passwordHash = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob Smith",
      email: "bob@example.com",
      password: passwordHash,
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@juwekrk.pl" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@juwekrk.pl",
      password: passwordHash,
    },
  });

  console.log("✅ Users created:", { user1: user1.email, user2: user2.email, admin: adminUser.email });

  // ----- NOTES -----
  const note1 = await prisma.note.create({
    data: {
      title: "Photosynthesis Overview",
      content:
        "Photosynthesis is the process by which green plants convert light energy into chemical energy. It involves chlorophyll and occurs in chloroplasts.",
      userId: user1.id,
    },
  });

  const note2 = await prisma.note.create({
    data: {
      title: "Newton's Laws of Motion",
      content:
        "Newton's First Law: An object in motion stays in motion unless acted upon by an external force.",
      userId: user2.id,
    },
  });

  // 15 rzetelnych notatek dla admin@juwekrk.pl
  const adminNotes = await prisma.note.createMany({
    data: [
      {
        title: "Machine Learning Fundamentals",
        subject: "Computer Science",
        description: "Introduction to ML concepts including supervised and unsupervised learning",
        content: `Machine Learning is a subset of Artificial Intelligence that focuses on systems that can learn from data. Key concepts:
- Supervised Learning: Learning from labeled data (regression, classification)
- Unsupervised Learning: Finding patterns in unlabeled data (clustering, dimensionality reduction)
- Reinforcement Learning: Learning through interaction and rewards
- Neural Networks: Inspired by biological neurons, used in deep learning
- Feature Engineering: Creating meaningful features for better model performance
- Model Evaluation: Using metrics like accuracy, precision, recall, F1-score
- Overfitting and Underfitting: Key challenges in model training`,
        userId: adminUser.id,
      },
      {
        title: "Python Data Science Stack",
        subject: "Computer Science",
        description: "Essential Python libraries for data science: NumPy, Pandas, Matplotlib, Scikit-learn",
        content: `The Python Data Science Stack consists of powerful libraries:
- NumPy: Numerical computing with N-dimensional arrays
- Pandas: Data manipulation and analysis with DataFrames
- Matplotlib: Data visualization and plotting
- Seaborn: Statistical data visualization
- Scikit-learn: Machine learning algorithms and tools
- TensorFlow/PyTorch: Deep learning frameworks
Each library plays a crucial role in data processing, analysis, and modeling workflows.`,
        userId: adminUser.id,
      },
      {
        title: "Web Development with React",
        subject: "Computer Science",
        description: "Frontend framework for building interactive user interfaces",
        content: `React is a JavaScript library for building user interfaces with reusable components.
Key Concepts:
- Components: Functional and class components
- JSX: Syntax extension that looks like HTML
- Props: Passing data between components
- State: Managing component data
- Hooks: useState, useEffect, useContext, useReducer
- Virtual DOM: Efficient updates and rendering
- React Router: Client-side routing
- State Management: Context API, Redux, Zustand`,
        userId: adminUser.id,
      },
      {
        title: "Calculus I: Limits and Derivatives",
        subject: "Mathematics",
        description: "Foundation concepts for calculus including limits, continuity, and derivatives",
        content: `Calculus fundamentals for understanding rates of change:
- Limits: Understanding behavior of functions near specific points
- Continuity: Functions without breaks or jumps
- Derivatives: Rate of change at a point, slope of tangent line
- Power Rule: (x^n)' = n*x^(n-1)
- Product Rule: (f*g)' = f'*g + f*g'
- Chain Rule: (f(g(x)))' = f'(g(x))*g'(x)
- Applications: Optimization, motion analysis, related rates
- Critical Points: Finding maxima and minima`,
        userId: adminUser.id,
      },
      {
        title: "Organic Chemistry: Functional Groups",
        subject: "Chemistry",
        description: "Understanding functional groups and their reactions in organic chemistry",
        content: `Functional groups are specific groups of atoms that determine the chemical properties:
- Alkenes (C=C): Double bond, responsible for addition reactions
- Alkynes (C≡C): Triple bond, highly reactive
- Alcohols (-OH): Polar, can form hydrogen bonds
- Aldehydes and Ketones (C=O): Carbonyl group, susceptible to nucleophilic attack
- Carboxylic Acids (-COOH): Acidic, can lose proton
- Amines (-NH2): Basic, can accept proton
- Esters: Products of esterification, important in biology
- Aromatic Rings: Benzene and related compounds, stable due to resonance`,
        userId: adminUser.id,
      },
      {
        title: "Genetics: DNA and Heredity",
        subject: "Biology",
        description: "Molecular basis of genetics, DNA structure, and inheritance patterns",
        content: `Genetics is the study of heredity and genes:
- DNA Structure: Double helix with adenine, thymine, guanine, cytosine
- Central Dogma: DNA → RNA → Protein
- Replication: Semi-conservative mechanism ensuring accuracy
- Transcription: DNA to mRNA in the nucleus
- Translation: mRNA to protein in ribosomes
- Mendelian Inheritance: Laws of segregation and independent assortment
- Mutations: Point mutations, insertions, deletions
- Gene Expression: How genes are turned on and off`,
        userId: adminUser.id,
      },
      {
        title: "World War II: Major Events and Impact",
        subject: "History",
        description: "Key events, causes, and consequences of World War II (1939-1945)",
        content: `World War II (1939-1945) was a global conflict with lasting consequences:
- Causes: Treaty of Versailles, rise of totalitarianism, economic depression
- Key Events: Invasion of Poland, Pearl Harbor, D-Day, Holocaust
- Major Powers: Axis (Germany, Italy, Japan) vs Allies (UK, USSR, USA)
- Holocaust: Systematic genocide of six million Jews and millions of others
- Pacific Theater: Island-hopping campaign against Japan
- European Theater: From D-Day to German surrender
- Atomic Bombs: Hiroshima and Nagasaki, 1945
- Outcome: Formation of United Nations, Cold War beginning`,
        userId: adminUser.id,
      },
      {
        title: "Shakespeare's Hamlet: Themes and Analysis",
        subject: "Literature",
        description: "Deep dive into themes of madness, revenge, and mortality in Hamlet",
        content: `Hamlet is one of Shakespeare's most complex and analyzed tragedies:
- Main Theme: Madness (real and feigned)
- Central Plot: Revenge for father's murder
- Key Characters: Hamlet, Claudius, Gertrude, Ophelia, Laertes
- Famous Soliloquies: "To be or not to be" - exploring existence and death
- Themes: Indecision, corruption, mortality, appearance vs reality
- Symbolism: The ghost as manifestation of guilt, the play-within-the-play
- Language: Use of wordplay, metaphor, and dramatic irony
- Tragic Ending: Multiple deaths in the final scene`,
        userId: adminUser.id,
      },
      {
        title: "Economics: Supply, Demand, and Market Equilibrium",
        subject: "Economics",
        description: "Fundamental economic principles governing market behavior",
        content: `Economics studies how resources are allocated:
- Supply: Quantity of goods producers willing to offer at different prices
- Demand: Quantity consumers willing to buy at different prices
- Law of Supply: Higher price → greater quantity supplied
- Law of Demand: Higher price → lower quantity demanded
- Market Equilibrium: Where supply equals demand
- Price Elasticity: Responsiveness of quantity to price changes
- Microeconomics: Individual actors and markets
- Macroeconomics: Aggregate economy, inflation, unemployment
- Opportunity Cost: What you give up to get something else`,
        userId: adminUser.id,
      },
      {
        title: "Psychology: Cognitive Development (Piaget)",
        subject: "Psychology",
        description: "Piaget's theory of cognitive development through childhood stages",
        content: `Jean Piaget proposed four stages of cognitive development:
- Sensorimotor (0-2 years): Learning through senses and actions
  * Object permanence develops
  * Reflexive to goal-directed behavior
- Preoperational (2-7 years): Symbolic thought and language
  * Egocentrism: difficulty taking others' perspectives
  * Conservation tasks: not understanding quantity conservation
- Concrete Operational (7-11 years): Logical thinking with concrete objects
  * Can perform mental operations
  * Understanding of conservation
- Formal Operational (12+ years): Abstract reasoning
  * Hypothetical-deductive reasoning
  * Complex problem-solving`,
        userId: adminUser.id,
      },
      {
        title: "Music Theory: Scales and Intervals",
        subject: "Music",
        description: "Foundation of music theory including scales, notes, and harmonic intervals",
        content: `Music theory provides the language for understanding music:
- Notes: Twelve chromatic notes in Western music
- Scales: Patterns of notes (major, minor, pentatonic)
- Intervals: Distance between two notes measured in semitones
- Major Scale: Whole-whole-half-whole-whole-whole-half pattern
- Minor Scale: Natural, harmonic, and melodic variants
- Harmony: Vertical combination of notes (chords)
- Triads: Three-note chords (major, minor, diminished, augmented)
- Chord Progressions: Common sequences like I-IV-V-I
- Tonality: Musical center and key signature`,
        userId: adminUser.id,
      },
      {
        title: "Spanish Language: Present Tense Verbs",
        subject: "Languages",
        description: "Regular and irregular Spanish verbs in present indicative tense",
        content: `Spanish Present Tense Conjugation:
- Regular -AR verbs (hablar - to speak)
  * yo hablo, tú hablas, él/ella habla, nosotros hablamos, vosotros habláis, ellos hablan
- Regular -ER verbs (comer - to eat)
  * yo como, tú comes, él/ella come, nosotros comemos, vosotros coméis, ellos comen
- Regular -IR verbs (vivir - to live)
  * yo vivo, tú vives, él/ella vive, nosotros vivimos, vosotros vivís, ellos viven
- Irregular verbs: Ser, estar, tener, ir, poder, querer, saber, deber
- Stem-changing verbs: e→ie, o→ue, e→i
- Applications: Present actions, habits, general truths`,
        userId: adminUser.id,
      },
      {
        title: "Art History: Renaissance Period (14th-17th century)",
        subject: "Art",
        description: "Major characteristics, artists, and works of the Renaissance era",
        content: `The Renaissance marked rebirth of classical learning and humanism:
- Time Period: 14th-17th centuries, beginning in Italy
- Characteristics: Perspective, anatomy, chiaroscuro, individualism
- Key Artists: Leonardo da Vinci, Michelangelo, Raphael, Botticelli
- Major Works:
  * Mona Lisa: Psychology and enigmatic smile
  * David: Perfect human form by Michelangelo
  * The Birth of Venus: Beauty and classical mythology
  * Sistine Chapel Ceiling: Epic religious narrative
- Techniques: Linear perspective, sfumato (smoke-like blending)
- Patrons: Medici family, papal church
- Legacy: Foundation of modern Western art`,
        userId: adminUser.id,
      },
      {
        title: "Physics: Newton's Laws of Motion",
        subject: "Physics",
        description: "Fundamental principles explaining motion, force, and acceleration",
        content: `Newton's Three Laws of Motion form the foundation of classical mechanics:
- First Law (Inertia): Object at rest stays at rest, object in motion stays in motion unless acted upon by external force
- Second Law (F=ma): Force equals mass times acceleration; acceleration is proportional to force
- Third Law (Action-Reaction): For every action, there is equal and opposite reaction
- Applications:
  * Predicting projectile motion
  * Understanding friction and air resistance
  * Calculating rocket propulsion
  * Analyzing collisions and momentum
- Limitations: Fails at quantum scales and extreme velocities (needs relativity)`,
        userId: adminUser.id,
      },
      {
        title: "Environmental Science: Climate Change",
        subject: "Science",
        description: "Causes, effects, and solutions for global climate change",
        content: `Climate change is driven by greenhouse gas accumulation:
- Greenhouse Effect: CO2, methane trap heat in atmosphere
- Causes: Fossil fuel combustion, deforestation, industrial processes
- Evidence: Rising temperatures, melting ice caps, sea level rise, extreme weather
- Global Warming: Average temperature increase of ~1.1°C since pre-industrial
- Impacts:
  * Ocean acidification threatening marine ecosystems
  * Desertification and drought in vulnerable regions
  * Species extinction and habitat loss
  * Agricultural disruption and food security concerns
- Solutions: Renewable energy, reforestation, carbon pricing, sustainable practices
- Individual Actions: Reduce consumption, support clean energy, education`,
        userId: adminUser.id,
      },
    ],
  });

  console.log("📝 Notes added: 17 total (2 test + 15 for admin@juwekrk.pl)");

  // ----- FLASHCARDS -----
  await prisma.flashcard.createMany({
    data: [
      {
        front: "What is the main pigment in photosynthesis?",
        back: "Chlorophyll",
        userId: user1.id,
      },
      {
        front: "Newton's Third Law states?",
        back: "For every action, there is an equal and opposite reaction.",
        userId: user2.id,
      },
    ],
  });

  console.log("🎴 Flashcards added");

  // ----- QUIZZES -----
  await prisma.quiz.createMany({
  data: [
    {
      title: "Photosynthesis Quiz",
      score: 85,
      userId: user1.id,
    },
    {
      title: "Physics Fundamentals Quiz",
      score: 90,
      userId: user2.id,
    },
  ],
});


  console.log("🧠 Quizzes added");

  // ----- PROGRESS -----
  await prisma.progress.createMany({
  data: [
    {
      userId: user1.id,
      quizzesTaken: 3,
      flashcardsReviewed: 15,
    },
    {
      userId: user2.id,
      quizzesTaken: 1,
      flashcardsReviewed: 10,
    },
  ],
});


  console.log("📈 Progress records added");

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
