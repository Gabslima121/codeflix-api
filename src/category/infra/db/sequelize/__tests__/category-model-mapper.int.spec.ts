import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model.mapper";
import { EntityValidatorError } from "../../../../../shared/domain/validators/validation.erro";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setUpSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModelMapper Integration Tests", () => {
  setUpSequelize({ models: [CategoryModel] });

  it("should thorws error when category is invalid", () => {
    const model = CategoryModel.build({
      category_id: "9366b7dc-2d71-4799-b91c-c64adb205104",
    });

    try {
      CategoryModelMapper.toEntity(model);

      fail(
        "The category is valid, but it needs throws a EntityValidationError"
      );
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidatorError);
      expect((error as EntityValidatorError).error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should convert a category model to a category entity", () => {
    const created_at = new Date();

    const model = CategoryModel.build({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });

    const entity = CategoryModelMapper.toEntity(model);

    expect(entity.toJSON()).toStrictEqual(
      new Category({
        category_id: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
        name: "some value",
        description: "some description",
        is_active: true,
        created_at,
      }).toJSON()
    );
  });

  test("should convert a category entity to a category model", () => {
    const created_at = new Date();

    const entity = new Category({
      category_id: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });

    const model = CategoryModelMapper.toModel(entity);

    expect(model.toJSON()).toStrictEqual({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
  });
});
