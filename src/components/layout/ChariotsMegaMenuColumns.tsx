'use client'

import { Fragment, useCallback, useEffect, useRef, useState, type FocusEvent } from 'react'
import {
  CHARIOTS_LOCATION_MENU_PREVIEW,
  MEGA_MENU_PANEL_DEFAULTS,
  NACELLE_LOCATION_MENU_PREVIEW,
  type MegaMenuPanelKey,
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

function OccasionPanelSkeleton() {
  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4" aria-hidden>
      <div className="rounded-lg border border-[var(--border)] aspect-[16/10] bg-[var(--background-muted)] motion-safe:animate-pulse" />
      <div className="h-4 rounded bg-[var(--background-muted)] motion-safe:animate-pulse w-4/5 max-w-sm" />
      <div className="h-3 rounded bg-[var(--background-muted)] motion-safe:animate-pulse w-full max-w-md" />
      <div className="h-3 rounded bg-[var(--background-muted)] motion-safe:animate-pulse w-2/3 max-w-sm" />
    </div>
  )
}

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
  const [occasionPanels, setOccasionPanels] = useState<Record<
    MegaMenuPanelKey,
    MegaMenuPanelPayload
  > | null>(null)

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
    const applyDefaults = () => ({ ...MEGA_MENU_PANEL_DEFAULTS })

    fetch('/api/mega-menu/panels')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (cancelled) return
        if (!data || typeof data !== 'object') {
          setOccasionPanels(applyDefaults())
          return
        }
        const d = data as Record<MegaMenuPanelKey, MegaMenuPanelPayload>
        if (d.transpalette_manuel && d.chariots_occasion && d.nacelle_occasion) {
          setOccasionPanels({
            transpalette_manuel: d.transpalette_manuel,
            chariots_occasion: d.chariots_occasion,
            nacelle_occasion: d.nacelle_occasion,
          })
        } else {
          setOccasionPanels(applyDefaults())
        }
      })
      .catch(() => {
        if (!cancelled) setOccasionPanels(applyDefaults())
      })
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
        {activeLeft === 'transpalette' ||
        activeLeft === 'chariots_occasion' ||
        activeLeft === 'nacelle_occasion' ? (
          <Fragment>
            {/* Occasion previews: keep all three mounted; no stale image when switching row */}
            <div
              className={`flex flex-col flex-1 min-h-0 w-full ${activeLeft === 'transpalette' ? '' : 'hidden'}`}
              aria-hidden={activeLeft !== 'transpalette'}
            >
              {occasionPanels ? (
                <ChariotsMegaMenuOccasionRight
                  {...occasionPanels.transpalette_manuel}
                  onNavigate={onNavigate}
                  regionAriaLabel="Transpalette manuel"
                />
              ) : (
                <OccasionPanelSkeleton />
              )}
            </div>
            <div
              className={`flex flex-col flex-1 min-h-0 w-full ${activeLeft === 'chariots_occasion' ? '' : 'hidden'}`}
              aria-hidden={activeLeft !== 'chariots_occasion'}
            >
              {occasionPanels ? (
                <ChariotsMegaMenuOccasionRight
                  {...occasionPanels.chariots_occasion}
                  onNavigate={onNavigate}
                  regionAriaLabel="Chariots d'occasion"
                />
              ) : (
                <OccasionPanelSkeleton />
              )}
            </div>
            <div
              className={`flex flex-col flex-1 min-h-0 w-full ${activeLeft === 'nacelle_occasion' ? '' : 'hidden'}`}
              aria-hidden={activeLeft !== 'nacelle_occasion'}
            >
              {occasionPanels ? (
                <ChariotsMegaMenuOccasionRight
                  {...occasionPanels.nacelle_occasion}
                  onNavigate={onNavigate}
                  regionAriaLabel="Nacelle d'occasion"
                />
              ) : (
                <OccasionPanelSkeleton />
              )}
            </div>
          </Fragment>
        ) : activeLeft === 'chariots_location' ? (
          <div className="flex flex-col flex-1 min-h-0 w-full">
            <div
              className={`flex flex-col flex-1 min-h-0 ${showLocationLouezList ? 'hidden' : ''}`}
              aria-hidden={showLocationLouezList}
            >
              <ChariotsMegaMenuOccasionRight
                {...CHARIOTS_LOCATION_MENU_PREVIEW}
                onNavigate={onNavigate}
                regionAriaLabel="Chariots de location"
              />
            </div>
            <div
              ref={locationRightListRef}
              className={`min-h-0 flex flex-col flex-1 w-full ${showLocationLouezList ? '' : 'hidden'}`}
              onMouseEnter={handleRightLouezListMouseEnter}
              onMouseLeave={handleRightLouezListMouseLeave}
              aria-hidden={!showLocationLouezList}
            >
              <ChariotsMegaMenuRightColumn lines={rightLines} onNavigate={onNavigate} />
            </div>
          </div>
        ) : activeLeft === 'nacelle_location' ? (
          <div className="flex flex-col flex-1 min-h-0 w-full">
            <div
              className={`flex flex-col flex-1 min-h-0 ${showLocationLouezList ? 'hidden' : ''}`}
              aria-hidden={showLocationLouezList}
            >
              <ChariotsMegaMenuOccasionRight
                {...NACELLE_LOCATION_MENU_PREVIEW}
                onNavigate={onNavigate}
                regionAriaLabel="Nacelles de location"
              />
            </div>
            <div
              ref={locationRightListRef}
              className={`min-h-0 flex flex-col flex-1 w-full ${showLocationLouezList ? '' : 'hidden'}`}
              onMouseEnter={handleRightLouezListMouseEnter}
              onMouseLeave={handleRightLouezListMouseLeave}
              aria-hidden={!showLocationLouezList}
            >
              <ChariotsMegaMenuRightColumn lines={rightLines} onNavigate={onNavigate} />
            </div>
          </div>
        ) : (
          <ChariotsMegaMenuRightColumn lines={rightLines} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  )
}
