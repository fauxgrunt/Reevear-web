import type { ReactNode } from "react";
import Link from "next/link";
import { Placeholder } from "@/components/pages/Placeholder";
import { placeholders } from "@/data/site";

type LegalBlock = {
  title: string;
  body: ReactNode;
};

type LegalPage = {
  title: string;
  lede: ReactNode;
  blocks: LegalBlock[];
};

const shipping: LegalPage = {
  title: "Shipping & Delivery",
  lede: "What we can state now, and what still needs to be confirmed.",
  blocks: [
    {
      title: "Delivery areas",
      body: (
        <>
          <p>
            The website currently states complimentary UK shipping in the
            announcement bar. Whether that covers Northern Ireland, the Scottish
            Highlands, islands, or BFPO addresses has not been confirmed.
          </p>
          <p>
            International delivery:{" "}
            <Placeholder>{placeholders.internationalDelivery}</Placeholder>
          </p>
        </>
      ),
    },
    {
      title: "Delivery methods",
      body: (
        <p>
          Carrier and service: <Placeholder>{placeholders.deliveryMethod}</Placeholder>
        </p>
      ),
    },
    {
      title: "Delivery costs",
      body: (
        <>
          <p>
            UK shipping is currently presented as complimentary. Any exceptions,
            surcharges, or paid upgrades:{" "}
            <Placeholder>{placeholders.deliveryPrice}</Placeholder>
          </p>
          <p>
            This is not a statement that every order is free to every address.
          </p>
        </>
      ),
    },
    {
      title: "Estimated delivery times",
      body: (
        <>
          <p>
            Estimated UK delivery:{" "}
            <Placeholder>{placeholders.deliveryTime}</Placeholder>
          </p>
          <p>
            These figures, once published, will be estimates. They are not
            guaranteed delivery times unless a guaranteed service is offered and
            described as such.
          </p>
        </>
      ),
    },
    {
      title: "Order processing",
      body: (
        <p>
          <Placeholder>{placeholders.processing}</Placeholder> Checkout is not
          live on this site yet, so dispatch cut-off times have not been set.
        </p>
      ),
    },
    {
      title: "Tracking",
      body: <p><Placeholder>{placeholders.tracking}</Placeholder></p>,
    },
    {
      title: "Delays and failed delivery",
      body: (
        <>
          <p>
            If an estimated date is missed, contact us with your order details.
            Failed delivery process:{" "}
            <Placeholder>{placeholders.failedDelivery}</Placeholder>
          </p>
          <p>
            Statutory rights for late or missing goods are not replaced by
            anything on this page.
          </p>
        </>
      ),
    },
    {
      title: "International delivery and customs",
      body: (
        <p>
          <Placeholder>{placeholders.internationalDelivery}</Placeholder>{" "}
          <Placeholder>{placeholders.customs}</Placeholder>
        </p>
      ),
    },
  ],
};

