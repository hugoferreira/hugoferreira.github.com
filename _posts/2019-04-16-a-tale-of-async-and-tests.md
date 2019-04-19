---
layout: post
title: A Tale of Tests and Fools in the Land of Asynchronicity
date: 2019-04-16 19:15
comments: true
external-url:
categories: Software
---

> *The first principle is that you must not fool yourself – and you are the easiest person to fool.* — Richard Feynman

This story begins early in 2018 as I was trying to wrap my head around Javascript's (in particular, NodeJS) [Event Loop](https://nodejs.org/es/docs/guides/event-loop-timers-and-nexttick/). 

## A single threaded universe

Most modern (as well as old) languages provide an apparatus for the developer to manage the multi-core, multi-processing machinery at our current disposal. Typically, one can easily `fork()` the process and/or use [Threads](https://en.wikipedia.org/wiki/Thread_(computing)). Of course, once you get into [concurrency](https://en.wikipedia.org/wiki/Concurrency_(computer_science)) wonderland, you start requiring [Inter-process Communication](https://en.wikipedia.org/wiki/Inter-process_communication) (IPC) primitives such as [Locks](https://en.wikipedia.org/wiki/Lock_(computer_science)) and [Semaphores](https://en.wikipedia.org/wiki/Semaphore_(programming)); which, incidentally, are part of most standard libraries and OS's APIs such as POSIX. Some languages go as far as already providing [Thread Pools](https://en.wikipedia.org/wiki/Thread_pool). And [a](https://www.ponylang.io) [few](https://akka.io) [of](https://en.wikipedia.org/wiki/Erlang_(programming_language)) [them](https://elixirschool.com/en/lessons/advanced/concurrency/) push the boundaries of abstraction as they unveil the wonders of the [Actor Model](https://en.wikipedia.org/wiki/Actor_model) of concurrency.

But Javascript is none of them...

For historical reasons, Javascript inhabits this comfortable world of single-threaded applications (one that [might please](http://www.informit.com/articles/article.aspx?p=1193856) Donald Knuth[^8]). One instruction is followed by another, and another, and another... all in sequence, all completely deterministic; all according to 99% of developers' mental models of how a computer should work. It's a simple and effective abstraction if it wasn't for a small detail:

[^8]: Despite being a genious way beyond most of our capabilities, Donald Knuth said the following (unfortunate) words during a 2008 interview: *"Let me put it this way: During the past 50 years, I’ve written well over a thousand programs, many of which have substantial size. I can’t think of even five of those programs that would have been enhanced noticeably by parallelism or multithreading. Surely, for example, multiple processors are no help to TeX..."*

| | Latency (ns) |
|-----------------------|-----:|
| L1 cache reference	| 0.5 |
| Branch mispredict	| 5.0 |
| L2 cache reference	| 7.0 |
| Mutex lock/unlock	| 25.0 |
| Main memory reference	| 100.0 |
| Compress 1K bytes with Zippy	| 3,000.0 |
| Send 1K bytes over 1 Gbps network	| 10,000.0 |
| Read 4K randomly from SSD	| 150,000.0 |
| Read 1 MB sequentially from memory	| 250,000.0 |
| Round trip within same datacenter	| 500,000.0 |
| Read 1 MB sequentially from SSD	| 1,000,000.0 |
| Disk seek	| 10,000,000.0 |
| Read 1 MB sequentially from disk	| 20,000,000.0 |
| Send packet CA > Netherlands > CA	| 150,000,000.0 |

You see, doing things require *time*[^1]. We might be doing CPU-heavy stuff or I/O-heavy stuff. But Javascript *things* tend to be bound not by CPU but by I/O. It is only natural: it's *the* language of the web, so most of the time it is manipulating resources through this big network we call the Internet.  

[^1]: Actually, it requires two *types* of time: the time to *do* it, and the time to *communicate* it. For all purposes of this rant, the *total time* is the sum of these two things.

A single-thread application can only be doing one thing at a time: either it is waiting (blocked) for a resource to become available (like downloading 3Mb from a server in CA), or it is computing some fancy animation on the screen. But *not* both. Do you see the pickle?

Fast-forward a few potential discussions in committees and mailing-lists, and a simple solution emerged: if most of the things Javascript is doing is bound by I/O, then abstract I/O away from the user (and possibly make it take advantage of multithreading) while keeping the user's application single-threaded. In other words, make I/O non-blocking. 

If you are *really* paying attention, this *per se* solves absolutely nothing. One can abstract away I/O, in the sense that one can say *"fetch this for me while I go on with my life"* but the application still needs a way to know that a resource has become available[^9]: *"here it is what you requested, my lord"*. If the application's single-thread is busy, 100% focused, on doing other stuff, how can it be disturbed by the I/O subsystem?

[^9]: Unless you consider [polling](https://en.wikipedia.org/wiki/Polling_(computer_science)) and [busy-waiting](https://en.wikipedia.org/wiki/Busy_waiting) as a solution.

Well, it can't...

To solve this second pickle, one must recognise that most Javascript scripts (pun intended), are not always doing stuff. They *might* be doing stuff when the user clicks something; or scrolls the page; or 60 times per second if there's an animation occurring at 60fps. Otherwise, the script is (usually) supposed to be idle. And it is during this idleness that the I/O subsystem can take advantage to interrupt the flow. *Lo and behold* the [Event Loop](https://nodejs.org/es/docs/guides/event-loop-timers-and-nexttick/) is born.

## The Event Loop

An event loop is just... an (endless?) loop. It does *stuff* in a certain order, and when it gets to the end, it starts all over. According to the [Node.js documentation](https://nodejs.org/es/docs/guides/event-loop-timers-and-nexttick/#event-loop-explained), this is what the event loop looks like:

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

Each of these phases has a [FIFO queue](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) of [callbacks](https://en.wikipedia.org/wiki/Callback_(computer_programming)) to execute. Notwithstanding each phase's specificities, its callbacks are executed in order until (a) its queue has been exhausted, or (b) a maximum number of callbacks has been reached; after which the event loop will move to the next phase, *ad nauseam*.

## Call me Maybe

"*You, sir, are talking about these **callbacks**. What the bloody hell is a **callback** anyway?*" That's an excellent question my friend; I am absolutely delighted you have inquired about such wonderful invention! A [callback](https://en.wikipedia.org/wiki/Callback_(computer_programming)), as the name implies, is a way to give *something*, typically a function[^2], to *otherthing* and expect it to call... back... once it decides to do so. In other words, it's like saying: *"please execute this after you find appropriate to do so"*[^3]. If you have ever coded something in Javascript, you'll certainly recognize this pattern immediately:

[^2]: Some stubborn languages, like Java, didn't knew how to pass functions as arguments for a long time. So the poor fellows wrapped up these functions in a (potentially anonymous) class with a well-known interface, instantiated an object, and passed that object instead. For all intended purposes — and notwithstanding scope and environment limitations that proper [closures](https://en.wikipedia.org/wiki/Closure_(computer_programming)) solve — we might also call these callbacks.

[^3]: Why do I insist on using words like "decides" and "find appropriate"? Why not simply saying "when you've finished"? Well, because it's not true.

```javascript
setInterval(function() { console.log("Another one bites the dust") }, 1000)
```

The `function() {...}` part is our callback, and what `setInterval` essentialy does is to add it to the FIFO of timers. Here's another one:

```javascript
document.getElementById("myBtn").onclick = function() { console.log("We Click ^.^" ) }
```

This is a different type of callback (that requires a [DOM](https://en.wikipedia.org/wiki/Document_Object_Model)), but the same principles apply. The callback is added to a FIFO somewhere, and once the user clicks on the button, it gets called. Here's some example using I/O:

```javascript
require('fs').readFile('./data.csv', function read(err, data) {
    console.log(data)
})

console.log("I win!?")
```

As an exercise for the reader, think about what you are expecting to appear on the screen first: the contents of the file, or the sentence **"I win!?"**.

## And your point is...

Indeed, I digress. So, early 2018, I was [trying to understand](https://stackoverflow.com/questions/50382553/asynchronous-bounded-queue-in-js-ts-using-async-await) how non-blocking single-threaded event-loop based javascript worked. My desiderata was simple: (a) to have a pair of producer/consumers exchanging messages, (b) via a bounded buffer, (c) where the consumer would *only* block if there was no message available to consume, and (d) the producer would *only* block if the buffer was full. This meant implementing something like:

{% highlight typescript linenos %}
class AsyncQueue<T> {
    private queue = Array<T>()
    
    constructor(public readonly maxSize: number) { }

    async enqueue(x: T) {
        if (this.queue.length > this.maxSize) {
            // Block until available
        }

        this.queue.unshift(x)
    }

    async dequeue() {
        if (this.queue.length == 0) {
            // Block until available
        }

        return this.queue.pop()!
    }
}
{% endhighlight %}

The first rule of the Developer's Club is: you don't talk about the Developer's Club. The second rule is: **whatever the problem you have at hand, someone else already tried to do it... Better than you... Deal with it!**

## The Producer-Consumer problem

This was no exception, as one can easily find the [Producer-Consumer problem](https://en.wikipedia.org/wiki/Producer–consumer_problem) in Wikipedia. Probably someone already had a library in `npm` readily available. But I was trying to *learn*, not just getting on with my life. So, after studying the problem, I learned two things:

1. That it is very easy (no shit, sherlock) to write wrong implementations. Indeed, *"an [inadequate solution](https://en.wikipedia.org/wiki/Producer–consumer_problem#Inadequate_implementation) could result in a deadlock where both processes are waiting to be awakened"*;

2. That the most trivial way to solve this would be to use a *Semaphore*[^4]. 

Let that sink in... A *Semaphore*, an IPC primitive, in a single-threaded application.

[^4]: Well, *two* semaphores.

## A Side-Quest with Semaphores

The easiest way to explain a semaphore is to imagine trying to park your car in a crowded mall. The semaphore allows people to get *into* the park *while* there's still spaces left (we call these **permits**). Once it gets to **zero**, tough luck: you'll have to **wait**. Until someone exits the park and **signals** a free spot, that is. In other words, a Semaphore adheres to the following contract:

```typescript
interface AsyncSemaphore {
    signal(): void
    async wait(): Promise<void>
}
```

Why is the `wait()` marked as `async` you ask? Well, because I don't want to block my code *until* the semaphore says there are now free parking spaces. Remember: we are living on a **single threaded** universe, and all *userland code*, including our implementation of a Semaphore, is treated the same way, running in the same thread. There's no possible way for the semaphore to *even check* if there are free spaces, since we are *blocked* in the line waiting for such thing to happen. So, yes, a deadlock would occur. The solution is to pass a callback saying: *"hey, once there's a permit I can use, call me"*. If you don't understand the relationship between Callbacks, [Promises](https://en.wikipedia.org/wiki/Futures_and_promises) and [Async/Awaits](https://en.wikipedia.org/wiki/Async/await), it's study time. Thus, I found my first solution to the AsyncSemaphore challenge:

{% highlight typescript linenos %}
class AsyncSemaphore {
    private promises = Array<() => void>()

    constructor(private permits: number) {}

    signal() {
        this.permits += 1
        if (this.promises.length > 0) this.promises.pop()()
    }

    async wait() {
        if (this.permits == 0 || this.promises.length > 0)
            await new Promise(r => this.promises.unshift(r))
        this.permits -= 1
    }
}
{% endhighlight %}

## The Producer-Consumer: Part II

The subsequent solution to the producer–consumer problem simply tracks the state of the queue with two semaphores: `emptyCount`, the number of empty places in the queue, and `fullCount`, the number of elements in the queue. Two invariants must be preserved: (1) `emptyCount` must always to be lower or equal to the actual number of empty places in the queue, and (2) `fullCount` must always be lower or equal to the actual number of items in the queue. If one wants to relax on the size of the buffer (thus allowing an infinite-length queue), then a single semaphore would be more than enough. And that's exactly where I started from:

{% highlight typescript linenos %}
class AsyncQueue<T> {
    private queue = Array<T>()
    private waitingEnqueue: AsyncSemaphore

    constructor(readonly maxSize: number) {
        this.waitingEnqueue = new AsyncSemaphore(0)
    }

    async enqueue(x: T) {
        this.queue.unshift(x)
        this.waitingEnqueue.signal()
    }

    async dequeue() {
        await this.waitingEnqueue.wait()
        return this.queue.pop()!
    }
}
{% endhighlight %}

Proud of my code, I made some tests, answered my own question on Stackoverflow[^5], and all was good. I finished my post with the following sentence: *"I'm still not sure this doesn't reintroduce subtle bugs, without extensive testing"*.

[^5]: It's more common than you might think.

## A Tale of Tests

Back to our main story: how do we know that the implementation is correct? As of today, I have 11 upvotes on the question, 6 upvotes on the answer. It surely doesn't seem like a pressing issue, indeed. But I recently gave the same challenge to my students so we could all share the joys of banging our heads against a wall. It should not come as a surprise that they found my solution on Stackoverflow, and copy-pasted the code *as-is*[^6].

[^6]: This is not a bad thing *per se*. The challenge was part of a [larger set of exercises](https://github.com/hugoferreira/asso-pipes-and-stuff-v19), and the idea was for them to realize that one thing is to *think* you understand asyncronicity, and another is to *realize* that we are only humans after all.

Did I tested it? I surely did! At some point, I even provided a "statistical test" that generated random permutations at will of `enqueues()` and `dequeues()`:

{% highlight typescript linenos %}
async function testAsyncQueueBehavior(nOps: number): Promise<Boolean> {
    const result = new Array<number>()
    const q = new AsyncQueue<number>()

    const enqueue = (m: number) => q.enqueue(m)
    const dequeue = () => q.dequeue()
    const promises = Array<Promise<void>>()

    let enqueues = 0
    let dequeues = 0

    // Do a random permutation of enqueing and dequeing
    for (let i = 0; i < nOps; i += 1) {
        if (Math.random() > 0.5) {
            enqueues += 1
            enqueue(enqueues)
        } else {
            dequeues += 1
            promises.push(dequeue().then(v => { result.push(v) }))
        }
    }

    const pending = Math.min(enqueues, dequeues)
    await Promise.all(promises.slice(0, pending))

    // Length should be equal minimum between enqueues and dequeues
    const isLengthOk = pending === result.length 

    // Messages should be ordered
    const isSorted = isArraySorted(result)

    return isLengthOk && isSorted
}
{% endhighlight %}

As far as I knew, my code passed these tests... Repeatedly. My students used this for their own implementations until they eventually found my code. They used it, and up until now no-one has complained.

## On Human Intuition

I like to think our brain has a working mode akin to a [Generative adversarial network (GAN)](https://en.wikipedia.org/wiki/Generative_adversarial_network). Part of my mind (the *code-monkey*) is generating solutions; sometimes faster than my fingers can type. The IDE, the REPL, the compiler's type-system, the tests... All those systems are there to guide the *code-monkey* in ensuring he is doing his *thing right*. This is my "generative" neural network.

Then there's a second part which has no control of my fingers. It sits in the background, glances over the code, and provides me a faint signal — more like a feeling, actually — if I am doing the *right thing*. This is my "discriminative" network.

Daniel Kahneman alludes to this dichotomy between two modes of thought in his best-seller [Thinking, Fast and Slow](https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow): "System 1" is fast, instinctive and emotional; "System 2" is slower, more deliberative, and more logical. I am not sure Kahneman systems and my metaphor are a perfect fit, but...

All this time, my *discriminative* system kept telling me: there might be something wrong with your solution, but I don't know what. How can that be? Tests are passing and students aren't complaining.

## A Tale of Fools

Eventually I gave the exact same problem to my friend and colleague [André Restivo](https://web.fe.up.pt/~arestivo/page/). He grabbed his trusty ThinkPad and started coding away. At some point, he thought to have arrived at a solution that didn't made usage of Semaphores. I claimed that, somewhere, somehow, he would be emulating the same logic of a Semaphore; just disguised as something else. I provided my testing function, and as expected — expected by me, that is — it failed.

The thing is that we didn't just wanted it to fail. We wanted to know *how* it failed, and so we started tracing to the console the particular permutation that lead to the failure: one freaking hundred invocations of `enqueue()` and `dequeue()`. This is stupid, we thought. Well, just try and shrink the number of maximum operations to four (because... reasons), and run the test until it fails. And fail it did, with the following sequence of operations:

```
Dequeue() // #1
Enqueue()
Dequeue() // #2
Dequeue() // #3
```

The particular problem at hand was that his implementation was not blocking `#2` as expected, but instead triggering both the callbacks of `#1` and `#2`. André joked away: *"Well, the problem is in your test!"*

Such hypothesis didn't make his implementation work any better, in my defense. We meticulously pinned out why it was failing. But it made me think: *how certain was I that this particular permutation happened before while testing my own code? What other buggy permutations may be lurking around without my awareness?*

I have taught *"Formal Methods in Software Engineering"* for some years. One of the tools we used was Daniel Jackson's [Alloy Analyzer](http://alloytools.org), which *"provides a declarative specification language for expressing structural constraints and behavior of software systems"*. Implementing a full system in Alloy is a pain in the ass, but there was something that I always enjoyed when using it: it gave me concrete *counter-examples*. 

Moreover, Daniel allured to this *"small-scope hypothesis"* as underlying the confidence in Alloy's results. In essence, it claims that *"most inconsistent models have counterexamples within small bounds"*. Remember our strategy of *shrinking* the counter-example? It seems our intuition also believes the hypothesis to be true.

But I was **not** going to implement the consumer-producer problem in Alloy, for two reasons: (1) it's a well-known problem that was proved to be correctly solved, and (2) I wasn't interested in testing its *abstract solution*, but my *concrete implementation*, with Javascript's Event Loop and all.

## Property-based Testing

Remember the second rule of the Developer's Club? Let me introduce you to [fast-check](https://www.npmjs.com/package/fast-check). This library allows you to check the truthfulness of properties in your code. What is a property, you ask? Well, it's something like *for all (x, y, ...) such as precondition(x, y, ...) holds, property(x, y, ...) is true*.

Let's provide a simple example. Imagine you've just written an amazing function that checks if a certain *pattern* is present in a given string:

```javascript
const contains = (text, pattern) => text.indexOf(pattern) >= 0;
```

Usually you would go are write some tests like:

```javascript
assert(contains('Look ma, no tests', 'tests'))
assert(contains('Look ma, no tests', 'ma'))
assert(contains('Look ma, no tests', 'Look'))
```

When should you stop? What makes you believe that it will work for any (all?) combinations of strings and substrings? What makes you sure you aren't just testing the results that *you know* to work (even if somewhat subconsciously)[^7]? It's a pickle.

[^7]: It's a pickle that lead to one of the TDD tennets: you write your tests *before* you write your implementation.

With property-based testing, you would write:

```javascript
const fc = require('fast-check')
fc.assert(fc.property(fc.string(), text => contains(text, text)))
```

Fast-check bases itself on the notion of *arbitraries*. An `Arbitrary<T>` is a generator of `T`'s. How does it know how to generate `T`'s? Well, someone (which might have been you) coded it in such a way that given a random number, it would produce a deterministic uniform distribution of random `T`'s. Fast-check already provides us with [built-in arbitraries](https://github.com/dubzzz/fast-check/blob/master/documentation/1-Guides/Arbitraries.md) to generate natural numbers, booleans, strings and arrays of stuff... amongst others. Then, it is up to its internal engine (which is called using `property()`) to check that our property remains valid for any arbitrary input.

If all it did was generate random stuff, it wouldn't be any better than my "statistical test". So it does some additional clever things. First, fast-check also believes in the *small-scope hypothesis*: arbitraries may be *statistically biased* towards typical problematic situations. In the case of integers, you know the drill: `0`, `1`, `-1`, `-Infinity` and `+Infinity` are the usual suspects. Second, values generated by an `Arbitrary<T>` may also provide a `shrink(prev: Ts): Stream<Ts>` function, which may be used to *shrink* a counter-example once it has been found.

## A Test for AsyncSemaphore

Let's implement a test for the AsyncSemaphore. We start by specifying how to generate a test:

{% highlight typescript linenos %}
import { assert, asyncProperty, nat as aNat, array as anArray, boolean as aBoolean } from 'fast-check'

assert(
    asyncProperty(
        aNat(10),
        anArray(aBoolean().map(b => b ? 'S' : 'W'), 100),
        async (size, ops) => testSemaphore(size, ops)),
        { numRuns: 1000 })   
{% endhighlight %}

What we are basically saying is that we want to generate arbitrary semaphores with permits up to 10, and arbitrary sequences of `wait()` and `signal()`. The sequence can be easily derived from an arbitrary array of booleans (up to size 100), where `true` is mapped to `signal()` and `false` to `wait()`. Then, we test our semaphore for *well-behaveness*:

{% highlight typescript linenos %}
async function testSemaphore(size: number, ops: Array<'S' | 'W'>) {
    const sem = new AsyncSemaphore(size)
    const res = Array<boolean>()
    const promises = Array<Promise<void>>()

    let signals = 0, waits = 0

    for (const op of ops) {
        if (op === 'S') {
            signals += 1
            sem.signal()
        } else {
            waits += 1
            promises.push(sem.wait().then(() => { res.push(true) }))
        }
    }

    await Promise.all(promises.slice(0, signals + size))
    
    return res.length === Math.min(signals + size, waits)
}
{% endhighlight %}

In other words, given any sequence of `signal()` and `wait()` operations, there can only be as many `wait()`'s solved as there was `signal()`'s, plus the initial permits.

## Eureka!

As soon as I ran this, I got the following result:

```
catch Error: Property failed after 4 tests 
{ seed: 1474060413, path: "3:0:1:0:1:2:1:1:0:3", endOnFailure: true } 
Counterexample: [0,["W","S","W"]] 
Shrunk 9 time(s) 
Got error: Property failed by returning false 
```

So, not only my semaphore doesn't work as expected (!) but the counter-example is embarassingly simple: `wait()`, `signal()`, `wait()`, on a semaphore initialized with `permits = 0`. Why!? 

## Sherlock, your services are required

The culprit is the Event Loop. Thank you, next...

Oh, you want more details? Well, let's start by analysing the `result` array for this particular example. Its size is two when it should be only one. That means that these promises:

```typescript
promises.push(sem.wait().then(() => { res.push(true) }))
```

...found a way to be both executed; which in turn means that this line:

```typescript
if (this.promises.length > 0) this.promises.pop()!()
```

...may have been executed at least one more time than it should have. But that doesn't make any sense: there's but one invokation of the `signal()` method! It's time to *trace* the execution:

```
Wait received 
Promised created 
Signal received 
Increase Permits
Promise resolved
Wait received
Decrease the permits 
Decrease the permits
```

So here's what's happening: After `wait()` is received, we were expecting it to create a promise (since `permits == 0`). Then, we were expecting it to *decrease* the permits. But that's not what happens. Instead, right after the promise is created, `signal()` is received, it increases the `permits` to `1`, then checks for pending promises. It finds the last one and resolves it. One could *also* expect at this point that the permit would decrease, since the execution of the code following the promise would continue. But no! Instead, the final `wait()` is received, it checks if `permits == 0` (which is unexpectedly false), it resolves by decreasing the permits and without creating a promise, and then the pending permits decrease twice. *Phew!*

What is going on here is that our `wait()` implementation is buggy:

```typescript
if (this.permits == 0 || this.promises.length > 0) {
    await new Promise(r => { this.promises.unshift(r) })
}

this.permits -= 1 
```

There's only one promise created in this example, and the `await` keyword has the result of pushing the rest of the program as a `callback` that went to some Event Loop phase's FIFO. And this includes the critical `this.permits -= 1`. The program proceeds sequentially, and the fact that the promise is solved by `signal()` doesn't mean that the previous callback is solved right away. In fact, it doesn't... the code continues its execution straight into the second `wait()` where `permits` hasn't been decreased yet.

There, you've been bitten by the Event Loop monster.

## A fix for AsyncSemaphore 

With our property-based test in place, it's easy to change the code and see what happens. It is not without some irony that the bug is solved by a "permutation" of two lines of code:

{% highlight typescript linenos %}
async wait() {
    this.permits -= 1
    if (this.permits < 0 || this.promises.length > 0)
        await new Promise(r => this.promises.unshift(r))
}
{% endhighlight %}

The first thing we do as soon as `wait()` is called, is to decrease the permit. We also change the condition to `permits < 0` for obvious reasons. Fast-check finds no remaining counter-examples to our specified property. Everything is awesome™!

## Testing the AsyncQueue

We start by writing how to generate a test:

{% highlight typescript linenos %}
assert(
    asyncProperty(
        anArray(aBoolean().map(b => b ? 'E' : 'D'), 1000), 
        async (ns) => testAsyncQueueBehavior(ns)), 
        { numRuns: 100 }) 
{% endhighlight %}

And proceed similarly:

{% highlight typescript linenos %}
async function testAsyncQueueBehavior(ops: Array<'E' | 'D'>): Promise<boolean> {
    const result = new Array<number>()
    const q = new AsyncQueue<number>()
    const promises = Array<Promise<void>>()

    let enqueues = 0, dequeues = 0

    for (const op of ops) {
        if (op === 'E') { 
            enqueues += 1 
            q.enqueue(enqueues)
        } else {
            dequeues += 1 
            promises.push(q.dequeue().then(v => { result.push(v) }))
        }
    }

    const pending = Math.min(enqueues, dequeues) 
    await Promise.all(promises.slice(0, pending))

    // Length should be equal minimum between enqueues and dequeues
    const isLengthOk = pending === result.length 

    // Messages should be ordered
    const isSorted = isArraySorted(result) 

    return isLengthOk && isSorted
}
{% endhighlight %}

Here we are looking for two properties instead of one: 

1. That the number of successful `dequeues()` is equal to the minimum between `enqueues` and `dequeues`; and
2. That all `dequeues()` are solved in order (thus preserving the FIFO property).

Fast-check finds no counter-examples.

## Epilogue

There's a subtle difference between doing the *right thing* and doing the *thing right*. Tests allow us to specify that, for very specific conditions, our result is what we expect it to be. But *specifications*, in the sense of the *right thing*, are way beyond what tests can achieve. Automatic checking of properties is a way to improve *confidence* that our tests capture *more* of the specification; which is an *indirect* way to increase trust in our program *correctness*. But don't fool yourself: there's **absolutely nothing** that is able to tell you if your specification is *indeed* right. 