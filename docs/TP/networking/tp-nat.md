---
id: tp-nat
title: TP - NAT & PAT
---

# TP - NAT & PAT

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - NAT Statique (Facile)

**Objectif :** Configurer NAT statique pour rendre un serveur interne accessible depuis Internet.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Serveur interne | `192.168.1.10` |
| IP publique dediee | `203.0.113.10` |
| Interface LAN | `Gi0/0` |
| Interface WAN | `Serial 0/0/0` |

---

**1. Creer la traduction NAT statique.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip nat inside source static 192.168.1.10 203.0.113.10
```

</details>

---

**2. Marquer les interfaces inside et outside.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip nat inside
R1(config-if)# exit

R1(config)# interface serial 0/0/0
R1(config-if)# ip nat outside
R1(config-if)# exit
```

</details>

---

**3. Verifier la traduction NAT.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip nat translations
R1# show ip nat statistics
```

</details>

---

## TP n°2 - PAT avec Interface (Facile-Moyen)

**Objectif :** Configurer PAT (NAT Overload) pour permettre a tout le LAN d acceder a Internet.

**Contexte :** LAN `192.168.1.0/24`, interface WAN Serial 0/0/0 avec IP dynamique.

---

**1. Creer l ACL 1 qui identifie les hotes internes a traduire.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
```

</details>

---

**2. Configurer PAT avec l IP de l interface WAN.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip nat inside source list 1 interface serial 0/0/0 overload
```

</details>

---

**3. Marquer les interfaces.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip nat inside
R1(config-if)# exit

R1(config)# interface serial 0/0/0
R1(config-if)# ip nat outside
R1(config-if)# exit
```

</details>

---

**4. Generer du trafic et observer les traductions PAT.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip nat translations
```

Les entrees PAT ont des numeros de ports : `tcp 203.0.113.1:1025 192.168.1.10:1025`.

</details>

---

## TP n°3 - NAT Dynamique avec Pool (Moyen)

**Objectif :** Configurer NAT dynamique avec un pool de 5 adresses publiques.

**Contexte :**
| Parametre | Valeur |
|---|---|
| Plage interne | `192.168.1.0/24` |
| Pool public | `203.0.113.1` a `203.0.113.5` |

---

**1. Creer l ACL 2 pour identifier les hotes internes.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# access-list 2 permit 192.168.1.0 0.0.0.255
```

</details>

---

**2. Creer le pool PUBLIC_POOL.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip nat pool PUBLIC_POOL 203.0.113.1 203.0.113.5 netmask 255.255.255.0
```

</details>

---

**3. Lier l ACL au pool (sans PAT).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip nat inside source list 2 pool PUBLIC_POOL
```

</details>

---

**4. Effacer les traductions dynamiques actives.**

<details>
<summary>Voir la reponse</summary>

```
R1# clear ip nat translation *
```

Utile pour tester ou apres un changement de configuration. Les traductions statiques ne sont pas affectees.

</details>

---

## TP n°4 - Combinaison NAT Statique + PAT (Moyen-Difficile)

**Objectif :** Combiner NAT statique pour le serveur web et PAT pour les utilisateurs.

**Contexte :**
- Serveur web interne `192.168.1.5` -> IP publique fixe `203.0.113.100`
- Tout le LAN `192.168.1.0/24` -> PAT via `Serial 0/0/0`

---

**1. Configurer la traduction NAT statique pour le serveur web.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip nat inside source static 192.168.1.5 203.0.113.100
```

</details>

---

**2. Configurer PAT pour le reste du LAN.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# access-list 1 permit 192.168.1.0 0.0.0.255
R1(config)# ip nat inside source list 1 interface serial 0/0/0 overload
```

</details>

---

**3. Marquer les interfaces et verifier.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip nat inside
R1(config-if)# exit
R1(config)# interface serial 0/0/0
R1(config-if)# ip nat outside
R1(config-if)# exit
```

```
R1# show ip nat translations
R1# show ip nat statistics
```

Les traductions statiques (sans port) et PAT (avec port) coexistent dans la table.

</details>

---

## TP n°5 - Scenario NAT Complet (Difficile)

**Objectif :** Concevoir et implementer NAT pour une entreprise avec DMZ.

**Contexte :**
- LAN interne : `172.16.0.0/24` (utilisateurs)
- DMZ : `172.16.1.0/24` (serveurs)
- Serveur web DMZ `172.16.1.10` -> `203.0.113.50` (statique)
- Serveur mail DMZ `172.16.1.20` -> `203.0.113.51` (statique)
- LAN utilisateurs -> PAT via l interface WAN

---

**1. Configurer les traductions statiques pour la DMZ.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip nat inside source static 172.16.1.10 203.0.113.50
R1(config)# ip nat inside source static 172.16.1.20 203.0.113.51
```

</details>

---

**2. Configurer PAT pour les utilisateurs LAN.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# access-list 10 permit 172.16.0.0 0.0.0.255
R1(config)# ip nat inside source list 10 interface serial 0/0/0 overload
```

</details>

---

**3. Marquer toutes les interfaces.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip nat inside
R1(config-if)# exit
R1(config)# interface gigabitethernet 0/1
R1(config-if)# ip nat inside
R1(config-if)# exit
R1(config)# interface serial 0/0/0
R1(config-if)# ip nat outside
R1(config-if)# exit
```

</details>
