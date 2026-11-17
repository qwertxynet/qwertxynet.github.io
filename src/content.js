// ─────────────────────────────────────────────────────────────
//  Everything you'd want to edit lives in this one file.
// ─────────────────────────────────────────────────────────────

export const site = {
  handle: 'QWERTXY',
  name: 'Mohammed Alkarkhy',
  tagline: 'Creative, professional work designed to solve problems.',
  role: 'Creative coder & designer',
  github: 'qwertxynet',
};

// Words that scroll across the chrome ribbon under the hero.
export const marquee = [
  'Computer engineering',
  'Client websites',
  'CAD',
  'Robotics',
  'Web apps',
  'Games',
  'Learning tools',
  'Interface design',
  'React',
  'TypeScript',
  'Godot',
  'Problem solving',
];

// Projects are pulled live from github.com/<site.github>.
export const projects = {
  intro: 'Client work and personal projects: things I have designed, coded and shipped.',
  // Client / professional work, always shown first (these aren't public repos).
  client: [
    {
      name: 'sandiego-direct',
      title: 'San Diego Direct',
      role: 'Website developer',
      description:
        'Website and operations platform for a San Diego furniture delivery, assembly and haul-away company: instant price quotes and booking requests for customers, plus private dispatcher and driver tools with route planning, live maps and push alerts.',
      language: 'TypeScript',
      stack: ['React', 'TypeScript', 'Supabase', 'Cloudflare'],
      live: 'https://sandiego.direct',
    },
  ],
  // Shown first, in this order. Any other public repos follow, newest first.
  featured: ['niyyah', 'conversation-cafe', 'qahwa', 'amthal', 'cook', 'drop-in'],
  // Public repos to leave off the portfolio.
  hide: ['lab4-shaonmo'],
  // Nicer display names (otherwise "my-repo" becomes "My Repo").
  titles: {
    'conversation-cafe': 'Conversation Café',
    'drop-in': 'Drop-In',
  },
  // Used only if the GitHub API can't be reached (offline, rate limit).
  fallback: [
    { name: 'niyyah', description: 'Offline-first Islamic prayer companion for ADHD — one React + TypeScript codebase for Android, Windows and the browser.', language: 'TypeScript', stars: 0, updated: '2026-11-11', live: true },
    { name: 'conversation-cafe', description: 'Conversation café on the Arab majlis: three timed sessions for learners of Arabic', language: 'JavaScript', stars: 0, updated: '2026-11-17', live: true },
    { name: 'qahwa', description: 'ألعاب المقهى: الشطرنج والطاولي والدومينو في المقهى العراقي — موقع لتعلّم العربية', language: 'JavaScript', stars: 0, updated: '2026-11-16', live: true },
    { name: 'amthal', description: 'حكايات الأمثال — Arabic proverbs learning site', language: 'JavaScript', stars: 0, updated: '2026-11-16', live: true },
    { name: 'cook', description: 'A retro cooking-show app: swipe to cook, chef shows, and plates', language: 'JavaScript', stars: 0, updated: '2026-11-16', live: true },
    { name: 'drop-in', description: '3D skateboarding rhythm game prototype in Godot', language: 'GDScript', stars: 0, updated: '2026-11-11', live: false },
  ],
};

export const about = {
  bio: [
    "I'm Mohammed, Qwertxy online: a computer engineer who designs and builds things that solve real problems, and I care just as much about how they look and feel as how they work.",
    'I attended Cal Poly San Luis Obispo for Computer Engineering in 2025. Before that I was lead programmer for Matador Mechanics, my high school’s FIRST Tech Challenge robotics team.',
    'Today I build for clients and for myself: I am the website developer for San Diego Direct, and I make Arabic-learning sites, an offline-first prayer companion, a retro cooking-show app and a skateboarding rhythm game in Godot.',
  ],
  education: {
    school: 'Cal Poly San Luis Obispo',
    program: 'Computer Engineering',
    year: '2025',
    courses: ['Introduction to Computer Engineering', 'Discrete Structures', 'Data Structures', 'Digital Design'],
  },
  skills: {
    Code: ['React', 'TypeScript', 'JavaScript', 'Python', 'C++', 'Java'],
    'Web & data': ['Vite', 'Supabase', 'Cloudflare', 'Tailwind'],
    Engineering: ['Onshape CAD', 'Technical drawing', 'G-code / CNC', 'Robot programming'],
    Games: ['Godot', 'GDScript', '3D & rhythm'],
    Design: ['UI / UX', 'Photoshop', 'Illustrator', 'Lightroom'],
    Languages: ['English', 'Arabic', 'Spanish'],
  },
  now: [
    ['Building', 'San Diego Direct'],
    ['Making', 'Games & learning tools'],
    ['Studied', 'Computer Engineering, Cal Poly'],
  ],
};

export const contact = {
  away: 'Got a problem worth solving or an idea worth shipping? Send it my way.',
  // Add more rows: { label: 'Email', handle: 'you@example.com', href: 'mailto:you@example.com', icon: 'mail' }
  links: [
    { label: 'GitHub', handle: '@qwertxynet', href: 'https://github.com/qwertxynet', icon: 'github' },
    { label: 'Buy Me a Coffee', handle: 'buymeacoffee.com/qwertxy', href: 'https://buymeacoffee.com/qwertxy', icon: 'coffee', tone: 'coffee' },
  ],
  // Shown as a glossy coffee button in Contact and the footer.
  coffee: { label: 'Buy me a coffee', href: 'https://buymeacoffee.com/qwertxy' },
};
