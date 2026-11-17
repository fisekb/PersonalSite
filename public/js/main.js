const THEME_KEY = 'portfolio-theme';
const PROJECT_IMAGE_FALLBACKS = {
  'e-commerce-api-platform': '/images/projects/ecommerce-api.svg',
  'task-management-dashboard': '/images/projects/task-dashboard.svg',
  'portfolio-website-cms': '/images/projects/portfolio-cms.svg'
};
const DEFAULT_PROJECT_IMAGE = '/images/projects/ecommerce-api.svg';

function getProjectFallbackImage(project) {
  return PROJECT_IMAGE_FALLBACKS[project.slug] || DEFAULT_PROJECT_IMAGE;
}

const elements = {
  body: document.body,
  toggleTheme: document.querySelector('.theme-toggle'),
  navToggle: document.querySelector('.nav-toggle'),
  navMenu: document.querySelector('.nav-menu'),
  header: document.querySelector('.site-header'),
  navLinks: document.querySelectorAll('.nav-link'),
  projectGrid: document.getElementById('projectsGrid'),
  serviceForm: document.getElementById('serviceForm'),
  toastContainer: document.querySelector('.toast-container'),
  backToTop: document.querySelector('.back-to-top'),
  modal: document.getElementById('projectModal'),
  modalImage: document.getElementById('modalImage'),
  modalTitle: document.getElementById('projectModalTitle'),
  modalDescription: document.getElementById('projectModalDescription'),
  modalTechStack: document.getElementById('modalTechStack'),
  modalLiveLink: document.getElementById('modalLiveLink'),
  modalRepoLink: document.getElementById('modalRepoLink'),
  modalClose: document.querySelector('.modal-close')
};

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const shouldUseDark = savedTheme ? savedTheme === 'dark' : true;

  document.body.classList.toggle('light', !shouldUseDark);
  const icon = elements.toggleTheme?.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = shouldUseDark ? '☀️' : '🌙';
  }
}

function toggleTheme() {
  const isLight = document.body.classList.contains('light');
  const nextTheme = isLight ? 'dark' : 'light';
  document.body.classList.toggle('light', nextTheme === 'light');
  localStorage.setItem(THEME_KEY, nextTheme === 'light' ? 'light' : 'dark');

  const icon = elements.toggleTheme?.querySelector('.theme-icon');
  if (icon) {
    icon.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
  }
}

function addRevealObserver() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((element) => observer.observe(element));
}

function setActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = elements.navLinks;

  const callback = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', callback);
  callback();
}

