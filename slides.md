---
theme: default
title: Debugging Minds
favicon: /favicon.png
titleTemplate: '%s'
info: |
  Concurs de informatică pe echipe · Командный конкурс по информатике
  Departamentul Informatică · FMI · USM · 11.11.2026 · 14:00 · 222/4
colorSchema: light
fonts:
  sans: Inter
  serif: Inter Tight
  mono: JetBrains Mono
  weights: '400,500,600,700,800,900'
transition: slide-left
layout: cover
meta: ['Departamentul Informatică', 'FMI', 'USM']
words: ['Debug', 'ging', 'minds']
details: ['11.11.2026', '14:00', '222/4']
image: /brain.png
credit: 'Engraving: H. Mayo, 1827 · Wellcome Collection · CC BY 4.0'
---

<!--
Copertă. Identică cu afișul. Creierul: gravura lui H. Mayo (1827), Wellcome Collection, CC BY 4.0. Creditul trebuie să rămână pe slide.
-->

---
class: rules
---

<div class="dm-label dm-red">Before we start · Rules</div>

# Regulament

<div class="rgrid">
  <div class="rule"><ph-users-three-bold class="ri" /><Bi ro="Jucați în echipă, cu o singură foaie de răspunsuri." ru="Играете командой, с одним листом ответов." /></div>
  <div class="rule"><ph-timer-bold class="ri" /><Bi ro="60 de secunde pe întrebare." ru="60 секунд на вопрос." /></div>
  <div class="rule"><ph-device-mobile-slash-bold class="ri" /><Bi ro="Fără telefoane, laptopuri sau internet." ru="Без телефонов, ноутбуков и интернета." /></div>
  <div class="rule"><ph-gavel-bold class="ri" /><Bi ro="Răspunsurile se arată la final. Decizia juriului e definitivă." ru="Ответы показываем в конце. Решение жюри окончательное." /></div>
  <div class="rule wide"><ph-key-bold class="ri dm-red" /><Bi ro="Fiți atenți la imagini: în ele se ascund litere. Notați-le, din ele obțineți o cheie și un indiciu." ru="Внимательно смотрите на картинки: в них спрятаны буквы. Записывайте их, из них получится ключ и подсказка." /></div>
</div>

<style>
.rgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.3rem 2.6rem; margin-top: 1.4rem; }
.rule { display: grid; grid-template-columns: auto 1fr; gap: .9rem; align-items: start; padding-top: .9rem; border-top: 3px solid var(--dm-ink); }
.ri { font-size: 2.1rem; color: var(--dm-ink); }
.rule.wide { grid-column: 1 / -1; border-top-color: var(--dm-red); }
.ri.dm-red { color: var(--dm-red); }
.rule .ro { font-size: 1.22rem; line-height: 1.22; }
.rule .ru { font-size: 1rem; line-height: 1.25; }
</style>

<!--
Regulamentul. Citiți-l cu voce tare înainte de runda 1. Ceasul de pe fiecare întrebare pornește/oprește cu SPACE; după „Time's up”, SPACE sau → trece la următoarea.
-->

---
layout: round
round: 1
stats: ['15 questions', '60 s', 'Answers at the end']
---

<Bi ro="Hello, World!" />

<!--
Runda 1: întrebările mai ușoare (cele mai votate de juriu). Răspuns liber pe foaie. Toate răspunsurile se arată la final.
-->

---
layout: trivia
number: 1
round: 1
points: 10
category: Security
ask: ['Cum se numește acest tip de test?', 'Как называется этот тип теста?']
artWidth: 13rem
timer: 60
---

Un site îți cere să identifici **semafoare** sau să introduci caractere dintr-o **imagine distorsionată**.

Scopul este să deosebească **utilizatorii umani** de **programele automate**.

::ru::

Сайт просит найти на картинках **светофоры** или ввести символы с **искажённого изображения**.

Цель — отличить **людей** от **автоматических программ**.

::art::

<TrafficGrid egg="M" />

<!--
Răspuns (la final): CAPTCHA (acceptați și reCAPTCHA).
-->

---
layout: trivia
number: 2
round: 1
points: 10
category: Databases
ask: ['Cum se numește sistemul?', 'Как называется эта система?']
artWidth: 13rem
timer: 60
---

Elefanții sunt asociați cu **memoria bună**, o calitate potrivită pentru un sistem care păstrează date.

Un **elefant albastru** numit **Slonik** este simbolul unui cunoscut sistem de baze de date **relațional open-source**.

::ru::

Слонов принято связывать с **хорошей памятью** — подходящее качество для системы, которая хранит данные.

**Синий слон** по имени **Slonik** — символ известной **реляционной open-source** СУБД.

::art::

<RelTables egg="E" />

<!--
Răspuns (la final): PostgreSQL (acceptați și „Postgres”).
-->

---
layout: trivia
number: 3
round: 1
points: 10
category: Graphics
ask: ['Cum se numesc, în general, aceste suprafețe?', 'Как в общем называются эти поверхности?']
artWidth: 13rem
timer: 60
---

Aceste suprafețe mici formează obiectele din multe **jocuri 3D**.

