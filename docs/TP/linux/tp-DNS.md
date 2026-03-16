---
id: tp-DNS
title: DNS et DDNS
---

# TP — Serveur DNS et DDNS

7 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 — Installation et Verification (Facile)

**Objectif :** Installer BIND9 et verifier les fichiers de base.

---

**1. Verifier si le package BIND est deja installe sur le systeme.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
dpkg -l | grep bind9
# ou
apt list --installed | grep bind9
```

Fedora :
```bash
rpm -q bind
```

</details>

---

**2. Installer le serveur DNS BIND9.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt update
sudo apt install bind9 bind9utils bind9-doc -y
```

Fedora :
```bash
sudo dnf install bind bind-utils -y
```

</details>

---

**3. Verifier que le service DNS est actif.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
systemctl status bind9
```

Fedora :
```bash
systemctl status named
```

</details>

---

**4. Afficher le fichier de configuration principal.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
cat /etc/bind/named.conf
```

Fedora :
```bash
cat /etc/named.conf
```

</details>

---

**5. Verifier la syntaxe du fichier de configuration.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo named-checkconf /etc/bind/named.conf
```

Fedora :
```bash
sudo named-checkconf
```

Aucune sortie = configuration correcte.

</details>

---

**6. Autoriser le DNS dans le pare-feu.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo ufw allow 53/tcp
sudo ufw allow 53/udp
```

Fedora :
```bash
sudo firewall-cmd --add-service=dns --permanent
sudo firewall-cmd --reload
```

</details>

---

**7. Demarrer et activer le service DNS au demarrage.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl restart bind9
sudo systemctl enable bind9
```

Fedora :
```bash
sudo systemctl restart named
sudo systemctl enable named
```

</details>

---

## TP n°2 — Configuration des Options Globales (Facile-Moyen)

**Objectif :** Configurer les options globales de BIND9.

---

**1. Editer le fichier des options globales.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo nano /etc/bind/named.conf.options
```

Fedora :
```bash
sudo nano /etc/named.conf
```

</details>

---

**2. Configurer BIND pour accepter les requetes de tous les clients avec les forwarders `8.8.8.8` et `1.1.1.1`.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
options {
    directory "/var/cache/bind";
    recursion yes;
    allow-query { any; };
    forwarders { 8.8.8.8; 1.1.1.1; };
    listen-on { any; };
    dnssec-validation auto;
};
```

Fedora :
```bash
options {
    directory "/var/named";
    recursion yes;
    allow-query { any; };
    forwarders { 8.8.8.8; 1.1.1.1; };
    listen-on { any; };
    dnssec-validation auto;
};
```

</details>

---

**3. Tester la resolution DNS vers un nom externe apres configuration.**

<details>
<summary>Voir la reponse</summary>

```bash
dig @127.0.0.1 google.com
nslookup google.com 127.0.0.1
```

</details>

---

**4. Expliquer le role de chaque option configuree.**

<details>
<summary>Voir la reponse</summary>

| Option | Role |
|--------|------|
| `directory` | Dossier de cache de BIND |
| `recursion yes` | Permet de chercher les reponses sur Internet |
| `allow-query { any; }` | Autorise tous les clients a utiliser ce serveur DNS |
| `forwarders` | DNS externes utilises si la reponse n est pas locale |
| `listen-on { any; }` | Ecoute sur toutes les interfaces reseau |
| `dnssec-validation auto` | Verification de securite DNS automatique |

</details>

---

**5. Verifier la syntaxe apres modification et redemarrer.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo named-checkconf /etc/bind/named.conf
sudo systemctl restart bind9
```

Fedora :
```bash
sudo named-checkconf
sudo systemctl restart named
```

</details>

---

