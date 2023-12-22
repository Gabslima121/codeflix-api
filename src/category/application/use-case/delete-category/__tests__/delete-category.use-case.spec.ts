import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../delete-category.use-case";

describe("DeleteCategoryUseCase Unit Tests", () => {
  let deleteCategoryUseCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    deleteCategoryUseCase = new DeleteCategoryUseCase(repository);
  });

  test("should throw error when entity not found with fake id", async () => {
    await expect(() =>
      deleteCategoryUseCase.execute({
        id: "fake id",
      })
    ).rejects.toThrow(new InvalidUuidError());
  });

  test("should throw error when entity not found with invalid id", async () => {
    const categoryId = new Uuid();

    await expect(() =>
      deleteCategoryUseCase.execute({
        id: categoryId.id,
      })
    ).rejects.toThrow(new NotFoundError(categoryId.id, Category));
  });

  test("should delete a category", async () => {
    const item = [Category.fake().aCategory().build()];

    repository.items = item;

    await deleteCategoryUseCase.execute({
      id: item[0].category_id.id,
    });

    expect(repository.items).toHaveLength(0);
  });
});
