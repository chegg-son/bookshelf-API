/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */

const books = require('./books')
const { nanoid } = require('nanoid')

const percobaanGet = () => ({
    status: 'success',
    message: 'percobaan awal cek API di GET /'
})

// method POST
const addBooksHandler = (request, h) => {
    const idBooks = nanoid(16)
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
    const insertedAt = new Date().toISOString()

    const updatedAt = insertedAt
    const isFinished = pageCount === readPage

    const newBooks = {
        id: idBooks, name, year, author, summary, publisher, pageCount, readPage, finished: isFinished, reading, insertedAt, updatedAt
    }

    books.push(newBooks)

    const isSuccess = books.filter((book) => book.id === idBooks).length > 0

    // apabila Client tidak melampirkan properti namepada request body
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
        // apabila nilai properti readPage yang lebih besar dari nilai properti pageCount
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    } else if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: idBooks
            }
        })
        response.code(201)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan'
    })

    response.code(500)
    return response
}

const getAllBooks = (request, h) => {
    const detailBooks = books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))
    // bagian opsional
    const { name, reading, finished } = request.params

    if (name) {
        const filteredName = books.filter(book =>
            book.name.toLowerCase().includes(name.toLowerCase())
        )

        return {
            status: 'success',
            data: { books: filteredName }
        }
    } else if (reading === 1) {
        const book = books.filter(n => n.reading === true)

        return {
            status: 'success',
            data: {
                books: book
            }
        }
    } else if (reading === 0) {
        const book = books.filter(n => n.reading === false)

        return {
            status: 'success',
            data: {
                books: book
            }
        }
    } else if (finished === 1) {
        const book = books.filter(n => n.readPage === n.pageCount)

        return {
            status: 'success',
            data: {
                books: book
            }
        }
    } else if (finished === 0) {
        const book = books.filter(n => n.readPage < n.pageCount)

        return {
            status: 'success',
            data: {
                books: book
            }
        }
    } else {
        // bagian mandatory getallbooks
        return ({
            status: 'success',
            data: {
                books: detailBooks
            }
        })
    }
}

// method GET
const getDetailBooks = (request, h) => {
    const { bookId } = request.params
    const book = books.filter(index => index.id === bookId)[0]

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
}

// method PUT
const editBookById = (request, h) => {
    const { bookId } = request.params
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    const book = books.findIndex(index => index.id === bookId)
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
        // apabila nilai properti readPage yang lebih besar dari nilai properti pageCount
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    } else if (book !== -1) {
        books[book] = {
            ...books[book],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

// bagian method DELETE
const deleteBookById = (request, h) => {
    const { bookId } = request.params
    const book = books.findIndex(n => n.id === bookId)
    const isFinished = books.filter(book => book.isFinished)

    if (isFinished === true) {
        books.splice(book, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    } else if (book !== -1) {
        books.splice(book, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

// const getByQuery = (request, h) => {
//     // bagian query
//     const { name, reading, finished } = request.query

//     if (name) {
//         const filteredBooks = books.filter(book =>
//             book.name.toLowerCase().includes(name.toLowerCase())
//         )

//         return {
//             status: 'success',
//             data: { books: filteredBooks }
//         }
//     } else if (reading === 1) {
//         const filteredBooks = books.filter(book =>
//             book.reading === true
//         )

//         return {
//             status: 'success',
//             data: { books: filteredBooks }
//         }
//     } else if (reading === 0) {
//         const filteredBooks = books.filter(book =>
//             book.reading === false
//         )

//         return {
//             status: 'success',
//             data: { books: filteredBooks }
//         }
//     }
// }

module.exports = { percobaanGet, addBooksHandler, getAllBooks, getDetailBooks, editBookById, deleteBookById }
