import React from "react";

export default function AuthBackground({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/auth-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div>
                {children}
            </div>
        </div>
    );
}
