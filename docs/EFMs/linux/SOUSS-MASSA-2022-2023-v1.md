---
id: SOUSS-MASSA-2022-2023-v1
title: EFM —  Souss Massa 2023
sidebar_label: Souss Massa 2023 — V1
---

> **Module M203 — Administration d'un environnement Linux**
> Direction Régionale Souss Massa · Variante 1 · Barème : 40 pts · Durée : 02H00

---

## Informations générales

| Champ | Valeur |
|---|---|
| Filière | IDOSR |
| Niveau | Technicien Spécialisé |
| Épreuve | Synthèse (Variante 1) |
| Année | 2022/2023 |

---

## Partie Théorique (10 pts) — 2 pts par question

### Question 1 — Directive DHCP (2 pts)

Que signifie la directive suivante dans le fichier de configuration DHCP :

```
option domain-name-servers 192.168.1.1 ;
```

<details>
<summary>Voir la réponse</summary>

Cette directive indique aux clients DHCP l'**adresse IP du serveur DNS** à utiliser pour la résolution de noms. Ici, `192.168.1.1` sera configuré automatiquement comme serveur DNS primaire sur chaque client qui obtient une adresse IP via ce serveur DHCP.

</details>

---

### Question 2 — Bloc de réservation DHCP (2 pts)

Quel est le rôle des lignes suivantes dans le fichier de configuration DHCP ?

```
host poste1 {
    hardware ethernet 00:1A:2B:3C:4D:5E ;
    fixed-address 192.168.1.21 ;
}
```

<details>
<summary>Voir la réponse</summary>

Il s'agit d'une **réservation DHCP statique** pour la machine `poste1` :

- `hardware ethernet 00:1A:2B:3C:4D:5E` — identifie le client par son adresse MAC
- `fixed-address 192.168.1.21` — adresse IP fixe qui lui sera toujours attribuée

Chaque fois que la machine avec cette adresse MAC demandera une IP, le serveur DHCP lui attribuera toujours `192.168.1.21`.

</details>

---

### Question 3 — Démarrer SAMBA (2 pts)

Donner la commande qui permet de démarrer le service SAMBA.

<details>
<summary>Voir la réponse</summary>

```bash
# Fedora / RHEL
sudo systemctl start smb
sudo systemctl start nmb
sudo systemctl enable smb nmb

# Ubuntu
sudo systemctl start smbd
sudo systemctl start nmbd
sudo systemctl enable smbd nmbd
```

</details>

---

### Question 4 — Autoriser httpd dans le pare-feu (2 pts)

Donner la commande qui permet d'autoriser le service `httpd` dans le pare-feu Linux.

<details>
<summary>Voir la réponse</summary>

```bash
# Fedora / RHEL
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent
sudo firewall-cmd --reload

# Ubuntu
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

</details>

---

### Question 5 — Fichier de configuration NFS (2 pts)

Donner le nom et le chemin du fichier de configuration du service NFS.

<details>
<summary>Voir la réponse</summary>

```
/etc/exports
```

C'est le fichier principal de configuration du service NFS. Il définit les répertoires partagés, les machines autorisées et les options d'accès.

```bash
# Exemple de contenu
/srv/nfs    192.168.1.0/24(rw,sync,no_root_squash)

# Appliquer les modifications
sudo exportfs -ra
sudo systemctl restart nfs-server
```

</details>

---

## Partie Pratique (30 pts) — 2 pts par question

### Configuration de base

---

**1. Configurer le nom `srv1.smlinux.local` dans le serveur. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
sudo hostnamectl set-hostname srv1.smlinux.local

# Vérifier
hostnamectl
```

</details>

---

**2. Attribuer les paramètres réseau à l'interface `enp0s3`. (2 pts)**

Paramètres : IP `192.168.1.10/24` · Passerelle `192.168.1.1` · DNS primaire `192.168.1.10` · DNS secondaire `192.168.1.11` · Domaine `smlinux.local`

<details>
<summary>Voir la réponse</summary>

```bash
sudo nmcli con mod enp0s3 ipv4.method manual \
  ipv4.addresses 192.168.1.10/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns "192.168.1.10 192.168.1.11" \
  ipv4.dns-search smlinux.local

sudo nmcli con up enp0s3
```

</details>

---

**3. Redémarrer le service réseau `enp0s3`. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
sudo nmcli con down enp0s3
sudo nmcli con up enp0s3

# Ou
sudo systemctl restart NetworkManager
```

</details>

---

**4. Afficher la configuration TCP/IP du serveur. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
ip a
# ou
ip addr show enp0s3
# ou
nmcli con show enp0s3
```

</details>

---

### Service DNS

---

**5. Vérifier si le paquet BIND est installé. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
# Fedora / RHEL
rpm -q bind bind-utils

