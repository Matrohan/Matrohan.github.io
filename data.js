/*
  data.js - all the words on the home page live here.
  Edit this file to update your portfolio; you never need to touch the HTML.
  Blog posts live in posts.js.
*/
window.SITE = {
  name: "Rohan Mathew",
  role: "Assistant Professor (Junior) · PhD Scholar",
  affiliation: "Vellore Institute of Technology (VIT)",
  location: "Bangalore, India",
  email: "Mathewrohan21@gmail.com",
  resume: "resume.pdf",
  social: {
    linkedin: "https://linkedin.com/in/rohan-mathew-5151551a4",
    github: "https://github.com/Matrohan",
    x: "https://x.com/mathewrohan21",
    instagram: "https://www.instagram.com/rohanmathew.21/"
  },

  // The paragraph that lights up word by word as you scroll.
  statement:
    "I liked VIT enough to come back for round two. The first time was an MCA, 2022 to 2024. I was an average student with a simple plan: finish the degree and get placed in a good company. The degree part went fine. The placement part had other plans. So in 2025 I came back as a PhD scholar, teaching machines to catch Alzheimer's early. Then in June 2026 the job finally showed up, just not where I expected. I'm now an Assistant Professor (Junior) at VIT as well, so I'm a student and a teacher at the same university. Some days I write research papers. Other days I correct exam papers and finally understand why my teachers looked so tired.",

  research: [
    { title: "Predicting Alzheimer's early", tag: "PhD focus", size: "wide",
      text: "How well AI and deep learning can forecast the move from mild cognitive impairment to Alzheimer's disease, and what the models are actually looking at when they do." },
    { title: "Explainable security ML", tag: "Cybersecurity",
      text: "Stacked gradient-boosting ensembles with SHAP explanations for catching deceptive websites." },
    { title: "Multimodal learning", tag: "Methods",
      text: "Combining imaging, clinical and cognitive data in one model without losing track of what each one adds." },
    { title: "Explainable AI", tag: "Trust",
      text: "Making model decisions readable for the clinicians and analysts who have to act on them." },
    { title: "Systematic reviews", tag: "Evidence",
      text: "PICO questions, PRISMA flows and a lot of screening, so the research builds on what is already known." }
  ],

  // status: "Published" | "Presented" | "Accepted" | "Under review"
  publications: [
    { title: "Explainable Hybrid Ensemble Learning for Deceptive Website Detection with Cross-dataset Validation",
      authors: "Rohan Mathew et al.",
      venue: "6th International Conference on Soft Computing for Security Applications (ICSCSA 2026)",
      year: 2026, type: "Conference", status: "Presented", link: "" }
  ],

  // Shown under the publications as work in progress.
  writing: {
    title: "A systematic review on predicting Alzheimer's disease with AI",
    text: "I'm working through the literature on how machine learning and deep learning models predict progression from mild cognitive impairment to Alzheimer's disease: which techniques get used, which data they rely on, and where the gaps are."
  },

  experience: [
    { when: "Jun 2026 – Present", title: "Assistant Professor (Junior)", org: "Vellore Institute of Technology",
      text: "Teaching computer science students while continuing my PhD research." },
    { when: "Jul 2025 – Present", title: "PhD Research Scholar", org: "Vellore Institute of Technology",
      text: "Research on AI and deep learning for early prediction of Alzheimer's disease." },
    { when: "May – Aug 2024", title: "Data Analytics Intern", org: "GrrowUp, Noida (Remote)",
      text: "Cleaned and analysed datasets with Python and SQL, built interactive Tableau dashboards for stakeholders, and turned trends into practical suggestions for the team." }
  ],

  education: [
    { when: "2022 – 2024", title: "Master of Computer Applications", org: "Vellore Institute of Technology, Vellore",
      text: "Coursework in soft computing, big data and cloud computing.", score: "CGPA 8.20 / 10" },
    { when: "2019 – 2022", title: "Bachelor of Computer Applications", org: "B S Abdur Rahman University of Science and Technology, Chennai",
      text: "Coursework in multimedia and web application development.", score: "CGPA 8.01 / 10" }
  ],

  certifications: [
    ["Google Analytics Certification", "Google"],
    ["AWS Cloud Technical Essentials", "Coursera"],
    ["Databases and SQL for Data Science with Python", "IBM"],
    ["Introduction to Data Analysis", "IBM"],
    ["AI for All: From Basics to GenAI Practice", "NVIDIA"],
    ["Problem Solving (Basic)", "HackerRank"],
    ["Python Programming", "PrepInsta"],
    ["Java Programming", "PrepInsta"],
    ["Basic Coding", "PrepInsta"]
  ],

  // category: "ml" | "analytics" | "software"
  projects: [
    { title: "Deceptive Website Detection", category: "ml", when: "Aug 2026",
      stack: ["Gradient Boosting", "SHAP", "Python"],
      text: "An explainable ensemble classifier that flags phishing and deceptive websites. Presented at ICSCSA 2026." },
    { title: "Liver Disease Prediction", category: "ml", when: "May – Jun 2023",
      stack: ["LSTM", "Deep learning"],
      text: "An LSTM-based diagnostic system for predicting liver disease." },
    { title: "Diabetes Prediction", category: "ml", when: "Apr – May 2023",
      stack: ["Machine learning", "Python"],
      text: "Applied and compared several algorithms to predict diabetes." },
    { title: "Prescription Recognition", category: "ml", when: "Oct – Nov 2022",
      stack: ["CNN", "RNN", "LSTM"],
      text: "Automates reading prescriptions with a CNN, RNN and LSTM pipeline." },
    { title: "Fitbit Consumer Behaviour", category: "analytics", when: "Aug 2024",
      stack: ["Tableau", "Python"],
      text: "Cleaned and explored Fitbit user data, then built a Tableau dashboard of behaviour patterns to support marketing decisions." },
    { title: "Air Quality Dashboard", category: "analytics", when: "Jul 2024",
      stack: ["Tableau"],
      text: "An interactive Tableau dashboard that tells the story inside an air quality dataset." },
    { title: "Indian Cars Analysis", category: "analytics", when: "Jul 2024",
      stack: ["SQL", "Python"],
      text: "Explored car sales data and visualised it with histograms, bar charts, scatter plots and heat maps." },
    { title: "World Bank Data Viz", category: "analytics", when: "Jun 2024",
      stack: ["Python", "Plotly"],
      text: "Animated Plotly charts of global fertility and life expectancy from 1960 to 2016." },
    { title: "Bike Buyers Dashboard", category: "analytics", when: "May 2024",
      stack: ["Google Sheets"],
      text: "A Google Sheets dashboard that breaks down the patterns behind who buys bikes." },
    { title: "Deadlock Detection System", category: "software", when: "Apr – May 2023",
      stack: ["Java", "JavaFX"],
      text: "A JavaFX desktop app with a GUI for checking whether a system is in a safe state." },
    { title: "Inventory Management System", category: "software", when: "Mar – May 2023",
      stack: ["PHP", "AWS"],
      text: "A PHP inventory tracker deployed on AWS." }
  ],

  skills: {
    "Languages": ["Python", "R", "SQL", "Java", "JavaScript", "C++", "HTML & CSS"],
    "Machine learning": ["Deep learning (CNN, RNN, LSTM)", "Gradient Boosting & CatBoost", "Random Forest", "Explainable AI (SHAP)", "Statistical modelling", "Data cleaning"],
    "Data & visualisation": ["Pandas", "NumPy", "Seaborn", "Matplotlib", "Plotly", "Databricks", "Tableau", "Power BI", "Excel (advanced)"],
    "Databases & tools": ["MySQL", "NoSQL", "Snowflake", "MongoDB", "SAS", "Git", "VS Code", "Zotero"]
  }
};
