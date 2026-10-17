# Kyara Albums

Un classeur en ligne pour suivre sa collection [Kyara](https://kyara.games) album par album.

- Les 1 155 albums (un par univers) et leurs 6 736 cartes
- Cases à cocher pour chaque carte, enregistrées dans ton navigateur
- Tri par cartes manquantes, taille de l'album, % complété ou nom
- Filtres par état de l'album, par rareté, et « cartes manquantes seulement »
- Recherche par album ou par personnage
- Import de ta collection Kyara en un clic

## Importer sa collection

**Méthode conseillée : le favori « Exporter Kyara »**

1. Affiche la barre de favoris (`Ctrl+Maj+B`, ou `Cmd+Maj+B` sur Mac).
2. Sur la page Kyara Albums, glisse le bouton « Exporter Kyara » dans la barre de favoris.
3. Va sur [kyara.games](https://kyara.games) en étant connecté et clique sur ce favori.
   Un fichier `kyara-collection.json` est téléchargé.
4. Dans Kyara Albums, clique sur « Choisir le fichier… » et sélectionne-le.

**Autre méthode : la console du navigateur.** La page indique le raccourci de chaque
navigateur (Chrome, Edge, Firefox, Safari…) et la ligne à coller.

Le favori comme la ligne de console lisent seulement ta collection sur kyara.games
avec ta propre connexion et l'enregistrent dans un fichier. Rien n'est envoyé ailleurs
et ton compte n'est pas modifié. Sur téléphone, fais l'export depuis un ordinateur.

## Mettre le site en ligne avec GitHub Pages

1. Crée un dépôt sur GitHub et envoie-y le contenu de ce dossier.
2. Dans le dépôt : **Settings → Pages → Build and deployment**,
   source « Deploy from a branch », branche `main`, dossier `/ (root)`.
3. Le site est disponible quelques minutes plus tard à
   `https://<ton-pseudo>.github.io/<nom-du-depot>/`.

## Mise à jour du catalogue

Le workflow `.github/workflows/update-catalog.yml` récupère chaque jour le catalogue
public de Kyara et met à jour `data/catalog.js` quand de nouvelles cartes apparaissent.
Tu peux aussi le lancer à la main depuis l'onglet **Actions** (« Run workflow »).

En local :

```bash
python3 tools/update_catalog.py
```

## Organisation

```
index.html               la page
css/style.css            les styles
js/app.js                la logique (albums, tri, filtres, import)
data/catalog.js          le catalogue des cartes (généré)
tools/update_catalog.py  script de mise à jour du catalogue
favicon.svg              l'icône
```

Projet de fan, non affilié à Kyara.
