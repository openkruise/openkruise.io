"use strict";(self.webpackChunkopenkruise_io=self.webpackChunkopenkruise_io||[]).push([[2421],{19173:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/elasticd-deployment-show-3-5d95b9304548b48ddb66d73d2d03a94c.gif"},27613:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"best-practices/elastic-deployment","title":"Extreme Elastic Schedule Solution Based on HPA and WorkloadSpread","description":"Since 0.10.0 version\uff0cOpenKruise have proposed a multi-domain CRD with by-pass architecture, namely, WorkloadSpread. WorkloadSpread allows a Workload to distribute its Pods to different node, zone, even different clusters and providers, as well as to apply differential configurations in different domains.This CRD can give Workloads the ability of multi-domain scatter, elastic schedule and fine management in a non-intrusive manner.","source":"@site/versioned_docs/version-v1.6/best-practices/elastic-deployment.md","sourceDirName":"best-practices","slug":"/best-practices/elastic-deployment","permalink":"/docs/v1.6/best-practices/elastic-deployment","draft":false,"unlisted":false,"editUrl":"https://github.com/openkruise/openkruise.io/edit/master/docs/best-practices/elastic-deployment.md","tags":[],"version":"v1.6","lastUpdatedBy":"Zhen Zhang","lastUpdatedAt":1742897309000,"frontMatter":{"title":"Extreme Elastic Schedule Solution Based on HPA and WorkloadSpread"},"sidebar":"docs","previous":{"title":"CloneSet lifecycle -- Insert Customized Logic Into Pod Lifecycle","permalink":"/docs/v1.6/best-practices/cloneset-lifecycle"},"next":{"title":"BroadcastJob + Advanced CronJob Help You Maintain Kubernetes Nodes","permalink":"/docs/v1.6/best-practices/acronjob+broadcastjob"}}');var i=s(74848),a=s(28453);const r={title:"Extreme Elastic Schedule Solution Based on HPA and WorkloadSpread"},o=void 0,l={},c=[{value:"Introduction",id:"introduction",level:2},{value:"Architecture",id:"architecture",level:3},{value:"Goals",id:"goals",level:3},{value:"Dependency Installation",id:"dependency-installation",level:2},{value:"Installing OpenKruise",id:"installing-openkruise",level:3},{value:"Installing KEDA",id:"installing-keda",level:3},{value:"Installing Ingress-Nginx-Controller",id:"installing-ingress-nginx-controller",level:3},{value:"Installing Nginx-Prometheus-Exporter",id:"installing-nginx-prometheus-exporter",level:3},{value:"Installing Prometheus-Operator",id:"installing-prometheus-operator",level:3},{value:"Correctness Check",id:"correctness-check",level:3},{value:"Checking whether Nginx Status API is usable",id:"checking-whether-nginx-status-api-is-usable",level:4},{value:"Checking Whether Prometheus is usable",id:"checking-whether-prometheus-is-usable",level:4},{value:"Deployment",id:"deployment",level:2},{value:"Deploying Application",id:"deploying-application",level:3},{value:"Deploying WorkloadSpread",id:"deploying-workloadspread",level:3},{value:"Deploying ScaleObject",id:"deploying-scaleobject",level:3},{value:"Demo Show",id:"demo-show",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"Since 0.10.0 version\uff0cOpenKruise have proposed a multi-domain CRD with by-pass architecture, namely, WorkloadSpread. WorkloadSpread allows a Workload to distribute its Pods to different node, zone, even different clusters and providers, as well as to apply differential configurations in different domains.This CRD can give Workloads the ability of multi-domain scatter, elastic schedule and fine management in a non-intrusive manner."}),"\n",(0,i.jsx)(n.p,{children:"In this page, we will take a simple web application as an example to help users build an automatic extreme elastic scheduling solution, combining with WorkloadSpread, KEDA, Prometheus and Alibaba Cloud Elastic Instances (ECI)."}),"\n",(0,i.jsx)(n.h2,{id:"introduction",children:"Introduction"}),"\n",(0,i.jsx)(n.h3,{id:"architecture",children:"Architecture"}),"\n",(0,i.jsxs)(n.p,{children:["The architecture of this solution is as follows:\n",(0,i.jsx)(n.img,{alt:"arch",src:s(31957).A+"",width:"696",height:"662"})]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Special Note:"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"In the solution, the HPA configuration is managed by KEDA. KEDA is an enhanced autoscaling component based on HPA. Compared with the native HPA, KEDA has much richer user-defined metrics."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"We take a trick that the metrics of Nginx instead of Web Pod are collected, because we want to reuse the open-source Nginx-Prometheus-Exporter to simplify this solution. It's easier to use this exporter to explore the number of https links and other metrics. Most importantly, the traffic entering the Web Pod must go through the Nginx Ingress. Therefore, we are going to directly use the metrics of Nginx, and combine KEDA to implement the automatic scale feature."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"At least version 1.21 is required by WorkloadSpread to manage Deployment, but ACK Kubernetes clusters currently supports up to version 1.20. Therefore, we have to take CloneSet as an example in this architecture."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"goals",children:"Goals"}),"\n",(0,i.jsx)(n.p,{children:"Our goal is to fully automate the following actions:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["When the traffic exceeded the threshold within a certain time window (the ",(0,i.jsx)(n.strong,{children:"traffic"})," here is defined as the smooth number of http connections per second, which can be defined according to actual needs), it will scale up replicas automatically;"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["When scaling up, the higher priority will be given to the fixed resource pool to schedule pod. When the fixed resource pool is insufficient or reached the ",(0,i.jsx)(n.code,{children:"MaxReplicas"})," limit, the Pods will be automatically scheduled to the elastic resource pool;"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"When the traffic is lower than the threshold, it will scale down replicas automatically;"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"When scaling down, the Pods in the elastic resource pool will be deleted first."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"dependency-installation",children:"Dependency Installation"}),"\n",(0,i.jsx)(n.p,{children:"We use a ACK Kubernetes Cluster with 3 ECS nodes and 1 Virtual-Kubelet (VK) node. ECS nodes correspond to the fixed resource pool, and VK node corresponds to the elastic resource pool."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ k get node\nNAME                         STATUS   ROLES    AGE    VERSION\nus-west-1.192.168.0.47       Ready    <none>   153d   v1.20.11-aliyun.1\nus-west-1.192.168.0.48       Ready    <none>   153d   v1.20.11-aliyun.1\nus-west-1.192.168.0.49       Ready    <none>   153d   v1.20.11-aliyun.1\nvirtual-kubelet-us-west-1a   Ready    agent    19d    v1.20.11-aliyun.1\n"})}),"\n",(0,i.jsx)(n.h3,{id:"installing-openkruise",children:"Installing OpenKruise"}),"\n",(0,i.jsxs)(n.p,{children:["More details can be found in ",(0,i.jsx)(n.a,{href:"https://openkruise.io/docs/installation",children:"official installation document"}),". We recommend installing the latest version OpenKruise."]}),"\n",(0,i.jsx)(n.h3,{id:"installing-keda",children:"Installing KEDA"}),"\n",(0,i.jsx)(n.p,{children:"KEDA is a Kubernetes-based event driven autoscaling component. It provides event driven scale for any container running in Kubernetes."}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ helm repo add kedacore https://kedacore.github.io/charts\n\n$ helm repo update\n\n$ kubectl create namespace keda\n\n$ helm install keda kedacore/keda --namespace keda\n"})}),"\n",(0,i.jsx)(n.h3,{id:"installing-ingress-nginx-controller",children:"Installing Ingress-Nginx-Controller"}),"\n",(0,i.jsx)(n.p,{children:"Firstly\uff0cCreating namespace:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ kubectl create ns ingress-nginx\n"})}),"\n",(0,i.jsx)(n.p,{children:"Because this exporter needs to access the Nginx status API to get the number of http connections information, it is necessary to apply a ConfigMap related to the Nginx configuration before the installation, so as to expose the Nginx status API for the consumption by Nginx-Prometheus-Exporter:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\ndata:\n  allow-snippet-annotations: "true"\n  http-snippet: |\n    server {\n      listen 8080;\n      server_name _ ;\n      location /stub_status {\n        stub_status on;\n      }\n\n      location / {\n        return 404;\n      }\n    }\nkind: ConfigMap\nmetadata:\n  annotations:\n    meta.helm.sh/release-name: ingress-nginx\n    meta.helm.sh/release-namespace: ingress-nginx\n  labels:\n    app.kubernetes.io/component: controller\n    app.kubernetes.io/instance: ingress-nginx\n    app.kubernetes.io/managed-by: Helm\n    app.kubernetes.io/name: ingress-nginx\n    app.kubernetes.io/version: 1.1.0\n    helm.sh/chart: ingress-nginx-4.0.13\n  name: ingress-nginx-controller\n  namespace: ingress-nginx\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Prepare a ",(0,i.jsx)(n.code,{children:"values Yaml"})," file to expose port 8080 when applying Ingress-Nginx controller deployment:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"# values.yaml\ncontroller:\n  containerPort:\n    http: 80\n    https: 443\n    status: 8080\n"})}),"\n",(0,i.jsx)(n.p,{children:"installing Ingress-Nginx controller:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ helm upgrade --install ingress-nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx --namespace ingress-nginx --values values.yaml\n"})}),"\n",(0,i.jsx)(n.p,{children:"80 and 443 ports provide services for external users via LoadBalancer type service, whereas the 8080 port is only used by internal exporter. Because the exporter and Prometheus can be deployed in the cluster, and they only provides services internally, therefore, the ClusterIP type service should be used to connect to the Nginx 8080 port, making it exposed only within the cluster:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"kind: Service\napiVersion: v1\nmetadata:\n  name: ingress-nginx-controller-8080\n  namespace: ingress-nginx\nspec:\n  selector:\n    app.kubernetes.io/component: controller\n    app.kubernetes.io/instance: ingress-nginx\n    app.kubernetes.io/name: ingress-nginx\n  type:  ClusterIP\n  ports:\n  - name: myapp\n    port:  8080\n    targetPort: status\n"})}),"\n",(0,i.jsx)(n.h3,{id:"installing-nginx-prometheus-exporter",children:"Installing Nginx-Prometheus-Exporter"}),"\n",(0,i.jsx)(n.p,{children:"The status data exposed by Nginx does not follow the standard of Prometheus, so an exporter component is required for the data collection and format conversion. Here, we use Nginx-Prometheus-Exporter, which is  provided by nginx community:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: ingress-nginx-exporter\n  namespace: ingress-nginx\n  labels:\n    app: ingress-nginx-exporter\nspec:\n  selector:\n    matchLabels:\n      app: ingress-nginx-exporter\n  strategy:\n    rollingUpdate:\n      maxSurge: 1\n      maxUnavailable: 1\n    type: RollingUpdate\n  template:\n    metadata:\n      labels:\n        app: ingress-nginx-exporter\n    spec:\n      containers:\n      - image: nginx/nginx-prometheus-exporter:0.10\n        imagePullPolicy: IfNotPresent\n        args:\n        - -nginx.scrape-uri=http://ingress-nginx-controller-8080.ingress-nginx.svc.cluster.local:8080/stub_status\n        name: main\n        ports:\n        - name: http\n          containerPort: 9113\n          protocol: TCP\n        resources:\n          limits:\n            cpu: "200m"\n            memory: "256Mi"\n'})}),"\n",(0,i.jsx)(n.h3,{id:"installing-prometheus-operator",children:"Installing Prometheus-Operator"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ helm repo add prometheus-community https://prometheus-community.github.io/helm-charts\n\n$ helm repo update\n\n$ helm install [RELEASE]  prometheus-community/kube-prometheus-stack --namespace prometheus --create-namespace\n"})}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.code,{children:"[RELEASE]"})," used by us in the above command is ",(0,i.jsx)(n.code,{children:"kube-prometheus-stack-1640678515"}),". This string determines some subsequent configurations. If it changed, the configurations of subsequent yaml files will also need to be changed."]}),"\n",(0,i.jsx)(n.p,{children:"After the installation of Prometheus, the following ServiceMonitor should be applied to monitor the status exposed by Ingress-Nginx:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: monitoring.coreos.com/v1\nkind: ServiceMonitor\nmetadata:\n  labels:\n    release: kube-prometheus-stack-1640678515\n  name: ingress-nginx-monitor\n  namespace: ingress-nginx\nspec:\n  selector:\n    matchLabels:\n      app: ingress-nginx-exporter\n  endpoints:\n  - interval: 5s\n    port: exporter\n"})}),"\n",(0,i.jsx)(n.h3,{id:"correctness-check",children:"Correctness Check"}),"\n",(0,i.jsx)(n.p,{children:"After the above dependency installation and configuration is completed, we need to check the correctness of them first."}),"\n",(0,i.jsx)(n.h4,{id:"checking-whether-nginx-status-api-is-usable",children:"Checking whether Nginx Status API is usable"}),"\n",(0,i.jsxs)(n.p,{children:["Firstly, we apply a simple pod with ",(0,i.jsx)(n.code,{children:"/bin/sh"})," and ",(0,i.jsx)(n.code,{children:"curl"})," tools."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: v1\nkind: Pod\nmetadata:\n  name: centos\n  namespace: ingress-nginx\nspec:\n  containers:\n  - name: main\n    image: centos:latest\n    command: ["/bin/sh", "-c", "sleep 100000000"]\n'})}),"\n",(0,i.jsxs)(n.p,{children:["Then, execute ",(0,i.jsx)(n.code,{children:"kubectl exec"})," command into this main container, and try to request the nginx status API by executing ",(0,i.jsx)(n.code,{children:"curl"}),":"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"$ k exec busybox -n ingress-nginx -it -- /bin/sh\n\nsh-4.4# curl -L http://ingress-nginx-controller-8080.ingress-nginx.svc.cluster.local:8080/stub_status\n\nActive connections: 6\nserver accepts handled requests\n 12092 12092 23215\nReading: 0 Writing: 1 Waiting: 5\n"})}),"\n",(0,i.jsx)(n.p,{children:"If similar content is output after the above curl command is executed, it indicates that this API is usable."}),"\n",(0,i.jsx)(n.h4,{id:"checking-whether-prometheus-is-usable",children:"Checking Whether Prometheus is usable"}),"\n",(0,i.jsx)(n.p,{children:"When we installed Prometheus operator using Helm, we also installed Grafana, a visual tool. Therefore, we can login to Grafana to check whether the metrics of Nginx we want have been collected."}),"\n",(0,i.jsxs)(n.p,{children:["Because Grafana is also deployed in the ACK cluster, ",(0,i.jsxs)(n.strong,{children:["if you want to use the local browser to access Grafana, you need to change the Grafana Service Type to ",(0,i.jsx)(n.code,{children:"LoadBalancer"})]}),", so that ACK will automatically assign an external IP to Grafana. With this external IP, you can access Grafana using your local browser. The default user and password of Grafana can be parsed from the corresponding Secret:"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"user: admin\npassword: prom-operator\n"})}),"\n",(0,i.jsxs)(n.p,{children:["After logging into Grafana, click ",(0,i.jsx)(n.code,{children:"Explore"})," in the navigation bar on the left, and you can see the list of Metrics collected and stored by Prometheus if you click the ",(0,i.jsx)(n.code,{children:"Metrics Browser"}),". If the Metrics we pay attention to exist, it means that the configuration is correct."]}),"\n",(0,i.jsx)(n.h2,{id:"deployment",children:"Deployment"}),"\n",(0,i.jsx)(n.p,{children:"After the above environment is ready and everything is confirmed to be usable, then you can deploy the hello-web applications and elastic components."}),"\n",(0,i.jsx)(n.h3,{id:"deploying-application",children:"Deploying Application"}),"\n",(0,i.jsx)(n.p,{children:"We\u2019re going to deploy the hello-web application. If you access this application, it will return a simple HTML page with similar contents as follows:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{children:"Hello Web\nCurrent Backend Server Info\nServer Name: hello-web-57b767f456-bnw24\nServer IP: 47.89.252.93\nServer Port: 80\nCurrent Client Request Info\nRequest Time Float: 1640766227.537\nClient IP: 10.64.0.65\nClient Port: 52230\nUser Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36\nRequest Method: GET\nThank you for using PHP.\nRequest URI: /\n"})}),"\n",(0,i.jsx)(n.p,{children:"Deploying Application using CloneSet:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:'apiVersion: apps.kruise.io/v1alpha1\nkind: CloneSet\nmetadata:\n  name: hello-web\n  namespace: ingress-nginx\n  labels:\n    app: hello-web\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: hello-web\n  template:\n    metadata:\n      labels:\n        app: hello-web\n    spec:\n      containers:\n      - name: hello-web\n        image: zhangsean/hello-web\n        ports:\n        - containerPort: 80\n        resources:\n          requests:\n            cpu: "1"\n            memory: "256Mi"\n          limits:\n            cpu: "2"\n            memory: "512Mi"\n---\nkind: Service\napiVersion: v1\nmetadata:\n  name: hello-web\n  namespace: ingress-nginx\nspec:\n  type: ClusterIP\n  selector:\n    app: hello-web\n  ports:\n  - protocol: TCP\n    port: 80\n    targetPort: 80\n---\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: ingress-web\n  namespace: ingress-nginx\nspec:\n  rules:\n  - http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: hello-web\n            port:\n              number: 80\n  ingressClassName: nginx\n'})}),"\n",(0,i.jsx)(n.h3,{id:"deploying-workloadspread",children:"Deploying WorkloadSpread"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: apps.kruise.io/v1alpha1\nkind: WorkloadSpread\nmetadata:\n  name: workloadspread-sample\n  namespace: ingress-nginx\nspec:\n  targetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: ingress-nginx-controller\n  scheduleStrategy:\n    type: Adaptive\n    adaptive:\n      rescheduleCriticalSeconds: 2\n  subsets:\n  - name: fixed-resource-pool\n    requiredNodeSelectorTerm:\n      matchExpressions:\n        - key: type\n          operator: NotIn\n          values:\n          - virtual-kubelet\n    patch:\n      metadata:\n        labels:\n          resource-pool: fixed\n  - name: elastic-resource-pool\n    requiredNodeSelectorTerm:\n      matchExpressions:\n        - key: type\n          operator: In\n          values:\n          - virtual-kubelet\n    tolerations:\n    - effect: NoSchedule\n      key: virtual-kubelet.io/provider\n      operator: Exists\n    patch:\n      metadata:\n        labels:\n          resource-pool: elastic\n"})}),"\n",(0,i.jsx)(n.p,{children:"The above WorkloadSpread configuration contains two subsets, which correspond fixed resource pool and elastic resource pool. We expect the CloneSet named hello-web to schedule its Pods to the fixed resource pool preferentially, and then to the elastic resource pool if the resource pool is unschedulable."}),"\n",(0,i.jsxs)(n.p,{children:["When APIServer receives a corresponding pod creation request, it will call kruise Webhook to inject the scheduling rules of the WorkloadSpread. The injection strategy is ",(0,i.jsx)(n.code,{children:"append"})," instead of ",(0,i.jsx)(n.code,{children:"replace"}),". For example, if Pod itself had  'requiredNodeSelectorterm' or 'Tolerations', WorkloadSpread will append its scheduling rules to the end of  'requiredNodeSelectorterm' or 'Tolerations' of the Pod."]}),"\n",(0,i.jsx)(n.p,{children:"Therefore, we suggest:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Write the  ",(0,i.jsx)(n.strong,{children:"common"})," and ",(0,i.jsx)(n.strong,{children:"immutable"})," scheduling rules to workload."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Write the ",(0,i.jsx)(n.strong,{children:"customized"})," scheduling rules to the WorkloadSpread subset."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"deploying-scaleobject",children:"Deploying ScaleObject"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-yaml",children:"apiVersion: keda.sh/v1alpha1\nkind: ScaledObject\nmetadata:\n  name: ingress-nginx-scaledobject\n  namespace: ingress-nginx\nspec:\n  maxReplicaCount: 10\n  minReplicaCount: 1\n  pollingInterval: 10\n  cooldownPeriod:  2\n  advanced:\n    horizontalPodAutoscalerConfig:\n      behavior:\n        scaleDown:\n          stabilizationWindowSeconds: 10\n  scaleTargetRef:\n    apiVersion: apps.kruise.io/v1alpha1\n    kind: CloneSet\n    name: hello-web\n  triggers:\n  - type: prometheus\n    metadata:\n      serverAddress: http://kube-prometheus-stack-1640-prometheus.prometheus:9090/\n      metricName: nginx_http_requests_total\n      query: sum(rate(nginx_http_requests_total{job=\"ingress-nginx-exporter\"}[12s]))\n      threshold: '100'\n"})}),"\n",(0,i.jsx)(n.h2,{id:"demo-show",children:"Demo Show"}),"\n",(0,i.jsx)(n.p,{children:"Firstly, make sure that all the configurations have been applied:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"result-show-0",src:s(41610).A+"",width:"720",height:"450"})}),"\n",(0,i.jsxs)(n.p,{children:["Then, use ",(0,i.jsx)(n.a,{href:"https://github.com/link1st/go-stress-testing",children:"go-stress-testing"})," to do pressure test for hello-web application."]}),"\n",(0,i.jsx)(n.p,{children:"When the first traffic peak comes\uff0cyou can see the Workload is scaling up, and the newly-created pods are scheduled to the fixed resource pool first:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"result-show-1",src:s(81203).A+"",width:"720",height:"450"})}),"\n",(0,i.jsx)(n.p,{children:"When the second traffic peak comes (higher), the fixed resource pool is insufficient due to the lack of resource,  the Workload is scaling up to the elastic resource pool:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"result-show-2",src:s(90508).A+"",width:"720",height:"450"})}),"\n",(0,i.jsx)(n.p,{children:"When the traffic peak gone, the Workload is scaling down, and the pods in the elastic resource pool are deleted firstly:"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.img,{alt:"result-show-3",src:s(19173).A+"",width:"720",height:"450"})})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},28453:(e,n,s)=>{s.d(n,{R:()=>r,x:()=>o});var t=s(96540);const i={},a=t.createContext(i);function r(e){const n=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),t.createElement(a.Provider,{value:n},e.children)}},31957:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/elasticd-deployment-arch-4226f0f7969bfd1761a6a291812abfd8.jpg"},41610:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/elasticd-deployment-show-0-db2511481b9915be5c021141de80952d.gif"},81203:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/elasticd-deployment-show-1-28efe334596ab3b8cd920652bfaaf443.gif"},90508:(e,n,s)=>{s.d(n,{A:()=>t});const t=s.p+"assets/images/elasticd-deployment-show-2-2422476e73ec3a34da0d9a24baa605cb.gif"}}]);