const returns: LegalPage = {
  title: "Returns & Refunds",
  lede: (
    <>
      <p>Last updated: 22 September 2026</p>
      <p>
        Change of mind and faulty goods are different. Your statutory consumer
        rights are not affected by this policy.
      </p>
    </>
  ),
  blocks: [
    {
      title: "Your rights",
      body: (
        <>
          <p>
            When you buy goods from REEVEAR online, you have legal rights
            relating to both changing your mind and goods that are faulty,
            damaged or not as described.
          </p>
          <p>
            These rights are separate, and this policy does not reduce or
            replace your statutory consumer rights.
          </p>
        </>
      ),
    },
    {
      title: "Change-of-mind returns",
      body: (
        <>
          <p>
            For most goods bought online, you can cancel your order without
            giving a reason.
          </p>
          <p>
            You normally have 14 days from the day after the goods come into
            your physical possession to tell us that you want to cancel.
          </p>
          <p>
            Where an order is delivered in separate parts, the cancellation
            period normally runs from the day after the last part of the order
            is received.
          </p>
          <p>
            After telling us that you want to cancel, you normally have a
            further 14 days to return the goods.
          </p>
          <p>To cancel an order, contact us:</p>
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
            You may also use the cancellation form included in our{" "}
            <Link href="/pages/terms">Terms &amp; Conditions</Link>.
          </p>
        </>
      ),
    },
    {
      title: "Condition of returned goods",
      body: (
        <>
          <p>
            You may handle goods as reasonably necessary to establish their
            nature, characteristics and functioning, in much the same way as you
            would in a shop.
          </p>
          <p>
            If the value of the goods is reduced because they have been handled
            beyond what is reasonably necessary, a deduction from the refund may
            be permitted where applicable.
          </p>
          <p>
            Any statutory exceptions to the cancellation right will only apply
            where legally applicable to the specific goods.
          </p>
        </>
      ),
    },
    {
      title: "Return postage",
      body: (
        <>
          <p>
            The cost of returning an unwanted item will depend on the return
            policy stated for your order.
          </p>
          <p>
            Before you place an order, we will provide any information required
            about return costs.
          </p>
          <p>
            If a customer is required to pay the cost of returning unwanted
            goods, this will be made clear before the contract is entered into.
          </p>
        </>
      ),
    },
    {
      title: "Refunds",
      body: (
        <>
          <p>
            When you validly cancel an online order, the refund generally
            includes the price of the goods and the cost of the standard
            delivery option you selected.
          </p>
          <p>
            If you chose a more expensive delivery option, we only need to
            refund the cost of the standard delivery option.
          </p>
          <p>
            We will normally refund the payment using the original payment
            method.
          </p>
          <p>
            Where goods are being returned, a refund may be withheld until the
            goods have been received back or you have provided evidence that
            they have been returned, whichever happens first where permitted by
            law.
          </p>
          <p>
            Refunds will be made within the applicable statutory timeframe.
          </p>
        </>
      ),
    },
    {
      title: "Faulty, damaged or not-as-described goods",
      body: (
        <>
          <p>This is different from changing your mind.</p>
          <p>
            Under UK consumer law, goods must generally be of satisfactory
            quality, fit for purpose and as described.
          </p>
          <p>
            If goods do not meet those requirements, you may have legal
            remedies that are different from the statutory cancellation right.
          </p>
        </>
      ),
    },
    {
      title: "Within 30 days",
      body: (
        <>
          <p>
            If goods do not conform to the contract, you generally have a
            short-term right to reject them within the applicable 30-day
            period.
          </p>
          <p>
            Where that right applies, you may generally be entitled to a refund.
          </p>
          <p>
            If you believe an item is faulty or does not conform to the
            contract, contact us before returning it so we can provide the
            appropriate return instructions.
          </p>
        </>
      ),
    },
    {
      title: "After 30 days",
      body: (
        <>
          <p>
            After the short-term rejection period, you may generally have the
            right to request a repair or replacement.
          </p>
          <p>
            If a repair or replacement is not possible, fails, or cannot be
            provided within a reasonable time without significant inconvenience,
            you may have a right to a price reduction or final rejection and
            refund, depending on the circumstances.
          </p>
          <p>
            Your statutory rights continue to apply regardless of any voluntary
            REEVEAR returns policy.
          </p>
        </>
      ),
    },
    {
      title: "Returning faulty goods",
      body: (
        <>
          <p>
            If goods are faulty, damaged or do not conform to the contract,
            please contact us before returning them.
          </p>
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
            Where the law requires REEVEAR to bear reasonable return costs,
            those costs will not be passed on to the customer.
          </p>
        </>
      ),
    },
    {
      title: "Proof of purchase",
      body: (
        <p>
          We may ask you for reasonable evidence that the goods were purchased
          from REEVEAR, such as an order number, receipt or other proof of
          purchase.
        </p>
      ),
    },
    {
      title: "Your statutory rights",
      body: (
        <>
          <p>
            Nothing in this policy removes or limits your statutory consumer
            rights.
          </p>
          <p>
            In particular, nothing in this policy removes or limits rights
            relating to:
          </p>
          <ul className="legal-list">
            <li>cancellation of qualifying online orders</li>
            <li>faulty goods</li>
            <li>goods that are not as described</li>
            <li>goods that are not of satisfactory quality</li>
            <li>goods that are not fit for purpose</li>
          </ul>
          <p>
            These rights are provided by law and are separate from any
            additional returns policy REEVEAR may offer.
          </p>
        </>
      ),
    },
    {
      title: "Contact",
      body: (
        <>
          <p>REEVEAR LIMITED</p>
          <p>
            Company number:
            <br />
            16106815
          </p>
          <p>
            Registered office:
            <br />
            62 Washway Road
            <br />
            Sale
            <br />
            England
            <br />
            M33 7RE
          </p>
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
        </>
      ),
    },
    {
      title: "Related information",
      body: (
        <p>
          For more information about cancellation and your legal rights, see
          our <Link href="/pages/terms">Terms &amp; Conditions</Link>.
        </p>
      ),
    },
  ],
};

