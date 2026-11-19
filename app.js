// Nomvu — Interactividad compartida entre las 4 páginas + Firebase Auth & Firestore
import {
  publishEventToFirestore,
  saveUserProfileToFirestore,
  signInWithGooglePopup,
  signOutFirebase,
  subscribeToAuthState,
  subscribeToCatalogEvents,
  subscribeToUserProfile,
} from './src/firebase.ts';

const NOMVU_SUPPORT_WA = '584123558190';

const VENEZUELA_STATES = [
  'Distrito Capital',
  'Amazonas',
  'Anzoátegui',
  'Apure',
  'Aragua',
  'Barinas',
  'Bolívar',
  'Carabobo',
  'Cojedes',
  'Delta Amacuro',
  'Falcón',
  'Guárico',
  'La Guaira',
  'Lara',
  'Mérida',
  'Miranda',
  'Monagas',
  'Nueva Esparta',
  'Portuguesa',
  'Sucre',
  'Táchira',
  'Trujillo',
  'Yaracuy',
  'Zulia',
];

const EVENT_INTERESTS = [
  'Música en vivo',
  'Talleres creativos',
  'Bazares y diseño',
  'Gastronomía',
  'Cine y cultura',
  'Fiestas y nocturno',
  'Carros',
  'Caminatas',
  'Deportes',
  'Teatro y comedia',
  'Educativo',
];

const DEFAULT_EVENT_FALLBACK_IMG = '/assets/aistudio/Sesi_n_Ac_stica_en_la_Terraza_4a929ee5.png';

const DEFAULT_EVENTS = [
  {
    id: 'evt-1',
    title: 'Sesión Acústica en la Terraza',
    description:
      'Concierto íntimo de cantautores venezolanos en formato desenchufado al atardecer con terraza abierta y bebidas locales.',
    category: 'Música en vivo',
    type: 'gratis',
    priceLabel: 'Gratis',
    dateLabel: 'Sábado 21 Nov · 6:30 PM',
    state: 'Distrito Capital',
    city: 'Caracas, Chacao',
    spotsLeft: 18,
    image: '/assets/aistudio/Sesi_n_Ac_stica_en_la_Terraza_4a929ee5.png',
    whatsapp: '584125550101',
  },
  {
    id: 'evt-2',
    title: 'Taller de Cerámica Utilitaria',
    description:
      'Aprende modelado manual y esmaltado básico para crear tu propia taza o plato. Incluye arcilla, herramientas y horneado.',
    category: 'Talleres creativos',
    type: 'pago',
    priceLabel: 'Pago · $25',
    dateLabel: 'Domingo 22 Nov · 10:00 AM',
    state: 'Miranda',
    city: 'El Hatillo',
    spotsLeft: 6,
    image: '/assets/aistudio/Taller_de_cer_mica_utilitaria_9beccd65.png',
    whatsapp: '584145550102',
  },
  {
    id: 'evt-3',
    title: 'Bazar de Diseño y Vinilos del Este',
    description:
      'Encuentro de marcas independientes, ropa de autor, láminas ilustradas y selección de discos de vinilo con DJs en vivo.',
    category: 'Bazares y diseño',
    type: 'gratis',
    priceLabel: 'Gratis',
    dateLabel: 'Sábado 28 Nov · 11:00 AM',
    state: 'Carabobo',
    city: 'Valencia, Viñedo',
    spotsLeft: 32,
    image: '/assets/aistudio/Bazar_de_Dise_o_y_Vinos_Creativos_0ccc115d.png',
    whatsapp: '584245550103',
  },
  {
    id: 'evt-4',
    title: 'Ruta Nocturna de Cocina Zuliana',
    description:
      'Recorrido guiado por cuatro paradas gastronómicas con degustación de patacones, tumbarrancho, mandocas y papelón frío.',
    category: 'Gastronomía',
    type: 'pago',
    priceLabel: 'Pago · $18',
    dateLabel: 'Viernes 27 Nov · 7:30 PM',
    state: 'Zulia',
    city: 'Maracaibo, Calle 72',
    spotsLeft: 9,
    image: '/assets/aistudio/Ruta_Nocturna_de_Cocina_Zuliana_64f5fdaf.png',
    whatsapp: '584125550104',
  },
  {
    id: 'evt-5',
    title: 'Ciclo de Cine Independiente al Aire Libre',
    description:
      'Proyección de cortometrajes venezolanos recientes bajo las estrellas con conversatorio junto a sus realizadores.',
    category: 'Cine y cultura',
    type: 'gratis',
    priceLabel: 'Gratis',
    dateLabel: 'Jueves 26 Nov · 7:00 PM',
    state: 'Mérida',
    city: 'Mérida, Centro',
    spotsLeft: 14,
    image: '/assets/aistudio/Cine_independiente_al_aire_libre_17e04e22.png',
    whatsapp: '584165550105',
  },
  {
    id: 'evt-6',
    title: 'Festival de Café de Especialidad y Cacao',
    description:
      'Cata guiada de granos de origen nacional, métodos de filtrado artesanal y bombonería fina con productores locales.',
    category: 'Gastronomía',
    type: 'pago',
    priceLabel: 'Pago · $12',
    dateLabel: 'Domingo 29 Nov · 2:00 PM',
    state: 'Lara',
    city: 'Barquisimeto, Este',
    spotsLeft: 24,
    image: '/assets/aistudio/Festival_de_Caf___Cacao_y_Sabores_Locales_89488d11.png',
    whatsapp: '584145550106',
  },
  {
    id: 'evt-7',
    title: 'Exhibición de Carros Clásicos y Tuning',
    description:
      'Exhibición al aire libre de modelos clásicos restaurados y proyectos tuning, zona de comida y música en vivo.',
    category: 'Carros',
    type: 'pago',
    priceLabel: 'Pago · $10',
    dateLabel: 'Sábado 28 Nov · 3:00 PM',
    state: 'Aragua',
    city: 'Maracay, Las Delicias',
    spotsLeft: 45,
    image: '/assets/aistudio/Exhibici_n_de_Carros_Cl_sicos_al_Atardecer_df47dd37.png',
    whatsapp: '584125550107',
  },
  {
    id: 'evt-8',
    title: 'Caminata Ecológica al Ávila — Sabas Nieves',
    description:
      'Subida grupal guiada a ritmo moderado hasta el puesto de Sabas Nieves con pausa de estiramiento y vista panorámica.',
    category: 'Caminatas',
    type: 'gratis',
    priceLabel: 'Gratis',
    dateLabel: 'Domingo 29 Nov · 7:00 AM',
    state: 'Distrito Capital',
    city: 'Caracas, Altamira',
    spotsLeft: 28,
    image: '/assets/aistudio/Caminata_ecol_gica_al__vila_6433ff86.png',
    whatsapp: '584245550108',
  },
];

