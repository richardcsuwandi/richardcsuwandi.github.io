---
layout: page
permalink: /services/
title: Services
description: Summary of my academic and professional services
nav: false
nav_order: 6
---

#### Teaching Assistant
{% for teaching in site.data.services.teaching %}
- {{ teaching.semester }}, [{{ teaching.course }}]({{ teaching.url }}), {{ teaching.institution }}
{% endfor %}

#### Reviewer
{% for review in site.data.services.reviewing %}
- [{{ review.name }}]({{ review.url }})
{% endfor %}