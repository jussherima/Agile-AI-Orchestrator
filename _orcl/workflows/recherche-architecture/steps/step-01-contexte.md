<step order="1" name="contexte">
  <objective>Charger tout le contexte disponible.</objective>

  <process>
    Charger dans cet ordre :
    1. `_orcl/output/dev/stack-*.md` → la documentation de stack
    2. `.claude/rules/stack-*.md` → la rule de conventions
    3. `_orcl/output/CDC-validated.md` → le cahier des charges
    4. `_orcl/output/backlogs/*.md` → les tickets (pour comprendre les features)
    5. `_orcl/output/ux/` → les livrables UX (sitemap, flows)

    **Identifier les besoins techniques du projet :**
    - Authentification nécessaire ? (rôles, permissions)
    - Base de données ? (type, hébergement)
    - API externe ? (lesquelles)
    - Temps réel ? (websockets, SSE)
    - Upload de fichiers ? (images, documents)
    - Paiement ? (Stripe, etc.)
    - Notifications ? (push, email)
    - Multi-langue ? (i18n)
    - Offline ? (mobile)
  </process>

  <output>
    Résumer les besoins techniques identifiés.
  </output>

  <next>Passer à step-02-data-layer.md</next>
</step>
