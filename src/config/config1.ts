import { Subject } from '../components/balancer'
import { ResourceType } from '../components/resource'
import { constants } from '../constants'

export const config1: Subject[] = [
  {
    name: '乔木树',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.dirtyWater,
        },
        value: 70 * 1000,
      },
      {
        resource: {
          type: ResourceType.soil,
        },
        value: 10 * 1000,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.wood,
        },
        value: (300 * 1000 * 5) / 4.5,
      },
    ],
  },
  {
    name: '木料燃烧器',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.wood,
        },
        value: 1.2 * 1000 * constants.cycle,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.power,
        },
        value: 300 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.carbonDioxide,
        },
        value: 170 * constants.cycle,
      },
    ],
  },
  {
    name: '碳素脱离器',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.water,
        },
        value: 1000 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.carbonDioxide,
        },
        value: 300 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.power
        },
        value: 120 * constants.cycle
      }
    ],
    output: [
      {
        resource: {
          type: ResourceType.dirtyWater,
        },
        value: 1000 * constants.cycle,
      },
    ],
  },
  {
    name: '氢气发电机',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.hydrogen,
        },
        value: 100 * constants.cycle,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.power,
        },
        value: 800 * constants.cycle,
      },
    ],
  },
  {
    name: '电解器',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.water,
        },
        value: 1000 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.power,
        },
        value: 120 * constants.cycle,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.oxygen,
        },
        value: 888 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.hydrogen,
        },
        value: 112 * constants.cycle,
      },
    ],
  },
  {
    name: '净水器',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.power,
        },
        value: 120 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.dirtyWater,
        },
        value: 5 * 1000 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.filteringMedium,
        },
        value: 1000 * constants.cycle,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.water,
        },
        value: 5 * 1000 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.dirtySoil,
        },
        value: 200 * constants.cycle,
      },
    ],
  },
  {
    name: '堆肥堆',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.dirtySoil,
        },
        value: 100 * constants.cycle,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.soil,
        },
        value: 100 * constants.cycle,
      },
    ],
  },
  {
    name: '抽水马桶',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.replicant
        },
        value: 1
      },
      {
        resource: {
          type: ResourceType.water,
        },
        value: 5000,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.toilet,
        },
        value: 1,
      },
      {
        resource: {
          type: ResourceType.dirtyWater,
        },
        value: 11.7 * 1000,
      },
    ],
  },
  {
    name: '毛刺花',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.water,
        },
        value: 20 * 1000,
      },
      {
        resource: {
          type: ResourceType.power,
        },
        value: 2 * constants.cycle,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.calorie,
        },
        value: 1600 / 6, // 6个周期成熟
      },
    ],
  },
  {
    name: '煤炭发电机',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.coal,
        },
        value: 1000 * constants.cycle,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.power,
        },
        value: 600 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.carbonDioxide,
        },
        value: 20 * constants.cycle,
      },
    ],
  },
  {
    name: '液泵',
    ratio: 1,
    input: [
      {
        resource: {
          type: ResourceType.power,
        },
        value: 240 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.water,
        },
        value: 10 * 1000 * constants.cycle,
      },
    ],
    output: [
      {
        resource: {
          type: ResourceType.water,
        },
        value: 10 * 1000 * constants.cycle,
      },
    ],
  },
]
