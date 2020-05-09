<template>
  <div id="app">
    <main>
      <router-view />
    </main>
  </div>
</template>

<style lang="scss">
:root {
  --accent: #4EADFE;
  --dark: #313131;
  --input-border-color: #313131;
  --red: #e85050;
  --input-label-color: white;
  --green: #7ad63c;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark);
}

*, *:before, *:after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html {
  font-size: 16px;
}

h1 {
  font-size: 2.5rem;
}

@media (max-width: 650px) {
  h1 {
    font-size: 2rem;
  }
}

input:not([type="checkbox"]):not([type="radio"]) {
  border: unset;
  border-bottom: 1px solid var(--input-border-color);
  background-color: unset;
  padding-left: 8px;
  padding-bottom: 8px;
  width: 100%;
  /*min-width: 200px;*/
  transition: border-color 0.4s ease-in-out;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-bottom-color: var(--accent);
  }
}

button {
  &:not(:disabled):hover {
    cursor: pointer;
    filter: brightness(1.1);
  }
  
  &:focus {
    outline: none;
    filter: brightness(1.1);
  }
}

.button {
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.03em;
  background-color: unset;
  border: unset;
  border-radius: 6px;
  padding: 16px 32px;
  filter: brightness(1);
  transition: transform 0.2s ease-in-out;
}

.container {
  max-width: 1170px;
  padding: 40px 20px 0;
  margin: 0 auto;
}

.form-label {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 48px;
  font-size: 12px;
  letter-spacing: 0.03em;
  
  &__title {
    color: var(--input-label-color);
    margin-bottom: 10px;
    margin-left: 8px;
  }
}
</style>
