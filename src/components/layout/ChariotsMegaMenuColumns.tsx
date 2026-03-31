'use client'

import { useCallback, useEffect, useRef, useState, type FocusEvent } from 'react'
import {
  CHARIOTS_LOCATION_MENU_PREVIEW,
  MEGA_MENU_PANEL_DEFAULTS,
  NACELLE_LOCATION_MENU_PREVIEW,
  type MegaMenuPanelPayload,
} from '@/lib/megaMenuPanelDefaults'
import {
  ChariotsMegaMenuLeftColumn,
  type ChariotsLeftMenuKey,
} from './ChariotsMegaMenuLeftColumn'
import { ChariotsMegaMenuMiddleColumn } from './ChariotsMegaMenuMiddleColumn'
import { ChariotsMegaMenuOccasionRight } from './ChariotsMegaMenuOccasionRight'
import { ChariotsMegaMenuRightColumn } from './ChariotsMegaMenuRightColumn'
import { chariotsMenuByLeft, getDefaultMiddleId, getRightLines } from './chariotsMenuContent'
import styles from './ChariotsMegaMenuColumns.module.css'

const CHARIOTS_LOCATION_MIDDLE_ID = 'loc_find'
const NACELLE_LOCATION_MIDDLE_ID = 'nl_find'
const LOCATION_LOUEZ_LEAVE_MS = 220

function locationLouezMiddleId(activeLeft: ChariotsLeftMenuKey): string | null {
  if (activeLeft === 'chariots_location') return CHARIOTS_LOCATION_MIDDLE_ID
  if (activeLeft === 'nacelle_location') return NACELLE_LOCATION_MIDDLE_ID
  return null
}

export type ChariotsMegaMenuColumnsProps = {
  title?: string
  /** Close overlay after navigation (e.g. link click) */
  onNavigate?: () => void
}

/**
 * Méga-menu Produits — 3 colonnes (Jungheinrich-style) :
 * left categories → middle actions → right product lines.
 */
