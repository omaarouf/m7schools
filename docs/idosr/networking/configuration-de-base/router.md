---
id: router
title: Configuration de Base — Routeur
sidebar_label: Configuration de Base — Routeur
---

> Maitriser la configuration initiale d'un routeur Cisco : securisation des acces, configuration des interfaces, gestion a distance SSH.

## 1. Acces aux modes de configuration

```
Router>                  ← Mode utilisateur (EXEC utilisateur)
Router> enable
Router#                  ← Mode privilégié (EXEC privilégié)
Router# configure terminal
Router(config)#          ← Mode de configuration globale
Router(config)# interface gigabitethernet 0/0
Router(config-if)#       ← Mode de configuration d'interface
```

:::info Raccourcis utiles
- `Ctrl+Z` : retour direct au mode EXEC privilégié
- `end` : equivalent de `Ctrl+Z`
- `exit` : remonte d'un niveau
- `do` : executer une commande EXEC depuis un sous-mode (ex: `do show ip int brief`)
:::

---

## 2. Nom d'hote (Hostname)

```bash title="Configurer le nom du routeur"
Router(config)# hostname R1
R1(config)#
```

:::tip Bonne pratique
Utiliser des noms significatifs : `R-CORE-01`, `R-EDGE-ISP`, etc.
:::

---

## 3. Securisation des mots de passe

### Mot de passe du mode privilégié

```bash title="Mot de passe enable secret (chiffré MD5)"
R1(config)# enable secret cisco123
```

### Mot de passe de la console

```bash title="Sécurisation de la console"
R1(config)# line console 0
R1(config-line)# password console123
R1(config-line)# login
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
```

### Chiffrement global des mots de passe

```bash title="Chiffrer tous les mots de passe en clair"
R1(config)# service password-encryption
```

:::warning
`service password-encryption` utilise un chiffrement faible (type 7). Il protege contre la lecture directe du fichier de config mais n'est pas suffisant seul — toujours combiner avec `enable secret`.
:::

---

## 4. Banniere de connexion (Banner MOTD)

```bash title="Message affiché à la connexion"
R1(config)# banner motd # Acces autorise uniquement. Toute connexion non autorisee sera poursuivie. #
```

---

## 5. Configuration des interfaces

Contrairement au switch, les interfaces d'un routeur sont desactivees par defaut — il faut les activer avec `no shutdown`.

### Interface Ethernet (LAN)

```bash title="Configurer une interface GigabitEthernet"
R1(config)# interface gigabitethernet 0/0
R1(config-if)# description LAN - Reseau interne
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
```

### Interface Serial (WAN)

```bash title="Configurer une interface Serial (WAN)"
R1(config)# interface serial 0/0/0
R1(config-if)# description WAN - Liaison vers ISP
R1(config-if)# ip address 10.0.0.1 255.255.255.252
R1(config-if)# clock rate 64000
R1(config-if)# no shutdown
R1(config-if)# exit
```

:::info clock rate
`clock rate` est uniquement necessaire sur le routeur qui joue le role DCE (Data Circuit-terminating Equipment) sur une liaison serial. Le routeur DTE n'en a pas besoin.
:::

### Verifier l'etat des interfaces

```bash title="Résumé de toutes les interfaces"
R1# show ip interface brief
```

| Colonne | Description |
|---|---|
| `up` / `up` | Interface active (physique + protocole) |
| `up` / `down` | Probleme de protocole (encapsulation, clock rate) |
| `down` / `down` | Interface desactivee ou cable absent |
| `administratively down` | Desactivee avec `shutdown` |

---

## 6. Configuration SSH

```bash title="Activer SSH v2 sur le routeur"
R1(config)# ip domain-name m7schools.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2
R1(config)# ip ssh time-out 60
R1(config)# ip ssh authentication-retries 3
```

```bash title="Configurer les lignes VTY pour SSH uniquement"
R1(config)# username admin secret admin123
R1(config)# line vty 0 4
R1(config-line)# transport input ssh
R1(config-line)# login local
R1(config-line)# exec-timeout 10 0
R1(config-line)# exit
```

:::tip Difference Switch / Routeur
Sur un switch : `line vty 0 15` (16 sessions). Sur un routeur : `line vty 0 4` (5 sessions) est souvent suffisant.
:::

---

## 7. Route par defaut

```bash title="Configurer une route par défaut vers Internet"
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.2
```

:::info
`0.0.0.0 0.0.0.0` signifie "tous les reseaux non connus". Le trafic sans route specifique sera envoye vers `10.0.0.2` (next-hop).
:::

---

## 8. Sauvegarde de la configuration

```bash title="Sauvegarder la running-config"
R1# copy running-config startup-config
```

---

## 9. Verification

| Commande | Description |
|---|---|
| `show running-config` | Configuration active en RAM |
| `show startup-config` | Configuration sauvegardee en NVRAM |
| `show ip interface brief` | Resume etat et IP de toutes les interfaces |
| `show interfaces gigabitethernet 0/0` | Details d'une interface specifique |
| `show ip route` | Table de routage |
| `show version` | Version IOS, RAM, Flash, uptime |
| `show users` | Sessions actives |
| `show ssh` | Sessions SSH actives |

---

## 10. Configuration complete — Exemple

```bash title="Configuration complète d'un routeur de base"
Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# enable secret cisco123
R1(config)# service password-encryption
R1(config)# banner motd # Acces autorise uniquement #
R1(config)# line console 0
R1(config-line)# password console123
R1(config-line)# login
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
R1(config)# interface gigabitethernet 0/0
R1(config-if)# description LAN - Reseau interne
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface serial 0/0/0
R1(config-if)# description WAN - Liaison vers ISP
R1(config-if)# ip address 10.0.0.1 255.255.255.252
R1(config-if)# clock rate 64000
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.2
R1(config)# ip domain-name m7schools.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2
R1(config)# username admin secret admin123
R1(config)# line vty 0 4
R1(config-line)# transport input ssh
R1(config-line)# login local
R1(config-line)# exec-timeout 10 0
R1(config-line)# exit
R1(config)# end
R1# copy running-config startup-config
```