Cel mai frecvent sunt **triunghiuri**, iar numărul lor influențează complexitatea geometrică a unui model.

::ru::

Из этих маленьких поверхностей состоят объекты во многих **3D-играх**.

Чаще всего это **треугольники**, а их количество определяет геометрическую сложность модели.

::art::

<WireMesh egg="R" />

<!--
Răspuns (la final): poligoane (polygons). Acceptați „mesh / plase de poligoane”, nu „triunghiuri”.
-->

---
layout: trivia
number: 4
round: 1
points: 10
category: History
ask: ['Ce au lipit în jurnal?', 'Что они вклеили в журнал?']
artWidth: 13rem
timer: 60
---

În **septembrie 1947**, echipa lui **Grace Hopper** lucra la calculatorul **Harvard Mark II** când mașina a început să dea rezultate greșite. Operatorii au găsit cauza fizică a defecțiunii și au lipit-o cu scotch în jurnalul de lucru.

Alături au notat: **„First actual case of <Blank :n="3" /> being found”**. Jurnalul se află azi la **Smithsonian**.

::ru::

В **сентябре 1947** года команда **Грейс Хоппер** работала на компьютере **Harvard Mark II**, когда машина начала выдавать неверные результаты. Операторы нашли физическую причину сбоя и вклеили её скотчем в рабочий журнал.

Рядом они записали: **«First actual case of <Blank :n="3" /> being found»**. Сегодня журнал хранится в **Смитсоновском институте**.

::art::

<LogBook egg="G" />

<!--
Răspuns (la final): o molie (moth). Cuvântul lipsă: „bug”. Acceptați „o molie / un fluture de noapte / o insectă”.
-->

---
layout: trivia
number: 5
round: 1
points: 10
category: Games
ask: ['Despre ce joc este vorba?', 'О какой игре идёт речь?']
artWidth: 13rem
timer: 60
---

În **decembrie 2021** a fost descoperită **Log4Shell**, una dintre cele mai grave vulnerabilități din istoria web-ului, prezentă în biblioteca **Log4j**.

Lumea a aflat de ea când jucătorii au observat că poți **executa cod pe server** doar scriind un mesaj în **chat-ul unui anumit joc**.

::ru::

В **декабре 2021** года обнаружили **Log4Shell** — одну из самых опасных уязвимостей в истории веба, найденную в библиотеке **Log4j**.

О ней узнали, когда игроки заметили: можно **выполнить код на сервере**, просто написав сообщение в **чат одной игры**.

::art::

<ChatLog egg="E" />

<!--
Răspuns (la final): Minecraft (Java Edition).
-->

---
layout: trivia
number: 6
round: 1
points: 10
category: Film
ask: ['Care era numele acestuia?', 'Как его звали?']
artWidth: 12rem
timer: 60
---

Acest computer fictiv este antagonistul filmului **„2001: Odiseea spațială”** al lui **Kubrick**, din **1968**. O teorie populară spune că numele său ascunde o glumă: fiecare literă vine **cu o poziție înaintea** literelor din numele celui mai mare producător de computere din epocă.

Arthur C. Clarke a negat mereu această legătură. Vocea sa calmă a definit imaginea AI-urilor malefice timp de decenii.

::ru::

Этот вымышленный компьютер — антагонист фильма **«2001 год: Космическая одиссея»** Стэнли **Кубрика** (**1968**). Популярная теория гласит, что в его имени спрятана шутка: каждая буква стоит **на одну позицию раньше** букв названия крупнейшего производителя компьютеров той эпохи.

Артур Кларк всегда отрицал эту связь. Его спокойный голос на десятилетия определил образ злого ИИ.

::art::

<HalEye />

<!--
Răspuns (la final): HAL 9000 (H-A-L = I-B-M cu o literă înapoi).
-->

---
layout: trivia
number: 7
round: 1
points: 10
category: Tech
ask: ['Care e numele acestui standard?', 'Как называется этот стандарт?']
artWidth: 13rem
timer: 60
---

Acest standard wireless a primit numele unui **rege danez din secolul al X-lea**, care a unit triburile din **Danemarca și Norvegia**. Inginerii au ales numele pentru că tehnologia trebuia să unească diferite dispozitive.

Logo-ul combină **două rune vechi**, inițialele regelui.

::ru::

Этот беспроводной стандарт назван в честь **датского короля X века**, объединившего племена **Дании и Норвегии**. Инженеры выбрали это имя, потому что технология должна была объединять разные устройства.

Логотип сочетает **две древние руны** — инициалы короля.

::art::

<RuneStones egg="C" />

<!--
Răspuns (la final): Bluetooth (regele Harald „Dinte Albastru”; runele ᚼ și ᛒ). Atenție la traducerea RU: nu spuneți „Синезубый”.
-->

---
layout: trivia
number: 8
round: 1
points: 10
category: Security
ask: ['Cum se numește firma?', 'Как называется эта компания?']
artWidth: 13rem
timer: 60
---

Pe **19 iulie 2024**, o firmă americană de **securitate cibernetică** a trimis o actualizare greșită pentru produsul său **Falcon**. Aproximativ **8,5 milioane** de calculatoare **Windows** au afișat ecranul albastru, iar aeroporturi, spitale și bănci s-au oprit.

