import Image from "next/image"

export default function About() {
  return (
    <section className="s" id="about" aria-labelledby="about-title">
      <div className="wrap about">
        <div className="rv">
          <div className="frame">
            <div className="ph">
              <Image src="/hassan.jpg" alt="Portrait of Hassan Mirza" width={900} height={1125} />
            </div>
            <div className="cap">that&apos;s me</div>
          </div>
        </div>
        <div className="rv d1">
          <div className="eyebrow">About</div>
          <h2 className="sr-only" id="about-title">
            About Hassan
          </h2>
          <p className="tx">
            I&apos;m Hassan, a mobile engineer in Karachi. I like owning a product <u>from the first screen to the store release</u>,
            and I keep the code clean so it&apos;s still easy to change a year later.
          </p>
          <div className="facts">
            <div>
              <b>Experience</b>3+ years, mobile and backend
            </div>
            <div>
              <b>Now</b>Ismail Industries Ltd, since 2023
            </div>
            <div>
              <b>Based</b>Karachi, working worldwide
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
