const STORAGE_KEY = "ai-product-teardown-cards";

const starterProducts = [
  {
    id: "cursor",
    name: "Cursor",
    category: "AI Coding Tool",
    positioning: "面向开发者的 AI 原生代码编辑器，把代码理解、生成、修改和调试放进 IDE 工作流。",
    users: "开发者、独立创作者、需要快速搭建原型的产品/技术复合型用户。",
    scenario: "用户在写代码时需要理解旧代码、生成新功能、修复错误和跨文件修改。",
    aiRole: "AI 不只是聊天助手，而是直接理解代码上下文，并在编辑器里完成建议、改写和多文件操作。",
    retention: "它嵌入高频工作流，能持续减少查文档、复制粘贴和手动改代码的成本。",
    business: "订阅制，围绕个人开发者和团队协作扩展。",
    lesson: "AI 产品要尽量贴近用户原有工作界面，减少切换成本。"
  },
  {
    id: "perplexity",
    name: "Perplexity",
    category: "AI Search",
    positioning: "面向知识检索的 AI 搜索产品，用答案、引用和追问替代传统搜索结果页。",
    users: "研究者、学生、产品经理、需要快速理解一个主题的人。",
    scenario: "用户想快速了解一个问题，但不想在多个网页之间反复筛选和比对。",
    aiRole: "AI 汇总多来源信息，生成可读答案，并保留来源引用帮助用户判断可信度。",
    retention: "它把搜索、阅读、归纳和追问合成一个连续体验。",
    business: "免费增值与订阅制，面向高频知识工作者。",
    lesson: "AI 输出必须解决可信度问题，引用和可追溯来源是关键体验。"
  },
  {
    id: "gamma",
    name: "Gamma",
    category: "AI Presentation",
    positioning: "面向表达和内容创作的 AI 演示文稿工具，把主题输入转成结构化页面。",
    users: "职场汇报者、创业者、学生、内容创作者。",
    scenario: "用户需要快速把一个想法整理成可展示、可分享的页面或演示文稿。",
    aiRole: "AI 负责生成结构、文案和视觉初稿，用户再做编辑和风格调整。",
    retention: "它降低了从空白页开始的心理负担，让用户更快进入可编辑状态。",
    business: "订阅制，围绕生成次数、导出和团队功能收费。",
    lesson: "生成式 AI 产品要给用户可控的中间态，而不是只给一次性最终结果。"
  }
];

const starterProductIds = new Set(starterProducts.map((product) => product.id));

const fields = [
  "name",
  "category",
  "positioning",
  "users",
  "scenario",
  "aiRole",
  "retention",
  "business",
  "lesson"
];

const form = document.querySelector("#teardown-form");
const card = document.querySelector("#teardown-card");
const productList = document.querySelector("#product-list");
const newButton = document.querySelector("#new-card");
const saveButton = document.querySelector("#save-card");
const exportButton = document.querySelector("#export-card");
const deleteButton = document.querySelector("#delete-card");

let products = normalizeProducts(loadProducts(), { keepBlank: false });
if (!products.length) {
  products = starterProducts;
}
let activeId = getDefaultActiveId();

renderList();
loadIntoForm(getActiveProduct());
renderCard(getFormData());

form.addEventListener("input", () => {
  renderCard(getFormData());
});

newButton.addEventListener("click", () => {
  const product = createBlankProduct();
  products = [...products, product];
  activeId = product.id;
  persist();
  renderList();
  loadIntoForm(product);
  renderCard(product);
  form.elements.name.focus();
});

saveButton.addEventListener("click", () => {
  const data = { ...getFormData(), id: activeId || createId() };
  const index = products.findIndex((product) => product.id === data.id);
  if (index >= 0) {
    products[index] = data;
  } else {
    products.push(data);
  }
  activeId = data.id;
  persist();
  renderList();
  renderCard(data);
});

deleteButton.addEventListener("click", () => {
  if (isStarterProduct(getActiveProduct())) return;
  products = products.filter((product) => product.id !== activeId);
  activeId = getDefaultActiveId();
  persist();
  renderList();
  loadIntoForm(getActiveProduct());
  renderCard(getActiveProduct());
});

exportButton.addEventListener("click", async () => {
  const markdown = toMarkdown(getFormData());
  try {
    await navigator.clipboard.writeText(markdown);
    exportButton.textContent = "已复制 Markdown";
    setTimeout(() => {
      exportButton.textContent = "导出 Markdown";
    }, 1600);
  } catch {
    downloadMarkdown(markdown, `${slugify(getFormData().name || "teardown")}.md`);
  }
});

