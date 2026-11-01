<script setup lang="ts">
import { computed } from 'vue';
import type { SimpleIcon } from 'simple-icons';
import * as simpleIcons from 'simple-icons';

const props = withDefaults(
  defineProps<{
    name?: string;
    icon?: SimpleIcon;
    size?: number | string;
    color?: string;
    title?: string;
  }>(),
  {
    size: 20,
    color: 'currentColor',
  }
);

const resolvedIcon = computed<SimpleIcon | null>(() => {
  if (props.icon) return props.icon;
  if (props.name) {
    const key = props.name.startsWith('si') ? props.name : `si${props.name.charAt(0).toUpperCase()}${props.name.slice(1)}`;
    const found = (simpleIcons as Record<string, unknown>)[key] as SimpleIcon | undefined;
    if (found) return found;

    // Search by title or slug
    const normalized = props.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const val of Object.values(simpleIcons)) {
      if (typeof val === 'object' && val && 'slug' in val && 'title' in val) {
        const item = val as SimpleIcon;
        if (item.slug === normalized || item.title.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized) {
          return item;
        }
      }
    }
  }
  return null;
});

const fillHex = computed(() => {
  if (props.color && props.color !== 'currentColor' && props.color !== 'auto') {
    return props.color;
  }
  if (props.color === 'auto' && resolvedIcon.value) {
    return `#${resolvedIcon.value.hex}`;
  }
  return 'currentColor';
});
</script>

<template>
  <svg
    v-if="resolvedIcon"
    role="img"
    :viewBox="'0 0 24 24'"
    :width="size"
    :height="size"
    :fill="fillHex"
    xmlns="http://www.w3.org/2000/svg"
    class="inline-block flex-shrink-0 transition-colors"
  >
    <title>{{ title || resolvedIcon.title }}</title>
    <path :d="resolvedIcon.path" />
  </svg>
</template>
