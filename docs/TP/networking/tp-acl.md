---
id: tp-acl
title: TP - Access Control Lists (ACL)
---

# TP - Access Control Lists (ACL)

5 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - ACL Standard Numerotee (Facile)

**Objectif :** Creer et appliquer une ACL standard pour filtrer sur l adresse source.

**Contexte :** Bloquer le reseau 192.168.2.0/24 et autoriser tout le reste.

---

**1. Creer l ACL standard numerotee 10.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# access-list 10 deny 192.168.2.0 0.0.0.255
R1(config)# access-list 10 permit any
```

</details>

---

**2. Appliquer l ACL 10 en entree sur Gi0/0.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip access-group 10 in
R1(config-if)# exit
```

</details>

---

**3. Verifier l ACL et ses compteurs de correspondances.**

<details>
<summary>Voir la reponse</summary>

```
R1# show access-lists 10
R1# show ip interface gigabitethernet 0/0
```

</details>

---

## TP n°2 - ACL Etendue Numerotee (Facile-Moyen)

**Objectif :** Filtrer le trafic HTTP et HTTPS en provenance du reseau 10.0.0.0/24.

**Contexte :** Autoriser HTTP/HTTPS de 10.0.0.0/24 vers 192.168.1.0/24, bloquer tout le reste.

---

**1. Creer l ACL etendue 100.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# access-list 100 permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 80
R1(config)# access-list 100 permit tcp 10.0.0.0 0.0.0.255 192.168.1.0 0.0.0.255 eq 443
R1(config)# access-list 100 deny ip any any
```

</details>

---

**2. Appliquer l ACL 100 en entree sur l interface source.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface gigabitethernet 0/0
R1(config-if)# ip access-group 100 in
R1(config-if)# exit
```

Note : Une ACL etendue se place pres de la SOURCE pour bloquer le trafic le plus tot possible.

</details>

---

**3. Verifier l ACL avec les compteurs.**

<details>
<summary>Voir la reponse</summary>

```
R1# show access-lists 100
```

</details>

---

## TP n°3 - ACL Nommee (Moyen)

**Objectif :** Creer des ACL nommees standard et etendue avec modification individuelle des regles.

---

**1. Creer une ACL standard nommee AUTORISER_IT qui autorise 172.16.0.0/16.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip access-list standard AUTORISER_IT
R1(config-std-nacl)# permit 172.16.0.0 0.0.255.255
R1(config-std-nacl)# deny any
R1(config-std-nacl)# exit
```

</details>

---

**2. Creer une ACL etendue nommee FILTRAGE_WEB.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip access-list extended FILTRAGE_WEB
R1(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 any eq 22
R1(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 any eq 80
R1(config-ext-nacl)# permit tcp 10.0.0.0 0.0.0.255 any eq 443
R1(config-ext-nacl)# deny ip any any
R1(config-ext-nacl)# exit
```

</details>

---

**3. Supprimer uniquement la regle autorisant Telnet (port 23) si elle existe.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip access-list extended FILTRAGE_WEB
R1(config-ext-nacl)# no permit tcp 10.0.0.0 0.0.0.255 any eq 23
R1(config-ext-nacl)# exit
```

</details>

---

## TP n°4 - Securiser l Acces VTY (Moyen-Difficile)

**Objectif :** Restreindre l acces SSH aux seuls administrateurs du reseau 192.168.100.0/24.

---

**1. Creer une ACL standard 5 autorisant uniquement le reseau d administration.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# access-list 5 permit 192.168.100.0 0.0.0.255
```

</details>

---

**2. Appliquer l ACL sur les lignes VTY.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# line vty 0 4
R1(config-line)# access-class 5 in
R1(config-line)# exit
```

Note : `access-class` pour les VTY, pas `ip access-group`.

</details>

---

**3. Tester depuis un hote non autorise et verifier le refus.**

<details>
<summary>Voir la reponse</summary>

Tenter une connexion SSH depuis une IP non dans 192.168.100.0/24 - elle doit echouer. Puis verifier les compteurs :
```
R1# show access-lists 5
```

</details>

---

## TP n°5 - Scenario ACL Complet (Difficile)

**Objectif :** Implementer une politique de securite reseau complete.

**Politique :**
- Autoriser HTTP/HTTPS du LAN vers Internet
- Autoriser SSH du reseau d admin (192.168.100.0/24) uniquement
- Bloquer ICMP de tout l Internet vers le LAN
- Tout le reste autorise en sortie

---

**1. Creer l ACL etendue POLITIQUE_SECURITE.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip access-list extended POLITIQUE_SECURITE
R1(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 80
R1(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 443
R1(config-ext-nacl)# permit tcp 192.168.100.0 0.0.0.255 any eq 22
R1(config-ext-nacl)# deny icmp any 192.168.1.0 0.0.0.255
R1(config-ext-nacl)# permit ip any any
R1(config-ext-nacl)# exit
```

</details>

---

**2. Appliquer l ACL en entree sur l interface WAN (trafic entrant d Internet).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# interface serial 0/0/0
R1(config-if)# ip access-group POLITIQUE_SECURITE in
R1(config-if)# exit
```

</details>

---

**3. Verifier les correspondances de chaque regle.**

<details>
<summary>Voir la reponse</summary>

```
R1# show access-lists POLITIQUE_SECURITE
R1# show ip interface serial 0/0/0
```

</details>
