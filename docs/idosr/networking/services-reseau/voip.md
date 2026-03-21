---
id: voip
title: VoIP (CME)
sidebar_label: VoIP (CME)
---

> Configurer Cisco Unified Communications Manager Express (CME) pour deployer la telephonie IP sur un routeur Cisco.

## 1. Principe de CME

Cisco CME (Communications Manager Express) transforme un routeur Cisco en serveur de telephonie IP. Il gere les telephones IP (ePhones) et les extensions (ePhone-DN) directement sur le routeur.

**Architecture CME :**

| Composant | Description |
|---|---|
| **ePhone** | Telephone IP physique enregistre sur CME |
| **ePhone-DN** | Directory Number — extension telephone virtuelle |
| **Telephony-Service** | Service CME configure sur le routeur |
| **SCCP** | Protocole de signalisation entre les telephones et CME |
| **TFTP** | Serveur de fichiers de configuration pour les telephones |

---

## 2. DHCP avec Option 150

Les telephones IP demarrent en demandant leur configuration via DHCP. L'option 150 indique l'adresse du serveur TFTP (CME).

```bash title="Configurer le pool DHCP avec option 150"
Router(config)# ip dhcp excluded-address 192.168.100.1 192.168.100.10
Router(config)# ip dhcp pool VOICE_POOL
Router(dhcp-config)# network 192.168.100.0 255.255.255.0
Router(dhcp-config)# default-router 192.168.100.1
Router(dhcp-config)# option 150 ip 192.168.100.1
Router(dhcp-config)# dns-server 8.8.8.8
Router(dhcp-config)# exit
```

:::info Option 150 vs Option 66
- **Option 150** : specifique Cisco — adresse IP du serveur TFTP (liste d'adresses possible)
- **Option 66** : standard — nom ou adresse du serveur TFTP (une seule valeur)
Les telephones Cisco utilisent l'option 150 en priorite.
:::

---

## 3. Configuration du Telephony-Service

```bash title="Configurer le service CME"
Router(config)# telephony-service
Router(config-telephony)# max-ephones 20
Router(config-telephony)# max-dn 20
Router(config-telephony)# ip source-address 192.168.100.1 port 2000
Router(config-telephony)# auto assign 1 to 20
Router(config-telephony)# exit
```

| Parametre | Description |
|---|---|
| `max-ephones` | Nombre maximum de telephones IP |
| `max-dn` | Nombre maximum d'extensions (Directory Numbers) |
| `ip source-address` | Adresse IP du routeur CME + port SCCP (2000) |
| `auto assign` | Attribution automatique des ePhone-DN aux ePhones |

:::tip max-ephones et max-dn
Configurer `max-dn` >= `max-ephones` — chaque telephone a besoin d'au moins une extension.
:::

---

## 4. Creation des ePhone-DN (Extensions)

Chaque ePhone-DN represente un numero de telephone (extension).

```bash title="Créer les ePhone-DN"
Router(config)# ephone-dn 1
Router(config-ephone-dn)# number 1001
Router(config-ephone-dn)# exit

Router(config)# ephone-dn 2
Router(config-ephone-dn)# number 1002
Router(config-ephone-dn)# exit

Router(config)# ephone-dn 3
Router(config-ephone-dn)# number 1003
Router(config-ephone-dn)# exit
```

### ePhone-DN double ligne

Un ePhone-DN peut avoir deux numeros (ligne principale + secondaire) pour les appels en attente.

```bash title="ePhone-DN double ligne"
Router(config)# ephone-dn 1 dual-line
Router(config-ephone-dn)# number 1001
Router(config-ephone-dn)# exit
```

---

## 5. Creation des ePhones (Telephones physiques)

Chaque ePhone correspond a un telephone IP physique identifie par son adresse MAC.

```bash title="Créer un ePhone avec assignation manuelle"
Router(config)# ephone 1
Router(config-ephone)# mac-address 00A1.2345.6789
Router(config-ephone)# type 7960
Router(config-ephone)# button 1:1
Router(config-ephone)# exit
```

| Parametre | Description |
|---|---|
| `mac-address` | Adresse MAC du telephone IP (format Cisco) |
| `type` | Modele du telephone (7960, 7961, 8945, etc.) |
| `button 1:1` | Bouton 1 du telephone assigne a ePhone-DN 1 |

### Assignation multiple de boutons

```bash title="ePhone avec plusieurs boutons"
Router(config)# ephone 2
Router(config-ephone)# mac-address 00A1.2345.6790
Router(config-ephone)# type 7961
Router(config-ephone)# button 1:2 2:3
Router(config-ephone)# exit
```

:::info button syntax
`button 1:2` signifie : bouton physique 1 du telephone assigne a ePhone-DN 2.
`button 1:2 2:3` : bouton 1 = DN 2, bouton 2 = DN 3.
:::

---

## 6. Attribution automatique vs manuelle

### Attribution automatique

La commande `auto assign` dans telephony-service attribue automatiquement les ePhone-DN aux ePhones qui se connectent.

```bash title="Attribution automatique des DN 1 à 10"
Router(config)# telephony-service
Router(config-telephony)# auto assign 1 to 10
Router(config-telephony)# exit
```

### Attribution manuelle

Sans `auto assign`, chaque ePhone doit etre configure manuellement avec `button`.

:::tip Recommandation
Utiliser l'attribution manuelle pour les telephones de direction ou serveurs, et l'attribution automatique pour les postes standard.
:::

---

## 7. Verification

| Commande | Description |
|---|---|
| `show ephone` | Liste tous les ePhones enregistres |
| `show ephone-dn` | Liste toutes les ePhone-DN |
| `show ephone 1` | Details d'un telephone specifique |
| `show ephone-dn 1` | Details d'une extension specifique |
| `show telephony-service` | Configuration du service CME |
| `show call active voice` | Appels actifs en cours |
| `show voice call summary` | Resume des appels VoIP |

```bash title="Vérifications essentielles"
Router# show ephone
Router# show ephone-dn
Router# show telephony-service
```

### Lecture de `show ephone`

```
ephone-1 Mac:00A1.2345.6789 TCP socket:[1] activeLine:0 REGISTERED
mediaActive:0 offhook:0 ringing:0 reset:0 paging 0 debug:0
IP:192.168.100.11 7960  keepalive 5 max_line 6
button 1: dn 1  number 1001 CH1   IDLE
```

| Champ | Description |
|---|---|
| `REGISTERED` | Telephone correctement enregistre sur CME |
| `IP` | Adresse IP du telephone |
| `keepalive` | Compteur keepalive SCCP |
| `IDLE` | Extension disponible (pas d'appel en cours) |

:::warning UNREGISTERED
Si le telephone affiche `UNREGISTERED`, verifier :
- L'option DHCP 150 pointe vers la bonne adresse
- Le port SCCP 2000 est correct dans `ip source-address`
- L'adresse MAC dans `ephone` correspond au telephone physique
:::
