---
layout: post
title: "Unify and Conquer: Logic Programming in a Strongly-Typed Land"
date: 2025-06-15 17:33
comments: true
external-url:
categories: Software
---

> "The computer programmer is a creator of universes for which he alone is the lawgiver. No playwright, no stage director, no emperor, however powerful, has ever exercised such absolute authority to arrange a stage or field of battle and to command such unswervingly dutiful actors or troops." — *Joseph Weizenbaum*

In the early 2010's[^4] when I was taking an undergrad course on Logic Programming, there was this professor that was a *bit* of a legend in the AI community, and a *full byte* in being a jerk[^1]. The course was (and I believe it still is?) taught using Prolog.

[^4]: 2000 to be exact. But age is a construct and time is relative...

[^1]: Our *rendezvous* didn't end well; at some point, both of us were found literally *shouting* (*i.e.,* >= 80dB) at each other. He insisted I had plagiarised my chess engine _\*because\*_ he have never seen me in his classes; which was partially true: I avoided his classes as much as possible! He was probably the single root cause of why I chose *Meta-Programming* for my Ph.D. (*i.e.,* Software Engineering as per the ACM ICSS classification) instead of *Machine Learning* (as I always thought it would be). Life has its own way of being ironic and... well... who cares? `¯\_(ツ)_/¯`

In the previous term I had submitted a chess engine as my project for the *"Algorithms and Data Structures"* course; which was when I learned to hate Java's inability to elegantly perform pattern matching and term destructuring[^2]. But now... here it was this whole new language with a whole new way of thinking about programming, where pattern matching[^3] was at the core of its semantics. 

## The Seductive Promise of Logic Programming

So, instead of telling the computer *how* to solve a problem step-by-step (or asking your favourite LLM and then see it failing in the most hilarious ways), you simply describe *what* the problem is and let the computer figure out the solution (*non-stochastically*). Want to find all the ways to arrange a list? In *theory*, you don't write a sorting algorithm: you describe what "sorted" means and ask for arrangements that satisfy that property. In theory...

... It sounds almost too good to be true; just like most things that sound too good to be true[^5]. But we'll get there... First, let's start with the canonical example everyone will show you; something similar to this:

[^5]: I earned my tautology club membership!

```prolog
parent(tom, bob).
parent(tom, liz).
parent(bob, ann).
parent(bob, pat).

grandparent(X, Z) :- parent(X, Y), parent(Y, Z).
```

Then you ask: "Who are Tom's grandchildren?" and the system magically responds with `ann` and `pat`. It's elegant, it's declarative, and it makes you feel like you're programming at a higher level of abstraction than mere mortals.

## This obsession with family members

An unwritten rule of programming languages is to show Fibonnaci as an example of expressiveness and terseness. In the logic programming family of languages, everyone seems to be fixated on family relationships. At some point in my life, I taught Alloy, and one of the canonical examples was to find an `inhabitant` for something that roughly translated this puzzle:

> Can a man be his own grandpa?

Apparently, Alloy preceeded LLM's ability to immitate art, and personifying Dwilight Latham and Moe Jaffe, it answered in verse[^6]:

[^6]: It never occured to me prompt my favourite LLM to answer all my logic questions in Latham and Jaffe's style...

<img src="/assets/grandpa.png" style="width: 100%;" />

> "Now, many, many years ago when I was twenty-three <br>
> I was married to a widow who was pretty as could be <br>
> This widow had a grown-up daughter, had hair of red <br>
> My father fell in love with her and soon the two were wed <br>
> This made my dad my son-in-law and changed my very life <br>
> My daughter was my mother 'cause she was my father's wife <br>
> To complicate the matter, even though it brought me joy <br>
> I soon became the father of a bouncing baby boy <br>
> My little baby then became the brother-in-law to Dad <br>
> And so became my uncle though it made me very sad <br>
> For if he was my uncle, that also made him the brother <br>
> Of the widow's grown-up daughter who of course was my step-mother <br>
> My father's wife then had a son that kept him on the run <br>
> And he became my grandchild for he was my daughter's son <br>
> My wife is now my mother's mother and it makes me blue <br>
> Because she is my wife, she's my grandmother too <br>
> Now, if my wife is my grandmother, then I'm her grandchild <br>
> And every time I think of it, it nearly drives me wild <br>
> For now I have become the strangest case you ever saw <br>
> As husband of my grandmother, I am my own grandpa" <br>

## Thank you. Next...

Personally, not being a huge fan of Beverly Hills-style soap operas, the precise example that I most vividly recall in The-Textbook™ was that of a *Symbolic Differentiation Engine*, and man... I kid you not when blown away I was by the elegance of the solution. It started with some "facts":

[^2]: To this day they refuse to do pattern matching properly. Ergo, Scala.

[^3]: Well... *unification*... but we'll get there.

```prolog
derivative(X, X, s(0)).
derivative(X^s(N), X, s(N)*S^N).
derivative(sin(X), X, cos(X)).
derivative(cos(X), X, -sin(X)).
derivative(e^X, X, e^X).
derivative(log(X), X, 1/X).
```

... and proceeded with some rules:

```prolog
derivative(F+G, X, DF+DG) :- 
  derivative(F, X, DF), derivative(G, X, DG).

...

derivative(F/G, X, (G*DF-F*DG)/(G*G)) :-
  derivative(F, X, DF), derivative(G, X, DF).
```

You could almost read them as equations:

$$
\begin{split}
x\frac{\mathrm{d}}{\mathrm{d}x} &= 0 \\ \\
\text{sin}(x)\frac{\mathrm{d}}{\mathrm{d}x} &= \text{cos}(x) \\ \\
f+g\frac{\mathrm{d}}{\mathrm{d}x} &= \frac{f\frac{\mathrm{d}}{\mathrm{d}x}}{g\frac{\mathrm{d}}{\mathrm{d}x}}
\end{split}
$$

There it was again! It was elegant, it was declarative, it was beautiful, it was... wait; how the hell did this actually *worked*? 

---

To be continued...
