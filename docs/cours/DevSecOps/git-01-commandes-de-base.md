---
id: git-01-commandes-de-base
title: Git - Commandes de base
sidebar_label: 1. Commandes de base
---

# Git - Guide pratique des commandes

Ce guide regroupe toutes les commandes Git vues en lab, avec leur utilité, des exemples et les erreurs classiques rencontrées.

:::info Les 3 zones de Git

```text
Dossier de travail  --git add-->  Zone de préparation (staging)  --git commit-->  Dépôt (historique)
```

- **Dossier de travail** : tes fichiers tels que tu les édites.
- **Zone de préparation** (*staging area* / *index*) : les changements sélectionnés avec `git add`.
- **Dépôt** : l'historique définitif, créé avec `git commit`.

:::

:::warning Piège du tiret long

Si tu copies une commande depuis un document Word ou PDF, le double tiret `--` est parfois transformé en tiret long `–`. Le terminal ne le reconnaît pas. Il faut toujours écrire `--hard`, `--staged`, `--cached`, `--oneline` avec **deux tirets normaux**.

:::

---

## 1. Initialiser un dépôt et faire un premier commit

**Commandes :** `git init`, `git config`, `git status`, `git add`, `git commit`

### Créer le dossier et initialiser Git

```bash
mkdir myrepo
cd myrepo
git init
# Initialized empty Git repository in .../myrepo/.git/
```

`git init` crée un dossier caché `.git` qui contient toute la mémoire du projet (historique, branches, configuration). Il ne se fait **qu'une seule fois par projet**. Avec `git clone`, ce n'est pas nécessaire, car le clone crée déjà le `.git`.

### Configurer son identité

```bash
git config --global user.name "TonPseudoGitHub"
git config --global user.email "ton.email@exemple.com"
```

