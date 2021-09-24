import React from 'react'
import Translate, { translate } from '@docusaurus/Translate';

const features = [
  {
    title: <><Translate>Advanced Workloads</Translate></>,
    imgUrl: 'img/feature1.png',
    description: (
      <>
        <p>
          <Translate>
            OpenKruise contains a set of advanced workloads, such as CloneSet, Advanced StatefulSet, Advanced DaemonSet, BroadcastJob.
          </Translate>
          <Translate>
            They all support not only the basic features which are similar to the original Workloads in Kubernetes,
            but also more advanced abilities like in-place update, configurable scale/upgrade strategies, parallel operations.
          </Translate>
            <br />
          <Translate>
            In-place Update is a new methodology to update container images and even environments.
          </Translate>
          <Translate>
            It only restarts the specific container with the new image and the Pod will not be recreated, 
            which leads to much faster update process and much less side effects on other sub-systems such as scheduler, CNI or CSI.
          </Translate>
        </p>
      </>
    ),
  },
  {
    title: <><Translate>Bypass Application Management</Translate></>,
    imgUrl: 'img/feature2.png',
    description: (
      <>
        <p>
          <Translate>
            OpenKruise provides several bypass ways to manage sidecar container, multi-domain deployment for applications,
            which means you can manage these things without modifying the Workloads of applications.
          </Translate>
          <br />
          <Translate>
            For example, SidecarSet can help you inject sidecar containers into all matching Pods during creation and
            even update them in-place with no effect on other containers in Pod.
          </Translate>
          <Translate>
            WorkloadSpread constrains the spread of stateless workload, which empowers single workload the abilities for multi-domain and elastic deployment.
          </Translate>
        </p>
      </>
    ),
    reverse: true,
  },
  {
    title: <><Translate>High-avalibility Protection</Translate></>,
    imgUrl: 'img/feature3.png',
    description: (
      <>
        <p>
          <Translate>
            OpenKruise works hard on protecting high-avalibility for applications.
          </Translate>
          <Translate>
            Now it can prevent your Kubernetes resources from the cascading deletion mechanism,
            including CRD, Namespace and almost all kinds of Workloads.
          </Translate>
          <Translate>
            In voluntary disruption scenarios, PodUnavailableBudget can achieve the effect of preventing application disruption or SLA degradation,
            which is not only compatible with Kubernetes PDB protection for Eviction API, but also able to support the protection ability of above scenarios.
          </Translate>
        </p>
      </>
    ),
  },
]

export default features
