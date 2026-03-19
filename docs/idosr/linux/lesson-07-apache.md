---
id: lesson-07
title: Serveur Web Apache
sidebar_label: Serveur Web Apache
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> A la fin de ce cours, vous serez capable d'installer et configurer un serveur web Apache, de creer des sites virtuels, et de les rendre accessibles via un nom DNS sur un reseau local.

## 1. Presentation d'Apache

Apache HTTP Server est l'un des serveurs web les plus utilises au monde. C'est un logiciel libre, disponible pour la plupart des systemes d'exploitation (Linux, Windows, macOS).



### Principe client / serveur web

Le modele client/serveur web fonctionne de la facon suivante :

1. Le **client** (navigateur : Chrome, Firefox, Edge) envoie une requete HTTP
2. Le **serveur Apache** recoit et traite la requete
3. Le serveur renvoie une page HTML ou un contenu multimedia
4. Le navigateur affiche le resultat

```
Client (navigateur)  ──── requete HTTP ────►  Serveur Apache
                     ◄─── reponse HTML ────
```

:::info Ports utilises par Apache
- **Port 80** : connexion HTTP (non chiffree)
- **Port 443** : connexion HTTPS avec TLS/SSL (chiffree)
:::

---

## 2. Structure des fichiers et dossiers d'Apache

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

| Chemin | Role |
|---|---|
| `/etc/apache2/apache2.conf` | Configuration principale |
| `/etc/apache2/sites-available/` | Virtual hosts disponibles |
| `/etc/apache2/sites-enabled/` | Virtual hosts actifs (liens symbolique) |
| `/etc/apache2/mods-enabled/` | Modules actives |
| `/var/www/html/` | Repertoire web par defaut |
| `/var/log/apache2/access.log` | Logs d'acces |
| `/var/log/apache2/error.log` | Logs d'erreurs |

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

| Chemin | Role |
|---|---|
| `/etc/httpd/conf/httpd.conf` | Configuration principale |
| `/etc/httpd/conf.d/` | Fichiers de config additionnels (virtual hosts ici) |
| `/var/www/html/` | Repertoire web par defaut |
| `/var/log/httpd/access_log` | Logs d'acces |
| `/var/log/httpd/error_log` | Logs d'erreurs |

</TabItem>
</Tabs>

:::warning Bonne pratique
Ne **jamais modifier** `apache2.conf` ou `httpd.conf` directement. Toute votre configuration se fait dans `sites-available/` (Ubuntu) ou `conf.d/` (Fedora).
:::

---
## 3. Installation et Procedure complete de creation d'un site virtuel

Voici les etapes a suivre dans l'ordre pour creer un site virtuel fonctionnel.

### Etape 1 - Installation

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Mise a jour des paquets
sudo apt update

# Installation d'Apache
sudo apt install apache2 -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Mise a jour des paquets
sudo dnf update -y

# Installation d'Apache
sudo dnf install httpd -y
```

</TabItem>
</Tabs>

#### Demarrage et activation du service

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Demarrer Apache
sudo systemctl start apache2

# Activer au demarrage du systeme
sudo systemctl enable apache2

# Verifier l'etat du service
sudo systemctl status apache2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Demarrer Apache
sudo systemctl start httpd

# Activer au demarrage du systeme
sudo systemctl enable httpd

# Verifier l'etat du service
sudo systemctl status httpd
```

</TabItem>
</Tabs>

#### Test rapide en local

```bash
curl http://localhost
```

Si Apache fonctionne correctement, vous verrez le code HTML de la page de test par defaut.

---
### Etape 2 : Creer le fichier du site

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo mkdir -p /var/www/site1
sudo nano /var/www/site1/index.html
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo mkdir -p /var/www/site1
sudo nano /var/www/site1/index.html
```

</TabItem>
</Tabs>

**puis**

```html title="/var/www/html/index.html"
<html>
  <head>
    <title>Mon site Apache</title>
  </head>
  <body>
    <h1>Bienvenue sur mon serveur Apache !</h1>
  </BODY>
</html>
```
### Etape 3 : Definir les permissions

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo chown -R www-data:www-data /var/www/site1
sudo chmod -R 755 /var/www/site1
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo chown -R apache:apache /var/www/site1
sudo chmod -R 755 /var/www/site1
```

