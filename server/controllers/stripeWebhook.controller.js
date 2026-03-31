import stripe from "../config/stripe.js";
import User from "../models/user.model.js";

export const stripeWebhook=async (req,res) => {
    const sig=req.headers["stripe-signature"]
    let event;
    try {
        event=stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        console.log(error)
        return res.status(400).json({message:"invalid webhook signature"})
    }

    try {
        if(event.type==="checkout.session.completed"){
            const session=event.data.object
            const userId=session?.metadata?.userId
            const credits=Number(session?.metadata?.credits)
            const plan=session?.metadata?.plan

            if(userId && Number.isFinite(credits) && credits>0 && plan){
                await User.findByIdAndUpdate(
                    userId,
                    {
                        $inc:{credits: credits},
                        $set:{plan}
                    },
                    { new: false }
                )
            } else {
                console.log("stripe webhook missing/invalid metadata", {
                    userId,
                    credits,
                    plan
                })
            }
        }
    } catch (error) {
        console.log("stripe webhook handler error", error)
        // still return 200 so Stripe doesn't keep retrying forever on our internal errors
    }

    return res.json({received:true})


}
