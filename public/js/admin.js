const AUTH_TOKEN_KEY = 'portfolio_admin_token';
const API_BASE = '/api/v1';

const adminState = {
  projects: [],
  requests: [],
  filter: 'all',
  editingProjectId: null,
  techStack: []
};

const toastContainer = document.querySelector('.toast-container');

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}

function setLoadingState(button, isLoading, label) {
  if (!button) return;
  button.disabled = isLoading;
  const text = button.querySelector('.btn-text');
  if (text) {
    text.textContent = isLoading ? label : button.dataset.defaultText || label;
  }
}

function api(path, options = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  }).then(async (response) => {
    const payload = await response.json().catch(() => null);

    if (response.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = '/admin/login.html';
      throw new Error(payload?.message || 'Session expired. Please log in again.');
    }

    if (!response.ok) {
      const message = payload?.message || 'Something went wrong.';
      throw new Error(message);
    }

    return payload;
  });
}

function requireAuth() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    window.location.href = '/admin/login.html';
    return false;
  }
  return true;
}

function saveToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('portfolio-theme');
  if (saved === 'light') {
    document.body.classList.add('light');
  }

  toggle?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    const icon = toggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = isLight ? '🌙' : '☀️';
    }
  });

  if (toggle) {
    const icon = toggle.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
    }
  }
}

async function loginUser(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('.login-btn');
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  button.disabled = true;
  button.querySelector('.btn-text').textContent = 'Signing In...';

  try {
    const result = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    saveToken(result.data.token);
    window.location.href = '/admin/dashboard.html';
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    button.disabled = false;
    button.querySelector('.btn-text').textContent = 'Sign In';
  }
}

function setupLoginPage() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', loginUser);
  }
}

async function loadOverviewStats() {
  const statsGrid = document.getElementById('statsGrid');
  if (!statsGrid) return;

  const payload = await api('/service-requests/stats');
  const stats = payload.data;

  const cards = [
    { label: 'Total Projects', value: stats.totalProjects },
    { label: 'Total Requests', value: stats.totalRequests },
    { label: 'New Requests', value: stats.newRequests }
  ];

  statsGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="stat-card glass">
          <h3>${card.label}</h3>
          <div class="stat-value">${card.value}</div>
        </article>
      `
    )
    .join('');
}

function renderProjectsTable() {
  const tbody = document.getElementById('projectsTableBody');
  if (!tbody) return;

  if (!adminState.projects.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No projects yet.</td></tr>';
    return;
  }

  tbody.innerHTML = adminState.projects
    .map(
      (project) => `
        <tr>
          <td>${project.title}</td>
          <td>${project.featured ? 'Yes' : 'No'}</td>
          <td>${project.displayOrder}</td>
          <td>
            <div class="action-group">
              <button class="small-btn" data-project-edit="${project.id}">Edit</button>
              <button class="small-btn danger" data-project-delete="${project.id}">Delete</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');

  tbody.querySelectorAll('[data-project-edit]').forEach((button) => {
    button.addEventListener('click', () => openProjectModal(button.dataset.projectEdit));
  });

  tbody.querySelectorAll('[data-project-delete]').forEach((button) => {
    button.addEventListener('click', () => deleteProject(button.dataset.projectDelete));
  });
}

