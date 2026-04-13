(() => {
  let products = [];
  const CATEGORY_LABEL = {
    fabric: "Fabric", tool: "Tool", book: "Book", notion: "Notion", kit: "Kit"
  };
  const BRAND_LABEL = {
    lecien: "Lecien", cosmo: "Cosmo", olympus: "Olympus", clover: "Clover",
    tulip: "Tulip", kokka: "Kokka", yuwa: "Yuwa", sevenberry: "Sevenberry",
    "yoko-saito": "Yoko Saito", "akemi-shibata": "Akemi Shibata", "reiko-kato": "Reiko Kato"
  };
  const TYPE_LABEL = {
    taupe: "Taupe", floral: "Floral", geometric: "Geometric", solid: "Solid", print: "Print"
  };

  const $ = id => document.getElementById(id);

  function populateFilters() {
    const cats = [...new Set(products.map(p => p.category))].sort();
    const brands = [...new Set(products.map(p => p.brand))].sort();
    const types = [...new Set(products.map(p => p.type))].sort();

    cats.forEach(c => $("category").innerHTML += `<option value="${c}">${CATEGORY_LABEL[c] || c}</option>`);
    brands.forEach(b => $("brand").innerHTML += `<option value="${b}">${BRAND_LABEL[b] || b}</option>`);
    types.forEach(t => $("type").innerHTML += `<option value="${t}">${TYPE_LABEL[t] || t}</option>`);
  }

  function getFiltered() {
    const q = $("search").value.toLowerCase();
    const cat = $("category").value;
    const br = $("brand").value;
    const tp = $("type").value;
    const sort = $("sort").value;

    let list = products.filter(p => {
      if (cat && p.category !== cat) return false;
      if (br && p.brand !== br) return false;
      if (tp && p.type !== tp) return false;
      if (q && !p.name.toLowerCase().includes(q) && !(BRAND_LABEL[p.brand] || p.brand).toLowerCase().includes(q)) return false;
      return true;
    });

    if (sort === "price-asc") list.sort((a, b) => a.price_usd - b.price_usd);
    else if (sort === "price-desc") list.sort((a, b) => b.price_usd - a.price_usd);
    else if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  function renderCard(p) {
    const prosHtml = (p.pros || []).map(pr => `<li>${pr}</li>`).join("");
    const expertHtml = p.expert_note ? `<div class="expert-note">${p.expert_note}</div>` : "";
    const materialBadge = p.material ? `<span class="badge badge-material">${p.material}</span>` : "";
    const piecesInfo = p.pieces ? `<span>${p.pieces} pieces</span>` : "";
    const weightInfo = p.weight ? `<span>${p.weight}</span>` : "";
    const linkHtml = p.amazon_url ? `<div class="product-link"><a href="${p.amazon_url}" target="_blank" rel="noopener">Search on Amazon</a></div>` : "";

    return `<div class="product-card">
      <div class="brand-label">${BRAND_LABEL[p.brand] || p.brand}</div>
      <h3>${p.name}</h3>
      <div class="badges">
        <span class="badge badge-cat">${CATEGORY_LABEL[p.category] || p.category}</span>
        <span class="badge badge-type">${TYPE_LABEL[p.type] || p.type}</span>
        ${materialBadge}
      </div>
      <div class="product-meta">
        <span>\uD83C\uDDEF\uD83C\uDDF5 Japan</span>
        ${piecesInfo}
        ${weightInfo}
      </div>
      <div class="product-price">$${p.price_usd.toFixed(2)}</div>
      <ul class="product-pros">${prosHtml}</ul>
      <div class="product-best"><strong>Best for:</strong> ${p.best_for}</div>
      ${expertHtml}
      ${linkHtml}
    </div>`;
  }

  function render() {
    const list = getFiltered();
    $("resultCount").textContent = `${list.length} product${list.length !== 1 ? "s" : ""} found`;
    $("grid").innerHTML = list.map(renderCard).join("");
  }

  function init() {
    fetch("data/products.json")
      .then(r => r.json())
      .then(data => {
        products = data;
        populateFilters();
        render();
      })
      .catch(err => {
        $("grid").innerHTML = `<p style="padding:24px;color:#78716C">Could not load products. ${err.message}</p>`;
      });

    ["search", "category", "brand", "type", "sort"].forEach(id => {
      $(id).addEventListener(id === "search" ? "input" : "change", render);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
