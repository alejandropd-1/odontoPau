export interface HomeProfessional {
  name: string;
  license: string;
  role: string;
  image: string;
  imageAlt: string;
}

export interface HomePageData {
  type: 'HomePage';
  title: string;
  hero: {
    title: string;
    description: string;
    buttonPrimary: string;
    buttonSecondary: string;
    backgroundImage: string;
    backgroundAlt: string;
    eyebrow: string;
    scrollLabel: string;
  };
  services: {
    title: string;
    description: string;
    linkLabel: string;
  };
  team: {
    eyebrow: string;
    title: string;
    description: string;
    featured: HomeProfessional;
    members: HomeProfessional[];
  };
  location: {
    title: string;
    description: string;
    addressTitle: string;
    addressLines: string[];
    hoursTitle: string;
    hours: string[];
    whatsappLabel: string;
    whatsappHref: string;
    mapEmbedUrl: string;
    mapTitle: string;
    placeName: string;
    placeAddress: string;
    directionsLabel: string;
    directionsHref: string;
  };
}

export interface TreatmentsPageData {
  type: 'TreatmentsPage';
  title: string;
  eyebrow: string;
  heading: string;
  description: string;
  instructionsEyebrow: string;
  instructionsHeading: string;
  instructionsDescription: string;
  cardLinkLabel: string;
}

function requireNonEmptyString(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Contenido institucional inválido: ${path} debe ser un texto no vacío.`);
  }
}

function requireStringList(value: unknown, path: string): asserts value is string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Contenido institucional inválido: ${path} debe ser una lista no vacía.`);
  }
  value.forEach((item, index) => requireNonEmptyString(item, `${path}[${index}]`));
}

export function validateHomePageData(value: unknown): HomePageData {
  const home = value as Partial<HomePageData>;
  if (home.type !== 'HomePage') throw new Error('Contenido institucional inválido: type debe ser HomePage.');

  const requiredPaths: Array<[unknown, string]> = [
    [home.title, 'title'],
    [home.hero?.title, 'hero.title'],
    [home.hero?.description, 'hero.description'],
    [home.hero?.buttonPrimary, 'hero.buttonPrimary'],
    [home.hero?.buttonSecondary, 'hero.buttonSecondary'],
    [home.hero?.backgroundImage, 'hero.backgroundImage'],
    [home.hero?.backgroundAlt, 'hero.backgroundAlt'],
    [home.hero?.eyebrow, 'hero.eyebrow'],
    [home.hero?.scrollLabel, 'hero.scrollLabel'],
    [home.services?.title, 'services.title'],
    [home.services?.description, 'services.description'],
    [home.services?.linkLabel, 'services.linkLabel'],
    [home.team?.eyebrow, 'team.eyebrow'],
    [home.team?.title, 'team.title'],
    [home.team?.description, 'team.description'],
    [home.location?.title, 'location.title'],
    [home.location?.description, 'location.description'],
    [home.location?.whatsappHref, 'location.whatsappHref'],
    [home.location?.mapEmbedUrl, 'location.mapEmbedUrl'],
    [home.location?.directionsHref, 'location.directionsHref'],
  ];
  requiredPaths.forEach(([field, path]) => requireNonEmptyString(field, path));
  requireStringList(home.location?.addressLines, 'location.addressLines');
  requireStringList(home.location?.hours, 'location.hours');

  const professionals = [home.team?.featured, ...(home.team?.members ?? [])];
  if (!home.team?.featured || !Array.isArray(home.team?.members)) {
    throw new Error('Contenido institucional inválido: team debe declarar profesional principal y lista de integrantes.');
  }
  professionals.forEach((professional, index) => {
    requireNonEmptyString(professional?.name, `team.professionals[${index}].name`);
    requireNonEmptyString(professional?.role, `team.professionals[${index}].role`);
    requireNonEmptyString(professional?.image, `team.professionals[${index}].image`);
    requireNonEmptyString(professional?.imageAlt, `team.professionals[${index}].imageAlt`);
  });

  return home as HomePageData;
}

export function validateTreatmentsPageData(value: unknown): TreatmentsPageData {
  const page = value as Partial<TreatmentsPageData>;
  if (page.type !== 'TreatmentsPage') {
    throw new Error('Contenido institucional inválido: type debe ser TreatmentsPage.');
  }
  const required: Array<keyof Omit<TreatmentsPageData, 'type'>> = [
    'title',
    'eyebrow',
    'heading',
    'description',
    'instructionsEyebrow',
    'instructionsHeading',
    'instructionsDescription',
    'cardLinkLabel',
  ];
  required.forEach((field) => requireNonEmptyString(page[field], String(field)));
  return page as TreatmentsPageData;
}
