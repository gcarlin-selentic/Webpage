import type { Hack, Severity } from "./types";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

/** Path of the home page in each language. */
export const HOME: Record<Locale, string> = { en: "/", es: "/es" };

const en = {
  meta: {
    title: "Selentic Group | Latest breaches and how to check your exposure",
    description:
      "Free, daily-updated alerts on the latest data breaches and ransomware claims, with a one-click check of whether your email was exposed. No sales, just practical guidance.",
    ogLocale: "en_US",
    ogAlt: "Selentic Group: latest breaches and how to check your exposure",
    ogTitle: "Daily alerts on the latest data breaches",
    ogCta: "Check if you're exposed at am-i-exposed.com",
  },
  skip: "Skip to content",
  newTab: "(opens in a new tab)",
  home: "Selentic Group, home",
  nav: { label: "Main", incidents: "Incidents", faq: "FAQ", contact: "Contact" },
  switchTo: { label: "ES", title: "Ver en español" },
  checkShort: "Check exposure",
  checkLong: "Check if you're exposed",
  hero: {
    titleAccent: "Breaches happen every day.",
    titleRest: "Know if you're in one.",
    sub: "Daily alerts on the latest data breaches and ransomware attacks. See who was hit and check whether your email was exposed. No sales, just practical guidance.",
    seeIncidents: "See latest incidents",
    updated: "Feed updated",
  },
  radar: {
    title: "Threat radar",
    lastWeek: "Last 7 days",
    lastDays: (days: number) => `Last ${days} days`,
    claims: "Ransomware claims",
    countries: "Countries named",
    breaches: "Verified breaches",
    topGroup: "Most active group",
    chart: "Ransomware claims per day",
    sectors: "Most targeted sectors",
    latam: "Latin America",
    latamNote: "Share of ransomware claims naming an organization in the region",
    latamOf: (n: string, total: string) => `${n} of ${total} claims`,
    day: "Day",
    soFar: "so far",
    claimsCount: (n: string) => `${n} claims`,
    latestBreach: "Latest verified breach",
  },
  reveal: {
    eyebrow: "In numbers",
    claims: "Ransomware claims",
    breaches: "Verified data breaches",
    inDays: (days: number) => `in the last ${days} days`,
    closing: "Your data could be in any of them.",
    closingSub: "Checking takes under a minute.",
  },
  incidents: { title: "Latest incidents", note: "Newest first. Updated daily.", listName: "Latest security incidents" },
  severity: { critical: "Critical", high: "High", medium: "Medium", low: "Low" } satisfies Record<Severity, string>,
  feed: {
    error: "Couldn't load the latest alerts. Try refreshing.",
    loading: "Loading…",
    retry: "Try again",
    empty: "No recent incidents detected. Check back soon. Meanwhile, you can",
    emptyLink: "check whether your email was exposed",
    filterLegend: "Filter by severity",
    all: "All",
    searchLabel: "Search incidents by company, domain or tag",
    searchPlaceholder: "Search company or domain",
    showing: (shown: number, total: number) => `Showing ${shown} of ${total} incidents`,
    searchLimited: (shown: number, total: number) =>
      `Showing the ${shown} most recent of ${total} matches. Add more detail to narrow it down.`,
    searching: "Searching all incidents…",
    noMatch: "No incidents match these filters.",
    clear: "Clear filters",
    showMore: (n: number) => `Show ${n} more`,
  },
  card: { affects: "Affects", readDetails: "Read details", about: "about" },
  detail: {
    close: "Close details",
    severity: "Severity",
    reported: "Reported",
    domains: "Domains",
    tags: "Tags",
    source: "Source",
    estimated:
      "Severity is our estimate from the incident type: verified breaches rank high, unverified ransomware claims rank medium.",
    viewSource: "View source",
  },
  check: {
    title: "Check your email in under a minute",
    steps: [
      "Open Am I Exposed? in a new tab.",
      "Enter your personal or work email address. No account needed.",
      "See whether it appears in known breaches, then follow the steps below.",
    ],
    note: "Am I Exposed? is built by Selentic Group. The basic check is free.",
  },
  guidance: {
    title: "If your company shows up in a breach",
    items: [
      ["Change the password", "for that service, and anywhere else you reused it."],
      ["Turn on two-step verification", "on your email first, since it resets every other account."],
      ["Expect targeted phishing.", "Leaked emails are used for convincing fake invoices and password-reset messages."],
      ["Tell your IT or security team", "if a work address is involved, so they can check sign-ins."],
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "What is this site?",
        a: "A daily list of publicly reported data breaches and ransomware claims, with a link to check whether your own email was exposed. Selentic Group publishes it as a free information service. Nothing is sold here and no sign-up is needed.",
      },
      {
        q: "Where does the incident data come from?",
        a: "From two public sources: Have I Been Pwned, which lists verified data breaches, and RansomLook, which tracks claims posted on ransomware groups' leak sites. Both publish under CC BY 4.0. The list is refreshed once a day.",
      },
      {
        q: "What's the difference between a data breach and a ransomware claim?",
        a: "A data breach entry has been verified by Have I Been Pwned: the leaked data exists and was analysed. A ransomware claim is what a criminal group says it did. It is listed as reported and has not been independently verified, so treat it as a warning, not a confirmation.",
      },
      {
        q: "How is the severity level decided?",
        a: "The sources don't publish a severity rating, so it is estimated from the type of incident. Verified breaches are marked High because account data is known to be exposed; unverified ransomware claims are marked Medium. Each incident's details say when the level is an estimate.",
      },
      {
        q: "Does checking my email cost anything?",
        a: "No. The basic check on Am I Exposed? is free and needs no account. The tool is built by Selentic Group and opens in a new tab.",
      },
      {
        q: "Does this site collect my data?",
        a: "No. It sets no cookies, runs no ads and does not track you. This page never asks for your email; the check happens on am-i-exposed.com under its own privacy policy.",
      },
      {
        q: "A company I use is on the list. What should I do?",
        a: "Check your email on Am I Exposed?, change the password for that service and anywhere you reused it, and turn on two-step verification on your email account. The steps above this section explain each one.",
      },
      {
        q: "I think an entry is wrong. Who do I tell?",
        a: "Entries come straight from the public sources listed above, so corrections start there. If something looks wrong, write to us using the contact details below and we will look into it.",
      },
    ],
  },
  contact: {
    title: "Contact",
    note: "Questions about this site, a correction, or something else? Write or message us.",
    email: "Email",
    phone: "Phone / WhatsApp",
    whatsapp: "Message on WhatsApp",
    location: "Location",
    locationValue: "Lima, Peru",
  },
  footer: {
    privacyLabel: "Privacy:",
    privacy:
      "this site sets no cookies, runs no ads and does not track you. We don't ask for your email here; checks happen on am-i-exposed.com under its own privacy policy.",
    data: "Incident data:",
    claims: "Ransomware entries are claims made by the groups themselves and are not independently verified.",
    faq: "FAQ",
    contact: "Contact",
    privacyLink: "Privacy",
    source: "Source code",
  },
  dateLocale: "en",
};

