---
layout: post
title: Golfing in APL during COVID
date: 2020-04-26 21:18
comments: true
external-url:
categories: Software
---

> A _niven_ number is a non-negative number that is divisible by the sum of its digits. Write a function/method named `niven`, which prints all the _niven_ numbers from 0 to 100 inclusive.

Being in quarantine during the SARS-CoV-2 outbreak is having a massive impact on our everyday lives, particularly in our physical and mental health. It seems one is always working, without any notion of the passage of time. Social distancing meant an increase in social activity in messaging channels, with all sorts of groups spawning into existence. One of them was about _code golfing_, a recreational computer programming competition in which participants strive to achieve the shortest possible source code that implements a particular algorithm. 

The channel started to grow in participants, and everyone was hating Haskell. That was until Rui Gonçalves came up with a solution in APL for a [particular problem](https://github.com/hugoferreira/golf-during-covid/blob/master/day5.md) that was less than 1/3 of the shortest Haskell solution for that day. The rest is history[^1]. In this small post, I will try to explain my rationale from coming up with a working solution written in APL, and shortening it by _incremental refactoring_.

---

For this problem, my first solution was to get the digits of each number, sum them up, and find if they are divisible by checking the modulo to be zero (0). I flirted with using `∧` since it returns the greatest common divisor (GCD) between two numbers, and would allow me to check divisibility by comparing the GCD to the original number. This turned out to be more verbose. So I ended up with the following expression:

```apl
({0=(+/(⌊10|⍵∘÷)¨((10∘*)¨(⍳(⌈10⍟⍵+1))-1))|⍵}¨⍳100)/(⍳100)
```

The explanation is that `⍳(⌈10⍟⍵+1))-1)` generates a zero-based array $[0..]$ with length equal to the number of digits. Then, mapping `(10∘*)` would generate the powers of 10, as $[1, 10, 100, 1000..]$. This was used to get test each digit $a$ since:

$$
\left(\sum_{n=0}^{\lfloor log_{10}a \rfloor}\frac{a}{10^n}\text{ mod }10\right) \text{ mod } a = 0
\equiv \begin{cases}
1 & \text{if divisible,} \\
0 & \text{otherwise.}
\end{cases}
$$

...for which `⌊` gives the floor and `+/` the sum. The first part:

```apl
({0=(+/(⌊10|⍵∘÷)¨((10∘*)¨(⍳(⌈10⍟⍵+1))-1))|⍵}¨⍳100)
```

...thus returns a mask array:

```
1 1 1 1 1 1 1 1 1 1 0 1 0 0 0 0 0 1 0 1 1 0 0 1 ...
```

...and the replicate (dyadic `/`) filters out the elements in `⍳100` given that mask. Now that I had a working solution, it was time to:

$\equiv$ { transform into a function and simplify operators precedence }<br>

```apl
niven←{({0=(+/(⌊10|⍵∘÷)¨(10∘*¨(⍳(⌈10⍟⍵+1))-1))|⍵}¨⍳⍵)/(⍳⍵)}
niven←{({0=(+/(⌊10|⍵∘÷)¨(10∘*¨(⍳⌈10⍟⍵+1)-1))|⍵}¨⍳⍵)/⍳⍵}
niven←{({0=(+/(⌊10|⍵∘÷)¨10*(⍳⌈10⍟⍵+1)-1)|⍵}¨⍳⍵)/⍳⍵}
```

At this point the internet taught be about `f⍣¯1`, which calculates the inverse function of `f`. How can this help? Well, another interesting thing is the _mixed radix conversion_ by dyadic `⊥`. For example `24 60 60 ⊥ 2 5 5` $= 7505 = 2\times60^2 + 5\times60^2 + 5$. This allows to specify the radix for each vector member, and it sums all up. For our case, we have something very similar, but the _mixed radix_ is always 10; for example `10 10 10 ⊥ 1 2 3 ↔ 123`. This can be generalized to `(10⊥⍣3⊢) 1 2 3 ↔ 123`. In our case, we want to go in the other direction. Enter the inverse, with `10⊥⍣¯1⊢ 123 ↔ 1 2 3`.

$\equiv$ { changed strategy to get digits } <br>

```apl
niven←{({0=(+/(10⊥⍣¯1⊢)⍵)|⍵}¨⍳⍵)/⍳⍵}
niven←{({0=(+/10⊥⍣¯1⊢⍵)|⍵}¨⍳⍵)/⍳⍵}
```

$\equiv$ { since monadic `⍸` helps in `(f¨⍳⍵)/⍳⍵ ↔ ⍸f¨⍳⍵` }<br>

```apl
niven←{⍸({0=(+/10⊥⍣¯1⊢⍵)|⍵}¨⍳⍵)}
niven←{⍸{0=(+/10⊥⍣¯1⊢⍵)|⍵}¨⍳⍵}
```

We want to get rid of that extra `()`'s, but the way to get there is not that obvious:

$\equiv$ { since `A|B ↔ B|⍨A` }<br>

```apl
niven←{⍸{0=⍵|⍨(+/10⊥⍣¯1⊢⍵)}¨⍳⍵}
niven←{⍸{0=⍵|⍨+/10⊥⍣¯1⊢⍵}¨⍳⍵}
```

$\equiv$ { distribute modulo, and get rid of map `¨`}<br>

```apl
niven←{⍸0=(⍳⍵)|⍨+/10⊥⍣¯1⍳⍵}
```

... but this would result in a `LENGTH ERROR` due to the way `+/` is evaluated. One trick is to realise that:

$\equiv$ { since `1⊥V ↔ +/V` }<br>

```apl
niven←{⍸0=(⍳⍵)|⍨1⊥10⊥⍣¯1⍳⍵}
```

$\equiv$ { tacit form to get rid of `⍵`, by factoring it out }

```apl
niven←{(⍸0=⍳|⍨1⊥10⊥⍣¯1⍳)⍵}
niven←⍸0=⍳|⍨1⊥10⊥⍣¯1⍳
```

Which results in a solution with just 21 chars, including the function name. For reference, the [shortest solution proposed](https://github.com/hugoferreira/golf-during-covid/blob/master/day6.md) in Haskell at the time of this blog post was 62, and in Python was 72. Here's the result of all nivens between 1 and 100:

```
      niven 100
1 2 3 4 5 6 7 8 9 10 12 18 20 21 24 27 30 36 40 42 45 48 50 54 60 63 70 72 80 81 84 90 100
```

[^1]: Opinions diverge if this was a valid way to preserve our mental health.
