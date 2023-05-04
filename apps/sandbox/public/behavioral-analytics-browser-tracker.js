"use strict";var elasticAnalyticsDefault=(()=>{var d=Object.defineProperty;var _=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var f=Object.prototype.hasOwnProperty;var A=(e,t)=>{for(var r in t)d(e,r,{get:t[r],enumerable:!0})},P=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of I(t))!f.call(e,s)&&s!==r&&d(e,s,{get:()=>t[s],enumerable:!(i=_(t,s))||i.enumerable});return e};var m=e=>P(d({},"__esModule",{value:!0}),e);var C={};A(C,{default:()=>R});var U=(e,t)=>{let r=document.referrer||"";return e==="page_view"?{...t,page:{...t.page||{},referrer:r,url:window.location.href,title:document.title}}:t},y={pageAttributes:U};function n(e){var t;let i=("; "+document.cookie).split("; "+e+"=");if(i.length===2&&i[1])return(t=i.pop())==null?void 0:t.split(";").shift()}function l(e,t,r,i="/"){var s="expires="+r.toUTCString();document.cookie=e+"="+t+"; "+s+"; path="+i}function E(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,function(e){return(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16)})}var x=1,L=24*60*60*1e3,v=30*60*1e3,D=v,o="EA_UID",S="EA_SID",h="EA_SESSION_SAMPLED",N=class{constructor(e){this.userToken=e.user.token||n(o)||E(),this.userTokenExpirationInterval=e.user.lifetime||L,this.sessionTokenExpirationInterval=e.session.lifetime||v,this.sampling=e.sampling===void 0?x:e.sampling,n("EA_SESSION_SAMPLED")||this.updateSessionSampledExpire(),this.userToken!==n(o)&&this.updateUserExpire()}getUserUuid(){let e=n(o);return e||(this.updateUserExpire(),e=n(o)),e}isSessionSampled(){return n(h)=="true"}updateSessionSampledExpire(){let e=n(h)||(Math.random()<=this.sampling).toString(),t=new Date;t.setMilliseconds(D),l(h,e,t)}getSessionUuid(){return n(S)}updateSessionExpire(){let e=n(S)||E(),t=new Date;t.setMilliseconds(this.sessionTokenExpirationInterval),l(S,e,t)}updateUserExpire(){let e=new Date;e.setMilliseconds(this.userTokenExpirationInterval),l(o,this.userToken,e)}},O=(e,t,r)=>Object.values(r).reduce((i,s)=>s(e,i),{...t}),k=class{constructor(e){var t,r,i,s;this.apiURL=`${e.endpoint}/_application/analytics/${e.collectionName}/event`,this.apiKey=e.apiKey,this.debug=e.debug||!1,this.userSessionStore=new N({user:{token:typeof((t=e.user)==null?void 0:t.token)=="function"?e.user.token():(r=e.user)==null?void 0:r.token,lifetime:(i=e.user)==null?void 0:i.lifetime},session:{lifetime:(s=e.session)==null?void 0:s.lifetime},sampling:e.sampling}),this.dataProviders={...y,...e.dataProviders||{}}}trackEvent(e,t){if(this.userSessionStore.updateSessionExpire(),this.userSessionStore.updateSessionSampledExpire(),!this.userSessionStore.isSessionSampled())return;let r=this.getUserSession(),i=O(e,{...t,...r},this.dataProviders),s=JSON.stringify(i),g=this.debug?"?debug=true":"",T=`${this.apiURL}/${e}${g}`,c=new XMLHttpRequest;c.open("POST",T,!0),c.setRequestHeader("Content-Type","application/json"),c.setRequestHeader("Authorization",`Apikey ${this.apiKey}`),c.send(s)}trackPageView(e){this.trackEvent("page_view",e||{})}trackSearchClick(e){this.trackEvent("search_click",e)}trackSearch(e){this.trackEvent("search",e)}getUserSession(){return{user:{id:this.userSessionStore.getUserUuid()},session:{id:this.userSessionStore.getSessionUuid()}}}};var a,u=[],w={createTracker:e=>(a=new k(e),u.forEach(([t,r])=>{a==null||a.trackEvent(t,r)}),a),trackPageView:e=>{if(!a){u.push(["page_view",{}]);return}a.trackPageView(e)},trackSearchClick:e=>{if(!a){u.push(["search_click",e]);return}a.trackSearchClick(e)},trackSearch:e=>{if(!a){u.push(["search",e]);return}a.trackSearch(e)}},p=()=>{w.trackPageView({})};window.addEventListener("pageshow",p);if(window.history){let e=window.history.pushState;window.history.pushState=(...t)=>(window.dispatchEvent(new Event("ewt:pushstate")),e.apply(window.history,t)),window.addEventListener("ewt:pushstate",p),window.addEventListener("popstate",p)}else window.addEventListener("hashchange",p);var R=w;return m(C);})();
var elasticAnalytics = elasticAnalyticsDefault.default
