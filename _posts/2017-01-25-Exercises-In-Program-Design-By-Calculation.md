---
layout: post
title: Exercises in Program Design by Calculation
date: 2017-01-25 18:28
comments: true
external-url:
categories: Mathematics
---

Encontre a _Weakest Precondition_ dos seguintes triplos:

1.1. $\\{wp\\}$ `b:=c+1; a:=c+2` $\\{c<b ∧ b<a\\}$

$wp($`b:=c+1`, $wp($`a:=c+2`, $c<b ∧ b<a))$ <br/>
$≡$ { Aplicação sucessiva da regra de assignment `:=` } <br/>
$wp($`a:=c+2`, $c<b ∧ b<a) → c<b ∧ b<c+2$ <br/>
$wp($`b:=c+1`, $c<b ∧ b<c+2) → c<c+1 ∧ c+1<c+2 ≡$<span class='bghighlight'> $\text{True}$ </span>.


1.2. $\\{wp\\}$ `if (a>b) then c:=a` $\\{ c=\text{max}(a,b) \\}$

Admitindo a definição:

$$\text{max}(a,b) ≜ \begin{cases} a &\mbox{if } a > b \\
b & \mbox{if } a ≤ b \end{cases}$$

Temos que:

$wp($`if (a>b) then c:=a`, $c=\text{max}(a,b))$ <br/>
$≡$ { Regra do `if` } <br/>
$a>b ∧ wp($`c:=a`, $c=\text{max}(a,b)) ∨ a≤b ∧ wp($`skip`, $c=\text{max}(a,b))$ <br/>
$≡$ { Regra do assignment `:=` } <br/>
$a>b ∧ a=\text{max}(a,b) ∨ a≤b ∧ c=\text{max}(a,b)$ <br/>
$≡$ { Definição de $\text{max}(a,b)$ } <br/>
$a>b ∧ a=a ∨ a≤b ∧ c=b$ <br/>
$≡$ { Identidade } <br/>
<span class='bghighlight'> $a>b ∨ a≤b ∧ c=b$ </span>.

---

Indique se os triplos que se seguem são verdadeiros ou falsos através das regras da _Weakest Precondition_:

2.1. $\\{y=3\\}$ `y:=x-y; x:=y+1; y:=x-1` $\\{y<x\\}$

Calculamos a pré-condição mais fraca:

$wp($`y:=x-y`, $wp($`x:=y+1`, $wp($`y:=x-1`, $y < x)))$ <br/>
$≡$ { Aplicação sucessiva da regra de assignment `:=` } <br/>
$wp($`y:=x-1`, $y<x) → x-1<x$ <br/>
$wp($`x:=y+1`, $x-1<x) → y<y+1 ≡ y<y+1$ <br/>
$wp($`y:=x-y`, $y<y+1) → x-y < (x-y)+1 ≡ \text{True}$

E demonstramos a implicação:

$(y=3)→\text{True}→\\:?→$<span class='bghighlight'> $\text{True}$ </span>.


2.2. $\\{x≥-100 ∧ x≤100\\}$ `if (x<0) then x:=x+100 else y:=2*x fi` $\\{y≥0 ∧ y≤300\\}$

Calculamos a pré-condição mais fraca:

$wp($`if (x<0) then x:=x+100 else y:=2*x fi`, $0 ≤ y≤300)$ <br/>
$≡$ { Regra do `if` } <br/>
$x<0 ∧ wp($`x:=x+100`, $0≤y≤300) ∨ x≥0 ∧ wp($`y:=2*x`, $0≤y≤300)$ <br/>
$≡$ { Regra do assignment `:=` } <br/>
$x<0 ∧ 0≤y≤300 ∨ x≥0 ∧ 2x≥0 ∧ 2x≤300$ <br/>
$≡$ { Álgebra e teoria de conjuntos } <br/>
$x<0 ∧ 0≤y≤300 ∨ 0≤x≤150$ <br/>

E demonstramos a implicação:

$(x≥-100 ∧ x≤100) → (x<0 ∧ 0≤y≤300 ∨ 0≤x≤150) →\\: ? →$<span class='bghighlight'> $\text{False}$ </span>.

---

Apresente a prova *total* para o seguinte programa através da lógica de _Hoare_ e _Weakest Preconditions_. Indique o invariante, variante e a pré-condição do ciclo.

> $[n≥0 ∧ d>0]$ <br>
> ```q:=0;
> r:=n;
> while (r>=d) do
>   q:=q+1;
>   r:=r−d
> od
> ```
> $[n = q⋅d + r∧0≤r ∧ r<d]$

a. Arbitrar uma invariante:

<span class='bghighlight'>$\\:I ≜ n = q⋅d+r ∧ r≥0 ∧ d>0\\:$</span>

b. E uma variante:

<span class='bghighlight'>$\\:M ≜ r\\:$</span>

c. Garantir que a invariante é verdadeira antes do ciclo:

