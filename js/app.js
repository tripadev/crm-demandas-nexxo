/**
 * CRM DEMANDAS - NEXXO | APLICAÇÃO PRINCIPAL & CONTROLES
 */

const App = {
  audioCtx: null,

  init() {
    Kanban.init();
    Modals.init();

    this.setupSearch();
    this.setupFilters();
    this.setupShortcuts();
    this.setupTabs();
    this.setupTopButtons();
    this.setupRoleSelector();
    this.setupShareSearch();
  },

  setupRoleSelector() {
    const roleSelect = document.getElementById('roleSelect');
    const dot = document.getElementById('roleDotIndicator');
    if (!roleSelect) return;

    const currentRole = StorageManager.getCurrentRole();
    roleSelect.value = currentRole;
    if (dot) {
      dot.className = `role-dot-indicator ${currentRole === 'admin' ? 'is-admin' : 'is-collaborator'}`;
    }

    roleSelect.addEventListener('change', (e) => {
      const newRole = e.target.value;
      StorageManager.setCurrentRole(newRole);
      if (dot) {
        dot.className = `role-dot-indicator ${newRole === 'admin' ? 'is-admin' : 'is-collaborator'}`;
      }

      Kanban.renderBoard();
      
      // Se o drawer estiver aberto, recarrega com as permissões atualizadas
      if (Modals.activeDrawerCardId) {
        Modals.openCardDrawer(Modals.activeDrawerCardId);
      }

      const roleName = newRole === 'admin' ? 'Administrador (Acesso Total)' : 'Colaborador (Visualização)';
      App.showToast(`Perfil alterado para: ${roleName}`, newRole === 'admin' ? 'success' : 'info');
    });
  },

  setupTopButtons() {
    // Botão Unificado: + Novo Card (em Azul Escuro)
    const btnNewCard = document.getElementById('btnNewCardTop');
    if (btnNewCard) {
      btnNewCard.addEventListener('click', () => {
        Modals.openNewCardModal('entradas');
      });
    }
  },

  setupShareSearch() {
    const input = document.getElementById('shareSearchInput');
    if (input) {
      input.addEventListener('input', (e) => {
        Modals.renderShareTable(e.target.value.trim());
      });
    }
  },

  setupSearch() {
    const searchInput = document.getElementById('topSearchInput');
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        Kanban.activeFilter.search = e.target.value.trim();
        Kanban.renderBoard();
      }, 150);
    });
  },

  setupFilters() {
    const data = StorageManager.getData();

    const filterClient = document.getElementById('filterClientSelect');
    if (filterClient) {
      filterClient.innerHTML = `
        <option value="all">Todos os Franqueados</option>
        ${data.clients.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
      `;
      filterClient.addEventListener('change', (e) => {
        Kanban.activeFilter.client = e.target.value;
        Kanban.renderBoard();
      });
    }

    const filterPriority = document.getElementById('filterPrioritySelect');
    if (filterPriority) {
      filterPriority.addEventListener('change', (e) => {
        Kanban.activeFilter.priority = e.target.value;
        Kanban.renderBoard();
      });
    }
  },

  setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        if (tab.dataset.tab !== 'board') {
          App.showToast(`Modo "${tab.innerText.trim()}" sincronizado com o Quadro`, 'info');
        }
      });
    });
  },

  setupShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('topSearchInput');
        if (searchInput) searchInput.focus();
      }

      if (e.key === 'n' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        Modals.openNewCardModal('demandas');
      }
    });
  },

  playSound(type = 'click') {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'lift') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'drop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {}
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
