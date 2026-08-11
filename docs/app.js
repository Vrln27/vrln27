"use strict";

const PHASES = [
  { num: 1, label: "Fondations quantitatives", from: 1, to: 9 },
  { num: 2, label: "Statistiques et modélisation", from: 10, to: 18 },
  { num: 3, label: "Finance quantitative appliquée", from: 19, to: 28 },
  { num: 4, label: "Projets et professionnalisation", from: 29, to: 34 },
];

// Une entrée = une séance. t: thème · k: points clés · f: repères et formules · x: exercices Python
const SEANCES = [
  { t: "Algèbre linéaire — vecteurs et matrices",
    k: ["Espace vectoriel, base, dimension et rang : ce que le rang dit d'un système.",
        "Le produit matriciel comme composition d'applications linéaires, pas comme table de nombres.",
        "Produit scalaire, norme, orthogonalité et projection orthogonale d'un vecteur sur un sous-espace.",
        "Inversibilité, déterminant, et résolution numérique de Ax = b sans calculer A⁻¹."],
    f: ["Ax = b  →  x = A⁻¹b  si  det(A) ≠ 0", "proj_u(v) = (⟨v,u⟩ / ⟨u,u⟩) · u", "rang(A) + dim(ker A) = n"],
    x: [["Opérations vectorielles à la main", "Réimplémenter produit scalaire, norme et projection en pur Python, puis comparer à NumPy.", "s01_vecteurs.py"],
        ["Résoudre un système linéaire", "Comparer np.linalg.solve et l'inversion explicite sur une matrice mal conditionnée.", "s01_solve.ipynb"]] },
  { t: "Décompositions matricielles (LU, QR, SVD)",
    k: ["LU et pivotage : pourquoi c'est la méthode de résolution effective derrière solve.",
        "QR par Gram-Schmidt et son usage direct pour les moindres carrés.",
        "SVD : valeurs singulières, rang effectif, meilleure approximation de rang k.",
        "Conditionnement d'une matrice et propagation de l'erreur numérique."],
    f: ["A = QR,  Q orthogonale,  R triangulaire supérieure", "A = UΣVᵀ,  σ₁ ≥ σ₂ ≥ … ≥ 0", "cond(A) = σ_max / σ_min"],
    x: [["Gram-Schmidt", "Coder la QR par Gram-Schmidt modifié, vérifier l'orthogonalité de Q.", "s02_qr.py"],
        ["Compression par SVD", "Tronquer la SVD d'une matrice de rendements et mesurer l'erreur en norme de Frobenius.", "s02_svd.ipynb"]] },
  { t: "Calcul différentiel et optimisation",
    k: ["Gradient, matrice hessienne, et lecture géométrique des courbes de niveau.",
        "Convexité : condition du second ordre et unicité du minimum.",
        "Descente de gradient, pas d'apprentissage, critère d'arrêt.",
        "Optimisation sous contrainte par multiplicateurs de Lagrange."],
    f: ["x_{k+1} = x_k − η ∇f(x_k)", "∇f(x*) = 0  et  H(x*) ≻ 0  ⇒  minimum local", "L(x,λ) = f(x) − λ·g(x)"],
    x: [["Descente de gradient", "Minimiser une quadratique 2D, tracer la trajectoire pour trois valeurs de η.", "s03_gradient.py"],
        ["Lagrange en portefeuille", "Minimiser une variance sous contrainte de poids sommant à 1, résolu à la main puis par scipy.", "s03_lagrange.ipynb"]] },
  { t: "Séries, limites et développements de Taylor",
    k: ["Développement de Taylor à l'ordre n et terme de reste.",
        "Approximations usuelles en finance : ln(1+x) ≈ x pour les petits rendements.",
        "Séries géométriques et actualisation d'un flux perpétuel.",
        "Notation de Landau et vitesse de convergence."],
    f: ["f(x₀+h) = f(x₀) + f′(x₀)h + ½f″(x₀)h² + o(h²)", "Σ_{n≥0} q^n = 1/(1−q)  pour |q| < 1", "ln(1+x) ≈ x − x²/2"],
    x: [["Erreur d'approximation", "Comparer rendement simple et rendement log sur des variations de 0,1 % à 30 %.", "s04_taylor.py"],
        ["Valeur actuelle d'une rente", "Calculer une somme actualisée par boucle puis par formule fermée, vérifier l'égalité.", "s04_rente.py"]] },
  { t: "Python scientifique — NumPy",
    k: ["ndarray, dtype, shape : la vectorisation remplace les boucles.",
        "Broadcasting — règles de diffusion des dimensions.",
        "Indexation booléenne et fancy indexing pour filtrer sans boucle.",
        "Nombres aléatoires reproductibles avec un générateur et une graine."],
    f: ["a.shape = (n, m)  ·  a.T  ·  a @ b", "rng = np.random.default_rng(42)", "np.where(cond, x, y)"],
    x: [["Vectoriser une boucle", "Réécrire un calcul de moyenne mobile en une seule expression NumPy, mesurer le gain.", "s05_vectorisation.py"],
        ["Simulation de marche aléatoire", "Générer 10 000 trajectoires en une passe avec cumsum.", "s05_marche.ipynb"]] },
  { t: "Pandas et séries temporelles",
    k: ["Series, DataFrame, index temporel : l'index porte le sens.",
        "resample, rolling, shift — les trois opérations qui structurent tout backtest.",
        "Alignement automatique des index et pièges des valeurs manquantes.",
        "groupby et pivot pour passer d'un format long à un format large."],
    f: ["df['r'] = np.log(df.px).diff()", "df.rolling(20).mean()  ·  df.resample('M').last()", "df.shift(1)  →  éviter le look-ahead"],
    x: [["Charger et nettoyer une série de prix", "Lire un CSV, indexer par date, gérer les jours manquants et les jours fériés.", "s06_chargement.py"],
        ["Moyennes mobiles", "Calculer MM20 et MM50, repérer les croisements.", "s06_mm.ipynb"]] },
  { t: "Probabilités discrètes",
    k: ["Espace probabilisé, événements, indépendance et probabilité conditionnelle.",
        "Formule de Bayes et raisonnement sur les probabilités inverses.",
        "Lois discrètes : Bernoulli, binomiale, Poisson, géométrique.",
        "Espérance, variance et linéarité de l'espérance même en cas de dépendance."],
    f: ["P(A|B) = P(B|A)P(A) / P(B)", "X ~ B(n,p) : E[X] = np,  Var(X) = np(1−p)", "Var(X) = E[X²] − E[X]²"],
    x: [["Bayes par simulation", "Vérifier un résultat contre-intuitif de test médical par 10⁶ tirages.", "s07_bayes.py"],
        ["Lois discrètes", "Tracer les fonctions de masse binomiale et Poisson, observer la convergence.", "s07_lois.ipynb"]] },
  { t: "Variables continues et lois usuelles",
    k: ["Densité, fonction de répartition, quantiles et fonction quantile inverse.",
        "Loi normale, log-normale, Student : queues épaisses et implications financières.",
        "Théorème central limite et ses conditions d'application.",
        "Changement de variable et transformation d'une densité."],
    f: ["F(x) = ∫_{−∞}^x f(u)du", "S_T lognormale  ⇔  ln S_T normale", "(X̄ₙ − μ)/(σ/√n)  →  N(0,1)"],
    x: [["Inverse transform sampling", "Générer une loi exponentielle à partir d'uniformes via F⁻¹.", "s08_inverse.py"],
        ["Queues épaisses", "Comparer normale et Student ajustées sur des rendements réels, QQ-plot à l'appui.", "s08_queues.ipynb"]] },
  { t: "Espérance conditionnelle et martingales",
    k: ["Espérance conditionnelle comme meilleure prédiction au sens des moindres carrés.",
        "Filtration : l'information disponible à la date t.",
        "Définition d'une martingale et lien avec l'absence d'opportunité d'arbitrage.",
        "Théorème d'arrêt optionnel et son usage sur les temps d'arrêt."],
    f: ["E[X | F_t] — mesurable par rapport à F_t", "M_t martingale ⇔ E[M_{t+1} | F_t] = M_t", "E[E[X|F]] = E[X]  (tour d'espérance)"],
    x: [["Martingale ou non", "Simuler une marche aléatoire et son carré, tester numériquement la propriété.", "s09_martingale.py"],
        ["Ruine du joueur", "Estimer la probabilité de ruine par simulation, comparer à la formule fermée.", "s09_ruine.ipynb"]] },

  { t: "Estimation et maximum de vraisemblance",
    k: ["Estimateur, biais, variance et erreur quadratique moyenne.",
        "Construction de la log-vraisemblance et maximisation numérique.",
        "Propriétés asymptotiques : convergence, normalité, efficacité.",
        "Information de Fisher et borne de Cramér-Rao."],
    f: ["ℓ(θ) = Σ ln f(x_i ; θ)", "θ̂ = argmax ℓ(θ)", "MSE(θ̂) = Var(θ̂) + biais(θ̂)²"],
    x: [["MLE d'une normale", "Dériver puis retrouver numériquement μ̂ et σ̂ par optimisation.", "s10_mle.py"],
        ["Biais de l'estimateur de variance", "Comparer les diviseurs n et n−1 sur 10 000 échantillons.", "s10_biais.ipynb"]] },
  { t: "Tests d'hypothèses et intervalles de confiance",
    k: ["H₀ contre H₁, erreurs de première et seconde espèce, puissance du test.",
        "p-value : ce qu'elle dit et surtout ce qu'elle ne dit pas.",
        "Intervalle de confiance et interprétation fréquentiste correcte.",
        "Tests multiples et correction de Bonferroni — crucial en recherche de signaux."],
    f: ["t = (x̄ − μ₀) / (s/√n)", "IC 95 % : x̄ ± 1,96·s/√n", "α_corrigé = α / m  (Bonferroni)"],
    x: [["Distribution de la p-value", "Simuler sous H₀ et vérifier l'uniformité des p-values.", "s11_pvalue.py"],
        ["Data snooping", "Tester 200 signaux aléatoires, compter les faux positifs à 5 %.", "s11_snooping.ipynb"]] },
  { t: "Régression linéaire simple et multiple",
    k: ["Estimateur des moindres carrés en forme matricielle et son interprétation géométrique.",
        "R², R² ajusté, et pourquoi ajouter des variables augmente toujours le R².",
        "Tests t sur les coefficients et test F global.",
        "Interprétation d'un coefficient : effet marginal toutes choses égales par ailleurs."],
    f: ["β̂ = (XᵀX)⁻¹Xᵀy", "ŷ = Xβ̂,  e = y − ŷ", "R² = 1 − SCR/SCT"],
    x: [["MCO à la main", "Implémenter β̂ en NumPy et retrouver la sortie de statsmodels au 10⁻¹⁰ près.", "s12_mco.py"],
        ["Régression sur facteurs", "Régresser un rendement d'action sur le marché, lire alpha et bêta.", "s12_beta.ipynb"]] },
  { t: "Diagnostic de régression et hétéroscédasticité",
    k: ["Hypothèses de Gauss-Markov et ce que chacune garantit sur l'estimateur MCO.",
        "Détection de l'hétéroscédasticité : résidus, test de Breusch-Pagan, test de White.",
        "Erreurs-types robustes (HC3) et quand elles suffisent à corriger l'inférence.",
        "Multicolinéarité : facteur d'inflation de la variance et effet sur les écarts-types."],
    f: ["E[ε|X] = 0,  Var(ε|X) = σ²I", "VIF_j = 1/(1 − R²_j)", "Var_HC(β̂) = (XᵀX)⁻¹ XᵀΩ̂X (XᵀX)⁻¹"],
    x: [["Résidus et diagnostic visuel", "Ajuster une régression sur données hétéroscédastiques, tracer résidus et QQ-plot.", "s13_residus.ipynb"],
        ["Erreurs-types robustes", "Comparer MCO classique et HC3 sur des rendements sectoriels.", "s13_hc3.py"]] },
  { t: "Séries temporelles — stationnarité et ARMA",
    k: ["Stationnarité faible : moyenne, variance et autocovariance invariantes dans le temps.",
        "ACF et PACF — lecture des corrélogrammes pour identifier p et q.",
        "AR(p), MA(q), ARMA(p,q) : conditions de causalité et d'inversibilité.",
        "Test de Dickey-Fuller augmenté et différenciation d'une série non stationnaire."],
    f: ["AR(1) : X_t = φX_{t−1} + ε_t,  |φ| < 1", "γ(h) = Cov(X_t, X_{t+h})", "AIC = −2ℓ + 2k"],
    x: [["Simuler AR(1) et MA(1)", "Générer 2 000 points pour plusieurs φ et θ, comparer ACF empirique et théorique.", "s14_simul_arma.py"],
        ["ADF sur des prix réels", "Tester la stationnarité d'une série de prix puis de ses rendements log.", "s14_adf.ipynb"]] },
  { t: "ARIMA et modèles de volatilité GARCH",
    k: ["D'ARMA à ARIMA : ordre de différenciation d et retour au niveau.",
        "Clustering de volatilité : pourquoi les rendements violent l'homoscédasticité.",
        "ARCH(q) puis GARCH(1,1) : variance conditionnelle et persistance α+β.",
        "Estimation par maximum de vraisemblance et prévision de variance à horizon h."],
    f: ["σ²_t = ω + α ε²_{t−1} + β σ²_{t−1}", "persistance = α + β < 1", "variance long terme = ω/(1 − α − β)"],
    x: [["GARCH(1,1) sur un indice", "Ajuster le modèle avec arch, lire ω, α, β et la persistance.", "s15_garch.ipynb"],
        ["Prévision de volatilité", "Comparer volatilité réalisée à 20 jours et prévision GARCH.", "s15_prevision.py"]] },
  { t: "Analyse en composantes principales",
    k: ["ACP comme diagonalisation de la matrice de covariance.",
        "Part de variance expliquée et choix du nombre de composantes.",
        "Centrage-réduction préalable et son effet sur les résultats.",
        "Lecture financière : les trois premières composantes d'une courbe de taux."],
    f: ["Σ = VΛVᵀ", "part expliquée_k = λ_k / Σλ_i", "Z = XV_k  (scores)"],
    x: [["ACP à la main", "Retrouver les composantes par diagonalisation puis par SVD, vérifier l'équivalence.", "s16_acp.py"],
        ["Facteurs d'une courbe de taux", "Extraire niveau, pente et courbure d'un jeu de taux à différentes maturités.", "s16_courbe.ipynb"]] },
  { t: "Méthodes de Monte-Carlo",
    k: ["Loi des grands nombres comme fondement de l'estimation par simulation.",
        "Erreur en 1/√N : quadrupler les tirages pour diviser l'erreur par deux.",
        "Réduction de variance : variables antithétiques, variable de contrôle.",
        "Simulation d'une trajectoire de prix par discrétisation d'une EDS."],
    f: ["θ̂ = (1/N) Σ g(X_i)", "erreur-type = σ/√N", "S_{t+Δ} = S_t·exp((μ − σ²/2)Δ + σ√Δ·Z)"],
    x: [["Estimer π", "Estimer π par tirages uniformes, tracer la convergence en 1/√N.", "s17_pi.py"],
        ["Variables antithétiques", "Pricer une option européenne avec et sans antithétiques, comparer les variances.", "s17_antithetique.ipynb"]] },
  { t: "Bootstrap et validation croisée",
    k: ["Bootstrap non paramétrique : rééchantillonnage avec remise pour estimer une distribution.",
        "Intervalles de confiance bootstrap (percentile, BCa).",
        "Bootstrap par blocs pour données dépendantes — indispensable en série temporelle.",
        "Validation croisée temporelle (walk-forward) contre k-fold classique."],
    f: ["θ̂*_b sur échantillon b = 1…B", "IC percentile : [q_2.5 , q_97.5] des θ̂*", "walk-forward : train ≤ t, test > t"],
    x: [["Bootstrap d'un Sharpe", "Construire un IC à 95 % sur le ratio de Sharpe d'une stratégie.", "s18_bootstrap.py"],
        ["Fuite de données", "Comparer k-fold naïf et walk-forward sur une série temporelle, mesurer l'écart.", "s18_walkforward.ipynb"]] },

  { t: "Marchés, produits et conventions",
    k: ["Classes d'actifs, participants, et rôle du market maker.",
        "Carnet d'ordres, spread bid-ask, types d'ordres et coûts d'exécution.",
        "Conventions de calcul : base de jours, capitalisation, cotation en prix ou en taux.",
        "Vocabulaire des dérivés : forward, future, swap, option."],
    f: ["mid = (bid + ask)/2", "spread relatif = (ask − bid)/mid", "F = S·e^{(r−q)T}"],
    x: [["Reconstruire un carnet", "Simuler un carnet d'ordres simple et mesurer le coût d'un ordre au marché.", "s19_carnet.py"],
        ["Conventions de jours", "Implémenter ACT/360 et 30/360, comparer les intérêts sur une période.", "s19_conventions.py"]] },
  { t: "Rendements, risque et portefeuille de Markowitz",
    k: ["Rendement arithmétique, log, annualisation et agrégation temporelle.",
        "Matrice de covariance, corrélation, et effet de diversification.",
        "Frontière efficiente et portefeuille de variance minimale.",
        "Sensibilité extrême de l'optimiseur aux erreurs d'estimation des rendements espérés."],
    f: ["μ_p = wᵀμ,  σ²_p = wᵀΣw", "min wᵀΣw  s.c.  wᵀ1 = 1", "Sharpe = (μ_p − r_f)/σ_p"],
    x: [["Frontière efficiente", "Tracer la frontière pour 5 actifs, repérer le portefeuille tangent.", "s20_frontiere.ipynb"],
        ["Instabilité de l'optimum", "Perturber μ de 1 % et mesurer le déplacement des poids optimaux.", "s20_instabilite.py"]] },
  { t: "MEDAF et modèles à facteurs",
    k: ["Portefeuille de marché, bêta, et décomposition risque systématique / spécifique.",
        "Droite de marché des titres et interprétation de l'alpha.",
        "Fama-French : taille, valeur, puis momentum et qualité.",
        "Régression de séries temporelles pour estimer les expositions aux facteurs."],
    f: ["E[R_i] − r_f = β_i(E[R_m] − r_f)", "β_i = Cov(R_i, R_m)/Var(R_m)", "R_i = α + β_m MKT + β_s SMB + β_h HML + ε"],
    x: [["Bêtas roulants", "Estimer le bêta sur fenêtre glissante de 250 jours et tracer son évolution.", "s21_beta_roulant.py"],
        ["Régression trois facteurs", "Ajuster Fama-French sur un fonds, interpréter alpha et expositions.", "s21_ff3.ipynb"]] },
  { t: "Mouvement brownien et processus d'Itô",
    k: ["Marche aléatoire, passage à la limite continue, construction du brownien standard.",
        "Propriétés : accroissements indépendants, stationnaires, gaussiens, trajectoires non dérivables.",
        "Intégrale d'Itô et lemme d'Itô appliqué à f(t, W_t).",
        "Mouvement brownien géométrique et solution de l'EDS des prix."],
    f: ["dW_t ~ N(0, dt),  (dW)² = dt", "dS = μS dt + σS dW", "S_T = S₀·exp((μ − σ²/2)T + σW_T)"],
    x: [["Trajectoires browniennes", "Simuler 1 000 trajectoires, vérifier E[W_T]=0 et Var(W_T)=T.", "s22_brownien.py"],
        ["Vérifier le lemme d'Itô", "Comparer numériquement d(W²) et la formule d'Itô sur un pas fin.", "s22_ito.ipynb"]] },
  { t: "Black-Scholes — dérivation et hypothèses",
    k: ["Portefeuille de couverture et argument d'absence d'arbitrage.",
        "EDP de Black-Scholes et conditions aux limites du call européen.",
        "Probabilité risque-neutre et pricing comme espérance actualisée.",
        "Hypothèses du modèle et leurs violations empiriques."],
    f: ["C = S₀N(d₁) − Ke^{−rT}N(d₂)", "d₁ = [ln(S/K) + (r + σ²/2)T]/(σ√T),  d₂ = d₁ − σ√T", "C − P = S₀ − Ke^{−rT}"],
    x: [["Pricer Black-Scholes", "Coder call et put, vérifier la parité call-put numériquement.", "s23_bs.py"],
        ["Monte-Carlo contre formule fermée", "Pricer le même call par simulation, mesurer l'écart selon N.", "s23_mc_vs_bs.ipynb"]] },
  { t: "Grecques et couverture en delta",
    k: ["Delta, gamma, vega, theta, rho : chaque sensibilité et son signe.",
        "Couverture en delta discrète et erreur de couverture liée au gamma.",
        "Relation theta-gamma : le coût du temps face à la convexité.",
        "Profil de risque d'un portefeuille d'options agrégé par grecque."],
    f: ["Δ_call = N(d₁)", "Γ = φ(d₁)/(S σ√T)", "Θ + ½σ²S²Γ + rSΔ = rV"],
    x: [["Surfaces de grecques", "Tracer delta et gamma en fonction de S et du temps restant.", "s24_grecques.ipynb"],
        ["Backtest de delta-hedging", "Couvrir un call à fréquence variable, mesurer la dispersion du P&L.", "s24_hedge.py"]] },
  { t: "Volatilité implicite et surface de vol",
    k: ["Inversion de Black-Scholes pour extraire la volatilité implicite.",
        "Smile et skew : ce que la forme dit des anticipations du marché.",
        "Structure par terme de la volatilité et surface complète.",
        "Volatilité réalisée contre implicite, et prime de risque de volatilité."],
    f: ["trouver σ tel que  BS(σ) = prix marché", "vol réalisée = √(252·moyenne(r²))", "vega = S φ(d₁) √T"],
    x: [["Inverser la vol implicite", "Implémenter Newton-Raphson et bissection, comparer robustesse et vitesse.", "s25_vol_implicite.py"],
        ["Tracer un smile", "Construire la courbe de vol implicite par strike sur une échéance donnée.", "s25_smile.ipynb"]] },
  { t: "Arbres binomiaux et pricing numérique",
    k: ["Arbre CRR : construction, probabilité risque-neutre, convergence vers Black-Scholes.",
        "Pricing par récursion arrière et exercice anticipé des options américaines.",
        "Différences finies : schémas explicite, implicite, Crank-Nicolson et stabilité.",
        "Arbitrage entre précision, temps de calcul et nombre de pas."],
    f: ["u = e^{σ√Δt},  d = 1/u", "q = (e^{rΔt} − d)/(u − d)", "V_t = e^{−rΔt}[qV_u + (1−q)V_d]"],
    x: [["Arbre CRR", "Pricer un call européen et vérifier la convergence vers Black-Scholes quand n croît.", "s26_crr.py"],
        ["Put américain", "Ajouter l'exercice anticipé et mesurer la prime par rapport à l'européen.", "s26_americain.ipynb"]] },
  { t: "Produits de taux et courbe des taux",
    k: ["Prix, coupon, rendement à maturité et relation prix-taux.",
        "Duration, duration modifiée et convexité comme sensibilités au taux.",
        "Construction d'une courbe zéro-coupon par bootstrapping.",
        "Taux forward implicites et lecture de la pente de la courbe."],
    f: ["P = Σ CF_i·e^{−y·t_i}", "D_mod = −(1/P)·dP/dy", "ΔP/P ≈ −D_mod·Δy + ½C·Δy²"],
    x: [["Duration et convexité", "Calculer les deux mesures pour une obligation, comparer à un choc de taux réel.", "s27_duration.py"],
        ["Bootstrapping de courbe", "Reconstruire les taux zéro-coupon à partir de prix d'obligations couponnées.", "s27_courbe.ipynb"]] },
  { t: "VaR, Expected Shortfall et backtesting",
    k: ["Trois approches de la VaR : historique, paramétrique, Monte-Carlo.",
        "Limites de la VaR : non sous-additivité et aveuglement à la queue.",
        "Expected Shortfall comme mesure cohérente du risque.",
        "Backtesting du nombre d'exceptions : test de Kupiec et test de Christoffersen."],
    f: ["VaR_α : P(L > VaR_α) = 1 − α", "ES_α = E[L | L > VaR_α]", "VaR paramétrique = μ + z_α·σ"],
    x: [["Trois VaR côte à côte", "Calculer les trois méthodes sur un même portefeuille, comparer les écarts.", "s28_var.ipynb"],
        ["Backtest de Kupiec", "Compter les dépassements sur 3 ans et appliquer le test de couverture.", "s28_kupiec.py"]] },

  { t: "Projet — backtest d'une stratégie momentum",
    k: ["Définir le signal : fenêtre de formation, période de détention, univers investissable.",
        "Éviter le biais de survivance et le look-ahead avec des données point-in-time.",
        "Modéliser coûts de transaction, slippage et rotation du portefeuille.",
        "Évaluer : Sharpe, drawdown maximal, turnover, hit ratio, stabilité par sous-période."],
    f: ["signal_t = P_t / P_{t−252} − 1", "Sharpe = √252 · moy(r)/écart-type(r)", "DD_max = min(P_t/max_{s≤t}P_s − 1)"],
    x: [["Moteur de backtest", "Écrire une boucle de rebalancement mensuelle avec journal des positions.", "s29_moteur.py"],
        ["Rapport de performance", "Produire courbe de capital, drawdowns et tableau de métriques annualisées.", "s29_rapport.ipynb"]] },
  { t: "Projet — portefeuille optimisé sous contraintes",
    k: ["Formuler l'optimisation comme un programme quadratique avec contraintes réalistes.",
        "Contraintes de poids, de secteur, d'exposition brute et nette.",
        "Estimateurs robustes de covariance : shrinkage de Ledoit-Wolf.",
        "Comparer à des références naïves : équipondéré et minimum variance."],
    f: ["min wᵀΣw − λμᵀw  s.c.  Aw ≤ b", "Σ_shrink = (1−δ)S + δF", "contrainte : 0 ≤ w_i ≤ 0,10"],
    x: [["Optimiseur contraint", "Résoudre avec cvxpy sous contraintes de poids et de secteur.", "s30_optimiseur.py"],
        ["Comparaison hors échantillon", "Backtester optimisé contre équipondéré sur 10 ans glissants.", "s30_comparaison.ipynb"]] },
  { t: "Projet — pricer d'options en Python",
    k: ["Architecture du code : classes produit, modèle, moteur de pricing séparés.",
        "Trois moteurs interchangeables : formule fermée, arbre, Monte-Carlo.",
        "Calcul des grecques par différences finies et par différentiation directe.",
        "Tests unitaires : parité call-put, bornes d'arbitrage, convergence."],
    f: ["prix ≥ max(S − Ke^{−rT}, 0)", "Δ ≈ [V(S+h) − V(S−h)]/(2h)", "assert abs(C − P − S + K·exp(−rT)) < 1e−8"],
    x: [["Architecture et classes", "Écrire Option, Market, PricingEngine avec une interface commune.", "s31_architecture.py"],
        ["Suite de tests", "Couvrir parité, bornes et convergence des trois moteurs avec pytest.", "s31_tests.py"]] },
  { t: "Projet — pipeline de données de marché",
    k: ["Ingestion depuis une API, gestion des limites de débit et des reprises sur erreur.",
        "Contrôles qualité : trous, doublons, splits et dividendes non ajustés.",
        "Stockage en Parquet partitionné et lecture incrémentale.",
        "Planification et journalisation pour un rafraîchissement quotidien fiable."],
    f: ["df.to_parquet(path, partition_cols=['annee'])", "ajusté = brut × facteur_cumulé", "retry(n=3, backoff=2^k)"],
    x: [["Ingestion incrémentale", "Récupérer uniquement les jours manquants depuis la dernière exécution.", "s32_ingestion.py"],
        ["Contrôles qualité", "Détecter automatiquement trous, doublons et sauts de prix aberrants.", "s32_qualite.py"]] },
  { t: "Portfolio GitHub et documentation",
    k: ["Structurer un dépôt lisible : README, src, tests, notebooks, données d'exemple.",
        "Écrire un README qui montre le résultat avant le code.",
        "Environnement reproductible : requirements figés, seed fixée, instructions d'exécution.",
        "Qualité de code : typage, docstrings, formatage automatique, intégration continue."],
    f: ["README : problème → méthode → résultat → reproduction", "pip freeze > requirements.txt", "ruff · black · pytest en CI"],
    x: [["Mise en forme du dépôt", "Restructurer un projet existant selon le squelette cible.", "s33_structure.md"],
        ["CI minimale", "Ajouter un workflow GitHub Actions qui lance les tests à chaque push.", "s33_ci.yml"]] },
  { t: "Entretiens quant — brainteasers et cas",
    k: ["Probabilités d'entretien : espérance conditionnelle, symétrie, récurrence.",
        "Estimation d'ordre de grandeur et raisonnement à voix haute.",
        "Questions de marché : pricing rapide, intuition sur les grecques, cas de couverture.",
        "Présenter ses projets en trois minutes : problème, choix, résultat, limites."],
    f: ["E[X] par conditionnement sur le premier pas", "récurrence : p_n = ½p_{n−1} + ½p_{n+1}", "règle des 72 : doublement ≈ 72/taux"],
    x: [["Banque de brainteasers", "Résoudre 20 problèmes classiques et vérifier chacun par simulation.", "s34_brainteasers.ipynb"],
        ["Pitch de projet", "Rédiger et minuter la présentation de trois projets du portfolio.", "s34_pitch.md"]] },
];

