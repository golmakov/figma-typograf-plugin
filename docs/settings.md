# Настройки типографа

## Документация

[Поддерживаемые библиотекой правила](https://github.com/typograf/typograf/blob/dev/docs/RULES.ru.md)

[Включение/отключение и изменение настроек правил](https://github.com/typograf/typograf/blob/dev/docs/api_rules.md)


## Поддерживаемые в плагине настройки

**Язык**
Авто, Английский, Русский и т.д.
https://github.com/typograf/typograf/blob/dev/docs/api_localization.md

**Кавычки** Внутренние, внешние

**Замена дробей** ```common/number/fraction``` 1/2 → ½, 1/4 → ¼, 3/4 → ¾
https://github.com/typograf/typograf/blob/dev/src/rules/common/number/fraction.js

**Замена математических символов** ```common/number/mathSigns``` != → ≠, <= → ≤, >= → ≥, ~= → ≅, +- → ±
https://github.com/typograf/typograf/blob/dev/src/rules/common/number/mathSigns.js

**Знак рубля** ```ru/money/ruble``` 1 руб. → 1 ₽
https://github.com/typograf/typograf/blob/dev/src/rules/ru/money/ruble.js

**Замена точки на запятую в числах** ```ru/number/comma```
https://github.com/typograf/typograf/blob/dev/src/rules/ru/number/comma.js

