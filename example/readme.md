## Схема
`createSchema` должен возвращать класс, который на вход принимает
документ коллекции и автоматически заполняет свойства исходя из заданной
схемы.

Также, эта схема должна иметь метод, который позволяет конвертировать текущее
представление в документ коллекции исходя из схемы.

> Запретить использование `name` сразу в нескольких полях так как при 
> конвертации в документ это приведёт к неожиданным последствиям.

Сгенерированную схему можно использовать как тип для любых полей при 
генерации любой другой схемы.

```typescript
import {createSchema} from 'mongo-orm';

const User = createSchema({
  userId: Number, // or () => Number
});
```

```typescript
const User = createSchema({
  userId: {
    type: Number, // or () => Number
  },
});
```

```typescript
import {ValueProcessor} from 'mongo-orm';

const NumberToString = new ValueProcessor<string, number>(
  value => {
    if (typeof value !== 'number') {
      throw new Error('Unexpected value: ' + value);
    }
    return value.toString();
  },
  value => {
    const dbValue = parseInt(value);
    
    if (Number.isNaN(dbValue)) {
      throw new Error('Unable to convert to db value: ' + value);
    }
    return dbValue;
  }
);

const User = createSchema({
  userId: NumberToString, // or () => NumberToString
});
```