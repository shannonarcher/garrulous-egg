<script>
export default {
  components: {
    LevelBubble
  },
  data: () => ({
    levels: []
  })
};
</script>

<template>
  <div class="levels">
    <LevelBubble v-for="level in levels" :key="level.id"/>
  </div>
</template>