/* Estado global sincronizado con Firebase */
let authUser = null;
let userProfile = null;
let firestoreEvents = [];
let profileUnsub = null;
const stateListeners = new Set();

function notifyAppState() {
  stateListeners.forEach((listener) => {
    try {
      listener();
    } catch (error) {
      console.error(error);
    }
  });
}

function initFirebaseSync() {
  subscribeToCatalogEvents((nextEvents) => {
    firestoreEvents = nextEvents;
    notifyAppState();
  });

  subscribeToAuthState((nextUser) => {
    authUser = nextUser;

    if (profileUnsub) {
      profileUnsub();
      profileUnsub = null;
    }

    if (nextUser) {
      profileUnsub = subscribeToUserProfile(nextUser.uid, (nextProfile) => {
        userProfile = nextProfile;
        notifyAppState();
      });
    } else {
      userProfile = null;
    }

    notifyAppState();
  });
}

function getAllCatalogEvents() {
  return [...firestoreEvents, ...DEFAULT_EVENTS];
}

function formatSpotsLeft(item) {
  if (typeof item.spotsLeft === 'number' && item.spotsLeft > 0) {
    return item.spotsLeft === 1 ? 'Queda 1 cupo' : `Quedan ${item.spotsLeft} cupos`;
  }
  if (item.capacityLabel) {
    const match = String(item.capacityLabel).match(/\d+/);
    if (match) {
      const count = Number(match[0]);
      if (count > 0) {
        return count === 1 ? 'Queda 1 cupo' : `Quedan ${count} cupos`;
      }
    }
    return String(item.capacityLabel);
  }
  return '';
}

function sanitizePhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return NOMVU_SUPPORT_WA;
  if (digits.startsWith('0') && digits.length === 11) {
    return `58${digits.slice(1)}`;
  }
  return digits;
}

