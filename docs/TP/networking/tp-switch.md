---
id: tp-switch
title: TP - Configuration de Base Switch
---

# TP - Configuration de Base Switch

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Premier Acces et Nom d hote (Facile)

**Objectif :** Acceder au switch et effectuer la configuration initiale de base.

---

**1. Passer du mode utilisateur au mode EXEC privilegie.**

<details>
<summary>Voir la reponse</summary>

```
Switch> enable
Switch#
```

</details>

---

**2. Entrer en mode de configuration globale.**

<details>
<summary>Voir la reponse</summary>

```
Switch# configure terminal
Switch(config)#
```

</details>

---

**3. Configurer le nom d hote du switch en `SW-ACCESS-01`.**

<details>
<summary>Voir la reponse</summary>

```
Switch(config)# hostname SW-ACCESS-01
SW-ACCESS-01(config)#
```

</details>

---

**4. Configurer le message de banniere MOTD : `Acces autorise uniquement.`**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01(config)# banner motd # Acces autorise uniquement. #
```

</details>

---

**5. Sauvegarder la configuration et verifier.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01# copy running-config startup-config
SW-ACCESS-01# show running-config
```

</details>

---

## TP n°2 - Securisation des Acces (Facile-Moyen)

**Objectif :** Securiser l acces au switch avec des mots de passe.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Mot de passe mode privilegie | `Cisco@2025` |
| Mot de passe console | `Console@2025` |
| Timeout console | 5 minutes |

---

**1. Configurer le mot de passe mode privilegie chiffre.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01(config)# enable secret Cisco@2025
```

Note : Utiliser `enable secret` (MD5) et non `enable password` (texte clair).

</details>

---

**2. Configurer et activer le mot de passe de la console.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01(config)# line console 0
SW-ACCESS-01(config-line)# password Console@2025
SW-ACCESS-01(config-line)# login
SW-ACCESS-01(config-line)# exec-timeout 5 0
SW-ACCESS-01(config-line)# exit
```

</details>

---

**3. Chiffrer tous les mots de passe en clair dans la configuration.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01(config)# service password-encryption
```

</details>

---

**4. Verifier que les mots de passe sont bien chiffres dans la running-config.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01# show running-config | include password
```

Le mot de passe doit apparaitre avec un type (7) devant la valeur chiffree.

</details>

---

## TP n°3 - Interface de Management et SSH (Moyen)

**Objectif :** Configurer l acces reseau et SSH pour la gestion a distance.

**Contexte :**
| Parametre | Valeur |
|---|---|
| IP de management | `192.168.1.10/24` |
| Passerelle | `192.168.1.1` |
| Nom de domaine | `m7schools.local` |
| Utilisateur admin | `admin` / `Admin@2025` |

---

**1. Configurer l adresse IP de management sur le VLAN 1.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01(config)# interface vlan 1
SW-ACCESS-01(config-if)# ip address 192.168.1.10 255.255.255.0
SW-ACCESS-01(config-if)# no shutdown
SW-ACCESS-01(config-if)# exit
```

</details>

---

**2. Configurer la passerelle par defaut.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01(config)# ip default-gateway 192.168.1.1
```

</details>

---

**3. Configurer SSH v2 (domaine, cles RSA 2048 bits, version).**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01(config)# ip domain-name m7schools.local
SW-ACCESS-01(config)# crypto key generate rsa modulus 2048
SW-ACCESS-01(config)# ip ssh version 2
SW-ACCESS-01(config)# ip ssh time-out 60
SW-ACCESS-01(config)# ip ssh authentication-retries 3
```

</details>

---

**4. Creer l utilisateur admin et configurer les lignes VTY pour SSH uniquement.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01(config)# username admin secret Admin@2025
SW-ACCESS-01(config)# line vty 0 15
SW-ACCESS-01(config-line)# transport input ssh
SW-ACCESS-01(config-line)# login local
SW-ACCESS-01(config-line)# exec-timeout 10 0
SW-ACCESS-01(config-line)# exit
```

</details>

---

**5. Verifier l acces SSH et l etat de l interface de management.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01# show ip ssh
SW-ACCESS-01# show interfaces vlan 1
SW-ACCESS-01# show ip interface brief
SW-ACCESS-01# show ssh
```

</details>

---

## TP n°4 - Commandes show et Diagnostic (Moyen)

**Objectif :** Maitriser les commandes de verification et de diagnostic.

---

**1. Afficher un resume de toutes les interfaces avec leur etat et adresse IP.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01# show ip interface brief
```

</details>

---

**2. Afficher la version IOS, la memoire RAM disponible et le temps de fonctionnement.**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01# show version
```

</details>

---

**3. Afficher la configuration en cours d execution (running-config).**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01# show running-config
```

</details>

---

**4. Afficher la configuration sauvegardee (startup-config).**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01# show startup-config
```

</details>

---

**5. Afficher les sessions actives sur le switch (console + VTY).**

<details>
<summary>Voir la reponse</summary>

```
SW-ACCESS-01# show users
```

</details>

---

## TP n°5 - Configuration Complete (Difficile)

**Objectif :** Configurer un switch de production complet de A a Z.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Hostname | `SW-CORE-01` |
| IP management | `10.0.0.2/24` |
| Passerelle | `10.0.0.1` |
| Enable secret | `SuperSecure@2025` |
| Mot de passe console | `ConsolePwd@01` |
| Domaine | `entreprise.local` |
| Utilisateur SSH | `netadmin` / `NetAdmin@2025` |

---

**1. Effectuer toute la configuration de base en une seule sequence.**

<details>
<summary>Voir la reponse</summary>

```
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW-CORE-01
SW-CORE-01(config)# enable secret SuperSecure@2025
SW-CORE-01(config)# service password-encryption
SW-CORE-01(config)# banner motd # Acces autorise uniquement - SW-CORE-01 #
SW-CORE-01(config)# line console 0
SW-CORE-01(config-line)# password ConsolePwd@01
SW-CORE-01(config-line)# login
SW-CORE-01(config-line)# exec-timeout 5 0
SW-CORE-01(config-line)# exit
SW-CORE-01(config)# interface vlan 1
SW-CORE-01(config-if)# ip address 10.0.0.2 255.255.255.0
SW-CORE-01(config-if)# no shutdown
SW-CORE-01(config-if)# exit
SW-CORE-01(config)# ip default-gateway 10.0.0.1
SW-CORE-01(config)# ip domain-name entreprise.local
SW-CORE-01(config)# crypto key generate rsa modulus 2048
SW-CORE-01(config)# ip ssh version 2
SW-CORE-01(config)# username netadmin secret NetAdmin@2025
SW-CORE-01(config)# line vty 0 15
SW-CORE-01(config-line)# transport input ssh
SW-CORE-01(config-line)# login local
SW-CORE-01(config-line)# exec-timeout 10 0
SW-CORE-01(config-line)# exit
SW-CORE-01(config)# end
SW-CORE-01# copy running-config startup-config
```

</details>

---

**2. Verifier que toute la configuration est correcte.**

<details>
<summary>Voir la reponse</summary>

```
SW-CORE-01# show running-config
SW-CORE-01# show ip interface brief
SW-CORE-01# show ip ssh
SW-CORE-01# show version
```

</details>
