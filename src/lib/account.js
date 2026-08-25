import { supabase } from '../supabase'
import { deleteCloud, clearLocal } from './progressStore'

// Fully delete the signed-in user's account and data:
//   1. delete their cloud progress row (RLS allows self-delete)
//   2. ask the `delete-user` Edge Function to remove the auth user (service-role)
//   3. wipe the local cache and sign out
// Degrades gracefully: if the Edge Function isn't deployed yet, the progress row
// is still deleted and the user is signed out (authDeleted:false).
export async function deleteAccount() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }

  await deleteCloud(user.id)

  let authDeleted = false
  try {
    const { error } = await supabase.functions.invoke('delete-user')
    if (!error) authDeleted = true
    else console.warn('[account] delete-user function error:', error.message)
  } catch (e) {
    console.warn('[account] delete-user invoke failed:', e?.message || e)
  }

  clearLocal()
  await supabase.auth.signOut()
  return { ok: true, authDeleted }
}
