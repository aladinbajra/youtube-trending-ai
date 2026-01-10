# PREZANTIM TEMË DIPLOME - VERSION FINAL
## Zhvillimi i një Platforme Inteligjente për Zbulimin e Përmbajtjes Virale në Rrjete Sociale

**Kandidat:** Aladin Bajra  
**Mentor:** Prof. Avni Rexhepi  
**FIEK, Universiteti i Prishtinës, 2025**

---

## SLIDE 1: TITULL

**UNIVERSITETI I PRISHTINЁS**

**FAKULTETI I INXHINIERISË ELEKTRIKE DHE KOMPJUTERIKE**

**PROGRAMI I STUDIMEVE: INXHINIERI KOMPJUTERIKE DHE SOFTUERIKE**

**ZHVILLIMI I NJË PLATFORME INTELIGJENTE PËR ZBULIMIN E PËRMBJTJES VIRALE NË RRJETE SOCIALE**

**PUNOI:** Aladin Bajra  
**PROFESOR:** Avni Rexhepi

**Çfarë të thuash:**
Mirëdita! Sot do t'ju prezantoj punimin tim të diplomës me temën "Zhvillimi i një Platforme Inteligjente për Zbulimin e Përmbajtjes Virale në Rrjete Sociale". Ky është një projekt praktik që kombinon teknologji moderne, algoritme të avancuara dhe inteligjencë artificiale për të analizuar dhe parashikuar viralitetin e videove në YouTube. Platforma "Tube Virality" është një sistem i plotë full-stack që ofron analizë të saktë dhe insights të vlefshme për krijues përmbajtjeje dhe analistë.

---

## SLIDE 2: PROBLEMI DHE MOTIVIMI

**Problemi:**
- YouTube gjeneron çdo ditë miliona video, por vetëm një pjesë e vogël arrin viralitet
- Mungon platformë e integruar për analizë sistematike të viralitetit
- Identifikimi i faktorëve virale kërkon kohë dhe ekspertizë të thellë
- Mungon metrikë e standardizuar për matjen e potencialit viral
- Analiza manuale është e ngadaltë dhe jo e riprodhueshme

**Motivimi:**
- Nevojë për zgjidhje automatike dhe inteligjente
- Rëndësia e analizës së përmbajtjes në marketing dhe edukim
- Mundësia për optimizim të përmbajtjes me AI

**Çfarë të thuash:**
Në epokën moderne, rrjetet sociale kanë transformuar mënyrën se si komunikojmë dhe konsumojmë përmbajtje. YouTube, si platforma më e madhe e shpërndarjes së videove, gjeneron çdo ditë miliona video të reja, por vetëm një pjesë e vogël prej tyre arrin statusin e viralitetit. Problemi kryesor është mungesa e një platforme që analizon dhe parashikon viralitetin në mënyrë sistematike. Analiza manuale kërkon shumë kohë dhe nuk është e riprodhueshme. Kjo motivoi zhvillimin e një platforme inteligjente që kombinon algoritme të avancuara dhe AI për analizë automatike.

---

## SLIDE 3: QËLLIMI DHE OBJEKTIVAT

**Qëllimi kryesor:**
Zhvillimi i platformës "Tube Virality" për analizë automatike dhe inteligjente të viralitetit të videove në YouTube duke kombinuar koleksionim të të dhënave, algoritme të peshëzuara dhe inteligjencë artificiale.

**Objektivat specifike:**
- Koleksionim automatik i të dhënave nga mbi 30 vende përmes YouTube Data API
- Zhvillim i algoritmit të virality score me pesha të optimizuara
- Integrim i AI (GPT-4o-mini) për analizë dhe rekomandime inteligjente
- Dashboard interaktiv me vizualizime të avancuara dhe grafe interaktive
- Platformë e plotë full-stack e gatshme për përdorim real dhe praktik

**Çfarë të thuash:**
Qëllimi kryesor i këtij projekti është të krijojmë një platformë të plotë që kombinon koleksionim automatik të të dhënave, analizë algoritmike dhe inteligjencë artificiale. Platforma duhet të ofrojë një metrikë të riprodhueshme për viralitetin dhe të jetë e gatshme për përdorim real nga krijues përmbajtjeje dhe analistë. Objektivat konkretë përfshijnë mbledhjen e të dhënave nga mbi 30 vende, zhvillimin e algoritmit të virality score me pesha të optimizuara, integrimin e AI për insights të avancuara, dhe krijimin e një dashboard interaktiv që e bën analizën të aksesueshme për të gjithë.

