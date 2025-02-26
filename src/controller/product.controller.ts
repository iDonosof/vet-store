import { NextFunction, Request, Response } from "express";
import { Op } from "sequelize";

import { isValidInputs } from "../utils/validations";

import { Product } from "../models";

import { MINIMUM_PRICE_ALLOWED, MINIMUM_STOCK_ALLOWED } from "../common/constants";

import BadRequestError from "../error/BadRequestError";
import NotFoundError from "../error/NotFoundError";

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products: Product[] = await Product.findAll({
            where: {
                stock: {
                    [Op.gt]: MINIMUM_STOCK_ALLOWED,
                },
            },
        });

        res.json(products);
    } catch (err) {
        next(err);
    }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { resource_id } = req.params;

        if (!resource_id) {
            throw new BadRequestError("Resource id is required");
        }

        const product: Product | null = await Product.findOne({
            where: {
                resource_id,
            },
        });

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        res.json(product);
    } catch (err) {
        next(err);
    }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {
            product_name,
            product_description = "",
            product_price = MINIMUM_PRICE_ALLOWED,
            category_id,
            stock = MINIMUM_STOCK_ALLOWED,
        }: Product = req.body;

        if (!isValidInputs({ product_name, product_price, category_id, stock })) {
            throw new BadRequestError("Invalid input data");
        }

        const newProduct: Product = await Product.create({
            product_name,
            product_description,
            product_price,
            category_id,
            stock,
        });

        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { resource_id } = req.params;
        const {
            product_name,
            product_description = "",
            product_price = MINIMUM_PRICE_ALLOWED,
            category_id,
            stock = MINIMUM_STOCK_ALLOWED,
        }: Product = req.body;

        if (!isValidInputs({ product_name, product_price, category_id, stock })) {
            throw new BadRequestError("Invalid input data");
        }

        const product: Product | null = await Product.findOne({ where: { resource_id } });

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        product.product_name = product_name;
        product.product_description = product_description;
        product.product_price = product_price;
        product.category_id = category_id;
        product.stock = stock;

        await product.save();

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { resource_id } = req.params;

        const product: Product | null = await Product.findOne({ where: { resource_id } });

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        product.stock = MINIMUM_STOCK_ALLOWED;

        await product.save();

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};
