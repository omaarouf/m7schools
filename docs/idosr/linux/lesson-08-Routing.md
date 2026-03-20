---
id: lesson-08
title: Routage sous Linux
sidebar_label: Routage sous Linux
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

> **Objectif :** Configurer le routage statique et dynamique sous Linux, activer le forwarding IP, et utiliser FRR pour les protocoles de routage dynamique (OSPF, RIP).

---

## 1. Presentation

Le routage IP est le principe de transmission qui permet a deux ordinateurs places sur des reseaux differents de communiquer entre eux. Un routeur est une machine specialisee dans le transfert des paquets IPv4 entre des interfaces connectant des reseaux distincts.

| Type | Outil | Description |
|---|---|---|
| **Statique** | `ip route` | Routes ajoutees manuellement dans la table de routage |
| **Dynamique** | `frr` | Demon de routage — OSPF, RIP, BGP |

### 1.1 Fichiers principaux

| Fichier | Role |
|---|---|
| `/proc/sys/net/ipv4/ip_forward` | Forwarding IP temporaire (`0` = desactive, `1` = active) |
| `/etc/sysctl.conf` | Forwarding IP permanent |
| `/etc/frr/daemons` | Activation des protocoles FRR |
| `/etc/frr/frr.conf` | Configuration FRR |

---

## 2. Activer le Forwarding IP

:::danger Forwarding IP obligatoire
Sans `ip_forward = 1`, le serveur Linux **ne routera pas** les paquets entre ses interfaces — il se comportera comme un simple hote, pas un routeur.
:::

### 2.1 Activation temporaire

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Verifier l'etat actuel
cat /proc/sys/net/ipv4/ip_forward

# Activer (perdu au redemarrage)
echo 1 > /proc/sys/net/ipv4/ip_forward

# Verifier
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Verifier l'etat actuel
cat /proc/sys/net/ipv4/ip_forward

# Activer (perdu au redemarrage)
echo 1 > /proc/sys/net/ipv4/ip_forward

# Verifier
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
</Tabs>

### 2.2 Activation permanente

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/sysctl.conf
```

```bash title="/etc/sysctl.conf"
# Decommenter ou ajouter cette ligne
net.ipv4.ip_forward = 1
```

```bash
# Appliquer sans redemarrer
sudo sysctl -p

# Verifier
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo nano /etc/sysctl.conf
```

```bash title="/etc/sysctl.conf"
# Decommenter ou ajouter cette ligne
net.ipv4.ip_forward = 1
```

```bash
# Appliquer sans redemarrer
sudo sysctl -p

# Verifier
cat /proc/sys/net/ipv4/ip_forward
```

</TabItem>
</Tabs>

---

## 3. Routage Statique

### 3.1 Afficher la table de routage

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Methode moderne (recommandee)
ip route show

# Methode classique
route -n
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Methode moderne (recommandee)
ip route show

# Methode classique
route -n
```

</TabItem>
</Tabs>

:::info Lire la table de routage
La commande `route -n` affiche :

| Colonne | Description |
|---|---|
| `Destination` | Reseau de destination |
| `Passerelle` | Adresse IP du routeur suivant (`0.0.0.0` = reseau direct) |
| `Genmask` | Masque de sous-reseau |
| `Iface` | Interface reseau utilisee |
| `UG` | U = route active, G = via une passerelle |
:::

### 3.2 Ajouter et supprimer des routes

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Ajouter une route vers un reseau
sudo ip route add 192.168.1.0/24 via 192.168.1.1

# Ajouter une route par defaut (gateway vers internet)
sudo ip route add default via 192.168.1.1

# Supprimer une route
sudo ip route del 192.168.1.0/24

# Supprimer la route par defaut
sudo ip route del default via 192.168.1.1
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Ajouter une route vers un reseau
sudo ip route add 192.168.1.0/24 via 192.168.1.1

# Ajouter une route par defaut (gateway vers internet)
sudo ip route add default via 192.168.1.1

# Supprimer une route
sudo ip route del 192.168.1.0/24

# Supprimer la route par defaut
sudo ip route del default via 192.168.1.1
```

</TabItem>
</Tabs>

:::tip Route par defaut
La route par defaut (`0.0.0.0/0`) est utilisee pour tous les paquets dont la destination ne correspond a aucune autre route dans la table. C'est en general la route vers internet.
:::

### 3.3 Exemple pratique : relier deux reseaux

**Scenario :** Deux machines sur des reseaux differents communiquent via un routeur Linux.

```
Poste A (192.168.1.2)  ──── Reseau A (192.168.1.0/24) ────┐
                                                             Routeur Linux
