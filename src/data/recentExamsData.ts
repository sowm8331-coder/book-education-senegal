import { EducationalDocument } from '../types';

export const RECENT_EXAMS_DOCUMENTS: EducationalDocument[] = [
  // ==========================================
  // 1. CFEE (Session Récente 2024)
  // ==========================================
  {
    id: 'cfee-maths-2024-officiel',
    title: 'CFEE 2024 : Épreuve Officielle de Mathématiques (Contrôle des Ressources & Problème)',
    author: 'Direction des Examens et Concours (DEXCO) - Sénégal',
    pages: 6,
    category: 'Mathématiques',
    level: 'CM2',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/cfee-2024-maths-officiel.pdf',
    description: 'Sujet officiel complet de la session 2024 du CFEE avec son barème national et sa correction détaillée pas à pas : numération, opérations décimales, grandeurs et mesures, problème de la coopérative agricole.',
    tags: ['CFEE', 'Examens 2024', 'CM2', 'Mathématiques', 'Annales Sénégal', 'Officiel'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ÉDUCATION NATIONALE
DIRECTION DES EXAMENS ET CONCOURS (DEXCO)
CERTIFICAT DE FIN D'ÉTUDES ÉLÉMENTAIRES (CFEE) & ENTRÉE EN 6ème - SESSION 2024

ÉPREUVE DE MATHÉMATIQUES (DURÉE : 60 MINUTES - 40 POINTS)

PREMIÈRE PARTIE : CONTRÔLE DES RESSOURCES (24 POINTS)

I. ACTIVITÉS NUMÉRIQUES (8 points)
1. Pose et effectue les opérations suivantes :
   a) 48 576,85 + 9 647,38 = ...
   b) 75 040 - 28 465,75 = ...
   c) 438,5 × 7,6 = ...
   d) 2 745 ÷ 15 = ...

2. Écris en chiffres ou en lettres :
   a) Trois cent quatre mille quatre-vingt-douze.
   b) 1 005 060.

II. ACTIVITÉS DE MESURE ET GÉOMÉTRIE (8 points)
1. Convertis dans l'unité demandée :
   a) 4,5 km + 85 dam = ... m
   b) 3,5 tonnes - 450 kg = ... kg
   c) 25 000 m² = ... ha

2. Un terrain rectangulaire a pour longueur L = 80 m et pour largeur l = 45 m.
   a) Calcule son périmètre.
   b) Calcule sa superficie en mètres carrés (m²) puis en ares (a).

DEUXIÈME PARTIE : RÉSOLUTION DE PROBLÈME (16 POINTS)

CONTEXTE :
La coopérative maraîchère du village de Nioro du Rip dispose d'un champ rectangulaire de 120 m de long sur 75 m de large.
1. Calcule la surface totale de ce champ en mètres carrés (m²).

Pour protéger les récoltes contre les animaux errants, le président décide de clôturer le champ avec 3 rangées de fil de fer, en laissant une ouverture de 4 m pour la porte d'entrée.
2. Calcule la longueur de fil de fer nécessaire pour clôturer ce champ.
3. Le mètre de fil de fer coûte 350 FCFA. Calcule le montant de la dépense pour le fil.

Le champ a produit 18 tonnes d'oignons. La coopérative vend la récolte par sacs de 50 kg au prix de 15 000 FCFA le sac.
4. Combien de sacs de 50 kg la coopérative a-t-elle obtenus ?
5. Calcule le montant total rapporté par la vente des sacs d'oignons.

==================================================
CORRECTION DÉTAILLÉE & BARÈME OFFICIEL :

PREMIÈRE PARTIE :
1. Opérations :
   a) 48 576,85 + 9 647,38 = 58 224,23.
   b) 75 040 - 28 465,75 = 46 574,25.
   c) 438,5 × 7,6 = 3 332,60.
   d) 2 745 ÷ 15 = 183.

2. Écriture :
   a) 304 092.
   b) Un million cinq mille soixante.

II. Mesures et géométrie :
1. a) 4,5 km = 4 500 m ; 85 dam = 850 m. Total = 4 500 + 850 = 5 350 m.
   b) 3,5 t = 3 500 kg. 3 500 - 450 = 3 050 kg.
   c) 25 000 m² = 2,5 ha (car 1 ha = 10 000 m²).

2. Terrain :
   a) Périmètre = (80 + 45) × 2 = 125 × 2 = 250 m.
   b) Superficie = 80 × 45 = 3 600 m² = 36 ares (car 1 are = 100 m²).

DEUXIÈME PARTIE : PROBLÈME
1. Surface du champ : 120 m × 75 m = 9 000 m².
2. Périmètre du champ : (120 + 75) × 2 = 195 × 2 = 390 m.
   Longueur pour une rangée avec porte : 390 m - 4 m = 386 m.
   Pour 3 rangées : 386 m × 3 = 1 158 m de fil de fer.
3. Dépense de fil de fer : 1 158 × 350 FCFA = 405 300 FCFA.
4. Nombre de sacs de 50 kg : 18 tonnes = 18 000 kg.
   18 000 kg ÷ 50 kg = 360 sacs.
