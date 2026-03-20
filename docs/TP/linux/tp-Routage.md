---
id: tp-Routage
title: TP — Routage sous Linux
sidebar_label: TP Routage
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> **Objectif du TP** : Configurer le forwarding IP, mettre en place du routage statique entre deux reseaux, configurer le NAT, et activer le routage dynamique OSPF avec FRR.

## Environnement

```
Poste A (192.168.1.2)  ──── Reseau A (192.168.1.0/24) ──── eth0 [Routeur] eth1 ──── Reseau B (192.168.3.0/24) ──── Poste B (192.168.3.2)
                                                             192.168.1.1          192.168.3.1
```

| Machine | Role | Interface | IP |
|---|---|---|---|
| `routeur` | Routeur Linux | `eth0` | `192.168.1.1/24` |
| `routeur` | Routeur Linux | `eth1` | `192.168.3.1/24` |
| `poste-a` | Client reseau A | `eth0` | `192.168.1.2/24` |
| `poste-b` | Client reseau B | `eth0` | `192.168.3.2/24` |

---

## Partie 1 — Configuration des adresses IP

**1.1 Configurez l'adresse IP `192.168.1.1/24` sur l'interface `eth0` du routeur.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 192.168.1.1/24
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0

# Verifier
ip addr show eth0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 192.168.1.1/24
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0

# Verifier
ip addr show eth0
```

</TabItem>
</Tabs>

</details>

---

**1.2 Configurez l'adresse IP `192.168.3.1/24` sur l'interface `eth1` du routeur.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nmcli connection modify eth1 ipv4.addresses 192.168.3.1/24
sudo nmcli connection modify eth1 ipv4.method manual
sudo nmcli connection up eth1

# Verifier
ip addr show eth1
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nmcli connection modify eth1 ipv4.addresses 192.168.3.1/24
sudo nmcli connection modify eth1 ipv4.method manual
sudo nmcli connection up eth1

# Verifier
ip addr show eth1
```

</TabItem>
</Tabs>

</details>

---

**1.3 Configurez les adresses IP des postes A et B avec leur passerelle respective.**

<details>
<summary>Voir la reponse</summary>

**Sur Poste A :**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 192.168.1.2/24
sudo nmcli connection modify eth0 ipv4.gateway 192.168.1.1
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 192.168.1.2/24
sudo nmcli connection modify eth0 ipv4.gateway 192.168.1.1
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0
```

</TabItem>
</Tabs>

**Sur Poste B :**

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 192.168.3.2/24
sudo nmcli connection modify eth0 ipv4.gateway 192.168.3.1
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nmcli connection modify eth0 ipv4.addresses 192.168.3.2/24
sudo nmcli connection modify eth0 ipv4.gateway 192.168.3.1
sudo nmcli connection modify eth0 ipv4.method manual
sudo nmcli connection up eth0
```

</TabItem>
</Tabs>

</details>

---

## Partie 2 — Forwarding IP

**2.1 Verifiez l'etat actuel du forwarding IP sur le routeur.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
</Tabs>

:::info Resultat attendu
`0` = forwarding desactive. Le routeur ne transfere pas encore les paquets.
:::

</details>

---

**2.2 Activez le forwarding IP de facon temporaire et verifiez.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
echo 1 > /proc/sys/net/ipv4/ip_forward
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
</Tabs>

:::info Resultat attendu
`1` = forwarding active. Le routeur peut maintenant transferer les paquets.
:::

</details>

---

**2.3 Rendez le forwarding IP permanent.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/sysctl.conf
```

Ajoutez ou decommentez la ligne :

```bash title="/etc/sysctl.conf"
net.ipv4.ip_forward = 1
```

```bash
sudo sysctl -p
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/sysctl.conf
```

Ajoutez ou decommentez la ligne :

```bash title="/etc/sysctl.conf"
net.ipv4.ip_forward = 1
```

```bash
sudo sysctl -p
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
</Tabs>

</details>

---

## Partie 3 — Routage Statique

**3.1 Affichez la table de routage actuelle du routeur.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
ip route show
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
ip route show
```

</TabItem>
</Tabs>

:::info Resultat attendu
Vous devez voir les deux reseaux directement connectes : `192.168.1.0/24` via `eth0` et `192.168.3.0/24` via `eth1`.
:::

</details>

---

**3.2 Testez la communication entre Poste A et Poste B. Que se passe-t-il ?**

<details>
<summary>Voir la reponse</summary>

Depuis Poste A :

```bash
ping -c 4 192.168.3.2
```

:::info Resultat attendu
Le ping **echoue** si le forwarding IP n'est pas active, ou si les routes ne sont pas configurees correctement sur les postes. Avec le forwarding active et les passerelles configurees, le ping doit reussir car le routeur a les deux reseaux directement connectes.
:::

</details>

---

**3.3 Ajoutez une route statique sur Poste A pour atteindre le reseau B via le routeur.**

<details>
<summary>Voir la reponse</summary>

Depuis Poste A :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Ajouter la route vers le reseau B
sudo ip route add 192.168.3.0/24 via 192.168.1.1

# Verifier
ip route show
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Ajouter la route vers le reseau B
sudo ip route add 192.168.3.0/24 via 192.168.1.1

# Verifier
ip route show
```

</TabItem>
</Tabs>

</details>

---

**3.4 Testez a nouveau la communication entre Poste A et Poste B.**

<details>
<summary>Voir la reponse</summary>

```bash
ping -c 4 192.168.3.2
traceroute 192.168.3.2
```

:::info Resultat attendu
Le ping doit reussir. `traceroute` doit afficher le passage par le routeur (`192.168.1.1`) avant d'atteindre Poste B.
:::

