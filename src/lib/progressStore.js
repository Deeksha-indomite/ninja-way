import { supabase } from '../supabase'

// Single source of truth for how Ninja Way progress is persisted, both locally
// (offline cache) and in the cloud (Supabase `user_progress` table).
//
// The cloud stores one JSON blob per user. Locally we keep the app's existing
// `nw_`-prefixed keys so pre-existing players don't lose anything.

const LOCAL_KEYS = ['stats', 'history', 'vIdx', 'vHp', 'chakra', 'examlog']

export const PROGRESS_VERSION = 1

export const DEFAULT_STATS = {
  totalXp: 0, totalTasksDone: 0, perfectDays: 0, maxStreak: 0,
  currentStreak: 0, villainsDefeated: 0, examDone: 0, maxRank: 0, maxCombo: 0,
}

function loadS(k) {
  try { const v = localStorage.getItem('nw_' + k); return v ? JSON.parse(v) : null }
  catch { return null }
}
function saveS(k, v) {
  try { localStorage.setItem('nw_' + k, JSON.stringify(v)) } catch { /* quota / private mode */ }
}

// Assemble the full progress blob from localStorage.
export function readLocal() {
  return {
    v: PROGRESS_VERSION,
    stats: loadS('stats') || { ...DEFAULT_STATS },
    history: loadS('history') || {},
    vIdx: loadS('vIdx') ?? 0,
    vHp: loadS('vHp'),          // may be null → caller falls back to villain maxHp
    chakra: loadS('chakra') ?? 0,
    examlog: loadS('examlog') || [],
  }
}

// Write a progress blob back to the app's individual localStorage keys.
export function writeLocal(p) {
  if (!p) return
  if (p.stats !== undefined) saveS('stats', p.stats)
  if (p.history !== undefined) saveS('history', p.history)
  if (p.vIdx !== undefined) saveS('vIdx', p.vIdx)
  if (p.vHp !== undefined) saveS('vHp', p.vHp)
  if (p.chakra !== undefined) saveS('chakra', p.chakra)
  if (p.examlog !== undefined) saveS('examlog', p.examlog)
}

// Remove all local progress (used on account deletion).
export function clearLocal() {
  for (const k of LOCAL_KEYS) {
    try { localStorage.removeItem('nw_' + k) } catch { /* ignore */ }
  }
}

// A fresh account (or a wiped one) has no meaningful data. Used to decide
// "cloud wins" vs "seed cloud from this device" on sign-in.
export function isEmptyProgress(p) {
  if (!p) return true
  const s = p.stats || {}
  const noStats = !s.totalXp && !s.totalTasksDone && !s.examDone && !s.villainsDefeated
  const noHistory = !p.history || Object.keys(p.history).length === 0
  const noExam = !p.examlog || p.examlog.length === 0
  return noStats && noHistory && noExam
}

// Fetch the cloud progress row. Returns the progress object, or null if none
// (or on error — the app then keeps working from local).
export async function fetchCloud(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('progress, updated_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) { console.warn('[progress] fetch failed:', error.message); return null }
  return data?.progress ?? null
}

// Upsert the cloud progress row. Returns true on success.
export async function pushCloud(userId, progress) {
  const { error } = await supabase
    .from('user_progress')
    .upsert(
      { user_id: userId, progress, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
  if (error) { console.warn('[progress] push failed:', error.message); return false }
  return true
}

// Delete the caller's own progress row (RLS allows self-delete).
export async function deleteCloud(userId) {
  const { error } = await supabase.from('user_progress').delete().eq('user_id', userId)
  if (error) { console.warn('[progress] delete failed:', error.message); return false }
  return true
}
