---
id: port-security
title: Port-Security
sidebar_label: Port-Security
---

> Proteger les ports d'un switch Cisco en limitant et controlant les adresses MAC autorisees a acceder au reseau.

## 1. Principe du Port-Security

Port-Security permet de restreindre l'acces a un port switch en fonction des adresses MAC. Il protege contre :

- Les attaques **MAC flooding** (saturation de la table CAM)
- La connexion d'equipements non autorises
- L'usurpation d'adresse MAC

:::info Prerequis
Port-Security ne fonctionne que sur les ports en mode **access** ou **trunk statique**. Il ne peut pas etre active sur un port en mode dynamique (DTP).
:::

---

## 2. Activer Port-Security

```bash title="Activer Port-Security sur un port"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# exit
```

---

## 3. Nombre maximum d'adresses MAC

Par defaut, un seul port securise autorise 1 adresse MAC. Ce nombre peut etre augmente.

```bash title="Configurer le nombre maximum d'adresses MAC"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport port-security maximum 3
Switch(config-if)# exit
```

:::tip
Configurer le maximum au strict necessaire — autoriser plus d'adresses que necessaire reduit l'efficacite de la securite.
:::

---

## 4. Adresses MAC : statique vs sticky

### Adresse MAC statique

L'adresse MAC est configuree manuellement par l'administrateur.

```bash title="Configurer une adresse MAC statique"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport port-security mac-address 00A1.B2C3.D4E5
Switch(config-if)# exit
```

### Adresse MAC sticky

Le switch apprend dynamiquement les adresses MAC et les sauvegarde dans la configuration courante. Elles persistent apres un redemarrage si la config est sauvegardee.

```bash title="Activer l'apprentissage sticky"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport port-security mac-address sticky
Switch(config-if)# exit
```

### Comparaison

| Critere | Statique | Sticky |
|---|---|---|
| Configuration | Manuelle | Automatique |
| Persistance | Oui (dans config) | Oui (si sauvegarde) |
| Flexibilite | Faible | Elevee |
| Usage | MAC connues a l'avance | Deploiement rapide |

:::tip
La methode **sticky** est recommandee pour un deploiement rapide — le switch apprend les adresses lors de la premiere connexion et les retient.
:::

---

## 5. Modes de violation

Quand une adresse MAC non autorisee est detectee, Port-Security reagit selon le mode de violation configure.

### Mode Protect

Ignore silencieusement les trames en violation — aucun journal, aucune notification.

```bash title="Mode protect"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport port-security violation protect
Switch(config-if)# exit
```

### Mode Restrict

Ignore les trames en violation et enregistre un message syslog — le port reste actif.

```bash title="Mode restrict"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport port-security violation restrict
Switch(config-if)# exit
```

### Mode Shutdown (defaut)

Desactive immediatement le port en etat `err-disabled` et enregistre un message syslog.

```bash title="Mode shutdown (défaut)"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport port-security violation shutdown
Switch(config-if)# exit
```

### Comparaison des modes

| Mode | Trafic bloque | Syslog | Port desactive | Compteur |
|---|---|---|---|---|
| `protect` | Oui | Non | Non | Non |
| `restrict` | Oui | Oui | Non | Oui |
| `shutdown` | Oui | Oui | Oui | Oui |

:::danger Mode shutdown
En production, `shutdown` est le mode le plus securise mais necessite une intervention manuelle pour reactiver le port apres violation.
:::

---

## 6. Reactiver un port err-disabled

Quand un port passe en `err-disabled` suite a une violation, il doit etre reactive manuellement.

```bash title="Réactiver un port err-disabled"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

:::tip Recuperation automatique
Pour une recuperation automatique apres un delai :
```
Switch(config)# errdisable recovery cause psecure-violation
Switch(config)# errdisable recovery interval 300
```
:::

---

## 7. Vieillissement des adresses MAC (Aging)

Le vieillissement permet de liberer automatiquement les adresses MAC apres un certain temps d'inactivite.

```bash title="Configurer le vieillissement"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport port-security aging time 60
Switch(config-if)# switchport port-security aging type inactivity
Switch(config-if)# exit
```

| Type | Description |
|---|---|
| `absolute` | L'adresse expire apres le delai, qu'elle soit active ou non |
| `inactivity` | L'adresse expire uniquement si aucun trafic n'est detecte |

---

## 8. Configuration complete — Exemple

```bash title="Configuration Port-Security complète sur un port"
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security maximum 2
Switch(config-if)# switchport port-security mac-address sticky
Switch(config-if)# switchport port-security violation restrict
Switch(config-if)# switchport port-security aging time 60
Switch(config-if)# switchport port-security aging type inactivity
Switch(config-if)# exit
```

---

## 9. Verification

| Commande | Description |
|---|---|
| `show port-security` | Resume Port-Security sur tous les ports |
| `show port-security interface fa0/1` | Details d'un port specifique |
| `show port-security address` | Adresses MAC apprises et configurees |
| `show interfaces fa0/1 status` | Etat du port (err-disabled) |

```bash title="Vérifications essentielles"
Switch# show port-security
Switch# show port-security interface fastethernet 0/1
Switch# show port-security address
```

### Lecture de `show port-security interface`

```
Port Security              : Enabled
Port Status                : Secure-up
Violation Mode             : Restrict
Aging Time                 : 60 mins
Aging Type                 : Inactivity
Maximum MAC Addresses      : 2
Total MAC Addresses        : 1
Configured MAC Addresses   : 0
Sticky MAC Addresses       : 1
Last Source Address:Vlan   : 00A1.B2C3.D4E5:10
Security Violation Count   : 0
```

| Champ | Description |
|---|---|
| `Port Status` | `Secure-up` (actif) ou `Secure-shutdown` (err-disabled) |
| `Sticky MAC Addresses` | Adresses apprises automatiquement |
| `Security Violation Count` | Nombre de violations detectees |
