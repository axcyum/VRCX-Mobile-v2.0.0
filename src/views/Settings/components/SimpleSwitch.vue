<template>
    <div class="simple-switch">
        <div class="name" :style="{ width: longLabel ? '300px' : undefined }">
            {{ label }}
            <TooltipWrapper v-if="tooltip" side="top" :content="tooltip">
                <Info class="tooltip" />
            </TooltipWrapper>
        </div>

        <Switch class="switch" :model-value="value" @update:modelValue="change" :disabled="disabled" />
    </div>
</template>

<script setup>
    import { Info } from 'lucide-vue-next';

    import { Switch } from '../../../components/ui/switch';
    defineProps({
        label: String,
        value: Boolean,
        tooltip: String,
        disabled: Boolean,
        longLabel: Boolean
    });

    const emit = defineEmits(['change']);

    /**
     * @param event
     */
    function change(event) {
        emit('change', event);
    }
</script>

<style scoped>
    .simple-switch {
        font-size: 12px;
        display: flex;
        align-items: center;
    }
    .simple-switch > .name {
        width: 225px;
        min-width: 225px;
        word-wrap: break-word;
        padding-top: 7px;
        display: flex;
        align-items: center;
    }
    .simple-switch > .switch {
        margin-left: 8px;
    }
    .simple-switch .tooltip {
        margin-left: 3px;
    }

    @media (max-width: 768px) {
        .simple-switch {
            width: 100%;
            justify-content: space-between;
            gap: 12px;
        }

        .simple-switch > .name {
            width: auto !important;
            min-width: 0;
            flex: 1;
        }

        .simple-switch > .switch {
            flex: none;
            margin-left: 0;
        }
    }
</style>
