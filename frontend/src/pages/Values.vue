<template>
  <div>
    <q-drawer show-if-above side="left" bordered>
      <div class="tw-bg-green-100">
        <div
          v-for="(date, index) in Object.keys(dates)"
          :key="index"
          class="tw-py-2 tw-cursor-pointer tw-whitespace-no-wrap tw-font-thin tw-text-xl tw-text-center"
          :class="{
            'tw-font-bold': index == selectedIndex
          }"
          @click="selectDate(index)"
        >
          {{ date }}
        </div>
      </div>
    </q-drawer>
    <q-page-container class="tw-m-8">
      <value-table
        v-if="dates && clients"
        :values="values"
        :clients="clients"
      />
    </q-page-container>
  </div>
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
      clients: null,
      selectedIndex: 0
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
      return this.dates[Object.keys(this.dates)[this.selectedIndex]];
    }
  },

  methods: {
    selectDate(index) {
      this.selectedIndex = index;
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
