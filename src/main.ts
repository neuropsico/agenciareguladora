import './style.css';

// ====================================
// BIOPSICOSSOCIAL — Main Application
// ====================================

// === Navbar Scroll Effect ===
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function handleNavScroll() {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll);
handleNavScroll();

// === Hamburger Menu ===
hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('active');
  const actions = document.querySelector('.navbar-actions') as HTMLElement;
  actions?.classList.toggle('active');
  
  // Animate hamburger
  const spans = hamburger.querySelectorAll('span');
  if (navLinks?.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close mobile menu on link click
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const actions = document.querySelector('.navbar-actions') as HTMLElement;
    actions?.classList.remove('active');
    const spans = hamburger?.querySelectorAll('span');
    if (spans) {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
});

// === Smooth Scroll ===
(window as any).scrollToSection = function(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// === Modal ===
const modalOverlay = document.getElementById('modal-overlay');
const modalWaitlist = document.getElementById('modal-waitlist');
const modalSuccess = document.getElementById('modal-success');

(window as any).openModal = function(type: string) {
  if (type === 'waitlist' || type === 'login') {
    modalWaitlist?.classList.remove('modal-hidden');
    modalSuccess?.classList.add('modal-hidden');
  }
  modalOverlay?.classList.add('active');
  document.body.style.overflow = 'hidden';
};

(window as any).closeModal = function() {
  modalOverlay?.classList.remove('active');
  document.body.style.overflow = '';
};

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    (window as any).closeModal();
    // Also close chatbot
    const chatWindow = document.getElementById('chatbot-window');
    chatWindow?.classList.remove('active');
  }
});

