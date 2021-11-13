import { filter, find } from 'lodash'
import { Resource, ResourceType, StorageUnit } from './resource'
import { constants } from '../constants'
import { sortRecord } from '../utils/sortRecord'
import { writeJson } from '../utils/writeJson'

export class Subject {
  name: string
  ratio: number
  input: StorageUnit[]
  output: StorageUnit[]
  constructor({
    name,
    input,
    output,
    ratio = 1,
  }: {
    name: string
    input: StorageUnit[]
    output: StorageUnit[]
    ratio: number
  }) {
    this.ratio = ratio ?? 1
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

export const findDependencies = (
  src: Subject,
  targets: Subject[],
  skipNames: string[] = []
) => {
  const dependencies: Dependency[] = []
  // 防止依赖无限循环
  const targetsUnused = filter(targets, ({ name }) => !skipNames.includes(name))
  for (let index = 0; index < src.input.length; index++) {
    const srcInput = src.input[index]
    const deps: Dependency[] = []
    const matchedTargets = filter(targetsUnused, (target) => {
      const targetFounded = find(
        target.output,
        ({ resource }) => srcInput.resource.type === resource.type
      )
      if (targetFounded) {
        deps.push({
          resource: srcInput.resource,
          // needed: srcInput.value / targetFounded.value,
          needed: targetFounded.value, // 在下一步按着比率计算, 这里暂存一下找到的target的value
          subject: target,
          name: target.name,
        })
      }
      return targetFounded
    })
    // 当有多个subject满足时, 按着比率取用
    // 比如同为发电机, 如果需要能源供给分配比例为"木料燃烧器":"煤炭发电机" = 3 : 1
    // 则木料燃烧器的ratio设为3, 煤炭发电机的ratio设为1
    // 这样, 当需要1000j能源供给时, 750j 来自木料燃烧器, 250j来自煤炭发电机
    if (matchedTargets.length > 0) {
      const sumRatio = deps.reduce((sum, cur) => {
        return (sum += cur.subject.ratio)
      }, 0)
      deps.forEach((dep) => {
        const targetFoundedValue = dep.needed
        dep.needed =
          (srcInput.value * dep.subject.ratio) /
          (sumRatio || 1) /
          targetFoundedValue
      })
      dependencies.push(...deps)
    } else {
      // 必须所有input都满足(input之间是"and"关系), 否则依赖组就不成立
      dependencies.splice(0, Infinity)
      break
    }
  }
  return dependencies
}

const genSubjectObjects = (subjects: Subject[]) =>
  subjects.map((subject) => new Subject(subject))

interface DepTree<T = Dependency> {
  src: T
  deps: DepTree<T>[]
}

interface DependencyWithParent extends Dependency {
  parent: DependencyWithParent | null
}

const parentNames = (parent: DependencyWithParent | null): string[] => {
  if (parent) {
    return [parent.name, ...parentNames(parent.parent)]
  } else {
    return []
  }
}

const buildDeps = (
  parent: DependencyWithParent | null,
  dep: Dependency,
  subjectObjects: Subject[]
): DepTree<DependencyWithParent> => {
  const parentNamesAlreadyUsed = parentNames(parent)
  const deps = findDependencies(
    dep.subject,
    subjectObjects,
    parentNamesAlreadyUsed
  )
  const src = { ...dep, parent }
  return {
    src,
    deps: deps.map((dep) => {
      return buildDeps(src, dep, subjectObjects)
    }),
  }
}

const rmTreeProp = (tree: DepTree<Partial<DependencyWithParent>>) => {
  delete tree.src.subject
  delete tree.src.parent
  delete tree.src.needed
  tree.deps.forEach(rmTreeProp)
}

const multiplyAllNeeded = (dep: DependencyWithParent): number => {
  if (dep.parent) {
    return dep.needed * multiplyAllNeeded(dep.parent)
  }
  return 1
}

const buildDepsList = (
  list: Record<string, number>,
  tree: DepTree<DependencyWithParent>
) => {
  if (!list[tree.src.name]) {
    list[tree.src.name] = multiplyAllNeeded(tree.src)
  } else {
    list[tree.src.name] += multiplyAllNeeded(tree.src)
  }
  tree.deps.forEach((dep) => buildDepsList(list, dep))
}

const replicant: Subject = new Subject({
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
})
export const balancer = (subjects: Subject[]) => {
  const subjectObjects = genSubjectObjects(subjects)

  // 依赖树构建
  const dependencies = buildDeps(
    null,
    {
      name: replicant.name,
      subject: replicant,
      needed: 1,
      resource: { type: ResourceType.replicant },
    },
    subjectObjects
  )

  // 依赖项统计
  const depsList: Record<string, number> = {}
  buildDepsList(depsList, dependencies)
  writeJson('depsList.json', depsList)

  // 资源平衡统计
  const resourceList: Record<string, number> = {}
  Object.entries(depsList).forEach(([name, value]) => {
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
  writeJson('resourceList.json', sortRecord(resourceList))

  // 打印依赖树
  rmTreeProp(dependencies)
  writeJson('deps.json', dependencies)
}
