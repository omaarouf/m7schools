---
id: tp-router
title: TP - Configuration de Base Routeur
---

# TP - Configuration de Base Routeur

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Configuration Initiale (Facile)

**Objectif :** Configurer le nom d hote, les mots de passe et la banniere.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Hostname | `R1` |
| Enable secret | `Router@2025` |
| Mot de passe console | `Console@01` |
| Banniere | `Acces autorise uniquement - R1` |

---

**1. Configurer le nom d hote et le mot de passe mode privilegie.**

<details>
<summary>Voir la reponse</summary>

```
Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# enable secret Router@2025
```

</details>

---

**2. Configurer la console avec mot de passe et timeout 5 minutes.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# line console 0
R1(config-line)# password Console@01
R1(config-line)# login
R1(config-line)# exec-timeout 5 0
R1(config-line)# exit
```

</details>

---

**3. Chiffrer les mots de passe et configurer la banniere.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# service password-encryption
R1(config)# banner motd # Acces autorise uniquement - R1 #
```

</details>

---

## TP n°2 - Configuration des Interfaces (Facile-Moyen)

**Objectif :** Configurer les interfaces LAN et WAN du routeur.

**Contexte :**
| Interface | IP | Description |
|---|---|---|
| GigabitEthernet 0/0 | `192.168.1.1/24` | LAN - Reseau interne |
| Serial 0/0/0 | `10.0.0.1/30` | WAN - Liaison vers ISP (DCE) |

---

**1. Configurer l interface GigabitEthernet 0/0 (LAN).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# description LAN - Reseau interne
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**2. Configurer l interface Serial 0/0/0 en DCE avec clock rate 64000.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface serial 0/0/0
R1(config-if)# description WAN - Liaison vers ISP
R1(config-if)# ip address 10.0.0.1 255.255.255.252
R1(config-if)# clock rate 64000
R1(config-if)# no shutdown
R1(config-if)# exit
```

</details>

---

**3. Verifier l etat des interfaces et leur adresse IP.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip interface brief
```

Les interfaces doivent etre en etat `up/up`.

| Colonne | Signification |
|---|---|
| `up/up` | Interface active |
| `up/down` | Probleme protocole (verifier clock rate) |
| `administratively down` | Interface non activee (`no shutdown` manquant) |

</details>

---

**4. Afficher les details complets de l interface Gi0/0.**

<details>
<summary>Voir la reponse</summary>

```
R1# show interfaces gigabitethernet 0/0
```

</details>

---

## TP n°3 - Route par Defaut et SSH (Moyen)

**Objectif :** Configurer la route par defaut et l acces SSH securise.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Route par defaut (next-hop) | `10.0.0.2` |
| Domaine | `m7schools.local` |
| Utilisateur | `admin` / `Admin@2025` |

---

**1. Configurer une route statique par defaut.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 0.0.0.0 0.0.0.0 10.0.0.2
```

</details>

---

**2. Verifier la table de routage et la route par defaut.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route
```

Chercher la ligne `Gateway of last resort is 10.0.0.2 to network 0.0.0.0` et `S* 0.0.0.0/0 [1/0] via 10.0.0.2`.

</details>

---

**3. Configurer SSH v2 avec une cle RSA de 2048 bits.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip domain-name m7schools.local
R1(config)# crypto key generate rsa modulus 2048
R1(config)# ip ssh version 2
R1(config)# ip ssh time-out 60
R1(config)# ip ssh authentication-retries 3
```

</details>

---

**4. Creer l utilisateur et securiser les lignes VTY pour SSH uniquement.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# username admin secret Admin@2025
R1(config)# line vty 0 4
R1(config-line)# transport input ssh
R1(config-line)# login local
R1(config-line)# exec-timeout 10 0
R1(config-line)# exit
```

</details>

---

## TP n°4 - Commandes de Verification (Moyen)

**Objectif :** Maitriser les commandes de diagnostic d un routeur.

---

**1. Afficher la table de routage complete.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route
```

</details>

---

**2. Afficher uniquement les routes statiques.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route static
```

</details>

---

**3. Afficher les sessions SSH actives.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ssh
```

</details>

---

**4. Depuis un sous-mode de configuration, afficher le resume des interfaces sans quitter le mode.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# do show ip interface brief
```

Le prefixe `do` permet d executer une commande EXEC depuis n importe quel sous-mode de configuration.

</details>

---

**5. Afficher la version IOS et l uptime du routeur.**

<details>
<summary>Voir la reponse</summary>

```
R1# show version
```

</details>

---

## TP n°5 - Configuration Complete Deux Routeurs (Difficile)

**Objectif :** Configurer deux routeurs R1 et R2 interconnectes et tester la connectivite.

**Topologie :**
```
[PC-A: 192.168.1.10]--[R1: Gi0/0: 192.168.1.1 | S0/0/0: 10.0.0.1]---[R2: S0/0/0: 10.0.0.2 | Gi0/0: 192.168.2.1]--[PC-B: 192.168.2.10]
```

---

**1. Configurer R1 complet (hostname, interfaces, route statique vers le LAN de R2).**

<details>
<summary>Voir la reponse</summary>

```
Router> enable
Router# configure terminal
Router(config)# hostname R1
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip address 192.168.1.1 255.255.255.0
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# interface serial 0/0/0
R1(config-if)# ip address 10.0.0.1 255.255.255.252
R1(config-if)# clock rate 64000
R1(config-if)# no shutdown
R1(config-if)# exit
R1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
R1(config)# end
R1# copy running-config startup-config
```

</details>

---

**2. Configurer R2 complet (hostname, interfaces, route statique vers le LAN de R1).**

<details>
<summary>Voir la reponse</summary>

```
Router> enable
Router# configure terminal
Router(config)# hostname R2
R2(config)# interface gigabitethernet 0/0
R2(config-if)# ip address 192.168.2.1 255.255.255.0
R2(config-if)# no shutdown
R2(config-if)# exit
R2(config)# interface serial 0/0/0
R2(config-if)# ip address 10.0.0.2 255.255.255.252
R2(config-if)# no shutdown
R2(config-if)# exit
R2(config)# ip route 192.168.1.0 255.255.255.0 10.0.0.1
R2(config)# end
R2# copy running-config startup-config
```

</details>

---

**3. Tester la connectivite de PC-A (192.168.1.10) vers PC-B (192.168.2.10).**

<details>
<summary>Voir la reponse</summary>

Depuis R1 :
```
R1# ping 192.168.2.1
R1# ping 192.168.2.10 source gigabitethernet 0/0
```

Si le ping reussit, la configuration est correcte. En cas d echec, verifier :
- Les interfaces sont en etat `up/up`
- Les routes statiques sont presentes dans `show ip route`
- Le clock rate est configure sur le DCE

</details>
