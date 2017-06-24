---
layout: post
title: Square Hunch
date: 2017-06-24 19:30
comments: true
external-url:
categories: Mathematics
---

> Let $a_0, a_1, a_2, ...$ be a sequence of integers, where $a_{m+n} + a_{m-n} = \frac{1}{2}(a_{2m}+a_{2n})$. Given that $a_1 = 1$, what would be the value of $a_{1997}$?

The first time one sees something like this, the first thing one should attempt to do is to *"check out the terrain"*. I would be very tempted to write a computer program to find the values for me, but I seriously need to establish a kind of *ground truth*. So, without futher ado...

**Step 1. Ground Truth**

Let $m = 0$, $n = 0$, then $a_0 + a_0 = \frac{1}{2}(a_0+a_0) \Leftrightarrow	2a_0 = a_0 \Leftrightarrow$<span class='bghighlight'> $a_0 = 0$ </span>. Great, we now have two data points. Can we generalize this?

**Step 2. Find the general equivalence for some fixed values**

Let $n = 0$, then $a_m + a_m = \frac{1}{2}(a_{2m}+a_0) \Leftrightarrow 2a_m = \frac{1}{2}a_{2m} \Leftrightarrow$<span class='bghighlight'> $4a_m = a_{2m}$ </span>. If you are wondering why not choose the equivalent relation $a_m = \frac{a_{2m}}{4}$, it's because I'm usually "peeking" incrementally (i.e. from lower to upper indexes in the sequence), so it's usually more usefull to have something that can provide a solution based on a previous result.

With this result in mind, we can now calculate some values:

| Index | Value |
|-------|-------|
| $a_0$ | $0$ { as calculated } |
| $a_1$ | $1$ { as given } |
| $a_2$ | $4a_1 = 4$ |
| $a_3$ |  |
| $a_4$ | $4a_2 = 16$ |
| $a_5$ |  |
| $a_6$ |  |
| $a_7$ |  |
| $a_8$ | $4a_4 = 64$ |

**Step 3. Fill some holes to get a clear picture**

We know that $3 = 1 + 2$, and we already gathered some values, so let's attempt to calculate $a_3$. Let $m = 2$, $n = 1$, then $a_{2+1} + a_{2-1} = \frac{1}{2}(a_4+a_2) \Leftrightarrow a_3 + 1 = \frac{1}{2}(16+4) \Leftrightarrow $<span class='bghighlight'> $a_3 = 9$ </span>. Wait a minute...

**Step 4. Establish an hypothesis**

Can it be that $a_k = k^2$? If so, then $a_5 = 25$. Shall we try it out? Let $m = 4$, $n = 1$, then $a_{4+1} + a_{4-1} = \frac{1}{2}(a_8+a_2) \Leftrightarrow a_5 + 9 = \frac{1}{2}(64+4) \Leftrightarrow $<span class='bghighlight'> $a_5 = 25$ </span>. Hurray!

**Step 5. Prove it!**

Yeah, yeah... by now most of us would be convinced that we reached an easy solution to get us to $a_{1997}$, but how can we be certain that our hypothesis will not fail with larger numbers? Well, we must prove it... And prove it we will!

**Step 5.1. Choose a proof approach**

Think about it... We are trying to prove *sequences*, and we already know some lower values of the sequence. We want to prove that our hypothesis is valid for every element of the sequence. This smells a lot like *induction*.


**Step 5.2. Induction it is! Test the base case**

That's easy... $0^2 = 0 = a_0$. Also, $1^2 = 1 = a_1$, so that's a good signal.

**Step 5.3. Finalize it**

Suppose our hypotehsis hold for $a_1, a_2, a_3, a_x$. Can we show that it holds for $a_{x+1}$?

$a_{x+1} + a_{x-1} = \frac{1}{2}(a_{2x}+a_{2\times 1})$ <br>
$\equiv$ { since $4a_m = a_{2m}$ } <br>
$a_{x+1} + a_{x-1} = \frac{1}{2}(4a_{x}+a_{2})$ <br>
$\equiv$ { assuming $a_k = k^2$ } <br>
$a_{x+1} + (x-1)^2 = \frac{1}{2}(4x^2+a_{2})$ <br>
$\equiv$ { knowing $a_2 = 4$ } <br>
$a_{x+1} + (x-1)^2 = 2x^2+2$ <br>
$\equiv$ { expanding $(x-1)^2$ and switching sides } <br>
$a_{x+1} = 2x^2+2 - (x^2-2x+1)$<br>
$\equiv$ { simplifying } <br>
$a_{x+1} = x^2+2x+1$<br>
$\equiv$ { simplifying } <br>
$a_{x+1} = (x+1)^2$<br>
$\equiv$ { let $k =x+1$ } <br>
<span class='bghighlight'> $a_k = k^2$ </span>.<br>

**Step 6. Pown that puzzle!**

<span class='bghighlight'> $a_{1997} = 1997^2 = 3988009$ </span>.
