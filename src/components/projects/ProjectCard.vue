<script setup>
import { computed } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  }
});

const emit = defineEmits(['selectProject']);

const getStatusStyle = computed(() => {
  switch (props.project.status) {
    case 'ACTIVE': return 'text-green-600 bg-green-100 border-green-300';
    case 'COMPLETED': return 'text-blue-600 bg-blue-100 border-blue-300';
    case 'DRAFT':
    default: return 'text-yellow-600 bg-yellow-100 border-yellow-300';
  }
});
</script>

<template>
  <div
      class="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-t-4 border-indigo-500"
      @click="$emit('selectProject', project.id)"
  >
    <h3 class="text-xl font-bold text-gray-800 truncate mb-2">{{ project.name }}</h3>
    <div class="flex justify-between items-center text-sm text-gray-500 mb-3">
            <span :class="['font-semibold px-2 py-0.5 rounded-full text-xs border', getStatusStyle]">
                {{ project.status?.replace('_', ' ') }}
            </span>
      <span>Créé le: {{ new Date(project.createdAt).toLocaleDateString() }}</span>
    </div>

    <p class="text-sm text-gray-600 line-clamp-2 min-h-10">{{ project.description || "Pas de description fournie." }}</p>

    <div class="flex flex-wrap gap-2 pt-3 border-t mt-3">
            <span v-for="stack in project.stacks?.slice(0, 3)" :key="stack"
                  class="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                {{ stack }}
            </span>
      <span v-if="project.stacks?.length > 3" class="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-500 rounded-full">
                + {{ project.stacks.length - 3 }} autres
            </span>
    </div>
  </div>
</template>