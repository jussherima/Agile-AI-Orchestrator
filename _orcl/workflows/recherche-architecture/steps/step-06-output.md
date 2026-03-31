<step order="6" name="output">
  <objective>Documenter l'architecture technique complète.</objective>

  <process>
    Créer `_orcl/output/dev/architecture-[nom-projet].md` avec :

    **1. Vue d'ensemble**
    - Stack choisie + justification
    - Diagramme d'architecture (texte/mermaid)

    **2. Couche données**
    - Base de données + ORM
    - Schéma des entités et relations
    - Repository pattern
    - Stratégie de caching

    **3. Authentification**
    - Méthode + flow
    - Rôles et permissions
    - Middleware/guards

    **4. State management**
    - Server state : solution + patterns
    - Client state : solution + patterns
    - Error handling : types, messages, reporting

    **5. API**
    - Approche (REST/Actions/tRPC)
    - Liste des endpoints
    - Format de réponse standardisé

    **6. Structure de projet**
    - Arborescence complète
    - Règles de création de feature

    **7. Décisions techniques (ADR)**
    Pour chaque décision importante :
    ```
    ## ADR-001 : [Titre]
    **Contexte :** [pourquoi cette décision]
    **Décision :** [ce qui a été choisi]
    **Alternatives considérées :** [ce qui a été rejeté et pourquoi]
    **Conséquences :** [impact sur le projet]
    ```
  </process>

  <announce>
    "Architecture documentée. Le projet a maintenant :
    - Stack documentée (`_orcl/output/dev/stack-[framework].md`)
    - Architecture définie (`_orcl/output/dev/architecture-[nom].md`)
    - Rule active (`.claude/rules/stack-[framework].md`)

    Tout le code produit suivra ces décisions. Lance `/orcl/dev/implement-ticket` ou `/orcl/dev/batch-implementation`."
  </announce>

  <self-check>
    - Chaque décision technique est justifiée
    - Les patterns sont cohérents entre eux
    - L'architecture est adaptée à la taille du projet (pas d'over-engineering)
    - Les ADR documentent les choix importants
    - Le document est sauvegardé
  </self-check>
</step>
