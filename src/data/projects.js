// ═══════════════════════════════════════════════════════
// src/data/projects.js
//
// ✏️ HOW TO ADD A NEW PROJECT:
//   1. Copy one of the objects below
//   2. Paste it at the top of the array (shows first)
//   3. Fill in your own title, description, tech, links
//   4. Pick a category from: "AI", "ML", "Web", "Security"
//   5. Save — the site updates automatically in dev mode
// ═══════════════════════════════════════════════════════

export const projects = [
  {
    id: 0,
    title: "VOX — Sign Language to Text",
    emoji: "🤟",
    category: ["AI", "ML", "Web"],        // used for filter buttons
    shortDesc: "Real-time sign language translation using computer vision & React.",
    fullDesc:
      "A real-time sign language translation system developed as a collaborative project. Contributed to frontend development using React.js and supported backend API integration to enable real-time gesture-to-text translation. The system uses CV models to detect and interpret hand gestures, making communication more accessible.",
    tech: ["React.js", "Python", "Computer Vision", "Machine Learning", "REST API"],
    github: "https://github.com/Rounak75",
    demo: "#",                             // ✏️ Replace with your live URL
    date: "Aug 2025",
    featured: true,                        // shows a 'Featured' badge
  },
  {
    id: 1,
    title: "Cyber Sentinel",
    emoji: "🛡️",
    category: ["Security", "Web"],
    shortDesc: "CCTV cybersecurity platform with threat visualisation dashboards.",
    fullDesc:
      "Developed frontend dashboards for a CCTV cybersecurity platform, enabling visualization of vulnerabilities, threat alerts, and real-time risk analysis. Implemented responsive UI components and integrated APIs using React.js, JavaScript, HTML, and CSS to improve usability and performance.",
    tech: ["React.js", "JavaScript", "HTML", "CSS", "API Integration"],
    github: "https://github.com/Rounak75",
    demo: "#",
    date: "Nov 2025",
    featured: true,
  },
  {
    id: 2,
    title: "AI Chatbot with NLP",
    emoji: "💬",
    category: ["AI", "ML"],
    shortDesc: "Context-aware conversational agent built with Python and NLP.",
    fullDesc:
      "An intelligent conversational agent with intent recognition, context tracking, and multi-turn dialogue management. Trained to handle domain-specific queries with high accuracy using NLTK and custom ML pipelines.",
    tech: ["Python", "NLP", "NLTK", "Flask", "Machine Learning"],
    github: "https://github.com/Rounak75",
    demo: "#",
    date: "2025",
    featured: false,
  },
  {
    id: 3,
    title: "ML Prediction Model",
    emoji: "📊",
    category: ["ML"],
    shortDesc: "End-to-end supervised ML pipeline with feature engineering & eval.",
    fullDesc:
      "A supervised machine learning pipeline for predictive analytics. Features data ingestion, preprocessing, feature engineering, model training across multiple algorithms, hyperparameter tuning, and visualised evaluation metrics via a Jupyter dashboard.",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib"],
    github: "https://github.com/Rounak75",
    demo: "#",
    date: "2025",
    featured: false,
  },
  {
    id: 4,
    title: "Full Stack Django App",
    emoji: "🌐",
    category: ["Web"],
    shortDesc: "Django REST backend + React frontend with JWT auth & PostgreSQL.",
    fullDesc:
      "A complete web application with a Django REST backend and React frontend. Includes JWT authentication, CRUD operations, relational database design with PostgreSQL, and a fully responsive UI. Demonstrates clean separation of concerns and modern API-first architecture.",
    tech: ["Django", "React", "PostgreSQL", "REST API", "JWT Auth"],
    github: "https://github.com/Rounak75",
    demo: "#",
    date: "2025",
    featured: false,
  },
  {
    id: 5,
    title: "AI Automation Tool",
    emoji: "⚡",
    category: ["AI"],
    shortDesc: "Python-powered automation platform with configurable AI pipelines.",
    fullDesc:
      "An intelligent automation platform using AI models to streamline repetitive digital workflows. Features a Python API for building configurable pipelines, integration with external services, and a monitoring dashboard for tracking task performance.",
    tech: ["Python", "TensorFlow", "Automation", "REST API"],
    github: "https://github.com/Rounak75",
    demo: "#",
    date: "2025",
    featured: false,
  },
];

// ✏️ Filter categories shown in the filter bar
// To add a new filter, just add a string here
export const filterCategories = ["All", "AI", "ML", "Web", "Security"];
