import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category unit tests", () => {
  let validateSpy: any;

  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });

  describe("category constructor", () => {
    test("constructor - it should create a new category with name only", () => {
      const category = new Category({
        name: "Movie",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("constructor - it should create a new category with all values ", () => {
      const created_at = new Date();

      const category = new Category({
        name: "Movie",
        is_active: false,
        created_at,
        description: "Movie description",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("constructor - it should create with name and description only", () => {
      const category = new Category({
        name: "Movie",
        description: "Movie description",
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });

  describe("create category command", () => {
    test("create command - should create a category with name only", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");
      expect(category.name).not.toBeNull();
      expect(category.name).not.toBeUndefined();
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.created_at).not.toBeNull();
      expect(category.created_at).not.toBeUndefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("create command - should create category with description", () => {
      const category = Category.create({
        name: "Movie",
        description: "Movie description",
      });

      expect(category.name).toBe("Movie");
      expect(category.name).not.toBeNull();
      expect(category.name).not.toBeUndefined();
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.created_at).not.toBeNull();
      expect(category.created_at).not.toBeUndefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("create command - should create category with is_active", () => {
      const category = Category.create({
        name: "Movie",
        is_active: false,
      });

      expect(category.name).toBe("Movie");
      expect(category.name).not.toBeNull();
      expect(category.name).not.toBeUndefined();
      expect(category.description).toBeNull();
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(category.created_at).not.toBeNull();
      expect(category.created_at).not.toBeUndefined();
      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("category functions", () => {
    test("changeName - should change category name", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");

      category.changeName("New Movie");

      expect(category.name).toBe("New Movie");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    test("changeDescription - should change category description", () => {
      const category = Category.create({
        name: "Movie",
        description: "Category Description",
      });

      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Category Description");

      category.changeDescription("New Category Description");

      expect(category.name).toBe("Movie");
      expect(category.description).toBe("New Category Description");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    test("activate - should activate category", () => {
      const category = new Category({
        name: "Movie",
        is_active: false,
      });

      expect(category.is_active).toBeFalsy();

      category.activate();
      expect(category.is_active).toBeTruthy();
    });

    test("deactivate - should deactivate category", () => {
      const category = new Category({
        name: "Movie",
      });

      expect(category.is_active).toBeTruthy();

      category.deactivate();
      expect(category.is_active).toBeFalsy();
    });
  });

  describe("category id", () => {
    const arrange = [
      {
        category_id: null,
      },
      {
        category_id: undefined,
      },
      {
        category_id: new Uuid(),
      },
    ];

    test.each(arrange)("id = %j", ({ category_id }) => {
      const category = new Category({
        name: "Movies",
        category_id: category_id as any,
      });

      if (category_id instanceof Uuid) {
        expect(category.category_id).toBeInstanceOf(Uuid);
      }
    });
  });

  describe("category validator", () => {
    test("create category null name -> should an invalid category with name property", () => {
      expect(() => Category.create({ name: null })).containsErrorMessage({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    });

    test("create category empty name -> should an invalid category with name property", () => {
      expect(() => Category.create({ name: "" })).containsErrorMessage({
        name: ["name should not be empty"],
      });
    });

    test("create category long name -> should an invalid category with name property", () => {
      expect(() =>
        Category.create({ name: "t".repeat(256) })
      ).containsErrorMessage({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    test("create category number name -> should an invalid category with name property", () => {
      expect(() => Category.create({ name: 5 as any })).containsErrorMessage({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    });

    test("create category null description -> should an invalid category with description property", () => {
      expect(() =>
        Category.create({ name: "Movie", description: null })
      ).containsErrorMessage({
        description: [
          "description should not be empty",
          "description must be a string",
          "description must be shorter than or equal to 255 characters",
        ],
      });
    });

    test("create category number description -> should an invalid category with description property", () => {
      expect(() =>
        Category.create({ name: "Movie", description: 5 as any })
      ).containsErrorMessage({
        description: ["description must be a string"],
      });
    });

    test("create category number is_active -> should an invalid category with is_active property", () => {
      expect(() =>
        Category.create({ name: "Movie", is_active: 5 as any })
      ).containsErrorMessage({
        is_active: ["is_active must be a boolean value"],
      });
    });

    test("changeName function -> should an invalid category with null name", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");

      expect(() => category.changeName(null)).containsErrorMessage({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    });

    test("changeName function -> should an invalid category with number name", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");

      expect(() => category.changeName(5 as any)).containsErrorMessage({
        name: [
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    });

    test("changeName function -> should an invalid category with empty name", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");

      expect(() => category.changeName("")).containsErrorMessage({
        name: ["name should not be empty"],
      });
    });

    test("changeName function -> should an invalid category with long name", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");

      expect(() => category.changeName("t".repeat(256))).containsErrorMessage({
        name: ["name must be shorter than or equal to 255 characters"],
      });
    });

    test("changeDescription function -> should an invalid null description", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");

      expect(() => category.changeDescription(null)).containsErrorMessage({
        description: [
          "description should not be empty",
          "description must be a string",
          "description must be shorter than or equal to 255 characters",
        ],
      });
    });

    test("changeDescription function -> should an invalid empty description", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");

      expect(() => category.changeDescription("")).containsErrorMessage({
        description: ["description should not be empty"],
      });
    });

    test("changeDescription function -> should an invalid number description", () => {
      const category = Category.create({
        name: "Movie",
      });

      expect(category.name).toBe("Movie");

      expect(() => category.changeDescription(5 as any)).containsErrorMessage({
        description: ["description must be a string"],
      });
    });
  });
});
