---
layout: post
title: Non-Transitive Probabilities
date: 2015-09-12 22:22
comments: true
external-url:
categories: fun mathematics puzzle
---

> John and Mark decide to play a game. They throw a coin three times. If it comes back `HHH` John wins; if the result is `THH` then Mark wins. Otherwise they both loose. What is the probability that each of them wins?

## Tossing coins

<div class="sidenote" markdown="1">

The *[gambler's fallacy](https://en.wikipedia.org/wiki/Gambler%27s_fallacy)*: the belief that if something happens more frequently than normal during some period, it will happen less frequently in the future.

</div>

If you thought *"the same"*, then you're right. The probability for both of the above sequences is $\left(\frac{1}{2}\right)^3 = \frac{1}{8} = 0.125$. The coin is memoryless; it doesn't care what was its previous results and so the probability of `HHH` is exactly the same as any other arbitrary sequence of heads and tails such as `THH` or `HTH`. It is only due to human being's ability to easily recognize such patterns that a series of heads, such as `HHHHHHHHHH`, would hardly be recognized as arbitrary as `HTHHTTHTHT`, despite the fact that they both occur once every $2^{10} = 1024$ sequences of tosses. This very simple misinterpretation of statistics has lead to the widespread of the *gambler's fallacy*.

Let's change the game a little bit:

> John and Mark now decide to flip a coin until one of the patterns appear. Who has the higher probability of winning?

In other words, what's the probability for `HHH` and `THH` occurring first in an (potentially) infinite sequence of coin tosses? Most people would assume to be the same, but in fact `THH` has an higher chance of winning that `HHH`!.. Say wat? If you don't believe me, run the following Scala program:

{% highlight scala %}
import scala.util.Random

val choices = List('H, 'T)
val p1 = List('H, 'H, 'H)
val p2 = List('T, 'H, 'H)

def findWinner(p1r: List[Symbol], p2r: List[Symbol]): Symbol = {
  if (p1r.isEmpty) 'P1
  else if (p2r.isEmpty) 'P2
  else {
    val toss = Random.shuffle(choices).head
    val nextP1 = if (p1r.head == toss) p1r.tail else p1
    val nextP2 = if (p2r.head == toss) p2r.tail else p2
    findWinner(nextP1, nextP2)
  }
}

val simulate = (1 to 10000).map { _ => findWinner(p1, p2) }
println("Player 1 won " + simulate.count { _ == 'P1 })
println("Player 2 won " + simulate.count { _ == 'P2 })
{% endhighlight %}

Here's the results for one of the runs:

    Player 1 won 3685
    Player 2 won 6315

In fact, for every sequence you bet, I'm able to derive a better, or at least one as probable as yours.

## Non-transitiveness

Before explaining what is going on, let's try a different game. Suppose we have three dice with the following numbers:

    Die A: 1 1 4 4 4 4
    Die B: 3 3 3 3 3 3
    Die C: 2 2 2 2 5 5

We both have to choose one die and the one that rolls the higher value wins. Which die would you pick? Some people would choose the one that has an higher expected value. Doing the math:

| Die | $\mathbb{E}$                              |
|:---:|:-----------------------------------------:|
|  A  | $\frac{1}{6}(1 + 1 + 4 + 4 + 4 + 4) = 3$  |
|  B  | $\frac{1}{6}(3 + 3 + 3 + 3 + 3 + 3) = 3$  |
|  C  | $\frac{1}{6}(2 + 2 + 2 + 2 + 5 + 5) = 3$  |
|-----|-------------------------------------------|

Funny... All have the same expected value, so it shouldn't matter, right?

Let's suppose you pick die `B`. I would pick die `A` and beat you with a probability of $\frac{24}{36}$. You decide to pick `A` then. That's fine, I'll pick `C` and win with odds of 20:16. Want to pick `C` then? Sure, I'll go for `B` and you'll win just one third of the throws.

<div class="sidenote" markdown="1">
Recall that a binary relation $R$ over a set $X$ is transitive *iff* $aRb \wedge bRc \implies aRc$.
</div>

That's strange, isn't it? There's not *best die*; just because `A` is a better die than `B`, and `B` than `C`, it doesn't mean that `A` will be better than `C`. In fact, it will loose most of the times. Behold an example of *non-transitive* probabilities! As always, we can check our sanity with a small Scala program:

{% highlight scala %}
import scala.util.Random

val dieA = List(1, 1, 4, 4, 4, 4)
val dieB = List(3, 3, 3, 3, 3, 3)
val dieC = List(2, 2, 2, 2, 5, 5)

def roll(die: List[Int]) = Random.shuffle(die).head

val AvsB = (1 to 10000).map { _ => if (roll(dieA) > roll(dieB)) 'A else 'B }
val BvsC = (1 to 10000).map { _ => if (roll(dieB) > roll(dieC)) 'B else 'C }
val CvsA = (1 to 10000).map { _ => if (roll(dieC) > roll(dieA)) 'C else 'A }

println(s"A (${AvsB.count(_ == 'A)}) vs B (${AvsB.count(_ == 'B)})")
println(s"B (${BvsC.count(_ == 'B)}) vs C (${BvsC.count(_ == 'C)})")
println(s"C (${CvsA.count(_ == 'C)}) vs A (${CvsA.count(_ == 'A)})")
{% endhighlight %}

Here are the results from one of the runs:

    A (6641) vs B (3359)
    B (6650) vs C (3350)
    C (5586) vs A (4414)

To be continued...
