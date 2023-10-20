/* eslint-disable indent */

const { percobaanGet, addBooksHandler, getAllBooks, getDetailBooks, editBookById } = require('./handler')

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
    }
]

module.exports = routes
