# Zimorodek — hero /aplikacje

Statyczny hero (HTML + CSS + GSAP 3.12.5 z cdnjs) odtwarzający referencję Dribbble (bluebird → zimorodek).
Treści: zimorodek.pl/aplikacje. Marka: #0080D1, #004978, akcent #E07C00; logo w `assets/logo-zimorodek.svg` (pełna nazwa, kolor).

## Repozytorium i podgląd
- Repo (publiczne): https://github.com/Brand-designer-pl/zimorodek-hero-aplikacje
- Podgląd dla klienta (GitHub Pages z gałęzi main): https://brand-designer-pl.github.io/zimorodek-hero-aplikacje/
- Po zmianach: podbij `?v=` w index.html, commit i push na main — Pages przebuduje się sam (ok. 1 min).

## Pliki
- `index.html`, `style.css`, `hero.js` — strona. Skala makiety: 1 `--u` = 1 px referencji 1526×856.
- `assets/zimorodek-wlot.mp4` — wlot 3,08 s: nowa generacja Seedance 2.5 (start = tło z jeziorem, koniec = `zrodla/ostatnia-klatka.png`; oryginał `zrodla/wlot-3s-seedance-oryginal.mp4`), pusty start wycięty, zawis ×2 (przeskok klatek), ostatnie 8 klatek domknięte przenikaniem do `ostatnia-klatka.png` (ostatnia klatka identyczna jak wcześniej → maska napisu, kadr zastępczy i start nurkowania bez zmian). UI wjeżdża w 1,0 s (`ver.uiAt`). Poprzedni wlot: `zrodla/wlot-v2-oryginal.mp4`.
- Koniec filmu: wideo zostaje na ostatniej klatce, nic go nie podmienia ani nie przykrywa (nakładanie obrazu na wideo daje widoczną zmianę koloru i ostrości). Napis „ZIMORODEK” chowa się za ptakiem przez `assets/maska-napisu.png` (odwrócona sylwetka z ostatniej klatki, mask-size: cover). Po zmianie wideo wygeneruj maskę i `zimorodek-hero.webp` (tylko zastępczy, gdy wideo nie ruszy) z jego ostatniej klatki.
- `zrodla/` — oryginały z Magnific (PNG 2752×1536). Projekt Magnific: „Zimorodek — hero aplikacje”.

- `assets/zimorodek-nurek.mp4` — przejście 2,88 s, jedno ciągłe ujęcie: nowa generacja Seedance 2.5 (start = `zrodla/ostatnia-klatka.png`, koniec = `zrodla/stop-klatka-nurek.png`; oryginał `zrodla/przejscie-3s-seedance-oryginal.mp4`): start z gałęzi → lot nad taflą → nurkowanie, kamera przechodzi przez powierzchnię razem z ptakiem → ryba. Tempo przeskokiem klatek (start/lot ×2, wejście pod wodę ×1,3, pod wodą ×1,8), ostatnie 8 klatek domknięte przenikaniem do stop-klatki (sekcja 2 i `pod-woda.webp` bez zmian). Treść sekcji wjeżdża 0,7 s przed końcem. Poprzednie: `zrodla/nurek-opublikowany-oryginal.mp4`.
- Scena (tryb animacji, desktop i telefon): `.scene` = jeden ekran, hero i `.dive` to warstwy. Sterowanie gestem (kółko, przesunięcie palcem, klawisze), nie pozycją przewinięcia: w hero gest w dół → nurkowanie, w trakcie filmu przewijanie zablokowane (`html.is-locked`); w sekcji 2 gest w górę → hero, w dół → normalne przewijanie dalej. Ograniczony ruch / brak JS: sekcja 2 jako zwykły blok.
- Zablokowane autoodtwarzanie (iOS w trybie oszczędzania energii blokuje każde wideo): `SeqPlayer` w hero.js odtwarza tę samą animację z klatek `assets/seq/wlot/000–073.webp` i `assets/seq/nurek/000–068.webp` (1920×1072, WebP q72, ok. 2 MB na film) na `<canvas>` — pobierane dopiero po odmowie odtwarzania. Po zmianie filmów wyeksportuj klatki ponownie (te same nazwy, liczba klatek w `new SeqPlayer(...)`). Gdy i klatki zawiodą → kadr końcowy.
- Telefon: filmy są poziome, więc kadr (object-position wideo i mask-position napisu) podąża za ptakiem wg `assets/tor-ptaka.json` (środek ptaka w każdej klatce, policzony z koloru, +0,07 w stronę głowy; ostatnie 14 klatek płynnie dociągnięte do `end` = środek głowy z dziobem, więc kadr końcowy jest wyśrodkowany; przy statycznym kadrze zastępczym kadrujemy według `end`). Po zmianie filmów przelicz tor.

## Zasady
- Pracuj po polsku. Jeden aktualny plik na zasób — nadpisuj, nie twórz wersji v2/final.
- Wzorzec ruchu: premium-web-agent `hero-reveal` (stagger, reduced motion → stan końcowy, treść widoczna bez JS).
- Moment wejścia UI: `UI_AT` w `hero.js` (s filmu). Klawisz R / przycisk w lewym dolnym rogu = powtórka.
- Podgląd: serwer `zimorodek-hero` w `Design Studio/.claude/launch.json` serwuje kopię ze scratchpadu (macOS blokuje serwerowi dostęp do Documents) — przed podglądem zsynchronizuj pliki.

## Do potwierdzenia z klientem
- „24/7” i cała treść sekcji 2 („Zobacz, co kryje głębia”) to treści przykładowe.
- Link „Zaloguj się” (na stronie to przycisk modala) — `data-todo` w index.html.
