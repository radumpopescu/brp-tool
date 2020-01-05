<template>
  <q-page-container class="tw-m-8">
    <div
      :class="{
        'tw-opacity-50': response != null
      }"
    >
      <div class="tw-text-xl tw-mb-2">
        Uploadati Fisierul CSV aici:
      </div>
      <q-uploader
        label="Uploadati csv-ul"
        auto-upload
        :url="url"
        accept=".csv"
        ref="uploader"
        @uploaded="uploaded"
        @added="$refs.uploader.removeUploadedFiles()"
      />
    </div>

    <div v-if="response != null">
      <div class="tw-text-xl tw-mt-8 tw-mb-2">
        Am recunoscut aceste date:
      </div>
      <table>
        <tr>
          <th class="tw-border tw-border-black">Ora</th>
          <th
            v-for="(client, index) in response"
            :key="index"
            class="tw-px-3 tw-border tw-border-black tw-font-bold"
          >
            <div v-if="getClient(client.name)">
              <div>
                <q-badge
                  outline
                  color="secondary"
                  align="middle"
                  :label="getClient(client.name).service"
                />
                {{ getClient(client.name).code }}
              </div>
              <div class="tw-font-thin">
                {{ getClient(client.name).name }}
              </div>
            </div>
            <div v-else>
              <div class="tw-text-red">Client not found</div>
              <div>{{ client.name }}</div>
            </div>
          </th>
          <th class="tw-border tw-border-black">Ora</th>
        </tr>
        <tr v-for="i in 24" :key="i">
          <td class="tw-font-thin">{{ i }}</td>
          <td
            v-for="(client, index) in response"
            :key="`${client.name}.${index}`"
            class="tw-text-sm hover:tw-bg-green-200"
          >
            {{ client.values[i - 1] }}
          </td>
          <td class="tw-font-thin">{{ i }}</td>
        </tr>
      </table>

      <div class="tw-text-xl tw-mt-8 tw-mb-2">
        Daca sunt corecte, adaugati-le pentru data de:
      </div>
      <div class="tw-flex tw-items-center">
        <q-date v-model="date" />
        <q-btn
          class="tw-ml-6 tw-h-16"
          label="Adauga"
          color="primary"
          @click="addData"
        />
      </div>
    </div>
  </q-page-container>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      clients: [],
      response: null,
      date: null
    };
  },

  mounted() {
    this.date = moment().format("YYYY/MM/DD");
    axios.get(`${process.env.VUE_APP_BACKEND_URL}/clients`).then(res => {
      this.clients = res.data;
    });
  },

  computed: {
    url() {
      return `${process.env.VUE_APP_BACKEND_URL}/upload`;
    }
  },

  methods: {
    getClient(client) {
      const index = this.clients.findIndex(c => {
        console.log(c, client);
        return c.code == client || c.name == client;
      });
      if (index != -1) {
        return this.clients[index];
      }
      return null;
    },
    uploaded({ xhr }) {
      this.response = JSON.parse(xhr.response);
    },
    addData() {
      const dataWithClients = this.response.map(client => {
        return {
          ...client,
          client: this.getClient(client.name)
        };
      });
      axios
        .put(`${process.env.VUE_APP_BACKEND_URL}/values`, {
          clients: dataWithClients,
          date: this.date
        })
        .then(res => {
          console.log(res);
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
