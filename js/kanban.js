/**
 * CRM DEMANDAS - NEXXO | MOTOR DO QUADRO KANBAN
 * Suporte a status em português, tag Pendente em destaque e visual limpo sem fotos
 */

const Kanban = {
  activeFilter: {
    search: '',
    client: 'all',
    priority: 'all',
    assignee: 'all'
  },

  draggedCardId: null,
  draggedCardElement: null,

  init() {
    this.renderBoard();
  },

  renderBoard() {
    const data = StorageManager.getData();
    const boardEl = document.getElementById('kanbanBoard');
    if (!boardEl) return;

    boardEl.innerHTML = '';

    data.columns.forEach(col => {
      const colCards = this.filterCards(data.cards.filter(c => c.columnId === col.id));
      const colEl = this.createColumnElement(col, colCards, data);
      boardEl.appendChild(colEl);
    });

    this.attachDragAndDropHandlers();
  },

  filterCards(cards) {
    return cards.filter(card => {
      if (this.activeFilter.search) {
        const query = this.activeFilter.search.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(query);
        const matchesDesc = (card.description || '').toLowerCase().includes(query);
        const matchesClient = (card.clientName || '').toLowerCase().includes(query);
        const matchesId = (card.id || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesClient && !matchesId) return false;
      }

      if (this.activeFilter.client !== 'all') {
        if (card.clientName !== this.activeFilter.client) return false;
      }

      if (this.activeFilter.priority !== 'all') {
        if (card.priority.toLowerCase() !== this.activeFilter.priority.toLowerCase()) return false;
      }

      if (this.activeFilter.assignee !== 'all') {
        if (!card.assignees || !card.assignees.includes(this.activeFilter.assignee)) return false;
      }

      return true;
    });
  },

  createColumnElement(col, cards, fullData) {
    const colDiv = document.createElement('div');
    colDiv.className = `kanban-column col-${col.id}`;
    colDiv.dataset.columnId = col.id;

    colDiv.innerHTML = `
      <div class="column-header">
        <div class="column-title-group">
          <span class="column-dot"></span>
          <h3 class="column-title">${col.title}</h3>
          <span class="column-count">${cards.length}</span>
        </div>
        <div class="column-actions">
          <button class="col-action-btn btn-add-to-col" title="Adicionar card em ${col.title}" data-column="${col.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      <div class="column-cards-list" data-column-id="${col.id}"></div>
    `;

    const cardsList = colDiv.querySelector('.column-cards-list');
    cards.forEach(card => {
      const cardEl = this.createCardElement(card, fullData);
      cardsList.appendChild(cardEl);
    });

    const addBtn = colDiv.querySelector('.btn-add-to-col');
    addBtn.addEventListener('click', () => {
      Modals.openNewCardModal(col.id);
    });

    return colDiv;
  },

  createCardElement(card, fullData) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'kanban-card';
    cardDiv.id = `card-${card.id}`;
    cardDiv.draggable = true;
    cardDiv.dataset.cardId = card.id;

    if (card.columnId === 'entrega') {
      cardDiv.classList.add('is-completed');
    }

    // Status slug em português
    const rawStatus = card.statusChip || 'Não Iniciado';
    const statusSlug = rawStatus.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    const statusChipHtml = `
      <span class="status-chip status-${statusSlug}">
        ${rawStatus}
      </span>
    `;

    // Etiqueta Solicitada: Demanda [Cliente] Pendente (quando ainda não foi definido prazo pela equipe)
    const isPending = card.isPendingAnalysis || !card.teamDeadline;
    let clientTagHtml = '';

    if (card.clientName) {
      if (isPending) {
        clientTagHtml = `
          <span class="tag-client-demand-pending" title="Nova solicitação pendente de prazo e análise">
            <span class="pending-pulse"></span>
            NOVO • Demanda [${card.clientName}] Pendente
          </span>
        `;
      } else {
        clientTagHtml = `
          <span class="tag-client-demand" title="Demanda com prazo estabelecido">
            <span class="client-dot"></span>
            Demanda [${card.clientName}]
          </span>
        `;
      }
    }

    // Responsáveis (formato limpo sem fotos)
    const assigneeNames = (card.assignees || []).map(memberId => {
      const m = fullData.members.find(mem => mem.id === memberId);
      return m ? m.name : '';
    }).filter(Boolean).join(', ');

    // Checklist count (ex: 2/3)
    const totalChecklist = card.checklist ? card.checklist.length : 0;
    const doneChecklist = card.checklist ? card.checklist.filter(c => c.done).length : 0;
    const checklistHtml = totalChecklist > 0 ? `
      <span class="metric-item" title="Subtarefas concluídas">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        ${doneChecklist}/${totalChecklist}
      </span>
    ` : '';

    const prioSlug = (card.priority || 'Baixa').toLowerCase();

    // Data de entrega definida pela equipe
    const dueDateDisplay = card.teamDeadlineFormatted || card.dueDateFormatted || (isPending ? 'Prazo a Definir' : 'Sem prazo');
    const dueDateClass = isPending ? 'pending-date' : '';

    cardDiv.innerHTML = `
      <div class="card-top">
        <div class="card-tags-container">
          <span class="card-id-code">#${card.id}</span>
          ${clientTagHtml}
          ${statusChipHtml}
        </div>
        <button class="card-options-btn" title="Excluir Demanda" data-action="options">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <h4 class="card-title">${card.title}</h4>
      <p class="card-description">${card.description || 'Sem descrição.'}</p>

      <div class="card-assignees-row">
        <span class="assignees-label">Responsável :</span>
        <span class="assignee-badge-clean">
          ${assigneeNames || 'Não atribuído'}
        </span>
      </div>

      <div class="card-meta-row">
        <div class="card-due-date ${dueDateClass}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${dueDateDisplay}</span>
        </div>
        <span class="priority-chip priority-${prioSlug}">
          ${card.priority || 'Sem prioridade'}
        </span>
      </div>

      <div class="card-footer-metrics">
        <span class="metric-item" title="Comentários">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          ${card.commentsCount || (card.comments ? card.comments.length : 0)} Comentários
        </span>
        <span class="metric-item" title="Links e Anexos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          ${card.linksCount || 1} Link
        </span>
        ${checklistHtml}
      </div>
    `;

    // Click no card para abrir o Drawer de detalhes
    cardDiv.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="options"]')) {
        e.stopPropagation();
        this.showCardQuickMenu(card);
        return;
      }
      Modals.openCardDrawer(card.id);
    });

    return cardDiv;
  },

  attachDragAndDropHandlers() {
    const cards = document.querySelectorAll('.kanban-card');
    const lists = document.querySelectorAll('.column-cards-list');

    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        this.draggedCardId = card.dataset.cardId;
        this.draggedCardElement = card;
        card.classList.add('is-dragging');
        e.dataTransfer.setData('text/plain', card.dataset.cardId);
        e.dataTransfer.effectAllowed = 'move';
        
        if (window.App && window.App.playSound) {
          window.App.playSound('lift');
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('is-dragging');
        this.draggedCardId = null;
        this.draggedCardElement = null;

        document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
        document.querySelectorAll('.card-placeholder').forEach(p => p.remove());
      });
    });

    lists.forEach(list => {
      const colEl = list.closest('.kanban-column');

      list.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        colEl.classList.add('drag-over');

        let placeholder = list.querySelector('.card-placeholder');
        if (!placeholder) {
          placeholder = document.createElement('div');
          placeholder.className = 'card-placeholder';
        }

        const afterElement = this.getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
          list.appendChild(placeholder);
        } else {
          list.insertBefore(placeholder, afterElement);
        }
      });

      list.addEventListener('dragleave', (e) => {
        if (!list.contains(e.relatedTarget)) {
          colEl.classList.remove('drag-over');
          const placeholder = list.querySelector('.card-placeholder');
          if (placeholder) placeholder.remove();
        }
      });

      list.addEventListener('drop', (e) => {
        e.preventDefault();
        colEl.classList.remove('drag-over');

        const cardId = e.dataTransfer.getData('text/plain') || this.draggedCardId;
        const targetColumnId = list.dataset.columnId;
        const placeholder = list.querySelector('.card-placeholder');

        if (!cardId || !targetColumnId) return;

        let dropIndex = null;
        if (placeholder) {
          dropIndex = Array.from(list.children).indexOf(placeholder);
          placeholder.remove();
        }

        const moveResult = StorageManager.moveCard(cardId, targetColumnId, dropIndex);

        if (window.App && window.App.playSound) {
          window.App.playSound('drop');
        }

        this.renderBoard();

        if (moveResult) {
          if (targetColumnId === 'entrega' && moveResult.oldColumn !== 'entrega') {
            App.showToast(`🎉 Demanda movida para Entrega!`, 'success');
            setTimeout(() => {
              Modals.openCompletionNotice(moveResult.card);
            }, 300);
          } else {
            App.showToast(`Card movido para "${targetColumnId.toUpperCase()}"`, 'info');
          }
        }
      });
    });
  },

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.kanban-card:not(.is-dragging)')];

    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  },

  showCardQuickMenu(card) {
    const action = confirm(`Deseja excluir a demanda #${card.id} "${card.title}"?`);
    if (action) {
      StorageManager.deleteCard(card.id);
      this.renderBoard();
      App.showToast('Demanda excluída com sucesso', 'warning');
    }
  }
};
