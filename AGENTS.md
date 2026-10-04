# Zimorodek — hero /aplikacje

Statyczny hero (HTML + CSS + GSAP 3.12.5 z cdnjs) odtwarzający referencję Dribbble (bluebird → zimorodek).
Treści: zimorodek.pl/aplikacje. Marka: #0080D1, #004978, akcent #E07C00; logo w `assets/logo-zimorodek.svg` (pełna nazwa, kolor).

## Repozytorium i podgląd
- Repo (publiczne): https://github.com/Brand-designer-pl/zimorodek-hero-aplikacje
- Podgląd dla klienta (GitHub Pages z gałęzi main): https://brand-designer-pl.github.io/zimorodek-hero-aplikacje/
- Po zmianach: podbij `?v=` w index.html, commit i push na main — Pages przebuduje się sam (ok. 1 min).

## Pliki
- `index.html`, `style.css`, `hero.js` — strona. Skala makiety: 1 `--u` = 1 px referencji 1526×856.
- `assets/zimorodek-wlot.mp4` — wlot ptaka (Magnific, Seedance 2.5, 5 s, ruch wg referencji, tło z jeziorem `zrodla/plate-jezioro.png`, koniec `zrodla/kadr-koncowy.png`). Odtwarzany od `START_AT`.
- Koniec filmu: wideo zostaje na ostatniej klatce, nic go nie podmienia ani nie przykrywa (nakładanie obrazu na wideo daje widoczną zmianę koloru i ostrości). Napis „ZIMORODEK” chowa się za ptakiem przez `assets/maska-napisu.png` (odwrócona sylwetka z ostatniej klatki, mask-size: cover). Po zmianie wideo wygeneruj maskę i `zimorodek-hero.webp` (tylko zastępczy, gdy wideo nie ruszy) z jego ostatniej klatki.
- `zrodla/` — oryginały z Magnific (PNG 2752×1536). Projekt Magnific: „Zimorodek — hero aplikacje”.

- `assets/zimorodek-nurek.mp4` — sekcja 2, jedno ciągłe ujęcie sklejone lokalnie (OpenCV, H.264): (1) Kling 2.5 most 5 s, start = `zrodla/ostatnia-klatka.png`, koniec = `zrodla/klatka-styku-lot.png`, przyspieszony 2×; (2) Seedance 2.5 nurkowanie (start = ostatnia klatka hero, koniec = `zrodla/kadr-pod-woda.png`) od klatki 31: lot 31–80 przyspieszony 1,5×, od 81 w normalnym tempie. Styki ≈2/255 różnicy. `assets/pod-woda.webp` = ostatnia klatka.
- Scena (tryb animacji, desktop i telefon): `.scene` = jeden ekran, hero i `.dive` to warstwy. Sterowanie gestem (kółko, przesunięcie palcem, klawisze), nie pozycją przewinięcia: w hero gest w dół → nurkowanie, w trakcie filmu przewijanie zablokowane (`html.is-locked`); w sekcji 2 gest w górę → hero, w dół → normalne przewijanie dalej. Ograniczony ruch / brak JS: sekcja 2 jako zwykły blok.
- Telefon: filmy są poziome, więc kadr (object-position wideo i mask-position napisu) podąża za ptakiem wg `assets/tor-ptaka.json` (środek ptaka w każdej klatce, policzony z koloru, +0,07 w stronę głowy). Po zmianie filmów przelicz tor.

## Zasady
- Pracuj po polsku. Jeden aktualny plik na zasób — nadpisuj, nie twórz wersji v2/final.
- Wzorzec ruchu: premium-web-agent `hero-reveal` (stagger, reduced motion → stan końcowy, treść widoczna bez JS).
- Moment wejścia UI: `UI_AT` w `hero.js` (s filmu). Klawisz R / przycisk w lewym dolnym rogu = powtórka.
- Podgląd: serwer `zimorodek-hero` w `Design Studio/.claude/launch.json` serwuje kopię ze scratchpadu (macOS blokuje serwerowi dostęp do Documents) — przed podglądem zsynchronizuj pliki.

## Do potwierdzenia z klientem
- „24/7” i cała treść sekcji 2 („Zobacz, co kryje głębia”) to treści przykładowe.
- Link „Zaloguj się” (na stronie to przycisk modala) — `data-todo` w index.html.
