export interface KnowledgeTopic {
  keywords: string[];
  title: string;
  response: string;
  suggestedQuestions?: string[];
}

export const OFFLINE_KNOWLEDGE: KnowledgeTopic[] = [
  {
    keywords: ['équation', 'premier degré', 'degre', 'ax+b', 'resoudre equation'],
    title: 'Résolution d’une équation du premier degré (ax + b = 0)',
    response: `Pour résoudre une équation du 1er degré à une inconnue x (ax + b = 0, avec a ≠ 0) :

1. Regrouper les termes en x d'un côté du signe égal et les termes constants de l'autre (en changeant le signe lorsqu'un terme traverse l'égalité) :
   ax = -b
2. Isoler x en divisant chaque membre par le coefficient a :
   x = -b / a
3. Conclure par l'ensemble des solutions S = {-b / a} et vérifier.

📌 Exemple pas-à-pas :
Soit : 3x - 12 = 0
• On ajoute 12 des deux côtés : 3x = 12
• On divise par 3 : x = 12 / 3 = 4
• Solution : S = {4}.

💡 Astuce Examen (BFEM / Collège) : Pensez toujours à vérifier votre solution en remplaçant x dans l'équation de départ !`,
    suggestedQuestions: [
      'Comment résoudre une équation du second degré avec le discriminant Δ ?',
      'Comment factoriser avec les identités remarquables ?',
      'Explique-moi les systèmes de 2 équations à 2 inconnues'
    ]
  },
  {
    keywords: ['second degré', 'discriminant', 'delta', 'polynome', 'ax2+bx+c'],
    title: 'Résolution d’une équation du second degré (ax² + bx + c = 0)',
    response: `Pour résoudre ax² + bx + c = 0 (avec a ≠ 0) dans ℝ :

1. On calcule le discriminant :
   Δ = b² - 4ac

2. Selon le signe de Δ :
   • Si Δ > 0 : Deux solutions réelles distinctes :
     x₁ = (-b - √Δ) / (2a)
     x₂ = (-b + √Δ) / (2a)
     Forme factorisée : a(x - x₁)(x - x₂)

   • Si Δ = 0 : Une solution double :
     x₀ = -b / (2a)
     Forme factorisée : a(x - x₀)²

   • Si Δ < 0 : Pas de solution réelle (S = ∅). Le trinôme garde le signe de a pour tout x.`,
    suggestedQuestions: [
      'Comment dresser le tableau de signe d’un trinôme ?',
      'Qu’est-ce qu’une asymptote verticale ou horizontale ?'
    ]
  },
  {
    keywords: ['pythagore', 'triangle rectangle', 'hypotenuse'],
    title: 'Le Théorème de Pythagore (Classe de 4e / 3e / BFEM)',
    response: `📐 Théorème direct de Pythagore :
Dans un triangle rectangle, le carré de la longueur de l'hypoténuse (le plus long côté, opposé à l'angle droit) est égal à la somme des carrés des longueurs des deux autres côtés.

Formule : Si le triangle ABC est rectangle en A, alors :
BC² = AB² + AC²

🔍 Réciproque de Pythagore :
Sert à prouver qu'un triangle est rectangle !
Si dans un triangle ABC le plus grand côté vérifie BC² = AB² + AC², alors le triangle ABC est rectangle en A.`,
    suggestedQuestions: [
      'Explique-moi le théorème de Thalès',
      'Comment calculer le cosinus et le sinus dans un triangle rectangle ?'
    ]
  },
  {
    keywords: ['thales', 'theoreme thales', 'proportionnalite', 'droites paralleles'],
    title: 'Le Théorème de Thalès (Programme BFEM Sénégal)',
    response: `📏 Théorème de Thalès :
Soient deux droites (d) et (d') sécantes en un point A.
Soient B et M deux points de (d) distincts de A.
Soient C et N deux points de (d') distincts de A.

Si les droites (BC) et (MN) sont parallèles, alors :
AM / AB = AN / AC = MN / BC.

📌 Réciproque de Thalès :
Sert à démontrer que deux droites sont parallèles si les rapports sont égaux et si les points sont alignés dans le même ordre.`,
    suggestedQuestions: [
      'Comment résoudre un système d’équations au BFEM ?',
      'Quelle est la différence entre médiane et moyenne en statistiques ?'
    ]
  },
  {
    keywords: ['participe passé', 'participe passe', 'avoir', 'etre', 'accord participe'],
    title: 'Règles d’accord du Participe Passé en Français',
    response: `Règles fondamentales d’accord du participe passé :

1. Employé sans auxiliaire (comme adjectif) :
   Il s'accorde en genre et en nombre avec le nom qu'il qualifie.
   Exemple : « Des leçons apprises avec rigueur. »

2. Avec l'auxiliaire ÊTRE :
   Il s'accorde TOUJOURS en genre et en nombre avec le SUJET du verbe.
   Exemple : « Les élèves sont arrivés à l'école de Pikine. »

3. Avec l'auxiliaire AVOIR :
   Il ne s'accorde JAMAIS avec le sujet !
   Il s'accorde avec le Complément d'Objet Direct (COD) UNIQUEMENT si celui-ci est placé AVANT le verbe.
   Exemple sans accord (COD après) : « Fatou a préparé ces exercices. » (COD = ces exercices, placé après).
   Exemple avec accord (COD avant) : « Les exercices que Fatou a préparés. » (COD = que, mis pour les exercices, masculin pluriel).`,
    suggestedQuestions: [
      'Comment accorder les verbes pronominaux ?',
      'Quelle est la différence entre un nom et un verbe ?',
      'Quand utilise-t-on le subjonctif présent ?'
    ]
  },
  {
    keywords: ['nom', 'verbe', 'nature mot', 'difference nom verbe'],
    title: 'Différence entre le Nom et le Verbe',
    response: `• Le NOM (substantif) :
Désigne une personne, un animal, un objet, un lieu ou une idée abstraite.
Il est généralement précédé d'un déterminant (le, la, un, cette...).
Exemples : un livre, la Casamance, un lion, la persévérance.

• Le VERBE :
Exprime une action accomplie ou subie par le sujet, ou indique un état.
Il se conjugue (change de forme selon le temps, le mode et la personne).
Exemples : étudier, écrire, réussir, être, sembler.

💡 Astuce : Si vous pouvez mettre "je", "tu", "nous" devant le mot, c'est un VERBE !`,
    suggestedQuestions: [
      'Qu’est-ce qu’un adjectif qualificatif ?',
      'Quelles sont les figures de style courantes au Bac ?'
    ]
  },
  {
    keywords: ['photosynthese', 'plantes', 'chlorophylle', 'dioxyde carbone'],
    title: 'La Photosynthèse (SVT Collège & Lycée)',
    response: `🌿 La Photosynthèse :
Processus biologique fondamental par lequel les végétaux chlorophylliens (plantes vertes) synthétisent de la matière organique (glucides comme le glucose) à partir d'eau, de sels minéraux et de dioxyde de carbone (CO₂), en utilisant l'énergie lumineuse du soleil captée par la chlorophylle.

Formule chimique globale :
6 CO₂ + 6 H₂O + Énergie lumineuse ➔ C₆H₁₂O₆ (glucose) + 6 O₂ (dioxygène libéré)

Les deux phases :
1. Phase photochimique (dépendante de la lumière) dans les thylakoïdes des chloroplastes : photolyse de l'eau et production d'ATP.
2. Phase chimique (cycle de Calvin, indépendante de la lumière) dans le stroma : fixation du carbone.`,
    suggestedQuestions: [
      'Explique-moi les organites de la cellule végétale',
      'Quelle est la différence entre mitose et méiose ?'
    ]
  },
  {
    keywords: ['lat dior', 'damel', 'cayor', 'histoire senegal', 'dekheule'],
    title: 'Lat-Dior Ngoné Latyr Diop - Résistance anticoloniale au Sénégal',
    response: `🇸🇳 Lat-Dior Ngoné Latyr Diop (1842 - 1886) :
Damel du Cayor et figure emblématique de la résistance sénégalaise contre la conquête coloniale française menée par Louis Faidherbe.

Faits historiques clés :
• Cause principale du conflit : Son refus catégorique de laisser les Français construire la voie ferrée reliant Dakar à Saint-Louis à travers les terres agricoles du Cayor.
• Batailles célèbres : Victoire éclatante à Ngolgol (1863), puis résistance acharnée.
• Fin héroïque : Il tombe sur le champ d'honneur le 27 octobre 1886 lors de la bataille de Dékheulé, aux côtés de ses compagnons et de son cheval légendaire Malaw.

Héritage : Lat-Dior symbolise l'intégrité, le sens de l'honneur ("Jom" en wolof) et le patriotisme national sénégalais.`,
    suggestedQuestions: [
      'Qui était Aline Sitoé Diatta ?',
      'Quels étaient les 4 grands royaumes du Sénégal ?',
      'Quand le Sénégal a-t-il accédé à l’indépendance ?'
    ]
  },
  {
    keywords: ['dissertation', 'philosophie', 'methode', 'plan philo', 'bac philo'],
    title: 'Méthodologie de la Dissertation Philosophique au Baccalauréat',
    response: `🎓 Structure de la Dissertation Philosophique (Baccalauréat Sénégal) :

1. L'INTRODUCTION (en 4 temps indissociables) :
   • Amorce (contexte historique, citation ou constat général)
   • Définition des termes clés et paradoxe
   • Problématique formulée clairement
   • Annonce du plan (dialectique : Thèse, Antithèse, Synthèse/Dépassement)

2. LE DÉVELOPPEMENT :
   • Partie 1 (Thèse) : Justifier la position apparente du sujet avec arguments solides et références philosophiques.
   • Transition soignée.
   • Partie 2 (Antithèse) : Mettre en lumière les limites, apories ou dangers de la thèse.
   • Transition.
   • Partie 3 (Synthèse) : Proposer un dépassement qui élève le débat sans se contenter d'un simple compromis mou.

3. LA CONCLUSION :
   • Bilan rigoureux du cheminement réflexif
   • Réponse précise à la question posée
   • Ouverture intellectuelle.`,
    suggestedQuestions: [
      'Quels sont les auteurs clés sur la notion d’État ?',
      'Comment rédiger un commentaire composé en français ?'
    ]
  },
  {
    keywords: ['cfee', 'bfem', 'bac', 'reviser', 'conseils examen', 'reussir examen'],
    title: 'Guide d’Excellence pour Réussir les Examens au Sénégal (CFEE, BFEM, BAC)',
    response: `🌟 Les 5 Piliers de la Réussite aux Examens Nationaux :

1. 📅 Le planning régulier :
   Ne révisez pas au dernier moment. 1h30 chaque soir vaut mieux qu'une nuit blanche avant l'épreuve.
2. ✍️ Pratiquez sur les annales officielles :
   Faites au moins 5 sujets d'examens des années précédentes en temps réel chrono (épreuves de mathématiques, dictée, SVT, philo).
3. 📝 Les fiches de synthèse :
   Résumez chaque leçon en 1 page avec les formules encadrées, les définitions exactes et 1 exemple type.
4. 🧠 La méthode Pomodoro :
   25 minutes de concentration intense, 5 minutes de pause. Cela décuple la mémorisation durable.
5. 🇸🇳 La gestion du stress :
   Un sommeil réparateur (8h), une bonne alimentation locale équilibrée et une lecture posée des consignes le jour J !`,
    suggestedQuestions: [
      'Comment organiser ses révisions à 1 mois du Bac ?',
      'Quels sont les pièges fréquents en mathématiques au BFEM ?'
    ]
  }
];

