import {
  LegalDocument,
  LegalSection,
  LegalList,
  LegalTable,
  LegalLink,
} from "@/components/legal/LegalDocument";

export function CandidatePrivacyPolicyContent() {
  return (
    <LegalDocument title="Candidate Privacy Policy" lastUpdated="21 June 2026">
      <LegalSection number={1} title="About this policy">
        <p>
          Neura Recruitment Limited (&ldquo;Neura&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a recruitment business
          specialising in health, safety, environment &amp; sustainability and construction. We take
          the privacy of the people we work with seriously.
        </p>
        <p>
          This Candidate Privacy Policy explains how we collect and use the personal data of job
          seekers, candidates, contractors, temporary workers and referees, and your rights in
          relation to that data. We are the data controller for this information.
        </p>
        <LegalList
          items={[
            <>Company: Neura Recruitment Limited (registered in England &amp; Wales, company number 17274084)</>,
            <>Contact for privacy matters: <LegalLink href="mailto:hello@neurarecruitment.com">hello@neurarecruitment.com</LegalLink></>,
            <>ICO registration number: [insert once registered with the ICO]</>,
          ]}
        />
      </LegalSection>

      <LegalSection number={2} title="The personal data we collect">
        <p>To provide recruitment services, we may collect and process:</p>
        <LegalList
          items={[
            "Identity and contact details — name, address, email, telephone number, date of birth.",
            "Right-to-work and eligibility information — nationality, passport/visa/share code details, National Insurance number.",
            "Career information — CV, employment history, qualifications, skills, references, salary or day-rate expectations, availability and notice period.",
            "Sector-specific credentials — professional qualifications and tickets such as NEBOSH, IOSH, CSCS, SMSTS, SSSTS and similar.",
            "Records of our dealings with you — notes from calls, interviews, the roles we put you forward for, and feedback.",
            "Compliance and payroll information (for contractors/temporary workers) — bank details, tax status, timesheets and payment records.",
          ]}
        />
        <p className="font-medium text-text-light">Special category and criminal records data</p>
        <p>Some roles, particularly on construction sites, may require us to process:</p>
        <LegalList
          items={[
            "Health information — for example fitness for certain work, or to make reasonable adjustments;",
            "Criminal records / DBS information — where a role lawfully requires it; and",
            "Equal opportunities information — which is provided voluntarily and used only in anonymised, aggregated form for monitoring.",
          ]}
        />
        <p>
          We only process this more sensitive data where we have a lawful condition to do so under the
          UK GDPR and the Data Protection Act 2018 — usually because it is necessary for employment
          purposes, to comply with the law, or with your explicit consent.
        </p>
      </LegalSection>

      <LegalSection number={3} title="How we collect your data">
        <p>We collect personal data:</p>
        <LegalList
          items={[
            "directly from you — when you apply through our website, send us your CV, or speak with us;",
            "from job boards and platforms — such as CV-Library, LinkedIn and other sourcing tools, where you have made your details available for recruitment purposes;",
            "from referees and third parties — for example references and qualification checks; and",
            "from referrals — where someone recommends you to us (we will tell you if we hold your data this way).",
          ]}
        />
      </LegalSection>

      <LegalSection number={4} title="How we use your data and our legal bases">
        <LegalTable
          headers={["Purpose", "Legal basis (UK GDPR)"]}
          rows={[
            ["Providing recruitment services and matching you to suitable roles", "Legitimate interests"],
            ["Contacting you about opportunities and keeping you informed", "Legitimate interests"],
            ["Putting you forward to, and arranging interviews with, prospective employers", "Legitimate interests / steps prior to a contract"],
            ["Verifying your right to work and carrying out required checks", "Legal obligation"],
            ["Placing and paying contractors / temporary workers", "Performance of a contract; legal obligation"],
            ["Keeping your details on file to consider you for future roles", "Consent"],
            ["Processing special category or criminal records data", "Explicit consent and/or an employment condition under the DPA 2018"],
          ]}
        />
        <p>
          You can object to processing based on legitimate interests, and withdraw any consent, at any
          time (see section 8).
        </p>
      </LegalSection>

      <LegalSection number={5} title="Who we share your data with">
        <p>We share your personal data only where necessary, with:</p>
        <LegalList
          items={[
            "Prospective employers and clients — we will always discuss a role with you before sending your details, and we share only what is relevant;",
            "Our CRM and IT service providers — who store and process data securely on our behalf;",
            "Background check, referencing and compliance providers — where required for a role;",
            "Umbrella companies, payroll providers and HMRC — for contractors and temporary workers;",
            "Professional advisers and regulators — where required by law.",
          ]}
        />
        <p>We do not sell your data, and we do not share it for third-party marketing.</p>
      </LegalSection>

      <LegalSection number={6} title="International transfers">
        <p>
          Where any of our providers process data outside the UK, we ensure appropriate safeguards are
          in place (such as UK adequacy regulations or the International Data Transfer Agreement /
          Addendum).
        </p>
      </LegalSection>

      <LegalSection number={7} title="How long we keep your data">
        <LegalTable
          headers={["Data", "Retention period"]}
          rows={[
            [
              "Unsuccessful applicants / candidates we do not place",
              "12 months from our last meaningful contact, then deleted — unless you ask us to keep you on file for longer (talent pool)",
            ],
            [
              "Candidates we place / contractors supplied",
              "Duration of the engagement plus up to 6 years (to meet legal, tax and contractual requirements)",
            ],
            [
              "Right-to-work records",
              "As required by law (generally 2 years after the end of employment)",
            ],
            [
              "Payroll and financial records (contractors)",
              "6 years (HMRC requirement)",
            ],
          ]}
        />
        <p>
          If we keep your data on file to consider you for future roles, we will refresh your consent
          periodically and you can ask us to remove you at any time.
        </p>
      </LegalSection>

      <LegalSection number={8} title="Your rights">
        <p>You have the right to:</p>
        <LegalList
          items={[
            "access the personal data we hold about you;",
            "have inaccurate data corrected;",
            <>have your data erased (&ldquo;right to be forgotten&rdquo;);</>,
            "restrict or object to our processing;",
            "data portability; and",
            "withdraw consent at any time where we rely on it.",
          ]}
        />
        <p>
          To exercise any of these rights, email{" "}
          <LegalLink href="mailto:hello@neurarecruitment.com">hello@neurarecruitment.com</LegalLink>.
          We will respond within one month.
        </p>
        <p>
          You also have the right to complain to the Information Commissioner&apos;s Office (ICO) —{" "}
          <LegalLink href="https://ico.org.uk">ico.org.uk</LegalLink>, 0303 123 1113 — although we
          would welcome the chance to resolve any concerns first.
        </p>
      </LegalSection>

      <LegalSection number={9} title="Automated decision-making">
        <p>
          We do not make decisions about you based solely on automated processing that produce legal or
          similarly significant effects. A consultant is always involved in decisions about your
          suitability for a role.
        </p>
      </LegalSection>

      <LegalSection number={10} title="Security">
        <p>
          We use appropriate technical and organisational measures to keep your data secure, and we
          require our service providers to do the same.
        </p>
      </LegalSection>

      <LegalSection number={11} title="Changes to this policy">
        <p>
          We may update this policy from time to time. The &ldquo;last updated&rdquo; date shows the latest
          version. Significant changes will be communicated where appropriate.
        </p>
      </LegalSection>

      <LegalSection number={12} title="Contact us">
        <p>
          Questions about your data? Contact{" "}
          <LegalLink href="mailto:hello@neurarecruitment.com">hello@neurarecruitment.com</LegalLink>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
