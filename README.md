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
    


## Referències : 

- **[SQL TUTORIAL](http://www.sqlitetutorial.net/sqlite-nodejs)**

