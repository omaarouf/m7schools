---
id: switch
title: Configuration de Base — Switch
sidebar_label: Configuration de Base — Switch
---

> Maitriser la configuration initiale d'un switch Cisco : securisation des acces, gestion a distance, et interface de management.

## 1. Acces aux modes de configuration

Un switch Cisco dispose de plusieurs modes d'acces en ligne de commande.

```
Switch>                  ← Mode utilisateur (EXEC utilisateur)
Switch> enable
Switch#                  ← Mode privilegié (EXEC privilégié)
Switch# configure terminal
Switch(config)#          ← Mode de configuration globale
Switch(config)# interface vlan 1
Switch(config-if)#       ← Mode de configuration d'interface
Switch(config-if)# exit
Switch(config)# exit
Switch# exit
Switch>
```

:::info Raccourcis utiles
- `Ctrl+Z` : retour direct au mode EXEC privilégié depuis n'importe quel sous-mode
- `end` : equivalent de `Ctrl+Z`
- `exit` : remonte d'un seul niveau
:::

---

## 2. Nom d'hote (Hostname)

```bash title="Configurer le nom du switch"
Switch(config)# hostname SW1
SW1(config)#
```

:::tip Bonne pratique
Choisir un nom significatif : `SW-CORE-01`, `SW-ACCESS-02`, etc.
:::

---

## 3. Securisation des mots de passe

### Mot de passe du mode privilégié (enable)

```bash title="Mot de passe enable secret (chiffré)"
SW1(config)# enable secret cisco123
```

:::warning enable secret vs enable password
Toujours utiliser `enable secret` — il chiffre le mot de passe avec MD5. La commande `enable password` stocke le mot de passe en clair.
:::

### Mot de passe de la console

```bash title="Sécurisation de la console"
SW1(config)# line console 0
SW1(config-line)# password console123
SW1(config-line)# login
SW1(config-line)# exec-timeout 5 0
SW1(config-line)# exit
```

### Chiffrement global des mots de passe

```bash title="Chiffrer tous les mots de passe en clair"
SW1(config)# service password-encryption
```

---

## 4. Banniere de connexion (Banner MOTD)

```bash title="Message affiché à la connexion"
SW1(config)# banner motd # Acces autorise uniquement. Toute connexion non autorisee sera poursuivie. #
```

:::danger Important
La banniere doit avertir les utilisateurs non autorises — elle a une valeur juridique.
:::

---

## 5. Interface de management (SVI VLAN 1)

Le switch est accessible a distance via une interface virtuelle (SVI).

```bash title="Configurer l'IP de management"
SW1(config)# interface vlan 1
SW1(config-if)# ip address 192.168.1.10 255.255.255.0
SW1(config-if)# no shutdown
SW1(config-if)# exit
SW1(config)# ip default-gateway 192.168.1.1
```

:::info
`ip default-gateway` est obligatoire sur un switch Layer 2 pour que le trafic de management puisse sortir du reseau local.
:::

---

## 6. Configuration SSH

SSH remplace Telnet (non chiffre) pour l'acces a distance securise.

```bash title="Activer SSH v2 sur le switch"
SW1(config)# ip domain-name m7schools.local
SW1(config)# crypto key generate rsa modulus 2048
SW1(config)# ip ssh version 2
SW1(config)# ip ssh time-out 60
SW1(config)# ip ssh authentication-retries 3
```

```bash title="Configurer les lignes VTY pour SSH uniquement"
SW1(config)# username admin secret admin123
SW1(config)# line vty 0 15
SW1(config-line)# transport input ssh
SW1(config-line)# login local
SW1(config-line)# exec-timeout 10 0
SW1(config-line)# exit
```

:::warning Telnet desactive
`transport input ssh` bloque Telnet. Ne jamais utiliser `transport input all` en production.
:::

---

## 7. Sauvegarde de la configuration

```bash title="Sauvegarder la running-config en startup-config"
SW1# copy running-config startup-config
```

Ou version courte :

```bash
SW1# wr
```

:::tip
Toujours sauvegarder apres chaque modification importante. La `running-config` est en RAM — elle est perdue au redemarrage si non sauvegardee.
:::

---

## 8. Verification

| Commande | Description |
|---|---|
| `show running-config` | Affiche la configuration active |
| `show startup-config` | Affiche la configuration sauvegardee |
| `show interfaces vlan 1` | Etat et IP de l'interface de management |
| `show ip interface brief` | Resume de toutes les interfaces |
| `show version` | Version IOS, RAM, Flash |
| `show users` | Sessions actives |
| `show ssh` | Sessions SSH actives |

```bash title="Vérification rapide"
SW1# show ip interface brief
SW1# show running-config
SW1# show version
```

---

## 9. Configuration complete — Exemple

```bash title="Configuration complète d'un switch de base"
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1
SW1(config)# enable secret cisco123
SW1(config)# service password-encryption
SW1(config)# banner motd # Acces autorise uniquement #
SW1(config)# line console 0
SW1(config-line)# password console123
SW1(config-line)# login
SW1(config-line)# exec-timeout 5 0
SW1(config-line)# exit
SW1(config)# interface vlan 1
SW1(config-if)# ip address 192.168.1.10 255.255.255.0
SW1(config-if)# no shutdown
SW1(config-if)# exit
SW1(config)# ip default-gateway 192.168.1.1
SW1(config)# ip domain-name m7schools.local
SW1(config)# crypto key generate rsa modulus 2048
SW1(config)# ip ssh version 2
SW1(config)# username admin secret admin123
SW1(config)# line vty 0 15
SW1(config-line)# transport input ssh
SW1(config-line)# login local
SW1(config-line)# exec-timeout 10 0
SW1(config-line)# exit
SW1(config)# end
SW1# copy running-config startup-config
```