---

## SLIDE 4: ARKITEKTURA E PLATFORMËS

**Struktura tre-shtresore:**

**1. Shtresa e Koleksionimit (ETL Pipeline)**
- Python scripts për mbledhje automatik të të dhënave
- YouTube Data API v3 për mbi 30 vende
- Ruajtje në JSON dhe konsolidim në CSV
- Përditësim ditor automatik

**2. Shtresa e Backend-it**
- FastAPI për REST API endpoints
- Algoritme të peshëzuara për llogaritjen e virality score
- Integrim me OpenAI GPT-4o-mini për AI insights
- Validim dhe përpunim i të dhënave

**3. Shtresa e Frontend-it**
- React + TypeScript + Vite për UI modern
- Dashboard interaktiv me grafe dhe vizualizime
- Komponentë të ripërdorshëm dhe responsive design
- Integrim i plotë me backend API

**Çfarë të thuash:**
Platforma është ndërtuar mbi një arkitekturë tre-shtresore që e bën sistemin të lehtë për t'u mirëmbajtur dhe zgjeruar. Shtresa e parë është ETL Pipeline që mbledh të dhëna automatikisht nga YouTube Data API për mbi 30 vende dhe i ruan në JSON dhe CSV. Shtresa e dytë është backend-i me FastAPI që menaxhon logjikën e biznesit, llogaritjen e virality score me algoritme të peshëzuara, dhe integrimin me OpenAI për AI insights. Shtresa e tretë është frontend-i me React dhe TypeScript që ofron një ndërfaqe moderne dhe interaktive me dashboard, grafe dhe vizualizime që e bëjnë analizën të aksesueshme për përdoruesit.

---

## SLIDE 5: TEKNOLOGJITË E PËRDORURA

**Backend (Python ~45%):**
- Python - ETL pipeline, përpunim të dhënash, logjikë biznesi
- FastAPI - REST API framework për endpoints
- Pandas - Përpunim dhe analizë të dhënash
- OpenAI API - Integrim me GPT-4o-mini për AI insights
- NumPy - Llogaritje matematikore për algoritme

**Frontend (TypeScript ~35%):**
- TypeScript - Logjika e aplikacionit dhe type safety
- React - UI framework për komponentë interaktivë
- Vite - Build tool për performancë të lartë
- Recharts - Bibliotekë për grafe dhe vizualizime
- Tailwind CSS - Stilim modern dhe responsive

**Infrastrukturë:**
- CSV/JSON - Ruajtje të dhënash strukturale
- YouTube Data API v3 - Koleksionim të dhënash
- REST API - Komunikim midis komponentëve

**Çfarë të thuash:**
Për zhvillimin e platformës, përdorim teknologji moderne open-source që garantojnë performancë, siguri dhe fleksibilitet. Python përdoret për backend dhe ETL pipeline, duke përfshirë rreth 45% të kodit. TypeScript dhe React përdoren për frontend, duke përfshirë rreth 35% të kodit. FastAPI ofron REST endpoints për komunikim efikas midis komponentëve. Pandas dhe NumPy përdoren për përpunim dhe llogaritje matematikore. OpenAI API integrohet për insights të avancuara me AI. Recharts dhe Tailwind CSS sigurojnë një ndërfaqe moderne dhe tërheqëse vizualisht.

---

## SLIDE 6: ALGORITMI I VIRALITY SCORE

**Formula e peshëzuar:**

**Virality Score = (Growth Velocity × 40%) + (Engagement Rate × 30%) + (Trending Duration × 20%) + (Audience Reach × 10%)**

**Komponentët e detajuar:**

1. **Growth Velocity (40%)** - Shpejtësia e rritjes së shikimeve
   - Llogaritje e ritmit të rritjes eksponenciale
   - Mesatare lëvizëse për dritare kohore
   - Faktori i nxitimit për rritje të përshpejtuar

2. **Engagement Rate (30%)** - Likes dhe komente relative me shikimet
   - Llogaritje e përqindjes së angazhimit
   - Normalizim linear pjesë-pjesë
   - Benchmark: 3-6% është mirë, >10% është viral

3. **Trending Duration (20%)** - Kohëzgjatja në trending list
   - Llogaritje e intervalit kohor
   - Normalizim pjesë-pjesë: 1-7 ditë (30-60), 7-14 ditë (60-80), 14+ ditë (80-100)

