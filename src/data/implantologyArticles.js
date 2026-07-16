const editorial = {
  cluster: 'implantologie',
  category: 'Implantologie',
  badge: 'Guide patient · Implantologie',
  authorName: 'Équipe éditoriale du cabinet',
  medicalReviewStatus: 'pending',
  medicalReviewer: null,
  datePublished: '2026-07-12',
  dateModified: '2026-07-13',
}

const makeArticle = ({ slug, title, description, intro, sections, faq, links = [] }) => ({
  ...editorial,
  url: `/blog/${slug}/`,
  path: `blog/${slug}`,
  menuLabel: title,
  menuDescription: description,
  title,
  metaDescription: description,
  h1: title,
  intro,
  excerpt: intro,
  highlights: [
    'Information générale qui ne remplace pas un examen clinique',
    'Bénéfices, limites et alternatives abordés avec prudence',
    'Repères prudents sur les étapes et les questions à poser au praticien',
  ],
  sections,
  faq,
  ctaTitle: 'Faire le point au cabinet',
  ctaText: 'Un bilan clinique permet de relier ces informations générales à votre situation et de discuter les options réellement pertinentes.',
  ctaLabel: 'Demander un pré-rendez-vous téléphonique',
  ctaHref: '/pre-rendez-vous/',
  internalLinks: ['/implantologie/', ...links],
  keywords: [],
})

