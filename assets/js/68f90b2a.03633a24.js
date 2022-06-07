"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[6268],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),c=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(n),f=a,m=d["".concat(l,".").concat(f)]||d[f]||p[f]||o;return n?r.createElement(m,i(i({ref:t},u),{},{components:n})):r.createElement(m,i({ref:t},u))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7955:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return l},default:function(){return f},frontMatter:function(){return s},metadata:function(){return c},toc:function(){return p}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],s={title:"HPA configuration"},l=void 0,c={unversionedId:"best-practices/hpa-configuration",id:"version-v1.2/best-practices/hpa-configuration",title:"HPA configuration",description:"Kruise workloads, such as CloneSet, Advanced StatefulSet, UnitedDeployment, are all implemented scale subresource,",source:"@site/versioned_docs/version-v1.2/best-practices/hpa-configuration.md",sourceDirName:"best-practices",slug:"/best-practices/hpa-configuration",permalink:"/docs/best-practices/hpa-configuration",draft:!1,editUrl:"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/hpa-configuration.md",tags:[],version:"v1.2",lastUpdatedBy:"Siyu Wang",lastUpdatedAt:1654585589,formattedLastUpdatedAt:"6/7/2022",frontMatter:{title:"HPA configuration"},sidebar:"docs",previous:{title:"PodUnavailableBudget",permalink:"/docs/user-manuals/podunavailablebudget"},next:{title:"Cloud-Native Devops Best Practices(1) - Continuous Integration (CI) + OpenKruise Image Pre-download",permalink:"/docs/best-practices/ci-pipeline-image-predownload"}},u={},p=[{value:"Example",id:"example",level:3}],d={toc:p};function f(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Kruise workloads, such as CloneSet, Advanced StatefulSet, UnitedDeployment, are all implemented scale subresource,\nwhich means they allow systems like HorizontalPodAutoscaler and PodDisruptionBudget interact with these resources."),(0,o.kt)("h3",{id:"example"},"Example"),(0,o.kt)("p",null,"Just set the CloneSet's type and name into ",(0,o.kt)("inlineCode",{parentName:"p"},"scaleTargetRef"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml"},"apiVersion: autoscaling/v2beta2\nkind: HorizontalPodAutoscaler\n# ...\nspec:\n  scaleTargetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: your-cloneset-name\n")),(0,o.kt)("p",null,"Note that:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"The HPA's namespace should be same as the namespace of your CloneSet."),(0,o.kt)("li",{parentName:"ol"},"The ",(0,o.kt)("inlineCode",{parentName:"li"},"apiVersion")," in ",(0,o.kt)("inlineCode",{parentName:"li"},"scaleTargetRef")," should be same as the ",(0,o.kt)("inlineCode",{parentName:"li"},"apiVersion")," in your workload resource, such as ",(0,o.kt)("inlineCode",{parentName:"li"},"apps.kruise.io/v1alpha1")," or ",(0,o.kt)("inlineCode",{parentName:"li"},"apps.kruise.io/v1beta1"),".\nIt depends on which version you are using for those workloads that have multiple versions, such as Advanced StatefulSet.")))}f.isMDXComponent=!0}}]);