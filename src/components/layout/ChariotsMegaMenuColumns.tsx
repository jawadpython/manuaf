'use client'

import { useEffect, useState } from 'react'
import { MEGA_MENU_PANEL_DEFAULTS, type MegaMenuPanelPayload } from '@/lib/megaMenuPanelDefaults'
import {
  ChariotsMegaMenuLeftColumn,
  type ChariotsLeftMenuKey,
} from './ChariotsMegaMenuLeftColumn'
import { ChariotsMegaMenuMiddleColumn } from './ChariotsMegaMenuMiddleColumn'
import { ChariotsMegaMenuOccasionRight } from './ChariotsMegaMenuOccasionRight'
import { ChariotsMegaMenuRightColumn } from './ChariotsMegaMenuRightColumn'
import { chariotsMenuByLeft, getDefaultMiddleId, getRightLines } from './chariotsMenuContent'
import styles from './ChariotsMegaMenuColumns.module.css'

export type ChariotsMegaMenuColumnsProps = {
  title?: string
  /** Close overlay after navigation (e.g. link click) */
  onNavigate?: () => void
}

/**
 * 3-column Chariots mega menu (Jungheinrich-style):
 * left categories → middle actions → right product lines.
 */
export function ChariotsMegaMenuColumns({ title = 'Chariots', onNavigate }: ChariotsMegaMenuColumnsProps) {
  const [activeLeft, setActiveLeft] = useState<ChariotsLeftMenuKey>('transpalette')
  const [activeMiddle, setActiveMiddle] = useState(() => getDefaultMiddleId('transpalette'))
  const [occasionPanels, setOccasionPanels] = useState<{
    chariots_occasion: MegaMenuPanelPayload
    nacelle_occasion: MegaMenuPanelPayload
  }>(() => ({ ...MEGA_MENU_PANEL_DEFAULTS }))

  useEffect(() => {
    setActiveMiddle(getDefaultMiddleId(activeLeft))
  }, [activeLeft])

  useEffect(() => {
    let cancelled = false
    fetch('/api/mega-menu/panels')
      .then((res) => res.json())
      .then((data: unknown) => {
        if (cancelled || !data || typeof data !== 'object') return
        const d = data as Record<string, MegaMenuPanelPayload>
        if (d.chariots_occasion && d.nacelle_occasion) {
          setOccasionPanels({
            chariots_occasion: { ...MEGA_MENU_PANEL_DEFAULTS.chariots_occasion, ...d.chariots_occasion },
            nacelle_occasion: { ...MEGA_MENU_PANEL_DEFAULTS.nacelle_occasion, ...d.nacelle_occasion },
          })
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const middleItems = chariotsMenuByLeft[activeLeft].middle
  const rightLines = getRightLines(activeLeft, activeMiddle)

  return (
    <div className={styles.wrap}>
      <div className={styles.left}>
        <ChariotsMegaMenuLeftColumn
          title={title}
          activeItem={activeLeft}
          onActiveItemChange={setActiveLeft}
        />
      </div>
      <div className={styles.middle}>
        <ChariotsMegaMenuMiddleColumn
          items={middleItems}
          activeMiddle={activeMiddle}
          onActiveMiddleChange={setActiveMiddle}
          onNavigate={onNavigate}
        />
      </div>
      <div className={styles.right}>
        {activeLeft === 'chariots_occasion' ? (
          <ChariotsMegaMenuOccasionRight
            {...occasionPanels.chariots_occasion}
            onNavigate={onNavigate}
            regionAriaLabel="Chariots d'occasion"
          />
        ) : activeLeft === 'nacelle_occasion' ? (
          <ChariotsMegaMenuOccasionRight
            {...occasionPanels.nacelle_occasion}
            onNavigate={onNavigate}
            regionAriaLabel="Nacelle d'occasion"
          />
        ) : (
          <ChariotsMegaMenuRightColumn
            lines={rightLines}
            onNavigate={onNavigate}
            lineHrefMode={
              activeLeft === 'chariots_location'
                ? 'location_devis'
                : activeLeft === 'nacelle_location'
                  ? 'nacelle_location_devis'
                  : 'product'
            }
          />
        )}
      </div>
    </div>
  )
}