function buildWhatsAppLink(phone, eventTitle, dateLabel) {
  const digits = sanitizePhone(phone);
  const msg = `Hola, vi el evento "${eventTitle}" (${dateLabel}) en Nomvu y quiero reservar mi cupo.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(text || '').replace(/[&<>"']/g, (char) => map[char]);
}

function formatFirebaseErrorMessage(error, fallback) {
  const raw = error instanceof Error ? error.message : String(error || '');
  if (raw.includes('popup-closed-by-user')) {
    return 'Se cerró la ventana de Google antes de completar el acceso.';
  }
  if (raw.includes('popup-blocked')) {
    return 'Tu navegador bloqueó la ventana de Google. Permite las ventanas emergentes e intenta de nuevo.';
  }
  if (raw.includes('PERMISSION_DENIED') || raw.includes('Missing or insufficient permissions')) {
    return 'No tienes permisos para realizar esta acción.';
  }
  return fallback;
}

function setMenuToggleState(toggleBtn, isOpen) {
  if (!toggleBtn) return;
  toggleBtn.setAttribute('aria-expanded', String(isOpen));
  toggleBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  toggleBtn.innerHTML = isOpen
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
}

/* 1. Navegación móvil compartida */
function initMobileNav() {
  const toggleBtn = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  if (!toggleBtn || !mobileNav) return;

  setMenuToggleState(toggleBtn, toggleBtn.getAttribute('aria-expanded') === 'true');

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    mobileNav.hidden = isExpanded;
    setMenuToggleState(toggleBtn, !isExpanded);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      mobileNav.hidden = true;
      setMenuToggleState(toggleBtn, false);
      toggleBtn.focus();
    }
  });
}

/* 2. Cartelera y filtros (index.html) */
function initCatalogPage() {
  const grid = document.getElementById('events-grid');
  if (!grid) return;

  const queryInput = document.getElementById('filter-query');
  const stateSelect = document.getElementById('filter-state');
  const categorySelect = document.getElementById('filter-category');
  const stateTabs = Array.from(document.querySelectorAll('[data-state-tab]'));
  const typeButtons = Array.from(document.querySelectorAll('[data-type-filter]'));
  const resultsCount = document.getElementById('results-count');
  const resetTopBtn = document.getElementById('reset-filters-btn');

  let currentQuery = '';
  let currentState = 'todos';
  let currentCategory = 'todas';
  let currentType = 'todos';

  function syncStateUI(nextState) {
    currentState = nextState;
    if (stateSelect) stateSelect.value = nextState;
    stateTabs.forEach((tab) => {
      const active = tab.dataset.stateTab === nextState;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
  }

  function render() {
    const allEvents = getAllCatalogEvents();
    const q = currentQuery.trim().toLowerCase();
    const filtered = allEvents.filter((item) => {
      const matchState = currentState === 'todos' || item.state === currentState;
      const matchCategory = currentCategory === 'todas' || item.category === currentCategory;
      const matchType = currentType === 'todos' || item.type === currentType;
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchState && matchCategory && matchType && matchQuery;
    });

    if (resultsCount) {
      resultsCount.textContent =
        filtered.length === 1
          ? '1 evento disponible'
          : `${filtered.length} eventos disponibles`;
    }

    if (resetTopBtn) {
      resetTopBtn.hidden =
        currentState === 'todos' &&
        currentCategory === 'todas' &&
        currentType === 'todos' &&
        !q;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <h3>No hay eventos con esos filtros</h3>
          <p>Prueba seleccionando otro estado de Venezuela, cambiando tu búsqueda o mostrando todos los tipos de entrada.</p>
          <button type="button" class="btn btn--primary" id="empty-reset-btn">Ver todos los eventos</button>
        </div>
      `;
      const emptyReset = document.getElementById('empty-reset-btn');
      if (emptyReset) {
        emptyReset.addEventListener('click', resetFilters);
      }
      return;
    }

    grid.innerHTML = filtered
      .map((item) => {
        const tagClass = item.type === 'gratis' ? 'price-tag--free' : 'price-tag--paid';
        const waHref = buildWhatsAppLink(item.whatsapp, item.title, item.dateLabel);
        const safeLink = item.externalLink ? escapeHtml(item.externalLink) : '';
        const linkButtonHtml = safeLink
          ? `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--full">Ver link del evento</a>`
          : '';
        const spotsText = formatSpotsLeft(item);
        const descriptionText = (item.description || '').trim();
        const descriptionHtml = descriptionText
          ? `<p class="event-card-description">${escapeHtml(descriptionText)}</p>`
          : '';
        const capacityHtml = spotsText
          ? `<div class="event-meta-item">
               <dt class="event-meta-label">Cupos disponibles</dt>
               <dd class="event-meta-value">${escapeHtml(spotsText)}</dd>
             </div>`
          : '';

        return `
          <article class="event-card col-full md-span-6 lg-span-4">
            <div class="event-card-media">
              <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)} en ${escapeHtml(item.state)}" loading="lazy" />
            </div>
            <div class="event-card-body">
              <div class="event-card-top">
                <span class="event-category">${escapeHtml(item.category)}</span>
                <span class="price-tag ${tagClass}">${escapeHtml(item.priceLabel)}</span>
              </div>
              <h3 class="event-card-title">${escapeHtml(item.title)}</h3>
              ${descriptionHtml}
              <dl class="event-meta-list">
                <div class="event-meta-item">
                  <dt class="event-meta-label">Fecha y hora</dt>
                  <dd class="event-meta-value">${escapeHtml(item.dateLabel)}</dd>
                </div>
                <div class="event-meta-item">
                  <dt class="event-meta-label">Estado</dt>
                  <dd class="event-meta-value">${escapeHtml(item.state)} · ${escapeHtml(item.city)}</dd>
                </div>
                ${capacityHtml}
              </dl>
              <div class="event-card-footer">
                <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--full">
                  Reservar por WhatsApp
                </a>
                ${linkButtonHtml}
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    observeRevealTargets(grid.querySelectorAll('.event-card'));
  }

  function resetFilters() {
    currentQuery = '';
    currentCategory = 'todas';
    currentType = 'todos';
    if (queryInput) queryInput.value = '';
    if (categorySelect) categorySelect.value = 'todas';
    syncStateUI('todos');
    typeButtons.forEach((btn) => {
      const active = btn.dataset.typeFilter === 'todos';
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    render();
  }

  if (queryInput) {
    queryInput.addEventListener('input', (event) => {
      currentQuery = event.target.value;
      render();
    });
  }

  if (stateSelect) {
    stateSelect.addEventListener('change', (event) => {
      syncStateUI(event.target.value);
      render();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', (event) => {
      currentCategory = event.target.value || 'todas';
      render();
    });
  }

  stateTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const nextState = tab.dataset.stateTab || 'todos';
      syncStateUI(nextState);
      render();
    });
  });

  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.typeFilter || 'todos';
      typeButtons.forEach((other) => {
        const active = other === btn;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  });

  if (resetTopBtn) {
    resetTopBtn.addEventListener('click', resetFilters);
  }

  stateListeners.add(render);
  render();
}

function compressImageFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve(DEFAULT_EVENT_FALLBACK_IMG);
    reader.onload = (loadEvent) => {
      const src = typeof loadEvent.target?.result === 'string' ? loadEvent.target.result : '';
      if (!src) {
        resolve(DEFAULT_EVENT_FALLBACK_IMG);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(DEFAULT_EVENT_FALLBACK_IMG);
      img.onload = () => {
        const maxWidth = 640;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const targetW = Math.max(1, Math.round(img.width * scale));
        const targetH = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(DEFAULT_EVENT_FALLBACK_IMG);
          return;
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);
        const jpeg72 = canvas.toDataURL('image/jpeg', 0.72);
        if (jpeg72.length <= 180000) {
          resolve(jpeg72);
          return;
        }
        const jpeg50 = canvas.toDataURL('image/jpeg', 0.5);
        resolve(jpeg50.length <= 180000 ? jpeg50 : DEFAULT_EVENT_FALLBACK_IMG);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/* 3. Registro de eventos y vista previa en vivo (productores.html) */
function initProducersPage() {
  const form = document.getElementById('publish-event-form');
  if (!form) return;

  const planSelect = document.getElementById('event-plan');
  const planButtons = Array.from(document.querySelectorAll('[data-select-plan]'));
  const flyerInput = document.getElementById('event-flyer');
  const titleInput = document.getElementById('event-title');
  const descriptionInput = document.getElementById('event-description');
  const categoryInput = document.getElementById('event-category');
  const modalityInputs = Array.from(document.querySelectorAll('input[name="modality"]'));
  const priceWrapper = document.getElementById('price-field-wrapper');
  const priceInput = document.getElementById('event-price');
  const dateInput = document.getElementById('event-date');
  const timeInput = document.getElementById('event-time');
  const stateInput = document.getElementById('event-state');
  const capacityInput = document.getElementById('event-capacity');
  const whatsappInput = document.getElementById('event-whatsapp');
  const linkInput = document.getElementById('event-link');

  const previewImg = document.getElementById('preview-flyer-img');
  const previewCategory = document.getElementById('preview-category');
  const previewCategoryMeta = document.getElementById('preview-category-meta');
  const previewTag = document.getElementById('preview-price-tag');
  const previewTitle = document.getElementById('preview-title');
  const previewDescription = document.getElementById('preview-description');
  const previewDate = document.getElementById('preview-date');
  const previewState = document.getElementById('preview-state');
  const previewCapacity = document.getElementById('preview-capacity');
  const previewLinkRow = document.getElementById('preview-link-row');
  const previewLinkValue = document.getElementById('preview-link-value');
  const previewLinkBtn = document.getElementById('preview-link-btn');
  const formFeedback = document.getElementById('publish-feedback');
  const formError = document.getElementById('publish-error');
  const submitBtn = document.getElementById('publish-submit-btn');

  let authBanner = document.getElementById('producer-auth-banner');
  if (!authBanner) {
    authBanner = document.createElement('div');
    authBanner.id = 'producer-auth-banner';
    authBanner.className = 'auth-google-box';
    form.insertBefore(authBanner, form.firstChild);
  }

  let uploadedImageDataUrl = DEFAULT_EVENT_FALLBACK_IMG;
  let isSubmitting = false;

  function renderProducerAuthBanner() {
    if (!authBanner) return;
    if (!authUser) {
      authBanner.className = 'auth-google-box';
      authBanner.innerHTML = `
        <div class="auth-google-row">
          <div class="auth-google-meta">
            <span class="field-label">Cuenta Google requerida para publicar</span>
            <span class="auth-google-email">Conéctate para guardar tu evento en la cartelera compartida de Nomvu.</span>
          </div>
          <button type="button" class="btn btn--outline btn--sm" id="producer-google-btn">
            Conectar con Google
          </button>
        </div>
      `;
      if (submitBtn) submitBtn.disabled = false;
      document.getElementById('producer-google-btn')?.addEventListener('click', async () => {
        if (formError) formError.hidden = true;
        try {
          await signInWithGooglePopup();
        } catch (error) {
          if (formError) {
            formError.textContent = formatFirebaseErrorMessage(
              error,
              'No se pudo iniciar sesión con Google.'
            );
            formError.hidden = false;
          }
        }
      });
      return;
    }

    const displayName = userProfile?.fullname || authUser.displayName || authUser.email || 'Usuario';
    authBanner.className = 'auth-google-box is-verified';
    authBanner.innerHTML = `
      <div class="auth-google-row">
        <div class="auth-google-meta">
          <span class="field-label">Publicando como ${escapeHtml(displayName)}</span>
          <span class="auth-google-email">${escapeHtml(authUser.email || '')}</span>
        </div>
      </div>
    `;
    if (submitBtn) submitBtn.disabled = isSubmitting;
  }

  function getModality() {
    const checked = modalityInputs.find((input) => input.checked);
    return checked ? checked.value : 'gratis';
  }

  function formatDateTimeLabel() {
    const rawDate = dateInput?.value;
    const rawTime = timeInput?.value || '18:00';
    if (!rawDate) return 'Fecha por confirmar · 6:00 PM';

    const [year, month, day] = rawDate.split('-').map(Number);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const [hoursStr, minsStr] = rawTime.split(':');
    const hours = Number(hoursStr);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${day} ${months[month - 1] || 'Nov'} ${year} · ${hour12}:${minsStr} ${suffix}`;
  }

  function normalizeUrl(raw) {
    const trimmed = String(raw || '').trim();
    if (!trimmed) return '';
    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
      const parsed = new URL(candidate);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.href : null;
    } catch {
      return null;
    }
  }

  function updatePreview() {
    const modality = getModality();
    const isFree = modality === 'gratis';
    if (priceWrapper) priceWrapper.hidden = isFree;

    const titleVal = titleInput?.value.trim() || 'Nombre de tu evento o taller';
    const rawDescription = descriptionInput?.value.trim() || '';
    const categoryVal = categoryInput?.value || 'Música en vivo';
    const stateVal = stateInput?.value || 'Distrito Capital';
    const priceNum = priceInput?.value.trim() || '15';
    const capacityNum = Number(capacityInput?.value || 0);
    const normalizedLink = normalizeUrl(linkInput?.value || '');

    if (previewCategory) previewCategory.textContent = categoryVal;
    if (previewCategoryMeta) previewCategoryMeta.textContent = categoryVal;
    if (previewTitle) previewTitle.textContent = titleVal;
    if (previewDescription) {
      previewDescription.textContent =
        rawDescription ||
        'Describe brevemente de qué trata tu evento, qué incluye o qué debe saber el público.';
      previewDescription.classList.toggle('is-placeholder', !rawDescription);
    }
    if (previewState) previewState.textContent = stateVal;
    if (previewDate) previewDate.textContent = formatDateTimeLabel();
    if (previewCapacity) {
      previewCapacity.textContent =
        capacityNum > 0
          ? capacityNum === 1
            ? 'Queda 1 cupo'
            : `Quedan ${capacityNum} cupos`
          : 'Por definir';
    }

    if (previewTag) {
      previewTag.textContent = isFree ? 'Gratis' : `Pago · $${priceNum}`;
      previewTag.className = `price-tag ${isFree ? 'price-tag--free' : 'price-tag--paid'}`;
    }

    if (previewLinkRow && previewLinkValue && previewLinkBtn) {
      if (normalizedLink) {
        try {
          previewLinkValue.textContent = new URL(normalizedLink).hostname.replace(/^www\./, '');
        } catch {
          previewLinkValue.textContent = normalizedLink;
        }
        previewLinkRow.hidden = false;
        previewLinkBtn.hidden = false;
      } else {
        previewLinkRow.hidden = true;
        previewLinkBtn.hidden = true;
      }
    }
  }

  function isFreePlanSelected() {
    return (planSelect?.value || '').includes('$0');
  }

  function syncSubmitLabel() {
    if (!submitBtn) return;
    submitBtn.textContent = isFreePlanSelected()
      ? 'Publicar evento gratis'
      : 'Pagar publicidad y publicar evento';
  }

  planButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetPlan = btn.dataset.selectPlan;
      if (planSelect && targetPlan) {
        planSelect.value = targetPlan;
      }
      if (targetPlan && targetPlan.includes('$0')) {
        const freeRadio = modalityInputs.find((input) => input.value === 'gratis');
        if (freeRadio) freeRadio.checked = true;
      }
      syncSubmitLabel();
      updatePreview();
      const section = document.getElementById('publicar');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
      titleInput?.focus();
    });
  });

  if (planSelect) {
    planSelect.addEventListener('change', () => {
      if (isFreePlanSelected()) {
        const freeRadio = modalityInputs.find((input) => input.value === 'gratis');
        if (freeRadio) freeRadio.checked = true;
      }
      syncSubmitLabel();
      updatePreview();
    });
  }

  if (flyerInput) {
    const previewPlaceholder = document.getElementById('preview-flyer-placeholder');
    flyerInput.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      uploadedImageDataUrl = await compressImageFile(file);
      if (previewImg) {
        previewImg.src = uploadedImageDataUrl;
        previewImg.hidden = false;
      }
      if (previewPlaceholder) {
        previewPlaceholder.hidden = true;
      }
    });
  }

  [
    titleInput,
    descriptionInput,
    categoryInput,
    priceInput,
    dateInput,
    timeInput,
    stateInput,
    capacityInput,
    linkInput,
  ].forEach((el) => {
    el?.addEventListener('input', updatePreview);
    el?.addEventListener('change', updatePreview);
  });

  modalityInputs.forEach((el) => {
    el.addEventListener('change', updatePreview);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (formError) formError.hidden = true;

    const titleVal = titleInput?.value.trim() || '';
    const descriptionVal = descriptionInput?.value.trim() || '';
    const modality = getModality() === 'pago' ? 'pago' : 'gratis';
    const priceNum = priceInput?.value.trim() || '15';
    const dateVal = dateInput?.value || '';
    const stateVal = stateInput?.value || '';
    const capacityNum = Number(capacityInput?.value || 0);
    const waVal = whatsappInput?.value.trim() || '';
    const rawLink = linkInput?.value.trim() || '';
    const normalizedLink = normalizeUrl(rawLink);
    const planVal = planSelect?.value || 'Plan Impulso Local ($5 · 1 evento)';

    if (
      !titleVal ||
      !descriptionVal ||
      !dateVal ||
      !stateVal ||
      capacityNum < 1 ||
      sanitizePhone(waVal).length < 10
    ) {
      if (formError) {
        formError.textContent =
          'Completa el nombre, la descripción, la fecha, el estado, el máximo de personas (mínimo 1) y un número de WhatsApp válido (ej. 0412-3558190).';
        formError.hidden = false;
      }
      return;
    }

    if (rawLink && !normalizedLink) {
      if (formError) {
        formError.textContent =
          'El link del evento debe ser una URL válida (ej. https://instagram.com/tu-evento).';
        formError.hidden = false;
      }
      return;
    }

    if (isFreePlanSelected() && modality !== 'gratis') {
      if (formError) {
        formError.textContent =
          'El Plan Entrada Libre ($0) aplica únicamente para eventos gratuitos. Para eventos pagos, selecciona un plan desde $5 USD.';
        formError.hidden = false;
      }
      return;
    }

    isSubmitting = true;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publicando evento...';
    }

    try {
      let activeAuthUser = authUser;
      if (!activeAuthUser) {
        activeAuthUser = await signInWithGooglePopup();
      }

      const categoryVal = categoryInput?.value || 'Música en vivo';
      let activeProfile = userProfile;
      if (!activeProfile) {
        activeProfile = await saveUserProfileToFirestore(activeAuthUser, {
          fullname: activeAuthUser.displayName || 'Productor Nomvu',
          age: 18,
          state: stateVal,
          phone: waVal,
          interests: [categoryVal],
          consentAccepted: false,
        });
      }

      await publishEventToFirestore(activeAuthUser, activeProfile, {
        title: titleVal,
        description: descriptionVal,
        category: categoryVal,
        type: modality,
        priceLabel: modality === 'gratis' ? 'Gratis' : `Pago · $${priceNum}`,
        dateLabel: formatDateTimeLabel(),
        state: stateVal,
        city: 'Por confirmar',
        spotsLeft: capacityNum,
        image: uploadedImageDataUrl,
        whatsapp: waVal,
        externalLink: normalizedLink || '',
      });

      const freeSelected = isFreePlanSelected();
      const confirmMsg = freeSelected
        ? `Hola equipo Nomvu, acabo de registrar el evento gratuito "${titleVal}" (${stateVal}) para su publicación sin costo.`
        : `Hola equipo Nomvu, acabo de registrar "${titleVal}" (${stateVal}) con el ${planVal} para activar su publicidad.`;
      const waConfirmLink = `https://wa.me/${NOMVU_SUPPORT_WA}?text=${encodeURIComponent(confirmMsg)}`;

      if (formFeedback) {
        formFeedback.innerHTML = freeSelected
          ? `
          <strong>Evento gratuito publicado: ${escapeHtml(titleVal)}</strong>
          <p>Tu ficha ya está activa en la cartelera compartida bajo <strong>${escapeHtml(planVal)}</strong>. Puedes confirmarlo por WhatsApp para acelerar su difusión.</p>
          <div class="hero-actions">
            <a href="${waConfirmLink}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">Confirmar por WhatsApp</a>
            <a href="index.html#cartelera" class="btn btn--outline">Ver en cartelera</a>
          </div>
        `
          : `
          <strong>Evento publicado: ${escapeHtml(titleVal)}</strong>
          <p>Tu ficha ya está activa en la cartelera compartida bajo <strong>${escapeHtml(planVal)}</strong>. Finaliza la activación comercial y validación de pago por WhatsApp.</p>
          <div class="hero-actions">
            <a href="${waConfirmLink}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">Completar pago por WhatsApp</a>
            <a href="index.html#cartelera" class="btn btn--outline">Ver en cartelera</a>
          </div>
        `;
        formFeedback.hidden = false;
      }
    } catch (error) {
      if (formError) {
        formError.textContent = formatFirebaseErrorMessage(
          error,
          'No se pudo publicar el evento. Verifica tu cuenta e intenta nuevamente.'
        );
        formError.hidden = false;
      }
    } finally {
      isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
      }
      syncSubmitLabel();
    }
  });

  stateListeners.add(renderProducerAuthBanner);
  syncSubmitLabel();
  updatePreview();
  renderProducerAuthBanner();
}