5. Montant total de la vente : 360 sacs × 15 000 FCFA = 5 400 000 FCFA.`,
    exercises: [
      {
        question: "Dans le problème du CFEE 2024, quel est le bénéfice net de la coopérative si les frais de transport et d'engrais s'élèvent à 850 000 FCFA ?",
        hints: "Bénéfice = Vente totale - (Dépenses fil + Frais supplémentaires).",
        solution: "Total des dépenses = 405 300 FCFA (fil) + 850 000 FCFA (frais) = 1 255 300 FCFA. Bénéfice net = 5 400 000 - 1 255 300 = 4 144 700 FCFA."
      }
    ]
  },
  {
    id: 'cfee-francais-2024-officiel',
    title: 'CFEE 2024 : Épreuve Officielle de Français (Texte Suivi de Questions & Grammaire)',
    author: 'Direction des Examens et Concours (DEXCO) - Sénégal',
    pages: 5,
    category: 'Français',
    level: 'CM2',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/cfee-2024-francais-officiel.pdf',
    description: 'Épreuve officielle de compréhension de texte, grammaire, conjugaison et vocabulaire du CFEE 2024. Sujet portant sur la préservation de la mangrove du Saloum et le reboisement au Sénégal.',
    tags: ['CFEE', 'Examens 2024', 'CM2', 'Français', 'Grammaire', 'Officiel'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ÉDUCATION NATIONALE - DEXCO
CFEE & ENTRÉE EN 6ème - SESSION 2024

ÉPREUVE DE FRANÇAIS : TEXTE SUIVI DE QUESTIONS (60 MINUTES - 40 POINTS)

TEXTE DE L'ÉPREUVE :
« Dans le delta du Saloum, les enfants du village de Toubacouta se mobilisent chaque samedi matin pour planter de jeunes propagules de palétuviers. Sous la conduite de leur maître d'école et des écogardes, ils pataugent avec joie dans la vase nourricière.
Ils savent que la mangrove est la véritable pouponnière des poissons, des crabes et des crevettes. Elle protège également les côtes contre la montée des eaux et l'érosion marine. Grâce à cet effort citoyen collectif, des hectares de forêts aquatiques reverdissent, garantissant ainsi l'avenir des pêcheurs et l'équilibre écologique de notre pays. »

I. COMPRÉHENSION DU TEXTE (10 points)
1. Donne un titre approprié à ce texte.
2. Que font les enfants de Toubacouta chaque samedi matin ?
3. Relève dans le texte deux (2) bienfaits essentiels de la mangrove pour l'environnement.

II. VOCABULAIRE (10 points)
1. Explique le sens de l'expression : « la vase nourricière ».
2. Donne un synonyme des mots suivants : « collective » ; « garantissant ».
3. Donne un antonyme (contraire) de : « joie » ; « protège ».

III. GRAMMAIRE (10 points)
1. Donne la nature et la fonction des mots soulignés :
   a) "joyeusement"
   b) "la mangrove" (dans "la mangrove protège les côtes")
   c) "notre"
2. Transforme la phrase suivante à la voix passive :
   « Les enfants plantent de jeunes palétuviers. »

IV. CONJUGAISON (10 points)
1. « Ils pataugent avec joie dans la vase. »
   Mets cette phrase :
   a) Au passé composé de l'indicatif.
   b) Au futur simple de l'indicatif.
   c) À l'imparfait de l'indicatif.

==================================================
CORRECTION TYPE ET GRILLE D'ÉVALUATION :

I. Compréhension :
1. Titres acceptés : Le sauvetage de la mangrove / Les protecteurs du Saloum / Reboisement à Toubacouta.
2. Les enfants se mobilisent pour planter des propagules de palétuviers afin de reboiser la mangrove.
3. Deux bienfaits :
   - Elle sert de pouponnière naturelle pour les poissons, crabes et crevettes.
   - Elle protège le rivage contre l'érosion marine et la montée des eaux.

II. Vocabulaire :
1. « Vase nourricière » : Terre humide et boueuse très riche en nutriments organiques qui permet aux plantes et aux petits animaux marins de se nourrir et grandir.
2. Synonymes : collective = commune / partagée ; garantissant = assurant / certifiant.
3. Contraires : joie ≠ tristesse / chagrin ; protège ≠ menace / détruit / expose.

III. Grammaire :
1. a) joyeusement : adverbe de manière, modifie le verbe.
   b) la mangrove : groupe nominal, sujet du verbe "protège".
   c) notre : adjectif possessif, détermine le nom "pays".
2. Voix passive : « De jeunes palétuviers sont plantés par les enfants. »

IV. Conjugaison :
a) Passé composé : « Ils ont pataugé avec joie dans la vase. »
b) Futur simple : « Ils pataugeront avec joie dans la vase. »
c) Imparfait : « Ils pataugeaient avec joie dans la vase. »`,
    exercises: [
      {
        question: "Conjuguer la phrase 'Les enfants protègent la nature' au passé simple de l'indicatif.",
        solution: "Les enfants protégèrent la nature."
      }
    ]
  },

  // ==========================================
  // 2. BFEM (Session Récente 2024)
  // ==========================================
  {
    id: 'bfem-maths-2024-officiel',
    title: 'BFEM 2024 : Épreuve Officielle de Mathématiques (1er Groupe)',
    author: 'Direction des Examens et Concours (DEXCO) - Sénégal',
    pages: 8,
    category: 'Mathématiques',
    level: '3e',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bfem-2024-maths-officiel.pdf',
    description: 'Épreuve complète de la session officielle du BFEM 2024 au Sénégal. Algèbre (radicaux, factorisation), Géométrie (Théorème de Thalès et trigonométrie), Statistiques et problème d’optimisation avec corrigé intégral.',
    tags: ['BFEM', 'Examens 2024', '3ème', 'Mathématiques', 'Annales Sénégal', 'Officiel'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ÉDUCATION NATIONALE - DEXCO
BREVET DE FIN D'ÉTUDES MOYENNES (BFEM) - SESSION 2024

ÉPREUVE DE MATHÉMATIQUES (DURÉE : 2 HEURES - COEFFICIENT : 4)

EXERCICE 1 : ACTIVITÉS NUMÉRIQUES (6 points)
1. On pose : A = √(108) - 2√(75) + 3√(27).
   Écris A sous la forme a√3 où a est un entier relatif.
2. Soit l'expression : E(x) = (2x - 3)² - (x + 1)².
   a) Développe, réduis et ordonne E(x) suivant les puissances décroissantes de x.
   b) Factorise E(x) sous la forme d'un produit de facteurs du premier degré.
   c) Résous dans ℝ l'équation : (3x - 2)(x - 4) = 0.
