import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../category.entity";

describe("Category unit tests", () => {
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
    });
  });

  describe("category functions", () => {
    test("changeName - should change category name", () => {
      const category = new Category({
        name: "Movie",
      });
      expect(category.name).toBe("Movie");

      category.changeName("New Movie");
      expect(category.name).toBe("New Movie");
    });

    test("changeDescription - should change category description", () => {
      const category = new Category({
        name: "Movie",
        description: "Category Description",
      });

      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Category Description");

      category.changeDescription("New Category Description");
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("New Category Description");
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
});