**6. Afficher les logs du service DNS.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
journalctl -u bind9 -n 20
tail -f /var/log/syslog | grep named
```

Fedora :
```bash
journalctl -u named -n 20
```

</details>

---

**7. Tester la resolution DNS locale.**

<details>
<summary>Voir la reponse</summary>

```bash
dig @127.0.0.1 localhost
nslookup localhost 127.0.0.1
```

</details>

---

## TP n°3 — Zone Directe (Moyen)

**Objectif :** Creer et configurer une zone DNS directe pour le domaine `ofppt.local`.

**Parametres :**

| Parametre | Valeur |
|-----------|--------|
| Domaine | `ofppt.local` |
| Serveur DNS | `ns1.ofppt.local` — IP `192.168.10.1` |
| Serveur WEB | `web.ofppt.local` — IP `192.168.10.2` |
| Serveur MAIL | `mail.ofppt.local` — IP `192.168.10.5` |
| Alias www | pointe vers `web.ofppt.local` |

---

**1. Declarer la zone directe `ofppt.local` dans le fichier de configuration.**

<details>
<summary>Voir la reponse</summary>

Ubuntu — dans `/etc/bind/named.conf.local` :
```bash
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
};
```

Fedora — dans `/etc/named.conf` :
```bash
zone "ofppt.local" {
    type master;
    file "/var/named/db.ofppt.local";
};
```

</details>

---

**2. Creer le fichier de zone directe avec le SOA et l enregistrement NS.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo nano /etc/bind/db.ofppt.local
```

```dns
$TTL 86400
@  IN  SOA  ns1.ofppt.local. admin.ofppt.local. (
              2024010101 ; Serial
              3600       ; Refresh
              1800       ; Retry
              604800     ; Expire
              86400 )    ; Minimum TTL

@    IN  NS   ns1.ofppt.local.
ns1  IN  A    192.168.10.1
```

</details>

---

**3. Ajouter les enregistrements A pour le serveur web et le serveur mail.**

<details>
<summary>Voir la reponse</summary>

```dns
web  IN  A    192.168.10.2
mail IN  A    192.168.10.5
```

</details>

---

**4. Ajouter l alias `www` pointant vers `web.ofppt.local` et l enregistrement MX.**

<details>
<summary>Voir la reponse</summary>

```dns
www  IN  CNAME  web.ofppt.local.
@    IN  MX  10  mail.ofppt.local.
```

</details>

---

**5. Verifier la syntaxe du fichier de zone.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo named-checkzone ofppt.local /etc/bind/db.ofppt.local
```

Fedora :
```bash
sudo named-checkzone ofppt.local /var/named/db.ofppt.local
```

</details>

---

**6. Redemarrer le service et tester la resolution.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl restart bind9
```

Fedora :
```bash
sudo systemctl restart named
```

Tests :
```bash
dig @127.0.0.1 web.ofppt.local
dig @127.0.0.1 www.ofppt.local
dig @127.0.0.1 ofppt.local MX
```

</details>

---

**7. Tester la resolution du serveur mail et de l alias www.**

<details>
<summary>Voir la reponse</summary>

```bash
nslookup www.ofppt.local 127.0.0.1
nslookup mail.ofppt.local 127.0.0.1
dig @127.0.0.1 ofppt.local MX
```

</details>

---

## TP n°4 — Zone Inverse (Moyen)

**Objectif :** Creer la zone inverse pour le reseau `192.168.10.0/24`.

---

**1. Declarer la zone inverse dans le fichier de configuration.**

<details>
<summary>Voir la reponse</summary>

Ubuntu — dans `/etc/bind/named.conf.local` :
```bash
zone "10.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.10";
};
```

Fedora — dans `/etc/named.conf` :
```bash
zone "10.168.192.in-addr.arpa" {
    type master;
    file "/var/named/db.192.168.10";
};
```

</details>

---

**2. Creer le fichier de zone inverse.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo nano /etc/bind/db.192.168.10
```

```dns
$TTL 86400
@  IN  SOA  ns1.ofppt.local. admin.ofppt.local. (
              2024010101 3600 1800 604800 86400 )

@    IN  NS   ns1.ofppt.local.
1    IN  PTR  ns1.ofppt.local.
2    IN  PTR  web.ofppt.local.
5    IN  PTR  mail.ofppt.local.
```

</details>

---

**3. Verifier la syntaxe de la zone inverse.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo named-checkzone 10.168.192.in-addr.arpa /etc/bind/db.192.168.10
```

Fedora :
```bash
sudo named-checkzone 10.168.192.in-addr.arpa /var/named/db.192.168.10
```

</details>

---

