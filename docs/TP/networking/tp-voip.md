---
id: tp-voip
title: TP - VoIP (CME)
---

# TP - VoIP (CME)

4 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - DHCP avec Option 150 (Facile)

**Objectif :** Configurer le pool DHCP pour les telephones IP avec l option 150.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Reseau VOIX | `192.168.100.0/24` |
| Exclusions | `192.168.100.1` a `192.168.100.10` |
| Passerelle | `192.168.100.1` |
| Serveur CME (TFTP) | `192.168.100.1` |
| DNS | `8.8.8.8` |

---

**1. Configurer les exclusions DHCP.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip dhcp excluded-address 192.168.100.1 192.168.100.10
```

</details>

---

**2. Creer le pool DHCP VOICE_POOL avec l option 150.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip dhcp pool VOICE_POOL
R1(dhcp-config)# network 192.168.100.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.100.1
R1(dhcp-config)# option 150 ip 192.168.100.1
R1(dhcp-config)# dns-server 8.8.8.8
R1(dhcp-config)# exit
```

</details>

---

**3. Verifier le pool DHCP.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip dhcp pool
```

</details>

---

## TP n°2 - Configuration du Telephony-Service (Facile-Moyen)

**Objectif :** Configurer le service CME pour 10 telephones et 10 extensions.

---

**1. Configurer le telephony-service.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# telephony-service
R1(config-telephony)# max-ephones 10
R1(config-telephony)# max-dn 10
R1(config-telephony)# ip source-address 192.168.100.1 port 2000
R1(config-telephony)# auto assign 1 to 10
R1(config-telephony)# exit
```

</details>

---

**2. Creer les extensions (ePhone-DN) 1 a 3.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ephone-dn 1
R1(config-ephone-dn)# number 1001
R1(config-ephone-dn)# exit

R1(config)# ephone-dn 2
R1(config-ephone-dn)# number 1002
R1(config-ephone-dn)# exit

R1(config)# ephone-dn 3
R1(config-ephone-dn)# number 1003
R1(config-ephone-dn)# exit
```

</details>

---

**3. Verifier les extensions configurees.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ephone-dn
R1# show telephony-service
```

</details>

---

## TP n°3 - Configuration des ePhones (Moyen)

**Objectif :** Assigner manuellement des telephones IP a leurs extensions.

**Contexte :**
| ePhone | MAC | Type | DN |
|---|---|---|---|
| 1 | `00A1.2345.6789` | 7960 | DN 1 (bouton 1) |
| 2 | `00A1.2345.6790` | 7961 | DN 2 (bouton 1), DN 3 (bouton 2) |

---

**1. Configurer l ePhone 1 avec assignation manuelle.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ephone 1
R1(config-ephone)# mac-address 00A1.2345.6789
R1(config-ephone)# type 7960
R1(config-ephone)# button 1:1
R1(config-ephone)# exit
```

</details>

---

**2. Configurer l ePhone 2 avec deux boutons.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ephone 2
R1(config-ephone)# mac-address 00A1.2345.6790
R1(config-ephone)# type 7961
R1(config-ephone)# button 1:2 2:3
R1(config-ephone)# exit
```

</details>

---

**3. Verifier l etat des telephones.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ephone
R1# show ephone 1
```

Un telephone correctement enregistre affiche `REGISTERED`. `UNREGISTERED` indique un probleme (verifier DHCP option 150 et ip source-address).

</details>

---

## TP n°4 - CME Complet avec VLAN Voix (Difficile)

**Objectif :** Configurer un systeme telephonique CME complet avec VLAN voix separe.

**Contexte :**
- VLAN 10 : Donnees (192.168.10.0/24)
- VLAN 150 : Voix (192.168.150.0/24)
- 5 telephones IP, 5 extensions (1001-1005)

---

**1. Configurer les ports access avec VLAN voix sur le switch.**

<details>
<summary>Voir la reponse</summary>

```
SW1(config)# interface range fastethernet 0/1 - 5
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 10
SW1(config-if-range)# switchport voice vlan 150
SW1(config-if-range)# exit
```

</details>

---

**2. Configurer le pool DHCP pour le VLAN voix sur R1.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip dhcp excluded-address 192.168.150.1 192.168.150.10
R1(config)# ip dhcp pool VOIX_POOL
R1(dhcp-config)# network 192.168.150.0 255.255.255.0
R1(dhcp-config)# default-router 192.168.150.1
R1(dhcp-config)# option 150 ip 192.168.150.1
R1(dhcp-config)# exit
```

</details>

---

**3. Configurer CME et creer les 5 extensions.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# telephony-service
R1(config-telephony)# max-ephones 5
R1(config-telephony)# max-dn 5
R1(config-telephony)# ip source-address 192.168.150.1 port 2000
R1(config-telephony)# auto assign 1 to 5
R1(config-telephony)# exit

R1(config)# ephone-dn 1
R1(config-ephone-dn)# number 1001
R1(config-ephone-dn)# exit
R1(config)# ephone-dn 2
R1(config-ephone-dn)# number 1002
R1(config-ephone-dn)# exit
R1(config)# ephone-dn 3
R1(config-ephone-dn)# number 1003
R1(config-ephone-dn)# exit
R1(config)# ephone-dn 4
R1(config-ephone-dn)# number 1004
R1(config-ephone-dn)# exit
R1(config)# ephone-dn 5
R1(config-ephone-dn)# number 1005
R1(config-ephone-dn)# exit
```

</details>

---

**4. Verifier que les telephones sont enregistres et passer un appel test.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ephone
R1# show ephone-dn
R1# show telephony-service
R1# show call active voice
```

</details>
