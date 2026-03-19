import { getAllItems } from "@/lib/looks";

export async function GET() {
  try {
    const items = await getAllItems();

    return Response.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      error: String(error),
    });
  }
}
