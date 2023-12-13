import { ISearchableRepository } from "../../shared/domain/repository/repositoy-interface";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";

//armazenamento only
export interface ICategoryRepository
  extends ISearchableRepository<Category, Uuid> {}
