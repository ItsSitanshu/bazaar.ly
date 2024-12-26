import { NextResponse } from 'next/server';

export function middleware(req) {
  
  const host = req.headers.get('host') || '';
  
  const isLocalhost = host.includes('localhost');
  const isNgrok = host.includes('ngrok-free.app');
  
  if (isLocalhost || isNgrok) {
    return NextResponse.next();
  }

  const hostParts = host.split('.');
  let subdomain = hostParts.length > 2 ? hostParts[0] : null;
  console.log("Subdomain: ", subdomain);
  
  if (subdomain === 'www' || !subdomain) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = `/subdomain/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}
