---
id: tp-gestion-reseau
title: TP - Gestion du Réseau
---

# TP - Gestion du Réseau

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - CDP : Decouverte des Voisins (Facile)

**Objectif :** Utiliser CDP pour decouvrir la topologie reseau.

---

**1. Afficher les equipements Cisco directement connectes.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show cdp neighbors
```

</details>

---

**2. Afficher les details complets des voisins (modele, version IOS, IPs).**

<details>
<summary>Voir la reponse</summary>

```
Switch# show cdp neighbors detail
```

</details>

---

**3. Desactiver CDP sur une interface connectee a Internet (securite).**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/24
Switch(config-if)# no cdp enable
Switch(config-if)# exit
```

</details>

---

**4. Desactiver CDP globalement sur le switch.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# no cdp run
```

Pour le reactiver :
```
Switch(config)# cdp run
```

</details>

---

## TP n°2 - LLDP : Standard Multi-Constructeurs (Facile-Moyen)

**Objectif :** Activer et utiliser LLDP pour la decouverte dans un environnement multi-constructeurs.

---

**1. Activer LLDP globalement.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# lldp run
```

</details>

---

**2. Activer uniquement la transmission LLDP sur Gi0/1 (pas la reception).**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface gigabitethernet 0/1
Switch(config-if)# lldp transmit
Switch(config-if)# no lldp receive
Switch(config-if)# exit
```

</details>

---

**3. Afficher les voisins LLDP.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show lldp neighbors
Switch# show lldp neighbors detail
```

</details>

---

**4. Comparer les informations CDP et LLDP pour le meme voisin.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show cdp neighbors detail
Switch# show lldp neighbors detail
```

CDP affiche generalement plus d informations specifiques Cisco (version IOS, capacites detaillees). LLDP est plus generique mais fonctionne avec tous les constructeurs.

</details>

---

## TP n°3 - NTP et Synchronisation de l Heure (Moyen)

**Objectif :** Configurer NTP pour synchroniser l heure de tous les equipements.

**Contexte :** Serveur NTP interne a `192.168.1.1` (prefere), serveur de secours `192.168.1.2`.

---

**1. Configurer le fuseau horaire CET (UTC+1).**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# clock timezone CET 1
Switch(config)# clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00
```

</details>

---

**2. Configurer deux serveurs NTP.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# ntp server 192.168.1.1 prefer
Switch(config)# ntp server 192.168.1.2
```

</details>

---

**3. Verifier la synchronisation NTP.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show ntp status
Switch# show ntp associations
Switch# show clock detail
```

Dans `show ntp associations`, le serveur selectionne est marque `*`. `reach 377` indique une synchronisation correcte.

</details>

---

**4. Configurer l heure manuellement (si NTP n est pas disponible).**

<details>
<summary>Voir la reponse</summary>

```
Switch# clock set 14:30:00 15 March 2026
```

</details>

---

## TP n°4 - Sauvegarde et Restauration de Configuration (Moyen-Difficile)

**Objectif :** Sauvegarder et restaurer les configurations sur TFTP.

**Contexte :** Serveur TFTP a `192.168.1.100`.

---

**1. Sauvegarder la running-config sur le serveur TFTP.**

<details>
<summary>Voir la reponse</summary>

```
Switch# copy running-config tftp:
Address or name of remote host []? 192.168.1.100
Destination filename [Switch-confg]? backup-running.txt
```

</details>

---

**2. Sauvegarder l image IOS sur TFTP.**

<details>
<summary>Voir la reponse</summary>

```
Switch# copy flash0:/c2960-lanbase-mz.150-2.SE11.bin tftp://192.168.1.100/c2960-backup.bin
```

</details>

---

**3. Restaurer une configuration depuis TFTP.**

<details>
<summary>Voir la reponse</summary>

```
Switch# copy tftp: running-config
Address or name of remote host []? 192.168.1.100
Source filename []? backup-running.txt

Switch# copy running-config startup-config
```

</details>

---

## TP n°5 - Gestion des Fichiers et Boot System (Difficile)

**Objectif :** Gerer le systeme de fichiers et configurer la sequence de boot.

---

**1. Afficher tous les systemes de fichiers disponibles.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show file systems
```

</details>

---

**2. Lister le contenu de la memoire Flash.**

<details>
<summary>Voir la reponse</summary>

```
Switch# dir flash0:
Switch# show flash0:
```

</details>

---

**3. Configurer une sequence de boot avec une image principale et une image de secours.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# boot system flash0:c2960-lanbase-mz.150-2.SE11.bin
Switch(config)# boot system flash0:c2960-backup.bin
Switch(config)# boot system flash0:
```

</details>

---

**4. Verifier la configuration de boot et la version chargee.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show boot
Switch# show version
```

</details>

---

**5. Afficher toutes les commandes de gestion depuis un tableau de synthese.**

<details>
<summary>Voir la reponse</summary>

| Categorie | Commande | Description |
|---|---|---|
| CDP | `show cdp neighbors detail` | Voisins Cisco |
| LLDP | `show lldp neighbors detail` | Voisins tous constructeurs |
| Heure | `show clock` | Heure systeme |
| NTP | `show ntp status` | Etat synchronisation |
| Fichiers | `dir flash0:` | Contenu Flash |
| Boot | `show boot` | Sequence demarrage |
| Version | `show version` | IOS + uptime |

</details>
