// app/api/analyze/route.js or route.ts (Next.js 13+ with app dir)
export async function POST(req) {
    const formData = await req.formData();
    const file = formData.get("image");
  
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }
  
    // Simulate AI analysis (replace with actual logic or ML API)
    const result = {
      type: "Plastic Waste",
      severity: "High",
      suggestion: "Immediate cleanup required",
    };
  
    return new Response(JSON.stringify(result), { status: 200 });
  }
  