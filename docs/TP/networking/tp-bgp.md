---
id: tp-bgp
title: TP - BGP
---

# TP - BGP

4 travaux pratiques progressifs, du plus simple au plus complexe.

---

## TP n°1 - Session eBGP de Base (Facile-Moyen)

**Objectif :** Configurer une session eBGP entre deux routeurs d AS differents.

**Topologie :**
```
[R1: AS 65001] == 10.0.0.0/30 == [R2: AS 65002]
R1: 10.0.0.1, R2: 10.0.0.2
```

---

**1. Configurer BGP sur R1 (AS 65001) avec le voisin R2.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router bgp 65001
R1(config-router)# neighbor 10.0.0.2 remote-as 65002
R1(config-router)# network 192.168.1.0 mask 255.255.255.0
R1(config-router)# exit
```

</details>

---

**2. Configurer BGP sur R2 (AS 65002) avec le voisin R1.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# router bgp 65002
R2(config-router)# neighbor 10.0.0.1 remote-as 65001
R2(config-router)# network 192.168.2.0 mask 255.255.255.0
R2(config-router)# exit
```

</details>

---

**3. Verifier l etat des sessions BGP.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip bgp summary
```

Un nombre dans la colonne `State/PfxRcd` indique que la session est etablie. Un mot (`Active`, `Idle`) indique un probleme.

</details>

---

**4. Afficher la table BGP complete.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip bgp
```

</details>

---

## TP n°2 - Session iBGP avec Loopback (Moyen)

**Objectif :** Configurer une session iBGP stable entre deux routeurs du meme AS via des loopbacks.

**Contexte :** R1 et R2 sont dans l AS 65001.
- Loopback R1 : `1.1.1.1/32`
- Loopback R2 : `2.2.2.2/32`

---

**1. S assurer que les loopbacks sont accessibles via un IGP (ex: route statique ou OSPF).**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# ip route 2.2.2.2 255.255.255.255 10.0.0.2
R2(config)# ip route 1.1.1.1 255.255.255.255 10.0.0.1
```

</details>

---

**2. Configurer la session iBGP sur R1 avec la loopback comme source.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router bgp 65001
R1(config-router)# neighbor 2.2.2.2 remote-as 65001
R1(config-router)# neighbor 2.2.2.2 update-source loopback 0
R1(config-router)# exit
```

</details>

---

**3. Configurer la session iBGP sur R2.**

<details>
<summary>Voir la reponse</summary>

```
R2(config)# router bgp 65001
R2(config-router)# neighbor 1.1.1.1 remote-as 65001
R2(config-router)# neighbor 1.1.1.1 update-source loopback 0
R2(config-router)# exit
```

</details>

---

## TP n°3 - Annonce de Reseaux et Route par Defaut (Moyen)

**Objectif :** Annoncer des reseaux et distribuer la route par defaut via BGP.

---

**1. Annoncer deux reseaux dans BGP : 198.51.100.0/24 et 203.0.113.0/24.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router bgp 65001
R1(config-router)# network 198.51.100.0 mask 255.255.255.0
R1(config-router)# network 203.0.113.0 mask 255.255.255.0
R1(config-router)# exit
```

Note : ces reseaux doivent exister dans la table de routage avant d etre annonces.

</details>

---

**2. Annoncer la route par defaut au voisin 10.0.0.2.**

<details>
<summary>Voir la reponse</summary>

```
R1(config)# router bgp 65001
R1(config-router)# neighbor 10.0.0.2 default-originate
R1(config-router)# exit
```

</details>

---

**3. Afficher les routes annoncees au voisin et les routes recues.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip bgp neighbors 10.0.0.2 advertised-routes
R1# show ip bgp neighbors 10.0.0.2 received-routes
```

</details>

---

## TP n°4 - Diagnostic BGP Complet (Difficile)

**Objectif :** Diagnostiquer et resoudre des problemes de session BGP.

---

**1. Identifier les sessions BGP en etat Active (non etablies).**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip bgp summary
```

Un etat `Active` indique que BGP tente d etablir la session mais echoue. Verifier :
- La connectivite IP (`ping X.X.X.X`)
- Le numero AS du voisin (`remote-as`)
- Les ACL qui bloquent TCP port 179

</details>

---

**2. Afficher les details complets d un voisin BGP.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip bgp neighbors 10.0.0.2
```

</details>

---

**3. Afficher les routes installes via BGP dans la table de routage.**

<details>
<summary>Voir la reponse</summary>

```
R1# show ip route bgp
```

</details>

---

**4. Reinitialiser une session BGP sans relancer le processus complet.**

<details>
<summary>Voir la reponse</summary>

```
R1# clear ip bgp 10.0.0.2 soft
```

`soft` effectue un refresh doux (envoie les mises a jour) sans terminer la session TCP. `clear ip bgp 10.0.0.2` (sans soft) termine et retablit la session.

</details>
