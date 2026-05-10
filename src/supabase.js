import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qutqpomaccgkrfbpzlpj.supabase.co'
const supabaseKey = 'sb_publishable_0_SruO6voYxD02xEDm8KjQ_XsDCwI3B'

export const supabase = createClient(supabaseUrl, supabaseKey)