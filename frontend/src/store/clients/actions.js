import axios from "axios";

export function init({ commit }) {
  axios.get(`${process.env.VUE_APP_BACKEND_URL}/clients`).then(res => {
    commit("set", res.data);
  });
}

export function add({ commit }, client) {
  const { service, code, name, xml_name, platform_id } = client;
  axios
    .put(`${process.env.VUE_APP_BACKEND_URL}/clients`, {
      service,
      code,
      name,
      xml_name,
      platform_id
    })
    .then(res => {
      console.log(res);
      commit("add", client);
    });
}

export function deleteClient({ commit }, clientId) {
  axios
    .delete(`${process.env.VUE_APP_BACKEND_URL}/clients/${clientId}`)
    .then(() => {
      commit("deleteClient", clientId);
    });
}

export function update({ commit }, { id, data }) {
  axios
    .patch(`${process.env.VUE_APP_BACKEND_URL}/clients/${id}`, data)
    .then(client => {
      console.log(client);
      commit("update", { id, data });
    });
}
