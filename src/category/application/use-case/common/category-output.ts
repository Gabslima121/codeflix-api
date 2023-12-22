import { Category } from "../../../domain/category.entity";

export type CategoryOutput = {
  category_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

export class CategoryOutputMapper {
  static toOutput(entity: Category): CategoryOutput {
    const { category_id, ...rest } = entity.toJSON();

    return {
      category_id: category_id,
      ...rest,
    };
  }
}
