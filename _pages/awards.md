---
layout: page
permalink: /awards/
title: Awards
description: Summary of my honors and awards
nav: false
nav_order: 7
---

#### Awards
{% for award in site.data.awards %}
- {{ award.title }}, {{ award.year }}
{% endfor %}
