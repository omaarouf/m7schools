# EXECUTION_STEPS.md
# OFPPT Tech Academy - Guide de Deploiement Complet

**Plateforme cible:** Windows ONLY  
**Createur:** Omar Maarouf  
**Cout total:** $0 (100% gratuit)  
**Duree totale estimee:** 60 a 90 minutes

---

## ETAPE 0 - Prerequis

**Temps estime:** 5 minutes  
**Objectif:** Verifier que votre machine Windows est prete.

### Checklist des prerequis

| Prerequis | Requis | Verification |
|-----------|--------|--------------|
| Windows 10 ou 11 | Obligatoire | Verifier dans Parametres > A propos |
| Connexion internet | Obligatoire | Tester avec le navigateur |
| Node.js 18+ | A installer (Etape 1) | `node --version` dans CMD |
| Git | A installer (Etape 8) | `git --version` dans CMD |
| VS Code | Recommande | Disponible sur code.visualstudio.com |
| Compte GitHub | A creer (Etape 6) | github.com |
| Compte Vercel | A creer (Etape 9) | vercel.com |

### Comment ouvrir PowerShell ou CMD

**Option 1 - PowerShell:**
```
Touche Windows + X > Windows PowerShell
```

**Option 2 - CMD:**
```
Touche Windows + R > taper "cmd" > Entree
```

**Option 3 - Via l Explorateur:**
```
Naviguer dans le dossier du projet > Shift + Clic droit > "Ouvrir la fenetre PowerShell ici"
```

---

## ETAPE 1 - Installer Node.js

**Temps estime:** 10 minutes  
**Objectif:** Installer Node.js sur Windows.

### Telecharger Node.js

1. Ouvrir votre navigateur web
2. Aller a l adresse: `https://nodejs.org/en/download`
3. Cliquer sur **"Windows Installer (.msi)"** - version LTS recommandee
4. Sauvegarder le fichier `.msi` dans vos Telechargements

### Installer Node.js

1. Double-cliquer sur le fichier `.msi` telecharge
2. Cliquer **"Next"** a chaque etape
3. Cocher la case **"Add to PATH"** si demandee (cocher par defaut)
4. Cliquer **"Install"**
5. Attendre la fin de l installation
6. Cliquer **"Finish"**

### Verifier l installation

Ouvrir un **nouveau** CMD ou PowerShell (important: fermer l ancien):

```cmd
node --version
```

Sortie attendue:
```
v20.x.x
```

```cmd
npm --version
```

Sortie attendue:
```
10.x.x
```

### Depannage Etape 1

**Probleme:** `node` n est pas reconnu comme commande  
**Solution:** Redemarrer Windows, puis reessayer

**Probleme:** Version trop ancienne  
**Solution:** Desinstaller l ancienne version (Panneau de configuration > Programmes), puis reinstaller

---

## ETAPE 2 - Obtenir les Fichiers du Projet

**Temps estime:** 5 minutes  
**Objectif:** Placer le dossier `ofppt-academy` sur votre machine.

### Option A - Depuis le fichier ZIP fourni (recommande)

1. Localiser le fichier `ofppt-academy.zip` telecharge
2. Clic droit sur le fichier > **"Extraire tout..."**
3. Choisir un emplacement simple, par exemple: `C:\Projets\`
4. Cliquer **"Extraire"**
5. Vous devriez avoir: `C:\Projets\ofppt-academy\`

### Option B - Creer manuellement

Si vous creez le projet depuis zero:

```cmd
mkdir C:\Projets
cd C:\Projets
mkdir ofppt-academy
cd ofppt-academy
```

Ensuite creer les sous-dossiers:

```cmd
mkdir docs\idosr\networking
mkdir docs\idosr\windows
mkdir docs\idosr\linux
mkdir docs\devfullstack
mkdir docs\quizzes
mkdir docs\reference
mkdir src\css
mkdir static\img
```

### Naviguer vers le dossier du projet

```cmd
cd C:\Projets\ofppt-academy
```

**Note:** Toutes les commandes suivantes doivent etre executees depuis ce dossier.

### Depannage Etape 2

**Probleme:** Chemin avec espaces (ex: "Mes Documents")  
**Solution:** Choisir un chemin sans espaces: `C:\Projets\ofppt-academy`

---

## ETAPE 3 - Installer les Dependances

**Temps estime:** 3 a 5 minutes (selon la connexion internet)  
**Objectif:** Telecharger les modules Docusaurus et React.

### Commande d installation

Dans le dossier `ofppt-academy`, executer:

```cmd
npm install
```

### Sortie attendue

```
added 1234 packages in 45s
```

Cela va creer le dossier `node_modules/` avec toutes les dependances.

**Important:** Ne pas modifier ou supprimer le dossier `node_modules/`.

### Depannage Etape 3

**Probleme:** Erreur de permissions  
**Solution:** Executer CMD en tant qu administrateur (Clic droit > "Executer en tant qu administrateur")

**Probleme:** Erreur reseau / timeout  
**Solution:** Verifier la connexion internet et reessayer:
```cmd
npm install --prefer-offline
```

**Probleme:** Erreur de version Node.js  
**Solution:** Verifier que Node.js >= 18 est installe avec `node --version`

---

## ETAPE 4 - Lancer le Serveur Local

**Temps estime:** 1 a 2 minutes  
**Objectif:** Visualiser le site sur votre machine avant de le deployer.

### Demarrer le serveur

```cmd
npm start
```

### Sortie attendue

```
[INFO] Starting the development server...
[SUCCESS] Docusaurus website is running at: http://localhost:3000/
```

### Visualiser le site

1. Votre navigateur par defaut s ouvre automatiquement
2. Si non, ouvrir manuellement: `http://localhost:3000`
3. Le site OFPPT Tech Academy s affiche avec le theme bleu royal

