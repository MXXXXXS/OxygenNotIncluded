import { clone, cloneDeep, sortBy } from "lodash"

export const sortRecord = (record: Record<string,number>)=> {
  record = clone(record)
  Object.entries(record).forEach(([key, value]) => {
    if (value < 0.00000001 && value > -0.00000001) {
      record[key] = 0
    }
  })
  const sortedRecordEntries = sortBy(
    Object.entries(record),
    ([key]) => key
  )
  return sortedRecordEntries.reduce((printableRecord, [key, value]) => {
    printableRecord[key] = value
    return printableRecord
  }, {} as Record<string, number>)


}