---
id: tp-Apache
title: TP — Serveur Web Apache
sidebar_label: TP Apache
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> **Objectif du TP** : Installer et configurer un serveur web Apache, creer deux sites virtuels accessibles par nom de domaine, et les tester depuis une machine cliente.

## Environnement

| Machine | Role | IP |
|---|---|---|
| `srv-apache` | Serveur Apache + DNS | `192.168.1.1` |
| `client` | Machine cliente (navigateur) | `192.168.1.50` |

---

## Partie 1 — Installation et verification

### Exercice 1.1 : Installer Apache

Installez Apache sur le serveur et verifiez que le service fonctionne correctement.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# 1. Mettre a jour les paquets
sudo apt update

# 2. Installer Apache
sudo apt install apache2 -y

# 3. Demarrer et activer le service
sudo systemctl start apache2
sudo systemctl enable apache2

# 4. Verifier l'etat du service
sudo systemctl status apache2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# 1. Mettre a jour les paquets
sudo dnf update -y

# 2. Installer Apache
sudo dnf install httpd -y

# 3. Demarrer et activer le service
sudo systemctl start httpd
sudo systemctl enable httpd

# 4. Verifier l'etat du service
sudo systemctl status httpd
```

</TabItem>
</Tabs>

:::info Resultat attendu
La commande `status` doit afficher `active (running)` en vert.
:::

### Exercice 1.2 : Tester Apache en local

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
curl http://localhost
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
curl http://localhost
```

</TabItem>
</Tabs>

:::info Resultat attendu
Vous devez voir le code HTML de la page de test par defaut d'Apache (`<title>Apache2 Ubuntu Default Page</title>` ou similaire).
:::

### Exercice 1.3 : Ouvrir les ports dans le pare-feu

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
sudo firewall-cmd --list-services
```

</TabItem>
</Tabs>

---

## Partie 2 — Premier site web (methode simple)

### Exercice 2.1 : Creer la structure du site

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Creer le dossier du site
sudo mkdir -p /var/www/ofppt

# Creer la page d'accueil
sudo nano /var/www/ofppt/index.html
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer le dossier du site
sudo mkdir -p /var/www/ofppt

# Creer la page d'accueil
sudo nano /var/www/ofppt/index.html
```

</TabItem>
</Tabs>

Contenu du fichier `index.html` :

```html title="/var/www/ofppt/index.html"
<html>
  <head>
    <title>Site OFPPT</title>
  </head>
  <body>
    <h1>Bienvenue sur le site de l'OFPPT</h1>
    <p>Serveur Apache configure avec succes.</p>
  </body>
</html>
```

### Exercice 2.2 : Configurer les permissions

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo chown -R www-data:www-data /var/www/ofppt
sudo chmod -R 755 /var/www/ofppt
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo chown -R apache:apache /var/www/ofppt
sudo chmod -R 755 /var/www/ofppt
```

</TabItem>
</Tabs>

### Exercice 2.3 : Creer le fichier VirtualHost

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/apache2/sites-available/ofppt.conf
```

```apache title="/etc/apache2/sites-available/ofppt.conf"
<VirtualHost 192.168.1.1:80>
    ServerName   www.ofppt.local
    DocumentRoot /var/www/ofppt

    <Directory /var/www/ofppt>
        Require all granted
    </Directory>

    ErrorLog  ${APACHE_LOG_DIR}/ofppt_error.log
    CustomLog ${APACHE_LOG_DIR}/ofppt_access.log combined
</VirtualHost>
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/httpd/conf.d/ofppt.conf
```

```apache title="/etc/httpd/conf.d/ofppt.conf"
Listen 192.168.1.1:80

<VirtualHost 192.168.1.1:80>
    ServerName   www.ofppt.local
    DocumentRoot /var/www/ofppt

    <Directory /var/www/ofppt>
        Require all granted
    </Directory>

    ErrorLog  /var/log/httpd/ofppt_error.log
    CustomLog /var/log/httpd/ofppt_access.log combined
</VirtualHost>
```