const privacy: LegalPage = {
  title: "Privacy",
  lede: (
    <>
      <p>Last updated: 22 September 2026</p>
      <p>How REEVEAR handles your personal information.</p>
    </>
  ),
  blocks: [
    {
      title: "Who we are",
      body: (
        <>
          <p>
            REEVEAR LIMITED is responsible for the personal information
            processed through this website.
          </p>
          <p>
            Company number:
            <br />
            16106815
          </p>
          <p>
            Registered office:
            <br />
            62 Washway Road
            <br />
            Sale
            <br />
            England
            <br />
            M33 7RE
          </p>
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
            For the purposes of UK data protection law, REEVEAR LIMITED is the
            controller of the personal information described in this notice.
          </p>
        </>
      ),
    },
    {
      title: "What information we collect",
      body: (
        <>
          <p>
            The information we collect depends on how you use the website.
          </p>
          <p>
            <strong>Contact enquiries</strong>
          </p>
          <p>When you contact us through the website, we may collect:</p>
          <ul className="legal-list">
            <li>Your name</li>
            <li>Your email address</li>
            <li>The contents of your message</li>
          </ul>
          <p>
            We use this information to respond to your enquiry and provide
            customer support.
          </p>
          <p>
            Our current lawful basis for this processing is legitimate
            interests, namely responding to enquiries and managing customer
            communications.
          </p>
          <p>
            <strong>Newsletter sign-up</strong>
          </p>
          <p>
            Where the website allows you to sign up for marketing updates, we
            ask you to actively choose to receive them.
          </p>
          <p>
            The current footer signup emails your address to REEVEAR so we can
            add you to updates. It does not currently store a marketing list,
            record consent in a subscriber database, or send an automated
            unsubscribe link. Signing up does not by itself create a permanent
            marketing subscription.
          </p>
          <p>
            Where a marketing subscription is operational and you have provided
            the required consent, we use your email address to send REEVEAR
            marketing communications. You can withdraw your marketing consent
            at any time.
          </p>
          <p>
            <strong>Shopping bag</strong>
          </p>
          <p>
            The current website keeps items added to your shopping bag in
            browser memory during your visit.
          </p>
          <p>
            The current implementation does not write the bag to cookies or
            local storage and does not send the bag contents to our server.
          </p>
          <p>
            Closing or refreshing the page may therefore remove the contents of
            your bag.
          </p>
          <p>
            <strong>Technical information</strong>
          </p>
          <p>
            Our hosting and website infrastructure may process technical
            information needed to operate, secure and maintain the website.
          </p>
          <p>
            Depending on the production environment, this may include
            information such as IP address, browser information, device
            information and technical request logs.
          </p>
        </>
      ),
    },
    {
      title: "How we use your information",
      body: (
        <>
          <p>We may use personal information to:</p>
          <ul className="legal-list">
            <li>Respond to enquiries</li>
            <li>Provide customer support</li>
            <li>Communicate with you when you ask us to</li>
            <li>
              Send marketing emails where you have provided the required
              consent
            </li>
            <li>Operate, secure and maintain the website</li>
            <li>Meet our legal and regulatory obligations</li>
          </ul>
          <p>
            We do not currently use personal information for automated
            decision-making or profiling on this website.
          </p>
        </>
      ),
    },
    {
      title: "Who we share information with",
      body: (
        <>
          <p>
            We may share personal information with service providers that help
            us operate the website.
          </p>
          <p>
            <strong>Resend</strong>
          </p>
          <p>
            We use Resend to deliver emails generated through the website,
            including contact enquiries.
          </p>
          <p>
            Information submitted through the relevant forms may therefore be
            processed by Resend on our behalf.
          </p>
          <p>
            Resend acts as a service provider/processor for this processing.
          </p>
          <p>We do not sell your personal information.</p>
          <p>
            The current website does not intentionally share personal
            information with advertising platforms or data brokers.
          </p>
        </>
      ),
    },
    {
      title: "International transfers",
      body: (
        <>
          <p>
            Some service providers we use may process personal information
            outside the UK.
          </p>
          <p>
            Resend’s processing may involve transfers of personal information
            outside the UK.
          </p>
          <p>
            Where personal information is transferred internationally, we will
            use the appropriate safeguards required by applicable UK data
            protection law.
          </p>
        </>
      ),
    },
    {
      title: "How long we keep information",
      body: (
        <>
          <p>
            We keep personal information only for as long as reasonably
            necessary for the purpose for which it was collected, including any
            period required to meet legal, accounting or regulatory
            obligations.
          </p>
          <p>
            Contact enquiries may be retained for as long as reasonably
            necessary to handle the enquiry and maintain appropriate business
            records.
          </p>
          <p>
            Where marketing subscriptions are operational, information relating
            to the subscription may be retained for as long as necessary to
            manage the subscription and record consent or withdrawal.
          </p>
          <p>
            Specific retention periods may vary depending on the type of
            information and the reason it is held.
          </p>
        </>
      ),
    },
    {
      title: "Your rights",
      body: (
        <>
          <p>
            Depending on the circumstances and the legal basis involved, you
            may have rights under UK data protection law including the right
            to:
          </p>
          <ul className="legal-list">
            <li>Ask for access to your personal information</li>
            <li>Ask us to correct inaccurate information</li>
            <li>Ask us to erase information</li>
            <li>Ask us to restrict processing</li>
            <li>Object to certain processing</li>
            <li>Withdraw consent where processing is based on consent</li>
            <li>Request data portability where the right applies</li>
          </ul>
          <p>
            Your rights depend on the circumstances and the legal basis for
            processing, so not every right will apply in every situation.
          </p>
          <p>
            To exercise your rights, contact:
            <br />
            <a href="mailto:reeveartechadmin@gmail.com">
              reeveartechadmin@gmail.com
            </a>
          </p>
          <p>
            You also have the right to complain to the Information
            Commissioner’s Office (ICO) if you believe your personal
            information has been handled unlawfully.
          </p>
          <p>
            <a href="https://ico.org.uk/" rel="noreferrer" target="_blank">
              https://ico.org.uk/
            </a>
          </p>
        </>
      ),
    },
    {
      title: "Marketing emails",
      body: (
        <>
          <p>
            Where REEVEAR asks you to subscribe to marketing emails, you must
            actively choose to receive them.
          </p>
          <p>
            We will not rely on silence or pre-ticked boxes as consent to
            marketing.
          </p>
          <p>
            You can withdraw your marketing consent at any time.
          </p>
          <p>
            Where marketing emails are sent, they will include an appropriate
            way to unsubscribe.
          </p>
        </>
      ),
    },
    {
      title: "Cookies and similar technologies",
      body: (
        <>
          <p>
            Our{" "}
            <Link href="/pages/cookies">
              Cookies & Similar Technologies
            </Link>{" "}
            page explains how the website uses cookies and other storage or
            access technologies.
          </p>
        </>
      ),
    },
    {
      title: "Changes to this notice",
      body: (
        <p>
          We may update this Privacy Notice when our website, services or
          data-processing arrangements change. When we make changes, we will
          publish the updated version on this page and update the date shown
          above.
        </p>
      ),
    },
    {
      title: "Contact",
      body: (
        <>
          <p>REEVEAR LIMITED</p>
          <p>
            Company number:
            <br />
            16106815
          </p>
          <p>
            62 Washway Road
            <br />
            Sale
            <br />
            England
            <br />
            M33 7RE
          </p>
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
        </>
      ),
    },
  ],
};

