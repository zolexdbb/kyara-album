# Kyara Albums

Un classeur en ligne pour suivre sa collection [Kyara](https://kyara.games) album par album.

- Les 1 155 albums (un par univers) et leurs 6 736 cartes
- Cases à cocher pour chaque carte, enregistrées dans ton navigateur
- Tri par cartes manquantes, taille de l'album, % complété ou nom
- Filtres par état de l'album, par rareté, et « cartes manquantes seulement »
- Recherche par album ou par personnage
- Import de ta collection Kyara en un clic

## Importer sa collection

1. Va sur [kyara.games](https://kyara.games) en étant connecté.
2. Ouvre la console du navigateur (F12, onglet « Console »).
3. Si Chrome affiche un avertissement sur le collage, tape `allow pasting` puis Entrée.
4. Colle la ligne affichée dans la page (bouton « Copier la ligne ») puis Entrée.
   Un fichier `kyara-collection.json` est téléchargé.
5. Dans Kyara Albums, clique sur « Choisir le fichier… » et sélectionne-le.

La ligne lit seulement ta collection sur kyara.games avec ta propre connexion
et l'enregistre dans un fichier. Elle n'envoie rien ailleurs et ne modifie pas ton compte.

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
