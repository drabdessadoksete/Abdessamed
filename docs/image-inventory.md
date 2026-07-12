# Image inventory and usage policy

Last reviewed: 2026-07-13

## Classification rules

- `verified brand`: supplied clinic identity or logo that can be used as the clinic identity.
- `generated illustration`: AI-created scene used only as editorial support with an explicit caption. It is never described as the real dentist, team, patient or clinic.
- `documentary photograph`: real clinic photography whose origin and permission have been confirmed. None was supplied in the `new images` folder.
- `development only`: retained in the workspace but intentionally not published because it could be mistaken for a real person or team.

## Supplied folder

| Source file | Dimensions | Classification | Decision | Public mapping |
| --- | ---: | --- | --- | --- |
| `18_44_18 (1).webp` | 1672×941 | Generated illustration | Used for the consultation context and multilingual home pages. | `/images/orthodontie/consultation/consultation-orthodontie-*` |
| `18_44_18 (2).webp` | 1672×941 | Generated illustration | Used for implantology pages and guides. | `/images/implantologie/consultation/consultation-implantologie-*` |
| `18_44_18 (3).webp` | 1122×1402 | Generated portrait/team scene | Development only. It could be mistaken for the real dentist or team. | Not published |
| `18_44_19 (4).webp` | 1672×941 | Generated clinical-room illustration | Used only as a technology/environment illustration with a disclosure. | `/images/shared/technology/environnement-clinique-illustre-*` |
| `18_44_24 (1).webp` | 1672×941 | Generated illustration | Used for aligner explanation cards and treatment pages. | `/images/orthodontie/explanation/explication-aligneurs-*` |
| `18_44_24 (2).webp` | 1122×1402 | Generated portrait/team scene | Development only. It could be mistaken for the real dentist or team. | Not published |
| `18_44_24 (3).webp` | 1448×1086 | Generated waiting-room scene | Not published because it could be mistaken for the real clinic. | Not published |
| `18_44_25 (4).webp` | 1672×941 | Generated scanner illustration | Used for orthodontie-invisible pages and guides. | `/images/orthodontie/scanner/scanner-intraoral-*` |

## Verified brand asset

`src/assets/Logo ( hero section ).png` is the supplied clinic logo. The build uses trimmed, responsive AVIF/WebP derivatives under `/images/shared/brand/`. Cropping removes white margin only; the logo artwork is not recreated or modified.

## Optimization

`npm run media:prepare` creates responsive AVIF and WebP variants at practical breakpoints. Runtime images use `<picture>`, explicit dimensions, responsive `srcset`, lazy loading below the fold and high-priority loading only for the active hero visual.

## Legacy image findings

`src/assets/doctor.jpg` and `src/assets/gallery1.jpg` through `gallery6.jpg` contain only an eight-byte PNG signature. They are invalid image files and are not used. Older Gemini, Invisalign and general-care PNG assets remain in the repository for compatibility but are no longer imported by the rebuilt public pages.

## Real photography still required

- Exterior and accessible entrance.
- Reception and waiting area.
- Real portrait of Dr Abdessadok with written publication approval.
- Treatment room and sterilisation area.
- Diagnostic equipment actually present in the cabinet.
- Dentist explaining a model or screen, with consent and no patient data visible.

Verified documentary images uploaded through the admin gallery appear only when their record includes `verified_documentary: true`.
