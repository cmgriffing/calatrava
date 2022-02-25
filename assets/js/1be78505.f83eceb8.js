"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[9514,4250],{3466:function(e,t,a){a.r(t),a.d(t,{default:function(){return ee}});var n=a(9901),l=a(7522),o=a(9194),r=a(2786),i=a(5789),c=a(4475),s=a(817),d=a(7538);var u=function(e){return n.createElement("svg",(0,d.Z)({width:"20",height:"20","aria-hidden":"true"},e),n.createElement("g",{fill:"#7a7a7a"},n.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),n.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))},m=a(4621),b=a(3086),p=a(5996),f=a(7083),h=a(4769),v="menuLinkText_ItAc",E="hasHref_QL4Z",g=a(4752),k=["item"],_=["item","onItemClick","activePath","level","index"],C=["item","onItemClick","activePath","level","index"];function N(e){var t=e.item,a=(0,b.Z)(e,k);return"category"===t.type?0===t.items.length?null:n.createElement(S,(0,d.Z)({item:t},a)):n.createElement(Z,(0,d.Z)({item:t},a))}function S(e){var t,a=e.item,l=e.onItemClick,o=e.activePath,r=e.level,s=e.index,u=(0,b.Z)(e,_),f=a.items,h=a.label,k=a.collapsible,C=a.className,N=a.href,S=function(e){var t=(0,g.Z)();return(0,n.useMemo)((function(){return e.href?e.href:!t&&e.collapsible?(0,c.Wl)(e):void 0}),[e,t])}(a),Z=(0,c._F)(a,o),I=(0,c.uR)({initialState:function(){return!!k&&(!Z&&a.collapsed)}}),T=I.collapsed,x=I.setCollapsed;!function(e){var t=e.isActive,a=e.collapsed,l=e.setCollapsed,o=(0,c.D9)(t);(0,n.useEffect)((function(){t&&!o&&a&&l(!1)}),[t,o,a,l])}({isActive:Z,collapsed:T,setCollapsed:x});var y=(0,c.fP)(),A=y.expandedItem,F=y.setExpandedItem;function L(e){void 0===e&&(e=!T),F(e?null:s),x(e)}var w=(0,c.LU)().autoCollapseSidebarCategories;return(0,n.useEffect)((function(){k&&A&&A!==s&&w&&x(!0)}),[k,A,s,x,w]),n.createElement("li",{className:(0,i.Z)(c.kM.docs.docSidebarItemCategory,c.kM.docs.docSidebarItemCategoryLevel(r),"menu__list-item",{"menu__list-item--collapsed":T},C)},n.createElement("div",{className:"menu__list-item-collapsible"},n.createElement(p.Z,(0,d.Z)({className:(0,i.Z)("menu__link",(t={"menu__link--sublist":k&&!N,"menu__link--active":Z},t[v]=!k,t[E]=!!S,t)),onClick:k?function(e){null==l||l(a),N?L(!1):(e.preventDefault(),L())}:function(){null==l||l(a)},"aria-current":Z?"page":void 0,href:k?null!=S?S:"#":S},u),h),N&&k&&n.createElement("button",{"aria-label":(0,m.I)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:h}),type:"button",className:"clean-btn menu__caret",onClick:function(e){e.preventDefault(),L()}})),n.createElement(c.zF,{lazy:!0,as:"ul",className:"menu__list",collapsed:T},n.createElement(M,{items:f,tabIndex:T?-1:0,onItemClick:l,activePath:o,level:r+1})))}function Z(e){var t=e.item,a=e.onItemClick,l=e.activePath,o=e.level,r=(e.index,(0,b.Z)(e,C)),s=t.href,u=t.label,m=t.className,v=(0,c._F)(t,l);return n.createElement("li",{className:(0,i.Z)(c.kM.docs.docSidebarItemLink,c.kM.docs.docSidebarItemLinkLevel(o),"menu__list-item",m),key:u},n.createElement(p.Z,(0,d.Z)({className:(0,i.Z)("menu__link",{"menu__link--active":v}),"aria-current":v?"page":void 0,to:s},(0,f.Z)(s)&&{onClick:a?function(){return a(t)}:void 0},r),(0,f.Z)(s)?u:n.createElement("span",null,u,n.createElement(h.Z,null))))}var I=["items"];function T(e){var t=e.items,a=(0,b.Z)(e,I);return n.createElement(c.D_,null,t.map((function(e,t){return n.createElement(N,(0,d.Z)({key:t,item:e,index:t},a))})))}var M=(0,n.memo)(T),x="sidebar_WdDB",y="sidebarWithHideableNavbar_gCEz",A="sidebarHidden_TxEl",F="sidebarLogo_K3no",L="menu_soIs",w="menuWithAnnouncementBar_RUTF",P="collapseSidebarButton_xwRe",B="collapseSidebarButtonIcon_DSWY";function D(e){var t=e.onClick;return n.createElement("button",{type:"button",title:(0,m.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,m.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,i.Z)("button button--secondary button--outline",P),onClick:t},n.createElement(u,{className:B}))}function R(e){var t,a,l=e.path,o=e.sidebar,r=e.onCollapse,d=e.isHidden,u=function(){var e=(0,c.nT)().isActive,t=(0,n.useState)(e),a=t[0],l=t[1];return(0,c.RF)((function(t){var a=t.scrollY;e&&l(0===a)}),[e]),e&&a}(),m=(0,c.LU)(),b=m.navbar.hideOnScroll,p=m.hideableSidebar;return n.createElement("div",{className:(0,i.Z)(x,(t={},t[y]=b,t[A]=d,t))},b&&n.createElement(s.Z,{tabIndex:-1,className:F}),n.createElement("nav",{className:(0,i.Z)("menu thin-scrollbar",L,(a={},a[w]=u,a))},n.createElement("ul",{className:(0,i.Z)(c.kM.docs.docSidebarMenu,"menu__list")},n.createElement(M,{items:o,activePath:l,level:1}))),p&&n.createElement(D,{onClick:r}))}var H=function(e){var t=e.toggleSidebar,a=e.sidebar,l=e.path;return n.createElement("ul",{className:(0,i.Z)(c.kM.docs.docSidebarMenu,"menu__list")},n.createElement(M,{items:a,activePath:l,onItemClick:function(e){"category"===e.type&&e.href&&t(),"link"===e.type&&t()},level:1}))};function W(e){return n.createElement(c.Cv,{component:H,props:e})}var U=n.memo(R),z=n.memo(W);function Y(e){var t=(0,c.iP)(),a="desktop"===t||"ssr"===t,l="mobile"===t;return n.createElement(n.Fragment,null,a&&n.createElement(U,e),l&&n.createElement(z,e))}var q=a(7780),G=a(4250),K="backToTopButton_F7Fs",Q="backToTopButtonShow_YTgh";function J(){var e=(0,n.useRef)(null);return{smoothScrollTop:function(){var t;e.current=(t=null,function e(){var a=document.documentElement.scrollTop;a>0&&(t=requestAnimationFrame(e),window.scrollTo(0,Math.floor(.85*a)))}(),function(){return t&&cancelAnimationFrame(t)})},cancelScrollToTop:function(){return null==e.current?void 0:e.current()}}}var O=function(){var e,t=(0,n.useState)(!1),a=t[0],l=t[1],o=(0,n.useRef)(!1),r=J(),s=r.smoothScrollTop,d=r.cancelScrollToTop;return(0,c.RF)((function(e,t){var a=e.scrollY,n=null==t?void 0:t.scrollY;if(n)if(o.current)o.current=!1;else{var r=a<n;if(r||d(),a<300)l(!1);else if(r){var i=document.documentElement.scrollHeight;a+window.innerHeight<i&&l(!0)}else l(!1)}})),(0,c.SL)((function(e){e.location.hash&&(o.current=!0,l(!1))})),n.createElement("button",{"aria-label":(0,m.I)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,i.Z)("clean-btn",c.kM.common.backToTopButton,K,(e={},e[Q]=a,e)),type:"button",onClick:function(){return s()}})},V=a(2455),X={docPage:"docPage_FRQN",docMainContainer:"docMainContainer_UZsA",docSidebarContainer:"docSidebarContainer_cGu5",docMainContainerEnhanced:"docMainContainerEnhanced_bND7",docSidebarContainerHidden:"docSidebarContainerHidden_daJn",collapsedDocSidebar:"collapsedDocSidebar_bCe7",expandSidebarButtonIcon:"expandSidebarButtonIcon_EMrG",docItemWrapperEnhanced:"docItemWrapperEnhanced_u5Uf"},j=a(6005);function $(e){var t,a,o,s=e.currentDocRoute,d=e.versionMetadata,b=e.children,p=e.sidebarName,f=(0,c.Vq)(),h=d.pluginId,v=d.version,E=(0,n.useState)(!1),g=E[0],k=E[1],_=(0,n.useState)(!1),C=_[0],N=_[1],S=(0,n.useCallback)((function(){C&&N(!1),k((function(e){return!e}))}),[C]);return n.createElement(r.Z,{wrapperClassName:c.kM.wrapper.docsPages,pageClassName:c.kM.page.docsDocPage,searchMetadata:{version:v,tag:(0,c.os)(h,v)}},n.createElement("div",{className:X.docPage},n.createElement(O,null),f&&n.createElement("aside",{className:(0,i.Z)(c.kM.docs.docSidebarContainer,X.docSidebarContainer,(t={},t[X.docSidebarContainerHidden]=g,t)),onTransitionEnd:function(e){e.currentTarget.classList.contains(X.docSidebarContainer)&&g&&N(!0)}},n.createElement(Y,{key:p,sidebar:f,path:s.path,onCollapse:S,isHidden:C}),C&&n.createElement("div",{className:X.collapsedDocSidebar,title:(0,m.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,m.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:S,onClick:S},n.createElement(u,{className:X.expandSidebarButtonIcon}))),n.createElement("main",{className:(0,i.Z)(X.docMainContainer,(a={},a[X.docMainContainerEnhanced]=g||!f,a))},n.createElement("div",{className:(0,i.Z)("container padding-top--md padding-bottom--lg",X.docItemWrapper,(o={},o[X.docItemWrapperEnhanced]=g,o))},n.createElement(l.Zo,{components:q.Z},b)))))}var ee=function(e){var t=e.route.routes,a=e.versionMetadata,l=e.location,r=t.find((function(e){return(0,V.LX)(l.pathname,e)}));if(!r)return n.createElement(G.default,null);var i=r.sidebar,s=i?a.docsSidebars[i]:null;return n.createElement(n.Fragment,null,n.createElement(j.Z,null,n.createElement("html",{className:a.className})),n.createElement(c.qu,{version:a},n.createElement(c.bT,{sidebar:s},n.createElement($,{currentDocRoute:r,versionMetadata:a,sidebarName:i},(0,o.Z)(t,{versionMetadata:a})))))}},4250:function(e,t,a){a.r(t);var n=a(9901),l=a(2786),o=a(4621);t.default=function(){return n.createElement(l.Z,{title:(0,o.I)({id:"theme.NotFound.title",message:"Page Not Found"})},n.createElement("main",{className:"container margin-vert--xl"},n.createElement("div",{className:"row"},n.createElement("div",{className:"col col--6 col--offset-3"},n.createElement("h1",{className:"hero__title"},n.createElement(o.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),n.createElement("p",null,n.createElement(o.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),n.createElement("p",null,n.createElement(o.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken."))))))}}}]);