/* eslint-disable indent */

const { percobaanGet, addBooksHandler, getAllBooks, getDetailBooks, editBookById, deleteBookById, getAllBooksByQuery } = require('./handler')

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: percobaanGet
    },
    {
        method: 'POST',
        path: '/books',
        handler: addBooksHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getDetailBooks
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: editBookById
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookById
    },
    {
        method: 'GET',
        path: '/books/',
        handler: getAllBooksByQuery
    }
]

module.exports = routes