### Fonctionnalites a tester

- Navigation dans la barre laterale
- Basculer entre mode clair et mode sombre (bouton en haut a droite)
- Naviguer entre les cours
- Verifier que les lecons s affichent correctement
- Tester sur mobile en reduisant la fenetre du navigateur

### Arreter le serveur

```cmd
Ctrl + C
```

Repondre `O` si demande de confirmation.

---

## ETAPE 5 - Verifier l Installation

**Temps estime:** 5 minutes  
**Objectif:** S assurer que tout fonctionne avant de deployer.

### Verification de la structure

```cmd
dir docs\
dir docs\idosr\networking\
dir docs\idosr\windows\
dir docs\idosr\linux\
dir docs\devfullstack\
```

Chaque dossier doit contenir les fichiers `.md` des lecons.

### Test de construction (build)

```cmd
npm run build
```

### Sortie attendue

```
[SUCCESS] Generated static files in "build".
[INFO] Use `npm run serve` to test your build locally.
```

Si aucune erreur n apparait, le projet est pret pour le deploiement.

### Test de la version construite

```cmd
npm run serve
```

Ouvrir `http://localhost:3000` - c est la version finale qui sera deployee sur Vercel.

---

## ETAPE 6 - Creer un Compte GitHub

**Temps estime:** 5 minutes  
**Objectif:** Creer votre compte GitHub gratuit.

### Creer le compte

1. Aller sur `https://github.com`
2. Cliquer **"Sign up"**
3. Entrer votre adresse email
4. Creer un mot de passe fort
5. Choisir un nom d utilisateur (ex: `omar-maarouf`)
6. Verifier votre email (cliquer le lien de confirmation)

### Installer Git pour Windows

1. Aller sur `https://git-scm.com/download/win`
2. Telecharger **"64-bit Git for Windows Setup"**
3. Installer avec les options par defaut
4. Verifier dans CMD:

```cmd
git --version
```

Sortie attendue:
```
git version 2.x.x.windows.x
```

### Configurer Git

```cmd
git config --global user.name "Omar Maarouf"
git config --global user.email "votre@email.com"
```

---

## ETAPE 7 - Creer un Depot GitHub

**Temps estime:** 3 minutes  
**Objectif:** Creer le depot distant pour votre projet.

### Creer le depot sur GitHub.com

1. Se connecter sur `https://github.com`
2. Cliquer le bouton **"+"** en haut a droite > **"New repository"**
3. Remplir les informations:
   - **Repository name:** `ofppt-academy`
   - **Description:** `OFPPT Tech Academy - Plateforme d apprentissage IT`
   - **Visibility:** Public (pour Vercel gratuit) ou Private
4. **Ne pas** cocher "Add a README file" (vous en avez deja un)
5. Cliquer **"Create repository"**

### Copier l URL du depot

Sur la page du depot cree, copier l URL:
```
https://github.com/VOTRE-USERNAME/ofppt-academy.git
```

---

## ETAPE 8 - Pousser le Code sur GitHub

**Temps estime:** 5 minutes  
**Objectif:** Envoyer votre projet local vers GitHub.

### Initialiser Git dans le projet

Dans le dossier `ofppt-academy`:

```cmd
git init
```

Sortie attendue:
```
Initialized empty Git repository in C:/Projets/ofppt-academy/.git/
```

### Ajouter tous les fichiers

```cmd
git add .
```

### Creer le premier commit

```cmd
git commit -m "Initial commit - OFPPT Tech Academy"
```

Sortie attendue:
```
[main (root-commit) abc1234] Initial commit - OFPPT Tech Academy
 XX files changed, XXX insertions(+)
```

### Connecter au depot GitHub

```cmd
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/ofppt-academy.git
```

### Envoyer le code

```cmd
git push -u origin main
```

Sortie attendue:
```
Enumerating objects: XX, done.
Counting objects: 100% (XX/XX), done.
Writing objects: 100% (XX/XX), XX.XX KiB | XX.XX MiB/s, done.
Branch 'main' set up to track remote origin/main.
```

### Depannage Etape 8

**Probleme:** Authentification refusee  
**Solution:** Utiliser un Personal Access Token.

