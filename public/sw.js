if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>n(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(i.map((e=>o[e]||r(e)))).then((e=>(a(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"841e00ac6b3826f29bae9868585d061c"},{url:"/_next/static/chunks/117-d9e8f21e223c90b1.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/395-ba2be2dd749be2ca.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/725-006145b4feb4ed4f.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/906-ba52652adc0bd987.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/972-a8c98ae7b159cfe2.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/_not-found/page-b594cd94f1ea2cd6.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/ghin-test/page-92bbeaf16a7bef15.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/layout-8bba924c2c7e7712.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/matches/page-ce1729878ab9185a.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/offline/page-ee270349f304f83a.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/page-16f95cea0ca4041a.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/schedule/page-ba5f74beb6c858f7.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/scoring/page-ebccb6fd2caa9546.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/standings/page-3edcca1472c3e7cb.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/app/teams/page-68070014ee045522.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/fd9d1056-0807e69ea9c303ac.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/main-082fc72a2203d8d2.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/main-app-e8de56fd92e53fce.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-41a9ee0a1d65a3d2.js",revision:"nUIU5mzM-J8WEqgA3sWvX"},{url:"/_next/static/css/c409269c286130fe.css",revision:"c409269c286130fe"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/nUIU5mzM-J8WEqgA3sWvX/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/nUIU5mzM-J8WEqgA3sWvX/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/icons/icon-128x128.png",revision:"8ab0f06d110858a93d56b8d713e87ce3"},{url:"/icons/icon-144x144.png",revision:"71f15cde090d4e7c42ec9bebf0e224a7"},{url:"/icons/icon-152x152.png",revision:"ae961e62285aae12d5ced5d8b6ee8763"},{url:"/icons/icon-192x192.png",revision:"ec40a4004e67e0e98470b32b742dbc70"},{url:"/icons/icon-384x384.png",revision:"6456275816572a7a80e3e8457267a3f6"},{url:"/icons/icon-512x512.png",revision:"f31c2eb13c8313650ebd13ae5817fb0b"},{url:"/icons/icon-72x72.png",revision:"3ad3e2e51d45d1f0ce198c5c40f4f1b0"},{url:"/icons/icon-96x96.png",revision:"2504cbb8e3683415de72aa547d62ce45"},{url:"/icons/maskable-icon.png",revision:"f31c2eb13c8313650ebd13ae5817fb0b"},{url:"/manifest.json",revision:"fa280f5752b2b9ce0bed64774752bd45"},{url:"/mesh.svg",revision:"cbef16047e6ad0f1329cf165e67ed72d"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
