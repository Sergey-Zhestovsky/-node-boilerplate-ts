import { OpenAPIV3 as OpenAPI } from 'openapi-types';

export interface ISwaggerOptions {
  withSwagger: boolean;
  baseOpenAPI: Modify<Omit<OpenAPI.Document, 'paths'>, { components?: OpenAPI.ComponentsObject }>;
}

export type TDocument<T extends object = object> = Modify<
  OpenAPI.Document<T>,
  {
    tags: OpenAPI.TagObject[];
    servers: OpenAPI.ServerObject[];
    paths: OpenAPI.PathsObject<T>;
    components: Required<OpenAPI.ComponentsObject>;
    security: OpenAPI.SecurityRequirementObject[];
  }
>;

export type THttpMethods =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace';

export type TEndpoint = Modify<
  OpenAPI.OperationObject,
  { security?: Array<OpenAPI.SecurityRequirementObject | undefined> }
>;

export type TSchemaBuilder = (ref?: string) => OpenAPI.MediaTypeObject;

export interface IEditSchemaOptions {
  prefix?: string;
}

export interface IGetSchemaOptions extends IEditSchemaOptions {
  refOnly?: boolean;
}

export type TResponseObject = Partial<Omit<OpenAPI.ResponseObject, 'content'>> & {
  mediaType?: string;
};

export type TSchemaObject = Modify<
  OpenAPI.MediaTypeObject,
  { schema: OpenAPI.ReferenceObject | OpenAPI.SchemaObject }
>;