function renderList() {
  productList.innerHTML = "";
  products.forEach((product) => {
    const button = document.createElement("button");
    button.className = `product-button${product.id === activeId ? " active" : ""}`;
    button.type = "button";
    button.textContent = product.name || "未命名产品";
    button.addEventListener("click", () => {
      activeId = product.id;
      renderList();
      loadIntoForm(product);
      renderCard(product);
    });
    productList.append(button);
  });
  updateActionState();
}

function renderCard(product) {
  card.innerHTML = `
    <div class="meta">
      <span>${escapeHtml(product.category || "AI Product")}</span>
      <span>${escapeHtml(product.name || "未命名产品")}</span>
    </div>
    <h2>${escapeHtml(product.name || "未命名产品")}</h2>
    <p>${escapeHtml(product.positioning || "先写一句话定位：它是什么，帮谁解决什么问题。")}</p>
    <div class="grid">
      ${block("目标用户", product.users)}
      ${block("核心场景", product.scenario)}
      ${block("AI 介入方式", product.aiRole)}
      ${block("用户为什么留下", product.retention)}
      ${block("商业模式", product.business)}
      ${block("我能学到什么", product.lesson)}
    </div>
  `;
  updateActionState();
}

function block(title, text) {
  return `<section class="block"><h3>${title}</h3><p>${escapeHtml(text || "待补充")}</p></section>`;
}

function loadIntoForm(product) {
  fields.forEach((field) => {
    form.elements[field].value = product?.[field] || "";
  });
}

function getFormData() {
  const data = { id: activeId || createId() };
  fields.forEach((field) => {
    data[field] = form.elements[field].value.trim();
  });
  return data;
}

function getActiveProduct() {
  return products.find((product) => product.id === activeId) || products.find((product) => !isBlankProduct(product)) || products[0] || createBlankProduct();
}

function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return starterProducts;
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? mergeStarterProducts(parsed) : starterProducts;
  } catch {
    return starterProducts;
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProducts(products, { keepBlank: false })));
}

function createBlankProduct() {
  return {
    id: createId(),
    name: "新 AI 产品",
    category: "AI Product",
    positioning: "",
    users: "",
    scenario: "",
    aiRole: "",
    retention: "",
    business: "",
    lesson: ""
  };
}

function normalizeProducts(items, options = { keepBlank: true }) {
  const withIds = items.map((product) => ({
    ...product,
    id: product.id || createId()
  }));
  if (!options.keepBlank) {
    return withIds.filter((product) => !isBlankProduct(product));
  }
  return [
    ...withIds.filter((product) => !isBlankProduct(product)),
    ...withIds.filter((product) => isBlankProduct(product))
  ];
}

function mergeStarterProducts(savedProducts) {
  const savedById = new Map(savedProducts.map((product) => [product.id, product]));
  const fixedStarters = starterProducts.map((starter) => ({
    ...starter,
    ...savedById.get(starter.id),
    id: starter.id
  }));
  const customProducts = savedProducts.filter((product) => !starterProductIds.has(product.id));
  return [...fixedStarters, ...customProducts];
}

function isStarterProduct(product) {
  return starterProductIds.has(product?.id);
}

function updateActionState() {
  const canDelete = !isStarterProduct(getActiveProduct());
  deleteButton.hidden = !canDelete;
  deleteButton.disabled = !canDelete;
}

function isBlankProduct(product) {
  return product.name === "新 AI 产品"
    && !product.positioning
    && !product.users
    && !product.scenario
    && !product.aiRole
    && !product.retention
    && !product.business
    && !product.lesson;
}

function getDefaultActiveId() {
  return products.find((product) => !isBlankProduct(product))?.id || products[0]?.id;
}

function createId() {
  return `product-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function toMarkdown(product) {
  return `# ${product.name || "未命名产品"} 产品拆解

- 类型：${product.category || "AI Product"}
- 一句话定位：${product.positioning || "待补充"}

## 目标用户
${product.users || "待补充"}

## 核心场景
${product.scenario || "待补充"}

## AI 介入方式
${product.aiRole || "待补充"}

## 用户为什么留下
${product.retention || "待补充"}

## 商业模式
${product.business || "待补充"}

## 我能学到什么
${product.lesson || "待补充"}
`;
}

function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/gi, "-").replace(/^-|-$/g, "") || "teardown";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
