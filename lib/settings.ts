import { prisma } from "@/lib/prisma";

const defaultSettings = {
  bridal_bespoke_fee: "500000",
  bridal_customization_fee: "400000",
  eveningwear_bespoke_fee: "200000",
  custom_fee: "120000",
};

type SettingRow = {
  key: string;
  value: string;
};

function mergeSettings(rows: SettingRow[]) {
  return rows.reduce(
    (settings, row) => {
      settings[row.key as keyof typeof defaultSettings] = row.value;
      return settings;
    },
    { ...defaultSettings }
  );
}

export async function getConsultationSettings() {
  try {
    const rows = await prisma.setting.findMany({
      select: {
        key: true,
        value: true,
      },
    });

    if (!rows.length) {
      return { ...defaultSettings };
    }

    return mergeSettings(rows);
  } catch (error) {
    console.error("SETTINGS ERROR:", error);
    return { ...defaultSettings };
  }
}

export async function saveConsultationSettings(
  settings: Record<
    "bridal_bespoke_fee" | "bridal_customization_fee" | "eveningwear_bespoke_fee" | "custom_fee",
    string
  >
) {
  try {
    const entries = Object.entries(settings) as Array<[keyof typeof defaultSettings, string]>;

    await Promise.all(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    return { success: true, settings };
  } catch (error) {
    console.error("SETTINGS SAVE ERROR:", error);
    return { success: false, settings: { ...defaultSettings } };
  }
}

export async function getConsultationFees() {
  const settings = await getConsultationSettings();

  return {
    bridalBespokeFee: Number(settings.bridal_bespoke_fee) || 500000,
    bridalCustomizationFee: Number(settings.bridal_customization_fee) || 400000,
    eveningwearBespokeFee: Number(settings.eveningwear_bespoke_fee) || 200000,
    customFee: Number(settings.custom_fee) || 120000,
  };
}