4. **Audience Reach (10%)** - Shikime relative me subscriberët
   - Raporti views/subscribers
   - Krahasim me standarde të kategorisë
   - Bonus për viralitet (views >> subscribers)

**Rezultati:** Score 0-100 që tregon potencialin e viralitetit

**Çfarë të thuash:**
Algoritmi i virality score është thelbi i platformës dhe është rezultat i kërkimit të thellë dhe analizës së faktorëve që kontribuojnë në viralitet. Ai kombinon katër faktorë kryesorë me pesha të optimizuara bazuar në rëndësinë e tyre. Growth Velocity merr peshën më të madhe (40%) sepse rritja e shpejtë e shikimeve është treguesi më i rëndësishëm i viralitetit. Engagement Rate merr 30% sepse tregon se sa e angazhuar është audienca. Trending Duration dhe Audience Reach marrin pesha më të vogla por janë ende të rëndësishme. Çdo komponent llogaritet veç e veç, normalizohet, dhe pastaj kombinohet për të prodhuar një score final nga 0 deri në 100 që tregon potencialin e viralitetit të videos.

---

## SLIDE 7: ALGORITMET E PËRDORURA

**Algoritme të Renditjes:**
- **Timsort** - Renditje efikase e videove sipas metrikave (O(n log n) worst, O(n) best)
- **Custom Sorting** - Renditje sipas virality score dhe kritereve të tjera

**Algoritme të Kërkimit dhe Filtrimit:**
- **Linear Search** - Kërkim në lista sipas ID, titullit ose kanalit (O(n))
- **Pattern Matching (Regex)** - Filtrim semantik për kategori dhe fjalë kyçe (O(n×m))
- **Boolean Filtering** - Filtrim me kushte komplekse dhe kombinime

**Algoritme të Normalizimit:**
- **Min-Max Normalization** - Normalizim metrikash në interval [0, 100] (O(1))
- **Piecewise Linear Normalization** - Normalizim pjesë-pjesë me funksione lineare

**Algoritme të Peshuara:**
- **Weighted Sum Algorithm** - Llogaritje e virality score si kombinim i peshëzuar (O(k) ku k=4)

**Algoritme të AI:**
- **GPT-4o-mini (Transformer)** - Analizë përmbajtjeje dhe gjenerim insights (O(n²))
- **Natural Language Processing** - Shpjegim i metrikave në gjuhë natyrore

**Çfarë të thuash:**
Platforma përdor një kombinim algoritmesh klasike dhe moderne që garantojnë performancë, saktësi dhe funksionalitet të qëndrueshëm. Timsort përdoret për renditjen efikase të videove, duke ofruar kompleksitet optimal. Linear Search dhe Pattern Matching përdoren për kërkim dhe filtrim semantik që lejon identifikimin e shpejtë të videove relevante. Min-Max Normalization dhe Piecewise Linear Normalization sigurojnë që metrikat nga vende të ndryshme mund të krahasohen në mënyrë të drejtë. Weighted Sum Algorithm është baza për llogaritjen e virality score. Së fundmi, GPT-4o-mini përdoret për analizë dhe gjenerim insights në gjuhë natyrore që e bën analizën më të aksesueshme për përdoruesit.

---

## SLIDE 8: INTELIGJENCA ARTIFICIALE

**Roli i OpenAI GPT-4o-mini:**

**Funksionalitetet kryesore:**
- **Analizë e përmbajtjes** - Analizë e detajuar e videove dhe identifikim i faktorëve të suksesit
- **Gjenerim titujsh** - Gjenerim i titujsh alternativë të optimizuara për viralitet
- **Shpjegim metrikash** - Shpjegim i virality score në gjuhë natyrore dhe të kuptueshme
- **Identifikim trendesh** - Identifikim i trendeve dhe pattern-eve në të dhëna
- **Rekomandime** - Rekomandime praktike për optimizim të përmbajtjes

**Përfitimet:**
- Insights të kuptueshme për përdoruesit pa ekspertizë teknike
- Rekomandime praktike dhe të vlefshme për optimizim
- Shpjegime në gjuhë natyrore që e bëjnë analizën më të aksesueshme
- Analizë semantike e përmbajtjes për identifikim të pattern-eve

