import { AzureFunction, Context } from "@azure/functions"
import { EventSaver } from "common/base"



class CreateSaver extends EventSaver {
	getBatchName(): string {
		return "policy factory create"
	}
}



const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
	const saver = new CreateSaver(context, myTimer)
	await saver.execute()

    var startTimeStamp = new Date().toISOString();

    if (myTimer.IsPastDue)
    {


        context.log('Timer function is running late!');
    }
    context.log('Timer trigger function ran!', startTimeStamp);
};

export default timerTrigger;