export function findOfflineAnswer(userQuery: string): { text: string; followUps: string[] } {
  const query = userQuery.toLowerCase().trim();

  // Search through topics
  for (const topic of OFFLINE_KNOWLEDGE) {
    const match = topic.keywords.some(kw => query.includes(kw.toLowerCase()));
    if (match) {
      return {
        text: topic.response,
        followUps: topic.suggestedQuestions || [
          'Donne-moi un autre exemple',
          'Comment appliquer cela dans un devoir ?',
          'Quelles sont les formules clés à retenir ?'
        ]
      };
    }
  }

  // Fallback by subject classification
  if (query.includes('math') || query.includes('calcul') || query.includes('geometrie') || query.includes('chiffre')) {
    return {
      text: `Je peux vous aider en mathématiques (du CI à la Terminale S) ! 📊\n\nSujets fréquents du programme sénégalais :\n• Calcul littéral, développement et factorisation\n• Théorèmes de Pythagore et Thalès (BFEM)\n• Équations, inéquations et systèmes\n• Fonctions, limites, dérivées, primitives et intégrales (Bac S)\n• Probabilités et suites numériques\n\nPosez-moi votre exercice ou une question précise sur une notion !`,
      followUps: [
        'Comment résoudre une équation du premier degré ?',
        'Explique-moi le théorème de Thalès',
        'Résolution avec le discriminant Delta'
      ]
    };
  }

  if (query.includes('francais') || query.includes('grammaire') || query.includes('conjug') || query.includes('ortho') || query.includes('texte')) {
    return {
      text: `Je suis prêt à vous guider en Français et Lettres ! 📝\n\nNotions clés pour les élèves et candidats :\n• Accords complexes (participe passé, adjectifs de couleur)\n• Conjugaison (subjonctif, conditionnel, passé simple)\n• Nature et fonction grammaticale des propositions\n• Analyse de texte et commentaire littéraire\n• Dissertation littéraire pour le Bac L (Senghor, Césaire, Kane)\n\nQuelle règle ou quel texte souhaitez-vous analyser ?`,
      followUps: [
        'Règles d’accord du participe passé',
        'Différence entre nom et verbe',
        'Comment rédiger une bonne introduction ?'
      ]
    };
  }

  if (query.includes('senegal') || query.includes('histoire') || query.includes('geo') || query.includes('afrique')) {
    return {
      text: `Je peux vous accompagner en Histoire-Géographie du Sénégal et d’Afrique ! 🇸🇳\n\nThèmes au programme :\n• Les anciens empires et royaumes (Djolof, Cayor, Baol, Waalo, Fouta)\n• Les figures de la résistance : Lat-Dior, Alboury Ndiaye, Aline Sitoé Diatta, El Hadji Oumar Tall\n• La colonisation, les 4 communes (Saint-Louis, Gorée, Rufisque, Dakar) et l'indépendance de 1960\n• Géographie physique et humaine : les 14 régions du Sénégal, l'agriculture, la pêche et le Sahel.\n\nQuel chapitre révisez-vous actuellement ?`,
      followUps: [
        'Raconte-moi l’histoire de Lat-Dior',
        'Quels sont les royaumes traditionnels du Sénégal ?',
        'Comment préparer le CFEE en Histoire-Géo ?'
      ]
    };
  }

  return {
    text: `Bonjour ! Je suis votre Assistant Pédagogique pour Book Education Sénégal. 🤖🇸🇳\n\nJe suis spécialement conçu pour accompagner les élèves, parents et enseignants du CI au Baccalauréat (Séries S et L).\n\nVous pouvez me demander :\n• « Comment résoudre une équation du second degré ? »\n• « Explique-moi la photosynthèse »\n• « Quelle est la règle d’accord du participe passé avec avoir ? »\n• « Comment réussir la dissertation de philosophie au Bac ? »\n• « Raconte-moi la résistance de Lat-Dior »\n\nSur quoi travaillez-vous aujourd'hui ?`,
    followUps: [
      'Comment résoudre une équation du premier degré ?',
      'Explique-moi le théorème de Pythagore',
      'Règles d’accord du participe passé',
      'Conseils pour réussir le Bac / BFEM / CFEE'
    ]
  };
}