$[P]$ `q:=0; r:=n` $[I]$<br/>
$≡$ { Definição de $I$ e cálculo da $wp$} <br/>
$P → wp($`q:=0`, $wp($`r:=n`, $n = q ⋅ d + r ∧ r ≥ 0 ∧ d>0$ <br/>
{ Aplicação sucessiva da regra de assignment `:=` } <br/>
$P → (n = 0 ⋅ d + n ∧ n ≥ 0 ∧ d>0)$ <br/>
$≡$ { Definição de $P$, álgebra e teoria de conjuntos } <br/>
$n ≥ 0 ∧ d > 0 → (n = n ∧ n ≥ 0 ∧ d>0) ≡$ <span class='bghighlight'> $\\:\text{True}\\:$</span>

d. Garantir que a invariante é preservada e a variante é estritamente decrescente:

$[I ∧ C∧ M = M']$ `q:=q+1; r:=r-d` $[I∧ M < M']$ <br/>
$≡$ { Definição de $I$ e $M$ } <br/>
$[\ldots]$ `q:=q+1; r:=r-d` $[n = q ⋅ d + r ∧ r ≥ 0 ∧ d>0 ∧ r < M']$ <br/>
$≡$ { Verificação pelo cálculo da $wp$ } <br/>
$\ldots\\: → wp($`q:=q+1`, $wp($`r:=r-d`, $n = q ⋅ d + r ∧ r ≥ 0 ∧ d>0 ∧ r < M'))$ <br/>
$≡$ { Aplicação sucessiva da regra de assignment `:=` } <br/>
$\ldots\\: → n = (q + 1) ⋅ d + (r - d) ∧ (r-d) ≥ 0 ∧ d>0 ∧ (r - d) < M'$ <br/>
$≡$ { Definição de $I$, $C$, $M$ e álgebra } <br/>
$(n = q⋅d + r ∧ r≥0 ∧ r≥d ∧ d>0 ∧ r=M') →$<br/>
$→(n = q⋅d + r ∧ (r-d)≥0 ∧ d>0 ∧ (r-d)< M')$ <br/>
$≡$ {Álgebra e teoria de conjuntos } <br/>
<span class='bghighlight'> $\\:\text{True}\\:$</span>

e. Garantir que a pós-condição é uma implicação do fim do ciclo:

$I ∧ ¬ C → Q$ <br/>
$≡$ { Definição de $I$, $C$ e $Q$ } <br/>
$(n = q ⋅ d + r ∧ r ≥ 0∧ d>0 ∧ r < d) → (n = q ⋅ d + r ∧ 0 ≤ r ∧ r < d)≡$ <span class='bghighlight'> $\\:\text{True}\\:$</span>

f. Garantir que a variante não é nula no inicio do ciclo:

$I ∧ C → M > 0$ <br/>
$≡$ { Definição de $I$, $C$ e $M$ } <br/>
$(n = q ⋅ d + r ∧ r ≥ 0 ∧ r >= d ∧ d>0) → (r > 0)≡$ <span class='bghighlight'> $\\:\text{True}\\:$</span>

---

Encontre um programa `S` que refine as especificações seguintes, indicando as regras aplicadas.

4.1. $\\{x=0\\}$ `S` $\\{y=x\\}$

Spec($x=0$, `S`, $y=x$) <br/>
$\sqsubseteq$ { Refinamento do assignment `:=` } <br/>
Spec($x=0$, `y:=x`, $y=x$).

4.2. $\\{y=2 ∧ x=3\\}$ `S` $\\{x=3\\}$

Spec($y=2 ∧ x=3$, `S`, $x=3$) <br/>
$\sqsubseteq$ { Refinamento do `skip`, dado que $y=2 ∧ x=3 → x=3$ } <br/>
Spec($y=2 ∧ x=3$, `skip`, $x=3$).

---

Prove o seguinte programa através de refinamento (indique as regras que aplicou em cada passo).

> $\\{ x = m ∧ y = n ∧ m>0\\}$ <br>
> ```
> while (x!=0) do
>   y:=y-1;
>   x:=x-1
> od
> ```
> $\\{ y = n - m \\}$

O ponto de partida é então:

Spec($x=m ∧ y=n ∧ m>0$, `S`, $y=n-m)$

a. Encontrar invariante e variante do ciclo e verificar aplicabilidade da regra da repetição. Lembrando a regra da repetição (para caso de condição de guarda simples, e com $I$ em vez de $P$, considerando que desempenha o papel de invariante do ciclo):

$\\{I\\}$ `S` $\\{I∧¬G\\}$ <br>
$\sqsubseteq$ { Regra da repetição } <br>
$\\{I\\}$ `while G do` $\\{I∧G∧V=V_0\\}$ `S1` $\\{I∧0 ≤ V<V_0\\}$ `od` $\\{I∧¬G\\}$

Para a aplicar, temos de escolher $I$ (invariante do ciclo) e $V$ (variante do ciclo), e.g.:

$I ≜ y = n-m+x ∧ x≥0$ <br>
$V ≜ x$

No entanto, a pré-condição e pós-condição do triplo inicial não são equivalentes a $I$ e $I∧¬G$  (com $G ≜ x≠0$) respectivamente, pelo que temos de começar por enfraquecer a pré-condição e fortalecer a pós-condição, para depois introduzir o ciclo:

$\hphantom{⊑}$ { enfraquecer a pré-condição } <br>
$\\{ x = m ∧ y = n ∧ m>0 \\}$ `S` $\\{ y = n - m \\}$ <br>
$⊑$ { dado que $x = m ∧ y = n ∧ m>0 → y = n – m + x ∧ x ≥ 0$ } <br>
$\\{ y = n-m+x ∧ x ≥ 0 \\}$ `S` $\\{ y = n-m \\}$ <br>
$⊑$ { fortalecer a pós-condição, dado $(y = n-m+x ∧ x≥0) ∧ ¬x≠0 → y = n-m$ } <br>
$\\{\ldots\\}$ `S` $\\{ (y = n-m+x ∧ x≥ 0)  ∧ ¬x≠0\\}$ <br>
$⊑$ { introduzir o ciclo, pela regra da repetição, com $V≜x$ } <br>
$\\{\ldots\\}$ `while x!=0 do ` $\\{y=n-m+x ∧ x≥0 ∧ x≠0 ∧ x=V_0\\}$ `S1` $\\{y=n-m+x ∧ x≥0 ∧ 0≤x<V_0\\}$ `od` $\\{ (y = n-m+x ∧ x≥0) ∧ ¬x=0\\}$ <br>
$⊑$ { por simplificação de expressões } <br>
$\\{\ldots\\}$ `while x != 0 do` $\\{y=n-m+x ∧ x>0 ∧ x=V_0\\}$ `S1` $\\{(y=n-m+x ∧ x≥0 ∧ x<V_0\\}$ `od` $\\{ y = n-m+x ∧ x=0 \\}$ <br>

b. Introduzir sequência aplicando regra da composição. Temos agora que refinar $\\{y=n-m+x ∧ x>0 ∧ x=V_0\\}$ `S1` $\\{y=n-m+x ∧ x≥0 ∧ x<V_0\\}$ para $\\{y=n-m+x ∧ x>0 ∧ x=V_0\\}$ `y:=y-1; x:=x-1` $\\{y=n-m+x ∧ x≥0 ∧ x<V_0\\}$

Para isso, temos de começar por aplicar a regra da composição, com uma asserção intermédia $M$ apropriada:

$\\{y=n-m+x ∧ x>0 ∧ x=V0\\}$ `S1` $\\{y=n-m+x ∧ x≥0 ∧ x<V_0\\}$ <br>
$⊑$ { regra da composição } <br>
$\\{y=n-m+x ∧ x>0 ∧ x=V_0\\}$ `S2` $\\{M\\}$ `S3` $\\{y=n-m+x ∧ x≥0 ∧ x<V_0\\}$

Uma solução segura é usar a pré-condição mais fraca:

$M ≜ wp($`x:=x-1`, $y=n-m+x ∧ x≥0 ∧ x<V_0)$ <br>
$\hphantom{M} ≡ (y=n-m+x-1 ∧ x-1≥0 ∧ x-1<V_0)$ <br>
$\hphantom{M} ≡ (y=n-m+x-1 ∧ x≥1 ∧ x≤V_0)$


c. Introduzir uma das atribuições:

$\\{y=n-m+x-1 ∧ x≥1 ∧ x≤V_0\\}$ `S3` $\\{y=n-m+x ∧ x≥0 ∧ x<V_0\\}$ <br>
$⊑$ {dado que $(y=n-m+x-1 ∧ x≥1 ∧ x≤V_0) ⇛ (y=n-m+x ∧ x≥0 ∧ x<V_0)[x/x-1]$ } <br>
$\\{y=n-m+x-1 ∧ x≥1 ∧ x≤V_0\\}$ `x: = x-1` $\\{y=n-m+x ∧ x≥0 ∧ x<V_0\\}$

d. Introduzir a outra atribuição:

$\\{y=n-m+x ∧ x>0 ∧ x=V_0\\}$ `S2` $\\{y=n-m+x-1 ∧ x≥1 ∧ x≤V_0\\}$ <br>
$⊑$ { ... } <br>
$\\{y=n-m+x ∧ x>0 ∧ x=V_0\\}$ `y := y-1` $\\{y=n-m+x-1 ∧ x≥1 ∧ x≤V_0\\}$

Neste caso temos de provar que:

$y=n-m+x ∧ x>0 ∧ x=V_0 ⇛ y-1=n-m+x-1 ∧ x≥1 ∧ x≤V_0$

Ora cada clásula do lado direita é equivalente ou implicada pela cláusula na mesma posição do lado esquerdo, pela que a implicação é sempre verdadeira, para quaisquer valores das variáveis. Isto conclui a prova por refinamento.