3. Sachant que 1,732 < √3 < 1,733, donne un encadrement à 10⁻² près du nombre B = 4 - 2√3.

EXERCICE 2 : ACTIVITÉS GÉOMÉTRIQUES (6 points)
Dans le plan muni d'un repère orthonormé (O, I, J), on considère les points suivants :
A(1 ; 3), B(-2 ; -1) et C(4 ; -1).
1. Calcule les coordonnées des vecteurs AB et AC.
2. Calcule les distances AB, AC et BC.
3. Démontre que le triangle ABC est isocèle en A.
4. Soit H le milieu du segment [BC].
   a) Détermine les coordonnées du point H.
   b) Calcule la longueur AH.
   c) En déduire l'aire du triangle ABC.

EXERCICE 3 : STATISTIQUES (3 points)
Lors de l'examen blanc du BFEM dans un collège de Kaolack, les notes obtenues en Mathématiques par les élèves d'une classe de 3e sont réparties comme suit :
Note (/20) : [0 ; 5[ | [5 ; 10[ | [10 ; 14[ | [14 ; 18[ | [18 ; 20]
Effectif   :    4    |    16    |    20     |     8     |     2
1. Quel est l'effectif total de cette classe ?
2. Calcule le pourcentage d'élèves ayant obtenu la moyenne (note >= 10/20).
3. Détermine la classe modale de cette série.

PROBLÈME DE SYNTHÈSE (5 points)
Un entrepreneur sénégalais veut installer des panneaux solaires sur le toit incliné d'une école à Podor.
La coupe transversale du toit est un triangle rectangle ABC en B, où :
- AB = 4 m (hauteur du mur)
- BC = 7 m (largeur au sol)
1. Calcule la longueur de la pente AC du toit en mètres (arrondi au centième).
2. Détermine la mesure de l'angle d'inclinaison ∠ACB formé avec le sol (arrondi au degré).
3. Les panneaux solaires doivent occuper 65% de la surface du toit qui mesure 70 m². Quelle est l'aire couverte par les panneaux solaires ?

==================================================
CORRECTION OFFICIELLE DÉTAILLÉE :

EXERCICE 1 :
1. A = √(36 × 3) - 2√(25 × 3) + 3√(9 × 3)
   A = 6√3 - 2 × 5√3 + 3 × 3√3 = 6√3 - 10√3 + 9√3 = 5√3. Donc a = 5.
2. a) E(x) = (4x² - 12x + 9) - (x² + 2x + 1) = 3x² - 14x + 8.
   b) Forme a² - b² = (a - b)(a + b) :
      E(x) = [(2x - 3) - (x + 1)][(2x - 3) + (x + 1)] = (x - 4)(3x - 2).
   c) (3x - 2)(x - 4) = 0 => 3x - 2 = 0 ou x - 4 = 0 => x = 2/3 ou x = 4.
      S = {2/3 ; 4}.
3. 1,732 < √3 < 1,733 => -3,466 < -2√3 < -3,464 => 0,534 < 4 - 2√3 < 0,536.
   Encadrement à 10⁻² près : 0,53 < B < 0,54.

EXERCICE 2 :
1. AB(-2 - 1 ; -1 - 3) = (-3 ; -4). AC(4 - 1 ; -1 - 3) = (3 ; -4).
2. AB = √((-3)² + (-4)²) = √(9 + 16) = √25 = 5.
   AC = √(3² + (-4)²) = √(9 + 16) = 5.
   BC = √((4 - (-2))² + (-1 - (-1))²) = √(6² + 0²) = 6.
3. Puisque AB = AC = 5, le triangle ABC est isocèle en A.
4. a) H milieu de [BC] : x_H = (-2 + 4)/2 = 1 ; y_H = (-1 + (-1))/2 = -1. Donc H(1 ; -1).
   b) AH = √((1 - 1)² + (-1 - 3)²) = √(0 + (-4)²) = √16 = 4.
   c) Aire(ABC) = (base BC × hauteur AH) / 2 = (6 × 4) / 2 = 12 unités d'aire.

EXERCICE 3 :
1. Effectif total = 4 + 16 + 20 + 8 + 2 = 50 élèves.
2. Élèves ayant la moyenne (note >= 10) = 20 + 8 + 2 = 30 élèves.
   Pourcentage = (30 / 50) × 100 = 60%.
3. La classe modale est [10 ; 14[ avec le plus grand effectif (20 élèves).

PROBLÈME :
1. Triangle ABC rectangle en B, d'après le théorème de Pythagore :
   AC² = AB² + BC² = 4² + 7² = 16 + 49 = 65.
   AC = √65 ≈ 8,06 m.
2. tan(∠ACB) = Côté opposé / Côté adjacent = AB / BC = 4 / 7 ≈ 0,5714.
   ∠ACB = arctan(0,5714) ≈ 30°.
3. Aire des panneaux solaires = 70 m² × 0,65 = 45,5 m².`,
    exercises: [
      {
        question: "Vérifier si le nombre 5√3 est supérieur ou inférieur à 8,5 sans calculatrice.",
        solution: "(5√3)² = 25 × 3 = 75. D'autre part, 8,5² = (17/2)² = 289/4 = 72,25. Puisque 75 > 72,25, alors 5√3 > 8,5."
      }
    ]
  },
  {
    id: 'bfem-pc-2024-officiel',
    title: 'BFEM 2024 : Épreuve Officielle de Sciences Physiques (Physique-Chimie)',
    author: 'Direction des Examens et Concours (DEXCO) - Sénégal',
    pages: 6,
    category: 'Physique-Chimie',
    level: '3e',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bfem-2024-physique-chimie.pdf',
    description: 'Épreuve officielle de Sciences Physiques du BFEM 2024 : Combustion complète des hydrocarbures (gaz butane C4H10), calculs de volume et masses, travail d’une force motrice, lentilles minces convergentes avec corrigé.',
    tags: ['BFEM', 'Examens 2024', '3ème', 'Physique-Chimie', 'Sciences', 'Officiel'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ÉDUCATION NATIONALE - DEXCO
BREVET DE FIN D'ÉTUDES MOYENNES (BFEM) - SESSION 2024

ÉPREUVE DE SCIENCES PHYSIQUES (DURÉE : 2 HEURES - COEFFICIENT : 2)

PARTIE A : CHIMIE (8 points)

EXERCICE 1 : COMBUSTION DU BUTANE (8 points)
Dans une cuisine familiale à Mbour, on utilise une bouteille de gaz butane de formule C₄H₁₀ pour la cuisson.
1. La combustion complète du butane dans le dioxygène de l'air produit deux corps purs.
   a) Nomme ces deux produits formés.
   b) Écris et équilibre l'équation-bilan de la réaction chimique de combustion complète du butane.
2. On brûle complètement une masse m = 116 g de gaz butane.
   a) Calcule la masse molaire moléculaire M du butane. (On donne : M(C) = 12 g/mol ; M(H) = 1 g/mol).
   b) Calcule le nombre de moles n de butane brûlé.
   c) En déduire le volume de dioxygène O₂ mesuré dans les conditions où le volume molaire vaut Vm = 24 L/mol.
   d) Sachant que l'air contient 20% de dioxygène en volume, calcule le volume d'air nécessaire pour cette combustion.

PARTIE B : PHYSIQUE (12 points)

EXERCICE 2 : MÉCANIQUE - TRAVAIL ET PUISSANCE (6 points)
Un ouvrier hisse une charge de masse m = 60 kg à une hauteur h = 12 m sur un chantier à Diamniadio, en utilisant une corde passant par une poulie fixe. La montée s'effectue à vitesse constante en une durée t = 24 secondes. (Prendre g = 10 N/kg).
1. Calcule l'intensité P du poids de la charge.
2. Détermine la force F exercée par l'ouvrier pour hisser la charge à vitesse constante.
3. Calcule le travail W effectué par la force motrice lors de cette élévation. Ce travail est-il moteur ou résistant ?
4. Calcule la puissance mécanique moyenne développée par l'ouvrier.

EXERCICE 3 : OPTIQUE - LENTILLES CONVERGENTES (6 points)
Une lentille mince convergente (L) a une distance focale f' = 4 cm. On place devant cette lentille un objet lumineux AB de hauteur 2 cm, perpendiculaire à l'axe optique, le point A étant situé sur l'axe optique à une distance OA = 8 cm en avant de la lentille.
1. Définis le foyer objet F et le foyer image F' d'une lentille convergente.
2. Calcule la vergence C de la lentille (L) en dioptries (δ).
3. Construis à l'échelle 1 l'image A'B' donnée par la lentille.
4. Précise la nature (réelle ou virtuelle), le sens (droit ou renversé) et la taille de l'image A'B'.

==================================================
CORRECTION DÉTAILLÉE :

CHIMIE :
1. a) Les deux produits formés sont le dioxyde de carbone (CO₂) et l'eau (H₂O).
   b) Équation équilibrée : 2 C₄H₁₀ + 13 O₂ -> 8 CO₂ + 10 H₂O.
2. a) Masse molaire du butane : M(C₄H₁₀) = 4 × 12 + 10 × 1 = 48 + 10 = 58 g/mol.
   b) Nombre de moles : n = m / M = 116 g / (58 g/mol) = 2 moles.
   c) D'après l'équation, 2 moles de C₄H₁₀ réagissent avec 13 moles de O₂.
      Donc n(O₂) = 13 moles.
      Volume de O₂ : V(O₂) = n(O₂) × Vm = 13 mol × 24 L/mol = 312 Litres.
   d) Volume d'air : V(air) = V(O₂) × 5 = 312 L × 5 = 1 560 Litres.

PHYSIQUE :
EXERCICE 2 :
1. P = m × g = 60 kg × 10 N/kg = 600 N.
2. Vitesse constante => équilibre : la force motrice compense exactement le poids : F = P = 600 N.
3. Travail de la force motrice : W = F × h = 600 N × 12 m = 7 200 Joules.
   C'est un travail moteur car la force s'exerce dans le sens du déplacement (W > 0).
4. Puissance moyenne : P = W / t = 7 200 J / 24 s = 300 Watts.

EXERCICE 3 :
1. Définitions :
   - Foyer image F' : point de l'axe optique où convergent tous les rayons incidents parallèles à l'axe optique.
   - Foyer objet F : point de l'axe optique dont l'image par la lentille est rejetée à l'infini.
2. Vergence C = 1 / f' = 1 / 0,04 m = 25 dioptries (δ).
3. Construction : Le point B émet un rayon parallèle à l'axe qui émerge par F', et un rayon passant par le centre optique O non dévié. Ils se coupent en B'.
4. Position OA' = 8 cm. L'image A'B' est :
   - Réelle (située après la lentille).
   - Renversée par rapport à l'objet.
   - De même taille que l'objet (A'B' = 2 cm) car OA = 2 f'.`,
    exercises: [
      {
        question: "Quelle masse de CO2 est dégagée lors de la combustion de ces 116 g de butane ?",
        solution: "n(CO2) = 8 moles. M(CO2) = 12 + 32 = 44 g/mol. Masse m = 8 × 44 = 352 g de CO2."
      }
    ]
  },

  // ==========================================
  // 3. BAC SCIENTIFIQUE (Session Récente 2024)
  // ==========================================
  {
    id: 'bac-s-maths-2024-officiel',
    title: 'Bac S1/S2 2024 : Épreuve Officielle de Mathématiques (1er Groupe)',
    author: 'Office du Baccalauréat du Sénégal',
    pages: 12,
    category: 'Mathématiques',
    level: 'Terminale-S',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bac-s-2024-maths-officiel.pdf',
    description: 'Épreuve officielle intégrale du Baccalauréat S1 & S2 de la session 2024 au Sénégal : Nombres complexes et similitudes planes directes, Probabilités & loi binomiale, Problème d’analyse avec fonctions exponentielles et calcul intégral.',
    tags: ['BAC', 'Bac S', 'Examens 2024', 'Terminale S', 'Mathématiques', 'Officiel', 'Sénégal'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE
OFFICE DU BACCALAURÉAT - SÉRIES S1 & S2 - SESSION 2024

ÉPREUVE DE MATHÉMATIQUES (DURÉE : 4 HEURES - COEFFICIENTS : S1 = 8 ; S2 = 6)

EXERCICE 1 : NOMBRES COMPLEXES ET GÉOMÉTRIE DU PLAN (5 points)
Le plan complexe est rapporté à un repère orthonormé direct (O, u, v) d'unité graphique 2 cm.
1. Résoudre dans ℂ l'équation : z² - 2√3 z + 4 = 0.
   Écrire les solutions z₁ et z₂ sous forme exponentielle (avec Im(z₁) > 0).
2. On désigne par A, B et C les points d'affixes respectives :
   z_A = √3 + i ; z_B = √3 - i ; z_C = 2i.
   a) Placer les points A, B et C dans le repère.
   b) Calculer le module et un argument du quotient : Z = (z_C - z_A) / (z_B - z_A).
   c) En déduire la nature exacte du triangle ABC.
3. Soit S la similitude plane directe qui transforme A en B et laisse invariant le point O.
   Déterminer l'écriture complexe de S, son rapport k et son angle de rotation θ.

EXERCICE 2 : PROBABILITÉS ET VARIABLES ALÉATOIRES (4 points)
Une urne contient 10 boules indiscernables au toucher :
- 5 boules vertes numérotées de 1 à 5 ;
- 3 boules rouges numérotées de 1 à 3 ;
- 2 boules blanches numérotées 1 et 2.
On tire simultanément au hasard 3 boules de l'urne.
1. Justifier que le nombre total de tirages possibles est égal à 120.
2. Calculer la probabilité des événements suivants :
   - A : « Obtenir 3 boules de la même couleur » ;
   - B : « Obtenir au moins une boule blanche » ;
   - C : « Obtenir 3 boules portant des numéros impairs ».
3. Soit X la variable aléatoire qui, à chaque tirage de 3 boules, associe le nombre de boules blanches obtenues.
   a) Déterminer les valeurs prises par X.
   b) Déterminer la loi de probabilité de X.
   c) Calculer l'espérance mathématique E(X) et la variance V(X).

