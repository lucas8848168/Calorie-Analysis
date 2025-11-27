// Health check endpoint for Cloudflare Pages Function

export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: Date.now(),
      version: '2.0.0',
      platform: 'Cloudflare Pages Functions',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
