import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setUpSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe("UpdateCategoryUseCase Integration Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setUpSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    const categoryId = new Uuid();
    await expect(() =>
      useCase.execute({ id: categoryId.id, name: "fake" })
    ).rejects.toThrow(new NotFoundError(categoryId.id, Category));
  });

  it("should update a category", async () => {
    const entity = Category.fake().aCategory().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.category_id.id,
      name: "test",
    });

    expect(output).toStrictEqual({
      category_id: entity.category_id.id,
      name: "test",
      description: entity.description,
      is_active: true,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        category_id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        category_id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          category_id: entity.category_id.id,
          name: "test",
          description: "some description",
        },
        expected: {
          category_id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          category_id: entity.category_id.id,
          name: "test",
        },
        expected: {
          category_id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          category_id: entity.category_id.id,
          name: "test",
          is_active: false,
        },
        expected: {
          category_id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          category_id: entity.category_id.id,
          name: "test",
        },
        expected: {
          category_id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          category_id: entity.category_id.id,
          name: "test",
          is_active: true,
        },
        expected: {
          category_id: entity.category_id.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          category_id: entity.category_id.id,
          name: "test",
          description: null,
          is_active: false,
        },
        expected: {
          category_id: entity.category_id.id,
          name: "test",
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.category_id,
        ...(i.input.name && { name: i.input.name }),
        ...("description" in i.input && { description: i.input.description }),
        ...("is_active" in i.input && { is_active: i.input.is_active }),
      });
      const entityUpdated = await repository.findById(
        new Uuid(i.input.category_id)
      );
      expect(output).toStrictEqual({
        category_id: entity.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: entityUpdated!.created_at,
      });
      expect(entityUpdated!.toJSON()).toStrictEqual({
        category_id: entity.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: entityUpdated!.created_at,
      });
    }
  });
});