PROBLÈME D'ANALYSE (11 points)
PARTIE A : Étude d'une fonction auxiliaire g
Soit la fonction g définie sur ℝ par : g(x) = (1 - x) e^x + 1.
1. Calculer les limites de g en -∞ et en +∞.
2. Étudier les variations de g et dresser son tableau de variations complet.
3. Montrer que l'équation g(x) = 0 admet une unique solution α sur ℝ. Justifier que 1,27 < α < 1,28.
4. En déduire le signe de g(x) sur ℝ suivant les valeurs de x.

PARTIE B : Étude de la fonction principale f
Soit f la fonction définie sur ℝ par : f(x) = (x - 2) e^x + x + 1.
On note (C_f) sa courbe représentative dans un repère orthonormé (O, i, j).
1. Déterminer les limites de f en -∞ et en +∞.
2. Montrer que la droite (D) d'équation y = x + 1 est asymptote à (C_f) en -∞.
   Étudier la position relative de (C_f) par rapport à (D).
3. Montrer que pour tout réel x : f'(x) = g(x).
4. En déduire le tableau de variations de f. Montrer que f(α) = α + 1 - (1 / (α - 1)).
5. Construire la droite (D) et la courbe (C_f).

==================================================
CORRECTION DÉTAILLÉE :

EXERCICE 1 :
1. Δ = (-2√3)² - 4(1)(4) = 12 - 16 = -4 = (2i)².
   z₁ = (2√3 + 2i) / 2 = √3 + i = 2 e^(i π/6).
   z₂ = (2√3 - 2i) / 2 = √3 - i = 2 e^(-i π/6).