/* 4. FAQ y formulario de contacto (contacto.html) */
function initContactPage() {
  const faqTriggers = Array.from(document.querySelectorAll('.faq-trigger'));
  faqTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const icon = trigger.querySelector('.faq-icon');

      trigger.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
      if (icon) icon.textContent = expanded ? '+' : '−';
    });
  });

  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const contactError = document.getElementById('contact-error');
  const contactFeedback = document.getElementById('contact-feedback');

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (contactError) contactError.hidden = true;

    const name = document.getElementById('contact-name')?.value.trim() || '';
    const email = document.getElementById('contact-email')?.value.trim() || '';
    const role = document.getElementById('contact-role')?.value || 'Asistente';
    const message = document.getElementById('contact-message')?.value.trim() || '';

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailValid || message.length < 10) {
      if (contactError) {
        contactError.textContent =
          'Ingresa tu nombre, un correo válido y un mensaje de al menos 10 caracteres.';
        contactError.hidden = false;
      }
      return;
    }

    if (contactFeedback) {
      contactFeedback.innerHTML = `
        <strong>Consulta recibida, ${escapeHtml(name)}</strong>
        <p>Registramos tu mensaje como <strong>${escapeHtml(role)}</strong>. Te responderemos a ${escapeHtml(email)} en menos de 24 horas hábiles.</p>
      `;
      contactFeedback.hidden = false;
    }

    contactForm.reset();
  });
}

