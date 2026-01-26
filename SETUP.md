# 🚀 Instrukcja Instalacji StudyMate

## 📋 Wymagania Systemowe

Przed rozpoczęciem upewnij się, że masz zainstalowane:

### 1. **Node.js** (wersja 18.17 lub nowsza)
- 📥 Pobierz: https://nodejs.org/
- Wybierz wersję **LTS (Long Term Support)**
- Sprawdź instalację: `node --version` i `npm --version`

### 2. **Docker Desktop**
- 📥 Pobierz: https://www.docker.com/products/docker-desktop/
- Windows: Docker Desktop for Windows
- Mac: Docker Desktop for Mac
- Linux: Docker Engine + Docker Compose
- Po instalacji uruchom Docker Desktop

### 3. **Git**
- 📥 Pobierz: https://git-scm.com/downloads
- Sprawdź instalację: `git --version`

---

## 📦 Instalacja Projektu

### Krok 1: Sklonuj Repozytorium
```bash
git clone <URL_WASZEGO_REPO>
cd StudyMate
```

### Krok 2: Zainstaluj Zależności
```bash
npm install
```

**Zainstaluje to wszystkie potrzebne pakiety:**
- Next.js, React
- Prisma (ORM do bazy danych)
- NextAuth (autentykacja)
- AI SDKs (OpenAI, Google Gemini, Claude, Mistral, Cohere)
- Tailwind CSS
- i wiele innych...

---

## 🔧 Konfiguracja

### Krok 3: Plik .env

Stwórz plik `.env` w głównym folderze projektu:

```env
# Baza danych (nie zmieniaj - Docker sam to obsłuży)
DATABASE_URL=postgresql://studymate_user:studymate_pass@localhost:5432/studymate_db

# NextAuth (zostaw jak jest dla lokalnych testów)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=6WW9a01MKhx/Nov18c2E/HBldcPXvLZh+vPWI1CvESY=

# AI Providers (wybierz JEDEN i dodaj klucz)
AI_PROVIDER=openai

# Klucze API - potrzebujesz MINIMUM JEDNEGO
OPENAI_API_KEY=           # Twój klucz z https://platform.openai.com/
GEMINI_API_KEY=           # Twój klucz z https://aistudio.google.com/
CLAUDE_API_KEY=           # Twój klucz z https://console.anthropic.com/
MISTRAL_API_KEY=          # Twój klucz z https://console.mistral.ai/
COHERE_API_KEY=           # Twój klucz z https://dashboard.cohere.com/
```

**🔑 Gdzie zdobyć darmowe klucze API?**
- **OpenAI**: https://platform.openai.com/api-keys (5$ free credits dla nowych kont)
- **Google Gemini**: https://aistudio.google.com/app/apikey (DARMOWY!)
- **Claude**: https://console.anthropic.com/ (5$ free credits)
- **Mistral**: https://console.mistral.ai/ (free tier)
- **Cohere**: https://dashboard.cohere.com/ (100 req/min za darmo)

> 💡 **Rekomendacja**: Zacznij od **Google Gemini** - jest całkowicie darmowy i nie wymaga karty kredytowej!

---

## 🐳 Uruchomienie Bazy Danych

### Krok 4: Uruchom PostgreSQL przez Docker

```bash
docker-compose up -d
```

**To uruchomi:**
- PostgreSQL na porcie `5432`
- Kontener będzie działał w tle

**Sprawdź status:**
```bash
docker ps
```

Powinieneś zobaczyć kontener `studymate-db` jako `Up`.

---

## 🗄️ Setup Bazy Danych

### Krok 5: Zastosuj Migracje Prisma

```bash
npx prisma migrate deploy
```

**To stworzy wszystkie tabele:**
- User
- Note
- Flashcard
- Quiz
- QuizQuestion
- Stats
- Progress

### Krok 6: (Opcjonalnie) Dodaj przykładowe dane

```bash
npx prisma db seed
```

---

## ▶️ Uruchomienie Aplikacji

### Krok 7: Uruchom Development Server

```bash
npm run dev
```

**Aplikacja będzie dostępna pod:**
- 🌐 http://localhost:3001

**Co oznaczają komunikaty:**
- `✓ Ready` - serwer gotowy
- `○ Compiling` - kompilacja strony
- `✓ Compiled` - strona gotowa

---

## 🧪 Testowanie

### Rejestracja i Logowanie
1. Otwórz http://localhost:3001
2. Kliknij "Zarejestruj się"
3. Stwórz konto
4. Zaloguj się

### Testowanie AI
1. Stwórz notatkę (Notes → Nowy)
2. Dodaj treść
3. Kliknij "Generate Quiz" lub "More Flashcards"
4. System użyje skonfigurowanego AI providera

---

## 🛠️ Przydatne Komendy

### Zatrzymaj bazę danych
```bash
docker-compose down
```

### Przebuduj bazę (usuwa dane!)
```bash
docker-compose down -v
docker-compose up -d
npx prisma migrate deploy
```

### Build produkcyjny (test przed deploymentem)
```bash
npm run build
```

### Resetuj bazę danych (usuwa dane!)
```bash
npx prisma migrate reset
```

### Otwórz Prisma Studio (GUI do bazy)
```bash
npx prisma studio
```
Dostęp: http://localhost:5555

---

## ❌ Rozwiązywanie Problemów

### Port 5432 zajęty
**Problem:** PostgreSQL już działa na porcie 5432

**Rozwiązanie:**
1. Zatrzymaj lokalny PostgreSQL
2. LUB zmień port w `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Zmień 5432 na 5433
```
Wtedy w `.env` zmień:
```env
DATABASE_URL=postgresql://studymate_user:studymate_pass@localhost:5433/studymate_db
```

### Port 3001 zajęty
**Rozwiązanie:** Zmień port w `package.json`:
```json
"dev": "next dev -p 3002"
```

### Docker nie działa
**Sprawdź:**
1. Czy Docker Desktop jest uruchomiony?
2. `docker --version` - czy Docker jest zainstalowany?

### Błąd "No AI provider available"
**Rozwiązanie:**
1. Sprawdź plik `.env` - czy dodałeś klucz API?
2. Upewnij się, że `AI_PROVIDER` wskazuje na dostawcę, którego klucz masz
3. Uruchom ponownie serwer (`npm run dev`)

### Błędy migracji Prisma
**Rozwiązanie:**
```bash
npx prisma generate
npx prisma migrate deploy
```

---

## 📱 Funkcje Projektu

✅ **Notatki** - Tworzenie i zarządzanie notatkami  
✅ **Fiszki** - Generowanie AI + system SRS (Spaced Repetition)  
✅ **Quizy** - Generowanie AI + testy wiedzy  
✅ **Statystyki** - Śledzenie postępów  
✅ **Multi-AI** - 5 dostawców AI do wyboru  
✅ **PWA** - Działa offline jako aplikacja  

---

## 🆘 Potrzebujesz Pomocy?

1. Sprawdź logi w terminalu (`npm run dev`)
2. Sprawdź logi Dockera (`docker logs studymate-db`)
3. Napisz do zespołu 😊

---

## 📚 Dodatkowe Zasoby

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Docker Docs: https://docs.docker.com/
- Tailwind CSS: https://tailwindcss.com/docs

---

**Powodzenia! 🎓✨**
