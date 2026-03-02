<script setup>
import DefaultTheme from 'vitepress/theme'
import CrowEyeGlint from './CrowEyeGlint.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-top>
      <CrowEyeGlint />
    </template>
  </DefaultTheme.Layout>
</template>
