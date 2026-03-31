<step order="1" name="identifier">
  <objective>Identifier la stack technique du projet.</objective>

  <process>
    **Si le framework est spécifié en argument → l'utiliser.**

    **Sinon, détecter automatiquement :**
    - `package.json` → Node.js (vérifier next, react, vue, angular, express)
    - `pubspec.yaml` → Flutter/Dart
    - `requirements.txt` / `pyproject.toml` → Python (Django, FastAPI, Flask)
    - `go.mod` → Go
    - `Cargo.toml` → Rust
    - `pom.xml` / `build.gradle` → Java/Kotlin (Spring Boot)

    **Si rien n'est détecté → demander à l'utilisateur :**
    - Quel framework ?
    - Web, mobile ou les deux ?
    - Base de données prévue ?
    - Besoin d'authentification ?

    **Vérifier s'il existe déjà un document de stack :**
    - `_orcl/output/dev/stack-*.md` → le charger et proposer de le mettre à jour
    - `.claude/rules/stack-*.md` → une rule existe déjà

    **Consulter la base de connaissances interne :**
    - `brain/stacks/` → vérifier s'il existe un doc de référence pour cette stack
  </process>

  <output>
    "Stack identifiée : [framework]. Recherche des best practices..."
  </output>

  <next>Passer à step-02-rechercher.md</next>
</step>
