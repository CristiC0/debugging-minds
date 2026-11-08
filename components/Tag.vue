<script setup lang="ts">
// Small heavy uppercase chip: points, categories, team names, states.
// Put an icon in the slot: <Tag variant="red"><ph-timer-bold /> 30 s</Tag>
withDefaults(defineProps<{
  variant?: 'outline' | 'solid' | 'red' | 'ghost'
}>(), { variant: 'outline' })
</script>

<template>
  <span class="dm-tag" :class="variant === 'outline' ? '' : variant">
    <slot />
  </span>
</template>
