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

    // apabila Client tidak melampirkan properti namepada request body
    if (!name) {
        books.slice(newBooks, 1)
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
        // apabila nilai properti readPage yang lebih besar dari nilai properti pageCount
    }
    if (readPage > pageCount) {
        books.slice(newBooks, 1)
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    }

    books.push(newBooks)

    const isSuccess = books.filter((book) => book.id === idBooks).length > 0

    if (isSuccess) {
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
    const { name, reading, finished } = request.query

    if (name) {
        const filteredName = books.filter(book =>
            book.name.toLowerCase().includes(name.toLowerCase())
        )
        return {
            status: 'success',
            data: {
                books: filteredName.map(n => ({
                    id: n.id, name: n.name, publisher: n.publisher
                }))
            }
        }
    }

    let filteredBooks = books

    if (reading === '1' || reading === '0') {
        const isReading = reading === '1'
        filteredBooks = books.filter(book => book.reading === isReading)
    }

    if (finished === '1' || finished === '0') {
        const isFinished = finished === '1'
        filteredBooks = books.filter(book => (book.readPage === book.pageCount) === isFinished)
    }

    return {
        status: 'success',
        data: {
            books: filteredBooks.map(book => ({
                id: book.id, name: book.name, publisher: book.publisher
            }))
        }
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

module.exports = { percobaanGet, addBooksHandler, getAllBooks, getDetailBooks, editBookById, deleteBookById }
