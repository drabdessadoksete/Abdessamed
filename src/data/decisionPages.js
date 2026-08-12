// High-intent decision pages: someone comparing options, checking coverage or weighing a
// devis, rather than browsing. These are service pages (not blog guides), so they are not
// gated behind the editorial medical-review flag.
//
// Deontology guardrails for anything added here (décret n° 2020-1658, art. R.4127-215 CSP):
// no testimonials, no comparison with other practices, no promotional framing, no
// guaranteed outcomes, and no invented tarifs — a devis follows an examination.

const makeDecisionPage = ({
  slug,
  cluster = 'implantologie',
  // 'locals' triggers the standard disclosure making clear the cabinet is in Sète and the
  // page is not a secondary address.
  menuGroup,
  menuLabel,
  badge,
  title,
  description,
  h1,
  intro,
  highlights,
  sections,
  faq,
  ctaTitle,
  ctaText,
  links = [],
}) => ({
  url: `/${slug}/`,
  path: slug,
  cluster,
  menuGroup: menuGroup || (cluster === 'implantologie' ? 'Implantologie' : 'Orthodontie invisible'),
  menuLabel,
  menuDescription: description,
  badge,
  title,
  metaDescription: description,
  h1,
  intro,
  highlights,
  articleBody: null,
  sections,
  faq,
  ctaTitle,
  ctaText,
  ctaLabel: 'Demander un pré-rendez-vous',
  ctaHref: `/pre-rendez-vous/?specialite=${cluster === 'implantologie' ? 'implantologie' : 'orthodontie'}`,
  internalLinks: links,
  keywords: [],
})

