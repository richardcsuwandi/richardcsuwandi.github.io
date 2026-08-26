---
layout: page
permalink: /publications/
title: Publications
description: 
nav: false
nav_order: 2
---

<!-- _pages/publications.md -->
<style>
/* This page renders inside .container (default.liquid), capped at 1140px by
    _base.scss, unlike the About page's uncapped .wide-about-container.
    Widen it here so the publication cards (and thumbnails) have more room. */
.container.mt-5 {
    max-width: 75% !important;
}

@media (max-width: 768px) {
    .container.mt-5 {
        max-width: 95% !important;
    }
}
</style>

<div class="publications">

{% bibliography %}

</div>