</TabItem>
</Tabs>

### Exercice 2.4 : Activer le site et recharger Apache

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Desactiver le site par defaut
sudo a2dissite 000-default.conf

# Activer le site ofppt
sudo a2ensite ofppt.conf

# Tester la configuration
sudo apachectl configtest

# Recharger Apache
sudo systemctl reload apache2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Tester la configuration
sudo apachectl configtest

# Recharger Apache
sudo systemctl restart httpd
```

</TabItem>
</Tabs>

:::info Resultat attendu
`apachectl configtest` doit afficher `Syntax OK`.
:::

---

## Partie 3 — Configuration DNS

### Exercice 3.1 : Ajouter l'enregistrement DNS

Ajoutez un enregistrement A dans votre zone DNS Bind9 pour que `www.ofppt.local` pointe vers `192.168.1.1`.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /var/cache/bind/db.ofppt.local
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /var/named/db.ofppt.local
```

</TabItem>
</Tabs>

Ajoutez la ligne suivante dans la zone :

```dns
www    IN    A    192.168.1.1
```

### Exercice 3.2 : Verifier et redemarrer DNS

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo named-checkzone ofppt.local /var/cache/bind/db.ofppt.local
sudo systemctl restart bind9
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo named-checkzone ofppt.local /var/named/db.ofppt.local
sudo systemctl restart named
```

</TabItem>
</Tabs>

### Exercice 3.3 : Tester depuis le client

Depuis la machine cliente, verifiez la resolution DNS puis accedez au site :

```bash
# Tester la resolution DNS
nslookup www.ofppt.local

# Tester l'acces HTTP
curl http://www.ofppt.local
```

Ouvrez aussi un navigateur et accedez a `http://www.ofppt.local`.

:::info Resultat attendu
Vous devez voir la page HTML creee dans l'exercice 2.1.
:::

---

## Partie 4 — Sites virtuels (Name-based)

Vous allez creer deux sites virtuels differencies par le nom de domaine sur la meme IP et le meme port 80.

### Exercice 4.1 : Creer les dossiers et pages d'accueil

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Creer les dossiers
sudo mkdir -p /var/www/site1
sudo mkdir -p /var/www/site2

# Page d'accueil site1
sudo nano /var/www/site1/index.html
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Creer les dossiers
sudo mkdir -p /var/www/site1
sudo mkdir -p /var/www/site2

# Page d'accueil site1
sudo nano /var/www/site1/index.html
```

</TabItem>
</Tabs>

```html title="/var/www/site1/index.html"
<html>
  <head><title>Site 1</title></head>
  <body>
    <h1>Site 1 — www.site1.local</h1>
  </body>
</html>
```

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /var/www/site2/index.html
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /var/www/site2/index.html
```

</TabItem>
</Tabs>

```html title="/var/www/site2/index.html"
<html>
  <head><title>Site 2</title></head>
  <body>
    <h1>Site 2 — www.site2.local</h1>
  </body>
</html>
```

### Exercice 4.2 : Configurer les permissions

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo chown -R www-data:www-data /var/www/site1 /var/www/site2
sudo chmod -R 755 /var/www/site1 /var/www/site2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo chown -R apache:apache /var/www/site1 /var/www/site2
sudo chmod -R 755 /var/www/site1 /var/www/site2
```

</TabItem>
</Tabs>

### Exercice 4.3 : Creer les fichiers VirtualHost

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/apache2/sites-available/site1.conf
```

```apache title="/etc/apache2/sites-available/site1.conf"
<VirtualHost *:80>
    ServerName   www.site1.local
    DocumentRoot /var/www/site1

    <Directory /var/www/site1>
        Require all granted
    </Directory>

    ErrorLog  ${APACHE_LOG_DIR}/site1_error.log
    CustomLog ${APACHE_LOG_DIR}/site1_access.log combined
</VirtualHost>
```

```bash
sudo nano /etc/apache2/sites-available/site2.conf
```

