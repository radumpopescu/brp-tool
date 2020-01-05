<template>
  <table>
    <tr>
      <td></td>
      <td v-for="i in 24" :key="i" class="tw-font-thin">{{ i }}</td>
    </tr>
    <tr v-for="(value, index) in values" :key="index">
      <th class="tw-px-4">
        <div v-if="getClient(value)">
          <div>
            <q-badge
              outline
              color="secondary"
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
          <div class="tw-text-red">Client not found</div>
          <div>{{ value.name }}</div>
        </div>
      </th>
      <td v-for="i in 24" :key="i" class="tw-text-sm hover:tw-bg-green-200">
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
    }
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

    copyClipboard(file, line) {
      const values = [];

      for (let i = 0; i < 24; i++) {
        values.push(this.currentValue(file, line, i));
      }

      copyToClipboard(values.join("\n "));
      toastr.success(`Datele pentru ${line} au fost copiate in clipboard`);
    }
  }
};
</script>

<style scoped></style>