Poste B (192.168.3.2)  ──── Reseau B (192.168.3.0/24) ────┘
```

**Sur le routeur**, ajoutez les routes vers les deux reseaux :

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Activer le forwarding IP
echo 1 > /proc/sys/net/ipv4/ip_forward

# Ajouter les routes
sudo ip route add 192.168.1.0/24 via 192.168.1.1
sudo ip route add 192.168.3.0/24 via 192.168.3.1

# Verifier
ip route show
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Activer le forwarding IP
echo 1 > /proc/sys/net/ipv4/ip_forward

# Ajouter les routes
sudo ip route add 192.168.1.0/24 via 192.168.1.1
sudo ip route add 192.168.3.0/24 via 192.168.3.1

# Verifier
ip route show
```

</TabItem>
</Tabs>

### 3.4 Routes statiques permanentes

Les routes ajoutees avec `ip route add` sont **temporaires** — elles disparaissent au redemarrage.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```yaml title="/etc/netplan/00-installer-config.yaml"
network:
  ethernets:
    enp0s3:
      routes:
        - to: 192.168.3.0/24
          via: 192.168.1.1
```

```bash
sudo netplan apply
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash title="/etc/sysconfig/network-scripts/route-enp0s3"
192.168.3.0/24 via 192.168.1.1
```

```bash
sudo systemctl restart NetworkManager
```

</TabItem>
</Tabs>

---

## 4. NAT et Masquerading

Le NAT (Network Address Translation) permet aux machines d'un reseau local d'acceder a internet en utilisant l'adresse IP de la passerelle.

### 4.1 Masquerading (SNAT dynamique)

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Permettre aux machines du reseau local de sortir via eth0
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Rendre permanent
sudo apt install iptables-persistent -y
sudo netfilter-persistent save
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Permettre aux machines du reseau local de sortir via eth0
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Rendre permanent
sudo service iptables save
```

</TabItem>
</Tabs>

### 4.2 DNAT — Redirection de port

Le DNAT (Destination NAT) redirige les connexions entrantes vers une machine interne. Utile pour cacher un serveur derriere une passerelle.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Rediriger toutes les connexions SSH (port 22) vers 192.168.1.12
sudo iptables -t nat -A PREROUTING -p tcp --dport 22 -j DNAT --to 192.168.1.12
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Rediriger toutes les connexions SSH (port 22) vers 192.168.1.12
sudo iptables -t nat -A PREROUTING -p tcp --dport 22 -j DNAT --to 192.168.1.12
```

</TabItem>
</Tabs>

:::info SNAT vs DNAT
- **SNAT / Masquerading** : modifie l'adresse **source** des paquets sortants (reseau local → internet)
- **DNAT** : modifie l'adresse **destination** des paquets entrants (internet → serveur interne)
:::

---

## 5. Routage Dynamique avec FRR

Le routage dynamique permet aux routeurs d'echanger automatiquement leurs tables de routage via des protocoles dedies. FRR (Free Range Routing) est le logiciel de routage dynamique le plus utilise sous Linux. Il remplace Quagga qui n'est plus maintenu.

**Protocoles supportes par FRR :**

| Protocole | Type | Usage |
|---|---|---|
| **OSPF** | Etat de lien | Reseaux d'entreprise, infrastructures hierarchiques |
| **RIP** | Vecteur de distance | Petits reseaux (obsolete en production) |
| **BGP** | Vecteur de chemin | Routage inter-AS, internet |

### 5.1 Installation de FRR

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo apt update
sudo apt install frr -y
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo dnf install frr -y
```

</TabItem>
</Tabs>

### 5.2 Demarrage du service

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo systemctl start frr
sudo systemctl enable frr
sudo systemctl status frr
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
sudo systemctl start frr
sudo systemctl enable frr
sudo systemctl status frr
```

</TabItem>
</Tabs>

---

## 6. OSPF avec FRR

OSPF (Open Shortest Path First) est un protocole de routage a etat de lien, performant et adapte aux infrastructures hierarchiques.

### 6.1 Activer le demon OSPF

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/frr/daemons
```

```bash title="/etc/frr/daemons"
# Changer ospfd=no en :
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
# Changer ospfd=no en :
ospfd=yes
```

```bash
sudo systemctl restart frr
```

</TabItem>
</Tabs>

### 6.2 Configurer OSPF via vtysh

`vtysh` est l'interface en ligne de commande de FRR, similaire aux routeurs Cisco.

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Acceder a l'interface VTY
sudo vtysh
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Acceder a l'interface VTY
sudo vtysh
```

</TabItem>
</Tabs>

Dans l'invite `vtysh`, executez ces commandes :

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

| Commande | Explication |
|---|---|
| `configure terminal` | Entrer en mode configuration |
| `router ospf` | Configurer le protocole OSPF |
| `network X.X.X.X/X area 0` | Reseau sur lequel echanger les routes (zone backbone) |
| `redistribute connected` | Distribuer les reseaux directement connectes |
| `write memory` | Sauvegarder la configuration |

