let reports = []; // In-memory DB (you'll replace this with a real DB later)

export async function POST(req) {
  const data = await req.json();

  if (!data || !data.latitude || !data.longitude || !data.type) {
    return new Response(JSON.stringify({ error: "Incomplete data" }), { status: 400 });
  }

  const report = {
    id: Date.now(),
    ...data,
    timestamp: new Date().toISOString(),
  };

  reports.push(report);

  return new Response(JSON.stringify({ success: true, report }), { status: 200 });
}

export async function GET() {
  return new Response(JSON.stringify(reports), { status: 200 });
}
