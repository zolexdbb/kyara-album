# Kyara Albums

Un classeur en ligne pour suivre sa collection [Kyara](https://kyara.games) album par album.

- Les 1 155 albums (un par univers) et leurs 6 736 cartes
- Cases à cocher pour chaque carte, enregistrées dans ton navigateur
- Tri par cartes manquantes, taille de l'album, % complété ou nom
- Filtres par état de l'album, par taille minimale (ex. 5 cartes et plus), par rareté, et « cartes manquantes seulement »
- Filtre par rareté appliqué aux albums : n'affiche que les albums où il manque des cartes de ces raretés, avec les compteurs correspondants
- Vue « Toutes les cartes » : toutes les cartes dans une seule grille, sans les albums (pratique avec le filtre de rareté et « cartes manquantes seulement »)
- Recherche par album ou par personnage
- Import de ta collection Kyara en un clic

## Importer sa collection

1. Va sur [kyara.games](https://kyara.games) en étant connecté.
2. Fais un clic droit sur la page → « Inspecter », puis ouvre l'onglet « Console ».
3. Colle la ligne affichée dans la page (bouton « Copier la ligne ») et appuie sur Entrée.
   Si le navigateur affiche un avertissement sur le collage, tape ce qu'il demande
   (`allow pasting` ou `autoriser le collage`), Entrée, puis colle à nouveau.
   Un fichier `kyara-collection.json` est téléchargé.
4. Dans Kyara Albums, clique sur « Choisir le fichier… » et sélectionne-le.

La ligne lit seulement ta collection sur kyara.games avec ta propre connexion
et l'enregistre dans un fichier. Elle n'envoie rien ailleurs et ne modifie pas ton compte.
Sur téléphone, fais l'export depuis un ordinateur.

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
