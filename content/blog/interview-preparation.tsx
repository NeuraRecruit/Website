import Link from "next/link";
import { BlogArticleBody } from "@/components/blog/BlogArticleBody";
import { BlogContactFooter } from "@/components/blog/BlogContactFooter";

export function InterviewPreparationContent() {
  return (
    <BlogArticleBody>
      <p>
        You&apos;ve got the interview. Now comes the part that decides whether you get the job.
      </p>

      <p>
        Here&apos;s the thing about interviews: they&apos;re mostly won before you walk through the door.
        The candidate who performs well on the day is rarely the one who&apos;s naturally slick. It&apos;s
        the one who prepared properly. And as a safety professional, preparation is exactly what
        you&apos;re trained to do. Treat the interview like any other high-stakes piece of work:
        understand the environment, identify the risks, plan for them.
      </p>

      <p>Here&apos;s how.</p>

      <h2>Understand the business, not just the website</h2>

      <p>
        Almost every interview includes some version of &ldquo;what do you know about us?&rdquo; and
        &ldquo;why us?&rdquo; Weak answers are recycled from the homepage. Strong ones show you&apos;ve genuinely
        looked.
      </p>

      <p>
        Start with the website, then go further. Read their annual report if they publish one.
        Search the trade press for recent contract wins, acquisitions or restructures. Look at their
        accreditations: ISO 45001, ISO 14001, any sector schemes.
      </p>

      <p>
        And do something most candidates never think of: check their safety record. Have they had
        HSE enforcement action, an improvement notice, or a prosecution? Have they published their
        incident performance? You wouldn&apos;t raise it bluntly, but knowing it lets you ask a far more
        intelligent question, and tells you what you might be walking into.
      </p>

      <p>That level of preparation is rare, and it shows.</p>

      <h2>Decode the role</h2>

      <p>Read the job description properly, then read between the lines.</p>

      <p>
        Which skills are mentioned first, and which keep reappearing? That&apos;s what they actually
        care about. Is the emphasis on compliance and systems, or on culture change and influence?
        On a single site, or across a region? Are they looking for someone to steady a ship, or
        shake one up?
      </p>

      <p>
        Match each of their key requirements to a specific, real example from your career. Not
        &ldquo;I&apos;m good at engagement,&rdquo; but the time you turned around a site team that saw safety as
        an obstacle, and what changed as a result.
      </p>

      <p>
        If you&apos;re working with a recruiter, use them. A good consultant has spoken to the hiring
        manager and knows what&apos;s really behind the advert: the context, the challenges, what a
        previous candidate got wrong. That intelligence is often the difference.
      </p>

      <h2>Prepare evidence, not scripts</h2>

      <p>
        You&apos;ll get the familiar ones: tell me about yourself, what are your strengths and
        weaknesses, why do you want this role. Don&apos;t memorise a speech. Prepare the raw material and
        speak naturally.
      </p>

      <p>
        For each key theme, have a story ready with an outcome attached. What was the situation,
        what did you do, and what measurably changed? Accident rate, audit result, accreditation
        achieved, behaviour shifted, cost avoided. Numbers make you memorable.
      </p>

      <p>
        And be ready for the technical questions. Depending on the role, expect to be tested on
        legislation and practice: CDM, ISO 45001, RIDDOR, risk assessment methodology, recent HSE
        guidance. Interviewers use these to check you&apos;re genuinely current, not coasting on
        experience.
      </p>

      <h2>Have your own questions ready</h2>

      <p>
        You&apos;ll be asked if you have any. &ldquo;No, I think you&apos;ve covered everything&rdquo; is a wasted
        opportunity, and it reads as disinterest.
      </p>

      <p>Good ones to have in reserve:</p>

      <ul>
        <li>What will the biggest challenge be for whoever takes this role?</li>
        <li>What are the key priorities for the function over the next twelve months?</li>
        <li>How does the senior leadership team engage with safety?</li>
        <li>What&apos;s the culture like within the team?</li>
        <li>Which of my skills do you think will matter most here?</li>
      </ul>

      <p>
        We&apos;ve written separately about{" "}
        <Link href="/blog/interview-questions-to-ask" className="text-accent underline-offset-2 hover:underline">
          using the final five minutes of an interview well
        </Link>{" "}
        — it&apos;s worth a read.
      </p>

      <h2>Sort the logistics, especially for site interviews</h2>

      <p>
        Being late is an unforced error, and in our profession it&apos;s a particularly bad look. Know
        the address, the route, the parking, the journey time, and build in a buffer.
      </p>

      <p>
        But one thing catches Health and Safety candidates out more than anything else: site-based
        interviews.
      </p>

      <p>
        If any part of the interview involves going onto a live site, ask in advance. You may need
        your own PPE: boots, hi-vis, hard hat, glasses. You may need to show your CSCS card. There
        may be a site induction to complete. Turning up to a construction interview without safety
        boots is not a small thing. It&apos;s the worst possible first impression for someone whose job
        is safety.
      </p>

      <p>
        If you&apos;re unsure, ask your recruiter. And keep their number on you. If you&apos;re delayed or
        lost, one call solves it.
      </p>

      <h2>First impressions still count</h2>

      <p>
        Plan what you&apos;re wearing the night before. Smart and professional as standard, though if
        you&apos;re heading onto site, &ldquo;professional&rdquo; means practical and correctly equipped, not a suit
        and no boots.
      </p>

      <p>
        Be courteous to everyone you meet, not just the interviewer. The person on reception is
        often asked what they thought of you.
      </p>

      <h2>Then get some sleep</h2>

      <p>
        Preparation calms nerves better than anything else. When you know the business, know the
        role, and know your own examples, there&apos;s very little left to fear.
      </p>

      <p>Go in, be yourself, and let the work you&apos;ve already done do its job.</p>

      <BlogContactFooter>
        If you&apos;re a Health, Safety, Environment or Sustainability professional preparing for an
        interview, or thinking about your next move, we&apos;d be glad to help you get ready.
      </BlogContactFooter>
    </BlogArticleBody>
  );
}
