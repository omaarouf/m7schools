import React, { useState } from "react";

const questions = [
  {
    id: 1,
    question: "Quel repertoire contient les fichiers de configuration du systeme Linux ?",
    options: ["/bin", "/var", "/etc", "/usr"],
    correct: 2,
    explanation: "/etc est le repertoire standard des fichiers de configuration systeme. On y trouve nginx/, ssh/, hosts, fstab, crontab, passwd, etc.",
  },
  {
    id: 2,
    question: "Ou sont stockes les repertoires personnels des utilisateurs ordinaires ?",
    options: ["/root", "/home", "/usr", "/srv"],
    correct: 1,
    explanation: "/home contient les repertoires personnels de chaque utilisateur. Exemple : /home/said, /home/omar.",
  },
  {
    id: 3,
    question: "Quel repertoire est reserve exclusivement au superutilisateur root ?",
    options: ["/home/root", "/admin", "/root", "/etc/root"],
    correct: 2,
    explanation: "/root est le repertoire personnel de l'utilisateur root. Il est distinct de /home et inaccessible aux utilisateurs ordinaires.",
  },
  {
    id: 4,
    question: "Les fichiers de logs systeme et applications se trouvent dans :",
    options: ["/tmp", "/log", "/sys/log", "/var/log"],
    correct: 3,
    explanation: "/var/log contient tous les logs systeme et applicatifs : syslog, auth.log, nginx/access.log, dmesg, etc.",
  },
  {
    id: 5,
    question: "Quel repertoire contient les binaires essentiels accessibles a tous les utilisateurs (ls, cp, mv) ?",
    options: ["/sbin", "/usr/bin", "/bin", "/opt"],
    correct: 2,
    explanation: "/bin contient les binaires essentiels pour tous les utilisateurs. /sbin est reserve aux binaires d'administration systeme (root).",
  },
  {
    id: 6,
    question: "Le repertoire /tmp est caracterise par :",
    options: [
      "Il contient les fichiers de configuration",
      "Son contenu est efface a chaque redemarrage",
      "Il est reserve a root uniquement",
      "Il contient les programmes installes",
    ],
    correct: 1,
    explanation: "/tmp contient des fichiers temporaires. Son contenu est automatiquement efface a chaque redemarrage du systeme.",
  },
  {
    id: 7,
    question: "La racine web par defaut pour Apache/Nginx se trouve dans :",
    options: ["/srv/web", "/home/www", "/var/www", "/etc/www"],
    correct: 2,
    explanation: "/var/www est la racine web par defaut. On y trouve generalement le dossier html/ contenant les fichiers du site.",
  },
  {
    id: 8,
    question: "Selon la norme FHS, quels repertoires sont statiques et partageables ?",
    options: [
      "/var, /tmp, /run",
      "/bin, /sbin, /lib, /usr, /opt",
      "/home, /root",
      "/etc, /dev",
    ],
    correct: 1,
    explanation: "Les repertoires statiques sont /bin, /sbin, /lib, /usr, /opt. Les repertoires variables sont /var, /tmp, /run.",
  },
  {
    id: 9,
    question: "Quelle commande affiche le chemin absolu du repertoire courant ?",
    options: ["ls", "cd", "pwd", "dir"],
    correct: 2,
    explanation: "pwd = Print Working Directory. Elle affiche le chemin complet du repertoire dans lequel vous vous trouvez.",
  },
  {
    id: 10,
    question: "Pour remonter d'un niveau dans l'arborescence, on utilise :",
    options: ["cd /", "cd -", "cd ~", "cd .."],
    correct: 3,
    explanation: "cd .. remonte d'un niveau vers le repertoire parent. cd ../.. remonte de deux niveaux.",
  },
  {
    id: 11,
    question: "La commande cd - permet de :",
    options: [
      "Aller a la racine",
      "Revenir au repertoire precedent",
      "Aller dans le repertoire personnel",
      "Remonter d'un niveau",
    ],
    correct: 1,
    explanation: "cd - retourne au dernier repertoire visite. Tres utile pour alterner entre deux emplacements.",
  },
  {
    id: 12,
    question: "Quelle commande liste TOUS les fichiers y compris les fichiers caches, avec les details ?",
    options: ["ls -lhS", "ls -al", "ls -t", "ls -r"],
    correct: 1,
    explanation: "ls -al combine -a (all : affiche les fichiers caches commencant par .) et -l (long : format detaille avec droits, proprietaire, taille, date).",
  },
  {
    id: 13,
    question: "Les fichiers caches sous Linux commencent par :",
    options: ["_ (underscore)", "~ (tilde)", ". (point)", "# (diese)"],
    correct: 2,
    explanation: "Sous Linux, tout fichier ou dossier commencant par un point (.) est cache. Exemple : .bashrc, .ssh, .config.",
  },
  {
    id: 14,
    question: "La commande ls -lhS trie les fichiers par :",
    options: [
      "Date du plus recent au plus ancien",
      "Ordre alphabetique",
      "Taille decroissante",
      "Taille croissante",
    ],
    correct: 2,
    explanation: "-S trie par taille (Size) en ordre decroissant. -h affiche les tailles en format lisible (Ko, Mo, Go). -l donne les details.",
  },
  {
    id: 15,
    question: "Pour creer l'arborescence /Ali/Formation/TPLinux en une seule commande, on utilise :",
    options: [
      "mkdir /Ali/Formation/TPLinux",
      "mkdir -r /Ali/Formation/TPLinux",
      "mkdir -p /Ali/Formation/TPLinux",
      "mkdir -f /Ali/Formation/TPLinux",
    ],
    correct: 2,
    explanation: "-p (parents) cree tous les repertoires intermediaires s'ils n'existent pas encore. Sans -p, la commande echoue si Ali ou Formation n'existent pas.",
  },
  {
    id: 16,
    question: "La commande rmdir peut supprimer :",
    options: [
      "N'importe quel repertoire",
      "Uniquement les repertoires vides",
      "Uniquement les fichiers",
      "Les repertoires et leur contenu",
    ],
    correct: 1,
    explanation: "rmdir ne fonctionne que sur les repertoires vides. Pour supprimer un repertoire avec son contenu, utiliser rm -rf.",
  },
  {
    id: 17,
    question: "Pour copier recursivement le repertoire /monRep vers /ailleurs, on utilise :",
    options: [
      "cp /monRep /ailleurs",
      "cp -a /monRep /ailleurs",
      "cp -r /monRep /ailleurs",
      "cp -f /monRep /ailleurs",
    ],
    correct: 2,
    explanation: "-r (recursive) est obligatoire pour copier un repertoire et tout son contenu. Sans -r, cp refuse de copier un repertoire.",
  },
  {
    id: 18,
    question: "Quelle option de cp permet de copier en preservant les droits, dates et proprietaires ?",
    options: ["-r", "-i", "-a", "-u"],
    correct: 2,
    explanation: "-a (archive) preserve les droits, les dates, les proprietaires, les groupes et les liens symboliques. C'est l'equivalent de -dR --preserve=all.",
  },
  {
    id: 19,
    question: "La commande mv stagiaire Formation permet de :",
    options: [
      "Copier le repertoire stagiaire dans Formation",
      "Renommer stagiaire en Formation",
      "Deplacer Formation dans stagiaire",
      "Creer un lien symbolique",
    ],
    correct: 1,
    explanation: "mv sans changer de repertoire renomme le fichier ou dossier. mv stagiaire Formation renomme stagiaire en Formation.",
  },
  {
    id: 20,
    question: "Pour supprimer le repertoire /tmp/LeRep et tout son contenu sans confirmation, on utilise :",
    options: [
      "rm /tmp/LeRep",
      "rmdir -r /tmp/LeRep",
      "rm -rf /tmp/LeRep",
      "rm -i /tmp/LeRep",
    ],
    correct: 2,
    explanation: "-r (recursive) supprime le repertoire et tout son contenu. -f (force) supprime sans demander de confirmation. Attention : irreversible !",
  },
  {
    id: 21,
    question: "La commande touch monfichier.txt sur un fichier existant :",
    options: [
      "Supprime le fichier",
      "Efface son contenu",
      "Met a jour son horodatage",
      "Le renomme",
    ],
    correct: 2,
    explanation: "touch sur un fichier existant met a jour uniquement sa date de derniere modification. Sur un fichier inexistant, il le cree vide.",
  },
  {
    id: 22,
    question: "Quelle commande permet d'afficher un fichier page par page avec navigation en arriere ?",
    options: ["cat", "more", "less", "head"],
    correct: 2,
    explanation: "less permet la navigation avant ET arriere, la recherche avec /motif, et quitter avec q. more ne permet que d'avancer. Pour les fichiers longs, toujours preferer less.",
  },
  {
    id: 23,
    question: "La commande cat -n monFichier affiche :",
    options: [
      "Le fichier sans les lignes vides",
      "Le fichier avec les numeros de lignes",
      "Le fichier en ordre inverse",
      "Le nombre de lignes du fichier",
    ],
    correct: 1,
    explanation: "-n numerote chaque ligne affichee a partir de 1. Utile pour referencer des lignes precises lors du debogage.",
  },
  {
    id: 24,
    question: "Pour surveiller un fichier de log en temps reel, on utilise :",
    options: [
      "tail monFichier",
      "tail -n monFichier",
      "tail -f monFichier",
      "less monFichier",
    ],
    correct: 2,
    explanation: "-f (follow) maintient le fichier ouvert et affiche les nouvelles lignes au fur et a mesure qu'elles sont ajoutees. Indispensable pour le monitoring.",
  },
  {
    id: 25,
    question: "L'operateur >> dans une redirection :",
    options: [
      "Ecrase le fichier de destination",
      "Ajoute a la fin du fichier existant",
      "Cree un nouveau fichier uniquement",
      "Redirige l'entree standard",
    ],
    correct: 1,
    explanation: ">> ajoute le contenu a la fin du fichier existant sans l'ecraser. > lui ecrase le fichier (ou le cree s'il n'existe pas).",
  },
  {
    id: 26,
    question: "La commande ls -al | grep doc utilise le symbole | pour :",
    options: [
      "Ecrire le resultat dans un fichier",
      "Comparer deux commandes",
      "Envoyer la sortie de ls comme entree de grep",
      "Executer les deux commandes en parallele",
    ],
    correct: 2,
    explanation: "Le pipe | chaine les commandes : la sortie standard de la commande gauche devient l'entree standard de la commande droite.",
  },
  {
    id: 27,
    question: "Pour afficher les 20 premieres lignes d'un fichier, on utilise :",
    options: [
      "tail -n 20 fichier",
      "head -n 20 fichier",
      "cat -20 fichier",
      "more -20 fichier",
    ],
    correct: 1,
    explanation: "head affiche le debut d'un fichier. Par defaut 10 lignes. -n 20 en affiche 20. tail fait l'inverse : il affiche la fin.",
  },
  {
    id: 28,
    question: "La commande grep -i effectue une recherche :",
    options: [
      "Recursive dans les sous-repertoires",
      "Insensible a la casse",
      "En affichant les numeros de ligne",
      "En affichant uniquement le nombre de resultats",
    ],
    correct: 1,
    explanation: "-i (ignore case) rend la recherche insensible a la casse. 'root', 'ROOT' et 'Root' seront tous trouves.",
  },
  {
    id: 29,
    question: "Pour chercher le mot 'root' dans /etc/passwd et afficher les numeros de lignes, on utilise :",
    options: [
      "grep root /etc/passwd",
      "grep -n root /etc/passwd",
      "grep -c root /etc/passwd",
      "grep -v root /etc/passwd",
    ],
    correct: 1,
    explanation: "-n (number) prefixe chaque ligne correspondante avec son numero. Tres utile pour localiser rapidement une entree.",
  },
  {
    id: 30,
    question: "La commande grep -v root /etc/passwd affiche :",
    options: [
      "Toutes les lignes contenant 'root'",
      "Toutes les lignes ne contenant PAS 'root'",
      "Le nombre de lignes avec 'root'",
      "La premiere ligne avec 'root'",
    ],
    correct: 1,
    explanation: "-v (invert) inverse le filtre et affiche les lignes qui ne correspondent PAS au motif. Utile pour exclure certains resultats.",
  },
  {
    id: 31,
    question: "Pour chercher tous les fichiers .conf dans /etc, on utilise :",
    options: [
      "find /etc -type conf",
      "grep -r .conf /etc",
      "find /etc -name '*.conf'",
      "ls -r /etc/*.conf",
    ],
    correct: 2,
    explanation: "find avec -name '*.conf' recherche recursivement tous les fichiers dont le nom se termine par .conf. Le * est un joker.",
  },
  {
    id: 32,
    question: "L'option -mtime -5 dans la commande find recherche les fichiers :",
    options: [
      "Modifies il y a exactement 5 jours",
      "Modifies il y a plus de 5 jours",
      "Modifies dans les 5 derniers jours",
      "Accedes dans les 5 derniers jours",
    ],
    correct: 2,
    explanation: "-mtime -5 signifie 'modifie il y a moins de 5 jours'. Le - signifie 'moins de'. -atime concerne les dates d'acces.",
  },
  {
    id: 33,
    question: "Pour chercher les fichiers appartenant a l'utilisateur said, on utilise :",
    options: [
      "find . -group said",
      "find . -owner said",
      "find . -user said",
      "find . -name said",
    ],
    correct: 2,
    explanation: "-user filtre par proprietaire du fichier. -group filtre par groupe proprietaire. -owner n'est pas une option valide de find.",
  },
  {
    id: 34,
    question: "La difference entre un lien symbolique et un lien physique est :",
    options: [
      "Le lien physique peut pointer vers un repertoire, pas le symbolique",
      "Le lien symbolique est un raccourci pouvant pointer vers n'importe quel chemin ; le lien physique partage le meme inode",
      "Il n'y a aucune difference",
      "Le lien physique est supprime si le fichier source est supprime",
    ],
    correct: 1,
    explanation: "Le lien symbolique est un raccourci (comme .lnk Windows). Le lien physique partage le meme inode : si le fichier source est supprime, le lien physique survit car ils partagent les memes donnees.",
  },
  {
    id: 35,
    question: "Pour creer un lien symbolique nomme MonLien pointant vers /var/log/syslog, on utilise :",
    options: [
      "ln /var/log/syslog MonLien",
      "ln -s /var/log/syslog MonLien",
      "ln -f /var/log/syslog MonLien",
      "cp -l /var/log/syslog MonLien",
    ],
    correct: 1,
    explanation: "-s (symbolic) cree un lien symbolique. Sans -s, ln cree un lien physique. Le lien symbolique est indique par -> dans ls -la.",
  },
  {
    id: 36,
    question: "Les permissions rwxr-xr-- en notation numerique correspondent a :",
    options: ["777", "755", "754", "644"],
    correct: 2,
    explanation: "rwx = 4+2+1 = 7, r-x = 4+0+1 = 5, r-- = 4+0+0 = 4. Donc rwxr-xr-- = 754.",
  },
  {
    id: 37,
    question: "La commande chmod 600 monFichier donne les droits :",
    options: [
      "Lecture et ecriture au proprietaire uniquement",
      "Lecture seule a tout le monde",
      "Tous les droits au proprietaire",
      "Lecture et ecriture a tout le monde",
    ],
    correct: 0,
    explanation: "6 = rw- pour le proprietaire, 0 = --- pour le groupe, 0 = --- pour les autres. Utilise typiquement pour les cles SSH et fichiers prives.",
  },
  {
    id: 38,
    question: "Pour retirer le droit d'ecriture aux autres de facon recursive sur /shared/docs, on utilise :",
    options: [
      "chmod -R 644 /shared/docs",
      "chmod -R o-w /shared/docs",
      "chmod -R g-w /shared/docs",
      "chown -R o-w /shared/docs",
    ],
    correct: 1,
    explanation: "o = others (autres), -w = retirer l'ecriture, -R = recursif sur tout le contenu. g = group, u = user/proprietaire.",
  },
  {
    id: 39,
    question: "La commande chown -R said:TRI monRep permet de :",
    options: [
      "Changer uniquement le groupe du repertoire monRep",
      "Changer le proprietaire en said et le groupe en TRI de monRep et tout son contenu",
      "Changer les permissions de monRep recursivement",
      "Ajouter said au groupe TRI",
    ],
    correct: 1,
    explanation: "chown user:groupe change proprietaire ET groupe. -R applique le changement recursivement sur tout le contenu du repertoire.",
  },
  {
    id: 40,
    question: "La commande su - (avec le tiret) par rapport a su (sans tiret) :",
    options: [
      "N'a aucune difference",
      "Charge l'environnement complet de root (PATH, variables...)",
      "Demande un mot de passe supplementaire",
      "Ouvre un shell restreint",
    ],
    correct: 1,
    explanation: "su - charge l'environnement complet de root : PATH, variables d'environnement, repertoire courant (/root). su seul garde l'environnement de l'utilisateur courant.",
  },
];

