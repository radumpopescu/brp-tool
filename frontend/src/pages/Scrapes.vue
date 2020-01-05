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
          <value-table />
          <table>
            <tr>
              <th class="tw-border tw-border-black">Ora</th>
              <th
                v-for="(file, index) in currentFiles"
                :key="`file${index}`"
                :colspan="Object.keys(file.lines).length"
                class="tw-px-3 tw-border tw-border-black tw-font-bold"
              >
                {{ file.name }}
              </th>
              <th class="tw-border tw-border-black">Ora</th>
            </tr>
            <tr>
              <th class="tw-border tw-border-black"></th>
              <template v-for="file in currentFiles">
                <th
                  v-for="(line, index) in Object.keys(file.lines)"
                  :key="`fileline${file.name}${index}`"
                  class="tw-border tw-border-black tw-font-thin tw-cursor-pointer"
                  :class="{
                    'tw-bg-green-200':
                      file.name == hoveredLine.fileName &&
                      line == hoveredLine.line
                  }"
                  @click="copyClipboard(file.name, line)"
                  @mouseover="hoveredLine = { fileName: file.name, line }"
                  @mouseleave="hoveredLine = {}"
                >
                  {{ line }}
                </th>
              </template>
              <th class="tw-border tw-border-black"></th>
            </tr>
            <tr v-for="i in 24" :key="i">
              <td>{{ i }}</td>
              <template v-for="file in currentFiles">
                <td
                  v-for="(lineName, index) in Object.keys(file.lines)"
                  :key="`file${file.name}.${index}`"
                  class="tw-text-sm tw-cursor-pointer"
                  :class="{
                    'tw-bg-red-600': difference(file.name, lineName, i - 1),
                    'tw-bg-green-200':
                      file.name == hoveredLine.fileName &&
                      lineName == hoveredLine.line
                  }"
                  @click="copyClipboard(file.name, lineName)"
                  @mouseover="
                    hoveredLine = { fileName: file.name, line: lineName }
                  "
                  @mouseleave="hoveredLine = {}"
                >
                  <span
                    v-if="difference(file.name, lineName, i - 1)"
                    class="tw-line-through tw-text-red-300 tw-mr-1"
                    >{{ previousValue(file.name, lineName, i - 1) }}</span
                  >
                  {{ currentValue(file.name, lineName, i - 1) }}
                </td>
              </template>
              <td>{{ i }}</td>
            </tr>
          </table>

          <div class="tw-mt-2 tw-text-green-800">
            Datele din coloana pot fi copiate in clipboard apasand pe
            aceasta.<br />
            Va rugam folositi Google Chrome.
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
      selectedDate: null,
      hoveredLine: {}
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
