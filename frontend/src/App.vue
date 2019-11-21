<template>
  <div class="flex h-screen">
    <div class="bg-green-100">
      <div 
        v-for="(date, index) in dates" 
        :key="index" 
        class="m-2 cursor-pointer whitespace-no-wrap font-thin text-gray-500"
        :class="{
          'text-green-500 font-black': index == selectedDate, 
          'text-red-800 font-medium': index - 1 == selectedDate
        }" 
        @click="selectDate(index)"
      >
        {{ date }}
      </div>
    </div>
    <div v-if="null !== selectedDate" class="overflow-auto mt-8 px-4">
      <div class="text-2xl font-semibold mb-4">Ora la care au fost uploadate datele:<br/> {{ niceDate(dates[selectedDate]) }} <span class="font-light text-sm">({{ ago(dates[selectedDate]) }})</span></div>
      <table>
        <tr>
          <th class="border border-black">Ora</th>
          <th 
            v-for="(file, index) in currentFiles" 
            :key="`file${index}`" 
            :colspan="Object.keys(file.lines).length" 
            class="px-3 border border-black"
          >
            {{ file.name }}
          </th>
          <th class="border border-black">Ora</th>
        </tr>
        <tr>
          <th class="border border-black"></th>
          <template v-for="file in currentFiles">
            <th 
              v-for="(line, index) in Object.keys(file.lines)" 
              :key="`fileline${file.name}${index}`"
              class="border border-black cursor-pointer"
              :class="{'bg-green-200': file.name== hoveredLine.fileName && line == hoveredLine.line }"
              @click="copyClipboard(file.name, line)"
              @mouseover="hoveredLine = {fileName: file.name, line}"
              @mouseleave="hoveredLine = {}"
            >{{line}}</th>
          </template>
          <th class="border border-black"></th>
        </tr>
        <tr v-for="i in 24" :key="i">
          <td>{{ `${i-1}`.padStart(2,'0') }}</td>
          <template v-for="file in currentFiles">
            <td 
              v-for="(lineName, index) in Object.keys(file.lines)" 
              :key="`file${file.name}.${index}`"
              class="text-sm cursor-pointer"
              :class="{ 
                'bg-red-600': difference(file.name, lineName, i-1),
                'bg-green-200': file.name== hoveredLine.fileName && lineName == hoveredLine.line 
              }"
              @click="copyClipboard(file.name, lineName)"
              @mouseover="hoveredLine = {fileName: file.name, line: lineName}"
              @mouseleave="hoveredLine = {}"
            >
              <span v-if="difference(file.name, lineName, i-1)" class="line-through text-red-300 mr-1">{{ previousValue(file.name, lineName, i-1) }}</span>
              {{ currentValue(file.name, lineName, i-1) }}
            </td>
          </template>
          <td>{{ `${i-1}`.padStart(2,'0') }}</td>
        </tr>
      </table>
    <div class="mt-2 text-green-800">
      Datele din coloana pot fi copiate in clipboard apasand pe aceasta.<br/>
      Va rugam folositi Google Chrome.
    </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import moment from "moment";
import toastr from "toastr";
toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-center",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};
moment.locale("ro");
const copyToClipboard = str => {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
};

export default {
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
        axios
            .get(`${process.env.VUE_APP_BACKEND_URL}/files/dates`)
            .then(res => {
                this.dates = res.data;
                axios
                    .post(
                        `${process.env.VUE_APP_BACKEND_URL}/files/fromDates`,
                        this.dates
                    )
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
            return (
                previousValue != this.currentValue(fileName, line, hourIndex)
            );
        },

        niceDate(date) {
            return moment(date).format("l LT");
        },

        ago(date) {
            return moment(date).fromNow();
        },
        copyClipboard(file, line) {
            const values = [];

            for (let i = 0; i < 24; i++) {
                values.push(this.currentValue(file, line, i));
            }

            copyToClipboard(values.join("\n "));
            toastr.success(
                `Datele pentru ${line} au fost copiate in clipboard`
            );
        }
    }
};
</script>

<style>
td,
th {
    border: 1px solid #ddd;
    padding: 0 8px;
    text-align: center;
}
</style>
