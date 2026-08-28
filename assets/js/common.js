$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let theme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (theme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });
});

// common.js - custom scripts for enhanced UI/UX

document.addEventListener('DOMContentLoaded', () => {
  // Add smooth page reveal animation
  const main = document.querySelector('main');
  if (main) {
    main.classList.add('fade-in');
  }
  
  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Enhance card animations
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)';
      card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.07)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.03)';
    });
  });
  
  // Add active state to current nav item
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
      link.classList.add('active');
    } else if (currentPath === '/' && linkPath === '/') {
      link.classList.add('active');
    }
  });
  
  // Add image zoom effect on hover where appropriate
  document.querySelectorAll('.projects img, .publications img').forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.05)';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });
});
