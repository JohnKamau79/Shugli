import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    amount: 0,
    description: "A simple way to get started.",
    features: [
      {
        name: "Basic access",
        description: "Explore the core features and get started.",
      },
      {
        name: "Limited listings",
        description: "View a limited selection of available opportunities.",
      },
      {
        name: "Email support",
        description: "Get help with common questions by email.",
      },
    ],
  },
  {
    name: "Pro",
    amount: 1500,
    description: "More tools and access for active users.",
    features: [
      {
        name: "Full access",
        description: "Use all standard platform features.",
      },
      {
        name: "Unlimited listings",
        description: "Browse all available opportunities without limits.",
      },
      {
        name: "Priority support",
        description: "Get faster assistance when you need help.",
      },
    ],
  },
  {
    name: "Elite",
    amount: 3500,
    description: "The complete experience with premium support.",
    features: [
      {
        name: "Premium access",
        description: "Get access to all platform features and premium tools.",
      },
      {
        name: "Early access",
        description:
          "See new opportunities and features as soon as they launch.",
      },
      {
        name: "Dedicated support",
        description: "Receive personalized help with your account.",
      },
    ],
  },
];

export default function PlatformPricing() {
  return (
    <section className="mt-15">
      <h2 className="text-center font-heading text-4xl font-extrabold text-primary mb-20">
        Platform Pricing
      </h2>
      <div className="flex flex-wrap justify-evenly">
        {plans.map((plan) => {
          const isStarter = plan.name === "Starter";
          const isPro = plan.name === "Pro";

          return (
            <div
              key={plan.name}
              className={` font-medium border rounded-2xl p-3 shadow-xl min-w-[30%] max-w-[30%] min-h-[30%] max-h-[30%]${
                isStarter
                  ? "border-accent shadow-accent bg-accent/10"
                  : isPro
                    ? "border-primary shadow-primary bg-primary/10"
                    : "border-border shadow-foreground bg-foreground/30"
              }`}
            >
              <h1
                className={` font-semibold font-sans text-xl ${isStarter ? "text-accent" : isPro ? "text-primary" : "text-foreground"}`}
              >
                {plan.name}
              </h1>
              <p className="text-sm text-foreground/60 mb-1 ">
                {plan.description}
              </p>
              <p
                className={`font-semibold mb-4 ${isStarter ? "text-accent/90" : isPro ? "text-primary/90" : "text-foreground/60"}`}
              >
                KSH{" "}
                <span className="text-3xl font-bold">
                  {plan.amount.toLocaleString()}
                </span>
                /Month
              </p>
              {plan.features.map((feature) => (
                <div key={feature.name}>
                  <div
                    className={` flex  justify-between items-center gap-10 mb-2  pb-2 border-b  ${isStarter ? "border-accent/30" : isPro ? "border-primary/30" : "border-foreground/30"}`}
                  >
                    <div className="flex gap-2">
                      <Check
                        className={` ${isStarter ? "text-accent/90" : isPro ? "text-primary/90" : "text-foreground/60"}`}
                      />
                      <span>{feature.name}</span>
                    </div>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
              <button
                className={`m-auto block font-semibold px-5 p-2 rounded-xl my-5 mt-7 ${isStarter ? "bg-accent transition-all duration-300 hover:bg-accent/80 text-accent-foreground" : isPro ? "bg-primary transition-all duration-300 hover:bg-primary/80 text-primary-foreground" : "bg-foreground transition-all duration-300 hover:bg-foreground/60 text-background"}`}
              >
                Choose {plan.name}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