const S = { done: "Terminé", doing: "En cours", todo: "À faire" };
const STATUS_CLASS = { [S.done]: "st-done", [S.doing]: "st-doing", [S.todo]: "st-todo" };
const FILTERS = ["Tout", S.doing, S.todo, S.done];
const STORAGE_KEY = "quant-tracker-state-v1";

function phaseOf(num) {
  return PHASES.find((p) => num >= p.from && num <= p.to);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

function buildDefaultWeeks() {
  return SEANCES.map((s, i) => {
    const num = i + 1;
    return {
      num, theme: s.t, points: s.k, formules: s.f,
      status: num <= 13 ? S.done : num === 14 ? S.doing : S.todo,
      exos: s.x.map((e, j) => ({
        titre: e[0], desc: e[1], file: e[2],
        done: num <= 13 || (num === 14 && j === 0),
      })),
    };
  });
}

function loadState() {
  const defaults = { weeks: buildDefaultWeeks(), selected: 14, filter: "Tout", tab: "Cours", drawer: false, view: "dash" };
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    return defaults;
  }
  if (!raw) return defaults;
  try {
    const saved = JSON.parse(raw);
    if (!saved || !Array.isArray(saved.weeks)) return defaults;
    const savedByNum = new Map(saved.weeks.map((w) => [w.num, w]));
    const weeks = defaults.weeks.map((w) => {
      const sw = savedByNum.get(w.num);
      if (!sw) return w;
      return Object.assign({}, w, {
        status: [S.done, S.doing, S.todo].includes(sw.status) ? sw.status : w.status,
        exos: w.exos.map((e, i) => (sw.exos && sw.exos[i] ? Object.assign({}, e, { done: !!sw.exos[i].done }) : e)),
      });
    });
    return {
      weeks,
      selected: Number.isInteger(saved.selected) && saved.selected >= 1 && saved.selected <= 34 ? saved.selected : defaults.selected,
      filter: FILTERS.includes(saved.filter) ? saved.filter : defaults.filter,
      tab: ["Cours", "Formules", "Exercices"].includes(saved.tab) ? saved.tab : defaults.tab,
      drawer: false,
      view: saved.view === "seance" ? "seance" : "dash",
    };
  } catch (err) {
    return defaults;
  }
}