**4. Redemarrer le service et tester la resolution inverse.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl restart bind9
```

Fedora :
```bash
sudo systemctl restart named
```

Test :
```bash
dig @127.0.0.1 -x 192.168.10.1
dig @127.0.0.1 -x 192.168.10.2
```

</details>

---

**5. Expliquer la difference entre zone directe et zone inverse.**

<details>
<summary>Voir la reponse</summary>

| Zone | Direction | Enregistrement |
|------|-----------|----------------|
| Zone directe | Nom → IP | A, CNAME, MX, NS |
| Zone inverse | IP → Nom | PTR |

La zone inverse permet de retrouver le nom d un hote a partir de son adresse IP. Elle est utile pour les verifications de securite et les diagnostics reseau.

</details>

---

**6. Tester la resolution inverse de toutes les adresses configurees.**

<details>
<summary>Voir la reponse</summary>

```bash
dig @127.0.0.1 -x 192.168.10.1
dig @127.0.0.1 -x 192.168.10.2
dig @127.0.0.1 -x 192.168.10.5
```

</details>

---

**7. Verifier que la zone inverse repond correctement avec nslookup.**

<details>
<summary>Voir la reponse</summary>

```bash
nslookup 192.168.10.1 127.0.0.1
nslookup 192.168.10.2 127.0.0.1
```

</details>

---

## TP n°5 — TP Examen : Zone efm.local (Moyen-Difficile)

**Objectif :** Configurer un serveur DNS primaire pour la zone `efm.local` selon les specifications d examen.

**Contexte :** Le serveur WEB joue aussi le role de serveur DNS avec les parametres suivants :

| Parametre | Valeur |
|-----------|--------|
| Nom de zone | `efm.local` |
| Type | master |
| Fichier de zone | `efm.local.db` |
| Mise a jour dynamique | autorisee pour `10.10.0.30` |
| Transfert de zone | autorise vers `10.10.0.30` |
| Notification | activee |
| Serveur DNS | `ns1.efm.local` — IP `10.10.0.10` |
| Serveur MAIL | `mail.efm.local` — IP `10.10.0.20` — priorite 30 |

---

**1. Verifier l existence du package BIND sur le serveur.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
dpkg -l | grep bind9
```

Fedora :
```bash
rpm -q bind
```

Si absent, installer :

Ubuntu :
```bash
sudo apt install bind9 bind9utils -y
```

Fedora :
```bash
sudo dnf install bind bind-utils -y
```

</details>

---

**2. Donner la configuration de la zone `efm.local` dans named.conf avec tous les parametres demandes.**

<details>
<summary>Voir la reponse</summary>

Ubuntu — dans `/etc/bind/named.conf.local` :
```bash
zone "efm.local" IN {
    type master;
    file "/etc/bind/efm.local.db";
    allow-update { 10.10.0.30; };
    allow-transfer { 10.10.0.30; };
    notify yes;
};
```

Fedora — dans `/etc/named.conf` :
```bash
zone "efm.local" IN {
    type master;
    file "/var/named/efm.local.db";
    allow-update { 10.10.0.30; };
    allow-transfer { 10.10.0.30; };
    notify yes;
};
```

</details>

---

**3. Donner les enregistrements pour declarer le serveur DNS primaire `ns1.efm.local` dans le fichier de zone directe.**

<details>
<summary>Voir la reponse</summary>

```dns
$TTL 86400
@  IN  SOA  ns1.efm.local. admin.efm.local. (
              2024010101 ; Serial
              3600       ; Refresh
              1800       ; Retry
              604800     ; Expire
              86400 )    ; Minimum TTL

@    IN  NS   ns1.efm.local.
ns1  IN  A    10.10.0.10
```

L enregistrement `NS` declare le serveur autoritaire.
L enregistrement `A` donne l adresse IP de ce serveur.
Les deux sont obligatoires ensemble.

</details>

---

**4. Donner les enregistrements pour declarer le serveur de messagerie `mail` avec l IP `10.10.0.20` et la priorite `30`.**

<details>
<summary>Voir la reponse</summary>

```dns
@    IN  MX  30  mail.efm.local.
mail IN  A       10.10.0.20
```

Le chiffre `30` est la priorite — plus il est petit, plus le serveur est prioritaire. L enregistrement `A` est necessaire pour resoudre l IP du serveur mail.

</details>

---

**5. Donner l enregistrement CNAME pour declarer l alias `mail` au serveur de messagerie.**

<details>
<summary>Voir la reponse</summary>

```dns
smtp  IN  CNAME  mail.efm.local.
imap  IN  CNAME  mail.efm.local.
```

