// src/stores/tabsStore.js
import { atom } from "nanostores";

export type WarrantyTabId = "tab-registration" | "tab-verification";

// Create an atom store tracking the active tab ID (default to 'tab1')
export const $activeTab = atom<WarrantyTabId>("tab-registration");

// Action function to switch tabs cleanly
export function setActiveTab(tabId: WarrantyTabId) {
  $activeTab.set(tabId);
}
