/**
 * Vega & Asociados — Estudio Jurídico — Lógica Interactiva (Vanilla JS)
 */
(function () {
  'use strict';

  const DATA = window.VEGA_ASOCIADOS_DATA;
  if (!DATA) return;

  const {
    FIRM_CONFIG,
    PARTNERS,
    MODALITIES,
    MAIN_PRACTICE_AREAS,
    ADDITIONAL_SPECIALTIES,
    GOOGLE_REVIEWS
  } = DATA;

  // Estado global del Pre-clasificador WhatsApp y UI
  const state = {
    selectedAreaId: MAIN_PRACTICE_AREAS[0].id,
    selectedTopicLabel: MAIN_PRACTICE_AREAS[0].title,
    selectedIsExtra: false,
    modalityId: MODALITIES[0].id,
    partnerId: MAIN_PRACTICE_AREAS[0].recommendedPartner,
    partnerManuallyChosen: false,
    clientName: '',
    clientNote: '',
    activePracticeCardId: null,
    accordionOpen: false,
    carouselIndex: 0
  };

  // Utilidad segura para escapar texto en HTML
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Sanitización de entradas de usuario para el pre-clasificador WhatsApp
  function sanitizeUserInput(str, maxLength) {
    return String(str || '')
      .replace(/[\u0000-\u001F\u007F-\u009F\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, ' ')
      .replace(/[<>]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLength);
  }

  // Íconos SVG minimalistas por área principal
  function getAreaIconSvg(iconName) {
    const icons = {
      briefcase:
        '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m12 5a16.95 16.95 0 01-8 2 16.95 16.95 0 01-8-2"/></svg>',
      car:
        '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M5 17h14M6 17a2 2 0 11-4 0 2 2 0 014 0zm16 0a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 13l2.2-5.5A2 2 0 017.05 6h9.9a2 2 0 011.85 1.5L21 13v4H3v-4z"/></svg>',
      building:
        '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 10h.01M15 10h.01M9 14h.01M15 14h.01"/></svg>',
      shield:
        '<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3l7 3v5c0 5-3.5 9.2-7 10.5C8.5 20.2 5 16 5 11V6l7-3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M9.5 12l1.8 1.8 3.7-3.8"/></svg>'
    };
    return icons[iconName] || icons.shield;
  }

  /* =========================================================================
     1. NAVBAR STICKY Y MENÚ MÓVIL
     ========================================================================= */
  function initNavbar() {
    const header = document.getElementById('site-header');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    function updateScrollState() {
      if (!header) return;
      if (window.scrollY > 24) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    function setMobileMenu(open) {
      if (!toggleBtn || !mobileMenu) return;
      toggleBtn.setAttribute('aria-expanded', String(open));
      mobileMenu.classList.toggle('hidden', !open);
      if (iconOpen && iconClose) {
        iconOpen.classList.toggle('hidden', open);
        iconClose.classList.toggle('hidden', !open);
      }
    }

    if (toggleBtn && mobileMenu) {
      toggleBtn.addEventListener('click', () => {
        const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
        setMobileMenu(!isOpen);
      });

      mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMobileMenu(false));
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
          setMobileMenu(false);
          toggleBtn.focus();
        }
      });
    }
  }

  /* =========================================================================
     2. ÁREAS DE PRÁCTICA (4 TARJETAS INTERACTIVAS + ACORDEÓN 11 ESPECIALIDADES)
     ========================================================================= */
  function renderPracticeCards() {
    const grid = document.getElementById('main-areas-grid');
    if (!grid) return;

    grid.innerHTML = MAIN_PRACTICE_AREAS.map((area) => {
      const isSelected = area.id === state.activePracticeCardId;
      return `
        <article
          class="practice-card group relative flex flex-col justify-between rounded-2xl border ${
            isSelected
              ? 'is-selected bg-white border-gold'
              : 'bg-white border-slate-200 hover:border-gold/60'
          } p-6 sm:p-7 shadow-sm cursor-pointer"
          data-area-card="${escapeHtml(area.id)}"
          tabindex="0"
          role="button"
          aria-pressed="${isSelected ? 'true' : 'false'}"
        >
          <div>
            <div class="flex items-center justify-between gap-3 mb-5">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-navy text-gold'
                  : 'bg-slate-100 text-navy group-hover:bg-navy group-hover:text-gold'
              }">
                ${getAreaIconSvg(area.icon)}
              </div>
              <span class="text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
                isSelected
                  ? 'bg-amber-50 text-bronze border border-amber-200'
                  : 'bg-slate-100 text-slate-600'
              }">
                ${escapeHtml(area.shortTag)}
              </span>
            </div>

            <h3 class="font-serif text-xl sm:text-2xl font-semibold text-navy mb-2.5 leading-snug">
              ${escapeHtml(area.title)}
            </h3>
            <p class="text-slate-600 text-sm leading-relaxed">
              ${escapeHtml(area.summary)}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold">
            <span class="${isSelected ? 'text-bronze' : 'text-navy group-hover:text-bronze'} transition-colors">
              ${isSelected ? 'Detalle seleccionado' : 'Ver alcances y casos'}
            </span>
            <svg class="w-4 h-4 text-bronze transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('[data-area-card]').forEach((card) => {
      const selectArea = () => {
        const areaId = card.getAttribute('data-area-card');
        if (!areaId) return;
        state.activePracticeCardId = state.activePracticeCardId === areaId ? null : areaId;
        renderPracticeCards();
        renderActiveAreaDetail();
      };

      card.addEventListener('click', selectArea);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectArea();
        }
      });
    });
  }

  function renderActiveAreaDetail() {
    const detailContainer = document.getElementById('active-area-detail');
    if (!detailContainer) return;

    const area = MAIN_PRACTICE_AREAS.find((a) => a.id === state.activePracticeCardId);
    if (!area) {
      detailContainer.innerHTML = '';
      detailContainer.classList.add('hidden');
      return;
    }

    detailContainer.classList.remove('hidden');
    const partner = PARTNERS.find((p) => p.id === area.recommendedPartner) || PARTNERS[0];

    detailContainer.innerHTML = `
      <div class="rounded-2xl bg-navy text-white p-6 sm:p-8 lg:p-10 border border-gold/25 shadow-xl relative">
        <button
          type="button"
          id="close-area-detail"
          aria-label="Cerrar detalle de ${escapeHtml(area.title)}"
          class="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-lg border border-white/15 hover:border-gold/60 text-slate-300 hover:text-gold flex items-center justify-center transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 pr-8 sm:pr-0">
            <div class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold mb-3">
              <span class="w-2 h-2 rounded-full bg-gold"></span>
              Enfoque Extrajudicial · ${escapeHtml(area.shortTag)}
            </div>
            <h3 class="font-serif text-2xl sm:text-3xl font-semibold text-white mb-3">
              ${escapeHtml(area.title)}
            </h3>
            <p class="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              ${escapeHtml(area.approach)}
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <button
                type="button"
                data-prefill-area="${escapeHtml(area.id)}"
                class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gold hover:bg-amber-600 text-navy font-semibold text-sm transition-colors shadow-lg shadow-black/20"
              >
                <span>Consultar por ${escapeHtml(area.title)}</span>
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
              <span class="text-xs text-slate-400">
                Socio referente: <strong class="text-slate-200">${escapeHtml(partner.fullName)}</strong>
              </span>
            </div>
          </div>

          <div class="lg:col-span-5 bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6">
            <h4 class="text-xs font-semibold uppercase tracking-wider text-gold mb-4">
              Casos frecuentes que resolvemos
            </h4>
            <ul class="space-y-3">
              ${area.cases
                .map(
                  (item) => `
                <li class="flex items-start gap-3 text-sm text-slate-200">
                  <svg class="w-4 h-4 text-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>${escapeHtml(item)}</span>
                </li>`
                )
                .join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('close-area-detail');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        state.activePracticeCardId = null;
        renderPracticeCards();
        renderActiveAreaDetail();
      });
    }

    const prefillBtn = detailContainer.querySelector('[data-prefill-area]');
    if (prefillBtn) {
      prefillBtn.addEventListener('click', () => {
        prefillFunnelTopic(area.id, false);
      });
    }
  }

  function initSpecialtiesAccordion() {
    const toggleBtn = document.getElementById('accordion-toggle-btn');
    const panel = document.getElementById('accordion-specialties-panel');
    const listContainer = document.getElementById('additional-specialties-grid');
    const chevron = document.getElementById('accordion-chevron');
    const countBadge = document.getElementById('additional-specialties-count');

    if (countBadge) {
      countBadge.textContent = `${ADDITIONAL_SPECIALTIES.length} especialidades`;
    }

    if (listContainer) {
      listContainer.innerHTML = ADDITIONAL_SPECIALTIES.map((spec, idx) => {
        const partner = PARTNERS.find((p) => p.id === spec.recommendedPartner) || PARTNERS[0];
        return `
          <div class="group rounded-xl border border-slate-200 bg-white p-5 hover:border-gold/70 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-[11px] font-bold tracking-widest text-bronze uppercase">
                  ${String(idx + 1).padStart(2, '0')}
                </span>
                <span class="text-[11px] text-slate-400 font-medium">
                  ${escapeHtml(partner.shortName)}
                </span>
              </div>
              <h4 class="font-serif text-lg font-semibold text-navy mb-1.5">
                ${escapeHtml(spec.title)}
              </h4>
              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                ${escapeHtml(spec.description)}
              </p>
            </div>
            <div class="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                data-prefill-extra="${escapeHtml(spec.id)}"
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-bronze transition-colors"
              >
                <span>Consultar por ${escapeHtml(spec.title)}</span>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('');

      listContainer.querySelectorAll('[data-prefill-extra]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const extraId = btn.getAttribute('data-prefill-extra');
          if (extraId) prefillFunnelTopic(extraId, true);
        });
      });
    }

    if (toggleBtn && panel) {
      toggleBtn.addEventListener('click', () => {
        state.accordionOpen = !state.accordionOpen;
        toggleBtn.setAttribute('aria-expanded', String(state.accordionOpen));
        panel.classList.toggle('is-open', state.accordionOpen);
        if (chevron) {
          chevron.classList.toggle('rotate-180', state.accordionOpen);
        }
      });
    }
  }

  /* =========================================================================
     3. PRE-CLASIFICADOR DE CONSULTAS (EMBUDOS WHATSAPP)
     ========================================================================= */
  function prefillFunnelTopic(topicId, isExtra) {
    if (isExtra) {
      const extra = ADDITIONAL_SPECIALTIES.find((s) => s.id === topicId);
      if (!extra) return;
      state.selectedAreaId = extra.id;
      state.selectedTopicLabel = extra.title;
      state.selectedIsExtra = true;
      if (!state.partnerManuallyChosen) {
        state.partnerId = extra.recommendedPartner;
      }
    } else {
      const main = MAIN_PRACTICE_AREAS.find((a) => a.id === topicId);
      if (!main) return;
      state.selectedAreaId = main.id;
      state.selectedTopicLabel = main.title;
      state.selectedIsExtra = false;
      if (!state.partnerManuallyChosen) {
        state.partnerId = main.recommendedPartner;
      }
    }

    renderFunnelControls();
    updateWhatsAppPreview();

    const section = document.getElementById('consulta');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderFunnelControls() {
    const mainTopicsWrap = document.getElementById('funnel-main-topics');
    const extraSelectWrap = document.getElementById('funnel-extra-select-wrap');
    const extraSelect = document.getElementById('funnel-extra-select');
    const modalitiesWrap = document.getElementById('funnel-modalities');
    const partnersWrap = document.getElementById('funnel-partners');

    if (mainTopicsWrap) {
      const buttonsHtml = MAIN_PRACTICE_AREAS.map((area) => {
        const active = !state.selectedIsExtra && state.selectedAreaId === area.id;
        return `
          <button
            type="button"
            data-funnel-main="${escapeHtml(area.id)}"
            aria-pressed="${active ? 'true' : 'false'}"
            class="text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              active
                ? 'bg-gold/15 border-gold text-white shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
            }"
          >
            <span class="block font-semibold ${active ? 'text-gold' : 'text-white'}">${escapeHtml(area.title)}</span>
            <span class="block text-[11px] text-slate-400 mt-0.5">${escapeHtml(area.shortTag)}</span>
          </button>
        `;
      }).join('');

      const otherActive = state.selectedIsExtra;
      const otherBtnHtml = `
        <button
          type="button"
          id="funnel-other-btn"
          aria-pressed="${otherActive ? 'true' : 'false'}"
          class="sm:col-span-2 text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${
            otherActive
              ? 'bg-gold/15 border-gold text-white'
              : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
          }"
        >
          <div>
            <span class="block font-semibold ${otherActive ? 'text-gold' : 'text-white'}">
              Otra especialidad (${ADDITIONAL_SPECIALTIES.length} materias)
            </span>
            <span class="block text-[11px] text-slate-400 mt-0.5">
              Tierras, Cobranzas, Contratos, Seguros, Mediación, Automotor y más
            </span>
          </div>
          <svg class="w-4 h-4 text-gold shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>
      `;

      mainTopicsWrap.innerHTML = buttonsHtml + otherBtnHtml;

      mainTopicsWrap.querySelectorAll('[data-funnel-main]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-funnel-main');
          const found = MAIN_PRACTICE_AREAS.find((a) => a.id === id);
          if (!found) return;
          state.selectedAreaId = found.id;
          state.selectedTopicLabel = found.title;
          state.selectedIsExtra = false;
          if (!state.partnerManuallyChosen) {
            state.partnerId = found.recommendedPartner;
          }
          renderFunnelControls();
          updateWhatsAppPreview();
        });
      });

      const otherBtn = document.getElementById('funnel-other-btn');
      if (otherBtn) {
        otherBtn.addEventListener('click', () => {
          state.selectedIsExtra = true;
          const firstExtra =
            ADDITIONAL_SPECIALTIES.find((s) => s.id === state.selectedAreaId) ||
            ADDITIONAL_SPECIALTIES[0];
          state.selectedAreaId = firstExtra.id;
          state.selectedTopicLabel = firstExtra.title;
          if (!state.partnerManuallyChosen) {
            state.partnerId = firstExtra.recommendedPartner;
          }
          renderFunnelControls();
          updateWhatsAppPreview();
          if (extraSelect) extraSelect.focus();
        });
      }
    }

    if (extraSelectWrap && extraSelect) {
      extraSelectWrap.classList.toggle('hidden', !state.selectedIsExtra);
      if (extraSelect.options.length === 0) {
        extraSelect.innerHTML = ADDITIONAL_SPECIALTIES.map(
          (s) => `<option value="${escapeHtml(s.id)}">${escapeHtml(s.title)}</option>`
        ).join('');
      }
      if (state.selectedIsExtra) {
        extraSelect.value = state.selectedAreaId;
      }
    }

    if (modalitiesWrap) {
      modalitiesWrap.innerHTML = MODALITIES.map((mod) => {
        const active = state.modalityId === mod.id;
        return `
          <button
            type="button"
            data-funnel-modality="${escapeHtml(mod.id)}"
            aria-pressed="${active ? 'true' : 'false'}"
            class="text-left p-4 rounded-xl border transition-all ${
              active
                ? 'bg-gold/15 border-gold text-white shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
            }"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="font-semibold text-sm ${active ? 'text-gold' : 'text-white'}">${escapeHtml(mod.title)}</span>
              <span class="w-4 h-4 rounded-full border flex items-center justify-center ${
                active ? 'border-gold bg-gold' : 'border-slate-500'
              }">
                ${active ? '<span class="w-1.5 h-1.5 rounded-full bg-navy"></span>' : ''}
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-1.5 leading-relaxed">${escapeHtml(mod.subtitle)}</p>
          </button>
        `;
      }).join('');

      modalitiesWrap.querySelectorAll('[data-funnel-modality]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const modId = btn.getAttribute('data-funnel-modality');
          if (!modId) return;
          state.modalityId = modId;
          renderFunnelControls();
          updateWhatsAppPreview();
        });
      });
    }

    if (partnersWrap) {
      partnersWrap.innerHTML = PARTNERS.map((partner) => {
        const active = state.partnerId === partner.id;
        return `
          <button
            type="button"
            data-funnel-partner="${escapeHtml(partner.id)}"
            aria-pressed="${active ? 'true' : 'false'}"
            class="text-left p-4 rounded-xl border transition-all ${
              active
                ? 'bg-gold/15 border-gold text-white shadow-sm'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
            }"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="font-semibold text-sm ${active ? 'text-gold' : 'text-white'}">${escapeHtml(partner.shortName)}</span>
              <span class="w-4 h-4 rounded-full border flex items-center justify-center ${
                active ? 'border-gold bg-gold' : 'border-slate-500'
              }">
                ${active ? '<span class="w-1.5 h-1.5 rounded-full bg-navy"></span>' : ''}
              </span>
            </div>
            <p class="text-[11px] text-slate-300 mt-1">${escapeHtml(partner.role)}</p>
          </button>
        `;
      }).join('');

      partnersWrap.querySelectorAll('[data-funnel-partner]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const partnerId = btn.getAttribute('data-funnel-partner');
          if (!partnerId) return;
          state.partnerId = partnerId;
          state.partnerManuallyChosen = true;
          renderFunnelControls();
          updateWhatsAppPreview();
        });
      });
    }
  }

  function buildWhatsAppMessage() {
    const partner = PARTNERS.find((p) => p.id === state.partnerId) || PARTNERS[0];
    const modality = MODALITIES.find((m) => m.id === state.modalityId) || MODALITIES[0];
    const safeName = sanitizeUserInput(state.clientName, 80);
    const safeNote = sanitizeUserInput(state.clientNote, 300);

    const lines = [
      `Hola ${partner.shortName}, me comunico desde el sitio web de *Vega & Asociados — Estudio Jurídico*.`,
      '',
      `*Motivo de consulta:* ${state.selectedTopicLabel}`,
      `*Modalidad:* ${modality.whatsappLabel}`
    ];

    if (safeName) {
      lines.push(`*Nombre:* ${safeName}`);
    }
    if (safeNote) {
      lines.push(`*Breve resumen:* ${safeNote}`);
    }

    lines.push('', 'Quedo atento/a para coordinar una consulta y evaluar una solución rápida. ¡Muchas gracias!');
    return lines.join('\n');
  }

  function updateWhatsAppPreview() {
    const partner = PARTNERS.find((p) => p.id === state.partnerId) || PARTNERS[0];
    const previewEl = document.getElementById('whatsapp-message-preview');
    const recipientNameEl = document.getElementById('whatsapp-recipient-name');
    const recipientRoleEl = document.getElementById('whatsapp-recipient-role');
    const recipientAvatarEl = document.getElementById('whatsapp-recipient-initials');
    const submitLink = document.getElementById('whatsapp-submit-link');

    const safePhone = String(partner.whatsapp || '').replace(/\D/g, '');
    const message = buildWhatsAppMessage();
    const waUrl = `https://wa.me/${safePhone}?text=${encodeURIComponent(message)}`;

    if (previewEl) previewEl.textContent = message;
    if (recipientNameEl) recipientNameEl.textContent = partner.fullName;
    if (recipientRoleEl) recipientRoleEl.textContent = partner.role;
    if (recipientAvatarEl) recipientAvatarEl.textContent = partner.initials;
    if (submitLink) {
      submitLink.href = safePhone ? waUrl : '#consulta';
      submitLink.setAttribute('aria-label', `Enviar consulta por WhatsApp a ${partner.fullName}`);
    }
  }

  function initWhatsAppFunnel() {
    const extraSelect = document.getElementById('funnel-extra-select');
    const nameInput = document.getElementById('funnel-client-name');
    const noteInput = document.getElementById('funnel-client-note');
    const copyBtn = document.getElementById('whatsapp-copy-btn');

    renderFunnelControls();
    updateWhatsAppPreview();

    if (extraSelect) {
      extraSelect.addEventListener('change', () => {
        const chosen = ADDITIONAL_SPECIALTIES.find((s) => s.id === extraSelect.value);
        if (!chosen) return;
        state.selectedAreaId = chosen.id;
        state.selectedTopicLabel = chosen.title;
        state.selectedIsExtra = true;
        if (!state.partnerManuallyChosen) {
          state.partnerId = chosen.recommendedPartner;
          renderFunnelControls();
        }
        updateWhatsAppPreview();
      });
    }

    if (nameInput) {
      nameInput.addEventListener('input', () => {
        state.clientName = nameInput.value;
        updateWhatsAppPreview();
      });
    }

    if (noteInput) {
      noteInput.addEventListener('input', () => {
        state.clientNote = noteInput.value;
        updateWhatsAppPreview();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const message = buildWhatsAppMessage();
        const labelEl = copyBtn.querySelector('span');
        try {
          await navigator.clipboard.writeText(message);
          if (labelEl) {
            const original = labelEl.textContent;
            labelEl.textContent = 'Mensaje copiado';
            setTimeout(() => {
              labelEl.textContent = original;
            }, 2200);
          }
        } catch {
          // Fallback silencioso si el navegador restringe el portapapeles
        }
      });
    }
  }

  /* =========================================================================
     4. SOBRE LOS SOCIOS
     ========================================================================= */
  function renderPartners() {
    const grid = document.getElementById('partners-grid');
    if (!grid) return;

    grid.innerHTML = PARTNERS.map((partner) => {
      return `
        <article class="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow grid grid-cols-1 md:grid-cols-12">
          <div class="md:col-span-5 bg-navy p-4 flex items-center justify-center">
            <div class="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-gold/50 ring-1 ring-bronze/30 shadow-lg bg-navy-light">
              <img
                src="${escapeHtml(partner.photo)}"
                alt="${escapeHtml(partner.photoAlt || `${partner.fullName} - ${partner.role}`)}"
                class="partner-photo w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div class="hidden absolute inset-0 flex flex-col items-center justify-center bg-architectural p-6 text-center">
                <div class="w-20 h-20 rounded-full border-2 border-gold flex items-center justify-center font-serif text-2xl text-gold mb-3">
                  ${escapeHtml(partner.initials)}
                </div>
                <span class="text-xs uppercase tracking-widest text-slate-400">Foto Profesional</span>
              </div>
              <div class="absolute bottom-3 left-3 right-3 bg-navy/90 backdrop-blur-sm border border-gold/40 rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold text-center">
                ${escapeHtml(partner.badge)}
              </div>
            </div>
          </div>

          <div class="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 class="font-serif text-2xl font-semibold text-navy leading-snug">
                ${escapeHtml(partner.fullName)}
              </h3>
              <p class="text-bronze font-semibold text-xs sm:text-sm uppercase tracking-wider mt-1.5 mb-4">
                ${escapeHtml(partner.role)}
              </p>
              <p class="text-slate-600 text-sm leading-relaxed mb-5">
                ${escapeHtml(partner.bio)}
              </p>
              <ul class="space-y-2 mb-6">
                ${partner.highlights
                  .map(
                    (hl) => `
                  <li class="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                    <span class="w-1.5 h-1.5 rounded-full bg-gold shrink-0"></span>
                    <span>${escapeHtml(hl)}</span>
                  </li>`
                  )
                  .join('')}
              </ul>
            </div>

            <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                data-demo-cv="${escapeHtml(partner.id)}"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-navy text-navy text-xs sm:text-sm font-semibold transition-colors"
              >
                <svg class="w-4 h-4 text-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Descargar CV</span>
              </button>
              <button
                type="button"
                data-select-partner="${escapeHtml(partner.id)}"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors"
              >
                <span>Consultar con ${escapeHtml(partner.shortName)}</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    grid.querySelectorAll('.partner-photo').forEach((img) => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        if (img.nextElementSibling) {
          img.nextElementSibling.classList.remove('hidden');
        }
      });
    });

    grid.querySelectorAll('[data-demo-cv]').forEach((btn) => {
      btn.addEventListener('click', () => {
        alert('Demo: aquí se descargaría el CV en PDF del profesional');
      });
    });

    grid.querySelectorAll('[data-select-partner]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const partnerId = btn.getAttribute('data-select-partner');
        if (!partnerId) return;
        state.partnerId = partnerId;
        state.partnerManuallyChosen = true;
        renderFunnelControls();
        updateWhatsAppPreview();
        const section = document.getElementById('consulta');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* =========================================================================
     5. CARRUSEL DE RESEÑAS DE GOOGLE
     ========================================================================= */
  function initReviewsCarousel() {
    const viewport = document.getElementById('reviews-viewport');
    const track = document.getElementById('reviews-track');
    const dotsWrap = document.getElementById('reviews-dots');
    const prevBtn = document.getElementById('reviews-prev');
    const nextBtn = document.getElementById('reviews-next');

    if (!track || !viewport) return;

    function getSlidesPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    }

    function renderSlides() {
      const starsSvg = Array.from({ length: 5 })
        .map(
          () =>
            '<svg class="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>'
        )
        .join('');

      track.innerHTML = GOOGLE_REVIEWS.map(
        (rev) => `
        <div class="review-slide shrink-0 px-3 box-border">
          <article class="h-full rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-4">
                <div class="flex items-center gap-0.5" aria-label="Calificación ${Number(rev.rating) || 5} de 5 estrellas">
                  ${starsSvg}
                </div>
                <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Google Verificada
                </span>
              </div>
              <p class="text-slate-700 text-sm leading-relaxed italic">
                “${escapeHtml(rev.text)}”
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <p class="font-semibold text-sm text-navy">${escapeHtml(rev.author)}</p>
                <p class="text-xs text-slate-500">${escapeHtml(rev.date)}</p>
              </div>
              <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                ${escapeHtml(rev.tag)}
              </span>
            </div>
          </article>
        </div>
      `
      ).join('');
    }

    function updateCarouselLayout() {
      const perView = getSlidesPerView();
      const maxIndex = Math.max(0, GOOGLE_REVIEWS.length - perView);
      if (state.carouselIndex > maxIndex) state.carouselIndex = maxIndex;

      const slideWidthPct = 100 / perView;
      track.querySelectorAll('.review-slide').forEach((slide) => {
        slide.style.width = `${slideWidthPct}%`;
      });

      const offsetPct = state.carouselIndex * slideWidthPct;
      track.style.transform = `translateX(-${offsetPct}%)`;

      if (prevBtn) prevBtn.disabled = state.carouselIndex === 0;
      if (nextBtn) nextBtn.disabled = state.carouselIndex >= maxIndex;

      if (dotsWrap) {
        const steps = maxIndex + 1;
        dotsWrap.innerHTML = Array.from({ length: steps })
          .map(
            (_, idx) => `
            <button
              type="button"
              data-dot="${idx}"
              aria-label="Ir al grupo de reseñas ${idx + 1}"
              class="h-2 rounded-full transition-all ${
                idx === state.carouselIndex ? 'w-7 bg-gold' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }"
            ></button>
          `
          )
          .join('');

        dotsWrap.querySelectorAll('[data-dot]').forEach((dot) => {
          dot.addEventListener('click', () => {
            state.carouselIndex = Number(dot.getAttribute('data-dot')) || 0;
            updateCarouselLayout();
          });
        });
      }
    }

    renderSlides();
    updateCarouselLayout();

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        state.carouselIndex = Math.max(0, state.carouselIndex - 1);
        updateCarouselLayout();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxIndex = Math.max(0, GOOGLE_REVIEWS.length - getSlidesPerView());
        state.carouselIndex = Math.min(maxIndex, state.carouselIndex + 1);
        updateCarouselLayout();
      });
    }

    // Soporte táctil (swipe)
    let touchStartX = 0;
    viewport.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    viewport.addEventListener(
      'touchend',
      (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        const maxIndex = Math.max(0, GOOGLE_REVIEWS.length - getSlidesPerView());
        if (Math.abs(diff) > 45) {
          if (diff > 0) {
            state.carouselIndex = Math.min(maxIndex, state.carouselIndex + 1);
          } else {
            state.carouselIndex = Math.max(0, state.carouselIndex - 1);
          }
          updateCarouselLayout();
        }
      },
      { passive: true }
    );

    window.addEventListener('resize', updateCarouselLayout);
  }

  /* =========================================================================
     6. INICIALIZACIÓN GENERAL
     ========================================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    renderPracticeCards();
    renderActiveAreaDetail();
    initSpecialtiesAccordion();
    initWhatsAppFunnel();
    renderPartners();
    initReviewsCarousel();

    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }

    const googleMapsLink = document.getElementById('google-reviews-link');
    if (googleMapsLink && /^https:\/\//i.test(String(FIRM_CONFIG.googleReviewsUrl || ''))) {
      googleMapsLink.href = FIRM_CONFIG.googleReviewsUrl;
    }

    if (FIRM_CONFIG.socials) {
      const socialMap = {
        'social-instagram': FIRM_CONFIG.socials.instagram,
        'social-linkedin': FIRM_CONFIG.socials.linkedin,
        'social-facebook': FIRM_CONFIG.socials.facebook
      };
      Object.entries(socialMap).forEach(([elId, url]) => {
        const el = document.getElementById(elId);
        if (el && /^https:\/\//i.test(String(url || ''))) {
          el.href = url;
        }
      });
    }
  });
})();