function renderRequestsTable() {
  const tbody = document.getElementById('requestsTableBody');
  if (!tbody) return;

  const filtered = adminState.filter === 'all'
    ? adminState.requests
    : adminState.requests.filter((request) => request.status === adminState.filter);

  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No service requests found.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (request) => `
        <tr>
          <td>${request.name}</td>
          <td>${request.serviceType}</td>
          <td><span class="badge ${request.status}">${request.status.replace('-', ' ')}</span></td>
          <td>
            <div class="action-group">
              <button class="small-btn" data-request-view="${request.id}">View</button>
              <select data-request-status="${request.id}" class="status-select">
                <option value="new" ${request.status === 'new' ? 'selected' : ''}>New</option>
                <option value="in-review" ${request.status === 'in-review' ? 'selected' : ''}>In Review</option>
                <option value="accepted" ${request.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                <option value="rejected" ${request.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                <option value="completed" ${request.status === 'completed' ? 'selected' : ''}>Completed</option>
              </select>
              <button class="small-btn danger" data-request-delete="${request.id}">Delete</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');

  tbody.querySelectorAll('[data-request-view]').forEach((button) => {
    button.addEventListener('click', () => openRequestModal(button.dataset.requestView));
  });

  tbody.querySelectorAll('[data-request-delete]').forEach((button) => {
    button.addEventListener('click', () => deleteRequest(button.dataset.requestDelete));
  });

  tbody.querySelectorAll('[data-request-status]').forEach((select) => {
    select.addEventListener('change', async (event) => {
      const id = event.target.dataset.requestStatus;
      await updateRequestStatus(id, event.target.value);
    });
  });
}

async function loadAdminData() {
  if (!requireAuth()) return;

  const [projectsResult, requestsResult] = await Promise.allSettled([
    api('/projects?page=1&limit=20'),
    api('/service-requests?page=1&limit=50')
  ]);

  if (projectsResult.status === 'fulfilled') {
    adminState.projects = projectsResult.value.data.projects || [];
  } else {
    showToast(`Could not load projects: ${projectsResult.reason.message}`, 'error');
  }

  if (requestsResult.status === 'fulfilled') {
    adminState.requests = requestsResult.value.data.requests || [];
  } else {
    showToast(`Could not load service requests: ${requestsResult.reason.message}`, 'error');
  }

  renderProjectsTable();
  renderRequestsTable();

  try {
    await loadOverviewStats();
  } catch (error) {
    showToast(`Could not load overview stats: ${error.message}`, 'error');
  }
}

function getProjectFormValues() {
  const form = document.getElementById('projectForm');
  const formData = new FormData(form);

  return {
    title: formData.get('title')?.toString().trim(),
    description: formData.get('description')?.toString().trim(),
    longDescription: formData.get('longDescription')?.toString().trim(),
    techStack: adminState.techStack,
    liveUrl: formData.get('liveUrl')?.toString().trim() || '',
    repoUrl: formData.get('repoUrl')?.toString().trim() || '',
    featured: formData.get('featured') === 'on',
    displayOrder: Number(formData.get('displayOrder') || 0),
    image: formData.get('image')
  };
}

function resetProjectForm() {
  const form = document.getElementById('projectForm');
  if (!form) return;

  form.reset();
  adminState.techStack = [];
  renderTechChips();
  document.getElementById('projectImagePreview').classList.add('hidden');
  document.getElementById('projectImagePreview').src = '';
  adminState.editingProjectId = null;
  document.getElementById('projectModalTitle').textContent = 'Add Project';
}

function renderTechChips() {
  const chipList = document.getElementById('techChipList');
  if (!chipList) return;

  chipList.innerHTML = adminState.techStack
    .map(
      (tech, index) => `
        <span class="tech-chip">
          ${tech}
          <button type="button" data-remove-tech="${index}" aria-label="Remove ${tech}">×</button>
        </span>
      `
    )
    .join('');

  chipList.querySelectorAll('[data-remove-tech]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.removeTech);
      adminState.techStack.splice(index, 1);
      renderTechChips();
    });
  });
}

function setupTechInput() {
  const input = document.getElementById('techInput');
  if (!input) return;

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      if (!adminState.techStack.includes(value)) {
        adminState.techStack.push(value);
        renderTechChips();
      }
      input.value = '';
    }
  });
}

function openProjectModal(projectId = null) {
  const modal = document.getElementById('projectModal');
  const form = document.getElementById('projectForm');

  if (!modal || !form) return;

  resetProjectForm();

  if (projectId) {
    const project = adminState.projects.find((item) => item.id === projectId);
    if (!project) return;

    adminState.editingProjectId = projectId;
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    form.title.value = project.title;
    form.description.value = project.description;
    form.longDescription.value = project.longDescription;
    form.displayOrder.value = project.displayOrder || 0;
    form.liveUrl.value = project.liveUrl || '';
    form.repoUrl.value = project.repoUrl || '';
    form.featured.checked = Boolean(project.featured);
    adminState.techStack = [...(project.techStack || [])];
    renderTechChips();

    if (project.imageUrl) {
      const preview = document.getElementById('projectImagePreview');
      preview.src = project.imageUrl;
      preview.classList.remove('hidden');
    }
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

async function saveProject(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = getProjectFormValues();

  const body = new FormData();
  body.append('title', values.title);
  body.append('description', values.description);
  body.append('longDescription', values.longDescription);
  values.techStack.forEach((item) => body.append('techStack', item));
  body.append('featured', String(values.featured));
  body.append('displayOrder', String(values.displayOrder));
  if (values.liveUrl) body.append('liveUrl', values.liveUrl);
  if (values.repoUrl) body.append('repoUrl', values.repoUrl);
  if (values.image && values.image.name) {
    body.append('image', values.image);
  }

  try {
    const path = adminState.editingProjectId ? `/projects/${adminState.editingProjectId}` : '/projects';
    const method = adminState.editingProjectId ? 'PUT' : 'POST';

    await api(path, {
      method,
      body
    });

    showToast(adminState.editingProjectId ? 'Project updated.' : 'Project created.', 'success');
    closeModal('projectModal');
    resetProjectForm();
    await loadAdminData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteProject(projectId) {
  const confirmed = window.confirm('Delete this project?');
  if (!confirmed) return;

  try {
    await api(`/projects/${projectId}`, { method: 'DELETE' });
    showToast('Project deleted.', 'success');
    await loadAdminData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function updateRequestStatus(requestId, status) {
  try {
    await api(`/service-requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
    showToast('Status updated.', 'success');
    await loadAdminData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function openRequestModal(requestId) {
  const modal = document.getElementById('requestModal');
  const request = adminState.requests.find((item) => item.id === requestId);
  if (!request) return;

  const detail = document.getElementById('requestDetailContent');
  detail.innerHTML = `
    <div class="meta-row">
      <div class="meta-box"><strong>Name</strong><br>${request.name}</div>
      <div class="meta-box"><strong>Email</strong><br>${request.email}</div>
      <div class="meta-box"><strong>Phone</strong><br>${request.phone || 'Not provided'}</div>
      <div class="meta-box"><strong>Service</strong><br>${request.serviceType}</div>
    </div>
    <div class="meta-box"><strong>Budget</strong><br>${request.budgetRange || 'Not provided'}</div>
    <div class="meta-box"><strong>Message</strong><br>${request.message}</div>
    <div class="meta-box"><strong>Status</strong><br><span class="badge ${request.status}">${request.status.replace('-', ' ')}</span></div>
  `;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

async function deleteRequest(requestId) {
  const confirmed = window.confirm('Delete this service request?');
  if (!confirmed) return;

  try {
    await api(`/service-requests/${requestId}`, { method: 'DELETE' });
    showToast('Service request deleted.', 'success');
    await loadAdminData();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function attachModalCloseHandlers() {
  document.querySelectorAll('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', () => closeModal(button.dataset.closeModal));
  });

  document.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      if (modal) closeModal(modal.id);
    });
  });

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal(modal.id);
    });
  });
}

function setupSections() {
  const navButtons = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.panel-section');

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.id === 'logoutBtn') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        window.location.href = '/admin/login.html';
        return;
      }

      const target = button.dataset.section;
      navButtons.forEach((item) => item.classList.toggle('active', item === button));
      sections.forEach((section) => {
        section.classList.toggle('active', section.id === `${target}Section`);
      });
    });
  });

  document.getElementById('addProjectBtn')?.addEventListener('click', () => openProjectModal());
  document.getElementById('projectForm')?.addEventListener('submit', saveProject);

  document.getElementById('requestStatusTabs')?.addEventListener('click', (event) => {
    const tab = event.target.closest('.status-tab');
    if (!tab) return;

    adminState.filter = tab.dataset.status;
    document.querySelectorAll('.status-tab').forEach((item) => item.classList.toggle('active', item === tab));
    renderRequestsTable();
  });
}

function bootstrapDashboard() {
  if (!requireAuth()) return;
  initThemeToggle();
  attachModalCloseHandlers();
  setupSections();
  setupTechInput();
  loadAdminData();
}

if (document.getElementById('loginForm')) {
  setupLoginPage();
}

if (document.getElementById('projectForm')) {
  bootstrapDashboard();
}
