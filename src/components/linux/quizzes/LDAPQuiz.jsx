import React from "react";
import QuizEngine from "@site/src/components/QuizEngine";

const questions = [
  {
    id: 1,
    question: "Que signifie LDAP ?",
    options: [
      "Linux Directory Access Protocol",
      "Lightweight Directory Access Protocol",
      "Local Data Access Protocol",
      "Lightweight Data Application Protocol",
    ],
    correct: 1,
    explanation:
      "LDAP = Lightweight Directory Access Protocol. C'est un protocole réseau standardisé pour l'interrogation et la modification des services d'annuaire.",
  },
  {
    id: 2,
    question: "Quel démon est utilisé par le serveur LDAP principal sur OpenLDAP ?",
    options: ["ldapd", "slurpd", "slapd", "openldapd"],
    correct: 2,
    explanation:
      "slapd = Standalone LDAP Daemon. C'est le démon principal du serveur OpenLDAP. slurpd est l'ancien démon de réplication (secondaire).",
  },
  {
    id: 3,
    question: "Qu'est-ce que le DIT dans LDAP ?",
    options: [
      "Directory Information Table",
      "Data Index Tree",
      "Directory Information Tree",
      "Domain Identity Token",
    ],
    correct: 2,
    explanation:
      "DIT = Directory Information Tree. C'est l'arbre complet de l'annuaire LDAP. Chaque élément s'appelle une entrée (DSE).",
  },
  {
    id: 4,
    question: "Quel est le fichier de configuration du client LDAP ?",
    options: [
      "/etc/openldap/slapd.conf",
      "/etc/ldap/ldap.conf",
      "/etc/openldap/ldapd.conf",
      "/etc/ldap/client.conf",
    ],
    correct: 1,
    explanation:
      "/etc/ldap/ldap.conf contient la configuration du client LDAP (URI du serveur et BASE DN).",
  },
  {
    id: 5,
    question: "Quelle commande permet d'ajouter une entrée dans l'annuaire LDAP ?",
    options: ["ldapmodify", "ldapinsert", "ldapadd", "slapadd"],
    correct: 2,
    explanation:
      "ldapadd ajoute une nouvelle entrée à partir d'un fichier LDIF.\nNote : ldapadd = ldapmodify -a",
  },
  {
    id: 6,
    question:
      "Quel objectClass faut-il utiliser pour créer un compte Linux avec UID, GID et homeDirectory ?",
    options: [
      "inetOrgPerson",
      "posixAccount",
      "organizationalPerson",
      "groupOfNames",
    ],
    correct: 1,
    explanation:
      "posixAccount est l'objectClass pour les comptes Linux. Attributs obligatoires : cn, uid, uidNumber, gidNumber, homeDirectory.",
  },
  {
    id: 7,
    question: "Que représente le DN : uid=ali,ou=stagiaire,dc=istahh,dc=ma ?",
    options: [
      "L'utilisateur ali dans le groupe istahh",
      "L'utilisateur ali dans l'unité stagiaire du domaine istahh.ma",
      "L'administrateur ali du domaine ma",
      "Le groupe stagiaire du serveur ali",
    ],
    correct: 1,
    explanation:
      "uid=ali → l'utilisateur ali (RDN)\nou=stagiaire → dans l'unité organisationnelle\ndc=istahh,dc=ma → dans le domaine istahh.ma",
  },
  {
    id: 8,
    question: "Quelle commande exporte toute la base LDAP en format LDIF côté serveur ?",
    options: [
      "ldapsearch -x -b dc=example,dc=com",
      "ldapexport",
      "slapcat",
      "ldapcat",
    ],
    correct: 2,
    explanation:
      "slapcat affiche toute la base LDAP au format LDIF. C'est une commande exécutée côté serveur uniquement.",
  },
  {
    id: 9,
    question:
      "Quel fichier modifier pour que Linux cherche les utilisateurs dans LDAP en plus des fichiers locaux ?",
    options: [
      "/etc/pam.d/common-auth",
      "/etc/ldap/ldap.conf",
      "/etc/nsswitch.conf",
      "/etc/openldap/slapd.conf",
    ],
    correct: 2,
    explanation:
      "/etc/nsswitch.conf (NSS) définit où chercher les infos utilisateurs.\nExemple : passwd: files ldap",
  },
  {
    id: 10,
    question: "Quelle commande génère un mot de passe chiffré pour userPassword dans LDAP ?",
    options: ["ldappasswd", "slappasswd", "openssl passwd", "passwd --ldap"],
    correct: 1,
    explanation:
      "slappasswd génère un hash sécurisé {SSHA} pour l'attribut userPassword. En production, on ne met jamais un mot de passe en clair.",
  },
  {
    id: 11,
    question: "Que fait NSS dans le contexte de l'authentification LDAP ?",
    options: [
      "Il chiffre les mots de passe LDAP",
      "Il permet à Linux de reconnaître les utilisateurs LDAP comme locaux",
      "Il configure le serveur LDAP principal",
      "Il gère la réplication entre serveurs LDAP",
    ],
    correct: 1,
    explanation:
      "NSS (Name Service Switch) indique au système où chercher les informations utilisateurs. Avec ldap dans nsswitch.conf, Linux reconnaît les utilisateurs LDAP.",
  },
  {
    id: 12,
    question:
      "Quel est le changetype correct pour modifier un attribut existant dans un fichier LDIF ?",
    options: [
      "changetype: add",
      "changetype: modify",
      "changetype: replace",
      "changetype: update",
    ],
    correct: 1,
    explanation:
      "changetype: modify est utilisé pour modifier une entrée existante, combiné avec replace:, add: ou delete: selon l'action souhaitée.",
  },
];




export default function LDAPQuiz() {
  return (
    <QuizEngine
      questions={questions}
      title="OpenLDAP"
    />
  );
}