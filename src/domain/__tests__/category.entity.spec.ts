import { Category } from "../category.entity";

describe("Category unit tests", () => {
  describe("constructor", () => {
    test("constructor - it should create a new category with name only", () => {
      const category = new Category({
        name: "Movie",
      });

      expect(category.category_id).toBeUndefined();
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

      expect(category.category_id).toBeUndefined();
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

      expect(category.category_id).toBeUndefined();
      expect(category.name).toBe("Movie");
      expect(category.description).toBe("Movie description");
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });
  });
});
