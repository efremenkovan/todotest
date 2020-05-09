function saveNotes(notes) {
  localStorage.setItem("notes", JSON.stringify(notes))
}

export default {
  state: {
    cards: JSON.parse(localStorage.getItem("notes")) || []
  },
  mutations: {
    removeCard(state, id) {
      state.cards = state.cards.filter(card => card.id !== id);
      saveNotes(state.cards);
    },
    addCard(state, card) {
      state.cards.unshift(card);
      saveNotes(state.cards);
    },
    changeCard(state, changedCard) {
      state.cards = state.cards.map(card => card.id === changedCard.id ? changedCard : card);
      saveNotes(state.cards);
    }
  },
  actions: {
    removeCard(context, id) {
      context.commit("removeCard", id);
    },
    addCard(context, card) {
      context.commit("addCard", card);
    },
    changeCard(context, cardInfo) {
      context.commit("changeCard", cardInfo);
    }
  },
  getters: {
    allCards(state) {
      return state.cards;
    },
    cardById(state) {
      // We have to make a copy of the note object 'case we don't want to mutate it as if it was just a link.
      return id => ({ ...state.cards.find(card => card.id === id) });
    }
  }
};
