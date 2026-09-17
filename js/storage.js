/**
 * CRM DEMANDAS - NEXXO | GERENCIADOR DE ARMAZENAMENTO LOCAL
 * Persistência completa de demandas, prazos definidos pela equipe e comentários
 */

const STORAGE_KEY = 'NEXXO_CRM_KANBAN_DATA_V2';

const StorageManager = {
  getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Garante que a coluna 'entradas' esteja presente como primeira coluna
        if (parsed.columns && !parsed.columns.some(c => c.id === 'entradas')) {
          parsed.columns.unshift({ id: 'entradas', title: 'Entradas', color: '#6366f1', count: 0 });
          this.saveData(parsed);
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Erro ao ler do localStorage, utilizando dados padrão:', e);
    }
    this.saveData(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  },

  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar no localStorage:', e);
    }
  },

  addCard(card) {
    const data = this.getData();
    data.cards.unshift(card);
    this.saveData(data);
    return card;
  },

  updateCard(cardId, updates) {
    const data = this.getData();
    const index = data.cards.findIndex(c => c.id === cardId);
    if (index !== -1) {
      data.cards[index] = { ...data.cards[index], ...updates };
      this.saveData(data);
      return data.cards[index];
    }
    return null;
  },

  /**
   * Define o prazo oficial pela equipe interna NEXXO
   */
  setTeamDeadline(cardId, newDeadline, formattedDate) {
    const data = this.getData();
    const card = data.cards.find(c => c.id === cardId);
    if (!card) return null;

    card.teamDeadline = newDeadline;
    card.teamDeadlineFormatted = formattedDate;
    card.isPendingAnalysis = false; // Deixa de ser pendente!
    card.statusChip = 'No Prazo';

    if (!card.history) card.history = [];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    card.history.unshift({
      time: timeStr,
      text: `Prazo oficial estabelecido pela equipe: ${formattedDate}`
    });

    this.saveData(data);
    return card;
  },

  /**
   * Adiciona um comentário com autor, data e hora
   */
  addComment(cardId, author, text) {
    const data = this.getData();
    const card = data.cards.find(c => c.id === cardId);
    if (!card) return null;

    if (!card.comments) card.comments = [];
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newComment = {
      id: 'cmt-' + Date.now(),
      author: author || 'Equipe NEXXO',
      text: text,
      timestamp: `${dateStr} às ${timeStr}`
    };

    card.comments.push(newComment);
    card.commentsCount = card.comments.length;

    this.saveData(data);
    return newComment;
  },

  /**
   * Alterna o status do link compartilhado (Ativo / Desativado)
   */
  toggleShareLink(cardId) {
    const data = this.getData();
    const card = data.cards.find(c => c.id === cardId);
    if (!card) return null;

    card.shareLinkActive = !card.shareLinkActive;
    this.saveData(data);
    return card.shareLinkActive;
  },

  /**
   * Perfil Atual do Sistema (Administrador por padrão)
   */
  getCurrentRole() {
    return localStorage.getItem('NEXXO_CURRENT_ROLE') || 'admin';
  },

  setCurrentRole(role) {
    localStorage.setItem('NEXXO_CURRENT_ROLE', role);
  },

  isAdmin() {
    return this.getCurrentRole() === 'admin';
  },

  /**
   * Arquivamento seguro de card (nunca excluir definitivamente)
   */
  archiveCard(cardId) {
    const data = this.getData();
    const card = data.cards.find(c => c.id === cardId);
    if (!card) return null;

    card.archived = true;
    card.archivedAt = new Date().toISOString();

    if (!card.history) card.history = [];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    card.history.unshift({
      time: timeStr,
      text: 'Demanda arquivada pelo Administrador'
    });

    this.saveData(data);
    return card;
  },

  deleteCard(cardId) {
    // Redireciona sempre para arquivamento conforme solicitado: nunca como excluir
    return this.archiveCard(cardId);
  },

  moveCard(cardId, targetColumnId, targetIndex = null) {
    const data = this.getData();
    const cardIndex = data.cards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return null;

    const [card] = data.cards.splice(cardIndex, 1);
    const oldColumn = card.columnId;
    card.columnId = targetColumnId;

    if (targetColumnId === 'entrega') {
      card.statusChip = 'Concluído';
    }

    if (!card.history) card.history = [];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    card.history.unshift({
      time: timeStr,
      text: `Movido de ${oldColumn.toUpperCase()} para ${targetColumnId.toUpperCase()}`
    });

    if (targetIndex !== null && targetIndex >= 0) {
      const columnCards = data.cards.filter(c => c.columnId === targetColumnId);
      const referenceCard = columnCards[targetIndex];
      if (referenceCard) {
        const insertPos = data.cards.indexOf(referenceCard);
        data.cards.splice(insertPos, 0, card);
      } else {
        data.cards.push(card);
      }
    } else {
      data.cards.push(card);
    }

    this.saveData(data);
    return { card, oldColumn, newColumn: targetColumnId };
  },

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    return this.getData();
  }
};
