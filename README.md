# BCDS XAT

En aquest document s'especifica com s'ha generat la pràctica i quines estratègies s'han seguit per realitzar-la.

## Llistat d'afegits : 

La pràctica disposa de : 
- Un xat fet amb la llibreria socket.io de nodejs.
- Un log in per comprovar que dos usuaris no tenen el mateix identificador
- un log out per desconnectar-se
- un sistema de sales on els usuaris poden connectar-se. 
- Una petita base de dades per centralitzar els usuaris i les sales.

## Eines i Inicialització de les eines : 

S'utilitza nodejs amb el módule express tal com indica [la guia de sockets de nodejs](http://socket.io/get-started/chat/)

S'utilitza una base de dades portable sqlite3, molt pràctica per aquest tipus d'aplicacions.

### Instalació els mòduls : 

    npm install --save express@4.15.2
    npm install --save sqlite3
    
## Base de dades 

Per poder desar els usuaris, les sales i els estats dels usuaris s'utilitza una base de dades molt simple on s'hi desen els usuaris i les sales. Les sales es generen per defecte i estan posades a ma a dins del codi, s'anomenen "sala 1", "sala 2" i "sala 3". 

Els usuaris s'aniran afegint a mesura que es vagin connectant a les sales. La relació és la següent : 

    sala ------1-----*-----N------ usuari
    
## Sistema de plantilles 

Node i express permeten l'ús de plantilles, en aquest cas les plantilles permeten utiltizar fitxers estàtics com a plantilla no haver de generar cada cop el resultat de l'html, simplement enviant les variables amb els valors adients, el mateix procés de render ja posarà els valors allà on han d'anar. Per fer-ho els formats de plantilla no tenen per que ser en html sinó que han de ser en un format que entengui el procés de render. En aquest cas és Pug. 

Intal·lem Pug [2] com a motor de plantilla. 

    npm install --save pug
    


## Referències : 

- [1] -> **[SQL TUTORIAL](http://www.sqlitetutorial.net/sqlite-nodejs)**
- [2] -> **[EXPRESS TEMPLATES](https://expressjs.com/tr/guide/using-template-engines.html)**
- [3] -> **[PUG TEMPLATES](https://pugjs.org)**
