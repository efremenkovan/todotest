<template>
  <section class="home container">
    <h1
      class="home__headline"
      :class="{'small-margin': cards.length > 0}"
    >
      Ваши заметки
    </h1>
    <div class="home__notes" v-if="cards.length">
      <button class="home__new-note-button button" @click="openNewNoteForm()">
        Создать новую заметку
      </button>
      <Note
        v-for="card of cards"
        :key="card.id"
        :card="card"
        :setModal="changeModalSettings"
      />
     <!-- Модальное окно для подтверждения удаления заметки -->
      <Modal
        :isVisible="modalSettings.isVisible"
        :body="modalSettings.body"
        :title="modalSettings.title"
        :buttons="modalSettings.buttons"
        :closeFunction="() => modalSettings.isVisible = false"
      />
    </div>
    <div class="home__notes home__notes--empty-state" v-else>
      <img
        src="/assets/empty.svg"
        alt="У вас еще нет заметок"
        title="Нет заметок"
        class="home__notes--empty-state__icon"
      />
      <span>У Вас еще нет заметок.</span>
      <button class="home__new-note-button button" @click="openNewNoteForm()">
        Создать первую заметку
      </button>
    </div>
    <NewNoteForm
      :closeFunction="hideNewNoteForm"
      :isVisible="isNewNoteFormVisible"
    />
  </section>
</template>

<script>
import Note from "../components/CardPreview";
import Modal from "../components/Modal";
import NewNoteForm from "../components/NewNoteForm";

export default {
  name: "Home",
  components: { NewNoteForm, Modal, Note },
  data: () => ({
    modalSettings: {
      isVisible: false,
      title: "",
      body: "",
      buttons: []
    },
    isNewNoteFormVisible: false
  }),
  methods: {
    hideNewNoteForm() {
      this.isNewNoteFormVisible = false;
    },
    openNewNoteForm() {
      this.isNewNoteFormVisible = true;
    },
    changeModalSettings(stateChanger) {
      typeof stateChanger === "function"
        ? this.modalSettings = stateChanger(this.modalSettings)
        : this.modalSettings = stateChanger
    }
  },
  computed: {
    cards() {
      return this.$store.getters.allCards;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &__headline {
    margin-bottom: 96px;
    
    &.small-margin {
      margin-bottom: 32px;
    }
  }
  
  &__new-note-button {
    background-color: var(--accent);
    color: white;
    width: max-content;
    margin: 0 auto;
  }
  
  &__notes {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    
    &--empty-state {
      font-size: 1.31rem;
      align-items: center;
      margin: 0 auto;
      
      &__icon {
        max-width: 140px;
        margin-bottom: 64px;
      }
      
      button {
        margin-top: 24px;
      }
    }
  }
}
</style>
