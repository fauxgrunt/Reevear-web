import { Placeholder } from "@/components/pages/Placeholder";
import { site } from "@/data/site";

export function AccountView() {
  return (
    <article className="foundation-page">
      <header className="foundation-intro">
        <h1>Account</h1>
        <p>Sign in and order history are not connected yet.</p>
      </header>

      <div className="editorial-prose">
        <p>
          There is no customer login, password storage, or order history on this
          website at the moment. The account control in the header is a
          placeholder for that work.
        </p>
        <p>
          Contact for account questions:{" "}
          <Placeholder>{site.contactEmail}</Placeholder>
        </p>
      </div>
    </article>
  );
}
