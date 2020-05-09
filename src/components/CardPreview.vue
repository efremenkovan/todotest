<template>
  <router-link :to="`/cards/${card.id}`" class="card">
    <h3 class="card__title">{{ card.title }}</h3>
    <div class="card__todos" v-if="card.todos && card.todos.length > 0">
      <span
        v-for="todo of trimmedTodos"
        :key="todo.id"
        class="card__todos__todo__body"
        :class="{ 'checked' : todo.isChecked }"
      >{{ todo.body}}</span>
      <span
        class="card__todos__trim"
        v-if="trimmedTodos.length < card.todos.length"
      >
        {{ overLabel }}
      </span>
    </div>
    <div v-else>
      <span>У вас нет задач в этой заметке</span>
    </div>
    <div class="card__actions">
      <button @click.prevent="removeFunction()" class="button">Удалить</button>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "Card",
  props: {
    card: Object,
    setModal: Function
  },
  computed: {
    overLabel(state) {
      let overValue = state._props.card.todos.length - 3;
      if (["2", "3", "4"].includes(overValue.toString().split("").pop())) {
        return `+${overValue} задания`;
      } else if (overValue.toString().split("").pop() === "1") {
        return `+${overValue} задание`;
      } else {
        return `+${overValue} заданий`;
      }
    },
    trimmedTodos() {
      const todos = [];
      if (this.card.todos.length)
        for (let i = 0; i < 3; i++) {
          if (this.card.todos[i]) todos.push(this.card.todos[i]);
          else break;
        }
      return todos;
    }
  },
  methods: {
    removeFunction() {
      this.setModal({
        isVisible: true,
        title: `Вы уверены, что хотите удалить заметку "${this.card.title}"?`,
        body: "Удаление заметки невозможно отменить",
        buttons: [
          {
            label: "Нет, не удалять",
            type: "primary",
            action: () => this.setModal(prevState => ({ ...prevState, isVisible: false }))
          },
          {
            label: "Да, удалить",
            type: "secondary",
            action: () => {
              this.$store.dispatch("removeCard", this.card.id);
              this.setModal(prevState => ({ ...prevState, isVisible: false }));
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  text-decoration: none;
  width: 100%;
  padding: 30px 40px;
  color: var(--dark);
  box-shadow: 2px 4px 32px rgba(41, 41, 41, 0.16);
  border-radius: 6px;
  max-width: 600px;
  margin: 40px auto 0;
  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;
  
  &:visited {
    color: inherit;
  }
  
  &:hover {
    box-shadow: 2px 4px 52px rgba(41, 41, 41, 0.16);
    transform: scale(1.015);
  }
  
  &__title {
    font-size: 1.61rem;
    margin-bottom: 16px;
  }
  
  &__todos {
    display: flex;
    flex-direction: column;
  
    &__todo__body {
      &:not(:last-child) {
        margin-bottom: 8px;
      }
      
      &.checked {
        color: #c4c4c4;
        text-decoration: line-through;
      }
    }
  }
  
  & button {
    margin-top: 16px;
    background-color: var(--red);
    padding: 12px 24px;
    font-size: 14px;
    color: white;
  }
}
</style>