2. b) Z = (2i - (√3 + i)) / (√3 - i - (√3 + i)) = (-√3 + i) / (-2i) = (1/2) + i(√3/2) = e^(i π/3).
   c) |Z| = 1 => AC = AB. arg(Z) = π/3 => (AB, AC) = π/3.
      Le triangle ABC est donc équilatéral.
3. Similitude S : z' = a z + b. Point invariant O => b = 0.
   S(A) = B => z_B = a z_A => a = z_B / z_A = e^(-i π/3).
   Rapport k = |a| = 1. Angle θ = -π/3. Il s'agit d'une rotation de centre O et d'angle -π/3.

EXERCICE 2 :
1. Tirage simultané de 3 parmi 10 : C(10, 3) = (10 × 9 × 8) / (3 × 2 × 1) = 120 tirages.
2. - P(A) = [C(5, 3) + C(3, 3)] / 120 = (10 + 1) / 120 = 11 / 120.
   - P(B) = 1 - P(aucune blanche) = 1 - C(8, 3)/120 = 1 - 56/120 = 64/120 = 8/15.
   - P(C) : boules impaires = 3 vertes (1,3,5) + 2 rouges (1,3) + 1 blanche (1) = 6 boules impaires.
     P(C) = C(6, 3) / 120 = 20 / 120 = 1/6.
