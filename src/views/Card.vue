<template>
  <form class="card" @submit.prevent="saveChanges()" @keydown.enter.prevent="">
    <h1 class="card__headline">Редактирование заметки</h1>
    <label class="edit-note-form__label title form-label">
      <span class="form-label__title">Название заметки</span>
      <input type="text" :value="card.title" class="card__title" @input="handleTitleChange($event.target.value)"/>
    </label>
    <label class="edit-note-form__label form-label">
      <span class="form-label__title">Новая задача</span>
      <input
        type="text"
        v-model="todoBody"
        @keydown.enter="addNewTodo($event)"
      />
    </label>
    <div class="card__todos">
      <label v-for="todo of card.todos" :key="todo.id" class="card__todos__todo">
        <input
          type="checkbox"
          :checked="todo.isChecked"
          class="card__todos__todo__ischecked checkbox"
          @input="changeTodo('state', $event.target.value, todo.id)"
        />
        <div class="card__todos__todo__ischecked" />
        <input
          type="text"
          :value="todo.body"
          class="card__todos__todo__body"
          @input="changeTodo('body', $event.target.value, todo.id)"
        />
        <button @click="removeTodo(todo.id)" class="card__todos__todo__remove button">Удалить</button>
      </label>
    </div>
    <div class="card__actions">
      <button type="submit" class="card__actions__button save">
        <img src="/assets/save.svg" alt="Сохранить" title="Сохранить изменения" class="card__actions__button__icon"/>
      </button>
      <button
        type="button"
        @click="discardChanges()"
        class="card__actions__button discard"
      >
        <img src="/assets/discard.svg" alt="Сбросить" title="Сбросить внесенные изменения" class="card__actions__button__icon"/>
      </button>
      <button
        type="button"
        @click="undoChanges()"
        :disabled="card.save === null"
        class="card__actions__button undo"
      >
        <img src="/assets/undo.svg" alt="Отменить" title="Отменить действие" class="card__actions__button__icon"/>
      </button>
      <button
        type="button"
        @click="applyChanges()"
        :disabled="card.undoneChanges === null"
        class="card__actions__button applyChanges"
      >
        <img src="/assets/undo.svg" alt="Повторить" title="Повторить действие" class="card__actions__button__icon"/>
      </button>
      <button
        type="button"
        @click="removeNote()"
        class="card__actions__button remove"
      >
        <img src="/assets/remove.svg" alt="Удалить" title="Удалить заметку" class="card__actions__button__icon"/>
      </button>
    </div>
    <Modal
      :isVisible="modalSettings.isVisible"
      :title="modalSettings.title"
      :body="modalSettings.body"
      :buttons="modalSettings.buttons"
      :closeFunction="() => modalSettings.isVisible = false"
    />
  </form>
</template>

