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

**1.1 Installez Apache sur le serveur et verifiez que le service fonctionne correctement.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**1.2 Testez Apache en local.**

<details>
<summary>Voir la reponse</summary>

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
Vous devez voir le code HTML de la page de test par defaut d'Apache.
:::

</details>

---

**1.3 Ouvrez les ports HTTP et HTTPS dans le pare-feu.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

## Partie 2 — Premier site web (methode simple)

**2.1 Creez le dossier `/var/www/ofppt` et une page d'accueil `index.html`.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo mkdir -p /var/www/ofppt
sudo nano /var/www/ofppt/index.html
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo mkdir -p /var/www/ofppt
sudo nano /var/www/ofppt/index.html
```

</TabItem>
</Tabs>

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

</details>

---

**2.2 Configurez les permissions du dossier `/var/www/ofppt`.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**2.3 Creez le fichier VirtualHost pour le site `www.ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**2.4 Activez le site et rechargez Apache.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo a2dissite 000-default.conf
sudo a2ensite ofppt.conf
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

:::info Resultat attendu
`apachectl configtest` doit afficher `Syntax OK`.
:::

</details>

---

## Partie 3 — Configuration DNS

**3.1 Ajoutez un enregistrement A et un enregistrement CNAME dans la zone Bind9 pour `ofppt.local`.**

<details>
<summary>Voir la reponse</summary>

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
ofppt    IN    A        192.168.1.1
www      IN    CNAME    ofppt.ofppt.local.
```

:::info Difference entre A et CNAME
- **A** : associe un nom a une adresse IP directement (`ofppt → 192.168.1.1`)
- **CNAME** : associe un nom a un autre nom (`www → ofppt.ofppt.local`), c'est un alias. Le client suit le CNAME jusqu'a trouver l'enregistrement A.
:::

</details>

---

**3.2 Verifiez la syntaxe de la zone et redemarrez DNS.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**3.3 Testez la resolution DNS et l'acces HTTP depuis le client.**

<details>
<summary>Voir la reponse</summary>
```bash
# Tester l'enregistrement A
nslookup ofppt.ofppt.local

# Tester le CNAME
nslookup www.ofppt.local

# Tester l'acces HTTP via les deux noms
curl http://ofppt.ofppt.local
curl http://www.ofppt.local
```

:::info Resultat attendu
Les deux commandes `curl` doivent retourner la meme page HTML. `nslookup www.ofppt.local` doit afficher que `www` est un alias de `ofppt.ofppt.local`.
:::

</details>


---

## Partie 4 — Sites virtuels (Name-based)

**4.1 Creez les dossiers et pages d'accueil pour `site1` et `site2`.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo mkdir -p /var/www/site1 /var/www/site2
sudo nano /var/www/site1/index.html
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo mkdir -p /var/www/site1 /var/www/site2
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

</details>

---

**4.2 Configurez les permissions pour `site1` et `site2`.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**4.3 Creez les fichiers VirtualHost pour `site1` et `site2`.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**4.4 Activez les deux sites et rechargez Apache.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**4.5 Ajoutez les enregistrements DNS pour `site1` et `site2`.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**4.6 Testez les deux sites depuis le client.**

<details>
<summary>Voir la reponse</summary>

```bash
curl http://www.site1.local
curl http://www.site2.local
```

:::info Resultat attendu
Chaque commande doit retourner la page HTML du site correspondant avec un contenu different.
:::

</details>

---

## Partie 5 — Consultation des journaux

**5.1 Consultez le journal des acces de `site1` et `site2`.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**5.2 Provoquez une erreur 403 sur `site1`, observez le journal, puis restaurez les permissions.**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

## Partie 6 — Exercice EFM Casablanca 2023

> Vous etes l'administrateur d'un reseau qui comporte un serveur WEB (`ServeurWEB`) et son client (`ClientWEB`). Vous avez la tache de configurer le serveur WEB ainsi que son client pour pouvoir charger une page `index.html`.

**6.1 Configurez les adresses IP des deux machines. (2pts)**
- Serveur WEB : `10.10.0.1/29`
- Client WEB : `10.10.0.2/29`

<details>
<summary>Voir la reponse</summary>

**Sur le serveur WEB :**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 10.10.0.1/29
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0
ip addr show eth0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 10.10.0.1/29
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0
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
ip addr show eth0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 10.10.0.2/29
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0
ip addr show eth0
```

</TabItem>
</Tabs>

```bash
# Verifier la connectivite depuis le client
ping 10.10.0.1
```

</details>

---

**6.2 Verifiez l'existence du package du serveur WEB. (3pts)**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
dpkg -l | grep apache2
```

Si non installe :

```bash
sudo apt update
sudo apt install apache2 -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
rpm -qa | grep httpd
```

Si non installe :

```bash
sudo dnf install httpd -y
```

</TabItem>
</Tabs>

</details>

---

**6.3 Creez le fichier `index.html` dans `/var/www/html` avec le contenu : EFM 2022-2023. (3pts)**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**6.4 Specifiez l'adresse d'ecoute au port 80 dans le fichier de configuration. (3pts)**

<details>
<summary>Voir la reponse</summary>

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

</details>

---

**6.5 Redemarrez le serveur WEB. (3pts)**

<details>
<summary>Voir la reponse</summary>

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

**Verification finale depuis le client :**

```bash
curl http://10.10.0.1
```

:::info Resultat attendu
La page doit afficher le contenu **EFM 2022-2023**.
:::

</details>

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

- [Cours Apache](/docs/linux/lesson-07) — revoir les notions theoriques
- [Quiz Apache](/docs/quizzes/linux/quizzApache) — tester vos connaissances