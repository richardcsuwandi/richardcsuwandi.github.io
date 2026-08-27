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
- {{ teaching.role | default: "Teaching Assistant" }}, {{ teaching.semester }}, {% if teaching.url %}[{{ teaching.course }}]({{ teaching.url }}){% else %}{{ teaching.course }}{% endif %}, {{ teaching.institution }}
{% endfor %}

#### Organizational Experience
{% for org in site.data.services.organizations %}
- {{ org.role }}, {% if org.url %}[{{ org.name }}]({{ org.url }}){% else %}{{ org.name }}{% endif %} ({{ org.years }})
{% endfor %}

#### Reviewer
{% for review in site.data.services.reviewing %}
- [{{ review.name }}]({{ review.url }})
{% endfor %}