Nu a fost un atac, iar sistemele Linux și macOS nu au avut probleme.

::ru::

**19 июля 2024** года американская компания в сфере **кибербезопасности** выпустила ошибочное обновление для своего продукта **Falcon**. Около **8,5 миллиона** компьютеров на **Windows** показали синий экран, а аэропорты, больницы и банки остановились.

Это была не атака, а системы Linux и macOS не пострадали.

::art::

<CrashBoard egg="O" />

<!--
Răspuns (la final): CrowdStrike.
-->

---
layout: trivia
number: 9
round: 1
points: 10
category: UI
ask: ['Cum se numește?', 'Как она называется?']
artWidth: 13rem
timer: 60
---

Iconița cu **trei linii orizontale**, care deschide meniul în aplicații, are un **nume de mâncare**.

Motivul: seamănă cu un **sandviș văzut din lateral**.

::ru::

Значок из **трёх горизонтальных линий**, который открывает меню в приложениях, носит **«съедобное» название**.

Причина: он похож на **бутерброд, если смотреть сбоку**.

::art::

<SideView egg="N" />

<!--
Răspuns (la final): meniul hamburger (hamburger menu). Acceptați „hamburger”.
-->

---
layout: trivia
number: 10
round: 1
points: 10
category: Telecom
ask: ['Ce scria în mesaj?', 'Что было написано в сообщении?']
artWidth: 13rem
timer: 60
---

Pe **3 decembrie 1992**, un programator a trimis de pe calculator **primul SMS din lume** către un director **Vodafone**, care era la o petrecere de firmă.

Mesajul avea doar **două cuvinte**.

::ru::

**3 декабря 1992** года программист отправил с компьютера **первое в мире SMS** директору **Vodafone**, который был на корпоративной вечеринке.

Сообщение состояло всего из **двух слов**.

::art::

<FirstText egg="F" />

<!--
Răspuns (la final): „Merry Christmas”. Acceptați traducerea „Crăciun fericit” / «С Рождеством».
-->

---
layout: trivia
number: 11
round: 1
points: 10
category: Languages
ask: ['Numiți ACEST lucru.', 'Назовите ЭТО.']
artWidth: 13rem
timer: 60
---

**Tony Hoare**, un reputat informatician britanic, a numit crearea **ACESTUIA** „greșeala mea de **un miliard de dolari**”. L-a introdus în **1965**, în limbajul **ALGOL W**.

În **Java**, pentru a combate consecințele acestei greșeli, în versiunea **8** a fost introdusă o clasă-container specială numită **Optional**.

::ru::

**Тони Хоар**, известный британский учёный-информатик, назвал создание **ЭТОГО** «моей ошибкой на **миллиард долларов**». Он ввёл это в **1965** году в языке **ALGOL W**.

Чтобы бороться с последствиями этой ошибки, в **Java 8** появился специальный класс-контейнер **Optional**.

::art::

<EmptyBox egg="L" />

<!--
Răspuns (la final): referința nulă (null). Acceptați „null”, „null pointer”, „NullPointerException”.
-->

---
layout: trivia
number: 12
round: 1
points: 10
category: Languages
ask: ['Cum îl numim astăzi?', 'Как мы называем его сегодня?']
artWidth: 13rem
timer: 60
---

În **Roma antică** exista profesia de **vespillo**: o persoană care, sub acoperirea nopții, scotea din oraș corpurile celor săraci.

În mașina virtuală **Java (JVM)** există propriul „vespillo”, care muncește neobosit **în fundal**, curățând memoria de **obiectele „moarte”**.

::ru::

В **Древнем Риме** существовала профессия **веспиллона** — человека, который под покровом ночи вывозил из города тела бедняков.

В виртуальной машине **Java (JVM)** есть свой «веспиллон», который неустанно работает **в фоне**, очищая память от **«мёртвых» объектов**.

::art::

<HeapSweep />

<!--
Răspuns (la final): Garbage Collector (colectorul de gunoi, GC). Acceptați «сборщик мусора».
-->

---
layout: trivia
number: 13
round: 1
points: 10
category: Cryptography
ask: ['Cum se numea acest cod?', 'Как назывался этот шифр?']
artWidth: 13rem
timer: 60
---

În **Al Doilea Război Mondial**, **Alan Turing** a contribuit, la **Bletchley Park**, la spargerea unui **cod german secret**.

Mesajele erau cifrate de o mașină cu **rotoare**, care schimba cheia la fiecare literă tastată.

::ru::

Во время **Второй мировой войны** **Алан Тьюринг** в **Блетчли-парке** помог взломать **секретный немецкий шифр**.

Сообщения шифровала машина с **роторами**, которая меняла ключ при каждой нажатой букве.

::art::

<RotorWheels egg="I" />

<!--
Răspuns (la final): Enigma.
-->

---
layout: trivia
number: 14
round: 1
points: 10
category: Debugging
ask: ['Cum se numește acest tip de bug?', 'Как называется этот тип бага?']
artWidth: 13rem
timer: 60
---

