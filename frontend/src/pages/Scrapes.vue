<template>
  <div>
    <q-drawer show-if-above side="left" bordered>
      <div class="tw-bg-green-100">
        <div
          v-for="(date, index) in dates"
          :key="index"
          class="tw-py-1 tw-px-2 tw-cursor-pointer tw-whitespace-no-wrap tw-font-thin tw-text-gray-500 tw-text-center"
          :class="{
            'tw-text-green-600 tw-border-t tw-border-l tw-border-r tw-border-black tw-font-semibold':
              index == selectedDate,
            'tw-text-red-600 tw-border-b tw-border-l tw-border-r tw-border-black':
              index - 1 == selectedDate
          }"
          @click="selectDate(index)"
        >
          {{ date }}
        </div>
      </div>
    </q-drawer>
    <q-page-container>
      <q-page class="">
        <!-- <div class="tw-bg-green-100 tw-p-2"> -->
        <!--  -->
        <!-- </div> -->
        <div
          v-if="null !== selectedDate"
          class="tw-overflow-auto tw-mt-8 tw-px-4"
        >
          <div class="tw-text-2xl tw-font-semibold tw-mb-4">
            Ora la care au fost uploadate datele:<br />
            {{ niceDate(dates[selectedDate]) }}
            <span class="tw-font-light tw-text-sm"
              >({{ ago(dates[selectedDate]) }})</span
            >
          </div>
          <div v-for="(file, index) in currentFiles" :key="index">
            <div class="tw-font-bold tw-mb-2 tw-mt-8">{{ file.name }}</div>
            <value-table :values="fileValues(file)" :show-service="false" />
          </div>
          <div class="tw-mt-2 tw-mb-8 tw-text-green-800">
            Datele din coloana pot fi copiate in clipboard apasand pe
            aceasta.<br />
            Va rog folositi Google Chrome.
          </div>
        </div>
      </q-page>
    </q-page-container>
  </div>
</template>

<script>
import axios from "axios";

import moment from "moment";

import ValueTable from "../components/ValueTable";

moment.locale("ro");

export default {
  components: {
    ValueTable
  },

  data() {
    return {
      dates: [],
      files: {},
      selectedDate: null
    };
  },

  computed: {
    currentFiles() {
      return this.files[this.dates[this.selectedDate]];
    },

    previousFiles() {
      return this.files[this.dates[this.selectedDate + 1]];
    }
  },

  mounted() {
    axios.get(`${process.env.VUE_APP_BACKEND_URL}/files/dates`).then(res => {
      this.dates = res.data;
      axios
        .post(`${process.env.VUE_APP_BACKEND_URL}/files/fromDates`, this.dates)
        .then(res => {
          this.files = res.data;
          this.selectedDate = 0;
        });
    });
  },

  methods: {
    selectDate(dateIndex) {
      if (dateIndex == this.dates.length - 1) {
        dateIndex--;
      }
      this.selectedDate = dateIndex;
    },

    currentValue(fileName, line, hourIndex) {
      const file = this.currentFiles.find(f => f.name == fileName);
      if (!file || !(line in file.lines)) {
        return;
      }
      return parseFloat(file.lines[line][hourIndex]);
    },

    previousValue(fileName, line, hourIndex) {
      const file = this.previousFiles.find(f => f.name == fileName);
      if (!file || !(line in file.lines)) {
        return;
      }
      return parseFloat(file.lines[line][hourIndex]);
    },

    difference(fileName, line, hourIndex) {
      const previousValue = this.previousValue(fileName, line, hourIndex);
      if (undefined === previousValue) {
        return true;
      }
      return previousValue != this.currentValue(fileName, line, hourIndex);
    },

    niceDate(date) {
      return moment(date).format("l LT");
    },

    ago(date) {
      return moment(date).fromNow();
    },

    fileValues(file) {
      return Object.keys(file.lines).map(name => {
        return {
          name,
          values: file.lines[name].map(val => parseFloat(val)),
          updates: file.lines[name].map((val, index) => {
            if (this.difference(file.name, name, index)) {
              return this.previousValue(file.name, name, index);
            }
            return "";
          })
        };
      });
    }
  }
};
</script>
