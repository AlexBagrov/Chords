import { Link } from 'react-router'
import type { SongVersionGroup } from '../lib/songVersions'

type VersionBarProps = {
  group: SongVersionGroup
  currentId: string
}

export default function VersionBar({ group, currentId }: VersionBarProps) {
  return (
    <div className="version-bar" role="toolbar" aria-label="Версии песни">
      <div className="version-controls">
        {group.versions.map((version) => {
          const active = version.id === currentId
          if (active) {
            return (
              <span
                key={version.id}
                className="version-btn version-btn--active"
                aria-current="true"
              >
                {version.label}
              </span>
            )
          }
          return (
            <Link
              key={version.id}
              to={`/songs/${version.id}`}
              className="version-btn"
            >
              {version.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
