import Vue from "vue";

export function set(state, clients) {
  state.all = clients;
}

export function add(state, client) {
  state.all.push(client);
}

export function deleteClient(state, id) {
  const index = state.all.findIndex(client => client.id == id);
  if (index !== -1) {
    state.all.splice(index, 1);
  }
}

export function update(state, { id, data }) {
  const index = state.all.findIndex(client => client.id == id);
  for (let key in data) {
    Vue.set(state.all[index], key, data[key]);
  }
}
