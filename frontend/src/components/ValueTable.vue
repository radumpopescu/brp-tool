<template>
  <table>
    <tr>
      <td></td>
      <td v-for="i in 24" :key="i" class="tw-font-thin">{{ i }}</td>
    </tr>
    <tr v-for="(value, index) in values" :key="index">
      <th
        class="tw-px-4 tw-cursor-pointer"
        :class="{
          'tw-bg-green-200': index == hoveredLine
        }"
        @click="copyClipboard(index)"
        @mouseover="hoveredLine = index"
        @mouseleave="hoveredLine = null"
      >
        <div v-if="getClient(value)">
          <div>
            <q-badge
              v-if="showService"
              outline
              :color="getClient(value).service == 'ciga' ? 'blue' : 'orange'"
              align="middle"
              :label="getClient(value).service"
            />
            {{ getClient(value).code }}
          </div>
          <div class="tw-font-thin">
            {{ getClient(value).name }}
          </div>
        </div>
        <div v-else>
          <!-- <div v-if="value.name != 'Total'" class="tw-text-red-800"> -->
          <!-- Client not found -->
          <!-- </div> -->
          <div>{{ value.name }}</div>
        </div>
      </th>
      <td
        v-for="i in 24"
        :key="i"
        class="tw-text-sm tw-cursor-pointer hover:tw-bg-green-400"
        :class="{
          'tw-bg-red-200':
            values[index].updates && values[index].updates[i - 1] !== '',
          'tw-bg-green-200': index == hoveredLine
        }"
        @click="copyClipboard(index)"
        @mouseover="hoveredLine = index"
        @mouseleave="hoveredLine = null"
      >
        <span
          v-if="values[index].updates && values[index].updates[i - 1] !== ''"
          class="tw-line-through tw-text-red-700 tw-mr-1"
          >{{ values[index].updates[i - 1] }}</span
        >
        {{ value.values[i - 1] }}
      </td>
    </tr>
    <tr>
      <td></td>
      <td v-for="i in 24" :key="i" class="tw-font-thin">{{ i }}</td>
    </tr>
  </table>
</template>

<script>
import toastr from "toastr";
import { mapState } from "vuex";

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-bottom-center",
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

const copyToClipboard = str => {
  const el = document.createElement("textarea");
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

export default {
  props: {
    values: {
      type: Array,
      required: true
    },
    showService: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      hoveredLine: null
    };
  },

  computed: {
    ...mapState("clients", {
      clients: state => state.all
    })
  },
  methods: {
    getClient(value) {
      const index = this.clients.findIndex(c => {
        return (
          c.id == value.client || c.code == value.name || c.name == value.name
        );
      });
      if (index != -1) {
        return this.clients[index];
      }
      return null;
    },

    copyClipboard(index) {
      copyToClipboard(this.values[index].values.join("\n "));
      toastr.success(
        `Datele pentru ${this.values[index].name} au fost copiate in clipboard`
      );
    }
  }
};
</script>

<style scoped></style>