:::info Plusieurs reseaux
Si le routeur doit echanger les informations sur plusieurs reseaux, repetez la commande `network` pour chaque reseau :
```
network 192.168.1.0/24 area 0
network 192.168.3.0/24 area 0
network 10.0.0.0/8 area 0
```
:::

### 6.3 Propager la route par defaut

Pour qu'un routeur Linux propage sa route par defaut vers les autres routeurs OSPF :

```
routeur(config-router)# default-information originate
```

### 6.4 Verifier OSPF

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Entrer dans vtysh
sudo vtysh

# Consulter les routes apprises via OSPF
routeur# show ip route

# Verifier les voisins OSPF
routeur# show ip ospf neighbor
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Entrer dans vtysh
sudo vtysh

# Consulter les routes apprises via OSPF
routeur# show ip route

# Verifier les voisins OSPF
routeur# show ip ospf neighbor
```

</TabItem>
</Tabs>

---

## 7. RIP avec FRR

RIP (Routing Information Protocol) est un protocole a vecteur de distance. Il est en cours de disparition en production en raison de sa lenteur de convergence et sa charge reseau elevee, mais il reste utilise en formation.

### 7.1 Activer le demon RIP

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
sudo nano /etc/frr/daemons
```

```bash title="/etc/frr/daemons"
# Changer ripd=no en :
ripd=yes
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
# Changer ripd=no en :
ripd=yes
```

```bash
sudo systemctl restart frr
```

</TabItem>
</Tabs>

### 7.2 Configurer RIP via vtysh

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

```
routeur# configure terminal
routeur(config)# router rip
routeur(config-router)# network 192.168.1.0/24
routeur(config-router)# network 192.168.3.0/24
routeur(config-router)# redistribute connected
routeur(config-router)# exit
routeur(config)# exit
routeur# write memory
```

### 7.3 Verifier RIP

```bash
sudo vtysh
routeur# show ip rip
```

:::warning RIP en production
RIP est considere comme obsolete pour les infrastructures modernes. Sa convergence est lente (jusqu'a 180 secondes) et il est limite a 15 sauts maximum. Preferez OSPF pour les nouveaux deploiements.
:::

---

## 8. Commandes de Reference

### Routage statique

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Forwarding IP
cat /proc/sys/net/ipv4/ip_forward     # verifier
echo 1 > /proc/sys/net/ipv4/ip_forward  # activer temporairement
sudo sysctl -p                         # appliquer sysctl.conf

# Table de routage
ip route show                          # afficher
ip route add 192.168.X.X/24 via X.X.X.X  # ajouter
ip route del 192.168.X.X/24           # supprimer
ip route add default via X.X.X.X      # route par defaut
route -n                               # affichage classique
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Forwarding IP
cat /proc/sys/net/ipv4/ip_forward     # verifier
echo 1 > /proc/sys/net/ipv4/ip_forward  # activer temporairement
sudo sysctl -p                         # appliquer sysctl.conf

# Table de routage
ip route show                          # afficher
ip route add 192.168.X.X/24 via X.X.X.X  # ajouter
ip route del 192.168.X.X/24           # supprimer
ip route add default via X.X.X.X      # route par defaut
route -n                               # affichage classique
```

</TabItem>
</Tabs>

### FRR

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
# Service
sudo systemctl start|stop|restart|status frr

# Interface VTY
sudo vtysh

# Dans vtysh
show ip route              # table de routage complete
show ip ospf neighbor      # voisins OSPF
show ip rip                # routes RIP
configure terminal         # mode configuration
write memory               # sauvegarder
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
# Service
sudo systemctl start|stop|restart|status frr

# Interface VTY
sudo vtysh

# Dans vtysh
show ip route              # table de routage complete
show ip ospf neighbor      # voisins OSPF
show ip rip                # routes RIP
configure terminal         # mode configuration
write memory               # sauvegarder
```

</TabItem>
</Tabs>

### Diagnostic reseau

<Tabs groupId="linux-distros">
<TabItem value="ubuntu" label="Ubuntu / Debian">

```bash
ping -c 4 192.168.1.1        # tester la connectivite
traceroute 192.168.1.1       # tracer le chemin des paquets
ip neigh show                # table ARP
ip addr show                 # interfaces et adresses IP
```

</TabItem>
<TabItem value="fedora" label="Fedora / Red Hat">

```bash
ping -c 4 192.168.1.1        # tester la connectivite
traceroute 192.168.1.1       # tracer le chemin des paquets
ip neigh show                # table ARP
ip addr show                 # interfaces et adresses IP
```

</TabItem>
</Tabs>

---

## Pour aller plus loin

- [Quiz Routage](/quizzes/linux/quizzRoutage) — tester vos connaissances
- [TP Routage](/tp/linux/tp-routage) — mise en pratique guidee