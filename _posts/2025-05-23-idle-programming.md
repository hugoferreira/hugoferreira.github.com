---
layout: post
title: "Idle Programming or The Art of (Un-)Productive Procrastination"
date: 2025-05-22 00:11
comments: true
external-url:
categories: Software
---

> "The first principle is that you must not fool yourself... or... something" — *What I recall from Richard Feynman*

This story begins on one evening in mid 2025, as I found myself simultaneously watching Ellie navigate the post-apocalyptic wasteland of ["The Last of Us"](https://www.imdb.com/title/tt3581920/) while my cursor blinked[^2] patiently in a Verilog file. The task at hand: implementing a Lua virtual machine in hardware. Not because I needed one, mind you, but because idle hands — or in this case, idle minds — tend toward increasingly esoteric forms of self-deception disguised as *engineering challenges*.

[^2]: People always think about cursors blinking, but mine doesn't. It just sits there... *idle*.

```verilog
module lua_vm (
    input wire clk,
    input wire reset,
    input wire [31:0] instruction,
    output reg [31:0] stack_top
);

reg [2:0] state;
reg [31:0] stack [0:255];
reg [7:0] stack_ptr;

// The LLM confidently suggested this approach...
always @(posedge clk) begin
    if (reset) begin
        state <= FETCH;
        stack_ptr <= 8'h00;
    end else begin
        case (state)
            FETCH: begin
                // But wait, what about the program counter?
```

And there it was; the LLM had elegantly sidestepped the fundamental question of program counter management. Again! Just like I sidestep the question of whether I'm actually being productive.

## The Illusion of Distributed Intelligence

What I've come to optimistical label "idle programming" is, in essence, a form of distributed procrastination where one agent (myself) provides high-level direction and error detection, while another agent (the LLM) handles the mechanical aspects of code generation. As Edwin Hutchins demonstrated in "Cognition in the Wild," complex problem-solving often emerges from the interaction between cognitive agents[^1]. Of course, Hutchins was studying naval navigation teams with actual stakes—lives depending on getting coordinates right. I'm debugging Verilog while watching Netflix. The parallels are... limited.

[^1]: Hutchins, E. (1995). *Cognition in the Wild*. MIT Press. Though comparing naval navigation to hobby programming is like comparing surgery to playing Operation—technically similar activities with vastly different stakes.

Consider the debugging conversation that followed my discovery:

**Me**: *"You've implemented instruction fetch but completely ignored PC management. How does the VM know which instruction to execute next?"*

**LLM**: *"You're absolutely right. Here's the corrected version with proper PC handling..."*

**Me**: [mentally pausing the show and thinking that is what passes for collaboration these days]

The LLM dutifully generates another attempt:

```verilog
reg [31:0] pc;
reg [31:0] program_memory [0:1023];

always @(posedge clk) begin
    if (reset) begin
        state <= FETCH;
        pc <= 32'h00000000;  // Starting with confidence...
        stack_ptr <= 8'h00;
    end else begin
        case (state)
            FETCH: begin
                instruction_reg <= program_memory[pc];
                pc <= pc + 1;  // Unconditionally. Always a good sign.
                state <= DECODE;
            end
            // ...
```

**Me**: *"What happens with branch instructions? You're unconditionally incrementing the PC."*

**LLM**: *"I need to handle branch instructions differently..."*

And so it goes. I point out the obvious flaws, the LLM apologizes (ALWAYS! EVEN WHEN I'M WRONG!) and generates a new version with different obvious flaws[^4]. This iterative process — me catching conceptual gaps, the LLM filling in implementation details — creates a peculiar form of collaborative problem-solving. A lot of people equate this to programming with an enthusiastic intern who's very good at typing and very bad at thinking. I disagree... Neither of us are *actually* writing code in the traditional sense, nor am I merely supervising. I'm engaging in what I've come to think of as *cognitive arbitrage*: leveraging the LLM's pattern-matching capabilities while providing the conceptual oversight it lacks... *en passant*.

[^4]: The thing is, they are only obvious if you actually read and think about them! And LLMs are very good at generating _lots_ of content... LOTS!

## The Taxonomy of Self-Deception Patterns

Through months of what I generously call *"research"* (conducted during several seasons of various streaming content), I've identified distinct patterns of collaborative self-deception:

1. **The Illusion of Efficiency.** I provide high-level architecture; the LLM fills in boilerplate. I convince myself this is *"leveraging tools"* rather than *"avoiding actual work."* Success rate: debatable, depending on how you define success.

2. **The Iterative Delusion.** The LLM proposes solutions; I identify problems; we iterate endlessly. This feels productive: we're making progress! Except we're solving a problem I created to avoid solving actual problems. It's recursive procrastination.

3. **The Pedagogical Pretense.** *"I'm teaching the LLM about proper software architecture,"* I tell myself, as if explaining stack overflow handling to a statistical model constitutes professional development. Meanwhile, real work emails accumulate unread.

4. **The Endless Context Reconstruction.** Mid-session, the LLM loses track of our shared context (context windows being finite and all). I must reconstruct the problem state, often re-discovering my own assumptions in the process. Surprisingly educational.

5. **The Research Rationalization.** *"This is exploring the future of programming,"* I insist, while implementing my fourth useless virtual machine this month. Future historians will surely thank me for such broad contributions to human knowledge.

## A Digression on Methodology and Self-Deception

As I often do when confronting uncomfortable truths about my own productivity, my cognitive dissonance kicks in: is *"idle programming"* a revolutionary new development methodology, or just procrastination with better tooling?

The honest answer: it's probably both, and that ambiguity is precisely what makes it so seductive. When Kent Beck introduced Test-Driven Development, he didn't arrive with formal proofs of its superiority. He had an intuition, anecdotal evidence, and the vague sensation that the methodology "felt right." The same holds for Agile, Scrum, and most software development practices we've collectively adopted. They began as *vibes* — educated hunches about how human creativity intersects with computational complexity. But by introducing TDD, the author, at least, had the courtesy to claim it would improve code quality and reduce bugs. I can't even pretend idle programming has measurable benefits — unless you count *"feeling busy while watching TV"* as a KPI.

Consider this dubious property I've observed: *for any given programming task T that you don't actually need to complete, the probability of _successful_ completion using idle programming approaches unity, where success is defined as _having written code that compiles._*

Note the careful caveats; this is the kind of rigorous methodology that would make a consultant proud. But then again, how much of our software engineering knowledge rests on similarly shaky empirical foundations?

## The Event Loop of Self-Justification

The parallel to Javascript's event loop is irresistible here, and also somewhat damning. Just as the browser alternates between executing user code and handling I/O events, my consciousness alternates between consuming media and generating elaborate technical justifications for said consumption:

```javascript
while (supposedly_relaxing) {
    if (guilt_about_productivity > threshold) {
        open_ide();
        generate_problem();
        collaborate_with_llm();
        feel_accomplished();
        guilt_about_productivity = 0;
    } else {
        watch_tv();
        guilt_about_productivity++;
    }
}
```

*"Are you even watching,"* my girlfriend asks, *"or are you just using the TV as background noise for your latest programming obsession?"*

She's not wrong. But here's the thing: I'm not *multitasking* so much as I'm *time-slicing* between different forms of avoidance. The LLM enables this beautifully; it's always ready for my next burst of pseudo-productivity, never judging the fact that we're implementing a Lua VM that will never execute actual Lua code.

## The Metacognitive Implications

What fascinates me most about *idle programming* is its metacognitive dimension. Daniel Kahneman's "System 1" and "System 2" thinking maps surprisingly well onto this collaborative model. The LLM handles what feels like System 1 operations—fast, pattern-based, automatic responses to coding tasks. I provide System 2 oversight—slower, more deliberative, logical analysis of whether the generated code actually solves the intended problem.

Right?

Well, when the LLM makes an error, can I can trace it back to specific prompts or missing context? Because when *I* make an error, it's usually either my specification or my understanding of the problem domain[^3].

[^3]: Or being stupid... also a common cause.

The result is a form of programming that feels simultaneously more and less rigorous than traditional approaches. More rigorous because every assumption gets questioned by me (by necessity, since the LLM keeps fucking up). Less rigorous because the verification process is still largely intuitive... I'm vibing my way through verification.

## The Failure Modes (And Why They Don't Matter)

Of course, this approach has its characteristic failure patterns, not that anyone's keeping score:

```verilog
// LLM-generated "error handling"
always @(posedge clk) begin
    if (push_enable) begin
        stack[stack_ptr] <= data_in;
        stack_ptr <= stack_ptr + 1;
        if (stack_ptr == 8'hFF) begin
            // Handle stack overflow gracefully
            stack_ptr <= 8'h00;  // By ignoring it completely
        end
    end
end
```

*"You're not handling stack overflow,"* I interrupt my attention to whatever's happening on the screen, "you're implementing a circular buffer that loses data."

*"You're absolutely right"* — the LLM responds with its characteristic lack of shame or self-consciousness — *"Here's the corrected version..."*

But... it doesn't matter! This virtual machine exists purely for the sake of existing. The stack can overflow, underflow, or spontaneously combust. There are no users to disappoint, no deadlines to miss, no consequences whatsoever. It's the perfect programming environment: all the satisfaction of problem-solving with none of the responsibility of actually solving real problems. Unless I'm trying to solve a real problem... I mean, if I were to do this in *real-code*, right? right? No sane person would *ever*...

## The Uncomfortable Truth

What I'm describing isn't really programming — it's *programming-flavored entertainment*. Like those mobile games where you tap to make numbers go up, except the numbers are lines of code and the tapping is prompting an LLM. The dopamine hit is the same: I've created something! It works! Look at all this code I've "written"!

But let's be honest about the economics here. A Lua VM in Verilog — assuming it will ever work perfectly — would have approximately zero *commercial* value and *negative* educational value (for alas, I haven't done it myself). The time I've spent on telling *something* to spend on this could have been used for any number of actually productive activities.

The LLM is the perfect enabler for this kind of productive procrastination. It never gets tired, never judges my choices, never asks why we're implementing yet another esoteric VM instead of, say, cleaning up the actual production code that pays my bills. It just keeps generating plausible-looking code fragments that make me feel like a Real Programmer™.

## The Return to Reality

*"WHO THE FUCK killed Joel!?"* The irony is thick enough to cut like a knife[^6]: I have spent hours *"implementing"* a VM to avoid thinking about *real problems*, only to miss the *fictional problems* I was supposedly enjoying.

[^6]: Because, thick... knife... 

And yet... the VM is sort of working now. Not completely — we still need proper error handling, memory management, and about a dozen other critical components; so, basicaly, everything that is needed for a VM to work. But the basic fetch-decode-execute cycle runs without crashing, and that *vibes* just like an accomplishment. 

This is the seductive danger of idle programming: it provides all the satisfaction of building something without the messy complications of... building something. It's engineering masturbation; technically impressive, personally satisfying, and ultimately pointless.

## The Epilogue of Rationalization

Maybe I'm being too hard.. After all, humans have always found ways to avoid work while feeling productive. We now procrastinate by producing functioning[^5] code, which is more than can be said for most forms of time-wasting. And who knows? Perhaps this exploration of human-LLM collaboration will prove useful someday, in some context I haven't imagined... yet.

[^5]: Again, for *some* definition of "functioning".

> "In the end, we must imagine the authentic engineer happy; not because they have conquered the corporate machine, but because they have refused to let it conquer them. Each day they choose, once again, to be skillfully human in an environment designed to make them efficiently mechanical. This choice, repeated daily in small acts of professional integrity, is both our burden and our freedom." — *This blogpost, according to a LLM.*

Now, what exactly happened to Joel while I was shouting at stack management?!
