/**
 * Кастомные версии одной песни (кнопки на странице).
 * Подписи всегда задаются здесь вручную — не «простая/сложная» по умолчанию.
 * В списке показывается только `listId`; остальные id из группы скрыты.
 */
export type SongVersion = {
  id: string
  label: string
}

export type SongVersionGroup = {
  /** id песни в списке и URL по умолчанию */
  listId: string
  versions: SongVersion[]
}

export const songVersionGroups: SongVersionGroup[] = [
  {
    listId: 'vashe-blagorodie',
    versions: [
      { id: 'vashe-blagorodie', label: 'Сложная' },
      { id: 'vashe-blagorodie-simple', label: 'Простая' },
    ],
  },
]

const groupBySongId = new Map<string, SongVersionGroup>()
for (const group of songVersionGroups) {
  for (const version of group.versions) {
    groupBySongId.set(version.id, group)
  }
}

/** id версий, которые не должны появляться отдельной карточкой в списке */
export function isSecondarySongVersion(songId: string): boolean {
  const group = groupBySongId.get(songId)
  return Boolean(group && group.listId !== songId)
}

export function getVersionGroupForSong(
  songId: string,
): SongVersionGroup | undefined {
  return groupBySongId.get(songId)
}