Un **bug** care dispare exact atunci când încerci să-l observi: pui un **breakpoint** sau un **print** și comportamentul se schimbă.

Numele lui vine de la un **fizician german**, prin analogie cu **principiul incertitudinii**. Are „frați”: **Bohrbug**, **Mandelbug**, **Schrödinbug**.

::ru::

**Баг**, который исчезает именно тогда, когда пытаешься его увидеть: ставишь **breakpoint** или **print** — и поведение меняется.

Его название происходит от имени **немецкого физика**, по аналогии с **принципом неопределённости**. У него есть «братья»: **Bohrbug**, **Mandelbug**, **Schrödinbug**.

::art::

<ProbeWave egg="C" />

<!--
Răspuns (la final): Heisenbug (după Werner Heisenberg).
-->

---
layout: trivia
number: 15
round: 1
points: 10
category: Security
ask: ['Cum se numește acest tip de program?', 'Как называется такой тип программ?']
artWidth: 13rem
timer: 60
---

Într-o poveste antică, un **dar aparent inofensiv** ascundea soldați.

În securitatea informatică, un program poate folosi aceeași strategie: se prezintă drept **util sau legitim**, dar ascunde **funcții rău intenționate**.

::ru::

В одной древней истории **безобидный на вид подарок** скрывал внутри воинов.

В информационной безопасности программа может действовать так же: выдаёт себя за **полезную или легальную**, но прячет **вредоносные функции**.

::art::

<HiddenCargo egg="T" />

<!--
Răspuns (la final): cal troian (Trojan). Acceptați „troian”, „Trojan horse”, «троян», «троянский конь».
-->

---
layout: round
round: 2
stats: ['15 questions', '60 s', 'Answers at the end']
---

<Bi ro="In Production" />

<!--
Runda 2: întrebările mai grele. Indicii lungi, răspuns liber pe foaie. Strângeți foile din runda 1 înainte de a începe.
-->

---
layout: trivia
number: 16
round: 2
points: 10
category: Data structures
ask: ['Ce literă stă în fața lui „-tree”?', 'Какая буква стоит перед «-tree»?']
artWidth: 13rem
timer: 60
---

Acest tip de arbore, inventat la **Boeing** de **Rudolf Bayer** și **Edward McCreight** și publicat în **1972**, face posibile bazele de date moderne. Îl folosesc **MySQL**, **SQLite** și sisteme de fișiere ca **NTFS** pentru indexare rapidă.

Numele său este format dintr-o **singură literă** urmată de **„-tree”**.

::ru::

Этот тип дерева, придуманный в **Boeing** **Рудольфом Байером** и **Эдвардом Маккрейтом** и опубликованный в **1972** году, сделал возможными современные базы данных. Его используют **MySQL**, **SQLite** и файловые системы вроде **NTFS** для быстрой индексации.

Его название состоит из **одной буквы** и **«-tree»**.

::art::

<NodeTree egg="N" />

<!--
Răspuns (la final): B (B-tree / B-arbore).
-->

---
layout: trivia
number: 17
round: 2
points: 10
category: Languages
ask: ['Cum se numește limbajul?', 'Как называется этот язык?']
artWidth: 13rem
timer: 60
---

Acest limbaj de programare a început în **2006** ca proiect personal al lui **Graydon Hoare**, iar **Mozilla** l-a susținut din **2009**. Programatorii l-au votat ani la rând drept **cel mai iubit limbaj** în sondajul **Stack Overflow**.

Hoare spune că numele vine de la o familie de **ciuperci parazite** foarte rezistente, dar mulți îl asociază cu **oxidarea metalelor**.

::ru::

Этот язык программирования появился в **2006** году как личный проект **Грейдона Хоара**, а с **2009** года его поддерживала **Mozilla**. Программисты годами признавали его **самым любимым языком** в опросе **Stack Overflow**.

Хоар говорит, что название происходит от семейства очень живучих **паразитических грибов**, но многие связывают его с **окислением металлов**.

::art::

<LovedChart egg="O" />

<!--
Răspuns (la final): Rust. În RU nu spuneți „ржавчинные грибы” (ar da răspunsul).
-->

---
layout: trivia
number: 18
round: 2
points: 10
category: AI
ask: ['Cum se numește acest termen?', 'Как называется этот термин?']
artWidth: 13rem
timer: 60
---

În **februarie 2025**, **Andrej Karpathy**, unul dintre fondatorii **OpenAI**, a descris pe X un nou mod de a programa: descrii în cuvinte ce vrei, lași **AI-ul** să scrie codul și **uiți că acel cod există**.

Dicționarul **Collins** a ales termenul drept **cuvântul anului 2025**. E format din **două cuvinte englezești**.

::ru::

В **феврале 2025** года **Андрей Карпаты**, один из основателей **OpenAI**, описал в X новый способ программирования: описываешь словами, чего хочешь, позволяешь **ИИ** написать код и **забываешь, что этот код вообще существует**.

Словарь **Collins** выбрал этот термин **словом 2025 года**. Он состоит из **двух английских слов**.

::art::

<PromptFade />

<!--
Răspuns (la final): vibe coding.
-->

