import { createAction, Property } from '@activepieces/pieces-framework';
import { auth } from '../../index';
import { httpClient, HttpMethod } from '@activepieces/pieces-common';
import { employeeSelector } from './get-employee';

export const createTask = createAction({
  auth: auth,
  name: 'createTask',
  displayName: 'Create Task',
  description: 'Create a general task',
  props: {
    title: Property.ShortText({
      displayName: 'Title',
      description: 'Title of the task',
      required: true,
    }),
    description: Property.ShortText({
      displayName: 'Description',
      description: 'Description of the task',
      required: true,
    }),
    employeeId: employeeSelector
  },
  async run(context) {
    const { apiKey, domain } = context.auth as any;

    const formData = new FormData();

    formData.append("summary", context.propsValue.title);
    formData.append("description", context.propsValue.description);
    formData.append("type[id]", '1');
    formData.append("type[name]", "General");
    formData.append("type[defaultPriority]", '3');
    formData.append("status[id]", '1');
    formData.append("assignee[id]", `${context.propsValue.employeeId}`);
    formData.append("reporter[id]", '12');
    formData.append("reporter[name]", "John Don");
    
    const task = await httpClient.sendRequest<any>({
      method: HttpMethod.POST,
      url: `${domain}/api/tasks`,
      headers: {
        Authorization: apiKey,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    return task.body;
  },
});