const cookies: LegalPage = {
  title: "Cookies & Similar Technologies",
  lede: (
    <>
      <p>Last updated: 22 September 2026</p>
      <p>
        REEVEAR uses cookies and similar technologies only where they are needed
        to operate the website or where applicable legal requirements are met.
      </p>
      <p>
        This page describes the storage and access technologies currently
        identified on the REEVEAR website.
      </p>
    </>
  ),
  blocks: [
    {
      title: "What we currently use",
      body: (
        <>
          <p>
            <strong>Essential website functionality</strong>
          </p>
          <p>
            The current REEVEAR frontend keeps the shopping bag in browser
            memory while the page is open. The current implementation does not
            write the bag to cookies or local storage.
          </p>
          <p>
            Other cookies or similar technologies may be used by our website
            infrastructure where they are strictly necessary for the website to
            operate, remain secure or provide a service you have requested.
          </p>
          <p>
            Any strictly necessary cookies or similar technologies used by our
            website infrastructure will be identified and described here before
            launch.
          </p>
        </>
      ),
    },
    {
      title: "What we currently do not use",
      body: (
        <>
          <p>The current REEVEAR foundation does not intentionally use:</p>
          <ul className="legal-list">
            <li>Analytics cookies</li>
            <li>Advertising cookies</li>
            <li>Tracking pixels</li>
            <li>Cross-site advertising technologies</li>
            <li>Optional preference cookies</li>
          </ul>
          <p>
            We therefore do not currently operate an optional analytics or
            advertising consent banner.
          </p>
        </>
      ),
    },
    {
      title: "Your choices",
      body: (
        <>
          <p>
            You can control or delete cookies and other browser storage through
            your browser settings.
          </p>
          <p>
            Because the current shopping bag is held in browser memory, closing
            or refreshing your browser may affect the contents of your bag.
          </p>
          <p>
            If REEVEAR introduces optional cookies or similar technologies in
            the future, this page will be updated and any consent or objection
            mechanism required by applicable law will be provided.
          </p>
        </>
      ),
    },
    {
      title: "About the legal position",
      body: (
        <>
          <p>
            UK rules under the Privacy and Electronic Communications Regulations
            (PECR) generally require information and consent before storing or
            accessing information on a user&apos;s device, unless an applicable
            exception applies.
          </p>
          <p>
            Strictly necessary technologies can fall within an exception where
            they are essential to provide a service requested by the user.
          </p>
          <p>
            Certain technologies used for statistical purposes may also fall
            within a specific legal exception where the applicable conditions
            are met, including clear information and a simple and free way for
            users to object.
          </p>
          <p>
            These exceptions do not generally cover individual tracking,
            advertising or profiling.
          </p>
          <p>
            This page is a description of the current website. It is not legal
            advice. See our{" "}
            <Link href="/pages/privacy">Privacy Policy</Link> for how we
            collect and use personal information.
          </p>
        </>
      ),
    },
    {
      title: "Future changes",
      body: (
        <>
          <p>
            If we introduce new cookies or similar storage and access
            technologies, we will update this page to explain what they do and
            why they are used.
          </p>
          <p>
            Where applicable, we will also provide the required consent or
            objection controls.
          </p>
        </>
      ),
    },
  ],
};

