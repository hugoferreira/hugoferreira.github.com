---
layout: post
title: "All gambozinos are white: Part I"
date: 2013-02-19 01:24
comments: true
external-url:
categories: fun mathematics
---

**Abstract.** It is argued that there may be a case where all gambozinos are white.

### Introduction

Most of us learn that there are two types of reasoning, namely deductive and inductive. In deductive reasoning, one usually starts from a general observation (a set of premises) and arguments towards a specific conclusion. For example, from the classic statement *all men are mortal*, along with the observation that *Socrates is a man*, it follows that *Socrates is mortal*. In a more abstract sense, we are asserting that, should a set of things have a certain property [^1], and should something belong to that set, then it must have that same property, i.e. (i) $$\forall_x P(x) \rightarrow Q(x)$$, (ii) $$P($$Socrates$$) \vdash Q($$Socrates$$)$$.

  [^1]: This is formally equivalent to $$\forall_{x \in P} Q(x)$$, but we are being relaxed.

Inductive reasoning, on the other hand, makes generalizations based on individual instances. Imagine that you go outside in a quest to observe the *gambozino*, an animal so rare that it only appears minutes before the sunset in a rainy day. You were lucky to catch three young, white *gambozinos*, drinking water by the lake. Since it is the first time you see one, you assume that, probably, *most gambozinos are white*. In the following days you repeat the feat, and you now seem to be confident that *all gambozinos are white*. Hence, (i) $$P(a) \wedge Q(a)$$, (ii) $$P(b) \wedge Q(b)$$, (iii) $$P(c) \wedge Q(c)$$, (iv) ... $$\forall_x P(x) \rightarrow Q(x)$$?

Of course it doesn't seem valid to assume that, only because you have seen a dozen of gambozinos, all must have the same characteristics. But what if you had observed hundreds, or even millions? Is it sound to begin an argument based on a probability (most), and conclude an universal assertion (all), due to the sheer number of observations?

### Proving an Universal

It was the skeptic Sextus Empiricus who first questioned the validity of inductive reasoning, by positing that a universal rule could not be established from an incomplete set of particular instances:

  > When they propose to establish the universal from the particulars by means of induction, they will effect this by a review of either all or some of the particulars. But if they review some, the induction will be insecure, since some of the particulars omitted in the induction may contravene the universal; while if they are to review all, they will be toiling at the impossible, since the particulars are infinite and indefinite.

According to Sextus Empiricus, only if one had observed all gambozinos could one conclude the universal statement, since even just a single particular would be sufficient to disprove the generalization. Therefore, (i) $$P(a) \wedge Q(a)$$, (ii) $$P(b) \wedge \neg Q(b) \vdash \forall_x P(x) \not\rightarrow Q(x)$$.

### Monotonicity of Entailment

There are other different ways to show that inductive reasoning isn't a valid form of argumentation. For example, let us go back to Socrates and the mortality of men. Suppose Socrates is observed to never die [^2]. We should then reject the conclusion, not because of its form, but because of its premises; either *Socrates isn’t a man*, or *not all men are mortal*. Should we still accept the premises, then Socrates will (someday) die, by the sheer force of our logic.

  [^2]: We may have a practical problem with this premise since, to observe that Socrates never dies, one would have to (i) wait an infinite amount of time, and (ii) be immortal.

Now suppose that we observe more men that don't die. We may add this fact to our list of premises, but we now seem to be in a position of *inconsistency*. Some men die, others don't, and thus being a man isn't sufficient to guarantee its mortality: $$P(x)\not\rightarrow Q(x)$$. We can't even begin to reject the conclusion since our premises are contradictory. Otherwise, no matter how many new premises you add, the conclusion is always a direct *consequence* of the hypothesis.

This characteristic, i.e., that in a consistent argumentation one may add premises without affecting the validity of the conclusion, is called the *monotonicity principle*, and one can see that the inductive reasoning violates it: adding a black *gambozino* rejects the previous conclusion, so (i) $$P(a) \wedge Q(a)$$, (ii) $$P(b) \wedge \neg Q(b)$$, (iii) ... $$\nvdash \forall_x P(x) \rightarrow Q(x)$$.

----