</TabItem>
</Tabs>

### Etape 4 : Creer le fichier VirtualHost

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/apache2/sites-available/site1.conf
```

```apache title="/etc/apache2/sites-available/site1.conf"
<VirtualHost *:80>
    ServerName   site1.ofppt.local
    DocumentRoot /var/www/site1

    <Directory /var/www/site1>
        Require all granted
    </Directory>

    ErrorLog  ${APACHE_LOG_DIR}/site1_error.log
    CustomLog ${APACHE_LOG_DIR}/site1_access.log combined
</VirtualHost>
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/httpd/conf.d/site1.conf
```

```apache title="/etc/httpd/conf.d/site1.conf"
<VirtualHost *:80>
    ServerName   site1.ofppt.local
    DocumentRoot /var/www/site1

    <Directory /var/www/site1>
        Require all granted
    </Directory>

    ErrorLog  /var/log/httpd/site1_error.log
    CustomLog /var/log/httpd/site1_access.log combined
</VirtualHost>
```

</TabItem>
</Tabs>

### Etape 5 : Activer le site et recharger Apache

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Desactiver le site par defaut
sudo a2dissite 000-default.conf

# Activer le nouveau site
sudo a2ensite site1.conf

# Verifier la syntaxe de la configuration
sudo apachectl configtest

# Recharger Apache
sudo systemctl reload apache2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Verifier la syntaxe de la configuration
sudo apachectl configtest

# Redemarrer Apache (le fichier .conf dans conf.d est lu automatiquement)
sudo systemctl restart httpd
```

</TabItem>
</Tabs>

### Etape 6 : Configurer le DNS

Ajoutez un enregistrement A dans votre zone DNS Bind9 qui pointe `site1.ofppt.local` vers l'IP du serveur, puis un enregistrement CNAME pour `www.site1.ofppt.local`.
```dns
site1    IN    A        192.168.1.10
www      IN    CNAME    site1.ofppt.local.
```

:::info Difference entre A et CNAME
- **A** : associe un nom a une adresse IP directement (`site1 → 192.168.1.10`)
- **CNAME** : associe un nom a un autre nom (`www → site1.ofppt.local`), c'est un alias. Le client suit le CNAME jusqu'a trouver l'enregistrement A.
:::
### Etape 7 : Ouverture des ports dans le pare-feu

Pour que le serveur web soit accessible depuis les machines clientes, il faut ouvrir les ports 80 et 443 dans le pare-feu.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Ouvrir le port HTTP (80)
sudo ufw allow 80/tcp

# Ouvrir le port HTTPS (443)
sudo ufw allow 443/tcp

# Verifier les regles actives
sudo ufw status
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Ouvrir le port HTTP (80) de facon permanente
sudo firewall-cmd --permanent --add-service=http

# Ouvrir le port HTTPS (443) de facon permanente
sudo firewall-cmd --permanent --add-service=https

# Recharger le pare-feu pour appliquer les changements
sudo firewall-cmd --reload

# Verifier les services autorises
sudo firewall-cmd --list-services
```

</TabItem>
</Tabs>

:::tip Ouverture temporaire
Pour ouvrir un port de facon temporaire (jusqu'au prochain redemarrage), retirez l'option `--permanent` sur Fedora/Red Hat.
:::

---



### Etape 8 : Tester depuis un client

Ouvrez un navigateur sur une machine cliente et accedez a :

```
http://site1.ofppt.local
```

Vous devez voir la page d'accueil de votre site.
## 4. Les sites virtuels (VirtualHost)

Un meme serveur Apache peut heberger plusieurs sites web differents. On appelle cela des **sites virtuels** ou **VirtualHost**.

Chaque VirtualHost possede sa propre configuration : son propre dossier de fichiers, son propre nom de domaine, son propre port.

Il existe trois methodes pour distinguer les sites virtuels :

| Methode | Description |
|---|---|
| Par port | Chaque site ecoute sur un port different (80, 8080...) |
| Par adresse IP | Chaque site possede une adresse IP differente |
| Par nom (Name-based) | Plusieurs sites sur la meme IP/port, differencies par le nom de domaine |

---

### Methode 1 : Sites differencies par le port

La bonne pratique est de creer **un fichier par site** et de declarer les ports d'ecoute **une seule fois** dans le fichier central `ports.conf`.

**Etape 1 : Declarer les ports d'ecoute**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```apache title="/etc/apache2/ports.conf"
Listen 80
Listen 8080
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```apache title="/etc/httpd/conf.d/ports.conf"
Listen 80
Listen 8080
```