<script>
import Modal from "../components/Modal";
export default {
  name: "Card",
  props: {
    id: String
  },
  data: (component) => ({
    modalSettings: {
      isVisible: false,
      title: "",
      body: "",
      buttons: []
    },
    todoBody: "",
    card: {
      ...component.$store.getters.cardById(component.id),
      save: null,
      undoneChanges: null
    },
  }),
  components: { Modal },
  methods: {
    showModal(settings) {
      this.modalSettings = { isVisible: true, ...settings }
    },
    hideModal() {
      this.modalSettings = { ...this.modalSettings, isVisible: false }
    },
    handleTitleChange(newValue) {
      this.saveChangesForThisSession();
      this.card = {
        ...this.card,
        title: newValue
      };
    },
    saveChangesForThisSession() {
      this.card.save = { ...this.card };
    },
    saveChanges() {
      this.$store.dispatch("changeCard", {
        id: this.card.id,
        title: this.card.title,
        todos: this.card.todos,
      });
    },
    discardChanges() {
      this.showModal({
        title: "Вы уверены, что хотите сбросить изменения?",
        body: "В случае, если Вы передумаете, Вам придется внести эти изменения вручную.",
        buttons: [
          {
            label: "Нет, не сбрасывать",
            type: "primary",
            action: () => this.hideModal()
          },
          {
            label: "Да, сбросить",
            type: "secondary",
            action: () => {
              this.card = { ...this.$store.getters.cardById(this.id), save: null, undoneChanges: null};
              this.hideModal();
            }
          }
        ]
      });
    },
    removeNote() {
      this.showModal({
        title: "Вы уверены, что хотите удалить эту заметку?",
        body: "Удаленные заметки невозможно восстановить.",
        buttons: [
          {
            label: "Нет, не удалять",
            type: "primary",
            action: () => this.hideModal()
          },
          {
            label: "Да, удалить",
            type: "secondary",
            action: () => {
              this.$store.dispatch("removeCard", this.id);
              this.$router.replace("/");
            }
          },
        ]
      });
    },
    undoChanges() {
      this.card = {
        ...this.card.save,
        save: this.card.save.save,
        undoneChanges: this.card,
      };
    },
    applyChanges() {
      this.card = {
        ...this.card.undoneChanges,
        save: this.card,
        undoneChanges: this.card.undoneChanges.undoneChanges
      };
    },
    removeTodo(id) {
      this.saveChangesForThisSession();
      this.card.todos = this.card.todos.filter(todo => todo.id.toString() !== id.toString())
    },
    changeTodo(type = "state", value, id) {
      this.saveChangesForThisSession();
      this.card.todos = this.card.todos.map(todo => {
        if (todo.id === id) {
          if (type === "state")
            return {
              ...todo,
              isChecked: !todo.isChecked
            };
          else
            return {
              ...todo,
              body: value
            };
        }
        return todo;
      });
    },
    addNewTodo(event) {
      this.saveChangesForThisSession();
      this.card.todos = this.card.todos.concat({
        body: event.target.value,
        isChecked: false,
        id: `todo#${new Date().getTime()}`
      });
      this.todoBody = "";
    },
    handleKeyDown(event) {
      // Handling ctrl+z and ctrl+y shortcuts to sync it with my undo/applyChanges functions
      if ((event.ctrlKey || event.metaKey) && event.keyCode === 90) {
        event.preventDefault();
        this.card.save && this.undoChanges();
      } else if ((event.ctrlKey || event.metaKey) && event.keyCode === 89) {
        event.preventDefault();
        this.card.undoneChanges && this.applyChanges();
      }
    }
  },
  created() {
    if(!this.card.id)
      this.$router.replace('/notfound')
    window.addEventListener("keydown", this.handleKeyDown)
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeyDown)
    this.hideModal();
  }
};
</script>

<style lang="scss" scoped>
.card {
  --input-label-color: #c4c4c4;
  max-width: 640px;
  padding: 40px 20px;
  margin: 0 auto;
  
  &__headline {
    margin-bottom: 60px;
  }
  
  .edit-note-form__label.title {
    margin-bottom: 40px;
  }
  
  &__todos {
    &__todo {
      display: flex;
      margin-bottom: 24px;
      align-items: baseline;
      
      &__ischecked {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        display: block;
        border-radius: 4px;
        background-color: #dadada;
        
        background-size: 0px 0px;
        background-position: center center;
        background-repeat: no-repeat;
        
        &.checkbox {
          visibility: collapse;
          width: 0px;
          height: 0px;
        }
      }
      
      &__ischecked.checkbox:checked + &__ischecked {
        background-image: url("/assets/tick.svg");
        background-size: 10px 10px;
      }
      
      &__body {
        flex-grow: 1;
      }
      
      &__remove {
        color: white;
        background-color: var(--red);
        padding: 12px 24px;
        font-size: 14px;
        margin-left: 32px;
      }
    }
  }
  
  &__actions {
    margin-top: 48px;
    display: flex;
    
    &__button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      font-size: 10px;
      border: unset;
      font-weight: 600;
      padding: 8px;
      background-color: #47465f;
      
      &:not(:last-child) {
        margin-right: 16px;
      }
      
      &:disabled {
        opacity: 0.4;
      }
      
      &.applyChanges,
      &.undo,
      &.remove {
        .card__actions__button__icon {
          padding-bottom: 4px;
        }
      }
      
      &.applyChanges {
        transform: rotateY(180deg);
      }
      
      &__icon {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}

@media (max-width: 450px) {
  .card {
    &__headline {
      text-align: center;
    }
    
    &__actions {
      justify-content: space-between;
      flex-wrap: wrap;
  
      &__button,
      &__button:not(:last-child){
        margin: 0 auto;
      }
    }
  }
}
</style>