export type Dict = typeof en;

const es: Dict = {
  meta: {
    title: "Selentic Group | Últimas filtraciones y cómo saber si está expuesto",
    description:
      "Alertas gratuitas y actualizadas a diario sobre las últimas filtraciones de datos y reclamos de ransomware, con una revisión en un clic para saber si su correo quedó expuesto. Sin ventas, solo orientación práctica.",
    ogLocale: "es_PE",
    ogAlt: "Selentic Group: últimas filtraciones y cómo saber si está expuesto",
    ogTitle: "Alertas diarias sobre las últimas filtraciones de datos",
    ogCta: "Verifique si está expuesto en am-i-exposed.com",
  },
  skip: "Saltar al contenido",
  newTab: "(se abre en una pestaña nueva)",
  home: "Selentic Group, inicio",
  nav: { label: "Principal", incidents: "Incidentes", faq: "Preguntas", contact: "Contacto" },
  switchTo: { label: "EN", title: "View in English" },
  // Short enough to sit next to the logo on a 375 px phone.
  checkShort: "Revisar correo",
  checkLong: "Verifique si está expuesto",
  hero: {
    titleAccent: "Las filtraciones ocurren a diario.",
    titleRest: "Sepa si está en una.",
    sub: "Alertas diarias sobre las últimas filtraciones de datos y ataques de ransomware. Vea quién fue afectado y verifique si su correo quedó expuesto. Sin ventas, solo orientación práctica.",
    seeIncidents: "Ver últimos incidentes",
    updated: "Actualizado",
  },
  radar: {
    title: "Radar de amenazas",
    lastWeek: "Últimos 7 días",
    lastDays: (days) => `Últimos ${days} días`,
    claims: "Reclamos de ransomware",
    countries: "Países mencionados",
    breaches: "Filtraciones verificadas",
    topGroup: "Grupo más activo",
    chart: "Reclamos de ransomware por día",
    sectors: "Sectores más atacados",
    latam: "América Latina",
    latamNote: "Porcentaje de reclamos de ransomware contra organizaciones de la región",
    latamOf: (n, total) => `${n} de ${total} reclamos`,
    day: "Día",
    soFar: "hasta ahora",
    claimsCount: (n) => `${n} reclamos`,
    latestBreach: "Última filtración verificada",
  },
  reveal: {
    eyebrow: "En cifras",
    claims: "Reclamos de ransomware",
    breaches: "Filtraciones de datos verificadas",
    inDays: (days) => `en los últimos ${days} días`,
    closing: "Sus datos podrían estar en cualquiera de ellos.",
    closingSub: "Verificarlo toma menos de un minuto.",
  },
  incidents: {
    title: "Últimos incidentes",
    note: "Los más recientes primero. Se actualiza a diario.",
    listName: "Últimos incidentes de seguridad",
  },
  severity: { critical: "Crítica", high: "Alta", medium: "Media", low: "Baja" },
  feed: {
    error: "No pudimos cargar las últimas alertas. Intente recargar la página.",
    loading: "Cargando…",
    retry: "Reintentar",
    empty: "No se detectaron incidentes recientes. Vuelva pronto. Mientras tanto, puede",
    emptyLink: "verificar si su correo quedó expuesto",
    filterLegend: "Filtrar por gravedad",
    all: "Todos",
    searchLabel: "Buscar incidentes por empresa, dominio o etiqueta",
    searchPlaceholder: "Buscar empresa o dominio",
    showing: (shown, total) => `Mostrando ${shown} de ${total} incidentes`,
    searchLimited: (shown, total) =>
      `Mostrando los ${shown} más recientes de ${total} resultados. Agregue más detalle para acotar la búsqueda.`,
    searching: "Buscando en todos los incidentes…",
    noMatch: "Ningún incidente coincide con estos filtros.",
    clear: "Borrar filtros",
    showMore: (n) => `Mostrar ${n} más`,
  },
  card: { affects: "Afecta a", readDetails: "Ver detalles", about: "sobre" },
  detail: {
    close: "Cerrar detalles",
    severity: "Gravedad",
    reported: "Reportado",
    domains: "Dominios",
    tags: "Etiquetas",
    source: "Fuente",
    estimated:
      "La gravedad es nuestra estimación según el tipo de incidente: las filtraciones verificadas se clasifican como altas y los reclamos de ransomware no verificados, como medios.",
    viewSource: "Ver fuente",
  },
  check: {
    title: "Revise su correo en menos de un minuto",
    steps: [
      "Abra Am I Exposed? en una pestaña nueva.",
      "Ingrese su correo personal o de trabajo. No necesita crear una cuenta.",
      "Vea si aparece en filtraciones conocidas y luego siga los pasos de abajo.",
    ],
    note: "Am I Exposed? es una herramienta de Selentic Group. La revisión básica es gratuita.",
  },
  guidance: {
    title: "Si su empresa aparece en una filtración",
    items: [
      ["Cambie la contraseña", "de ese servicio y de cualquier otro donde la haya reutilizado."],
      [
        "Active la verificación en dos pasos",
        "primero en su correo, ya que desde ahí se restablecen todas las demás cuentas.",
      ],
      [
        "Espere phishing dirigido.",
        "Los correos filtrados se usan para enviar facturas falsas y mensajes de restablecimiento de contraseña muy convincentes.",
      ],
      [
        "Avise a su equipo de TI o de seguridad",
        "si se trata de un correo de trabajo, para que revisen los inicios de sesión.",
      ],
    ],
  },
  faq: {
    title: "Preguntas frecuentes",
    items: [
      {
        q: "¿Qué es este sitio?",
        a: "Una lista diaria de filtraciones de datos y reclamos de ransomware reportados públicamente, con un enlace para verificar si su propio correo quedó expuesto. Selentic Group lo publica como un servicio de información gratuito. Aquí no se vende nada y no necesita registrarse.",
      },
      {
        q: "¿De dónde vienen los datos de los incidentes?",
        a: "De dos fuentes públicas: Have I Been Pwned, que lista filtraciones de datos verificadas, y RansomLook, que sigue los reclamos publicados en los sitios de filtración de los grupos de ransomware. Ambas publican bajo licencia CC BY 4.0. La lista se actualiza una vez al día.",
      },
      {
        q: "¿Cuál es la diferencia entre una filtración de datos y un reclamo de ransomware?",
        a: "Una filtración de datos fue verificada por Have I Been Pwned: los datos filtrados existen y fueron analizados. Un reclamo de ransomware es lo que un grupo criminal dice haber hecho. Se muestra tal como fue reportado y no ha sido verificado de forma independiente, así que tómelo como una advertencia, no como una confirmación.",
      },
      {
        q: "¿Cómo se define el nivel de gravedad?",
        a: "Las fuentes no publican un nivel de gravedad, así que se estima según el tipo de incidente. Las filtraciones verificadas se marcan como Alta porque se sabe que hay datos de cuentas expuestos; los reclamos de ransomware no verificados se marcan como Media. El detalle de cada incidente indica cuándo el nivel es una estimación.",
      },
      {
        q: "¿Revisar mi correo tiene algún costo?",
        a: "No. La revisión básica en Am I Exposed? es gratuita y no requiere cuenta. La herramienta es de Selentic Group y se abre en una pestaña nueva.",
      },
      {
        q: "¿Este sitio recopila mis datos?",
        a: "No. No usa cookies, no muestra anuncios y no le rastrea. Esta página nunca le pide su correo; la revisión se hace en am-i-exposed.com bajo su propia política de privacidad.",
      },
      {
        q: "Una empresa que uso aparece en la lista. ¿Qué debo hacer?",
        a: "Revise su correo en Am I Exposed?, cambie la contraseña de ese servicio y de cualquier otro donde la haya reutilizado, y active la verificación en dos pasos en su correo. Los pasos que aparecen antes de esta sección explican cada uno.",
      },
      {
        q: "Creo que un incidente está mal. ¿A quién le aviso?",
        a: "Los incidentes vienen directamente de las fuentes públicas mencionadas arriba, así que las correcciones empiezan ahí. Si algo parece incorrecto, escríbanos con los datos de contacto de abajo y lo revisaremos.",
      },
    ],
  },
  contact: {
    title: "Contacto",
    note: "¿Preguntas sobre este sitio, una corrección u otro tema? Escríbanos o envíenos un mensaje.",
    email: "Correo",
    phone: "Teléfono / WhatsApp",
    whatsapp: "Escribir por WhatsApp",
    location: "Ubicación",
    locationValue: "Lima, Perú",
  },
  footer: {
    privacyLabel: "Privacidad:",
    privacy:
      "este sitio no usa cookies, no muestra anuncios y no le rastrea. Aquí no le pedimos su correo; la revisión se hace en am-i-exposed.com bajo su propia política de privacidad.",
    data: "Datos de incidentes:",
    claims:
      "Las entradas de ransomware son afirmaciones de los propios grupos y no han sido verificadas de forma independiente.",
    faq: "Preguntas frecuentes",
    contact: "Contacto",
    privacyLink: "Privacidad",
    source: "Código fuente",
  },
  dateLocale: "es",
};

export const DICT: Record<Locale, Dict> = { en, es };

/** Summary and tags in the page language, falling back to the source's own text. */
export function localized(hack: Hack, locale: Locale): { summary: string; tags: string[] } {
  return locale === "es" && hack.es ? hack.es : hack;
}