---
layout: trivia
number: 19
round: 2
points: 10
category: AI
ask: ['Cum se numea aceasta?', 'Как она называется?']
artWidth: 13rem
timer: 60
---

În **2017**, cercetători de la **Google** au publicat lucrarea **„Attention Is All You Need”**. Lucrarea propunea o nouă arhitectură de rețele neuronale, care stă astăzi la baza marilor modele de inteligență artificială.

Curios este că numele arhitecturii coincide cu cel al unei celebre francize cinematografice regizate de **Michael Bay**.

::ru::

В **2017** году исследователи **Google** опубликовали статью **«Attention Is All You Need»**. В ней предлагалась новая архитектура нейронных сетей, которая сегодня лежит в основе крупнейших моделей искусственного интеллекта.

Любопытно, что название архитектуры совпадает с названием знаменитой кинофраншизы режиссёра **Майкла Бэя**.

::art::

<AttentionGrid egg="C" />

<!--
Cronometrul pornește singur după 2,5 s. Răspuns (la final): Transformer. Acceptați și „Transformers”.
-->

---
layout: trivia
number: 20
round: 2
points: 10
category: Security
ask: ['Cum se numea această vulnerabilitate?', 'Как называлась эта уязвимость?']
artPos: band
timer: 60
---

Această vulnerabilitate, descoperită în **2014**, a afectat aproximativ 17% din serverele web securizate din lume, adică circa o jumătate de milion de servere. Ea permitea citirea memoriei serverelor care foloseau **OpenSSL**.

Numele vine de la o eroare în implementarea unei extensii care verifica dacă conexiunea este încă activă, iar logo-ul reprezintă **un organ uman care sângerează**.

::ru::

Эта уязвимость, обнаруженная в **2014** году, затронула около 17% защищённых веб-серверов в мире — примерно полмиллиона серверов. Она позволяла читать память серверов, использовавших **OpenSSL**.

Название связано с ошибкой в реализации расширения, которое проверяло, активно ли ещё соединение, а на логотипе изображён **кровоточащий человеческий орган**.

::art::

<HexLeak egg="H" />

<!--
Răspuns (la final): Heartbleed.
-->

---
layout: trivia
number: 21
round: 2
points: 10
category: Databases
ask: ['Cum se numește această bază de date?', 'Как называется эта база данных?']
artWidth: 13rem
timer: 60
---

Această bază de date NoSQL a fost dezvoltată de **Facebook** în **2008** pentru funcția de inbox search. Facebook a publicat-o ca proiect open-source, iar în **2009** a donat-o fundației **Apache**.

Numele vine de la **o profetesă troiană** din mitologia greacă, blestemată să prezică viitorul fără ca nimeni să o creadă.

::ru::

Эта NoSQL база данных была разработана **Facebook** в **2008** году для поиска по входящим сообщениям (inbox search). Facebook открыл её исходный код, а в **2009** году передал фонду **Apache**.

Название происходит от имени **троянской пророчицы** из греческой мифологии, проклятой предсказывать будущее, которому никто не верит.

::art::

<HashRing />

<!--
Răspuns (la final): Apache Cassandra.
-->

---
layout: trivia
number: 22
round: 2
points: 10
category: Companies
ask: ['Care este această companie?', 'Что это за компания?']
artWidth: 13rem
timer: 60
---

Această companie americană, cunoscută mai ales pentru **bazele sale de date**, deține în mod controversat marca înregistrată a celui mai folosit limbaj de programare web din lume, deși nu a creat acest limbaj.

A obținut marca în **2010**, când a cumpărat **Sun Microsystems**. În **2024**, **Ryan Dahl**, creatorul Node.js, a inițiat o campanie publică pentru a o forța să renunțe la ea.

::ru::

Эта американская компания, известная прежде всего своими **базами данных**, неоднозначно владеет товарным знаком самого популярного в мире языка веб-программирования, хотя сама этот язык не создавала.

Знак достался ей в **2010** году вместе с покупкой **Sun Microsystems**. В **2024** году **Райан Даль**, создатель Node.js, начал публичную кампанию, чтобы заставить её отказаться от него.

::art::

<Trademark egg="E" />

<!--
Răspuns (la final): Oracle.
-->

---
layout: trivia
number: 23
round: 2
points: 10
category: Systems
ask: ['În ce an se va întâmpla asta?', 'В каком году это произойдёт?']
artWidth: 13rem
timer: 60
---

Sistemele **Unix** numără timpul în secunde de la **1 ianuarie 1970**.

Pe sistemele care stochează acest număr pe **32 de biți cu semn**, contorul va ajunge la valoarea maximă pe **19 ianuarie**, la ora **03:14:07 UTC**, și va sări dintr-odată în anul **1901**.

::ru::

Системы **Unix** считают время в секундах с **1 января 1970** года.

На системах, хранящих это число как **32-битное целое со знаком**, счётчик достигнет максимума **19 января** в **03:14:07 UTC** и внезапно перескочит в **1901** год.

::art::

<EpochCounter egg="A" />

<!--
Răspuns (la final): 2038 (problema anului 2038, Y2K38). 2^31 − 1 = 2 147 483 647 secunde.
-->

