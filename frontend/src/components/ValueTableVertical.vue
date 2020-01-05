<template>
  <table>
    <tr>
      <th class="tw-border tw-border-black">Ora</th>
      <th
        v-for="(value, index) in values"
        :key="index"
        class="tw-px-3 tw-border tw-border-black tw-font-bold"
      >
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
      <th class="tw-border tw-border-black">Ora</th>
    </tr>
    <tr v-for="i in 24" :key="i">
      <td class="tw-font-thin">{{ i }}</td>
      <td
        v-for="(value, index) in values"
        :key="index"
        class="tw-text-sm hover:tw-bg-green-200"
      >
        {{ value.values[i - 1] }}
      </td>
      <td class="tw-font-thin">{{ i }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  props: {
    values: {
      type: Array,
      required: true
    },
    clients: {
      type: Array,
      required: true
    }
  },
  methods: {
    getClient(value) {
      console.log(value, value.client);

      const index = this.clients.findIndex(c => {
        return (
          c.id == value.client || c.code == value.name || c.name == value.name
        );
      });
      if (index != -1) {
        return this.clients[index];
      }
      return null;
    }
  }
};
</script>

<style scoped></style>
