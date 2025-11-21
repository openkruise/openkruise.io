# 介绍

## 什么是 Kruise Rollouts？

Kruise Rollouts 是一个 **Bypass(旁路)** 组件，提供 **高级渐进式交付功能**
。它的支持可以帮助您实现对应用程序的更平稳和受控的更改部署，支持金丝雀、蓝绿、多批次和A/B测试交付模式，同时它兼容 Gateway API 和各种Ingress 实现，使其更容易集成到您的现有基础设施中。总的来说，对于希望优化其部署流程的 Kubernetes 用户来说，Kruise Rollouts是一个有价值的工具！

<center><img src={require('/static/img/rollouts/intro.png').default} width="90%" /></center>

## 主要特点

- **丰富的发布策略**
    - 用于 Deployment、CloneSet、StatefulSet、DaemonSet、Advanced StatefulSet、Advanced DaemonSet 的多批次更新策略。
    - 用于 Deployment 的金丝雀(Canary)更新策略。
    - 用于 Deployment、CloneSet 的蓝绿(Blue-Green)更新策略。

- **丰富的流量路由管理策略**
    - 在更新工作负载时进行流量细粒度、加权流量转移。
    - 流量A/B测试，基于HTTP头和Cookie进行流量转移。
    - 端到端流量灰度

- **丰富的流量协议支持**
    - Ingress 控制器集成：NGINX、ALB、Higress。
    - 通过 GatewayAPI 进行服务网格集成。
    - 可插拔的Lua脚本，以便轻松扩展到其他 Kubernetes 流量协议（甚至CRD）。

## 演示展示

这是一个用于 Deployment 的多批次更新策略的演示。

[![asciicast](https://asciinema.org/a/Y2NKlhg2hfqsmzVYqiTypiULC.svg)](https://asciinema.org/a/Y2NKlhg2hfqsmzVYqiTypiULC)

## Kruise Rollouts 与其他组件对比

Kruise Rollouts 与 [Argo Rollout](https://argoproj.github.io/rollouts/) 和 [Flux Flagger](https://fluxcd.io/flagger/)
的对比。

| 组件      | **Kruise Rollouts**                                                     | Argo Rollouts                            | Flux Flagger                             |
|---------|-------------------------------------------------------------------------|------------------------------------------|------------------------------------------|
| 核心概念    | 增强现有的工作负载                                                               | 替换您的工作负载                                 | 管理您的工作负载                                 |
| 架构      | Bypass                                                                  | 新的工作负载类型                                 | Bypass                                   |
| 插拔和热切换  | 是                                                                       | 否                                        | 否                                        |
| 发布类型    | 多批次、金丝雀、A/B测试、全链路灰度、蓝绿                                                      | 多批次、金丝雀、蓝绿、A/B测试                         | 金丝雀、蓝绿、A/B测试                             |
| 工作负载类型  | Deployment、StatefulSet、CloneSet、Advanced StatefulSet、Advanced DaemonSet | Argo-Rollout                             | Deployment、DaemonSet                     | 
| 流量类型    | Ingress、GatewayAPI、CRD（需要 Lua 脚本）                                       | Ingress、GatewayAPI、APISIX、Traefik、SMI 等等 | Ingress、GatewayAPI、APISIX、Traefik、SMI 等等 |
| 迁移成本    | 无需迁移工作负载和Pods                                                           | 必须迁移工作负载和Pods                            | 必须迁移Pods                                 | 
| HPA 兼容性 | 是                                                                       | 是                                        | 否                                        |

## 接下来的步骤

以下是一些推荐的下一步操作：

- **[安装](./installation.md)** Kruise Rollout