export const implantologyArticles = [
  makeArticle({
    slug: 'etapes-pose-implant-dentaire',
    title: 'Les étapes de la pose d’un implant dentaire',
    description: 'Du bilan initial au suivi : comprendre les principales étapes d’un traitement implantaire et les délais qui peuvent varier selon la situation.',
    intro: 'La pose d’un implant ne se résume pas au jour de l’intervention. Le parcours commence par un bilan et se poursuit par des contrôles destinés à vérifier la cicatrisation avant la restauration définitive.',
    sections: [
      { heading: 'Le bilan avant toute décision', blocks: [{ subheading: 'Examiner la bouche et le contexte médical', paragraphs: ['Le praticien recueille les antécédents, les traitements en cours et les facteurs susceptibles d’influencer la cicatrisation. Il examine les dents, les gencives et l’espace à restaurer.', 'Une imagerie peut être indiquée pour étudier les volumes osseux et les structures voisines. Son choix dépend de la question clinique, et non d’un protocole identique pour tous.'] }] },
      { heading: 'La phase chirurgicale', blocks: [{ subheading: 'Mettre en place l’implant lorsque l’indication est confirmée', paragraphs: ['L’intervention est réalisée sous anesthésie locale dans la majorité des situations. Le protocole précis dépend de l’os disponible, des tissus et du projet prothétique.', 'Des consignes sont remises pour les premiers jours. Douleur, gonflement et gêne varient selon l’intervention et doivent être surveillés conformément aux instructions du cabinet.'] }] },
      { heading: 'Cicatrisation et restauration', blocks: [{ subheading: 'Respecter le temps biologique', paragraphs: ['Une période de cicatrisation est généralement nécessaire avant la réalisation de la dent prothétique. Sa durée ne peut pas être garantie à l’avance et dépend notamment de la stabilité initiale et de la réponse des tissus.', 'Les contrôles permettent de décider du moment adapté pour poursuivre. La couronne ou la prothèse est ensuite conçue en fonction de la situation clinique.'] }] },
    ],
    faq: [
      { question: 'Toutes les étapes sont-elles réalisées le même jour ?', answer: 'Non. Certains protocoles peuvent regrouper des étapes, mais beaucoup nécessitent plusieurs rendez-vous et une période de cicatrisation.' },
      { question: 'La durée est-elle la même pour chaque patient ?', answer: 'Non. Elle dépend du bilan, des éventuels soins préalables et de la cicatrisation.' },
    ],
    links: ['/blog/implant-dentaire-douleur-anesthesie-cicatrisation/'],
  }),
  makeArticle({
    slug: 'implant-dentaire-douleur-anesthesie-cicatrisation',
    title: 'Implant dentaire : douleur, anesthésie et cicatrisation',
    description: 'Ce qu’il faut savoir sur l’anesthésie locale, les suites possibles et les signes qui justifient de rappeler le cabinet après un implant.',
    intro: 'La peur de la douleur est fréquente avant une chirurgie implantaire. Il est utile de distinguer le confort pendant l’intervention, les suites attendues et les symptômes qui nécessitent un avis.',
    sections: [
      { heading: 'Pendant l’intervention', blocks: [{ subheading: 'Le rôle de l’anesthésie locale', paragraphs: ['L’anesthésie locale vise à éviter la douleur pendant le geste. Une sensation de pression ou de vibration peut toutefois être perçue.', 'Le praticien adapte la prise en charge au contexte médical et à l’anxiété exprimée. Toute gêne inhabituelle pendant l’acte doit être signalée immédiatement.'] }] },
      { heading: 'Les premiers jours', blocks: [{ subheading: 'Des suites variables', paragraphs: ['Une sensibilité, un gonflement ou un hématome peuvent survenir. Leur intensité dépend de l’étendue du geste et de la réponse individuelle.', 'Les médicaments et soins locaux ne doivent être suivis que selon la prescription ou les consignes remises. Il faut éviter l’automédication inadaptée.'] }] },
      { heading: 'Quand rappeler le cabinet', blocks: [{ subheading: 'Ne pas banaliser une évolution inhabituelle', paragraphs: ['Une douleur qui augmente fortement, un saignement persistant, une fièvre ou une gêne qui vous inquiète justifient de contacter le cabinet.', 'Ces exemples ne constituent pas une liste exhaustive. Les consignes personnalisées données après l’intervention restent prioritaires.'] }] },
    ],
    faq: [
      { question: 'La pose d’un implant est-elle indolore ?', answer: 'L’anesthésie vise à éviter la douleur pendant l’intervention, mais les sensations et les suites varient selon les personnes et le geste réalisé.' },
      { question: 'Combien de temps dure la gêne ?', answer: 'Il n’existe pas de durée unique. Le cabinet précise ce qui est attendu et les situations qui nécessitent de rappeler.' },
    ],
  }),
  makeArticle({
    slug: 'remplacer-dent-manquante-solutions',
    title: 'Remplacer une dent manquante : quelles solutions ?',
    description: 'Implant, bridge ou prothèse amovible : comprendre les grandes familles de solutions et pourquoi le bilan guide le choix.',
    intro: 'Une dent manquante peut être remplacée de plusieurs façons. L’implant n’est pas automatiquement la meilleure réponse : les dents voisines, les tissus, le contexte médical et les attentes orientent la discussion.',
    sections: [
      { heading: 'L’implant dentaire', blocks: [{ subheading: 'Une racine artificielle dans l’os', paragraphs: ['L’implant sert de support à une couronne ou à une prothèse. Il évite, dans certaines situations, de s’appuyer sur les dents voisines.', 'Il nécessite une chirurgie et des conditions locales et générales compatibles. Le bilan évalue ces éléments et les alternatives.'] }] },
      { heading: 'Le bridge dentaire', blocks: [{ subheading: 'S’appuyer sur les dents adjacentes', paragraphs: ['Un bridge peut remplacer une dent en utilisant des dents voisines comme supports. Sa pertinence dépend notamment de leur état et du projet global.', 'Le praticien explique les conséquences sur les dents supports, l’entretien et la durée de suivi attendue.'] }] },
      { heading: 'La prothèse amovible', blocks: [{ subheading: 'Une solution qui peut répondre à certaines situations', paragraphs: ['Une prothèse amovible peut remplacer une ou plusieurs dents. Elle demande une période d’adaptation et un entretien quotidien.', 'Le confort, la stabilité et le coût doivent être discutés avec les autres options, sans réduire la décision à un seul critère.'] }] },
    ],
    faq: [
      { question: 'L’implant est-il toujours préférable ?', answer: 'Non. Le choix dépend de la situation clinique, des risques, des alternatives et des préférences éclairées du patient.' },
      { question: 'Peut-on laisser l’espace vide ?', answer: 'Cela dépend de sa localisation et de ses conséquences possibles. Un examen permet d’en discuter.' },
    ],
  }),
  makeArticle({
    slug: 'bilan-imagerie-avant-implant',
    title: 'Bilan et imagerie avant un implant dentaire',
    description: 'Pourquoi l’examen clinique et l’imagerie, lorsqu’elle est indiquée, sont essentiels avant d’étudier un projet implantaire.',
    intro: 'La sécurité d’un projet implantaire repose d’abord sur la compréhension de la situation. L’imagerie complète l’examen lorsqu’elle répond à une question clinique précise.',
    sections: [
      { heading: 'Ce que recherche l’examen clinique', blocks: [{ subheading: 'Dents, gencives, occlusion et hygiène', paragraphs: ['Le praticien observe l’espace à restaurer, l’état des dents voisines et des gencives, ainsi que la manière dont les dents se rencontrent.', 'Les habitudes d’hygiène, le tabagisme, certaines maladies et certains médicaments peuvent modifier l’évaluation et la discussion des risques.'] }] },
      { heading: 'Ce que peut apporter l’imagerie', blocks: [{ subheading: 'Étudier les volumes et les structures anatomiques', paragraphs: ['Selon les besoins, une radiographie ou une imagerie en trois dimensions peut aider à évaluer l’os et les structures à respecter.', 'L’imagerie ne remplace pas l’examen. Elle doit être interprétée avec les données cliniques et le projet de restauration.'] }] },
      { heading: 'Planifier avant d’intervenir', blocks: [{ subheading: 'Penser la future dent', paragraphs: ['La position d’un implant est étudiée en fonction de la future restauration et de l’environnement biologique.', 'Le plan peut évoluer si le bilan révèle un besoin de soin préalable, une alternative plus adaptée ou un risque qui modifie l’indication.'] }] },
    ],
    faq: [
      { question: 'Un scanner 3D est-il toujours nécessaire ?', answer: 'Non. Le praticien choisit l’examen adapté à la situation et à la question clinique.' },
      { question: 'Peut-on décider sur une simple photo ?', answer: 'Non. Une photo ne permet pas d’évaluer les tissus, l’os ni l’ensemble des facteurs médicaux.' },
    ],
  }),
  makeArticle({
    slug: 'entretien-duree-vie-implant-dentaire',
    title: 'Entretien et durée de vie d’un implant dentaire',
    description: 'Hygiène, contrôles et facteurs de risque : ce qui contribue au suivi d’un implant sans promettre une durée garantie.',
    intro: 'Un implant ne dispense pas de suivi. Sa stabilité à long terme dépend de nombreux facteurs, dont l’hygiène, la santé des tissus, les contrôles et les contraintes mécaniques.',
    sections: [
      { heading: 'L’entretien quotidien', blocks: [{ subheading: 'Nettoyer autour de la restauration', paragraphs: ['Le brossage et les moyens d’hygiène interdentaires sont adaptés à la forme de la restauration et à l’accessibilité.', 'Le cabinet peut montrer les gestes et réévaluer leur efficacité lors des rendez-vous de contrôle.'] }] },
      { heading: 'Les contrôles au cabinet', blocks: [{ subheading: 'Surveiller les tissus et la mécanique', paragraphs: ['Les contrôles servent à examiner les gencives, la stabilité de la restauration et l’occlusion. Une imagerie peut être proposée lorsqu’elle est justifiée.', 'Une gêne, un saignement ou une mobilité perçue ne doivent pas attendre le prochain contrôle programmé.'] }] },
      { heading: 'Pourquoi aucune durée ne peut être garantie', blocks: [{ subheading: 'Des facteurs biologiques et mécaniques', paragraphs: ['Le tabagisme, certaines maladies, l’hygiène, le bruxisme et les contraintes sur la prothèse peuvent influencer l’évolution.', 'Parler de durée de vie consiste donc à expliquer les facteurs de risque et la maintenance, pas à promettre un nombre d’années identique pour tous.'] }] },
    ],
    faq: [
      { question: 'Un implant dure-t-il toute la vie ?', answer: 'Aucune durée ne peut être garantie. Un suivi régulier et une hygiène adaptée contribuent à limiter certains risques.' },
      { question: 'Faut-il détartrer autour d’un implant ?', answer: 'Le suivi professionnel est adapté à la situation. Le praticien ou l’équipe indique les soins et instruments appropriés.' },
    ],
  }),
  makeArticle({
    slug: 'aligner-dents-avant-pose-implant',
    title: 'Aligner les dents avant la pose d’un implant',
    description: 'Dans certains projets, un alignement orthodontique peut préparer l’espace avant un implant. Comprendre la chronologie et ses limites.',
    intro: 'Lorsqu’une dent manque et que les dents voisines se sont déplacées, l’espace disponible peut ne plus correspondre au projet de restauration. Une coordination orthodontique et implantaire peut alors être étudiée.',
    sections: [
      { heading: 'Pourquoi l’espace peut changer', blocks: [{ subheading: 'Les dents voisines peuvent se déplacer', paragraphs: ['Après la perte d’une dent, des migrations ou inclinaisons peuvent modifier la largeur et la forme de l’espace.', 'Cela ne signifie pas qu’un alignement est toujours nécessaire, mais qu’il faut penser la position des dents avant de fixer une restauration implantaire.'] }] },
      { heading: 'L’orthodontie avant l’implant', blocks: [{ subheading: 'Préparer lorsque cela apporte un bénéfice clinique', paragraphs: ['Des mouvements ciblés peuvent parfois recréer un espace ou améliorer les rapports entre les dents. La faisabilité dépend de l’occlusion, des tissus et des objectifs.', 'L’implant, une fois intégré à l’os, ne se déplace pas comme une dent naturelle. La chronologie doit donc être planifiée en amont.'] }] },
      { heading: 'Une décision coordonnée', blocks: [{ subheading: 'Éviter d’additionner des traitements inutiles', paragraphs: ['Le but n’est pas de proposer systématiquement deux traitements, mais d’identifier l’ordre le plus cohérent lorsque les deux sont indiqués.', 'Le bilan explique aussi les alternatives et les conséquences d’un projet plus simple.'] }] },
    ],
    faq: [
      { question: 'Faut-il toujours aligner avant un implant ?', answer: 'Non. Cette séquence n’est étudiée que lorsqu’elle apporte un intérêt clinique au projet global.' },
      { question: 'Peut-on déplacer un implant avec des aligneurs ?', answer: 'Un implant intégré à l’os ne se déplace pas comme une dent. C’est pourquoi la chronologie doit être anticipée.' },
    ],
    links: ['/orthodontie-invisible-sete/'],
  }),
]
