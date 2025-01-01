import { createAction, Property } from '@activepieces/pieces-framework';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { auth } from '../../index';

export const getEmployee = createAction({
  auth: auth,
  name: 'getEmployee',
  displayName: 'Load Employee',
  description: 'Loads employee info from Sidra',
  props: {
    id: Property.Dropdown({
      displayName: 'Employee',
      required: true,
      refreshOnSearch: true,
      refreshers: [],
      options: async ({ auth }, { searchValue }) => {
        const { apiKey, domain } = auth as any;

        if (!auth) {
          return {
            disabled: true,
            options: [],
            placeholder: 'Please authenticate first',
          };
        }

        const query = `
          query ($searchTerm: String) {
            employee {
              list(
                where: {
                  and: [
                    { isArchived: { eq: false } }
                    { category: { in: [PROVIDER, STAFF] } }
                    { statusId: { in: [ACTIVE, DRAFT] } }
                    {
                      or: [
                        { name: { contains: $searchTerm } }
                        { email: { contains: $searchTerm } }
                        { workEmail: { contains: $searchTerm } }
                        { phone: { contains: $searchTerm } }
                        { phoneExtension: { contains: $searchTerm } }
                        {
                          positions: {
                            some: { title: { name: { contains: $searchTerm } } }
                          }
                        }
                      ]
                    }
                  ]
                }
                order: [{ name: ASC }]
              ) {
                items {
                  id
                  name
                  imageUrl
                }
                totalCount
              }
            }
          }
        `
         
        const employees = (
          await httpClient.sendRequest<any>(
            {
              method: HttpMethod.POST,
              body: {
                query: query,
                variables: {
                  searchTerm: searchValue || '',
                }
              },
              url: `${domain}/graphql/employee`,
              headers: {
                Authorization: apiKey,
              },
            }
          )
        ).body.data.employee.list.items;

        return {
          disabled: false,
          options: employees.map((employee: { id: string; name: string }) => {
            return {
              label: employee.name,
              value: employee.id,
            };
          }),
        };
      },
    })
  },
  async run(context) {
    const { apiKey, domain } = context.auth as any;

    const res = await httpClient.sendRequest<string[]>({
      method: HttpMethod.POST,
      body: {
        query: `
        query {
          employee {
            byId(id: ${context.propsValue.id}) {
              name
              phone
              country
              workEmail
            }
          }
        }
        `,
      },
      url: `${domain}/graphql/employee`,
      headers: {
        Authorization: apiKey,
      },
    });
    return res.body;
  },
});
