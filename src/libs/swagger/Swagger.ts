import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPIV3 as OpenAPI } from 'openapi-types';

import { appendArray, appendObject, getServerDomain } from '@/utils';
import { logger } from '../logger';
import {
  ISwaggerOptions,
  TDocument,
  THttpMethods,
  TEndpoint,
  TSchemaBuilder,
  IEditSchemaOptions,
  IGetSchemaOptions,
  TResponseObject,
  TSchemaObject,
} from './types';

export class Swagger {
  private static getOpenAPIBoilerplate(): TDocument {
    return {
      openapi: '3.0.2',
      info: {
        title: 'Swagger Boilerplate',
        version: '0.0.0',
      },
      tags: [],
      servers: [],
      paths: {},
      components: {
        schemas: {},
        responses: {},
        parameters: {},
        examples: {},
        requestBodies: {},
        headers: {},
        securitySchemes: {},
        links: {},
        callbacks: {},
      },
      security: [],
    };
  }

  private static buildSchemaName(name: string, prefix: string = '') {
    return `${prefix ? `${prefix}.` : ''}${name}`;
  }

  private static buildQuerySchemaName(name: string, prefix: string = '', key: string = '') {
    return `${prefix ? `${prefix}.` : ''}${name}.${key}`;
  }

  private readonly openAPI: TDocument;
  private resultResponseSchema?: TSchemaBuilder;
  private errorResponseSchema?: TSchemaBuilder;

  constructor(options: ISwaggerOptions) {
    this.openAPI = appendObject(Swagger.getOpenAPIBoilerplate(), options.baseOpenAPI);
    if (this.openAPI.servers.length === 0) this.openAPI.servers = [{ url: getServerDomain() }];
  }

  private findSchema(name: string) {
    // prettier-ignore
    return this.openAPI.components.schemas[name] as OpenAPI.ReferenceObject | OpenAPI.SchemaObject | undefined;
  }

  private getResponseSchema(builder?: TSchemaBuilder, name?: string): OpenAPI.MediaTypeObject {
    if (!name) {
      if (builder) return builder();
      return {};
    }

    const schema = this.findSchema(name);

    if (!schema) {
      logger.warn(`Swagger :: Can't find response schema on path '${name}'.`);
      if (builder) return builder();
      return {};
    }

    const ref = `#/components/schemas/${name}`;
    if (builder) return builder(ref);
    return { schema: { $ref: ref } };
  }

  private getResponseObject(
    builder?: TSchemaBuilder,
    name?: string | TResponseObject | true,
    responseObj?: TResponseObject | true
  ) {
    const resolvedName = typeof name === 'string' ? name : undefined;
    const resolvedRespObj = typeof name === 'object' ? name : responseObj;
    const response = this.getResponseSchema(builder, resolvedName);

    if (resolvedRespObj || name === true) {
      const obj: TResponseObject = typeof resolvedRespObj === 'object' ? resolvedRespObj : {};

      return {
        description: '',
        ...obj,
        content: {
          [obj.mediaType ?? 'application/json']: response,
        },
      };
    }

    return response;
  }

  setResultResponseSchema(builder: TSchemaBuilder | null) {
    this.resultResponseSchema = builder ?? undefined;
  }

  getResultResponse(name?: string): OpenAPI.MediaTypeObject;
  getResultResponse(name?: string, responseObj?: TResponseObject | true): OpenAPI.ResponseObject;
  getResultResponse(responseObj: TResponseObject | true): OpenAPI.ResponseObject;
  getResultResponse(
    name?: string | TResponseObject | true,
    responseObj?: TResponseObject | true
  ): OpenAPI.MediaTypeObject | OpenAPI.ResponseObject {
    return this.getResponseObject(this.resultResponseSchema, name, responseObj);
  }

  setErrorResponseSchema(builder: TSchemaBuilder | null) {
    this.errorResponseSchema = builder ?? undefined;
  }

  getErrorResponse(name?: string): OpenAPI.MediaTypeObject;
  getErrorResponse(name?: string, responseObj?: TResponseObject | true): OpenAPI.ResponseObject;
  getErrorResponse(responseObj: TResponseObject | true): OpenAPI.ResponseObject;
  getErrorResponse(
    name?: string | TResponseObject | true,
    responseObj?: TResponseObject | true
  ): OpenAPI.MediaTypeObject | OpenAPI.ResponseObject {
    return this.getResponseObject(this.errorResponseSchema, name, responseObj);
  }

  setTag(tag: string, description?: string): void;
  setTag(tag: OpenAPI.TagObject): void;
  setTag(tag: string | OpenAPI.TagObject, description: string = '') {
    const tagObj: OpenAPI.TagObject = typeof tag === 'string' ? { name: tag, description } : tag;
    appendArray(this.openAPI.tags, tagObj, (s, t) => s.name === t.name);
  }

  setEndpoint(method: THttpMethods, path: string, schema: TEndpoint) {
    if (schema.security) schema.security = schema.security.filter((v) => !!v);
    const pathObj: OpenAPI.PathsObject = { [path]: { [method]: schema } };

    if (this.openAPI.paths[path]) {
      logger.warn(`Swagger :: Endpoint on path '${path}' already exists.`);
    }

    appendObject(this.openAPI.paths, pathObj);
  }

  setSchema(name: string, schema: OpenAPI.SchemaObject, options?: IEditSchemaOptions) {
    const schemaObj: Record<string, OpenAPI.SchemaObject> = {
      [Swagger.buildSchemaName(name, options?.prefix)]: { title: name, ...schema },
    };

    if (this.findSchema(name)) {
      logger.warn(`Swagger :: Schema with name '${name}' already exists.`);
    }

    appendObject(this.openAPI.components.schemas, schemaObj);
  }

  getSchema(name: string, options?: IGetSchemaOptions): TSchemaObject {
    const fullName = Swagger.buildSchemaName(name, options?.prefix);
    const schema = this.findSchema(fullName);

    if (!schema) {
      logger.warn(`Swagger :: Can't find schema with name '${name}'.`);
      return { schema: {} };
    }

    return { schema: { $ref: `#/components/schemas/${fullName}` } };
  }

  setQuerySchema(
    name: string,
    schema: Record<string, OpenAPI.ParameterBaseObject>,
    options?: IEditSchemaOptions
  ) {
    const params: Record<string, OpenAPI.ParameterObject> = {};

    if (this.getQuerySchema(name).length > 0) {
      logger.warn(`Swagger :: Query schema with name '${name}' already exists.`);
    }

    for (const [key, value] of Object.entries(schema)) {
      params[Swagger.buildQuerySchemaName(name, options?.prefix, key)] = {
        name: key,
        in: 'query',
        ...value,
      };
    }

    appendObject(this.openAPI.components.parameters, params);
  }

  getQuerySchema(name: string, options?: IEditSchemaOptions) {
    const schemaBaseName = Swagger.buildQuerySchemaName(name, options?.prefix);

    return Object.keys(this.openAPI.components.parameters)
      .filter((key) => key.startsWith(schemaBaseName))
      .map((key) => ({ $ref: `#/components/parameters/${key}` }));
  }

  getSecurity(name: string, actions: string[] = []): OpenAPI.SecurityRequirementObject | undefined {
    const r = Object.keys(this.openAPI.components.securitySchemes).find((k) => k === name);
    if (r) return { [r]: actions };
    return undefined;
  }

  async build() {
    try {
      await SwaggerParser.validate(this.openAPI, {
        validate: { spec: false },
      });

      return this.openAPI;
    } catch (error) {
      logger.error(error as Error);
      return null;
    }
  }
}
