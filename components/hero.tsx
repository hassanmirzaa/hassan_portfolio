import PhoneFan from "@/components/phone-fan"
import Marquee from "@/components/marquee"

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="grid-bg" />
      <div className="hero-in">
        <div>
          <div className="eyebrow">Full stack mobile engineer</div>
          <h1 className="hero-title" id="hero-title">
            <span className="l">
              <span>I build the app,</span>
            </span>
            <span className="l">
              <span>the API, and the</span>
            </span>
            <span className="l">
              <span className="und">
                App Store
                <svg viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M4 12 C 60 2, 110 18, 180 9 S 320 4, 396 11" />
                </svg>
              </span>{" "}
              <span>release.</span>
            </span>
          </h1>
          <p className="sub">
            One engineer for the whole product. Flutter on the phone, Laravel or Node behind it, shipped to both stores.
          </p>
          <div className="cta">
            <a className="btn solid" href="#contact">
              Start a project <span className="ar">→</span>
            </a>
            <a className="btn line" href="#work">
              See the apps <span className="ar">↓</span>
            </a>
          </div>
        </div>
        <PhoneFan />
      </div>
      <Marquee />
    </section>
  )
}