```apache title="/etc/apache2/sites-available/site2.conf"
<VirtualHost *:80>
    ServerName   www.site2.local
    DocumentRoot /var/www/site2

    <Directory /var/www/site2>
        Require all granted
    </Directory>

    ErrorLog  ${APACHE_LOG_DIR}/site2_error.log
    CustomLog ${APACHE_LOG_DIR}/site2_access.log combined
</VirtualHost>
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/httpd/conf.d/site1.conf
```

```apache title="/etc/httpd/conf.d/site1.conf"
<VirtualHost *:80>
    ServerName   www.site1.local
    DocumentRoot /var/www/site1

    <Directory /var/www/site1>
        Require all granted
    </Directory>

    ErrorLog  /var/log/httpd/site1_error.log
    CustomLog /var/log/httpd/site1_access.log combined
</VirtualHost>
```

```bash
sudo nano /etc/httpd/conf.d/site2.conf
```

```apache title="/etc/httpd/conf.d/site2.conf"
<VirtualHost *:80>
    ServerName   www.site2.local
    DocumentRoot /var/www/site2

    <Directory /var/www/site2>
        Require all granted
    </Directory>

    ErrorLog  /var/log/httpd/site2_error.log
    CustomLog /var/log/httpd/site2_access.log combined
</VirtualHost>
```

</TabItem>
</Tabs>

### Exercice 4.4 : Activer les sites et recharger Apache

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo a2ensite site1.conf
sudo a2ensite site2.conf
sudo apachectl configtest
sudo systemctl reload apache2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo apachectl configtest
sudo systemctl restart httpd
```

</TabItem>
</Tabs>

### Exercice 4.5 : Ajouter les enregistrements DNS

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /var/cache/bind/db.ofppt.local
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /var/named/db.ofppt.local
```

</TabItem>
</Tabs>

```dns
site1    IN    A    192.168.1.1
site2    IN    A    192.168.1.1
```

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo systemctl restart bind9
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo systemctl restart named
```

</TabItem>
</Tabs>

### Exercice 4.6 : Tester les deux sites depuis le client

```bash
curl http://www.site1.local
curl http://www.site2.local
```

:::info Resultat attendu
Chaque commande doit retourner la page HTML du site correspondant. Le contenu doit etre different entre site1 et site2.
:::

---

## Partie 5 — Consultation des journaux

### Exercice 5.1 : Lire le journal des acces

Apres avoir accede aux sites depuis le client, consultez les journaux :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo tail -20 /var/log/apache2/site1_access.log
sudo tail -20 /var/log/apache2/site2_access.log
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo tail -20 /var/log/httpd/site1_access.log
sudo tail -20 /var/log/httpd/site2_access.log
```

</TabItem>
</Tabs>

:::info Resultat attendu
Vous devez voir les requetes HTTP avec l'IP du client, la date, l'URL demandee et le code de reponse **200**.
:::

### Exercice 5.2 : Provoquer une erreur 403

Modifiez les permissions pour provoquer une erreur 403, observez le journal, puis restaurez les permissions correctes.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Retirer les permissions de lecture
sudo chmod 700 /var/www/site1

# Tester depuis le client (doit retourner 403)
curl http://www.site1.local

# Consulter le journal des erreurs
sudo tail -5 /var/log/apache2/site1_error.log

# Restaurer les permissions correctes
sudo chmod 755 /var/www/site1
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Retirer les permissions de lecture
sudo chmod 700 /var/www/site1

# Tester depuis le client (doit retourner 403)
curl http://www.site1.local

# Consulter le journal des erreurs
sudo tail -5 /var/log/httpd/site1_error.log

# Restaurer les permissions correctes
sudo chmod 755 /var/www/site1
```

</TabItem>
</Tabs>

---

## Partie 6 — Exercice EFM Casablanca 2023

> Vous etes l'administrateur d'un reseau qui comporte un serveur WEB (`ServeurWEB`) et son client (`ClientWEB`). Vous avez la tache de configurer le serveur WEB ainsi que son client pour pouvoir charger une page `index.html`.

### Exercice 6.1 : Configurer les adresses IP des deux machines (2pts)

Configurez les adresses IP suivantes en utilisant la ligne de commande :

- **Serveur WEB** : `10.10.0.1/29`
- **Client WEB** : `10.10.0.2/29`

**Sur le serveur WEB :**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 10.10.0.1/29
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0

# Verifier
ip addr show eth0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 10.10.0.1/29
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0

# Verifier
ip addr show eth0
```

