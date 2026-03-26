# Vocabulary Explorer — Medium-Fidelity React Prototype

This is a medium-fidelity React prototype for CMPUT 302 Project 3 Milestone 4A.

## What is included
- Home page with **Browse Topics** cards
- Search with **autocomplete**
- Search results with **Details** and **Related Words**
- **No direct translation** state with recovery paths
- Topic map with **progressive disclosure**
- Related-words view with **All Related Words** selection modal
- **Save Topic** flow with confirmation toast
- Details page with a **simple possessor toggle** for kinship terms
- Saved topics page with **View / Remove / Delete** actions
- Global **Learner / Expert** mode toggle
- Contextual **help** on every screen
- Mock data for Animals and Kinship tasks

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Notes
- This is a prototype, so the data is mocked and only a subset of topics is active.
- Audio buttons currently show a feedback toast instead of playing final audio.
- The design reflects the paper prototype and the heuristic-evaluation fixes from Milestone 3.
