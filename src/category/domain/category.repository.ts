import { IRepository } from "../../shared/domain/repository/repositoy-interface";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "./category.entity";

//armazenamento only
export interface CategoryRepository extends IRepository<Category, Uuid> {}
