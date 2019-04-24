<script>
export default {
  props: {
    level: {
      type: Object,
      required: true
    }
  },
  computed: {
    label() {
      return this.level.order + 1;
    }
  }
};
</script>

<template>
  <div class="level-bubble" @click="$emit('click', level.id)">{{ this.label }}</div>
</template>
