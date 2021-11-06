import { filter, find, sortBy } from 'lodash'
import { writeFileSync } from 'fs'
import { Resource, ResourceType, StorageUnit } from './resourceBlock'

class Subject {
  name: string
  rate: number
  input: StorageUnit[]
  output: StorageUnit[]
  constructor({
    name,
    input,
    output,
    rate = 1,
  }: {
    name: string
    input: StorageUnit[]
    output: StorageUnit[]
    rate: number
  }) {
    this.rate = rate || 1
    this.name = name
    this.input = input
    this.output = output
  }
}

interface Dependency {
  resource: Resource
  needed: number
  subject: Subject
  name: string
}

export const findDependencies = (src: Subject, targets: Subject[]) => {
  const dependencies: Dependency[] = []
  src.input.forEach((srcInput) => {
    const deps: Dependency[] = []
    const matchedTargets = filter(targets, (target) => {
      const targetFount = find(
        target.output,
        ({ resource }) => srcInput.resource.type === resource.type
      )
      if (targetFount) {
        deps.push({
          resource: srcInput.resource,
          needed: srcInput.value / targetFount.value,
          subject: target,
          name: target.name,
        })
      }
      return targetFount
    })
    // 当有多个subject满足时, 平均取用
    if (matchedTargets.length > 0) {
      deps.forEach((dep) => {
        dep.needed = dep.needed / matchedTargets.length
      })
    }
    dependencies.push(...deps)
  })
  return dependencies
}

// 统一单位
// 时间: 秒
// 质量: 克
// 卡路里: 千卡
const constants = {
  cycle: 600, //秒
}

const replicant: Subject = new Subject({
  name: '复制人',
  rate: 1,
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
    {
      resource: {
        type: ResourceType.toilet,
      },
      value: 1,
    },
  ],
  output: [],
})

const subjects: Subject[] = [
  {
    name: '乔木树',
    rate: 1,
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
    rate: 1,
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
    name: '氢气发电机',
    rate: 1,
    input: [
      {
        resource: {
          type: ResourceType.hydrogenInWorldInput,
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
    rate: 1,
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
          type: ResourceType.hydrogenInWorldOutput,
        },
        value: 112 * constants.cycle,
      },
    ],
  },

  {
    name: '抽水马桶',
    rate: 1,
    input: [
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
          type: ResourceType.dirtyWaterInWorldOutput,
        },
        value: 11.7 * 1000,
      },
    ],
  },
  {
    name: '毛刺花',
    rate: 1,
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
    rate: 1,
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
    rate: 1,
    input: [
      {
        resource: {
          type: ResourceType.power,
        },
        value: 240 * constants.cycle,
      },
      {
        resource: {
          type: ResourceType.waterInWorldInput,
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

const genSubjectObjects = (subjects: Subject[]) =>
  subjects.map((subject) => new Subject(subject))

interface DepTree<T = Dependency> {
  src: T
  deps: DepTree<T>[]
}

const deepFindDependencies = (
  dep: Dependency,
  subjectObjects: Subject[]
): DepTree => {
  const deps = findDependencies(dep.subject, subjectObjects)
  return {
    src: dep,
    deps: deps.map((dep) => {
      return deepFindDependencies(dep, subjectObjects)
    }),
  }
}

const subjectObjects = genSubjectObjects(subjects)

const dependencies = deepFindDependencies(
  {
    name: replicant.name,
    subject: replicant,
    needed: 1,
    resource: { type: ResourceType.replicant },
  },
  subjectObjects
)

interface SimpleDependency extends Omit<Dependency, 'subject'> {
  subject?: Subject
}

const rmTreeProp = (tree: DepTree<SimpleDependency>) => {
  delete tree.src.subject
  tree.deps.forEach(rmTreeProp)
}

rmTreeProp(dependencies)

writeFileSync('deps.json', JSON.stringify(dependencies, null, 2), {
  encoding: 'utf-8',
})

interface SimpleDependencyWithParent extends SimpleDependency {
  parent: SimpleDependencyWithParent
}

const addParent = (tree: DepTree<SimpleDependencyWithParent>) => {
  tree.deps.forEach((dep) => {
    dep.src.parent = tree.src
    addParent(dep)
  })
}

addParent(dependencies as DepTree<SimpleDependencyWithParent>)

const multiplyAllNeeded = (dep: SimpleDependencyWithParent): number => {
  if (dep.parent) {
    return dep.needed * multiplyAllNeeded(dep.parent)
  }
  return 1
}

const list: Record<string, number> = {}

const listing = (tree: DepTree<SimpleDependencyWithParent>) => {
  if (!list[tree.src.name]) {
    list[tree.src.name] = multiplyAllNeeded(tree.src)
  } else {
    list[tree.src.name] += multiplyAllNeeded(tree.src)
  }
  tree.deps.forEach(listing)
}
listing(dependencies as DepTree<SimpleDependencyWithParent>)
writeFileSync('depsList.json', JSON.stringify(list, null, 2), {
  encoding: 'utf-8',
})

const resourceList: Record<string, number> = {}
// 资源平衡统计
Object.entries(list).forEach(([name, value]) => {
  const subject = find(
    [replicant, ...subjects],
    ({ name: subjectName }) => subjectName === name
  )
  if (subject) {
    subject.input.forEach(({ resource, value: inputValue }) => {
      if (!resourceList[resource.type]) {
        resourceList[resource.type] = -inputValue * value
      } else {
        resourceList[resource.type] -= inputValue * value
      }
    })
    subject.output.forEach(({ resource, value: outputValue }) => {
      if (!resourceList[resource.type]) {
        resourceList[resource.type] = outputValue * value
      } else {
        resourceList[resource.type] += outputValue * value
      }
    })
  }
})

Object.entries(resourceList).forEach(([key, value]) => {
  if (value < 0.00000001 && value > -0.00000001) {
    resourceList[key] = 0
  }
})

const printableResourceListArray = sortBy( Object.entries(resourceList), ([ key ]) =>key )
const printableResourceList: Record<string, number> = {}
printableResourceListArray.forEach(([key, value]) => {
  printableResourceList[key] =value
})

writeFileSync(
  'resourceList.json',
  JSON.stringify(printableResourceList, null, 2),
  {
    encoding: 'utf-8',
  }
)
