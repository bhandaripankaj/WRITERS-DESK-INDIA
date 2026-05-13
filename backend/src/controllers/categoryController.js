import Category from '../models/Category.js'
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ message: 'Failed to fetch categorie' })
  }
}
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    res.status(500).json({ message: 'Failed to fetch category' })
  }
}

export const createCategory = async (req, res) => {
  try {
    console.log('Received category creation request with data:', req.body)
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    // Get the file path if a file was uploaded
    const icon = req.file ? req.file.filename : null
       
    const category = new Category({
      name,
      description,
      icon
    })

    await category.save()

    res.status(201).json({
      message: 'Category created successfully',
      category
    })
  } catch (error) {
    console.error('Error creating category:', error)
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' })
    } else {
      res.status(500).json({ message: 'Failed to create category' })
    }
  }
}

export const updateCategory = async (req, res) => {
  try {
    const updates = req.body
    const category = await Category.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({
      message: 'Category updated successfully',
      category
    })
  } catch (error) {
    console.error('Error updating category:', error)
    if (error.code === 11000) {
      res.status(400).json({ message: 'Category name already exists' })
    } else {
      res.status(500).json({ message: 'Failed to update category' })
    }
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ message: 'Failed to delete category' })
  }
}