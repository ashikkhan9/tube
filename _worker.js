export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // API Proxy 
    if (url.pathname.startsWith('/api/proxy')) {
      const targetUrl = url.searchParams.get('url');
      if (!targetUrl) return new Response(JSON.stringify({error: "URL missing"}), { status: 400 });
      
      try {
        const res = await fetch(targetUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Accept": "application/json"
          }
        });
        
        const data = await res.text();
        
        return new Response(data, {
          status: res.status,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({error: err.message}), { 
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
          }
        });
      }
    }
    
    // Load Normal Website Files
    return env.ASSETS.fetch(request);
  }
};