</TabItem>
</Tabs>

**Sur le client WEB :**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 10.10.0.2/29
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0

# Verifier
ip addr show eth0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 10.10.0.2/29
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0

# Verifier
ip addr show eth0
```

</TabItem>
</Tabs>

:::tip Verifier la connectivite entre les deux machines
Depuis le client, pingez le serveur pour confirmer que les deux machines communiquent :

```bash
ping 10.10.0.1
```
:::

### Exercice 6.2 : Verifier l'existence du package Apache (3pts)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Verifier si apache2 est installe
dpkg -l | grep apache2
```

Si le paquet n'est pas installe, la commande ne retourne rien. Dans ce cas, installez-le :

```bash
sudo apt update
sudo apt install apache2 -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Verifier si httpd est installe
rpm -qa | grep httpd
```

Si le paquet n'est pas installe, la commande ne retourne rien. Dans ce cas, installez-le :

```bash
sudo dnf install httpd -y
```

</TabItem>
</Tabs>

### Exercice 6.3 : Creer le fichier index.html dans /var/www/html (3pts)

Le contenu de la page doit etre : **EFM 2022-2023**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /var/www/html/index.html
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /var/www/html/index.html
```

</TabItem>
</Tabs>

```html title="/var/www/html/index.html"
<html>
  <head>
    <title>EFM 2022-2023</title>
  </head>
  <body>
    <h1>EFM 2022-2023</h1>
  </body>
</html>
```

### Exercice 6.4 : Specifier l'adresse d'ecoute dans le fichier de configuration (3pts)

La ligne a ajouter dans le fichier de configuration pour specifier l'adresse d'ecoute au port 80 :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/apache2/sites-available/efm.conf
```

```apache title="/etc/apache2/sites-available/efm.conf"
<VirtualHost 10.10.0.1:80>
    ServerName   10.10.0.1
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Require all granted
    </Directory>
</VirtualHost>
```

```bash
sudo a2ensite efm.conf
sudo apachectl configtest
sudo systemctl reload apache2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/httpd/conf.d/efm.conf
```

```apache title="/etc/httpd/conf.d/efm.conf"
Listen 10.10.0.1:80

<VirtualHost 10.10.0.1:80>
    ServerName   10.10.0.1
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Require all granted
    </Directory>
</VirtualHost>
```

```bash
sudo apachectl configtest
sudo systemctl restart httpd
```

</TabItem>
</Tabs>

### Exercice 6.5 : Redemarrer le serveur WEB (3pts)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo systemctl restart apache2
sudo systemctl status apache2
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo systemctl restart httpd
sudo systemctl status httpd
```

</TabItem>
</Tabs>

### Verification finale depuis le client

Depuis la machine `ClientWEB`, accedez au site :

```bash
curl http://10.10.0.1
```

Ou ouvrez un navigateur et accedez a `http://10.10.0.1`.

:::info Resultat attendu
La page doit afficher le contenu **EFM 2022-2023**.
:::

---

## Recapitulatif des fichiers crees

| Fichier | Role |
|---|---|
| `/var/www/ofppt/index.html` | Page d'accueil du site principal |
| `/var/www/site1/index.html` | Page d'accueil de site1 |
| `/var/www/site2/index.html` | Page d'accueil de site2 |
| `sites-available/ofppt.conf` | VirtualHost du site principal |
| `sites-available/site1.conf` | VirtualHost de site1 |
| `sites-available/site2.conf` | VirtualHost de site2 |

---

## Pour aller plus loin

- [Cours Apache](/idosr/linux/lesson-07) — revoir les notions theoriques
- [Quiz Apache](/quizzes/linux/quizzApache) — tester vos connaissances