import { EducationalDocument } from '../types';
import { RECENT_EXAMS_DOCUMENTS } from './recentExamsData';

const BASE_DOCUMENTS: EducationalDocument[] = [
  {
    id: 'doc_ci_cp_recueil',
    title: "Recueil d'exercices CI-CP : Lecture, Écriture, Calcul & Éveil",
    author: "Inspection de l'Éducation Nationale (IEF)",
    pages: 42,
    category: 'Éveil',
    level: 'CI',
    additionalLevels: ['CP'],
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    filename: '/api/documents/files/doc_ci_cp_recueil_Recueil-exercices-CI-CP-1.pdf',
    description: "Recueil officiel d'exercices et d'activités pédagogiques pour le cycle fondamental (CI et CP) : graphisme, sons, syllabes, nombres de 1 à 20, calcul et éveil scientifique.",
    tags: ['CI', 'CP', 'Recueil', 'Exercices', 'Primaire', 'Sénégal'],
    isLocal: true,
    addedAt: '2026-10-02T22:00:00.000Z'
  },
  {
    id: 'bac-s-maths-2024',
    title: 'Bac S1/S2 : Analyse & Fonctions Exponentielles et Logarithmes',
    author: 'Office du Baccalauréat Sénégal',
    pages: 12,
    category: 'Mathématiques',
    level: 'Terminale-S',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bac-s-maths-fonctions.pdf',
    description: 'Fascicule complet de révision : étude de fonctions, branches infinies, limites remarquables, calcul d’intégrales et équations différentielles avec corrigés détaillés.',
    tags: ['Bac', 'Maths', 'Terminale S', 'Analyse', 'Sénégal'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ENSEIGNEMENT SUPÉRIEUR ET DE L'ÉDUCATION
OFFICE DU BACCALAURÉAT - SÉRIE S1 & S2

FASCICULE OFFICIEL DE RÉVISION : FONCTIONS LOGARITHME & EXPONENTIELLE

I. RAPPELS FONDAMENTAUX DE COURS
1. Fonction Logarithme Népérien (ln) :
   - Définie, continue et strictement croissante sur ]0 ; +∞[.
   - ln(1) = 0 ; ln(e) = 1 (où e ≈ 2,71828).
   - Propriétés algébriques : Pour a > 0 et b > 0 :
     • ln(a × b) = ln(a) + ln(b)
     • ln(a / b) = ln(a) - ln(b)
     • ln(a^n) = n × ln(a) (pour tout n entier relatif)
   - Limites usuelles incontournables :
     • lim (x -> 0+) ln(x) = -∞
     • lim (x -> +∞) ln(x) = +∞
     • lim (x -> +∞) [ln(x) / x] = 0 (croissance comparée)
     • lim (x -> 0+) [x × ln(x)] = 0
     • lim (x -> 0) [ln(1 + x) / x] = 1 (nombre dérivé en 1)

2. Fonction Exponentielle (exp ou e^x) :
   - Réciproque de la fonction ln, définie et strictement positive sur ℝ.
   - e^0 = 1 ; e^1 = e.
   - Limites usuelles :
     • lim (x -> -∞) e^x = 0
     • lim (x -> +∞) e^x = +∞
     • lim (x -> +∞) [e^x / x^n] = +∞
     • lim (x -> -∞) [x^n × e^x] = 0
     • lim (x -> 0) [(e^x - 1) / x] = 1

II. EXERCICE TYPE BACCALAURÉAT SÉNÉGAL (Extrait Bac S2)
Soit la fonction f définie sur ℝ par : f(x) = (2x - 1) × e^(-x) + 1.
On note (C) sa courbe représentative dans un repère orthonormé (O, i, j) (unité : 2 cm).

Questions :
1. Déterminer les limites de f en -∞ et en +∞. En déduire une asymptote à (C).
2. Calculer la dérivée f'(x) et dresser le tableau de variation complet de f.
3. Déterminer l'équation de la tangente (T) à la courbe (C) au point d'abscisse 0.
4. Tracer la courbe (C) et la tangente (T).

III. CORRECTION MÉTHODOLOGIQUE DÉTAILLÉE :
1. Limite en +∞ :
   f(x) = 2x × e^(-x) - e^(-x) + 1 = 2 × (x / e^x) - e^(-x) + 1.
   Puisque lim (x -> +∞) (x / e^x) = 0 et lim e^(-x) = 0, on a lim (x -> +∞) f(x) = 1.
   Conclusion : La droite d'équation y = 1 est asymptote horizontale à la courbe (C) en +∞.

2. Dérivée :
   f est dérivable sur ℝ comme produit et somme de fonctions dérivables.
   f'(x) = 2 × e^(-x) + (2x - 1) × (-e^(-x)) = e^(-x) × [2 - (2x - 1)] = e^(-x) × (3 - 2x).
   Comme e^(-x) > 0 pour tout x, f'(x) est du signe de (3 - 2x).
   f'(x) = 0 <=> x = 3/2.
   f est strictement croissante sur ]-∞ ; 3/2] et strictement décroissante sur [3/2 ; +∞[.
   Maximum : f(3/2) = (3 - 1) × e^(-1,5) + 1 = 2 × e^(-1,5) + 1 ≈ 1,446.`,
    exercises: [
      {
        question: "Calculer la limite quand x tend vers +∞ de g(x) = ln(2x² + 1) - ln(x + 3).",
        hints: "Utiliser la propriété du quotient : ln(A) - ln(B) = ln(A/B).",
        solution: "g(x) = ln[(2x² + 1) / (x + 3)]. Quand x -> +∞, (2x² + 1)/(x + 3) équivaut à 2x²/x = 2x -> +∞. Or lim (X -> +∞) ln(X) = +∞, donc la limite est +∞."
      }
    ]
  },
  {
    id: 'bac-l-philo-2024',
    title: 'Philosophie Bac L : Dissertation sur l’État, le Droit et la Liberté',
    author: 'Commission Pédagogique Nationale de Philosophie',
    pages: 16,
    category: 'Philosophie',
    level: 'Terminale-L',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bac-philo-etat-liberte.pdf',
    description: 'Méthodologie de la dissertation philosophique au Baccalauréat sénégalais. Sujets corrigés, citations de Rousseau, Spinoza, Hobbes, et auteurs africains (Cheikh Anta Diop, Marcien Towa).',
    tags: ['Bac', 'Philo', 'Terminale L', 'Dissertation', 'Sénégal'],
    content: `BACCALAURÉAT SÉNÉGALAIS - SÉRIES L1, L2, L'
MODULE : LA VIE EN SOCIÉTÉ - L'ÉTAT ET LA LIBERTÉ

SUJET TYPE D'EXAMEN :
"L'État est-il l'ennemi ou le garant des libertés citoyennes ?"

I. ANALYSE DES TERMES ET PROBLÉMATIQUE :
- "L'État" : Organisation politique souveraine qui exerce une autorité institutionnalisée sur une population et un territoire donné, détenant le monopole de la contrainte physique légitime (Max Weber).
- "Ennemi" : Force d'oppression qui entrave, restreint ou confisque l'autonomie et les droits de l'individu.
- "Garant" : Protecteur, condition de possibilité et gardien qui préserve et assure l'exercice réel des libertés face à l'arbitraire.
- Problématique : Comment l'institution étatique, caractérisée par ses lois coercitives et ses appareils de contrainte, peut-elle simultanément se revendiquer comme le véritable sanctuaire de la liberté humaine ?

II. PLAN DÉTAILLÉ DE LA DISSERTATION :

THÈSE 1 : L'État perçu comme menace et aliénation de la liberté
1. L'État répressif et l'oppression institutionnelle :
   Pour Friedrich Nietzsche ("Ainsi parlait Zarathoustra"), "L'État est le plus froid des monstres froids. Il ment froidement et voici le mensonge qui rampe de sa bouche : 'Moi, l'État, je suis le peuple'."
2. L'analyse marxiste de l'appareil de domination de classe :
   Karl Marx démontre que l'État bourgeois n'est pas un arbitre neutre mais l'instrument d'exploitation de la classe dominante sur le prolétariat.
3. La critique anarchiste (Bakounine, Proudhon) :
   "L'État, c'est la négation de l'humanité."

ANTITHÈSE : L'État comme condition indispensable de la liberté authentique
1. La barbarie de l'état de nature selon Thomas Hobbes ("Léviathan") :
   Sans un pouvoir commun qui tient les hommes en respect, c'est "la guerre de chacun contre chacun" (Homo homini lupus est). La liberté naturelle n'est qu'insécurité permanente.
2. Le pacte social et la liberté civile selon Jean-Jacques Rousseau ("Du Contrat Social") :
   "L'obéissance à la loi qu'on s'est prescrite est liberté." En renonçant à sa liberté animale illimitée mais illusoire, le citoyen gagne la liberté civile garantie par la volonté générale.
3. La perspective de la pensée africaine et la démocratie palabre (Cheikh Anta Diop) :
   L'organisation communautaire et étatique traditionnelle africaine comme régulation pacifique des libertés.

SYNTHÈSE : L'État de droit démocratique comme dépassement
La liberté n'est pas l'absence d'État, mais l'existence d'un État régulé par la séparation des pouvoirs (Montesquieu) et le contrôle citoyen.`,
    exercises: [
      {
        question: "Quelle distinction fondamentale Jean-Jacques Rousseau opère-t-il entre 'liberté naturelle' et 'liberté civile' ?",
        solution: "La liberté naturelle n'a pour borne que les forces physiques de l'individu et conduit à l'insécurité ; la liberté civile est délimitée par la volonté générale et la loi, protégeant chacun de l'arbitraire d'autrui."
      }
    ]
  },
  {
    id: 'bac-s-physique-chimie-2024',
    title: 'Physique-Chimie Terminale S : Mécanique de Newton & Cinétique Chimique',
    author: 'Inspection de Sciences Physiques du Sénégal',
    pages: 14,
    category: 'Physique-Chimie',
    level: 'Terminale-S',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bac-s-physique-chimie.pdf',
    description: 'Fiches de révision et exercices résolus : 2ème loi de Newton, mouvement d’un projectile dans un champ de pesanteur uniforme, réactions acide-base et dosage pH-métrique.',
    tags: ['Bac S', 'Physique', 'Chimie', 'Mécanique', 'Dosage'],
    content: `SCIENCES PHYSIQUES - BACCALAURÉAT SÉRIE S2 & S1

MODULE : MÉCANIQUE NEWTONIENNE ET CHAMP DE PESANTEUR UNIFORME

1. Énoncé de la Deuxième Loi de Newton :
Dans un référentiel galiléen, la somme vectorielle des forces extérieures appliquées à un système matériel est égale au produit de sa masse par le vecteur accélération de son centre d'inertie :
∑ F_ext = m × a_G

2. Mouvement d'un projectile lancé avec une vitesse initiale v0 faisant un angle α avec l'horizontale :
Conditions initiales à t = 0 :
- Position : x(0) = 0 ; y(0) = h
- Vitesse : v_0x = v_0 × cos(α) ; v_0y = v_0 × sin(α)

Système de coordonnées après projection de ∑ F = m × g :
- Accélération : a_x(t) = 0 ; a_y(t) = -g
- Équations horaires de la vitesse :
  • v_x(t) = v_0 × cos(α)
  • v_y(t) = -g × t + v_0 × sin(α)
- Équations horaires de position :
  • x(t) = [v_0 × cos(α)] × t
  • y(t) = -1/2 × g × t² + [v_0 × sin(α)] × t + h

Équation cartésienne de la trajectoire (en éliminant t) :
y(x) = - [g / (2 × v_0² × cos²(α))] × x² + [tan(α)] × x + h
Il s'agit d'une parabole orientée vers le bas.

Flèche (hauteur maximale atteinte) :
Elle est atteinte quand la composante verticale de la vitesse s'annule : v_y(t_S) = 0.
t_S = [v_0 × sin(α)] / g
H_max = y(t_S) = [v_0² × sin²(α)] / (2g) + h.`,
    exercises: [
      {
        question: "Un tir de football est effectué avec v0 = 20 m/s à α = 30° par rapport à l'horizontale (g = 9,8 m/s²). Calculer la portée maximale si h = 0.",
        solution: "Portée X_p = [v_0² × sin(2α)] / g = [400 × sin(60°)] / 9,8 = [400 × 0,866] / 9,8 ≈ 35,35 mètres."
      }
    ]
  },
  {
    id: 'bfem-maths-3e-2024',
    title: 'BFEM Sénégal : Théorème de Thalès, Trigonométrie & Systèmes d’équations',
    author: 'Commission Pédagogique Moyenne Dakar',
    pages: 10,
    category: 'Mathématiques',
    level: '3e',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bfem-maths-annales.pdf',
    description: 'Sujets types BFEM conformes aux dernières directives : calcul littéral, factorisation, Thalès dans le triangle et le trapèze, statistiques et géométrie dans l’espace.',
    tags: ['BFEM', '3ème', 'Collège', 'Thalès', 'Pythagore'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ÉDUCATION NATIONALE - BREVET DE FIN D'ÉTUDES MOYENNES (BFEM)
ÉPREUVE DE MATHÉMATIQUES

ACTIVITÉS NUMÉRIQUES :
Exercice 1 : Calcul littéral et factorisation
Soit l'expression A(x) = (2x - 3)² - (x + 1)(2x - 3).
1. Développer, réduire et ordonner A(x).
2. Factoriser A(x).
3. Résoudre dans ℝ l'équation A(x) = 0.
4. Calculer la valeur exacte de A(√3) sous la forme a + b√3.

Correction Exercice 1 :
1. A(x) = (4x² - 12x + 9) - (2x² - 3x + 2x - 3)
   A(x) = 4x² - 12x + 9 - 2x² + x + 3
   A(x) = 2x² - 11x + 12.
2. Facteur commun évident (2x - 3) :
   A(x) = (2x - 3) × [(2x - 3) - (x + 1)]
   A(x) = (2x - 3)(x - 4).
3. A(x) = 0 <=> (2x - 3)(x - 4) = 0
   Un produit de facteurs est nul si l'un au moins des facteurs est nul.
   2x - 3 = 0  => x = 3/2
   x - 4 = 0   => x = 4
   S = {3/2 ; 4}.

ACTIVITÉS GÉOMÉTRIQUES :
Exercice 2 : Théorème de Thalès
Dans un triangle ABC tel que AB = 6 cm, AC = 8 cm, BC = 10 cm.
Soit M un point de [AB] tel que AM = 2,4 cm. La parallèle à (BC) passant par M coupe (AC) en N.
1. Démontrer que le triangle ABC est rectangle en A.
2. Calculer la longueur AN puis la longueur MN.`,
    exercises: [
      {
        question: "Démontrer que le triangle ABC de côtés 6 cm, 8 cm et 10 cm est rectangle.",
        solution: "On applique la réciproque du théorème de Pythagore. Le plus grand côté est BC = 10 cm. BC² = 100. D'autre part, AB² + AC² = 6² + 8² = 36 + 64 = 100. Comme BC² = AB² + AC², le triangle ABC est rectangle en A."
      }
    ]
  },
  {
    id: 'bfem-francais-dictee-3e',
    title: 'BFEM Français : Texte Suivi de Questions & Dictée de Révision',
    author: 'CREA Sénégal - Enseignement Moyen',
    pages: 8,
    category: 'Français',
    level: '3e',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/bfem-francais-texte-dictee.pdf',
    description: 'Préparation complète à l’épreuve de français du BFEM : texte de Léopold Sédar Senghor, analyse grammaticale, subordonnées relatives et complétives, dictée commentée.',
    tags: ['BFEM', 'Français', 'Dictée', 'Grammaire', '3ème'],
    content: `BREVET DE FIN D'ÉTUDES MOYENNES (BFEM)
ÉPREUVE DE FRANÇAIS : TEXTE SUIVI DE QUESTIONS

TEXTE D'ÉTUDE :
« L'harmattan soufflait sur la savane, emportant avec lui la poussière ocre du Sahel. Dans le village assoupi sous le soleil de midi, les anciens s'étaient rassemblés sous le grand baobab centenaire. Leur parole, lente et mesurée, tissait la mémoire des générations passées. Les enfants, assis en cercle sur les nattes, écoutaient avec recueillement ces récits qui racontaient le courage des ancêtres et la sagesse des terroirs. »

I. COMPRÉHENSION DU TEXTE (4 points)
1. Quel est le rôle du baobab dans ce passage ? Quel symbole traditionnel représente-t-il dans la culture sénégalaise ?
2. Relevez dans le texte deux indices montrant le respect des jeunes envers les anciens.

II. VOCABULAIRE (4 points)
1. Donnez le sens contextuel du mot « ocre » et employez-le dans une phrase personnelle.
2. Trouvez deux mots de la même famille que « mémoire ».

III. GRAMMAIRE ET MANIEMENT DE LA LANGUE (12 points)
1. Donnez la nature et la fonction exacte des propositions suivantes :
   a) « qui racontaient le courage des ancêtres »
   b) « Les anciens s'étaient rassemblés sous le grand baobab »
2. Mettez la phrase suivante à la voix passive : « Les enfants écoutaient ces récits captivants. »
   Réponse : « Ces récits captivants étaient écoutés par les enfants. »
3. Conjuguez le verbe « souffler » au subjonctif présent à toutes les personnes.`,
    exercises: [
      {
        question: "Donner la nature et la fonction de : 'qui racontaient le courage des ancêtres'.",
        solution: "Proposition subordonnée relative, introduite par le pronom relatif 'qui', ayant pour antécédent le groupe nominal 'ces récits', complément de l'antécédent."
      }
    ]
  },
  {
    id: 'cfee-cm2-arithmetique-2024',
    title: 'CFEE & Entrée en 6e : Recueil de 50 Problèmes d’Arithmétique Résolus',
    author: 'Inspection de l’Éducation et de la Formation (IEF)',
    pages: 18,
    category: 'Mathématiques',
    level: 'CM2',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/cfee-cm2-problemes-resolus.pdf',
    description: 'Problèmes types de l’examen du CFEE : partages inégaux, calculs de bénéfice/perte, vitesse moyenne, débits de robinets, aires de champs et calculs de périmètres.',
    tags: ['CFEE', 'CM2', 'Primaire', 'Arithmétique', 'Problèmes'],
    content: `RÉPUBLIQUE DU SÉNÉGAL
MINISTÈRE DE L'ÉDUCATION NATIONALE - EXAMEN DU CFEE ET ENTRÉE EN 6ème

GUIDE DU MAÎTRE ET DE L'ÉLÈVE : PROBLÈMES CLÉS D'ARITHMÉTIQUE

PROBLÈME TYPE 1 : VITESSE, TEMPS ET DISTANCE
Énoncé :
Un car « Ndiaga Ndiaye » quitte la gare routière des Baux Maraîchers de Dakar à 7h 15 min pour se rendre à Thiès, située à une distance de 70 km. Sa vitesse moyenne est de 50 km/h.
1. Calculer la durée du voyage en heures et minutes.
2. À quelle heure exacte le car arrivera-t-il à la gare de Thiès ?

Solution Détaillée :
1. Calcul de la durée du trajet :
   Formule : Durée = Distance / Vitesse
   Durée = 70 km / 50 km/h = 1,4 heure.
   Conversion en minutes :
   1 heure entière = 60 minutes
   0,4 heure = 0,4 × 60 = 24 minutes.
   La durée totale du voyage est de 1 heure 24 minutes.

2. Heure d'arrivée à Thiès :
   Heure d'arrivée = Heure de départ + Durée du voyage
   7 h 15 min + 1 h 24 min = 8 h 39 min.
   Le car arrivera à Thiès à 8 h 39 min.

PROBLÈME TYPE 2 : PARTAGE PROPORTIONNEL & ÉPARGNE
Un commerçant du marché Sandaga a réalisé un bénéfice total de 480 000 FCFA. Il décide d'en verser les 2/5 dans son compte d'épargne et de partager équitablement le reste entre ses 3 enfants.
1. Quelle somme a-t-il déposée à la banque ?
2. Quelle somme chaque enfant reçoit-il ?`,
    exercises: [
      {
        question: "Calculer la part de chaque enfant dans le problème du commerçant de Sandaga.",
        solution: "Bénéfice total = 480 000 FCFA. Épargne (2/5) = 480 000 × 2 / 5 = 192 000 FCFA. Reste à partager = 480 000 - 192 000 = 288 000 FCFA. Part de chacun des 3 enfants = 288 000 / 3 = 96 000 FCFA."
      }
    ]
  },
  {
    id: 'cm2-histoire-senegal',
    title: 'Histoire du Sénégal CM2 : Des Grands Royaumes à l’Indépendance',
    author: 'Direction de l’Enseignement Élémentaire',
    pages: 14,
    category: 'Histoire-Géo',
    level: 'CM2',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/cfee-histoire-senegal.pdf',
    description: 'Cours illustré complet sur le Cayor (Lat-Dior), le Djolof, le Baol, le Fouta-Toro, Cheikh Ahmadou Bamba, El Hadji Malick Sy, Blaise Diagne et l’accession à l’indépendance en 1960.',
    tags: ['Histoire', 'Sénégal', 'CM2', 'Lat-Dior', 'Indépendance'],
    content: `HISTOIRE DU SÉNÉGAL - PROGRAMME OFFICIEL DU CM2

LEÇON 1 : LES ANCIENS ROYAUMES DU SÉNÉGAL
Avant la colonisation française, le Sénégal actuel était divisé en plusieurs royaumes prospères :
- Le Grand Djolof fondé par Ndiadiane Ndiaye, empire fédérateur qui regroupait le Cayor, le Baol, le Waalo et le Sine-Saloum.
- Le Cayor : Royaume dirigé par le Damel. C'est le royaume le plus puissant de la côte.
- Le Baol dirigé par le Teigne.
- Le Waalo dirigé par le Brack et célèbre pour le courage héroïque des femmes de Nder (1820).
- Le Fouta-Toro, théocratie musulmane dirigée par l'Almamy suite à la révolution torodo de 1776 menée par Thierno Souleymane Baal et Abdoul Kader Kane.

LEÇON 2 : LA RÉSISTANCE NATIONALE CONTRE LA PÉNÉTRATION COLONIALE
1. Lat-Dior Ngoné Latyr Diop (1842-1886) :
   Damel du Cayor, il s'opposa farouchement à la construction de la ligne de chemin de fer Dakar-Saint-Louis qui devait couper son royaume en deux. Il mena de célèbres batailles (Ngolgol, Mékhé) et mourut les armes à la main lors de la bataille de Dékheulé le 27 octobre 1886 aux côtés de son fidèle cheval Malaw.
2. Alboury Ndiaye : Roi du Djolof, grand stratège qui refusa la soumission et s'exila pour poursuivre la résistance.
3. El Hadj Oumar Tall : Fondateur d'un vaste empire musulman toucouleur.
4. Aline Sitoé Diatta (1920-1944) : La reine de Cabrousse en Casamance, héroïne de la résistance paysanne contre l'impôt colonial et les réquisitions de riz.

LEÇON 3 : LA MARCHE VERS L'INDÉPENDANCE
- Blaise Diagne : Premier député noir africain élu au Parlement français en 1914.
- La Fédération du Mali (Sénégal et Soudan français) proclamée en 1959.
- L'accession officielle à l'Indépendance de la République du Sénégal le 20 août 1960 avec Léopold Sédar Senghor comme premier Président et Mamadou Dia comme Président du Conseil.`,
    exercises: [
      {
        question: "Pourquoi Lat-Dior Ngoné Latyr Diop s'est-il opposé au chemin de fer Dakar - Saint-Louis ?",
        solution: "Lat-Dior voyait dans le chemin de fer un instrument de pénétration militaire, de division de son territoire et d'asservissement économique du Cayor par l'administration coloniale."
      }
    ]
  },
  {
    id: 'svt-seconde-s-cellule',
    title: 'SVT Seconde S : La Cellule, Unité Structurale et Fonctionnelle du Vivant',
    author: 'Département de SVT - Lycée Lamine Guèye',
    pages: 11,
    category: 'SVT',
    level: '2nde-S',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/svt-seconde-s-cellule.pdf',
    description: 'Structure comparée de la cellule animale et végétale, ultrastructure au microscope électronique, rôles des organites et division cellulaire (mitose).',
    tags: ['SVT', '2nde S', 'Biologie', 'Cellule', 'Lycée'],
    content: `SCIENCES DE LA VIE ET DE LA TERRE - CLASSE DE SECONDE S

CHAPITRE 1 : ORGANISATION ET ULTRASTRUCTURE CELLULAIRE

I. LA THÉORIE CELLULAIRE
Énoncée au XIXe siècle par Schleiden, Schwann et Virchow :
1. Tous les êtres vivants sont formés d'une ou plusieurs cellules.
2. La cellule est l'unité fondamentale structurale, fonctionnelle et génétique du vivant.
3. Toute cellule provient d'une cellule préexistante par division cellulaire ("Omnis cellula e cellula").

II. COMPARAISON CELLULE ANIMALE VS CELLULE VÉGÉTALE :
1. Points communs fondamentaux :
   - Présence d'une membrane plasmique phospholipidique semi-perméable.
   - Cytoplasme renfermant le cytosol et les organites.
   - Noyau contenant le matériel génétique (ADN sous forme de chromatine).
   - Mitochondries assurant la respiration cellulaire et la production d'ATP.

2. Spécificités de la cellule végétale :
   - Paroi pectocellulosique rigide externe protégeant la forme géométrique.
   - Chloroplastes contenant la chlorophylle et assurant la photosynthèse.
   - Grande vacuole centrale stockant l'eau et maintenant la turgescence.

III. LES ÉTAPES DE LA MITOSE (Division conforme) :
1. Prophase : Condensation de l'ADN en chromosomes individualisés à 2 chromatides, disparition de l'enveloppe nucléaire.
2. Métaphase : Alignement des centromères sur la plaque équatoriale de la cellule.
3. Anaphase : Clivage des centromères et migration des chromatides sœurs vers chaque pôle opposé.
4. Télophase : Décondensation des chromosomes, reformation des noyaux et cytodiérèse.`,
    exercises: [
      {
        question: "Quel organite permet la production d'énergie sous forme d'ATP dans les cellules eucaryotes ?",
        solution: "Ce sont les mitochondries, véritables centrales énergétiques de la cellule grâce au mécanisme de la respiration cellulaire."
      }
    ]
  },
  {
    id: 'ci-cp-lecture-syllabes',
    title: 'CI & CP : Mon Premier Cahier de Syllabes et Mots Illustrés',
    author: 'Éditions Pédagogiques Sénégalaises',
    pages: 15,
    category: 'Français',
    level: 'CP',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/ci-cp-lecture-syllabes.pdf',
    description: 'Méthode syllabique progressive adaptée aux jeunes élèves sénégalais : reconnaissance des voyelles, consonnes b, p, d, t, l, m et petits textes de lecture.',
    tags: ['CI', 'CP', 'Lecture', 'Syllabes', 'Élémentaire'],
    content: `CAHIER D'APPRENTISSAGE DE LA LECTURE - CI & CP
MÉTHODE SYLLABIQUE DU SÉNÉGAL

PAGE 1 : LES VOYELLES
a - A - [a] comme dans Ananas
e - E - [e] comme dans Éléphant
i - I - [i] comme dans Igname
o - O - [o] comme dans Orange
u - U - [u] comme dans Usine

PAGE 2 : LA LETTRE L
L + a = La
L + o = Lo
L + i = Li
L + u = Lu
L + e = Le

Exemples de mots familiers :
Lama, Louga, Livre, Lune, Lait.
Petite phrase à lire : « Ali a lu le livre sous le manguier. »

PAGE 3 : LA LETTRE M
M + a = Ma
M + o = Mo
M + i = Mi
M + u = Mu
M + e = Me

Exemples : Maman, Mamba, Melon, Moto, Midi.
Petite phrase : « Maman prépare le bon thiéboudienne pour midi. »`,
    exercises: [
      {
        question: "Associer la consonne 'B' avec la voyelle 'A' et trouver un fruit du Sénégal qui commence par cette syllabe.",
        solution: "B + A = BA. Exemple : La Banane ou le Baobab !"
      }
    ]
  },
  {
    id: '6e-maths-fractions-decimaux',
    title: 'Mathématiques 6ème : Nombres Décimaux, Fractions et Aires Géométriques',
    author: 'Coordination Mathématiques Collèges',
    pages: 12,
    category: 'Mathématiques',
    level: '6e',
    fileType: 'pdf',
    thumb: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    filename: '/docs/6e-maths-decimaux.pdf',
    description: 'Maîtrise des calculs avec nombres décimaux, comparaison de fractions, calculs de périmètres et surfaces usuelles (rectangle, triangle, cercle).',
    tags: ['6ème', 'Maths', 'Fractions', 'Décimaux', 'Collège'],
    content: `PROGRAMME DE MATHÉMATIQUES - CLASSE DE SIXIÈME (6e)

1. LES NOMBRES DÉCIMAUX :
Dans le nombre 345,678 :
- 3 est le chiffre des centaines
- 4 est le chiffre des dizaines
- 5 est le chiffre des unités
- 6 est le chiffre des dixièmes (1/10 = 0,1)
- 7 est le chiffre des centièmes (1/100 = 0,01)
- 8 est le chiffre des millièmes (1/1000 = 0,001)

2. OPÉRATIONS ET RÈGLES DE PRIORITÉ :
- Dans une suite d'opérations sans parenthèses, les multiplications et divisions sont toujours prioritaires sur les additions et soustractions.
Exemple : A = 12 + 5 × 4 = 12 + 20 = 32.

3. LES FRACTIONS ET QUOTIENTS :
Une fraction a/b représente le quotient exact de a divisé par b (b ≠ 0).
- Fraction décimale : fraction dont le dénominateur est 10, 100, 1000...
- Égalité de fractions : La valeur d'une fraction ne change pas si l'on multiplie ou divise son numérateur et son dénominateur par un même nombre non nul :
  (a × k) / (b × k) = a / b.
  Exemple : 15 / 25 = (3 × 5) / (5 × 5) = 3 / 5.`,
    exercises: [
      {
        question: "Calculer B = 45 - 3 × (8 + 2).",
        solution: "On effectue d'abord l'opération entre parenthèses : 8 + 2 = 10. Puis la multiplication prioritaire : 3 × 10 = 30. Enfin la soustraction : 45 - 30 = 15."
      }
    ]
  }
];

export const INITIAL_DOCUMENTS: EducationalDocument[] = [
  ...RECENT_EXAMS_DOCUMENTS,
  ...BASE_DOCUMENTS
];
