/**
 * CRM DEMANDAS - NEXXO | CONTROLADOR DE MODAIS & INTERATIVIDADE
 * Modal Novo Card unificado, Modal Amplo de Compartilhamento com Ativação/Desativação e Drawer com Prazos e Comentários
 */

const Modals = {
  activeModal: null,
  activeDrawerCardId: null,

  init() {
    this.setupListeners();
  },

  setupListeners() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeAllModals();
        }
      });
    });

    const drawerOverlay = document.getElementById('cardDrawerOverlay');
    if (drawerOverlay) {
      drawerOverlay.addEventListener('click', (e) => {
        if (e.target === drawerOverlay) {
          this.closeDrawer();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
        this.closeDrawer();
      }
    });
  },

  openModal(modalId) {
    this.closeAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('is-active');
      this.activeModal = modal;
      const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
      if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('is-active'));
    this.activeModal = null;
  },

  newCardSubtasks: [],

  // =========================================================================
  // 1. MODAL UNIFICADO: "NOVO CARD" (IMAGEM 2) COM SUBTAREFAS OPERACIONAIS
  // =========================================================================
  openNewCardModal(defaultColumnId = 'entradas') {
    const data = StorageManager.getData();
    const colSelect = document.getElementById('ncColumn');
    const respSelect = document.getElementById('ncAssignee');
    const tagsContainer = document.getElementById('ncTagsContainer');

    if (colSelect) {
      colSelect.innerHTML = data.columns.map(col => `
        <option value="${col.id}" ${col.id === defaultColumnId ? 'selected' : ''}>${col.title}</option>
      `).join('');
    }

    if (respSelect) {
      respSelect.innerHTML = `
        <option value="">Sem responsável</option>
        ${data.members.map(m => `<option value="${m.id}">${m.name} (${m.role})</option>`).join('')}
      `;
    }

    if (tagsContainer) {
      tagsContainer.innerHTML = data.tags.map(tag => `
        <span class="tag-select-chip" data-tag-id="${tag.id}" style="background-color: ${tag.bg}; color: ${tag.color};">
          ${tag.name}
        </span>
      `).join('');

      tagsContainer.querySelectorAll('.tag-select-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          chip.classList.toggle('is-selected');
        });
      });
    }

    document.getElementById('ncTitle').value = '';
    document.getElementById('ncContactSearch').value = '';
    document.getElementById('ncPriority').value = 'Sem prioridade';
    document.getElementById('ncDueDate').value = '';
    const subtaskInput = document.getElementById('ncSubtaskInput');
    if (subtaskInput) subtaskInput.value = '';

    // Subtarefas operacionais padrão para agilizar o fluxo
    this.newCardSubtasks = [
      'Validação de briefing e escopo',
      'Produção e execução da demanda'
    ];
    this.renderModalSubtasks();

    this.openModal('modalNewCard');
  },

  addModalSubtask() {
    const input = document.getElementById('ncSubtaskInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    if (!this.newCardSubtasks) this.newCardSubtasks = [];
    this.newCardSubtasks.push(text);
    input.value = '';
    input.focus();
    this.renderModalSubtasks();
  },

  removeModalSubtask(index) {
    if (!this.newCardSubtasks) return;
    this.newCardSubtasks.splice(index, 1);
    this.renderModalSubtasks();
  },

  renderModalSubtasks() {
    const list = document.getElementById('ncSubtasksList');
    const count = document.getElementById('ncSubtasksCount');
    if (!list) return;
    if (!this.newCardSubtasks) this.newCardSubtasks = [];

    if (count) {
      count.textContent = `${this.newCardSubtasks.length} subtarefa${this.newCardSubtasks.length !== 1 ? 's' : ''}`;
    }

    if (this.newCardSubtasks.length === 0) {
      list.innerHTML = '<li style="font-size:0.8rem; color:var(--text-subtle); padding:6px 0;">Nenhuma subtarefa adicionada. Digite acima para incluir.</li>';
      return;
    }

    list.innerHTML = this.newCardSubtasks.map((task, idx) => `
      <li style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border:1px solid var(--border-light); padding:7px 12px; border-radius:var(--radius-sm); font-size:0.86rem;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="color:var(--primary); font-weight:700;">○</span>
          <span style="color:var(--text-main);">${task}</span>
        </div>
        <button type="button" style="border:none; background:transparent; color:#ef4444; cursor:pointer; font-size:0.88rem; font-weight:700; padding:2px 6px;" onclick="Modals.removeModalSubtask(${idx})" title="Remover subtarefa">
          ✕
        </button>
      </li>
    `).join('');
  },

  submitNewCard() {
    const title = document.getElementById('ncTitle').value.trim();
    if (!title) {
      alert('Por favor, informe o título do card.');
      document.getElementById('ncTitle').focus();
      return;
    }

    const columnId = document.getElementById('ncColumn').value;
    const priority = document.getElementById('ncPriority').value;
    const assignee = document.getElementById('ncAssignee').value;
    const dueDate = document.getElementById('ncDueDate').value;
    const contactSearch = document.getElementById('ncContactSearch').value.trim();

    let teamDeadlineFormatted = 'Pendente de Definição';
    let isPending = true;

    if (dueDate) {
      const parts = dueDate.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        teamDeadlineFormatted = `${parts[2]} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;
        isPending = false;
      }
    }

    const now = new Date();
    const submittedAt = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const cardId = `DEM-${randomNum}`;

    const checklistItems = (this.newCardSubtasks && this.newCardSubtasks.length > 0)
      ? this.newCardSubtasks.map(text => ({ text, done: false }))
      : [
          { text: 'Análise de escopo e briefing', done: false },
          { text: 'Execução e entrega da demanda', done: false }
        ];

    const newCard = {
      id: cardId,
      title: title,
      description: contactSearch ? `Contato: ${contactSearch}` : 'Demanda registrada internamente.',
      clientName: contactSearch || 'Nexxo Geral',
      workspace: 'nexxo-geral',
      statusChip: isPending ? 'Pendente de Análise' : 'Não Iniciado',
      columnId: columnId || 'entradas',
      priority: priority === 'Sem prioridade' ? 'Baixa' : priority,
      assignees: assignee ? [assignee] : [],
      submittedAt: submittedAt,
      teamDeadline: dueDate || null,
      teamDeadlineFormatted: teamDeadlineFormatted,
      isPendingAnalysis: isPending,
      shareLinkActive: true,
      commentsCount: 0,
      linksCount: 1,
      checklist: checklistItems,
      comments: [],
      driveLink: 'https://sistema.nexxoplat.com/crm',
      history: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Card criado no quadro' }
      ]
    };

    StorageManager.addCard(newCard);
    Kanban.renderBoard();
    this.closeAllModals();
    App.showToast(`Card #${cardId} criado com sucesso!`, 'success');
  },

  // =========================================================================
  // 2. MODAL AMPLO DE "COMPARTILHAR" (LISTAGEM DE CARDS & ATIVAR/DESATIVAR)
  // =========================================================================
  openShareModal() {
    this.renderShareTable();
    this.openModal('modalShareLarge');
  },

  renderShareTable(filterQuery = '') {
    const data = StorageManager.getData();
    const tbody = document.getElementById('shareTableBody');
    if (!tbody) return;

    let cards = data.cards;
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      cards = cards.filter(c => 
        c.id.toLowerCase().includes(q) ||
        (c.clientName || '').toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.columnId.toLowerCase().includes(q)
      );
    }

    const columnNames = {
      demandas: 'Demandas',
      conteudo: 'Conteúdo',
      designer: 'Designer',
      trafego: 'Tráfego',
      aprovacao: 'Aprovação',
      entrega: 'Entrega'
    };

    tbody.innerHTML = cards.map(c => {
      const isActive = c.shareLinkActive !== false;
      const shareUrl = `${window.location.origin}/portal-franqueado.html?card=${c.id}&client=${encodeURIComponent(c.clientName)}`;

      return `
        <tr>
          <td>
            <strong style="font-family:monospace; color:var(--text-main); font-size:0.88rem;">#${c.id}</strong>
          </td>
          <td>
            <span style="font-weight:700; color:var(--primary);">${c.clientName}</span>
          </td>
          <td>
            <div style="font-weight:600; color:var(--text-main); line-height:1.2;">${c.title}</div>
            <span style="font-size:0.75rem; color:var(--text-muted);">Prazo: ${c.teamDeadlineFormatted || 'Pendente'}</span>
          </td>
          <td>
            <span class="status-chip status-${c.columnId}" style="font-size:0.72rem;">
              ${columnNames[c.columnId] || c.columnId}
            </span>
          </td>
          <td>
            <div class="toggle-switch-container" onclick="Modals.toggleCardLink('${c.id}')" title="Clique para Ativar ou Desativar o link">
              <div class="toggle-switch ${isActive ? 'is-active' : ''}"></div>
              <span class="${isActive ? 'status-badge-active' : 'status-badge-inactive'}">
                ${isActive ? 'Link Ativo' : 'Desativado'}
              </span>
            </div>
          </td>
          <td style="text-align: right;">
            <button class="btn btn-secondary" style="height:32px; padding:0 12px; font-size:0.78rem;" onclick="Modals.copyCustomShareLink('${shareUrl}')">
              📋 Copiar Link
            </button>
            <a href="${shareUrl}" target="_blank" class="btn btn-outline-primary" style="height:32px; padding:0 10px; font-size:0.78rem;" title="Abrir no portal">
              ↗
            </a>
          </td>
        </tr>
      `;
    }).join('');
  },

  toggleCardLink(cardId) {
    const newState = StorageManager.toggleShareLink(cardId);
    this.renderShareTable(document.getElementById('shareSearchInput').value);
    App.showToast(`Link do card #${cardId} ${newState ? 'ATIVADO' : 'DESATIVADO'}`, newState ? 'success' : 'warning');
  },

  copyCustomShareLink(url) {
    navigator.clipboard.writeText(url).then(() => {
      App.showToast('Link de acompanhamento copiado com sucesso!', 'success');
    });
  },

  // =========================================================================
  // 3. DRAWER LATERAL DE DETALHES (DEFINIÇÃO DE PRAZO PELA EQUIPE E COMENTÁRIOS)
  // =========================================================================
  openCardDrawer(cardId) {
    const data = StorageManager.getData();
    const card = data.cards.find(c => c.id === cardId);
    if (!card) return;

    this.activeDrawerCardId = cardId;
    const overlay = document.getElementById('cardDrawerOverlay');
    const isAdmin = StorageManager.isAdmin();

    const isPending = card.isPendingAnalysis || !card.teamDeadline;

    // Header
    document.getElementById('drawerCardId').textContent = `#${card.id}`;
    document.getElementById('drawerCardTitle').textContent = card.title;

    // Indicador e permissões de perfil no Drawer
    const roleIndicator = document.getElementById('drawerRoleIndicator');
    const nonAdminNotice = document.getElementById('drawerNonAdminNotice');
    const deadlineInput = document.getElementById('drawerDeadlineInput');
    const btnSaveDeadline = document.getElementById('drawerBtnSaveDeadline');
    const btnEditDetails = document.getElementById('drawerBtnEditDetails');
    const addSubtaskRow = document.getElementById('drawerAddSubtaskRow');

    if (roleIndicator) {
      if (isAdmin) {
        roleIndicator.style.background = '#eff6ff';
        roleIndicator.style.color = '#1d4ed8';
        roleIndicator.style.border = '1px solid #bfdbfe';
        roleIndicator.innerHTML = '🛡️ Administrador (Edição e Prazos Liberados)';
      } else {
        roleIndicator.style.background = '#fef2f2';
        roleIndicator.style.color = '#991b1b';
        roleIndicator.style.border = '1px solid #fecaca';
        roleIndicator.innerHTML = '👤 Colaborador (Modo Somente Leitura)';
      }
    }

    if (nonAdminNotice) {
      nonAdminNotice.style.display = isAdmin ? 'none' : 'block';
    }

    if (deadlineInput) {
      deadlineInput.disabled = !isAdmin;
    }

    if (btnSaveDeadline) {
      btnSaveDeadline.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    if (btnEditDetails) {
      btnEditDetails.style.display = isAdmin ? 'inline-flex' : 'none';
    }

    if (addSubtaskRow) {
      addSubtaskRow.style.display = isAdmin ? 'flex' : 'none';
    }

    // Reset modo de edição
    this.toggleDrawerEditMode(false);

    const badgeEl = document.getElementById('drawerClientBadge');
    if (isPending) {
      badgeEl.className = 'tag-client-demand-pending';
      badgeEl.innerHTML = `<span class="pending-pulse"></span>NOVO • Demanda [${card.clientName}] Pendente`;
    } else {
      badgeEl.className = 'tag-client-demand';
      badgeEl.innerHTML = `<span class="client-dot"></span>Demanda [${card.clientName}]`;
    }

    // Datas e Meta
    document.getElementById('drawerSubmittedAt').textContent = card.submittedAt || 'Não informado';
    document.getElementById('drawerColumnName').textContent = card.columnId.toUpperCase();
    document.getElementById('drawerPriority').textContent = card.priority;
    document.getElementById('drawerDesc').textContent = card.description || 'Nenhuma descrição fornecida.';

    // Caixa de Definição de Prazo da Equipe NEXXO
    const deadlineBox = document.getElementById('drawerDeadlineBox');
    deadlineBox.className = `deadline-setting-box ${isPending ? 'is-pending' : ''}`;
    
    document.getElementById('drawerDeadlineInput').value = card.teamDeadline || '';
    document.getElementById('drawerDeadlineCurrentText').textContent = card.teamDeadlineFormatted || 'Pendente de Definição pela Equipe';

    // Link do Sistema
    const linkContainer = document.getElementById('drawerLinkContainer');
    linkContainer.innerHTML = `
      <a href="https://sistema.nexxoplat.com/crm" target="_blank" class="btn btn-outline-primary" style="font-size: 0.85rem; padding: 6px 14px;">
        🔗 Acessar Sistema Nexxo (CRM)
      </a>
    `;

    // Renderizar Comentários com Autor e Data
    this.renderDrawerComments(card);

    // Checklist e Contador
    const checklistList = document.getElementById('drawerChecklistList');
    const counterEl = document.getElementById('drawerChecklistCounter');
    checklistList.innerHTML = '';

    const total = card.checklist ? card.checklist.length : 0;
    const done = card.checklist ? card.checklist.filter(c => c.done).length : 0;
    if (counterEl) {
      counterEl.textContent = `${done}/${total} concluídas`;
    }

    if (card.checklist && card.checklist.length > 0) {
      card.checklist.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `checklist-item ${item.done ? 'done' : ''}`;
        li.innerHTML = `
          <input type="checkbox" ${item.done ? 'checked' : ''} id="chk-${index}">
          <label for="chk-${index}">${item.text}</label>
          ${isAdmin ? `
            <button type="button" style="margin-left:auto; border:none; background:transparent; color:#94a3b8; cursor:pointer; font-size:0.8rem; padding:2px 6px;" title="Excluir subtarefa" onclick="Modals.deleteDrawerSubtask(${index})">
              ✕
            </button>
          ` : ''}
        `;
        li.querySelector('input').addEventListener('change', (e) => {
          card.checklist[index].done = e.target.checked;
          StorageManager.updateCard(card.id, { checklist: card.checklist });
          li.classList.toggle('done', e.target.checked);
          const newDone = card.checklist.filter(c => c.done).length;
          if (counterEl) counterEl.textContent = `${newDone}/${card.checklist.length} concluídas`;
          Kanban.renderBoard();
        });
        checklistList.appendChild(li);
      });
    } else {
      checklistList.innerHTML = '<li style="font-size:0.84rem; color:var(--text-subtle); padding:6px 0;">Nenhuma subtarefa criada.</li>';
    }

    // Histórico de alterações
    const historyList = document.getElementById('drawerHistoryList');
    historyList.innerHTML = (card.history || []).map(h => `
      <div style="font-size:0.82rem; color:var(--text-muted); display:flex; gap:10px; padding: 4px 0;">
        <span style="font-weight:700; color:var(--primary);">${h.time}</span>
        <span>${h.text}</span>
      </div>
    `).join('');

    // Botão Concluir
    const btnDeliver = document.getElementById('drawerBtnDeliver');
    btnDeliver.onclick = () => {
      if (!StorageManager.isAdmin()) {
        App.showToast('Permissão negada: Apenas o Administrador pode mover a demanda para Entrega.', 'warning');
        return;
      }
      StorageManager.moveCard(card.id, 'entrega');
      Kanban.renderBoard();
      this.closeDrawer();
      this.openCompletionNotice(card);
    };

    overlay.classList.add('is-active');
  },

  toggleDrawerEditMode(forceState) {
    const isEdit = forceState !== undefined ? forceState : (document.getElementById('drawerDescEdit').style.display !== 'flex');
    const titleView = document.getElementById('drawerTitleViewContainer');
    const titleEdit = document.getElementById('drawerTitleEditContainer');
    const descView = document.getElementById('drawerDescView');
    const descEdit = document.getElementById('drawerDescEdit');
    const editBtn = document.getElementById('drawerBtnEditDetails');

    if (isEdit && !StorageManager.isAdmin()) {
      App.showToast('Apenas o Administrador pode editar detalhes dos cards.', 'warning');
      return;
    }

    const data = StorageManager.getData();
    const card = data.cards.find(c => c.id === this.activeDrawerCardId);

    if (isEdit && card) {
      document.getElementById('drawerEditTitleInput').value = card.title;
      document.getElementById('drawerEditDescTextarea').value = card.description || '';
      if (titleView) titleView.style.display = 'none';
      if (titleEdit) titleEdit.style.display = 'block';
      if (descView) descView.style.display = 'none';
      if (descEdit) descEdit.style.display = 'flex';
      if (editBtn) editBtn.style.display = 'none';
    } else {
      if (titleView) titleView.style.display = 'block';
      if (titleEdit) titleEdit.style.display = 'none';
      if (descView) descView.style.display = 'block';
      if (descEdit) descEdit.style.display = 'none';
      if (editBtn && StorageManager.isAdmin()) editBtn.style.display = 'inline-flex';
    }
  },

  saveCardDetails() {
    if (!StorageManager.isAdmin()) {
      App.showToast('Apenas o Administrador pode editar detalhes dos cards.', 'warning');
      return;
    }
    const cardId = this.activeDrawerCardId;
    if (!cardId) return;

    const newTitle = document.getElementById('drawerEditTitleInput').value.trim();
    const newDesc = document.getElementById('drawerEditDescTextarea').value.trim();

    if (!newTitle) {
      alert('O título da demanda não pode ficar vazio.');
      return;
    }

    StorageManager.updateCard(cardId, {
      title: newTitle,
      description: newDesc
    });

    document.getElementById('drawerCardTitle').textContent = newTitle;
    document.getElementById('drawerDesc').textContent = newDesc || 'Nenhuma descrição fornecida.';
    this.toggleDrawerEditMode(false);
    Kanban.renderBoard();
    App.showToast('Demanda atualizada com sucesso pelo Administrador!', 'success');
  },

  addDrawerSubtask() {
    if (!StorageManager.isAdmin()) {
      App.showToast('Apenas o Administrador pode adicionar subtarefas aos cards.', 'warning');
      return;
    }
    const cardId = this.activeDrawerCardId;
    if (!cardId) return;

    const input = document.getElementById('drawerNewSubtaskInput');
    const text = input ? input.value.trim() : '';
    if (!text) return;

    const data = StorageManager.getData();
    const card = data.cards.find(c => c.id === cardId);
    if (!card) return;

    if (!card.checklist) card.checklist = [];
    card.checklist.push({ text: text, done: false });
    StorageManager.updateCard(cardId, { checklist: card.checklist });
    input.value = '';

    this.openCardDrawer(cardId);
    Kanban.renderBoard();
    App.showToast('Subtarefa adicionada com sucesso!', 'success');
  },

  deleteDrawerSubtask(index) {
    if (!StorageManager.isAdmin()) {
      App.showToast('Apenas o Administrador pode excluir subtarefas.', 'warning');
      return;
    }
    const cardId = this.activeDrawerCardId;
    if (!cardId) return;

    const data = StorageManager.getData();
    const card = data.cards.find(c => c.id === cardId);
    if (!card || !card.checklist) return;

    card.checklist.splice(index, 1);
    StorageManager.updateCard(cardId, { checklist: card.checklist });
    this.openCardDrawer(cardId);
    Kanban.renderBoard();
    App.showToast('Subtarefa removida!', 'info');
  },

  saveTeamDeadlineToCard() {
    if (!StorageManager.isAdmin()) {
      App.showToast('Permissão negada: Apenas o Administrador pode definir ou alterar o prazo oficial.', 'warning');
      return;
    }
    const cardId = this.activeDrawerCardId;
    if (!cardId) return;

    const dateVal = document.getElementById('drawerDeadlineInput').value;
    if (!dateVal) {
      alert('Selecione uma data para definir o prazo oficial.');
      return;
    }

    const parts = dateVal.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const formatted = `${parts[2]} ${months[parseInt(parts[1]) - 1]} ${parts[0]}`;

    StorageManager.setTeamDeadline(cardId, dateVal, formatted);
    Kanban.renderBoard();
    this.openCardDrawer(cardId); // Recarrega os dados do drawer
    App.showToast(`Prazo oficial definido para ${formatted}!`, 'success');
  },

  renderDrawerComments(card) {
    const container = document.getElementById('drawerCommentsThread');
    if (!container) return;

    const comments = card.comments || [];
    if (comments.length === 0) {
      container.innerHTML = '<p style="font-size:0.82rem; color:var(--text-subtle);">Nenhum comentário registrado ainda.</p>';
      return;
    }

    container.innerHTML = comments.map(c => `
      <div class="comment-card">
        <div class="comment-meta">
          <span class="comment-author-name">👤 ${c.author}</span>
          <span class="comment-timestamp">${c.timestamp}</span>
        </div>
        <div style="color:var(--text-main); line-height:1.45;">${c.text}</div>
      </div>
    `).join('');
  },

  submitNewComment() {
    const cardId = this.activeDrawerCardId;
    if (!cardId) return;

    const authorSelect = document.getElementById('commentAuthorSelect');
    const input = document.getElementById('commentTextInput');
    const text = input.value.trim();

    if (!text) return;

    const author = authorSelect ? authorSelect.value : 'Equipe NEXXO';
    StorageManager.addComment(cardId, author, text);
    input.value = '';

    const data = StorageManager.getData();
    const updatedCard = data.cards.find(c => c.id === cardId);
    if (updatedCard) {
      this.renderDrawerComments(updatedCard);
    }
    Kanban.renderBoard();
    App.showToast('Comentário adicionado!', 'success');
  },

  closeDrawer() {
    const overlay = document.getElementById('cardDrawerOverlay');
    if (overlay) overlay.classList.remove('is-active');
    this.activeDrawerCardId = null;
  },

  // =========================================================================
  // 4. MODAL AVISO DE FINALIZAÇÃO (WHATSAPP)
  // =========================================================================
  openCompletionNotice(card) {
    document.getElementById('noticeCardTitle').textContent = card.title;
    document.getElementById('noticeClientName').textContent = card.clientName || 'Franqueado';
    
    const driveLink = 'https://sistema.nexxoplat.com/crm';
    const messageTemplate = 
`🎉 *Demanda Concluída com Sucesso!*

Olá, equipe da *${card.clientName || 'Franquia Nexxo'}*! 
Informamos que a demanda "*${card.title}*" (#${card.id}) foi finalizada pela nossa equipe de produção e tráfego.

📁 *Acesse os materiais e arquivos prontos no CRM:*
${driveLink}

Qualquer dúvida ou ajuste que precisar, estamos 100% à disposição!
_Equipe NEXXO Demandas_`;

    const textarea = document.getElementById('noticeMessageText');
    textarea.value = messageTemplate;

    const waBtn = document.getElementById('btnSendWhatsappNotice');
    waBtn.onclick = () => {
      const encodedMsg = encodeURIComponent(messageTemplate);
      window.open(`https://api.whatsapp.com/send?text=${encodedMsg}`, '_blank');
    };

    const copyBtn = document.getElementById('btnCopyNoticeMsg');
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(messageTemplate).then(() => {
        App.showToast('Mensagem copiada para a área de transferência!', 'success');
      });
    };

    this.openModal('modalCompletionNotice');
  }
};
