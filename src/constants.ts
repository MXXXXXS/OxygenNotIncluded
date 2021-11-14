// 统一单位
// 时间: 秒
// 质量: 克

import { Subject } from './components/balancer'
import { ResourceType } from './components/resource'

// 卡路里: 千卡
export const constants = {
  cycle: 600, //秒
}

export const replicant = {
  name: '复制人',
  ratio: 1,
  input: [
    {
      resource: { type: ResourceType.oxygen },
      value: 100 * constants.cycle,
    },
    {
      resource: {
        type: ResourceType.calorie,
      },
      value: 1000,
    },
  ],
  output: [
    {
      resource: {
        type: ResourceType.toilet,
      },
      value: 1,
    },
  ],
}
