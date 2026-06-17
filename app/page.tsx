import type { Metadata } from 'next'
import HomePage from './home'

export const metadata: Metadata = {
  title: 'Dollars Colony Kundapura | Premium Coastal Villa Plots',
  description: 'Dollars Colony is a premium coastal villa plot community in Kundapura with clubhouse, lifestyle amenities and limited villa plots close to beaches, backwaters and NH66.',
}

export default function Page() {
  return <HomePage />
}
