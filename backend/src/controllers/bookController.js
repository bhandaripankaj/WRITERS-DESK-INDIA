import Book from '../models/Book.js'

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .populate('categories', 'name')
      .populate('collections', 'name')

    res.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ message: 'Failed to fetch books' })
  }
}

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('categories', 'name')
      .populate('collections', 'name')

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json(book)
  } catch (error) {
    console.error('Error fetching book:', error)
    res.status(500).json({ message: 'Failed to fetch book' })
  }
}

export const createBook = async (req, res) => {
  try {
    const { title, author, subject, description, price, categories, collections, cover, identificationNumber, publishDate, publisher, pages, language, stock, status } = req.body

    if (!title || !author || !subject || !categories || !collections || !cover) {
      return res.status(400).json({ message: 'Title, author, subject, categories, collections, and cover are required' })
    }

    const book = new Book({
      title,
      author,
      subject,
      description,
      price: price || 0,
      categories,
      collections,
      cover,
      identificationNumber,
      publishDate,
      publisher,
      pages,
      language,
      stock,
      status
    })

    await book.save()

    res.status(201).json({
      message: 'Book created successfully',
      book
    })
  } catch (error) {
    console.error('Error creating book:', error)
    res.status(500).json({ message: 'Failed to create book' })
  }
}

export const updateBook = async (req, res) => {
  try {
    const updates = req.body
    const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json({
      message: 'Book updated successfully',
      book
    })
  } catch (error) {
    console.error('Error updating book:', error)
    res.status(500).json({ message: 'Failed to update book' })
  }
}

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id)

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json({ message: 'Book deleted successfully' })
  } catch (error) {
    console.error('Error deleting book:', error)
    res.status(500).json({ message: 'Failed to delete book' })
  }
}
