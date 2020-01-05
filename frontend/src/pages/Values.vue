<template>
  <q-page-container class="tw-m-8">
    <value-table v-if="dates && clients" :values="values" :clients="clients" />
  </q-page-container>
</template>

<script>
import axios from "axios";
import ValueTable from "../components/ValueTable";

export default {
  components: {
    ValueTable
  },

  data() {
    return {
      dates: null,
      clients: null
    };
  },

  mounted() {
    axios.get(`${process.env.VUE_APP_BACKEND_URL}/values`).then(res => {
      this.dates = res.data;
    });
    axios.get(`${process.env.VUE_APP_BACKEND_URL}/clients`).then(res => {
      this.clients = res.data;
    });
  },

  computed: {
    values() {
      return this.dates[Object.keys(this.dates)[0]];
    }
  },

  methods: {}
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
