<script>
  import { onMount, onDestroy } from 'svelte';
  import { gsap } from 'gsap';
    import { twMerge } from 'tailwind-merge';

  const tabs = [
    { id: 'tab-registration', label: 'Registration' },
    { id: 'tab-verification', label: 'Verification' },
  ];

  let activeTab = 'tab-registration';
  let indicator;
  let buttonEls = [];
  let panelEls = {};
  let resizeHandler;

  function updateIndicator(btn, animate = true) {
    if (!btn || !indicator) return;
    const targetWidth = btn.offsetWidth;
    const targetX = btn.offsetLeft;
    if (animate) {
      gsap.to(indicator, { width: targetWidth, x: targetX, duration: 0.4, ease: 'power2.out' });
    } else {
      gsap.set(indicator, { width: targetWidth, x: targetX });
    }
  }

  function switchPanel(nextId) {
    const prevId = activeTab;
    if (prevId === nextId) return;

    const nextEl = panelEls[nextId];
    const prevEl = panelEls[prevId];

    if (nextEl) {
      nextEl.style.display = 'block';
      gsap.fromTo(nextEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
    if (prevEl) {
      gsap.to(prevEl, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => { prevEl.style.display = 'none'; },
      });
    }
  }

  function selectTab(tabId) {
    if (tabId === activeTab) return;
    const btn = buttonEls.find((b) => b?.dataset.tab === tabId);
    updateIndicator(btn, true);
    switchPanel(tabId);
    activeTab = tabId;
  }

  onMount(() => {
    const initialBtn = buttonEls.find((b) => b?.dataset.tab === activeTab);
    updateIndicator(initialBtn, false);

    tabs.forEach((tab) => {
      const el = panelEls[tab.id];
      if (!el) return;
      el.style.display = tab.id === activeTab ? 'block' : 'none';
      el.style.opacity = tab.id === activeTab ? '1' : '0';
    });

    resizeHandler = () => {
      const currentBtn = buttonEls.find((b) => b?.dataset.tab === activeTab);
      updateIndicator(currentBtn, false);
    };
    window.addEventListener('resize', resizeHandler);
  });

  onDestroy(() => {
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
  });
</script>

<div class="tab-buttons-container border-pf-navy/20 mx-auto mb-8 max-w-92.5 rounded-full border p-1.25 md:mb-12.5">
  <div class="relative flex">
    <div class="tab-indicator bg-pf-navy absolute top-0 bottom-0 left-0 z-0 h-full rounded-full" bind:this={indicator}></div>

    {#each tabs as tab, i}
      <button
        bind:this={buttonEls[i]}
        class={twMerge("tab-btn relative z-10 h-13.5 w-full flex-1 cursor-pointer rounded-full px-3 text-sm font-semibold transition-colors duration-300 md:px-6 md:text-base",
          activeTab === tab.id ? 'text-white' : 'text-pf-navy/80')}
        data-tab={tab.id}
        on:click={() => selectTab(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>
</div>

<div class="tab-panel" bind:this={panelEls['tab-registration']}>
  <slot name="registration" />
</div>
<div class="tab-panel" bind:this={panelEls['tab-verification']}>
  <slot name="verification" />
</div>