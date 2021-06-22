---
title: Publications
date: June 2021
---

{% assign allpubs = site.data.proceedings | concat: site.data.periodics | concat: site.data.nationalpubs | concat: site.data.otherpubs %}
{% assign toppubs = allpubs | where_exp: 'item', 'item.citations >= 15' | sort: 'citations' | reverse %}
{% assign proceedings = site.data.proceedings.size %}
{% assign periodics = site.data.periodics.size %}
{% assign nationals = site.data.nationalpubs.size %}
{% assign refereedconfs = proceedings | plus: nationals %}
{% assign others = site.data.otherpubs.size %}
{% assign total = allpubs.size %}
{% assign isi = allpubs | where_exp:"item","item.index contains 'isi'" | size %}
{% assign scopus = allpubs | where_exp:"item","item.index contains 'scopus'" | size %}
{% assign dblp = allpubs | where_exp:"item","item.index contains 'dblp'" | size %}

Since 2008, I have co-authored **{{ refereedconfs }} articles in conferences** with scientific referee, **{{ periodics }} articles in periodics**, and **{{ others }} others**. In total, these **{{ total }} publications** have attracted over **{{ site.data.bibliometrics.citations }} citations**, resulting in an **h-index of {{ site.data.bibliometrics.hindex }}** and an **i10-index of {{ site.data.bibliometrics.i10index }}**, thus averaging **{{ site.data.bibliometrics.citations | divided_by: total }} citations per paper**. Indexed articles by the ISI Web of Science ({{ isi }}), SCOPUS ({{ scopus }}) and The DBLP Computer Science Bibliography ({{ dblp }}) are identified by the tags <abbr class="tag">ISI</abbr>, <abbr class="tag">SCOPUS</abbr> and <abbr class="tag">DBLP</abbr> respectively. More recent articles are still waiting for proper indexation. Here's a summary of the most cited publications ({{ toppubs.size }}):

{:.citations-table}
{% assign sum = 0 %}
{% assign pubid = 1 %}
| | Title | Citations | Year |
|-:|-------|----------:|-----:|
{% for pub in toppubs %}{% if pub.citations %}| {{ pubid }}. | {{ pub.name | truncate: 70 }} | {{ pub.citations }} | {{ pub.year }} |{% assign sum = sum | plus: pub.citations %}{% assign pubid = pubid | plus: 1 %}
{% endif %}{% endfor %}| | <b>Total citations for top _h-index_ = {{ toppubs.size }} publications</b> | <b>{{ sum }}</b> |


## Papers in periodics with scientific referee

<ol reversed>
{% for pub in site.data.periodics %}
    <li>
      {{ pub.authors | join: ', ' }}, <i><b>&ldquo;{{ pub.name }}&rdquo;</b></i>, {{ pub.periodic }}. {{ pub.year }}{% if pub.doi %} { <abbr>doi</abbr> <a href="http://dx.doi.org/{{ pub.doi }}">{{ pub.doi }}</a> }{% endif %}{% if pub.isbn %} {&nbsp;<abbr>isbn</abbr> <a href="">{{ pub.isbn }}</a>&nbsp;}{% endif %}{% assign tags = pub.index | split: "," %}{% for tag in tags %}&nbsp;<abbr class="tag">{{tag | strip}}</abbr>{% endfor %};
    </li>
{% endfor %}
</ol>

## Papers in conference proceedings with scientific referee

<ol reversed>
{% for pub in site.data.proceedings %}
    <li>
      {{ pub.authors | join: ', ' }}, <i><b>&ldquo;{{ pub.name }}&rdquo;</b></i>, {{ pub.conference }} (<abbr>{{ pub.acronym }}</abbr>). {{ pub.city }}, {{ pub.year }}{% if pub.doi %} { <abbr>doi</abbr> <a href="http://dx.doi.org/{{ pub.doi }}">{{ pub.doi }}</a> }{% endif %}{% if pub.isbn %} {&nbsp;<abbr>isbn</abbr><a href="">{{ pub.isbn }}</a>&nbsp;}{% endif %}{% assign tags = pub.index | split: "," %}{% for tag in tags %}&nbsp;<abbr class="tag">{{tag | strip}}</abbr>{% endfor %}{% if pub.toappear %}&nbsp;<abbr class="tag">to appear</abbr>{% endif %};
    </li>
{% endfor %}
</ol>

## Papers in national conferences with scientific referee

<ol reversed>
{% for pub in site.data.nationalpubs %}
    <li>
      {{ pub.authors | join: ', ' }}, <i><b>&ldquo;{{ pub.name }}&rdquo;</b></i>, {{ pub.conference }} (<abbr>{{ pub.acronym }}</abbr>). {{ pub.city }}, {{ pub.year }}{% if pub.doi %} {&nbsp;<abbr>doi</abbr> <a href="http://dx.doi.org/{{ pub.doi }}">{{ pub.doi }}</a> }{% endif %}{% if pub.isbn %} {&nbsp;<abbr>isbn</abbr><a href="">{{ pub.isbn }}</a>}{% endif %}{% assign tags = pub.index | split: "," %}{% for tag in tags %}&nbsp;<abbr class="tag">{{tag | strip}}</abbr>{% endfor %};
    </li>
{% endfor %}
</ol>

## Other scientific production

<ol reversed>
{% for pub in site.data.otherpubs %}
    <li>
      {{ pub.authors | join: ', ' }}, <i><b>{{ pub.name }}</b></i>, {{ pub.conference }}{% if pub.acronym %} (<abbr>{{ pub.acronym }}</abbr>){% endif %}. {% if pub.city %}{{ pub.city }}, {% endif %}{{ pub.year }}{% if pub.doi %} {&nbsp;<abbr>doi</abbr><a href="http://dx.doi.org/{{ pub.doi }}">{{ pub.doi }}</a> }{% endif %}{% if pub.isbn %} {&nbsp;<abbr>isbn</abbr> <a href="">{{ pub.isbn }}</a>}{% endif %}{% assign tags = pub.index | split: "," %} {% for tag in tags %}<abbr class="tag">{{tag | strip}}</abbr>{% endfor %};
    </li>
{% endfor %}
</ol>