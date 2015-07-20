---
layout: post
title: The Cliff-Hanger
date: 2015-07-20 19:03
comments: true
external-url:
categories: fun mathematics
---

From where he stands, one step toward the cliff would send the drunken man over the edge. He takes random steps, either toward or away from the cliff. At any step his probability of taking a step away is $$^2/_3$$, of a step toward the cliff $$^1/_3$$. What is his chance of escaping the cliff?

**Solution.** Let $$p$$ be the probability of moving towards the cliff ($$←$$), and $$q$$ of moving away ($$→$$). Then:

| outcome               | probability |
|-----------------------|-------------|
| $$←$$                   | $$p$$         |
| $$[→←]←$$               | $$p[1\cdot q^1p^1]$$ |
| $$[→→←←]← \\ [→←→←]←$$  | $$p[2\cdot q^2p^2]$$         |
| $$[→→→←←←]← \\ [→←→←→←]← \\ [→→←→←←]← \\ [→←→→←←]← \\ [→→←←→←]←$$  | $$p[5\cdot q^3p^3]$$         |
| ... | $$p[14\cdot q^4p^4]$$
| ... | ... |

Inside `[]` one can regard the valid combinations of arrows as the same problem of enumerating the valid combinations of balanced `()`'s in an expression. This sequence can be captured using the [Catalan](http://en.wikipedia.org/wiki/Catalan_number) number:

$$\frac{(2 n)!}{(n + 1)! n!}$$

Hence, the probability of the cliff hanger escaping is given by:

$$p+p\sum_{n=1}^{\infty}{\frac{(2 n)!}{(n + 1)! n!}p^n q^n}$$
