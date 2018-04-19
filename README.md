---
title: "Xat amb Node.js - Informe"
author: [Marc Sànchez]
date: 19/04/2018
subtitle: "Tutor : Lluís Fàbrega"
titlepage: true
titlepage-color: 06386e
titlepage-text-color: FFFFFF
titlepage-rule-height: 4
fontsize: 11px
...

# BCDS XAT - Informe de la feina realitzada

En aquest document s'especifica com s'ha generat la pràctica i quines estratègies s'han seguit per realitzar-la, s'ha investigat sobre el funcionament en concret de nodejs + express + plantilles jade (pub) [3] i la llibreria socket.io [5].

## Llistat d'afegits :

La pràctica disposa de :
- Un xat fet amb la llibreria socket.io de nodejs.
- Un login per comprovar que dos usuaris no tenen el mateix identificador
- un sistema de sales on els usuaris poden connectar-se.
- Una petita base de dades per centralitzar els usuaris i les sales.
- Us de protocols de comunicació

## Eines i Inicialització de les eines :

S'utilitza nodejs amb el módule express tal com indica [la guia de sockets de nodejs](http://socket.io/get-started/chat/)

S'utilitza una base de dades portable sqlite3, molt pràctica per aquest tipus d'aplicacions.

### Instalació els mòduls :

Per realitzar aquesta pràctica s'han utilitzat els següents mòduls de node.js, es mostren les instruccions per poder instal·lar-los:

```node
    npm install --save express@4.15.2
    npm install --save sqlite3
    npm install --save body-parser
    npm install --save jquery # No és del tot necessari
    npm install --save pug # [3] sistema de plantilles
    npm install --save socket.io
```   
## Base de dades

Per poder desar els usuaris, les sales i els estats dels usuaris s'utilitza una base de dades molt simple on s'hi desen els usuaris i les sales. Les sales es generen per defecte i estan posades a ma a dins del codi, s'anomenen "sala 1", "sala 2" i "sala 3".

Els usuaris s'aniran afegint a mesura que es vagin connectant a les sales. La relació és la següent :

```javascript
    sala ------1-----*-----N------ usuari
```     

## Sistema de plantilles

Node i express permeten l'ús de plantilles, en aquest cas les plantilles permeten utiltizar fitxers estàtics com a plantilla no haver de generar cada cop el resultat de l'html, simplement enviant les variables amb els valors adients, el mateix procés de render ja posarà els valors allà on han d'anar. Per fer-ho els formats de plantilla no tenen per que ser en html sinó que han de ser en un format que entengui el procés de render. En aquest cas és Pug.

Intal·lem Pug [3] com a motor de plantilla.

## Protocol de comunicació.

Per utilitzar la llibreria socket.io s'ha dissenyat un protocol molt senzill per afavorir els missatges que arriven a les funcions javascript.

S'ha dissenyat dos tipus de missatges :

### Missatges de connexió i desconnexió d'usuaris.

Serveixen per comunicar a qui escolta quin usuari s'ha connectat o desconnectat a quina sala.

**Format :**  
```javascript
    {"user":"marc","room":"1","connected":true}
```
**On :**

- User fa referència al nickname que s'ha connectat o desconnectat
- room fa referència al identificador de la sala a o es connecta o es desconnecta
- connected fa referència a si es connecta o es desconnecta.

### Missatges de comunicació (xat)

Serveixen per realitzar l'intercanvi de comunicacions entre un usuari i un altre connectats a una mateixa sala de xat.

**Format :**
```javascript
    {"user":"marc","room":"1","msg":"missate de marc a un altre usuari"}
```    
**On :**

- User refereix a qui envia el missatge
- room refereix a la sala de xat on s'està enviant el missatge
- msg és el missatge en sí.

## Sistema de navegació i rutes.

Express porta incorporat un paquet l'ús del qual és crucial per el bon funcionament de les peticions http. El paquet http permet realitzar lectures sobre aquest protocol de comunicació i realitzar processament de peticions o enviament de respostes d'aquest format en funció de la ruta i el tipus de petició que s'ha fet.

En aquest petit programa es llegeixen 3 rutes en concret.

- **"/"** -> Mostra un llistat amb les sales de xat disponibles. (Han de ser introduïdes a la base de dades sqlite)
-  **"/login?id=[1..inf]"** -> Reb el paràmetre id de sala, donat aquest paràmetre demanarà el nom d'usuari per poder accedir a la sala de xat.
- **"/sala"** -> Sala de xat, el client reb els paràmetres mitjançant la plantilla html (en un codi script).

## Estils.

En aquest programa no s'han implementat estils, s'han deixat els estils per defecte que s'han estipulat al tutorial [4].


## Referències :

- [1] -> **[SQL TUTORIAL](http://www.sqlitetutorial.net/sqlite-nodejs)**
- [2] -> **[EXPRESS TEMPLATES](https://expressjs.com/tr/guide/using-template-engines.html)**
- [3] -> **[PUG TEMPLATES](https://pugjs.org)**
- [4] -> **[SOCKET.IO get started](https://socket.io/get-started/chat/)**
- [5] -> **[SOCKET.IO Documentation](https://socket.io/docs/)**
