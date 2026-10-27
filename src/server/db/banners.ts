import fs from "fs";
import path from "path";

export interface StoreBanners {
  defaultProductBanner?: {
    url: string;
    altText?: string;
    enabled: boolean;
  };
  announcementText?: string;
}

const SETTINGS_FILE = path.join(process.cwd(), "src/server/data/settings.json");

let memorySettings: StoreBanners = {
  defaultProductBanner: {
    url: "",
    altText: "Official MYTIPE Promotional Banner",
    enabled: true,
  },
};

// Initialize from disk if exists
try {
  if (fs.existsSync(SETTINGS_FILE)) {
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    memorySettings = JSON.parse(raw);
  } else {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(memorySettings, null, 2), "utf-8");
  }
} catch (e) {
  console.warn("Could not load settings.json, using in-memory store:", e);
}

export function getStoreSettings(): StoreBanners {
  return memorySettings;
}

export function updateStoreSettings(updates: Partial<StoreBanners>): StoreBanners {
  memorySettings = {
    ...memorySettings,
    ...updates,
    defaultProductBanner: updates.defaultProductBanner
      ? { ...memorySettings.defaultProductBanner, ...updates.defaultProductBanner }
      : memorySettings.defaultProductBanner,
  };

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(memorySettings, null, 2), "utf-8");
  } catch (e) {
    console.warn("Could not save settings.json:", e);
  }

  return memorySettings;
}
