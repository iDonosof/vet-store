import { Request, Response } from "express";
import { Op } from "sequelize";

import { isValidInputs } from "../utils/validations";

import { Product } from "../models";

import { MINIMUM_PRICE_ALLOWED, MINIMUM_STOCK_ALLOWED } from "../common/constants";

export const getProducts = async (_: Request, res: Response): Promise<void> => {
    const products: Product[] = await Product.findAll({
        where: {
            stock: {
                [Op.gt]: MINIMUM_STOCK_ALLOWED,
            },
        },
    });

    res.json(products);
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    const { resource_id } = req.params;

    if (!resource_id) {
        res.status(400).json({ message: "Missing id" });
        return;
    }

    const product: Product | null = await Product.findOne({
        where: {
            resource_id,
        },
    });

    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    res.json(product);
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const {
        product_name,
        product_description = "",
        product_price = MINIMUM_PRICE_ALLOWED,
        category_id,
        stock = MINIMUM_STOCK_ALLOWED,
    }: Product = req.body;

    if (!isValidInputs({ product_name, product_price, category_id, stock })) {
        res.status(400).json({ error: "Invalid input data" });
        return;
    }

    const newProduct: Product = await Product.create({
        product_name,
        product_description,
        product_price,
        category_id,
        stock,
    });

    res.status(201).json(newProduct);
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { resource_id } = req.params;
    const {
        product_name,
        product_description = "",
        product_price = MINIMUM_PRICE_ALLOWED,
        category_id,
        stock = MINIMUM_STOCK_ALLOWED,
    }: Product = req.body;

    if (!isValidInputs({ product_name, product_price, category_id, stock })) {
        res.status(400).json({ error: "Invalid input data" });
        return;
    }

    const product: Product | null = await Product.findOne({ where: { resource_id } });

    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    product.product_name = product_name;
    product.product_description = product_description;
    product.product_price = product_price;
    product.category_id = category_id;
    product.stock = stock;

    await product.save();

    res.status(200).json(product);
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { resource_id } = req.params;

    const product: Product | null = await Product.findOne({ where: { resource_id } });

    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }

    product.stock = MINIMUM_STOCK_ALLOWED;

    await product.save();

    res.status(200).json(product);
};