</TabItem>
</Tabs>

**Etape 2 : Creer un fichier de configuration par site**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```apache title="/etc/apache2/sites-available/site1.conf"
<VirtualHost *:80>
    ServerName   www.site1.ma
    DocumentRoot /var/www/site1
</VirtualHost>
```

```apache title="/etc/apache2/sites-available/site2.conf"
<VirtualHost *:8080>
    ServerName   www.site2.ma
    DocumentRoot /var/www/site2
</VirtualHost>
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```apache title="/etc/httpd/conf.d/site1.conf"
<VirtualHost *:80>
    ServerName   www.site1.ma
    DocumentRoot /var/www/site1
</VirtualHost>
```

```apache title="/etc/httpd/conf.d/site2.conf"
<VirtualHost *:8080>
    ServerName   www.site2.ma
    DocumentRoot /var/www/site2
</VirtualHost>
```

</TabItem>
</Tabs>

:::info Bonne pratique
Un seul fichier par site dans `sites-available/`. Les ports sont declares une seule fois dans `ports.conf` — jamais repetes dans chaque fichier de site.
:::

---

### Methode 2 : Sites differencies par l'adresse IP

Utile quand le serveur possede plusieurs cartes reseau ou plusieurs adresses IP. Chaque site repond sur une IP differente, mais sur le meme port 80.

Un fichier par site, chacun ecoute sur son IP specifique.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```apache title="/etc/apache2/sites-available/site1.conf"
<VirtualHost 192.168.1.1:80>
    ServerName   www.site1.ma
    DocumentRoot /var/www/site1
</VirtualHost>
```

```apache title="/etc/apache2/sites-available/site2.conf"
<VirtualHost 192.168.1.3:80>
    ServerName   www.site2.ma
    DocumentRoot /var/www/site2
</VirtualHost>
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```apache title="/etc/httpd/conf.d/site1.conf"
<VirtualHost 192.168.1.1:80>
    ServerName   www.site1.ma
    DocumentRoot /var/www/site1
</VirtualHost>
```

```apache title="/etc/httpd/conf.d/site2.conf"
<VirtualHost 192.168.1.3:80>
    ServerName   www.site2.ma
    DocumentRoot /var/www/site2
</VirtualHost>
```

</TabItem>
</Tabs>

:::tip
Pour que cette methode fonctionne, le serveur doit avoir les deux adresses IP configurees sur ses interfaces reseau. Voir la section **sous-interfaces reseau** pour creer plusieurs IP sur une seule carte.
:::

---

### Methode 3 : Sites differencies par le nom (recommandee)

C'est la methode la plus utilisee en production. Un seul port 80, une seule IP — Apache distingue les sites grace au `ServerName` envoye par le navigateur dans la requete HTTP.

Un fichier par site, tous ecoutent sur `*:80`.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```apache title="/etc/apache2/sites-available/site1.conf"
<VirtualHost *:80>
    ServerName   www.site1.ma
    DocumentRoot /var/www/site1

    <Directory /var/www/site1>
        Require all granted
    </Directory>
</VirtualHost>
```

```apache title="/etc/apache2/sites-available/site2.conf"
<VirtualHost *:80>
    ServerName   www.site2.ma
    DocumentRoot /var/www/site2

    <Directory /var/www/site2>
        Require all granted
    </Directory>
</VirtualHost>
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```apache title="/etc/httpd/conf.d/site1.conf"
<VirtualHost *:80>
    ServerName   www.site1.ma
    DocumentRoot /var/www/site1

    <Directory /var/www/site1>
        Require all granted
    </Directory>
</VirtualHost>
```

```apache title="/etc/httpd/conf.d/site2.conf"
<VirtualHost *:80>
    ServerName   www.site2.ma
    DocumentRoot /var/www/site2

    <Directory /var/www/site2>
        Require all granted
    </Directory>