let state = loadState();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      weeks: state.weeks.map((w) => ({ num: w.num, status: w.status, exos: w.exos.map((e) => ({ done: e.done })) })),
      selected: state.selected, filter: state.filter, tab: state.tab, view: state.view,
    }));
  } catch (err) {
    // localStorage indisponible (navigation privée, quota) — la progression reste en mémoire pour cette session
  }
}

function setStatus(num, status) {
  state.weeks = state.weeks.map((w) => (w.num === num ? Object.assign({}, w, { status }) : w));
}

function toggleExo(num, idx) {
  state.weeks = state.weeks.map((w) => {
    if (w.num !== num) return w;
    return Object.assign({}, w, { exos: w.exos.map((e, i) => (i === idx ? Object.assign({}, e, { done: !e.done }) : e)) });
  });
}

function renderFilters() {
  return FILTERS.map((f) => `<button class="filter-btn ${state.filter === f ? "active" : ""}" data-action="set-filter" data-filter="${escapeHtml(f)}">${escapeHtml(f)}</button>`).join("");
}

function renderTlRow(w, wide) {
  const cls = STATUS_CLASS[w.status];
  const sel = w.num === state.selected ? "selected" : "";
  if (wide) {
    return `<div class="tl-row wide ${cls} ${sel}" data-action="open-week" data-num="${w.num}" role="button" tabindex="0">
      <span class="num">S${w.num}</span>
      <span class="dot"></span>
      <span class="theme">${escapeHtml(w.theme)}</span>
      <span class="status-tag">${escapeHtml(w.status)}</span>
      <span class="row-arrow">→</span>
    </div>`;
  }
  return `<div class="tl-row ${cls} ${sel}" data-action="open-week" data-num="${w.num}" role="button" tabindex="0">
    <span class="num">S${w.num}</span>
    <span class="dot"></span>
    <span class="theme">${escapeHtml(w.theme)}</span>
  </div>`;
}

