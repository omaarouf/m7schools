# PROJECT_STRUCTURE.md
# OFPPT Tech Academy - Structure Complete du Projet

**Createur:** Omar Maarouf  
**Plateforme:** Docusaurus 3.0  
**Hebergement:** Vercel (gratuit)  
**Version Control:** GitHub (gratuit)

---

## Arborescence Complete du Projet

```
ofppt-academy/
|
|-- package.json                    # Dependances Node.js et scripts npm
|-- docusaurus.config.js            # Configuration principale Docusaurus
|-- sidebars.js                     # Navigation et structure des barres laterales
|-- .gitignore                      # Fichiers ignores par Git
|
|-- src/
|   |-- css/
|   |   |-- custom.css              # Theme personnalise (bleu royal + blanc/noir)
|   |-- pages/
|       |-- index.js                # Page d accueil (optionnel, redirection)
|
|-- static/
|   |-- img/
|       |-- logo.svg                # Logo OFPPT Tech Academy
|       |-- favicon.ico             # Icone onglet navigateur
|
|-- docs/
    |-- intro.md                    # Page d accueil de la documentation
    |
    |-- idosr/
    |   |-- networking/             # COURS 1 - Conception Reseau (10 lecons)
    |   |   |-- intro.md
    |   |   |-- lesson-01-modele-osi.md
    |   |   |-- lesson-02-adressage-ip.md
    |   |   |-- lesson-03-sous-reseautage.md
    |   |   |-- lesson-04-routage.md
    |   |   |-- lesson-05-commutation.md
    |   |   |-- lesson-06-vlans.md
    |   |   |-- lesson-07-protocoles-wan.md
    |   |   |-- lesson-08-securite-reseau.md
    |   |   |-- lesson-09-reseau-sans-fil.md
    |   |   |-- lesson-10-depannage-reseau.md
    |   |
    |   |-- windows/                # COURS 2 - Administration Windows (8 lecons)
    |   |   |-- intro.md
    |   |   |-- lesson-01-active-directory.md
    |   |   |-- lesson-02-dns-dhcp.md
    |   |   |-- lesson-03-group-policy.md
    |   |   |-- lesson-04-file-services.md
    |   |   |-- lesson-05-iis-web-server.md
    |   |   |-- lesson-06-powershell.md
    |   |   |-- lesson-07-backup-recovery.md
    |   |   |-- lesson-08-virtualization.md
    |   |
    |   |-- linux/                  # COURS 3 - Administration Linux (8 lecons)
    |       |-- intro.md
    |       |-- lesson-01-linux-basics.md
    |       |-- lesson-02-file-system.md
    |       |-- lesson-03-user-management.md
    |       |-- lesson-04-permissions.md
    |       |-- lesson-05-processes.md
    |       |-- lesson-06-networking.md
    |       |-- lesson-07-services.md
    |       |-- lesson-08-shell-scripting.md
    |
    |-- devfullstack/               # COURS 4 - Dev Full Stack (9 lecons)
    |   |-- intro.md
    |   |-- lesson-01-html-css.md
    |   |-- lesson-02-javascript.md
    |   |-- lesson-03-react-basics.md
    |   |-- lesson-04-nodejs.md
    |   |-- lesson-05-express.md
    |   |-- lesson-06-databases.md
    |   |-- lesson-07-rest-api.md
    |   |-- lesson-08-authentication.md
    |   |-- lesson-09-deployment.md
    |
    |-- quizzes/                    # QUIZ - 5 fichiers
    |   |-- quiz-networking.md
    |   |-- quiz-windows.md
    |   |-- quiz-linux.md
    |   |-- quiz-devfullstack.md
    |   |-- quiz-general.md
    |
    |-- reference/                  # REFERENCES RAPIDES - 4 fichiers
        |-- commands-linux.md
        |-- commands-windows.md
        |-- networking-cheatsheet.md
        |-- git-cheatsheet.md
```

---

## Description des Fichiers de Configuration

