---
layout: blog_wide
permalink: /blog/
title: Blog
nav: true
nav_order: 1
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
  per_page: 9
  sort_field: date
  sort_reverse: true
  trail:
    before: 1 # The number of links before the current page
    after: 3 # The number of links after the current page
---

<!-- <div class="post">

{% assign blog_name_size = site.blog_name | size %}
{% assign blog_description_size = site.blog_description | size %}

{% if blog_name_size > 0 or blog_description_size > 0 %}

  <div class="header-bar">
    <h1>{{ site.blog_name }}</h1>
    <h2>{{ site.blog_description }}</h2>
  </div>
  {% endif %} -->

<!-- {% if site.display_tags or site.display_categories %}

  <div class="tag-category-list">
    <ul class="p-0 m-0">
      {% for tag in site.display_tags %}
        <li>
          <i class="fa-solid fa-hashtag fa-sm"></i> <a href="{{ tag | slugify | prepend: '/blog/tag/' | relative_url }}">{{ tag }}</a>
        </li>
        {% unless forloop.last %}
          <p>&bull;</p>
        {% endunless %}
      {% endfor %}
      {% if site.display_categories.size > 0 and site.display_tags.size > 0 %}
        <p>&bull;</p>
      {% endif %}
      {% for category in site.display_categories %}
        <li>
          <i class="fa-solid fa-tag fa-sm"></i> <a href="{{ category | slugify | prepend: '/blog/category/' | relative_url }}">{{ category }}</a>
        </li>
        {% unless forloop.last %}
          <p>&bull;</p>
        {% endunless %}
      {% endfor %}
    </ul>
  </div>
  {% endif %} -->

{% assign featured_posts = site.posts | where: "featured", "true" %}
{% if featured_posts.size > 0 %}
<br>