function renderHeader() {
  const { weeks, selected, view, drawer } = state;
  const done = weeks.filter((w) => w.status === S.done).length;
  const doing = weeks.filter((w) => w.status === S.doing).length;
  const pct = Math.round(((done + doing * 0.5) / weeks.length) * 100);
  return `<header class="app-header">
    <div class="brand">QUANT&thinsp;/&thinsp;34</div>
    <button class="hdr-btn ${view === "dash" ? "active" : ""}" data-action="go-dash">Vue d'ensemble</button>
    <button class="hdr-btn ${view === "seance" ? "active" : ""}" data-action="go-seance"><span>Séance</span><span class="num">S${selected}</span></button>
    <button class="hdr-btn ${drawer ? "active" : ""}" data-action="toggle-drawer" aria-expanded="${drawer}"><span>Timeline</span><span class="chevron">${drawer ? "▲" : "▼"}</span></button>
    <div class="progress-block">
      <span class="progress-label">Progression</span>
      <span class="progress-pct">${pct}%</span>
      <span class="progress-count">${done}/34</span>
    </div>
  </header>`;
}

function renderDrawer() {
  if (!state.drawer) return "";
  const cols = PHASES.map((p) => {
    const list = state.weeks.filter((w) => w.num >= p.from && w.num <= p.to);
    const filtered = list.filter((w) => state.filter === "Tout" || w.status === state.filter);
    if (state.filter !== "Tout" && filtered.length === 0) return "";
    const rows = filtered.map((w) => renderTlRow(w, false)).join("");
    return `<div class="phase-col">
      <div class="phase-col-head">
        <span class="phase-num">0${p.num}</span>
        <span class="phase-label">${escapeHtml(p.label)}</span>
        <span class="phase-summary">${list.filter((w) => w.status === S.done).length}/${list.length}</span>
      </div>
      ${rows}
    </div>`;
  }).join("");
  return `<div class="drawer">
    <div class="drawer-bar">
      <span class="drawer-bar-label">Accès rapide — toutes les séances</span>
      <div class="filter-group">${renderFilters()}</div>
    </div>
    <div class="drawer-grid tl-scroll">${cols}</div>
  </div>`;
}

