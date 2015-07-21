---
layout: post
title: Successive Wins
date: 2015-07-21 16:33
comments: true
external-url:
categories: fun mathematics
---

To encourage Elmer's promising tennis career, his father offers him a prize if he wins (at least) two tennis sets in a row in a three-set series to be played with his father and the club champion alternately: father-champion-father or champion-father-champion, according to Elmer's choice. The champion is a better player than Elmer's father. Which series should Elmer choose?

## Solution

Let $p_F$ be the probability of winning the father and $p_C$ the probability of winning the champion, where $p_F < p_C$. The winning outcomes for the first scenario (F-C-F) are:

| outcome     | probability       |
|-------------|-------------------|
| $F_0C_1F_1$ | $p_F~p_C~(1-p_F)$ |
| $F_1C_1F_0$ | $p_F~p_C~(1-p_F)$ |
| $F_1C_1F_1$ | $p_F~p_F~p_C$     |

And thus $p_F~p_C~(1-p_F) + p_F~p_C~(1-p_F) + p_F~p_F~p_C = p_C~p_F~(2 - p_F)$.

For the second scenario (C-F-C):

| outcome     | probability       |
|-------------|-------------------|
| $C_0F_1C_1$ | $p_C~p_F~(1-p_C)$ |
| $C_1F_1C_0$ | $p_C~p_F~(1-p_C)$ |
| $C_1F_1C_1$ | $p_C~p_C~p_F$     |

Where $p_C~p_F~(1-p_C) + p_C~p_F~(1-p_C) + p_C~p_C~p_F = p_C~p_F~(2 - p_C)$. Hence:

$$
\begin{align}
p_C~p_F~(2 - p_F) & \stackrel{?}{=} p_C~p_F~(2 - p_C) \\
2 - p_F & \stackrel{?}{=} 2 - p_C \\
p_F & < p_C
\end{align}
$$

QED.
