import Navigator from './app/Navigator'
import Chrome from './app/Chrome'
import FullscreenGate from './app/FullscreenGate'
import { useNav } from './app/nav'
import { usePointerDrift } from './hooks/usePointerDrift'
import Landing from './screens/Landing'
import Menu from './screens/Menu'
import Overview from './screens/Overview'
import Residences from './screens/Residences'
import Amenities from './screens/Amenities'
import Views from './screens/Views'
import Location from './screens/Location'
import Specifications from './screens/Specifications'
import Enquire from './screens/Enquire'

const SCREENS = {
  landing: Landing,
  menu: Menu,
  overview: Overview,
  residences: Residences,
  amenities: Amenities,
  views: Views,
  location: Location,
  specifications: Specifications,
  enquire: Enquire,
}

function Stage() {
  const { route } = useNav()
  const Screen = SCREENS[route]
  return (
    <main className="fixed inset-0 overflow-hidden">
      <Screen key={route} />
    </main>
  )
}

export default function App() {
  usePointerDrift()
  return (
    <Navigator>
      <Stage />
      <Chrome />
      <FullscreenGate />
      <div className="grain pointer-events-none fixed inset-0 z-95 opacity-[0.22] mix-blend-soft-light" aria-hidden="true" />
    </Navigator>
  )
}
