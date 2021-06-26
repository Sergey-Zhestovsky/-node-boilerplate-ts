/* eslint-disable @typescript-eslint/naming-convention */

import { OpenAPIV2 as APIV2 } from 'openapi-types';

declare namespace OpenAPIV2 {
  interface ResponsesObject {
    [index: string]: APIV2.Response | undefined;
    default?: APIV2.Response;
  }
}
