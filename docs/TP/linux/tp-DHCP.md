---
id: tp-DHCP
title:  DHCP
---

# TP — Serveur DHCP

7 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 — Installation et Verification (Facile)


**Objectif :** Installer le serveur DHCP et verifier son etat.

---

**1. Installer le serveur DHCP sur le systeme.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt update
sudo apt install isc-dhcp-server -y
```

Fedora :
```bash
sudo dnf install dhcp-server -y
```

</details>

---

**2. Verifier que le service DHCP est installe.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
systemctl status isc-dhcp-server
```

Fedora :
```bash
systemctl status dhcpd
```

</details>

---

**3. Afficher le fichier principal de configuration DHCP.**

<details>
<summary>Voir la reponse</summary>

```bash
cat /etc/dhcp/dhcpd.conf
```

</details>

---

**4. Identifier le nom de l interface reseau active sur le serveur.**

<details>
<summary>Voir la reponse</summary>

```bash
ip a
```

Noter le nom de l interface active (ex: `ens33`, `enp0s3`).

</details>

---

**5. Afficher le fichier qui definit l interface d ecoute DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
cat /etc/default/isc-dhcp-server
```

Fedora :
```bash
cat /etc/sysconfig/dhcpd
```

</details>

---

**6. Verifier sur quel port le serveur DHCP ecoute.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo netstat -uap | grep dhcpd
# ou
ss -ulnp | grep 67
```

Le serveur DHCP ecoute sur **UDP 67**.

</details>

---

**7. Afficher les baux DHCP actifs.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
cat /var/lib/dhcp/dhcpd.leases
```

Fedora :
```bash
cat /var/lib/dhcpd/dhcpd.leases
```

</details>

---

## TP n°2 — Configuration d un Scope Simple (Facile-Moyen)

**Objectif :** Configurer une plage DHCP basique pour le reseau `192.168.1.0/24`.

| Parametre | Valeur |
|-----------|--------|
| Reseau | 192.168.1.0/24 |
| Plage | 192.168.1.100 a 192.168.1.200 |
| Passerelle | 192.168.1.1 |
| DNS | 8.8.8.8 |
| Bail par defaut | 600 secondes |
| Bail maximum | 7200 secondes |

---

**1. Editer le fichier principal de configuration DHCP.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/dhcp/dhcpd.conf
```

</details>

---

**2. Ecrire la configuration du scope selon le tableau.**

<details>
<summary>Voir la reponse</summary>

```bash
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option domain-name-servers 8.8.8.8;
    default-lease-time 600;
    max-lease-time 7200;
}
```

</details>

---

**3. Tester la syntaxe du fichier avant de redemarrer le service.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo dhcpd -t
```

Si aucune erreur n est affichee, la syntaxe est correcte.

</details>

---

**4. Configurer l interface d ecoute DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo nano /etc/default/isc-dhcp-server
```
Modifier :
```
INTERFACESv4="ens33"
```

Fedora :
```bash
sudo nano /etc/sysconfig/dhcpd
```
Modifier :
```
DHCPDARGS=enp0s3
```

</details>

---

**5. Demarrer et activer le service DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo systemctl restart isc-dhcp-server
sudo systemctl enable isc-dhcp-server
```

Fedora :
```bash
sudo systemctl restart dhcpd
sudo systemctl enable dhcpd
```

</details>

---

**6. Verifier que le service est actif.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
systemctl status isc-dhcp-server
```

Fedora :
```bash
systemctl status dhcpd
```

</details>

---

**7. Surveiller les logs DHCP en temps reel.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
tail -f /var/log/syslog | grep dhcpd
```

Fedora :
```bash
tail -f /var/log/messages | grep dhcpd
```

</details>

---

## TP n°3 — Reservation par Adresse MAC (Moyen)

**Objectif :** Configurer une reservation d IP fixe pour un client specifique.

---

**1. Ajouter une reservation pour le poste `pc-serveur` avec MAC `AA:BB:CC:DD:EE:FF` et IP `192.168.1.50`.**

<details>
<summary>Voir la reponse</summary>

Dans `/etc/dhcp/dhcpd.conf`, ajouter apres le bloc subnet :

```bash
host pc-serveur {
    hardware ethernet AA:BB:CC:DD:EE:FF;
    fixed-address 192.168.1.50;
}
```

</details>

---

**2. Tester la syntaxe et redemarrer le service.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo dhcpd -t

# Si OK, redemarrer
```

