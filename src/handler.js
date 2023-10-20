/* eslint-disable indent */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */

const books = require('./books')
const { nanoid } = require('nanoid')

const percobaanGet = () => ({
    status: 'success',
    message: 'percobaan awal cek API di GET /'
})

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
    const filteredBooks = books.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }))

    return ({
        status: 'success',
        data: {
            books: filteredBooks
        }
    })
}

const getDetailBooks = (request, h) => {
    const { bookId } = request.params
    const book = books.filter(index => index.id === bookId)[0]
    console.log(book)
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

const editBookById = (request, h) => {
    const { bookId } = request.params
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

    const index = books.filter((book) => book.bookId === bookId)

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
    } else if (index !== -1) {
        books[index] = {
            ...books[index],
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

module.exports = { percobaanGet, addBooksHandler, getAllBooks, getDetailBooks, editBookById }
