(this.webpackJsonpfinished=this.webpackJsonpfinished||[]).push([[0],{13:function(e,t,n){},14:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),r=n(6),l=n.n(r),u=n(4),o=n(3),s=n(7),i=(n(13),"DEqHqd-689CYP8Jbq92-ic3kEc74G4XbbTSD-DC_D-U");function h(){var e=Object(a.useState)([]),t=Object(o.a)(e,2),n=t[0],r=t[1],l=Object(a.useState)(1),h=Object(o.a)(l,2),m=h[0],p=h[1],f=Object(a.useState)(""),b=Object(o.a)(f,2),d=b[0],E=b[1],g=Object(a.useCallback)((function(){var e="https://api.unsplash.com/photos?";d&&(e="https://api.unsplash.com/search/photos?query=".concat(d)),e+="&page=".concat(m),e+="&client_id=".concat(i),fetch(e).then((function(e){return e.json()})).then((function(e){var t,n=null!==(t=e.results)&&void 0!==t?t:e;r(1!==m?function(e){return[].concat(Object(u.a)(e),Object(u.a)(n))}:n)}))}),[m,d]);return Object(a.useEffect)((function(){g()}),[m,g]),c.a.createElement("div",{className:"app"},c.a.createElement("h1",null,"Unsplash Image Gallery!"),c.a.createElement("form",{onSubmit:function(e){e.preventDefault(),p(1),g()}},c.a.createElement("input",{type:"text",placeholder:"Search Unsplash...",value:d,onChange:function(e){return E(e.target.value)}}),c.a.createElement("button",null,"Search")),c.a.createElement(s.a,{dataLength:n.length,next:function(){return p((function(e){return e+1}))},hasMore:!0,loader:c.a.createElement("h4",null,"Loading...")},c.a.createElement("div",{className:"image-grid"},n.map((function(e,t){return c.a.createElement("a",{href:e.links.html,className:"image",target:"_blank",rel:"noopener noreferrer",key:t},c.a.createElement("img",{src:e.urls.regular,alt:e.alt_description}))})))))}l.a.render(c.a.createElement(c.a.StrictMode,null,c.a.createElement(h,null)),document.getElementById("root"))},8:function(e,t,n){e.exports=n(14)}},[[8,1,2]]]);
//# sourceMappingURL=main.17423354.chunk.js.map