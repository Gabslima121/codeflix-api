import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { setUpSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { GetCategoryUseCase } from "../get-category.use-case";

describe("GetCategoryUseCase Integration Tests", () => {
  let getCategoryUseCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setUpSequelize({
    models: [CategoryModel],
  });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    getCategoryUseCase = new GetCategoryUseCase(repository);
  });

  test("should throws error when entity not found", async () => {
    const uuid = new Uuid();

    await expect(() =>
      getCategoryUseCase.execute({ id: uuid.id })
    ).rejects.toThrow(new NotFoundError(uuid, Category));
  });

  test("should returns a category", async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);

    const output = await getCategoryUseCase.execute({
      id: category.category_id.id,
    });

    expect(output).toStrictEqual({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
