== Résumé ==

L'objectif de ce projet est de développer une « vraie » alternative aux logiciels de Screencasting actuels. En effet, même si il existe une large variété de logiciels proposant la réalisation de Screencasts, aucun de ces logiciels ne proposent de solutions efficaces regroupant les fonctionnalités/propriétés que l’on attend de ce genre d’outil. 

Généralement l’approche proposée est de faire un enregistrement vidéo d’une zone de votre écran et d’y coupler de l’audio. Cette approche pose plusieurs problèmes pour la capture (une erreur dans votre manip ou votre discours et il faut tout reprendre ou faire du collage vidéo), la post-édition (ajouter du texte, des animations, et autre, reviens à faire de l’édition vidéo), l’export (les formats sont propriétaires, et souvent bien trop lourd), l’indexation (très difficile d’indexer une vidéo ou un fichier Flash), la lecture (pas pratique de devoir faire défiler le curseur pour trouver l’information que l’on recherche : le moment ou tel ou tel truc est expliqué), etc.

Une approche intéressante est d'utiliser des animations plus simples que la vidéo (succession de captures d'écran fixes avec quelques ajouts comme déplacement du curseur de la souris, bulles d'aides, ...), qui permettent un rendu proche de la vidéo, mais en simplifiant et en améliorant la capture et la visualisation. Des solutions comme [http://www.debugmode.com/wink/ Wink], [http://www.adobe.com/Captivate Adobe Captivate], [http://osflash.org/salasaga Salasaga], etc. proposent des fonctionnalités intéressantes dans cette direction mais aucunes ne regroupent les critères suivant :

* Open source : aucune solution efficace n’est disponible en logiciel libre,
* Multi plateforme : aucune solution efficace libre et gratuite est multi plateforme,
* Open standard : aucune solution efficace utilise des standards ouverts pour l’export, l’import et la lecture des screencasts. Les formats utilisés sont souvent le Flash ou des formats videos.
* Multi export : aucune solution efficace propose d’utiliser un format intermédiaire de manipulation des screencasts afin, par exemple, d’offrir plusieurs format d’export/lecture de ces screencasts.
* Indexable : du fait des formats d’exports choisis par les solutions existantes, il est impossible d’indexer (utile pour les moteurs de recherches mais également pour améliorer la présentation de ces screencasts) les screencasts générés.
* Ergonomique : les solutions existantes sont souvent très peu ergonomique que se soit pour l’enregistrement du screencasts que pour la lecture, par exemple il faut se servir de la barre de défilement du player Flash ou video pour rechercher/accéder à une partie du screencast particulière.
* Web friendly : malgré le fait que les screencasts sont destinés au e-learning, aucune des solutions ne s’intègre correctement au technologies Web (HTML5, CSS, JS).

La solution développée sera composée de trois parties :
* Capture : un outil de capture et d’édition écrit en Java+JavaFX permettant a) l’enregistrement des informations relatives aux screencasts et b) la post-édition des screencasts pour l’ajout de méta-données (ex. textes, animations, etc.)
* Format intermédiaire : un format intermédiaire permettant de stocker le contenu, la forme et la dynamique des screencasts. Ce format devra être définit sur des standards ouverts (XML , JSON , autre), être extensible, et portable.
* Lecture: un lecteur permettant de visionner les screencasts dans un navigateur web (HTML5, JS, CSS).
