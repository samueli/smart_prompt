export interface NavItem {
  title: string
  href: string
}

export interface Message {
  [key: string]: any
  Header: {
    login: string
    home: string
    prompts: string
    optimizer: string
    plugins: string
  }
  Hero: {
    title: string
    description: string
    getStarted: string
    documentation: string
  }
  Common: {
    switchLanguage: string
    currentLanguage: string
  }
  QuickStart: {
    title: string
    description: string
    createPrompt: string
    learnMore: string
  }
  Features: {
    title: string
    description: string
    collection: string
    collectionDesc: string
    optimization: string
    optimizationDesc: string
    tags: string
    tagsDesc: string
    multilingual: string
    multilingualDesc: string
    darkMode: string
    darkModeDesc: string
    settings: string
    settingsDesc: string
  }
  FAQ: {
    title: string
    description: string
    q1: {
      question: string
      answer: string
    }
    q2: {
      question: string
      answer: string
    }
    q3: {
      question: string
      answer: string
    }
    q4: {
      question: string
      answer: string
    }
  }
  Footer: {
    rights: string
    privacy: string
    terms: string
  }
  Prompts: {
    title: string
    description: string
    new: string
    search: string
    noResults: string
    tags: string
    addTag: string
  }
  Optimizer: {
    input: string
    inputPlaceholder: string
    direction: string
    clarity: string
    creativity: string
    precision: string
    optimize: string
    optimizing: string
    output: string
  }
  Settings: {
    token: string
    tokenPlaceholder: string
    generate: string
    notifications: string
    save: string
  }
  Plugins: {
    title: string
    description: string
    downloadText: string
    browsers: {
      chrome: string
      firefox: string
      edge: string
    }
    features: {
      quickAccess: {
        title: string
        description: string
      }
      contextMenu: {
        title: string
        description: string
      }
      sync: {
        title: string
        description: string
      }
      collect: {
        title: string
        description: string
      }
      optimize: {
        title: string
        description: string
      }
    }
    installation: {
      title: string
      steps: {
        1: string
        2: string
        3: string
        4: string
      }
    }
    cta: {
      title: string
      description: string
    }
  }
  logo: {
    alt: string
  }
}

export interface LocaleMessages {
  [locale: string]: Message
}