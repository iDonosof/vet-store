import { Request, Response } from "express";

import { validateStringInputs } from "../utils/validations";

import { Category } from "../models";

import { CATEGORY_STATUS } from "../common/status";

export const getCategories = async (_: Request, res: Response): Promise<void> => {
    const categories: Category[] = await Category.findAll({ where: { status: CATEGORY_STATUS.ENABLED.id } });
    res.status(200).json(categories);
};

export const getCategory = async (req: Request, res: Response): Promise<void> => {
    const { resource_id } = req.params;
    if (!resource_id) {
        res.status(400).json({ error: "Missing id" });
        return;
    }
    const category: Category | null = await Category.findOne({
        where: { resource_id, status: CATEGORY_STATUS.ENABLED.id },
    });

    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }

    res.json(category);
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    const { name, description, status = CATEGORY_STATUS.ENABLED.id }: Category = req.body;

    try {
        validateStringInputs({ name, description });
    } catch (e) {
        if (e instanceof Error) {
            res.status(400).json({ error: e.message });
        }
        return;
    }

    const newCategory = await Category.create({ name, description, status });
    res.status(201).json(newCategory);
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    const { resource_id } = req.params;
    const { name, description, status = CATEGORY_STATUS.ENABLED.id }: Category = req.body;

    if (!resource_id) {
        res.status(400).json({ error: "Missing id" });
        return;
    }

    try {
        validateStringInputs({ name, description });
    } catch (e) {
        if (e instanceof Error) {
            res.status(400).json({ error: e.message });
        }
        return;
    }

    let category: Category | null = null;

    category = await Category.findOne({ where: { resource_id } });

    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }

    category.name = name;
    category.description = description;
    category.status = status;
    await category.save();

    res.status(200).json({ message: "Category updated successfully" });
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const { resource_id } = req.params;

    if (!resource_id) {
        res.status(400).json({ error: "Missing id" });
        return;
    }

    let category: Category | null = null;
    category = await Category.findOne({ where: { resource_id } });

    if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
    }

    category.status = CATEGORY_STATUS.DISABLED.id;
    await category.save();
    console.log(category);

    res.status(200).json({ message: "Category deleted successfully" });
};
