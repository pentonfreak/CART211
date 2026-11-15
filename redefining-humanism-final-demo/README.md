# Redefining Humanism — Finished 10-page website

An interactive philosophical exhibition built with **plain HTML, CSS and JavaScript**. The four visual acts follow the supplied synopsis, moodboard and flowchart / wireframes. This is a static website suitable for GitHub Pages, Hybrid or another static host.

## Open it
1. Extract the ZIP.
2. Open `index.html` in Chrome, Firefox, Edge or Safari. It opens Chapter 1.
3. Use **CHAPTERS**, **NEXT**, and **PREVIOUS** to navigate all ten independent pages.
4. To edit or publish: open the extracted folder in VS Code, and deploy all its contents together.

## Ten chapters
1. The Tiny Blue Dot — Earth, cosmic minimalism and shared humanity
2. What Makes Us Human? — five selectable values
3. The Illusion of Choice — a nudged choice experiment and explanation
4. The Digital Human — session click/time metrics and a clearly simulated profile
5. Who Holds the Power? — corporate knowledge and the asymmetry of surveillance
6. Faith, Reason, and Morality — contrasting perspectives and an ethical dilemma
7. The Divided Civilization — fictional diplomacy choices
8. The Ideal Civ — functional 100-point civilization builder
9. The Final Frontier — hypothetical first contact
10. Redefining Humanism — a personalized reflection with copy and restart controls, references and privacy notes

## Design
- Act I: cosmic and minimalist
- Act II: cool-colored speculative digital / surveillance interface
- Act III: antique gold and philosophical / architectural symbolism
- Act IV: hope-oriented science fiction
- Fully self-contained CSS-generated space scenes, abstract SVG map, responsive desktop/tablet/mobile layouts including 480px.
- System fonts are intentionally used so it works offline. Title font may vary slightly by platform.
- Includes keyboard focus styles, labeled navigation, reduced-motion support, and progress indication.

## Privacy and limitations
This is a *class project*, not a commercial surveillance system. Chapter visits, answers, click counts and elapsed time are kept in **sessionStorage** in the local browser tab. They are not uploaded, monetized or shared. No cookies or third-party tracking are added, and the project does not attempt to read private cross-site cookies, user identity or precise location. The digital profile, first contact story, and political scenarios are *fictional illustrations*, not actual predictions.

## References included within the website
- Shoshana Zuboff, *The Age of Surveillance Capitalism* (2019); explanatory author interview from Harvard Gazette
- NASA/JPL-Caltech, Voyager 1's *Pale Blue Dot*
- Classical philosophical influences: Plato, Aristotle and biblical ethics

## Class submission checklist
- Read through and personalize the philosophical paragraphs in your own voice, especially chapter 10.
- Add your student and course credits if requested.
- Test all 10 pages, choices and mobile layout in your actual target browsers.
- Deploy to GitHub Pages or Hybrid and post the resulting public URL to your course forum.
- Confirm the professor's exact requirements on quotations, authorship and the assigned Zuboff excerpt.

## Files
`index.html`, `README.md`, `pages/page-01.html` ... `pages/page-10.html`, `assets/css/style.css`, `assets/js/script.js`.

## Understanding the code
- Each file in `pages/` is one chapter. Its `data-page` number selects the matching
  chapter interaction in `assets/js/script.js`.
- The chapter HTML supplies the content and element IDs; JavaScript connects buttons,
  sliders, and saved choices to those elements.
- `assets/js/script.js` stores choices in the browser tab's `sessionStorage` and builds
  the final reflection. It does not send data to a server.
- `assets/css/style.css` starts with shared typography and layout, then groups chapter
  visuals and responsive styles. Section headings mark the main groups.
- `index.html` redirects visitors to Chapter 1.
