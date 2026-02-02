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
            OpenKruise contains a set of advanced workloads, such as CloneSet, Advanced StatefulSet, Advanced DaemonSet, BroadcastJob, SidecarSet and UnitedDeployment.
            They brings more advanced abilities like in-place update, configurable scale/upgrade strategies, parallel operations.
          </Translate>
            <br />
          <Translate>
            In-place Update is a new methodology to update container images and even environments.
            It only restarts the specific container with the new image and the Pod will not be recreated, 
            which leads to much faster update process and much less side effects on other sub-systems such as scheduler, CNI or CSI.
          </Translate>
        </p>
      </>
    ),
  },
  {
    title: <><Translate>Advanced Day-2 Operations</Translate></>,
    imgUrl: 'img/feature2.png',
    description: (
      <>
        <p>
          <Translate>
            OpenKruise also provides high-level operation features to help you manage your applications for better efficiency, better resilience and cost-saving.
          </Translate>
          <br />
          <Translate>
            These operations includes image prewarming, container inplace restarts, workload distribution, pod probe & marking and many more
          </Translate>
        </p>
      </>
    ),
    reverse: true,
  },
  {
    title: <><Translate>Battery Included Best Practices</Translate></>,
    imgUrl: 'img/feature3.png',
    description: (
      <>
        <p>
          <Translate>
            OpenKruise provides best practices for essential application domains. 
          </Translate>
          <br />
          <Translate>
            1. OpenKruise Rollouts brings non-invasive progressive delivery for microservices to *native workloads* and OpenKruise workloads 
          </Translate>
          <br />
          <Translate>
           2. OpenKruise Games brings cloud native game server management such hot-update, and connects game servers to cloud service providers, matchmaking services, and O&M platforms. 
          </Translate>
          <br />
          <Translate>
           3. OpenKruise Agents brings agent sandbox lifecycle management and provides advanced state persistent capabilities. 
          </Translate>
        </p>
      </>
    ),
  },
]

export default features