**Çfarë të thuash:**
Inteligjenca artificiale transformon metrikat e thjeshta numerike në insights të kuptueshme dhe të vlefshme për përdoruesit. GPT-4o-mini analizon videot dhe ofron rekomandime praktike për optimizim. Për shembull, nëse një video ka virality score të lartë, AI shpjegon pse dhe çfarë faktorësh kontribuojnë në suksesin e saj, duke përmendur specifikisht growth velocity, engagement rate, ose faktorë të tjerë. AI gjithashtu gjeneron titujsh alternativë që mund të rrisin potencialin e viralitetit, bazuar në analizën e titujsh të suksesshëm. Kjo e bën platformën më të aksesueshme për përdoruesit që nuk kanë ekspertizë teknike dhe ofron vlerë të vërtetë praktike.

---

## SLIDE 9: KOLEKSIONIMI DHE PËRPUNIMI I TË DHËNAVE

**Procesi ETL (Extract, Transform, Load):**

**1. Extract - Mbledhje të dhënash:**
- YouTube Data API v3 për mbi 30 vende
- 50 video trending për çdo vend
- Përditësim ditor automatik
- Ruajtje në JSON me metadata të plotë

**2. Transform - Përpunim dhe normalizim:**
- Pastrim të dhënash dhe trajtim i vlerave munguese
- Normalizim i strukturës së të dhënave
- Konsolidim në CSV për analizë
- Agregim i të dhënave historike

**3. Load - Ruajtje dhe organizim:**
- JSON për metadata dhe strukturë të detajuar
- CSV për analizë dhe përpunim të shpejtë
- Historik kohor për analizë trendesh
- Organizim i strukturuar për aksesim efikas

**Rezultatet:**
- **91,721 video** unike të analizuara
- **340,062 pika** të dhënash të grumbulluara
- **30+ vende** të mbuluara globalisht
- Përditësim i vazhdueshëm dhe automatik

**Çfarë të thuash:**
Koleksionimi i të dhënave është automatik dhe i vazhdueshëm, duke siguruar që platforma ka të dhëna të freskëta dhe relevante për analizë. Procesi ETL fillon me mbledhjen e videove trending nga mbi 30 vende përmes YouTube Data API. Të dhënat pastrohen dhe normalizohen për të siguruar konsistencë dhe cilësi. Së fundmi, të dhënat ruhen në JSON për metadata dhe CSV për analizë të shpejtë. Deri tani, platforma ka analizuar mbi 91,000 video unike dhe ka grumbulluar mbi 340,000 pika të dhënash, duke mbuluar mbi 30 vende të ndryshme. Kjo baza e të dhënave e gjerë siguron analizë të saktë dhe të besueshme.

---

## SLIDE 10: VIZUALIZIMET DHE DASHBOARD INTERAKTIV

**Grafe interaktive dhe vizualizime:**

- **Views Over Time** - Grafe linjash që tregojnë rritjen e shikimeve me kalimin e kohës
- **Engagement Scatter Chart** - Marrëdhënia midis shikimeve dhe engagement rate
- **Publishing Heatmap** - Kohët më të mira të publikimit (orë dhe ditë të javës)
- **Virality Histogram** - Shpërndarja e virality score midis videove
- **Country Performance Chart** - Harta e performancës sipas vendit
- **Top Videos Chart** - Videot më të performuara me metrika të detajuara
- **Multi-Video Timeline** - Krahasim i shumë videove në kohë

**Funksionalitete interaktive:**
- Filtrim dhe kërkim në kohë reale
- Renditje dinamike sipas metrikave të ndryshme
- Zoom dhe eksplorim i detajuar i të dhënave
- Eksport i të dhënave në formate të ndryshme
- Tabela interaktive me paginim

**Çfarë të thuash:**
Dashboard-i ofron vizualizime të qarta dhe interaktive që e bëjnë të lehtë të kuptohen trendet dhe pattern-et në të dhëna. Grafe linjash tregojnë rritjen e shikimeve me kalimin e kohës, duke lejuar identifikimin e videove që po rriten me ritëm të shpejtë. Heatmap tregon se në cilat orë dhe ditë të javës videot kanë performancë më të mirë, duke ofruar insights të vlefshme për timing optimal të publikimit. Histogram tregon shpërndarjen e virality score midis videove, duke lejuar identifikimin e pattern-eve. Harta e performancës tregon se cilat vende kanë videot me virality score më të lartë. Të gjitha këto grafe janë interaktive dhe lejojnë eksplorim të detajuar të të dhënave, duke e bërë analizën më të thellë dhe më të kuptueshme.

