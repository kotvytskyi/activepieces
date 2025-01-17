
import { createPiece, PieceAuth, Property } from "@activepieces/pieces-framework";
import { getEmployee, getEmployees } from "./lib/actions/get-employee";
import { createTask } from "./lib/actions/create-task";
import { employeeCreated } from "./lib/triggers/employee-created";

export const auth = PieceAuth.CustomAuth({
  description: 'Please refer to this guide to get your api credentials: https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account',
  required: true,
  props: {
    apiKey: PieceAuth.SecretText({
      displayName: 'API token',
      required: true,
      description: 'API token for bearer auth',
    }),
    domain: Property.ShortText({
      displayName: 'Sidra Domain',
      required: true,
      description: 'Example value - https://cider-hr-development.azurewebsites.net',
    }),
  },
});

export const sidra = createPiece({
  displayName: "Sidra",
  auth: auth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: "https://cider-hr-development.azurewebsites.net/assets/images/logo-icon.png",
  authors: [],
  actions: [getEmployee, getEmployees, createTask],
  triggers: [employeeCreated],
});
