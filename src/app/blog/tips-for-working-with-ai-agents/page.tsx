import Link from "next/link";
import React from "react";
import { BlogCallout } from "~/components/blog/callout";
import { BlogCodeBlock } from "~/components/blog/code-block";
import { BlogHero } from "~/components/blog/hero-section";
import BlogTitle from "~/components/blog/title";
import type { BlogMediaDefinition } from "~/components/blog/media";

const heroMedia: BlogMediaDefinition = {
  type: "image",
  alt: "AI agent workstation",
  desktop: {
    src: "/images/blog/ai-agent-workstation.png",
    priority: true,
  },
  containerClassName: "xs:h-[440px] h-[600px]",
};

type BlogPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const BlogPage = ({ searchParams }: BlogPageProps) => {
  const isAsmbl = searchParams?.isAsmbl !== undefined;

  return (
    <div className="relative w-full font-sans">
      <div>
        <BlogTitle
          title="Tips For Working with AI Agents"
          link={{ href: "/", text: "Home" }}
        />

        <BlogHero caption="co-written by peanut" media={heroMedia} />

        <div className="blog">  
        <section className="mt-12  ">
          <h2 className="mb-6">Context is Everything</h2>
          <div className="flex flex-col gap-4">
            <p>When AI agents work well, they feel almost magical.</p>
            <p>
              You give them a task, they navigate your codebase, make thoughtful
              changes, and hand back something that looks like it came from an
              engineer who knows the system inside and out.
            </p>
            <p>
              When they don&apos;t, the results are confusing at best—and
              actively harmful at worst.
            </p>
            <p>
              The difference between those two outcomes usually isn&apos;t the
              model, the tool, or the prompt. It&apos;s the{" "}
              <strong>structure of the context</strong> the agent is operating
              within.
            </p>
            <p>
              Agents don&apos;t “understand” your system the way you do. Every
              single time an agent spins up, they assemble a working model of it
              on the fly, using whatever information you let them load into
              their context window. If that window becomes bloated, unfocused,
              or contradictory, quality suffers—often without obvious failure
              signals.
            </p>
            <p>
              In this article, I&apos;ll show how to design workflows that
              prevent that from happening.
            </p>
            <p>
              We&apos;ll start by breaking down why naïve agent usage fails,
              then walk through a concrete, repeatable workflow for planning,
              scoping, and executing work without polluting an agent&apos;s
              context.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6">The Core Problem</h2>
          <div className="flex flex-col gap-4">
            <p>
              Lets say that your goal is to refactor a part of an existing
              codebase. You plan on moving from an established pattern to a new
              one, using AI Agents to get the job done. You open up Cursor or an
              equivalent environment and type the following:
            </p>
            <p>
              <code>
                Refactor the codebase to move from Pattern A to Pattern B
              </code>
            </p>
            <p>
              After all, what better context could you provide to an agent than
              your entire codebase!
            </p>
            <p>
              <strong>This is a terrible, terrible mistake.</strong>
            </p>
            <p>
              Depending on the complexity / novelty of your request, by the time
              the agent is finished, you will likely experience one of the
              following outcomes.
            </p>
            <ul className="list-disc pl-6">
              <li>
                The agent perfectly executed your request, accounting for all
                edge cases, updating all tests, and perfectly completing the
                refactor. Congratulations! In my experience, this is the most
                rare case unless I am asking for something dead simple.
              </li>
              <li>
                The work, <em>appears</em> to be complete, but upon closer
                inspection, you can see that edge cases were missed, things
                don&apos;t quite work how you expected and the job might not
                have even finished.
              </li>
            </ul>
            <p>
              To understand why this happens, we need to look at how agents
              actually execute a prompt.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6">How Agents Actually Execute Your Prompt</h2>
          <div className="flex flex-col gap-2">
            <p>
              When an agent is let free to implement your prompt, it typically
              follows this flow:
            </p>
            <ol className="list-decimal pl-6">
              <li>
                Search codebase for examples of Pattern A, adding each instance
                to the context window
              </li>
              <li>
                Analyze dependencies by ingesting context of how Pattern A
                interacts with the rest of the system, adding each file it reads
                to its context window.
              </li>
              <li>
                Implement your request, replacing each instance of Pattern A
                with Pattern B to the best of its abilities, tracking its
                progress along the way and recording every change it makes to
                its context window.
              </li>
            </ol>
            <p>
              You might notice the common thread between each of these steps is
              that each step adds more and more to the context window. As the
              context window grows beyond a certain point, the output of the
              agent begins to deteriorate in quality as a result of the
              relationship between the input tokens and the mathematical model
              that drives the LLM&apos;s output. This is a phenomenon known as{" "}
              <strong>context pollution</strong>. We can avoid this by taking
              specific, focused steps to reduce the tokens that get loaded into
              context.
            </p>
            <p>Typically, this is best achieved by doing the following:</p>
            <ul className="list-disc pl-6">
              <li>
                Start by planning. Allow the agent to focus purely on gathering
                and synthesizing provided context regarding the current system
                state and goals into a clear and concise plan for
                implementation.
              </li>
              <li>
                Once the plan is detailed enough that you feel confident in it,
                spin up agents to focus on single pieces of the plan at a time,
                ensuring that an agent doesn&apos;t scope-creep itself into
                polluting its own context window. If you still aren&apos;t
                getting the results you want, you probably didn&apos;t divide
                your work into small enough pieces!
              </li>
            </ul>
            <p>
              As a result of this approach, we are able to optimize steps 1 and
              2 of the agent workflow. Instead of searching your codebase for
              context related to your task, ballooning context quickly, an agent
              is able to reference a concise document and get to work.
            </p>
            <BlogCallout>
              <p>
                Cursor&apos;s <a href="https://cursor.com/blog/plan-mode">Plan Mode</a> is a fantastic middle-ground for smaller
                chunks of work, though you will still see context pollution when
                making larger requests.
              </p>
            </BlogCallout>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6">Getting Started</h2>
          <div className="flex flex-col gap-4">
            <p>
              Before we actually get rolling, ensure that your development
              environment / repo contains the appropriate rules, skills, and
              documentation for your agent to be able to ingest.
            </p>
            <p>
              In many cases, the training set for your model will include all
              that an agent will need to know in order to work with a library or
              pattern. If you want to further improve your chances of quality
              output, or if you are working in a more niche space, you will want
              to help the agent along by including rules in your workspace,
              utilizing MCPs, or providing links to documentation in your
              prompt. Once you have all the resources set up, it&apos;s time to
              go!
            </p>
            <BlogCallout>
              <p>
                You can find rules and skills for all sorts of libraries. Some
                of my favorite are shared at the end of this article.
              </p>
            </BlogCallout>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6">Our Example Case</h2>
          <div className="flex flex-col gap-4">
            <p>
              Let&apos;s walk through a real refactor where this workflow
              shines.
            </p>
            <p>
              We are a ways into the development of a project. The codebase is
              maturing, and like any codebase that, anti-patterns have been
              established and are now being persisted.
            </p>
            <BlogCallout>
              <p>
                AI tools only make this problem worse. Modern tools usually take
                existing patterns as gospel and will typically not create new
                patterns that they deem &quot;more efficient&quot; or
                &quot;scalable&quot; unless guided to do so. As a result, it is
                our job as developers to catch these anti-patterns early on and
                steer the tools in a better direction so that the problem does
                not compound. This issue can often be avoided entirely by
                ensuring that we declare valuable patterns, libraries, etc... in
                a rules directory.
              </p>
            </BlogCallout>
            <p>
              Our current culprit is one that most React developers will be
              familiar with:
            </p>
            <p>
              When integrating with any REST API, Agents will by default
              reinvent the wheel, creating custom fetching patterns that consist
              of millions of useEffects, custom loading states, and general
              wackiness that we really shouldn&apos;t need to concern ourselves
              with. This is a problem that Tanstack Query solves way better than
              any agent ever will, so we need to guide its hand so that it sees
              things our way.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6">Phase 1: Planning and Specification</h2>
          <div className="flex flex-col gap-4">
            <h3>Creating the Outline</h3>
            <div>

            <p>
              Create a brief document that outlines the following as
              appropriate:
            </p>
            <ul className="list-disc pl-6">
              <li>What are the business goals?</li>
              <li>What are the known product requirements</li>
              <li>How should a user interact with the system/feature?</li>
              <li>How should an API expose itself?</li>
              <li>
                If it exists, what is not working about the current system? What
                needs to change?
              </li>
            </ul>
            </div>
            <p>In my case, this step took the form of the following prompt:</p>
            <BlogCodeBlock>
              {`Create a new folder in our docs folder for a milestone tanstack-query-refactor. 
Create a markdown PRD file \`tanstack-query-refactor.md\` to document all places where changes are necessary to refactor the existing implementations of data fetching to use tanstack query best practices.

DO NOT IMPLEMENT ANYTHING.
Only document, do not create anything outside of the specified file.`}
            </BlogCodeBlock>
            <h3>Refining the Outline</h3>
            <p>
              I recommend that you thoroughly review and iterate on your outline
              until you are confident it has all of the details the agent will
              need to work from.
            </p>
            <p>
              Have a conversation with the AI. If you feel that you aren&apos;t
              confident about one of the above points? Ask it to interview you
              about any of them. Work with it by providing areas that you
              aren&apos;t sure or that <em>you</em> think you need
              clarification.
            </p>
            <h3>Prepare for implementation</h3>
            <p>
              The final step for us is to turn our spec into a list of tickets
              for the agent to iterate through one at a time. This ensures that
              our agents will not go off the rails and update anything other
              than <em>exactly</em> what we tell it to.
            </p>
            <p>
              The way that I like to manage this is by creating a PRD for agents
              to reference as they are spun up. I create this PRD with a
              variation of the following prompt in Cursor&apos;s Plan Mode.
            </p>
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
              Once the PRD is generated, take some time to verify that the
              generated tickets align with your expectations.
            </p>
            <div>

            <p>If it doesn&apos;t, there are two approaches I recommend:</p>
            <ul className="list-disc pl-6">
              <li>
                If you still have plenty of context window available (signified
                by a small circle chart in Cursor), provide more context, point
                out missing pieces, and iterate until you are happy.
              </li>
              <li>
                Take your learnings and try again! Start a new session at the
                current, or even previous step. This may sound crazy, but by
                starting new and clearing the context window, you can remove any
                bad information or mistakes in prompting that may have caused
                the previous attempt to go off the rails. The benefit of this
                approach is that each artifact produce can act as a checkpoint
                if we ever need to go back to the drawing board
              </li>
            </ul>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="mb-6">Phase 2: Time to Build!</h2>
          <div className="flex flex-col gap-4">
            <p>
              The moment we&apos;ve all been waiting for. Once you have all the
              pieces in place, it&apos;s time to spin up an agent to tackle the
              first task in your PRD. I have a custom Cursor command that
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
              <a href="https://www.youtube.com/watch?v=_IK18goX4X8">
                Matt Pocock&apos;s video
              </a>{" "}
              on the Ralph Wiggum AI agentic development technique.
            </p>
            <p>
              This prompt does five things that keep the agent focused and the
              work reproducible:
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
                This step aims to filter out any false positives where the agent
                thinks it has produced working code, but has actually failed to
                create something that works at all. It also maintains code
                quality standards and ensures that tests for the affected area
                are not broken as a result of the work
              </li>
              <li>
                This step and the following are crucial in helping the{" "}
                <em>next</em> agent know where in the process the implementation
                is currently at.
              </li>
              <li>
                This is a small but powerful optimization that allows the next
                agent to ingest synthesized learnings and updates that may not
                have been evident at the onset of the development of the
                feature. The agent will document things like where helper
                functions are being stored for example, keeping standards in
                line across tickets.
              </li>
              <li>
                This step closes out the process with a commit that follows
                established standards (and includes a nice reminder to the agent
                that they better not even think of touching anything outside the
                scope of this ticket)
              </li>
            </ol>
            <p>
              Once you have run through a single ticket, it is crucial that you
              do the following:
            </p>
            <ol className="list-decimal pl-6">
              <li>
                Verify that the output matches up with your expectations. We
                still need to do our jobs as engineers to verify that the code
                in our codebase is not garbage. If you notice errors or
                mistakes, you may need to go back a step.
              </li>
              <li>
                Start a new agent session before you move onto the next ticket.{" "}
                <strong>This is so incredibly crucial</strong>. This whole
                workflow is built around reducing context overload from agent to
                agent, if you are running through multiple tickets in a session,
                you are likely leaving quality on the table. If you take away
                one thing from this article, its that you should be starting new
                agent sessions often!
              </li>
            </ol>
          </div>
        </section>

        {isAsmbl && (
          <BlogCallout className="mt-12">
            <div className="flex flex-col gap-4">
              <p>
                Here is the PR that was generated as a result of running through
                this PRD while I wrote this article:
              </p>
                <Link className="text-blue-700 underline" href="https://github.com/assembleinc/urban-rec/pull/2">
                  https://github.com/assembleinc/urban-rec/pull/2
                </Link>
              <p>
                Don&apos;t worry, this won&apos;t render for those who
                don&apos;t visit from the link I shared in Slack : )
              </p>
            </div>
          </BlogCallout>
        )}

        <section className="mt-12 pb-16">
          <h2 className="mb-6">Conclusion</h2>
          <div className="flex flex-col gap-4">
            <p>
              The true, highest-value skill that a developer, or anyone working
              with AI for that matter, can have in 2026 is solid context
              management. By no means is this an easy process and the workflow
              that I&apos;ve outlined almost certainly isn&apos;t a
              one-size-fits-all approach. You might have noticed that this
              article doesn&apos;t talk all that much about tools or code. That
              is a deliberate choice. My goal was to shed light on my process.
              And that process may very well not work for you! These tools are
              ultimately just extensions of the person that is piloting them.
              The only true barrier to execution is creating an interface that
              allows agents to execute things exactly how you see them in your
              mind&apos;s eye.
            </p>
            <p>
              If AI agents feel unpredictable, it&apos;s because we haven&apos;t
              yet implemented the systems to best control how they execute.
            </p>
            
          </div>

        </section>
        <section className="mt-12">
        <h2 className="mb-6">Recommended Resources and Tips</h2>
            <ul className="list-disc pl-6">
              <li>
                If you work in Cursor, please please please use their different
                agent modes.
                <ul className="list-disc pl-6">
                  <li>
                    <a href="https://cursor.com/blog/plan-mode">Plan Mode</a> will help you get your plans in a great shape.
                  </li>
                  <li>
                    <a href="https://cursor.com/blog/debug-mode">Debug Mode</a>{" "}
                    is Cursor&apos;s newest mode and is invaluable for debugging
                    issues in your codebase. It sets up debug instrumentation
                    and tears it all out once your issue has been resolved.
                  </li>
                </ul>
              </li>
              <li>
                Vercel recently put out a <a href="https://vercel.com/blog/introducing-react-best-practices">fantastic list</a> of best practice agent
                skills for working with React codebases{" "}
                
              </li>
              <li>
                Theo put out a <a href="https://www.youtube.com/watch?v=Yr9O6KFwbW4">great video</a> that talks about many of the concepts
                I discuss here. He makes a fantastic point that instead of
                fixating on the tools and specifics of how we build, we should
                be focused on internalizing the principles and systems of
                thinking that enable us to provide agents with the best context{" "}
              </li>
              <li>
                A <a href="https://www.youtube.com/watch?v=L_p5GxGSB_I">breakdown</a> by Lee Robinson on the different ways to provide context to an agent
              </li>
              <li>
                Fantastic <a href="https://www.youtube.com/watch?v=-uW5-TaVXu4">video</a> on context from Matt Pocock. Check out his channel for a bunch of great info on optimizing your workflow with AI agents.
              </li>
            </ul>
        </section>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