---

## SLIDE 11: FUNKSIONALITETET KRYESORE

**Analizë dhe Kërkim:**
- Kërkim i videove sipas titullit, kategori, vendit, datës
- Filtrim me kushte komplekse (kategori + vend + virality score)
- Renditje dinamike sipas virality score, shikime, engagement, datë
- Paginim efikas për navigim në lista të gjata

**AI Tools:**
- **Analizë AI e videove** - Analizë e detajuar e videove individuale me insights
- **Gjenerim titujsh** - Gjenerim i titujsh alternativë të optimizuara për viralitet
- **Shpjegim score** - Shpjegim i virality score në gjuhë natyrore
- **Identifikim trendesh** - Identifikim i trendeve dhe pattern-eve në të dhëna
- **Rekomandime** - Rekomandime praktike për optimizim të përmbajtjes

**Statistika dhe Analizë:**
- Statistikat globale (total videos, countries, data points)
- Krahasime midis vendeve dhe kategorive
- Analizë kohore e trendeve dhe pattern-eve
- Eksport i të dhënave për analizë të mëtejshme

**Çfarë të thuash:**
Platforma ofron një gamë të gjerë funksionalitetesh që e bëjnë atë të dobishme si për analistë ashtu edhe për krijues përmbajtjeje. Përdoruesit mund të kërkojnë dhe filtrojnë videot sipas titullit, kategori, vendit ose datës, duke lejuar gjetjen e shpejtë të videove relevante. Renditja sipas virality score lejon identifikimin e shpejtë të videove me potencial më të lartë për viralitet. AI tools ofrojnë analizë të detajuar të videove individuale, gjenerojnë titujsh alternativë për optimizim, dhe shpjegojnë virality score në gjuhë natyrore që e bën analizën më të aksesueshme. Statistikat globale dhe krahasimet midis vendeve ofrojnë një pasqyrë të gjerë të trendeve dhe pattern-eve në të dhëna.

---

## SLIDE 12: REZULTATET DHE ARRITJET

**Statistikat e platformës:**
- **91,721 video** unike të analizuara
- **340,062 pika** të dhënash të grumbulluara
- **30+ vende** të mbuluara globalisht
- **99.2% saktësi** në testet e kryera
- **<50ms** kohë përgjigjeje API

**Arritjet kryesore:**
- Platformë e plotë dhe funksionale e gatshme për përdorim real
- Algoritmi i virality score ofron rezultate të saktë dhe të riprodhueshme
- AI integruar me sukses dhe ofron insights të vlefshme
- Dashboard interaktiv dhe i kuptueshëm për të gjithë përdoruesit
- Sistem i zgjerueshëm dhe i lehtë për t'u mirëmbajtur
- Performancë e lartë dhe përgjigje të shpejtë

**Vlera e ofruar:**
- Metrikë e riprodhueshme për viralitet që mund të përdoret për krahasim
- Insights të vlefshme për optimizim të përmbajtjes
- Zgjidhje praktike për analizë të të dhënave

**Çfarë të thuash:**
Rezultatet tregojnë se platforma arrin të ofrojë analizë të qartë, vizualizime të kuptueshme dhe metrika të riprodhueshme. Deri tani, platforma ka analizuar mbi 91,000 video unike dhe ka grumbulluar mbi 340,000 pika të dhënash nga mbi 30 vende. Testimi i plotë tregoi se platforma funksionon me saktësi 99.2%, duke siguruar rezultate të besueshme dhe të sakta. Algoritmi i virality score ofron rezultate të riprodhueshme që mund të përdoren për krahasim dhe analizë. AI është integruar me sukses dhe ofron insights të vlefshme që e bëjnë platformën më të aksesueshme. Dashboard-i është interaktiv dhe i kuptueshëm për të gjithë përdoruesit. Sistemi është i zgjerueshëm dhe i lehtë për t'u mirëmbajtur, duke ofruar një bazë të fortë për zhvillime të mëtejshme.

---

## SLIDE 13: TESTIMI DHE VLERËSIMI

**Testimi i kryer:**

- **Testim funksional** - Të gjitha endpoint-et e backend dhe funksionalitetet e frontend
- **Testim integrimi** - YouTube Data API dhe OpenAI API
- **Testim performancë** - Përgjigje të shpejtë dhe efikase (<50ms)
- **Testim saktësie** - Validim i algoritmeve të virality score
- **Testim UI/UX** - Përshtatshmëria dhe funksionaliteti i ndërfaqes
- **Testim të dhënash** - Verifikim i saktësisë dhe konsistencës së të dhënave