1. Sur GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Cliquer **"Generate new token"**
3. Cocher la case **"repo"**
4. Copier le token
5. Utiliser le token comme mot de passe quand Git le demande

---

## ETAPE 9 - Deployer sur Vercel

**Temps estime:** 5 minutes  
**Objectif:** Mettre en ligne le site OFPPT Tech Academy sur Vercel.

### Creer un compte Vercel

1. Aller sur `https://vercel.com`
2. Cliquer **"Sign Up"**
3. Choisir **"Continue with GitHub"** (recommande pour la simplicite)
4. Autoriser Vercel a acceder a GitHub

### Importer le projet

1. Sur le tableau de bord Vercel, cliquer **"Add New... > Project"**
2. Sous "Import Git Repository", trouver `ofppt-academy`
3. Cliquer **"Import"**

### Configurer le deploiement

Vercel detecte automatiquement Docusaurus. Verifier les parametres:

| Parametre | Valeur |
|-----------|--------|
| Framework Preset | Other (Docusaurus sera detecte) |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Install Command | `npm install` |

4. Cliquer **"Deploy"**

### Attendre le deploiement

```
Building...
[1/3] Installing dependencies
[2/3] Building application
[3/3] Deploying
SUCCESS - Deployed to: https://ofppt-academy.vercel.app
```

Duree: 2 a 5 minutes.

---

## ETAPE 10 - Mise en Ligne et Tests Finaux

**Temps estime:** 5 minutes  
**Objectif:** Tester le site en ligne et le partager avec vos etudiants.

### Acceder au site

Votre site est accessible a:
```
https://ofppt-academy-VOTRE-USERNAME.vercel.app
```

Ou avec un domaine personnalise si configure.

### Tests a effectuer

- Naviguer dans tous les cours
- Tester le mode sombre / clair
- Tester sur mobile (telephone ou tablette)
- Verifier que tous les liens fonctionnent
- Tester la barre de recherche (si activee)

### Partager avec les etudiants

1. Copier le lien Vercel
2. Partager via email, WhatsApp, ou autre
3. Les etudiants peuvent acceder sans compte, sans installation

---

## MISE A JOUR DU SITE APRES DEPLOIEMENT

Pour ajouter du contenu apres le deploiement:

```cmd
cd C:\Projets\ofppt-academy

REM Modifier ou ajouter des fichiers .md dans docs/

git add .
git commit -m "Ajout lecon XX - NOM DE LA LECON"
git push
```

Vercel detecte automatiquement le push et redeploit en 2-3 minutes.

---

## COMMENT AJOUTER DES ETUDIANTS

### Option 1 - Partager l URL (recommande)
Simplement partager le lien du site. Aucun compte requis pour lire.

### Option 2 - Collaborateurs GitHub
Pour que d autres contributeurs puissent modifier le contenu:
1. Sur GitHub > Settings > Collaborators
2. Cliquer "Add people"
3. Entrer le nom d utilisateur GitHub de l etudiant

---

## COUT DETAILLE - $0 TOTAL

| Service | Fonctionnalite | Limite gratuite | Cout |
|---------|---------------|-----------------|------|
| Node.js | Runtime JavaScript | Illimite | $0 |
| Docusaurus | Framework de documentation | Illimite | $0 |
| GitHub | Depot de code | Depots publics illimites | $0 |
| Vercel | Hebergement web | 100 Go bande passante/mois | $0 |
| VS Code | Editeur de code | Illimite | $0 |
| **TOTAL** | | | **$0** |

---

## GUIDE DE DEPANNAGE GENERAL

### Erreur: "npm not found"
```
Reinstaller Node.js depuis nodejs.org
Redemarrer Windows
```

### Erreur: "Cannot find module"
```cmd
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Erreur: "Port 3000 already in use"
```cmd
npm start -- --port 3001
```

### Erreur: Build echoue sur Vercel
1. Verifier que `npm run build` fonctionne en local sans erreur
2. Consulter les logs Vercel dans le tableau de bord
3. Verifier que tous les IDs dans `sidebars.js` correspondent aux fichiers existants

### Erreur: Page non trouvee (404)
- Verifier que le fichier `.md` existe dans le bon dossier
- Verifier que l ID dans le frontmatter correspond a celui dans `sidebars.js`
- Relancer `npm start` pour recharger la configuration

---

## PROCHAINES ETAPES

Apres le deploiement reussi:

1. **Remplacer le contenu placeholder** - Editer les fichiers `.md` avec votre contenu reel
2. **Ajouter des images** - Placer les images dans `static/img/` et referencer dans les `.md`
3. **Activer la recherche** - Ajouter le plugin `@docusaurus/plugin-search-local` dans `package.json`
4. **Domaine personnalise** - Dans Vercel > Settings > Domains, ajouter votre propre domaine
5. **Analytiques** - Ajouter Google Analytics dans `docusaurus.config.js`

---

*Guide cree pour OFPPT Tech Academy | Omar Maarouf | Docusaurus 3.0 + Vercel*
