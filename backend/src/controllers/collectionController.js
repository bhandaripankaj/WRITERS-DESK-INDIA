import Collection from '../models/Collection.js'

export const getAllCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: -1 })
    res.json(collections)
  } catch (error) {
    console.error('Error fetching collections:', error)
    res.status(500).json({ message: 'Failed to fetch collections' })
  }
}

export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' })
    }

    res.json(collection)
  } catch (error) {
    console.error('Error fetching collection:', error)
    res.status(500).json({ message: 'Failed to fetch collection' })
  }
}

export const createCollection = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    const collection = new Collection({
      name,
      description
    })

    await collection.save()

    res.status(201).json({
      message: 'Collection created successfully',
      collection
    })
  } catch (error) {
    console.error('Error creating collection:', error)
    if (error.code === 11000) {
      res.status(400).json({ message: 'Collection name already exists' })
    } else {
      res.status(500).json({ message: 'Failed to create collection' })
    }
  }
}

export const updateCollection = async (req, res) => {
  try {
    const updates = req.body
    const collection = await Collection.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' })
    }

    res.json({
      message: 'Collection updated successfully',
      collection
    })
  } catch (error) {
    console.error('Error updating collection:', error)
    if (error.code === 11000) {
      res.status(400).json({ message: 'Collection name already exists' })
    } else {
      res.status(500).json({ message: 'Failed to update collection' })
    }
  }
}

export const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id)

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' })
    }

    res.json({ message: 'Collection deleted successfully' })
  } catch (error) {
    console.error('Error deleting collection:', error)
    res.status(500).json({ message: 'Failed to delete collection' })
  }
}