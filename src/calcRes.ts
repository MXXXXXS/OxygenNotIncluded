import depsList from '../depsList.json'
import { resourceCalculator } from './components/resourceCalculator'
import { config1 } from './config/config1'
import { sortRecord } from './utils/sortRecord'
import { writeJson } from './utils/writeJson'

const resourceList = resourceCalculator(depsList, config1)
writeJson('resourceList.json', sortRecord(resourceList))
