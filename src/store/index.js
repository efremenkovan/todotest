import Vue from "vue";
import Vuex from "vuex";
import CardsModule from "./modules/cards";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { CardsModule }
});
