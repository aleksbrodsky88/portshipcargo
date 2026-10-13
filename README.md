# PSCS — прототип сайта

Статический прототип (HTML + CSS + JS, без сборки и зависимостей).

## Запуск

```
cd %USERPROFILE%\Projects\pscs-prototype
node serve.js
```

Открыть: http://localhost:5173 (другой порт: `node serve.js 8080`).
Можно и просто дважды кликнуть `index.html` — всё работает и без сервера.

## Где что менять

| Что | Файл |
|---|---|
| Все тексты сайта (навигация, PORT/SHIP/CARGO, подход, команда, контакт, футер) | `js/content.js` |
| Логотип и email на будущее (`brand.logoSrc`, `contactDetails.email`) | `js/content.js` |
| Исходная палитра (4 базовых цвета), сила воды по умолчанию | `js/settings.js` → `DEFAULTS` |
| Производные оттенки (светлее/темнее, голубой, цвет текста) | `js/settings.js` → `derivePalette()` |
| Вёрстка, шрифты, отступы, CSS-переменные | `css/styles.css` |
| Композиция порт + судно + груз (SVG, запасной вариант, если фото hero нет) | `js/scene.js` |
| Фотографии: пути/размеры/alt (`IMG(...)`), оригиналы в `assets/originals/`, оптимизированные в `assets/img/<имя>-<ширина>.webp` | `js/content.js` |
| Вода (отражение и рябь, Canvas; выключена, пока hero — фотография) | `js/water.js` |
| Панель Customize preview | `js/customizer.js` + блок `<!-- CUSTOMIZER -->` в `index.html` |

Для клиентской версии панель удаляется: блок `<!-- CUSTOMIZER -->` в `index.html` и строка `js/customizer.js`.

## Панель Customize preview

Кнопка **Customize** в правом нижнем углу.

- Colours — фон, поверхности, бирюзовый и жёлтый акценты (остальные оттенки рассчитываются автоматически).
- Water — включение эффекта и сила реакции.
- Hero text — заголовок и подзаголовок (вставляются как обычный текст).
- Export JSON / Import JSON — сохранить и загрузить набор настроек. Некорректный файл ничего не ломает.
- Reset to original — вернуть исходный вид.
- Hide the Customize button — чистый просмотр. Вернуть: `Alt + Shift + C` или `#customize` в конце адреса.

Настройки сохраняются в этом браузере автоматически (localStorage).
