---
id: gestion-reseau
title: Gestion du Réseau
sidebar_label: Gestion du Réseau
---

> Surveiller, maintenir et administrer les equipements Cisco : decouverte des voisins, synchronisation de l'heure, gestion des fichiers et sauvegarde des configurations.

## 1. CDP (Cisco Discovery Protocol)

CDP est un protocole proprietaire Cisco qui permet de decouvrir automatiquement les equipements Cisco directement connectes, independamment du protocole de couche 3.

### Activer / Desactiver CDP

```bash title="Activer CDP globalement"
Switch(config)# cdp run
```

```bash title="Désactiver CDP globalement"
Switch(config)# no cdp run
```

```bash title="Activer / Désactiver CDP sur une interface"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# cdp enable
Switch(config-if)# exit

Switch(config)# interface fastethernet 0/1
Switch(config-if)# no cdp enable
Switch(config-if)# exit
```

### Configurer les timers CDP

```bash title="Modifier les timers CDP"
Switch(config)# cdp timer 30
Switch(config)# cdp holdtime 120
```

| Parametre | Defaut | Description |
|---|---|---|
| `cdp timer` | 60 sec | Intervalle d'envoi des annonces CDP |
| `cdp holdtime` | 180 sec | Duree de retention des informations d'un voisin |

### Verification CDP

```bash title="Vérifier les voisins CDP"
Switch# show cdp neighbors
Switch# show cdp neighbors detail
Switch# show cdp neighbors interface fastethernet 0/1
Switch# show cdp
Switch# show cdp traffic
```

:::warning Securite CDP
CDP envoie des informations sur le modele, la version IOS et les adresses IP des equipements. Desactiver CDP sur toutes les interfaces connectees a des reseaux non fiables (Internet, partenaires) :
```
Switch(config-if)# no cdp enable
```
:::

---

## 2. LLDP (Link Layer Discovery Protocol)

LLDP est le standard IEEE 802.1AB equivalent a CDP, compatible avec tous les constructeurs.

### Activer / Desactiver LLDP

```bash title="Activer LLDP globalement"
Switch(config)# lldp run
```

```bash title="Désactiver LLDP globalement"
Switch(config)# no lldp run
```

```bash title="Contrôler LLDP par interface"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# lldp transmit
Switch(config-if)# lldp receive
Switch(config-if)# exit

Switch(config)# interface fastethernet 0/1
Switch(config-if)# no lldp transmit
Switch(config-if)# no lldp receive
Switch(config-if)# exit
```

### Configurer les timers LLDP

```bash title="Modifier les timers LLDP"
Switch(config)# lldp timer 60
Switch(config)# lldp holdtime 180
```

| Parametre | Defaut | Description |
|---|---|---|
| `lldp timer` | 30 sec | Intervalle d'envoi des annonces LLDP |
| `lldp holdtime` | 120 sec | Duree de retention des informations d'un voisin |

### Verification LLDP

```bash title="Vérifier les voisins LLDP"
Switch# show lldp neighbors
Switch# show lldp neighbors detail
Switch# show lldp
```

### Comparaison CDP vs LLDP

| Critere | CDP | LLDP |
|---|---|---|
| Standard | Cisco proprietaire | IEEE 802.1AB (ouvert) |
| Compatibilite | Cisco uniquement | Tous constructeurs |
| Activation par defaut | Oui (Cisco) | Non (sur Cisco) |
| Granularite | Global + interface | Global + transmit/receive |

---

## 3. Synchronisation de l'heure

Une heure correcte est indispensable pour les journaux (syslog), les certificats SSL, les logs d'audit et le debogage.

### Configuration manuelle de l'heure

```bash title="Configurer l'heure manuellement"
Switch# clock set 14:30:00 21 March 2026
```

Format : `clock set HH:MM:SS DD MONTH YYYY`

```bash title="Exemples"
Switch# clock set 09:00:00 01 September 2025
Switch# clock set 18:45:00 15 January 2026
```

```bash title="Vérifier l'heure système"
Switch# show clock
Switch# show clock detail
```

### Fuseau horaire

```bash title="Configurer le fuseau horaire"
Switch(config)# clock timezone CET 1
Switch(config)# clock summer-time CEST recurring last Sun Mar 2:00 last Sun Oct 3:00
```

---

## 4. NTP (Network Time Protocol)

NTP synchronise automatiquement l'heure de tous les equipements du reseau avec un serveur de reference.

```bash title="Configurer un serveur NTP"
Switch(config)# ntp server 192.168.1.1
```

```bash title="Configurer plusieurs serveurs NTP avec préférence"
Switch(config)# ntp server 192.168.1.1 prefer
Switch(config)# ntp server 192.168.1.2
Switch(config)# ntp server 192.168.1.3
```

