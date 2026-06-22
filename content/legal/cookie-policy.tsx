import {
  LegalDocument,
  LegalSection,
  LegalList,
  LegalTable,
  LegalLink,
} from "@/components/legal/LegalDocument";

export function CookiePolicyContent() {
  return (
    <LegalDocument title="Cookie Policy" lastUpdated="21 June 2026">
      <LegalSection number={1} title="What are cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website. They are widely
          used to make websites work, to improve performance, and to provide information to site owners.
          Similar technologies (such as local storage and pixels) work in comparable ways; references
          to &ldquo;cookies&rdquo; in this policy include these technologies.
        </p>
      </LegalSection>

      <LegalSection number={2} title="The cookies we use">
        <p>
          We currently use only strictly necessary (essential) cookies — the cookies required to make
          our website function and keep it secure. We do not use analytics, advertising or tracking
          cookies.
        </p>
        <p>
          Under the Privacy and Electronic Communications Regulations (PECR), strictly necessary
          cookies do not require your consent, but we list them here for transparency.
        </p>
        {/* Cookie names can be verified/refined after a live scan of neurarecruitment.com */}
        <LegalTable
          headers={["Cookie / technology", "Purpose", "Type", "Duration"]}
          rows={[
            [
              "Session / security cookies",
              "Keep the site secure and working as you move between pages",
              "Strictly necessary",
              "Session",
            ],
            [
              "Load-balancing / hosting cookies",
              "Ensure the site loads reliably",
              "Strictly necessary",
              "Session",
            ],
          ]}
        />
      </LegalSection>

      <LegalSection number={3} title="If we add analytics or marketing cookies in future">
        <p>If we introduce analytics (e.g. Google Analytics) or marketing cookies later, we will:</p>
        <LegalList
          items={[
            "update this policy to list them;",
            "display a cookie consent banner so you can accept or reject non-essential cookies before they are set; and",
            "only set those cookies with your consent.",
          ]}
        />
      </LegalSection>

      <LegalSection number={4} title="Managing cookies">
        <p>
          You can control and delete cookies through your browser settings. Most browsers let you block
          or remove cookies, though blocking strictly necessary cookies may stop parts of the site
          working. Guidance for common browsers is available at{" "}
          <LegalLink href="https://www.aboutcookies.org">www.aboutcookies.org</LegalLink>.
        </p>
      </LegalSection>

      <LegalSection number={5} title="Changes to this policy">
        <p>
          We may update this Cookie Policy from time to time. The &ldquo;last updated&rdquo; date shows the
          latest version.
        </p>
      </LegalSection>

      <LegalSection number={6} title="Contact us">
        <p>
          Questions about cookies? Contact{" "}
          <LegalLink href="mailto:hello@neurarecruitment.com">hello@neurarecruitment.com</LegalLink>.
          For more on how we handle personal data, see our{" "}
          <LegalLink href="/privacy">Privacy Policy</LegalLink> and{" "}
          <LegalLink href="/candidate-privacy">Candidate Privacy Policy</LegalLink>.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
