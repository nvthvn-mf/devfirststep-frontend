<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: String,
  pageName: String,
  current: String,
});

const emit = defineEmits(['navigate']);

const isCurrent = computed(() => props.current === props.pageName);
</script>

<template>
  <a
      href="#"
      @click.prevent="emit('navigate', pageName)"
      :class="[
            'px-3 py-2 text-sm font-medium rounded-md transition duration-150',
            isCurrent ? 'bg-indigo-700' : 'hover:bg-indigo-500'
        ]"
  >
    {{ label }}
  </a>
</template>