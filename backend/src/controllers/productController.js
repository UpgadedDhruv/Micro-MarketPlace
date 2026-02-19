import Product from '../models/Product.js';
import User from '../models/User.js';

export const getProducts = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const limit = Number.parseInt(req.query.limit, 10) || 10;
    const search = (req.query.search || '').trim();

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    res.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { title, price, description, image } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: 'Price must be a non-negative number' });
    }

    const product = await Product.create({
      title: title.trim(),
      price: numericPrice,
      description: description || '',
      image: image || '',
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updates = {};
    const { title, price, description, image } = req.body;

    if (title !== undefined) {
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ message: 'Title must be a non-empty string' });
      }
      updates.title = title.trim();
    }

    if (price !== undefined) {
      const numericPrice = Number(price);

      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ message: 'Price must be a non-negative number' });
      }

      updates.price = numericPrice;
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (image !== undefined) {
      updates.image = image;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productId = req.params.id;

    if (!user.favorites.some((favId) => favId.toString() === productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productId = req.params.id;
    const before = user.favorites.length;

    user.favorites = user.favorites.filter((favId) => favId.toString() !== productId);

    if (user.favorites.length !== before) {
      await user.save();
    }

    res.status(200).json({ favorites: user.favorites });
  } catch (err) {
    next(err);
  }
};

export const getMyFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ items: user.favorites });
  } catch (err) {
    next(err);
  }
};

