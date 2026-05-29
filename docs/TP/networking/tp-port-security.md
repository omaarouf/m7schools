---
id: tp-port-security
title: TP - Port-Security
---

# TP - Port-Security

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Activation de Base (Facile)

**Objectif :** Activer Port-Security sur un port avec les parametres par defaut.

---

**1. Activer Port-Security sur le port Fa0/1.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# exit
```

</details>

---

**2. Verifier l etat de Port-Security sur Fa0/1.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show port-security interface fastethernet 0/1
```

Le statut doit etre `Secure-up` et le mode de violation `Shutdown` (par defaut).

</details>

---

**3. Afficher un resume de Port-Security sur tous les ports.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show port-security
```

</details>

---

## TP n°2 - Adresses MAC Statiques et Sticky (Facile-Moyen)

**Objectif :** Configurer Port-Security avec une adresse MAC statique et l apprentissage sticky.

**Contexte :**
| Port | Type MAC | Maximum |
|---|---|---|
| Fa0/1 | Statique (00A1.B2C3.D4E5) | 1 |
| Fa0/2 | Sticky | 2 |

---

**1. Configurer Fa0/1 avec une adresse MAC statique.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security mac-address 00A1.B2C3.D4E5
Switch(config-if)# exit
```

</details>

---

**2. Configurer Fa0/2 avec apprentissage sticky, maximum 2 adresses.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/2
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security maximum 2
Switch(config-if)# switchport port-security mac-address sticky
Switch(config-if)# exit
```

</details>

---

**3. Afficher les adresses MAC apprises par Port-Security.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show port-security address
```

</details>

---

## TP n°3 - Modes de Violation (Moyen)

**Objectif :** Configurer et tester les trois modes de violation.

---

**1. Configurer le port Fa0/3 en mode violation `restrict`.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/3
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security violation restrict
Switch(config-if)# exit
```

</details>

---

**2. Configurer le port Fa0/4 en mode violation `protect`.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/4
Switch(config-if)# switchport mode access
Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security violation protect
Switch(config-if)# exit
```

</details>

---

**3. Expliquer les differences entre les trois modes.**

<details>
<summary>Voir la reponse</summary>

| Mode | Trafic violation | Syslog | Port desactive |
|---|---|---|---|
| `protect` | Bloque | Non | Non |
| `restrict` | Bloque | Oui | Non |
| `shutdown` | Bloque | Oui | Oui (err-disabled) |

`protect` : le plus silencieux - utile quand on ne veut pas de faux positifs dans les logs.
`restrict` : bon compromis - visible dans les logs sans bloquer le port.
`shutdown` : le plus securise - force une intervention manuelle apres violation.

</details>

---

## TP n°4 - Vieillissement et Recuperation (Moyen-Difficile)

**Objectif :** Configurer le vieillissement des adresses et la recuperation automatique.

---

**1. Configurer le vieillissement `inactivity` de 60 minutes sur Fa0/1.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/1
Switch(config-if)# switchport port-security aging time 60
Switch(config-if)# switchport port-security aging type inactivity
Switch(config-if)# exit
```

</details>

---

**2. Configurer la recuperation automatique apres 300 secondes.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# errdisable recovery cause psecure-violation
Switch(config)# errdisable recovery interval 300
```

</details>

---

**3. Reactiver manuellement un port en etat err-disabled.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface fastethernet 0/1
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
Switch(config-if)# exit
```

</details>

---

## TP n°5 - Configuration Production Complete (Difficile)

**Objectif :** Configurer Port-Security en production sur tous les ports access.

**Contexte :** Tous les ports Fa0/1 a Fa0/24 sont des ports access. Maximum 3 adresses MAC par port, sticky, violation restrict, vieillissement 120 min inactivity.

---

**1. Configurer Port-Security sur tous les ports access en une commande.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# interface range fastethernet 0/1 - 24
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport port-security
Switch(config-if-range)# switchport port-security maximum 3
Switch(config-if-range)# switchport port-security mac-address sticky
Switch(config-if-range)# switchport port-security violation restrict
Switch(config-if-range)# switchport port-security aging time 120
Switch(config-if-range)# switchport port-security aging type inactivity
Switch(config-if-range)# exit
```

</details>

---

**2. Configurer la recuperation automatique pour toutes les causes err-disabled.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# errdisable recovery cause psecure-violation
Switch(config)# errdisable recovery interval 300
```

</details>

---

**3. Sauvegarder la configuration (pour persister les adresses sticky).**

<details>
<summary>Voir la reponse</summary>

```
Switch# copy running-config startup-config
```

</details>

---

**4. Verifier la configuration finale.**

<details>
<summary>Voir la reponse</summary>

```
Switch# show port-security
Switch# show port-security address
Switch# show running-config | section port-security
```

</details>