function initHeaderScroll() {
  const handleScroll = () => {
    elements.header.classList.toggle('scrolled', window.scrollY > 24);
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

function initMobileNav() {
  elements.navToggle?.addEventListener('click', () => {
    const isOpen = elements.navMenu.classList.toggle('is-open');
    elements.navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  elements.navMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      elements.navMenu.classList.remove('is-open');
      elements.navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function renderProjectSkeletons() {
  const skeletons = Array.from({ length: 3 }, () => `
    <article class="project-card glass skeleton-card" aria-hidden="true">
      <div class="skeleton-image"></div>
      <div class="project-body">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </article>
  `).join('');

  elements.projectGrid.innerHTML = skeletons;
}

function renderProjectCard(project) {
  const article = document.createElement('article');
  article.className = 'project-card glass';

  const image = project.imageUrl || getProjectFallbackImage(project);

  article.innerHTML = `
    <img src="${image}" alt="${project.title}" />
    <div class="project-body">
      <div class="project-header">
        <h3>${project.title}</h3>
        ${project.featured ? '<span class="project-badge">Featured</span>' : ''}
      </div>
      <p>${project.description}</p>
      <div class="chip-row">
        ${(project.techStack || []).slice(0, 4).map((tech) => `<span>${tech}</span>`).join('')}
      </div>
      <div class="project-meta">
        <span>${project.featured ? 'Featured build' : 'Case study'}</span>
      </div>
      <div class="project-actions">
        <button type="button" class="open-project" data-id="${project.id}">View details</button>
        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noreferrer">Live</a>` : ''}
        ${project.repoUrl ? `<a href="${project.repoUrl}" target="_blank" rel="noreferrer">Code</a>` : ''}
      </div>
    </div>
  `;

  const projectImage = article.querySelector('img');
  projectImage.addEventListener('error', () => {
    projectImage.src = getProjectFallbackImage(project);
  }, { once: true });

  const openBtn = article.querySelector('.open-project');
  openBtn.addEventListener('click', () => openProjectModal(project));

  return article;
}

async function loadProjects() {
  renderProjectSkeletons();

  try {
    const response = await fetch('/api/v1/projects?featured=false&page=1&limit=6');
    const payload = await response.json();

    if (!payload.success || !Array.isArray(payload.data.projects)) {
      throw new Error('Unable to load projects.');
    }

    elements.projectGrid.innerHTML = '';
    payload.data.projects.forEach((project) => {
      elements.projectGrid.appendChild(renderProjectCard(project));
    });
  } catch (error) {
    elements.projectGrid.innerHTML = '<p class="empty-state">Projects are loading slowly. Please refresh in a moment.</p>';
  }
}

function openProjectModal(project) {
  const image = project.imageUrl || getProjectFallbackImage(project);
  elements.modalImage.src = image;
  elements.modalImage.onerror = () => {
    elements.modalImage.src = getProjectFallbackImage(project);
    elements.modalImage.onerror = null;
  };
  elements.modalTitle.textContent = project.title;
  elements.modalDescription.textContent = project.longDescription || project.description;
  elements.modalTechStack.innerHTML = (project.techStack || []).map((tech) => `<span>${tech}</span>`).join('');
  elements.modalLiveLink.href = project.liveUrl || '#';
  elements.modalRepoLink.href = project.repoUrl || '#';
  elements.modal.classList.add('is-open');
  elements.modal.setAttribute('aria-hidden', 'false');
}

function closeProjectModal() {
  elements.modal.classList.remove('is-open');
  elements.modal.setAttribute('aria-hidden', 'true');
}

function initModalControls() {
  elements.modalClose?.addEventListener('click', closeProjectModal);
  elements.modal?.addEventListener('click', (event) => {
    if (event.target === elements.modal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.modal.classList.contains('is-open')) {
      closeProjectModal();
    }
  });
}

function animateCounters() {
  const counters = document.querySelectorAll('.count');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = Number(element.dataset.target || 0);
          let current = 0;
          const step = Math.ceil(target / 50);

          const update = () => {
            current += step;
            if (current >= target) {
              element.textContent = `${target}${target === 96 ? '%' : '+'}`;
              return;
            }
            element.textContent = `${current}${target === 96 ? '%' : '+'}`;
            requestAnimationFrame(update);
          };

          update();
          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.55 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function setServiceSelection() {
  document.querySelectorAll('.service-request-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const service = button.dataset.service;
      const select = document.querySelector('select[name="serviceType"]');
      if (select) {
        select.value = service;
      }
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Service selected. Complete the form below.', 'success');
    });
  });
}

function clearFieldErrors(form) {
  form.querySelectorAll('.error-text').forEach((field) => {
    field.textContent = '';
  });
}

async function submitServiceRequest(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  clearFieldErrors(form);
  const submitButton = form.querySelector('.submit-btn');
  const previousText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<span class="btn-text">Sending...</span>';

  const payload = {
    name: formData.get('name')?.toString().trim(),
    email: formData.get('email')?.toString().trim(),
    phone: formData.get('phone')?.toString().trim() || '',
    serviceType: formData.get('serviceType')?.toString().trim(),
    budgetRange: formData.get('budgetRange')?.toString().trim(),
    message: formData.get('message')?.toString().trim()
  };

  try {
    const response = await fetch('/api/v1/service-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      const errors = result?.data?.errors || [];
      if (Array.isArray(errors) && errors.length) {
        errors.forEach((error) => {
          const fieldName = error.field;
          const input = form.querySelector(`[name="${fieldName}"]`);
          if (input) {
            const errorText = input.parentElement.querySelector('.error-text');
            if (errorText) {
              errorText.textContent = error.message;
            }
          }
        });
        throw new Error(result.message || 'Please correct the form and try again.');
      }

      throw new Error(result.message || 'Submission failed.');
    }

    form.reset();
    showToast('Request sent successfully. I will get back to you soon.', 'success');
  } catch (error) {
    showToast(error.message || 'Submission failed. Please try again.', 'error');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = previousText;
  }
}

function setupFormSubmission() {
  elements.serviceForm?.addEventListener('submit', submitServiceRequest);
}

function initBackToTop() {
  elements.backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    elements.backToTop.style.opacity = window.scrollY > 300 ? '1' : '0';
  });
}

function initTypingEffect() {
  const textEl = document.querySelector('.typed-text');
  if (!textEl) return;

  const words = ['Node.js Developer', 'Fullstack Developer', 'API Builder'];
  let index = 0;
  let letterIndex = 0;
  let deleting = false;

  const tick = () => {
    const currentWord = words[index];
    if (!deleting) {
      letterIndex += 1;
      textEl.textContent = currentWord.slice(0, letterIndex);
      if (letterIndex === currentWord.length) {
        deleting = true;
        setTimeout(tick, 1200);
        return;
      }
    } else {
      letterIndex -= 1;
      textEl.textContent = currentWord.slice(0, letterIndex);
      if (letterIndex === 0) {
        deleting = false;
        index = (index + 1) % words.length;
      }
    }

    const speed = deleting ? 45 : 120;
    setTimeout(tick, speed);
  };

  tick();
}

function init() {
  initTheme();
  addRevealObserver();
  setActiveNav();
  initHeaderScroll();
  initMobileNav();
  initBackToTop();
  initTypingEffect();
  setServiceSelection();
  setupFormSubmission();
  initModalControls();
  loadProjects();
  animateCounters();

  elements.toggleTheme?.addEventListener('click', toggleTheme);
}

init();
