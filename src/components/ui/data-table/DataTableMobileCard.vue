<script setup>
    import { computed } from 'vue';
    import { ChevronDown, ChevronRight } from 'lucide-vue-next';
    import { FlexRender } from '@tanstack/vue-table';
    import { useI18n } from 'vue-i18n';

    import { Button } from '../button';
    import { isSpacer, resolveHeaderLabel } from './dataTableHelpers.js';

    const props = defineProps({
        row: {
            type: Object,
            required: true
        },
        expandedRenderer: {
            type: [Function, Object],
            default: null
        },
        cardClass: {
            type: String,
            default: ''
        },
        clickable: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(['row-click']);
    const { t } = useI18n();

    const visibleCells = computed(() =>
        props.row.getVisibleCells().filter((cell) => cell.column.id !== 'expander' && !isSpacer(cell.column))
    );

    const canExpand = computed(() => Boolean(props.expandedRenderer && props.row.getCanExpand?.()));

    function fieldClass(cell) {
        return cell.column.columnDef?.meta?.stretch ? 'dt-mobile-field--wide' : '';
    }

    function handleCardClick() {
        if (props.clickable) {
            emit('row-click', props.row);
        }
    }
</script>

<template>
    <article
        :class="[
            'dt-mobile-card rounded-lg border bg-card p-3 text-card-foreground shadow-sm',
            clickable && 'cursor-pointer active:bg-muted/40',
            cardClass
        ]"
        @click="handleCardClick">
        <div class="dt-mobile-fields grid grid-cols-2 gap-x-4 gap-y-3">
            <div v-for="cell in visibleCells" :key="cell.id" :class="['dt-mobile-field min-w-0', fieldClass(cell)]">
                <div class="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {{ resolveHeaderLabel(cell.column) }}
                </div>
                <div class="min-w-0 break-words text-sm">
                    <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </div>
            </div>
        </div>

        <Button
            v-if="canExpand"
            type="button"
            variant="ghost"
            size="sm"
            class="mt-2 w-full justify-between border-t pt-2"
            @click.stop="row.toggleExpanded()">
            {{ t('common.actions.view_details') }}
            <ChevronDown v-if="row.getIsExpanded()" class="size-4" />
            <ChevronRight v-else class="size-4" />
        </Button>

        <div v-if="row.getIsExpanded() && expandedRenderer" class="mt-2 border-t pt-3">
            <FlexRender :render="expandedRenderer" :props="{ row }" />
        </div>
    </article>
</template>

<style scoped>
    .dt-mobile-field--wide {
        grid-column: 1 / -1;
    }

    .dt-mobile-field :deep(.truncate) {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }

    @media (max-width: 380px) {
        .dt-mobile-fields {
            grid-template-columns: minmax(0, 1fr);
        }

        .dt-mobile-field--wide {
            grid-column: auto;
        }
    }
</style>
