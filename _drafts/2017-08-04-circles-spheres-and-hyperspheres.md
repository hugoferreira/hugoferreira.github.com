---
layout: post
title: Circles, Spheres and Hyper-Spheres
date: 2017-08-04 15:32
comments: true
external-url:
categories: Mathematics
custom_js: hypersphere
custom_css: hypersphere
---

> Consider a unitary, 100-dimensional, hyper-sphere. What proportion of its volume lies within the last 0.01 of its radius?

It's an odd question, no doubt; a 100-dimensional hyper-sphere, whatever that is. But there's a moral to this puzzle that will become evident if we do baby steps:

## Let's dumb this down...

Imagine instead that we wanted to tackle the following simplified version:

> Consider a unitary circle. How much of its area (in %) lies in the last 0.2 of its radius?

It seems easy to calculate this; the area $A$ of a circle of radius $r$ is given by $A_r = \pi\cdot r^2$. Hence:

$\phantom{\equiv}~\frac{A_{[0.8; 1]}}{A_1}$ <br>
$\equiv$ { equal to the difference between the two areas }<br>
$\phantom{\equiv}~\frac{A_1 - A_{0.8}}{A_1}$ <br>
$\equiv$ { by definition }<br>
$\phantom{\equiv}~\frac{\pi - \pi \cdot 0.8^2}{\pi}$ <br>
$\equiv$ { since $\frac{ab-ac}{a} = b-c$ }<br>
$\phantom{\equiv}~1 - 0.8^2 = \class{bghighlight}{0.36}$

Easy! So, **36% of the area** of a circle lies within the **last 0.2 outer ring**. Hmmm... that much? I wonder, what's the proportion of the area that lies within the *first* 0.2 inner ring?

$$\frac{A_{[0; 0.2]}}{A_1} = \frac{A_{0.2}}{\pi} = \frac{\pi \cdot 0.2^2}{\pi} = \class{bghighlight}{0.04}$$

So, the **inner ring of the same thickness contains just 4%** of the total area. Should this come as a surprise? The inner ring is far smaller than the outer ring, isn't it?...

<pre>
  <svg width="206px" height="206px" style="display: block; margin: auto">
    <circle cx="103" cy="103" r="90" style="stroke: hsl(0, 40%, 80%); stroke-width: 20px; fill: none"/>
    <circle cx="103" cy="103" r="100" style="stroke: hsl(0, 40%, 50%); fill: none"/>
    <circle cx="103" cy="103" r="80" style="stroke: hsl(0, 40%, 50%); fill: none"/>
    <circle cx="103" cy="103" r="20" style="stroke: hsl(0, 40%, 50%); fill: hsl(0, 40%, 80%)"/>
  </svg>
</pre>

## Can we have a simulation for table 3, please?

If intuition is failing you, or you think there might be something wrong with our calculations, we can attempt to simulate this by generating a pair of random numbers between [-1, 1], which would correspond to coordinates in a cartesian space delimited by a square of side 2 (and, therefore, with an area of 4). As we approach an infinite number of points, the proportion of those that fall into the circle would give us the area of the circle. How do we know if a point felt inside the circle? Easy... We calculate the distance of that point to the origin, which, according to the Pythagora's theorem, is given by $d_{x,y} = \sqrt{x^2 + y^2}$. If the distance is less than or equal to one, it's inside the circle:

<div class="visualization">
  <span id="hitmap"></span>
  <div class="h-vis">
    <span id="statistics">
      Number of points <span id="iterations">0</span><br>
      Ratio is <span id="ratio">00.00</span>% (real 78.54%)<br>
      Estimated area is <span id="estimated-area">0.000</span> (real 3.141)<br>
      Outer 0.2 ring area is <span id="outer-ring">00</span>% (real 36%)<br>
    </span>
    <span id="histogram"></span>
  </div>
</div>

Click to add <a href="javascript:simulate(100)">100 points</a>, <a href="javascript:simulate(1000)">1000 points</a>, <a href="javascript:simulate(10000)">10000 points</a>, or <a href="javascript:reset()">reset</a> the simulation.

## We shall now go 3D...

> Consider a unitary sphere. How much of its volume (in %) lies in the last 0.01 of its radius?

Let $V_r$ be the volume of a sphere of radius $r$, given by $V_r = \frac{4}{3}\pi\cdot r^3$.