import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { setUpSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { DeleteCategoryUseCase } from "../delete-category.use-case";

describe("DeleteCategoryUseCase Unit Tests", () => {
  let deleteCategoryUseCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setUpSequelize({
    models: [CategoryModel],
  });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    deleteCategoryUseCase = new DeleteCategoryUseCase(repository);
  });

  test("should throw error when entity not found", async () => {
    const categoryId = new Uuid();

    await expect(() =>
      deleteCategoryUseCase.execute({
        id: categoryId.id,
      })
    ).rejects.toThrow(new NotFoundError(categoryId.id, Category));
  });

  test("should delete a category", async () => {
    const category: Category = Category.fake().aCategory().build();

    await repository.insert(category);

    await deleteCategoryUseCase.execute({
      id: category.category_id.id,
    });

    await expect(repository.findById(category.category_id)).resolves.toBeNull();
  });
});