</details>

---

**3.5 Supprimez la route ajoutee precedemment et verifiez.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo ip route del 192.168.3.0/24
ip route show
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo ip route del 192.168.3.0/24
ip route show
```

</TabItem>
</Tabs>

</details>

---

**3.6 Rendez la route statique permanente sur Poste A.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

```yaml title="/etc/netplan/00-installer-config.yaml"
network:
  ethernets:
    eth0:
      routes:
        - to: 192.168.3.0/24
          via: 192.168.1.1
```

```bash
sudo netplan apply
ip route show
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/sysconfig/network-scripts/route-eth0
```

```bash title="/etc/sysconfig/network-scripts/route-eth0"
192.168.3.0/24 via 192.168.1.1
```

```bash
sudo systemctl restart NetworkManager
ip route show
```

</TabItem>
</Tabs>

</details>

---

## Partie 4 — NAT et Masquerading

**4.1 Configurez le masquerading sur le routeur pour permettre aux machines du reseau A d'acceder a internet via `eth0`.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Activer le masquerading
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Verifier la regle
sudo iptables -t nat -L POSTROUTING -v

# Rendre permanent
sudo apt install iptables-persistent -y
sudo netfilter-persistent save
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Activer le masquerading
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Verifier la regle
sudo iptables -t nat -L POSTROUTING -v

# Rendre permanent
sudo service iptables save
```

</TabItem>
</Tabs>

</details>

---

**4.2 Configurez une redirection DNAT pour que les connexions SSH entrantes sur le routeur soient redirigees vers Poste A (`192.168.1.2`).**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 22 -j DNAT --to 192.168.1.2

# Verifier
sudo iptables -t nat -L PREROUTING -v
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo iptables -t nat -A PREROUTING -p tcp --dport 22 -j DNAT --to 192.168.1.2

# Verifier
sudo iptables -t nat -L PREROUTING -v
```

</TabItem>
</Tabs>

</details>

---

## Partie 5 — Routage Dynamique OSPF avec FRR

**5.1 Installez FRR sur le routeur.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install frr -y
sudo systemctl start frr
sudo systemctl enable frr
sudo systemctl status frr
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install frr -y
sudo systemctl start frr
sudo systemctl enable frr
sudo systemctl status frr
```

</TabItem>
</Tabs>

</details>

---

**5.2 Activez le demon OSPF dans FRR.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/frr/daemons
```

```bash title="/etc/frr/daemons"
ospfd=yes
```

```bash
sudo systemctl restart frr
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/frr/daemons
```

```bash title="/etc/frr/daemons"
ospfd=yes
```

```bash
sudo systemctl restart frr
```

</TabItem>
</Tabs>

</details>

---

**5.3 Configurez OSPF pour echanger les routes des reseaux A et B via `vtysh`.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo vtysh
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo vtysh
```

</TabItem>
</Tabs>

Dans l'invite `vtysh` :

```
routeur# configure terminal
routeur(config)# router ospf
routeur(config-router)# network 192.168.1.0/24 area 0
routeur(config-router)# network 192.168.3.0/24 area 0
routeur(config-router)# redistribute connected
routeur(config-router)# exit
routeur(config)# exit
routeur# write memory
```

</details>

---

**5.4 Verifiez les routes apprises via OSPF et l'etat des voisins.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo vtysh
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo vtysh
```

</TabItem>
</Tabs>

Dans l'invite `vtysh` :

```
routeur# show ip route
routeur# show ip ospf neighbor
```

:::info Resultat attendu
`show ip route` doit afficher les routes OSPF marquees `O`. `show ip ospf neighbor` doit afficher les voisins en etat `Full`.
:::

</details>

---

## Partie 6 — Diagnostic et verification

**6.1 Tracez le chemin des paquets de Poste A vers Poste B.**

<details>
<summary>Voir la reponse</summary>

```bash
traceroute 192.168.3.2
```

:::info Resultat attendu
```
1  192.168.1.1  (routeur eth0)
2  192.168.3.2  (Poste B)
```
Le paquet passe bien par le routeur avant d'atteindre Poste B.
:::

</details>

---

**6.2 Verifiez la table ARP du routeur.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
ip neigh show
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
ip neigh show
```

</TabItem>
</Tabs>

:::info Resultat attendu
Vous devez voir les entrees ARP pour Poste A (`192.168.1.2`) et Poste B (`192.168.3.2`) avec leurs adresses MAC respectives.
:::

</details>

---

**6.3 Verifiez toutes les interfaces et leurs adresses IP sur le routeur.**

<details>
<summary>Voir la reponse</summary>

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
ip addr show
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
ip addr show
```

</TabItem>
</Tabs>

:::info Resultat attendu
`eth0` doit afficher `192.168.1.1/24` et `eth1` doit afficher `192.168.3.1/24`.
:::

</details>

---

## Recapitulatif des operations effectuees

| Partie | Operation | Commandes cles |
|---|---|---|
| 1 | Configuration IP | `nmcli connection modify` |
| 2 | Forwarding IP | `echo 1 > ip_forward`, `sysctl -p` |
| 3 | Routage statique | `ip route add/del/show` |
| 4 | NAT | `iptables -t nat -A POSTROUTING -j MASQUERADE` |
| 5 | OSPF avec FRR | `ospfd=yes`, `vtysh`, `network X.X.X.X area 0` |
| 6 | Diagnostic | `traceroute`, `ip neigh show`, `ip addr show` |

---

## Pour aller plus loin

- [Cours Routage](/linux/lesson-08) — revoir les notions theoriques
- [Quiz Routage](/quizzes/linux/quizzRoutage) — tester vos connaissances