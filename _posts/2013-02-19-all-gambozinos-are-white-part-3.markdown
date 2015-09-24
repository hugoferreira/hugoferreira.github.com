---
layout: post
title: "All gambozinos are white: Part III"
date: 2013-02-19 17:07
comments: true
external-url:
categories: fun mathematics
---

**Abstract.** It is (finally) argued that there may be a case where all gambozinos are white.

### To Induction or not Induction

We have argued that a consistent logic cannot support inductive conclusions based on the observation of instances, so how is mathematical induction reconciliated with logic? The trick is very simple; mathematical induction on natural numbers is actually a form of deductive reasoning, as shown in the following second-order clause:

$$\forall_{P, (b, k, n) \in \mathbb{N}} [\exists_b P(b) \wedge (\forall_{k \geq b} P(k) \rightarrow P(k+1)] \rightarrow \forall_{n \geq b} P(n)$$

...where $$P$$ is any proposition, $$b$$, $$k$$ and $$n$$ are natural numbers, and $$b$$ assumes the lowest value for which $$P$$ holds (usually $$0$$ or $$1$$). Remember Socrates and the mortality of men? The concept here is very similar. One asserts that, for every proposition $$P$$, if an individual has a certain property, the next individual also has that property. Since we know (by observation) that the first individual in a series has the property, then it follows that every individual has that same property. The universal statement is a consequence of the established premises, and not a generalization based on individual case analysis. QED.

### All Gambozinos are White

This form of induction does not necessarily involve numbers; one can actually generalize it to any type of *well-founded* structure, i.e., any structure whose elements relate to each other in a finite number of ways, essentially creating a "chain". Back to *gambozinos*, imagine that you are able to assert that (i) if a *gambozino* is white, its descendants will always be white, and (ii) the first two *gambozinos* to exist were white [^1]. Then, by the nature of the structure that rules the *gambozino* ascendency, all *gambozinos* are proven to be white [^2].

  [^1]: There are actually premises that we've disregarded for the sake of simplicity, such as (iii) except for the first two of them, a *gambozino* can only exist through sexual reproduction, and (iv) the parenthood of a *gambozino* is an anti-simetric, anti-reflexive and anti-transitive relation.

  [^2]: Unless genetic manipulation is allowed, but then you would be attacking the premise, not the conclusion.

### Conclusion

Mathematical induction is a powerful tool in deductive reasoning that allows to prove properties of an infinite number of elements without having to actually observe every one of them. It works whenever the elements we are dealing with are part of a well-founded relation, and we are able to assume properties over that relation. Mathematical induction is thus well beyond inductive reasoning, able to assert the *veracity* of an argument over its mere *plausibility*.

Read back [Part II](/fun/mathematics/2013/02/19/all-gambozinos-are-white-part-2.html) or [I](/fun/mathematics/2013/02/19/all-gambozinos-are-white.html).

----