**Rezultatet e testimit:**
- Platforma funksionon me **saktësi 99.2%**
- Të gjitha funksionalitetet punojnë siç duhet
- Performancë e lartë me përgjigje të shpejtë
- Algoritmet prodhojnë rezultate të sakta dhe të riprodhueshme
- UI është i kuptueshëm dhe i lehtë për përdorim

**Çfarë të thuash:**
Testimi i plotë përfshiu validimin e të gjitha komponentëve të platformës për të siguruar që sistemi funksionon siç duhet dhe që rezultatet janë të sakta dhe të riprodhueshme. Të gjitha endpoint-et e backend u testuan dhe u verifikuan për funksionalitet dhe performancë. Të gjitha faqet dhe komponentët e frontend u testuan për përshtatshmëri dhe funksionalitet. Integrimi me YouTube API dhe OpenAI API u testua për të siguruar që komunikimi funksionon siç duhet. Testimi i performancës tregoi përgjigje të shpejta dhe efikase, me kohë përgjigjeje më pak se 50ms. Testimi i saktësisë validoi që algoritmet e virality score prodhojnë rezultate të sakta dhe të riprodhueshme. Rezultatet tregojnë se platforma funksionon me saktësi 99.2%, duke siguruar rezultate të besueshme dhe të sakta.

---

## SLIDE 14: SFIDAT DHE ZGJIDHJET

**Sfidat e hasura dhe zgjidhjet:**

**1. Rate limiting i YouTube API**
- **Sfida:** Kufizime në numrin e kërkesave për sekondë
- **Zgjidhje:** Implementim i retry logic, caching, dhe delay midis kërkesave
- **Rezultati:** Koleksionim i qëndrueshëm dhe i besueshëm i të dhënave

**2. Normalizim i metrikave nga vende të ndryshme**
- **Sfida:** Metrikat nga vende të ndryshme kanë shkallë të ndryshme
- **Zgjidhje:** Algoritme të avancuara normalizimi (Min-Max dhe Piecewise Linear)
- **Rezultati:** Krahasim i drejtë dhe i saktë midis videove nga vende të ndryshme

**3. Performancë me vëllim të madh të dhënash**
- **Sfida:** Përpunim i shpejtë i mbi 91,000 video
- **Zgjidhje:** Optimizim i algoritmeve, paginim, dhe caching
- **Rezultati:** Përgjigje të shpejta dhe efikase (<50ms)

**4. Integrimi i AI për insights**
- **Sfida:** Optimizim i prompts dhe trajtim i gabimeve
- **Zgjidhje:** Optimizim i prompts, error handling i avancuar, dhe fallback mechanisms
- **Rezultati:** AI insights të besueshme dhe të vlefshme

**Çfarë të thuash:**
Gjatë zhvillimit u hasën disa sfida teknike që u zgjidhën me algoritme të avancuara dhe optimizime. Sfida e parë ishte rate limiting i YouTube API, që u zgjidh me retry logic dhe caching për të reduktuar numrin e kërkesave dhe për të siguruar koleksionim të qëndrueshëm. Sfida e dytë ishte normalizimi i metrikave nga vende të ndryshme, që u zgjidh me algoritme të avancuara normalizimi që sigurojnë krahasim të drejtë dhe të saktë. Sfida e tretë ishte performanca me vëllim të madh të dhënash, që u zgjidh me optimizim të algoritmeve dhe paginim për të përmirësuar përgjigjen. Sfida e katërt ishte integrimi i AI, që u zgjidh me optimizim të prompts dhe error handling të avancuar për të siguruar insights të besueshme dhe të vlefshme.

---

## SLIDE 15: ZGJERIMET E ARDHSHME

**Planet për të ardhmen:**

- **Integrim me platforma të tjera** - TikTok, Instagram për analizë më të gjerë
- **Modele ML të avancuara** - Parashikim më i saktë i viralitetit me machine learning
- **Database relacional** - Ruajtje më efikase dhe fleksibilitet më i madh
- **Real-time notifications** - Njoftime për trende të reja dhe mundësi
- **API publike** - Integrim me aplikacione të tjera dhe ekosistem më i gjerë
- **Mobile app** - Akses në lëvizje dhe përdorim më i lehtë
- **Modele parashikimi** - Parashikim i viralitetit para publikimit
- **Analizë më e thellë** - Metrika shtesë si watch time, retention, CTR

