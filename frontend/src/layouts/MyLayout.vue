<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-green-9 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          BRP Intraday
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/scrapes" label="Intradayurile vietii" />
        <q-route-tab to="/clients" label="Clientii destepti" />
        <q-route-tab to="/upload" label="Incarca ceseveu'" />
        <q-route-tab to="/values" label="Valorile lu peste" />
      </q-tabs>
    </q-header>

    <router-view />
  </q-layout>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
