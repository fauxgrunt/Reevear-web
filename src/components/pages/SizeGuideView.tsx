import Link from "next/link";
import { Placeholder } from "@/components/pages/Placeholder";

const sizes = ["XS", "S", "M", "L", "XL"] as const;
const rows = ["Chest", "Waist", "Hips", "Inside leg"] as const;

export function SizeGuideView() {
  return (
    <article className="foundation-page size-page">
      <header className="foundation-intro">
        <h1>Size Guide</h1>
        <p>How to measure, and how to choose a size.</p>
      </header>

      <div className="editorial-prose">
        <p>
          Reevear pieces currently use letter sizes (XS–XL) on most garments and
          numeric waist sizes on jeans and some trousers. Fit notes on each
          product page are the source of truth for that piece.
        </p>
        <p>
          Body measurements for the size chart have not been published yet. The
          table below is the structure that will hold them.
        </p>
      </div>

      <section className="legal-block">
        <h2>How to measure</h2>
        <ul className="legal-list">
          <li>
            <strong>Chest.</strong> Measure around the fullest part of the chest,
            keeping the tape level under the arms.
          </li>
          <li>
            <strong>Waist.</strong> Measure around the natural waist, where the
            body bends.
          </li>
          <li>
            <strong>Hips.</strong> Measure around the fullest part of the hips.
          </li>
          <li>
            <strong>Inside leg.</strong> Measure from the crotch to the floor,
            or to where you want the hem to sit, without shoes.
          </li>
        </ul>
        <p>
          Measure over light clothing, or as you would for a similar garment.
          Keep the tape snug, not tight.
        </p>
      </section>

      <section className="legal-block">
        <h2>Body measurements</h2>
        <p>
          All figures below are placeholders until confirmed garment or body
          measurements are available.
        </p>
        <div className="size-table-wrap" tabIndex={0}>
          <table className="size-table">
            <caption className="sr-only">
              Reevear letter size chart. Measurement data has not been added yet.
            </caption>
            <thead>
              <tr>
                <th scope="col">Measurement</th>
                {sizes.map((size) => (
                  <th key={size} scope="col">
                    {size}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row}>
                  <th scope="row">{row}</th>
                  {sizes.map((size) => (
                    <td key={size}>
                      <Placeholder>[SIZE DATA TO BE ADDED]</Placeholder>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="legal-block">
        <h2>Fit notes</h2>
        <p>
          Some jeans and trousers use numbered waist sizes (for example 28–38)
          rather than XS–XL. Check the size options on the product page.
        </p>
        <p>
          Individual garment measurements are not published on this page yet.
        </p>
      </section>

      <section className="legal-block">
        <h2>How to choose a size</h2>
        <p>
          Start from a similar piece you already wear. If you are between sizes,
          use the size you wear most often in a comparable silhouette, then
          check the product page.
        </p>
        <p>
          If you need help, write to us from the{" "}
          <Link href="/pages/contact">Contact</Link> page.
        </p>
      </section>
    </article>
  );
}
