(function () {
  "use strict";

  var ASSET_ORIGIN = "https://spacebet-pi.vercel.app";
  var cssPath = inferCssPath();

  function inferCssPath() {
    var currentScript = document.currentScript && document.currentScript.src;
    if (!currentScript) return "https://cdn.jsdelivr.net/gh/edavet/spacebet@main/spacebet/spacebet.css";
    return currentScript.split("?")[0].replace(/script\.js$/, "spacebet.css");
  }

  function asset(path) {
    return ASSET_ORIGIN + path;
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function textOf(node) {
    return (node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function setImage(img, src, alt) {
    if (!img) return;
    img.src = src;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.alt = alt || "";
    img.loading = "eager";
    img.decoding = "async";
  }

  function sectionTitle(section) {
    var headerText = qs('[data-mj="widget-game-slider-header"] p, [data-mj="widget-phoenix-sport-header-container"] p, p', section);
    return textOf(headerText);
  }

  function findGameSliderByTitle(title) {
    var wanted = title.toLowerCase();
    return qsa('[data-mj="widget-game-slider"]').find(function (section) {
      return sectionTitle(section).toLowerCase() === wanted;
    });
  }

  function ensureCss() {
    var href = cssPath;
    if (document.querySelector('[data-spacebet-interface-css], link[href*="/spacebet/spacebet.css"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.spacebetInterfaceCss = "true";
    document.head.appendChild(link);
  }

  function iconSvg(type) {
    if (type === "sport") {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2.2 2.2 1.6-.8 2.6h-2.8l-.8-2.6L12 4.2Zm-5.8 5.1 2.6-.2 1 2.7-2.2 1.7-2.1-1.6.7-2.6Zm3.1 8.2-2.2-1.6.7-2.6 2.3 1.7h3.8l2.3-1.7.7 2.6-2.2 1.6H9.3Zm7.1-4-2.2-1.7 1-2.7 2.6.2.7 2.6-2.1 1.6Z"/></svg>';
    }

    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.7 2.3c3.2 1.1 5.7 3.6 6.8 6.8l.2.7-4 4 1.1 4.5-2 2-2.3-4.1-2.7-2.7-4.1-2.3 2-2 4.5 1.1 4-4-.7-.2a8.6 8.6 0 0 0-3.5-.5l.7-3.3ZM7.2 14.7c1.1 1.1 1.1 2.9 0 4-1 1-4.7 2.1-4.7 2.1s1.1-3.7 2.1-4.7c1.1-1.1 2.9-1.1 4 0l-1.4-1.4Z"/></svg>';
  }

  function setupShell() {
    document.documentElement.lang = "pt";

    var preconnect = document.querySelector('link[data-spacebet-assets-preconnect]');
    if (!preconnect) {
      preconnect = document.createElement("link");
      preconnect.rel = "preconnect";
      preconnect.href = ASSET_ORIGIN;
      preconnect.crossOrigin = "";
      preconnect.dataset.spacebetAssetsPreconnect = "true";
      document.head.appendChild(preconnect);
    }
  }

  function setupHeader() {
    setImage(qs('[data-mj="logo"] img'), asset("/assets/spacebet-logo-new.svg"), "Spacebet");
    setImage(qs('[data-mj="footer-logo"] img'), asset("/assets/spacebet-logo-new.svg"), "Spacebet");
    setImage(qs('[data-mj="header-special-button"] img'), asset("/assets/nav-icons/header-megaphone.png"), "");

    var quickTabs = qs('[data-mj="header-nav-list"] > div');
    if (quickTabs) {
      var links = qsa("a", quickTabs);
      var sport = links.find(function (link) { return /sport/i.test(textOf(link)); });
      var crash = links.find(function (link) { return /crash|casino/i.test(textOf(link)); });
      [sport, crash].forEach(function (link) {
        if (!link) return;
        var isSport = /sport/i.test(textOf(link));
        link.href = isSport ? "/pt/sport" : "/pt/g-crash/crash";
        link.innerHTML = '<span>' + iconSvg(isSport ? "sport" : "crash") + '</span><span>' + (isSport ? "SPORT" : "CRASH") + "</span>";
      });
      if (sport && crash && sport.previousElementSibling !== null) {
        quickTabs.insertBefore(sport, quickTabs.firstChild);
      }
    }

    var navItems = [
      { label: "Jogos de Crash", icon: "/assets/nav-icons/jogos-crash.png", href: "/pt/g-crash/crash" },
      { label: "Jogos Scratch", icon: "/assets/nav-icons/jogos-scratch.png", href: "/pt/home/scratch" },
      { label: "Jogos Rapidos", icon: "/assets/nav-icons/jogos-rapidos.png", href: "/pt/home/instant" },
      { label: "Virtual Games", icon: "/assets/nav-icons/virtual-games.png", href: "/pt/home/virtual" },
    ];

    qsa('[data-mj="header-nav-item"]').forEach(function (item, index) {
      var link = qs("a", item);
      var nav = navItems[index];
      if (!link || !nav) {
        item.hidden = true;
        return;
      }
      link.href = nav.href;
      link.innerHTML = '<span><img src="' + asset(nav.icon) + '" alt="" aria-hidden="true"></span><span>' + nav.label + "</span>";
    });
  }

  function setupHero() {
    var slides = qsa('[data-mj="widget-banner-item"]');
    var banners = [
      {
        desktop: "/assets/banners/final/ceu-nao-tem-limite-desktop-banner.webp",
        mobile: "/assets/banners/final/ceu-nao-tem-limite-mobile-banner.webp",
        alt: "O ceu nao tem limite",
      },
      {
        desktop: "/assets/banners/final/aposta-alto-ganha-mais-desktop-banner.webp",
        mobile: "/assets/banners/final/aposta-alto-ganha-mais-mobile-banner.webp",
        alt: "Aposta alto ganha mais",
      },
      {
        desktop: "/assets/banners/final/larga-quica-ganha-desktop-banner.webp",
        mobile: "/assets/banners/final/larga-quica-ganha-mobile-banner.webp",
        alt: "Larga quica ganha",
      },
    ];

    function applyBannerImages() {
      var mobile = window.matchMedia("(max-width: 900px)").matches;
      slides.forEach(function (slide, index) {
        var banner = banners[index % banners.length];
        var img = qs("img", slide);
        setImage(img, asset(mobile ? banner.mobile : banner.desktop), banner.alt);
        slide.style.minWidth = "";
        slide.style.maxWidth = "";
        slide.style.transform = "";
      });
    }

    applyBannerImages();
    window.addEventListener("resize", applyBannerImages, { passive: true });
  }

  function setupSports() {
    var sportsSection = findGameSliderByTitle("Sports");
    if (!sportsSection) return;

    var title = qs('[data-mj="widget-game-slider-header"] p', sportsSection);
    if (title) title.textContent = "Desportos Populares";

    var sports = [
      ["football", "FUTEBOL"],
      ["basketball", "BASQUETEBOL"],
      ["tennis", "T\u00caNIS"],
      ["volleyball", "VOLEIBOL"],
      ["table-tennis", "T\u00caNIS DE MESA"],
      ["boxing", "BOXE"],
      ["baseball", "BASEBOL"],
      ["rugby", "RUGBY"],
      ["handball", "ANDEBOL"],
      ["ice-hockey", "H\u00d3QUEI NO GELO"],
      ["mma", "MMA"],
      ["cricket", "CRICKET"],
    ];

    var slides = qsa('[data-mj="widget-game-slider-slide"]', sportsSection);
    var rail = qs('[data-mj="widget-game-slider-list"], .keen-slider', sportsSection);
    while (rail && slides.length > 0 && slides.length < sports.length) {
      var clone = slides[slides.length - 1].cloneNode(true);
      rail.appendChild(clone);
      slides = qsa('[data-mj="widget-game-slider-slide"]', sportsSection);
    }

    slides.forEach(function (slide, index) {
      var sport = sports[index % sports.length];
      var card = qs('[data-mj="widget-game-card"]', slide);
      var img = qs("img", slide);
      if (card) {
        if (index === 0) card.setAttribute("aria-selected", "true");
        else card.removeAttribute("aria-selected");
      }
      setImage(img, asset("/assets/sports/cards-clean/pt/" + sport[0] + ".png"), sport[1]);

      var footer = qs('[class*="app-ltr-3kzt60"]', slide);
      if (footer) {
        var small = qs('[class*="app-ltr-10sbmph"]', footer);
        var strong = qs('[class*="app-ltr-1xdhyk6"]', footer);
        if (small) small.textContent = "";
        if (strong) strong.textContent = sport[1];
      }
    });
  }

  function setupTopGames() {
    var topGames = findGameSliderByTitle("Top Games");
    if (!topGames) return;
    qsa('[data-mj="widget-game-card"]', topGames).slice(0, 8).forEach(function (card, index) {
      setImage(qs("img", card), asset("/assets/games/top-games/" + (index + 1) + ".png"), "Top game " + (index + 1));
    });
  }

  function setupPopularGames() {
    var simple = [
      ["frogs-scratch", "Frog's Scratch"],
      ["dream-car-suv", "Dream Car SUV"],
      ["lucky-numbers-x8", "Lucky Numbers X8"],
      ["diamond-rush", "Diamond Rush"],
      ["gold-rush", "Gold Rush"],
      ["bingooo", "Bingooo"],
      ["ekeko", "Ekeko"],
      ["tower", "Tower"],
      ["aviator-simple", "Aviator"],
      ["speed-crash", "Speed Crash"],
      ["gold-diggers", "Gold Diggers"],
      ["gift-santa-green", "Gift From Santa Green"],
      ["moon-scratch", "Moon Scratch"],
      ["go-panda", "Go Panda"],
      ["crazy-donuts", "Crazy Donuts"],
      ["cash-scratch", "Cash Scratch"],
      ["chicken-plus", "Chicken+"],
      ["cosmox", "Cosmox"],
      ["crixx", "Crixx"],
      ["meteoroid-crash", "Meteoroid Crash"],
      ["meteoroid", "Meteoroid"],
      ["cash-show", "Cash Show"],
      ["crash-simple", "Crash"],
    ];

    qsa('[data-mj="widget-game-slider"]').forEach(function (section) {
      var title = sectionTitle(section);
      if (!/Popular Games|Popular Now/i.test(title)) return;
      qsa('[data-mj="widget-game-card"]', section).forEach(function (card, index) {
        var game = simple[index % simple.length];
        setImage(qs("img", card), asset("/assets/games/simple/" + game[0] + ".png"), game[1]);
      });
    });
  }

  function setupWinners() {
    var winnerSection = qs('[data-mj="widget-bet-win"]');
    if (!winnerSection) return;
    qsa("img", winnerSection).forEach(function (img, index) {
      var n = String((index % 11) + 1).padStart(2, "0");
      setImage(img, asset("/assets/winners/top-winner-" + n + ".png"), "Top vencedor " + (index + 1));
    });
  }

  function setupSportTopCards() {
    var sportTop = qsa('[data-mj="widget-game-slider"]').find(function (section) {
      return /^Sport TOP Events$/i.test(sectionTitle(section));
    });
    if (!sportTop) return;

    var events = [
      ["england-croatia", "FIFA World Cup 2026", "England vs Croatia"],
      ["france-senegal", "FIFA World Cup 2026", "France vs Senegal"],
      ["brazil-morocco", "FIFA World Cup 2026", "Brazil vs Morocco"],
      ["portugal-dr-congo", "FIFA World Cup 2026", "Portugal vs DR Congo"],
      ["argentina-austria", "FIFA World Cup 2026", "Argentina vs Austria"],
      ["usa-australia", "FIFA World Cup 2026", "USA vs Australia"],
    ];

    qsa('[data-mj="widget-game-card"]', sportTop).forEach(function (card, index) {
      var event = events[index % events.length];
      setImage(qs("img", card), asset("/assets/sports/events/" + event[0] + ".webp"), event[2]);
      var competition = qs('[class*="app-ltr-10sbmph"]', card);
      var match = qs('[class*="app-ltr-1xdhyk6"]', card);
      if (competition) competition.textContent = event[1];
      if (match) match.textContent = event[2];
    });
  }

  function setupPhoenixEvents() {
    return;
  }

  function setupCollections() {
    var section = qs('[data-mj="widget-collection-slider"]');
    if (!section) return;
    var cards = [
      ["/assets/games/jet-x.png", "CRASH GAMES"],
      ["/assets/games/figoal.png", "SPORT"],
      ["/assets/games/plinko.png", "INSTANT GAMES"],
      ["/assets/games/chicken-road.png", "SCRATCH"],
      ["/assets/banners/final/larga-quica-ganha-desktop-banner.webp", "BONUS"],
      ["/assets/banners/final/aposta-alto-ganha-mais-desktop-banner.webp", "PROMOS"],
    ];
    qsa('[data-mj="widget-collection-slider-item"]', section).forEach(function (item, index) {
      var card = cards[index % cards.length];
      setImage(qs("img", item), asset(card[0]), card[1]);
      var strong = qs("strong", item);
      if (strong) strong.textContent = card[1];
    });
  }

  function setupProviders() {
    var providers = [
      ["spribe", "Spribe"],
      ["smartsoft", "Smartsoft"],
      ["atlas-v", "Atlas V"],
      ["galaxsys", "Galaxsys"],
      ["inout", "InOut"],
      ["bgaming", "BGaming"],
      ["turbo-games", "Turbo Games"],
      ["evoplay", "Evoplay"],
    ];
    var rail = qs('[data-mj="widget-top-providers-slider"]');
    if (!rail) return;
    var items = qsa('[data-mj="widget-top-providers-item"]', rail);
    items.forEach(function (item, index) {
      var provider = providers[index % providers.length];
      setImage(qs("img", item), asset("/assets/providers/" + provider[0] + ".svg"), provider[1]);
      item.setAttribute("aria-label", provider[1]);
      item.style.minWidth = "";
      item.style.maxWidth = "";
      item.style.transform = "";
    });
  }

  function setupShowAllButtons() {
    return;
  }

  function setupMobileNav() {
    if (qs('[data-mj="spacebet-bottom-nav"]')) return;

    var nav = document.createElement("nav");
    nav.setAttribute("data-mj", "spacebet-bottom-nav");
    nav.setAttribute("aria-label", "Navegacao rapida movel");

    var actions = document.createElement("div");
    actions.setAttribute("data-mj", "spacebet-bottom-nav-inner");

    [
      ["Slots", "\u25c6"],
      ["Live Casino", "\u25c9"],
      ["Games", "\u25a3"],
      ["Promos", "\u2605"],
    ].forEach(function (item, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.innerHTML = '<span data-mj="spacebet-bottom-nav-icon">' + item[1] + '</span><span data-mj="spacebet-bottom-nav-label">' + item[0] + "</span>";
      if (index === 0) button.setAttribute("aria-current", "page");
      actions.appendChild(button);
    });

    var switcher = document.createElement("div");
    switcher.setAttribute("data-mj", "spacebet-surface-switcher");
    [
      ["sport", "\u26bd", -1],
      ["casino", "\u25c9", 0],
      ["home", "\u2302", 1],
    ].forEach(function (item) {
      var button = document.createElement("button");
      button.type = "button";
      button.dataset.surface = item[0];
      button.style.setProperty("--sb-wheel-offset", item[2]);
      button.innerHTML = '<span aria-hidden="true">' + item[1] + '</span>';
      if (item[0] === "home") button.setAttribute("aria-current", "page");
      button.addEventListener("click", function () {
        qsa("button", switcher).forEach(function (other) {
          if (other === button) other.setAttribute("aria-current", "page");
          else other.removeAttribute("aria-current");
        });
        document.body.setAttribute("data-current-surface", item[0]);
      });
      switcher.appendChild(button);
    });

    nav.appendChild(actions);
    nav.appendChild(switcher);
    document.body.appendChild(nav);
  }

  function clearInlineRailSizing() {
    qsa('[data-mj="widget-game-slider-slide"], [data-mj="widget-top-providers-item"], [data-mj="widget-collection-slider-item"]').forEach(function (node) {
      node.style.transform = "";
      node.style.minWidth = "";
      node.style.maxWidth = "";
    });
  }

  function run() {
    ensureCss();
    setupShell();
    setupHeader();
    setupHero();
    setupSports();
    setupWinners();
    setupSportTopCards();
    setupTopGames();
    setupPopularGames();
    setupPhoenixEvents();
    setupCollections();
    setupProviders();
    setupShowAllButtons();
    setupMobileNav();
    clearInlineRailSizing();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
