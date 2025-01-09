DROP DATABASE formation_documents;
CREATE DATABASE formation_documents;

USE formation_documents;

CREATE TABLE formations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);


CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formation_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    chemin VARCHAR(255) NOT NULL,
    FOREIGN KEY (formation_id) REFERENCES formations(id)
);



INSERT INTO formations (nom) VALUES ('Formation 1');
INSERT INTO documents (formation_id, titre, chemin) VALUES (1, 'Document 1', 'http://localhost/api/DOCPDF/RIOTPDF.pdf');
