import { useEffect } from 'react'
import { useGame } from './store/game'
import { About, Credits, Settings } from './ui/screens/Aside'
import { Diary, Shelf } from './ui/screens/Diary'
import { Guide } from './ui/screens/Guide'
import { Play } from './ui/screens/Play'
import { Result } from './ui/screens/Result'
import { Title } from './ui/screens/Title'
import { TravelerSelect } from './ui/screens/TravelerSelect'

export default function App() {
  const screen = useGame((s) => s.screen)
  const settings = useGame((s) => s.settings)
  const game = useGame((s) => s.game)

  useEffect(() => {
    const html = document.documentElement
    html.dataset.text = settings.textSize
    html.dataset.motion = settings.reduceMotion ? 'reduce' : 'full'
  }, [settings])

  switch (screen) {
    case 'select':
      return <TravelerSelect />
    case 'guide':
      return game ? <Guide /> : <Title />
    case 'play':
      return game && game.phase !== 'ended' ? <Play /> : <Title />
    case 'result':
      return <Result />
    case 'diary':
      return <Diary />
    case 'shelf':
      return <Shelf />
    case 'settings':
      return <Settings />
    case 'about':
      return <About />
    case 'credits':
      return <Credits />
    default:
      return <Title />
  }
}