export function ChariotsMegaMenuColumns({ title = 'Produits', onNavigate }: ChariotsMegaMenuColumnsProps) {
  const [activeLeft, setActiveLeft] = useState<ChariotsLeftMenuKey>('transpalette')
  const [activeMiddle, setActiveMiddle] = useState(() => getDefaultMiddleId('transpalette'))
  const [occasionPanels, setOccasionPanels] = useState<{
    chariots_occasion: MegaMenuPanelPayload
    nacelle_occasion: MegaMenuPanelPayload
    transpalette_manuel: MegaMenuPanelPayload
  }>(() => ({ ...MEGA_MENU_PANEL_DEFAULTS }))

  const [showLocationLouezList, setShowLocationLouezList] = useState(false)
  const listLeaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const locationRightListRef = useRef<HTMLDivElement>(null)

  const clearListLeaveTimeout = useCallback(() => {
    if (listLeaveTimeoutRef.current) {
      clearTimeout(listLeaveTimeoutRef.current)
      listLeaveTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    setActiveMiddle(getDefaultMiddleId(activeLeft))
  }, [activeLeft])

  useEffect(() => {
    setShowLocationLouezList(false)
    clearListLeaveTimeout()
  }, [activeLeft, clearListLeaveTimeout])

  useEffect(() => () => clearListLeaveTimeout(), [clearListLeaveTimeout])

  const handleMiddleItemHover = useCallback(
    (id: string | null) => {
      const mid = locationLouezMiddleId(activeLeft)
      if (!mid) return
      if (id === mid) {
        clearListLeaveTimeout()
        setShowLocationLouezList(true)
        return
      }
      if (id === null) {
        clearListLeaveTimeout()
        listLeaveTimeoutRef.current = setTimeout(() => {
          setShowLocationLouezList(false)
          listLeaveTimeoutRef.current = null
        }, LOCATION_LOUEZ_LEAVE_MS)
      }
    },
    [activeLeft, clearListLeaveTimeout]
  )

  const handleMiddleItemBlur = useCallback(
    (e: FocusEvent<HTMLElement>) => {
      if (!locationLouezMiddleId(activeLeft)) return
      const next = e.relatedTarget as Node | null
      if (next && locationRightListRef.current?.contains(next)) return
      clearListLeaveTimeout()
      listLeaveTimeoutRef.current = setTimeout(() => {
        setShowLocationLouezList(false)
        listLeaveTimeoutRef.current = null
      }, LOCATION_LOUEZ_LEAVE_MS)
    },
    [activeLeft, clearListLeaveTimeout]
  )

  const handleRightLouezListMouseEnter = useCallback(() => {
    clearListLeaveTimeout()
    setShowLocationLouezList(true)
  }, [clearListLeaveTimeout])

  const handleRightLouezListMouseLeave = useCallback(() => {
    clearListLeaveTimeout()
    listLeaveTimeoutRef.current = setTimeout(() => {
      setShowLocationLouezList(false)
      listLeaveTimeoutRef.current = null
    }, LOCATION_LOUEZ_LEAVE_MS)
  }, [clearListLeaveTimeout])

  useEffect(() => {
    let cancelled = false
    fetch('/api/mega-menu/panels')
      .then((res) => res.json())
      .then((data: unknown) => {
        if (cancelled || !data || typeof data !== 'object') return
        const d = data as Record<string, MegaMenuPanelPayload>
        setOccasionPanels({
          chariots_occasion: { ...MEGA_MENU_PANEL_DEFAULTS.chariots_occasion, ...d.chariots_occasion },
          nacelle_occasion: { ...MEGA_MENU_PANEL_DEFAULTS.nacelle_occasion, ...d.nacelle_occasion },
          transpalette_manuel: { ...MEGA_MENU_PANEL_DEFAULTS.transpalette_manuel, ...d.transpalette_manuel },
        })
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
          onNavigate={onNavigate}
        />
      </div>
      <div className={styles.middle}>
        <ChariotsMegaMenuMiddleColumn
          items={middleItems}
          activeMiddle={activeMiddle}
          onActiveMiddleChange={setActiveMiddle}
          onNavigate={onNavigate}
          onMiddleItemHover={
            activeLeft === 'chariots_location' || activeLeft === 'nacelle_location'
              ? handleMiddleItemHover
              : undefined
          }
          onMiddleItemBlur={
            activeLeft === 'chariots_location' || activeLeft === 'nacelle_location'
              ? handleMiddleItemBlur
              : undefined
          }
        />
      </div>
      <div className={styles.right}>
        {activeLeft === 'transpalette' ? (
          <ChariotsMegaMenuOccasionRight
            {...occasionPanels.transpalette_manuel}
            onNavigate={onNavigate}
            regionAriaLabel="Transpalette manuel"
          />
        ) : activeLeft === 'chariots_occasion' ? (
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
        ) : activeLeft === 'chariots_location' ? (
          showLocationLouezList ? (
            <div
              ref={locationRightListRef}
              className="min-h-0 flex flex-col flex-1 w-full"
              onMouseEnter={handleRightLouezListMouseEnter}
              onMouseLeave={handleRightLouezListMouseLeave}
            >
              <ChariotsMegaMenuRightColumn lines={rightLines} onNavigate={onNavigate} />
            </div>
          ) : (
            <ChariotsMegaMenuOccasionRight
              {...CHARIOTS_LOCATION_MENU_PREVIEW}
              onNavigate={onNavigate}
              regionAriaLabel="Chariots de location"
            />
          )
        ) : activeLeft === 'nacelle_location' ? (
          showLocationLouezList ? (
            <div
              ref={locationRightListRef}
              className="min-h-0 flex flex-col flex-1 w-full"
              onMouseEnter={handleRightLouezListMouseEnter}
              onMouseLeave={handleRightLouezListMouseLeave}
            >
              <ChariotsMegaMenuRightColumn lines={rightLines} onNavigate={onNavigate} />
            </div>
          ) : (
            <ChariotsMegaMenuOccasionRight
              {...NACELLE_LOCATION_MENU_PREVIEW}
              onNavigate={onNavigate}
              regionAriaLabel="Nacelles de location"
            />
          )
        ) : (
          <ChariotsMegaMenuRightColumn lines={rightLines} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  )
}
