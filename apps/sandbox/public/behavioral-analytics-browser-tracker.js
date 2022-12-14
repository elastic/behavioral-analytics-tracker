"use strict";var elasticAnalyticsDefault=(()=>{var v=Object.defineProperty;var P=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var U=Object.prototype.hasOwnProperty;var y=(r,e)=>{for(var t in e)v(r,t,{get:e[t],enumerable:!0})},A=(r,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of x(e))!U.call(r,n)&&n!==t&&v(r,n,{get:()=>e[n],enumerable:!(i=P(e,n))||i.enumerable});return r};var D=r=>A(v({},"__esModule",{value:!0}),r);var O={};y(O,{default:()=>L});var h=(r,e)=>({...e,event_type:r});var f=(r,e)=>r!=="pageview"||!document.referrer?e:{...e,referrer:document.referrer};var l=(r,e)=>r!=="pageview"?e:{...e,url:window.location.href};var g={eventType:h,pageReferrer:f,pageUrl:l};function s(r){var i;let t=("; "+document.cookie).split("; "+r+"=");if(t.length===2&&t[1])return(i=t.pop())==null?void 0:i.split(";").shift()}function T(r,e,t,i="/"){var n="expires="+t.toUTCString();document.cookie=r+"="+e+"; "+n+"; path="+i}function d(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,function(r){return(r^crypto.getRandomValues(new Uint8Array(1))[0]&15>>r/4).toString(16)})}var I=24*60*60*1e3,_=30*60*1e3,p=class{constructor(e){this.userToken=e.userToken||s("EA_UID")||d(),this.userTokenExpirationInterval=e.userTokenExpirationInterval||I,this.userToken!==s("EA_UID")&&this.updateUserExpire()}getUserUuid(){let e=s("EA_UID");return e||(this.updateUserExpire(),e=s("EA_UID")),e}getSessionUuid(){return s("EA_SID")}updateSessionExpire(){let e=s("EA_SID")||d(),t=new Date;t.setMilliseconds(_),T("EA_SID",e,t)}updateUserExpire(){let e=new Date;e.setMilliseconds(this.userTokenExpirationInterval),T("EA_UID",this.userToken,e)}};var R=(r,e,t)=>Object.values(t).reduce((i,n)=>n(r,i),{event_data:e}),a=class{constructor(e){this.endpointURL=e.dsn,this.userSessionStore=new p({userToken:typeof e.userToken=="function"?e.userToken():e.userToken,userTokenExpirationInterval:e.userTokenExpirationDate}),this.dataProviders={...g,...e.dataProviders||{}}}trackEvent(e,t={}){let i=R(e,t,this.dataProviders),n=JSON.stringify(this.enrichEventWithSession(i)),k=`${this.endpointURL}/events`;if(navigator.sendBeacon!=null)navigator.sendBeacon(k,n);else{let u=new XMLHttpRequest;u.open("POST",k,!0),u.setRequestHeader("Content-Type","text/plain"),u.send(n)}}trackPageView(e){this.trackEvent("pageview",e)}enrichEventWithSession(e){return this.userSessionStore.updateSessionExpire(),{...e,user_uuid:this.userSessionStore.getUserUuid(),session_uuid:this.userSessionStore.getSessionUuid()}}};function w(r){let e=document.currentScript;return e==null?void 0:e.getAttribute(r)}var S=w("data-dsn");if(!S)throw new Error("Behavioral Analytics: Missing DSN. Please refer to the integration guide.");var o=null,E=[],m={createTracker:r=>(o=new a({...r,dsn:S}),E.forEach(([e,t])=>{o==null||o.trackEvent(e,t)}),o),trackEvent:(r,e)=>{if(!o){E.push([r,e||{}]);return}o.trackEvent(r,e)},trackPageView:r=>{if(!o){E.push(["pageview",r||{}]);return}o.trackPageView(r)}},c=()=>{m.trackPageView()};window.addEventListener("pageshow",c);if(window.history){let r=window.history.pushState;window.history.pushState=(...e)=>(window.dispatchEvent(new Event("ewt:pushstate")),r.apply(window.history,e)),window.addEventListener("ewt:pushstate",c),window.addEventListener("popstate",c)}else window.addEventListener("hashchange",c);var L=m;return D(O);})();
var elasticAnalytics = elasticAnalyticsDefault.default