---
layout: trivia
number: 24
round: 2
points: 10
category: Inventions
ask: ['Cum se numește acest cod?', 'Как называется этот код?']
artWidth: 13rem
timer: 60
---

Inginerul japonez **Masahiro Hara** a inventat acest cod în **1994** la compania **Denso Wave**, pentru a urmări piesele de mașini în fabrici. Ideea a venit de la un joc de masă vechi, **Go**, cu pietre pe o tablă.

Compania nu cere bani pentru folosirea lui, așa că astăzi îl vezi în meniuri de restaurant și la plăți.

::ru::

Японский инженер **Масахиро Хара** изобрёл этот код в **1994** году в компании **Denso Wave**, чтобы отслеживать автозапчасти на заводах. Идея пришла из старинной настольной игры **го** с камнями на доске.

Компания не берёт денег за его использование, поэтому сегодня его можно увидеть в меню ресторанов и при оплате.

::art::

<GoBoard />

<!--
Răspuns (la final): codul QR (Quick Response).
-->

---
layout: trivia
number: 25
round: 2
points: 10
category: Crypto
ask: ['Ce a cumpărat?', 'Что он купил?']
artWidth: 13rem
timer: 60
---

Pe **22 mai 2010**, programatorul american **Laszlo Hanyecz** a făcut prima cumpărare documentată cu o **monedă digitală** nouă. A plătit **10 000 de unități** pentru **două** porții dintr-o mâncare foarte comună, pe care un alt utilizator de pe forum i le-a comandat.

În **2025**, acele monede valorau peste **un miliard de dolari**.

::ru::

**22 мая 2010** года американский программист **Ласло Ханеч** совершил первую задокументированную покупку за новую **цифровую валюту**. Он заплатил **10 000 монет** за **две** порции очень обычной еды, которые ему заказал другой пользователь форума.

В **2025** году эти монеты стоили больше **миллиарда долларов**.

::art::

<Receipt egg="T" />

<!--
Răspuns (la final): două pizza (Bitcoin Pizza Day). Acceptați „pizza”.
-->

---
layout: trivia
number: 26
round: 2
points: 10
category: Design
ask: ['Care este denumirea acestui text?', 'Как называется этот текст?']
artWidth: 13rem
timer: 60
---

Designerii și programatorii folosesc acest **text de umplutură** când pagina nu are încă conținut real. Mulți cred că textul nu înseamnă nimic.

De fapt, vine dintr-un tratat de etică scris de **Cicero** în anul **45 î.Hr.**, dar cu cuvinte tăiate.

::ru::

Дизайнеры и программисты используют этот **текст-заполнитель**, когда на странице ещё нет настоящего содержимого. Многие считают, что он ничего не значит.

На самом деле он взят из трактата об этике, написанного **Цицероном** в **45 году до н. э.**, только с обрезанными словами.

::art::

<CutScroll egg="I" />

<!--
Răspuns (la final): Lorem ipsum. Acceptați și „текст-рыба” doar dacă e însoțit de „Lorem ipsum”.
-->

---
layout: trivia
number: 27
round: 2
points: 10
category: Mobile
ask: ['Ce nume a primit versiunea 4.4?', 'Как назвали версию 4.4?']
artWidth: 13rem
timer: 60
---

Versiunile **Android** au primit nume de deserturi în ordine alfabetică: Cupcake, Donut, Eclair și așa mai departe. Toată lumea aștepta ca versiunea **4.4** să se numească **„Key Lime Pie”**.

Google a ales însă numele unui **baton de ciocolată**, pentru că inginerii îl mâncau noaptea, la birou. **Nestlé** a făcut 50 de milioane de batoane cu robotul Android pe ambalaj.

::ru::

Версии **Android** получали названия десертов в алфавитном порядке: Cupcake, Donut, Eclair и так далее. Все ждали, что версия **4.4** будет называться **«Key Lime Pie»**.

Но Google выбрал название **шоколадного батончика**, который инженеры ели по ночам в офисе. **Nestlé** выпустила 50 миллионов батончиков с роботом Android на упаковке.

::art::

<VersionShelf />

<!--
Răspuns (la final): KitKat (Android 4.4 KitKat).
-->

---
layout: trivia
number: 28
round: 2
points: 10
category: Languages
ask: ['Despre ce limbaj de programare este vorba?', 'О каком языке программирования идёт речь?']
artWidth: 13rem
timer: 60
---

Sigla acestui limbaj te-ar putea face să crezi că numele său vine din **zoologie**.

Creatorul lui s-a inspirat însă din numele unui **grup britanic de comedie**.

::ru::

Логотип этого языка может навести на мысль, что его название пришло из **зоологии**.

Однако его создатель вдохновился названием **британской комедийной труппы**.

::art::

<ComedyReel egg="N" />

<!--
Cronometrul pornește singur după 2,5 s. Răspuns (la final): Python (după Monty Python).
-->

---
layout: trivia
number: 29
round: 2
points: 10
category: Networking
ask: ['Cum se numește acest sistem?', 'Как называется эта система?']
artWidth: 13rem
timer: 60
---

Oamenii rețin mai ușor numele unui site decât adresa sa numerică.

