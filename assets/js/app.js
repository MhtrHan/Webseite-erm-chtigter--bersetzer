(function(){
  const C=window.SITE_CONTENT;
  const page=document.body.dataset.page || 'home';
  const qs=new URLSearchParams(location.search);
  const store={get:(k)=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}};
  let lang=qs.get('lang') || store.get('siteLang') || 'de';
  if(!C[lang]) lang='de';
  const t=C[lang], cfg=C.config;
  const root=document.documentElement;
  root.lang=lang; root.dir=lang==='ar'?'rtl':'ltr';
  document.body.classList.toggle('rtl',lang==='ar');
  root.style.setProperty('--accent',cfg.accent);
  const meta=t.meta[page]||t.meta.home;
  document.title=meta.title;
  const md=document.querySelector('meta[name="description"]'); if(md) md.content=meta.description;

  const withLang=(href)=>href + (href.includes('?')?'&':'?') + 'lang='+lang;
  const paths={home:'/',services:'/leistungen/',about:'/ueber-mich/',contact:'/kontakt/',quote:'/angebot/',imprint:'/impressum/',privacy:'/datenschutz/'};
  const normalizeIntl=(value)=>{const digits=(value||'').replace(/\D/g,'');if(!digits)return '';if(digits.startsWith('00'))return digits.slice(2);if(digits.startsWith('0'))return '49'+digits.slice(1);return digits;};
  const telHref=(value)=>{const n=normalizeIntl(value);return n?`tel:+${n}`:'#';};
  const formatIntlDisplay=(value)=>{
    const n=normalizeIntl(value);
    if(!n) return '';
    if(n.startsWith('49')){const national=n.slice(2);const prefix=national.slice(0,3);const rest=national.slice(3);return `+49 ${prefix}${rest?` ${rest}`:''}`;}
    return `+${n}`;
  };
  const requestId=()=>{const d=new Date();const z=(v)=>String(v).padStart(2,'0');return `A${d.getFullYear()}${z(d.getMonth()+1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}`;};
  const fillTemplate=(text,vars)=>Object.entries(vars).reduce((out,[key,val])=>out.replaceAll(`{${key}}`,val),text||'');
  const num=(v)=>`<bdi class="ltr-num" dir="ltr">${v}</bdi>`;

  /* ---------- Icons (inline SVG, 24×24) ---------- */
  const ICONS={
    seal:'<circle cx="12" cy="9" r="6"/><path d="m9 9 2 2 4-4"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
    stamp:'<path d="M5 21h14"/><path d="M6 17.5h12V15a2 2 0 0 0-2-2h-2.5v-2.2a3.5 3.5 0 1 0-3 0V13H8a2 2 0 0 0-2 2z"/>',
    send:'<path d="M21.5 2.5 10.8 13.2"/><path d="M21.5 2.5 14.8 21.5l-4-8.3-8.3-4z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    phone:'<path d="M6.6 2.8 9.2 2a1.6 1.6 0 0 1 1.9.9l1.2 3a1.6 1.6 0 0 1-.4 1.8l-1.5 1.5a15.4 15.4 0 0 0 4.4 4.4l1.5-1.5a1.6 1.6 0 0 1 1.8-.4l3 1.2a1.6 1.6 0 0 1 .9 1.9l-.8 2.6a3 3 0 0 1-2.9 2.1C10.7 19.5 4.5 13.3 4.5 5.7a3 3 0 0 1 2.1-2.9Z"/>',
    pin:'<path d="M12 21s-7-6.1-7-11.4a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.5"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    zap:'<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z"/>',
    truck:'<path d="M2 6.5h11v10H2z"/><path d="M13 10h4.5l3.5 3.5v3H13"/><circle cx="6" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/>',
    check:'<path d="M20 6 9 17l-5-5"/>',
    arrow:'<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    chevron:'<path d="m9 6 6 6-6 6"/>',
    plus:'<path d="M12 5v14"/><path d="M5 12h14"/>',
    menu:'<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
    close:'<path d="M6 6l12 12"/><path d="M18 6 6 18"/>',
    chat:'<path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.4A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" stroke-width="2.6"/>',
    swap:'<path d="M4 8h15"/><path d="m15 4 4 4-4 4"/><path d="M20 16H5"/><path d="m9 12-4 4 4 4"/>',
    fileUser:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><circle cx="12" cy="12.5" r="2"/><path d="M8.5 18.2a3.6 3.6 0 0 1 7 0"/>',
    rings:'<circle cx="9" cy="14.5" r="5"/><circle cx="15" cy="14.5" r="5"/><path d="M10.2 4.5h3.6l1 1.4L12 8.8 9.2 5.9z"/>',
    cap:'<path d="M22 9 12 4 2 9l10 5z"/><path d="M6 11.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.8"/><path d="M22 9v5.5"/>',
    fileCheck:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="m9 14.5 2 2 4-4"/>',
    idCard:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><circle cx="8.5" cy="11" r="2"/><path d="M5.5 16a3 3 0 0 1 6 0"/><path d="M14.5 10h4.5"/><path d="M14.5 14h3.5"/>',
    scale:'<path d="M12 3v18"/><path d="M7.5 21h9"/><path d="M4.5 7h15"/><path d="M12 5.2a1.2 1.2 0 1 0 0-2.4"/><path d="M2 14a3 3 0 0 0 6 0L5 7.5z"/><path d="M16 14a3 3 0 0 0 6 0l-3-6.5z"/>',
    fileText:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/>',
    whatsapp:'<path class="wa-bubble" d="M12 2.2a9.8 9.8 0 0 0-8.5 14.7L2.2 21.8l5-1.3A9.8 9.8 0 1 0 12 2.2zm0 1.8a8 8 0 1 1-4.1 14.9l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 0 1 12 4z"/><path d="M8.6 7.3c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l1.8.9c.3.1.4.2.5.3.1.2.1.8-.2 1.5-.3.7-1.5 1.4-2.1 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4z"/>'
  };
  const icon=(name,cls='')=>{
    if(name==='whatsapp') return `<svg class="icon fill ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS.whatsapp}</svg>`;
    return `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]||''}</svg>`;
  };
  const docIcons=['fileUser','rings','cap','fileCheck','idCard','scale'];
  const trustIcons=['seal','stamp','send'];

  /* ---------- Kontaktlinks ---------- */
  const waLink=(text)=>cfg.whatsapp?`https://wa.me/${normalizeIntl(cfg.whatsapp)}?text=${encodeURIComponent(text||cfg.whatsappText[lang])}`:withLang(paths.contact);
  const waAttrs=cfg.whatsapp?'target="_blank" rel="noopener"':'';
  const mailLink=()=>cfg.email?`mailto:${cfg.email}`:withLang(paths.contact);

  /* ---------- Bausteine ---------- */
  const navItem=(key,label,isButton=false)=>{const active=page===key;return `<a class="${isButton?'button ':''}${active?'active':''}" ${active?'aria-current="page"':''} href="${withLang(paths[key])}">${label}</a>`};
  const header=()=>`<a class="skip-link" href="#main">${t.common.skip}</a>
  <header class="site-header" id="siteHeader"><div class="wrap header-inner">
    <a class="brand" href="${withLang(paths.home)}" aria-label="${cfg.brandName} – ${t.nav.home}">
      <img src="/assets/img/mark-ink.png" alt="" width="44" height="35">
      <span class="brand-text"><span class="brand-name">${t.brandName||cfg.brandName}</span><span class="brand-sub">${t.brandSub}</span></span>
    </a>
    <nav class="nav" id="nav" aria-label="${t.nav.menu}">${navItem('home',t.nav.home)}${navItem('services',t.nav.services)}${navItem('about',t.nav.about)}${navItem('contact',t.nav.contact)}${navItem('quote',t.nav.quote,true)}</nav>
    <div class="lang" role="group" aria-label="${t.nav.language}"><button type="button" data-lang="de" lang="de" class="${lang==='de'?'active':''}" aria-pressed="${lang==='de'}">DE</button><button type="button" data-lang="ar" lang="ar" class="${lang==='ar'?'active':''}" aria-pressed="${lang==='ar'}">العربية</button></div>
    <button type="button" class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="nav" aria-label="${t.nav.menu}">${icon('menu','icon-open')}${icon('close','icon-close')}</button>
  </div></header>`;

  const sectionHead=(title,lead,extra='')=>`<div class="section-head ${extra} reveal"><h2 class="section-title">${title}</h2>${lead?`<p class="section-lead">${lead}</p>`:''}</div>`;

  const pageHero=(title,intro,crumb=true)=>`<section class="page-hero"><div class="wrap">
    ${crumb?`<div class="crumbs"><a href="${withLang(paths.home)}">${t.nav.home}</a>${icon('chevron','flip')}<span aria-current="page">${title}</span></div>`:''}
    <h1>${title}</h1>${intro?`<p>${intro}</p>`:''}
  </div></section>`;

  const ctaBand=()=>`<section class="cta-band"><div class="wrap"><div class="cta-box reveal">
    <div><h2>${t.home.ctaTitle}</h2><p>${t.home.ctaText}</p></div>
    <div class="actions">
      <a class="button light lg" href="${withLang(paths.quote)}">${t.home.ctaButton}${icon('arrow','flip')}</a>
      <a class="button outline-light wa lg" href="${waLink()}" ${waAttrs}>${icon('whatsapp')}${t.quote.whatsappTitle}</a>
    </div>
  </div></div></section>`;

  const docCards=()=>`<div class="doc-grid">${t.services.items.map((x,i)=>`<article class="doc-card reveal d${i%3}"><span class="icon-box">${icon(docIcons[i]||'fileText')}</span><h3>${x}</h3></article>`).join('')}</div>`;

  /* ---------- Illustration ---------- */
  const heroVisual=()=>{
    const v=t.home.visual;
    const bars=[92,70,84,58,88,64,76,50,82,68];
    const fields=[62,48,70,40,56];
    return `<div class="hero-visual" aria-hidden="true">
      <div class="doc doc-src">
        <div class="src-head"><span class="emblem"></span><span class="src-title">${v.source}</span></div>
        <div class="bars">${bars.map(w=>`<i style="width:${w}%"></i>`).join('')}</div>
      </div>
      <div class="doc doc-tr">
        <div class="doc-kicker">${v.label}</div>
        <div class="doc-title">${v.doc}</div>
        <div class="doc-rule"></div>
        <div class="doc-fields">${fields.map(w=>`<div><i class="k"></i><i style="width:${w}%"></i></div>`).join('')}</div>
        <div class="doc-note"><b>${v.noteTitle}</b> ${v.noteText}</div>
        <div class="doc-foot">
          <div class="signature"><svg viewBox="0 0 160 50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 36c8-2 14-20 20-24s4 14 0 22 6-6 12-16 4 12 8 12 8-14 12-14-2 12 3 12 9-10 14-10 2 8 7 7 10-8 16-8 8 6 14 4 12-6 20-6"/><path d="M40 44c30-3 60-4 100-6"/></svg><span>${v.sign}</span></div>
          <div class="seal"><svg viewBox="0 0 120 120"><defs><path id="sealPath" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"/></defs><circle cx="60" cy="60" r="57" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="60" cy="60" r="53" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" stroke-width="1.2"/><text><textPath href="#sealPath" textLength="280" lengthAdjust="spacing">${v.seal}</textPath></text></svg><img src="/assets/img/mark-ink.png" alt=""></div>
        </div>
      </div>
      <div class="chip chip-a"><span class="chip-icon">${icon('seal')}</span><span>${v.chipA}<small>${v.chipASub}</small></span></div>
      <div class="chip chip-b"><span class="chip-icon">${icon('swap')}</span><span>${v.chipB}<small>${v.chipBSub}</small></span></div>
    </div>`;
  };

  /* ---------- Seiten ---------- */
  function home(){
    const h=t.home;
    const title=h.title.replace(/(\S+)\s*↔\s*(\S+)/,`<span class="pair">$1 <span class="swap">${icon('swap')}</span> $2</span>`);
    return `<main id="main">
    <section class="hero"><div class="wrap hero-grid">
      <div class="hero-copy">
        <div class="badge reveal"><span class="badge-icon">${icon('seal')}</span>${h.eyebrow}</div>
        <h1 class="reveal d1">${title}</h1>
        <p class="lead reveal d2">${h.intro}</p>
        <div class="actions reveal d3">
          <a class="button lg" href="${withLang(paths.quote)}">${h.primary}${icon('arrow','flip')}</a>
          <a class="button ghost wa lg" href="${waLink()}" ${waAttrs}>${icon('whatsapp')}${t.quote.whatsappTitle}</a>
        </div>
        <ul class="hero-points reveal d3">${h.heroPoints.map(p=>`<li>${icon('check')}${p}</li>`).join('')}</ul>
      </div>
      ${heroVisual()}
    </div></section>

    <section class="trust"><div class="wrap"><div class="trust-grid reveal">
      ${h.trust.map((x,i)=>`<article class="trust-item"><span class="icon-box ${i===1?'brass':''}">${icon(trustIcons[i])}</span><div><h3>${x.title}</h3><p>${x.text}</p></div></article>`).join('')}
    </div></div></section>

    <section class="section"><div class="wrap">
      <div class="head-row">${sectionHead(h.servicesTitle,h.servicesText)}<a class="text-link reveal" href="${withLang(paths.services)}">${h.secondary}${icon('arrow','flip')}</a></div>
      ${docCards()}
    </div></section>

    <section class="section alt"><div class="wrap">
      ${sectionHead(h.processTitle,'','center')}
      <ol class="steps">${h.process.map((x,i)=>`<li class="step reveal d${i%4}"><span class="step-num">${num(x.n)}</span><h3>${x.title}</h3><p>${x.text}</p></li>`).join('')}</ol>
    </div></section>

    <section class="section"><div class="wrap">
      ${sectionHead(h.handlingTitle)}
      <div class="speed-grid">
        <article class="speed-card reveal"><div class="speed-top"><h3>${h.standardTitle}</h3><span class="icon-box">${icon('clock')}</span></div><div class="speed-value"><strong>${num(h.standardValue)}</strong><span>${h.standardUnit}</span></div><p>${h.standardText}</p></article>
        <article class="speed-card express reveal d1"><div class="speed-top"><h3>${h.expressTitle}</h3><span class="icon-box">${icon('zap')}</span></div><div class="speed-value"><strong>${num(h.expressValue)}</strong><span>${h.expressUnit}</span></div><p>${h.expressText}</p></article>
      </div>
      <div class="ship-note reveal">${icon('truck')}<span>${h.shippingText}</span></div>
    </div></section>

    <section class="section alt"><div class="wrap about-split">
      <div class="about-panel reveal"><img src="/assets/img/mark-white.png" alt=""><div class="panel-caption">${t.brandName||cfg.brandName}<small>${t.brandSub}</small></div></div>
      <div class="about-copy">${sectionHead(h.aboutTitle,h.aboutText)}<a class="button ghost reveal" href="${withLang(paths.about)}">${t.common.learnMore}${icon('arrow','flip')}</a></div>
    </div></section>

    <section class="section"><div class="wrap faq-layout">
      <div class="faq-aside">${sectionHead(h.faqTitle,h.faqLead)}
        <div class="contact-mini reveal"><p>${h.faqContact}</p><a class="text-link" href="${withLang(paths.contact)}">${t.nav.contact}${icon('arrow','flip')}</a></div>
      </div>
      <div class="faq-list">${h.faq.map((x,i)=>`<details class="reveal" ${i===0?'open':''}><summary>${x.q}<span class="plus">${icon('plus')}</span></summary><p>${x.a}</p></details>`).join('')}</div>
    </div></section>

    ${ctaBand()}
    </main>`;
  }

  function services(){
    const s=t.services;
    return `<main id="main">${pageHero(s.title,s.intro)}
    <section class="section tight"><div class="wrap">
      ${sectionHead(s.bodyTitle,s.bodyText)}
      ${docCards()}
      <div class="more-card reveal"><span class="icon-box brass">${icon('fileText')}</span><div><h3>${s.noteTitle}</h3><p>${s.noteText}</p></div><a class="button" href="${withLang(paths.quote)}">${s.cta}${icon('arrow','flip')}</a></div>
    </div></section>
    <section class="section alt"><div class="wrap">
      ${sectionHead(t.home.handlingTitle)}
      <div class="speed-grid">
        <article class="speed-card reveal"><div class="speed-top"><h3>${t.home.standardTitle}</h3><span class="icon-box">${icon('clock')}</span></div><div class="speed-value"><strong>${num(t.home.standardValue)}</strong><span>${t.home.standardUnit}</span></div><p>${t.home.standardText}</p></article>
        <article class="speed-card express reveal d1"><div class="speed-top"><h3>${t.home.expressTitle}</h3><span class="icon-box">${icon('zap')}</span></div><div class="speed-value"><strong>${num(t.home.expressValue)}</strong><span>${t.home.expressUnit}</span></div><p>${t.home.expressText}</p></article>
      </div>
      <div class="ship-note reveal" style="background:var(--surface)">${icon('truck')}<span>${t.home.shippingText}</span></div>
    </div></section>
    <div style="height:104px"></div>
    ${ctaBand()}</main>`;
  }

  function about(){
    const a=t.about;
    return `<main id="main">${pageHero(a.title,a.intro)}
    <section class="section tight"><div class="wrap about-layout">
      <article class="card prose reveal"><p>${a.p1}</p><p>${a.p2}</p><p>${a.p3}</p><div class="actions"><a class="button" href="${withLang(paths.contact)}">${a.cta}${icon('arrow','flip')}</a></div></article>
      <aside class="card facts reveal d1">
        <div class="facts-head"><img src="/assets/img/mark-white.png" alt=""><strong>${t.brandName||cfg.brandName}</strong><span>${a.factsTitle}</span></div>
        <dl>${a.facts.map(f=>`<div><dt>${f.k}</dt><dd>${f.v}</dd></div>`).join('')}</dl>
      </aside>
    </div></section>
    ${ctaBand()}</main>`;
  }

  function contact(){
    const c=t.contact;
    const item=(ic,label,value,href,extra='',cls='')=>{
      const inner=`<span class="icon-box ${cls}">${icon(ic)}</span><span><small>${label}</small><strong>${value}</strong></span>`;
      return href?`<a class="contact-card reveal" href="${href}" ${extra}>${inner}</a>`:`<div class="contact-card reveal">${inner}</div>`;
    };
    const missing=`<span style="color:var(--muted)">${c.missing}</span>`;
    return `<main id="main">${pageHero(c.title,c.generalText)}
    <section class="section tight"><div class="wrap contact-layout">
      <div class="contact-grid">
        ${item('mail',c.emailLabel,cfg.email||missing,cfg.email?`mailto:${cfg.email}`:'')}
        ${item('phone',c.phoneLabel,cfg.phone?`<bdi class="contact-number" dir="ltr">${formatIntlDisplay(cfg.phone)}</bdi>`:missing,cfg.phone?telHref(cfg.phone):'')}
        ${item('whatsapp',c.whatsappLabel,cfg.whatsapp?`<bdi class="contact-number" dir="ltr">${formatIntlDisplay(cfg.whatsapp)}</bdi>`:missing,cfg.whatsapp?waLink():'',waAttrs,'wa')}
        ${item('pin',c.addressLabel,cfg.address||missing,'')}
      </div>
      <div class="quote-panel reveal d1">
        <span class="icon-box" style="background:rgba(255,255,255,.08);color:#e2c78f">${icon('fileCheck')}</span>
        <h2>${c.quoteTitle}</h2><p>${c.quoteText}</p><div class="spacer"></div>
        <a class="button light" href="${withLang(paths.quote)}">${c.quoteButton}${icon('arrow','flip')}</a>
      </div>
    </div></section>
    <div style="height:104px"></div></main>`;
  }

  function quote(){
    const q=t.quote;
    const id=requestId();
    const subjectText=`${q.requestSubject} – ${id}`;
    const emailBody=fillTemplate(q.emailPrefill,{requestId:id,requestNumberLabel:q.requestNumberLabel});
    const whatsappBody=`${q.whatsappSubjectLabel}: ${subjectText}\r\n\r\n${fillTemplate(q.whatsappPrefill,{requestId:id,requestNumberLabel:q.requestNumberLabel})}`;
    const email=cfg.email?`mailto:${cfg.email}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(emailBody.replace(/\n/g,'\r\n'))}`:'#';
    const wa=cfg.whatsapp?`https://wa.me/${normalizeIntl(cfg.whatsapp)}?text=${encodeURIComponent(whatsappBody)}`:'#';
    const note=q.showNote!==false?`<div class="notice reveal"><strong>${q.noteTitle}</strong><br>${q.noteText}</div>`:'';
    return `<main id="main">${pageHero(q.title,q.intro)}
    <section class="section tight"><div class="wrap">
      <div class="method-grid">
        <article class="method reveal"><span class="icon-box">${icon('mail')}</span><h2>${q.emailTitle}</h2><p>${q.emailText}</p><div class="actions"><a class="button lg ${cfg.email?'':'disabled'}" href="${email}">${icon('mail')}${q.emailButton}</a></div></article>
        <article class="method reveal d1"><span class="icon-box wa">${icon('whatsapp')}</span><h2>${q.whatsappTitle}</h2><p>${q.whatsappText}</p><div class="actions"><a class="button lg wa-solid ${cfg.whatsapp?'':'disabled'}" ${waAttrs} href="${wa}">${icon('whatsapp')}${q.whatsappButton}</a></div></article>
      </div>
      ${note}
      <div class="info-grid">
        <article class="card reveal"><h3>${q.checklistTitle}</h3><ul class="checklist">${q.checklist.map(x=>`<li><span class="tick">${icon('check')}</span><span>${x}</span></li>`).join('')}</ul></article>
        <article class="card tinted reveal d1"><span class="icon-box ink">${icon('seal')}</span><h3>${q.processTitle}</h3><p>${q.processText}</p></article>
      </div>
    </div></section>
    <div style="height:104px"></div></main>`;
  }

  function legal(kind){
    const title=kind==='imprint'?t.legal.imprintTitle:t.legal.privacyTitle;
    const text=kind==='imprint'?t.legal.imprintText:t.legal.privacyText;
    return `<main id="main">${pageHero(title,'')}<section class="legal-section"><div class="wrap"><div class="legal-content">${text}</div></div></section></main>`;
  }

  function notfound(){
    const n=t.notFound;
    return `<main id="main"><section class="notfound"><div class="wrap"><div class="big">${num('404')}</div><h1>${n.title}</h1><p>${n.text}</p><div class="actions"><a class="button" href="${withLang(paths.home)}">${t.common.backHome}</a><a class="button ghost" href="${withLang(paths.contact)}">${t.nav.contact}</a></div></div></section></main>`;
  }

  const footer=()=>`<footer class="site-footer"><div class="wrap">
    <div class="footer-grid">
      <div><div class="footer-brand"><img src="/assets/img/mark-white.png" alt=""><strong>${t.brandName||cfg.brandName}</strong></div><p>${t.home.eyebrow}. ${t.footer.tagline}.</p></div>
      <div class="footer-col"><h3>${t.footer.navTitle}</h3><ul>
        <li><a href="${withLang(paths.home)}">${t.nav.home}</a></li><li><a href="${withLang(paths.services)}">${t.nav.services}</a></li><li><a href="${withLang(paths.about)}">${t.nav.about}</a></li><li><a href="${withLang(paths.quote)}">${t.nav.quote}</a></li>
      </ul></div>
      <div class="footer-col"><h3>${t.nav.contact}</h3><ul>
        ${cfg.email?`<li>${icon('mail')}<a href="mailto:${cfg.email}">${cfg.email}</a></li>`:''}
        ${cfg.phone?`<li>${icon('phone')}<a href="${telHref(cfg.phone)}"><bdi dir="ltr">${formatIntlDisplay(cfg.phone)}</bdi></a></li>`:''}
        ${cfg.whatsapp?`<li>${icon('whatsapp')}<a href="${waLink()}" ${waAttrs}><bdi dir="ltr">${formatIntlDisplay(cfg.whatsapp)}</bdi></a></li>`:''}
        ${cfg.address?`<li>${icon('pin')}<span>${cfg.address}</span></li>`:''}
      </ul></div>
      <div class="footer-col"><h3>${t.footer.legalTitle}</h3><ul>
        <li><a href="${withLang(paths.imprint)}">${t.footer.imprint}</a></li><li><a href="${withLang(paths.privacy)}">${t.footer.privacy}</a></li>
      </ul></div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${cfg.brandName}. ${t.footer.rights}</span><span>${t.footer.tagline}</span></div>
  </div></footer>`;

  const floating=()=>{
    if(!cfg.phone&&!cfg.whatsapp&&!cfg.email) return '';
    const row=(href,ic,label,value,extra='',cls='')=>`<a href="${href}" ${extra}><span class="icon-box ${cls}">${icon(ic)}</span><span>${label}<small>${value}</small></span></a>`;
    return `<div class="floating" id="floating">
      <div class="floating-menu" id="floatingMenu">
        ${cfg.whatsapp?row(waLink(),'whatsapp',t.common.whatsapp,`<bdi dir="ltr">${formatIntlDisplay(cfg.whatsapp)}</bdi>`,waAttrs,'wa'):''}
        ${cfg.phone?row(telHref(cfg.phone),'phone',t.common.call,`<bdi dir="ltr">${formatIntlDisplay(cfg.phone)}</bdi>`):''}
        ${cfg.email?row(mailLink(),'mail',t.common.email,cfg.email):''}
      </div>
      <button type="button" class="fab" id="floatingToggle" aria-expanded="false" aria-controls="floatingMenu" aria-label="${t.common.contact}">${icon('chat','icon-open')}${icon('close','icon-close')}</button>
    </div>`;
  };

  /* ---------- Strukturierte Daten (Google) ---------- */
  const jsonLd=()=>{
    const [street,cityLine]=(cfg.address||'').split(',').map(s=>s.trim());
    const [zip,...city]=(cityLine||'').split(' ');
    const data={'@context':'https://schema.org','@type':'ProfessionalService',name:`${cfg.brandName} – ${C.de.footer.tagline}`,
      description:C.de.meta.home.description,email:cfg.email,telephone:cfg.phone,
      address:{'@type':'PostalAddress',streetAddress:street,postalCode:zip,addressLocality:city.join(' '),addressCountry:'DE'},
      areaServed:'DE',knowsLanguage:['de','ar'],image:location.origin+'/assets/img/logo-full.png'};
    const s=document.createElement('script');s.type='application/ld+json';s.textContent=JSON.stringify(data);document.head.appendChild(s);
  };

  /* ---------- Rendern ---------- */
  const render={home,services,about,contact,quote,imprint:()=>legal('imprint'),privacy:()=>legal('privacy'),notfound}[page]||home;
  document.body.innerHTML=header()+render()+footer()+floating();
  if(page==='home') jsonLd();

  /* ---------- Interaktion ---------- */
  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{store.set('siteLang',b.dataset.lang);const u=new URL(location.href);u.searchParams.set('lang',b.dataset.lang);location.href=u.toString()}));

  const headerEl=document.getElementById('siteHeader');
  const menuBtn=document.getElementById('menuBtn');
  const setMenu=(open)=>{headerEl.classList.toggle('menu-open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?t.nav.close:t.nav.menu)};
  menuBtn.addEventListener('click',()=>setMenu(!headerEl.classList.contains('menu-open')));

  const floatEl=document.getElementById('floating');
  const floatBtn=document.getElementById('floatingToggle');
  const setFloat=(open)=>{if(!floatEl)return;floatEl.classList.toggle('open',open);floatBtn.setAttribute('aria-expanded',String(open))};
  floatBtn?.addEventListener('click',(e)=>{e.stopPropagation();setFloat(!floatEl.classList.contains('open'))});

  document.addEventListener('click',(e)=>{
    if(floatEl&&!floatEl.contains(e.target)) setFloat(false);
    if(!headerEl.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown',(e)=>{if(e.key==='Escape'){setFloat(false);setMenu(false)}});

  const onScroll=()=>headerEl.classList.toggle('scrolled',window.scrollY>8);
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});

  /* Sanftes Einblenden beim Scrollen */
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    root.classList.add('js-reveal');
    const io=new IntersectionObserver((entries)=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  }
})();
