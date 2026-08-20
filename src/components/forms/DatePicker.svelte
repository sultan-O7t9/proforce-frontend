<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { twMerge } from 'tailwind-merge';

    export let label: string | undefined = undefined;
    export let name: string;
    export let placeholder: string | undefined | null = "Select date";
    export let labelClass: string = "";
    export let inputClass: string = "";
    export let containerClass: string = "";
    export let error: string = "";
    export let id: string;
    export let value: string = ""; // Expects format YYYY-MM-DD

    let isOpen = false;
    let containerRef: HTMLDivElement;

    // Calendar state navigation
    let viewDate = value ? new Date(value) : new Date();
    if (isNaN(viewDate.getTime())) viewDate = new Date();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // Compute calendar grid for the current view month
    $: year = viewDate.getFullYear();
    $: month = viewDate.getMonth();

    $: daysInMonth = new Date(year, month + 1, 0).getDate();
    $: firstDayIndex = new Date(year, month, 1).getDay();

    $: calendarDays = (() => {
        let list: { day: number | null; dateStr: string }[] = [];
        // Padding for previous month days
        for (let i = 0; i < firstDayIndex; i++) {
            list.push({ day: null, dateStr: "" });
        }
        // Actual month days
        for (let d = 1; d <= daysInMonth; d++) {
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(d).padStart(2, '0');
            list.push({
                day: d,
                dateStr: `${year}-${formattedMonth}-${formattedDay}`
            });
        }
        return list;
    })();

    function toggleCalendar() {
        isOpen = !isOpen;
    }

    function selectDate(dateStr: string) {
        if (!dateStr) return;
        value = dateStr;
        isOpen = false;
    }

    function nextMonth() {
        viewDate = new Date(year, month + 1, 1);
    }

    function prevMonth() {
        viewDate = new Date(year, month - 1, 1);
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        if (containerRef && !containerRef.contains(event.target as Node)) {
            isOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
    });

    // Formatted display value for the input box
    $: displayValue = value ? new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
</script>

<div class={twMerge("w-full mb-1.5 relative", containerClass)} bind:this={containerRef}>
    {#if label}
        <label for={id} class={twMerge("block text-sm font-semibold text-pf-black mb-1.5 md:mb-3", labelClass)}>{label}</label>
    {/if}

    <div class="relative w-full cursor-pointer" on:click={toggleCalendar}>
        <!-- Read-only input acting as the trigger field -->
        <input
            type="text"
            {id}
            {name}
            readonly
            placeholder={placeholder ?? undefined}
            value={displayValue}
            class={twMerge(
                "w-full px-5 py-3 md:py-4 rounded-sm border text-pf-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 transition-colors cursor-pointer pr-12",
                error
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/10"
                    : "border-pf-navy/30 focus:ring-pf-navy-dark focus:border-pf-navy-dark",
                inputClass
            )}
        />

        <!-- Calendar Icon Toggle -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
        </div>
    </div>

    <!-- Custom Dropdown Calendar Menu -->
    {#if isOpen}
        <div class="absolute left-0 right-0 z-50 mt-2 bg-white border border-black/20 rounded-sm shadow-xl p-4 font-sans">
            <!-- Header: Month / Year Navigation -->
            <div class="flex items-center justify-between mb-4">
                <button type="button" on:click|stopPropagation={prevMonth} class="p-1.5 rounded hover:bg-gray-100 text-pf-navy transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <span class="text-sm font-semibold text-pf-black">
                    {months[month]} {year}
                </span>
                <button type="button" on:click|stopPropagation={nextMonth} class="p-1.5 rounded hover:bg-gray-100 text-pf-navy transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>

            <!-- Days of Week Header -->
            <div class="grid grid-cols-7 gap-1 mb-2 text-center">
                {#each daysOfWeek as dow}
                    <span class="text-xs font-medium text-gray-400">{dow}</span>
                {/each}
            </div>

            <!-- Days Grid -->
            <div class="grid grid-cols-7 gap-1 text-center">
                {#each calendarDays as { day, dateStr }}
                    {#if day === null}
                        <div></div>
                    {:else}
                        <button
                            type="button"
                            on:click|stopPropagation={() => selectDate(dateStr)}
                            class={twMerge(
                                "h-8 w-8 mx-auto flex items-center justify-center text-sm rounded-sm transition-colors",
                                value === dateStr
                                    ? "bg-pf-navy text-white font-medium"
                                    : "text-pf-black hover:bg-[#f4f6f8] hover:text-[#0d1833]"
                            )}
                        >
                            {day}
                        </button>
                    {/if}
                {/each}
            </div>
        </div>
    {/if}

    <!-- Error Message Display -->
    {#if error}
        <p class="-bottom-5 absolute text-xs text-red-500 font-medium">{error}</p>
    {/if}
</div>