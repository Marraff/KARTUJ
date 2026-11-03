// All user-facing texts. Never hardcode UI strings in components.
export const texts = {
  appName: 'KARTUJ',
  common: {
    back: 'Späť',
    save: 'Uložiť',
    cancel: 'Zrušiť',
    delete: 'Zmazať',
    edit: 'Upraviť',
    loading: 'Načítavam…',
  },
  cardList: {
    searchPlaceholder: 'Hľadať kartu…',
    favorites: 'Obľúbené',
    allCards: 'Všetky',
    addCard: 'Pridať kartu',
    emptyTitle: 'Zatiaľ nemáš žiadne karty',
    emptyText: 'Pridaj svoju prvú vernostnú kartu naskenovaním alebo ručne.',
    settings: 'Nastavenia',
  },
  cardDetail: {
    title: 'Karta',
    notFound: 'Karta sa nenašla.',
    brightnessHint: 'Zvýš jas obrazovky',
  },
  cardForm: {
    newTitle: 'Nová karta',
    editTitle: 'Upraviť kartu',
  },
  scan: {
    title: 'Naskenovať kód',
  },
  settings: {
    title: 'Nastavenia',
  },
  notFound: {
    title: 'Stránka neexistuje',
    backHome: 'Späť na karty',
  },
} as const
