J'ai suivi la décomposition du test technique en 3 parties, vous trouverez donc 3 parties distinctes décrites ci-dessous.
Il faudra dans un premier temps compléter la partie configuration de l'environnement.

## Paramétrage de l'environnement

### Fichier .env

Renommer le fichier `.env.exemple` en `.env`.
Il faudra copier l'access key que je vous transmettrais par mail à la place de `YOUR_API_KEY`

Pour la base de données MongoDb 2 choix:

- Soit je vous transmets la connection string de la bdd sur mLab que j'ai créé pour l'exercice.
- Soit vous créez votre propre compte et une bdd [mLab](https://mlab.com/) (Ou tout autres hébergements Saas de MongoDb)

Il faudra remplacer `MONGODB_URL` par la connection string par exemple: `user:pwd@ds15044.mlab.com:444/early-birds`

### Docker

Ce n'est pas obligatoire mais j'ai ajouté la configuration nécessaire à l'execution de l'endpoint dans un container docker.
Pour cela il faut, si ce n'est pas déjà le cas, installer docker suivant votre OS et lancer les commandes suivantes :

### `docker-compose build`

Construit l'image du container.

### `docker-compose up`

Lance le container et donc le serveur node.js à l'interieur.

## Import du catalogue produit

### `yarn import:products`

Lance l'import des produits du catalogue, par défaut c'est le fichier csv présent dans le dossier `statics` qui servira de source de données.

Cet import n'est pas générique il se base sur les champs présents dans le csv initial, il ne faut donc pas changer le format.

## Import des couleurs dominantes

### `yarn fetch:colors`

Interroge l'api google vision sur les produits ne possèdant pas encore de propriété `dominantColor` en bdd.
Une validation vous affiche le nombre de produits sur le point d'être interrogé avec l'api google.

Suite à des erreurs de la part de l'api google vision avec un trop grand nombre d'appels concurrents, j'ai limité à 10 ce nombre.

Une fois la couleur dominante trouvée, elle est rajouté et sauvegardé dans un champ du produit en bdd.

## Mise en place du serveur node.js

### `yarn start` ou `docker-compose up`

En local sans utiliser docker ou bien avec docker, il faut lancer l'une ou l'autre de ces commandes pour démarrer le serveur node.js

### `/api/products/similar/:productId`

Cette endpoint renvoie par défaut les 10 premiers produits dont la couleur est la plus proche de la couleur du productId donné.

Il est possible de changer la limit en rajoutant un query param `limit` par exemple :
`http://localhost:3000/api/products/similar/5c93c0639678db255d95a9b9?limit=10`

### `/api/products`

Renvoie tous les produits en bdd, pour ne pas avoir à se connecter en bdd pour chercher un productId ;)