<div class="container featured-posts">
{% assign is_even = featured_posts.size | modulo: 2 %}
<div class="row row-cols-{% if featured_posts.size <= 2 or is_even == 0 %}2{% else %}3{% endif %}">
{% for post in featured_posts %}
<div class="col mb-4">
<a href="{{ post.url | relative_url }}">
<div class="card hoverable">
<div class="row g-0">
<div class="col-md-12">
<div class="card-body">
<div class="float-right">
<i class="fa-solid fa-thumbtack fa-xs"></i>
</div>
<h3 class="card-title text-lowercase">{{ post.title }}</h3>
<p class="card-text">{{ post.description }}</p>

                    {% if post.external_source == blank %}
                      {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
                    {% else %}
                      {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
                    {% endif %}
                    {% assign year = post.date | date: "%Y" %}

                    <p class="post-meta">
                      {{ read_time }} min read &nbsp; &middot; &nbsp;
                      <a href="{{ year | prepend: '/blog/' | prepend: site.baseurl}}">
                        <i class="fa-solid fa-calendar fa-sm"></i> {{ year }} </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      {% endfor %}
      </div>
    </div>
    <hr>

{% endif %}

<div id="blog-posts-grid" class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mb-5">
{%- for post in paginator.posts -%}
  {% comment %} Assignments for per-post metadata {% endcomment %}
  {% if post.external_source == blank %}
    {% assign read_time = post.content | number_of_words | divided_by: 180 | plus: 1 %}
  {% else %}
    {% assign read_time = post.feed_content | strip_html | number_of_words | divided_by: 180 | plus: 1 %}
  {% endif %}
  {% assign tags = post.tags | join: "" %} {% comment %} Used to check if post.tags is empty {% endcomment %}
  {% assign categories = post.categories | join: "" %} {% comment %} Used to check if post.categories is empty {% endcomment %}

  {% assign temp_slugified_tags_array = "" | split: "" %}
  {% for t in post.tags %}
    {% capture captured_slug %}{{ t | slugify }}{% endcapture %}
    {% assign temp_slugified_tags_array = temp_slugified_tags_array | push: captured_slug %}
  {% endfor %}
  {% assign post_tags_for_data_attr = temp_slugified_tags_array | join: ',' %}
  <div class="col d-flex align-items-stretch blog-post-card" data-tags="{{ post_tags_for_data_attr }}">
    <div class="card w-100">
      <div class="card-body d-flex flex-column">
        {% if post.thumbnail %}
          <div class="post-image-container mb-3" style="width: 100%;">
            <img src="{{post.thumbnail | relative_url}}" alt="{{ post.title | escape }} thumbnail" class="img-fluid" style="width: 100%; max-height: 200px; aspect-ratio: 16/9; object-fit: cover; border-radius: .25rem;">
          </div>
        {% endif %}

        <div class="post-text-content" style="display: flex; flex-direction: column; width: 100%; flex-grow: 1; /* Allows mt-auto to work */">
          <h5 class="card-title mb-2" style="font-size: 1.5rem;">
            {% if post.redirect == blank %}
              <a class="post-title stretched-link" href="{{ post.url | relative_url }}" style="text-decoration: none; color: inherit;">{{ post.title }}</a>
            {% elsif post.redirect contains '://' %}
              <a class="post-title stretched-link" href="{{ post.redirect }}" target="_blank" style="text-decoration: none; color: inherit;">{{ post.title }}</a>
              <svg width="0.8rem" height="0.8rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" style="display: inline; margin-left: 0.25rem; color: #777;">
                <path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="currentColor" stroke-width="3.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            {% else %}
              <a class="post-title stretched-link" href="{{ post.redirect | relative_url }}" style="text-decoration: none; color: inherit;">{{ post.title }}</a>
            {% endif %}
          </h5>
          <p class="card-text small text-muted" style="margin-top: 0.25rem; margin-bottom: 0.75rem; font-size: 1.1rem;">{{ post.description }}</p>
          
          <div class="mt-auto">
            <p class="post-meta" style="font-size: 0.8 rem; color: #888; margin-bottom: 0.75rem;">
              {{ read_time }} min read &nbsp; &middot; &nbsp;
              {{ post.date | date: '%b %d, %Y' }}
              {% if post.external_source %}
              &nbsp; &middot; &nbsp; {{ post.external_source }}
              {% endif %}
            </p>
            
            {% if tags != "" or categories != "" %}
            <ul class="list-unstyled d-flex flex-wrap" style="padding:0; margin:0; gap: 0.3rem;">
                {% if tags != "" %}
                  {% for tag_item in post.tags %}
                  <li style="background-color: #f0f0f0; padding: 0.2rem 0.65rem; border-radius: 12px; font-size: 0.8rem; line-height: 1.4;">
                      <a href="{{ tag_item | slugify | prepend: '/blog/tag/' | prepend: site.baseurl}}" style="text-decoration: none; color: #444;">
                        <i class="fa-solid fa-hashtag fa-xs" style="margin-right: 2px; color: #666;"></i>{{ tag_item }}
                      </a>
                  </li>
                  {% endfor %}
                {% endif %}

                {% if categories != "" %}
                  {% for category_item in post.categories %}
                  <li style="background-color: #e9e9e9; padding: 0.2rem 0.65rem; border-radius: 12px; font-size: 0.8rem; line-height: 1.4;">
                      <a href="{{ category_item | slugify | prepend: '/blog/category/' | prepend: site.baseurl}}" style="text-decoration: none; color: #444;">
                        <i class="fa-solid fa-tag fa-xs" style="margin-right: 2px; color: #666;"></i>{{ category_item }}
                      </a>
                  </li>
                  {% endfor %}
                {% endif %}
            </ul>
            {% endif %}
          </div>
        </div>
      </div>
    </div>
  </div>
{%- endfor -%}
</div>

<div id="no-posts-found-message" style="display: none; text-align: center; margin-top: 20px;">
  <p class="lead text-muted">no posts found matching the selected tag.</p>
</div>

{% if page.pagination.enabled %}
  {% include pagination.liquid %}
{% endif %}