- Chaque commit est signé avec ce nom et cet email.
- `--global` applique la config à **tous les dépôts** de la machine (fichier `~/.gitconfig`). Sans `--global`, elle ne s'applique qu'au dépôt courant (`.git/config`).
- Utilise le même email que ton compte GitHub (ou l'adresse `noreply` de GitHub), sinon tes commits ne seront pas reliés à ton profil.

Vérification :

```bash
git config --global user.name
git config --global user.email
git config --list
```

### Cycle de base

```bash
touch file1.txt          # créer un fichier
git status               # file1.txt apparaît en rouge (Untracked)
git add file1.txt        # préparer le fichier
git status               # file1.txt passe en vert (Changes to be committed)
git commit -m "new file" # enregistrer
git status               # nothing to commit, working tree clean
```

### Lire la sortie de `git status`

| Message | Signification |
|---|---|
| `Untracked files` (rouge) | Fichiers nouveaux que Git ne suit pas encore |
| `Changes not staged for commit` (rouge) | Fichiers suivis et modifiés, pas encore ajoutés |
| `Changes to be committed` (vert) | Fichiers dans la zone de préparation, prêts à être commités |
| `nothing to commit, working tree clean` | Tout est commité |

Astuce : `git status -s` donne une version courte.

### Variantes de `git add`

```bash
git add fichier.txt    # un seul fichier
git add .              # tout le dossier courant
git add -A             # tous les changements du dépôt (y compris suppressions)
```

`git add` seul, sans argument, n'ajoute rien (`Nothing specified, nothing added.`).

:::note Avertissement LF / CRLF

Sous Windows, tu verras `warning: LF will be replaced by CRLF the next time Git touches it`. C'est un simple avertissement sur les fins de ligne, sans gravité.

:::

---

## 2. Lister les fichiers : `ls` et `git ls-files`

```bash
ls               # tous les fichiers du dossier (commande du système, pas Git)
ls -l            # détails (droits, taille, date)
ls -a            # inclut les fichiers cachés (dont .git)
git ls-files     # uniquement les fichiers suivis par Git
```

Exemple :

```bash
echo "test" > a.txt
echo "test" > b.txt
git add a.txt

ls               # a.txt  b.txt
git ls-files     # a.txt
```

Autres options :

```bash
git ls-files --others   # fichiers non suivis
git ls-files --staged   # détail de la zone de préparation
```

Un fichier présent avec `ls` mais absent de `git ls-files` n'est **pas suivi** par Git.

---

## 3. Historique : `git log`, `history`, `git commit -a`

### `git log`

```bash
git log             # historique détaillé (hash, auteur, date, message)
git log --oneline   # une ligne par commit
git log --oneline --graph --all   # vue graphique de toutes les branches
```

Appuie sur `q` pour quitter l'affichage.

```text
30b0de9 (HEAD -> master) second file
ac6b7de new file
```

### `history` (commande du shell, pas Git)

`history` liste les **commandes tapées** dans le terminal, numérotées. On peut relancer une commande avec `!numéro`.

### `git commit -a -m`

```bash
echo "new line 1st time" >> file1.txt
git status                               # file1.txt modifié, non préparé
git commit -a -m "updated with 2nd line"
```

- `-a` ajoute automatiquement tous les fichiers **déjà suivis et modifiés**, sans passer par `git add`.
- `-m` donne le message du commit.
- `-a` ne prend **pas** les nouveaux fichiers (non suivis) : pour ceux-là, `git add` reste obligatoire.

---

## 4. Voir les modifications : `git diff`

```bash
git diff                  # dossier de travail  <->  zone de préparation
git diff --staged         # zone de préparation <->  dernier commit
git diff --staged fichier # idem pour un seul fichier
```

`git diff --cached` est équivalent à `--staged`.

| Commande | Compare |
|---|---|
| `git diff` | changements **pas encore préparés** |
| `git diff --staged` | changements **préparés** (ce qui sera dans le prochain commit) |

Exemple complet :

```bash
echo "bonjour" > a.txt
git add a.txt
git commit -m "ajout de a"

echo "salut" >> a.txt
git diff            # montre +salut
git add a.txt
git diff            # ne montre plus rien
git diff --staged   # montre +salut
```

Lecture de la sortie : une ligne `+` (verte) est ajoutée, une ligne `-` (rouge) est supprimée, `@@ ... @@` indique la position dans le fichier.

`git diff` ne montre pas les fichiers non suivis : il faut d'abord les ajouter.

---

## 5. Supprimer des fichiers : `git rm`

```bash
git rm -f file3.txt         # supprime du disque ET du suivi Git
git rm --cached file2.txt   # supprime du suivi Git seulement (le fichier reste sur le disque)
```

| Commande | Fichier sur le disque | Suivi par Git |
|---|---|---|
| `git rm fichier` | supprimé | arrêté |
| `git rm --cached fichier` | conservé | arrêté |

Après chaque `git rm`, il faut commiter la suppression :

```bash
git rm --cached file2.txt
git commit -m "deleted only from local repo"
git status   # file2.txt apparaît maintenant en Untracked
```

Utilité de `--cached` : retirer par erreur un fichier ajouté (`.env`, mots de passe, `node_modules`) avant de l'ignorer avec `.gitignore`.

Options utiles :

- Dossier : `git rm -r --cached dossier/`
- `-f` force la suppression même avec des modifications non commitées (elles seront perdues).

:::danger Fichier sensible déjà commité

Même après `git rm --cached`, le fichier reste dans l'**historique** des anciens commits. Si c'était un mot de passe ou une clé, considère-le comme compromis et change-le.

:::

---

## 6. Ignorer des fichiers : `.gitignore`

Le fichier `.gitignore` liste les fichiers et dossiers que Git doit ignorer.

### Syntaxe

| Motif | Effet |
|---|---|
| `file.txt` | ignore le fichier `file.txt` |
| `*.txt` | ignore tous les fichiers `.txt` |
| `dossier/` | ignore tout le dossier |
| `!important.txt` | exception : garde ce fichier malgré une règle précédente |
| `**/logs` | correspond à `logs` dans n'importe quel sous-dossier |
| `# commentaire` | ligne ignorée |

### Exemple

```bash
touch .gitignore
echo "file2.txt" >> .gitignore
git status                       # .gitignore apparaît, file2.txt a disparu des Untracked
git add .gitignore
git commit -m "ignore file added"
```

:::warning

`.gitignore` n'agit que sur les fichiers **non suivis**. Si un fichier est déjà suivi, il faut d'abord faire `git rm --cached fichier`, puis l'ajouter au `.gitignore`.

:::

---

## 7. Annuler un commit en sécurité : `git revert`

`git revert` annule un commit en **créant un nouveau commit** qui fait l'inverse. L'historique n'est pas réécrit.

```bash
git log --oneline            # repérer le hash
git revert e970eb0           # annuler ce commit (ouvre un éditeur de message)
git revert --no-edit e970eb0 # sans ouvrir l'éditeur
git revert HEAD              # annuler le dernier commit
```

Résultat :

```text
0e965d1 Revert "ignore file added"
e970eb0 ignore file added
...
```

C'est la méthode **sûre** pour annuler un commit **déjà poussé** sur GitHub.

En cas de conflit : corriger les fichiers, puis `git add .` et `git revert --continue`. Pour abandonner : `git revert --abort`. Pour annuler un commit de fusion, préciser le parent avec `-m 1`.

---

## 8. Revenir en arrière : `git reset --hard`

```bash
git reset --hard HEAD~2     # reculer de 2 commits
git reset --hard f2bb38e    # revenir à un commit précis
git reset --hard HEAD       # annuler toutes les modifications non commitées
```

### Les 3 modes

| Mode | Historique | Zone de préparation | Dossier de travail |
|---|---|---|---|
| `--soft` | recule | conservée | conservé |
| `--mixed` (défaut) | recule | vidée | conservé |
| `--hard` | recule | vidée | **écrasé** |

:::danger Attention

- Les modifications **non commitées sont perdues définitivement**.
- Ne jamais utiliser `reset --hard` sur des commits **déjà poussés** : utilise `git revert`.
- Les fichiers non suivis ne sont pas touchés.

:::

### Filet de sécurité : `git reflog`

Si tu as reculé par erreur sur des **commits** :

```bash
git reflog                  # liste les anciennes positions de HEAD
git reset --hard c3c3c3c    # revenir à l'état d'avant
```

### Revert ou reset ?

| Commande | Effet sur l'historique | Usage |
|---|---|---|
| `git revert` | ajoute un commit d'annulation | commits déjà partagés (push) |
| `git reset` | supprime des commits | commits locaux uniquement |

---

## 9. Les branches : `git branch`, `git checkout`

Une branche est simplement une **étiquette qui pointe vers un commit**. Créer une branche ne copie rien.

```bash
git branch                    # lister (* = branche actuelle)
git branch b1                 # créer b1 à partir du commit actuel
git branch b2 master          # créer b2 à partir de master
git checkout b1               # aller sur b1
git checkout -b b3            # créer ET aller sur b3
git branch -d b1              # supprimer (si déjà fusionnée)
git branch -D b1              # supprimer de force
git branch -m nouveau-nom     # renommer la branche actuelle
```

Depuis Git 2.23, il existe aussi `git switch` (plus clair que `checkout`) :

```bash
git switch b1
git switch -c b3
```

### Ce qu'il faut retenir

- Juste après leur création, `b1`, `b2` et `master` pointent sur le **même commit** : `git log --oneline` affiche `(HEAD -> b2, master, b1)`.
- Les modifications **non commitées** (dossier de travail et zone de préparation) n'appartiennent à aucune branche : elles te **suivent** quand tu changes de branche.
- Si tes modifications entrent en conflit avec l'autre branche, Git refuse de changer : commit ou `git stash` d'abord.

### Exemple : les branches divergent

```bash
git checkout b1
touch file3.txt
echo "new file on b1" >> file3.txt
git add file3.txt
git commit -m "on b1"

git checkout master     # file3.txt disparaît du dossier de master
git log --oneline       # le commit "on b1" n'apparaît pas sur master
```

---

## 10. Fusionner : `git merge`

On se place sur la branche qui **reçoit**, puis on indique la branche à intégrer :

```bash
git checkout master
git merge b1
```

:::caution Syntaxe

La syntaxe correcte est `git merge b1` (fusionne `b1` dans la branche **courante**). Écrire `git merge b1 master` n'est pas la forme habituelle : `master` serait interprété comme une deuxième branche à fusionner.

:::

### Deux types de fusion

**Fast-forward** : si `master` n'a pas bougé, Git déplace simplement le pointeur, sans nouveau commit.

```text
avant :   master -> A <- B <- C  (b1)
après :   master, b1 -> C
```

**Commit de fusion** : si les deux branches ont chacune de nouveaux commits (elles ont divergé), Git crée un commit avec deux parents. Pour le forcer : `git merge --no-ff b1`.

### Fusion avec conflit

Un conflit survient quand les deux branches modifient la **même ligne du même fichier** (ou créent le même fichier avec un contenu différent).

```bash
git checkout master
git merge b1
# CONFLICT (add/add): Merge conflict in file4.txt
# Automatic merge failed; fix conflicts and then commit the result.
```

Le fichier contient des marqueurs :

```text
<<<<<<< HEAD
contenu de master
=======
contenu de b1
>>>>>>> b1
```

Résolution :

1. Ouvrir le fichier, garder la bonne version et **supprimer les 3 marqueurs** (`<<<<<<<`, `=======`, `>>>>>>>`).
2. `git add file4.txt`
3. `git commit` (le message de fusion est proposé automatiquement)

Pour abandonner la fusion : `git merge --abort`.

Après la fusion, on peut supprimer la branche devenue inutile : `git branch -d b1`.

Conseil : fais un `git status` propre avant de fusionner. `merge` ne modifie que la branche courante, la branche fusionnée reste inchangée.

---

## 11. Mettre de côté son travail : `git stash`

Le stash est un **tiroir** : tu ranges ton travail inachevé, tu traites autre chose, puis tu le ressors.

### Scénario typique

```bash
echo "travail en cours" >> file1.txt
git stash                  # file1.txt revient propre
git checkout b1            # on change de branche sans souci
# ... correction urgente, commit ...
git checkout master
git stash pop              # le travail en cours réapparaît
```

### Commandes

| Commande | Effet | Stash conservé ? |
|---|---|---|
| `git stash` | met de côté les modifications des fichiers suivis | oui |
| `git stash -u` | inclut aussi les fichiers non suivis | oui |
| `git stash push -m "nom"` | stash avec un nom | oui |
| `git stash list` | liste la pile des stashes | - |
| `git stash show -p stash@{0}` | détail d'un stash (`git show stash@{0}` aussi) | - |
| `git stash apply stash@{0}` | réapplique le stash | **oui** |
| `git stash pop stash@{0}` | réapplique le stash | non (supprimé) |
| `git stash drop stash@{0}` | supprime un seul stash | non |
| `git stash clear` | supprime **tous** les stashes | non |
| `git stash -p` | mode interactif : choisir les blocs à stasher (`y`, `n`, `q`) | oui |

Si on ne précise pas, `stash@{0}` (le plus récent) est utilisé.

:::note Bon à savoir

- La commande de suppression est `git stash drop`, pas `git drop stash`.
- Si `pop` ou `apply` provoque un conflit, le stash reste dans la pile : résous le conflit puis `git stash drop` toi-même.
- Les stashes sont **locaux** : ils ne sont pas envoyés par `git push`.
- Si `git stash` répond `No local changes to save`, il n'y a rien à ranger (les modifications ont déjà été stashées ou commitées).

:::

---

## 12. Rejouer ses commits : `git rebase`

`git rebase` **rejoue** tes commits par-dessus une autre base, pour obtenir un historique **linéaire**.

```text
avant :        A <- B <- C            (master)
                    \
                     D <- E           (b1)

après rebase : A <- B <- C            (master)
                         \
                          D' <- E'    (b1)
```

```bash
git checkout b1
git rebase master        # rejoue les commits de b1 sur master

git checkout master
git merge b1             # fast-forward, sans commit de merge
```

Si `master` n'a pas avancé, Git répond `Current branch b2 is up to date.` : il n'y a rien à rejouer.

### Merge ou rebase ?

| | `git merge` | `git rebase` |
|---|---|---|
| Historique | garde la vraie chronologie, ajoute un commit de fusion | linéaire et propre |
| Commits | inchangés | **recréés** (nouveaux hash) |
| Sécurité | sûr | réécrit l'historique |

### Conflits pendant un rebase

```bash
git add fichier
git rebase --continue    # passer au commit suivant
git rebase --abort       # tout annuler
```

### Rebase interactif

```bash
git rebase -i HEAD~3
```

Permet de réordonner, fusionner (`squash`), renommer (`reword`) ou supprimer (`drop`) les 3 derniers commits.

:::danger Règle d'or

Ne fais **jamais** de rebase sur des commits déjà poussés et partagés : les hash changent et l'historique des autres devient incohérent. Rebase uniquement ce qui est **local**.

:::

---

## 13. Envoyer son projet sur GitHub

### Étape 1 : créer le dépôt sur GitHub

Crée un nouveau dépôt **vide** : ne coche ni README, ni `.gitignore`, ni licence. Un dépôt vide n'a aucun commit qui pourrait entrer en conflit avec le tien.

### Étape 2 : lier le dépôt local au dépôt distant

```bash
git status                  # vérifier que tout est commité
git remote add origin https://github.com/TON_USER/TON_REPO.git
git remote -v               # vérifier le lien
```

### Étape 3 : pousser

Ta branche locale s'appelle souvent `master`, alors que GitHub utilise `main` par défaut :

```bash
git branch -M main          # renomme la branche en main
git push -u origin main
```

`-u` mémorise le lien : ensuite, un simple `git push` suffit.

### Authentification

GitHub n'accepte plus le mot de passe du compte en HTTPS. Au prompt :

- **Username** : ton nom d'utilisateur GitHub
- **Password** : un **Personal Access Token** (GitHub > Settings > Developer settings > Personal access tokens, scope `repo`)

Quand tu colles le token, **rien ne s'affiche** (ni points, ni étoiles) : c'est normal, appuie sur Entrée.

Alternative plus confortable, la CLI GitHub :

```bash
sudo apt install gh
gh auth login
```

Ou bien l'**SSH** (`ssh-keygen`, ajouter la clé publique dans GitHub > Settings > SSH keys, puis utiliser l'URL `git@github.com:USER/REPO.git`).

