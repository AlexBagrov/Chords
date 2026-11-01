import { describe, expect, it } from 'vitest'
import {
  getVersionGroupForSong,
  isSecondarySongVersion,
} from './songVersions'

describe('songVersions', () => {
  it('hides secondary versions from the list', () => {
    expect(isSecondarySongVersion('vashe-blagorodie')).toBe(false)
    expect(isSecondarySongVersion('vashe-blagorodie-simple')).toBe(true)
  })

  it('returns the group for both version ids', () => {
    const group = getVersionGroupForSong('vashe-blagorodie-simple')
    expect(group?.listId).toBe('vashe-blagorodie')
    expect(group?.versions.map((v) => v.label)).toEqual([
      'Сложная',
      'Простая',
    ])
  })
})