function renderDash() {
  const { weeks, filter } = state;
  const done = weeks.filter((w) => w.status === S.done).length;
  const doing = weeks.filter((w) => w.status === S.doing).length;
  const pct = Math.round(((done + doing * 0.5) / weeks.length) * 100);
  const next = weeks.find((w) => w.status === S.doing) || weeks.find((w) => w.status === S.todo) || weeks[0];
  const nextPhase = phaseOf(next.num);
  const curWeeks = weeks.filter((w) => w.num >= nextPhase.from && w.num <= nextPhase.to);
  const exosTotal = weeks.reduce((n, w) => n + w.exos.length, 0);
  const exosDone = weeks.reduce((n, w) => n + w.exos.filter((e) => e.done).length, 0);
  const ptsTotal = weeks.reduce((n, w) => n + w.points.length, 0);
  const ptsDone = weeks.filter((w) => w.status === S.done).reduce((n, w) => n + w.points.length, 0);

  const ticksHtml = weeks.map((w) => `<div class="tick ${STATUS_CLASS[w.status]}"></div>`).join("");

  const phaseStatsHtml = PHASES.map((p) => {
    const list = weeks.filter((w) => w.num >= p.from && w.num <= p.to);
    const d = list.filter((w) => w.status === S.done).length;
    const target = list.find((w) => w.status === S.doing) || list.find((w) => w.status === S.todo) || list[0];
    const width = Math.round((d / list.length) * 100);
    return `<button class="phase-row" data-action="pick-phase" data-num="${target.num}">
      <span class="p-num">0${p.num}</span>
      <span class="p-label">${escapeHtml(p.label)}</span>
      <div class="p-track"><div class="p-fill" style="width:${width}%"></div></div>
      <span class="p-summary">${d}/${list.length}</span>
      <span class="p-arrow">→</span>
    </button>`;
  }).join("");

  const timelineHtml = PHASES.map((p) => {
    const list = weeks.filter((w) => w.num >= p.from && w.num <= p.to);
    const filtered = list.filter((w) => filter === "Tout" || w.status === filter);
    if (filter !== "Tout" && filtered.length === 0) return "";
    const rows = filtered.map((w) => renderTlRow(w, true)).join("");
    return `<div>
      <div class="phase-group-head">
        <span class="phase-num">0${p.num}</span>
        <span class="g-label">${escapeHtml(p.label)}</span>
        <span class="g-summary">${list.filter((w) => w.status === S.done).length}/${list.length} · S${p.from}–S${p.to}</span>
      </div>
      ${rows}
    </div>`;
  }).join("");

  return `<div>
    <section class="dash-banner">
      <div class="banner-cell">
        <div class="cell-label">Phase actuelle</div>
        <div class="phase-tag">PHASE ${nextPhase.num}</div>
        <div class="phase-name">${escapeHtml(nextPhase.label)}</div>
        <div class="phase-sub">Semaines S${nextPhase.from}–S${nextPhase.to} · ${curWeeks.filter((w) => w.status === S.done).length} terminées</div>
      </div>
      <div class="banner-cell">
        <div class="cell-label">Progression globale</div>
        <div class="pct-row">
          <span class="pct-big">${pct}</span><span class="pct-sign">%</span>
          <span class="pct-of">${done} / 34 séances</span>
        </div>
        <div class="ticks">${ticksHtml}</div>
        <div class="legend">
          <div class="legend-item"><span class="legend-swatch" style="background:var(--color-text)"></span><span class="legend-label">Terminé</span></div>
          <div class="legend-item"><span class="legend-swatch" style="background:var(--color-accent)"></span><span class="legend-label">En cours</span></div>
          <div class="legend-item"><span class="legend-swatch" style="background:var(--color-neutral-300)"></span><span class="legend-label">À faire</span></div>
        </div>
      </div>
      <div class="banner-cell">
        <div class="cell-label">Prochaine séance à faire</div>
        <div class="next-head">
          <div class="next-num">S${next.num}</div>
          <div>
            <div class="next-theme">${escapeHtml(next.theme)}</div>
            <div class="next-meta">Phase ${nextPhase.num} · ${escapeHtml(nextPhase.label)} · ${next.exos.length} exercices Python</div>
          </div>
        </div>
        <div class="next-actions">
          <button class="btn-primary" data-action="open-next" data-num="${next.num}">Ouvrir la séance</button>
          <button class="btn-secondary" data-action="start-next" data-num="${next.num}">Marquer en cours</button>
        </div>
      </div>
    </section>

    <section class="stats-grid">
      <div class="stat-cell"><div class="cell-label">Séances terminées</div><div class="stat-value">${done}/34</div><div class="stat-sub">${pct} % du parcours</div></div>
      <div class="stat-cell"><div class="cell-label">Séance en cours</div><div class="stat-value">S${next.num}</div><div class="stat-sub">${escapeHtml(next.theme)}</div></div>
      <div class="stat-cell"><div class="cell-label">Exercices Python</div><div class="stat-value">${exosDone}/${exosTotal}</div><div class="stat-sub">${Math.round((exosDone / exosTotal) * 100)} % réalisés</div></div>
      <div class="stat-cell"><div class="cell-label">Points clés couverts</div><div class="stat-value">${ptsDone}</div><div class="stat-sub">sur ${ptsTotal} au total</div></div>
    </section>

    <section class="dash-columns">
      <div class="phase-progress-col">
        <div class="col-title">Avancement par phase</div>
        ${phaseStatsHtml}
      </div>
      <div class="timeline-col">
        <div class="timeline-header">
          <span class="drawer-bar-label">Timeline — 34 semaines</span>
          <div class="filter-group">${renderFilters()}</div>
        </div>
        <div class="timeline-scroll tl-scroll">${timelineHtml}</div>
      </div>
    </section>
  </div>`;
}

