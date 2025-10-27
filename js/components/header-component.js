class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    try {
      // NOTE: path is relative to the PAGE URL (/static/index.html)
      const res = await fetch('./components/header.html');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();

      // parse and clone template
      const tplHost = document.createElement('div');
      tplHost.innerHTML = html;
      const tpl = tplHost.querySelector('#header-template');
      if (!tpl) throw new Error('header-template not found');

      this.shadowRoot.appendChild(tpl.content.cloneNode(true));
    } catch (err) {
      console.error('SiteHeader load failed:', err);
      this.shadowRoot.innerHTML = '<div style="color:red">Header failed to load.</div>';
    }
  }
}

customElements.define('site-header', SiteHeader);
