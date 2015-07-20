---
layout: post
title: "All gambozinos are white: Part II"
date: 2013-02-19 03:05
comments: true
external-url:
categories: fun mathematics
---

**Abstract.** It is (still) argued that there may be a case where all gambozinos are white.

### There are Infinitely Many Primes

In inductive reasoning, the premises do not guarantee the conclusion, although they may give it some probability or plausibility. In order to prove an universal claim one have to observe every instance of that claim, or else assume it as a (potentially refutable) hypothesis.

But, mathematicians keep proving things about numbers without actually observing every one of them. For example, while it is only believed that every even number is a sum of two primes [^3], it is actually known that there is an infinite number of primes. So, if it is true that mathematical induction involves a sort of generalization, how can we ensure its validity within a logical framework?

  [^3]: Actually, the Goldbach conjecture is a fine example of how mathematical induction is different from simple induction. It states that *every even integer greater than 2 can be written as the sum of two primes,* e.g. 10 = 7 + 3. But despite no even number ever found violates this rule, the conjecture remains mathematically unproven.

Mathematical induction is actually a very different type of reasoning, and the art goes as back as 2000 years. Euclid is recognized as probably the first one to have implicitly used it for proving that there are infinitely many primes. The reasoning is similar to the following (from [Wikipedia](http://en.wikipedia.org/wiki/Euclid's_theorem)): suppose you were searching for prime numbers, and you had already collected a very fine list of them, $$p_1, p_2, ... , p_n$$. Let $$P$$ be the product of all the prime numbers in the list, $$P = p_1 p_2 ... p_n$$. Let $$q = P + 1$$. Then, $$q$$ is either prime or not: (i) if $$q$$ is prime then there is at least one more prime than is listed, and (ii) if $$q$$ is not prime then some prime factor $$p$$ divides $$q$$. This factor $$p$$ is not on our list: if it were, then it would divide $$P$$ (since $$P$$ is the product of every number on the list); but as we know, $$p$$ divides $$P + 1 = q$$. Then $$p$$ would have to divide the difference of the two numbers, which is $$(P + 1) - P = 1$$. But no prime number divides $$1$$ so there would be a contradiction, and therefore $$p$$ cannot be on the list. This means at least one more prime number exists beyond those in the list. QED.

### Mathematical Induction

The above proof is based on a very particular type of structure inherent to natural numbers, and it is precisely that structure that allows us to prove something *for every number*, despite there are infinitely many of them. Let us delve a little bit more on how a proof by induction works before coming back to logic. Suppose you want to prove that the following statement holds for all natural numbers $$n$$:

$$0 + 1 + 2 + ... + n = \frac{n(n+1)}{2}$$

The proof consists of two distinct (but intertwined) steps: first, we show that the statement holds when $$n$$ is equal to the lowest value that $$n$$ is given in the original statement, that is when $$n = 0$$:

$$0 = \frac{0(0+1)}{2}$$

Then we need to show that, if the statement holds for some $$n$$, then the statement also holds in the subsequent of n, i.e. when $$n + 1$$ is replaced by $$n$$:

$$0 + 1 + ... + k + (k + 1) = \frac{(k+1)((k+1)+1)}{2}$$

Using equation 1, we can rewrite the left-hand side, so all that remains is to (algebraically) prove the equality:

$$\frac{k(k+1)}{2} + (k + 1) = \frac{(k+1)((k+1)+1)}{2}$$

which is trivial. Therefore (1) holds. QED.

### The Falling of Dominoes

The previous application of induction is based on the fact that every natural number is *connected* to every other by a known rule: summing. In fact, if you take the lowest of the natural numbers 0, and keep adding 1 to the result, you will eventually reach *every* natural number that it exists. Therefore if you prove that (i) if any arbitrary number $$k$$ has a property $$P$$, then $$k + 1$$ must also have that property, and (ii) the lowest of those numbers has $$P$$, then it follows that every number $$n$$ has that property.

And here lies the slight of hand! Mathematical induction is similar to the sequential effect of falling dominoes. Put every one of them in a line, and prove that, if an arbitrary domino falls, the one next to him must fall [^4]. Then push the first one and, voilá: *every one of them falls*.

  [^4]: This may seem tricky, but you could assume some form of consistent newtonian physics, and a fixed distance between pieces.

----