Ubuntu :
```bash
sudo systemctl restart isc-dhcp-server
```

Fedora :
```bash
sudo systemctl restart dhcpd
```

</details>

---

**3. Verifier que le bail de `192.168.1.50` apparait dans le fichier des leases apres connexion du client.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
cat /var/lib/dhcp/dhcpd.leases
```

Fedora :
```bash
cat /var/lib/dhcpd/dhcpd.leases
```

</details>

---

**4. Ajouter une deuxieme reservation pour `pc-etudiant` avec MAC `11:22:33:44:55:66` et IP `192.168.1.51`.**

<details>
<summary>Voir la reponse</summary>

```bash
host pc-etudiant {
    hardware ethernet 11:22:33:44:55:66;
    fixed-address 192.168.1.51;
}
```

</details>

---

**5. Calculer combien d IP sont disponibles dans la plage `192.168.1.100` a `192.168.1.200`.**

<details>
<summary>Voir la reponse</summary>

```
200 - 100 + 1 = 101 adresses IP disponibles
```

Les reservations en dehors de la plage (comme `.50` et `.51`) ne consomment pas d IP de la plage range.

</details>

---

**6. Verifier les logs apres connexion d un client DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
journalctl -u isc-dhcp-server | tail -20
```

Fedora :
```bash
journalctl -u dhcpd | tail -20
```

</details>

---

**7. Afficher le fichier de configuration complet avec scope et reservations.**

<details>
<summary>Voir la reponse</summary>

```bash
cat /etc/dhcp/dhcpd.conf
```

Le fichier doit contenir :
```bash
subnet 192.168.1.0 netmask 255.255.255.0 {
    range 192.168.1.100 192.168.1.200;
    option routers 192.168.1.1;
    option domain-name-servers 8.8.8.8;
    default-lease-time 600;
    max-lease-time 7200;
}

host pc-serveur {
    hardware ethernet AA:BB:CC:DD:EE:FF;
    fixed-address 192.168.1.50;
}

host pc-etudiant {
    hardware ethernet 11:22:33:44:55:66;
    fixed-address 192.168.1.51;
}
```

</details>

---

## TP n°4 — Pare-feu et Securite DHCP (Moyen)

**Objectif :** Configurer le pare-feu pour autoriser le trafic DHCP.

---

**1. Verifier l etat du pare-feu.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
ufw status
```

Fedora :
```bash
firewall-cmd --state
```

</details>

---

**2. Autoriser le trafic DHCP (UDP 67 et UDP 68) dans le pare-feu.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo ufw allow 67/udp
sudo ufw allow 68/udp
```

Fedora :
```bash
sudo firewall-cmd --add-service=dhcp --permanent
sudo firewall-cmd --reload
```

</details>

---

**3. Verifier que les regles ont ete appliquees.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
ufw status verbose
```

Fedora :
```bash
firewall-cmd --list-services
```

</details>

---

**4. Verifier que le serveur DHCP ecoute bien sur UDP 67.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo netstat -uap | grep dhcpd
# ou
ss -ulnp | grep 67
```

</details>

---

**5. Tester la resolution DHCP depuis un client en demandant une IP manuellement.**

<details>
<summary>Voir la reponse</summary>

Depuis le client Linux :
```bash
# Liberer l IP actuelle
sudo dhclient -r

# Demander une nouvelle IP
sudo dhclient
```

</details>

---

**6. Afficher l IP obtenue par le client apres la requete DHCP.**

<details>
<summary>Voir la reponse</summary>

```bash
ip a
```

</details>

---

**7. Verifier cote serveur que le bail a ete enregistre.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
cat /var/lib/dhcp/dhcpd.leases
```

Fedora :
```bash
cat /var/lib/dhcpd/dhcpd.leases
```

</details>

---

## TP n°5 — Diagnostic DHCP (Moyen-Difficile)

**Objectif :** Diagnostiquer pourquoi un client ne reçoit pas d adresse IP.

---

**1. Verifier que le service DHCP est actif.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
systemctl status isc-dhcp-server
```

