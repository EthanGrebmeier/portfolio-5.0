import React from "react";
import BlogTitle from "~/components/blog/title";
import { BlogCallout } from "~/components/blog/callout";
import { BlogCodeBlock } from "~/components/blog/code-block";
import { BlogHero } from "~/components/blog/hero-section";
import { type BlogMediaDefinition } from "~/components/blog/media";

type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const agentHeroMedia: BlogMediaDefinition = {
  type: "image",
  alt: "Desk setup with multiple monitors and a dog",
  desktop: {
    src: "/images/blog/ai-agent-workstation.png",
  },
  containerClassName: "aspect-[4/3]",
};

const BlogPage = ({ searchParams }: PageProps) => {
  const isAsmbl = searchParams?.isAsmbl !== undefined;

  return (
    <div className="blog relative w-full font-sans">
      <div>
        <BlogTitle title="Tips For Working with AI Agents" link={{ href: "/", text: "Home" }} />

        <article className="flex flex-col gap-12 pb-16">
          <BlogHero caption="Co-written by Peanut" media={agentHeroMedia} />
          <section className="border-b border-blue-700 pb-10">
            <h2 className="mb-6">Context is Everything</h2>
            <div className="flex flex-col gap-4">
              <p>
                Great context is what allows your agents to execute the best that
                they can. Remember, every single time that an agent spins up, it
                has no clue about anything other than its training set. It is
                your job to teach it about your world. When working with AI
                agents, it should be your primary goal to set them up with
                everything that they need to be on the same page with your
                expectations for your outputs.
              </p>
              <p>
                You would imagine that the best way to get this done is to open
                up Cursor or any equivalent, type in your prompt, and let the
                agent loose. After all, what better context could you provide to
                an agent than your entire codebase!{" "}
                <strong>This is a terrible, terrible mistake.</strong>
              </p>
              <p>
                On middle to large-sized codebases, if an agent is let loose in
                an attempt to understand every single system by reading lines of
                code, you will quickly notice that the agent begins to work
                slower and slower, while making less and less sense. This is a
                concept known as <strong>context overload</strong>. By actively
                taking steps to ensure that you are not overloading your agents
                with information that is not relevant to the task at hand, you
                will see massive improvements in quality. Typically, this is
                best done by providing exact instructions on what you are trying
                to do and where the tool should look. With good instructions /
                rules, your agent harness (Cursor, Claude Code, etc...) will
                point the agent in the right direction, minimizing context
                overload.
              </p>
              <p>
                Fantastic video on context from Matt Pocock:{" "}
                <a
                  className="text-blue-700 underline"
                  href="https://www.youtube.com/watch?v=-uW5-TaVXu4"
                >
                  https://www.youtube.com/watch?v=-uW5-TaVXu4
                </a>
              </p>
            </div>
          </section>

          <section className="border-b border-blue-700 pb-10">
            <h2 className="mb-6">Getting Started</h2>
            <div className="flex flex-col gap-4">
              <p>
                So, how do we find this middle-ground where AI is steered to
                perfection?
              </p>
              <p>
                Before jumping into actually implementing any sort of feature,
                you should begin by creating a reference document that details
                exactly what to build and implement. The following example is
                for a refactor, but this flow can work for creating
                specifications of any shape and size, whether it be on a
                project, feature, or ticket level.
              </p>
              <p>
                For some background: We are a ways into the development of
                Urban Rec. The codebase is maturing, and like any codebase that
                matures, anti-patterns have been established and are now being
                persisted.
              </p>
              <BlogCallout>
                AI tools only make this problem worse. Modern tools usually take
                existing patterns as gospel and will often not create new
                patterns that they deem &quot;more efficient&quot; or
                &quot;scalable&quot;. As a result, it is our job as developers to
                catch these anti-patterns early on and steer the tools in a
                better direction so that the problem does not compound.
              </BlogCallout>
              <p>
                Our current culprit is one that most React developers will be
                familiar with:
              </p>
              <p>
                When integrating with any REST API, Agents will by default
                reinvent the wheel, creating custom fetching patterns that
                consist of millions of useEffects, custom loading states, and
                general wackiness that we really just shouldn&apos;t need to
                concern ourselves with. This is a problem that Tanstack Query
                solves way better than any agent ever will, so we need to gently
                guide its hand so that it sees things our way.
              </p>
              <h3 className="mt-4">Precursor</h3>
              <p>
                Before we actually get rolling, ensure that your development
                environment / repo contains the appropriate rules, skills, and
                documentation for your agent to be able to ingest.
              </p>
              <p>
                In many cases, the training set for your model will include all
                that an agent will need to know in order to work with a library
                or pattern. If you want to further improve your chances of
                quality output, or if you are working in a more niche space, you
                will want to help the agent along by including rules in your
                workspace, utilizing MCPs, or providing links to documentation
                in your prompt. Once you have all the resources set up, it&apos;s
                time to go!
              </p>
              <BlogCallout>
                You can find rules and skills for all sorts of libraries. Some
                of my favorite are shared at the end of this article.
              </BlogCallout>
              <ol className="mt-2 list-decimal pl-6">
                <li>
                  Create a brief document that outlines the following as
                  appropriate:
                </li>
              </ol>
              <ul className="list-disc pl-6">
                <li>What are the business goals?</li>
                <li>What are the known product requirements</li>
                <li>How should a user interact with the system/feature?</li>
                <li>How should an API expose itself?</li>
                <li>
                  If it exists, what is not working about the current system?
                  What needs to change?
                </li>
              </ul>
              <p>In my case, this step took the form of the following prompt:</p>
              <BlogCodeBlock>
{`Create a new folder in our docs folder for a milestone tanstack-query-refactor. 
Create a markdown PRD file \`tanstack-query-refactor.md\` to document all places where changes are necessary to refactor the existing implementations of data fetching to use tanstack query best practices.

DO NOT IMPLEMENT ANYTHING.
Only document, do not create anything outside of the specified file.`}
              </BlogCodeBlock>
              <ol className="mt-2 list-decimal pl-6" start={2}>
                <li>Refine the outline</li>
              </ol>
              <ul className="list-disc pl-10">
                <li>
                  This step may not be required, but I recommend that you make
                  sure that you are fully confident in your outline before you
                  move past this step.
                </li>
                <li>
                  Have a conversation with the AI. If you feel that you
                  aren&apos;t confident about one of the above points? Ask it to
                  interview you about any of them. Work with it by providing
                  areas that you aren&apos;t sure or that <em>you</em> think you
                  need clarification.
                </li>
                <li>
                  Once you feel that the AI context contains a solid
                  understanding, ask it to write an outline out for you.
                </li>
                <li>
                  Read the outline, tell the agent to address any glaring
                  issues, or ask it further questions until you feel that there
                  is a rock solid representation of what needs to be done
                </li>
              </ul>
              <ol className="mt-2 list-decimal pl-6" start={3}>
                <li>Prepare for implementation</li>
              </ol>
              <p>
                You might be shocked (or maybe annoyed), but we are{" "}
                <em>still</em> not ready for implementation. Like I mentioned
                above, our ultimate goal is to make sure that we chop up context
                into the ideal size before we actually start building. The final
                step for us is to turn our spec into a list of tickets for the
                agent to iterate through one at a time. This ensures that our
                agents will not go off the rails and update anything other than{" "}
                <em>exactly</em> what we tell it to.
              </p>
              <p>
                The way that I like to manage this is by creating a PRD for
                agents to reference as they are spun up. I create this PRD with
                a variation of the following prompt in Cursor&apos;s Plan Mode.
              </p>
              <BlogCallout>
                <p>
                  If you work in Cursor or Claude Code and aren&apos;t using
                  Plan mode, start right now!
                </p>
                <p>
                  Plan mode will ask you questions about places that your
                  prompt might not have been specific.
                </p>
                <p>
                  If you are working on a small feature and you want to get to
                  implementation ASAP, plan mode can get you there.
                </p>
              </BlogCallout>
              <BlogCodeBlock>
{`Please read the tanstack query refactor documentation. Create a tanstack-query-refactor-prd.json file. Split all work into digestible chunks with all pieces of work for the milestone. Ask me any questions as necessary to create this document. Ensure that each ticket includes the creation of unit or integration tests if necessary.
Each ticket includes:
{
    "category": "functional",
    "description": "New chat button creates a fresh conversation",
    "steps": [
      "Navigate to main interface",
      "Click the 'New Chat' button",
      "Verify a new conversation is created",
      "Check that chat area shows welcome state",
      "Verify conversation appears in sidebar"
    ],
    "passes": false
  }
  
  DO NOT ADD ANYTHING TO THE JSON FILE OTHER THAN AN ARRAY OF TICKETS`}
              </BlogCodeBlock>
              <p>
                <strong>The generated PRD is shared at the end of this article</strong>
              </p>
              <p>
                Once the PRD is generated, take some time to verify that the
                generated tickets align with your expectations.
              </p>
              <p>If it doesn&apos;t, there are two approaches I recommend:</p>
              <ul className="list-disc pl-6">
                <li>
                  If you still have plenty of context window available
                  (signified by a small circle chart in Cursor), provide more
                  context, point out missing pieces, and iterate until you are
                  happy.
                </li>
                <li>
                  Take your learnings and try again! Start a new session at the
                  current, or even previous step. This may sound crazy, but by
                  starting new and clearing the context window, you can remove
                  any bad information or mistakes in prompting that may have
                  caused the previous attempt to go off the rails
                </li>
              </ul>
              <p>
                These options are available for every step of the process! The
                benefit of this workflow is that you get &quot;checkpoints&quot;
                along the way where you can verify that you are on the right
                path.
              </p>
              <ol className="mt-2 list-decimal pl-6" start={4}>
                <li>Time to build!</li>
              </ol>
              <p>
                The moment we&apos;ve all been waiting for. Once you have all
                the pieces in place, it&apos;s time to spin up an agent to tackle
                the first task in your PRD. I have a custom Cursor command that
                handles this: <code>/work-on-prd</code>
              </p>
              <p>This command is shorthand for the following prompt:</p>
              <BlogCodeBlock>
{`Read the provided prd file and progress.txt files

1. Find the highest priority feature to work on and work only on that feature. This should be the one YOU decide has the highest priority, not necessarily first in the list.

2. Check that the types check via pnpm tsc and that the tests that are related to areas you have touched pass

3. Update the PRD with the work that was done

4. Append your progress to a progress.txt file for the milestone. Use this to leave a note for the next person working in the codebase

5. Make a git commit of your feature. ONLY WORK ON A SINGLE TICKET

If you notice while working on a feature that the PRD is complete, let me know`}
              </BlogCodeBlock>
              <p>
                This command (and much of this flow in general) is heavily
                inspired / copied from{" "}
                <a
                  className="text-blue-700 underline"
                  href="https://www.youtube.com/watch?v=_IK18goX4X8"
                >
                  Matt Pocock&apos;s video
                </a>{" "}
                on the Ralph Wiggum AI agentic development technique. It is
                split into 5 crucial parts.
              </p>
              <ol className="list-decimal pl-6">
                <li>
                  Gives the current agent the directive of determining what the
                  highest priority ticket is. This way, if you have a
                  documentation ticket (which you probably will), you don&apos;t
                  get cases where the system is documented before it actually
                  exists.
                </li>
                <li>
                  This step aims to filter out any false positives where the
                  agent thinks it has produced working code, but has actually
                  failed to create something that works at all. It also
                  maintains code quality standards and ensures that tests for
                  the affected area are not broken as a result of the work
                </li>
                <li>
                  This step and the following are crucial in helping the{" "}
                  <em>next</em> agent know where in the process the
                  implementation is currently at.
                </li>
                <li>
                  This is a small but powerful optimization that allows the
                  next agent to ingest synthesized learnings and updates that
                  may not have been evident at the onset of the development of
                  the feature. The agent will document things like where helper
                  functions are being stored for example, keeping standards in
                  line across tickets.
                </li>
                <li>
                  This step closes out the process with a commit that follows
                  established standards (and includes a nice reminder to the
                  agent that they better not even think of touching anything
                  outside the scope of this ticket)
                </li>
              </ol>
              <p>
                Once you have run through a single ticket, it is crucial that
                you do the following:
              </p>
              <ol className="list-decimal pl-6">
                <li>
                  Verify that the output matches up with your expectations. We
                  still need to do our jobs as engineers to verify that the code
                  in our codebase is not garbage. If you notice errors or
                  mistakes, you may need to go back a step.
                </li>
                <li>
                  Start a new agent session before you move onto the next
                  ticket. This is so incredibly crucial. This whole workflow is
                  built around managing context from agent to agent, if you are
                  running through multiple tickets in a session, you are likely
                  leaving quality on the table.
                </li>
              </ol>

              {isAsmbl && (
                <div className="mt-6 flex flex-col gap-3 rounded-lg border border-blue-700 bg-blue-50 p-4">
                  <p>
                    Here is the PR that was generated as a result of running
                    through this PRD while I wrote this article:
                  </p>
                  <a
                    className="text-blue-700 underline"
                    href="https://github.com/assembleinc/urban-rec/pull/2"
                  >
                    https://github.com/assembleinc/urban-rec/pull/2
                  </a>
                  <p>Don&apos;t worry, this won&apos;t render for those who don&apos;t visit from the link I shared in Slack :)</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-6">Conclusion</h2>
            <div className="flex flex-col gap-4">
              <p>
                The true, highest-value skill that a developer, or anyone
                working with AI for that matter, can have in 2026 is solid
                context management. By no means is this an easy process and the
                workflow that I&apos;ve outlined almost certainly isn&apos;t a
                one-size-fits-all approach. You might have noticed that this
                article doesn&apos;t talk all that much about tools or code. That
                is a deliberate choice. My goal was to shed light on my process.
                And that process may very well not work for you! These tools are
                ultimately just extensions of the person that is piloting them.
                The only true barrier to execution is creating an interface
                that allows agents to execute things exactly how you see them in
                your mind&apos;s eye.
              </p>
              <h3 className="mt-2">Recommended Resources and Tips</h3>
              <ul className="list-disc pl-6">
                <li>
                  <strong>Cursor tips</strong>
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Use agent modes:</strong> If you work in Cursor,
                      please please please use their different agent modes.
                    </li>
                    <li>
                      <strong>Plan mode:</strong> Plan mode will help you get
                      your plans in a great shape.
                    </li>
                    <li>
                      <strong>Debug Mode:</strong> Cursor&apos;s newest mode and
                      invaluable for debugging issues in your codebase. It sets
                      up debug instrumentation and tears it all out once your
                      issue has been resolved.{" "}
                      <a
                        className="text-blue-700 underline"
                        href="https://cursor.com/blog/debug-mode"
                      >
                        Link
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Resources</strong>
                  <ul className="list-disc pl-6">
                    <li>
                      <strong>Vercel agent skills:</strong> A fantastic list of
                      best practice agent skills for working with React
                      codebases.{" "}
                      <a
                        className="text-blue-700 underline"
                        href="https://vercel.com/blog/introducing-react-best-practices"
                      >
                        Link
                      </a>
                    </li>
                    <li>
                      <strong>ShadCN:</strong>{" "}
                      <a
                        className="text-blue-700 underline"
                        href="https://ui.shadcn.com/llms.txt"
                      >
                        llms.txt
                      </a>
                    </li>
                    <li>
                      <strong>Theo&apos;s video:</strong> A great video that
                      talks about many of the concepts I discuss here. He makes
                      a fantastic point that instead of fixating on the tools
                      and specifics of how we build, we should be focused on
                      internalizing the principles and systems of thinking that
                      enable us to provide agents with the best context.{" "}
                      <a
                        className="text-blue-700 underline"
                        href="https://www.youtube.com/watch?v=Yr9O6KFwbW4"
                      >
                        Link
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default BlogPage;