function renderSeance() {
  const { weeks, selected, tab } = state;
  const sel = weeks.find((w) => w.num === selected) || weeks[0];
  const selPhase = phaseOf(sel.num);

  const statusButtons = [S.todo, S.doing, S.done].map((st) => {
    const active = sel.status === st;
    const cls = active ? (st === S.doing ? "active is-doing" : "active") : "";
    return `<button class="status-btn ${cls}" data-action="set-status" data-status="${escapeHtml(st)}">${escapeHtml(st)}</button>`;
  }).join("");

  const tabsDef = [
    { label: "Cours", count: String(sel.points.length) },
    { label: "Formules", count: String(sel.formules.length) },
    { label: "Exercices", count: `${sel.exos.filter((e) => e.done).length}/${sel.exos.length}` },
  ];
  const tabsHtml = tabsDef.map((t) => `<button class="tab-btn ${tab === t.label ? "active" : ""}" data-action="set-tab" data-tab="${t.label}"><span>${t.label}</span><span class="count">${t.count}</span></button>`).join("");

  let content;
  if (tab === "Formules") {
    const formHtml = sel.formules.map((txt) => `<div class="formule-line">${escapeHtml(txt)}</div>`).join("");
    content = `<div class="cell-label" style="margin-bottom:var(--space-6)">Repères et formules</div>${formHtml}`;
  } else if (tab === "Exercices") {
    const exoHtml = sel.exos.map((e, i) => `<button class="exo-card ${e.done ? "done" : ""}" data-action="toggle-exo" data-idx="${i}">
        <span class="box"></span>
        <span>
          <div class="titre">${escapeHtml(e.titre)}</div>
          <div class="desc">${escapeHtml(e.desc)}</div>
          <div class="file">${escapeHtml(e.file)}</div>
        </span>
      </button>`).join("");
    content = `<div class="exos-head"><span class="label">Exercices Python</span><span class="count">${sel.exos.filter((e) => e.done).length} faits</span></div><div class="exos-grid">${exoHtml}</div>`;
  } else {
    const pointsHtml = sel.points.map((txt, i) => `<div class="point-item"><span class="p-n">${String(i + 1).padStart(2, "0")}</span><span class="p-txt">${escapeHtml(txt)}</span></div>`).join("");
    content = `<div class="cell-label" style="margin-bottom:var(--space-6)">Points clés à maîtriser</div><div class="points-grid">${pointsHtml}</div>`;
  }

  return `<div>
    <section class="seance-head">
      <div class="seance-num">S${sel.num}</div>
      <div class="seance-meta">
        <div class="seance-phase">Phase ${selPhase.num} · ${escapeHtml(selPhase.label)}</div>
        <div class="seance-theme">${escapeHtml(sel.theme)}</div>
        <div class="seance-id">notion://seances/S${String(sel.num).padStart(2, "0")}</div>
      </div>
      <div class="status-box">
        <span class="status-box-label">Statut</span>
        <div class="status-group">${statusButtons}</div>
      </div>
    </section>

    <nav class="tabs-nav">
      ${tabsHtml}
      <div class="nav-arrows">
        <button class="arrow-btn" data-action="prev-seance" ${sel.num <= 1 ? "disabled" : ""} aria-label="Séance précédente">←</button>
        <button class="arrow-btn" data-action="next-seance" ${sel.num >= 34 ? "disabled" : ""} aria-label="Séance suivante">→</button>
      </div>
    </nav>

    <div class="tab-content" style="--cours-cols:2">
      ${content}
    </div>
  </div>`;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = renderHeader() + renderDrawer() + (state.view === "dash" ? renderDash() : renderSeance());
}

