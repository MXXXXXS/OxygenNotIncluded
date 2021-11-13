export enum ResourceType {
  replicant = '复制人',
  wood= '木料',
  toilet = '厕所',
  water = '水',
  waterInWorldInput = '世界中的水消耗',
  dirtyWater = '污染水',
  dirtyWaterInWorldOutput = '世界中的污染水产生',
  saltWater = '盐水',
  oxygen = '氧气',
  dirtyOxygen = '污染氧', 
  hydrogen = '氢气',
  hydrogenInWorldOutput = '世界中的氢气产生',
  hydrogenInWorldInput = '世界中的氢气消耗',
  carbonDioxide  = '二氧化碳',
  coal = '煤炭',
  soil = '泥土',
  alga = '藻类',
  mire = '菌泥',
  sand = '沙子',
  calorie = '卡路里',
  power = '焦耳',
}

export interface Resource {
  type: ResourceType
  unit?: string
}

export type StorageUnit = { resource: Resource; value: number }
