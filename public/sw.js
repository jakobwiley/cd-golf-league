if(!self.define){let e,s={};const t=(t,n)=>(t=new URL(t+".js",n).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(n,c)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let a={};const d=e=>t(e,i),r={module:{uri:i},exports:a,require:d};s[i]=Promise.all(n.map((e=>r[e]||d(e)))).then((e=>(c(...e),a)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"5ad4de799745189af48a8e0ead1da233"},{url:"/_next/static/chunks/117-d9e8f21e223c90b1.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/395-ba2be2dd749be2ca.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/725-006145b4feb4ed4f.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/906-ba52652adc0bd987.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/972-a8c98ae7b159cfe2.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/_not-found/page-b594cd94f1ea2cd6.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/ghin-test/page-92bbeaf16a7bef15.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/layout-f22d952e03962003.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/matches/page-689ecc19da537363.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/offline/page-ee270349f304f83a.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/page-431853e620f05377.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/schedule/page-046ff7e38259f2ac.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/scoring/page-ebccb6fd2caa9546.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/standings/page-f636bfb8bf38792b.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/teams/%5Bid%5D/page-184144113d0e1d9f.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/app/teams/page-81fc2ba94dc89034.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/fd9d1056-0807e69ea9c303ac.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/main-a1cc7b9f7034ee5d.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/main-app-e8de56fd92e53fce.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-2ec1a22154fbcde6.js",revision:"tIgjc2ALA7dgMvht3m5If"},{url:"/_next/static/css/d0d937303ea99d66.css",revision:"d0d937303ea99d66"},{url:"/_next/static/media/04ff47e1ca568747-s.p.woff2",revision:"7fa44513d75219a7f08354904847f470"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/2e5f5e513f4dc014-s.woff2",revision:"06d8e5bdf0b3dededad791ca12df6067"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/ab86f138d0d6e9da-s.p.woff2",revision:"f064f66892177bca0934a110a1de30b0"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/_next/static/tIgjc2ALA7dgMvht3m5If/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/tIgjc2ALA7dgMvht3m5If/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/direct-setup.html",revision:"627a83dfe4d1d246c514e71405dbf02b"},{url:"/grid-pattern.svg",revision:"58d0978af954cd74d2204c2122db2e16"},{url:"/icons/icon-128x128.png",revision:"8ab0f06d110858a93d56b8d713e87ce3"},{url:"/icons/icon-144x144.png",revision:"71f15cde090d4e7c42ec9bebf0e224a7"},{url:"/icons/icon-152x152.png",revision:"ae961e62285aae12d5ced5d8b6ee8763"},{url:"/icons/icon-192x192.png",revision:"ec40a4004e67e0e98470b32b742dbc70"},{url:"/icons/icon-384x384.png",revision:"6456275816572a7a80e3e8457267a3f6"},{url:"/icons/icon-512x512.png",revision:"f31c2eb13c8313650ebd13ae5817fb0b"},{url:"/icons/icon-72x72.png",revision:"3ad3e2e51d45d1f0ce198c5c40f4f1b0"},{url:"/icons/icon-96x96.png",revision:"2504cbb8e3683415de72aa547d62ce45"},{url:"/icons/maskable-icon.png",revision:"f31c2eb13c8313650ebd13ae5817fb0b"},{url:"/manifest.json",revision:"fa280f5752b2b9ce0bed64774752bd45"},{url:"/mesh.svg",revision:"cbef16047e6ad0f1329cf165e67ed72d"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:t,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