</VirtualHost>
```

</TabItem>
</Tabs>

:::info Pourquoi cette methode est recommandee
Elle ne necessite ni plusieurs ports ni plusieurs adresses IP. Un seul serveur avec une seule IP peut heberger des dizaines de sites. C'est la methode utilisee par tous les hebergeurs web.
:::

---



## 5. Utilisation des sous-interfaces reseau

Si le serveur possede une **seule carte reseau physique** mais que vous souhaitez creer plusieurs sites avec des adresses IP differentes, vous pouvez utiliser des **sous-interfaces** (alias).

### Etape 1 : Creer les sous-interfaces

`nmcli` cree des alias d'adresse IP permanents sur une interface existante. Remplacez `eth0` par le nom de votre interface reseau (verifiable avec `ip addr show`).

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">
```bash
# Ajouter une deuxieme adresse IP sur eth0
sudo nmcli connection modify eth0 +ipv4.addresses 192.168.1.100/24

# Ajouter une troisieme adresse IP sur eth0
sudo nmcli connection modify eth0 +ipv4.addresses 192.168.1.200/24

# Appliquer les changements
sudo nmcli connection up eth0

# Verifier les adresses configurees
ip addr show eth0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">
```bash
# Ajouter une deuxieme adresse IP sur eth0
sudo nmcli connection modify eth0 +ipv4.addresses 192.168.1.100/24

# Ajouter une troisieme adresse IP sur eth0
sudo nmcli connection modify eth0 +ipv4.addresses 192.168.1.200/24

# Appliquer les changements
sudo nmcli connection up eth0

# Verifier les adresses configurees
ip addr show eth0
```

</TabItem>
</Tabs>

### Etape 2 : Configurer les VirtualHost

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```apache title="/etc/apache2/sites-available/monsite.conf"
<VirtualHost 192.168.1.100:80>
    DocumentRoot /var/www/html/istahh1
    ServerName   www.istahh1.ma
</VirtualHost>

<VirtualHost 192.168.1.200:80>
    DocumentRoot /var/www/html/istapolo
    ServerName   www.istapolo.ma
</VirtualHost>
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```apache title="/etc/httpd/conf.d/monsite.conf"
Listen 192.168.1.100:80
Listen 192.168.1.200:80

<VirtualHost 192.168.1.100>
    DocumentRoot /var/www/html/istahh1
    ServerName   www.istahh1.ma
</VirtualHost>

<VirtualHost 192.168.1.200>
    DocumentRoot /var/www/html/istapolo
    ServerName   www.istapolo.ma
</VirtualHost>
```

</TabItem>
</Tabs>

---


## 6. Verification et consultation des journaux

Les journaux Apache sont tres utiles pour diagnostiquer les problemes.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Voir les derniers acces au site
sudo tail -f /var/log/apache2/access.log

# Voir les dernieres erreurs
sudo tail -f /var/log/apache2/error.log
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Voir les derniers acces au site
sudo tail -f /var/log/httpd/access_log

# Voir les dernieres erreurs
sudo tail -f /var/log/httpd/error_log
```

</TabItem>
</Tabs>

| Journal | Contenu |
|---|---|
| `access_log` | Toutes les requetes recues (IP client, URL, code HTTP, taille) |
| `error_log` | Erreurs du serveur, problemes de configuration, acces refuses |


:::info Codes HTTP courants
- **200** : page servie correctement
- **301** : redirection permanente vers une autre URL
- **302** : redirection temporaire vers une autre URL
- **400** : requete malformee, le serveur ne comprend pas
- **401** : authentification requise
- **403** : acces refuse (probleme de permissions)
- **404** : fichier ou page introuvable
- **500** : erreur interne du serveur (probleme dans le code ou la configuration)
- **502** : mauvaise reponse du serveur en amont (proxy)
- **503** : serveur temporairement indisponible (surcharge ou maintenance)
:::

---
 
## Pour aller plus loin
 
- [Quiz Apache](/quizzes/linux/quizzApache) — testez vos connaissances sur ce cours
- [TP Apache](/TP/linux/tp-apache) — mise en pratique guidee
 

    