### Erreur `non-fast-forward` (rejected)

```text
! [rejected]  main -> main (non-fast-forward)
hint: Updates were rejected because the tip of your current branch is behind
```

**Cause** : le dépôt GitHub contient un commit que ton dépôt local n'a pas (souvent un README créé automatiquement). Git refuse d'écraser ce commit.

**Solutions :**

```bash
# Option A : intégrer le commit distant, puis pousser
git pull origin main --allow-unrelated-histories
git push -u origin main

# Option B : variante avec rebase (historique linéaire)
git pull --rebase origin main --allow-unrelated-histories
git push -u origin main

# Option C : si le dépôt distant ne contient rien d'important,
# le supprimer et le recréer VIDE, puis refaire git push -u origin main
```

`--allow-unrelated-histories` est nécessaire car les deux historiques ont été créés séparément.

Si Git demande comment réconcilier les branches : `git config --global pull.rebase false`, puis relancer le pull.

:::danger Pas de `git push --force`

Ne contourne pas l'erreur avec `--force` : cela supprimerait le commit distant. C'est une mauvaise habitude, et dangereux sur un dépôt partagé.

:::

### Autres erreurs fréquentes

| Erreur | Cause / solution |
|---|---|
| `src refspec main does not match any` | La branche `main` n'existe pas en local. Renomme avec `git branch -M main`, ou pousse `master`. |
| `remote origin already exists` | `git remote set-url origin URL` |
| `Authentication failed` | Utilise un Personal Access Token (ou `gh auth login`), pas le mot de passe. |
| `git: 'chekout' is not a git command` | Faute de frappe : `checkout`. |
| `gitbranch: command not found` | Il manque l'espace : `git branch`. |

