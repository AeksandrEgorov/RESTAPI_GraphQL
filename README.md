# REST API vs GraphQL

See projekt näitab REST API ja GraphQL erinevusi sama andmestiku põhjal.  
Rakendus kasutab mock-andmeid ning võimaldab töötada raamatute, autorite, kirjastuste ja arvustustega.

---

## Projekti eesmärk

Selle projekti eesmärk on võrrelda kahte lähenemist:

- REST API – mitu endpoint’i  
- GraphQL – üks endpoint  

Mõlemad kasutavad samu andmeid, et võrdlus oleks arusaadav.

---

## Kasutatud tehnoloogiad

- Node.js  
- Express  
- TypeScript  
- Swagger  
- GraphQL  
- Apollo Server  
- Faker  

---

## Käivitamine

npm install

npm run dev

---

## Serveri aadressid

REST API:  
http://localhost:3000/api/v1  

Swagger:  
http://localhost:3000/api-docs  

GraphQL:  
http://localhost:3000/graphql  

---

# REST API näited

## Kõigi raamatute küsimine

GET http://localhost:3000/api/v1/books

---

## Filtreeritud päring

GET http://localhost:3000/api/v1/books?title=the&language=English&page=1&limit=5

---

## Sorteerimine

GET http://localhost:3000/api/v1/books?sortBy=title&order=asc&page=1&limit=5

---

## Üks raamat

GET http://localhost:3000/api/v1/books/1

---

## Keeled

GET http://localhost:3000/api/v1/books/languages

---

## Review’d raamatu kohta

GET http://localhost:3000/api/v1/books/1/reviews

---

## Uue raamatu lisamine

POST http://localhost:3000/api/v1/books

Body:
```
{
  "title": "GraphQL Demo Book",
  "isbn": "1234567890",
  "publishedYear": 2026,
  "pageCount": 250,
  "language": "English",
  "description": "Demo book",
  "coverImage": "https://example.com/book.jpg",
  "genres": ["Programming", "Education"],
  "authorId": 1,
  "publisherId": 1
}
```
---

## Raamatu uuendamine

PUT http://localhost:3000/api/v1/books/1

Body:
```
{
  "title": "Updated Book Title",
  "language": "Estonian"
}
```
---

## Raamatu kustutamine

DELETE http://localhost:3000/api/v1/books/1

---

## Review lisamine

POST http://localhost:3000/api/v1/books/1/reviews

Body:
```
{
  "userName": "Aleksandr",
  "rating": 5,
  "comment": "Very good book"
}
```
---

# GraphQL näited

Endpoint:  
http://localhost:3000/graphql  

---

## Kõik raamatud
```
query {
  books(page: 1, limit: 5) {
    data {
      id
      title
      language
      publishedYear
    }
    total
    page
    limit
    totalPages
  }
}
```
---

## Filtriga
```
query {
  books(title: "the", language: "English") {
    data {
      id
      title
    }
  }
}
```
---

## Sorteerimine
```
query {
  books(sortBy: title, order: asc) {
    data {
      id
      title
    }
  }
}
```
---

## Üks raamat
```
query {
  book(id: 1) {
    id
    title
    isbn
    publishedYear
    language
  }
}
```
---

## Raamat koos andmetega
```
query {
  book(id: 1) {
    title
    author {
      firstName
      lastName
    }
    publisher {
      name
    }
    reviews {
      userName
      rating
      comment
    }
  }
}
```
---

## Autorid
```
query {
  authors {
    firstName
    lastName
    books {
      title
    }
  }
}
```
---

## Review’d
```
query {
  reviews(bookId: 1) {
    userName
    rating
    comment
  }
}
```
---

## Uus raamat
```
mutation {
  createBook(
    input: {
      title: "GraphQL Demo Book"
      isbn: "1234567890"
      language: "English"
    }
  ) {
    id
    title
  }
}
```
---

## Uuendamine
```
mutation {
  updateBook(
    id: 1
    input: {
      title: "Updated Book Title"
    }
  ) {
    id
    title
  }
}
```
---

## Kustutamine
```
mutation {
  deleteBook(id: 1)
}
```
---

## Review lisamine
```
mutation {
  createReview(
    input: {
      bookId: 1
      userName: "Aleksandr"
      rating: 5
      comment: "Very good book"
    }
  ) {
    id
    userName
    rating
  }
}
```
---

# REST vs GraphQL

REST API:
- mitu endpoint’i  
- server määrab vastuse  
- võib vajada mitu request’i  

GraphQL:
- üks endpoint  
- klient määrab väljad  
- saab ühe päringuga rohkem andmeid  

---

# Märkused

- kasutatakse mock-andmeid  
- andmed ei salvestu püsivalt  
- serveri restart kustutab muudatused  

---