/* 5. Modal de registro y perfil de asistentes (compartido en las 4 páginas) */
function initRegisterModal() {
  const triggers = Array.from(document.querySelectorAll('[data-open-register]'));
  if (triggers.length === 0) return;

  const stateOptionsHtml = VENEZUELA_STATES.map(
    (state) => `<option value="${escapeHtml(state)}">${escapeHtml(state)}</option>`
  ).join('');

  const interestsHtml = `
    <label class="checkbox-card">
      <input id="reg-interests-all" type="checkbox" />
      <span>Todos</span>
    </label>
    ${EVENT_INTERESTS.map(
      (interest) => `
      <label class="checkbox-card">
        <input type="checkbox" name="reg-interests" value="${escapeHtml(interest)}" />
        <span>${escapeHtml(interest)}</span>
      </label>
    `
    ).join('')}
  `;

  const modalBackdrop = document.createElement('div');
  modalBackdrop.id = 'register-modal';
  modalBackdrop.className = 'modal-backdrop';
  modalBackdrop.hidden = true;
  modalBackdrop.innerHTML = `
    <div
      class="modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div class="modal-header">
        <div>
          <span id="register-modal-kicker" class="kicker">Comunidad Nomvu</span>
          <h2 id="register-modal-title" class="modal-title">Regístrate y entérate primero</h2>
        </div>
        <button type="button" class="modal-close" data-close-register aria-label="Cerrar registro">
          ×
        </button>
      </div>

      <div class="modal-body">
        <div id="register-profile-view" class="profile-summary" hidden></div>

        <form id="register-user-form" novalidate>
          <div id="reg-google-status" class="auth-google-box"></div>

          <div class="form-grid form-grid--two">
            <div class="field field--full">
              <label for="reg-fullname" class="field-label">Nombre y Apellido</label>
              <input
                id="reg-fullname"
                type="text"
                class="field-input"
                placeholder="Ej. María Rodríguez"
                autocomplete="name"
                required
              />
            </div>

            <div class="field">
              <label for="reg-age" class="field-label">Edad</label>
              <input
                id="reg-age"
                type="number"
                min="14"
                max="120"
                step="1"
                class="field-input"
                placeholder="Ej. 24"
                required
              />
            </div>

            <div class="field">
              <label for="reg-state" class="field-label">Estado</label>
              <select id="reg-state" class="field-select" required>
                <option value="">Selecciona tu estado</option>
                ${stateOptionsHtml}
              </select>
            </div>

            <div class="field field--full">
              <label for="reg-phone" class="field-label">Número de teléfono (WhatsApp)</label>
              <input
                id="reg-phone"
                type="tel"
                class="field-input"
                placeholder="Ej. 0412-3558190"
                autocomplete="tel"
                required
              />
            </div>

            <div class="field field--full">
              <span class="field-label">¿Qué tipo de evento te gusta?</span>
              <div class="checkbox-grid" role="group" aria-label="Tipos de eventos favoritos">
                ${interestsHtml}
              </div>
            </div>

            <div class="field field--full">
              <label class="consent-box">
                <input id="reg-consent" type="checkbox" />
                <span>
                  Acepto y estoy de acuerdo en que Nomvu me envíe mensajes automáticos con los
                  próximos eventos y actividades de mi ciudad.
                </span>
              </label>
            </div>

            <div class="field field--full">
              <p id="reg-error" class="field-error" role="alert" hidden></p>
              <button type="submit" id="reg-submit-btn" class="btn btn--primary btn--full">
                Completar registro
              </button>
            </div>
          </div>
        </form>

        <div id="reg-feedback" class="form-feedback" aria-live="polite" hidden></div>
      </div>
    </div>
  `;

  document.body.appendChild(modalBackdrop);

  const closeBtn = modalBackdrop.querySelector('[data-close-register]');
  const modalKicker = document.getElementById('register-modal-kicker');
  const modalTitle = document.getElementById('register-modal-title');
  const profileView = document.getElementById('register-profile-view');
  const form = document.getElementById('register-user-form');
  const googleStatusBox = document.getElementById('reg-google-status');
  const fullnameInput = document.getElementById('reg-fullname');
  const ageInput = document.getElementById('reg-age');
  const stateInput = document.getElementById('reg-state');
  const phoneInput = document.getElementById('reg-phone');
  const selectAllInterestsInput = document.getElementById('reg-interests-all');
  const interestCheckboxes = Array.from(form?.querySelectorAll('input[name="reg-interests"]') || []);
  const consentInput = document.getElementById('reg-consent');
  const submitBtn = document.getElementById('reg-submit-btn');
  const errorEl = document.getElementById('reg-error');
  const feedbackEl = document.getElementById('reg-feedback');

  let lastTrigger = null;
  let isEditingExisting = false;
  let statusBannerMessage = '';

  function syncSelectAllInterests() {
    if (!selectAllInterestsInput) return;
    selectAllInterestsInput.checked =
      interestCheckboxes.length > 0 && interestCheckboxes.every((checkbox) => checkbox.checked);
  }

  selectAllInterestsInput?.addEventListener('change', () => {
    const checked = Boolean(selectAllInterestsInput.checked);
    interestCheckboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });
  });

  interestCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', syncSelectAllInterests);
  });

  function syncRegisterTriggers() {
    const displayName = userProfile?.fullname || authUser?.displayName || authUser?.email || '';
    triggers.forEach((btn) => {
      if (authUser && displayName) {
        btn.innerHTML = `<span class="user-trigger-dot" aria-hidden="true"></span><span>${escapeHtml(
          displayName
        )}</span>`;
        btn.setAttribute('aria-label', `Ver datos de registro de ${displayName}`);
      } else {
        btn.textContent = 'Regístrate';
        btn.removeAttribute('aria-label');
      }
    });
  }

  function renderGoogleAuthBox() {
    if (!googleStatusBox) return;
    if (!authUser) {
      googleStatusBox.className = 'auth-google-box';
      googleStatusBox.innerHTML = `
        <div class="auth-google-row">
          <div class="auth-google-meta">
            <span class="field-label">Paso 1 · Conecta tu cuenta Google</span>
            <span class="auth-google-email">
              Tu registro y preferencias se guardarán de forma segura en tu cuenta.
            </span>
          </div>
          <button type="button" class="btn btn--outline btn--sm" id="reg-google-signin-btn">
            Conectar con Google
          </button>
        </div>
      `;
    } else {
      googleStatusBox.className = 'auth-google-box is-verified';
      googleStatusBox.innerHTML = `
        <div class="auth-google-row">
          <div class="auth-google-meta">
            <span class="field-label">Cuenta Google conectada</span>
            <span class="auth-google-email">${escapeHtml(authUser.email || '')}</span>
          </div>
          <button type="button" class="btn btn--outline btn--sm" id="reg-google-signout-btn">
            Cambiar cuenta
          </button>
        </div>
      `;
    }

    document.getElementById('reg-google-signin-btn')?.addEventListener('click', async () => {
      if (errorEl) errorEl.hidden = true;
      try {
        const signedIn = await signInWithGooglePopup();
        if (fullnameInput && !fullnameInput.value.trim()) {
          fullnameInput.value = signedIn.displayName || '';
        }
      } catch (error) {
        if (errorEl) {
          errorEl.textContent = formatFirebaseErrorMessage(
            error,
            'No se pudo conectar la cuenta de Google.'
          );
          errorEl.hidden = false;
        }
      }
    });

    document.getElementById('reg-google-signout-btn')?.addEventListener('click', async () => {
      await signOutFirebase();
      statusBannerMessage = '';
      showRegistrationForm(null);
    });
  }

  function populateFormFromUser(user) {
    if (!form) return;
    if (fullnameInput) {
      fullnameInput.value = user?.fullname || authUser?.displayName || '';
    }
    if (ageInput) ageInput.value = user?.age ? String(user.age) : '';
    if (stateInput) stateInput.value = user?.state || '';
    if (phoneInput) phoneInput.value = user?.phone || '';
    if (consentInput) consentInput.checked = Boolean(user?.consentAccepted);

    const interestSet = new Set(Array.isArray(user?.interests) ? user.interests : []);
    interestCheckboxes.forEach((checkbox) => {
      checkbox.checked = interestSet.has(checkbox.value);
    });
    syncSelectAllInterests();
  }

  function renderProfileView(user, statusMessage = statusBannerMessage) {
    if (!profileView || !form) return;

    form.hidden = true;
    profileView.hidden = false;
    if (feedbackEl) feedbackEl.hidden = true;
    if (errorEl) errorEl.hidden = true;

    if (modalKicker) modalKicker.textContent = 'Tu perfil en Nomvu';
    if (modalTitle) modalTitle.textContent = user.fullname;

    const userInterests = Array.isArray(user.interests) ? user.interests : [];
    const userInterestSet = new Set(userInterests);
    const hasAllInterests =
      EVENT_INTERESTS.length > 0 && EVENT_INTERESTS.every((item) => userInterestSet.has(item));

    const interestsBadges = hasAllInterests
      ? '<span class="profile-tag">Todos</span>'
      : userInterests.map((item) => `<span class="profile-tag">${escapeHtml(item)}</span>`).join('');

    const consentOn = Boolean(user.consentAccepted);
    const waInterestsLabel = hasAllInterests ? 'Todos' : userInterests.join(', ');
    const waMsg = `Hola Nomvu, actualicé mi registro.\nNombre: ${user.fullname}\nEdad: ${user.age} años\nEstado: ${user.state}\nTeléfono: ${user.phone}\nIntereses: ${waInterestsLabel}\nMensajes automáticos: ${consentOn ? 'Sí' : 'No'}`;
    const waLink = `https://wa.me/${NOMVU_SUPPORT_WA}?text=${encodeURIComponent(waMsg)}`;

    profileView.innerHTML = `
      <div class="profile-grid">
        <div class="profile-item">
          <span class="profile-label">Nombre y Apellido</span>
          <span class="profile-value">${escapeHtml(user.fullname)}</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">Edad</span>
          <span class="profile-value tabular">${escapeHtml(String(user.age))} años</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">Estado</span>
          <span class="profile-value">${escapeHtml(user.state)}</span>
        </div>
        <div class="profile-item">
          <span class="profile-label">Teléfono (WhatsApp)</span>
          <span class="profile-value tabular">${escapeHtml(user.phone)}</span>
        </div>
        <div class="profile-item profile-item--full">
          <span class="profile-label">Correo vinculado</span>
          <span class="profile-value">${escapeHtml(user.email || authUser?.email || '')}</span>
        </div>
        <div class="profile-item profile-item--full">
          <span class="profile-label">Eventos que te gustan</span>
          <div class="profile-tags">${interestsBadges}</div>
        </div>
      </div>

      <div class="profile-consent-card">
        <div class="profile-consent-header">
          <span class="field-label">Mensajes automáticos de tu ciudad</span>
          <span class="profile-status-badge ${consentOn ? 'is-active' : 'is-inactive'}">
            ${consentOn ? 'Activos' : 'Desactivados'}
          </span>
        </div>
        <label class="consent-box">
          <input id="profile-consent-toggle" type="checkbox" ${consentOn ? 'checked' : ''} />
          <span>
            Acepto recibir mensajes automáticos de Nomvu con los próximos eventos de
            <strong>${escapeHtml(user.state)}</strong>.
          </span>
        </label>
        ${
          statusMessage
            ? `<p class="profile-status-note" role="status">${escapeHtml(statusMessage)}</p>`
            : ''
        }
      </div>

      <div class="profile-actions">
        <button type="button" class="btn btn--primary" data-edit-profile>
          Editar mis datos
        </button>
        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn btn--outline">
          Enviar por WhatsApp
        </a>
        <button type="button" class="btn btn--outline" data-logout-profile>
          Cerrar sesión
        </button>
      </div>
    `;

    const consentToggle = document.getElementById('profile-consent-toggle');
    consentToggle?.addEventListener('change', async (event) => {
      if (!authUser) return;
      const nextConsent = Boolean(event.target.checked);
      consentToggle.disabled = true;
      try {
        await saveUserProfileToFirestore(authUser, {
          fullname: user.fullname,
          age: user.age,
          state: user.state,
          phone: user.phone,
          interests: userInterests,
          consentAccepted: nextConsent,
        });
        statusBannerMessage = nextConsent
          ? 'Preferencia guardada: recibirás mensajes automáticos de eventos.'
          : 'Preferencia guardada: desactivaste los mensajes automáticos.';
        syncModalContent();
      } catch (error) {
        console.error(error);
        consentToggle.disabled = false;
        consentToggle.checked = !nextConsent;
      }
    });

    profileView.querySelector('[data-edit-profile]')?.addEventListener('click', () => {
      statusBannerMessage = '';
      showRegistrationForm(user);
    });

    profileView.querySelector('[data-logout-profile]')?.addEventListener('click', async () => {
      statusBannerMessage = '';
      await signOutFirebase();
      showRegistrationForm(null);
    });
  }

  function showRegistrationForm(existingUser) {
    if (!form || !profileView) return;
    isEditingExisting = Boolean(existingUser);
    profileView.hidden = true;
    form.hidden = false;
    if (feedbackEl) feedbackEl.hidden = true;
    if (errorEl) errorEl.hidden = true;

    renderGoogleAuthBox();

    if (existingUser) {
      if (modalKicker) modalKicker.textContent = 'Editar perfil';
      if (modalTitle) modalTitle.textContent = 'Actualiza tus datos';
      if (submitBtn) submitBtn.textContent = 'Guardar cambios';
      populateFormFromUser(existingUser);
    } else {
      if (modalKicker) modalKicker.textContent = 'Comunidad Nomvu';
      if (modalTitle) modalTitle.textContent = 'Regístrate y entérate primero';
      if (submitBtn) submitBtn.textContent = 'Completar registro';
      form.reset();
      if (selectAllInterestsInput) selectAllInterestsInput.checked = false;
      if (authUser && fullnameInput) {
        fullnameInput.value = authUser.displayName || '';
      }
    }
  }

  function syncModalContent() {
    if (modalBackdrop.hidden) return;
    if (isEditingExisting) {
      showRegistrationForm(userProfile);
      return;
    }

    if (userProfile) {
      renderProfileView(userProfile);
    } else {
      showRegistrationForm(null);
    }
  }

  function openModal(triggerEl) {
    lastTrigger = triggerEl || null;
    isEditingExisting = false;
    statusBannerMessage = '';

    const mobileNav = document.querySelector('[data-mobile-nav]');
    const toggleBtn = document.querySelector('[data-menu-toggle]');
    if (mobileNav && !mobileNav.hidden) {
      mobileNav.hidden = true;
      setMenuToggleState(toggleBtn, false);
    }

    modalBackdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    syncModalContent();

    if (!userProfile) {
      fullnameInput?.focus();
    } else {
      closeBtn?.focus();
    }
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.style.overflow = '';
    isEditingExisting = false;
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn));
  });

  closeBtn?.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modalBackdrop.hidden) {
      closeModal();
    }
  });

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (errorEl) errorEl.hidden = true;

    const fullname = fullnameInput?.value.trim() || '';
    const age = Number(ageInput?.value || 0);
    const state = stateInput?.value || '';
    const phoneRaw = phoneInput?.value.trim() || '';
    const phoneDigits = phoneRaw.replace(/\D/g, '');
    const selectedInterests = interestCheckboxes
      .filter((input) => input.checked)
      .map((input) => input.value);
    const consentAccepted = Boolean(consentInput?.checked);

    if (fullname.length < 3) {
      if (errorEl) {
        errorEl.textContent = 'Ingresa tu Nombre y Apellido.';
        errorEl.hidden = false;
      }
      fullnameInput?.focus();
      return;
    }

    if (!Number.isFinite(age) || age < 14 || age > 120) {
      if (errorEl) {
        errorEl.textContent = 'Ingresa una edad válida (entre 14 y 120 años).';
        errorEl.hidden = false;
      }
      ageInput?.focus();
      return;
    }

    if (!state) {
      if (errorEl) {
        errorEl.textContent = 'Selecciona tu estado de Venezuela.';
        errorEl.hidden = false;
      }
      stateInput?.focus();
      return;
    }

    if (phoneDigits.length < 10) {
      if (errorEl) {
        errorEl.textContent = 'Ingresa un número de teléfono válido (ej. 0412-3558190).';
        errorEl.hidden = false;
      }
      phoneInput?.focus();
      return;
    }

    if (selectedInterests.length === 0) {
      if (errorEl) {
        errorEl.textContent = 'Elige al menos un tipo de evento que te guste.';
        errorEl.hidden = false;
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Guardando registro...';
    }

    try {
      let activeAuthUser = authUser;
      if (!activeAuthUser) {
        activeAuthUser = await signInWithGooglePopup();
      }

      const saved = await saveUserProfileToFirestore(activeAuthUser, {
        fullname,
        age,
        state,
        phone: phoneRaw,
        interests: selectedInterests,
        consentAccepted,
      });

      const wasEditing = isEditingExisting;
      userProfile = saved;
      isEditingExisting = false;
      statusBannerMessage = wasEditing
        ? 'Datos actualizados correctamente.'
        : 'Registro completado. Aquí puedes revisar tus datos y ajustar si deseas recibir mensajes automáticos.';

      syncRegisterTriggers();
      syncModalContent();
    } catch (error) {
      if (errorEl) {
        errorEl.textContent = formatFirebaseErrorMessage(
          error,
          'No se pudo guardar tu registro. Intenta nuevamente.'
        );
        errorEl.hidden = false;
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = isEditingExisting ? 'Guardar cambios' : 'Completar registro';
      }
    }
  });

  stateListeners.add(() => {
    syncRegisterTriggers();
    renderGoogleAuthBox();
    syncModalContent();
  });

  syncRegisterTriggers();
}

