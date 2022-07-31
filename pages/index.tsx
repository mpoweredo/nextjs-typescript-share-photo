import type { NextPage } from 'next'
import DropArea from '../components/DropArea'

const Home: NextPage = () => {
  return (
    <div className='h-screen w-100 bg-[#121316] text-white text-lg flex items-center justify-center'>
        <DropArea />
    </div>
  )
}

export default Home
