if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const d=e=>a(e,i),r={module:{uri:i},exports:c,require:d};s[i]=Promise.all(n.map((e=>r[e]||d(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"69835a1078942c1e32cbe34bf580a369"},{url:"/_next/static/OtSCCEJ4zdjvhUeqU6Mb1/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/OtSCCEJ4zdjvhUeqU6Mb1/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/117-298e7afbe7058161.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/281-84704453c1087c55.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/730.f16113b62dff2a3b.js",revision:"f16113b62dff2a3b"},{url:"/_next/static/chunks/8e1d74a4-ec9aae0c5462ea3d.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/972-ad23ae6b0e2a1d61.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/982-bd2b9a4f743907c1.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/aaea2bcf-03a8796b71b25f56.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/_not-found/page-1524bee626e7fb32.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/admin/page-5318e3490e522665.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/admin/players/%5Bid%5D/delete/page-96bb172cffd52275.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/admin/players/%5Bid%5D/edit/page-b058e75441299350.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/admin/players/add/page-19434c4b3356ece5.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/admin/players/page-598f266091fdfb01.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/admin/setup/page-3fb74723b6d1a8a9.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/admin/teams/%5Bid%5D/page-a00aa7255c7fa3f4.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/admin/teams/page-b70ac9a3948ee903.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/ghin-test/page-cd437caa93cd8c85.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/layout-d0e630f71e36e1ea.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/matches/admin/page-c8927bfc8ac5d16f.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/matches/page-a9c46500a4ccf4d8.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/offline/page-15741604e0bce751.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/page-bb5f4998585c3895.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/schedule/admin/page-ebc9450baa125278.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/schedule/page-66c6c376ae804cd8.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/standings/page-3e6660b5fcfb9afd.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/teams/%5Bid%5D/page-c70af7f4b1b506aa.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/teams/admin/page-71f5918b5c9f250f.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/app/teams/page-6ace99f4e446fe98.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/fd9d1056-d5630cddc915dd96.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/main-15a3eef5f6603746.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/main-app-e8de56fd92e53fce.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-cbfc4967ec6ba648.js",revision:"OtSCCEJ4zdjvhUeqU6Mb1"},{url:"/_next/static/css/fac6b7c77c16d9e2.css",revision:"fac6b7c77c16d9e2"},{url:"/_next/static/media/04ff47e1ca568747-s.p.woff2",revision:"7fa44513d75219a7f08354904847f470"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/2e5f5e513f4dc014-s.woff2",revision:"06d8e5bdf0b3dededad791ca12df6067"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/ab86f138d0d6e9da-s.p.woff2",revision:"f064f66892177bca0934a110a1de30b0"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/direct-setup.html",revision:"627a83dfe4d1d246c514e71405dbf02b"},{url:"/grid-pattern.svg",revision:"58d0978af954cd74d2204c2122db2e16"},{url:"/icons/icon-128x128.png",revision:"8ab0f06d110858a93d56b8d713e87ce3"},{url:"/icons/icon-144x144.png",revision:"71f15cde090d4e7c42ec9bebf0e224a7"},{url:"/icons/icon-152x152.png",revision:"ae961e62285aae12d5ced5d8b6ee8763"},{url:"/icons/icon-192x192.png",revision:"ec40a4004e67e0e98470b32b742dbc70"},{url:"/icons/icon-384x384.png",revision:"6456275816572a7a80e3e8457267a3f6"},{url:"/icons/icon-512x512.png",revision:"f31c2eb13c8313650ebd13ae5817fb0b"},{url:"/icons/icon-72x72.png",revision:"3ad3e2e51d45d1f0ce198c5c40f4f1b0"},{url:"/icons/icon-96x96.png",revision:"2504cbb8e3683415de72aa547d62ce45"},{url:"/icons/maskable-icon.png",revision:"f31c2eb13c8313650ebd13ae5817fb0b"},{url:"/manifest.json",revision:"fa280f5752b2b9ce0bed64774752bd45"},{url:"/mesh.svg",revision:"cbef16047e6ad0f1329cf165e67ed72d"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