Un sistem al internetului funcționează ca o **agendă**: primește un **nume de domeniu** și găsește **adresa IP** asociată.

::ru::

Людям легче запомнить название сайта, чем его числовой адрес.

Одна из систем интернета работает как **телефонная книга**: получает **доменное имя** и находит связанный с ним **IP-адрес**.

::art::

<PhoneBook egg="G" />

<!--
Răspuns (la final): DNS (Domain Name System).
-->

---
layout: trivia
number: 30
round: 2
points: 10
category: Security
ask: ['Cum se numește acest tip de atac?', 'Как называется этот тип атаки?']
artWidth: 13rem
timer: 60
---

Un student primește un mesaj aparent trimis de universitate: **„Contul va fi blocat! Confirmă urgent parola.”**

Linkul deschide o pagină care **imită autentificarea universității**, dar trimite datele unui atacator.

::ru::

Студент получает сообщение, якобы от университета: **«Аккаунт будет заблокирован! Срочно подтвердите пароль»**.

Ссылка открывает страницу, которая **имитирует вход в систему университета**, но отправляет данные злоумышленнику.

::art::

<FakeLogin />

<!--
Răspuns (la final): phishing.
-->

---
layout: round
round: 3
stats: ['Practical task', 'Instructions from the jury']
---

<Bi ro="Capture the Flag" />

<!--
Anunțul rundei 3 (practică). Strângeți foile din runda 2. Juriul verifică foile în timp ce echipele lucrează; apoi treceți la răspunsuri. Literele aduse de gândac pe slide-urile rundei 2 formează indiciul NOCHEATING (runda 1: cheia, încă nedecisă).
-->

---
layout: full
ctf: true
---

<CtfBoard />

<!--
Slide-ul care stă pe ecran cât lucrează echipele. Ceasul numără timpul scurs și se schimbă DOAR din butoane (Start · Pause/Resume · Reset; Reset cere al doilea clic în 3 s). Plecarea de pe slide sau reîncărcarea nu îl resetează; ferestrele presenter și audiență sunt sincronizate. Cât merge ceasul, puteți trece pe alte slide-uri (de ex. răspunsurile): un bloc mic „CTF” cu timpul apare în colțul din dreapta sus; un clic pe el vă întoarce aici.
ETAPE (sus-dreapta): 5 lacăte numerotate 00–04 ca în planul juriului (Etapa 0–4). Iconițele arată ce fac echipele, nu ce găsesc: 00 pachetul de start · 01 cheia (decriptare) · 02 lupa pe loguri · 03 grila · 04 ochiul (priviți mai atent). Clic pe lacătul următor când echipa din frunte trece de etapa respectivă; clic din nou pe ultimul deschis îl închide la loc. Reset le închide pe toate.
FINAL: când prima echipă strigă „Control C!”, apăsați Ctrl+C pe acest slide (sau butonul Finish din presenter). Timpul îngheață, apare „^C” + „Runda s-a încheiat” și steaguri care cad; rămâne așa până la Reset (dublu clic). Nimic de pe slide nu dezvăluie cheia, IP-ul, parola sau fraza finală înainte de Ctrl+C.
Easter eggs: la 03:14, 04:04, 13:37, 17:04, 42:00 și 1:00:00 apare câte o ștampilă. Tastați „hack”, „pwn”, „help” sau „dorin”. Clic pe gândacul de jos îl strivește; 5 clicuri pe Dorin. Reflectorul Directorului trece prin birou: când ajunge la Dorin, el se îndreaptă și ecranul trece de pe video pe cod.
-->

---
layout: cover
meta: ['Debugging Minds', 'Round 1 · 2', 'Answers']
words: ['Răspun', 'suri']
details: ['Ответы', 'Predați foile · Сдайте листы']
size: '9rem'
---


---
clicks: 15
---

<div class="dm-label dm-red">Round 1 · Answers · 01–15</div>

# Răspunsuri runda 1

<div class="grid grid-cols-2 gap-x-8 mt-4">
<AnswerList compact :items="[
  { n: 1, ro: 'Semafoarele', ru: 'Светофоры', answer: 'CAPTCHA' },
  { n: 2, ro: 'Elefantul albastru', ru: 'Синий слон', answer: 'PostgreSQL' },
  { n: 3, ro: 'Suprafețele din 3D', ru: 'Поверхности в 3D', answer: 'Poligoane' },
  { n: 4, ro: 'Jurnalul din 1947', ru: 'Журнал 1947 года', answer: 'O molie (moth)' },
  { n: 5, ro: 'Chat-ul cu Log4Shell', ru: 'Чат с Log4Shell', answer: 'Minecraft' },
  { n: 6, ro: 'Computerul din „2001”', ru: 'Компьютер из «2001»', answer: 'HAL 9000' },
  { n: 7, ro: 'Regele danez', ru: 'Датский король', answer: 'Bluetooth' },
  { n: 8, ro: '19 iulie 2024', ru: '19 июля 2024', answer: 'CrowdStrike' },
]" />
<AnswerList compact :reveal-at="9" :items="[
  { n: 9, ro: 'Cele trei linii', ru: 'Три линии', answer: 'Meniul hamburger' },
  { n: 10, ro: 'Primul SMS', ru: 'Первое SMS', answer: 'Merry Christmas' },
  { n: 11, ro: 'Greșeala de un miliard', ru: 'Ошибка на миллиард', answer: 'Referința null' },
  { n: 12, ro: 'Vespillo din JVM', ru: 'Веспиллон в JVM', answer: 'Garbage Collector' },
  { n: 13, ro: 'Codul spart de Turing', ru: 'Шифр Тьюринга', answer: 'Enigma' },
  { n: 14, ro: 'Bug-ul care fuge', ru: 'Убегающий баг', answer: 'Heisenbug' },
  { n: 15, ro: 'Darul cu soldați', ru: 'Подарок с воинами', answer: 'Cal troian (Trojan)' },
]" />
</div>