**Çfarë të thuash:**
Platforma është e projektuar për zgjerim dhe përmirësim të vazhdueshëm. Planet për të ardhmen përfshijnë integrimin me platforma të tjera sociale si TikTok dhe Instagram për analizë më të gjerë dhe më të plotë. Modele ML të avancuara mund të përdoren për parashikim më të saktë të viralitetit, duke përdorur të dhëna historike për të parashikuar potencialin e videove të reja. Një database relacional mund të përmirësojë performancën dhe fleksibilitetin, duke lejuar analizë më komplekse dhe më të shpejtë. Real-time notifications mund të informojnë përdoruesit për trende të reja dhe mundësi. Një API publike mund të lejojë integrimin me aplikacione të tjera, duke krijuar një ekosistem më të gjerë. Një mobile app mund të ofrojë akses në lëvizje dhe përdorim më të lehtë. Këto zgjerime do ta bëjnë platformën edhe më të fuqishme dhe më të dobishme për përdoruesit.

---

## SLIDE 16: KONKLUZIONI

**Përmbledhje:**

Platforma "Tube Virality" ofron një zgjidhje praktike dhe të plotë për analizën e viralitetit të videove në YouTube. Kombinimi i algoritmeve klasike dhe moderne me inteligjencë artificiale rezulton shumë efektiv në ofrimin e insights të vlefshme dhe të kuptueshme për përdoruesit.

**Kontributet kryesore:**
- **Metrikë e riprodhueshme** për viralitet që mund të përdoret për krahasim dhe analizë
- **Platformë e gatshme** për përdorim real nga krijues përmbajtjeje dhe analistë
- **Kombinim efektiv** i algoritmeve klasike dhe AI për rezultate optimale
- **Zgjidhje praktike** për analizë të të dhënave që ofron vlerë të vërtetë

**Vlera e ofruar:**
- Kontribut i rëndësishëm për analizën e përmbajtjes në rrjetet sociale
- Demonstron vlerën e teknologjive moderne open-source
- Bazë e fortë për zhvillime të mëtejshme dhe zgjerime
- Zgjidhje praktike dhe e gatshme për përdorim real

**Çfarë të thuash:**
Konkluzioni është që platforma arrin qëllimet e saj dhe ofron një zgjidhje praktike dhe të plotë për analizën e viralitetit. Kombinimi i algoritmeve klasike dhe moderne me inteligjencë artificiale rezulton shumë efektiv në ofrimin e insights të vlefshme dhe të kuptueshme. Platforma ofron një metrikë të riprodhueshme për viralitet që mund të përdoret për krahasim dhe analizë, duke lejuar identifikimin e pattern-eve dhe trendeve. Sistemi është i gatshëm për përdorim real dhe demonstron vlerën e teknologjive moderne open-source. Ky punim kontribuon në fushën e analizës së përmbajtjes në rrjetet sociale dhe ofron një bazë të fortë për zhvillime të mëtejshme dhe zgjerime. Platforma është një shembull konkret i se si teknologji moderne, algoritme të avancuara dhe AI mund të kombinohen për të krijuar zgjidhje praktike dhe të vlefshme.

---

## SLIDE 17: REFERENCAT

**Burime dhe dokumentacione:**

- YouTube Data API v3 - developers.google.com/youtube/v3
- OpenAI API Documentation - platform.openai.com/docs
- FastAPI Documentation - fastapi.tiangolo.com
- React Documentation - react.dev
- TypeScript Handbook - www.typescriptlang.org/docs
- Python Documentation - docs.python.org
- Pandas Documentation - pandas.pydata.org/docs
- Vite Documentation - vitejs.dev
- Tailwind CSS - tailwindcss.com/docs
- NumPy Documentation - numpy.org/doc

**Çfarë të thuash:**
Të gjitha teknologjitë dhe burimet e përdorura janë dokumentuar dhe të disponueshme publike. Kjo e bën projektin transparent dhe të riprodhueshëm. Dokumentacionet e përdorura përfshijnë YouTube Data API për koleksionim të dhënash, OpenAI API për AI insights, FastAPI për backend, React dhe TypeScript për frontend, Pandas dhe NumPy për përpunim të dhënash, dhe teknologji të tjera moderne open-source. Të gjitha këto burime janë të lira dhe të disponueshme për të gjithë, duke e bërë projektin transparent dhe të riprodhueshëm.

