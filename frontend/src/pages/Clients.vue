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
          <td class="cursor-pointer">
            {{ client.service }}
            <span v-if="!client.service">...</span>
            <q-popup-edit
              content-style="{ width: '3em' }"
              buttons
              v-model="temp"
              @before-show="temp = client.service"
              @save="
                value => {
                  saveValue(client, 'service', value);
                }
              "
            >
              <q-select
                v-model="temp"
                :options="['ciga', 'cinta']"
                label="Service"
              />
            </q-popup-edit>
          </td>
          <td class="cursor-pointer">
            {{ client.code }}
            <span v-if="!client.code">...</span>
            <q-popup-edit
              content-style="{ width: '3em' }"
              buttons
              v-model="temp"
              @before-show="temp = client.code"
              @save="
                value => {
                  saveValue(client, 'code', value);
                }
              "
            >
              <q-input v-model="temp" label="Code" />
            </q-popup-edit>
          </td>
          <td class="cursor-pointer">
            {{ client.name }}
            <span v-if="!client.name">...</span>
            <q-popup-edit
              content-style="{ width: '3em' }"
              buttons
              v-model="temp"
              @before-show="temp = client.name"
              @save="
                value => {
                  saveValue(client, 'name', value);
                }
              "
            >
              <q-input v-model="temp" label="Name" />
            </q-popup-edit>
          </td>
          <td class="cursor-pointer">
            {{ client.xml_name }}
            <span v-if="!client.xml_name">...</span>
            <q-popup-edit
              content-style="{ width: '3em' }"
              buttons
              v-model="temp"
              @before-show="temp = client.xml_name"
              @save="
                value => {
                  saveValue(client, 'xml_name', value);
                }
              "
            >
              <q-input v-model="temp" label="XML Name" />
            </q-popup-edit>
          </td>
          <td class="cursor-pointer">
            {{ client.platform_id }}
            <span v-if="!client.platform_id">...</span>
            <q-popup-edit
              content-style="{ width: '3em' }"
              buttons
              v-model.number="temp"
              @before-show="temp = client.platform_id"
              @save="
                value => {
                  saveValue(client, 'platform_id', value);
                }
              "
            >
              <q-input type="number" v-model="temp" label="Platform ID" />
            </q-popup-edit>
          </td>
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
const DEFAULT_SERVICE = "ciga";
import { mapState } from "vuex";
export default {
  data() {
    return {
      service: DEFAULT_SERVICE,
      code: "",
      name: "",
      xml: "",
      platform: "",
      temp: null
    };
  },

  computed: {
    ...mapState("clients", {
      clients: state => state.all
    })
  },

  mounted() {
    // axios.get(`${process.env.VUE_APP_BACKEND_URL}/clients`).then(res => {
    //   this.clients = res.data;
    // });
  },

  methods: {
    add() {
      this.$store.dispatch("clients/add", {
        service: this.service,
        code: this.code,
        name: this.name,
        xml_name: this.xml,
        platform_id: this.platform
      });

      this.service = DEFAULT_SERVICE;
      this.code = "";
      this.name = "";
      this.xml = "";
      this.platform = "";
    },

    deleteClient(clientId) {
      this.$store.dispatch("clients/deleteClient", clientId);
    },

    saveValue(client, key, value) {
      const data = {};
      data[key] = value;
      this.$store.dispatch("clients/update", {
        id: client.id,
        data
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