const terms: LegalPage = {
  title: "Terms & Conditions",
  lede: (
    <>
      <p>Last updated: 22 September 2026</p>
      <p>
        These Terms &amp; Conditions apply to purchases made through the REEVEAR
        website.
      </p>
      <p>
        Please read these Terms before placing an order. They explain how
        orders, payment, delivery, cancellations, returns and refunds work.
      </p>
      <p>
        Nothing in these Terms affects your legal rights as a consumer.
      </p>
    </>
  ),
  blocks: [
    {
      title: "Who we are",
      body: (
        <>
          <p>
            REEVEAR is operated by REEVEAR LIMITED, a private limited company
            registered in England.
          </p>
          <p>Company number: 16106815</p>
          <p>
            Registered office:
            <br />
            62 Washway Road
            <br />
            Sale
            <br />
            England
            <br />
            M33 7RE
          </p>
          <p>
            Telephone:
            <br />
            +44 7777 638916
          </p>
          <p>
            Email:
            <br />
            <a href="mailto:reeveartechadmin@gmail.com">
              reeveartechadmin@gmail.com
            </a>
          </p>
          <p>
            In these Terms, “REEVEAR”, “we”, “us” and “our” mean REEVEAR
            LIMITED. “You” and “your” mean the customer purchasing from us.
          </p>
        </>
      ),
    },
    {
      title: "About these Terms",
      body: (
        <>
          <p>
            These Terms apply when you purchase products from us through our
            website.
          </p>
          <p>Please read them before placing an order.</p>
          <p>
            Nothing in these Terms limits or excludes any legal rights you have
            as a consumer.
          </p>
        </>
      ),
    },
    {
      title: "Our products",
      body: (
        <>
          <p>
            We take reasonable care to ensure that product descriptions,
            photographs, colours, sizes and other product information shown on
            the website are accurate.
          </p>
          <p>
            Colours may appear slightly different depending on your screen or
            device.
          </p>
          <p>Product availability is shown on the website where possible.</p>
          <p>
            Nothing in these Terms affects your statutory rights if goods are
            faulty, not as described or otherwise fail to meet the requirements
            of applicable consumer law.
          </p>
        </>
      ),
    },
    {
      title: "Prices",
      body: (
        <>
          <p>
            Product prices are shown on the website at the time you place your
            order.
          </p>
          <p>
            All prices and any applicable delivery charges will be shown before
            you complete your purchase.
          </p>
        </>
      ),
    },
    {
      title: "Orders",
      body: (
        <>
          <p>
            When you place an order, you are making an offer to purchase the
            products in your basket.
          </p>
          <p>We will send an acknowledgement when we receive your order.</p>
          <p>
            If we cannot accept your order, for example because a product is
            unavailable or there is an error in the product or pricing
            information, we will contact you and refund any payment we have
            taken where applicable.
          </p>
        </>
      ),
    },
    {
      title: "Payment",
      body: (
        <>
          <p>
            Payment methods available to you will be shown during checkout.
          </p>
          <p>
            Payment must be successfully authorised before an order can be
            processed.
          </p>
        </>
      ),
    },
    {
      title: "Delivery",
      body: (
        <>
          <p>
            Available delivery options, charges and estimated delivery times
            will be shown before you complete your order.
          </p>
          <p>
            We will deliver orders within the timeframe agreed with you. Where
            no specific delivery period has been agreed, applicable UK consumer
            law will apply.
          </p>
          <p>
            If there is an unexpected delay affecting your order, we will
            contact you using the contact details provided with your order.
          </p>
        </>
      ),
    },
    {
      title: "Your right to cancel",
      body: (
        <>
          <p>
            If you buy goods from us online, you generally have a legal right
            to cancel your order without giving a reason.
          </p>
          <p>
            For most goods, the cancellation period normally ends 14 days after
            the day on which you receive the goods.
          </p>
          <p>
            After telling us that you wish to cancel, you normally have a
            further 14 days to return the goods.
          </p>
          <p>To cancel, contact us using:</p>
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
          <p>
            You may also use the cancellation form provided at the end of these
            Terms.
          </p>
        </>
      ),
    },
    {
      title: "Returning goods after cancellation",
      body: (
        <>
          <p>
            If you cancel an order under the statutory cancellation right, you
            must return the goods without undue delay and normally no later
            than 14 days after telling us that you wish to cancel.
          </p>
          <p>
            You are responsible for taking reasonable care of the goods while
            they are in your possession.
          </p>
          <p>
            You may handle the goods as reasonably necessary to establish their
            nature, characteristics and functioning. You may be responsible for
            diminished value resulting from handling beyond what is necessary
            for that purpose.
          </p>
        </>
      ),
    },
    {
      title: "Refunds",
      body: (
        <>
          <p>
            Where you validly cancel under the applicable statutory
            cancellation rules, we will provide the refunds required by law.
          </p>
          <p>
            Where applicable, this includes the cost of the standard delivery
            option you selected.
          </p>
          <p>
            We will normally issue refunds using the original payment method
            unless another method has been agreed.
          </p>
          <p>
            We may delay a refund until we have received the returned goods or
            you have provided evidence that the goods have been returned, where
            permitted by law.
          </p>
        </>
      ),
    },
    {
      title: "Faulty, damaged or not-as-described goods",
      body: (
        <>
          <p>
            Your statutory rights are not affected by these Terms.
          </p>
          <p>
            If goods are faulty, damaged, not as described or otherwise do not
            meet the requirements of applicable consumer law, please contact
            us:
          </p>
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
            Depending on the circumstances, you may have legal rights including
            repair, replacement, price reduction or refund.
          </p>
        </>
      ),
    },
    {
      title: "Product availability",
      body: (
        <>
          <p>We aim to keep product availability information accurate.</p>
          <p>
            If a product becomes unavailable after you place an order and we
            cannot fulfil the order, we will contact you and provide any refund
            required.
          </p>
        </>
      ),
    },
    {
      title: "Website content",
      body: (
        <>
          <p>
            The REEVEAR name, branding, photography, graphics, text and other
            website content are protected by applicable intellectual property
            rights.
          </p>
          <p>
            You may not reproduce, copy, modify or commercially exploit our
            website content without permission, except where permitted by law.
          </p>
        </>
      ),
    },
    {
      title: "Liability",
      body: (
        <>
          <p>
            Nothing in these Terms limits or excludes liability where doing so
            would be unlawful.
          </p>
          <p>
            Nothing in these Terms removes or limits your statutory consumer
            rights.
          </p>
        </>
      ),
    },
    {
      title: "Privacy",
      body: (
        <p>
          Our{" "}
          <Link href="/pages/privacy">Privacy Policy</Link> explains how we
          collect and use personal information when you use the website or
          purchase from us.
        </p>
      ),
    },
    {
      title: "Changes to these Terms",
      body: (
        <>
          <p>We may update these Terms from time to time.</p>
          <p>
            The Terms that apply to an order will be the Terms available when
            you place the order, unless a change is required by law or
            otherwise agreed with you.
          </p>
        </>
      ),
    },
    {
      title: "Governing law",
      body: (
        <p>
          These Terms are subject to applicable UK consumer protection law.
        </p>
      ),
    },
    {
      title: "Contact",
      body: (
        <>
          <p>
            REEVEAR LIMITED
            <br />
            Company number 16106815
          </p>
          <p>
            62 Washway Road
            <br />
            Sale
            <br />
            England
            <br />
            M33 7RE
          </p>
          <p>
            Telephone:
            <br />
            +44 7777 638916
          </p>
          <p>
            Email:
            <br />
            <a href="mailto:reeveartechadmin@gmail.com">
              reeveartechadmin@gmail.com
            </a>
          </p>
        </>
      ),
    },
    {
      title: "Cancellation Form",
      body: (
        <>
          <p>
            You may use this form to tell us that you wish to cancel your
            order. You do not have to use this exact wording; a clear statement
            that you wish to cancel is sufficient.
          </p>
          <p>
            To:
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
          <p>
            Email:
            <br />
            <a href="mailto:reeveartechadmin@gmail.com">
              reeveartechadmin@gmail.com
            </a>
          </p>
          <p>
            I/We hereby give notice that I/We cancel my/our contract of sale
            for the following goods:
          </p>
          <p>
            Order number:
            <br />
            ____________________
          </p>
          <p>
            Product(s):
            <br />
            ____________________
          </p>
          <p>
            Ordered on:
            <br />
            ____________________
          </p>
          <p>
            Received on:
            <br />
            ____________________
          </p>
          <p>
            Name:
            <br />
            ____________________
          </p>
          <p>
            Address:
            <br />
            ____________________
          </p>
          <p>
            Signature:
            <br />
            ____________________
          </p>
          <p>
            Date:
            <br />
            ____________________
          </p>
        </>
      ),
    },
  ],
};

const pages: Record<string, LegalPage> = {
  shipping,
  returns,
  privacy,
  cookies,
  terms,
};

export function LegalView({ slug }: { slug: keyof typeof pages }) {
  const page = pages[slug];

  return (
    <article className="foundation-page legal-page">
      <header className="foundation-intro">
        <h1>{page.title}</h1>
        {typeof page.lede === "string" ? <p>{page.lede}</p> : page.lede}
      </header>
      <div className="legal-stack">
        {page.blocks.map((block) => (
          <section key={block.title} className="legal-block">
            <h2>{block.title}</h2>
            {block.body}
          </section>
        ))}
      </div>
    </article>
  );
}

export const legalSlugs = ["shipping", "returns", "privacy", "cookies", "terms"] as const;