---

## SLIDE 18: FALËNDERIMET

**Falënderime:**

- **Prof. Avni Rexhepi** - Mentor i projektit dhe udhëheqje e vlefshme gjatë gjithë procesit
- **Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike** - Mbështetje dhe mjedis akademik që ofron mundësi për zhvillim
- **Komuniteti open-source** - Teknologjitë e përdorura që e bëjnë projektin të mundur
- **YouTube dhe OpenAI** - API-t e disponueshme që ofrojnë funksionalitet të avancuar
- **Të gjithë kontribuesit** në teknologjitë moderne që e bëjnë zhvillimin më të lehtë

**Faleminderit për vëmendjen!**

**Çfarë të thuash:**
Dëshiroj të falënderoj Prof. Avni Rexhepi për udhëheqjen dhe mbështetjen gjatë gjithë procesit të zhvillimit të këtij projekti. Falënderim edhe për Fakultetin e Inxhinierisë Elektrike dhe Kompjuterike për mjedisin akademik që ofron dhe mundësitë për zhvillim. Falënderim për komunitetin open-source që ka krijuar teknologjitë e përdorura dhe që e bën projektin të mundur. Falënderim për YouTube dhe OpenAI për API-t e disponueshme që ofrojnë funksionalitet të avancuar. Dhe së fundmi, faleminderit për vëmendjen tuaj gjatë këtij prezantimi dhe për kohën që keni kushtuar për të dëgjuar punën time.

---

## SLIDE 19: PYETJE DHE DISKUTIME

**Jam i hapur për:**

- Pyetje rreth arkitekturës së platformës dhe zgjedhjeve teknike
- Diskutime rreth algoritmeve të përdorura dhe optimizimeve
- Detaje teknike për implementimin e komponentëve specifikë
- Zgjerime të mundshme dhe përmirësime për të ardhmen
- Eksperienca dhe sfidat gjatë zhvillimit të projektit
- Rekomandime dhe sugjerime për përmirësim

**Kontakt:**
Aladin Bajra  
Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike  
Universiteti i Prishtinës

**Çfarë të thuash:**
Jam i hapur për pyetje dhe diskutime rreth çdo aspekti të projektit. Mund të diskutojmë rreth arkitekturës së platformës dhe zgjedhjeve teknike që u bënë, algoritmeve të përdorura dhe optimizimeve që u implementuan, detajeve teknike për implementimin e komponentëve specifikë, zgjerimeve të mundshme dhe përmirësimeve për të ardhmen, eksperiencave dhe sfidave gjatë zhvillimit, ose rekomandimeve dhe sugjerimeve për përmirësim. Gjithashtu, jam i gatshëm të shpjegoj çdo pjesë të projektit në më shumë detaje nëse ka nevojë ose interes.

---

## SLIDE 20: DEMONSTRIM I PLATFORMËS

**Demonstrim live i platformës:**

- **Dashboard interaktiv** - Shfaqja e dashboard-it me të gjitha funksionalitetet
- **Funksionalitetet kryesore** - Kërkim, filtrim, renditje në veprim
- **AI tools në veprim** - Analizë AI, gjenerim titujsh, shpjegim score
- **Vizualizimet dhe grafe** - Grafe interaktive dhe eksplorim i të dhënave
- **Analiza e videove** - Analizë e videove individuale në kohë reale
- **Statistikat globale** - Shfaqja e statistikave dhe krahasimeve

**Qëllimi:** Të shohim platformën në veprim dhe të demonstrojmë vlerën praktike dhe funksionalitetin e plotë të saj.

**Çfarë të thuash:**
Tani do të demonstroj platformën në veprim për të treguar funksionalitetin e plotë dhe vlerën praktike të saj. Do të shohim dashboard-in interaktiv me të gjitha funksionalitetet, kërkimin dhe filtrimin e videove, AI tools në veprim duke gjeneruar insights dhe rekomandime, vizualizimet dhe grafe interaktive që lejojnë eksplorim të detajuar të të dhënave, analizën e videove individuale në kohë reale, dhe statistikat globale që ofrojnë një pasqyrë të gjerë të trendeve. Qëllimi është të shohim platformën në veprim dhe të demonstrojmë se si funksionon në praktikë dhe çfarë vlere ofron për përdoruesit.

