import { rootSchema, schema } from './schema';

describe('server.graphql.schema', () => {
  it('should have rootSchema', () => {
    expect(rootSchema).toBeTruthy();
  });

  it('should have schema', () => {
    expect(schema).toBeTruthy();
  });
});
