import { PaginationOutputMapper } from "../../../../shared/application/pagination-output";
import { IUseCase } from "../../../../shared/application/use-case.interface";
import { SortDirection } from "../../../../shared/domain/repository/search-params";
import {
  CategoryFilter,
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../domain/category.repository";
import { CategoryOutputMapper } from "../common/category-output";

export type ListCategoriesInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter;
};

export type ListCategoriesOutput = {};

export class ListCategoriesUseCase
  implements IUseCase<ListCategoriesInput, ListCategoriesOutput>
{
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(input: ListCategoriesInput): Promise<any> {
    const params = new CategorySearchParams(input);

    const searchResult = await this.categoryRepository.search(params);

    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategorySearchResult): ListCategoriesOutput {
    const { items: _items } = searchResult;

    const items = _items.map((item) => {
      return CategoryOutputMapper.toOutput(item);
    });

    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}