/* 6. Animación suave al hacer scroll hacia abajo (compartido en las 4 páginas) */
let scrollRevealObserver = null;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function getRevealObserver() {
  if (scrollRevealObserver || typeof IntersectionObserver === 'undefined') {
    return scrollRevealObserver;
  }

  scrollRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        target.classList.add('is-visible');
        scrollRevealObserver.unobserve(target);
        window.setTimeout(() => {
          target.style.willChange = 'auto';
        }, 650);
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -28px 0px',
    }
  );

  return scrollRevealObserver;
}

function observeRevealTargets(nodeList) {
  if (!nodeList || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    return;
  }

  const observer = getRevealObserver();
  if (!observer) return;

  const viewportCutoff = window.innerHeight * 0.94;
  Array.from(nodeList).forEach((el, index) => {
    if (el.dataset.revealReady === 'true') return;
    el.dataset.revealReady = 'true';

    const rect = el.getBoundingClientRect();
    if (rect.top < viewportCutoff) {
      return;
    }

    el.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
    el.classList.add('reveal-on-scroll');
    observer.observe(el);
  });
}

function initScrollAnimations() {
  if (prefersReducedMotion()) return;

  const header = document.querySelector('.site-header');
  if (header && !header.querySelector('.scroll-progress')) {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.setAttribute('aria-hidden', 'true');
    header.appendChild(progressBar);

    let rafPending = false;
    const updateProgress = () => {
      rafPending = false;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
      progressBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };

    const scheduleProgress = () => {
      if (rafPending) return;
      rafPending = true;
      window.requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });
    updateProgress();
  }

  const staticTargets = document.querySelectorAll(
    [
      '.section-header',
      '.filter-dock',
      '.event-card',
      '.register-callout',
      '.editorial-card',
      '.testimonial-card',
      '.plan-card',
      '.addon-banner',
      '.form-panel',
      '.preview-box',
      '.stat-block',
      '.manifesto-quote',
      '.whatsapp-callout',
      '.faq-item',
    ].join(', ')
  );

  observeRevealTargets(staticTargets);
}

