
import { createTrigger, TriggerStrategy } from '@activepieces/pieces-framework';

export const employeeCreated = createTrigger({
    // auth: check https://www.activepieces.com/docs/developers/piece-reference/authentication,
    name: 'employeecreated',
    displayName: 'EmployeeCreated',
    description: 'Employee has been created',
    props: {},
    sampleData: {},
    type: TriggerStrategy.WEBHOOK,
    async onEnable(context){
        // implement webhook creation logic
    },
    async onDisable(context){
        // implement webhook deletion logic
    },
    async run(context){
        return [context.payload.body]
    }
})