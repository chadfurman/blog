import Link from 'next/link'
import Image from 'next/image'
import ChadShocked from "../../public/shocked-chad.png"

function Hero() {
  const headline = <h2
    className="my-2 mx-auto sm:mx-0 w-fit tracking-[.1em] lg:mt-8 sm:text-2xl md:text-4xl lg:text-8xl">404?!</h2>
  const subhead = <h3
    className="w-fit mx-auto sm:mx-0 tracking-[.1em] my-1 text-highlight/[.9] sm:text-xl md:text-2xl lg:text-4xl">Oh no!
  </h3>
  const visual = <div className="py-20 mx-14 relative"><Image alt="Chad is shocked by the 404" src={ChadShocked} fill
                                                              className="object-contain"/></div>
  const cta = <p className="text-center sm:text-left leading-4 link-styles"><Link href="/">Return Home</Link></p>
  return (
    <div className="sm:h-[30rem] lg:h-[40rem] grid grid-cols-2  grid-flow-dense">
      <div className="my-auto col-start-2 sm:pl-16 md:pl-32 lg:pl-48">
        {headline}
        {subhead}
        {cta}
      </div>
      {visual}
    </div>
  );
}

export default function notFound() {
  return (
    <Hero></Hero>
  )
}