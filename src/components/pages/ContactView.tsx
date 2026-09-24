import { ContactForm } from "@/components/pages/ContactForm";

export function ContactView() {
  return (
    <article className="foundation-page contact-page">
      <header className="foundation-intro">
        <h1>Contact</h1>
        <p>Questions about an order, a product, or anything else?</p>
        <p>We&apos;re here to help.</p>
      </header>

      <div className="contact-layout">
        <section className="contact-details">
          <h2>Get in touch</h2>
          <p>
            Email:
            <br />
            <a href="mailto:reeveartechadmin@gmail.com">
              reeveartechadmin@gmail.com
            </a>
          </p>
          <p>
            Telephone:
            <br />
            +44 7777 638916
          </p>
          <p>
            Postal address:
            <br />
            REEVEAR LIMITED
            <br />
            62 Washway Road
            <br />
            Sale
            <br />
            England
            <br />
            M33 7RE
          </p>

          <h2>Orders and support</h2>
          <p>
            If you&apos;re contacting us about an order, please include your
            name and order number or other order reference if you have one.
          </p>
          <p>
            For product questions, include the product name where possible so
            we can help you more quickly.
          </p>
          <p>
            We&apos;ll respond using the email address you provide.
          </p>
        </section>
        <section>
          <h2>Write to us</h2>
          <ContactForm />
        </section>
      </div>
    </article>
  );
}
