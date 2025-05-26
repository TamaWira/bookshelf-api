const { nanoid } = require("nanoid");

const pick = require("./utils/pick");
const books = require("./books");

// 1. Menyimpan buku
const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validasi kolom 'name'
  if (!name || name === "") {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });

    response.code(400);
    return response;
  }

  // Validasi 'readPage'
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // Validasi buku tidak ditemukan di 'database'
  if (!isSuccess) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Coba lagi",
    });

    response.code(400);
    return response;
  }

  // Response berhasil
  const response = h.response({
    status: "success",
    message: "Buku berhasil ditambahkan",
    data: {
      bookId: id,
    },
  });

  response.code(201);
  return response;
};

// 2. Menampilkan seluruh buku
const getAllBooks = (request, h) => {
  if (!books) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  const { name, reading, finished } = request.query;
  let booksCopy = JSON.parse(JSON.stringify(books));

  // Filter name
  if (name) {
    booksCopy = booksCopy.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter reading
  if (reading) {
    if (reading === "0") {
      booksCopy = booksCopy.filter((book) => !book.reading);
    } else if (reading === "1") {
      booksCopy = booksCopy.filter((book) => book.reading);
    }
  }

  // Filter finished
  if (finished) {
    if (finished === "0") {
      booksCopy = booksCopy.filter((book) => !book.finished);
    } else if (finished === "1") {
      booksCopy = booksCopy.filter((book) => book.finished);
    }
  }

  const response = h.response({
    status: "success",
    data: {
      books: booksCopy.map((book) => pick(book, "id", "name", "publisher")),
    },
  });

  response.code(200);
  return response;
};

// 3. Menampilkan detail buku
const getBookById = (request, h) => {
  const { id } = request.params;
  const book = books.find((item) => item.id === id);

  // Validasi keberadaan buku
  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  // Response berhasil
  const response = h.response({
    status: "success",
    data: {
      book,
    },
  });

  response.code(200);
  return response;
};

// 4. Mengubah data buku
const updateBook = (request, h) => {
  const { id } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validasi kolom 'name'
  if (!name || name === "") {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });

    response.code(400);
    return response;
  }

  // Validasi 'readPage'
  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });

    response.code(400);
    return response;
  }

  let book = books.find((item) => item.id === id);

  // Validasi keberadaan buku
  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  // Update buku
  book = {
    ...book,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt: new Date().toISOString(),
  };

  const bookIndex = books.findIndex((item) => item.id === id);
  books[bookIndex] = book;

  // Server berhasil
  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });

  response.code(200);
  return response;
};

// 5. Menghapus buku
const deleteBook = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);

  // Validasi keberadaan buku
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });

    response.code(404);
    return response;
  }

  books.splice(index, 1);

  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });

  response.code(200);
  return response;
};

module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };
