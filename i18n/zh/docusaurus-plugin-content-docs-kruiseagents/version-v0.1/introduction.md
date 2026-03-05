# 介绍

## 概述

OpenKruise Agents 为在 Kubernetes 中管理 AI Agent 工作负载提供了最佳实践。它是 CNCF（云原生计算基金会）旗下开源工作负载项目
OpenKruise 的子项目，专为 AI Agent 领域量身定制。OpenKruise Agents 加速了 AI Agent 的部署，使其对 AI 算法科学家和基础设施工程师都能轻松上手。

OpenKruise Agents 旨在支持以下 AI Agent 工作负载：

1. 供 AI Agent 使用多样化工具的隔离环境
2. 可网络访问的持久化云环境，适用于研究笔记本和开发工作空间
3. 以 human-in-the-loop 与 open-world 等场景为代表的强化学习任务
4. 需要快速启动和强大容错能力的大数据训练任务

## 为什么选择 OpenKruise Agents

OpenKruise Agents 提供厂商中立的沙箱，具备以下核心特性：

1. 通过资源池化和动态调整实现快速且经济的资源供给
2. 支持涵盖内存、读写层数据及 GPU 内存的沙箱休眠与检查点能力
3. 用户身份与会话管理，配合高效的流量路由，最大程度降低对 Kubernetes Service 的依赖
4. 全面的 API 与 SDK 支持，包括 Kubernetes CRD API 和 E2B API

## 与 Sig Agent-Sandbox 的关系

OpenKruise Agents 提供高层次的沙箱管理 API，实现高效的资源供给、用户管理和流量路由。在底层，OpenKruise Agents 内置了沙箱 API
和实现，同时在 Sig Agent-Sandbox 可用时保持与其的兼容性。

## 使用方式

如需通过编程方式与 OpenKruise Agents 交互，可以使用 E2B SDK，它为创建和管理沙箱提供了高层次的接口。

- [运行 E2B 代码执行沙箱](best-practices/running-e2b-for-code-interpreter.md)
- [运行 E2B Desktop 沙箱](best-practices/running-e2b-for-desktop.md)

## 贡献

欢迎您参与 OpenKruise Agents
的开发贡献。我们准备了详细的指南 [CONTRIBUTING.md](https://github.com/openkruise/agents/blob/master/CONTRIBUTING.md)。

## 社区

活跃的交流渠道：

- Slack：[OpenKruise 频道](https://kubernetes.slack.com/channels/openkruise)（*英文*）
- 钉钉：搜索群号 `23330762`（*中文*）
- 微信：搜索用户 `openkruise`，由机器人邀请入群（*中文*）
- 双周社区会议（亚太区，*中文*）：
    - 每两周周四 19:30
      GMT+8（亚洲/上海），[日历](https://calendar.google.com/calendar/u/2?cid=MjdtbDZucXA2bjVpNTFyYTNpazV2dW8ybHNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ)
    - 加入会议（钉钉）：搜索群号 `23330762`（*中文*）
    - [会议纪要与议程](https://shimo.im/docs/gXqmeQOYBehZ4vqo)
- 双周社区会议（*英文*）：待定
    - [会议链接（Zoom）](https://us02web.zoom.us/j/87059136652?pwd=NlI4UThFWXVRZkxIU0dtR1NINncrQT09)
