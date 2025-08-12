import { type SchemaTypeDefinition } from 'sanity';
import project from './schemas/project';
import message from './schemas/message';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, message],
};