document.addEventListener("DOMContentLoaded", async () => {
    const formationsContainer = document.getElementById("formations-container");

    // Récupère les formations et leurs documents depuis l'API
    const fetchFormations = async () => {
        try {
            const response = await fetch("http://localhost/api/get_formations.php");

            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }

            const data = await response.json();

            // Vérifie que les données sont au bon format
            if (!Array.isArray(data)) {
                throw new Error("Les données reçues ne sont pas au format attendu.");
            }

            return data;
        } catch (error) {
            console.error("Erreur lors de la récupération des formations :", error);
            return null; // Renvoie `null` en cas d'erreur
        }
    };

    // Fonction pour ouvrir le document dans OpenBoard
    const openDocument = (doc, annotations = []) => {
        if (window.sankore) {
            // Assurez-vous que `doc.chemin` contient le bon chemin relatif
            const docURL = doc.chemin; // Correction ici

            console.log(`Tentative d'ouverture du document : ${docURL}`);

            // Ouvre le document dans OpenBoard
            window.sankore.addObject(docURL, 800, 600, 100, 100, false);

            // Applique les annotations si fournies
            annotations.forEach(annotation => {
                switch (annotation.type) {
                    case "draw":
                        window.sankore.drawLineTo(annotation.data.x, annotation.data.y, annotation.data.width);
                        break;
                    case "text":
                        window.sankore.addText(annotation.data.text, annotation.data.x, annotation.data.y, annotation.data.size, annotation.data.font, annotation.data.bold, annotation.data.italic);
                        break;
                    // Ajouter d'autres types d'annotations ici si nécessaire
                }
            });

            // Afficher un message dans OpenBoard
            window.sankore.showMessage(`Document "${doc.titre}" chargé avec annotations.`);
        } else {
            console.error("L'API OpenBoard n'est pas disponible.");
        }
    };

    // Affiche les formations et leurs documents dans le DOM
    const renderFormations = (formations) => {
        formationsContainer.innerHTML = "";

        if (!formations || formations.length === 0) {
            formationsContainer.innerHTML = `<p>Aucune formation disponible.</p>`;
            return;
        }

        formations.forEach((formation) => {
            const formationDiv = document.createElement("div");
            formationDiv.classList.add("formation");

            const title = document.createElement("h2");
            title.textContent = formation.nom;

            const documentsList = document.createElement("div");
            documentsList.classList.add("document-list");

            formation.documents.forEach((doc) => {
                const documentItem = document.createElement("div");
                documentItem.classList.add("document-item");

                const link = document.createElement("a");
                link.textContent = doc.titre;
                link.href = doc.chemin; // L'URL complète
                link.target = "_blank"; // Pour ouvrir dans un nouvel onglet

                // Affichage de l'URL dans la console pour vérifier qu'elle est correcte
                console.log(`URL du document : ${link.href}`);

                // Lorsque l'utilisateur clique sur le lien, ouvrir le document dans OpenBoard
                link.addEventListener("click", (e) => {
                    e.preventDefault(); // Empêche l'ouverture normale du lien
                    console.log(`Clique sur le lien du document : ${doc.titre}`);
                    const annotations = [];  // Vous pouvez ajouter des annotations ici si nécessaire
                    openDocument(doc, annotations); // Ouvre le document dans OpenBoard
                });

                documentItem.appendChild(link);
                documentsList.appendChild(documentItem);
            });

            formationDiv.appendChild(title);
            formationDiv.appendChild(documentsList);
            formationsContainer.appendChild(formationDiv);
        });
    };

    // Récupère les données et les affiche
    const formations = await fetchFormations();

    if (formations) {
        renderFormations(formations);
    } else {
        formationsContainer.innerHTML = `<p>Une erreur est survenue lors de la récupération des données. Veuillez réessayer plus tard.</p>`;
    }
});
