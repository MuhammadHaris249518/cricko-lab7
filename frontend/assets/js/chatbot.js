// ===== CRICKO CHATBOT =====

class CricketBot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.init();
  }

  init() {
    this.createChatbotHTML();
    this.setupEventListeners();
    this.addWelcomeMessage();
  }

  createChatbotHTML() {
    const chatbotHTML = `
      <div id="cricket-chatbot" class="cricket-chatbot">
        <div class="chatbot-header">
          <div class="chatbot-title">
            <i class="fas fa-robot"></i>
            <span>CRICKO Bot</span>
          </div>
          <button id="chatbot-close" class="chatbot-close" aria-label="Close chatbot">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div id="chatbot-messages" class="chatbot-messages">
          <!-- Messages appear here -->
        </div>
        <div class="chatbot-input-area">
          <input 
            type="text" 
            id="chatbot-input" 
            placeholder="Ask me anything..." 
            class="chatbot-input"
            autocomplete="off"
          />
          <button id="chatbot-send" class="chatbot-send" aria-label="Send message">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      <button id="chatbot-toggle" class="chatbot-toggle" aria-label="Open chatbot" title="Chat with CRICKO Bot">
        <i class="fas fa-comments"></i>
      </button>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  setupEventListeners() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    toggleBtn?.addEventListener('click', () => this.toggleChatbot());
    closeBtn?.addEventListener('click', () => this.closeChatbot());
    sendBtn?.addEventListener('click', () => this.sendMessage());
    input?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChatbot() {
    this.isOpen ? this.closeChatbot() : this.openChatbot();
  }

  openChatbot() {
    const chatbot = document.getElementById('cricket-chatbot');
    const toggle = document.getElementById('chatbot-toggle');
    if (chatbot) {
      chatbot.classList.add('open');
      this.isOpen = true;
      toggle?.classList.add('hidden');
      document.getElementById('chatbot-input')?.focus();
    }
  }

  closeChatbot() {
    const chatbot = document.getElementById('cricket-chatbot');
    const toggle = document.getElementById('chatbot-toggle');
    if (chatbot) {
      chatbot.classList.remove('open');
      this.isOpen = false;
      toggle?.classList.remove('hidden');
    }
  }

  addMessage(text, sender = 'bot', isHTML = false) {
    const messagesDiv = document.getElementById('chatbot-messages');
    if (!messagesDiv) return;

    const messageEl = document.createElement('div');
    messageEl.className = `chatbot-message ${sender}-message`;

    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    
    if (isHTML) {
      contentEl.innerHTML = text;
    } else {
      contentEl.textContent = text;
    }

    messageEl.appendChild(contentEl);
    messagesDiv.appendChild(messageEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  addWelcomeMessage() {
    setTimeout(() => {
      this.addMessage("🏏 Welcome to CRICKO! I'm here to help. Ask me about tournaments, players, schedules, or anything else!", 'bot');
    }, 500);
  }

  sendMessage() {
    const input = document.getElementById('chatbot-input');
    if (!input || !input.value.trim()) return;

    const userMessage = input.value.trim();
    this.addMessage(userMessage, 'user');
    input.value = '';

    // Simulate bot typing
    setTimeout(() => {
      const response = this.getBotResponse(userMessage.toLowerCase());
      this.addMessage(response, 'bot', true);
    }, 800);
  }

  getBotResponse(userInput) {
    const responses = {
      greetings: {
        keywords: ['hi', 'hello', 'hey', 'greetings'],
        responses: [
          "🙋 Hello! Welcome to CRICKO. How can I help you today?",
          "👋 Hi there! Looking for info about tournaments, players, or schedules?"
        ]
      },
      tournament: {
        keywords: ['tournament', 'season', 'event', 'league', 'match', 'game'],
        responses: [
          "🏆 <strong>Season 2025</strong> is live! We have:<br/>• 8 Elite Teams<br/>• 40 Explosive Matches<br/>• 6 Premium Venues<br/>• ₹5 Crore Prize Pool<br/><br/>Ready to join the action?"
        ]
      },
      players: {
        keywords: ['player', 'star', 'athlete', 'team', 'roster', 'captain'],
        responses: [
          "⭐ We have the finest cricket talent! Visit our <a href='players.html'><strong>Players Page</strong></a> to explore our elite roster and check out detailed profiles of all participants."
        ]
      },
      schedule: {
        keywords: ['schedule', 'match', 'when', 'fixture', 'date', 'time'],
        responses: [
          "📅 Check our <a href='schedule.html'><strong>Schedule Page</strong></a> for all upcoming matches, dates, times, and venues. You can filter by status (Live, Upcoming, Completed)."
        ]
      },
      venue: {
        keywords: ['venue', 'location', 'address', 'where', 'stadium', 'arena', 'ground'],
        responses: [
          "📍 Our primary venue is <strong>Cyber Arena, Mumbai</strong>, Maharashtra, India 400001<br/><br/>Check our <a href='contact.html'><strong>Contact Page</strong></a> for the interactive map showing the exact location and directions!"
        ]
      },
      registration: {
        keywords: ['register', 'signup', 'join', 'participate', 'play'],
        responses: [
          "✅ Ready to join CRICKO? Visit our <a href='signup.html'><strong>Sign Up Page</strong></a> to create your account and register for the tournament!"
        ]
      },
      contact: {
        keywords: ['contact', 'email', 'phone', 'help', 'support', 'inquire'],
        responses: [
          "📧 <strong>Email:</strong> hello@cricko.in<br/>📱 <strong>Phone:</strong> +91 98765 43210<br/>🕐 <strong>Hours:</strong> Mon–Sat, 9 AM – 7 PM IST<br/><br/>Or visit our <a href='contact.html'><strong>Contact Page</strong></a> to send a message directly!"
        ]
      },
      rules: {
        keywords: ['rule', 'format', 'regulation', 'policy', 'guideline'],
        responses: [
          "📋 CRICKO follows standard T20 cricket rules with AI-powered analytics enhancements. Each match is monitored for fair play and optimal viewing experience."
        ]
      },
      tickets: {
        keywords: ['ticket', 'buy', 'booking', 'admission', 'price', 'cost'],
        responses: [
          "🎟️ Ticket booking and pricing details coming soon! Check back regularly or contact us at hello@cricko.in for early access information."
        ]
      },
      technology: {
        keywords: ['ai', 'analytics', 'ar', 'tech', 'technology', 'broadcast', 'hologram'],
        responses: [
          "🤖 CRICKO uses cutting-edge technology:<br/>• <strong>AI Analytics</strong> - Real-time machine learning<br/>• <strong>AR Broadcast</strong> - Augmented reality overlays<br/>• <strong>Smart Venues</strong> - Dynamic sensors & lighting<br/>• <strong>Fan Connect</strong> - NFT collectibles & engagement tech"
        ]
      },
      help: {
        keywords: ['help', 'assist', 'guide', 'tutorial', 'faq', 'question'],
        responses: [
          "❓ <strong>Quick Navigation:</strong><br/>🏠 <a href='index.html'>Home</a> - Tournament Overview<br/>⭐ <a href='players.html'>Players</a> - Athlete Profiles<br/>📅 <a href='schedule.html'>Schedule</a> - Match Fixtures<br/>📞 <a href='contact.html'>Contact</a> - Get in Touch<br/>📝 <a href='signup.html'>Sign Up</a> - Register Now"
        ]
      }
    };

    // Check user input against keywords
    for (const [category, data] of Object.entries(responses)) {
      for (const keyword of data.keywords) {
        if (userInput.includes(keyword)) {
          return data.responses[Math.floor(Math.random() * data.responses.length)];
        }
      }
    }

    // Default response
    return "🤔 That's a great question! I'm still learning, but you can:<br/>• Visit our <a href='index.html'><strong>Home Page</strong></a> to explore<br/>• Check our <a href='contact.html'><strong>Contact Page</strong></a> to reach our team<br/>• Or try asking about tournaments, players, or schedules!";
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cricketBot = new CricketBot();
  });
} else {
  window.cricketBot = new CricketBot();
}
