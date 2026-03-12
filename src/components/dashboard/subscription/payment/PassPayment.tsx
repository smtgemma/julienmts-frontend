"use client";
import { useState } from "react";
import {
    X,
    Loader2,
    CreditCard,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";
import {
    useElements,
    useStripe,
    PaymentElement,
    Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { usePaymentMethodMutation, useSubscriptionMutation } from "@/redux/api/subscriptionApi/subscriptionApi";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PassPaymentProps {
    planId: string;
    onClose: () => void;
}

function PaymentForm({ planId, onClose }: PassPaymentProps) {
    const stripe = useStripe();
    const elements = useElements();

    const [cardError, setCardError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const [createPaymentMethod, { isLoading }] = usePaymentMethodMutation();
    const [subscriptionPayment, { isLoading: payLoading }] = useSubscriptionMutation();

    const handlePay = async () => {
        if (!stripe || !elements || !planId) return;
        setCardError(null);

        const { error: submitError } = await elements.submit();
        if (submitError) {
            setCardError(submitError.message ?? "Please check your card details.");
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({ elements });
        console.log(paymentMethod, "==============================>=========dfdsfdsfd=========>");

        const payload = {
            type: paymentMethod?.type,
            "card[number]": paymentMethod?.card?.last4,
            "card[exp_month]": paymentMethod?.card?.exp_month,
            "card[exp_year]": paymentMethod?.card?.exp_year,
            "card[cvc]": "123"
        };
        console.log(payload, "=============payload")

        if (error) {
            setCardError(error.message ?? "Card error. Please try again.");
            return;
        }
        try {
            // const res = await createPaymentMethod(payload).unwrap();
            // console.log(res, "=================res")
            const res = await fetch("https://api.stripe.com/v1/payment_methods", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            console.log(res, "res===============res")


            const response = await subscriptionPayment({ planId, paymentMethodId: paymentMethod.id }).unwrap();
            console.log(response, "==================> ")
            setIsSuccess(true);
        } catch (err: any) {
            setCardError(err?.data?.message ?? "Payment failed. Please try again.");
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    if (isSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={handleBackdropClick}>
                <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white px-8 py-12 shadow-2xl text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-[#1D1D1D]">Payment Successful!</h2>
                    <p className="text-sm text-gray-500">Your subscription has been activated.</p>
                    <button onClick={onClose} className="mt-2 w-full rounded-xl bg-[#DC3C3C] py-3 text-sm font-semibold text-white hover:opacity-90">
                        Done
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm" onClick={handleBackdropClick}>
            <div className="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl overflow-hidden" style={{ maxHeight: "90vh" }}>

                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-[#DC3C3C]" />
                        <h2 className="text-lg font-bold text-[#1D1D1D]">Complete Purchase</h2>
                    </div>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
                    <p className="text-sm font-medium text-gray-700">Payment Details</p>
                    <PaymentElement options={{ layout: "tabs" }} />

                    {cardError && (
                        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                            <p className="text-xs text-red-600 font-medium">{cardError}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex flex-shrink-0 flex-col gap-3 border-t border-gray-100 px-6 py-4">
                    <button
                        onClick={handlePay}
                        disabled={payLoading || !stripe || !elements}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6E51E0] py-3.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {payLoading ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                        ) : (
                            <><CreditCard className="h-4 w-4" /> Subscribe</>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Secured by Stripe · Your card info is never stored
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PassPayment({ planId, onClose }: PassPaymentProps) {
    return (
        <Elements
            stripe={stripePromise}
            options={{
                mode: "payment",
                amount: 1000,        // ← set a default or pass as prop if needed
                currency: "usd",
                paymentMethodCreation: "manual",
                paymentMethodTypes: ["card"],
            }}
        >
            <PaymentForm planId={planId} onClose={onClose} />
        </Elements>
    );
}