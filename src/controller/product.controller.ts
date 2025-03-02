import { Op } from "sequelize";

import { isValidInputs } from "../utils/validations";

import { Product } from "../models";

import { MINIMUM_PRICE_ALLOWED, MINIMUM_STOCK_ALLOWED } from "../common/constants";

import BadRequestError from "../error/BadRequestError";
import NotFoundError from "../error/NotFoundError";

export const getProducts = async (): Promise<Product[]> => {
    const products: Product[] = await Product.findAll({
        where: {
            stock: {
                [Op.gt]: MINIMUM_STOCK_ALLOWED,
            },
        },
    });
    return products;
};

export const getProduct = async (resource_id: string | undefined): Promise<Product> => {
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

    return product;
};

export const createProduct = async ({
    product_name,
    product_description = "",
    product_price = MINIMUM_PRICE_ALLOWED,
    category_id,
    stock = MINIMUM_STOCK_ALLOWED,
}: Product): Promise<Product> => {
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

    return newProduct;
};

export const updateProduct = async (
    resource_id: string | undefined,
    {
        product_name,
        product_description = "",
        product_price = MINIMUM_PRICE_ALLOWED,
        category_id,
        stock = MINIMUM_STOCK_ALLOWED,
    }: Product
): Promise<Product> => {
    if (!isValidInputs({ product_name, category_id })) {
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

    return product;
};

export const deleteProduct = async (resource_id: string | undefined): Promise<Product> => {
    const product: Product | null = await Product.findOne({ where: { resource_id } });

    if (!product) {
        throw new NotFoundError("Product not found");
    }

    product.stock = MINIMUM_STOCK_ALLOWED;

    await product.save();

    return product;
};