const implantDecisionPages = [
  makeDecisionPage({
    slug: 'prix-implant-dentaire-sete',
    menuLabel: 'Prix d’un implant à Sète',
    badge: 'Décider · Implantologie',
    title: 'Prix d’un implant dentaire à Sète | Devis',
    description: 'Prix d’un implant dentaire à Sète : ce que contient un devis implantaire, les éléments qui le font varier et les vérifications à faire avant de décider.',
    h1: 'Prix d’un implant dentaire à Sète : devis et prise en charge',
    intro: 'Il n’existe pas de prix unique pour un implant dentaire. Le devis dépend du nombre de dents concernées, des soins préalables, du type de restauration et des étapes réellement nécessaires dans votre situation.',
    highlights: [
      'Un devis écrit et détaillé vous est remis après examen, jamais avant',
      'Le montant recouvre plusieurs actes distincts : chirurgie, pièces prothétiques et couronne',
      'Aucune estimation fiable ne peut être donnée par téléphone ou à partir d’une photo',
    ],
    sections: [
      {
        heading: 'Pourquoi aucun prix ne peut être annoncé à l’avance',
        blocks: [
          {
            subheading: 'Un devis répond à une situation, pas à une moyenne',
            paragraphs: [
              'Deux personnes venues pour « une dent manquante » peuvent recevoir des devis très différents. L’écart ne vient pas d’une tarification variable, mais du fait que le travail à réaliser n’est pas le même : état de la gencive, volume osseux, dents voisines, occlusion et soins à prévoir avant la chirurgie.',
              'C’est la raison pour laquelle le cabinet n’annonce pas de tarif au téléphone. Un chiffre donné sans examen n’engagerait rien et risquerait surtout de fausser votre décision.',
            ],
          },
          {
            subheading: 'Ce qui fait varier le montant',
            bullets: [
              'Le nombre d’implants à poser, qui ne correspond pas toujours au nombre de dents absentes.',
              'Les soins préalables éventuels : traitement d’une gencive inflammatoire, extraction, assainissement.',
              'La nécessité ou non d’une greffe osseuse ou d’un aménagement des tissus.',
              'Le type de restauration finale : couronne unitaire, bridge sur implants ou prothèse stabilisée.',
              'Les examens d’imagerie indiqués pour la planification.',
              'Le nombre de rendez-vous de suivi jusqu’à la pose de la restauration définitive.',
            ],
          },
        ],
      },
      {
        heading: 'Ce que doit contenir un devis implantaire',
        blocks: [
          {
            subheading: 'Un document écrit, détaillé et remis avant tout engagement',
            paragraphs: [
              'Le devis est obligatoire et vous est remis pour que vous puissiez y réfléchir. Il n’est pas un bon de commande à signer sur place : vous pouvez repartir avec, le relire et poser vos questions lors d’un rendez-vous suivant.',
              'Il distingue les actes les uns des autres, ce qui permet de comprendre à quoi correspond chaque ligne plutôt que de lire un total global.',
            ],
            bullets: [
              'La description de chaque acte prévu et son montant.',
              'La base de remboursement de l’Assurance Maladie lorsqu’elle existe, et son absence lorsqu’il n’y en a pas.',
              'La référence du dispositif implantaire envisagé.',
              'Ce qui reste à votre charge, avant intervention de votre complémentaire.',
            ],
          },
          {
            subheading: 'Les questions qu’il est légitime de poser',
            bullets: [
              'Que se passe-t-il si une étape supplémentaire s’avère nécessaire en cours de traitement ?',
              'Le devis couvre-t-il la couronne définitive ou seulement la phase chirurgicale ?',
              'Quels contrôles sont compris après la pose ?',
              'Quelles seraient les conséquences financières d’un report ou d’un arrêt du projet ?',
            ],
          },
        ],
      },
      {
        heading: 'Prise en charge : ce qu’il faut vérifier',
        blocks: [{
          subheading: 'L’implant et la couronne ne relèvent pas des mêmes règles',
          paragraphs: [
            'L’implant lui-même n’est pas pris en charge par l’Assurance Maladie dans le cadre courant. Certaines situations particulières font l’objet de dispositions spécifiques, ce qui se vérifie au cas par cas.',
            'Les garanties des complémentaires santé varient fortement d’un contrat à l’autre, avec parfois un forfait annuel ou un plafond. Le devis est le document à transmettre à votre organisme pour obtenir une réponse chiffrée qui vous concerne.',
          ],
        }],
      },
      {
        heading: 'Étaler le coût dans le temps',
        blocks: [{
          subheading: 'Un parcours qui se déroule sur plusieurs mois',
          paragraphs: [
            'Un traitement implantaire comporte des étapes espacées par la cicatrisation. Les règlements suivent généralement ces étapes plutôt que d’intervenir en une seule fois, ce qui peut être précisé lors de la remise du devis.',
            'Si le projet concerne plusieurs dents, il est parfois possible de le séquencer et de traiter d’abord ce qui est prioritaire sur le plan fonctionnel. Cette question se discute au moment de la planification.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'Pouvez-vous me donner un prix par téléphone ?', answer: 'Non. Le cabinet peut expliquer comment un devis se construit, mais un montant fiable suppose un examen clinique et une planification. Un chiffre donné sans examen serait trompeur.' },
      { question: 'Le devis engage-t-il à commencer le traitement ?', answer: 'Non. Le devis vous est remis pour information et réflexion. Vous pouvez le conserver, le transmettre à votre complémentaire et décider ensuite.' },
      { question: 'Le prix comprend-il la couronne ?', answer: 'Cela dépend du devis établi. La phase chirurgicale et la restauration prothétique correspondent à des actes distincts : le devis doit indiquer clairement ce qui est inclus.' },
      { question: 'Que se passe-t-il si une greffe osseuse est nécessaire ?', answer: 'Elle constitue un acte supplémentaire, qui apparaît alors sur le devis. Le besoin éventuel est évalué lors du bilan et de l’imagerie, avant l’engagement.' },
      { question: 'Un implant coûte-t-il plus cher qu’un bridge ?', answer: 'Les montants ne sont pas comparables ligne à ligne, car les actes, la durée de vie attendue et l’entretien diffèrent. Le bilan permet de comparer les options sur l’ensemble de ces critères, pas seulement sur le montant initial.' },
    ],
    ctaTitle: 'Obtenir un devis implantaire adapté à votre situation',
    ctaText: 'Le bilan permet d’examiner la zone concernée, de vérifier la faisabilité et d’établir un devis détaillé que vous pourrez étudier tranquillement.',
    links: ['/implantologie/', '/remboursement-implant-dentaire/', '/implant-ou-bridge/', '/greffe-osseuse-implant/', '/blog/remplacer-dent-manquante-solutions/'],
  }),

  makeDecisionPage({
    slug: 'remboursement-implant-dentaire',
    menuLabel: 'Remboursement d’un implant',
    badge: 'Décider · Implantologie',
    title: 'Implant dentaire et remboursement | Sète',
    description: 'Implant dentaire et remboursement : ce que prend en charge l’Assurance Maladie, le rôle de la complémentaire santé et les démarches à faire avant de commencer.',
    h1: 'Implant dentaire et remboursement : Sécurité sociale et mutuelle',
    intro: 'La question du remboursement arrive souvent avant celle du traitement lui-même. Les règles diffèrent selon qu’il s’agit de l’implant, de la pièce intermédiaire ou de la couronne, et selon votre contrat de complémentaire santé.',
    highlights: [
      'L’implant relève d’un régime différent de celui des soins dentaires courants',
      'Le devis est le document qui permet d’interroger votre complémentaire',
      'Les garanties varient d’un contrat à l’autre : seule votre mutuelle peut répondre pour vous',
    ],
    sections: [
      {
        heading: 'Ce que couvre l’Assurance Maladie',
        blocks: [
          {
            subheading: 'L’implant n’entre pas dans le cadre courant du remboursement',
            paragraphs: [
              'Dans la situation la plus fréquente, la pose d’un implant dentaire ne fait pas l’objet d’une prise en charge par l’Assurance Maladie. Cela surprend souvent, car les soins conservateurs et de nombreuses prothèses relèvent, eux, d’un remboursement.',
              'Des dispositions particulières existent pour certaines situations médicales spécifiques. Elles ne concernent qu’une minorité de cas et se vérifient individuellement auprès de votre caisse, sur la base du devis et des éléments cliniques.',
            ],
          },
          {
            subheading: 'Distinguer les actes entre eux',
            paragraphs: [
              'Un traitement implantaire comporte plusieurs actes : la chirurgie, les pièces prothétiques qui relient l’implant à la restauration, puis la couronne ou la prothèse. Ces actes ne suivent pas nécessairement les mêmes règles de prise en charge.',
              'C’est pourquoi le devis les présente séparément, avec la base de remboursement lorsqu’elle existe. Lire ces lignes une par une évite les mauvaises surprises au moment du règlement.',
            ],
          },
        ],
      },
      {
        heading: 'Le rôle de la complémentaire santé',
        blocks: [
          {
            subheading: 'Des garanties très variables',
            paragraphs: [
              'C’est généralement la complémentaire qui détermine ce qui vous sera effectivement remboursé. Certains contrats prévoient un forfait implantologie, exprimé par implant ou par année ; d’autres ne couvrent pas cet acte.',
              'Des délais de carence, des plafonds annuels ou des conditions d’ancienneté peuvent s’appliquer. Ces éléments figurent dans votre notice d’information et méritent d’être vérifiés avant de fixer le calendrier du traitement.',
            ],
          },
          {
            subheading: 'La démarche concrète',
            bullets: [
              'Demandez le devis détaillé au cabinet à l’issue du bilan.',
              'Transmettez-le à votre complémentaire en demandant une simulation écrite de prise en charge.',
              'Vérifiez si un plafond annuel s’applique et s’il est déjà entamé.',
              'Si le projet concerne plusieurs dents, demandez si un étalement sur deux années civiles change la prise en charge.',
            ],
          },
        ],
      },
      {
        heading: 'Anticiper avant de commencer',
        blocks: [{
          subheading: 'Le calendrier peut se discuter',
          paragraphs: [
            'Un traitement implantaire se déroule sur plusieurs mois. Cette durée, imposée par la cicatrisation, laisse le temps d’obtenir les réponses de votre complémentaire avant les étapes les plus engageantes.',
            'Si la prise en charge conditionne votre décision, dites-le lors du bilan. La planification tient compte des contraintes du patient, y compris matérielles, dès lors qu’elles ne compromettent pas la qualité du traitement.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'L’implant est-il remboursé par la Sécurité sociale ?', answer: 'Dans le cadre courant, non. Des dispositions particulières existent pour certaines situations médicales spécifiques, à vérifier auprès de votre caisse avec le devis.' },
      { question: 'Et la couronne posée sur l’implant ?', answer: 'Elle constitue un acte distinct de la chirurgie. Les règles applicables et l’éventuelle base de remboursement sont indiquées sur le devis remis par le cabinet.' },
      { question: 'Ma mutuelle prend-elle en charge l’implantologie ?', answer: 'Cela dépend entièrement de votre contrat. Transmettez le devis à votre complémentaire pour obtenir une réponse écrite correspondant à vos garanties.' },
      { question: 'Le 100 % Santé s’applique-t-il aux implants ?', answer: 'Le dispositif 100 % Santé concerne certains équipements prothétiques définis réglementairement. L’implantologie n’en fait pas partie. Votre devis précise ce qui relève de quel panier.' },
      { question: 'Puis-je demander une prise en charge avant de commencer ?', answer: 'Oui, et c’est recommandé. La durée du parcours implantaire laisse généralement le temps d’obtenir une réponse écrite de votre complémentaire avant les étapes engageantes.' },
    ],
    ctaTitle: 'Obtenir le devis nécessaire à vos démarches',
    ctaText: 'Le bilan permet d’établir le devis détaillé dont votre complémentaire a besoin pour vous répondre précisément.',
    links: ['/implantologie/', '/prix-implant-dentaire-sete/', '/implant-ou-bridge/', '/plusieurs-dents-manquantes/', '/blog/remplacer-dent-manquante-solutions/'],
  }),

  makeDecisionPage({
    slug: 'implant-ou-bridge',
    menuLabel: 'Implant, bridge ou prothèse',
    badge: 'Décider · Implantologie',
    title: 'Implant, bridge ou prothèse amovible | Sète',
    description: 'Implant, bridge ou prothèse amovible : les critères cliniques qui orientent le choix pour remplacer une dent absente, et les limites de chaque solution.',
    h1: 'Implant, bridge ou prothèse amovible : comment se décide le choix',
    intro: 'Remplacer une dent absente n’impose pas une solution unique. Le choix se construit à partir de l’état des dents voisines, des tissus, de l’occlusion et de ce que vous souhaitez, et non à partir d’une hiérarchie théorique entre les techniques.',
    highlights: [
      'Aucune des trois solutions n’est supérieure aux autres dans l’absolu',
      'L’état des dents voisines pèse souvent lourd dans la décision',
      'Ne pas remplacer immédiatement est parfois une option défendable',
    ],
    sections: [
      {
        heading: 'Les trois options, et leurs contraintes',
        blocks: [
          {
            subheading: 'L’implant',
            paragraphs: [
              'L’implant remplace la racine et supporte une couronne indépendante. Il présente l’intérêt de ne pas solliciter les dents voisines, qui restent intactes.',
              'En contrepartie, il suppose une chirurgie, une cicatrisation de plusieurs mois, un volume osseux suffisant et une hygiène rigoureuse dans la durée. Il n’est pas envisageable dans toutes les situations médicales.',
            ],
          },
          {
            subheading: 'Le bridge',
            paragraphs: [
              'Le bridge s’appuie sur les dents situées de part et d’autre de l’espace. Il permet une restauration fixe dans un délai plus court, sans chirurgie implantaire.',
              'Il implique en revanche de préparer les dents support, ce qui se discute selon leur état. Si ces dents sont saines, le fait de devoir les tailler est un élément à mettre en balance ; si elles portent déjà des restaurations importantes, l’argument s’inverse.',
            ],
          },
          {
            subheading: 'La prothèse amovible',
            paragraphs: [
              'La prothèse amovible reste une solution moins invasive, souvent envisagée lorsque plusieurs dents manquent, lorsque la chirurgie est contre-indiquée ou comme étape transitoire.',
              'Elle demande une adaptation, un entretien quotidien et des ajustements dans le temps. Son confort dépend beaucoup de la situation anatomique de chacun.',
            ],
          },
          {
            subheading: 'Ne pas remplacer',
            paragraphs: [
              'L’abstention mérite d’être évoquée honnêtement. Pour certaines dents, notamment très postérieures, l’absence de remplacement n’entraîne pas nécessairement de conséquence fonctionnelle majeure.',
              'Cette option suppose toutefois une surveillance : les dents voisines et antagonistes peuvent se déplacer avec le temps. Elle se décide donc en connaissance de cause, pas par défaut.',
            ],
          },
        ],
      },
      {
        heading: 'Les critères qui orientent réellement la décision',
        blocks: [{
          subheading: 'Ce que le praticien examine',
          bullets: [
            'L’état des dents voisines : intactes, restaurées ou fragilisées.',
            'Le volume et la qualité de l’os disponible dans la zone.',
            'La santé des gencives et le niveau d’hygiène au quotidien.',
            'L’occlusion et les contraintes exercées lors de la mastication.',
            'Le nombre et la position des dents absentes.',
            'Les antécédents médicaux et les traitements en cours.',
            'Le temps que vous pouvez consacrer au parcours et vos priorités.',
          ],
        }],
      },
      {
        heading: 'Comment la discussion se déroule au cabinet',
        blocks: [{
          subheading: 'Comparer, puis décider',
          paragraphs: [
            'Le bilan ne consiste pas à vous présenter une solution unique. Il vise à exposer les options réellement envisageables dans votre cas, avec pour chacune les bénéfices attendus, les limites et les risques.',
            'Le devis intervient ensuite, une fois que vous avez compris ce qui est proposé. Vous pouvez prendre le temps de la réflexion, et il est parfaitement légitime de demander un second avis avant de vous engager.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'L’implant est-il toujours la meilleure solution ?', answer: 'Non. C’est une option parmi d’autres, avec ses propres contraintes. Selon l’état des dents voisines, l’os disponible et votre situation médicale, un bridge ou une prothèse amovible peuvent être plus adaptés.' },
      { question: 'Faut-il tailler les dents voisines pour un bridge ?', answer: 'Oui, les dents support doivent être préparées. C’est un élément important de la décision, surtout si ces dents sont saines et n’ont jamais été restaurées.' },
      { question: 'Peut-on changer de solution plus tard ?', answer: 'Certaines évolutions sont possibles, d’autres plus difficiles une fois des dents préparées ou de l’os résorbé. C’est une raison de plus d’examiner les options avant de commencer.' },
      { question: 'Combien de temps faut-il pour chaque solution ?', answer: 'Le bridge et la prothèse amovible s’obtiennent généralement en quelques rendez-vous. Le parcours implantaire s’étale sur plusieurs mois du fait de la cicatrisation.' },
      { question: 'Puis-je demander un second avis ?', answer: 'Oui. Vous pouvez consulter un autre praticien avec votre devis et vos examens. C’est un droit, et une démarche compréhensible pour un traitement engageant.' },
    ],
    ctaTitle: 'Comparer les solutions pour votre situation',
    ctaText: 'Un examen permet de déterminer quelles options sont réellement envisageables pour vous, et d’en discuter les contraintes avant toute décision.',
    links: ['/implantologie/', '/plusieurs-dents-manquantes/', '/prix-implant-dentaire-sete/', '/greffe-osseuse-implant/', '/blog/remplacer-dent-manquante-solutions/'],
  }),

  makeDecisionPage({
    slug: 'greffe-osseuse-implant',
    menuLabel: 'Pas assez d’os pour un implant',
    badge: 'Décider · Implantologie',
    title: 'Pas assez d’os pour un implant : greffe osseuse',
    description: 'Volume osseux insuffisant pour un implant : comment il est évalué, ce qu’une greffe osseuse implique et quelles alternatives peuvent être envisagées.',
    h1: 'Pas assez d’os pour un implant : greffe osseuse et alternatives',
    intro: 'S’entendre dire qu’il « n’y a pas assez d’os » est l’une des objections les plus fréquentes en implantologie. Cela ne signifie pas systématiquement qu’aucun implant n’est possible, mais que le volume disponible doit être évalué précisément avant d’aller plus loin.',
    highlights: [
      'Un manque d’os se mesure par imagerie, il ne se déduit pas d’un examen visuel',
      'Une greffe osseuse allonge le parcours de plusieurs mois',
      'D’autres solutions existent si la greffe n’est pas souhaitée ou pas indiquée',
    ],
    sections: [
      {
        heading: 'Pourquoi le volume osseux compte',
        blocks: [
          {
            subheading: 'L’implant a besoin d’être entouré d’os',
            paragraphs: [
              'Un implant doit être stabilisé dans un volume osseux suffisant, en hauteur comme en épaisseur, et à distance des structures anatomiques voisines : sinus au maxillaire, nerf alvéolaire à la mandibule.',
              'Lorsque ce volume est insuffisant, poser un implant malgré tout exposerait à un résultat incertain. L’évaluation préalable n’est donc pas une précaution administrative, mais une condition de faisabilité.',
            ],
          },
          {
            subheading: 'Pourquoi l’os diminue',
            paragraphs: [
              'L’os qui entourait une racine se remodèle après l’extraction de la dent. Ce phénomène est naturel et progressif : plus l’absence est ancienne, plus le volume disponible a pu se réduire.',
              'Une maladie parodontale, une infection ancienne ou le port prolongé d’une prothèse amovible peuvent également influencer l’état des tissus. Cela explique pourquoi la même dent absente ne pose pas les mêmes questions selon la personne et l’ancienneté.',
            ],
          },
        ],
      },
      {
        heading: 'Comment le manque d’os est évalué',
        blocks: [{
          subheading: 'L’imagerie tranche, pas l’impression clinique',
          paragraphs: [
            'Une radiographie panoramique donne une vue d’ensemble mais ne renseigne pas sur l’épaisseur. Lorsque la question se pose réellement, une imagerie en trois dimensions permet de mesurer le volume disponible et de situer les structures voisines.',
            'Cet examen n’est pas systématique : il est demandé lorsqu’il répond à une question précise et qu’il peut modifier la décision. Ses résultats sont commentés avec vous, images à l’appui.',
          ],
        }],
      },
      {
        heading: 'Ce qu’implique une greffe osseuse',
        blocks: [
          {
            subheading: 'Un acte supplémentaire, avec son propre délai',
            paragraphs: [
              'Une greffe consiste à reconstituer du volume dans la zone concernée. Selon l’importance du déficit, elle peut être réalisée en même temps que la pose de l’implant ou lors d’une intervention préalable.',
              'Dans ce second cas, une période de cicatrisation est nécessaire avant d’envisager l’implant, ce qui allonge le parcours de plusieurs mois. Ce délai doit être intégré à votre calendrier dès la planification.',
            ],
          },
          {
            subheading: 'Bénéfices attendus et limites',
            paragraphs: [
              'Une greffe peut rendre possible un traitement qui ne l’était pas. Elle comporte, comme tout acte chirurgical, des suites et des risques qui vous sont exposés au regard de votre situation.',
              'Son résultat ne peut pas être garanti à l’avance. Le tabagisme, l’état des gencives et la santé générale font partie des éléments qui influencent la cicatrisation et sont donc évalués en amont.',
            ],
          },
        ],
      },
      {
        heading: 'Si la greffe n’est pas la bonne voie',
        blocks: [{
          subheading: 'D’autres options restent ouvertes',
          paragraphs: [
            'Une greffe n’est ni obligatoire, ni toujours indiquée. Refuser cette étape, ou constater qu’elle n’est pas pertinente dans votre cas, ne referme pas le dossier.',
            'Selon la zone concernée et vos priorités, un implant positionné différemment, un bridge, une prothèse amovible ou l’absence de remplacement peuvent être rediscutés. L’objectif reste de trouver une solution tenable pour vous, pas d’imposer un protocole.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'On m’a dit que je n’avais pas assez d’os : est-ce définitif ?', answer: 'Pas nécessairement. Cela dépend de l’importance du déficit, de sa localisation et de votre situation médicale. Une imagerie permet de mesurer précisément ce qui est disponible avant de conclure.' },
      { question: 'Une greffe osseuse est-elle douloureuse ?', answer: 'L’intervention est réalisée sous anesthésie locale. Les suites varient selon l’étendue du geste et les consignes post-opératoires vous sont expliquées à l’avance.' },
      { question: 'Combien de temps faut-il attendre après une greffe ?', answer: 'Lorsque la greffe précède la pose de l’implant, plusieurs mois de cicatrisation sont généralement nécessaires. Le délai exact dépend du type de greffe et de son évolution, vérifiée lors des contrôles.' },
      { question: 'Puis-je refuser la greffe ?', answer: 'Oui. Votre consentement est requis à chaque étape. D’autres solutions de remplacement peuvent alors être examinées, ou l’abstention discutée en connaissance de cause.' },
      { question: 'Le tabac empêche-t-il une greffe ?', answer: 'Le tabagisme influence la cicatrisation des tissus et le pronostic. Il n’interdit pas nécessairement le geste, mais il est pris en compte dans l’évaluation et dans les explications qui vous sont données.' },
    ],
    ctaTitle: 'Faire évaluer précisément le volume osseux disponible',
    ctaText: 'Un bilan avec l’imagerie adaptée permet de savoir ce qui est réellement possible, plutôt que de rester sur une réponse générale.',
    links: ['/implantologie/', '/implant-ou-bridge/', '/prix-implant-dentaire-sete/', '/blog/bilan-imagerie-avant-implant/', '/blog/etapes-pose-implant-dentaire/'],
  }),

  makeDecisionPage({
    slug: 'plusieurs-dents-manquantes',
    menuLabel: 'Plusieurs dents manquantes',
    badge: 'Décider · Implantologie',
    title: 'Remplacer plusieurs dents manquantes | Sète',
    description: 'Plusieurs dents absentes : options fixes et amovibles, nombre d’implants nécessaire, séquençage du traitement et critères qui orientent la décision.',
    h1: 'Remplacer plusieurs dents manquantes : options fixes et amovibles',
    intro: 'Lorsque plusieurs dents manquent, la question n’est plus seulement celle du remplacement dent par dent. Il s’agit de reconstruire un équilibre de mastication, ce qui ouvre des solutions différentes et demande une planification d’ensemble.',
    highlights: [
      'Le nombre d’implants ne correspond pas au nombre de dents à remplacer',
      'Le traitement peut être séquencé, en traitant d’abord le plus fonctionnellement important',
      'Solutions fixes et amovibles répondent à des contraintes différentes, pas à une hiérarchie',
    ],
    sections: [
      {
        heading: 'Raisonner par secteur plutôt que dent par dent',
        blocks: [{
          subheading: 'Une logique d’ensemble',
          paragraphs: [
            'Quand plusieurs dents sont absentes, les remplacer une à une n’est pas toujours la démarche la plus pertinente. Le praticien examine la façon dont les arcades s’engrènent, les zones qui supportent réellement la mastication et les dents restantes.',
            'Cette analyse conduit parfois à des choix qui surprennent : conserver et renforcer certaines dents, en remplacer d’autres, et ne pas intervenir sur une zone qui ne le justifie pas fonctionnellement.',
          ],
        }],
      },
      {
        heading: 'Les solutions envisageables',
        blocks: [
          {
            subheading: 'Solutions fixes',
            paragraphs: [
              'Un bridge sur implants permet de remplacer plusieurs dents contiguës en s’appuyant sur un nombre d’implants inférieur au nombre de dents restituées. La répartition des appuis est déterminée par la planification, en fonction de l’os disponible et des contraintes mécaniques.',
              'Cette approche suppose une chirurgie, une cicatrisation et une hygiène soutenue autour des éléments posés. Elle se discute au regard de votre état de santé et de votre capacité à assurer la maintenance dans la durée.',
            ],
          },
          {
            subheading: 'Solutions amovibles et stabilisées',
            paragraphs: [
              'Une prothèse amovible peut remplacer un grand nombre de dents sans chirurgie. Sa stabilité dépend beaucoup de l’anatomie et de l’état des tissus.',
              'Dans certaines situations, quelques implants peuvent servir à stabiliser une prothèse amovible plutôt qu’à supporter une reconstruction entièrement fixe. Ce compromis réduit l’ampleur de la chirurgie tout en améliorant la tenue, et mérite d’être évoqué.',
            ],
          },
          {
            subheading: 'Solutions transitoires',
            paragraphs: [
              'Un dispositif provisoire peut accompagner les phases de cicatrisation, afin de préserver la fonction et l’apparence pendant le traitement. Sa nature et sa durée sont précisées lors de la planification.',
            ],
          },
        ],
      },
      {
        heading: 'Le calendrier et le séquençage',
        blocks: [{
          subheading: 'Un traitement qui se construit par étapes',
          paragraphs: [
            'Une reconstruction étendue ne se réalise pas en une seule séance. Les délais de cicatrisation structurent le calendrier, et les contrôles permettent de valider chaque étape avant de passer à la suivante.',
            'Si l’ensemble du projet n’est pas réalisable d’emblée, il est souvent possible de le séquencer. Le bilan identifie alors ce qui doit être traité en priorité, généralement pour des raisons fonctionnelles.',
          ],
        }],
      },
      {
        heading: 'Ce qui est évalué avant de proposer un plan',
        blocks: [{
          subheading: 'Les éléments déterminants',
          bullets: [
            'Le nombre, la position et l’ancienneté des dents absentes.',
            'L’état des dents restantes et leur capacité à participer à la reconstruction.',
            'Le volume osseux disponible dans chaque secteur concerné.',
            'La santé parodontale et l’hygiène quotidienne.',
            'Les antécédents médicaux et les traitements en cours.',
            'Vos priorités : confort de mastication, apparence, durée du parcours.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'Faut-il un implant par dent manquante ?', answer: 'Non. Un bridge sur implants peut restituer plusieurs dents en s’appuyant sur un nombre d’implants inférieur. La répartition est déterminée par la planification, selon l’os disponible et les contraintes mécaniques.' },
      { question: 'Peut-on tout faire en une seule intervention ?', answer: 'Une reconstruction étendue comporte des étapes espacées par la cicatrisation. Le calendrier est établi lors de la planification et dépend de la situation clinique.' },
      { question: 'Le traitement peut-il être étalé dans le temps ?', answer: 'Souvent, oui. Le bilan permet d’identifier ce qui est prioritaire sur le plan fonctionnel et de séquencer le reste, y compris pour des raisons d’organisation personnelle.' },
      { question: 'Une prothèse amovible est-elle une solution par défaut ?', answer: 'Non. Elle répond à des contraintes précises et constitue parfois le choix le plus adapté, notamment lorsque la chirurgie est contre-indiquée ou que de nombreuses dents sont concernées.' },
      { question: 'Que se passe-t-il si je ne remplace rien ?', answer: 'Les dents voisines et antagonistes peuvent se déplacer, et la mastication se reporter sur d’autres secteurs. Ces évolutions sont examinées lors du bilan afin que la décision soit prise en connaissance de cause.' },
    ],
    ctaTitle: 'Faire le point sur une reconstruction d’ensemble',
    ctaText: 'Un bilan complet permet d’analyser les secteurs concernés, d’envisager les solutions possibles et de proposer un calendrier réaliste.',
    links: ['/implantologie/', '/implant-ou-bridge/', '/greffe-osseuse-implant/', '/prix-implant-dentaire-sete/', '/blog/remplacer-dent-manquante-solutions/'],
  }),

  makeDecisionPage({
    slug: 'peur-du-dentiste-implant',
    menuLabel: 'Appréhension avant une chirurgie',
    badge: 'Décider · Implantologie',
    title: 'Appréhension avant une chirurgie implantaire',
    description: 'Peur du dentiste et chirurgie implantaire : ce qui est expliqué avant l’intervention, comment la douleur est prise en charge et ce qui est prévu pendant le geste.',
    h1: 'Appréhension avant une chirurgie implantaire : ce qui est expliqué et prévu',
    intro: 'L’appréhension avant une intervention est fréquente et légitime. Elle porte souvent moins sur la douleur elle-même que sur l’inconnu : ne pas savoir ce qui va se passer, ne pas pouvoir intervenir, ne pas oser poser ses questions.',
    highlights: [
      'Vous pouvez interrompre le déroulement à tout moment par un signe convenu',
      'Le contrôle de la douleur repose sur l’anesthésie locale, vérifiée avant de commencer',
      'Aucune décision n’est prise le jour du premier rendez-vous',
    ],
    sections: [
      {
        heading: 'Dire son appréhension change le déroulement',
        blocks: [{
          subheading: 'Une information utile, pas un aveu',
          paragraphs: [
            'Signaler que vous appréhendez n’est pas anecdotique : cela modifie concrètement la façon dont le rendez-vous est conduit. Le rythme, la longueur des explications, les pauses et le choix des séances peuvent être adaptés.',
            'Certaines personnes ont vécu une expérience difficile, parfois ancienne. En parler permet d’identifier ce qui a posé problème — le bruit, la position allongée, la sensation de ne pas pouvoir arrêter — et d’en tenir compte plutôt que de le découvrir en cours de geste.',
          ],
        }],
      },
      {
        heading: 'Le premier rendez-vous n’engage à rien',
        blocks: [{
          subheading: 'Comprendre avant de décider',
          paragraphs: [
            'Le bilan est un temps d’examen et d’explication. Aucune intervention n’y est réalisée, et aucune décision ne vous est demandée sur place. Le devis vous est remis pour que vous puissiez y réfléchir chez vous.',
            'Vous pouvez venir accompagné, poser vos questions par écrit si cela vous aide, et demander à revoir un point autant de fois que nécessaire. Un traitement mal compris est un traitement mal vécu.',
          ],
        }],
      },
      {
        heading: 'Comment la douleur est prise en charge',
        blocks: [
          {
            subheading: 'L’anesthésie locale',
            paragraphs: [
              'La chirurgie implantaire est le plus souvent réalisée sous anesthésie locale. Son efficacité est vérifiée avant de commencer le geste, et elle peut être complétée en cours d’intervention si vous signalez une sensation.',
              'La distinction entre sensation de pression et douleur est expliquée à l’avance : percevoir des mouvements ou des vibrations est habituel et ne signifie pas que l’anesthésie est insuffisante.',
            ],
          },
          {
            subheading: 'Le MEOPA',
            paragraphs: [
              'Le praticien dispose de l’aptitude à l’utilisation du MEOPA, un mélange gazeux inhalé qui vise à réduire l’anxiété tout en vous laissant conscient et capable de communiquer.',
              'Son indication s’apprécie au cas par cas, en fonction de votre situation médicale et du geste prévu. Il ne remplace pas l’anesthésie locale, mais peut l’accompagner.',
            ],
          },
          {
            subheading: 'Les suites',
            paragraphs: [
              'Les consignes post-opératoires et la conduite à tenir en cas de gêne vous sont remises par écrit. Savoir à l’avance ce qui est attendu, et ce qui justifie de rappeler le cabinet, réduit une grande part de l’inquiétude.',
            ],
          },
        ],
      },
      {
        heading: 'Ce qui est prévu pendant l’intervention',
        blocks: [{
          subheading: 'Garder la main sur le déroulement',
          bullets: [
            'Un signe convenu à l’avance permet d’interrompre le geste à tout moment.',
            'Les étapes sont annoncées au fur et à mesure, sans détail inutile si vous préférez ne pas les entendre.',
            'Des pauses sont possibles, notamment si la position allongée est inconfortable.',
            'La durée prévue vous est indiquée avant de commencer.',
            'Vous pouvez demander à ne pas voir les instruments.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'Vais-je sentir quelque chose pendant l’intervention ?', answer: 'L’anesthésie locale vise à supprimer la douleur. Vous pouvez percevoir des pressions ou des vibrations, ce qui est habituel. Si une sensation douloureuse apparaît, signalez-la : l’anesthésie peut être complétée.' },
      { question: 'Puis-je demander une pause ?', answer: 'Oui. Un signe convenu avant de commencer permet d’interrompre le geste à tout moment, sans avoir à parler.' },
      { question: 'Le MEOPA est-il systématiquement proposé ?', answer: 'Non. Son indication s’apprécie selon votre situation médicale et le geste prévu. Il peut accompagner l’anesthésie locale mais ne la remplace pas.' },
      { question: 'Puis-je être endormi complètement ?', answer: 'L’anesthésie générale relève d’un cadre hospitalier et d’une indication spécifique. Lorsqu’elle se justifie, une orientation est proposée après discussion.' },
      { question: 'Dois-je décider le jour du bilan ?', answer: 'Non. Le bilan sert à examiner et à expliquer. Le devis vous est remis pour que vous puissiez réfléchir, et vous revenez quand vous êtes prêt.' },
      { question: 'Puis-je venir accompagné ?', answer: 'Oui. Beaucoup de personnes préfèrent être accompagnées pour le bilan ou le jour de l’intervention, notamment pour le retour.' },
    ],
    ctaTitle: 'Poser vos questions avant tout engagement',
    ctaText: 'Le pré-rendez-vous téléphonique de cinq minutes permet d’exprimer vos appréhensions et de savoir comment le premier rendez-vous se déroulera.',
    links: ['/implantologie/', '/blog/implant-dentaire-douleur-anesthesie-cicatrisation/', '/blog/etapes-pose-implant-dentaire/', '/prix-implant-dentaire-sete/', '/about/'],
  }),
]

// Local pages exist only where the situation genuinely differs from a Sète appointment.
// Implant treatment runs over several months, so these target year-round Bassin de Thau
// residents rather than seasonal visitors.
const implantLocalPages = [
  makeDecisionPage({
    slug: 'implant-dentaire-balaruc-les-bains',
    menuGroup: 'locals',
    menuLabel: 'Depuis Balaruc-les-Bains',
    badge: 'Accès au cabinet · Balaruc-les-Bains',
    title: 'Implant dentaire depuis Balaruc-les-Bains | Sète',
    description: 'Venir de Balaruc-les-Bains pour un projet implantaire à Sète : continuité du suivi sur plusieurs mois, coordination médicale et organisation des rendez-vous.',
    h1: 'Implant dentaire depuis Balaruc-les-Bains : suivi et organisation',
    intro: 'Le cabinet se situe à Sète, à une dizaine de kilomètres de Balaruc-les-Bains. Cette page répond aux questions d’organisation propres à un traitement implantaire, qui s’étale sur plusieurs mois et suppose des rendez-vous espacés.',
    highlights: [
      'Le cabinet est établi à Sète : il ne s’agit pas d’une adresse secondaire à Balaruc',
      'Un traitement implantaire suppose plusieurs venues réparties sur plusieurs mois',
      'La coordination avec votre médecin traitant est possible lorsqu’un traitement en cours l’exige',
    ],
    sections: [
      {
        heading: 'Un parcours qui demande de la continuité',
        blocks: [{
          subheading: 'Pourquoi la proximité compte ici',
          paragraphs: [
            'Contrairement à un soin ponctuel, un projet implantaire se déroule sur plusieurs mois : bilan, éventuels soins préalables, chirurgie, cicatrisation, puis restauration et contrôles. Chacune de ces étapes suppose une venue au cabinet.',
            'Pour une personne résidant à Balaruc-les-Bains à l’année, cette continuité est généralement plus simple à organiser que pour un séjour temporaire. C’est aussi ce qui permet d’assurer les contrôles réguliers après la pose, qui font partie du traitement et non d’un supplément facultatif.',
          ],
        }],
      },
      {
        heading: 'Coordination avec votre suivi médical',
        blocks: [{
          subheading: 'Traitements en cours et antécédents',
          paragraphs: [
            'Le questionnaire médical porte notamment sur les traitements agissant sur le tissu osseux, les anticoagulants, le diabète et les antécédents cardiovasculaires. Ces éléments influencent le protocole et parfois la faisabilité.',
            'Lorsqu’une précision est nécessaire, un échange avec votre médecin traitant ou votre spécialiste peut être demandé avant la chirurgie. Apporter la liste de vos traitements en cours dès le bilan fait gagner du temps.',
          ],
        }],
      },
      {
        heading: 'Organiser vos venues',
        blocks: [{
          subheading: 'Ce qu’il est utile de savoir',
          bullets: [
            'Le cabinet se trouve en rez-de-chaussée, boulevard Danièle Casanova, au centre de Sète.',
            'Le bilan et l’imagerie éventuelle sont réalisés dans le même lieu, ce qui évite un déplacement supplémentaire pour la planification.',
            'Les rendez-vous de contrôle sont courts et peuvent souvent être regroupés avec une autre étape.',
            'Le jour de l’intervention, prévoir un retour accompagné est fréquemment préférable.',
            'Le pré-rendez-vous téléphonique permet de vérifier la pertinence d’un déplacement avant de fixer un premier rendez-vous.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'Le cabinet a-t-il une adresse à Balaruc-les-Bains ?', answer: 'Non. Le cabinet est établi à Sète, boulevard Danièle Casanova. Cette page concerne uniquement l’organisation d’une venue depuis Balaruc-les-Bains.' },
      { question: 'Combien de déplacements faut-il prévoir ?', answer: 'Le nombre de rendez-vous dépend du projet : bilan, éventuels soins préalables, chirurgie, contrôles de cicatrisation puis restauration. Il est précisé lors de la planification.' },
      { question: 'Je suis en cure thermale : puis-je commencer un implant ?', answer: 'Un traitement implantaire s’étale sur plusieurs mois et suppose des contrôles après la pose. Un séjour de quelques semaines ne permet généralement pas d’en assurer le suivi ; le bilan permet d’en discuter.' },
      { question: 'Mon traitement médical est-il compatible ?', answer: 'Cela s’évalue au cas par cas. Apportez la liste de vos traitements en cours au bilan ; un échange avec votre médecin peut être demandé avant la chirurgie.' },
    ],
    ctaTitle: 'Préparer votre venue depuis Balaruc-les-Bains',
    ctaText: 'Un échange téléphonique de cinq minutes permet de préciser votre situation et de vérifier ce qu’un premier rendez-vous permettrait d’évaluer.',
    links: ['/implantologie/', '/implant-dentaire-frontignan/', '/implant-dentaire-meze/', '/prix-implant-dentaire-sete/', '/contact/'],
  }),

  makeDecisionPage({
    slug: 'implant-dentaire-frontignan',
    menuGroup: 'locals',
    menuLabel: 'Depuis Frontignan',
    badge: 'Accès au cabinet · Frontignan',
    title: 'Implant dentaire depuis Frontignan | Sète',
    description: 'Venir de Frontignan pour un projet implantaire à Sète : second avis sur un devis existant, reprise d’un dossier en cours et organisation du suivi.',
    h1: 'Implant dentaire depuis Frontignan : second avis et suivi',
    intro: 'Frontignan est la commune la plus proche de Sète. Cette page s’adresse notamment aux personnes qui disposent déjà d’un devis ou d’un projet implantaire et souhaitent en discuter avant de s’engager.',
    highlights: [
      'Demander un second avis est un droit, et une démarche courante avant un traitement engageant',
      'Apporter vos examens récents évite de refaire une imagerie sans nécessité',
      'Le cabinet est établi à Sète : cette page prépare votre venue, sans adresse secondaire',
    ],
    sections: [
      {
        heading: 'Venir avec un projet déjà formulé',
        blocks: [{
          subheading: 'Ce qu’un second avis permet',
          paragraphs: [
            'Un traitement implantaire représente un engagement en temps et en budget. Souhaiter confronter un projet à un autre examen est une démarche légitime, prévue par le droit des patients, et qui n’a rien d’un désaveu envers le praticien consulté.',
            'Un second examen porte sur les mêmes éléments cliniques : indication, alternatives, faisabilité, contraintes. Il peut conforter le projet initial, proposer une autre approche ou éclairer un point resté flou.',
          ],
        }],
      },
      {
        heading: 'Ce qu’il est utile d’apporter',
        blocks: [{
          subheading: 'Éviter de refaire ce qui existe',
          paragraphs: [
            'Les examens d’imagerie récents restent exploitables. Les apporter permet d’éviter une irradiation inutile et de gagner du temps lors du bilan.',
          ],
          bullets: [
            'Le devis détaillé qui vous a été remis, s’il en existe un.',
            'Les radiographies ou l’imagerie tridimensionnelle réalisées récemment.',
            'La liste de vos traitements médicaux en cours.',
            'Votre carte d’implant, si des implants ont déjà été posés.',
            'Les questions restées sans réponse, notées à l’avance.',
          ],
        }],
      },
      {
        heading: 'Reprendre ou poursuivre un traitement commencé',
        blocks: [{
          subheading: 'Une situation qui s’examine avant tout engagement',
          paragraphs: [
            'Lorsqu’un traitement a été entamé ailleurs, la reprise suppose d’identifier précisément ce qui a été posé et à quel stade le parcours se trouve. La carte d’implant et le compte rendu opératoire sont alors déterminants.',
            'Toutes les situations ne permettent pas une reprise dans de bonnes conditions. Le cas échéant, cela vous est dit clairement plutôt que d’engager une prise en charge incertaine.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'Puis-je venir avec un devis établi ailleurs ?', answer: 'Oui. Vous pouvez consulter pour un second avis avec votre devis et vos examens. La démarche porte sur l’indication, les alternatives et la faisabilité.' },
      { question: 'Faut-il refaire une imagerie ?', answer: 'Pas nécessairement. Une imagerie récente reste exploitable. Apportez-la : un nouvel examen n’est demandé que s’il répond à une question que le précédent ne permet pas de trancher.' },
      { question: 'Le cabinet reçoit-il à Frontignan ?', answer: 'Non. Le cabinet est établi à Sète, boulevard Danièle Casanova. Cette page prépare une venue depuis Frontignan.' },
      { question: 'Puis-je faire poursuivre un traitement commencé ailleurs ?', answer: 'Cela dépend de ce qui a été posé et du stade atteint. La carte d’implant et le compte rendu opératoire permettent d’évaluer si une reprise est envisageable dans de bonnes conditions.' },
    ],
    ctaTitle: 'Faire examiner votre projet implantaire',
    ctaText: 'Le pré-rendez-vous téléphonique permet d’expliquer votre situation et de savoir quels documents apporter pour que le bilan soit utile.',
    links: ['/implantologie/', '/implant-dentaire-balaruc-les-bains/', '/implant-dentaire-meze/', '/implant-ou-bridge/', '/contact/'],
  }),

  makeDecisionPage({
    slug: 'implant-dentaire-meze',
    menuGroup: 'locals',
    menuLabel: 'Depuis Mèze',
    badge: 'Accès au cabinet · Mèze',
    title: 'Implant dentaire depuis Mèze | Cabinet à Sète',
    description: 'Venir de Mèze pour un projet implantaire à Sète : trajet autour de l’étang, regroupement des rendez-vous et bilan réalisé en un seul lieu.',
    h1: 'Implant dentaire depuis Mèze : trajet et organisation des rendez-vous',
    intro: 'Depuis Mèze, rejoindre Sète suppose de contourner l’étang de Thau. Pour un traitement implantaire, qui comporte plusieurs rendez-vous répartis sur des mois, cette contrainte de trajet mérite d’être anticipée dès la planification.',
    highlights: [
      'Bilan, imagerie et planification réalisés dans un même lieu, en une seule venue',
      'Les rendez-vous peuvent être regroupés ou placés pour limiter les trajets',
      'Le cabinet est établi à Sète : cette page prépare votre venue depuis Mèze',
    ],
    sections: [
      {
        heading: 'Limiter le nombre de trajets',
        blocks: [{
          subheading: 'Ce qui se fait en une seule venue',
          paragraphs: [
            'Le bilan clinique, l’imagerie lorsqu’elle est indiquée et l’explication du plan de traitement sont réalisés au cabinet. Vous repartez donc avec les éléments de décision et le devis à l’issue de cette venue, sans déplacement supplémentaire pour la planification.',
            'Le pré-rendez-vous téléphonique, en amont, permet de vérifier que votre demande relève bien d’un bilan implantaire. Cela évite un premier trajet qui n’aboutirait pas.',
          ],
        }],
      },
      {
        heading: 'Organiser les étapes suivantes',
        blocks: [{
          subheading: 'Un calendrier qui tient compte du trajet',
          paragraphs: [
            'Les délais entre les étapes sont imposés par la cicatrisation, mais le placement des rendez-vous dans la journée et leur regroupement éventuel peuvent être adaptés.',
            'Signalez votre contrainte de déplacement dès la planification : certains contrôles courts peuvent être combinés avec une étape plus longue plutôt que de justifier une venue dédiée.',
          ],
        }],
      },
      {
        heading: 'Après l’intervention',
        blocks: [{
          subheading: 'Ce qui est prévu à distance',
          paragraphs: [
            'Les consignes post-opératoires vous sont remises par écrit, avec la conduite à tenir et les signes qui justifient de rappeler le cabinet. Une question simple trouve souvent sa réponse par téléphone, sans nécessiter un déplacement.',
            'En revanche, une douleur croissante, un saignement persistant ou un signe inhabituel justifie un contact rapide et, si nécessaire, un examen. La distance ne doit pas conduire à différer une vérification utile.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'Le cabinet consulte-t-il à Mèze ?', answer: 'Non. Le cabinet est établi à Sète, boulevard Danièle Casanova. Cette page concerne l’organisation d’une venue depuis Mèze.' },
      { question: 'Le bilan et l’imagerie se font-ils le même jour ?', answer: 'L’examen clinique et l’imagerie indiquée sont réalisés au cabinet lors de la même venue, avec l’explication du plan de traitement et la remise du devis.' },
      { question: 'Peut-on regrouper les rendez-vous ?', answer: 'Les délais de cicatrisation ne se compriment pas, mais le placement et le regroupement de certains contrôles peuvent être adaptés. Signalez votre contrainte de trajet dès la planification.' },
      { question: 'Faut-il revenir pour la moindre question après l’intervention ?', answer: 'Non. Beaucoup de questions se règlent par téléphone. Un déplacement est en revanche justifié en cas de douleur croissante, de saignement persistant ou de signe inhabituel.' },
    ],
    ctaTitle: 'Préparer votre venue depuis Mèze',
    ctaText: 'Un échange téléphonique de cinq minutes permet de vérifier que votre demande relève d’un bilan implantaire avant d’organiser le trajet.',
    links: ['/implantologie/', '/implant-dentaire-balaruc-les-bains/', '/implant-dentaire-frontignan/', '/prix-implant-dentaire-sete/', '/contact/'],
  }),
]

const orthodontieGapPages = [
  makeDecisionPage({
    slug: 'remboursement-orthodontie-adulte',
    cluster: 'orthodontie',
    menuLabel: 'Remboursement adulte',
    badge: 'Décider · Orthodontie',
    title: 'Remboursement de l’orthodontie adulte | Sète',
    description: 'Orthodontie adulte et remboursement : pourquoi l’Assurance Maladie ne prend pas en charge après 16 ans, le rôle de la mutuelle et les démarches à effectuer.',
    h1: 'Remboursement de l’orthodontie adulte : ce qu’il faut vérifier',
    intro: 'La prise en charge de l’orthodontie par l’Assurance Maladie est liée à un critère d’âge. Passé cette limite, le financement repose principalement sur votre complémentaire santé, dont les garanties varient beaucoup d’un contrat à l’autre.',
    highlights: [
      'La prise en charge par l’Assurance Maladie est conditionnée à un traitement débuté avant 16 ans',
      'Certaines complémentaires prévoient un forfait pour l’orthodontie adulte, d’autres non',
      'Le devis est le document qui permet d’obtenir une réponse chiffrée de votre mutuelle',
    ],
    sections: [
      {
        heading: 'La règle d’âge et ce qu’elle implique',
        blocks: [
          {
            subheading: 'Un traitement débuté avant seize ans',
            paragraphs: [
              'L’Assurance Maladie prend en charge les traitements d’orthodontie lorsqu’ils sont débutés avant l’âge de seize ans, sous réserve d’une demande d’entente préalable. Au-delà, le traitement relève d’un financement différent.',
              'Cette limite porte sur le début du traitement, et non sur sa fin : un traitement commencé dans les délais et qui se poursuit ensuite ne perd pas sa prise en charge en cours de route.',
            ],
          },
          {
            subheading: 'Une exception ciblée',
            paragraphs: [
              'Une prise en charge peut exister chez l’adulte dans le cadre d’une préparation à une intervention de chirurgie maxillo-faciale. Cette situation est précise et suppose une indication établie ; elle ne concerne pas les demandes d’alignement courantes.',
            ],
          },
        ],
      },
      {
        heading: 'Ce que peut couvrir la complémentaire santé',
        blocks: [{
          subheading: 'Des garanties à vérifier ligne à ligne',
          paragraphs: [
            'Certains contrats prévoient un forfait spécifique pour l’orthodontie adulte, souvent exprimé par semestre de traitement ou par année. D’autres excluent expressément les actes non pris en charge par l’Assurance Maladie.',
            'Le montant, le plafond annuel, un éventuel délai de carence et le nombre de semestres couverts figurent dans votre notice d’information. Ces éléments méritent d’être vérifiés avant de fixer le début du traitement.',
          ],
          bullets: [
            'Demandez le devis détaillé au cabinet à l’issue du bilan.',
            'Transmettez-le à votre complémentaire en sollicitant une réponse écrite.',
            'Vérifiez si le forfait s’entend par semestre, par année ou par traitement.',
            'Demandez si la contention est comprise dans la garantie.',
          ],
        }],
      },
      {
        heading: 'Ce que contient le devis',
        blocks: [{
          subheading: 'Comprendre ce que vous financez',
          paragraphs: [
            'Le devis présente le protocole envisagé, les étapes comprises et les conditions du suivi. Il précise ce qui est inclus et ce qui pourrait faire l’objet d’un complément, notamment en cas de phase de finition.',
            'La contention, qui suit la phase active, est un poste à part entière. Vérifier si elle figure au devis évite une mauvaise surprise à la fin du traitement.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'L’orthodontie adulte est-elle remboursée par la Sécurité sociale ?', answer: 'La prise en charge suppose un traitement débuté avant seize ans. Passé cette limite, le financement relève principalement de votre complémentaire santé, hors situations spécifiques liées à une chirurgie maxillo-faciale.' },
      { question: 'Ma mutuelle peut-elle participer ?', answer: 'Cela dépend de votre contrat. Certaines complémentaires prévoient un forfait pour l’orthodontie adulte, d’autres non. Transmettez le devis pour obtenir une réponse correspondant à vos garanties.' },
      { question: 'La contention est-elle comprise ?', answer: 'Cela dépend du devis établi et de votre contrat. La contention suit la phase active et constitue un poste distinct : vérifiez sa présence sur le devis et auprès de votre complémentaire.' },
      { question: 'Le prix dépend-il de la durée du traitement ?', answer: 'La durée estimée, le nombre d’étapes et les contrôles nécessaires entrent dans la construction du devis. Une estimation fiable suppose un examen et un protocole défini.' },
    ],
    ctaTitle: 'Obtenir un devis pour vos démarches',
    ctaText: 'Le bilan permet de définir le protocole envisageable et d’établir le devis dont votre complémentaire a besoin pour vous répondre.',
    links: ['/orthodontie-invisible-sete/', '/prix-orthodontie-invisible-sete/', '/contention-apres-aligneurs/', '/orthodontie-sete/', '/blog/orthodontie-invisible-adulte-30-40-50-ans/'],
  }),

  makeDecisionPage({
    slug: 'contention-apres-aligneurs',
    cluster: 'orthodontie',
    menuLabel: 'Contention après aligneurs',
    badge: 'Décider · Orthodontie',
    title: 'Contention après les aligneurs | Sète',
    description: 'Contention après un traitement par aligneurs : pourquoi elle est nécessaire, quels dispositifs existent, combien de temps la porter et comment l’entretenir.',
    h1: 'La contention après les aligneurs : préserver le résultat obtenu',
    intro: 'La fin de la phase active ne marque pas la fin du traitement. Les dents conservent une tendance à revenir vers leur position antérieure, et la contention est ce qui s’oppose à ce mouvement. C’est la phase la moins expliquée, et la plus déterminante sur le long terme.',
    highlights: [
      'Sans contention, une récidive est probable, quelle que soit la qualité de la phase active',
      'La contention se conçoit sur le très long terme, pas sur quelques mois',
      'Un dispositif décollé ou déformé justifie de recontacter le cabinet sans attendre',
    ],
    sections: [
      {
        heading: 'Pourquoi les dents ont tendance à rebouger',
        blocks: [{
          subheading: 'Un phénomène attendu, pas un échec',
          paragraphs: [
            'Après un déplacement dentaire, les fibres qui entourent les racines et l’os qui les soutient continuent de se réorganiser pendant une longue période. Durant ce temps, les dents restent susceptibles de se déplacer.',
            'À cela s’ajoutent des évolutions naturelles qui se poursuivent toute la vie, indépendamment du traitement. La récidive n’est donc pas le signe que quelque chose s’est mal passé : c’est un phénomène biologique attendu, contre lequel la contention agit.',
          ],
        }],
      },
      {
        heading: 'Les dispositifs de contention',
        blocks: [
          {
            subheading: 'La contention fixe',
            paragraphs: [
              'Un fil fin est collé à la face interne des dents, généralement sur le secteur antérieur. Il agit en permanence, sans intervention de votre part, ce qui constitue son principal intérêt.',
              'Il demande en revanche une attention particulière à l’hygiène, notamment pour le nettoyage entre les dents, et un contrôle régulier de sa tenue.',
            ],
          },
          {
            subheading: 'La contention amovible',
            paragraphs: [
              'Une gouttière de contention se porte selon un rythme défini avec le praticien, souvent nocturne après une période initiale plus soutenue.',
              'Son efficacité dépend directement du respect de ce port. Une gouttière laissée de côté quelques semaines peut ne plus s’adapter correctement, ce qui constitue en soi un signal.',
            ],
          },
          {
            subheading: 'Le choix entre les deux',
            paragraphs: [
              'Le dispositif retenu dépend des mouvements réalisés, de la situation initiale, de l’occlusion et de votre mode de vie. Les deux approches sont parfois associées.',
            ],
          },
        ],
      },
      {
        heading: 'Combien de temps la porter',
        blocks: [{
          subheading: 'Une réponse qui déplaît souvent',
          paragraphs: [
            'Il n’existe pas de durée après laquelle le risque de récidive disparaît. Le maintien du résultat suppose une contention prolongée, dont le rythme peut être allégé avec le temps mais rarement interrompu définitivement.',
            'Cette information est donnée avant le début du traitement, et non à la fin. Accepter un traitement par aligneurs, c’est accepter la phase de contention qui suit : les deux forment un ensemble.',
          ],
        }],
      },
      {
        heading: 'Entretien et surveillance',
        blocks: [{
          subheading: 'Ce qui justifie de recontacter le cabinet',
          bullets: [
            'Un fil de contention décollé, même partiellement, ou dont vous percevez une aspérité.',
            'Une gouttière fissurée, déformée ou devenue difficile à insérer.',
            'La sensation que des dents ont bougé depuis la fin du traitement.',
            'Une gêne persistante de la gencive au contact du dispositif.',
            'La perte du dispositif amovible : mieux vaut le signaler rapidement que d’attendre le contrôle suivant.',
          ],
        }],
      },
    ],
    faq: [
      { question: 'La contention est-elle vraiment obligatoire ?', answer: 'Sans contention, une récidive est probable. Elle fait partie du traitement et non d’une option : la phase active et la contention forment un ensemble.' },
      { question: 'Combien de temps dois-je porter ma contention ?', answer: 'Il n’existe pas de durée au-delà de laquelle le risque disparaît. Le rythme peut être allégé avec le temps, mais un maintien prolongé est nécessaire pour préserver le résultat.' },
      { question: 'Que faire si mon fil se décolle ?', answer: 'Contactez le cabinet sans attendre le contrôle suivant. Un fil partiellement décollé peut laisser des dents se déplacer et constituer une gêne pour la gencive.' },
      { question: 'Mes dents ont rebougé malgré la contention : est-ce normal ?', answer: 'Cela justifie un examen. L’origine peut tenir au dispositif, à son port ou à une évolution naturelle. Le constater tôt permet souvent une réponse plus simple.' },
      { question: 'La contention est-elle comprise dans le devis ?', answer: 'Cela dépend du devis établi. C’est un poste à vérifier explicitement avant d’accepter, ainsi qu’auprès de votre complémentaire santé.' },
    ],
    ctaTitle: 'Faire le point sur votre contention',
    ctaText: 'Que vous prépariez un traitement ou que vous constatiez un déplacement après un ancien appareil, un examen permet de savoir où vous en êtes.',
    links: ['/orthodontie-invisible-sete/', '/blog/dents-qui-rebougent-apres-appareil-sete/', '/remboursement-orthodontie-adulte/', '/prix-orthodontie-invisible-sete/', '/orthodontie-sete/'],
  }),
]

export const decisionPages = [...implantDecisionPages, ...implantLocalPages, ...orthodontieGapPages]
