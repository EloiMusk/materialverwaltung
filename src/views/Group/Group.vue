<template>
  <div>
    <v-slide-x-transition
        leave-absolute
        hide-on-leave
    >
      <router-view></router-view>
    </v-slide-x-transition>
  </div>
</template>

<script lang="ts" src="./Group.ts"/>

<style scoped>

</style>