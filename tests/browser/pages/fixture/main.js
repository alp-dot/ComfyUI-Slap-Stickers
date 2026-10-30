import { createApp, h } from "vue";
import SsSurface from "../../../../web_src/components/SsSurface.vue";
import { createSession } from "../../../../web_src/session.js";
import "../../../../web_src/slap_stickers.css";

const commits=[];
const session=createSession({state:new URLSearchParams(location.search).has("corrupt")?"broken JSON":"",commit:value=>commits.push(value),upload:async file=>({name:file.name,subfolder:"slap_stickers",type:"input"}),
  urlFor:file=>file.type==="temp"?`/tests/browser/fixtures/${file.subfolder}/${file.filename}`:`/tests/browser/fixtures/sticker.png`});
createApp({render:()=>h(SsSurface,{session})}).mount("#app");
window.demo={session,commits};
if(!new URLSearchParams(location.search).has("empty"))session.load(await(await fetch("/tests/browser/fixtures/surface.json")).json());