# Ubuntu
dpkg -l bind9
```

</details>

---

**6. Installer le service BIND. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
# Fedora / RHEL
sudo dnf install bind bind-utils -y

# Ubuntu
sudo apt install bind9 bind9-utils -y
```

</details>

---

**7. Configuration à ajouter dans `/etc/resolv.conf`. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
search smlinux.local
nameserver 192.168.1.10
nameserver 192.168.1.11
```

</details>

---

**8. Directives pour les options globales dans `named.conf`. (2 pts)**

Options à configurer :
- a. Emplacement des fichiers de zones : `/var/named`
- b. Port d'écoute et adresse IP de l'interface
- c. Autoriser seulement le réseau `192.168.1.0/24`
- d. Autoriser le transfert vers le DNS secondaire `192.168.1.11`
- e. Désactiver les requêtes récursives
- f. Activer la notification

<details>
<summary>Voir la réponse</summary>

```bash
options {
    directory "/var/named";                          # a. Emplacement des zones
    listen-on port 53 { 192.168.1.10; };             # b. Port et IP d'écoute
    allow-query { 192.168.1.0/24; };                 # c. Réseau autorisé
    allow-transfer { 192.168.1.11; };                # d. Transfert vers secondaire
    recursion no;                                    # e. Désactiver la récursion
    notify yes;                                      # f. Activer les notifications
};
```

</details>

---

**9. Déclarer la zone de recherche directe `smlinux.local`. (2 pts)**

Paramètres : fichier `smlinux.local.dir` · type principale · transfert autorisé vers secondaire · notifications activées.

<details>
<summary>Voir la réponse</summary>

```bash
zone "smlinux.local" IN {
    type master;
    file "smlinux.local.dir";
    allow-transfer { 192.168.1.11; };
    notify yes;
};
```

</details>

---

**10. Déclarer la zone de recherche inversée pour `192.168.1.0/24`. (2 pts)**

Paramètres : fichier `smlinux.local.inv` · type principale · transfert autorisé · notifications activées.

<details>
<summary>Voir la réponse</summary>

```bash
zone "1.168.192.in-addr.arpa" IN {
    type master;
    file "smlinux.local.inv";
    allow-transfer { 192.168.1.11; };
    notify yes;
};
```

:::info Zone inversée
Le nom de la zone inversée s'écrit avec les octets du réseau dans l'ordre inverse suivi de `.in-addr.arpa`. Pour `192.168.1.0/24` → `1.168.192.in-addr.arpa`.
:::

</details>

---

**11. Compléter le fichier de zone de recherche directe. (2 pts)**

Paramètres :
- SOA : `srv1.smlinux.local` · admin `admin@smlinux.local`
- Serial : `AAAAMMJJ01`
- Refresh : 8 heures · Retry : 2 heures · Expire : 1 semaine · TTL min : 2 jours
- NS et A pour srv1 (primaire) et server2 (secondaire)
- MX priorité 10 → srv1
- A pour poste1 : `192.168.1.21`
- CNAME mail → srv1

<details>
<summary>Voir la réponse</summary>

```bash
$TTL 2D
@   IN  SOA  srv1.smlinux.local.  admin.smlinux.local. (
            2023012301  ; Serial (AAAAMMJJ01)
            28800       ; Refresh — 8 heures
            7200        ; Retry — 2 heures
            604800      ; Expire — 1 semaine
            172800 )    ; Minimum TTL — 2 jours

; Serveurs de noms
    IN  NS      srv1.smlinux.local.
    IN  NS      server2.smlinux.local.

; Serveur de messagerie
    IN  MX  10  srv1.smlinux.local.

; Enregistrements A
srv1    IN  A   192.168.1.10
server2 IN  A   192.168.1.11
poste1  IN  A   192.168.1.21

; Alias CNAME
mail    IN  CNAME   srv1.smlinux.local.
```

</details>

---

**12. Tester le fichier de configuration `named.conf`. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
sudo named-checkconf
```

Si aucune sortie n'est affichée, la syntaxe est correcte. En cas d'erreur, la commande indique le fichier et la ligne concernée.

</details>

---

**13. Tester le fichier de la zone de recherche directe. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
sudo named-checkzone smlinux.local /var/named/smlinux.local.dir
```

Résultat attendu : `OK`

</details>

---

**14. Interroger le serveur DNS pour résoudre `poste1.smlinux.local`. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
nslookup poste1.smlinux.local 192.168.1.10

# Ou avec dig
dig @192.168.1.10 poste1.smlinux.local
```

Résultat attendu : `192.168.1.21`

</details>

---

**15. Redémarrer le service named. (2 pts)**

<details>
<summary>Voir la réponse</summary>

```bash
# Fedora / RHEL
sudo systemctl restart named
sudo systemctl enable named
systemctl status named

# Ubuntu
sudo systemctl restart bind9
sudo systemctl enable bind9
systemctl status bind9
```

</details>