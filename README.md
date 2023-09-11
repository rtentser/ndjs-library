1. запрос(ы) для вставки данных минимум о двух книгах в коллекцию books

```
db.books.insertMany([
    {
        title: "Book1",
        description: "Description1",
        authors: "Author1"
    },
    {
        title: "Book2",
        description: "Description2",
        authors: "Author2"
    }
])
```

2. запрос для поиска полей документов коллекции books по полю title

```
db.books.find(
    { title: "Book"},
    { description: 1, authors: 1}
)
```

3. запрос для редактирования полей: description и authors коллекции books по \_id записи.

```
db.books.updateOne(
    { _id: "id" },
    { $set: {description: "Description", authors: "Author"} }
)
```