---

## 14. Aide-mémoire

| Je veux... | Commande |
|---|---|
| Initialiser un dépôt | `git init` |
| Configurer mon identité | `git config --global user.name "..."` / `user.email "..."` |
| Voir l'état | `git status` |
| Préparer des fichiers | `git add fichier` / `git add .` |
| Enregistrer | `git commit -m "message"` |
| Commiter les fichiers suivis modifiés | `git commit -a -m "message"` |
| Voir l'historique | `git log --oneline --graph --all` |
| Voir les changements non préparés | `git diff` |
| Voir les changements préparés | `git diff --staged` |
| Lister les fichiers suivis | `git ls-files` |
| Supprimer fichier + suivi | `git rm fichier` |
| Arrêter le suivi, garder le fichier | `git rm --cached fichier` |
| Ignorer des fichiers | ajouter au `.gitignore` |
| Annuler un commit (sûr) | `git revert hash` |
| Reculer (local uniquement) | `git reset --hard hash` |
| Retrouver un commit perdu | `git reflog` |
| Créer une branche | `git branch nom` / `git checkout -b nom` |
| Changer de branche | `git checkout nom` / `git switch nom` |
| Fusionner | `git merge nom` |
| Ranger mon travail | `git stash` puis `git stash pop` |
| Rejouer mes commits | `git rebase master` |
| Lier à GitHub | `git remote add origin URL` |
| Envoyer | `git push -u origin main` |
| Récupérer et fusionner | `git pull origin main` |