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
      <value-table :values="response" :clients="clients" />
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
import ValueTable from "../components/ValueTable";

export default {
  components: {
    ValueTable
  },
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
