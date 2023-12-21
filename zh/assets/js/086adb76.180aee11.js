"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[4525],{3905:function(e,t,n){n.d(t,{Zo:function(){return m},kt:function(){return d}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},m=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,m=s(e,["components","mdxType","originalType","parentName"]),u=p(n),d=a,y=u["".concat(l,".").concat(d)]||u[d]||c[d]||i;return n?r.createElement(y,o(o({ref:t},m),{},{components:n})):r.createElement(y,o({ref:t},m))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},1082:function(e,t,n){n.r(t),n.d(t,{assets:function(){return m},contentTitle:function(){return l},default:function(){return d},frontMatter:function(){return s},metadata:function(){return p},toc:function(){return c}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],s={},l="CRD\u5b57\u6bb5\u8bf4\u660e",p={unversionedId:"user-manuals/crd-field-description",id:"user-manuals/crd-field-description",title:"CRD\u5b57\u6bb5\u8bf4\u660e",description:"GameServerSet",source:"@site/i18n/zh/docusaurus-plugin-content-docs-kruisegame/current/user-manuals/crd-field-description.md",sourceDirName:"user-manuals",slug:"/user-manuals/crd-field-description",permalink:"/zh/kruisegame/user-manuals/crd-field-description",draft:!1,tags:[],version:"current",lastUpdatedBy:"ChrisLiu",lastUpdatedAt:1691721700,formattedLastUpdatedAt:"2023/8/11",frontMatter:{},sidebar:"kruisegame",previous:{title:"\u6e38\u620f\u670d\u8fd0\u7ef4\u63a7\u5236\u53f0",permalink:"/zh/kruisegame/user-manuals/game-dashboard"},next:{title:"\u4f1a\u8bdd\u7c7b\u6e38\u620f\uff08PvP\u5f00\u623f\u95f4\uff09\u6700\u4f73\u5b9e\u8df5",permalink:"/zh/kruisegame/best-practices/session-based-game"}},m={},c=[{value:"GameServerSet",id:"gameserverset",level:2},{value:"GameServerSetSpec",id:"gameserversetspec",level:3},{value:"GameServerSetStatus",id:"gameserversetstatus",level:4},{value:"GameServerTemplate",id:"gameservertemplate",level:4},{value:"UpdateStrategy",id:"updatestrategy",level:4},{value:"ScaleStrategy",id:"scalestrategy",level:4},{value:"ServiceQualities",id:"servicequalities",level:4},{value:"Network",id:"network",level:4},{value:"GameServer",id:"gameserver",level:2},{value:"GameServerSpec",id:"gameserverspec",level:3},{value:"GameServerStatus",id:"gameserverstatus",level:3}],u={toc:c};function d(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"crd\u5b57\u6bb5\u8bf4\u660e"},"CRD\u5b57\u6bb5\u8bf4\u660e"),(0,i.kt)("h2",{id:"gameserverset"},"GameServerSet"),(0,i.kt)("h3",{id:"gameserversetspec"},"GameServerSetSpec"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type GameServerSetSpec struct {\n    // \u6e38\u620f\u670d\u6570\u76ee\uff0c\u5fc5\u987b\u6307\u5b9a\uff0c\u6700\u5c0f\u503c\u4e3a0\n    Replicas *int32 `json:"replicas"`\n\n    // \u6e38\u620f\u670d\u6a21\u7248\uff0c\u65b0\u751f\u6210\u7684\u6e38\u620f\u670d\u5c06\u4ee5\u6a21\u7248\u5b9a\u4e49\u7684\u53c2\u6570\u521b\u5efa\n    GameServerTemplate   GameServerTemplate `json:"gameServerTemplate,omitempty"`\n    \n    // serviceName \u662f\u7ba1\u7406\u6b64 GameServerSet \u7684\u670d\u52a1\u7684\u540d\u79f0\u3002\n    // \u8be5\u670d\u52a1\u5fc5\u987b\u5728GameServerSet\u4e4b\u524d\u5b58\u5728\uff0c\u5e76\u8d1f\u8d23\u8be5\u96c6\u5408\u7684\u7f51\u7edc\u6807\u8bc6\u3002 \n    // Pod \u83b7\u53d6\u9075\u5faa\u4ee5\u4e0b\u6a21\u5f0f\u7684 DNS/\u4e3b\u673a\u540d\uff1apod-specific-string.serviceName.default.svc.cluster.local\n    // \u5176\u4e2d\u201cpod-specific-string\u201d\u7531 GameServerSet \u63a7\u5236\u5668\u7ba1\u7406\u3002\n    ServiceName          string             `json:"serviceName,omitempty"`\n\n    // \u4fdd\u7559\u7684\u6e38\u620f\u670d\u5e8f\u53f7\uff0c\u53ef\u9009\u9879\u3002\u82e5\u6307\u5b9a\u4e86\u8be5\u5e8f\u53f7\uff0c\u5df2\u7ecf\u5b58\u5728\u7684\u6e38\u620f\u670d\u5c06\u88ab\u5220\u9664\uff1b\u800c\u672a\u5b58\u5728\u7684\u6e38\u620f\u670d\uff0c\u65b0\u5efa\u65f6\u5c06\u8df3\u8fc7\u3001\u4e0d\u521b\u5efa\u8be5\u5e8f\u53f7\n    ReserveGameServerIds []int              `json:"reserveGameServerIds,omitempty"`\n\n    // \u6e38\u620f\u670d\u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u3002\u7528\u6237\u901a\u8fc7\u8be5\u5b57\u6bb5\u5b9e\u73b0\u6e38\u620f\u670d\u81ea\u52a8\u5316\u72b6\u6001\u611f\u77e5\u3002\n    ServiceQualities     []ServiceQuality   `json:"serviceQualities,omitempty"`\n\n    // \u6e38\u620f\u670d\u6279\u91cf\u66f4\u65b0\u7b56\u7565\n    UpdateStrategy       UpdateStrategy     `json:"updateStrategy,omitempty"`\n \n    // \u6e38\u620f\u670d\u6c34\u5e73\u4f38\u7f29\u7b56\u7565\n    ScaleStrategy        ScaleStrategy      `json:"scaleStrategy,omitempty"`\n\n    // \u6e38\u620f\u670d\u63a5\u5165\u5c42\u7f51\u7edc\u8bbe\u7f6e\n    Network              *Network           `json:"network,omitempty"`\n}\n')),(0,i.kt)("h4",{id:"gameserversetstatus"},"GameServerSetStatus"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type GameServerSetStatus struct {\n    // \u63a7\u5236\u5668\u89c2\u5bdf\u5230GameServerSet\u7684\u8fed\u4ee3\u7248\u672c\n    ObservedGeneration int64 `json:"observedGeneration,omitempty"`\n\n    // \u6e38\u620f\u670d\u6570\u76ee\n    Replicas                int32  `json:"replicas"`\n\n    // \u5904\u4e8eReady\u7684\u6e38\u620f\u670d\u6570\u76ee\n    ReadyReplicas           int32  `json:"readyReplicas"`\n\n    // \u53ef\u7528\u7684\u6e38\u620f\u670d\u6570\u76ee\n    AvailableReplicas       int32  `json:"availableReplicas"`\n\n    // \u5f53\u524d\u7684\u6e38\u620f\u670d\u6570\u76ee\n    CurrentReplicas         int32  `json:"currentReplicas"`\n\n    // \u5df2\u66f4\u65b0\u7684\u6e38\u620f\u670d\u6570\u76ee\n    UpdatedReplicas         int32  `json:"updatedReplicas"`\n\n    // \u5df2\u66f4\u65b0\u5e76Ready\u7684\u6e38\u620f\u670d\u6570\u76ee\n    UpdatedReadyReplicas    int32  `json:"updatedReadyReplicas,omitempty"`\n\n    // \u5904\u4e8eMaintaining\u72b6\u6001\u7684\u6e38\u620f\u670d\u6570\u76ee\n    MaintainingReplicas     *int32 `json:"maintainingReplicas,omitempty"`\n\n    // \u5904\u4e8eWaitToBeDeleted\u72b6\u6001\u7684\u6e38\u620f\u670d\u6570\u76ee\n    WaitToBeDeletedReplicas *int32 `json:"waitToBeDeletedReplicas,omitempty"`\n\n    // LabelSelector \u662f\u6807\u7b7e\u9009\u62e9\u5668\uff0c\u7528\u4e8e\u67e5\u8be2\u5e94\u4e0e HPA \u4f7f\u7528\u7684\u526f\u672c\u6570\u76f8\u5339\u914d\u7684\u6e38\u620f\u670d\u3002\n    LabelSelector string `json:"labelSelector,omitempty"`\n}\n')),(0,i.kt)("h4",{id:"gameservertemplate"},"GameServerTemplate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type GameServerTemplate struct {\n    // \u7ee7\u627f\u81f3PodTemplateSpec\u7684\u6240\u6709\u5b57\u6bb5\n    corev1.PodTemplateSpec `json:",inline"`\n\n    // \u5bf9\u6301\u4e45\u5377\u7684\u8bf7\u6c42\u548c\u58f0\u660e\n    VolumeClaimTemplates   []corev1.PersistentVolumeClaim `json:"volumeClaimTemplates,omitempty"`\n}\n')),(0,i.kt)("h4",{id:"updatestrategy"},"UpdateStrategy"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type UpdateStrategy struct {\n    // \u66f4\u65b0\u7b56\u7565\u7c7b\u578b\uff0c\u53ef\u9009\u62e9 OnDelete \u6216 RollingUpdate\n    Type apps.StatefulSetUpdateStrategyType `json:"type,omitempty"`\n\n    // \u5f53\u7b56\u7565\u7c7b\u578b\u4e3aRollingUpdate\u65f6\u53ef\u7528\uff0c\u6307\u5b9aRollingUpdate\u5177\u4f53\u7b56\u7565\n    RollingUpdate *RollingUpdateStatefulSetStrategy `json:"rollingUpdate,omitempty"`\n}\n\n\ntype RollingUpdateStatefulSetStrategy struct {\n    // \u4fdd\u7559\u65e7\u7248\u672c\u6e38\u620f\u670d\u7684\u6570\u91cf\u6216\u767e\u5206\u6bd4\uff0c\u9ed8\u8ba4\u4e3a 0\u3002\n    Partition *int32 `json:"partition,omitempty"`\n    \n    \n    // \u4f1a\u4fdd\u8bc1\u53d1\u5e03\u8fc7\u7a0b\u4e2d\u6700\u591a\u6709\u591a\u5c11\u4e2a\u6e38\u620f\u670d\u5904\u4e8e\u4e0d\u53ef\u7528\u72b6\u6001\uff0c\u9ed8\u8ba4\u503c\u4e3a 1\u3002\n    // \u652f\u6301\u8bbe\u7f6e\u767e\u5206\u6bd4\uff0c\u6bd4\u5982\uff1a20%\uff0c\u610f\u5473\u7740\u6700\u591a\u670920%\u4e2a\u6e38\u620f\u670d\u5904\u4e8e\u4e0d\u53ef\u7528\u72b6\u6001\u3002\n    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty"`\n\n    // \u8868\u660e\u6e38\u620f\u670d\u66f4\u65b0\u7684\u65b9\u5f0f\u3002\u53ef\u9009\u62e9ReCreate / InPlaceIfPossible / InPlaceOnly\u3002\u9ed8\u8ba4\u4e3aReCreate\u3002\n    PodUpdatePolicy kruiseV1beta1.PodUpdateStrategyType `json:"podUpdatePolicy,omitempty"`\n\n    // \u662f\u5426\u6682\u505c\u53d1\u5e03\uff0c\u9ed8\u8ba4\u4e3afalse\u3002\n    Paused bool `json:"paused,omitempty"`\n\n    // \u539f\u5730\u5347\u7ea7\u7684\u7b56\u7565\n    InPlaceUpdateStrategy *appspub.InPlaceUpdateStrategy `json:"inPlaceUpdateStrategy,omitempty"`\n    \n    // \u6e38\u620f\u670d\u5728\u66f4\u65b0\u540e\u591a\u4e45\u88ab\u89c6\u4e3a\u51c6\u5907\u5c31\u7eea\uff0c\u9ed8\u8ba4\u4e3a0\uff0c\u6700\u5927\u503c\u4e3a300\u3002\n    MinReadySeconds *int32 `json:"minReadySeconds,omitempty"`\n}\n\ntype InPlaceUpdateStrategy struct {\n    // \u5c06\u6e38\u620f\u670d\u72b6\u6001\u8bbe\u7f6e\u4e3aNotReady\u548c\u66f4\u65b0\u6e38\u620f\u670dSpec\u4e2d\u7684\u955c\u50cf\u4e4b\u95f4\u7684\u65f6\u95f4\u8de8\u5ea6\u3002\n    GracePeriodSeconds int32 `json:"gracePeriodSeconds,omitempty"`\n}\n')),(0,i.kt)("h4",{id:"scalestrategy"},"ScaleStrategy"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type ScaleStrategy struct {\n    // \u6269\u7f29\u671f\u95f4\u6e38\u620f\u670d\u6700\u5927\u4e0d\u53ef\u7528\u7684\u6570\u91cf\uff0c\u53ef\u4e3a\u7edd\u5bf9\u503c\u6216\u767e\u5206\u6bd4\n    MaxUnavailable *intstr.IntOrString `json:"maxUnavailable,omitempty"`\n    \n    // \u7f29\u5bb9\u7b56\u7565\u7c7b\u578b\uff0c\u76ee\u524d\u652f\u6301\u4e24\u79cd\uff1aGeneral \u4e0e ReserveIds\u3002\n    // \u9ed8\u8ba4\u4e3aGeneral\uff0c\u7f29\u5bb9\u65f6\u4f18\u5148\u8003\u8651reserveGameServerIds\u5b57\u6bb5\uff0c\n    // \u5f53\u9884\u7559\u7684GameServer\u6570\u91cf\u4e0d\u6ee1\u8db3\u7f29\u51cf\u6570\u91cf\u65f6\uff0c\u7ee7\u7eed\u4ece\u5f53\u524d\u6e38\u620f\u670d\u52a1\u5668\u5217\u8868\u4e2d\u9009\u62e9\u5e76\u5220\u9664GameServer\u3002\n    // \u5f53\u8be5\u5b57\u6bb5\u8bbe\u7f6e\u4e3aReserveIds\u65f6\uff0c\u65e0\u8bba\u662f\u4fdd\u7559\u7684\u6e38\u620f\u670d\u8fd8\u662f\u63a7\u5236\u5668\u6309\u7167\u4f18\u5148\u7ea7\u5220\u9664\u7684\u6e38\u620f\u670d\uff0c\n    // \u88ab\u5220\u9664\u7684\u6e38\u620f\u670d\u7684\u5e8f\u53f7\u90fd\u4f1a\u56de\u586b\u81f3ReserveGameServerIds\u5b57\u6bb5\u3002\n    ScaleDownStrategyType ScaleDownStrategyType `json:"scaleDownStrategyType,omitempty"`\n}\n\n')),(0,i.kt)("h4",{id:"servicequalities"},"ServiceQualities"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type ServiceQuality struct {\n   // \u7ee7\u627f\u81f3corev1.Probe\u6240\u6709\u5b57\u6bb5\uff0c\u6b64\u5904\u6307\u5b9a\u63a2\u6d4b\u65b9\u5f0f\n   corev1.Probe  `json:",inline"`\n\n   // \u81ea\u5b9a\u4e49\u670d\u52a1\u8d28\u91cf\u7684\u540d\u79f0\uff0c\u533a\u522b\u5b9a\u4e49\u4e0d\u540c\u7684\u670d\u52a1\u8d28\u91cf\n   Name          string `json:"name"`\n\n   // \u63a2\u6d4b\u7684\u5bb9\u5668\u540d\u79f0\n   ContainerName string `json:"containerName,omitempty"`\n\n   // \u662f\u5426\u8ba9GameServerSpec\u5728ServiceQualityAction\u6267\u884c\u540e\u4e0d\u53d1\u751f\u53d8\u5316\u3002\n   // \u5f53Permanent\u4e3atrue\u65f6\uff0c\u65e0\u8bba\u68c0\u6d4b\u7ed3\u679c\u5982\u4f55\uff0cServiceQualityAction\u53ea\u4f1a\u6267\u884c\u4e00\u6b21\u3002\n   // \u5f53Permanent\u4e3afalse\u65f6\uff0c\u5373\u4f7fServiceQualityAction\u5df2\u7ecf\u6267\u884c\u8fc7\uff0c\u4e5f\u53ef\u4ee5\u518d\u6b21\u6267\u884cServiceQualityAction\u3002\n   Permanent            bool                   `json:"permanent"`\n    \n    // \u670d\u52a1\u8d28\u91cf\u5bf9\u5e94\u6267\u884c\u52a8\u4f5c\n    ServiceQualityAction []ServiceQualityAction `json:"serviceQualityAction,omitempty"`\n}\n\ntype ServiceQualityAction struct {\n    // \u7528\u6237\u8bbe\u5b9a\u5f53\u63a2\u6d4b\u7ed3\u679c\u4e3atrue/false\u65f6\u6267\u884c\u52a8\u4f5c\n    State          bool `json:"state"`\n\n    // \u52a8\u4f5c\u4e3a\u66f4\u6539GameServerSpec\u4e2d\u7684\u5b57\u6bb5\n    GameServerSpec `json:",inline"`\n}\n')),(0,i.kt)("h4",{id:"network"},"Network"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type Network struct {\n    // \u7f51\u7edc\u7c7b\u578b\n    NetworkType string              `json:"networkType,omitempty"`\n\n    // \u7f51\u7edc\u53c2\u6570\uff0c\u4e0d\u540c\u7f51\u7edc\u7c7b\u578b\u9700\u8981\u586b\u5199\u4e0d\u540c\u7684\u7f51\u7edc\u53c2\u6570\n    NetworkConf []NetworkConfParams `json:"networkConf,omitempty"`\n}\n\ntype NetworkConfParams KVParams\n\ntype KVParams struct {\n    // \u53c2\u6570\u540d\uff0c\u540d\u79f0\u7531\u7f51\u7edc\u63d2\u4ef6\u51b3\u5b9a\n    Name  string `json:"name,omitempty"`\n\n    // \u53c2\u6570\u503c\uff0c\u683c\u5f0f\u7531\u7f51\u7edc\u63d2\u4ef6\u51b3\u5b9a\n    Value string `json:"value,omitempty"`\n}\n')),(0,i.kt)("h2",{id:"gameserver"},"GameServer"),(0,i.kt)("h3",{id:"gameserverspec"},"GameServerSpec"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type GameServerSpec struct {\n   // \u6e38\u620f\u670d\u8fd0\u7ef4\u72b6\u6001\uff0c\u8868\u793a\u4e1a\u52a1\u76f8\u5173\u7684\u6e38\u620f\u670d\u72b6\u6001\uff0c\u76ee\u524d\u53ef\u6307\u5b9a\u7684\u72b6\u6001\u6709\uff1aNone / WaitToBeDeleted / Maintaining\u3002\u9ed8\u8ba4\u4e3aNone\n   OpsState         OpsState            `json:"opsState,omitempty"`\n\n   // \u66f4\u65b0\u4f18\u5148\u7ea7\uff0c\u4f18\u5148\u7ea7\u9ad8\u5219\u4f18\u5148\u88ab\u66f4\u65b0\n   UpdatePriority   *intstr.IntOrString `json:"updatePriority,omitempty"`\n\n   // \u5220\u9664\u4f18\u5148\u7ea7\uff0c\u4f18\u5148\u7ea7\u9ad8\u5219\u4f18\u5148\u88ab\u5220\u9664\n   DeletionPriority *intstr.IntOrString `json:"deletionPriority,omitempty"`\n\n   // \u662f\u5426\u8fdb\u884c\u7f51\u7edc\u9694\u79bb\u3001\u5207\u65ad\u63a5\u5165\u5c42\u7f51\u7edc\uff0c\u9ed8\u8ba4\u4e3afalse\n   NetworkDisabled  bool                `json:"networkDisabled,omitempty"`\n}\n')),(0,i.kt)("h3",{id:"gameserverstatus"},"GameServerStatus"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},'type GameServerStatus struct {\n    // \u671f\u671b\u6e38\u620f\u670d\u72b6\u6001\uff0cReady\n    DesiredState              GameServerState           `json:"desiredState,omitempty"`\n\n    // \u5f53\u524d\u6e38\u620f\u670d\u5b9e\u9645\u72b6\u6001\n    CurrentState              GameServerState           `json:"currentState,omitempty"`\n\n    // \u7f51\u7edc\u72b6\u6001\u4fe1\u606f\n    NetworkStatus             NetworkStatus             `json:"networkStatus,omitempty"`\n\n    // \u6e38\u620f\u670d\u5bf9\u5e94pod\u72b6\u6001\n    PodStatus                 corev1.PodStatus          `json:"podStatus,omitempty"`\n\n    // \u6e38\u620f\u670d\u670d\u52a1\u8d28\u91cf\u72b6\u51b5\n    ServiceQualitiesCondition []ServiceQualityCondition `json:"serviceQualitiesConditions,omitempty"`\n\n    // \u5f53\u524d\u66f4\u65b0\u4f18\u5148\u7ea7\n    UpdatePriority     *intstr.IntOrString `json:"updatePriority,omitempty"`\n\n    // \u5f53\u524d\u5220\u9664\u4f18\u5148\u7ea7\n    DeletionPriority   *intstr.IntOrString `json:"deletionPriority,omitempty"`\n\n    // \u4e0a\u6b21\u53d8\u66f4\u65f6\u95f4\n    LastTransitionTime metav1.Time         `json:"lastTransitionTime,omitempty"`\n}\n')))}d.isMDXComponent=!0}}]);