<!--
Un clic = un răspuns (15 clicuri). Q1: acceptați reCAPTCHA. Q2: acceptați „Postgres”. Q3: „triunghiuri” singur nu e suficient. Q4: acceptați orice insectă de noapte (cuvântul lipsă era „bug”). Q6: acceptați „HAL”. Q10: acceptați „Crăciun fericit” / «С Рождеством». Q11: acceptați „null”, „null pointer”, „NullPointerException”. Q12: acceptați „colectorul de gunoi”, „GC”, «сборщик мусора». Q15: acceptați „troian”, «троян».
-->

---
clicks: 15
---

<div class="dm-label dm-red">Round 2 · Answers · 16–30</div>

# Răspunsuri runda 2

<div class="grid grid-cols-2 gap-x-8 mt-4">
<AnswerList compact :items="[
  { n: 16, ro: 'Arborele de la Boeing', ru: 'Дерево из Boeing', answer: 'B (B-tree)' },
  { n: 17, ro: 'Limbajul lui Hoare', ru: 'Язык Хоара', answer: 'Rust' },
  { n: 18, ro: 'Cuvântul anului 2025', ru: 'Слово 2025 года', answer: 'Vibe coding' },
  { n: 19, ro: 'Arhitectura din 2017', ru: 'Архитектура 2017 года', answer: 'Transformer' },
  { n: 20, ro: 'Vulnerabilitatea din 2014', ru: 'Уязвимость 2014 г.', answer: 'Heartbleed' },
  { n: 21, ro: 'Profetesa troiană', ru: 'Троянская пророчица', answer: 'Apache Cassandra' },
  { n: 22, ro: 'Compania', ru: 'Компания', answer: 'Oracle' },
  { n: 23, ro: 'Contorul Unix', ru: 'Счётчик Unix', answer: '2038' },
]" />
<AnswerList compact :reveal-at="9" :items="[
  { n: 24, ro: 'Codul inspirat de Go', ru: 'Код, вдохновлённый го', answer: 'Codul QR' },
  { n: 25, ro: 'Prima cumpărare', ru: 'Первая покупка', answer: 'Două pizza' },
  { n: 26, ro: 'Textul lui Cicero', ru: 'Текст Цицерона', answer: 'Lorem ipsum' },
  { n: 27, ro: 'Android 4.4', ru: 'Android 4.4', answer: 'KitKat' },
  { n: 28, ro: 'Grupul de comedie', ru: 'Комедийная труппа', answer: 'Python' },
  { n: 29, ro: 'Agenda internetului', ru: 'Телефонная книга интернета', answer: 'DNS' },
  { n: 30, ro: 'Mesajul fals', ru: 'Фальшивое письмо', answer: 'Phishing' },
]" />
</div>

<!--
Un clic = un răspuns (15 clicuri). Q19: acceptați „Transformers”. Q21: acceptați „Cassandra”. Q25: acceptați „pizza”. Q30: acceptați „spear phishing”.
-->

---
layout: cover
meta: ['Departamentul Informatică', 'FMI', 'USM']
words: ['Mulțu', 'mim!']
details: ['Спасибо!', 'Debugging Minds', '11.11.2026']
size: '10.5rem'
---

---
layout: trivia
hide: true
number: 12
round: 1
points: 10
category: Security
ask: ['Ce obiecte sunt filmate?', 'Какие предметы снимает камера?']
artWidth: 13rem
timer: 60
---

Calculatoarele nu pot genera singure numere **cu adevărat aleatorii**. De aceea, o firmă de securitate din **San Francisco** filmează non-stop un perete cu aproximativ **100 de obiecte decorative** în stilul anilor **’70**.

Mișcarea imprevizibilă a **„bulelor”** din interiorul lor ajută la crearea **cheilor de criptare**.

::ru::

Компьютеры сами по себе не умеют генерировать **по-настоящему случайные** числа. Поэтому одна компания из **Сан-Франциско** круглосуточно снимает стену примерно со **100 декоративными предметами** в стиле **70-х**.

Непредсказуемое движение **«пузырей»** внутри них помогает создавать **ключи шифрования**.

::art::

<EntropyFeed />

<!--
REZERVĂ (ascunsă, nu e în ordinea finală).
Răspuns (la final): lămpi cu lavă (Cloudflare, „Wall of Entropy”). Acceptați „lava lamps”, «лавовые лампы».
-->