function handleAction(el) {
  const action = el.dataset.action;
  const num = Number(el.dataset.num);
  switch (action) {
    case "go-dash": state.view = "dash"; break;
    case "go-seance": state.view = "seance"; break;
    case "toggle-drawer": state.drawer = !state.drawer; break;
    case "set-filter": state.filter = el.dataset.filter; break;
    case "open-week": state.selected = num; state.view = "seance"; state.drawer = false; break;
    case "open-next": state.selected = num; state.view = "seance"; state.tab = "Cours"; break;
    case "start-next": setStatus(num, S.doing); state.selected = num; break;
    case "pick-phase": state.selected = num; state.tab = "Cours"; state.view = "seance"; break;
    case "set-tab": state.tab = el.dataset.tab; break;
    case "prev-seance": state.selected = Math.max(1, state.selected - 1); break;
    case "next-seance": state.selected = Math.min(34, state.selected + 1); break;
    case "set-status": setStatus(state.selected, el.dataset.status); break;
    case "toggle-exo": toggleExo(state.selected, Number(el.dataset.idx)); break;
    default: return;
  }
  persist();
  render();
  const scroller = document.getElementById("app");
  if (["go-dash", "go-seance", "open-week", "open-next", "pick-phase"].includes(action)) {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }
}

document.getElementById("app").addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  handleAction(el);
});

document.getElementById("app").addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const el = e.target.closest('[data-action][role="button"]');
  if (!el) return;
  e.preventDefault();
  handleAction(el);
});

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
