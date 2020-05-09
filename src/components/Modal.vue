<template>
  <div class="modal" v-if="isVisible">
    <div class="modal__backplate" @click="closeFunction()"></div>
    <div class="modal__content">
      <h3 class="modal__content__title">{{title}}</h3>
      <p class="modal__content__body">{{body}}</p>
      <div class="modal__content__actions">
        <button
          v-for="(button, index) of buttons"
          :key="index"
          @click="button.action"
          class="button"
          :class="button.type"
        >
          {{button.label}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    isVisible: Boolean,
    title: String,
    body: String,
    buttons: Array,
    closeFunction: Function
  }
}
</script>

<style lang="scss">
.modal {
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  
  &__backplate {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: rgba(41,41,41, 0.96);
    z-index: -1;
  }
  
  &__content {
    width: 86vw;
    max-width: 600px;
    margin: 0 auto;
    background-color: white;
    padding: 30px 40px;
    border-radius: 6px;
    
    &__title {
      margin-bottom: 1.1em;
    }
    
    &__body {
      line-height: 1.51;
    }
    
    &__actions {
      margin-top: 20px;
      
      button {
        color: white;
        
        &:not(:last-child) {
          margin-right: 16px;
        }
        
        &.primary {
          background-color: var(--accent);
        }
  
        &.secondary {
          background-color: #c4c4c4;
        }
      }
    }
  }
}

@media (max-width: 550px) {
  .modal {
    text-align: center;
    
    button {
      width: 100%;
      
      &:last-child{
        margin-top: 16px;
      }
    }
  }
}
</style>
