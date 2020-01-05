<template>
  <q-page-container>
    <table class="tw-m-8">
      <thead>
        <th>#</th>
        <th>Service</th>
        <th>Code</th>
        <th>Name</th>
        <th>XML Name</th>
        <th>Platform Id</th>
        <th class="tw-p-2"></th>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client.id">
          <td>{{ client.id }}</td>
          <td>{{ client.service }}</td>
          <td>{{ client.code }}</td>
          <td>{{ client.name }}</td>
          <td>{{ client.xml_name }}</td>
          <td>{{ client.platform_id }}</td>
          <td class="tw-p-2">
            <q-btn
              round
              color="red"
              dense
              flat
              size="xs"
              icon="delete"
              @click="deleteClient(client.id)"
            />
          </td>
        </tr>
        <tr>
          <th></th>
          <th>
            <q-select
              v-model="service"
              :options="['ciga', 'cinta']"
              label="Service"
            />
          </th>
          <th><q-input v-model="code" label="Code" /></th>
          <th><q-input v-model="name" label="Name" /></th>
          <th><q-input v-model="xml" label="XML Name" /></th>
          <th><q-input v-model="platform" label="Platform ID" /></th>
          <th class="tw-p-2">
            <q-btn
              color="red"
              dense
              flat
              size="xs"
              icon="add"
              label="Add"
              @click="add"
            />
          </th>
        </tr>
      </tbody>
    </table>
  </q-page-container>
</template>

<script>
import axios from "axios";
const DEFAULT_SERVICE = "ciga";
export default {
  data() {
    return {
      clients: [],
      service: DEFAULT_SERVICE,
      code: "",
      name: "",
      xml: "",
      platform: ""
    };
  },

  computed: {},

  mounted() {
    axios.get(`${process.env.VUE_APP_BACKEND_URL}/clients`).then(res => {
      this.clients = res.data;
    });
  },

  methods: {
    add() {
      axios
        .put(`${process.env.VUE_APP_BACKEND_URL}/clients`, {
          service: this.service,
          code: this.code,
          name: this.name,
          xml_name: this.xml,
          platform_id: this.platform
        })
        .then(res => {
          this.clients.push(res.data);
          this.service = DEFAULT_SERVICE;
          this.code = "";
          this.name = "";
          this.xml = "";
          this.platform = "";
        });
    },

    deleteClient(clientId) {
      axios
        .delete(`${process.env.VUE_APP_BACKEND_URL}/clients/${clientId}`)
        .then(() => {
          this.clients = this.clients.filter(client => client.id != clientId);
        });
    }
  }
};
</script>

<style>
* {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  font-size: 16px;
}
td,
th {
  border: 1px solid #ddd;
  padding: 0 8px;
  text-align: center;
}
</style>
