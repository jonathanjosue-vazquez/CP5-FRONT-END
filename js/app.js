(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const elements = {
    sidebar: $("#sidebar"), backdrop: $("#backdrop"), openSidebar: $("#openSidebar"),
    closeSidebar: $("#closeSidebar"), userMenuButton: $("#userMenuButton"), userMenu: $("#userMenu"),
    themeButton: $("#themeButton"), themeMenu: $("#themeMenu"), projectModal: $("#projectModal"),
    newProjectButton: $("#newProjectButton"), closeModalButton: $("#closeModalButton"),
    cancelModalButton: $("#cancelModalButton"), projectForm: $("#projectForm"),
    formAlert: $("#formAlert"), submitProjectButton: $("#submitProjectButton"),
    projectGrid: $("#projectGrid"), emptyState: $("#emptyState"), searchInput: $("#searchInput"),
    searchInputMobile: $("#searchInputMobile"), toastRegion: $("#toastRegion"),
    activeProjects: $("#activeProjects"), completedProjects: $("#completedProjects")
  };

  const palette = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", bar: "bg-indigo-500", darkBg: "dark:bg-indigo-950", darkText: "dark:text-indigo-300" },
    sky: { bg: "bg-sky-50", text: "text-sky-600", bar: "bg-sky-500", darkBg: "dark:bg-sky-950", darkText: "dark:text-sky-300" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", bar: "bg-violet-500", darkBg: "dark:bg-violet-950", darkText: "dark:text-violet-300" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500", darkBg: "dark:bg-emerald-950", darkText: "dark:text-emerald-300" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-500", darkBg: "dark:bg-amber-950", darkText: "dark:text-amber-300" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500", darkBg: "dark:bg-rose-950", darkText: "dark:text-rose-300" }
  };

  let nextId = 7;
  let searchTerm = "";
  let showAllProjects = false;
  let lastFocusedElement = null;
  let projects = [
    { id: 1, name: "Redesign do App", category: "Design", owner: "Mariana Costa", initials: "MC", color: "indigo", status: "Em andamento", priority: "Alta", deadline: "2026-10-12", description: "Atualização da interface do aplicativo para facilitar o uso.", progress: 72, members: ["MC", "RL", "AS"], featured: true },
    { id: 2, name: "Portal do Cliente", category: "Desenvolvimento", owner: "Rafael Lima", initials: "RL", color: "sky", status: "Em andamento", priority: "Média", deadline: "2026-10-15", description: "Área para consultar solicitações e entrar em contato com o atendimento.", progress: 48, members: ["RL", "JV", "MC"] },
    { id: 3, name: "Analytics 2.0", category: "Dados", owner: "Ana Souza", initials: "AS", color: "violet", status: "Em revisão", priority: "Alta", deadline: "2026-10-21", description: "Relatórios para acompanhar os principais indicadores do negócio.", progress: 86, members: ["AS", "MC"] },
    { id: 4, name: "Campanha de Lançamento", category: "Marketing", owner: "Pedro Alves", initials: "PA", color: "amber", status: "Em andamento", priority: "Baixa", deadline: "2026-10-28", description: "Preparação dos conteúdos e materiais da próxima campanha.", progress: 35, members: ["PA", "RL", "JV"] },
    { id: 5, name: "Design System", category: "Design", owner: "Lucas Rocha", initials: "LR", color: "rose", status: "Concluído", priority: "Média", deadline: "2026-10-02", description: "Componentes e padrões visuais usados nas telas do produto.", progress: 100, members: ["LR", "MC"] },
    { id: 6, name: "Infraestrutura Cloud", category: "Infraestrutura", owner: "Camila Nunes", initials: "CN", color: "emerald", status: "Concluído", priority: "Baixa", deadline: "2026-09-30", description: "Ajustes de estabilidade e monitoramento dos serviços.", progress: 100, members: ["CN", "RL"] }
  ];

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function formatDate(dateString) {
    if (!dateString) return "Sem prazo";
    const date = new Date(`${dateString}T12:00:00`);
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date).replace(".", "");
  }

  function statusClass(status) {
    if (status === "Concluído") return "status-completed";
    if (status === "Em revisão") return "status-review";
    return "status-active";
  }

  function priorityClass(priority) {
    if (priority === "Alta") return "priority-high";
    if (priority === "Baixa") return "priority-low";
    return "priority-medium";
  }

  function renderProject(project) {
    const colors = palette[project.color] || palette.indigo;
    const memberMarkup = project.members.slice(0, 3).map((member, index) =>
      `<span class="avatar ${index === 0 ? "avatar-indigo" : index === 1 ? "avatar-blue" : "avatar-amber"} -ml-2 first:ml-0" title="${escapeHTML(member)}">${escapeHTML(member)}</span>`
    ).join("");
    const featured = project.featured ? " project-featured" : "";
    return `
      <article class="project-card${featured} group" data-project-id="${project.id}">
        <div class="project-accent ${colors.bar}"></div>
        <div class="flex items-start justify-between gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} text-lg font-bold transition-transform duration-200 group-hover:scale-105">${escapeHTML(project.category.slice(0, 1))}</div>
          <button type="button" class="project-menu-button focus:outline-none focus:ring-2 focus:ring-indigo-500" data-project-action="details" data-id="${project.id}" aria-label="Ver detalhes de ${escapeHTML(project.name)}" title="Ver detalhes">•••</button>
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="status-pill ${statusClass(project.status)}">${escapeHTML(project.status)}</span>
          <span class="priority-pill ${priorityClass(project.priority)}">${escapeHTML(project.priority)}</span>
        </div>
        <h4 class="mt-3 text-base font-bold tracking-tight">${escapeHTML(project.name)}</h4>
        <p class="project-description mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">${escapeHTML(project.description)}</p>
        <div class="mt-5 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400"><span>Progresso</span><strong class="text-slate-700 dark:text-slate-200">${project.progress}%</strong></div>
        <div class="project-progress mt-2"><span class="${colors.bar}" style="width:${project.progress}%"></span></div>
        <div class="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div class="flex items-center">${memberMarkup}<span class="ml-2 text-[11px] text-slate-400">${project.members.length} membros</span></div>
          <div class="shrink-0 text-right"><p class="text-[10px] uppercase tracking-wide text-slate-400">Prazo</p><p class="mt-0.5 text-xs font-semibold">${formatDate(project.deadline)}</p></div>
        </div>
      </article>`;
  }

  function renderProjects() {
    const normalized = searchTerm.trim().toLocaleLowerCase("pt-BR");
    const filtered = projects.filter((project) =>
      `${project.name} ${project.category} ${project.owner} ${project.status}`.toLocaleLowerCase("pt-BR").includes(normalized)
    );
    const visible = showAllProjects || normalized ? filtered : filtered.slice(0, 6);
    elements.projectGrid.innerHTML = visible.map(renderProject).join("");
    elements.emptyState.classList.toggle("hidden", visible.length > 0);
    updateMetrics();
  }

  function updateMetrics() {
    const active = projects.filter((project) => project.status === "Em andamento" || project.status === "Em revisão").length;
    const completed = projects.filter((project) => project.status === "Concluído").length;
    elements.activeProjects.textContent = active;
    elements.completedProjects.textContent = completed;
    const viewAll = $("#viewAllButton");
    viewAll.textContent = showAllProjects ? "Mostrar menos" : "Ver todos";
    viewAll.setAttribute("aria-expanded", String(showAllProjects));
  }

  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = "toast";
    const icon = type === "error" ? "Erro" : "OK";
    const iconClass = type === "error" ? "toast-error-icon" : "toast-success-icon";
    toast.innerHTML = `<span class="${iconClass}">${icon}</span><p class="flex-1 text-sm">${escapeHTML(message)}</p><button type="button" class="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Fechar aviso">Fechar</button>`;
    $("button", toast).addEventListener("click", () => toast.remove());
    elements.toastRegion.appendChild(toast);
    window.setTimeout(() => toast.remove(), 4500);
  }

  function openSidebar() {
    elements.sidebar.classList.remove("-translate-x-full");
    elements.backdrop.classList.remove("hidden");
    requestAnimationFrame(() => elements.backdrop.classList.remove("opacity-0"));
    elements.openSidebar.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden", "lg:overflow-auto");
  }

  function closeSidebar() {
    elements.sidebar.classList.add("-translate-x-full");
    elements.backdrop.classList.add("opacity-0");
    elements.openSidebar.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
      if (window.innerWidth < 1024) elements.backdrop.classList.add("hidden");
    }, 200);
    document.body.classList.remove("overflow-hidden", "lg:overflow-auto");
  }

  function closeMenus(except = null) {
    [["userMenu", "userMenuButton"], ["themeMenu", "themeButton"]].forEach(([menuId, buttonId]) => {
      if (except !== menuId) {
        $(`#${menuId}`).classList.add("hidden");
        $(`#${buttonId}`).setAttribute("aria-expanded", "false");
      }
    });
  }

  function toggleMenu(menu, button) {
    const opening = menu.classList.contains("hidden");
    closeMenus(menu.id);
    menu.classList.toggle("hidden", !opening);
    button.setAttribute("aria-expanded", String(opening));
  }

  function getSavedTheme() {
    try {
      const value = localStorage.getItem("techflow-theme");
      return ["light", "dark", "system"].includes(value) ? value : "system";
    } catch (_) {
      return "system";
    }
  }

  let themePreference = getSavedTheme();
  const systemMedia = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(preference, save = true) {
    themePreference = preference;
    const useDark = preference === "dark" || (preference === "system" && systemMedia.matches);
    document.documentElement.classList.toggle("dark", useDark);
    if (save) {
      try { localStorage.setItem("techflow-theme", preference); } catch (_) {
        showToast("Não foi possível salvar a preferência de tema neste navegador.", "error");
      }
    }
    $$("[data-theme]").forEach((button) => {
      const selected = button.dataset.theme === preference;
      $(".theme-check", button).textContent = selected ? "✓" : "";
      button.setAttribute("aria-checked", String(selected));
    });
    
  }

  function openModal() {
    lastFocusedElement = document.activeElement;
    closeMenus();
    elements.projectModal.classList.remove("hidden");
    elements.projectModal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    window.setTimeout(() => $("#projectName").focus(), 40);
  }

  function closeModal() {
    elements.projectModal.classList.add("hidden");
    elements.projectModal.classList.remove("flex");
    document.body.classList.remove("overflow-hidden");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") lastFocusedElement.focus();
  }

  function clearValidation() {
    $$(".field-error", elements.projectForm).forEach((error) => {
      error.textContent = "";
      error.classList.add("hidden");
    });
    $$(".form-input", elements.projectForm).forEach((input) => input.removeAttribute("aria-invalid"));
    elements.formAlert.classList.add("hidden");
    elements.formAlert.textContent = "";
  }

  function setFieldError(fieldName, message) {
    const input = $(`[name="${fieldName}"]`, elements.projectForm);
    const error = $(`[data-error="${fieldName}"]`, elements.projectForm);
    input.setAttribute("aria-invalid", "true");
    error.textContent = message;
    error.classList.remove("hidden");
  }

  function validateProject(data) {
    const errors = {};
    if (!data.name.trim()) errors.name = "Informe o nome do projeto.";
    else if (data.name.trim().length < 3) errors.name = "Use pelo menos 3 caracteres.";
    if (!data.owner.trim()) errors.owner = "Informe o responsável.";
    if (!data.category) errors.category = "Selecione uma categoria.";
    if (!data.priority) errors.priority = "Selecione uma prioridade.";
    if (!data.deadline) errors.deadline = "Informe o prazo.";
    else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadline = new Date(`${data.deadline}T00:00:00`);
      if (Number.isNaN(deadline.getTime())) errors.deadline = "Informe uma data válida.";
      else if (deadline < today) errors.deadline = "O prazo não pode estar no passado.";
    }
    if (!data.description.trim()) errors.description = "Informe uma descrição.";
    else if (data.description.trim().length < 10) errors.description = "Descreva o projeto em pelo menos 10 caracteres.";
    return errors;
  }

  function handleProjectSubmit(event) {
    event.preventDefault();
    clearValidation();
    const formData = new FormData(elements.projectForm);
    const data = Object.fromEntries(formData.entries());
    const errors = validateProject(data);
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([field, message]) => setFieldError(field, message));
      elements.formAlert.textContent = "Revise os campos destacados antes de continuar.";
      elements.formAlert.className = "mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-200";
      const firstInvalid = $("[aria-invalid='true']", elements.projectForm);
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    elements.submitProjectButton.disabled = true;
    elements.submitProjectButton.textContent = "Adicionando...";
    const initials = data.owner.trim().split(/\s+/).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
    const newProject = {
      id: nextId++, name: data.name.trim(), category: data.category, owner: data.owner.trim(),
      initials, color: ["indigo", "sky", "violet", "emerald", "amber", "rose"][Math.floor(Math.random() * 6)],
      status: "Em andamento", priority: data.priority, deadline: data.deadline,
      description: data.description.trim(), progress: 0, members: [initials || "TF"], featured: false
    };
    projects.unshift(newProject);
    searchTerm = "";
    if (elements.searchInput) elements.searchInput.value = "";
    if (elements.searchInputMobile) elements.searchInputMobile.value = "";
    showAllProjects = true;
    renderProjects();
    elements.projectForm.reset();
    clearValidation();
    closeModal();
    elements.submitProjectButton.disabled = false;
    elements.submitProjectButton.textContent = "Adicionar projeto";
    showToast(`Projeto “${newProject.name}” adicionado com sucesso.`);
    $("#projects").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function syncSearch(value, source) {
    searchTerm = value;
    const other = source === elements.searchInput ? elements.searchInputMobile : elements.searchInput;
    if (other && other.value !== value) other.value = value;
    renderProjects();
  }

  elements.openSidebar.addEventListener("click", openSidebar);
  elements.closeSidebar.addEventListener("click", closeSidebar);
  elements.backdrop.addEventListener("click", closeSidebar);
  elements.userMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu(elements.userMenu, elements.userMenuButton);
  });
  elements.themeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleMenu(elements.themeMenu, elements.themeButton);
  });
  $$("[data-theme]").forEach((button) => button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
    closeMenus();
    showToast(`Tema ${button.dataset.theme === "system" ? "System" : button.dataset.theme === "dark" ? "Dark" : "Light"} aplicado.`);
  }));
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#userMenu") && !event.target.closest("#userMenuButton") &&
        !event.target.closest("#themeMenu") && !event.target.closest("#themeButton")) closeMenus();
  });

  elements.newProjectButton.addEventListener("click", openModal);
  elements.closeModalButton.addEventListener("click", closeModal);
  elements.cancelModalButton.addEventListener("click", closeModal);
  elements.projectModal.addEventListener("click", (event) => {
    if (event.target === elements.projectModal) closeModal();
  });
  elements.projectForm.addEventListener("submit", handleProjectSubmit);
  $$(".form-input", elements.projectForm).forEach((input) => input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") === "true") {
      input.removeAttribute("aria-invalid");
      const error = $(`[data-error="${input.name}"]`, elements.projectForm);
      error.textContent = "";
      error.classList.add("hidden");
    }
  }));

  if (elements.searchInput) elements.searchInput.addEventListener("input", (event) => syncSearch(event.target.value, elements.searchInput));
  if (elements.searchInputMobile) elements.searchInputMobile.addEventListener("input", (event) => syncSearch(event.target.value, elements.searchInputMobile));
  $("#viewAllButton").addEventListener("click", () => {
    showAllProjects = !showAllProjects;
    renderProjects();
  });

  elements.projectGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-action='details']");
    if (!button) return;
    const project = projects.find((item) => item.id === Number(button.dataset.id));
    if (project) showToast(`${project.name} · Responsável: ${project.owner} · Categoria: ${project.category} · Prazo: ${formatDate(project.deadline)}.`);
  });

  $$("[data-nav]").forEach((link) => link.addEventListener("click", () => {
    $$("[data-nav]").forEach((item) => {
      item.classList.remove("nav-link-active");
      item.classList.add("font-medium");
      item.classList.remove("font-semibold");
      const dot = item.querySelector(".ml-auto.h-1\\.5");
      if (dot) dot.remove();
    });
    link.classList.add("nav-link-active", "font-semibold");
    link.classList.remove("font-medium");
    closeSidebar();
    const target = link.getAttribute("href");
    if (target === "#settings") {
      showToast("As preferências de tema estão disponíveis no seletor “Tema”.");
    } else if (target === "#projects") {
      $("#projects").scrollIntoView({ behavior: "smooth" });
    } else if (target === "#teams") {
      $("#teams").scrollIntoView({ behavior: "smooth" });
    } else if (target === "#calendar") {
      $("#calendar").scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }));

  $("#notificationsButton").addEventListener("click", () => showToast("Você está em dia com as notificações do workspace."));
  $("#activityButton").addEventListener("click", () => showToast("Estas são as três atualizações mais recentes do workspace."));
  $("#userMenu").addEventListener("click", (event) => {
    const button = event.target.closest("[data-user-action]");
    if (!button) return;
    closeMenus();
    const actions = { profile: "Perfil demonstrativo de Jonathan Vazquez.", settings: "Use o seletor de tema para ajustar a aparência.", logout: "Esta demonstração não possui autenticação ou sessão para encerrar." };
    showToast(actions[button.dataset.userAction] || "Ação demonstrativa.");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenus();
      if (!elements.projectModal.classList.contains("hidden")) closeModal();
      if (window.innerWidth < 1024 && !elements.sidebar.classList.contains("-translate-x-full")) closeSidebar();
    }
    if (event.key === "Tab" && !elements.projectModal.classList.contains("hidden")) {
      const focusable = $$("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]", elements.projectModal)
        .filter((element) => element.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  systemMedia.addEventListener?.("change", () => {
    if (themePreference === "system") applyTheme("system", false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      elements.sidebar.classList.remove("-translate-x-full");
      elements.backdrop.classList.add("hidden", "opacity-0");
      elements.openSidebar.setAttribute("aria-expanded", "false");
      document.body.classList.remove("overflow-hidden", "lg:overflow-auto");
    } else {
      elements.sidebar.classList.add("-translate-x-full");
    }
  });

  applyTheme(themePreference, false);
  renderProjects();
})();
