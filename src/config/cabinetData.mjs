export const CABINET_CONTACT = {
  domain: "https://mansour-jerbi.com",
  phoneLandline: "+216 72 447 544",
  phoneMobile: "+216 98 317 712",
  fax: "+216 72 449 359",
  whatsappE164: "21698317712",
  email: "maitremansourjerbi@gmail.com",
  address: {
    fr: "Avenue Habib Bourguiba, 7070 Ras Jebel, Bizerte, Tunisie",
    ar: "شارع الحبيب بورقيبة، 7070 رأس الجبل، بنزرت، تونس",
    en: "Avenue Habib Bourguiba, 7070 Ras Jebel, Bizerte, Tunisia",
  },
  mapsQueryUrl:
    "https://www.google.com/maps/search/?api=1&query=Avenue+Habib+Bourguiba+7070+Ras+Jebel+Bizerte+Tunisie",
  timeSlots: ["09:00", "10:00", "11:00", "14:30", "15:30", "16:30"],
  tunisianCourts: [
    "Tribunal de Première Instance de Bizerte",
    "Justice Cantonale de Ras Jebel",
    "Cour d'Appel de Bizerte",
    "Tribunal Immobilier — Bizerte / Tunis",
    "Tribunal Administratif",
    "Cour de Cassation — Tunis",
  ],
};

