import { isValidInputs } from "../utils/validations";

import { Category } from "../models";

import { CATEGORY_STATUS } from "../common/status";

import BadRequestError from "../error/BadRequestError";
import NotFoundError from "../error/NotFoundError";

export const getCategories = async (): Promise<Category[]> => {
    const categories: Category[] = await Category.findAll({ where: { status: CATEGORY_STATUS.ENABLED.id } });
    return categories;
};

export const getCategory = async (resource_id: string | undefined): Promise<Category> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id is required");
    }
    const category: Category | null = await Category.findOne({
        where: { resource_id, status: CATEGORY_STATUS.ENABLED.id },
    });

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    return category;
};

export const createCategory = async ({
    name,
    description,
    status = CATEGORY_STATUS.ENABLED.id,
}: Category): Promise<Category> => {
    if (isValidInputs({ name, description })) {
        throw new BadRequestError("Invalid input data");
    }

    const newCategory = await Category.create({ name, description, status });
    return newCategory;
};

export const updateCategory = async (
    resource_id: string | undefined,
    { name, description, status = CATEGORY_STATUS.ENABLED.id }: Category
): Promise<Category> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id is required");
    }

    if (isValidInputs({ name, description })) {
        throw new BadRequestError("Invalid input data");
    }

    const category: Category | null = await Category.findOne({ where: { resource_id } });

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    category.name = name;
    category.description = description;
    category.status = status;
    await category.save();

    return category;
};

export const deleteCategory = async (resource_id: string | undefined): Promise<Category> => {
    if (!resource_id) {
        throw new BadRequestError("Resource id is required");
    }

    const category: Category | null = await Category.findOne({ where: { resource_id } });

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    category.status = CATEGORY_STATUS.DISABLED.id;
    await category.save();
    console.log(category);

    return category;
};