/* 7. Animación táctil al tocar o presionar botones y cuadros */
function initButtonTapAnimations() {
  if (prefersReducedMotion()) return;

  const buttonSelector =
    '.btn, .menu-toggle, .segmented-btn, .reset-link, .faq-trigger, .modal-close, .radio-option, .checkbox-card';
  const cardSelector =
    '.event-card, .editorial-card, .testimonial-card, .plan-card, .stat-block, .addon-banner, .register-callout, .whatsapp-callout, .profile-consent-card, .auth-google-box';
  const timers = new WeakMap();

  const replayClass = (el, className, durationMs) => {
    if (!el || el.disabled) return;
    const key = `${className}`;
    const elTimers = timers.get(el) || {};
    if (elTimers[key]) {
      window.clearTimeout(elTimers[key]);
    }
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);

    elTimers[key] = window.setTimeout(() => {
      el.classList.remove(className);
      delete elTimers[key];
      if (Object.keys(elTimers).length === 0) {
        timers.delete(el);
      }
    }, durationMs);
    timers.set(el, elTimers);
  };

  document.addEventListener(
    'pointerdown',
    (event) => {
      if (!(event.target instanceof Element)) return;
      const btnTarget = event.target.closest(buttonSelector);
      if (btnTarget) replayClass(btnTarget, 'is-tapped', 290);

      const cardTarget = event.target.closest(cardSelector);
      if (cardTarget) replayClass(cardTarget, 'is-card-tapped', 360);
    },
    { passive: true }
  );

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (!(event.target instanceof Element)) return;
    const btnTarget = event.target.closest(buttonSelector);
    if (btnTarget) replayClass(btnTarget, 'is-tapped', 290);

    const cardTarget = event.target.closest(cardSelector);
    if (cardTarget) replayClass(cardTarget, 'is-card-tapped', 360);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCatalogPage();
  initProducersPage();
  initContactPage();
  initRegisterModal();
  initScrollAnimations();
  initButtonTapAnimations();
  initFirebaseSync();
});
