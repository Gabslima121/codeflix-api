import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryUseCase } from "../get-category.use-case";

describe("GetCategoryUseCase Unit Tests", () => {
  let getCategoryUseCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    getCategoryUseCase = new GetCategoryUseCase(repository);
  });

  test("should throw error when entity not found with fake id", async () => {
    await expect(() =>
      getCategoryUseCase.execute({
        id: "fake id",
      })
    ).rejects.toThrow(new InvalidUuidError());
  });

  test("should throw error when entity not found with invalid id", async () => {
    const categoryId = new Uuid();

    await expect(() =>
      getCategoryUseCase.execute({
        id: categoryId.id,
      })
    ).rejects.toThrow(new NotFoundError(categoryId.id, Category));
  });

  test("should get category", async () => {
    const categoryName: string = "Movie";
    const category: Category[] = [
      Category.fake()
        .aCategory()
        .withName(categoryName)
        .withDescription(null)
        .build(),
    ];

    repository.items = category;

    const spyFindById = jest.spyOn(repository, "findById");

    const outputCategory = await getCategoryUseCase.execute({
      id: category[0].category_id.id,
    });

    expect(spyFindById).toHaveBeenCalled();
    expect(spyFindById).toHaveBeenCalledTimes(1);

    expect(outputCategory).toStrictEqual({
      category_id: category[0].category_id.id,
      name: categoryName,
      description: null,
      is_active: true,
      created_at: category[0].created_at,
    });
  });
});