### package.json
Fichier de configuration Node.js. Contient:
- Le nom du projet: `ofppt-tech-academy`
- La version: `1.0.0`
- Les dependances Docusaurus 3.0
- Les scripts: `npm start`, `npm run build`, `npm run serve`
- La version Node.js requise: >= 18.0

### docusaurus.config.js
Fichier de configuration principal de Docusaurus. Contient:
- Le titre du site: `OFPPT Tech Academy`
- L URL de production Vercel
- La configuration de la barre de navigation
- La configuration du pied de page
- Le mode sombre active par defaut
- Les couleurs du theme
- La configuration des blocs de code

### sidebars.js
Definit la structure de navigation dans la barre laterale:
- `idosrSidebar`: Networking, Windows, Linux
- `devfullstackSidebar`: Dev Full Stack
- `quizzesSidebar`: Quizzes
- `referenceSidebar`: Quick Reference

### src/css/custom.css
Theme personnalise avec les couleurs officielles:
- **Mode Clair:** Bleu royal `#1a3c8f` (principal), blanc `#ffffff`, noir `#1a1a1a`
- **Mode Sombre:** Bleu clair `#4d7fff` (principal), fond `#0d1117`, texte `#e6edf3`
- Styles pour: navbar, sidebar, tableaux, blocs de code, en-tetes, admonitions

---

## Statistiques du Projet

| Categorie | Nombre de Fichiers |
|-----------|--------------------|
| Cours Conception Reseau | 11 (intro + 10 lecons) |
| Cours Administration Windows | 9 (intro + 8 lecons) |
| Cours Administration Linux | 9 (intro + 8 lecons) |
| Cours Dev Full Stack | 10 (intro + 9 lecons) |
| Quizzes | 5 |
| References Rapides | 4 |
| Fichiers de configuration | 5 |
| **Total fichiers docs** | **48** |
| **Total fichiers projet** | **~53** |

---

## Couleurs du Theme

| Role | Mode Clair | Mode Sombre |
|------|-----------|-------------|
| Couleur principale | `#1a3c8f` (Bleu Royal) | `#4d7fff` (Bleu Clair) |
| Fond principal | `#ffffff` (Blanc) | `#0d1117` (Noir GitHub) |
| Fond surface | `#f4f7fc` | `#161b22` |
| Texte principal | `#1a1a1a` (Noir) | `#e6edf3` (Blanc casse) |
| Navbar fond | `#1a3c8f` | `#161b22` |
| Footer fond | `#0e2460` | `#0d1117` |

---

## Points de Personnalisation

Pour modifier le theme et le contenu:

1. **Couleurs:** Editer `src/css/custom.css` - variables CSS dans `:root` et `[data-theme='dark']`
2. **Titre du site:** Editer `docusaurus.config.js` - propriete `title`
3. **URL de production:** Editer `docusaurus.config.js` - propriete `url`
4. **Navigation:** Editer `docusaurus.config.js` - section `navbar.items`
5. **Contenu des cours:** Editer les fichiers `.md` dans `docs/`
6. **Nouvelle lecon:** Creer un nouveau fichier `.md` et ajouter son ID dans `sidebars.js`

---

## Checklist des Composants

- [x] Configuration Docusaurus 3.0
- [x] Theme bleu royal / blanc / noir
- [x] Mode sombre active par defaut
- [x] Navigation multi-sections (4 sidebars)
- [x] Cours Conception Reseau (10 lecons)
- [x] Cours Administration Windows (8 lecons)
- [x] Cours Administration Linux (8 lecons)
- [x] Cours Dev Full Stack (9 lecons)
- [x] Quizzes (5 fichiers)
- [x] References rapides (4 fichiers)
- [x] Page d accueil (intro.md)
- [x] Logo SVG
- [x] .gitignore configure
- [x] Compatible GitHub + Vercel
- [x] Design responsive (mobile)
- [x] Blocs de code avec coloration syntaxique
- [x] Tableaux styles
- [x] Pied de page avec liens

---

*Genere pour OFPPT Tech Academy | Createur: Omar Maarouf*