const LETTERS = ["A", "B", "C", "D"];

const styleId = "linux-quiz-styles";
if (typeof document !== "undefined" && !document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .lq-wrap { padding-bottom: 40px; position: relative; }
    .lq-sticky {
      position: sticky; top: 60px; z-index: 50;
      background: var(--ifm-background-color);
      border-bottom: 2px solid var(--lq-accent, #1a3c8f);
      padding: 10px 20px;
      display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
      margin-bottom: 24px; transition: border-color 0.4s;
    }
    .lq-sticky-title { font-weight: 700; font-size: 14px; color: var(--ifm-font-color-base); }
    .lq-badge {
      border-radius: 20px; padding: 2px 10px;
      font-size: 12px; font-weight: 600;
      background: color-mix(in srgb, var(--lq-accent, #1a3c8f) 12%, transparent);
      color: var(--lq-accent, #1a3c8f);
      border: 1px solid color-mix(in srgb, var(--lq-accent, #1a3c8f) 30%, transparent);
    }
    .lq-progress-track { width: 100px; height: 6px; background: var(--ifm-color-emphasis-200); border-radius: 99px; overflow: hidden; }
    .lq-progress-bar { height: 100%; border-radius: 99px; background: var(--lq-accent, #1a3c8f); transition: width 0.4s ease, background 0.4s; }
    .lq-score-num { font-weight: 800; font-size: 18px; color: var(--lq-accent, #1a3c8f); min-width: 48px; text-align: right; transition: color 0.4s; }
    .lq-btn-validate { border: none; border-radius: 6px; padding: 4px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .lq-btn-validate:disabled { background: var(--ifm-color-emphasis-200) !important; color: var(--ifm-color-emphasis-500) !important; cursor: not-allowed; }
    .lq-btn-outline { background: transparent; border: 1px solid var(--ifm-color-primary); color: var(--ifm-color-primary); border-radius: 6px; padding: 4px 14px; font-size: 12px; font-weight: 600; cursor: pointer; }
    .lq-card { border: 1px solid var(--ifm-color-emphasis-300); border-radius: 10px; padding: 18px 20px 14px; margin-bottom: 14px; background: var(--ifm-background-surface-color); transition: border-color 0.3s, background 0.3s; }
    .lq-card.correct { border-color: #16a34a55; background: color-mix(in srgb, #16a34a 6%, var(--ifm-background-surface-color)); }
    .lq-card.wrong   { border-color: #dc262655; background: color-mix(in srgb, #dc2626 6%, var(--ifm-background-surface-color)); }
    .lq-qnum { border-radius: 6px; padding: 1px 8px; font-size: 12px; font-weight: 700; flex-shrink: 0; line-height: 22px; background: color-mix(in srgb, #1a3c8f 15%, transparent); color: var(--ifm-color-primary); }
    .lq-qnum.correct { background: color-mix(in srgb, #16a34a 15%, transparent); color: #16a34a; }
    .lq-qnum.wrong   { background: color-mix(in srgb, #dc2626 15%, transparent); color: #dc2626; }
    .lq-qtext { font-weight: 600; font-size: 14px; line-height: 1.6; color: var(--ifm-font-color-base); }
    .lq-option { display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 6px; cursor: pointer; transition: background 0.15s; background: transparent; }
    .lq-option:hover { background: var(--ifm-color-emphasis-100); }
    .lq-option.selected   { background: color-mix(in srgb, var(--ifm-color-primary) 10%, transparent); }
    .lq-option.opt-correct { background: color-mix(in srgb, #16a34a 10%, transparent); cursor: default; }
    .lq-option.opt-wrong   { background: color-mix(in srgb, #dc2626 10%, transparent); cursor: default; }
    .lq-option.submitted   { cursor: default; }
    .lq-option.submitted:hover { background: transparent; }
    .lq-option.opt-correct:hover { background: color-mix(in srgb, #16a34a 10%, transparent); }
    .lq-option.opt-wrong:hover   { background: color-mix(in srgb, #dc2626 10%, transparent); }
    .lq-radio { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--ifm-color-emphasis-400); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: border-color 0.2s; }
    .lq-radio-dot { width: 18px; height: 18px; border-radius: 50%; background: transparent; transition: background 0.2s; }
    .lq-option.selected   .lq-radio     { border-color: var(--ifm-color-primary); }
    .lq-option.selected   .lq-radio-dot { background: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-radio     { border-color: #16a34a; }
    .lq-option.opt-correct .lq-radio-dot { background: #16a34a; }
    .lq-option.opt-wrong   .lq-radio     { border-color: #dc2626; }
    .lq-option.opt-wrong   .lq-radio-dot { background: #dc2626; }
    .lq-letter { font-size: 12px; font-weight: 700; min-width: 16px; color: var(--ifm-color-emphasis-500); transition: color 0.2s; }
    .lq-option.selected    .lq-letter { color: var(--ifm-color-primary); }
    .lq-option.opt-correct .lq-letter { color: #16a34a; }
    .lq-option.opt-wrong   .lq-letter { color: #dc2626; }
    .lq-opttext { font-size: 14px; flex: 1; color: var(--ifm-font-color-base); transition: color 0.2s; }
    .lq-option.opt-correct .lq-opttext { color: #16a34a; }
    .lq-option.opt-wrong   .lq-opttext { color: #dc2626; }
    .lq-btn-hint { background: transparent; border: 1px solid var(--ifm-color-emphasis-300); color: var(--ifm-color-emphasis-600); border-radius: 6px; padding: 3px 12px; cursor: pointer; font-size: 12px; margin-top: 10px; }
    .lq-explain { margin-top: 8px; background: var(--ifm-color-emphasis-100); border: 1px solid var(--ifm-color-emphasis-300); border-left: 3px solid var(--ifm-color-primary); border-radius: 6px; padding: 10px 14px; font-size: 13px; color: var(--ifm-font-color-base); line-height: 1.7; }
    .lq-explain-label { color: var(--ifm-color-primary); font-weight: 700; }
    .lq-explain-ans   { color: #16a34a; font-weight: 700; }
    .lq-btn-submit { border: none; border-radius: 8px; padding: 11px 36px; font-size: 14px; font-weight: 700; transition: all 0.3s; cursor: pointer; display: block; margin: 8px auto 16px; }
    .lq-final { text-align: center; padding: 28px 20px; background: var(--ifm-color-emphasis-100); border-radius: 12px; margin-top: 8px; border: 1px solid var(--ifm-color-emphasis-300); }
    .lq-final-score { font-size: 44px; font-weight: 800; margin-bottom: 6px; }
    .lq-final-label { font-size: 16px; font-weight: 600; color: var(--ifm-font-color-base); margin-bottom: 4px; }
    .lq-final-msg   { font-size: 13px; color: var(--ifm-color-emphasis-600); margin-bottom: 20px; }
    .lq-btn-reset { background: var(--ifm-color-primary); border: none; color: #fff; border-radius: 8px; padding: 10px 32px; cursor: pointer; font-size: 14px; font-weight: 600; }
  `;
  document.head.appendChild(style);
}

export default function LinuxBasicsQuiz() {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const score = Object.entries(answers).filter(
    ([id, ans]) => questions.find((q) => q.id === parseInt(id))?.correct === ans
  ).length;

  const pct = submitted
    ? Math.round((score / total) * 100)
    : Math.round((answered / total) * 100);

  const accentColor = !submitted
    ? "#1a3c8f"
    : score / total >= 0.8
    ? "#16a34a"
    : score / total >= 0.5
    ? "#d97706"
    : "#dc2626";

  const scoreLabel = !submitted
    ? answered + "/" + total + " repondues"
    : score / total >= 0.8
    ? "Excellent !"
    : score / total >= 0.5
    ? "Bien !"
    : "A reviser";

  const handleSelect = (qId, idx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  };

  const handleReveal = (qId) => {
    setRevealed((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleSubmit = () => {
    if (answered < total) return;
    setSubmitted(true);
    const all = {};
    questions.forEach((q) => { all[q.id] = true; });
    setRevealed(all);
  };

  const handleReset = () => {
    setAnswers({});
    setRevealed({});
    setSubmitted(false);
  };

  return (
    <div className="lq-wrap" style={{ "--lq-accent": accentColor }}>

      <div className="lq-sticky">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="lq-sticky-title">Quiz - Commandes de Base Linux</span>
          <span className="lq-badge">{scoreLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="lq-progress-track">
            <div className="lq-progress-bar" style={{ width: pct + "%" }} />
          </div>
          <span className="lq-score-num">
            {submitted ? score + "/" + total : answered + "/" + total}
          </span>
          {submitted ? (
            <button className="lq-btn-outline" onClick={handleReset}>Recommencer</button>
          ) : (
            <button
              className="lq-btn-validate"
              onClick={handleSubmit}
              disabled={answered < total}
              style={{
                background: answered === total ? accentColor : undefined,
                color: answered === total ? "#fff" : undefined,
              }}
            >
              Valider
            </button>
          )}
        </div>
      </div>

      {questions.map((q, qi) => {
        const userAnswer = answers[q.id];
        const isCorrect = userAnswer === q.correct;
        const isRevealed = revealed[q.id];
        const cardClass = "lq-card" + (submitted ? (isCorrect ? " correct" : " wrong") : "");
        const qnumClass = "lq-qnum" + (submitted ? (isCorrect ? " correct" : " wrong") : "");

        return (
          <div key={q.id} className={cardClass}>
            <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
              <span className={qnumClass}>Q{qi + 1}</span>
              <span className="lq-qtext">{q.question}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingLeft: 4 }}>
              {q.options.map((opt, idx) => {
                const isSelected = userAnswer === idx;
                const isRight = idx === q.correct;

                let optClass = "lq-option";
                if (submitted) {
                  optClass += " submitted";
                  if (isRight) optClass += " opt-correct";
                  else if (isSelected) optClass += " opt-wrong";
                } else if (isSelected) {
                  optClass += " selected";
                }

                return (
                  <div key={idx} className={optClass} onClick={() => handleSelect(q.id, idx)}>
                    <div className="lq-radio">
                      <div className="lq-radio-dot" />
                    </div>
                    <span className="lq-letter">{LETTERS[idx]}.</span>
                    <span className="lq-opttext">{opt}</span>
                    {submitted && isRight && (
                      <span style={{ marginLeft: "auto", color: "#16a34a", fontWeight: 700 }}>✓</span>
                    )}
                    {submitted && isSelected && !isRight && (
                      <span style={{ marginLeft: "auto", color: "#dc2626", fontWeight: 700 }}>✗</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div>
              {!submitted && (
                <button className="lq-btn-hint" onClick={() => handleReveal(q.id)}>
                  {isRevealed ? "Masquer" : "Voir l'explication"}
                </button>
              )}
              {isRevealed && (
                <div className="lq-explain">
                  <span className="lq-explain-label">Reponse : </span>
                  <span className="lq-explain-ans">{LETTERS[q.correct]}</span>
                  <br />
                  <span style={{ whiteSpace: "pre-line" }}>{q.explanation}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {!submitted && (
        <button
          className="lq-btn-submit"
          onClick={handleSubmit}
          disabled={answered < total}
          style={{
            background: answered === total ? accentColor : undefined,
            color: answered === total ? "#fff" : undefined,
          }}
        >
          {answered < total
            ? "Repondre a toutes les questions (" + answered + "/" + total + ")"
            : "Valider le quiz"}
        </button>
      )}

      {submitted && (
        <div className="lq-final">
          <div className="lq-final-score" style={{ color: accentColor }}>
            {score}/{total}
          </div>
          <div className="lq-final-label">{scoreLabel}</div>
          <div className="lq-final-msg">
            {score / total >= 0.8
              ? "Vous maitrisez les commandes de base Linux !"
              : score / total >= 0.5
              ? "Relisez les sections manquees."
              : "Recommencez apres revision du cours."}
          </div>
          <button className="lq-btn-reset" onClick={handleReset}>
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
}