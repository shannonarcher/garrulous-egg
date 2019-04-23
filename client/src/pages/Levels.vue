<script>
import { mapGetters, mapActions } from "vuex";
import LevelBubble from "@/components/levels/LevelBubble.vue";

export default {
  components: {
    LevelBubble
  },
  computed: mapGetters({
    levels: "levels/levels"
  }),
  mounted() {
    this.getLevels();
  },
  methods: mapActions({
    getLevels: "levels/getLevels"
  })
};
</script>

<template>
  <div class="levels">
    <LevelBubble v-for="level in levels" :key="level.id" :level="level"/>
  </div>
</template>
