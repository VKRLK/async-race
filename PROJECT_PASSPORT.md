# 🛠️ Passport проекта: Async Race

## 📌 Общее описание

**Async Race** — веб-приложение-симулятор гонок автомобилей, разработанный с использованием **React**, **TypeScript**, **Redux Toolkit**, **Vite**, и **Vitest**. Приложение позволяет создавать, редактировать, удалять и гонять автомобили. Также поддерживаются массовая генерация автомобилей и отображение победителей гонок.

## 🗂️ Структура проекта

src/
│
├── api/ // Работа с REST API
│ └── api.ts
│
├── components/ // Переиспользуемые UI-компоненты
│ ├── CarTrack/ // Отображение отдельного трека
│ ├── RaceControlPanel/ // Панель управления гонкой
│ └── CarEditor/ // Создание/редактирование автомобиля
│
├── pages/ // Страницы (роуты)
│ ├── GaragePage/ // Основная страница с гаражом
│ └── WinnersPage/ // Страница победителей
│
├── store/ // Redux Toolkit хранилище
│ ├── garage/ // Фича-слой для гаража
│ │ ├── actions.ts
│ │ ├── reducer.ts
│ │ ├── selectors.ts
│ │ ├── types.ts
│ ├── winners/ // Фича-слой для победителей
│ │ ├── reducer.ts
│ │ ├── actions.ts
│ │ ├── selectors.ts
│ │ ├── types.ts
│ ├── rootReducer.ts // Объединение редьюсеров
│ ├── index.ts // Конфигурация store
│ └── hooks.ts // Typed хуки useDispatch/useSelector
│
├── utils/
│ └── helpers/
│ ├── generateRandomCarName.ts
│ ├── generateRandomColor.ts
│ └── index.ts

## ⚙️ Технологии

- **React** + **TypeScript**
- **Redux Toolkit**
- **Vite** — сборка
- **Vitest** — тестирование
- **SCSS modules** — стилизация компонентов

## 🚗 Основной функционал

- 📥 Получение и отображение списка автомобилей (`fetchCars`)
- ➕ Создание автомобиля (`createCar`)
- 🛠️ Редактирование автомобиля (`updateCar`)
- ❌ Удаление автомобиля (`deleteCar`)
- 🎲 Массовая генерация случайных автомобилей (`createRandomCars`)
- 🏁 Запуск и сброс гонки (включая управление мотором и анимацией)
- 🏆 Хранение и отображение победителей гонок (`fetchWinners`)
- 📄 Сброс состояния победителей (`resetWinners`)
- ⏱️ Фиксация времени старта и финиша гонки (`setStartTime`, `setFinishTime`)

## 🧠 Redux: Состояние гаража

```ts
interface GarageState {
  cars: CarType[];
  total: number;
  currentPage: number;
  editingCar: CarType | null;
  raceState: {
    status: 'idle' | 'starting' | 'resetting';
    page: number | null;
  };
}


type Winner = {
  id: number;
  startTime?: number;
  finishTime?: number;
};

interface WinnersState {
  winner: Record<number, Winner>;
  winnerList: WinnerType[];
  loading: boolean;
  error: string | null;
}


Тестирование
Используется Vitest

Компоненты и Redux-логика покрываются unit и thunk-тестами

📦 API-интеграция
Интеграция с REST API:

Автомобили:
GET /garage — список машин с поддержкой пагинации

POST /garage — создать машину

PUT /garage/:id — обновить машину

DELETE /garage/:id — удалить машину

Движок:
PATCH /engine?id=:id&status=started|stopped|drive — управление мотором

Победители:
GET /winners — получить список победителей (без пагинации на текущий момент)

POST /winners — добавить победителя

PUT /winners/:id — обновить данные победителя

GET /winners/:id — получить конкретного победителя

🧭 Особенности реализации
🚫 Включено отключение кэша fetch, чтобы видеть актуальные запросы в браузере и на бэкенде.

⏮️ При возврате на страницу через "назад" не происходит повторной загрузки — используется useEffect с зависимостью page.

🧹 При переходе между страницами состояние гонки и победителей сбрасывается.

📈 Планируемое расширение
🔢 Пагинация по 7 машин (уже реализована в GaragePage)

🥇 Таблица победителей с пагинацией и сортировкой

📊 Анимации победителей и интерактивный трек

🌐 Деплой на GitHub Pages

```
