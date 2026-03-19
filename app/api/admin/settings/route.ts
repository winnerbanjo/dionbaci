import { NextResponse } from "next/server";

import { getConsultationSettings, saveConsultationSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getConsultationSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const body = await request.json();
  const settings = {
    bridal_bespoke_fee: String(body?.settings?.bridal_bespoke_fee ?? "").trim(),
    bridal_customization_fee: String(body?.settings?.bridal_customization_fee ?? "").trim(),
    eveningwear_bespoke_fee: String(body?.settings?.eveningwear_bespoke_fee ?? "").trim(),
    custom_fee: String(body?.settings?.custom_fee ?? "").trim(),
  };

  if (
    !settings.bridal_bespoke_fee ||
    !settings.bridal_customization_fee ||
    !settings.eveningwear_bespoke_fee ||
    !settings.custom_fee
  ) {
    return NextResponse.json({ error: "Missing settings values" }, { status: 400 });
  }

  const result = await saveConsultationSettings(settings);

  if (!result.success) {
    return NextResponse.json({ error: "Unable to save settings" }, { status: 503 });
  }

  return NextResponse.json({ settings: result.settings });
}
