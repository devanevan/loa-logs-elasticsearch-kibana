require("dotenv").config();

import { EncounterInfo } from 'encounter.model';
import { Client } from '@elastic/elasticsearch';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite'

const client = new Client({
  node: process.env.ELASTICSEARCH_ENDPOINT,
  auth: {
    apiKey: process.env.ELASTICSEARCH_KEY
  }
})

const db = await open({ filename: `C:\\Users\\NAME\\AppData\\Local\\LOA Logs\\encounters.db`, driver: sqlite3.Database});

const encounterInfoArray: EncounterInfo[] = await db.all(
  `
  SELECT name, local_player, encounter_id, difficulty, fight_start, entity.dps, class, gear_score, damage_stats, version, cleared, current_boss, misc
  FROM entity 
  JOIN encounter ON entity.encounter_id = encounter.id
  `
);

encounterInfoArray.map(async encounterInfo => {
  encounterInfo.fight_start = new Date(encounterInfo.fight_start)
  // Do a SQL query to get the party members besides yourself
  // TODO: replace with party members from misc
  const distinctNames: string[] = await db.all(
    `
    SELECT DISTINCT name 
      FROM entity
      WHERE entity_type = 'PLAYER' 
        and encounter_id = ${encounterInfo.encounter_id}
        and name != '${encounterInfo.local_player}'
    `
  )
  encounterInfo.raid_members = distinctNames
  await client.index(
    {
      index: 'search-encounter-info',
      id: `${encounterInfo.name}:${encounterInfo.encounter_id.toString()}`,
      document: encounterInfo,
    }
  )
})