Fedora :
```bash
systemctl status dhcpd
```

Si `inactive (dead)` — probleme de configuration.

</details>

---

**2. Verifier que l interface dans le fichier d options correspond a l interface reelle.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
cat /etc/default/isc-dhcp-server
ip a
```

Fedora :
```bash
cat /etc/sysconfig/dhcpd
ip a
```

Comparer le nom de l interface dans le fichier avec celui affiche par `ip a`.

</details>

---

**3. Tester la syntaxe du fichier `dhcpd.conf`.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo dhcpd -t
```

Si une erreur est affichee, noter la ligne indiquee et corriger.

</details>

---

**4. Verifier que la plage DHCP est dans le meme reseau que l interface.**

<details>
<summary>Voir la reponse</summary>

Exemple : si l interface a l IP `192.168.1.1/24`, la plage doit etre dans `192.168.1.0/24`.

```bash
ip a | grep inet
```

Comparer avec le bloc `subnet` dans `dhcpd.conf`.

</details>

---

**5. Verifier que le pare-feu n bloque pas le trafic DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
ufw status
sudo ufw allow 67/udp
sudo ufw allow 68/udp
```

Fedora :
```bash
firewall-cmd --list-services
sudo firewall-cmd --add-service=dhcp --permanent
sudo firewall-cmd --reload
```

</details>

---

**6. Verifier si le pool d adresses est epuise.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
cat /var/lib/dhcp/dhcpd.leases | grep lease | wc -l
```

Fedora :
```bash
cat /var/lib/dhcpd/dhcpd.leases | grep lease | wc -l
```

Comparer avec la taille de la plage (`range`).

</details>

---

**7. Consulter les logs pour identifier l erreur exacte.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
journalctl -u isc-dhcp-server -n 50
tail -f /var/log/syslog | grep dhcpd
```

Fedora :
```bash
journalctl -u dhcpd -n 50
tail -f /var/log/messages | grep dhcpd
```

</details>

---

## TP n°6 — Configuration Avancee (Difficile)

**Objectif :** Configurer plusieurs scopes DHCP pour differents reseaux.

---

**1. Configurer un premier scope pour le reseau `192.168.10.0/24` avec la plage `.100` a `.150`.**

<details>
<summary>Voir la reponse</summary>

```bash
subnet 192.168.10.0 netmask 255.255.255.0 {
    range 192.168.10.100 192.168.10.150;
    option routers 192.168.10.1;
    option domain-name-servers 8.8.8.8;
    default-lease-time 600;
    max-lease-time 7200;
}
```

</details>

---

**2. Configurer un deuxieme scope pour le reseau `10.0.0.0/24` avec la plage `.50` a `.100`.**

<details>
<summary>Voir la reponse</summary>

```bash
subnet 10.0.0.0 netmask 255.255.255.0 {
    range 10.0.0.50 10.0.0.100;
    option routers 10.0.0.1;
    option domain-name-servers 1.1.1.1;
    default-lease-time 300;
    max-lease-time 3600;
}
```

</details>

---

**3. Ajouter le nom de domaine `ofppt.local` aux deux scopes.**

<details>
<summary>Voir la reponse</summary>

Ajouter dans chaque bloc subnet :
```bash
option domain-name "ofppt.local";
```

</details>

---

**4. Tester la syntaxe et redemarrer le service.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo dhcpd -t
```

Ubuntu :
```bash
sudo systemctl restart isc-dhcp-server
```

Fedora :
```bash
sudo systemctl restart dhcpd
```

</details>

---

**5. Calculer la duree du bail maximum `7200` en heures.**

<details>
<summary>Voir la reponse</summary>

```
7200 secondes / 3600 = 2 heures
```

</details>

---

**6. Ajouter une reservation dans le premier scope pour `pc-admin` avec MAC `DE:AD:BE:EF:CA:FE` et IP `192.168.10.10`.**

<details>
<summary>Voir la reponse</summary>