> Note : le champ MX pointe deja vers `mail.efm.local`. Si on veut un alias supplementaire (ex: `smtp` ou `webmail`), on utilise CNAME. Un CNAME ne peut pas pointer directement vers un enregistrement MX.

</details>

---

**6. Demarrer le serveur DNS et verifier son etat.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo named-checkconf /etc/bind/named.conf
sudo named-checkzone efm.local /etc/bind/efm.local.db
sudo systemctl restart bind9
sudo systemctl enable bind9
systemctl status bind9
```

Fedora :
```bash
sudo named-checkconf
sudo named-checkzone efm.local /var/named/efm.local.db
sudo systemctl restart named
sudo systemctl enable named
systemctl status named
```

</details>

---

**7. Tester la resolution DNS complete de la zone `efm.local`.**

<details>
<summary>Voir la reponse</summary>

```bash
# Resolution du serveur DNS
dig @127.0.0.1 ns1.efm.local

# Resolution du serveur mail
dig @127.0.0.1 mail.efm.local

# Resolution MX
dig @127.0.0.1 efm.local MX

# Resolution NS
dig @127.0.0.1 efm.local NS
```

</details>

---

## TP n°6 — DDNS — DNS Dynamique (Difficile)

**Objectif :** Configurer le DDNS pour que le serveur DHCP mette a jour automatiquement les enregistrements DNS.

---

**1. Configurer la zone DNS pour autoriser les mises a jour dynamiques (sans cle TSIG).**

<details>
<summary>Voir la reponse</summary>

Ubuntu — dans `/etc/bind/named.conf.local` :
```bash
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
    allow-update { any; };
};
```

Fedora — dans `/etc/named.conf` :
```bash
zone "ofppt.local" {
    type master;
    file "/var/named/db.ofppt.local";
    allow-update { any; };
};
```

</details>

---

**2. Configurer le serveur DHCP pour envoyer les mises a jour DNS.**

<details>
<summary>Voir la reponse</summary>

Dans `/etc/dhcp/dhcpd.conf` :
```bash
ddns-updates on;
ddns-update-style interim;
ignore client-updates;

zone ofppt.local. {
    primary 127.0.0.1;
}

subnet 192.168.7.0 netmask 255.255.255.0 {
    range 192.168.7.100 192.168.7.200;
    option routers 192.168.7.1;
    ddns-domainname "ofppt.local.";
    ddns-rev-domainname "in-addr.arpa.";
}
```

</details>

---

**3. Generer une cle TSIG pour securiser le DDNS.**

<details>
<summary>Voir la reponse</summary>

```bash
tsig-keygen -a HMAC-SHA256 dhcp-key > /etc/bind/ddns.key
chown bind:bind /etc/bind/ddns.key
chmod 640 /etc/bind/ddns.key
```

</details>

---

**4. Configurer la zone DNS pour utiliser la cle TSIG.**

<details>
<summary>Voir la reponse</summary>

Dans `/etc/bind/named.conf.local` (Ubuntu) :
```bash
include "/etc/bind/ddns.key";

zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
    allow-update { key dhcp-key; };
};
```

</details>

---

**5. Configurer le serveur DHCP pour utiliser la cle TSIG.**

<details>
<summary>Voir la reponse</summary>

Dans `/etc/dhcp/dhcpd.conf` :
```bash
include "/etc/bind/ddns.key";

zone ofppt.local. {
    primary 127.0.0.1;
    key dhcp-key;
}
```

</details>

---

**6. Redemarrer les deux services.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl restart bind9
sudo systemctl restart isc-dhcp-server
```

Fedora :
```bash
sudo systemctl restart named
sudo systemctl restart dhcpd
```

</details>

---

**7. Verifier que le DDNS fonctionne apres connexion d un client.**

<details>
<summary>Voir la reponse</summary>

Depuis le serveur DNS, verifier que l enregistrement a ete ajoute automatiquement :

```bash
dig @127.0.0.1 pc-client.ofppt.local
```

Consulter les logs :

Ubuntu :
```bash
journalctl -u bind9 | grep DDNS
tail -f /var/log/syslog | grep named
```

Fedora :
```bash
journalctl -u named | grep DDNS
```

</details>

---

## TP n°7 — Scenario Reel Complet (Difficile)

**Objectif :** Deployer un serveur DNS complet avec zone directe, zone inverse et DDNS pour l entreprise `OFPPT`.

