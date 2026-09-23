<script setup>
    import { computed } from 'vue';

    import { openExternalLink } from '../shared/utils';
    import { splitExternalLinks } from '../shared/utils/urlText';

    const props = defineProps({
        text: {
            type: [String, Number],
            default: ''
        },
        as: {
            type: String,
            default: 'span'
        }
    });

    const segments = computed(() => splitExternalLinks(props.text));
</script>

<template>
    <component :is="as">
        <template v-for="(segment, index) in segments" :key="`${index}:${segment.text}`">
            <a
                v-if="segment.type === 'link'"
                :href="segment.href"
                target="_blank"
                rel="noopener noreferrer"
                class="cursor-pointer break-all text-primary underline decoration-primary/50 underline-offset-2 hover:decoration-primary"
                data-vrcx-external-link
                @click.prevent.stop="openExternalLink(segment.href)">
                {{ segment.text }}
            </a>
            <template v-else>{{ segment.text }}</template>
        </template>
    </component>
</template>