```bash title="Configurer le fuseau horaire avec NTP"
Switch(config)# clock timezone CET 1
Switch(config)# ntp server 192.168.1.1 prefer
```

```bash title="Vérifier la synchronisation NTP"
Switch# show ntp status
Switch# show ntp associations
```

### Lecture de `show ntp associations`

```
  address         ref clock       st   when   poll reach  delay  offset   disp
*~192.168.1.1     .GPS.            1     45     64   377   1.234   0.512  0.125
```

| Symbole | Description |
|---|---|
| `*` | Serveur NTP selectionne (reference principale) |
| `~` | Serveur configure en unicast |
| `st` | Stratum (1 = reference GPS/atomique, 2 = sync avec stratum 1...) |
| `reach` | 377 = synchronise correctement (octal) |

:::info Stratum
NTP utilise une hierarchie appelee stratum :
- **Stratum 1** : source primaire (GPS, horloge atomique)
- **Stratum 2** : synchronise sur un stratum 1
- **Stratum 3** : synchronise sur un stratum 2, etc.
:::

---

## 5. Gestion du systeme de fichiers

### Afficher l'espace disque

```bash title="Explorer le système de fichiers"
Switch# show file systems
Switch# show flash0:
Switch# dir flash0:
Switch# dir nvram:
Switch# pwd
```

```bash title="Afficher le contenu d'un fichier"
Switch# more flash0:startup-config.txt
```

---

## 6. Sauvegarde de la configuration

### Sauvegarder sur TFTP

```bash title="Sauvegarder la running-config sur TFTP"
Router# copy running-config tftp:
Address or name of remote host []? 192.168.1.100
Destination filename [Router-confg]? backup-running-config.txt
```

```bash title="Sauvegarder la startup-config sur TFTP"
Router# copy startup-config tftp:
Address or name of remote host []? 192.168.1.100
Destination filename [Router-confg]? backup-startup-config.txt
```

### Sauvegarder sur USB

```bash title="Sauvegarder sur clé USB"
Switch# copy running-config usbflash0:
Switch# copy startup-config usbflash0:
```

---

## 7. Restauration de la configuration

### Restaurer depuis TFTP

```bash title="Restaurer la running-config depuis TFTP"
Switch# copy tftp: running-config
Address or name of remote host []? 192.168.1.100
Source filename []? backup-running-config.txt
```

```bash title="Sauvegarder après restauration"
Switch# copy running-config startup-config
```

### Restaurer depuis USB

```bash title="Restaurer depuis clé USB"
Switch# copy usbflash0:/backup-running-config.txt running-config
Switch# copy usbflash0:/backup-startup-config.txt startup-config
```

---

## 8. Sauvegarde et restauration des images IOS

### Sauvegarder l'image IOS

```bash title="Sauvegarder l'image IOS sur TFTP"
Switch# copy flash0:/c2960-lanbase-mz.150-2.SE11.bin tftp://192.168.1.100/c2960-backup.bin
```

```bash title="Sauvegarder l'image IOS sur USB"
Switch# copy flash0:/c2960-lanbase-mz.150-2.SE11.bin usbflash0:/c2960-backup.bin
```

### Restaurer l'image IOS

```bash title="Restaurer l'image IOS depuis TFTP"
Switch# copy tftp: flash0:
Address or name of remote host []? 192.168.1.100
Source filename []? c2960-backup.bin
Destination filename []? c2960-lanbase-mz.150-2.SE11.bin
```

```bash title="Restaurer l'image IOS depuis USB"
Switch# copy usbflash0:/c2960-backup.bin flash0:/c2960-lanbase-mz.150-2.SE11.bin
```

---

## 9. Configuration du boot system

```bash title="Configurer la séquence de boot avec fallback"
Switch(config)# boot system flash0:c2960-lanbase-mz.150-2.SE11.bin
Switch(config)# boot system flash0:c2960-backup.bin
Switch(config)# boot system flash0:
```

```bash title="Vérifier la configuration de boot"
Switch# show boot
Switch# show version
Switch# reload
```

:::tip
Configurer toujours une image de secours dans la sequence de boot — si l'image principale est corrompue, le switch basculera automatiquement sur l'image de backup.
:::

---

## 10. Verification globale

| Commande | Description |
|---|---|
| `show cdp neighbors` | Voisins CDP detectes |
| `show cdp neighbors detail` | Details des voisins CDP |
| `show lldp neighbors` | Voisins LLDP detectes |
| `show clock` | Heure systeme actuelle |
| `show ntp status` | Etat de la synchronisation NTP |
| `show ntp associations` | Serveurs NTP et leur etat |
| `show file systems` | Systemes de fichiers disponibles |
| `dir flash0:` | Contenu de la memoire flash |
| `show version` | Version IOS, RAM, Flash, uptime |
| `show boot` | Sequence de demarrage configuree |
