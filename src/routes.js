const {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/",
    handler: (request, h) => {
      return h.response("Hello World");
    },
  },
  // 1. Menyimpan buku
  {
    method: "POST",
    path: "/books",
    handler: addBook,
  },

  // 2. Menampilkan seluruh buku
  {
    method: "GET",
    path: "/books",
    handler: getAllBooks,
  },

  // 3. Menampilkan detail buku
  {
    method: "GET",
    path: "/books/{id}",
    handler: getBookById,
  },

  // 4. Mengubah data buku
  {
    method: "PUT",
    path: "/books/{id}",
    handler: updateBook,
  },

  // 5. Menghapus buku
  {
    method: "DELETE",
    path: "/books/{id}",
    handler: deleteBook,
  },
];

module.exports = routes;
