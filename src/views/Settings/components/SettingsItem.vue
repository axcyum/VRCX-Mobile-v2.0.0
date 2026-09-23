<template>
    <div class="settings-item flex items-center justify-between gap-6 min-h-8">
        <div class="flex flex-col gap-0.5 min-w-0 flex-1">
            <span class="text-sm leading-snug text-foreground">{{ label }}</span>
            <span v-if="description" class="text-xs leading-tight text-muted-foreground">{{ description }}</span>
        </div>
        <div class="settings-item__control flex items-center gap-2 shrink-0">
            <slot />
        </div>
    </div>
</template>

<script setup>
    defineProps({
        label: { type: String, required: true },
        description: { type: String, default: '' }
    });
</script>

<style scoped>
    @media (max-width: 768px) {
        .settings-item {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
        }

        .settings-item__control {
            min-width: 0;
            flex-wrap: wrap;
            justify-content: flex-start;
        }
    }
</style>