// === Form Submit ===
(window as any).handleSubmit = async function(e: Event) {
  e.preventDefault();
  
  const form = document.getElementById('waitlist-form') as HTMLFormElement;
  const formData = new FormData(form);
  const data: Record<string, string> = {};
  formData.forEach((value, key) => { data[key] = value as string; });
  
  const btn = document.getElementById('btn-submit') as HTMLButtonElement;
  if(btn) {
    btn.disabled = true;
    btn.innerHTML = 'Enviando...';
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if(!res.ok) throw new Error('Erro ao enviar');
    
    // Show success
    modalWaitlist?.classList.add('modal-hidden');
    modalSuccess?.classList.remove('modal-hidden');
    
    // Reset form
    form.reset();
  } catch (err) {
    console.error(err);
    alert('Erro ao enviar solicitação. Verifique sua conexão ou tente novamente mais tarde.');
  } finally {
    if(btn) {
      btn.disabled = false;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
        Garantir Acesso Gratuito
      `;
    }
  }
};

// === FAQ Accordion ===
(window as any).toggleFaq = function(btn: HTMLElement) {
  const item = btn.closest('.faq-item');
  const isActive = item?.classList.contains('active');
  
  // Close all
  document.querySelectorAll('.faq-item').forEach(faq => {
    faq.classList.remove('active');
  });
  
  // Open clicked (if wasn't active)
  if (!isActive) {
    item?.classList.add('active');
  }
};

// === Chatbot ===
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input') as HTMLInputElement;

(window as any).toggleChatbot = function() {
  chatbotWindow?.classList.toggle('active');
  if (chatbotWindow?.classList.contains('active')) {
    chatbotInput?.focus();
  }
};

// Chatbot knowledge base
const chatResponses: Record<string, string> = {
  'nr-1': `A NR-1 (Norma Regulamentadora nº 1) foi atualizada pelo Ministério do Trabalho para incluir a gestão de riscos psicossociais como obrigatória no PGR (Programa de Gerenciamento de Riscos). Desde 26 de maio de 2026, todas as empresas com funcionários CLT devem identificar, avaliar e gerenciar fatores como estresse, assédio, sobrecarga de trabalho e falta de autonomia. 

📋 Nossa plataforma automatiza todo esse processo com inteligência artificial.`,

  'multa': `Sim! A fiscalização já é punitiva desde 26/05/2026. As multas podem variar de **R$ 2.396 a R$ 6.708 por infração**, podendo ser aplicadas por funcionário afetado. Além disso, a empresa pode ser responsabilizada civilmente por danos à saúde mental dos colaboradores.

⚠️ Cada dia sem adequação é um risco real. Nossa plataforma resolve isso rapidamente.`,

  'plataforma': `Nossa plataforma funciona em 3 passos simples:

1️⃣ **Cadastro** — Crie sua conta e adicione os setores da empresa
2️⃣ **Questionários** — Envie o link anônimo para seus colaboradores
3️⃣ **Relatório IA** — Em até 48h, receba o relatório completo pronto para o PGR

Tudo automatizado, sem necessidade de ser especialista em SST.`,

  'preco': `Temos planos para todos os tamanhos de empresa:

💼 **Starter** — R$ 197/mês (até 50 colaboradores)
🏢 **Business** — R$ 497/mês (até 200 colaboradores)  
🏗️ **Enterprise** — R$ 997/mês (ilimitado + consultoria IA)

Todos incluem avaliação inicial gratuita, sem cartão de crédito! Quer começar?`,

  'lgpd': `Sim, nossa plataforma é 100% compatível com a LGPD! 🔒

• Todas as respostas são anônimas — ninguém identifica quem respondeu
• Dados criptografados em trânsito e em repouso
• Não coletamos dados pessoais dos colaboradores
• Você tem controle total sobre seus dados`,

  'default': `Ótima pergunta! Para um atendimento mais personalizado, sugiro que você se cadastre em nossa lista de acesso antecipado. Nossa equipe entrará em contato rapidamente.

Posso ajudar com algo mais específico sobre:
• A NR-1 e obrigatoriedade
• Como funciona nossa plataforma
• Planos e preços
• Segurança e LGPD`
};

function getBotResponse(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('nr-1') || lower.includes('nr1') || lower.includes('norma') || lower.includes('o que é')) {
    return chatResponses['nr-1'];
  }
  if (lower.includes('multa') || lower.includes('fiscal') || lower.includes('penalid') || lower.includes('pode ser')) {
    return chatResponses['multa'];
  }
  if (lower.includes('funciona') || lower.includes('plataforma') || lower.includes('como')) {
    return chatResponses['plataforma'];
  }
  if (lower.includes('custo') || lower.includes('preço') || lower.includes('preco') || lower.includes('valor') || lower.includes('quanto') || lower.includes('plano')) {
    return chatResponses['preco'];
  }
  if (lower.includes('lgpd') || lower.includes('segur') || lower.includes('dado') || lower.includes('anônim') || lower.includes('anonim')) {
    return chatResponses['lgpd'];
  }
  
  return chatResponses['default'];
}

function addMessage(text: string, isUser: boolean) {
  const div = document.createElement('div');
  div.className = `chat-message ${isUser ? 'chat-user' : 'chat-bot'}`;
  
  // Convert markdown-like bold to HTML
  const htmlText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  div.innerHTML = htmlText.split('\n').map(line => `<p>${line}</p>`).join('');
  
  chatbotMessages?.appendChild(div);
  chatbotMessages?.scrollTo({ top: chatbotMessages.scrollHeight, behavior: 'smooth' });
}

(window as any).sendMessage = function() {
  const message = chatbotInput?.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage(message, true);
  chatbotInput.value = '';
  
  // Hide suggestions after first message
  const suggestions = document.getElementById('chat-suggestions');
  if (suggestions) suggestions.style.display = 'none';
  
  // Simulate typing delay
  setTimeout(() => {
    const response = getBotResponse(message);
    addMessage(response, false);
  }, 600 + Math.random() * 800);
};

(window as any).sendSuggestion = function(text: string) {
  addMessage(text, true);
  
  const suggestions = document.getElementById('chat-suggestions');
  if (suggestions) suggestions.style.display = 'none';
  
  setTimeout(() => {
    const response = getBotResponse(text);
    addMessage(response, false);
  }, 600 + Math.random() * 800);
};

// === Scroll Animations (Intersection Observer) ===
function initScrollAnimations() {
  const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Add fade-in class to elements
  const animateElements = document.querySelectorAll(
    '.problema-card, .solucao-card, .step, .plano-card, .proof-item, .faq-item, .section-header'
  );
  
  animateElements.forEach((el, index) => {
    el.classList.add('fade-in');
    (el as HTMLElement).style.transitionDelay = `${index % 4 * 100}ms`;
    observer.observe(el);
  });
}

// === Mouse Glow Effect on Cards ===
function initCardGlowEffect() {
  const cards = document.querySelectorAll('.solucao-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const rect = (card as HTMLElement).getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      
      const glow = card.querySelector('.solucao-card-glow') as HTMLElement;
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(99, 102, 241, 0.08), transparent 50%)`;
        glow.style.opacity = '1';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      const glow = card.querySelector('.solucao-card-glow') as HTMLElement;
      if (glow) {
        glow.style.opacity = '0';
      }
    });
  });
}

// === Active Nav Link Highlighting ===
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// === Initialize Everything ===
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initCardGlowEffect();
  initActiveNavHighlight();
});
