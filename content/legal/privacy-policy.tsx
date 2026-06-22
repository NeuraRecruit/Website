import {
  LegalDocument,
  LegalSection,
  LegalList,
  LegalTable,
  LegalLink,
} from "@/components/legal/LegalDocument";

export function PrivacyPolicyContent() {
  return (
    <LegalDocument title="Privacy Policy" lastUpdated="21 June 2026">
      <LegalSection number={1} title="Who we are">
        <p>
          This Privacy Policy explains how Neura Recruitment Limited (&ldquo;Neura&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;) collects and uses personal data when you visit our website at{" "}
          <LegalLink href="https://www.neurarecruitment.com">www.neurarecruitment.com</LegalLink> or
          contact us.
        </p>
        <p>We are the &ldquo;data controller&rdquo; for the personal data described in this policy.</p>
        <LegalList
          items={[
            <>Company: Neura Recruitment Limited (registered in England &amp; Wales, company number 17274084)</>,
            <>Contact for privacy matters: <LegalLink href="mailto:hello@neurarecruitment.com">hello@neurarecruitment.com</LegalLink></>,
            <>ICO registration number: [insert once registered with the Information Commissioner&apos;s Office]</>,
          ]}
        />
        <p>
          If you are a job seeker or candidate, please also read our separate{" "}
          <LegalLink href="/candidate-privacy">Candidate Privacy Policy</LegalLink>, which explains in
          detail how we handle your data in connection with recruitment.
        </p>
      </LegalSection>

      <LegalSection number={2} title="What this policy covers">
        <p>This policy covers personal data we collect from:</p>
        <LegalList
          items={[
            "visitors to our website;",
            "employers and prospective clients who contact us or enquire about our services; and",
            "anyone who emails, calls or otherwise gets in touch with us.",
          ]}
        />
      </LegalSection>

      <LegalSection number={3} title="The personal data we collect">
        <p>Depending on how you interact with us, we may collect:</p>
        <LegalList
          items={[
            <>Contact details — name, email address, telephone number, job title and company.</>,
            <>Enquiry details — the content of any message, enquiry or request you send us, including details of your hiring or staffing needs.</>,
            <>Technical data — information collected automatically when you use our website, such as IP address, browser type and pages viewed. See our <LegalLink href="/cookies">Cookie Policy</LegalLink> for more.</>,
            <>Correspondence — records of our communications with you.</>,
          ]}
        />
      </LegalSection>

      <LegalSection number={4} title="How we use your personal data and our legal bases">
        <LegalTable
          headers={["Purpose", "Legal basis (UK GDPR)"]}
          rows={[
            ["Responding to enquiries and providing information about our services", "Legitimate interests (to respond to and manage enquiries)"],
            ["Providing recruitment services to clients and managing our relationship", "Legitimate interests; or performance of a contract"],
            ["Sending service updates or relevant marketing to business contacts", "Legitimate interests; or consent where required"],
            ["Keeping our website secure and working properly", "Legitimate interests"],
            ["Complying with legal and regulatory obligations", "Legal obligation"],
          ]}
        />
        <p>
          Where we rely on legitimate interests, we have considered that these do not override your
          rights and freedoms. Where we rely on consent, you can withdraw it at any time by contacting
          us.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Who we share your data with">
        <p>We may share personal data with:</p>
        <LegalList
          items={[
            "Service providers who support our business (for example IT, hosting, email and CRM providers), who act on our instructions;",
            "Professional advisers such as accountants and legal advisers;",
            "Regulators and authorities where required by law.",
          ]}
        />
        <p>We do not sell your personal data.</p>
      </LegalSection>

      <LegalSection number={6} title="International transfers">
        <p>
          Our suppliers may occasionally process data outside the UK. Where they do, we ensure
          appropriate safeguards are in place (such as UK adequacy regulations or the International
          Data Transfer Agreement / Addendum).
        </p>
      </LegalSection>

      <LegalSection number={7} title="How long we keep your data">
        <p>
          We keep personal data only for as long as necessary for the purposes set out above. Business
          enquiry and client relationship records are generally retained for the duration of our
          relationship and for up to 6 years afterwards to meet legal and accounting requirements,
          unless a longer period is required by law.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Your rights">
        <p>Under UK data protection law you have the right to:</p>
        <LegalList
          items={[
            "access your data;",
            "have inaccurate data corrected;",
            "have data erased;",
            "restrict or object to processing;",
            "data portability; and",
            "withdraw consent where we rely on it.",
          ]}
        />
        <p>
          To exercise any of these rights, contact us at{" "}
          <LegalLink href="mailto:hello@neurarecruitment.com">hello@neurarecruitment.com</LegalLink>.
        </p>
        <p>
          You also have the right to complain to the Information Commissioner&apos;s Office (ICO) at{" "}
          <LegalLink href="https://ico.org.uk">ico.org.uk</LegalLink> or 0303 123 1113, though we
          would appreciate the chance to address your concerns first.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Security">
        <p>
          We use appropriate technical and organisational measures to protect personal data against
          unauthorised access, loss or misuse.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Changes to this policy">
        <p>
          We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top shows when
          it was last revised.
        </p>
      </LegalSection>

      <LegalSection number={11} title="Contact us">
        <p>
          For any questions about this policy or how we handle your data, contact{" "}
          <LegalLink href="mailto:hello@neurarecruitment.com">hello@neurarecruitment.com</LegalLink>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
