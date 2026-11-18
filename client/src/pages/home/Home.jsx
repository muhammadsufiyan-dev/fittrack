import Bento from './Bento'
import CtaBanner from './CtaBanner'
import Faq from './Faq'
import Hero from './Hero'
import Marquee from './Marquee'
import Stats from './Stats'
import Steps from './Steps'

function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Bento />
      <Steps />
      <Faq />
      <CtaBanner />
    </>
  )
}

export default Home