```bash
host pc-admin {
    hardware ethernet DE:AD:BE:EF:CA:FE;
    fixed-address 192.168.10.10;
}
```

</details>

---

**7. Verifier la configuration finale complete.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo dhcpd -t
cat /etc/dhcp/dhcpd.conf
```

</details>

---

## TP n°7 — Scenario Reel Complet (Difficile)

**Objectif :** Mettre en place un serveur DHCP complet pour l entreprise `OFPPT`.

**Contexte :** Tu es administrateur reseau. Tu dois configurer un serveur DHCP pour le reseau de l OFPPT avec les parametres suivants :

| Parametre | Valeur |
|-----------|--------|
| Reseau | 192.168.20.0/24 |
| Plage attribuable | 192.168.20.100 a 192.168.20.150 |
| Passerelle | 192.168.20.1 |
| DNS | 192.168.20.10 |
| Domaine | ofppt.local |
| Bail par defaut | 600 secondes |
| Bail maximum | 7200 secondes |
| Reservation 1 | `pc-direction` — MAC `08:00:27:AA:BB:CC` — IP `192.168.20.50` |
| Reservation 2 | `pc-formation` — MAC `08:00:27:DD:EE:FF` — IP `192.168.20.51` |

---

**1. Installer le serveur DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo apt install isc-dhcp-server -y
```

Fedora :
```bash
sudo dnf install dhcp-server -y
```

</details>

---

**2. Configurer le scope principal selon le tableau.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo nano /etc/dhcp/dhcpd.conf
```

```bash
subnet 192.168.20.0 netmask 255.255.255.0 {
    range 192.168.20.100 192.168.20.150;
    option routers 192.168.20.1;
    option domain-name-servers 192.168.20.10;
    option domain-name "ofppt.local";
    default-lease-time 600;
    max-lease-time 7200;
}
```

</details>

---

**3. Ajouter les deux reservations.**

<details>
<summary>Voir la reponse</summary>

```bash
host pc-direction {
    hardware ethernet 08:00:27:AA:BB:CC;
    fixed-address 192.168.20.50;
}

host pc-formation {
    hardware ethernet 08:00:27:DD:EE:FF;
    fixed-address 192.168.20.51;
}
```

</details>

---

**4. Configurer l interface d ecoute DHCP.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo nano /etc/default/isc-dhcp-server
```
```
INTERFACESv4="ens33"
```

Fedora :
```bash
sudo nano /etc/sysconfig/dhcpd
```
```
DHCPDARGS=enp0s3
```

</details>

---

**5. Tester la syntaxe, demarrer et activer le service.**

<details>
<summary>Voir la reponse</summary>

```bash
sudo dhcpd -t
```

Ubuntu :
```bash
sudo systemctl restart isc-dhcp-server
sudo systemctl enable isc-dhcp-server
systemctl status isc-dhcp-server
```

Fedora :
```bash
sudo systemctl restart dhcpd
sudo systemctl enable dhcpd
systemctl status dhcpd
```

</details>

---

**6. Autoriser DHCP dans le pare-feu.**

<details>
<summary>Voir la reponse</summary>

Ubuntu :
```bash
sudo ufw allow 67/udp
sudo ufw allow 68/udp
```

Fedora :
```bash
sudo firewall-cmd --add-service=dhcp --permanent
sudo firewall-cmd --reload
```

</details>

---

**7. Verifier que tout fonctionne : service actif, port 67 ouvert, baux visibles.**

<details>
<summary>Voir la reponse</summary>

```bash
# Service actif
systemctl status isc-dhcp-server   # Ubuntu
systemctl status dhcpd             # Fedora

# Port 67 ouvert
sudo netstat -uap | grep dhcpd

# Baux actifs
cat /var/lib/dhcp/dhcpd.leases     # Ubuntu
cat /var/lib/dhcpd/dhcpd.leases    # Fedora

# Logs
journalctl -u isc-dhcp-server      # Ubuntu
journalctl -u dhcpd                # Fedora
```

</details>

---

:::info Quiz disponible

Testez vos connaissances sur cette lecon :
[Faire le quiz →](/quizzes/linux/quizzDhcp)

:::