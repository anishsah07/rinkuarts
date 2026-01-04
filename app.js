(function () {
  const data = window.BUSINESS_DATA;

  const outlet = document.getElementById("route-outlet");
  const toastRegion = document.getElementById("toastRegion");
  const brandName = document.getElementById("brandName");
  const brandTagline = document.getElementById("brandTagline");
  const brandLogo = document.getElementById("brandLogo");
  const footerGrid = document.getElementById("footerGrid");
  const footerCopyright = document.getElementById("footerCopyright");

  brandName.textContent = data.brand.name;
  brandTagline.textContent = data.brand.tagline;
  if (brandLogo && typeof data.brand.logo === "string" && data.brand.logo.trim().length > 0) {
    brandLogo.src = data.brand.logo.trim();
    brandLogo.alt = `${data.brand.name} logo`;
    brandLogo.style.display = "block";
  }

  const routes = {
    "/": { title: "Home", render: renderHome },
    "/services": { title: "Services", render: renderServices },
    "/about": { title: "About", render: renderAbout },
    "/contact": { title: "Contact", render: renderContact }
  };

  function getRoutePath() {
    const hash = window.location.hash || "#/";
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    const cleaned = raw.trim() || "/";
    return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  }

  function setActiveNav(path) {
    const links = Array.from(document.querySelectorAll(".nav-link"));
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const linkPath = href.startsWith("#") ? href.slice(1) : href;
      const current = linkPath === path || (path === "/" && linkPath === "/");
      if (current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function closeMobileMenu() {
    const navLinks = document.getElementById("navLinks");
    const toggle = document.querySelector(".nav-toggle");
    if (!navLinks || !toggle) return;
    navLinks.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    const icon = toggle.querySelector("[data-lucide]");
    if (icon) icon.setAttribute("data-lucide", "menu");
  }

  function render() {
    const path = getRoutePath();
    const route = routes[path] || routes["/"];
    document.title = `${data.brand.name} • ${route.title}`;
    setActiveNav(path in routes ? path : "/");
    outlet.innerHTML = route.render();
    renderFooter();
    wirePageHandlers();
    closeMobileMenu();
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
    animateIn();
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function getMapUrl() {
    const fromData = data?.contact?.mapUrl;
    if (typeof fromData === "string" && fromData.trim().length > 0) return fromData.trim();
    const address = data?.contact?.address || "";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  function showToast({ title, description }) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <div class="msg">
        <div class="title">${escapeHtml(title)}</div>
        <div class="desc">${escapeHtml(description)}</div>
      </div>
      <button class="close" type="button" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
    `;
    toastRegion.appendChild(toast);
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
    }

    const closeBtn = toast.querySelector(".close");
    const remove = () => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    };
    closeBtn.addEventListener("click", remove);
    window.setTimeout(remove, 3500);
  }

  function renderHome() {
    const previewServices = data.services.slice(0, 6);
    const heroImageUrl =
      (data.brand && data.brand.heroImage) ||
      (typeof data?.contact?.locationImage === "string" ? data.contact.locationImage.trim() : "");
    return `
      <section class="page">
        <div class="container">
          <div class="hero">
            <div class="hero-inner">
              <div>
                <div class="hero-kicker">
                  <i data-lucide="sparkles"></i>
                  <span>${escapeHtml(data.person.name)} • ${escapeHtml(data.person.title)}</span>
                </div>
                <h1 class="hero-title">
                  Premium <strong>design & printing</strong> for modern brands.
                </h1>
                <p class="hero-subtitle">
                  ${escapeHtml(data.brand.tagline)} — cards, stationery, signage, and branded materials produced with sharp detail and consistent color.
                </p>
                <div class="hero-actions">
                  <a class="btn btn-primary" href="#/services">
                    <span>Explore Services</span>
                    <i data-lucide="arrow-right"></i>
                  </a>
                  <a class="btn" href="#/contact">
                    <span>Contact</span>
                    <i data-lucide="phone"></i>
                  </a>
                  <a class="btn" href="${escapeHtml(getMapUrl())}" target="_blank" rel="noopener noreferrer">
                    <span>Location</span>
                    <i data-lucide="map-pin"></i>
                  </a>
                </div>
              </div>
              <div class="hero-media" aria-hidden="true">
                ${
                  heroImageUrl.length > 0
                    ? `<img class="hero-image" src="${escapeHtml(heroImageUrl)}" alt="Rinku Arts services" loading="lazy" />`
                    : ""
                }
                <div class="hero-statbar">
                  <div class="stat">
                    <div class="k">Focus</div>
                    <div class="v">Clean Output</div>
                  </div>
                  <div class="stat">
                    <div class="k">Delivery</div>
                    <div class="v">On Time</div>
                  </div>
                  <div class="stat">
                    <div class="k">Support</div>
                    <div class="v">Design Help</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <div>
                <h2 class="section-title">Services</h2>
                <p class="section-subtitle">A premium set of everyday essentials and large-format work.</p>
              </div>
              <a class="pill" href="#/services">
                <span>View all</span>
                <i data-lucide="arrow-right"></i>
              </a>
            </div>
            <div class="grid services-grid">
              ${previewServices
                .map((s) => renderServiceCard(s))
                .join("")}
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <div>
                <h2 class="section-title">About</h2>
                <p class="section-subtitle">${escapeHtml(data.about.headline)}</p>
              </div>
              <a class="pill" href="#/about">
                <span>Read more</span>
                <i data-lucide="arrow-right"></i>
              </a>
            </div>
            <div class="card">
              <div class="card-inner prose">
                <p>${escapeHtml(data.about.paragraphs[0])}</p>
                <p>${escapeHtml(data.about.paragraphs[1])}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderServices() {
    return `
      <section class="page">
        <div class="container">
          <div class="section-header">
            <div>
              <h1 class="section-title">Services</h1>
              <p class="section-subtitle">Everything is rendered from local data, no backend needed.</p>
            </div>
            <a class="pill" href="#/contact">
              <span>Request a Quote</span>
              <i data-lucide="send"></i>
            </a>
          </div>
          <div class="grid services-grid">
            ${data.services.map((s) => renderServiceCard(s)).join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderServiceCard(service) {
    const imageHtml = service.image ? `
      <div class="service-media">
        <img src="${escapeHtml(service.image)}" alt="${escapeHtml(service.title)}" loading="lazy" />
      </div>
    ` : "";

    return `
      <article class="card service-card">
        ${imageHtml}
        <div class="card-inner">
          <div class="service-head">
            <div class="icon-chip" aria-hidden="true">
              <i data-lucide="${escapeHtml(service.icon)}"></i>
            </div>
            <div>
              <h3 class="service-title">${escapeHtml(service.title)}</h3>
            </div>
          </div>
          <p class="service-desc">${escapeHtml(service.description)}</p>
          <div class="service-meta">
            <span>${escapeHtml(data.brand.name)}</span>
            <a class="btn btn-sm" href="#/contact">Order Now</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderAbout() {
    const mdImageUrl =
      typeof data?.person?.mdImage === "string" && data.person.mdImage.trim().length > 0
        ? data.person.mdImage.trim()
        : typeof data?.person?.photo === "string"
          ? data.person.photo.trim()
          : "";
    return `
      <section class="page">
        <div class="container">
          <div class="section-header">
            <div>
              <h1 class="section-title">About ${escapeHtml(data.brand.name)}</h1>
              <p class="section-subtitle">${escapeHtml(data.about.headline)}</p>
            </div>
            <a class="pill" href="#/contact">
              <span>Talk to us</span>
              <i data-lucide="phone"></i>
            </a>
          </div>

          <div class="about-grid">
            <div class="card">
              <div class="card-inner prose">
                ${data.about.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
              </div>
            </div>
            <div class="about-right">
              <div class="card md-card">
                <div class="card-inner">
                  <div class="md-profile">
                    <div class="md-media">
                      ${
                        mdImageUrl.length > 0
                          ? `<img class="md-photo" src="${escapeHtml(mdImageUrl)}" alt="${escapeHtml(
                              data.person.name
                            )} photo" loading="lazy" referrerpolicy="no-referrer">`
                          : `<div class="md-placeholder md-photo-placeholder"><span>MD Photo</span></div>`
                      }
                    </div>
                    <div class="md-bar">MD</div>
                    <div class="md-meta">
                      <div class="md-name">${escapeHtml(data.person.name)}</div>
                      <div class="md-title">${escapeHtml(data.person.title)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card">
                <div class="card-inner">
                  <h2 class="section-title" style="margin: 0 0 10px; font-size: 18px;">Why choose us</h2>
                  <ul class="list">
                    ${data.about.highlights
                      .map(
                        (h) => `
                          <li>
                            <i data-lucide="circle-check"></i>
                            <span>${escapeHtml(h)}</span>
                          </li>
                        `
                      )
                      .join("")}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderContact() {
    const mapUrl = getMapUrl();
    const locationImageUrl =
      typeof data?.contact?.locationImage === "string" ? data.contact.locationImage.trim() : "";
    const qrImage = typeof data?.contact?.qrImage === "string" ? data.contact.qrImage.trim() : "";
    const whatsappQrImage =
      typeof data?.contact?.whatsappQrImage === "string" ? data.contact.whatsappQrImage.trim() : "";
    const qrImageUrl =
      qrImage.length > 0
        ? qrImage
        : `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(mapUrl)}`;
    const whatsappNumber = data.contact.whatsapp || data.contact.phones[0] || "";
    const viberNumber = data.contact.viber || data.contact.phones[1] || data.contact.phones[0] || "";
    const whatsappHref = whatsappNumber
      ? `https://wa.me/${encodeURIComponent(whatsappNumber.replace(/[^0-9]/g, ""))}`
      : "";
    const viberHref = viberNumber ? `tel:${viberNumber.replace(/\s+/g, "")}` : "";
    const phoneLines = data.contact.phones
      .map((raw) => {
        const trimmed = String(raw).trim();
        let icon = "phone";
        let tag = "";
        let href = "";
        if (whatsappNumber && trimmed === whatsappNumber) {
          icon = "message-circle";
          tag = "WhatsApp";
          href = whatsappHref;
        } else if (viberNumber && trimmed === viberNumber) {
          icon = "phone-call";
          tag = "Viber";
          href = viberHref;
        }

        const tagHtml = tag
          ? href
            ? `<a class="phone-tag" href="${escapeHtml(href)}" ${
                tag === "WhatsApp" ? 'target="_blank" rel="noopener noreferrer"' : ""
              }>${escapeHtml(tag)}</a>`
            : `<span class="phone-tag">${escapeHtml(tag)}</span>`
          : "";

        return `
          <div class="phone-line">
            <i data-lucide="${icon}"></i>
            <span>${escapeHtml(trimmed)}</span>
            ${tagHtml}
          </div>
        `;
      })
      .join("");

    return `
      <section class="page">
        <div class="container">
          <div class="section-header">
            <div>
              <h1 class="section-title">Contact</h1>
              <p class="section-subtitle">Scan the QR below to connect with us.</p>
            </div>
            <div class="pill">
              <i data-lucide="map-pin"></i>
              <span>${escapeHtml(data.contact.address)}</span>
            </div>
          </div>

          <div class="contact-grid">
            <div class="card">
              <div class="card-inner">
                <div class="kv">
                  <div class="kv-item">
                    <i data-lucide="user"></i>
                    <div>
                      <div class="k">Contact person</div>
                      <div class="v">${escapeHtml(data.person.name)}</div>
                      <div class="k">${escapeHtml(data.person.title)}</div>
                    </div>
                  </div>
                  <div class="kv-item">
                    <i data-lucide="mail"></i>
                    <div>
                      <div class="k">Email</div>
                      <div class="v">
                        <a href="mailto:${escapeHtml(data.contact.email)}">${escapeHtml(data.contact.email)}</a>
                      </div>
                    </div>
                  </div>
                  <div class="kv-item">
                    <i data-lucide="phone"></i>
                    <div>
                      <div class="k">Phone</div>
                      <div class="v phone-lines">${phoneLines}</div>
                    </div>
                  </div>
                  <div class="kv-item">
                    <i data-lucide="map-pin"></i>
                    <div>
                      <div class="k">Address</div>
                      <div class="v">${escapeHtml(data.contact.address)}</div>
                    </div>
                  </div>
                  <div class="kv-item">
                    <i data-lucide="globe"></i>
                    <div>
                      <div class="k">Follow us</div>
                      <div class="v footer-social" style="margin-top: 4px;">
                        ${data.contact.social && data.contact.social.facebook ? `
                          <a class="social-btn" href="${escapeHtml(data.contact.social.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <i data-lucide="facebook"></i>
                          </a>
                        ` : ""}
                        ${data.contact.social && data.contact.social.instagram ? `
                          <a class="social-btn" href="${escapeHtml(data.contact.social.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <i data-lucide="instagram"></i>
                          </a>
                        ` : ""}
                        ${data.contact.social && data.contact.social.tiktok ? `
                          <a class="social-btn" href="${escapeHtml(data.contact.social.tiktok)}" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="lucide">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0 7.7 6.82V9.08a9.93 9.93 0 0 0 6.2 2.5v-3.51a6.12 6.12 0 0 1-4.67-1.38z"/>
                            </svg>
                          </a>
                        ` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card whatsapp-qr-card">
              <div class="card-inner">
                <div class="qr-head">
                  <div class="qr-title">WhatsApp</div>
                  <div class="qr-sub">Scan to open our WhatsApp business account.</div>
                </div>
                <div class="qr-link whatsapp-qr-link" aria-label="WhatsApp QR code">
                  <img
                    class="qr-image"
                    src="${escapeHtml(
                      whatsappQrImage.length > 0
                        ? whatsappQrImage
                        : "./images/WhatsApp%20Image%202025-12-20%20at%2008.38.10.jpeg"
                    )}"
                    alt="WhatsApp business QR code"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <div>
                <h2 class="section-title">Location</h2>
              </div>
              <a class="pill" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer">
                <span>Open Map</span>
                <i data-lucide="external-link"></i>
              </a>
            </div>
            <div class="location-grid">
              <div class="card location-card">
                <div class="card-inner">
                  ${
                    locationImageUrl
                      ? `
                        <div class="location-media">
                          <img
                            class="location-photo"
                            src="${escapeHtml(locationImageUrl)}"
                            alt="${escapeHtml(data.brand.name)} location"
                            onerror="this.closest('.location-media').style.display='none'"
                            loading="lazy"
                          />
                        </div>
                      `
                      : ""
                  }
                  <div class="location-row">
                    <div class="location-left">
                      <div class="location-kicker">
                        <i data-lucide="map-pin"></i>
                        <span>${escapeHtml(data.brand.name)}</span>
                      </div>
                      <div class="location-address">${escapeHtml(data.contact.address)}</div>
                    </div>
                    <div class="location-actions">
                      <a class="btn btn-primary" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer">
                        <span>Open Google Maps</span>
                        <i data-lucide="navigation"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card qr-card">
                <div class="card-inner">
                  <div class="qr-head">
                    <div class="qr-title">Scan QR</div>
                    <div class="qr-sub">Open the location on your phone.</div>
                  </div>
                  <a class="qr-link" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Open map from QR">
                    <img class="qr-image" src="${escapeHtml(qrImageUrl)}" alt="QR code for location" loading="lazy" />
                  </a>
                  <a class="btn" href="${escapeHtml(mapUrl)}" target="_blank" rel="noopener noreferrer">
                    <span>Open Map</span>
                    <i data-lucide="external-link"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderFooter() {
    const year = new Date().getFullYear();
    footerGrid.innerHTML = `
      <div>
        <h3 class="footer-title">${escapeHtml(data.brand.name)}</h3>
        <p class="footer-text">${escapeHtml(data.brand.tagline)}</p>
        <div class="footer-links">
          <a class="footer-link" href="#/services"><i data-lucide="grid-3x3"></i><span>Services</span></a>
          <a class="footer-link" href="#/about"><i data-lucide="info"></i><span>About</span></a>
          <a class="footer-link" href="#/contact"><i data-lucide="phone"></i><span>Contact</span></a>
        </div>
      </div>
      <div>
        <h3 class="footer-title">Contact</h3>
        <div class="footer-links">
          <a class="footer-link" href="mailto:${escapeHtml(data.contact.email)}"><i data-lucide="mail"></i><span>${escapeHtml(data.contact.email)}</span></a>
          ${data.contact.phones
            .map(
              (p) =>
                `<a class="footer-link" href="tel:${escapeHtml(p)}"><i data-lucide="phone"></i><span>${escapeHtml(p)}</span></a>`
            )
            .join("")}
        </div>
      </div>
      <div>
        <h3 class="footer-title">Address</h3>
        <a class="footer-link" href="${escapeHtml(getMapUrl())}" target="_blank" rel="noopener noreferrer">
          <i data-lucide="map-pin"></i>
          <span>${escapeHtml(data.contact.address)}</span>
        </a>
        <div class="footer-social">
          ${data.contact.social && data.contact.social.facebook ? `
            <a class="social-btn" href="${escapeHtml(data.contact.social.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i data-lucide="facebook"></i>
            </a>
          ` : ""}
          ${data.contact.social && data.contact.social.instagram ? `
            <a class="social-btn" href="${escapeHtml(data.contact.social.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i data-lucide="instagram"></i>
            </a>
          ` : ""}
          ${data.contact.social && data.contact.social.tiktok ? `
            <a class="social-btn" href="${escapeHtml(data.contact.social.tiktok)}" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="lucide">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0 7.7 6.82V9.08a9.93 9.93 0 0 0 6.2 2.5v-3.51a6.12 6.12 0 0 1-4.67-1.38z"/>
              </svg>
            </a>
          ` : ""}
        </div>
      </div>
    `;
    footerCopyright.textContent = `© ${year} ${data.brand.name}. All rights reserved.`;
  }

  function wirePageHandlers() {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        contactForm.reset();
        showToast({
          title: "Message Sent",
          description: "Thanks! We will contact you soon."
        });
      });
    }
  }

  function animateIn() {
    const nodes = Array.from(
      outlet.querySelectorAll(".hero, .section-header, .card, .kv-item, .pill, .btn")
    );
    const unique = Array.from(new Set(nodes));

    unique.forEach((el, idx) => {
      el.classList.remove("anim-in");
      el.style.animationDelay = "";
      void el.offsetWidth;
      el.classList.add("anim-in");
      el.style.animationDelay = `${Math.min(idx * 35, 260)}ms`;
    });
  }

  function wireGlobalHandlers() {
    const toggle = document.querySelector(".nav-toggle");
    const navLinks = document.getElementById("navLinks");
    if (toggle && navLinks) {
      toggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        const icon = toggle.querySelector("[data-lucide]");
        if (icon) icon.setAttribute("data-lucide", isOpen ? "x" : "menu");
        if (window.lucide && typeof window.lucide.createIcons === "function") {
          window.lucide.createIcons();
        }
      });

      document.addEventListener("click", (e) => {
        const target = e.target;
        if (!target) return;
        if (target.closest(".nav") || target.closest(".nav-toggle")) return;
        closeMobileMenu();
      });
    }

    window.addEventListener("hashchange", render);
  }

  wireGlobalHandlers();
  render();
})();
