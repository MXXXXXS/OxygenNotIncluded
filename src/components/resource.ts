export enum ResourceType {
  replicant = '复制人',
  wood= '木料',
  toilet = '厕所需求',
  water = '水',
  dirtyWater = '污染水',
  saltWater = '盐水',
  oxygen = '氧气',
  dirtyOxygen = '污染氧', 
  hydrogen = '氢气',
  carbonDioxide  = '二氧化碳',
  coal = '煤炭',
  soil = '泥土',
  dirtySoil = '污染土',
  alga = '藻类',
  mire = '菌泥',
  filteringMedium = '过滤介质',
  calorie = '卡路里',
  power = '焦耳',
}

export interface Resource {
  type: ResourceType
  unit?: string
}

export type StorageUnit = { resource: Resource; value: number }
