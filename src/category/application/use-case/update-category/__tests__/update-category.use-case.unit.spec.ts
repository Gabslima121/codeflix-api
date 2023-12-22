import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe("UpdateCategoryUseCase Unit Tests", () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id", name: "fake" })
    ).rejects.toThrow(new InvalidUuidError());

    const categoryId = new Uuid();

    await expect(() =>
      useCase.execute({ id: categoryId.id, name: "fake" })
    ).rejects.toThrow(new NotFoundError(categoryId.id, Category));
  });

  it("should throw an error when aggregate is not valid", async () => {
    const aggregate = new Category({ name: "Movie" });
    repository.items = [aggregate];
    await expect(() =>
      useCase.execute({
        id: aggregate.category_id.id,
        name: "t".repeat(256),
      })
    ).rejects.toThrowError("Validation Error");
  });

  it("should update a category", async () => {
    const spyUpdate = jest.spyOn(repository, "update");
    const entity = new Category({ name: "Movie" });
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.category_id.id,
      name: "test",
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      category_id: entity.category_id.id,
      name: "test",
      description: null,
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
          description: "some description",
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
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.category_id,
        ...("name" in i.input && { name: i.input.name }),
        ...("description" in i.input && { description: i.input.description }),
        ...("is_active" in i.input && { is_active: i.input.is_active }),
      });
      expect(output).toStrictEqual({
        category_id: entity.category_id.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
