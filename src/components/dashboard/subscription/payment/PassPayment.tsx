"use client";
import { useState } from "react";
import { X, Loader2, CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import { useElements, useStripe, PaymentElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSubscriptionMutation } from "@/redux/api/subscriptionApi/subscriptionApi";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PassPaymentProps {
    planId: string;
    planPrice: number;
    onClose: () => void;
}

// ── Shared success screen ──────────────────────────────
function SuccessScreen({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white px-8 py-12 shadow-2xl text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-[#1D1D1D]">Subscription Activated!</h2>
                <p className="text-sm text-gray-500">Your plan has been successfully activated.</p>
                <button
                    onClick={onClose}
                    className="mt-2 w-full rounded-xl bg-[#6E51E0] py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                    Done
                </button>
            </div>
        </div>
    );
}

// ── FREE PLAN FORM — no Stripe hooks ──────────────────
function FreeForm({ planId, onClose }: { planId: string; onClose: () => void }) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [subscriptionPayment, { isLoading }] = useSubscriptionMutation();

    const handleSubscribe = async () => {
        setError(null);
        try {
            // Free plan — no paymentMethodId
            await subscriptionPayment({ planId }).unwrap();
            setIsSuccess(true);
        } catch (err: any) {
            setError(err?.data?.message ?? "Subscription failed. Please try again.");
        }
    };

    if (isSuccess) return <SuccessScreen onClose={onClose} />;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <h2 className="text-lg font-bold text-[#1D1D1D]">Free Subscription</h2>
                    </div>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-8 flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="h-7 w-7 text-green-600" />
                    </div>
                    <p className="text-base font-semibold text-gray-800">This is a free plan</p>
                    <p className="text-sm text-gray-400">No payment required. Click below to activate your free subscription.</p>
                    {error && (
                        <div className="w-full rounded-lg bg-red-50 border border-red-200 px-4 py-3 mt-1">
                            <p className="text-xs text-red-600 font-medium">{error}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 px-6 py-4">
                    <button
                        onClick={handleSubscribe}
                        disabled={isLoading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6E51E0] py-3.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Activating…</>
                            : <><CheckCircle2 className="h-4 w-4" /> Activate Free Plan</>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── PAID PLAN FORM — must be inside Elements ──────────
function PaidForm({ planId, onClose }: { planId: string; onClose: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
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
        if (error) {
            setCardError(error.message ?? "Card error. Please try again.");
            return;
        }

        try {
            // Paid plan — include paymentMethodId
            const response = await subscriptionPayment({
                planId,
                paymentMethodId: paymentMethod.id,
            }).unwrap();
            console.log(response, "paid subscription =>");
            setIsSuccess(true);
        } catch (err: any) {
            setCardError(err?.data?.message ?? "Payment failed. Please try again.");
        }
    };

    if (isSuccess) return <SuccessScreen onClose={onClose} />;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl overflow-hidden" style={{ maxHeight: "90vh" }}>
                {/* Header */}
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-[#6E51E0]" />
                        <h2 className="text-lg font-bold text-[#1D1D1D]">Complete Purchase</h2>
                    </div>
                    <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
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
                        {payLoading
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                            : <><CreditCard className="h-4 w-4" /> Subscribe</>
                        }
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

// ── DEFAULT EXPORT — routes to correct form ────────────
export default function PassPayment({ planId, planPrice, onClose }: PassPaymentProps) {
    // Free plan — render FreeForm directly (no Stripe hooks)
    if (planPrice === 0) {
        return <FreeForm planId={planId} onClose={onClose} />;
    }

    // Paid plan — wrap PaidForm in Elements provider
    return (
        <Elements
            stripe={stripePromise}
            options={{
                mode: "payment",
                amount: Math.round(planPrice * 100), // in cents
                currency: "usd",
                paymentMethodCreation: "manual",
                paymentMethodTypes: ["card"],
            }}
        >
            <PaidForm planId={planId} onClose={onClose} />
        </Elements>
    );
}
