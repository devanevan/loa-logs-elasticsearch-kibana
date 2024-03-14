export interface Misc {
  bossHpLog: { [key: string]: string[]}
}

export interface DamageStats {
  // Each number is the dps every 5*x where x is the index in the array, e.g. 1mil at index 5 is 1mil dps at 25 seconds into the fight
  dpsAverage: number[]
  deaths: number
  deathTime: number
}

export enum Difficulty {
  normal = 'Normal',
  hard = 'Hard',
  inferno = 'Inferno',
  extreme = 'Extreme'
}

export interface EncounterInfo {
  name: string
  local_player: string
  encounter_id: number
  difficulty: Difficulty
  dps: number
  fight_start: string | Date
  class: string
  gear_score: string
  version: number
  cleared: number
  current_boss: string
  misc: Misc
  damage_stats: DamageStats
  raid_members: string[]
}