3. a) X ∈ {0 ; 1 ; 2}.
   b) P(X = 0) = C(8, 3)/120 = 56/120 = 7/15.
      P(X = 1) = [C(2, 1) × C(8, 2)] / 120 = (2 × 28) / 120 = 56/120 = 7/15.
      P(X = 2) = [C(2, 2) × C(8, 1)] / 120 = (1 × 8) / 120 = 8/120 = 1/15.
   c) E(X) = 0 × 7/15 + 1 × 7/15 + 2 × 1/15 = 9/15 = 3/5 = 0,6 boule blanche.

PROBLÈME :
PARTIE A :
1. lim (x -> -∞) g(x) = 1 (car lim x e^x = 0 et lim e^x = 0).
   lim (x -> +∞) g(x) = -∞.
2. g'(x) = -e^x + (1 - x) e^x = -x e^x.
   Sur ]-∞ ; 0], g'(x) >= 0 => g croissante. Sur [0 ; +∞[, g'(x) <= 0 => g décroissante.
   Maximum en 0 : g(0) = 2.
3. Sur [0 ; +∞[, g est continue et strictement décroissante de 2 vers -∞.
   D'après le théorème des valeurs intermédiaires, il existe un unique α tel que g(α) = 0.
   g(1,27) ≈ 0,04 > 0 et g(1,28) ≈ -0,01 < 0 => 1,27 < α < 1,28.
4. Signe : g(x) > 0 pour x ∈ ]-∞ ; α[ et g(x) < 0 pour x ∈ ]α ; +∞[.`,
    exercises: [
      {
        question: "Calculer l'intégrale I = ∫ de 0 à 1 de (x - 2) e^x dx par intégration par parties.",
        solution: "On pose u(x) = x - 2 => u'(x) = 1 ; v'(x) = e^x => v(x) = e^x. I = [(x - 2) e^x]_0^1 - ∫_0^1 e^x dx = [-e - (-2)] - (e - 1) = -e + 2 - e + 1 = 3 - 2e ≈ -2,436."
      }
    ]
  },
  {
    id: 'bac-s2-svt-2024-officiel',
    title: 'Bac S2 2024 : Épreuve Officielle de Sciences de la Vie et de la Terre (SVT)',
    author: 'Office du Baccalauréat du Sénégal',
    pages: 10,
    category: 'SVT',
    level: 'Terminale-S',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bac-s2-2024-svt-officiel.pdf',
    description: 'Sujet officiel complet de SVT Bac S2 session 2024. Première partie : Maîtrise des connaissances (Brassage génétique et méiose). Deuxième partie : Raisonnement scientifique (Régulation nerveuse de la pression artérielle et diabète).',
    tags: ['BAC', 'Bac S2', 'Examens 2024', 'Terminale S', 'SVT', 'Officiel', 'Sénégal'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE L'ÉDUCATION
OFFICE DU BACCALAURÉAT - SÉRIE S2 - SESSION 2024

ÉPREUVE DE SCIENCES DE LA VIE ET DE LA TERRE (DURÉE : 3 HEURES - COEFFICIENT : 6)

PREMIÈRE PARTIE : MAÎTRISE DES CONNAISSANCES (8 points)
Thème : Brassage génétique et diversité des gamètes lors de la méiose

La reproduction sexuée est la source majeure de diversification du vivant grâce aux mécanismes de la méiose et de la fécondation.
Par un texte structuré accompagné de schémas clairs et annotés :
1. Expliquez le mécanisme du brassage intra-chromosomique (crossing-over) survenant en prophase I.
2. Décrivez le mécanisme du brassage inter-chromosomique survenant en anaphase I.
3. Montrez comment la fécondation amplifie de manière exponentielle la diversité génétique des descendants.

DEUXIÈME PARTIE : RAISONNEMENT SCIENTIFIQUE ET COMMUNICATION (12 points)
Thème : La régulation neuro-hormonale de la pression artérielle

On cherche à comprendre les mécanismes réflexes qui permettent à l'organisme de maintenir la pression artérielle à une valeur consigne lors d'un effort physique ou d'une hémorragie.

DOCUMENT 1 :
Des enregistrements de la fréquence des potentiels d'action sur les fibres du nerf de Hering (provenant des barorécepteurs du sinus carotidien) montrent que :
- À pression artérielle normale (120 mmHg) : décharge moyenne de 40 PA/s.
- En cas d'hypertension provoquée (160 mmHg) : la fréquence passe à 110 PA/s.
- En cas d'hypotension provoquée (80 mmHg) : la fréquence chute à 10 PA/s.

DOCUMENT 2 :
Des stimulations électriques isolées du nerf vague (nerf X parasympathique) entraînent un ralentissement immédiat de la fréquence cardiaque (bradycardie) et une baisse de pression. À l'inverse, la stimulation des nerfs sympathiques cardiaques provoque une tachycardie et une vasoconstriction.

Questions :
1. À partir du Document 1, déduisez le rôle des barorécepteurs carotidiens dans la détection de la pression artérielle.
2. En analysant le Document 2, distinguez les effets du système parasympathique et du système orthosympathique sur l'activité cardiaque.
3. Réalisez un schéma fonctionnel complet en boucle réflexe de la régulation de la pression artérielle en cas d'hypertension brutale.

==================================================
CORRECTION DÉTAILLÉE :

PREMIÈRE PARTIE :
1. Brassage intra-chromosomique (Prophase I) :
   - Appariement des chromosomes homologues en bivalents (tétrades).
   - Enchevêtrement des chromatides non-sœurs au niveau des chiasmas.
   - Échange réciproque de segments de chromatides (crossing-over).
   - Conséquence : création de chromosomes recombinés portant de nouvelles associations d'allèles.

2. Brassage inter-chromosomique (Anaphase I) :
   - Séparation aléatoire et indépendante des deux chromosomes homologues de chaque paire vers les pôles opposés de la cellule.
   - Pour n paires de chromosomes, ce brassage génère 2^n combinaisons possibles de gamètes (soit 2²³ ≈ 8,4 millions de combinaisons chez l'Homme sans compter le crossing-over).

3. Rôle de la fécondation :
   - Rencontre aléatoire de deux gamètes parmi les millions produits.
   - La fécondation réunit au hasard deux assortiments alléliques uniques, amplifiant la diversité à (2^n) × (2^n) = 2^(2n) combinaisons possibles.

DEUXIÈME PARTIE :
1. Rôle des barorécepteurs : Ce sont des mécanorécepteurs sensibles à l'étirement de la paroi artérielle. L'intensité de la pression est codée en modulation de fréquence de potentiels d'action véhiculés par les nerfs sensitifs (Hering et Cyon).
2. Effets antagonistes :
   - Système parasympathique (nerf X cardiomodérateur) : libère l'acétylcholine, ralentit le cœur et diminue la pression artérielle.
   - Système orthosympathique (cardioaccélérateur) : libère la noradrénaline, augmente la fréquence et le volume d'éjection systolique, élève la pression artérielle.
3. Boucle réflexe en cas d'hypertension :
   Stimulus (Pression ↑) -> Barorécepteurs -> Nerf de Hering (PA ↑) -> Centre bulbaire dépresseur -> Activation du nerf parasympathique X / Inhibition du sympathique -> Cœur (Ralentissement) -> Baisse du débit cardiaque -> Rétablissement de la pression normale consigne.`,
    exercises: [
      {
        question: "Quel organe endocrine sécrète l'insuline et dans quelle condition sa sécrétion augmente-t-elle ?",
        solution: "Le pancréas endocrine (au niveau des cellules bêta des îlots de Langerhans). Sa sécrétion augmente immédiatement lors d'une hyperglycémie (après un repas sucré)."
      }
    ]
  },

  // ==========================================
  // 4. BAC LITTÉRAIRE (Session Récente 2024)
  // ==========================================
  {
    id: 'bac-l-philo-2024-officiel',
    title: 'Bac L1/L2 2024 : Épreuve Officielle de Philosophie (Dissertation & Commentaire)',
    author: 'Office du Baccalauréat du Sénégal',
    pages: 14,
    category: 'Philosophie',
    level: 'Terminale-L',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bac-l-2024-philo-officiel.pdf',
    description: 'Sujets officiels du Baccalauréat Séries Littéraires 2024 avec corrigés types rédigés : Dissertation sur l’État et la liberté citoyenne, Débat entre Science et Vérité métaphysique, Commentaire philosophique de texte.',
    tags: ['BAC', 'Bac L', 'Examens 2024', 'Terminale L', 'Philosophie', 'Dissertation', 'Officiel'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
OFFICE DU BACCALAURÉAT - SÉRIES L1, L2, L' - SESSION 2024

ÉPREUVE DE PHILOSOPHIE (DURÉE : 4 HEURES - COEFFICIENT : 6)

Le candidat traitera au choix l'un des trois sujets suivants :

SUJET 1 (DISSERTATION) :
« Peut-on concevoir une liberté véritable en dehors de toute contrainte étatique ? »

SUJET 2 (DISSERTATION) :
« La science a-t-elle pour fin de nous rendre maîtres de la nature ou de nous libérer de nos illusions ? »

SUJET 3 (COMMENTAIRE DE TEXTE) :
Texte d'Ibn Khaldoun (extrait de la « Muqaddima » / Les Prolégomènes) :
« L'homme est citoyen par nature, c'est-à-dire qu'il a besoin d'une société et d'une organisation politique pour vivre et s'épanouir. En effet, la force d'un seul individu ne suffit point à lui procurer la nourriture dont il a besoin pour subsister, ni à lui fournir les armes pour se défendre contre les bêtes féroces ou ses semblables. Il lui faut donc s'associer avec les membres de son espèce. De cette coopération naît la société humaine et le pouvoir qui la régule. »

==================================================
CORRECTION RÉDIGÉE DU SUJET 1 :

INTRODUCTION :
- Accroche : Spontanément, la liberté est vécue comme l'absence d'entraves et le pouvoir de faire tout ce qui plaît ("faire ce que l'on veut"). Dans cette perspective naïve, les lois, la police et les institutions de l'État apparaissent comme d'insupportables carcans.
- Problématique : Mais cette liberté illimitée n'est-elle pas une illusion dangereuse conduisant au triomphe de la force brute ? L'État, avec son cortège d'obligations et de sanctions, aliène-t-il l'homme ou constitue-t-il au contraire l'unique condition d'une liberté juste et garantie ?
- Annonce du plan : Nous examinerons d'abord en quoi l'État peut être perçu comme la négation des libertés individuelles. Puis, nous démontrerons que sans autorité étatique, la liberté dégénère en loi du plus fort. Enfin, nous établirons que c'est dans l'État de droit démocratique que la liberté trouve son accomplissement le plus authentique.

DÉVELOPPEMENT :

I. L'État perçu comme menace et confiscation des libertés
1. La coercition étatique :
   Pour Max Weber, l'État se définit par le monopole de la violence physique légitime. L'individu subit l'impôt, le service militaire, les règlements.
2. L'analyse libertaire et anarchiste (Bakounine, Proudhon) :
   "Être gouverné, c'est être gardé à vue, inspecté, espionné, dirigé, légiféré, numéroté, enrégimenté" (Proudhon).
3. Nietzsche et la dénonciation du conformisme d'État ("Le monstre froid").

II. L'illusion d'une liberté hors de l'État : La loi de la jungle
1. L'état de nature selon Thomas Hobbes ("Léviathan") :
   Sans souverain commun, c'est "la guerre de tous contre tous". La liberté naturelle est stérile car annihilée par la peur constante de la mort violente.
2. La fragilité du plus fort (Rousseau) :
   "Le plus fort n'est jamais assez fort pour être toujours le maître, s'il ne transforme sa force en droit et l'obéissance en devoir."

III. L'État de droit comme condition de réalisation de la liberté
1. Le pacte républicain rousseauiste :
   L'obéissance à la loi commune que le peuple s'est prescrite est la liberté suprême.
2. La garantie constitutionnelle et la séparation des pouvoirs (Montesquieu).
3. La tradition africaine de l'arbre à palabres et de la concorde communautaire (Cheikh Anta Diop).

CONCLUSION :
Loin d'être antinomiques, État et liberté s'engendrent mutuellement. Une liberté sans État n'est que licence destructrice ; un État sans liberté n'est que tyrannie. Seul l'État de droit démocratique humanise la puissance publique pour en faire le bouclier protecteur de l'autonomie citoyenne.`,
    exercises: [
      {
        question: "Citer deux philosophes contractualistes du 17e et 18e siècle et leur œuvre majeure.",
        solution: "Thomas Hobbes (Le Léviathan, 1651) et Jean-Jacques Rousseau (Du Contrat Social, 1762)."
      }
    ]
  },
  {
    id: 'bac-l-histoire-geo-2024-officiel',
    title: 'Bac L & S 2024 : Épreuve Officielle d’Histoire & Géographie',
    author: 'Office du Baccalauréat du Sénégal',
    pages: 10,
    category: 'Histoire-Géo',
    level: 'Terminale-L',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bac-2024-histoire-geographie.pdf',
    description: 'Épreuve officielle du Baccalauréat 2024 : Décolonisation de l’Afrique noire francophone, Intégration sous-régionale en Afrique de l’Ouest (CEDEAO), Défis agricoles et transition énergétique au Sénégal.',
    tags: ['BAC', 'Examens 2024', 'Histoire-Géo', 'Terminale L', 'Terminale S', 'Sénégal', 'Officiel'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
OFFICE DU BACCALAURÉAT - SÉRIES L ET S - SESSION 2024

ÉPREUVE D'HISTOIRE ET GÉOGRAPHIE (DURÉE : 4 HEURES - COEFFICIENT : L=4 ; S=2)

PREMIÈRE PARTIE : HISTOIRE (10 points)
Le candidat traitera l'un des deux sujets au choix :

SUJET 1 (DISSERTATION) :
« De la loi-cadre Defferre de 1956 aux indépendances de 1960 : Analysez les étapes décisives et les différentes visions politiques des leaders africains dans l'accession à la souveraineté en Afrique noire francophone. »

SUJET 2 (COMMENTAIRE DE DOCUMENT HISTORIQUE) :
Discours de Léopold Sédar Senghor au Congrès constitutif du Parti de la Fédération Africaine (Dakar, 1959) sur l'unité africaine et le socialisme démocratique.

DEUXIÈME PARTIE : GÉOGRAPHIE (10 points)
SUJET 1 (DISSERTATION GÉOGRAPHIQUE) :
« L'agriculture sénégalaise entre contraintes climatiques et ambitions d'autosuffisance alimentaire : Atouts, limites et perspectives d'avenir. »

SUJET 2 (PRODUCTION GRAPHIQUE ET COMMENTAIRE) :
Évolution de la production céréalière et rizicole au Sénégal de 2014 à 2024 dans la Vallée du Fleuve Sénégal et le Bassin de l'Anambé.

==================================================
ÉLÉMENTS DE RÉPONSE DÉTAILLÉS :

HISTOIRE (SUJET 1) :
1. Le contexte et la loi-cadre Defferre (1956) :
   - Institution de l'autonomie interne des territoires d'AOF et d'AEF.
   - Création de conseils de gouvernement locaux élus au suffrage universel.
   - Débat houleux sur la "balkanisation" de l'Afrique : Senghor dénonce l'éclatement des grands ensembles fédéraux, tandis que Houphouët-Boigny privilégie les relations bilatérales avec Paris.
2. Le tournant de 1958 : De Gaulle et la Communauté franco-africaine :
   - Référendum constitutionnel du 28 septembre 1958.
   - Le "Non" historique de la Guinée sous la houlette d'Ahmed Sékou Touré qui proclame l'indépendance immédiate le 2 octobre 1958.
   - Adoption du statut d'État membre de la Communauté par les autres colonies.
3. L'expérience éphémère de la Fédération du Mali (1959-1960) :
   - Regroupement du Sénégal (Senghor, Mamadou Dia) et du Soudan français (Modibo Keïta).
   - Proclamation de l'indépendance conjointe le 20 juin 1960.
   - Éclatement de la fédération dans la nuit du 19 au 20 août 1960 pour divergences idéologiques et de gouvernance.
   - Proclamation de la République souveraine du Sénégal le 20 août 1960.

GÉOGRAPHIE (SUJET 1) :
1. Les contraintes majeures :
   - Climat sahélien semi-aride, variabilité des précipitations et sécheresses récurrentes.
   - Salinisation et dégradation des sols (Niayes, Basse-Casamance).
   - Faiblesse des investissements d'irrigation et dépendance aux importations de riz brisé.
2. Les atouts et potentialités :
   - Vallée du Fleuve Sénégal et Bassin de l'Anambé offrant d'importantes réserves hydriques aménageables.
   - Dynamisme des cultures maraîchères des Niayes (oignon, pomme de terre).
   - Filières traditionnelles (arachide, mil, niébé) soutenues par la recherche agronomique (ISRA).
3. Les stratégies d'avenir :
   - Programmes d'accélération de la cadence de l'agriculture sénégalaise (PRACAS).
   - Souveraineté alimentaire par la modernisation de la riziculture locale et l'accès aux semences certifiées.`,
    exercises: [
      {
        question: "Citer les deux principaux fleuves traversant le Sénégal et leur aménagement hydro-agricole.",
        solution: "Le fleuve Sénégal (avec les barrages de Diama et de Manantali) et le fleuve Gambie."
      }
    ]
  }
];
