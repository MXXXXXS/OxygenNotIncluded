import { find } from 'lodash'
import { replicant } from '../constants'
import { Subject } from './balancer'

export const resourceCalculator = (
  depsList: Record<string, number>,
  subjects: Subject[]
) => {
  const resourceList: Record<string, number> = {}
  Object.entries(depsList).forEach(([name, value]) => {
    const subject = find(
      [replicant as Subject, ...subjects],
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
  return resourceList
}
