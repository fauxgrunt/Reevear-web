import Link from "next/link";

export function OurStoryView() {
  return (
    <article className="foundation-page editorial-page">
      <header className="foundation-intro">
        <h1>Our Story</h1>
        <p>Clothing made to be worn — through the week, and again.</p>
      </header>

      <div className="editorial-media" role="img" aria-label="Reevear campaign media" />

      <div className="editorial-prose">
        <p>
          Reevear is built around a simple idea: clothes should earn their
          place in your wardrobe.
        </p>
        <p>
          We make contemporary menswear for the way people actually live —
          pieces that move between everyday routines, weekends, evenings and
          everything in between. The aim is not to make more for the sake of
          more, but to build a wardrobe that keeps getting worn.
        </p>
      </div>

      <div className="editorial-grid">
        <section>
          <h2>Why Reevear exists</h2>
          <p>We wanted to build a menswear wardrobe that feels easy to return to.</p>
          <p>
            Not clothes reserved for one occasion. Not pieces that only work
            with one outfit. Reevear is about clothing that can move through
            the week with you — worn, washed, styled differently, and reached
            for again.
          </p>
          <p>
            That idea shapes the way we build our collections and the way we
            think about each piece.
          </p>
        </section>
        <section>
          <h2>A wardrobe, not a costume</h2>
          <p>
            We think about menswear as a wardrobe rather than a series of
            separate occasions.
          </p>
          <p>
            Everyday pieces form the foundation. Outerwear adds another layer.
            Denim and trousers give the wardrobe structure. Activewear brings
            movement into the same world.
          </p>
          <p>
            Each part has its purpose, but the pieces are designed to work
            alongside one another.
          </p>
        </section>
        <section>
          <h2>Made for repeat wear</h2>
          <p>The clothes we make are intended to become familiar.</p>
          <p>
            The T-shirt you reach for without thinking. The trousers that work
            with more than one outfit. The jacket that stays in rotation long
            after the first wear.
          </p>
          <p>
            We want Reevear pieces to become part of the rhythm of your week —
            not something you have to save for the right moment.
          </p>
        </section>
        <section>
          <h2>Made to move</h2>
          <p>Movement is part of everyday life.</p>
          <p>
            Our activewear is designed with that in mind — made for training,
            but equally at home outside the gym.
          </p>
          <p>
            We don&apos;t see performance and everyday style as separate
            wardrobes. They can exist together, depending on where the day
            takes you.
          </p>
          <p>
            <Link href="/collections/activewear" className="foundation-cta">
              Explore activewear
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
        </section>
      </div>

      <section className="editorial-close">
        <h2>What comes next</h2>
        <p>Reevear is still taking shape.</p>
        <p>
          The collection will evolve over time, but the idea behind it remains
          the same: make clothing that earns its place in the wardrobe and
          keeps getting worn.
        </p>
        <p>
          As the brand grows, we&apos;ll continue to build on that foundation
          — refining the clothes, expanding the collection, and learning from
          the way they&apos;re actually worn.
        </p>
      </section>
    </article>
  );
}
