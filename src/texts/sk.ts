// All user-facing texts. Never hardcode UI strings in components.
export const texts = {
  appName: 'KARTUJ',
  common: {
    back: 'Späť',
    save: 'Uložiť',
    cancel: 'Zrušiť',
    delete: 'Zmazať',
    edit: 'Upraviť',
    close: 'Zavrieť',
    loading: 'Načítavam…',
    genericError: 'Niečo sa pokazilo. Skús to znova.',
  },
  cardList: {
    searchPlaceholder: 'Hľadať kartu…',
    searchLabel: 'Hľadať kartu',
    favorites: 'Obľúbené',
    allCards: 'Všetky',
    addCard: 'Pridať kartu',
    emptyTitle: 'Zatiaľ nemáš žiadne karty',
    emptyText: 'Pridaj svoju prvú vernostnú kartu naskenovaním alebo ručne.',
    noResults: 'Žiadna karta nezodpovedá hľadaniu.',
    settings: 'Nastavenia',
  },
  cardDetail: {
    title: 'Karta',
    notFound: 'Karta sa nenašla.',
    brightnessHint: 'Zvýš jas obrazovky, pokladňa kód načíta ľahšie.',
    tapToEnlarge: 'Ťukni na kód pre zväčšenie',
  },
  cardForm: {
    newTitle: 'Nová karta',
    editTitle: 'Upraviť kartu',
    name: 'Názov obchodu',
    namePlaceholder: 'napr. Lidl Plus',
    code: 'Číslo karty',
    codePlaceholder: 'číslo pod čiarovým kódom',
    color: 'Farba karty',
    favorite: 'Obľúbená karta',
    preview: 'Náhľad',
    deleteCard: 'Zmazať kartu',
    deleteConfirmTitle: 'Zmazať kartu?',
    deleteConfirmText: 'Karta sa natrvalo odstráni z tohto telefónu.',
    errors: {
      nameRequired: 'Zadaj názov obchodu.',
      codeRequired: 'Zadaj číslo karty.',
      codeInvalid: 'Číslo karty obsahuje nepodporované znaky (napr. diakritiku). Použi len čísla, písmená bez diakritiky a bežné znaky.',
      saveFailed: 'Kartu sa nepodarilo uložiť. Skús to znova.',
      deleteFailed: 'Kartu sa nepodarilo zmazať. Skús to znova.',
    },
  },
  scan: {
    title: 'Naskenovať kód',
    button: 'Naskenovať kód kamerou',
    hint: 'Namier kameru na čiarový alebo QR kód karty',
    starting: 'Spúšťam kameru…',
    manualEntry: 'Zadať ručne',
    errors: {
      permissionDenied: 'Appka nemá povolenie používať kameru.',
      permissionHelpIos: 'iPhone: Nastavenia → Safari → Kamera → Povoliť (alebo ťukni na „aA“ v adresnom riadku → Nastavenia webovej stránky).',
      permissionHelpAndroid: 'Android: ťukni na ikonu vľavo od adresy → Povolenia → Kamera → Povoliť.',
      noCamera: 'V tomto zariadení sa nenašla žiadna kamera.',
      insecure: 'Kamera funguje len cez zabezpečené pripojenie (https).',
      generic: 'Kameru sa nepodarilo spustiť. Skús to znova alebo zadaj číslo ručne.',
    },
  },
  settings: {
    title: 'Nastavenia',
    backupTitle: 'Záloha kariet',
    backupText:
      'Karty sú uložené len v tomto telefóne. Zálohuj si ich do súboru (napr. na iCloud alebo Google Drive) – pri výmene telefónu alebo zmazaní appky ich z neho obnovíš.',
    backupButton: (count: number) => `Zálohovať karty (${count})`,
    restoreButton: 'Obnoviť zo zálohy',
    backupSaved: 'Záloha bola uložená.',
    backupEmpty: 'Nemáš žiadne karty na zálohovanie.',
    backupFailed: 'Zálohu sa nepodarilo vytvoriť. Skús to znova.',
    restoreResult: (added: number, overwritten: number, skipped: number) =>
      `Obnovené: ${added} nových` +
      (overwritten > 0 ? `, ${overwritten} prepísaných` : '') +
      (skipped > 0 ? `, ${skipped} preskočených` : '') +
      '.',
    restoreInvalid: (count: number) => ` Poškodené karty, ktoré sa nedali obnoviť: ${count}.`,
    restoreNothing: 'V zálohe nie sú žiadne karty.',
    restoreFailed: 'Zálohu sa nepodarilo obnoviť. Skús to znova.',
    restoreErrors: {
      notJson: 'Tento súbor nie je záloha KARTUJ.',
      notKartujBackup: 'Tento súbor nie je záloha KARTUJ.',
      newerVersion: 'Záloha je z novšej verzie appky. Najprv appku aktualizuj (zatvor ju a znova otvor).',
    },
    conflictTitle: 'Niektoré karty už máš',
    conflictText: (count: number) => {
      // Slovak plural: 1 karta je, 2–4 karty sú, 5+ kariet je
      if (count === 1) return '1 karta zo zálohy už v telefóne je. Čo s ňou?'
      if (count <= 4) return `${count} karty zo zálohy už v telefóne sú. Čo s nimi?`
      return `${count} kariet zo zálohy už v telefóne je. Čo s nimi?`
    },
    conflictOverwrite: 'Prepísať verziou zo zálohy',
    conflictSkip: 'Ponechať tie v telefóne',
    installTitle: 'Inštalácia appky',
    aboutTitle: 'O aplikácii',
    version: 'Verzia',
    storage: 'Úložisko',
    storagePersistent: 'trvalé (telefón karty sám nezmaže)',
    storageBestEffort: 'bežné (pri nedostatku miesta ich telefón môže zmazať – zálohuj si ich)',
    privacy: 'Karty sa nikam neposielajú, zostávajú len v tomto zariadení.',
  },
  install: {
    bannerTitle: 'Nainštaluj si KARTUJ',
    bannerTextIos: 'Pridaj si appku na plochu – otvorí sa ako bežná aplikácia a funguje aj bez internetu.',
    bannerTextAndroid: 'Nainštaluj si appku – otvorí sa ako bežná aplikácia a funguje aj bez internetu.',
    installButton: 'Inštalovať',
    showHow: 'Ako na to?',
    dismiss: 'Teraz nie',
    installed: 'Appka je nainštalovaná. ✓',
    iosSteps: [
      'Otvor túto stránku v Safari.',
      'Ťukni na Zdieľať: na iOS 26 je v menu ⋯ (tri bodky vedľa adresy), na starších iOS je to štvorec so šípkou v dolnej lište.',
      'Vyber „Pridať na plochu“ (posuň panel nižšie), nechaj zapnuté „Otvoriť ako webovú aplikáciu“ a potvrď „Pridať“.',
      'Otváraj KARTUJ už len z ikony na ploche.',
    ],
    iosWarning:
      'Dôležité: Safari a appka na ploche majú oddelené úložiská. Karty pridané v Safari v appke na ploche neuvidíš – presunieš ich cez Zálohu a Obnovu.',
    androidSteps: [
      'Otvor túto stránku v Chrome.',
      'Ťukni na menu ⋮ vpravo hore.',
      'Vyber „Inštalovať aplikáciu“ (alebo „Pridať na plochu“).',
    ],
  },
  notFound: {
    title: 'Stránka neexistuje',
    backHome: 'Späť na karty',
  },
} as const
