export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // যদি রিকোয়েস্টটি /api/proxy দিয়ে আসে, তাহলে ব্লক বাইপাস করবে
    if (url.pathname.startsWith('/api/proxy')) {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) return new Response("URL missing", { status: 400 });
      
      try {
        const res = await fetch(targetUrl);
        const data = await res.text();
        return new Response(data, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        });
      } catch (err) {
        return new Response("Error", { status: 500 });
      }
    }
    
    // অন্যথায় আপনার ওয়েবসাইটের নরমাল ডিজাইন লোড করবে
    return env.ASSETS.fetch(request);
  }
};
