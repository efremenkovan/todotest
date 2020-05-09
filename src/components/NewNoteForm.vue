<template>
  <div class="new-note-form-wrapper"
     v-if="isVisible"
  >
    <div class="new-note-form__backplate" @click="closeFunction()"/>
    <form
      @submit.prevent="handleSubmit()"
      class="new-note-form"
      @keydown.enter.prevent=""
    >
      <h2 class="new-note-form__headline">Создание новой заметки</h2>
      <label class="form-label new-note-form__label">
        <span class="form-label__title new-note-form__label__title">Название заметки</span>
        <input
          type="text"
          v-model="title"
          class="new-note-form__label__input"
          required
        />
      </label>
      <label class="form-label new-note-form__label">
        <span class="form-label__title new-note-form__label__title">Новая задача</span>
        <input
          type="text"
          v-model="todoBody"
          @keydown.enter.prevent="addNewTodo($event)"
        />
      </label>
      <div class="new-note-form__todos" v-if="todos.length">
        <span class="new-note-form__todos__title">Задачи</span>
        <label v-for="todo of todos" :key="todo.id" class="new-note-form__todos__todo new-note-form__label">
          <input
            type="text"
            :value="todo.body"
            @input="changeTodo($event.target.value, todo.id)"
          />
          <button type="button" class="new-note-form__todos__todo__remove button" @click="removeTodo(todo.id)">
            Удалить
          </button>
        </label>
      </div>
      <button type="submit" class="new-note-form__button submit button">
        Сохранить заметку
      </button>
      <button type="button" class="new-note-form__button cancel button" @click="closeFunction()">
        Отменить
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: "NewNoteForm",
  props: {
    isVisible: Boolean,
    closeFunction: Function
  },
  data: () => ({
    todos: [],
    title: "",
    todoBody: "",
    errors: {
      title: [],
      todos: []
    }
  }),
  methods: {
    handleSubmit() {
      this.$store.dispatch("addCard", {
        id: new Date().getTime().toString(),
        title: this.title,
        todos: this.todos,
        save: null,
        undoneChanges: null
      });
      this.todos = [];
      this.title = "";
      this.closeFunction();
    },
    addNewTodo(event) {
      this.todos.unshift({
        body: event.target.value,
        isChecked: false,
        id: `todo#${new Date().getTime()}`
      });
      this.todoBody = "";
    },
    removeTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id);
    },
    changeTodo(value, id) {
      this.todos = this.todos.map(todo => todo.id === id ? { ...todo, body: value } : todo);
    }
  }
};
</script>

<style lang="scss">
.new-note-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  max-width: 600px;
  width: 100%;
  
  &-wrapper {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    --input-border-color: #c4c4c4;display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  &__backplate {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: rgba(41,41,41, 0.96);
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  
  &__headline {
    color: white;
    font-size: 1.71rem;
    margin-bottom: 42px;
  }
  
  input {
    color: white;
  }
  
  &__label {
    width: 100%;
  }
  
  &__button {
    color: white;
    width: 100%;
    
    &.submit {
      background-color: var(--accent);
      margin-bottom: 8px;
    }
    &.cancel {
      background-color: #c4c4c4;
    }
  }
  
  &__todos {
    max-height: 200px;
    overflow-y: auto;
    width: 100%;
    margin-bottom: 24px;
    
    &__title {
      display: block;
      margin-bottom: 24px;
      font-size: 1.4rem;
      padding-left: 8px;
      color: white;
    }
    
    &__todo {
      display: flex;
      width: 100%;
      margin-bottom: 16px;
      
      &__remove {
        font-size: 14px;
        padding: 8px 24px;
        font-weight: 400;
        background-color: var(--red);
        color: white;
        margin-left: 16px;
      }
    }
  }
}
</style>
