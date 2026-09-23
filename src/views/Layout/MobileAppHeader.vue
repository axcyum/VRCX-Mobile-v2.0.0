<template>
    <header class="mobile-app-header shrink-0 border-b border-border bg-sidebar/95 backdrop-blur">
        <Button variant="ghost" size="icon-lg" class="rounded-full" aria-label="Open navigation" @click="toggleSidebar">
            <Menu />
        </Button>

        <div class="flex min-w-0 flex-1 items-center gap-2 px-1">
            <img :src="vrcxLogo" alt="" class="size-7 rounded-md" />
            <span class="truncate text-base font-semibold tracking-wide">VRCX</span>
        </div>

        <Button
            variant="ghost"
            size="icon-lg"
            class="rounded-full"
            :aria-label="t('side_panel.friends')"
            @click="socialPanelOpen = true">
            <UsersRound />
        </Button>
    </header>

    <Sheet :open="socialPanelOpen" @update:open="socialPanelOpen = $event">
        <SheetContent
            side="right"
            class="w-[min(92vw,380px)] max-w-none gap-0 bg-sidebar p-0 [&>button]:top-[max(12px,env(safe-area-inset-top))] [&>button]:right-3 [&>button]:z-10 [&>button]:flex [&>button]:size-9 [&>button]:items-center [&>button]:justify-center [&>button_svg]:size-5">
            <SheetHeader class="sr-only">
                <SheetTitle>{{ t('side_panel.friends') }}</SheetTitle>
                <SheetDescription>{{ t('side_panel.search_placeholder') }}</SheetDescription>
            </SheetHeader>
            <Sidebar />
        </SheetContent>
    </Sheet>
</template>

<script setup>
    import { ref } from 'vue';
    import { Menu, UsersRound } from 'lucide-vue-next';
    import { useI18n } from 'vue-i18n';

    import { Button } from '@/components/ui/button';
    import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
    import { useSidebar } from '@/components/ui/sidebar';

    import Sidebar from '../Sidebar/Sidebar.vue';

    const { t } = useI18n();
    const { toggleSidebar } = useSidebar();
    const socialPanelOpen = ref(false);
    const vrcxLogo = new URL('../../../images/VRCX.png', import.meta.url).href;
</script>

<style scoped>
    .mobile-app-header {
        display: flex;
        min-height: 56px;
        align-items: center;
        gap: 4px;
        padding: 6px 8px;
        z-index: 20;
    }
</style>
