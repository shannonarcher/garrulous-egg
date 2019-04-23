<script>
export default {
  props: {
    level: {
      type: Object,
      required: true
    }
  }
};
</script>

<template>
  <div class="level-bubble">{{ level.order }}</div>
</template>


