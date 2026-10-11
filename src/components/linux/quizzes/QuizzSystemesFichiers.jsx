import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

// Leçon 15 : Les systèmes de fichiers Linux (32 QCM)
// Corrigé en fin de fichier.

const questions = [
  // ---------- 1. Types de systèmes de fichiers, VFS, journal ----------
  {
    id: 1,
    type: "qcm",
    question: "Quelle est la différence principale entre ext2 et ext3 ?",
    options: [
      "ext3 est réservé aux CD-ROM",
      "ext3 ajoute la journalisation à ext2",
      "ext2 ajoute le chiffrement des données",
      "ext2 supporte des fichiers plus gros qu'ext3",
    ],
    correct: 1,
    explanation: "ext3 est une amélioration d'ext2 : il ajoute la fonctionnalité de journalisation, ce qui permet une récupération rapide après un crash.",
  },
  {
    id: 2,
    type: "qcm",
    question: "Quel système de fichiers a été le premier à utiliser l'API VFS (développé en avril 1992) ?",
    options: ["minix", "ext4", "ext", "XFS"],
    correct: 2,
    explanation: "minix a été le premier système de fichiers utilisé sous Linux, mais c'est ext, son extension développée en avril 1992, qui est le premier à utiliser l'API VFS.",
  },
  {
    id: 3,
    type: "qcm",
    question: "Quel est le rôle du VFS dans le noyau Linux ?",
    options: [
      "Offrir une interface unique aux programmes et rediriger chaque appel vers le pilote du système de fichiers concerné",
      "Chiffrer les données avant leur écriture sur le disque",
      "Vérifier et réparer les systèmes de fichiers corrompus",
      "Créer les partitions sur un disque",
    ],
    correct: 0,
    explanation: "Le VFS est une couche du noyau : les programmes appellent toujours open, read, write, et le VFS redirige l'appel vers le pilote du FS (ext4, NTFS...). C'est pourquoi `cp` fonctionne de la même façon sur tous les FS.",
  },
  {
    id: 4,
    type: "qcm",
    question: "Que contient le journal d'un système de fichiers journalisé ?",
    options: [
      "La liste des programmes exécutés",
      "Les copies de sauvegarde du superbloc",
      "Les journaux des services système",
      "Les opérations d'écriture en cours sur le système de fichiers",
    ],
    correct: 3,
    explanation: "Avant d'écrire, le FS note l'opération dans le journal. Après une coupure de courant, il rejoue le journal au lieu de parcourir tout le disque avec fsck, d'où une récupération rapide.",
  },
  {
    id: 5,
    type: "qcm",
    question: "Quelle commande affiche le type de système de fichiers des partitions montées ?",
    options: ["df -h", "df -T", "du -sh", "free -m"],
    correct: 1,
    explanation: "`df -T` ajoute la colonne Type (ext3, ext4, tmpfs...). `lsblk -f` et `blkid` donnent aussi le type de FS. `df -h` n'affiche que les tailles.",
  },
  {
    id: 6,
    type: "qcm",
    question: "Quelle affirmation sur XFS est correcte d'après le cours ?",
    options: [
      "Il n'a pas de journalisation",
      "Il est réservé aux CD-ROM",
      "Il peut être étendu en ligne",
      "Il ne fonctionne que sur clé USB",
    ],
    correct: 2,
    explanation: "XFS est stable, d'usage général, à récupération rapide, et peut être étendu en ligne (agrandi pendant qu'il est monté). Complément : il ne peut pas être réduit.",
  },

  // ---------- 2. Création de systèmes de fichiers ----------
  {
    id: 7,
    type: "qcm",
    question: "Quelle touche de `fdisk` enregistre les changements sur la table de partitions ?",
    options: ["q", "p", "d", "w"],
    correct: 3,
    explanation: "`w` écrit les changements. `q` quitte sans sauvegarder, `p` affiche les partitions et `d` supprime une partition. Tant que `w` n'est pas tapé, rien n'est modifié sur le disque.",
  },
  {
    id: 8,
    type: "qcm",
    question: "Quelle est la différence entre `fdisk` et `mkfs` ?",
    options: [
      "fdisk découpe le disque en partitions, mkfs construit un système de fichiers sur une partition (formatage)",
      "fdisk formate une partition, mkfs découpe le disque en partitions",
      "fdisk monte les partitions, mkfs les démonte",
      "fdisk crée l'espace swap, mkfs l'active",
    ],
    correct: 0,
    explanation: "Le flux est : fdisk (partitionner) puis mkfs (formater) puis mount (accrocher à un dossier). Le formatage avec mkfs efface les données de la partition.",
  },
  {
    id: 9,
    type: "qcm",
    question: "Au prompt « Dernier secteur » de `fdisk`, que saisir pour obtenir une partition de 400 Mo ?",
    options: ["400M", "+400M", "400", "+400"],
    correct: 1,
    explanation: "Le `+` est obligatoire : `+400M` signifie 400 Mo à partir du début. Sans lui, fdisk attend un numéro de secteur (saisir 4096 donne une partition d'un seul secteur). `+400` sans unité vaut 400 secteurs.",
  },
  {
    id: 10,
    type: "qcm",
    question: "Quelle option de `mke2fs` crée un système de fichiers ext3 (avec journal) ?",
    options: ["mke2fs -v", "mke2fs -L", "mke2fs -j", "mke2fs -m"],
    correct: 2,
    explanation: "`mke2fs -j` ajoute le journal, ce qui donne un ext3 (équivalent de `mkfs.ext3`). `-v` est le mode bavard, `-L` définit le label et `-m` le pourcentage de blocs réservés.",
  },
  {
    id: 11,
    type: "qcm",
    question: "Avec une table de partitions MBR, comment obtenir plus de 4 partitions ?",
    options: [
      "En créant 4 partitions primaires puis une cinquième",
      "En créant 2 partitions étendues",
      "En formatant la partition étendue avec mkfs",
      "Avec 3 partitions primaires et 1 étendue contenant des partitions logiques",
    ],
    correct: 3,
    explanation: "MBR ne stocke que 4 entrées. La partition étendue n'en occupe qu'une et sert de conteneur : on y crée des partitions logiques (sda5, sda6...) sur lesquelles on fait mkfs. (Complément au cours.)",
  },
  {
    id: 12,
    type: "qcm",
    question: "Quelle option de `mkfs.ext3` définit le pourcentage de blocs réservés au super-utilisateur ?",
    options: ["-m", "-L", "-N", "-b"],
    correct: 0,
    explanation: "`-m` règle le pourcentage de blocs réservés (5 % par défaut). `-L` définit le label, `-N` le nombre d'inodes et `-b` la taille de bloc.",
  },
  {
    id: 13,
    type: "qcm",
    question: "Pourquoi réserve-t-on par défaut 5 % des blocs au super-utilisateur ?",
    options: [
      "Pour stocker les copies du superbloc",
      "Pour accélérer l'accès aux fichiers",
      "Pour qu'un utilisateur normal ne puisse pas remplir tout le système de fichiers et bloquer root et ses services",
      "Pour conserver le journal du système de fichiers",
    ],
    correct: 2,
    explanation: "Si un utilisateur remplissait tout le FS, root ne pourrait plus se connecter et les services exécutés en root ne pourraient plus écrire de données sur le disque.",
  },
  {
    id: 14,
    type: "qcm",
    question: "Quelle commande affiche le contenu du superbloc d'un système de fichiers ext ?",
    options: [
      "tune2fs -L /dev/sdb1",
      "tune2fs -l /dev/sdb1",
      "mkfs -V /dev/sdb1",
      "fsck -l /dev/sdb1",
    ],
    correct: 1,
    explanation: "`tune2fs -l` (l minuscule) affiche le superbloc, tout comme `dumpe2fs -h`. `-L` (majuscule) définit le label. `mkfs -V` affiche la version de mkfs.",
  },
  {
    id: 15,
    type: "qcm",
    question: "Après `mount /dev/sdb1 /mnt/data`, où est écrit un fichier créé dans `/mnt/data` ?",
    options: [
      "Dans le dossier /mnt/data du système de fichiers racine",
      "En mémoire RAM uniquement",
      "Dans l'espace swap",
      "Sur la partition /dev/sdb1",
    ],
    correct: 3,
    explanation: "Le point de montage n'est qu'une porte d'accès : les données vivent sur la partition. Après `umount`, le dossier d'origine apparaît vide ; après un nouveau `mount`, le fichier revient. (Complément au cours.)",
  },
  {
    id: 16,
    type: "qcm",
    question: "Pourquoi faut-il exécuter `umount` avant de retirer une clé USB ?",
    options: [
      "Pour forcer l'écriture des données en cache sur le périphérique avant de le détacher",
      "Pour reformater automatiquement la clé",
      "Pour supprimer le point de montage",
      "Pour chiffrer les fichiers de la clé",
    ],
    correct: 0,
    explanation: "Linux garde les écritures en cache mémoire pour des raisons de performance. `umount` vide ce cache vers le périphérique puis le détache proprement ; sans cela, des données peuvent être perdues ou le FS corrompu.",
  },
  {
    id: 17,
    type: "qcm",
    question: "Dans `/etc/fstab`, que signifie le dernier champ (valeur 2 pour une partition de données) ?",
    options: [
      "Le nombre de sauvegardes avec dump",
      "L'ordre de vérification par fsck au démarrage",
      "Le nombre maximal de montages",
      "La priorité du swap",
    ],
    correct: 1,
    explanation: "Le 6e champ donne l'ordre de fsck au démarrage : 1 pour la racine, 2 pour les autres partitions, 0 pour ne pas vérifier. Le 5e champ concerne dump (0 = non). (Complément au cours.)",
  },
  {
    id: 18,
    type: "qcm",
    question: "Quelle commande permet de tester les lignes de `/etc/fstab` sans redémarrer ?",
    options: ["mount -t fstab", "fsck -a", "mount -a", "swapon -a"],
    correct: 2,
    explanation: "`mount -a` monte tout ce qui est décrit dans fstab. Une erreur dans ce fichier peut empêcher le démarrage : on teste donc toujours avant de redémarrer. `swapon -a` ne concerne que les lignes de swap.",
  },

  // ---------- 3. tune2fs ----------
  {
    id: 19,
    type: "qcm",
    question: "Quelle option de `tune2fs` définit le nom de volume (label) d'un système de fichiers ?",
    options: ["-l", "-c", "-j", "-L"],
    correct: 3,
    explanation: "`-L label` définit le nom de volume. `-l` affiche le superbloc, `-c` fixe le nombre maximal de montages entre deux vérifications et `-j` ajoute un journal.",
  },
  {
    id: 20,
    type: "qcm",
    question: "Quel est l'effet de `tune2fs -j /dev/sdb1` sur un système de fichiers ext2 ?",
    options: [
      "Il efface les données et reformate la partition en ext3",
      "Il ajoute un journal : le système de fichiers devient ext3 sans perte de données",
      "Il répare les erreurs du système de fichiers",
      "Il active le chiffrement des données",
    ],
    correct: 1,
    explanation: "`-j` ajoute un journal ext3 au FS existant. Dans `/etc/fstab`, il faut alors changer le type (ext2 devient ext3).",
  },

  // ---------- 4. fsck ----------
  {
    id: 21,
    type: "qcm",
    question: "Quelle est la différence entre `fsck -p` et `fsck -y` ?",
    options: [
      "-p répond « yes » à toutes les questions, -y répare automatiquement sans rien demander",
      "-p vérifie les blocs défectueux, -y force la vérification",
      "-p répare automatiquement sans rien demander, -y répond « yes » à toutes les questions interactives",
      "Aucune différence : les deux options sont identiques",
    ],
    correct: 2,
    explanation: "Selon le cours, `-p` répare automatiquement sans rien demander et `-y` répond yes à toutes les questions. Complément : `-p` ne corrige que les problèmes sans risque, `-y` accepte aussi les corrections risquées, et les deux ne se combinent pas.",
  },
  {
    id: 22,
    type: "qcm",
    question: "À quoi sert la commande `e2fsck -b 8193 /dev/sdb1` ?",
    options: [
      "À définir une taille de bloc de 8193 octets",
      "À rechercher les blocs défectueux",
      "À réserver 8193 blocs au super-utilisateur",
      "À vérifier le système de fichiers à l'aide d'une copie de secours du superbloc",
    ],
    correct: 3,
    explanation: "Le bloc 8193 contient une copie du superbloc (les autres copies sont aux blocs 24577, 40961...). Si le superbloc principal est perdu, on répare avec une copie, FS démonté.",
  },

  // ---------- 5. Swap ----------
  {
    id: 23,
    type: "qcm",
    question: "Quelle commande active un espace swap déjà créé avec `mkswap` ?",
    options: ["swapoff", "swapon", "mkswap -a", "mount -t swap"],
    correct: 1,
    explanation: "`mkswap` crée l'espace swap, `swapon` l'active (et vérifie qu'il a été correctement ajouté), `swapoff` le désactive. Le swap n'a pas de point de montage.",
  },
  {
    id: 24,
    type: "qcm",
    question: "Pourquoi applique-t-on `chmod 600` à un fichier swap ?",
    options: [
      "Pour que le swap soit activé au démarrage",
      "Pour permettre à tous les utilisateurs de l'agrandir",
      "Pour que seul root puisse le lire, car il contient des morceaux de la RAM (mots de passe, clés...)",
      "Pour le rendre exécutable",
    ],
    correct: 2,
    explanation: "Le swap peut contenir des données privées issues de la RAM. Avec `600` (rw-------), seul le propriétaire, root, peut le lire. (Complément au cours.)",
  },
  {
    id: 25,
    type: "qcm",
    question: "Comment activer un espace swap à chaque démarrage ?",
    options: [
      "La commande swapon seule suffit : elle est persistante",
      "En ajoutant une ligne de type swap dans /etc/fstab",
      "En le montant avec mount -t swap",
      "En créant un lien symbolique dans /mnt",
    ],
    correct: 1,
    explanation: "`swapon` n'est pas persistant. On ajoute une ligne comme `/swapfile none swap sw 0 0` dans `/etc/fstab`. (Complément au cours.)",
  },
  {
    id: 26,
    type: "qcm",
    question: "Pourquoi `mkswap /dev/sdb1` est-il dangereux sur une partition qui contient déjà des données ?",
    options: [
      "Il écrase le système de fichiers et les données de la partition",
      "Il supprime la table de partitions de tout le disque",
      "Il désactive l'espace swap existant",
      "Il monte la partition en lecture seule",
    ],
    correct: 0,
    explanation: "`mkswap` prépare la partition comme zone swap : l'ancien système de fichiers est écrasé. Il faut vérifier le périphérique avec `lsblk -f` avant de l'utiliser.",
  },

  // ---------- 6. Systèmes de fichiers cryptés ----------
  {
    id: 27,
    type: "qcm",
    question: "Que fait une couche TCFS (Transparent Cryptographic File System) comme eCryptfs ?",
    options: [
      "Elle remplace ext4 par un système de fichiers plus rapide",
      "Elle chiffre les données avant leur écriture en blocs, au-dessus d'un système de fichiers existant",
      "Elle compresse les fichiers pour gagner de l'espace",
      "Elle répare le système de fichiers après une coupure de courant",
    ],
    correct: 1,
    explanation: "ext[234] ne garantissent pas la confidentialité. La couche TCFS se place au-dessus du FS (ext2, ext3, ext4, xfs...) et chiffre les informations avant qu'elles soient écrites sur le média.",
  },
  {
    id: 28,
    type: "qcm",
    question: "Dans eCryptfs, que fait l'option « chiffrement du nom de fichier » lorsqu'elle est activée ?",
    options: [
      "Elle chiffre uniquement le contenu des fichiers",
      "Elle autorise les fichiers non chiffrés à traverser la couche",
      "Elle choisit l'algorithme de chiffrement",
      "Elle chiffre aussi les noms des fichiers, pas seulement leur contenu",
    ],
    correct: 3,
    explanation: "eCryptfs chiffre les données et, si l'option est activée, les noms de fichiers. L'option « passthrough » est une autre option : elle autorise les fichiers non chiffrés à traverser la couche.",
  },
  {
    id: 29,
    type: "qcm",
    question: "Quelle est la différence principale entre eCryptfs et LUKS/dm-crypt ?",
    options: [
      "eCryptfs chiffre au niveau des fichiers et dossiers, LUKS chiffre le périphérique entier (niveau bloc)",
      "eCryptfs chiffre le périphérique entier, LUKS seulement les noms de fichiers",
      "LUKS ne fonctionne qu'avec ext2",
      "Aucune : ce sont deux noms du même outil",
    ],
    correct: 0,
    explanation: "eCryptfs est une couche au-dessus du FS (commande `mount -t ecryptfs`). LUKS chiffre un périphérique bloc entier (`cryptsetup luksFormat`, `luksOpen`), puis on y crée un FS. (Complément au cours.)",
  },

  // ---------- 7. Disques optiques ----------
  {
    id: 30,
    type: "qcm",
    question: "Que permet l'extension Rock Ridge sur un disque ISO 9660 ?",
    options: [
      "La lecture du disque sous Windows uniquement",
      "L'écriture de nouvelles données sur le disque",
      "Les noms de fichiers longs de style Unix, les permissions et les liens symboliques",
      "Le chiffrement du contenu du disque",
    ],
    correct: 2,
    explanation: "Rock Ridge est compatible avec le standard POSIX : noms longs, permissions, liens symboliques. L'extension Joliet, créée par Microsoft, vise la compatibilité avec Windows.",
  },
  {
    id: 31,
    type: "qcm",
    question: "Quelle est la différence entre `mkisofs -R` et `mkisofs -r` ?",
    options: [
      "-R ajoute Joliet et -r ajoute UDF",
      "-R crée l'image et -r la grave",
      "-R est réservée aux DVD et -r aux CD",
      "Les deux ajoutent Rock Ridge : -R conserve droits et propriétaires, -r met les propriétaires à root avec lecture seule pour tous",
    ],
    correct: 3,
    explanation: "`-R` garde les droits d'accès et propriétaires d'origine. `-r` change les propriétaires en root et donne un accès en lecture seule à tous. `-J` ajoute Joliet.",
  },
  {
    id: 32,
    type: "qcm",
    question: "Que fait l'option `-o loop` dans `mount -o loop -t iso9660 -o ro image.iso /mnt/` ?",
    options: [
      "Elle monte le fichier image comme s'il s'agissait d'un périphérique",
      "Elle grave l'image sur un CD",
      "Elle répète le montage à chaque démarrage",
      "Elle chiffre l'image avant le montage",
    ],
    correct: 0,
    explanation: "`loop` permet de monter un fichier (ici image.iso, créé avec mkisofs) via un périphérique loop. `ro` le monte en lecture seule, ce qui est normal pour un CD.",
  },
];

// ---------- CORRIGÉ ----------
// 1-B   2-C   3-A   4-D   5-B   6-C   7-D   8-A
// 9-B  10-C  11-D  12-A  13-C  14-B  15-D  16-A
// 17-B 18-C  19-D  20-B  21-C  22-D  23-B  24-C
// 25-B 26-A  27-B  28-D  29-A  30-C  31-D  32-A
// (A = index 0, B = 1, C = 2, D = 3)

export default function QuizzSystemesFichiers() {
  return (
    <QuizEngine
      questions={questions}
      title="Quiz - Les systèmes de fichiers Linux"
      courseLink="/cours/linux/lesson-15"
    />
  );
}
