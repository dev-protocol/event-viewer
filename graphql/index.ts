import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos"
//import { config } from "./config"


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
	context.log('HTTP trigger function processed a request.');
	context.log(req.query.name);
	const name = (req.query.name || (req.body && req.body.query));
	// const endpoint = config.endpoint
	// const key = config.key
	// const client = new CosmosClient({ endpoint, key })


    if (name) {
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: "Hello " + (req.query.name || req.body.query)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};

export default httpTrigger;