export const DICTIONARIES = {
  fr: {
    dir: "ltr",
    langLabel: "Français",
    barBadge: "Ordre National des Avocats de Tunisie",
    attorneyName: "Maître Mansour Jerbi",
    cabinetTitle: "Cabinet d'Avocat & Conseil Juridique",
    nav: {
      about: "Le Cabinet",
      practices: "Domaines",
      insights: "Publications",
      faq: "Questions",
      contact: "Contact",
      bookCta: "Prendre Rendez-vous",
      staffPortal: "Espace Cabinet",
    },
    hero: {
      eyebrow: "Avocat auprès des Tribunaux — Ras Jebel, Bizerte",
      headline: "Rigueur juridique, conseil stratégique et défense engagée de vos droits.",
      subheadline:
        "Le Cabinet de Maître Mansour Jerbi accompagne les particuliers, les entreprises et les Tunisiens résidant à l'étranger en conseil préventif, rédaction d'actes et contentieux devant les juridictions tunisiennes.",
      primaryCta: "Demander une consultation",
      secondaryCta: "Découvrir nos domaines",
      pillars: [
        { label: "Siège du Cabinet", value: "Ras Jebel — Bizerte" },
        { label: "Langues de travail", value: "Arabe · Français · Anglais" },
        { label: "Secret professionnel", value: "Confidentialité absolue" },
      ],
    },
    about: {
      sectionTag: "Présentation & Valeurs",
      heading: "À propos de Maître Mansour Jerbi",
      paragraphs: [
        "Établi sur l'Avenue Habib Bourguiba à Ras Jebel (Gouvernorat de Bizerte), le Cabinet de Maître Mansour Jerbi offre une assistance juridique complète fondée sur l'écoute, l'analyse approfondie des dossiers et la maîtrise des procédures civiles, foncières, commerciales et pénales.",
        "Chaque dossier fait l'objet d'une stratégie sur mesure — privilégiant le règlement amiable et la sécurisation contractuelle lorsque cela sert au mieux les intérêts du client, et assurant une représentation ferme et méthodique devant les tribunaux compétents.",
      ],
      credentialsTitle: "Engagements & Pratique Juridique",
      credentials: [
        "Inscrit au Tableau de l'Ordre National des Avocats de Tunisie",
        "Représentation devant les juridictions civiles, commerciales, immobilières et pénales",
        "Accompagnement dédié aux Tunisiens Résidant à l'Étranger (procédures foncières, familiales et investissements)",
        "Suivi transparent des audiences, actes de procédure et conventions d'honoraires",
      ],
      values: [
        {
          title: "Confidentialité & Déontologie",
          text: "Respect strict du secret professionnel et des règles déontologiques de la profession d'avocat.",
        },
        {
          title: "Clarté & Transparence",
          text: "Information régulière sur l'avancement des procédures, les délais judiciaires et les honoraires convenus.",
        },
        {
          title: "Proximité & Réactivité",
          text: "Consultations au cabinet à Ras Jebel ou à distance par téléphone et visioconférence sur rendez-vous.",
        },
      ],
    },
    practicesSection: {
      sectionTag: "Domaines d'Intervention",
      heading: "Compétences juridiques & contentieuses",
      intro:
        "Une prise en charge rigoureuse à chaque étape : consultation juridique, mise en demeure, négociation, rédaction contractuelle et plaidoirie.",
      items: [
        {
          id: "civil",
          icon: "⚖️",
          title: "Droit Civil & Responsabilité",
          summary: "Obligations, contrats civils, recouvrement de créances et réparation des préjudices.",
          bullets: [
            "Rédaction et audit de contrats civils et reconnaissances de dette",
            "Contentieux de la responsabilité contractuelle et délictuelle",
            "Exécution des jugements et voies de recours",
          ],
        },
        {
          id: "real-estate",
          icon: "🏛️",
          title: "Droit Foncier & Immobilier",
          summary: "Immatriculation foncière, transactions immobilières, copropriété et baux.",
          bullets: [
            "Requêtes devant le Tribunal Immobilier et suivi CPF (Titre Bleu)",
            "Promesses de vente, actes définitifs et sortie d'indivision",
            "Litiges locatifs d'habitation et baux commerciaux",
          ],
        },
        {
          id: "commercial",
          icon: "💼",
          title: "Droit Commercial & Sociétés",
          summary: "Création de sociétés, fonds de commerce, contrats d'affaires et litiges commerciaux.",
          bullets: [
            "Constitution de SARL/SUARL, pactes d'associés et secrétariat juridique",
            "Cession et nantissement de fonds de commerce",
            "Recouvrement commercial, effets de commerce et procédures collectives",
          ],
        },
        {
          id: "family",
          icon: "🤝",
          title: "Droit de la Famille & Successions",
          summary: "Code du Statut Personnel, divorce, garde, pension alimentaire et partage successoral.",
          bullets: [
            "Procédures de divorce (consentement mutuel, préjudice, caprice)",
            "Liquidation de successions, héritage et représentation des TRE",
            "Exequatur des jugements étrangers en Tunisie",
          ],
        },
        {
          id: "criminal",
          icon: "🛡️",
          title: "Droit Pénal & Défense",
          summary: "Assistance dès l'enquête préliminaire, instruction, défense pénale et constitution de partie civile.",
          bullets: [
            "Assistance devant le juge d'instruction et les chambres correctionnelles",
            "Droit pénal des affaires, chèques et infractions économiques",
            "Constitution de partie civile et indemnisation des victimes",
          ],
        },
        {
          id: "labor",
          icon: "📋",
          title: "Droit du Travail & Administratif",
          summary: "Relations individuelles de travail, conseil prud'homal et recours administratifs.",
          bullets: [
            "Rédaction de contrats de travail et procédures disciplinaires",
            "Contentieux du licenciement abusif devant le Conseil de Prud'hommes",
            "Recours gracieux et contentieux devant la justice administrative",
          ],
        },
      ],
    },
    booking: {
      sectionTag: "Prise de Rendez-vous en Ligne",
      heading: "Planifier une consultation juridique",
      subtitle:
        "Votre demande est transmise directement au secrétariat du Cabinet pour confirmation rapide du créneau.",
      fields: {
        name: "Nom et prénom / Raison sociale",
        phone: "Téléphone / WhatsApp",
        email: "Adresse e-mail (optionnel)",
        practice: "Domaine concerné",
        mode: "Format de consultation",
        modes: {
          in_office: "Au Cabinet (Ras Jebel, Bizerte)",
          phone_video: "À distance (Téléphone / Visio — TRE & hors région)",
          urgent: "Urgence procédurale / Audience proche",
        },
        date: "Date souhaitée",
        slot: "Créneau horaire préféré",
        subject: "Exposé succinct et confidentiel de votre situation",
        subjectPlaceholder:
          "Décrivez brièvement l'objet de votre demande (sans joindre d'originaux sensibles à ce stade)...",
        submit: "Envoyer la demande de rendez-vous",
        confidentialityNote:
          "Toutes les informations communiquées sont protégées par le secret professionnel de l'avocat.",
      },
      confirmationTitle: "Demande enregistrée avec succès",
      confirmationText:
        "Le secrétariat du Cabinet Maître Mansour Jerbi vous contactera pour confirmer votre créneau. Conservez votre référence :",
    },
    insightsSection: {
      sectionTag: "Notes & Publications Juridiques",
      heading: "Éclairages pratiques en droit tunisien",
      subtitle: "Guides synthétiques rédigés à titre informatif pour éclairer vos démarches juridiques.",
      readMore: "Lire la note complète",
      articles: [
        {
          slug: "immatriculation-fonciere-tunisie",
          category: "Droit Foncier",
          publishedIso: "2026-10-12",
          readMinutes: 4,
          title: "Acquisition immobilière en Tunisie : les vérifications essentielles avant signature",
          excerpt:
            "Titre foncier, certificat de propriété récent, charges inscrites et vocation urbanistique : les points de contrôle indispensables.",
          body: [
            "Avant toute signature d'une promesse de vente ou d'un acte définitif portant sur un bien immobilier en Tunisie, un audit juridique préalable auprès de la Conservation de la Propriété Foncière (CPF) permet d'écarter les risques d'indivision non purgée ou d'hypothèques inscrites.",
            "Il convient notamment d'exiger un certificat de propriété récent, de vérifier la concordance entre la superficie réelle et le plan topographique, ainsi que la situation fiscale et municipale du bien.",
            "Pour les Tunisiens résidant à l'étranger ou les acquéreurs étrangers (soumis le cas échéant à l'autorisation du Gouverneur selon la vocation du terrain), l'encadrement par un avocat sécurise la rédaction des clauses suspensives et l'inscription finale du droit de propriété.",
          ],
        },
        {
          slug: "procedures-tre-distance",
          category: "Tunisiens à l'Étranger",
          publishedIso: "2026-09-24",
          readMinutes: 3,
          title: "Gérer un dossier successoral ou familial en Tunisie depuis l'étranger",
          excerpt:
            "Procuration consulaire, représentation devant les tribunaux et exequatur des décisions étrangères.",
          body: [
            "Les Tunisiens résidant à l'étranger font fréquemment face à des démarches d'indivision successorale, d'état civil ou d'exécution en Tunisie de jugements rendus à l'étranger (exequatur).",
            "Grâce à un mandat spécial légalisé auprès du Consulat de Tunisie compétent, votre avocat peut accomplir les démarches auprès des administrations, banques, recettes des finances et juridictions sans nécessiter de déplacements répétés.",
            "Le Cabinet assure un point d'étape régulier à distance (visioconférence et compte rendu écrit) à chaque audience ou acte de procédure.",
          ],
        },
        {
          slug: "contrats-commerciaux-pme",
          category: "Droit des Affaires",
          publishedIso: "2026-08-18",
          readMinutes: 4,
          title: "Sécuriser ses créances commerciales et ses contrats fournisseurs",
          excerpt:
            "Clauses de compétence, garanties de paiement et procédure d'injonction de payer devant les juridictions commerciales.",
          body: [
            "La prévention des impayés commence dès la structuration des bons de commande, conditions générales et contrats commerciaux : preuve de la livraison, pénalités de retard et clause attributive de juridiction.",
            "En cas de défaillance d'un débiteur, la mise en demeure formelle par voie d'avocat ou d'huissier notaire suivie, lorsque la créance est certaine, liquide et exigible, d'une requête en injonction de payer permet d'obtenir rapidement un titre exécutoire.",
          ],
        },
      ],
    },
    faqSection: {
      sectionTag: "Questions Fréquentes",
      heading: "Préparer votre première consultation",
      items: [
        {
          question: "Quels documents apporter lors du premier rendez-vous ?",
          answer:
            "Munissez-vous d'une pièce d'identité et de l'ensemble des pièces liées à votre dossier (contrats, convocations, jugements antérieurs, correspondances, certificats de propriété ou relevés chronologiques des faits).",
        },
        {
          question: "Comment sont fixés les honoraires du Cabinet ?",
          answer:
            "Les honoraires sont déterminés en toute transparence dès l'ouverture du dossier selon la nature et la complexité de l'affaire (forfait de procédure, convention au temps passé ou honoraire complémentaire de résultat conformément à la loi régissant la profession d'avocat).",
        },
        {
          question: "Proposez-vous des consultations à distance pour les clients résidant à l'étranger ?",
          answer:
            "Oui. Le Cabinet organise des consultations sur rendez-vous par téléphone ou visioconférence en français, arabe ou anglais pour les Tunisiens résidant à l'étranger et les entreprises internationales.",
        },
        {
          question: "Puis-je suivre l'état d'avancement de mon dossier ?",
          answer:
            "Chaque dossier reçoit une référence unique au Cabinet. Vous êtes informé de chaque date d'audience, échange de conclusions et décision rendue.",
        },
      ],
    },
    contactSection: {
      sectionTag: "Coordonnées & Accès",
      heading: "Contacter le Cabinet à Ras Jebel",
      hoursTitle: "Horaires de réception (sur rendez-vous)",
      hoursLines: [
        "Lundi – Vendredi : 08h30 – 17h30",
        "Samedi : 09h00 – 13h00",
        "Dimanche : Fermé",
      ],
      phoneLabel: "Téléphone fixe",
      mobileLabel: "Mobile",
      whatsappLabel: "WhatsApp Direct",
      emailLabel: "Courriel professionnel",
      mapButton: "Ouvrir l'itinéraire Google Maps",
    },
    avatar: {
      fabLabel: "Assistant du Cabinet",
      badge: "Préparation Avatar IA",
      drawerTitle: "Assistant d'Orientation du Cabinet",
      drawerSubtitle: "Architecture prête pour l'Avatar Interactif (Voix & Vidéo)",
      stageStatus: "Module Avatar WebRTC prêt à connecter (/api/avatar/session)",
      stageCaption:
        "En attendant l'activation vidéo en direct de l'avatar, sélectionnez une question pratique d'orientation ci-dessous :",
      disclaimer:
        "Information générale d'accueil uniquement — ne constitue pas un avis juridique personnalisé.",
      quickPrompts: [
        {
          label: "Quels documents préparer pour un dossier foncier ?",
          reply:
            "Pour un dossier immobilier ou foncier, prévoyez : copie de la CIN, certificat de propriété récent (CPF), contrat ou promesse existante, plan topographique et dernier reçu de taxe municipale.",
        },
        {
          label: "Comment réserver une consultation urgente ?",
          reply:
            "Utilisez le formulaire de rendez-vous en sélectionnant « Urgence procédurale » ou appelez directement le Cabinet au +216 72 447 544 / +216 98 317 712 en précisant la date d'audience.",
        },
        {
          label: "Je réside à l'étranger, comment mandater Maître Jerbi ?",
          reply:
            "Nous pouvons démarrer par une consultation téléphonique ou vidéo, puis vous transmettre le modèle exact de procuration à légaliser auprès du Consulat de Tunisie de votre pays de résidence.",
        },
      ],
      bookRedirect: "Aller au formulaire de rendez-vous",
    },
    footer: {
      rights: "© 2026 Cabinet Maître Mansour Jerbi — Tous droits réservés.",
      ethicsNote:
        "Site d'information professionnelle conforme aux règles déontologiques de l'Ordre National des Avocats de Tunisie.",
    },
  },

  ar: {
    dir: "rtl",
    langLabel: "العربية",
    barBadge: "الهيئة الوطنية للمحامين بتونس",
    attorneyName: "الأستاذ منصور الجربي",
    cabinetTitle: "مكتب محاماة واستشارات قانونية",
    nav: {
      about: "عن المكتب",
      practices: "الاختصاصات",
      insights: "إضاءات قانونية",
      faq: "أسئلة شائعة",
      contact: "الاتصال",
      bookCta: "حجز موعد",
      staffPortal: "فضاء المكتب",
    },
    hero: {
      eyebrow: "محامٍ لدى المحاكم — رأس الجبل، بنزرت",
      headline: "دقة قانونية، استشارة رصينة ودفاع أمين عن حقوقكم ومصالحكم.",
      subheadline:
        "يواكب مكتب الأستاذ منصور الجربي الأفراد والمؤسسات والتونسيين المقيمين بالخارج في الاستشارات القانونية، صياغة العقود، والنيابة والترافع أمام مختلف المحاكم التونسية.",
      primaryCta: "طلب موعد استشارة",
      secondaryCta: "استعراض مجالات الاختصاص",
      pillars: [
        { label: "مقر المكتب", value: "رأس الجبل — بنزرت" },
        { label: "لغات العمل", value: "العربية · الفرنسية · الإنجليزية" },
        { label: "السر المهني", value: "سرية تامة للملفات" },
      ],
    },
    about: {
      sectionTag: "التعريف بالمكتب والقيم المهنية",
      heading: "نبذة عن مكتب الأستاذ منصور الجربي",
      paragraphs: [
        "يقع مكتب الأستاذ منصور الجربي بشارع الحبيب بورقيبة برأس الجبل (ولاية بنزرت)، ويقدّم خدمات قانونية وقضائية متكاملة ترتكز على الدراسة المتأنية للملفات والإلمام الدقيق بالإجراءات المدنية والعقارية والتجارية والجزائية.",
        "يحظى كل ملف بمعالجة خاصة تراعي مصلحة المنوّب، سواء عبر التسوية الصلحية وتأمين العقود الوقائية أو عبر الترافع الجاد والمتابعة الحثيثة أمام الهيئات القضائية المختصة.",
      ],
      credentialsTitle: "الالتزامات والممارسة المهنية",
      credentials: [
        "مرسّم بجدول الهيئة الوطنية للمحامين بتونس",
        "النيابة والترافع أمام المحاكم المدنية والتجارية والعقارية والجزائية",
        "مواكبة خاصة للتونسيين المقيمين بالخارج في القضايا العقارية والعائلية والاستثمارية",
        "متابعة شفافة ومنتظمة لمواعيد الجلسات والإجراءات والاتفاقيات المالية",
      ],
      values: [
        {
          title: "السرية وأخلاقيات المهنة",
          text: "التزام صارم بالسر المهني وبأخلاقيات رسالة المحاماة في حفظ أسرار المنوّبين.",
        },
        {
          title: "الوضوح والشفافية",
          text: "إحاطة المنوّب علماً بمسار الملف والآجال القانونية وتفاصيل الأتعاب منذ البداية.",
        },
        {
          title: "القرب وسرعة التفاعل",
          text: "استقبال بالمكتب برأس الجبل أو استشارات عن بُعد عبر الهاتف والفيديو بموعد مسبق.",
        },
      ],
    },
    practicesSection: {
      sectionTag: "مجالات التدخل القانوني والقضائي",
      heading: "الاختصاصات والخدمات القانونية",
      intro:
        "مرافقة شاملة في جميع المراحل: الاستشارة القانونية، التنابيه الرسمية، التفاوض، تحرير العقود والترافع أمام المحاكم.",
      items: [
        {
          id: "civil",
          icon: "⚖️",
          title: "القانون المدني والعقود",
          summary: "الالتزامات والعقود المدنية، استخلاص الديون ودعاوى المسؤولية والتعويض.",
          bullets: [
            "صياغة ومراجعة العقود المدنية والاعترافات بالدين",
            "قضايا المسؤولية العقدية والتقصيرية وجبر الضرر",
            "تنفيذ الأحكام القضائية وطرق الطعن القانونية",
          ],
        },
        {
          id: "real-estate",
          icon: "🏛️",
          title: "القانون العقاري والملكية",
          summary: "التسجيل العقاري، البيوعات العقارية، الخروج من الشياع والأكرية.",
          bullets: [
            "مطالب التسجيل لدى المحكمة العقارية ومتابعة إدارة الملكية العقارية",
            "تحرير وعود البيع والعقود النهائية وقسمة العقارات المشتركة",
            "نزاعات الأكرية السكنية والتجارية واسترجاع المحلات",
          ],
        },
        {
          id: "commercial",
          icon: "💼",
          title: "القانون التجاري والشركات",
          summary: "تأسيس الشركات، الأصول التجارية، العقود التجارية والنزاعات بين المؤسسات.",
          bullets: [
            "تأسيس الشركات ومحاضر الجلسات ومرافقة المسيرين قانونياً",
            "التفويت في الأصل التجاري ورهنه وحماية الملكية التجارية",
            "الأذون بالدفع واستخلاص الديون التجارية والأوراق التجارية",
          ],
        },
        {
          id: "family",
          icon: "🤝",
          title: "الأحوال الشخصية والأسرة والميراث",
          summary: "قضايا الطلاق، الحضانة، النفقة، تصفية التركات وإكساء الأحكام الأجنبية بالصيغة التنفيذية.",
          bullets: [
            "قضايا الطلاق بمختلف أنواعه وتقدير النفقة والحضانة",
            "حصر الإرث وقسمة التركات ونيابة التونسيين بالخارج",
            "إكساء الأحكام الأجنبية الصادرة بالخارج بالصيغة التنفيذية بتونس",
          ],
        },
        {
          id: "criminal",
          icon: "🛡️",
          title: "القانون الجزائي والدفاع",
          summary: "الحضور مع المنوّب في طور البحث والتحقيق والترافع أمام الدوائر الجزائية.",
          bullets: [
            "المؤازرة أمام باحث البداية وقاضي التحقيق والدوائر الجناحية والجنائية",
            "الجرائم المالية والاقتصادية وقضايا الشيكات",
            "القيام بالحق الشخصي وطلب التعويض للمتضررين",
          ],
        },
        {
          id: "labor",
          icon: "📋",
          title: "قانون الشغل والنزاعات الإدارية",
          summary: "عقود الشغل، القضايا الشغلية أمام دوائر الشغل، والطعون الإدارية.",
          bullets: [
            "صياغة عقود الشغل ومرافقة المؤسسات والأجراء",
            "نزاعات الطرد التعسفي والمستحقات الشغلية",
            "التظلمات الإدارية ودعاوى تجاوز السلطة والتعويض الإداري",
          ],
        },
      ],
    },
    booking: {
      sectionTag: "حجز موعد عبر الموقع",
      heading: "طلب موعد استشارة قانونية",
      subtitle: "تُحال طلبات المواعيد مباشرةً إلى كتابة المكتب لتأكيد الموعد المناسب لكم في أقرب الآجال.",
      fields: {
        name: "الاسم واللقب / اسم المؤسسة",
        phone: "رقم الهاتف / واتساب",
        email: "البريد الإلكتروني (اختياري)",
        practice: "المجال القانوني",
        mode: "صيغة الاستشارة",
        modes: {
          in_office: "حضورياً بالمكتب (رأس الجبل، بنزرت)",
          phone_video: "عن بُعد (هاتف / فيديو — للمقيمين بالخارج أو خارج الجهة)",
          urgent: "استشارة مستعجلة / جلسة قريبة",
        },
        date: "التاريخ المفضّل",
        slot: "التوقيت المفضّل",
        subject: "ملخّص موجز وسرّي لموضوع الاستشارة",
        subjectPlaceholder: "يرجى ذكر لمحة موجزة عن موضوع الملف أو الإشكال القانوني...",
        submit: "إرسال طلب الموعد",
        confidentialityNote: "جميع المعطيات المرسلة مشمولة بالسر المهني للمحامي.",
      },
      confirmationTitle: "تم تسجيل طلب الموعد بنجاح",
      confirmationText:
        "سيتصل بكم مكتب الأستاذ منصور الجربي لتأكيد الموعد النهائي. يرجى الاحتفاظ برمز المتابعة:",
    },
    insightsSection: {
      sectionTag: "إضاءات ومقالات قانونية",
      heading: "توجيهات عملية في القانون التونسي",
      subtitle: "مذكرات توعوية مبسّطة لتوضيح أهم الإجراءات والضمانات القانونية.",
      readMore: "قراءة المقال كاملاً",
      articles: [
        {
          slug: "immatriculation-fonciere-tunisie",
          category: "القانون العقاري",
          publishedIso: "2026-10-12",
          readMinutes: 4,
          title: "شراء عقار في تونس: التثبتات القانونية الضرورية قبل إمضاء العقد",
          excerpt:
            "شهادة الملكية الحديثة، التحملات المرسمة، الوضعية الجبائية ومطابقة المثال الهندسي.",
          body: [
            "قبل إمضاء وعد البيع أو العقد النهائي لاقتناء عقار بتونس، يُنصح بإجراء تدقيق قانوني لدى إدارة الملكية العقارية للتثبت من خلوّ الرسم العقاري من الرهون أو الاعتراضات أو حالات الشياع غير المصفّاة.",
            "كما يتعيّن الاطلاع على شهادة ملكية حديثة العهد، ومطابقة المساحة والحدود، والتثبت من الوضعية البلدية والجبائية للعقار.",
            "ويضمن تدخل المحامي صياغة الشروط التعليقية والضمانات الكفيلة بحفظ حقوق المشتري والبائع حتى تمام الترسيم.",
          ],
        },
        {
          slug: "procedures-tre-distance",
          category: "التونسيون بالخارج",
          publishedIso: "2026-09-24",
          readMinutes: 3,
          title: "متابعة الملفات العقارية والعائلية بتونس لفائدة المقيمين بالخارج",
          excerpt: "التوكيل القنصلي، النيابة أمام المحاكم وإكساء الأحكام الأجنبية بالصيغة التنفيذية.",
          body: [
            "يحتاج العديد من التونسيين المقيمين بالخارج إلى تسوية ملفات إرثية أو عقارية أو استصدار قرارات إكساء بالصيغة التنفيذية لأحكام صادرة بالخارج دون عناء التنقل المتكرر.",
            "بموجب توكيل خاص مصادق عليه لدى القنصلية التونسية، يتولى المحامي القيام بكافة الإجراءات القانونية والإدارية والقضائية مع موافاة المنوّب بتقارير دورية عن بُعد.",
          ],
        },
        {
          slug: "contrats-commerciaux-pme",
          category: "قانون الأعمال",
          publishedIso: "2026-08-18",
          readMinutes: 4,
          title: "حماية الديون التجارية وصياغة عقود التزويد للمؤسسات",
          excerpt: "شروط الدفع، إثبات المعاملات التجارية ومسطرة الأمر بالدفع السريعة.",
          body: [
            "تبدأ الوقاية من النزاعات التجارية بضبط وصولات التسليم والفواتير والعقود التجارية بصفة محكمة تثبت قيام الدين وحلول أجله.",
            "وعند التلدد في الخلاص، يتيح توجيه تنبيه رسمي ثم استصدار أمر بالدفع أمام القضاء التجاري الحصول على سند تنفيذي ناجع لحفظ السيولة المالية للمؤسسة.",
          ],
        },
      ],
    },
    faqSection: {
      sectionTag: "أسئلة متداولة",
      heading: "معلومات مفيدة قبل الاستشارة الأولى",
      items: [
        {
          question: "ما هي الوثائق التي يُستحسن إحضارها في الموعد الأول؟",
          answer:
            "يُرجى إحضار بطاقة التعريف الوطنية ونسخ من كافة الوثائق المتعلقة بالملف (العقود، الاستدعاءات، الأحكام السابقة، شهادات الملكية أو المراسلات ذات الصلة).",
        },
        {
          question: "كيف يتم تحديد أتعاب المحاماة؟",
          answer:
            "تُضبط الأتعاب بكل وضوح وشفافية بالاتفاق مع المنوّب عند فتح الملف، وذلك بحسب طبيعة القضية والجهد الإجرائي المستوجب طبقاً للتشريع المنظّم لمهنة المحاماة.",
        },
        {
          question: "هل يقدّم المكتب استشارات عن بُعد للمقيمين بالخارج؟",
          answer:
            "نعم، يوفّر المكتب استشارات عبر الهاتف أو الفيديو بموعد مسبق باللغات العربية والفرنسية والإنجليزية لفائدة التونسيين بالخارج والشركات.",
        },
        {
          question: "كيف أتابع مآل الجلسات وتقدّم ملفي؟",
          answer:
            "يُسند لكل ملف رمز مرجعي خاص بمنظومة المكتب، ويتم إعلامكم بمواعيد الجلسات والتقارير المقدمة والأحكام الصادرة بانتظام.",
        },
      ],
    },
    contactSection: {
      sectionTag: "العنوان ووسائل الاتصال",
      heading: "تواصلوا مع المكتب برأس الجبل",
      hoursTitle: "أوقات العمل والاستقبال (بموعد مسبق)",
      hoursLines: [
        "الاثنين – الجمعة : 08:30 – 17:30",
        "السبت : 09:00 – 13:00",
        "الأحد : مغلق",
      ],
      phoneLabel: "الهاتف القار",
      mobileLabel: "الجوّال",
      whatsappLabel: "تواصل عبر واتساب",
      emailLabel: "البريد الإلكتروني",
      mapButton: "فتح الموقع على خرائط Google",
    },
    avatar: {
      fabLabel: "المساعد الافتراضي",
      badge: "جاهزية الأفاتار الذكي",
      drawerTitle: "مساعد الاستقبال والتوجيه للمكتب",
      drawerSubtitle: "واجهة مهيّأة للربط مع الأفاتار التفاعلي بالصوت والصورة",
      stageStatus: "وحدة البث التفاعلي WebRTC جاهزة للربط البرمجي (/api/avatar/session)",
      stageCaption: "إلى حين تفعيل الأفاتار المرئي المباشر، يمكنكم اختيار أحد الأسئلة التوجيهية السريعة:",
      disclaimer: "معلومات توجيهية عامة للاستقبال فقط ولا تُعوّض الاستشارة القانونية المباشرة مع المحامي.",
      quickPrompts: [
        {
          label: "ما الوثائق المطلوبة لملف عقاري؟",
          reply:
            "لملف عقاري، يُستحسن تحضير نسخة من بطاقة التعريف، شهادة ملكية حديثة أو عقد الشراء، المثال الهندسي إن وجد، وآخر وصل للأداء البلدي.",
        },
        {
          label: "عندي جلسة قريبة، كيف أحجز موعداً مستعجلاً؟",
          reply:
            "يمكنكم اختيار «استشارة مستعجلة» في استمارة حجز الموعد أو الاتصال مباشرةً بالمكتب على الرقم +216 72 447 544 أو +216 98 317 712 مع ذكر تاريخ الجلسة.",
        },
        {
          label: "أنا مقيم بالخارج، كيف أوكّل الأستاذ منصور الجربي؟",
          reply:
            "نبدأ باستشارة هاتفية أو مرئية لدراسة الملف، ثم نرسل لكم صيغة التوكيل المناسبة للمصادقة عليها لدى القنصلية التونسية ببلد إقامتكم.",
        },
      ],
      bookRedirect: "الانتقال إلى استمارة حجز الموعد",
    },
    footer: {
      rights: "© 2026 مكتب الأستاذ منصور الجربي للمحاماة — جميع الحقوق محفوظة.",
      ethicsNote: "موقع تعريفي مهني يحترم قواعد وأخلاقيات الهيئة الوطنية للمحامين بتونس.",
    },
  },

  en: {
    dir: "ltr",
    langLabel: "English",
    barBadge: "National Bar Association of Tunisia",
    attorneyName: "Maître Mansour Jerbi",
    cabinetTitle: "Law Office & Legal Counsel",
    nav: {
      about: "The Firm",
      practices: "Practice Areas",
      insights: "Insights",
      faq: "FAQ",
      contact: "Contact",
      bookCta: "Book Consultation",
      staffPortal: "Office Portal",
    },
    hero: {
      eyebrow: "Attorney-at-Law — Ras Jebel, Bizerte, Tunisia",
      headline: "Principled legal counsel, strategic clarity, and steadfast advocacy.",
      subheadline:
        "The Law Office of Maître Mansour Jerbi advises individuals, businesses, and Tunisian expatriates across civil, real estate, commercial, family, and criminal matters before Tunisian courts.",
      primaryCta: "Schedule a Consultation",
      secondaryCta: "Explore Practice Areas",
      pillars: [
        { label: "Office Location", value: "Ras Jebel — Bizerte" },
        { label: "Working Languages", value: "Arabic · French · English" },
        { label: "Attorney-Client Privilege", value: "Strict Confidentiality" },
      ],
    },
    about: {
      sectionTag: "Firm Profile & Standards",
      heading: "About Maître Mansour Jerbi",
      paragraphs: [
        "Located on Avenue Habib Bourguiba in Ras Jebel (Bizerte Governorate), the Law Office of Maître Mansour Jerbi delivers thorough legal representation grounded in careful case preparation, procedural precision, and direct attorney involvement.",
        "Whether structuring real estate and corporate transactions, resolving family or inheritance matters for clients abroad, or litigating complex disputes before Tunisian courts, every mandate receives a clear strategy and transparent communication.",
      ],
      credentialsTitle: "Qualifications & Scope of Practice",
      credentials: [
        "Member of the National Bar Association of Tunisia (Ordre National des Avocats de Tunisie)",
        "Litigation and counsel across civil, real estate, commercial, family, and criminal courts",
        "Dedicated remote representation for Tunisians residing abroad and international investors",
        "Structured case tracking, hearing updates, and transparent fee agreements",
      ],
      values: [
        {
          title: "Confidentiality & Ethics",
          text: "Unwavering adherence to Tunisian Bar ethics and strict attorney-client privilege.",
        },
        {
          title: "Clarity & Transparency",
          text: "Clear explanations of procedural options, realistic timelines, and agreed fee structures.",
        },
        {
          title: "Accessible Counsel",
          text: "In-office appointments in Ras Jebel as well as phone and video consultations worldwide.",
        },
      ],
    },
    practicesSection: {
      sectionTag: "Practice Areas",
      heading: "Comprehensive Legal Representation",
      intro:
        "End-to-end legal support from preventive advisory and contract drafting to pre-litigation negotiation and courtroom advocacy.",
      items: [
        {
          id: "civil",
          icon: "⚖️",
          title: "Civil Law & Contracts",
          summary: "Contract drafting, civil liability claims, debt recovery, and judgment enforcement.",
          bullets: [
            "Drafting and review of civil agreements and acknowledgments of debt",
            "Contractual and tort liability litigation",
            "Enforcement of court judgments and appellate proceedings",
          ],
        },
        {
          id: "real-estate",
          icon: "🏛️",
          title: "Real Estate & Property Law",
          summary: "Land title registration, property acquisitions, co-ownership division, and leases.",
          bullets: [
            "Land Court petitions and Property Registry (CPF / Blue Title) due diligence",
            "Sale-purchase agreements, title transfers, and partition of joint property",
            "Residential and commercial lease disputes",
          ],
        },
        {
          id: "commercial",
          icon: "💼",
          title: "Commercial & Corporate Law",
          summary: "Company formation, commercial contracts, business goodwill transfers, and disputes.",
          bullets: [
            "Incorporation of Tunisian LLCs (SARL/SUARL) and corporate governance",
            "Sale and pledge of business assets (fonds de commerce)",
            "Commercial debt collection and payment-order proceedings",
          ],
        },
        {
          id: "family",
          icon: "🤝",
          title: "Family & Inheritance Law",
          summary: "Personal status proceedings, divorce, custody, estates, and cross-border recognition.",
          bullets: [
            "Divorce, child custody, and alimony proceedings under Tunisian law",
            "Estate administration, succession division, and expatriate representation",
            "Recognition and enforcement (exequatur) of foreign court judgments in Tunisia",
          ],
        },
        {
          id: "criminal",
          icon: "🛡️",
          title: "Criminal Defense & Litigation",
          summary: "Representation during preliminary inquiries, judicial investigation, and trial courts.",
          bullets: [
            "Defense before investigating magistrates and criminal chambers",
            "White-collar, financial, and commercial check offenses",
            "Civil party representation (partie civile) and victim compensation",
          ],
        },
        {
          id: "labor",
          icon: "📋",
          title: "Labor & Administrative Law",
          summary: "Employment contracts, wrongful termination claims, and administrative appeals.",
          bullets: [
            "Employment agreements, compliance, and disciplinary procedures",
            "Representation before Labor Boards (Conseil de Prud'hommes)",
            "Administrative petitions and judicial review",
          ],
        },
      ],
    },
    booking: {
      sectionTag: "Online Appointment Request",
      heading: "Book a Legal Consultation",
      subtitle:
        "Requests flow directly into our Office Management system for prompt confirmation by the secretariat.",
      fields: {
        name: "Full Name / Company Name",
        phone: "Phone / WhatsApp Number",
        email: "Email Address (optional)",
        practice: "Legal Area",
        mode: "Consultation Format",
        modes: {
          in_office: "In-Office (Ras Jebel, Bizerte)",
          phone_video: "Remote (Phone / Video — Abroad & Out of Region)",
          urgent: "Urgent Procedural Deadline / Upcoming Hearing",
        },
        date: "Preferred Date",
        slot: "Preferred Time Slot",
        subject: "Brief Confidential Summary",
        subjectPlaceholder:
          "Briefly describe the nature of your inquiry so Maître Jerbi can prepare for your consultation...",
        submit: "Submit Consultation Request",
        confidentialityNote:
          "All submitted details are strictly protected by attorney-client confidentiality.",
      },
      confirmationTitle: "Consultation Request Received",
      confirmationText:
        "The secretariat of Maître Mansour Jerbi will contact you shortly to confirm your slot. Please keep your booking reference:",
    },
    insightsSection: {
      sectionTag: "Legal Insights & Notes",
      heading: "Practical Guidance on Tunisian Law",
      subtitle: "Concise informational briefings prepared by the Firm on common legal questions.",
      readMore: "Read full briefing",
      articles: [
        {
          slug: "immatriculation-fonciere-tunisie",
          category: "Property Law",
          publishedIso: "2026-10-12",
          readMinutes: 4,
          title: "Buying Property in Tunisia: Essential Legal Due Diligence Before Signing",
          excerpt:
            "Title registry checks, encumbrances, survey boundaries, and Governor authorization rules explained.",
          body: [
            "Before signing a preliminary sale agreement or final deed in Tunisia, conducting formal due diligence with the Land Property Registry (Conservation de la Propriété Foncière) is vital to uncover mortgages, liens, or unresolved co-ownership claims.",
            "Buyers should obtain a recent ownership certificate, verify boundary alignment with official survey plans, and confirm municipal tax clearance.",
            "For expatriates or foreign buyers (where Governor authorization may apply depending on land zoning), legal counsel ensures protective conditions precedent and proper registration.",
          ],
        },
        {
          slug: "procedures-tre-distance",
          category: "Clients Abroad",
          publishedIso: "2026-09-24",
          readMinutes: 3,
          title: "Handling Inheritance, Property, or Family Cases in Tunisia from Abroad",
          excerpt:
            "How consular powers of attorney and remote legal representation avoid repeated international travel.",
          body: [
            "Tunisian citizens and international clients living abroad frequently need to settle estate partitions, property transfers, or enforce foreign divorce/civil judgments (exequatur) in Tunisia.",
            "With a tailored power of attorney legalized at the nearest Tunisian Consulate, your attorney can represent you before courts, land registries, and tax authorities while keeping you updated via video calls and written milestone reports.",
          ],
        },
        {
          slug: "contrats-commerciaux-pme",
          category: "Commercial Law",
          publishedIso: "2026-08-18",
          readMinutes: 4,
          title: "Protecting Commercial Receivables and Supplier Agreements in Tunisia",
          excerpt:
            "Structuring delivery proof, jurisdiction clauses, and fast-track payment orders.",
          body: [
            "Preventing unpaid commercial invoices starts with well-documented purchase orders, signed delivery receipts, and clear jurisdiction and default clauses.",
            "When a commercial receivable is certain, liquid, and due, serving formal notice followed by a fast-track judicial payment order petition (injonction de payer) provides an effective path to an enforceable title.",
          ],
        },
      ],
    },
    faqSection: {
      sectionTag: "Frequently Asked Questions",
      heading: "Preparing for Your Consultation",
      items: [
        {
          question: "What documents should I bring to my first appointment?",
          answer:
            "Please bring valid identification along with copies of any contracts, court summonses, prior judgments, land certificates, or written correspondence relevant to your matter.",
        },
        {
          question: "How are legal fees structured?",
          answer:
            "Legal fees are discussed transparently at the outset based on the complexity and nature of the mandate (fixed procedural fee, retainer agreement, or statutory success supplement in compliance with Tunisian Bar rules).",
        },
        {
          question: "Do you offer remote consultations for clients living outside Tunisia?",
          answer:
            "Yes. We schedule phone and video consultations in Arabic, French, and English for Tunisians residing abroad and international corporate clients.",
        },
        {
          question: "How will I receive updates on my case?",
          answer:
            "Every mandate is assigned a dedicated dossier reference in our office management system, with proactive updates ahead of and following each court hearing or procedural filing.",
        },
      ],
    },
    contactSection: {
      sectionTag: "Location & Direct Contact",
      heading: "Visit or Contact the Firm in Ras Jebel",
      hoursTitle: "Office Hours (By Appointment)",
      hoursLines: [
        "Monday – Friday: 08:30 – 17:30",
        "Saturday: 09:00 – 13:00",
        "Sunday: Closed",
      ],
      phoneLabel: "Office Landline",
      mobileLabel: "Mobile",
      whatsappLabel: "Direct WhatsApp",
      emailLabel: "Email",
      mapButton: "Open Directions in Google Maps",
    },
    avatar: {
      fabLabel: "Firm AI Assistant",
      badge: "AI Avatar Ready",
      drawerTitle: "Cabinet Intake & Orientation Assistant",
      drawerSubtitle: "Pre-wired for Real-Time Interactive Voice/Video Avatar",
      stageStatus: "WebRTC Avatar Hook Ready (/api/avatar/session)",
      stageCaption:
        "While live video avatar streaming is in standby mode, choose a quick orientation topic below:",
      disclaimer:
        "General intake orientation only — does not constitute formal legal advice.",
      quickPrompts: [
        {
          label: "Which documents should I prepare for a property matter?",
          reply:
            "For real estate or land matters, please gather: ID copy, a recent CPF ownership certificate, any sale agreement or deed, survey plan, and latest municipal tax receipt.",
        },
        {
          label: "How do I request an urgent hearing consultation?",
          reply:
            "Select 'Urgent Procedural Deadline' in the online booking form or call the Firm directly at +216 72 447 544 / +216 98 317 712 with your court date.",
        },
        {
          label: "I live abroad — how can Maître Jerbi represent me?",
          reply:
            "We start with a remote phone or video consultation, then provide a customized Power of Attorney template for legalization at your local Tunisian Consulate.",
        },
      ],
      bookRedirect: "Jump to Consultation Booking Form",
    },
    footer: {
      rights: "© 2026 Law Office of Maître Mansour Jerbi — All rights reserved.",
      ethicsNote:
        "Professional information website compliant with the ethical standards of the National Bar Association of Tunisia.",
    },
  },
};