**Contexte :** Tu es administrateur reseau. Tu dois configurer un serveur DNS autoritaire pour le domaine `ofppt.local`.

| Hote | Nom DNS | Adresse IP |
|------|---------|-----------|
| Serveur DNS | `ns1.ofppt.local` | `192.168.10.1` |
| Serveur WEB | `web.ofppt.local` | `192.168.10.2` |
| Serveur MAIL | `mail.ofppt.local` | `192.168.10.5` |
| Serveur DHCP | `dhcp.ofppt.local` | `192.168.10.3` |
| Alias www | pointe vers `web` | — |

---

**1. Installer BIND9 et verifier l installation.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt install bind9 bind9utils bind9-doc -y
systemctl status bind9
```

Fedora :
```bash
sudo dnf install bind bind-utils -y
systemctl status named
```

</details>

---

**2. Configurer les options globales avec recursion et forwarders.**

<details>
<summary>Voir la reponse</summary>

Ubuntu — `/etc/bind/named.conf.options` :
```bash
options {
    directory "/var/cache/bind";
    recursion yes;
    allow-query { any; };
    forwarders { 8.8.8.8; 1.1.1.1; };
    listen-on { any; };
    dnssec-validation auto;
};
```

</details>

---

**3. Declarer les zones directe et inverse.**

<details>
<summary>Voir la reponse</summary>

Ubuntu — `/etc/bind/named.conf.local` :
```bash
zone "ofppt.local" {
    type master;
    file "/etc/bind/db.ofppt.local";
    allow-update { 192.168.10.3; };
    allow-transfer { 192.168.10.3; };
    notify yes;
};

zone "10.168.192.in-addr.arpa" {
    type master;
    file "/etc/bind/db.192.168.10";
};
```

</details>

---

**4. Creer le fichier de zone directe complet.**

<details>
<summary>Voir la reponse</summary>

```dns
$TTL 86400
@  IN  SOA  ns1.ofppt.local. admin.ofppt.local. (
              2024010101 ; Serial
              3600       ; Refresh
              1800       ; Retry
              604800     ; Expire
              86400 )    ; Minimum TTL

@     IN  NS    ns1.ofppt.local.
ns1   IN  A     192.168.10.1
web   IN  A     192.168.10.2
mail  IN  A     192.168.10.5
dhcp  IN  A     192.168.10.3
www   IN  CNAME web.ofppt.local.
ftp   IN  CNAME web.ofppt.local.
@     IN  MX  10 mail.ofppt.local.
```

</details>

---

**5. Creer le fichier de zone inverse.**

<details>
<summary>Voir la reponse</summary>

```dns
$TTL 86400
@  IN  SOA  ns1.ofppt.local. admin.ofppt.local. (
              2024010101 3600 1800 604800 86400 )

@   IN  NS   ns1.ofppt.local.
1   IN  PTR  ns1.ofppt.local.
2   IN  PTR  web.ofppt.local.
5   IN  PTR  mail.ofppt.local.
3   IN  PTR  dhcp.ofppt.local.
```

</details>

---

**6. Verifier toute la configuration et demarrer le service.**

<details>
<summary>Voir la reponse</summary>

```bash
# Verifier named.conf
sudo named-checkconf /etc/bind/named.conf

# Verifier zone directe
sudo named-checkzone ofppt.local /etc/bind/db.ofppt.local

# Verifier zone inverse
sudo named-checkzone 10.168.192.in-addr.arpa /etc/bind/db.192.168.10

# Demarrer
sudo systemctl restart bind9
sudo systemctl enable bind9
systemctl status bind9
```

</details>

---

**7. Tester la resolution complete : directe, inverse, MX, alias.**

<details>
<summary>Voir la reponse</summary>

```bash
# Resolution directe
dig @127.0.0.1 ns1.ofppt.local
dig @127.0.0.1 web.ofppt.local
dig @127.0.0.1 mail.ofppt.local

# Alias
dig @127.0.0.1 www.ofppt.local

# MX
dig @127.0.0.1 ofppt.local MX

# Resolution inverse
dig @127.0.0.1 -x 192.168.10.1
dig @127.0.0.1 -x 192.168.10.2
dig @127.0.0.1 -x 192.168.10.5

# nslookup
nslookup web.ofppt.local 127.0.0.1
nslookup 192.168.10.2 127.0.0.1
```

</details>

---

:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/linux/quizzDNS)

:::