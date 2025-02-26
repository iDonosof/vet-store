import { NextFunction, Request, Response } from "express";

import { isValidInputs } from "../utils/validations";

import { Category } from "../models";

import { CATEGORY_STATUS } from "../common/status";

import BadRequestError from "../error/BadRequestError";
import NotFoundError from "../error/NotFoundError";

export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const categories: Category[] = await Category.findAll({ where: { status: CATEGORY_STATUS.ENABLED.id } });
        res.status(200).json(categories);
    } catch (err) {
        next(err);
    }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { resource_id } = req.params;
        if (!resource_id) {
            throw new BadRequestError("Resource id is required");
        }
        const category: Category | null = await Category.findOne({
            where: { resource_id, status: CATEGORY_STATUS.ENABLED.id },
        });

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        res.json(category);
    } catch (err) {
        next(err);
    }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, description, status = CATEGORY_STATUS.ENABLED.id }: Category = req.body;

        if (isValidInputs({ name, description })) {
            throw new BadRequestError("Invalid input data");
        }

        const newCategory = await Category.create({ name, description, status });
        res.status(201).json(newCategory);
    } catch (err) {
        next(err);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { resource_id } = req.params;
        const { name, description, status = CATEGORY_STATUS.ENABLED.id }: Category = req.body;

        if (!resource_id) {
            throw new BadRequestError("Resource id is required");
        }

        if (isValidInputs({ name, description })) {
            throw new BadRequestError("Invalid input data");
        }

        let category: Category | null = null;

        category = await Category.findOne({ where: { resource_id } });

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        category.name = name;
        category.description = description;
        category.status = status;
        await category.save();

        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { resource_id } = req.params;

        if (!resource_id) {
            throw new BadRequestError("Resource id is required");
        }

        let category: Category | null = null;
        category = await Category.findOne({ where: { resource_id } });

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        category.status = CATEGORY_STATUS.DISABLED.id;
        await category.save();
        console.log(category);

        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
};
